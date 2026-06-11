import asyncio
import random
import time
from collections.abc import AsyncIterator
from typing import Any

import structlog
from openai import AsyncOpenAI

from app.core.config import settings
from app.db.repositories import ConversationRepository
from app.schemas import ChatRequest
from app.services.agentguard_service import agentguard_service
from app.services.rag_service import rag_service

logger = structlog.get_logger()

DEMO_RESPONSE = (
    "Demo mode is active, so no patient text was sent to an external model. "
    "Configure OpenAI and AgentGuard credentials, then create the `AI Doctor` "
    "chat prompt in AgentGuard with a production label to enable traced responses."
)


class ChatService:
    def __init__(self, repository: ConversationRepository) -> None:
        self.repository = repository
        self.openai = (
            AsyncOpenAI(api_key=settings.openai_api_key) if settings.openai_api_key else None
        )

    async def stream(self, request: ChatRequest) -> AsyncIterator[str]:
        if not settings.live_ai_enabled or not self.openai:
            for word in DEMO_RESPONSE.split():
                yield word + " "
                await asyncio.sleep(0.025)
            return

        started = time.perf_counter()
        output_parts: list[str] = []
        label = (
            settings.prompt_label_a
            if random.randrange(100) < settings.experiment_split
            else settings.prompt_label_b
        )

        with agentguard_service.trace(
            name="doctor-chat",
            user_input=request.message,
            session_id=request.session_id,
            user_id=request.user_id,
        ) as root_span:
            prompt = await agentguard_service.get_prompt(label=label)
            with agentguard_service.client.start_as_current_observation(
                as_type="retriever", name="medical-knowledge-retrieval"
            ) as retrieval:
                chunks = await rag_service.retrieve(request.message)
                retrieval.update(
                    input=request.message,
                    output=[
                        {"source": chunk.source, "score": chunk.score} for chunk in chunks
                    ],
                )

            rag_context = "\n\n".join(
                f"[{chunk.source} | similarity {chunk.score:.2f}]\n{chunk.content}"
                for chunk in chunks
            ) or "No matching knowledge-base context was retrieved."
            messages = prompt.compile(
                symptoms=request.message,
                patient_message=request.message,
                rag_context=rag_context,
                chat_history="No prior messages in this request.",
            )

            with agentguard_service.client.start_as_current_observation(
                as_type="generation",
                name="openai-doctor-response",
                model=settings.openai_model,
                model_parameters={"temperature": 0.2},
                input=messages,
                metadata={
                    "prompt_name": prompt.name,
                    "prompt_version": prompt.version,
                    "prompt_labels": prompt.labels,
                },
            ) as generation:
                stream = await self.openai.chat.completions.create(
                    model=settings.openai_model,
                    messages=messages,
                    temperature=0.2,
                    stream=True,
                    stream_options={"include_usage": True},
                )
                usage: Any | None = None
                async for event in stream:
                    if event.usage:
                        usage = event.usage
                    text = event.choices[0].delta.content if event.choices else None
                    if text:
                        output_parts.append(text)
                        yield text

                output = "".join(output_parts)
                usage_details = None
                if usage:
                    usage_details = {
                        "input": usage.prompt_tokens,
                        "output": usage.completion_tokens,
                        "total": usage.total_tokens,
                    }
                generation.update(output=output, usage_details=usage_details)
                trace_id = generation.trace_id
                generation_id = generation.id

            latency_ms = int((time.perf_counter() - started) * 1000)
            if root_span:
                root_span.update(
                    output=output,
                    metadata={
                        "prompt_label": label,
                        "prompt_version": prompt.version,
                        "generation_id": generation_id,
                    },
                )
                root_span.set_trace_io(input=request.message, output=output)

            await self.repository.create(
                session_id=request.session_id,
                user_id=request.user_id,
                user_input=request.message,
                ai_output=output,
                trace_id=trace_id,
                prompt_version=prompt.version,
                model=settings.openai_model,
                latency_ms=latency_ms,
                input_tokens=getattr(usage, "prompt_tokens", 0) if usage else 0,
                output_tokens=getattr(usage, "completion_tokens", 0) if usage else 0,
                cost_usd=0,
            )
            logger.info(
                "chat_completed",
                trace_id=trace_id,
                prompt_version=prompt.version,
                latency_ms=latency_ms,
            )
            agentguard_service.client.flush()

import asyncio
from contextlib import contextmanager
from dataclasses import dataclass
import os
import time
from typing import Any, Iterator
from urllib.parse import quote

import httpx
import structlog

from app.core.config import settings

logger = structlog.get_logger()


@dataclass(frozen=True)
class AgentGuardPrompt:
    name: str
    version: int
    prompt: str
    labels: list[str]
    config: dict[str, Any]

    def compile(self, **variables: str) -> list[dict[str, str]]:
        compiled = self.prompt
        for name, value in variables.items():
            compiled = compiled.replace(f"{{{{{name}}}}}", value)
        return [{"role": "system", "content": compiled}]


class AgentGuardService:
    def __init__(self) -> None:
        self.enabled = bool(
            settings.observability_public_key and settings.observability_secret_key
        )
        self.client: Any | None = None
        self._prompt_cache: dict[
            tuple[str, str | None, int | None], tuple[float, AgentGuardPrompt]
        ] = {}
        self._prompt_cache_lock = asyncio.Lock()
        if self.enabled:
            from langfuse import get_client

            # The tracing client reads these protocol-level environment names.
            os.environ["LANGFUSE_PUBLIC_KEY"] = settings.observability_public_key or ""
            os.environ["LANGFUSE_SECRET_KEY"] = settings.observability_secret_key or ""
            os.environ["LANGFUSE_BASE_URL"] = settings.observability_base_url
            self.client = get_client()

    async def get_prompt(
        self, *, label: str | None = None, version: int | None = None
    ) -> AgentGuardPrompt:
        if not self.enabled:
            raise RuntimeError("AgentGuard credentials are required for runtime prompts.")
        cache_key = (settings.prompt_name, label, version)
        cached = self._prompt_cache.get(cache_key)
        now = time.monotonic()
        if cached and cached[0] > now:
            return cached[1]

        async with self._prompt_cache_lock:
            cached = self._prompt_cache.get(cache_key)
            now = time.monotonic()
            if cached and cached[0] > now:
                return cached[1]

            prompt = await self._fetch_prompt(label=label, version=version)
            self._prompt_cache[cache_key] = (
                now + settings.agentguard_prompt_cache_ttl_seconds,
                prompt,
            )
            return prompt

    async def _fetch_prompt(
        self, *, label: str | None = None, version: int | None = None
    ) -> AgentGuardPrompt:
        query = f"name={quote(settings.prompt_name, safe='')}"
        if version is not None:
            query += f"&version={version}"
        elif label:
            query += f"&label={quote(label, safe='')}"

        async with httpx.AsyncClient(
            base_url=settings.observability_base_url,
            auth=(
                settings.observability_public_key or "",
                settings.observability_secret_key or "",
            ),
            timeout=10,
        ) as client:
            response = await client.get(f"/api/public/prompts?{query}")
            response.raise_for_status()
            data = response.json()

        return AgentGuardPrompt(
            name=data["name"],
            version=data["version"],
            prompt=data["prompt"],
            labels=data.get("labels", []),
            config=data.get("config", {}),
        )

    @contextmanager
    def trace(
        self, *, name: str, user_input: str, session_id: str, user_id: str | None
    ) -> Iterator[Any | None]:
        if not self.client:
            yield None
            return
        with self.client.start_as_current_observation(
            as_type="span",
            name=name,
            input=user_input,
            metadata={
                "application": "medtrace-ai",
                "session_id": session_id,
                "user_id": user_id,
                "tags": ["medical", "rag", settings.environment],
            },
        ) as span:
            span.set_trace_io(input=user_input)
            yield span

    def score(self, trace_id: str, value: float, comment: str | None) -> None:
        if not self.client:
            return
        try:
            self.client.create_score(
                trace_id=trace_id,
                name="user-feedback",
                value=value,
                comment=comment,
                data_type="NUMERIC",
            )
        except Exception:
            logger.exception("agentguard_score_failed", trace_id=trace_id)


agentguard_service = AgentGuardService()

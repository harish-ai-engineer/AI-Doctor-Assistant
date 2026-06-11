from contextlib import contextmanager
from typing import Any, Iterator

import structlog

from app.core.config import settings

logger = structlog.get_logger()


class LangfuseService:
    def __init__(self) -> None:
        self.enabled = bool(settings.langfuse_public_key and settings.langfuse_secret_key)
        self.client: Any | None = None
        if self.enabled:
            from langfuse import get_client

            self.client = get_client()

    def get_prompt(self, label: str) -> Any:
        if not self.client:
            raise RuntimeError("Langfuse credentials are required for runtime prompts.")
        return self.client.get_prompt(
            settings.langfuse_prompt_name,
            label=label,
            type="chat",
            cache_ttl_seconds=60,
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
        ) as span:
            span.update_trace(
                session_id=session_id,
                user_id=user_id,
                input=user_input,
                tags=["medical", "rag", settings.environment],
                metadata={"application": "medtrace-ai"},
            )
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
            logger.exception("langfuse_score_failed", trace_id=trace_id)


langfuse_service = LangfuseService()

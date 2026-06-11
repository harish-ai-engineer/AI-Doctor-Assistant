from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

PROJECT_ROOT = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    app_name: str = "MedTrace AI API"
    environment: str = "development"
    debug: bool = False
    api_prefix: str = "/api/v1"
    secret_key: str = "change-me-in-production"
    access_token_expire_minutes: int = 60
    database_url: str = "sqlite+aiosqlite:///./medtrace.db"
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    openai_api_key: str | None = None
    openai_model: str = "gpt-4o"
    embedding_model: str = "text-embedding-3-small"

    agentguard_public_key: str | None = None
    agentguard_secret_key: str | None = None
    agentguard_base_url: str | None = None
    agentguard_prompt_name: str | None = None
    agentguard_prompt_cache_ttl_seconds: int = 60

    prompt_label_a: str = "production"
    prompt_label_b: str = "latest"
    experiment_split: int = 50

    chroma_host: str | None = None
    chroma_port: int = 8001
    chroma_path: str = "./chroma_data"
    chroma_collection: str = "medical_knowledge"

    model_config = SettingsConfigDict(
        env_file=(PROJECT_ROOT / ".env", ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]

    @property
    def observability_public_key(self) -> str | None:
        return self.agentguard_public_key

    @property
    def observability_secret_key(self) -> str | None:
        return self.agentguard_secret_key

    @property
    def observability_base_url(self) -> str:
        return self.agentguard_base_url or "http://localhost:3001"

    @property
    def prompt_name(self) -> str:
        return self.agentguard_prompt_name or "AI Doctor"

    @property
    def live_ai_enabled(self) -> bool:
        return bool(
            self.openai_api_key
            and self.observability_public_key
            and self.observability_secret_key
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

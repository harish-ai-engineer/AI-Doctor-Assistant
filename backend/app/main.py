from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import router
from app.core.config import settings
from app.core.logging import configure_logging
from app.db.base import init_db
from app.services.langfuse_service import langfuse_service

configure_logging()


@asynccontextmanager
async def lifespan(_: FastAPI):
    await init_db()
    yield
    if langfuse_service.client:
        langfuse_service.client.flush()


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="AI engineering learning platform with Langfuse observability.",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router, prefix=settings.api_prefix)

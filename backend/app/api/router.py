import os
import tempfile
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_db, optional_user
from app.core.config import settings
from app.core.security import create_access_token
from app.db.repositories import ConversationRepository, FeedbackRepository
from app.schemas import ChatRequest, ExperimentUpdate, FeedbackRequest, LoginRequest, TokenResponse
from app.services.chat_service import ChatService
from app.services.langfuse_service import langfuse_service
from app.services.rag_service import rag_service

router = APIRouter()


@router.get("/health")
async def health() -> dict[str, object]:
    return {
        "status": "healthy",
        "environment": settings.environment,
        "live_ai": settings.live_ai_enabled,
        "langfuse": langfuse_service.enabled,
    }


@router.post("/auth/login", response_model=TokenResponse)
async def login(payload: LoginRequest) -> TokenResponse:
    if payload.email != "admin@medtrace.dev" or payload.password != "medtrace-demo":
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return TokenResponse(access_token=create_access_token(payload.email))


@router.post("/chat/stream")
async def chat_stream(
    payload: ChatRequest,
    session: AsyncSession = Depends(get_db),
    user: str | None = Depends(optional_user),
) -> StreamingResponse:
    payload.user_id = user or payload.user_id
    service = ChatService(ConversationRepository(session))
    return StreamingResponse(service.stream(payload), media_type="text/plain")


@router.post("/evaluations/feedback")
async def feedback(
    payload: FeedbackRequest,
    session: AsyncSession = Depends(get_db),
    user: str | None = Depends(optional_user),
) -> dict[str, object]:
    record = await FeedbackRepository(session).create(
        trace_id=payload.trace_id,
        user_id=user or payload.user_id,
        value=payload.value,
        comment=payload.comment,
    )
    langfuse_service.score(payload.trace_id, payload.value, payload.comment)
    return {"id": record.id, "sent_to_langfuse": langfuse_service.enabled}


@router.get("/analytics/dashboard")
async def dashboard(session: AsyncSession = Depends(get_db)) -> dict[str, object]:
    totals = await ConversationRepository(session).totals()
    return {
        **totals,
        "prompt_versions": 12,
        "satisfaction": 92.4,
        "mode": "live" if settings.live_ai_enabled else "demo",
    }


@router.get("/traces")
async def traces(session: AsyncSession = Depends(get_db)) -> list[dict[str, object]]:
    records = await ConversationRepository(session).recent()
    return [
        {
            "id": item.trace_id,
            "query": item.user_input,
            "prompt_version": item.prompt_version,
            "model": item.model,
            "latency_ms": item.latency_ms,
            "tokens": item.input_tokens + item.output_tokens,
            "cost_usd": item.cost_usd,
            "created_at": item.created_at,
        }
        for item in records
    ]


@router.get("/prompts/{label}")
async def prompt(label: str) -> dict[str, object]:
    if not langfuse_service.enabled:
        return {"name": settings.langfuse_prompt_name, "label": label, "mode": "demo"}
    item = langfuse_service.get_prompt(label)
    return {
        "name": item.name,
        "version": item.version,
        "labels": item.labels,
        "config": item.config,
        "prompt": item.prompt,
    }


@router.put("/experiments")
async def update_experiment(payload: ExperimentUpdate) -> dict[str, object]:
    return {
        "prompt_a_label": payload.prompt_a_label,
        "prompt_b_label": payload.prompt_b_label,
        "traffic_to_a": payload.traffic_to_a,
        "traffic_to_b": 100 - payload.traffic_to_a,
        "note": "Persist this configuration in PostgreSQL for multi-instance deployments.",
    }


@router.post("/knowledge/documents")
async def upload_document(file: UploadFile = File(...)) -> dict[str, object]:
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=415, detail="Only PDF documents are supported")
    file_descriptor, temp_name = tempfile.mkstemp(suffix=".pdf")
    try:
        with os.fdopen(file_descriptor, "wb") as target:
            while chunk := await file.read(1024 * 1024):
                target.write(chunk)
        chunks = await rag_service.ingest_pdf(Path(temp_name), file.filename or "document.pdf")
        return {"filename": file.filename, "chunks": chunks, "status": "indexed"}
    finally:
        Path(temp_name).unlink(missing_ok=True)

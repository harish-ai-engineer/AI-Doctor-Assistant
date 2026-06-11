# MedTrace AI

A production-oriented AI Doctor Assistant and visual learning environment for Langfuse prompt management, tracing, evaluations, A/B testing, RAG, observability, and cost attribution.

![React](https://img.shields.io/badge/React-TypeScript-149ECA)
![FastAPI](https://img.shields.io/badge/FastAPI-Async-009688)
![Langfuse](https://img.shields.io/badge/Langfuse-v4-6C5CE7)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1)

## Features

- Premium responsive healthcare dashboard with dark and light themes
- Streaming GPT-4o conversation UI with medical disclaimer and RAG sources
- Dynamic Langfuse prompts with production and staging labels
- OpenTelemetry-based traces with nested retrieval and generation observations
- Human feedback scores sent to Langfuse
- 50/50 prompt experiments with visible quality and cost comparisons
- PDF ingestion, embeddings, ChromaDB retrieval, and similarity scores
- Async FastAPI, repository/service layers, JWT authentication, and structured logs
- PostgreSQL persistence and Docker Compose deployment
- Safe demo mode when external credentials are not configured

## Quick Start

```bash
cp .env.example .env
docker compose up --build
```

Open:

- Application: `http://localhost:3000`
- FastAPI docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/v1/health`

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`.

## Local Development

Frontend:

```bash
cd frontend
pnpm install
pnpm dev
```

Backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The backend defaults to SQLite and local Chroma persistence outside Docker, so PostgreSQL is not required for the first local run.

## Langfuse Setup

1. Create a Langfuse project and API keys.
2. Set `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`, and the region-specific `LANGFUSE_BASE_URL`.
3. Create a chat prompt named `doctor-assistant`.
4. Add `patient_message`, `rag_context`, and `chat_history` variables.
5. Label one version `production` and another `staging`.
6. Add `OPENAI_API_KEY`, then restart the backend.

See [docs/LANGFUSE_LEARNING_GUIDE.md](docs/LANGFUSE_LEARNING_GUIDE.md) for the complete exercise path.

## Demo Authentication

The API includes a minimal educational JWT flow:

- Email: `admin@medtrace.dev`
- Password: `medtrace-demo`

Replace this demonstration login with a real user repository and password hashes before a public deployment.

## Architecture

```text
frontend/  React, TypeScript, Tailwind, reusable shadcn-style primitives
backend/   FastAPI API, services, repositories, SQLAlchemy models, tests
docker/    Multi-stage images and nginx SPA/API routing
docs/      Langfuse learning exercises and operational notes
```

## Safety

This project is an educational engineering demonstration, not a medical device. It must not diagnose, prescribe, process real protected health information, or replace licensed medical care. A real healthcare deployment requires clinical validation, privacy review, security controls, auditability, data residency decisions, and applicable regulatory compliance.

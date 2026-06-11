from dataclasses import dataclass
from pathlib import Path
from uuid import uuid4

import chromadb
from openai import AsyncOpenAI
from pypdf import PdfReader

from app.core.config import settings


@dataclass
class RetrievedChunk:
    content: str
    source: str
    score: float


class RAGService:
    def __init__(self) -> None:
        self._collection = None
        self.openai = (
            AsyncOpenAI(api_key=settings.openai_api_key) if settings.openai_api_key else None
        )

    @property
    def collection(self):
        if self._collection is not None:
            return self._collection
        if settings.chroma_host:
            client = chromadb.HttpClient(host=settings.chroma_host, port=settings.chroma_port)
        else:
            client = chromadb.PersistentClient(path=settings.chroma_path)
        self._collection = client.get_or_create_collection(
            settings.chroma_collection,
            metadata={"hnsw:space": "cosine"},
        )
        return self._collection

    async def retrieve(self, query: str, limit: int = 3) -> list[RetrievedChunk]:
        if not self.openai or self.collection.count() == 0:
            return []
        embedding = await self.openai.embeddings.create(
            model=settings.embedding_model, input=query
        )
        result = self.collection.query(
            query_embeddings=[embedding.data[0].embedding],
            n_results=min(limit, self.collection.count()),
        )
        documents = result.get("documents", [[]])[0]
        distances = result.get("distances", [[]])[0]
        metadatas = result.get("metadatas", [[]])[0]
        return [
            RetrievedChunk(
                content=document,
                source=str(metadata.get("source", "Unknown source")),
                score=max(0, 1 - distance),
            )
            for document, distance, metadata in zip(documents, distances, metadatas)
        ]

    async def ingest_pdf(self, path: Path, filename: str) -> int:
        if not self.openai:
            raise RuntimeError("OPENAI_API_KEY is required to generate embeddings.")
        text = "\n".join(page.extract_text() or "" for page in PdfReader(path).pages)
        chunks = self._chunk(text)
        embeddings = await self.openai.embeddings.create(
            model=settings.embedding_model, input=chunks
        )
        self.collection.add(
            ids=[str(uuid4()) for _ in chunks],
            embeddings=[item.embedding for item in embeddings.data],
            documents=chunks,
            metadatas=[{"source": filename, "chunk": index} for index in range(len(chunks))],
        )
        return len(chunks)

    @staticmethod
    def _chunk(text: str, size: int = 1800, overlap: int = 220) -> list[str]:
        clean = " ".join(text.split())
        return [
            clean[start : start + size]
            for start in range(0, len(clean), size - overlap)
            if clean[start : start + size].strip()
        ]


rag_service = RAGService()

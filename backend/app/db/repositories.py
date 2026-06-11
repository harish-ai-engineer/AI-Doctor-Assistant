from datetime import datetime, timedelta, timezone

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.base import Conversation, Feedback


class ConversationRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, **values: object) -> Conversation:
        conversation = Conversation(**values)
        self.session.add(conversation)
        await self.session.commit()
        await self.session.refresh(conversation)
        return conversation

    async def recent(self, limit: int = 50) -> list[Conversation]:
        result = await self.session.scalars(
            select(Conversation).order_by(Conversation.created_at.desc()).limit(limit)
        )
        return list(result)

    async def totals(self) -> dict[str, float]:
        since = datetime.now(timezone.utc) - timedelta(days=30)
        result = await self.session.execute(
            select(
                func.count(Conversation.id),
                func.coalesce(func.avg(Conversation.latency_ms), 0),
                func.coalesce(
                    func.sum(Conversation.input_tokens + Conversation.output_tokens), 0
                ),
                func.coalesce(func.sum(Conversation.cost_usd), 0),
            ).where(Conversation.created_at >= since)
        )
        count, latency, tokens, cost = result.one()
        return {
            "conversations": float(count),
            "avg_latency_ms": float(latency),
            "tokens": float(tokens),
            "cost": float(cost),
        }


class FeedbackRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, **values: object) -> Feedback:
        feedback = Feedback(**values)
        self.session.add(feedback)
        await self.session.commit()
        await self.session.refresh(feedback)
        return feedback

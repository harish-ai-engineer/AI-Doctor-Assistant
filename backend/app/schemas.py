from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(min_length=2, max_length=4000)
    session_id: str = Field(min_length=8, max_length=80)
    user_id: str | None = None


class FeedbackRequest(BaseModel):
    trace_id: str
    value: float = Field(ge=0, le=1)
    comment: str | None = Field(default=None, max_length=1000)
    user_id: str | None = None


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ExperimentUpdate(BaseModel):
    prompt_a_label: str = "production"
    prompt_b_label: str = "staging"
    traffic_to_a: int = Field(default=50, ge=0, le=100)

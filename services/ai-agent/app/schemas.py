from typing import Literal

from pydantic import BaseModel, Field

Role = Literal["user", "assistant"]


class Turn(BaseModel):
    role: Role
    content: str


class ChatRequest(BaseModel):
    message: str = Field(min_length=1)
    history: list[Turn] = Field(default_factory=list)


class ChatResponse(BaseModel):
    id: str
    reply: str

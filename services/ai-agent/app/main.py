from fastapi import FastAPI

from .agent import generate_reply
from .schemas import ChatRequest, ChatResponse

app = FastAPI(title="MOL AI Agent")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    return await generate_reply(request)

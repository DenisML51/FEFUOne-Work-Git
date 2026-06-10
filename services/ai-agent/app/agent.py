import uuid

from .schemas import ChatRequest, ChatResponse

_STUB = (
    "Это демонстрационный ответ ИИ-ассистента МОЛ. "
    "Здесь будет анализ остатков, актов и инвентаризаций на базе ваших данных."
)


async def generate_reply(request: ChatRequest) -> ChatResponse:
    return ChatResponse(
        id=str(uuid.uuid4()),
        reply=f"{_STUB}\n\nЗапрос: «{request.message}»",
    )

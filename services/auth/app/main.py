from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="MOL Auth")


class Session(BaseModel):
    user_id: str
    name: str
    role: str


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/session", response_model=Session)
async def session() -> Session:
    return Session(user_id="u-001", name="Иван", role="mol")

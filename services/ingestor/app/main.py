import uuid

from fastapi import FastAPI

from .config import settings
from .schemas import IngestRequest, IngestRun

app = FastAPI(title="MOL Ingestor")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/runs", response_model=IngestRun)
async def trigger(request: IngestRequest) -> IngestRun:
    return IngestRun(
        run_id=f"manual__{uuid.uuid4()}",
        dag_id=request.dag_id or settings.default_dag_id,
        status="queued",
    )


@app.get("/runs/{run_id}", response_model=IngestRun)
async def status(run_id: str) -> IngestRun:
    return IngestRun(
        run_id=run_id,
        dag_id=settings.default_dag_id,
        status="running",
    )

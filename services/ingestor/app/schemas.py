from typing import Literal

from pydantic import BaseModel, Field

RunStatus = Literal["queued", "running", "success", "failed"]


class IngestRequest(BaseModel):
    source: str = Field(min_length=1)
    dag_id: str | None = None


class IngestRun(BaseModel):
    run_id: str
    dag_id: str
    status: RunStatus

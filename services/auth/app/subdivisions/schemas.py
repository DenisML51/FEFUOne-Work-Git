from pydantic import BaseModel


class SubdivisionResponse(BaseModel):
    id: int
    title: str
    parent_id: int | None = None
    level: int | None = None
    is_active: bool = True

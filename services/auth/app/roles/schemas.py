from pydantic import BaseModel


class RoleResponse(BaseModel):
    id: int
    title: str
    description: str | None = None
    show_subdivision_inventory: bool = True
    permission_ids: list[int] = []
    permissions: dict[str, list[str]] = {}

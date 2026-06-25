from datetime import datetime

from pydantic import BaseModel

from app.roles.schemas import RoleResponse
from app.subdivisions.schemas import SubdivisionResponse


class RoleConfigResponse(BaseModel):
    config_id: int
    role: RoleResponse
    subdivision: SubdivisionResponse | None = None


class UserResponse(BaseModel):
    id: int
    email: str | None = None
    full_name: str
    photo_link: str | None = None
    amelia_id: int | None = None
    yandex_id: str | None = None
    phone: str | None = None
    visited_at: datetime | None = None
    is_active: bool = True
    is_admin: bool = False
    roles: list[RoleConfigResponse] = []
    current_role: RoleConfigResponse | None = None

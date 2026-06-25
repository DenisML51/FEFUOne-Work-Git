from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class SubdivisionResponse(BaseModel):
    id: int
    title: str


class RoleResponse(BaseModel):
    id: int
    title: str
    description: str | None = None
    permissions: dict[str, list[str]] = {}


class RoleConfigResponse(BaseModel):
    config_id: int
    subdivision: SubdivisionResponse | None = None
    role: RoleResponse


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    photo_link: str | None = None
    visited_at: str | None = None
    amelia_id: int | None = None
    yandex_id: str | None = None
    phone: str | None = None
    roles: list[RoleConfigResponse] = []
    current_role: RoleConfigResponse | None = None

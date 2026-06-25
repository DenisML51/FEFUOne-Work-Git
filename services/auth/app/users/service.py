from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.config import get_settings
from app.permissions.enums import PermissionEntity, PermissionTitle
from app.roles.model import Role
from app.roles.service import project_role
from app.subdivisions.service import project_subdivision
from app.users.model import User, UserHasRole
from app.users.schemas import RoleConfigResponse, UserResponse

settings = get_settings()


def _query():
    return select(User).options(
        selectinload(User.roles)
        .selectinload(UserHasRole.role)
        .selectinload(Role.permissions),
        selectinload(User.roles).selectinload(UserHasRole.subdivision),
    )


async def get_by_email(session: AsyncSession, email: str) -> User | None:
    result = await session.execute(_query().where(User.email == email.lower()))
    return result.scalars().first()


async def get_by_id(session: AsyncSession, user_id: int) -> User | None:
    result = await session.execute(_query().where(User.id == user_id))
    return result.scalars().first()


def get_role_config(user: User, config_id: int) -> UserHasRole | None:
    return next((config for config in user.roles if config.id == config_id), None)


def resolve_current_role(user: User, config_id: int | None) -> UserHasRole | None:
    if config_id is not None:
        match = get_role_config(user, config_id)
        if match:
            return match
    return user.roles[0] if user.roles else None


def is_superuser(user: User) -> bool:
    email = (user.email or "").lower()
    return email in {value.lower() for value in settings.superuser_emails}


def has_admin_rights(user: User, current_role_config: UserHasRole | None) -> bool:
    if is_superuser(user):
        return True
    if current_role_config is None:
        return False
    return any(
        permission.entity == PermissionEntity.ADMIN
        and permission.title == PermissionTitle.READ
        for permission in current_role_config.role.permissions
    )


def project_role_config(config: UserHasRole) -> RoleConfigResponse:
    return RoleConfigResponse(
        config_id=config.id,
        role=project_role(config.role),
        subdivision=project_subdivision(config.subdivision) if config.subdivision else None,
    )


def project_user(user: User, current_role_config: UserHasRole | None) -> UserResponse:
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        photo_link=user.photo_link,
        amelia_id=user.amelia_id,
        yandex_id=user.yandex_id,
        phone=user.phone,
        visited_at=user.visited_at,
        is_active=user.is_active,
        is_admin=has_admin_rights(user, current_role_config),
        roles=[project_role_config(config) for config in user.roles],
        current_role=project_role_config(current_role_config) if current_role_config else None,
    )

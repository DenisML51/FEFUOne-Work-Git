from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from .models import Role, User, UserRole
from .schemas import (
    RoleConfigResponse,
    RoleResponse,
    SubdivisionResponse,
    UserResponse,
)

# Default role/subdivision assigned to users created via OAuth.
DEFAULT_ROLE_ID = 1
DEFAULT_SUBDIVISION_ID = 1


def _user_query():
    return select(User).options(
        selectinload(User.roles).selectinload(UserRole.role).selectinload(
            Role.permissions
        ),
        selectinload(User.roles).selectinload(UserRole.subdivision),
    )


async def get_by_email(session: AsyncSession, email: str) -> User | None:
    result = await session.execute(
        _user_query().where(User.email == email.lower())
    )
    return result.scalars().first()


async def get_by_id(session: AsyncSession, user_id: int) -> User | None:
    result = await session.execute(_user_query().where(User.id == user_id))
    return result.scalars().first()


async def upsert_yandex_user(
    session: AsyncSession,
    email: str,
    full_name: str,
    yandex_id: str | None,
    picture: str | None,
) -> User:
    user = await get_by_email(session, email)
    if user is None:
        user = User(email=email.lower(), full_name=full_name or email)
        user.roles.append(
            UserRole(role_id=DEFAULT_ROLE_ID, subdivision_id=DEFAULT_SUBDIVISION_ID)
        )
        session.add(user)
    if full_name:
        user.full_name = full_name
    user.yandex_id = yandex_id
    if picture:
        user.photo_link = picture
    await session.commit()
    # Reload with relationships eagerly populated for the response projection.
    return await get_by_id(session, user.id)


def project_user(user: User) -> UserResponse:
    roles = [_project_role_config(rc) for rc in user.roles]
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        photo_link=user.photo_link,
        yandex_id=user.yandex_id,
        phone=user.phone,
        visited_at=user.visited_at.isoformat() if user.visited_at else None,
        roles=roles,
        current_role=roles[0] if roles else None,
    )


def _project_role_config(rc: UserRole) -> RoleConfigResponse:
    permissions: dict[str, list[str]] = {}
    for perm in rc.role.permissions:
        permissions.setdefault(perm.entity, []).append(perm.action)
    return RoleConfigResponse(
        config_id=rc.id,
        subdivision=(
            SubdivisionResponse(id=rc.subdivision.id, title=rc.subdivision.title)
            if rc.subdivision
            else None
        ),
        role=RoleResponse(
            id=rc.role.id,
            title=rc.role.title,
            description=rc.role.description,
            permissions=permissions,
        ),
    )

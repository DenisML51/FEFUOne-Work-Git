from fastapi import Depends, HTTPException, Security, status
from fastapi.security import APIKeyCookie
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_async_session
from app.permissions.model import Permission
from app.security import decode_token
from app.users import service as users_service
from app.users.model import User, UserHasRole

settings = get_settings()

cookie_scheme = APIKeyCookie(name=settings.jwt_name, auto_error=False)

_NOT_AUTHENTICATED = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN, detail="Not authenticated"
)
_FORBIDDEN = HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")


async def get_claims(cookie: str | None = Security(cookie_scheme)) -> dict:
    if not cookie:
        raise _NOT_AUTHENTICATED
    try:
        return decode_token(cookie)
    except Exception:
        raise _NOT_AUTHENTICATED


async def get_logged_user(
    claims: dict = Depends(get_claims),
    session: AsyncSession = Depends(get_async_session),
) -> User:
    user = await users_service.get_by_id(session, int(claims["sub"]))
    if not user or not user.is_active:
        raise _NOT_AUTHENTICATED
    return user


async def get_current_role_config(
    claims: dict = Depends(get_claims),
    user: User = Depends(get_logged_user),
) -> UserHasRole | None:
    config_id = claims.get("pld", {}).get("current_role_config_id")
    return users_service.resolve_current_role(user, config_id)


async def get_current_permissions(
    config: UserHasRole | None = Depends(get_current_role_config),
) -> list[Permission]:
    return list(config.role.permissions) if config else []


async def require_admin(
    user: User = Depends(get_logged_user),
    config: UserHasRole | None = Depends(get_current_role_config),
) -> User:
    if not users_service.has_admin_rights(user, config):
        raise _FORBIDDEN
    return user


class PermissionChecker:
    def __init__(self, entity: str, title: str) -> None:
        self.entity = str(entity).lower()
        self.title = str(title).lower()

    async def __call__(
        self,
        user: User = Depends(get_logged_user),
        permissions: list[Permission] = Depends(get_current_permissions),
    ) -> None:
        if users_service.is_superuser(user):
            return
        granted = any(
            permission.entity.lower() == self.entity
            and permission.title.lower() == self.title
            for permission in permissions
        )
        if not granted:
            raise _FORBIDDEN

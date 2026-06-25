from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.responses import JSONResponse, RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_async_session
from app.security import verify_password
from app.sso.cookies import clear_auth_cookie, set_auth_cookie
from app.sso.dependencies import get_current_role_config, get_logged_user
from app.sso.schemas import LoginRequest
from app.sso.yandex import get_yandex_sso
from app.users import service as users_service
from app.users.model import User, UserHasRole
from app.users.schemas import UserResponse

router = APIRouter(prefix="/sso", tags=["sso"])
settings = get_settings()


@router.post("/login", status_code=status.HTTP_200_OK)
async def login(
    body: LoginRequest,
    response: Response,
    session: AsyncSession = Depends(get_async_session),
) -> dict[str, str]:
    user = await users_service.get_by_email(session, body.email)
    if not user or not user.password_hash or not verify_password(body.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный email или пароль"
        )
    role_config_id = user.roles[0].id if user.roles else None
    set_auth_cookie(response, user_id=user.id, role_config_id=role_config_id)
    return {"detail": "ok"}


@router.get("/me", response_model=UserResponse)
async def me(
    user: User = Depends(get_logged_user),
    current_role_config: UserHasRole | None = Depends(get_current_role_config),
) -> UserResponse:
    return users_service.project_user(user, current_role_config)


@router.post("/roles", status_code=status.HTTP_204_NO_CONTENT)
async def set_current_role(
    config_id: int,
    response: Response,
    user: User = Depends(get_logged_user),
) -> None:
    config = users_service.get_role_config(user, config_id)
    if not config:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    set_auth_cookie(response, user_id=user.id, role_config_id=config.id)


@router.get("/logout")
async def logout() -> JSONResponse:
    response = JSONResponse(content={"detail": "Вы вышли из аккаунта"})
    clear_auth_cookie(response)
    return response


@router.get("/login", status_code=status.HTTP_303_SEE_OTHER)
async def login_yandex(return_url: str | None = None):
    sso = get_yandex_sso()
    if sso is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Вход через Яндекс не сконфигурирован",
        )
    async with sso:
        return await sso.get_login_redirect(params={"force_confirm": "true"}, state=return_url)


@router.get("/callback", status_code=status.HTTP_307_TEMPORARY_REDIRECT)
async def login_callback(
    request: Request, session: AsyncSession = Depends(get_async_session)
):
    sso = get_yandex_sso()
    if sso is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Вход через Яндекс не сконфигурирован",
        )

    fallback = settings.frontend_url
    try:
        async with sso:
            profile = await sso.verify_and_process(request=request)
    except Exception:
        profile = None

    if not profile or not profile.email:
        return RedirectResponse(
            url=f"{sso.state or fallback}?status_code=401",
            status_code=status.HTTP_307_TEMPORARY_REDIRECT,
        )

    try:
        user = await users_service.get_by_email(session, profile.email)
    except Exception:
        return RedirectResponse(
            url=f"{sso.state or fallback}?status_code=503",
            status_code=status.HTTP_307_TEMPORARY_REDIRECT,
        )

    if not user or not user.is_active:
        return RedirectResponse(
            url=f"{sso.state or fallback}?status_code=403",
            status_code=status.HTTP_307_TEMPORARY_REDIRECT,
        )

    role_config_id = user.roles[0].id if user.roles else None
    redirect = RedirectResponse(
        url=f"{sso.state or fallback}?status_code=200",
        status_code=status.HTTP_307_TEMPORARY_REDIRECT,
    )
    set_auth_cookie(redirect, user_id=user.id, role_config_id=role_config_id)
    return redirect

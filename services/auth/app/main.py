from fastapi import Depends, FastAPI, HTTPException, Request, Response, status
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.security import APIKeyCookie
from sqlalchemy.ext.asyncio import AsyncSession

from . import service
from .config import get_settings
from .database import get_async_session
from .models import User
from .schemas import LoginRequest, UserResponse
from .security import decode_token, define_token, verify_password

settings = get_settings()

app = FastAPI(title="MOL Auth")

_cookie_scheme = APIKeyCookie(name=settings.jwt_name, auto_error=False)


def _set_auth_cookie(response: Response, user_id: int, role_config_id: int | None) -> None:
    token, expiration = define_token(user_id=user_id, role_config_id=role_config_id)
    response.set_cookie(
        key=settings.jwt_name,
        value=token,
        expires=expiration,
        max_age=settings.jwt_exp_days * 24 * 60 * 60,
        samesite=settings.cookie_samesite,
        secure=settings.cookie_secure,
        httponly=True,
        path="/",
    )


async def get_logged_user(
    cookie: str | None = Depends(_cookie_scheme),
    session: AsyncSession = Depends(get_async_session),
) -> User:
    if not cookie:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not authenticated"
        )
    try:
        claims = decode_token(cookie)
        user = await service.get_by_id(session, int(claims["sub"]))
    except Exception:
        user = None
    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not authenticated"
        )
    return user


def _first_role_config_id(user: User) -> int | None:
    return user.roles[0].id if user.roles else None


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/sso/login", status_code=status.HTTP_200_OK)
async def login_password(
    body: LoginRequest,
    response: Response,
    session: AsyncSession = Depends(get_async_session),
) -> dict[str, str]:
    """Вход по email и паролю."""
    user = await service.get_by_email(session, body.email)
    if not user or not user.password_hash or not verify_password(
        body.password, user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный email или пароль"
        )

    _set_auth_cookie(response, user_id=user.id, role_config_id=_first_role_config_id(user))
    return {"detail": "ok"}


@app.get("/sso/me", response_model=UserResponse)
async def me(user: User = Depends(get_logged_user)) -> UserResponse:
    """Текущий пользователь."""
    return service.project_user(user)


@app.get("/sso/logout")
async def logout() -> JSONResponse:
    """Выход из аккаунта."""
    response = JSONResponse(content={"detail": "Вы вышли из аккаунта"})
    response.delete_cookie(key=settings.jwt_name, path="/")
    return response


# --- Yandex OAuth (опционально) ------------------------------------------------
# Воспроизводит флоу референса на fastapi_sso. Работает при заданных
# YANDEX_CLIENT_ID / YANDEX_SECRET_ID; иначе кнопки "Яндекс" вернут 503.


def _get_sso():
    if not settings.yandex_client_id or not settings.yandex_secret_id:
        return None
    from fastapi_sso.sso.yandex import YandexSSO

    return YandexSSO(
        client_id=settings.yandex_client_id,
        client_secret=settings.yandex_secret_id,
        redirect_uri=f"{settings.yandex_redirect_domain}/sso/callback",
        allow_insecure_http=True,
    )


@app.get("/sso/login", status_code=status.HTTP_303_SEE_OTHER)
async def login_yandex(return_url: str | None = None):
    """Редирект на Yandex OAuth."""
    sso = _get_sso()
    if sso is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Вход через Яндекс не сконфигурирован",
        )
    async with sso:
        return await sso.get_login_redirect(
            params={"force_confirm": "true"}, state=return_url
        )


@app.get("/sso/callback", status_code=status.HTTP_307_TEMPORARY_REDIRECT)
async def login_callback(
    request: Request, session: AsyncSession = Depends(get_async_session)
):
    """Yandex callback: обмен кода, апсерт пользователя, установка cookie."""
    sso = _get_sso()
    if sso is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Вход через Яндекс не сконфигурирован",
        )

    fallback = settings.frontend_url

    try:
        async with sso:
            yandex = await sso.verify_and_process(request=request)
    except Exception:
        return RedirectResponse(
            url=f"{sso.state or fallback}?status_code=401",
            status_code=status.HTTP_307_TEMPORARY_REDIRECT,
        )

    if not yandex or not yandex.email:
        return RedirectResponse(
            url=f"{sso.state or fallback}?status_code=401",
            status_code=status.HTTP_307_TEMPORARY_REDIRECT,
        )

    full_name = (
        yandex.display_name
        or " ".join(filter(None, [yandex.first_name, yandex.last_name]))
        or yandex.email
    )
    user = await service.upsert_yandex_user(
        session,
        email=yandex.email,
        full_name=full_name,
        yandex_id=yandex.id,
        picture=yandex.picture,
    )

    redirect = RedirectResponse(
        url=f"{sso.state or fallback}?status_code=200",
        status_code=status.HTTP_307_TEMPORARY_REDIRECT,
    )
    _set_auth_cookie(redirect, user_id=user.id, role_config_id=_first_role_config_id(user))
    return redirect

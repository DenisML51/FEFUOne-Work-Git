from fastapi import Response

from app.config import get_settings
from app.security import create_token

settings = get_settings()


def set_auth_cookie(response: Response, user_id: int, role_config_id: int | None) -> None:
    token, expiration = create_token(user_id=user_id, role_config_id=role_config_id)
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


def clear_auth_cookie(response: Response) -> None:
    response.delete_cookie(key=settings.jwt_name, path="/")

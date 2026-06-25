import datetime as dt

import bcrypt
import jwt

from app.config import get_settings

settings = get_settings()


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode(), password_hash.encode())
    except ValueError:
        return False


def create_token(user_id: int, role_config_id: int | None) -> tuple[str, dt.datetime]:
    expiration = dt.datetime.now(tz=dt.timezone.utc) + dt.timedelta(days=settings.jwt_exp_days)
    token = jwt.encode(
        payload={
            "sub": str(user_id),
            "pld": {"current_role_config_id": role_config_id},
            "exp": expiration,
        },
        key=settings.jwt_secret,
        algorithm=settings.jwt_algorithm,
    )
    return token, expiration


def decode_token(token: str) -> dict:
    return jwt.decode(token, key=settings.jwt_secret, algorithms=[settings.jwt_algorithm])

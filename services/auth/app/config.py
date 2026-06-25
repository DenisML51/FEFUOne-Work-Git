from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="", extra="ignore")

    database_url: str = "postgresql+asyncpg://auth:auth@auth-db:5432/auth"

    jwt_secret: str = "mol-dev-secret-change-me"
    jwt_algorithm: str = "HS256"
    jwt_exp_days: int = 7
    jwt_name: str = "mol_access_token"

    cookie_secure: bool = False
    cookie_samesite: str = "lax"

    frontend_url: str = "http://localhost:8081"

    superuser_emails: list[str] = ["rusinov.ds@dvfu.ru"]

    yandex_client_id: str = ""
    yandex_secret_id: str = ""
    yandex_redirect_domain: str = "http://localhost:8081/api/auth"


@lru_cache
def get_settings() -> Settings:
    return Settings()

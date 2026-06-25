from functools import lru_cache
from urllib.parse import quote_plus

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="", extra="ignore")

    db_host: str = "localhost"
    db_port: int = 3306
    db_user: str = "root"
    db_password: str = ""
    db_database: str = "fefuone"

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

    @property
    def database_url(self) -> str:
        user = quote_plus(self.db_user)
        password = quote_plus(self.db_password)
        return (
            f"mysql+aiomysql://{user}:{password}"
            f"@{self.db_host}:{self.db_port}/{self.db_database}"
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()

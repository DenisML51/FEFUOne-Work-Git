from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="", extra="ignore")

    auth_url: str = "http://auth:8000"
    ai_agent_url: str = "http://ai-agent:8000"
    ingestor_url: str = "http://ingestor:8000"
    request_timeout: float = 30.0
    cors_origins: list[str] = ["*"]


settings = Settings()

ROUTES: dict[str, str] = {
    "auth": settings.auth_url,
    "agent": settings.ai_agent_url,
    "ingest": settings.ingestor_url,
}

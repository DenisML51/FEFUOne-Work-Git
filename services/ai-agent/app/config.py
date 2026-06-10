from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="", extra="ignore")

    anthropic_api_key: str = ""
    ai_agent_model: str = "claude-sonnet-4-6"
    qdrant_url: str = "http://qdrant:6333"
    qdrant_collection: str = "mol_documents"


settings = Settings()

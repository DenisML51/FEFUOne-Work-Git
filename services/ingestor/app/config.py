from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="", extra="ignore")

    airflow_api_url: str = "http://airflow-apiserver:8080/api/v2"
    airflow_username: str = "airflow"
    airflow_password: str = "airflow"
    default_dag_id: str = "mol_ingest"
    request_timeout: float = 15.0


settings = Settings()

import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "e-Portal for Case Management Hearing (Order XV-A CPC)"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security / JWT
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "super-secret-judicial-token-key-2026-cpc-order-xva")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Database: defaults to SQLite file for immediate local dev, easily overridden by MySQL URL
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./cmh_portal.db")
    
    # Document storage path
    STORAGE_DIR: str = os.getenv("STORAGE_DIR", "./vault_storage")

    model_config = {"env_file": ".env", "extra": "ignore"}

settings = Settings()

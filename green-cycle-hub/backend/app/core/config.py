from pydantic_settings import BaseSettings
from functools import lru_cache



class Settings(BaseSettings):
    google_client_id: str = ""
    google_client_secret: str = ""
    supabase_url: str = ""
    supabase_service_role_key: str = ""
    supabase_anon_key: str = ""

    mqtt_broker_host: str = "localhost"
    mqtt_broker_port: int = 1883
    mqtt_username: str = ""
    mqtt_password: str = ""

    mpesa_consumer_key: str = ""
    mpesa_consumer_secret: str = ""
    mpesa_shortcode: str = ""
    mpesa_passkey: str = ""
    mpesa_callback_url: str = ""

    flutterwave_secret_key: str = ""
    flutterwave_webhook_hash: str = ""

    sendgrid_api_key: str = ""
    sendgrid_from_email: str = "noreply@smacom.co.ke"

    firebase_credentials_json: str = ""

    jwt_secret: str = "changeme"
    allowed_origins: list[str] = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000", "http://localhost:8000", "http://localhost:8080"]
    debug: bool = False
    environment: str = "development"
    frontend_url: str = "http://localhost:8080"
    port: int = 8000

    model_config = {
        "env_file": ".env",
        "case_sensitive": False,
        "extra": "ignore",
    }

    def get_allowed_origins(self) -> list[str]:
        """Get allowed origins based on environment"""
        if self.environment == "production":
            # In production (Railway), allow all origins through nginx proxy
            return ["*"]
        # In development, return specific allowed origins
        return self.allowed_origins


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
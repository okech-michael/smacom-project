from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Authentication
    google_client_id: str = ""
    google_client_secret: str = ""
    jwt_secret: str = "changeme"
    
    # Database
    supabase_url: str = ""
    supabase_service_role_key: str = ""
    supabase_anon_key: str = ""

    # Payments
    mpesa_consumer_key: str = ""
    mpesa_consumer_secret: str = ""
    mpesa_shortcode: str = ""
    mpesa_passkey: str = ""
    mpesa_callback_url: str = ""

    flutterwave_secret_key: str = ""
    flutterwave_webhook_hash: str = ""

    # Email
    sendgrid_api_key: str = ""
    sendgrid_from_email: str = "noreply@smacom.co.ke"

    # Firebase (optional)
    firebase_credentials_json: str = ""

    # Application Settings
    debug: bool = False
    environment: str = "development"
    frontend_url: str = "http://localhost:3000"
    port: int = 8000
    
    # CORS
    allowed_origins: list[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
    ]

    # MQTT/IoT - DISABLED FOR VERCEL
    # These features will be re-enabled when backend moves to Railway
    mqtt_enabled: bool = False
    mqtt_broker_host: str = "disabled"
    mqtt_broker_port: int = 1883
    mqtt_username: str = ""
    mqtt_password: str = ""

    model_config = {
        "env_file": ".env",
        "case_sensitive": False,
        "extra": "ignore",
    }

    def get_allowed_origins(self) -> list[str]:
        """Get allowed origins for CORS"""
        if self.environment == "production":
            return ["*"]  # Vercel frontend will access from same domain
        return self.allowed_origins


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
import os
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Authentication
    google_client_id: str = ""
    google_client_secret: str = ""
    jwt_secret: str = ""
    
    # Database - Supabase
    supabase_url: str = "https://azorfytyfrvacemalltq.supabase.co"
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
    sendgrid_from_email: str = "noreply@smacom.io"

    # Firebase (optional)
    firebase_credentials_json: str = ""

    # Application Settings
    debug: bool = False
    environment: str = os.getenv("ENVIRONMENT", "production")
    frontend_url: str = "https://www.smacom.co.ke"
    port: int = 8000
    
    # CORS - Production domain only
    allowed_origins: list[str] = [
        "https://www.smacom.co.ke",
        "https://smacom.co.ke",
    ]

    # MQTT/IoT - DISABLED FOR VERCEL
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
            return [
                "https://www.smacom.co.ke",
                "https://smacom.co.ke",
            ]
        # Development origins
        return [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174",
            "http://127.0.0.1:3000",
            "http://localhost:8000",
        ]


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()


settings = get_settings()
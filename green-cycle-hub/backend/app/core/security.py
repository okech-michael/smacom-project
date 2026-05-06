from datetime import datetime, timezone
from typing import Optional
import pyotp
import qrcode
import io
import base64


def generate_totp_secret() -> str:
    """Generate a new TOTP secret."""
    return pyotp.random_base32()


def get_totp_uri(secret: str, email: str, issuer: str = "SMACOM") -> str:
    """Return the otpauth URI for QR code generation."""
    totp = pyotp.TOTP(secret)
    return totp.provisioning_uri(name=email, issuer_name=issuer)


def verify_totp_code(secret: str, code: str) -> bool:
    """Verify a TOTP code against a secret. Allows 1-step clock drift."""
    totp = pyotp.TOTP(secret)
    return totp.verify(code, valid_window=1)


def generate_qr_code_base64(uri: str) -> str:
    """Return base64-encoded PNG QR code image for the given URI."""
    img = qrcode.make(uri)
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    return base64.b64encode(buffer.read()).decode()


def generate_backup_codes(count: int = 8) -> list[str]:
    """Generate one-time backup codes."""
    import secrets
    return [secrets.token_hex(5).upper() for _ in range(count)]


def utcnow() -> datetime:
    return datetime.now(timezone.utc)
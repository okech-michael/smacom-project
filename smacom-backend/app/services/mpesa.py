import httpx
import base64
from datetime import datetime, timezone
from app.core.config import settings

_token_cache: dict = {"token": None, "expires_at": None}


async def _get_access_token() -> str:
    """Fetch and cache Daraja OAuth token."""
    now = datetime.now(timezone.utc)
    if _token_cache["token"] and _token_cache["expires_at"] and now < _token_cache["expires_at"]:
        return _token_cache["token"]

    credentials = f"{settings.mpesa_consumer_key}:{settings.mpesa_consumer_secret}"
    encoded = base64.b64encode(credentials.encode()).decode()

    base_url = "https://sandbox.safaricom.co.ke" if settings.environment == "development" else "https://api.safaricom.co.ke"

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{base_url}/oauth/v1/generate?grant_type=client_credentials",
            headers={"Authorization": f"Basic {encoded}"},
        )
        resp.raise_for_status()
        data = resp.json()

    token = data["access_token"]
    expires_in = int(data.get("expires_in", 3600))

    from datetime import timedelta
    _token_cache["token"] = token
    _token_cache["expires_at"] = now + timedelta(seconds=expires_in - 60)
    return token


async def initiate_stk_push(phone: str, amount: float, reference: str, description: str) -> dict:
    """Initiate M-Pesa STK Push (Lipa Na M-Pesa Online)."""
    token = await _get_access_token()
    base_url = "https://sandbox.safaricom.co.ke" if settings.environment == "development" else "https://api.safaricom.co.ke"

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    password_str = f"{settings.mpesa_shortcode}{settings.mpesa_passkey}{timestamp}"
    password = base64.b64encode(password_str.encode()).decode()

    # Normalize phone number to 254XXXXXXXXX
    if phone and phone.startswith("0"):
        phone = "254" + phone[1:]

    payload = {
        "BusinessShortCode": settings.mpesa_shortcode,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(amount),
        "PartyA": phone,
        "PartyB": settings.mpesa_shortcode,
        "PhoneNumber": phone,
        "CallBackURL": settings.mpesa_callback_url,
        "AccountReference": reference[:12],
        "TransactionDesc": description[:13],
    }

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{base_url}/mpesa/stkpush/v1/processrequest",
            json=payload,
            headers={"Authorization": f"Bearer {token}"},
        )
        resp.raise_for_status()
        return resp.json()
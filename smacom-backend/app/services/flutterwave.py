import httpx
from app.core.config import settings

FLUTTERWAVE_BASE = "https://api.flutterwave.com/v3"


async def initiate_payment(amount: float, email: str, name: str, reference: str) -> str:
    """Create a Flutterwave payment link and return the hosted URL."""
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{FLUTTERWAVE_BASE}/payments",
            json={
                "tx_ref": reference,
                "amount": amount,
                "currency": "KES",
                "redirect_url": "https://smacom.co.ke/payment/callback",
                "customer": {"email": email, "name": name},
                "customizations": {
                    "title": "SMACOM Solutions",
                    "description": "Payment for SMACOM services",
                },
            },
            headers={
                "Authorization": f"Bearer {settings.flutterwave_secret_key}",
                "Content-Type": "application/json",
            },
        )
        resp.raise_for_status()
        data = resp.json()

    return data.get("data", {}).get("link", "")
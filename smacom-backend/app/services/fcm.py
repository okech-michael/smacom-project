import json
import firebase_admin
from firebase_admin import credentials, messaging
from app.core.config import settings

_initialized = False


def _init_firebase():
    global _initialized
    if not _initialized and not firebase_admin._apps:
        if settings.firebase_credentials_json:
            cred_dict = json.loads(settings.firebase_credentials_json)
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
            _initialized = True


async def send_push(user_id: str, title: str, body: str, data: dict = None, supabase=None) -> bool:
    """Look up the user's FCM token and send a push notification."""
    _init_firebase()

    if supabase:
        result = supabase.table("users").select("fcm_token").eq("id", user_id).single().execute()
        token = result.data.get("fcm_token") if result.data else None
    else:
        return False

    if not token:
        return False

    message = messaging.Message(
        notification=messaging.Notification(title=title, body=body),
        data=data or {},
        token=token,
    )

    try:
        messaging.send(message)
        return True
    except Exception as e:
        print(f"[FCM] Failed to send push to {user_id}: {e}")
        return False


async def send_push_to_multiple(user_ids: list[str], title: str, body: str, data: dict = None, supabase=None):
    """Send push notifications to multiple users."""
    for uid in user_ids:
        await send_push(uid, title, body, data, supabase)
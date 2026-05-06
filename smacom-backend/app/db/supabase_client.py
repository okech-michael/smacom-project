from supabase import create_client, Client
from app.core.config import settings

_admin_client: Client | None = None


def get_supabase_admin() -> Client:
    """Return a singleton Supabase client using the service role key (bypasses RLS)."""
    global _admin_client
    if _admin_client is None:
        _admin_client = create_client(settings.supabase_url, settings.supabase_service_role_key)
    return _admin_client


def get_supabase() -> Client:
    """FastAPI dependency — returns admin client.
    In production you may swap this for a user-scoped client per request."""
    return get_supabase_admin()
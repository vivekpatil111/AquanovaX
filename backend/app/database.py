from supabase import create_client, Client
from functools import lru_cache
from app.config import get_settings


@lru_cache()
def get_supabase() -> Client:
    """Return a cached Supabase client using the anon key (for user-scoped operations)."""
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_anon_key)


@lru_cache()
def get_supabase_admin() -> Client:
    """Return a cached Supabase admin client using the service role key (for admin operations)."""
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_service_role_key)

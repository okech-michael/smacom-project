from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.db.supabase_client import get_supabase

bearer_scheme = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    supabase=Depends(get_supabase),
) -> dict:
    """Validate JWT and return the current user row from the users table."""
    token = credentials.credentials
    try:
        # Verify token with Supabase Auth
        response = supabase.auth.get_user(token)
        if not response or not response.user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        user_id = response.user.id
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    # Fetch user profile
    result = supabase.table("users").select("*").eq("id", user_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user = result.data
    if user["status"] == "suspended":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account suspended")

    return user


def require_role(*roles: str):
    """Dependency factory: restricts endpoint to users with one of the given roles."""
    async def _check(current_user: dict = Depends(get_current_user)):
        if current_user["role"] not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access restricted to roles: {', '.join(roles)}",
            )
        return current_user
    return _check


def require_verified():
    """Dependency: user must be verified."""
    async def _check(current_user: dict = Depends(get_current_user)):
        if current_user["status"] != "verified":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account not yet verified",
            )
        return current_user
    return _check
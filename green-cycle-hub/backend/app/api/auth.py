from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, EmailStr
from urllib.parse import quote_plus

from app.core.config import settings
from app.db.supabase_client import get_supabase
from app.core.dependencies import get_current_user

router = APIRouter(tags=["Authentication"])

VALID_ROLES = {"producer", "processor", "farmer", "learner", "admin"}


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: str
    role: str
    organisation: str = ""
    address: str = ""


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class SignupResponse(BaseModel):
    id: str
    email: str
    full_name: str
    access_token: str
    user: dict
    message: str


class LoginResponse(BaseModel):
    access_token: str
    user: dict


@router.post("/signup", response_model=SignupResponse)
async def signup(payload: SignupRequest, supabase=Depends(get_supabase)):
    """Register a new user account"""
    
    # Validate role
    if payload.role not in VALID_ROLES:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    # Check if email exists
    existing = supabase.table("users").select("id").eq("email", payload.email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if not settings.supabase_url or not settings.supabase_service_role_key:
        raise HTTPException(status_code=500, detail="Supabase auth is not configured")

    def _get_user_id(response):
        if not response:
            return None
        if hasattr(response, "user") and response.user:
            return getattr(response.user, "id", None)
        if isinstance(response, dict):
            return response.get("user", {}).get("id")
        return None


def _normalize_supabase_url(url: str) -> str:
    """Return the Supabase project root URL without REST path segments."""
    normalized = url.rstrip('/')
    if normalized.endswith('/rest/v1'):
        normalized = normalized[: -len('/rest/v1')]
    return normalized

    def _normalize_supabase_url(url: str) -> str:
        """Return the Supabase project root URL without REST path segments."""
        normalized = url.rstrip('/')
        if normalized.endswith('/rest/v1'):
            normalized = normalized[: -len('/rest/v1')]
        return normalized

    try:
        # Create Supabase Auth user using service role credentials.
        auth_client = supabase.auth
        if hasattr(auth_client, "admin") and hasattr(auth_client.admin, "create_user"):
            auth_response = auth_client.admin.create_user({
                "email": payload.email,
                "password": payload.password,
                "email_confirm": True,
            })
        else:
            auth_response = auth_client.sign_up({
                "email": payload.email,
                "password": payload.password,
            })

        user_id = _get_user_id(auth_response)
        if not user_id:
            raise HTTPException(status_code=500, detail="Failed to create auth user")

        # Create user profile in database
        user_data = {
            "id": user_id,
            "email": payload.email,
            "full_name": payload.full_name,
            "phone": payload.phone,
            "role": payload.role,
            "organisation": payload.organisation,
            "status": "pending",
        }
        
        supabase.table("users").insert(user_data).execute()
        
        # Try to get access token by signing in with the new credentials
        access_token = None
        user_response = None
        try:
            sign_in_response = supabase.auth.sign_in_with_password({
                "email": payload.email,
                "password": payload.password,
            })
            if sign_in_response.session:
                access_token = sign_in_response.session.access_token
                # Convert user object to dict if needed
                if hasattr(sign_in_response.user, 'model_dump'):
                    user_response = sign_in_response.user.model_dump()
                elif hasattr(sign_in_response.user, '__dict__'):
                    user_response = sign_in_response.user.__dict__
                else:
                    user_response = dict(sign_in_response.user) if sign_in_response.user else user_data
        except Exception as e:
            # If sign-in fails, we still created the user, so just warn
            print(f"Warning: Could not auto-sign in new user: {e}")
        
        if not access_token:
            # Fallback: if we couldn't get a session, still return user data
            access_token = ""
            user_response = user_data
        
        # Ensure user_response is a dict
        if not isinstance(user_response, dict):
            user_response = user_data
        
        return SignupResponse(
            id=user_id,
            email=payload.email,
            full_name=payload.full_name,
            access_token=access_token,
            user=user_response,
            message="Account created successfully. You are now logged in.",
        )
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/oauth/google")
async def google_oauth(redirect_to: str | None = None):
    """Redirect the user to Supabase Google OAuth."""
    if not settings.supabase_url:
        raise HTTPException(status_code=500, detail="Supabase URL is not configured")
    if not settings.supabase_anon_key:
        raise HTTPException(status_code=500, detail="Supabase anon key is not configured")

    base_url = _normalize_supabase_url(settings.supabase_url)
    target = redirect_to or settings.frontend_url or "https://www.smacom.co.ke"
    authorize_url = (
        f"{base_url}/auth/v1/authorize"
        f"?provider=google"
        f"&redirect_to={quote_plus(target)}"
        f"&apikey={quote_plus(settings.supabase_anon_key)}"
    )
    return RedirectResponse(authorize_url)


@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest, supabase=Depends(get_supabase)):
    """Login with email and password"""
    
    try:
        # Sign in with Supabase Auth
        auth_response = supabase.auth.sign_in_with_password({
            "email": payload.email,
            "password": payload.password,
        })
        
        user_id = auth_response.user.id
        access_token = auth_response.session.access_token
        
        # Get user profile
        user_data = supabase.table("users").select("*").eq("id", user_id).single().execute()
        
        if not user_data.data:
            raise HTTPException(status_code=404, detail="User profile not found")
        
        user = user_data.data
        
        return LoginResponse(
            access_token=access_token,
            user={
                "id": user["id"],
                "email": user["email"],
                "full_name": user["full_name"],
                "role": user["role"],
                "status": user["status"],
            }
        )
    
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid email or password")


@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user), supabase=Depends(get_supabase)):
    """Logout the current user"""
    try:
        supabase.auth.sign_out()
        return {"message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/me")
async def get_current_user_profile(current_user: dict = Depends(get_current_user), supabase=Depends(get_supabase)):
    """Get current user profile"""
    user_data = supabase.table("users").select("*").eq("id", current_user["id"]).single().execute()
    return {"success": True, "data": user_data.data}


@router.get("/_env")
def debug_env():
    """Temporary diagnostic endpoint — returns whether key env vars are set (no secret values returned)"""
    return {
        "supabase_url_set": bool(settings.supabase_url),
        "supabase_service_role_key_set": bool(settings.supabase_service_role_key),
        "supabase_anon_key_set": bool(settings.supabase_anon_key),
        "google_client_id_set": bool(settings.google_client_id),
    }

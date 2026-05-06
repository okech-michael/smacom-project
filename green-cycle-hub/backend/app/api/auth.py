from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, EmailStr
from urllib.parse import quote_plus

from app.core.config import settings
from app.db.supabase_client import get_supabase
from app.core.dependencies import get_current_user

router = APIRouter(tags=["Authentication"])


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
    message: str


class LoginResponse(BaseModel):
    access_token: str
    user: dict


@router.post("/signup", response_model=SignupResponse)
async def signup(payload: SignupRequest, supabase=Depends(get_supabase)):
    """Register a new user account"""
    
    # Validate role
    valid_roles = ["producer", "processor", "farmer", "learner", "admin"]
    if payload.role not in valid_roles:
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
            "address": payload.address,
            "status": "pending_verification",
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        
        supabase.table("users").insert(user_data).execute()
        
        return SignupResponse(
            id=user_id,
            email=payload.email,
            full_name=payload.full_name,
            message="Account created successfully. Please check your email to confirm.",
        )
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/oauth/google")
async def google_oauth(redirect_to: str | None = None):
    """Redirect the user to Supabase Google OAuth."""
    if not settings.supabase_url:
        raise HTTPException(status_code=500, detail="Supabase URL is not configured")

    target = redirect_to or settings.frontend_url or "http://localhost:8080"
    authorize_url = (
        f"{settings.supabase_url.rstrip('/')}/auth/v1/authorize"
        f"?provider=google&redirect_to={quote_plus(target)}"
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

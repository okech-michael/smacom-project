from fastapi import APIRouter, Depends, UploadFile, File, Query
from app.db.supabase_client import get_supabase
from app.core.dependencies import get_current_user, require_role
from app.models.user import UserUpdate
from app.services.sendgrid import send_account_verified_email
from pydantic import BaseModel

router = APIRouter(tags=["Users"])


def ok(data):
    return {"success": True, "data": data}


# ── Own Profile ───────────────────────────────────────────────────────────────

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return ok(current_user)


@router.patch("/me")
async def update_me(
    payload: UserUpdate,
    current_user: dict = Depends(get_current_user),
    supabase=Depends(get_supabase),
):
    updates = payload.model_dump(exclude_none=True)

    # Convert facility_location dict to PostgreSQL point string
    if "facility_location" in updates:
        loc = updates["facility_location"]
        updates["facility_location"] = f"({loc['lat']},{loc['lng']})"

    result = (
        supabase.table("users")
        .update(updates)
        .eq("id", current_user["id"])
        .execute()
    )
    return ok(result.data[0] if result.data else {})


@router.post("/me/id-upload")
async def upload_id(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    supabase=Depends(get_supabase),
):
    allowed = {"image/jpeg", "image/png", "application/pdf"}
    if file.content_type not in allowed:
        return {"success": False, "error": "Invalid file type. Allowed: JPEG, PNG, PDF"}

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        return {"success": False, "error": "File exceeds 10MB limit"}

    path = f"id-documents/{current_user['id']}/{file.filename}"
    supabase.storage.from_("id-documents").upload(path, content, {"content-type": file.content_type})

    supabase.table("users").update({"id_document_path": path}).eq("id", current_user["id"]).execute()
    return ok({"path": path})


class FCMTokenUpdate(BaseModel):
    fcm_token: str


@router.post("/me/fcm-token")
async def update_fcm_token(
    payload: FCMTokenUpdate,
    current_user: dict = Depends(get_current_user),
    supabase=Depends(get_supabase),
):
    supabase.table("users").update({"fcm_token": payload.fcm_token}).eq("id", current_user["id"]).execute()
    return ok({"message": "FCM token updated"})


# ── Admin: User Management ────────────────────────────────────────────────────

@router.get("")
async def list_users(
    role: str = Query(None),
    status: str = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(require_role("admin")),
    supabase=Depends(get_supabase),
):
    query = supabase.table("users").select("*")
    if role:
        query = query.eq("role", role)
    if status:
        query = query.eq("status", status)

    offset = (page - 1) * page_size
    result = query.range(offset, offset + page_size - 1).execute()
    return ok({"users": result.data, "page": page, "page_size": page_size})


@router.patch("/{user_id}/verify")
async def verify_user(
    user_id: str,
    current_user: dict = Depends(require_role("admin")),
    supabase=Depends(get_supabase),
):
    result = supabase.table("users").update({"status": "verified"}).eq("id", user_id).execute()
    if result.data:
        user = result.data[0]
        try:
            await send_account_verified_email(user["email"], user["full_name"])
        except Exception:
            pass
    return ok({"status": "verified"})


@router.patch("/{user_id}/suspend")
async def suspend_user(
    user_id: str,
    current_user: dict = Depends(require_role("admin")),
    supabase=Depends(get_supabase),
):
    supabase.table("users").update({"status": "suspended"}).eq("id", user_id).execute()
    return ok({"status": "suspended"})
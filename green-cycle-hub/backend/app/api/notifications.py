from fastapi import APIRouter, Depends, Query
from app.db.supabase_client import get_supabase
from app.core.dependencies import get_current_user

router = APIRouter(tags=["Notifications"])


def ok(data):
    return {"success": True, "data": data}


@router.get("")
async def list_notifications(
    is_read: bool = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
    supabase=Depends(get_supabase),
):
    query = supabase.table("notifications").select("*").eq("user_id", current_user["id"])
    if is_read is not None:
        query = query.eq("is_read", is_read)

    offset = (page - 1) * page_size
    result = query.range(offset, offset + page_size - 1).order("created_at", desc=True).execute()
    return ok({"notifications": result.data})


@router.patch("/{notification_id}/read")
async def mark_read(
    notification_id: str,
    current_user: dict = Depends(get_current_user),
    supabase=Depends(get_supabase),
):
    supabase.table("notifications").update({"is_read": True})\
        .eq("id", notification_id).eq("user_id", current_user["id"]).execute()
    return ok({"message": "Marked as read"})


@router.patch("/read-all")
async def mark_all_read(
    current_user: dict = Depends(get_current_user),
    supabase=Depends(get_supabase),
):
    supabase.table("notifications").update({"is_read": True})\
        .eq("user_id", current_user["id"]).eq("is_read", False).execute()
    return ok({"message": "All notifications marked as read"})
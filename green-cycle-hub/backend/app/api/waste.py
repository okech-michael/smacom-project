import math
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, UploadFile, File, Query
from app.db.supabase_client import get_supabase
from app.core.dependencies import get_current_user, require_role
from app.models.waste import WasteRequestCreate, WasteStatusUpdate
from app.services.credits import award_credits
from app.services.commission import split_disposal_fee
from app.services.fcm import send_push
from pydantic import BaseModel

router = APIRouter(tags=["Waste"])

ALLOWED_PHOTO_TYPES = {"image/jpeg", "image/png", "image/heic"}
MAX_PHOTO_SIZE = 10 * 1024 * 1024


def ok(data):
    return {"success": True, "data": data}


def _get_setting(supabase, key: str, default: float) -> float:
    result = supabase.table("system_settings").select("value").eq("key", key).single().execute()
    return float(result.data["value"]) if result.data else default


def _haversine_km(lat1, lng1, lat2, lng2) -> float:
    R = 6371
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lng2 - lng1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


# ── Create Waste Request ──────────────────────────────────────────────────────

@router.post("/requests")
async def create_request(
    payload: WasteRequestCreate,
    current_user: dict = Depends(require_role("producer")),
    supabase=Depends(get_supabase),
):
    base_rate = _get_setting(supabase, "base_disposal_fee_per_kg", 5.0)
    disposal_fee = round(payload.quantity_kg * base_rate, 2)

    result = supabase.table("waste_requests").insert({
        "producer_id": current_user["id"],
        "waste_category": payload.waste_category,
        "waste_subtype": payload.waste_subtype,
        "additional_notes": payload.additional_notes,
        "quantity_kg": payload.quantity_kg,
        "location_lat": payload.location_lat,
        "location_lng": payload.location_lng,
        "location_address": payload.location_address,
        "disposal_fee": disposal_fee,
        "status": "pending",
    }).execute()

    return ok({"request_id": result.data[0]["id"], "disposal_fee": disposal_fee})


# ── Upload Photos ─────────────────────────────────────────────────────────────

@router.post("/requests/{request_id}/photos")
async def upload_photos(
    request_id: str,
    files: list[UploadFile] = File(...),
    current_user: dict = Depends(require_role("producer")),
    supabase=Depends(get_supabase),
):
    if len(files) > 5:
        return {"success": False, "error": "Maximum 5 photos allowed"}

    uploaded = []
    for f in files:
        if f.content_type not in ALLOWED_PHOTO_TYPES:
            return {"success": False, "error": f"Invalid file type: {f.content_type}"}
        content = await f.read()
        if len(content) > MAX_PHOTO_SIZE:
            return {"success": False, "error": f"{f.filename} exceeds 10MB limit"}

        path = f"waste-photos/{request_id}/{f.filename}"
        supabase.storage.from_("waste-photos").upload(path, content, {"content-type": f.content_type})
        supabase.table("waste_photos").insert({"request_id": request_id, "storage_path": path}).execute()
        uploaded.append(path)

    return ok({"uploaded": uploaded})


# ── Nearby Requests (Processor) ───────────────────────────────────────────────

@router.get("/requests/nearby")
async def nearby_requests(
    lat: float = Query(...),
    lng: float = Query(...),
    radius_km: float = Query(None),
    current_user: dict = Depends(require_role("processor")),
    supabase=Depends(get_supabase),
):
    # Free plan: 5km, Premium: 25km
    if radius_km is None:
        radius_km = 25.0 if current_user.get("subscription_plan") == "premium" else 5.0

    result = supabase.table("waste_requests").select(
        "*, waste_photos(storage_path)"
    ).eq("status", "pending").execute()

    nearby = []
    for req in (result.data or []):
        dist = _haversine_km(lat, lng, req["location_lat"], req["location_lng"])
        if dist <= radius_km:
            req["distance_km"] = round(dist, 2)
            nearby.append(req)

    nearby.sort(key=lambda x: x["distance_km"])
    return ok({"requests": nearby})


# ── Accept Request (Processor) ────────────────────────────────────────────────

@router.post("/requests/{request_id}/accept")
async def accept_request(
    request_id: str,
    current_user: dict = Depends(require_role("processor")),
    supabase=Depends(get_supabase),
):
    req_result = supabase.table("waste_requests").select("*").eq("id", request_id).single().execute()
    req = req_result.data
    if not req:
        return {"success": False, "error": "Request not found"}
    if req["status"] != "pending":
        return {"success": False, "error": "Request is no longer available"}

    supabase.table("waste_requests").update({
        "status": "assigned",
        "processor_id": current_user["id"],
    }).eq("id", request_id).execute()

    # Notify producer
    try:
        await send_push(
            req["producer_id"],
            "Waste Request Accepted",
            "A processor has been assigned to your waste collection request.",
            supabase=supabase,
        )
    except Exception:
        pass

    return ok({
        "message": "Request accepted",
        "producer_location": {
            "lat": req["location_lat"],
            "lng": req["location_lng"],
            "address": req["location_address"],
        },
    })


# ── Update Status (Processor) ─────────────────────────────────────────────────

@router.patch("/requests/{request_id}/status")
async def update_status(
    request_id: str,
    payload: WasteStatusUpdate,
    current_user: dict = Depends(require_role("processor")),
    supabase=Depends(get_supabase),
):
    allowed = {"en_route", "collected"}
    if payload.status not in allowed:
        return {"success": False, "error": "Status must be en_route or collected"}

    updates = {"status": payload.status}
    if payload.status == "collected":
        updates["collected_at"] = datetime.now(timezone.utc).isoformat()

    req_result = supabase.table("waste_requests").select("*").eq("id", request_id).single().execute()
    req = req_result.data

    supabase.table("waste_requests").update(updates).eq("id", request_id).execute()

    if payload.status == "collected" and req:
        # Award credits to producer
        credit_rate = _get_setting(supabase, "credit_rate_per_kg", 1.0)
        await award_credits(req["producer_id"], req["quantity_kg"], credit_rate, supabase)

        # Schedule payout for processor
        split = split_disposal_fee(req["disposal_fee"])
        supabase.table("payouts").insert({
            "recipient_id": current_user["id"],
            "amount": split["processor"],
            "reason": f"Disposal fee payout for request {request_id}",
            "status": "pending",
        }).execute()

    return ok({"status": payload.status})


# ── List Requests ─────────────────────────────────────────────────────────────

@router.get("/requests")
async def list_requests(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
    supabase=Depends(get_supabase),
):
    query = supabase.table("waste_requests").select("*")
    if current_user["role"] == "producer":
        query = query.eq("producer_id", current_user["id"])
    elif current_user["role"] != "admin":
        return {"success": False, "error": "Forbidden"}

    offset = (page - 1) * page_size
    result = query.range(offset, offset + page_size - 1).order("created_at", desc=True).execute()
    return ok({"requests": result.data})
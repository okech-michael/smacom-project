from fastapi import APIRouter, Depends, Query
from app.db.supabase_client import get_supabase
from app.core.dependencies import get_current_user, require_role
from app.models.iot import IoTReading, ProcessingUnitCreate
from app.services.alert_engine import evaluate_reading
from app.core.realtime import broadcast_iot_reading
from datetime import datetime, timezone

router = APIRouter(tags=["IoT"])


def ok(data):
    return {"success": True, "data": data}


async def _process_reading(reading: IoTReading, supabase):
    """Shared logic for MQTT and HTTP-submitted readings."""
    data = reading.model_dump(exclude_none=True)
    if "recorded_at" not in data:
        data["recorded_at"] = datetime.now(timezone.utc).isoformat()
    else:
        data["recorded_at"] = data["recorded_at"].isoformat()

    supabase.table("iot_readings").insert(data).execute()
    await evaluate_reading(reading, supabase)
    await broadcast_iot_reading(reading.unit_id, data)


# ── Submit Reading (HTTP fallback) ────────────────────────────────────────────

@router.post("/readings")
async def submit_reading(
    reading: IoTReading,
    supabase=Depends(get_supabase),
):
    await _process_reading(reading, supabase)
    return ok({"message": "Reading recorded"})


# ── Get Readings ──────────────────────────────────────────────────────────────

@router.get("/units/{unit_id}/readings")
async def get_readings(
    unit_id: str,
    history: bool = Query(False),
    current_user: dict = Depends(get_current_user),
    supabase=Depends(get_supabase),
):
    query = supabase.table("iot_readings").select("*").eq("unit_id", unit_id).order("recorded_at", desc=True)
    if history:
        query = query.limit(100)
    else:
        query = query.limit(1)

    result = query.execute()
    data = result.data
    return ok({"readings": data if history else (data[0] if data else None)})


# ── Alerts ────────────────────────────────────────────────────────────────────

@router.get("/alerts")
async def list_alerts(
    resolved: bool = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
    supabase=Depends(get_supabase),
):
    query = supabase.table("iot_alerts").select("*, processing_units!inner(processor_id)")

    if current_user["role"] == "processor":
        query = query.eq("processing_units.processor_id", current_user["id"])
    elif current_user["role"] != "admin":
        return {"success": False, "error": "Forbidden"}

    if resolved is not None:
        query = query.eq("resolved", resolved)

    offset = (page - 1) * page_size
    result = query.range(offset, offset + page_size - 1).order("triggered_at", desc=True).execute()
    return ok({"alerts": result.data})


@router.patch("/alerts/{alert_id}/resolve")
async def resolve_alert(
    alert_id: str,
    current_user: dict = Depends(get_current_user),
    supabase=Depends(get_supabase),
):
    if current_user["role"] not in ("processor", "admin"):
        return {"success": False, "error": "Forbidden"}

    supabase.table("iot_alerts").update({
        "resolved": True,
        "resolved_at": datetime.now(timezone.utc).isoformat(),
    }).eq("id", alert_id).execute()

    # Look up unit_id and restore status
    alert = supabase.table("iot_alerts").select("unit_id").eq("id", alert_id).single().execute().data
    if alert:
        supabase.table("processing_units").update({"status": "active"}).eq("id", alert["unit_id"]).execute()

    return ok({"message": "Alert resolved"})
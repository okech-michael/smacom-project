from fastapi import APIRouter, Depends, Query
from app.db.supabase_client import get_supabase
from app.core.dependencies import require_role
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/admin", tags=["Admin"])


def ok(data):
    return {"success": True, "data": data}


class SystemSettingsUpdate(BaseModel):
    credit_rate_per_kg: Optional[float] = None
    base_disposal_fee_per_kg: Optional[float] = None
    premium_plan_monthly_price: Optional[float] = None
    premium_plan_annual_price: Optional[float] = None
    co2_conversion_factor: Optional[float] = None
    carbon_credit_factor: Optional[float] = None


class OrderStatusUpdate(BaseModel):
    status: str


# ── Dashboard ─────────────────────────────────────────────────────────────────

@router.get("/dashboard")
async def dashboard(
    current_user: dict = Depends(require_role("admin")),
    supabase=Depends(get_supabase),
):
    from datetime import datetime, timezone
    month_start = datetime.now(timezone.utc).replace(day=1, hour=0, minute=0, second=0, microsecond=0).isoformat()

    # Waste collected this month
    intake = supabase.table("waste_intake_log").select("quantity_kg").gte("logged_at", month_start).execute()
    total_waste_kg = sum(r["quantity_kg"] for r in (intake.data or []))

    # Active users
    active_users = supabase.table("users").select("id", count="exact").eq("status", "verified").execute()

    # Platform revenue
    disposal_commissions = supabase.table("payouts").select("amount").execute()
    marketplace_payments = supabase.table("payments").select("amount").eq("reference_type", "order").eq("status", "completed").execute()
    course_payments = supabase.table("payments").select("amount").eq("reference_type", "course").eq("status", "completed").execute()

    disposal_revenue = sum(r["amount"] for r in (disposal_commissions.data or [])) * 0.05
    marketplace_revenue = sum(p["amount"] for p in (marketplace_payments.data or [])) * 0.07
    course_revenue = sum(p["amount"] for p in (course_payments.data or []))

    return ok({
        "total_waste_collected_kg": total_waste_kg,
        "active_user_count": active_users.count or 0,
        "platform_revenue": {
            "disposal_commissions": round(disposal_revenue, 2),
            "marketplace_commissions": round(marketplace_revenue, 2),
            "course_fees": round(course_revenue, 2),
            "total": round(disposal_revenue + marketplace_revenue + course_revenue, 2),
        },
    })


# ── Environmental Impact ──────────────────────────────────────────────────────

@router.get("/environmental-impact")
async def environmental_impact(
    current_user: dict = Depends(require_role("admin")),
    supabase=Depends(get_supabase),
):
    intake = supabase.table("waste_intake_log").select("quantity_kg").execute()
    total_kg = sum(r["quantity_kg"] for r in (intake.data or []))
    total_mt = total_kg / 1000

    settings = {r["key"]: float(r["value"]) for r in
                (supabase.table("system_settings").select("key, value").execute().data or [])}

    co2_factor = settings.get("co2_conversion_factor", 0.44)
    credit_factor = settings.get("carbon_credit_factor", 0.85)

    co2_saved = total_mt * co2_factor
    carbon_credits = co2_saved * credit_factor

    return ok({
        "waste_diverted_mt": round(total_mt, 3),
        "co2_saved_mt": round(co2_saved, 3),
        "carbon_credits_generated": round(carbon_credits, 3),
    })


# ── Revenue ───────────────────────────────────────────────────────────────────

@router.get("/revenue")
async def revenue(
    current_user: dict = Depends(require_role("admin")),
    supabase=Depends(get_supabase),
):
    payments = supabase.table("payments").select("amount, reference_type")\
        .eq("status", "completed").execute().data or []

    disposal = sum(p["amount"] for p in payments if p["reference_type"] == "waste_request") * 0.05
    marketplace = sum(p["amount"] for p in payments if p["reference_type"] == "order") * 0.07
    courses = sum(p["amount"] for p in payments if p["reference_type"] == "course")

    return ok({
        "disposal_commissions": round(disposal, 2),
        "marketplace_commissions": round(marketplace, 2),
        "course_fees": round(courses, 2),
        "total": round(disposal + marketplace + courses, 2),
    })


# ── IoT Status ────────────────────────────────────────────────────────────────

@router.get("/iot/status")
async def iot_status(
    current_user: dict = Depends(require_role("admin")),
    supabase=Depends(get_supabase),
):
    units = supabase.table("processing_units").select("*, users!processor_id(full_name)").execute().data or []
    for unit in units:
        reading = supabase.table("iot_readings").select("*")\
            .eq("unit_id", unit["id"]).order("recorded_at", desc=True).limit(1).execute().data
        unit["latest_reading"] = reading[0] if reading else None
        alerts = supabase.table("iot_alerts").select("id")\
            .eq("unit_id", unit["id"]).eq("resolved", False).execute().data
        unit["unresolved_alert_count"] = len(alerts)
    return ok({"units": units})


# ── Production Trend ──────────────────────────────────────────────────────────

@router.get("/analytics/production-trend")
async def production_trend(
    current_user: dict = Depends(require_role("admin")),
    supabase=Depends(get_supabase),
):
    result = supabase.rpc("monthly_production_trend").execute()
    return ok({"trend": result.data})


# ── Orders (Admin) ────────────────────────────────────────────────────────────

@router.patch("/orders/{order_id}/approve")
async def approve_order(
    order_id: str,
    current_user: dict = Depends(require_role("admin")),
    supabase=Depends(get_supabase),
):
    supabase.table("orders").update({"status": "approved"}).eq("id", order_id).execute()
    return ok({"message": "Order approved"})


@router.get("/orders")
async def list_orders(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(require_role("admin")),
    supabase=Depends(get_supabase),
):
    offset = (page - 1) * page_size
    result = supabase.table("orders").select("*, order_items(*)")\
        .range(offset, offset + page_size - 1).order("created_at", desc=True).execute()
    return ok({"orders": result.data})


# ── System Settings ───────────────────────────────────────────────────────────

@router.post("/settings")
async def update_settings(
    payload: SystemSettingsUpdate,
    current_user: dict = Depends(require_role("admin")),
    supabase=Depends(get_supabase),
):
    updates = payload.model_dump(exclude_none=True)
    for key, value in updates.items():
        supabase.table("system_settings").upsert({"key": key, "value": str(value)}).execute()
    return ok({"updated": list(updates.keys())})
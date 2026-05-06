from fastapi import APIRouter, Depends, Query
from app.db.supabase_client import get_supabase
from app.core.dependencies import require_role, get_current_user
from app.services.ai_recommendation import recommend
from app.services.commission import split_marketplace_purchase
from app.services.mpesa import initiate_stk_push
from app.services.flutterwave import initiate_payment
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter(prefix="/farmer", tags=["Farmer"])


def ok(data):
    return {"success": True, "data": data}


class SoilTestCreate(BaseModel):
    nitrogen: Optional[float] = None
    phosphorus: Optional[float] = None
    potassium: Optional[float] = None
    ph_level: Optional[float] = None
    crop_type: Optional[str] = None


class OrderItemIn(BaseModel):
    product_id: str
    quantity: float


class OrderCreate(BaseModel):
    items: List[OrderItemIn]
    provider: str  # mpesa | flutterwave
    phone: Optional[str] = None


# ── Soil Test ─────────────────────────────────────────────────────────────────

@router.post("/soil-test")
async def submit_soil_test(
    payload: SoilTestCreate,
    current_user: dict = Depends(require_role("farmer")),
    supabase=Depends(get_supabase),
):
    data = payload.model_dump(exclude_none=True)
    data["farmer_id"] = current_user["id"]
    result = supabase.table("soil_tests").insert(data).execute()
    soil = result.data[0]

    recommendation = recommend(payload)
    return ok({"soil_test": soil, "recommendation": recommendation})


@router.get("/recommendation")
async def get_recommendation(
    current_user: dict = Depends(require_role("farmer")),
    supabase=Depends(get_supabase),
):
    result = supabase.table("soil_tests").select("*")\
        .eq("farmer_id", current_user["id"])\
        .order("submitted_at", desc=True).limit(1).execute()

    if not result.data:
        return ok({"message": "No soil test found. Submit a soil test first.", "recommendations": []})

    from app.models.waste import WasteRequestCreate  # reuse type trick
    from app.services.ai_recommendation import SoilInput
    soil_data = result.data[0]
    soil = SoilInput(**soil_data)
    recommendation = recommend(soil)
    return ok(recommendation)


# ── Orders ────────────────────────────────────────────────────────────────────

@router.post("/orders")
async def place_order(
    payload: OrderCreate,
    current_user: dict = Depends(require_role("farmer")),
    supabase=Depends(get_supabase),
):
    # Calculate total
    total = 0.0
    items_with_price = []
    for item in payload.items:
        product = supabase.table("products").select("price, quantity_available, is_active")\
            .eq("id", item.product_id).single().execute().data
        if not product or not product["is_active"]:
            return {"success": False, "error": f"Product {item.product_id} not available"}
        if product["quantity_available"] < item.quantity:
            return {"success": False, "error": f"Insufficient stock for product {item.product_id}"}
        line = item.quantity * product["price"]
        total += line
        items_with_price.append({"product_id": item.product_id, "quantity": item.quantity, "unit_price": product["price"]})

    split = split_marketplace_purchase(total)

    # Insert order
    order = supabase.table("orders").insert({
        "farmer_id": current_user["id"],
        "status": "pending",
        "total_amount": total,
        "platform_commission": split["smacom"],
        "seller_payout": split["seller"],
    }).execute().data[0]

    # Insert order items
    for item in items_with_price:
        item["order_id"] = order["id"]
        supabase.table("order_items").insert(item).execute()

    # Initiate payment
    payment = supabase.table("payments").insert({
        "user_id": current_user["id"],
        "reference_id": order["id"],
        "reference_type": "order",
        "amount": total,
        "provider": payload.provider,
        "status": "pending",
    }).execute().data[0]

    if payload.provider == "mpesa":
        stk = await initiate_stk_push(payload.phone, total, payment["id"], "SMACOM Marketplace Order")
        return ok({"order_id": order["id"], "payment_id": payment["id"], "checkout_request_id": stk.get("CheckoutRequestID")})
    else:
        link = await initiate_payment(total, current_user["email"], current_user["full_name"], payment["id"])
        return ok({"order_id": order["id"], "payment_id": payment["id"], "payment_url": link})


@router.get("/orders")
async def list_orders(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(require_role("farmer")),
    supabase=Depends(get_supabase),
):
    offset = (page - 1) * page_size
    result = supabase.table("orders").select("*, order_items(*)")\
        .eq("farmer_id", current_user["id"])\
        .range(offset, offset + page_size - 1)\
        .order("created_at", desc=True).execute()
    return ok({"orders": result.data})
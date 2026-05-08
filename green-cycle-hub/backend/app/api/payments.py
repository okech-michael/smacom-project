from fastapi import APIRouter, Depends, HTTPException
from app.db.supabase_client import get_supabase
from app.core.dependencies import get_current_user
from app.services.mpesa import initiate_stk_push
from app.services.flutterwave import initiate_payment
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone

router = APIRouter(tags=["Payments"])


def ok(data):
    return {"success": True, "data": data}


class PaymentRequest(BaseModel):
    order_id: str
    provider: str
    amount: float
    phone: Optional[str] = None


@router.post("/checkout")
async def checkout(
    payload: PaymentRequest,
    current_user: dict = Depends(get_current_user),
    supabase=Depends(get_supabase),
):
    """Create a payment record and initiate payment via selected provider."""
    payment_data = {
        "user_id": current_user.get("id"),
        "order_id": payload.order_id,
        "amount": payload.amount,
        "provider": payload.provider,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    result = supabase.table("payments").insert(payment_data).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create payment record")

    payment = result.data[0]

    if payload.provider == "mpesa":
        if not payload.phone:
            raise HTTPException(status_code=400, detail="Phone number is required for M-Pesa")
        response = await initiate_stk_push(payload.phone, payload.amount, payment["id"], "SMACOM Payment")
        if not response or not response.get("CheckoutRequestID"):
            raise HTTPException(status_code=502, detail="Failed to initiate M-Pesa payment")
        return ok({"payment_id": payment["id"], "checkout_request_id": response.get("CheckoutRequestID")})

    if payload.provider == "flutterwave":
        response = await initiate_payment(payload.amount, current_user.get("email"), current_user.get("full_name"), payment["id"])
        if not response:
            raise HTTPException(status_code=502, detail="Failed to initiate Flutterwave payment")
        return ok({"payment_id": payment["id"], "payment_url": response})

    raise HTTPException(status_code=400, detail="Unsupported payment provider")


@router.get("/status/{payment_id}")
def payment_status(payment_id: str, supabase=Depends(get_supabase)):
    """Get payment status by payment ID."""
    result = supabase.table("payments").select("*").eq("id", payment_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Payment not found")
    return ok(result.data)


@router.get("/history")
def payment_history(
    current_user: dict = Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    """Get payment history for current user."""
    result = supabase.table("payments").select("*").eq("user_id", current_user.get("id")).order("created_at", desc=True).execute()
    return ok(result.data if result.data else [])
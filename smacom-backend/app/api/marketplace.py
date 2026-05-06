from fastapi import APIRouter, Depends, Query
from app.db.supabase_client import get_supabase
from app.core.dependencies import get_current_user, require_role
from app.services.commission import split_marketplace_purchase
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter(prefix="/marketplace", tags=["Marketplace"])


def ok(data):
    return {"success": True, "data": data}


class ProductCreate(BaseModel):
    name: str
    category: str
    description: Optional[str] = None
    price: float
    unit: str
    quantity_available: float
    quality_grade: Optional[str] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    quantity_available: Optional[float] = None
    is_active: Optional[bool] = None


class OrderItemIn(BaseModel):
    product_id: str
    quantity: float


class OrderCreate(BaseModel):
    items: List[OrderItemIn]
    provider: str  # mpesa | flutterwave
    phone: Optional[str] = None


# ── Products ──────────────────────────────────────────────────────────────────

@router.get("/products")
async def list_products(
    category: str = Query(None),
    price_min: float = Query(None),
    price_max: float = Query(None),
    seller_id: str = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    supabase=Depends(get_supabase),
):
    query = supabase.table("products").select("*, users!seller_id(full_name)").eq("is_active", True)
    if category:
        query = query.eq("category", category)
    if price_min is not None:
        query = query.gte("price", price_min)
    if price_max is not None:
        query = query.lte("price", price_max)
    if seller_id:
        query = query.eq("seller_id", seller_id)

    offset = (page - 1) * page_size
    result = query.range(offset, offset + page_size - 1).execute()
    return ok({"products": result.data, "page": page, "page_size": page_size})


@router.get("/products/{product_id}")
async def get_product(product_id: str, supabase=Depends(get_supabase)):
    result = supabase.table("products").select("*, users!seller_id(full_name, organisation)").eq("id", product_id).single().execute()
    if not result.data:
        return {"success": False, "error": "Product not found"}
    return ok(result.data)


@router.post("/products")
async def create_product(
    payload: ProductCreate,
    current_user: dict = Depends(require_role("processor")),
    supabase=Depends(get_supabase),
):
    result = supabase.table("products").insert({
        "seller_id": current_user["id"],
        **payload.model_dump(),
    }).execute()
    return ok(result.data[0])


@router.patch("/products/{product_id}")
async def update_product(
    product_id: str,
    payload: ProductUpdate,
    current_user: dict = Depends(get_current_user),
    supabase=Depends(get_supabase),
):
    if current_user["role"] not in ("processor", "admin"):
        return {"success": False, "error": "Forbidden"}

    updates = payload.model_dump(exclude_none=True)
    query = supabase.table("products").update(updates).eq("id", product_id)
    if current_user["role"] == "processor":
        query = query.eq("seller_id", current_user["id"])
    result = query.execute()
    return ok(result.data[0] if result.data else {})
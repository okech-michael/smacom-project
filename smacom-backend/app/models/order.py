from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ---------- Orders ----------

class OrderItemCreate(BaseModel):
    product_id: str
    quantity: float


class OrderCreate(BaseModel):
    items: List[OrderItemCreate]


class OrderOut(BaseModel):
    id: str
    farmer_id: str
    status: str
    total_amount: float
    platform_commission: float
    seller_payout: float
    created_at: datetime


# ---------- Payments ----------

class PaymentInitiate(BaseModel):
    amount: float
    provider: str  # mpesa | flutterwave
    reference_id: str
    reference_type: str  # waste_request | order | subscription | course


# ---------- Courses ----------

class CourseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    duration_hours: Optional[float] = None
    fee: float


class CourseModuleCreate(BaseModel):
    title: str
    video_url: Optional[str] = None
    order_index: int
    has_quiz: bool = False


class EnrolmentProgressUpdate(BaseModel):
    progress_pct: float


# ---------- Notifications ----------

class NotificationOut(BaseModel):
    id: str
    title: str
    body: str
    type: Optional[str]
    is_read: bool
    created_at: datetime
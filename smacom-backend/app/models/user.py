from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None
    organisation: Optional[str] = None
    role: str  # producer | processor | farmer | learner | admin


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    organisation: Optional[str] = None
    facility_location: Optional[dict] = None  # {lat, lng}


class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    phone: Optional[str]
    organisation: Optional[str]
    role: str
    status: str
    subscription_plan: str
    credits_balance: float
    eco_badge: str
    created_at: datetime
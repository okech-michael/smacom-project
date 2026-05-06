from pydantic import BaseModel, Field
from typing import Literal, Optional


class WasteRequestCreate(BaseModel):
    waste_category: str
    waste_subtype: str
    additional_notes: Optional[str] = None
    quantity_kg: float = Field(gt=0)
    location_lat: float
    location_lng: float
    location_address: str


class WasteStatusUpdate(BaseModel):
    status: Literal['en_route', 'collected']

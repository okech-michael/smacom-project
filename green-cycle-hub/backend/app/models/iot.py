"""IoT Data Models for the SMACOM backend."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class IoTReading(BaseModel):
    """IoT sensor reading model."""
    unit_id: str
    temperature_c: Optional[float] = None
    moisture_pct: Optional[float] = None
    fill_level_pct: Optional[float] = None
    progress_pct: Optional[float] = None
    recorded_at: Optional[datetime] = None

    model_config = {
        "extra": "ignore",
    }


class ProcessingUnitCreate(BaseModel):
    unit_name: str
    processor_id: str
    location_lat: float
    location_lng: float
    status: Optional[str] = "active"

    model_config = {
        "extra": "ignore",
    }

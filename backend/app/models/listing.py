from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ListingBase(BaseModel):
    title: str
    description: Optional[str] = None
    quantity_liters: float = Field(..., gt=0)
    price_per_liter: float = Field(..., gt=0)
    location: str
    is_active: bool = True

class ListingCreate(ListingBase):
    pass

class ListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    quantity_liters: Optional[float] = Field(None, gt=0)
    price_per_liter: Optional[float] = Field(None, gt=0)
    location: Optional[str] = None
    is_active: Optional[bool] = None

class ListingResponse(ListingBase):
    id: str
    seller_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

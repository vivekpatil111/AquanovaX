from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TransactionBase(BaseModel):
    listing_id: str
    quantity_liters: float = Field(..., gt=0)

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: str
    buyer_id: str
    seller_id: str
    total_price: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

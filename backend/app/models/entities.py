from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any
from datetime import datetime
from uuid import UUID

class CustomerBase(BaseModel):
    full_name: str
    email: str
    mobile: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    wallet_balance: float = 0.0

class Customer(CustomerBase):
    id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class SupplierBase(BaseModel):
    name: str
    rating: float = 0.0
    trust_score: float = 0.0
    badge: str = 'bronze'
    tds: Optional[float] = None
    ph: Optional[float] = None
    price: float
    eta: Optional[str] = None
    coverage_area: Optional[List[str]] = None

class Supplier(SupplierBase):
    id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class OrderBase(BaseModel):
    supplier_id: UUID
    quantity: float
    amount: float
    status: str = 'pending'
    delivery_date: datetime
    eta: Optional[str] = None

class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
    id: UUID
    customer_id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class TrackingBase(BaseModel):
    current_status: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    eta: Optional[str] = None

class Tracking(TrackingBase):
    id: UUID
    order_id: UUID
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ReviewBase(BaseModel):
    supplier_id: UUID
    rating: float
    review_text: Optional[str] = None

class ReviewCreate(ReviewBase):
    pass

class Review(ReviewBase):
    id: UUID
    customer_id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class WalletTransactionBase(BaseModel):
    type: str
    amount: float

class WalletTransaction(WalletTransactionBase):
    id: UUID
    customer_id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class NotificationBase(BaseModel):
    title: str
    message: str
    status: str = 'unread'

class Notification(NotificationBase):
    id: UUID
    customer_id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class TankerBase(BaseModel):
    registration_number: str
    type: str
    capacity: float
    current_load: float = 0.0
    status: str = 'available'
    supplier_id: UUID

class TankerCreate(TankerBase):
    pass

class Tanker(TankerBase):
    id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from uuid import UUID
from app.database import get_supabase
from supabase import Client

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.get("/")
async def get_orders(customer_id: Optional[UUID] = None, supplier_id: Optional[UUID] = None, supabase: Client = Depends(get_supabase)):
    try:
        query = supabase.table("orders").select("*, suppliers(*), customers(*)")
        if customer_id:
            query = query.eq("customer_id", customer_id)
        if supplier_id:
            query = query.eq("supplier_id", supplier_id)
        
        response = query.order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/{order_id}")
async def get_order(order_id: UUID, supabase: Client = Depends(get_supabase)):
    try:
        response = supabase.table("orders").select("*, suppliers(*), tracking(*), customers(*)").eq("id", order_id).single().execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

@router.post("/")
async def create_order(order: dict, supabase: Client = Depends(get_supabase)):
    try:
        # Expects: customer_id, supplier_id, quantity, amount, delivery_date
        response = supabase.table("orders").insert(order).execute()
        new_order = response.data[0]
        
        # Create initial tracking
        supabase.table("tracking").insert({
            "order_id": new_order["id"],
            "current_status": "pending",
            "eta": new_order.get("eta")
        }).execute()
        
        return new_order
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

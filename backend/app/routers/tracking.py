from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from uuid import UUID
from app.database import get_supabase
from supabase import Client

router = APIRouter(prefix="/tracking", tags=["Tracking"])

@router.get("/{order_id}")
async def get_tracking(order_id: UUID, supabase: Client = Depends(get_supabase)):
    try:
        response = supabase.table("tracking").select("*").eq("order_id", order_id).single().execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tracking record not found")

@router.put("/{order_id}")
async def update_tracking(order_id: UUID, tracking: dict, supabase: Client = Depends(get_supabase)):
    try:
        response = supabase.table("tracking").update(tracking).eq("order_id", order_id).execute()
        
        # Also update order status if tracking status changes
        if "current_status" in tracking:
            supabase.table("orders").update({"status": tracking["current_status"]}).eq("id", order_id).execute()
            
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

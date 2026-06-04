from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from uuid import UUID
from app.database import get_supabase
from supabase import Client

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("/{customer_id}")
async def get_notifications(customer_id: UUID, supabase: Client = Depends(get_supabase)):
    try:
        response = supabase.table("notifications").select("*").eq("customer_id", customer_id).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.put("/{notification_id}/read")
async def mark_read(notification_id: UUID, supabase: Client = Depends(get_supabase)):
    try:
        response = supabase.table("notifications").update({"status": "read"}).eq("id", notification_id).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

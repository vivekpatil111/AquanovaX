from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from uuid import UUID
from app.database import get_supabase
from supabase import Client

router = APIRouter(prefix="/complaints", tags=["Complaints"])

@router.get("/")
async def get_complaints(supabase: Client = Depends(get_supabase)):
    try:
        response = supabase.table("complaints").select("*, customers(full_name), suppliers(name)").order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/{complaint_id}")
async def get_complaint(complaint_id: UUID, supabase: Client = Depends(get_supabase)):
    try:
        response = supabase.table("complaints").select("*").eq("id", complaint_id).single().execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")

@router.post("/")
async def create_complaint(complaint: dict, supabase: Client = Depends(get_supabase)):
    try:
        response = supabase.table("complaints").insert(complaint).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.put("/{complaint_id}")
async def update_complaint(complaint_id: UUID, complaint_update: dict, supabase: Client = Depends(get_supabase)):
    try:
        response = supabase.table("complaints").update(complaint_update).eq("id", complaint_id).execute()
        if not response.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Complaint not found")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

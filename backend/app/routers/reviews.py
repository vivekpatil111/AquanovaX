from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from uuid import UUID
from app.database import get_supabase
from supabase import Client

router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.get("/{supplier_id}")
async def get_reviews(supplier_id: UUID, supabase: Client = Depends(get_supabase)):
    try:
        response = supabase.table("reviews").select("*, customers(full_name)").eq("supplier_id", supplier_id).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/")
async def create_review(review: dict, supabase: Client = Depends(get_supabase)):
    try:
        response = supabase.table("reviews").insert(review).execute()
        
        # In a real app we'd update supplier rating average
        # supplier_id = review["supplier_id"]
        # rating = review["rating"]
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

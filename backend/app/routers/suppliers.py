from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from uuid import UUID
from app.database import get_supabase
from supabase import Client

router = APIRouter(prefix="/suppliers", tags=["Suppliers"])

@router.get("/")
async def get_suppliers(supabase: Client = Depends(get_supabase)):
    try:
        response = supabase.table("suppliers").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/{supplier_id}")
async def get_supplier(supplier_id: UUID, supabase: Client = Depends(get_supabase)):
    try:
        response = supabase.table("suppliers").select("*, reviews(*)").eq("id", supplier_id).single().execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supplier not found")

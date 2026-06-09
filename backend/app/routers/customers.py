from fastapi import APIRouter, Depends, HTTPException, status
from app.database import get_supabase
from supabase import Client

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.get("/")
async def get_customers(supabase: Client = Depends(get_supabase)):
    try:
        response = supabase.table("customers").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from ..database import get_supabase
from ..models.entities import Tanker, TankerCreate
from supabase import Client

router = APIRouter(prefix="/tankers", tags=["tankers"])

@router.get("/", response_model=List[Tanker])
async def get_tankers(supplier_id: Optional[str] = None, db: Client = Depends(get_supabase)):
    query = db.table("tankers").select("*")
    if supplier_id:
        query = query.eq("supplier_id", supplier_id)
    
    res = query.execute()
    return res.data

@router.post("/", response_model=Tanker)
async def create_tanker(tanker: TankerCreate, db: Client = Depends(get_supabase)):
    data = tanker.model_dump()
    data['supplier_id'] = str(data['supplier_id'])  # Convert UUID to string for Supabase JSON serialization
    res = db.table("tankers").insert(data).execute()
    if not res.data:
        raise HTTPException(status_code=400, detail="Failed to create tanker")
    return res.data[0]

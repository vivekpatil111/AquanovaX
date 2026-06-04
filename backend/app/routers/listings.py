from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.models.listing import ListingCreate, ListingUpdate, ListingResponse
from app.middleware.auth import get_current_user
from app.database import get_supabase

router = APIRouter()

@router.get("/", response_model=List[dict])
async def get_all_listings():
    supabase = get_supabase()
    try:
        response = supabase.table("listings").select("*").eq("is_active", True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/{listing_id}")
async def get_listing(listing_id: str):
    supabase = get_supabase()
    try:
        response = supabase.table("listings").select("*").eq("id", listing_id).execute()
        if not response.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/")
async def create_listing(listing: ListingCreate, current_user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    try:
        data = listing.model_dump()
        data["seller_id"] = current_user["id"]
        response = supabase.table("listings").insert(data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.put("/{listing_id}")
async def update_listing(listing_id: str, listing: ListingUpdate, current_user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    try:
        # Check ownership
        existing = supabase.table("listings").select("seller_id").eq("id", listing_id).execute()
        if not existing.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")
        if existing.data[0]["seller_id"] != current_user["id"]:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this listing")

        update_data = listing.model_dump(exclude_unset=True)
        if not update_data:
            return {"message": "No fields to update"}
            
        response = supabase.table("listings").update(update_data).eq("id", listing_id).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/{listing_id}")
async def delete_listing(listing_id: str, current_user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    try:
        # Check ownership
        existing = supabase.table("listings").select("seller_id").eq("id", listing_id).execute()
        if not existing.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")
        if existing.data[0]["seller_id"] != current_user["id"]:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this listing")

        supabase.table("listings").delete().eq("id", listing_id).execute()
        return {"message": "Listing deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

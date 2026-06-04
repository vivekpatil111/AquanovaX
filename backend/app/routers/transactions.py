from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.models.transaction import TransactionCreate
from app.middleware.auth import get_current_user
from app.database import get_supabase

router = APIRouter()

@router.get("/")
async def get_my_transactions(current_user: dict = Depends(get_current_user)):
    """Get all transactions for the current user (either as buyer or seller)"""
    supabase = get_supabase()
    try:
        user_id = current_user["id"]
        # In a real app, this might be a complex query. Here we do two and combine them, or use Supabase's or syntax
        response = supabase.table("transactions").select("*").or_(f"buyer_id.eq.{user_id},seller_id.eq.{user_id}").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/")
async def create_transaction(transaction: TransactionCreate, current_user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    try:
        # 1. Get the listing to calculate total price and check availability
        listing_resp = supabase.table("listings").select("*").eq("id", transaction.listing_id).execute()
        if not listing_resp.data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")
        
        listing = listing_resp.data[0]
        if listing["seller_id"] == current_user["id"]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot buy your own listing")
            
        if listing["quantity_liters"] < transaction.quantity_liters:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not enough quantity available")

        # 2. Calculate price
        total_price = listing["price_per_liter"] * transaction.quantity_liters

        # 3. Create transaction record
        tx_data = {
            "listing_id": transaction.listing_id,
            "buyer_id": current_user["id"],
            "seller_id": listing["seller_id"],
            "quantity_liters": transaction.quantity_liters,
            "total_price": total_price,
            "status": "pending"
        }
        
        tx_resp = supabase.table("transactions").insert(tx_data).execute()
        
        # 4. (Optional) Update listing quantity or status - usually done in a database transaction or RPC in Supabase
        
        return tx_resp.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

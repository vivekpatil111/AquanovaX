from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from uuid import UUID
from app.database import get_supabase
from supabase import Client

router = APIRouter(prefix="/wallet", tags=["Wallet"])

@router.get("/{customer_id}")
async def get_wallet_transactions(customer_id: UUID, supabase: Client = Depends(get_supabase)):
    try:
        response = supabase.table("wallet_transactions").select("*").eq("customer_id", customer_id).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/")
async def add_transaction(transaction: dict, supabase: Client = Depends(get_supabase)):
    try:
        response = supabase.table("wallet_transactions").insert(transaction).execute()
        
        # In a real app we'd wrap this in a postgres transaction or function to ensure atomicity
        # Update customer balance
        customer_id = transaction["customer_id"]
        amount = transaction["amount"]
        type = transaction["type"]
        
        cust_res = supabase.table("customers").select("wallet_balance").eq("id", customer_id).single().execute()
        if cust_res.data:
            current_bal = float(cust_res.data.get("wallet_balance", 0))
            new_bal = current_bal + amount if type == "credit" or type == "refund" else current_bal - amount
            supabase.table("customers").update({"wallet_balance": new_bal}).eq("id", customer_id).execute()
            
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

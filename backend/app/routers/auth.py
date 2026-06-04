from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from app.models.user import UserCreate, UserLogin
from app.database import get_supabase

router = APIRouter()

@router.post("/register")
async def register(user: UserCreate):
    supabase = get_supabase()
    try:
        response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password,
            "options": {
                "data": {
                    "full_name": user.full_name,
                    "role": user.role
                }
            }
        })
        # Insert into the appropriate public table so foreign keys work
        user_id = response.user.id
        if user.role == 'supplier':
            supabase.table("suppliers").insert({
                "id": user_id,
                "name": user.full_name,
                "price": 500 # default price
            }).execute()
        else:
            supabase.table("customers").insert({
                "id": user_id,
                "full_name": user.full_name,
                "email": user.email
            }).execute()
            
        return {"message": "User registered successfully", "user": response.user}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/login")
async def login(user: UserLogin):
    supabase = get_supabase()
    try:
        response = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })
        return {"access_token": response.session.access_token, "user": response.user}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

@router.post("/logout")
async def logout():
    # In a fully stateless JWT setup, logout is often handled client-side by deleting the token.
    # We can also call Supabase signOut if we pass the token.
    return {"message": "Logged out. Please remove token from client."}

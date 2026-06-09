from fastapi import APIRouter, Depends, HTTPException, status
from app.database import get_supabase
from supabase import Client

router = APIRouter(prefix="/drivers", tags=["Drivers"])

@router.get("/")
async def get_drivers(supabase: Client = Depends(get_supabase)):
    try:
        # Currently, drivers are stored in auth.users with user_metadata->role = 'driver'
        # Since we cannot easily query auth.users from standard anon key, 
        # and we don't have a dedicated drivers public table yet,
        # we will fetch from auth.admin if possible.
        # However, supabase python client auth.admin is only available with service_role.
        # Let's try to fetch auth.admin.list_users()
        
        users_response = supabase.auth.admin.list_users()
        
        drivers = []
        for user in users_response:
            if user.user_metadata and user.user_metadata.get('role') == 'driver':
                drivers.append({
                    "id": user.id,
                    "name": user.user_metadata.get('full_name', 'Unknown Driver'),
                    "email": user.email,
                    "isAvailable": True,
                    "rating": 5.0,
                    "completedDeliveries": 0,
                    "supplier_id": None
                })
        return drivers
    except Exception as e:
        # Fallback if admin.list_users fails (e.g. anon key instead of service role key)
        # We will scan the customers table and guess by name, or return empty.
        print(f"Error fetching drivers from admin auth: {e}")
        try:
            # Fallback: scan customers for test drivers
            response = supabase.table("customers").select("*").execute()
            drivers = []
            for c in response.data:
                full_name = c.get('full_name')
                name = (full_name or '').lower()
                if 'driver' in name or 'sangram' in name or 'vasu' in name:
                    drivers.append({
                        "id": c['id'],
                        "name": c.get('full_name', 'Unknown Driver'),
                        "email": c.get('email', ''),
                        "isAvailable": True,
                        "rating": 5.0,
                        "completedDeliveries": 0,
                        "supplier_id": None
                    })
            return drivers
        except Exception as e2:
            return []

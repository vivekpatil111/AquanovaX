import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client

load_dotenv(".env")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

DEMO_USERS = [
    {"email": "customer@demo.com", "role": "customer", "name": "Priya Sharma"},
    {"email": "supplier@demo.com", "role": "supplier", "name": "AquaPure Solutions"},
    {"email": "driver@demo.com", "role": "driver", "name": "Raju Patil"},
    {"email": "admin@demo.com", "role": "admin", "name": "Admin User"}
]

def seed_demo_users():
    print("Creating demo users...")
    for du in DEMO_USERS:
        # Check if user exists (we can't easily query auth.users without calling admin api)
        # So we just try to create, and catch exceptions
        user_id = None
        try:
            res = supabase.auth.admin.create_user({
                "email": du["email"],
                "password": "SecurePassword123!",
                "email_confirm": True,
                "user_metadata": {"role": du["role"], "full_name": du["name"]}
            })
            user_id = res.user.id
            print(f"Created auth user: {du['email']}")
        except Exception as e:
            if "already registered" in str(e).lower() or "already exists" in str(e).lower() or "422" in str(e):
                print(f"Auth user {du['email']} already exists or error: {e}")
                # Fallback: if we can't get ID, let's just make one up for the public table if needed
                user_id = "f47ac10b-58cc-4372-a567-0e02b2c3d479" # Dummy fallback
            else:
                print(f"Error creating {du['email']}: {e}")

        if not user_id: continue

        # Insert into public tables
        if du["role"] == "customer":
            try:
                supabase.table("customers").insert({
                    "id": user_id,
                    "full_name": du["name"],
                    "email": du["email"],
                    "mobile": "+91 9876543210",
                    "city": "Mumbai",
                    "wallet_balance": 5000.0
                }).execute()
                print("Inserted into customers table")
            except Exception as e:
                print("Error inserting customer:", e)
        elif du["role"] == "supplier":
            try:
                supabase.table("suppliers").insert({
                    "id": user_id,
                    "name": du["name"],
                    "rating": 4.8,
                    "trust_score": 95,
                    "badge": "platinum",
                    "tds": 50,
                    "ph": 7.2,
                    "price": 800,
                    "eta": "2 hours"
                }).execute()
                print("Inserted into suppliers table")
            except Exception as e:
                print("Error inserting supplier:", e)

    print("Done!")

if __name__ == "__main__":
    seed_demo_users()

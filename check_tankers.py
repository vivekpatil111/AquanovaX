import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv("backend/.env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

try:
    res = supabase.table("tankers").select("*").limit(1).execute()
    print("SUCCESS")
    print(res.data)
except Exception as e:
    print("FAILED")
    print(str(e))

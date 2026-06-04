import asyncio
from app.database import get_supabase

async def main():
    supabase = get_supabase()
    customers = supabase.table("customers").select("*").limit(1).execute()
    suppliers = supabase.table("suppliers").select("*").limit(1).execute()
    
    print("CUSTOMER:", customers.data[0] if customers.data else "None")
    print("SUPPLIER:", suppliers.data[0] if suppliers.data else "None")

if __name__ == "__main__":
    asyncio.run(main())

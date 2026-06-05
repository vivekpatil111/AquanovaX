import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") # Use Service Role to use admin methods

supabase: Client = create_client(url, key)

try:
    print("Fetching users...")
    users_resp = supabase.auth.admin.list_users()
    users = getattr(users_resp, 'users', users_resp) if hasattr(users_resp, 'users') else users_resp
    
    admin_user = None
    # Some versions of supabase return a list directly or a UserList object
    if isinstance(users, list):
        for u in users:
            if getattr(u, 'email', '') == 'admin@demo.com' or (isinstance(u, dict) and u.get('email') == 'admin@demo.com'):
                admin_user = u
                break
    else:
        # Fallback if users is an object with 'users'
        user_list = getattr(users, 'users', [])
        for u in user_list:
            if getattr(u, 'email', '') == 'admin@demo.com':
                admin_user = u
                break

    if admin_user:
        user_id = getattr(admin_user, 'id', None) or (isinstance(admin_user, dict) and admin_user.get('id'))
        print("Found existing admin with ID:", user_id)
        # Update the password and confirm email
        supabase.auth.admin.update_user_by_id(user_id, {
            "password": "SecurePassword123!",
            "email_confirm": True,
            "user_metadata": {
                "role": "admin",
                "full_name": "Admin User"
            }
        })
        print("Successfully updated existing admin@demo.com password to 'SecurePassword123!' and confirmed email.")
    else:
        print("Admin user not found. Re-creating...")
        res = supabase.auth.admin.create_user({
            "email": "admin@demo.com",
            "password": "SecurePassword123!",
            "email_confirm": True,
            "user_metadata": {
                "role": "admin",
                "full_name": "Admin User"
            }
        })
        print("Admin user created:", res.user.email)
except Exception as e:
    print("Error:", e)

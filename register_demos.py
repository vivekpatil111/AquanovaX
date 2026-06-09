import urllib.request
import json

API_URL = "http://127.0.0.1:8000/api/auth/register"

demo_users = [
    {"email": "customer@demo.com", "password": "SecurePassword123!", "full_name": "Priya Sharma", "role": "customer"},
    {"email": "supplier@demo.com", "password": "SecurePassword123!", "full_name": "AquaPure Solutions", "role": "supplier"},
    {"email": "driver@demo.com", "password": "SecurePassword123!", "full_name": "Raju Patil", "role": "driver"},
    {"email": "admin@demo.com", "password": "SecurePassword123!", "full_name": "Admin User", "role": "admin"},
]

for user in demo_users:
    print(f"Registering {user['email']}...")
    try:
        data = json.dumps(user).encode('utf-8')
        req = urllib.request.Request(API_URL, data=data, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                print(f"Successfully registered {user['email']}")
            else:
                print(f"Failed: {response.read()}")
    except urllib.error.HTTPError as e:
        print(f"HTTPError for {user['email']}: {e.code} - {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Error: {e}")

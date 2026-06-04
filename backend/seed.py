import os
import random
import uuid
from datetime import datetime, timedelta
from dotenv import load_dotenv
from supabase import create_client
from faker import Faker

load_dotenv(".env")

# Must use Service Role Key to bypass rate limits and create users administratively
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_KEY:
    print("Error: SUPABASE_SERVICE_ROLE_KEY not found in .env")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
fake = Faker('en_IN')

# Configuration
NUM_CUSTOMERS = 100
NUM_SUPPLIERS = 50
NUM_ORDERS = 500
NUM_REVIEWS = 1000
NUM_WALLET_TX = 500

def seed_database():
    print("Starting MVP Database Seeding...")

    # 1. Generate Customers
    print(f"Generating {NUM_CUSTOMERS} Customers...")
    customers = []
    for i in range(NUM_CUSTOMERS):
        email = f"customer_{i}_{fake.uuid4()[:8]}@example.com"
        # Create Auth User
        user = supabase.auth.admin.create_user({
            "email": email,
            "password": "SecurePassword123!",
            "email_confirm": True,
            "user_metadata": {"role": "customer", "full_name": fake.name()}
        })
        user_id = user.user.id
        
        customers.append({
            "id": user_id,
            "full_name": fake.name(),
            "email": email,
            "mobile": fake.phone_number(),
            "address": fake.street_address(),
            "city": fake.city(),
            "state": fake.state(),
            "pincode": fake.postcode(),
            "wallet_balance": round(random.uniform(100.0, 5000.0), 2)
        })
    
    # Insert Customers
    for i in range(0, len(customers), 50):
        supabase.table("customers").insert(customers[i:i+50]).execute()

    # 2. Generate Suppliers
    print(f"Generating {NUM_SUPPLIERS} Suppliers...")
    suppliers = []
    for i in range(NUM_SUPPLIERS):
        email = f"supplier_{i}_{fake.uuid4()[:8]}@example.com"
        user = supabase.auth.admin.create_user({
            "email": email,
            "password": "SecurePassword123!",
            "email_confirm": True,
            "user_metadata": {"role": "supplier", "full_name": fake.company()}
        })
        user_id = user.user.id
        
        suppliers.append({
            "id": user_id,
            "name": fake.company(),
            "rating": round(random.uniform(3.5, 5.0), 1),
            "trust_score": random.randint(60, 99),
            "badge": random.choice(['bronze', 'silver', 'gold', 'platinum']),
            "tds": random.randint(30, 150),
            "ph": round(random.uniform(6.5, 8.5), 1),
            "price": random.randint(400, 1200),
            "eta": f"{random.randint(1, 4)} hours",
            "coverage_area": [fake.city() for _ in range(3)]
        })

    for i in range(0, len(suppliers), 50):
        supabase.table("suppliers").insert(suppliers[i:i+50]).execute()

    # 3. Generate Orders
    print(f"Generating {NUM_ORDERS} Orders...")
    orders = []
    for _ in range(NUM_ORDERS):
        customer = random.choice(customers)
        supplier = random.choice(suppliers)
        qty = random.choice([500, 1000, 2000, 5000])
        amount = (supplier["price"] / 1000) * qty
        
        status = random.choice(['pending', 'accepted', 'in_transit', 'delivered', 'cancelled'])
        
        orders.append({
            "customer_id": customer["id"],
            "supplier_id": supplier["id"],
            "quantity": qty,
            "amount": amount,
            "status": status,
            "delivery_date": str(fake.date_time_between(start_date='-30d', end_date='+7d')),
            "eta": supplier["eta"]
        })
    
    for i in range(0, len(orders), 50):
        res = supabase.table("orders").insert(orders[i:i+50]).execute()
        # Create tracking for these orders
        tracking = []
        for order in res.data:
            tracking.append({
                "order_id": order["id"],
                "current_status": order["status"],
                "latitude": float(fake.latitude()),
                "longitude": float(fake.longitude()),
                "eta": order["eta"]
            })
        supabase.table("tracking").insert(tracking).execute()

    # 4. Generate Reviews
    print(f"Generating {NUM_REVIEWS} Reviews...")
    reviews = []
    for _ in range(NUM_REVIEWS):
        reviews.append({
            "customer_id": random.choice(customers)["id"],
            "supplier_id": random.choice(suppliers)["id"],
            "rating": random.randint(1, 5),
            "review_text": fake.text(max_nb_chars=150)
        })
    
    for i in range(0, len(reviews), 50):
        supabase.table("reviews").insert(reviews[i:i+50]).execute()

    # 5. Generate Wallet Transactions
    print(f"Generating {NUM_WALLET_TX} Wallet Transactions...")
    wallet_tx = []
    for _ in range(NUM_WALLET_TX):
        wallet_tx.append({
            "customer_id": random.choice(customers)["id"],
            "type": random.choice(["credit", "debit", "refund"]),
            "amount": round(random.uniform(50.0, 1500.0), 2)
        })
    
    for i in range(0, len(wallet_tx), 50):
        supabase.table("wallet_transactions").insert(wallet_tx[i:i+50]).execute()

    # 6. Generate Notifications
    print("Generating Notifications...")
    notifications = []
    for customer in customers:
        for _ in range(random.randint(2, 5)):
            notifications.append({
                "customer_id": customer["id"],
                "title": fake.sentence(nb_words=4),
                "message": fake.text(max_nb_chars=100),
                "status": random.choice(["read", "unread"])
            })
    
    for i in range(0, len(notifications), 50):
        supabase.table("notifications").insert(notifications[i:i+50]).execute()

    print("Seeding Complete! Database is packed with realistic mock data.")

if __name__ == "__main__":
    seed_database()

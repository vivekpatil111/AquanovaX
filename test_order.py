import urllib.request
import json

payload = json.dumps({
    "customer_id": "84eb64cf-0b38-44a4-83b8-40c764a89e1d", # fake uuid just for format check, or maybe it will fail foreign key constraint
    "supplier_id": "84eb64cf-0b38-44a4-83b8-40c764a89e1d",
    "quantity": 2000,
    "amount": 1000,
    "delivery_date": "2026-06-05T09:00:00.000Z",
    "eta": "2 hours",
    "status": "pending"
}).encode('utf-8')

req = urllib.request.Request(
    'http://localhost:8000/api/orders/', 
    data=payload, 
    headers={'Content-Type': 'application/json'},
    method='POST'
)

try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(e.read().decode())

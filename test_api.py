import urllib.request
import json

data = {
  "registration_number": "MH04 AB 1234",
  "type": "large",
  "capacity": 10000,
  "supplier_id": "00000000-0000-0000-0000-000000000000"
}

req = urllib.request.Request("http://localhost:8000/api/tankers/", data=json.dumps(data).encode(), headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req) as res:
        print(res.status)
        print(res.read().decode())
except Exception as e:
    print(e)
    if hasattr(e, 'read'):
        print(e.read().decode())

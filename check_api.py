import urllib.request
import json

try:
    with urllib.request.urlopen('http://localhost:8000/api/suppliers/') as response:
        data = json.loads(response.read().decode())
        print("Suppliers:", data)
except Exception as e:
    print("Error:", e)

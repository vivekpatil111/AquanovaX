from fastapi import APIRouter, Depends, HTTPException, status
from app.database import get_supabase
from supabase import Client

router = APIRouter(prefix="/admin", tags=["Admin Analytics"])

@router.get("/dashboard")
async def get_dashboard_metrics(supabase: Client = Depends(get_supabase)):
    try:
        # Fetch all required data from supabase in parallel or sequentially.
        # Note: supabase-py doesn't strictly support async await for query execution 
        # out of the box natively with standard client, so sequential execution is fine.
        
        orders_res = supabase.table("orders").select("id, amount, status, created_at, customer_id, supplier_id").execute()
        orders = orders_res.data
        
        customers_res = supabase.table("customers").select("id, wallet_balance").execute()
        customers = customers_res.data
        
        suppliers_res = supabase.table("suppliers").select("id").execute()
        suppliers = suppliers_res.data
        
        # Drivers is not a table, it's stored in auth. We can fetch from customers as a fallback like in drivers.py
        # Or simply count active driver assignments
        drivers = []
        try:
            drivers_res = supabase.table("customers").select("id, full_name").execute()
            drivers = [d for d in drivers_res.data if 'driver' in (d.get('full_name') or '').lower() or 'sangram' in (d.get('full_name') or '').lower() or 'vasu' in (d.get('full_name') or '').lower()]
        except Exception:
            pass
        
        complaints_res = supabase.table("complaints").select("status").execute()
        complaints = complaints_res.data
        
        # Calculate aggregations
        total_revenue = sum([o.get("amount", 0) for o in orders if o.get("status") in ["delivered", "completed", "paid"]])
        active_orders = len([o for o in orders if o.get("status") in ['confirmed','dispatched','en_route']])
        open_complaints = len([c for c in complaints if c.get("status") in ['open', 'escalated', 'under_review']])
        
        # Monthly revenue trends
        revenue_by_month = {}
        for o in orders:
            # simple mapping for MVP
            created_at = o.get("created_at")
            if created_at:
                # "2026-06-09T..." -> "2026-06"
                month = created_at[:7]
                if month not in revenue_by_month:
                    revenue_by_month[month] = {"revenue": 0, "orders": 0}
                revenue_by_month[month]["revenue"] += float(o.get("amount") or 0)
                revenue_by_month[month]["orders"] += 1
                
        # Group by customer
        orders_by_customer = {}
        wallet_by_customer = {}
        for o in orders:
            cid = o.get("customer_id")
            if cid:
                orders_by_customer[cid] = orders_by_customer.get(cid, 0) + 1
                
        for c in customers:
            uid = c.get("id")
            if uid:
                wallet_by_customer[uid] = float(c.get("wallet_balance") or 0)

        # Group by supplier
        orders_by_supplier = {}
        for o in orders:
            sid = o.get("supplier_id")
            if sid:
                orders_by_supplier[sid] = orders_by_supplier.get(sid, 0) + 1
        
        # Driver stats
        assignments_res = supabase.table("driver_assignments").select("driver_id, status").execute()
        assignments = assignments_res.data
        completed_deliveries_by_driver = {}
        for a in assignments:
            did = a.get("driver_id")
            if did and a.get("status") == "delivered":
                completed_deliveries_by_driver[did] = completed_deliveries_by_driver.get(did, 0) + 1

        return {
            "kpis": {
                "total_users": len(customers),
                "active_suppliers": len([s for s in suppliers if s.get("is_active") is not False]),
                "active_drivers": len([d for d in drivers if d.get("is_available") is not False]),
                "active_orders": active_orders,
                "total_orders": len(orders),
                "total_revenue": total_revenue,
                "open_complaints": open_complaints,
                "verified_suppliers": len(suppliers)
            },
            "revenue_trends": revenue_by_month,
            "user_stats": {
                "orders_by_customer": orders_by_customer,
                "wallet_by_customer": wallet_by_customer,
                "orders_by_supplier": orders_by_supplier,
                "completed_deliveries_by_driver": completed_deliveries_by_driver
            }
        }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

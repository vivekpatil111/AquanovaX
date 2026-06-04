from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.routers import auth, listings, transactions, orders, suppliers, tracking, reviews, wallet, notifications, tankers

settings = get_settings()

app = FastAPI(
    title="AquanovaX API",
    description="Backend for the AquanovaX Water Marketplace",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:5174", 
        "http://localhost:3000",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(listings.router, prefix="/api/listings", tags=["Listings"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["Transactions"])
app.include_router(orders.router, prefix="/api")
app.include_router(suppliers.router, prefix="/api")
app.include_router(tracking.router, prefix="/api")
app.include_router(reviews.router, prefix="/api")
app.include_router(wallet.router, prefix="/api")
app.include_router(notifications.router, prefix="/api")
app.include_router(tankers.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to AquanovaX API. Visit /docs for API documentation."}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "environment": settings.app_env}

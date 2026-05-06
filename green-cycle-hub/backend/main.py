"""
SMACOM Backend - Main Application Entry Point
A waste-to-wealth system connecting waste producers, bio-processors, and farmers
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.core.config import settings
from app.api import (
    auth, users, waste, processor, farmer, marketplace,
    iot, learning, payments, admin, notifications, reports
)

# Initialize FastAPI app
app = FastAPI(
    title="SMACOM Backend API",
    description="Waste-to-Wealth System API",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(waste.router, prefix="/api/v1/waste", tags=["Waste Management"])
app.include_router(processor.router, prefix="/api/v1/processors", tags=["Bio-Processors"])
app.include_router(farmer.router, prefix="/api/v1/farmers", tags=["Farmers"])
app.include_router(marketplace.router, prefix="/api/v1/marketplace", tags=["Marketplace"])
app.include_router(iot.router, prefix="/api/v1/iot", tags=["IoT Sensors"])
app.include_router(learning.router, prefix="/api/v1/learning", tags=["Learning Center"])
app.include_router(payments.router, prefix="/api/v1/payments", tags=["Payments"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(notifications.router, prefix="/api/v1/notifications", tags=["Notifications"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports"])

@app.get("/")
def read_root():
    """Root endpoint"""
    return {
        "message": "SMACOM Backend API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )

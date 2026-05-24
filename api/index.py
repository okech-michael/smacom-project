"""
SMACOM Backend - Vercel Serverless Entry Point
Full-stack deployment on Vercel (temporary - without IoT/MQTT features)
"""

import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.core.config import settings
from app.api import (
    auth, users, waste, processor, farmer, marketplace,
    learning, payments, admin, notifications, reports
)
# iot module is disabled for Vercel deployment

# Initialize FastAPI app
app = FastAPI(
    title="SMACOM Backend API",
    description="Waste-to-Wealth System API (Vercel Edition)",
    version="1.0.0"
)

# CORS Middleware - Allow Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Vercel will handle domain validation
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers (excluding IoT which uses MQTT)
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(waste.router, prefix="/api/v1/waste", tags=["Waste Management"])
app.include_router(processor.router, prefix="/api/v1/processors", tags=["Bio-Processors"])
app.include_router(farmer.router, prefix="/api/v1/farmers", tags=["Farmers"])
app.include_router(marketplace.router, prefix="/api/v1/marketplace", tags=["Marketplace"])
# app.include_router(iot.router, prefix="/api/v1/iot", tags=["IoT Sensors"])  # DISABLED - Uses MQTT
app.include_router(learning.router, prefix="/api/v1/learning", tags=["Learning Center"])
app.include_router(payments.router, prefix="/api/v1/payments", tags=["Payments"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(notifications.router, prefix="/api/v1/notifications", tags=["Notifications"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports"])

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "environment": settings.environment}

@app.get("/api/v1/iot/status")
def iot_disabled():
    """IoT endpoint - temporarily disabled on Vercel"""
    return {
        "status": "disabled",
        "message": "IoT/MQTT features are temporarily disabled on Vercel. Will be available on Railway.",
        "note": "Real-time IoT features require persistent connections and will be migrated to Railway."
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

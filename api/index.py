"""
SMACOM Backend - Vercel Serverless Entry Point
Full-stack deployment on Vercel (temporary - without IoT/MQTT features)
"""

import os
import sys
from pathlib import Path

# Add the backend module to Python path for imports
backend_path = os.path.join(os.path.dirname(__file__), '..', 'green-cycle-hub', 'backend')
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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

# Serve static frontend files from the built React/Vite app
# Check multiple possible locations for frontend dist
frontend_paths = [
    Path(__file__).parent.parent / "green-cycle-hub" / "dist",  # Vercel build location
    Path(__file__).parent.parent / "frontend" / "dist",  # Fallback if restructured
    Path(__file__).parent.parent / "dist",  # Root level fallback
]

frontend_dist = None
for path in frontend_paths:
    if path.exists():
        frontend_dist = path
        print(f"✓ Frontend dist found at: {path}")
        break

if not frontend_dist:
    print(f"⚠ WARNING: Frontend dist not found in any expected location")
    print(f"  Checked: {frontend_paths}")
    frontend_dist = frontend_paths[0]  # Use primary path as fallback

@app.get("/")
def serve_root():
    """Serve root index.html"""
    if not frontend_dist or not frontend_dist.exists():
        return {
            "status": "error",
            "message": "Frontend dist not found",
            "path": str(frontend_dist),
            "debug": "Vercel serverless: Make sure npm build creates dist folder in green-cycle-hub",
            "hint": "Check Vercel build logs at https://vercel.com/dashboard"
        }, 503
    
    index_path = frontend_dist / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path), media_type="text/html")
    
    return {
        "status": "error",
        "message": "index.html not found in dist",
        "path": str(index_path)
    }, 503

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    """Serve SPA - return index.html for all non-API routes"""
    # Skip API routes
    if full_path.startswith("api/"):
        return {"detail": "Not Found"}, 404
    
    # Try to serve file directly (for assets, etc)
    file_path = frontend_dist / full_path
    if file_path.exists() and file_path.is_file() and file_path.stat().st_size > 0:
        return FileResponse(str(file_path))
    
    # Default to index.html for SPA routing
    index_path = frontend_dist / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path), media_type="text/html")
    
    return {"detail": "Not Found"}, 404

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

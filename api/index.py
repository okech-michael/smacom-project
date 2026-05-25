"""
SMACOM Backend - Vercel Serverless Entry Point
Full-stack deployment on Vercel (temporary - without IoT/MQTT features)
"""

import os
from pathlib import Path
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

# Serve static frontend files (built React/Vite app)
frontend_dist_path = Path(__file__).parent.parent / "green-cycle-hub" / "dist"

if frontend_dist_path.exists():
    # Mount static files for assets
    app.mount("/assets", StaticFiles(directory=str(frontend_dist_path / "assets")), name="assets")
    
    # Serve index.html for SPA routing
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """Serve frontend files or index.html for SPA routing"""
        # Don't serve for API routes (already handled above)
        if full_path.startswith("api/"):
            return {"error": "Not Found"}, 404
        
        # Try to serve the actual file
        file_path = frontend_dist_path / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        
        # Fall back to index.html for SPA routing
        index_path = frontend_dist_path / "index.html"
        if index_path.exists():
            return FileResponse(index_path)
        
        return {"error": "Frontend not built. Run: cd green-cycle-hub && npm run build"}, 503

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

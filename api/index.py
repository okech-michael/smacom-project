"""
SMACOM Backend - Vercel Serverless Entry Point
Full-stack deployment on Vercel using Supabase backend
"""

import os
import sys
from pathlib import Path

# Add the backend module to Python path for imports
backend_path = os.path.join(os.path.dirname(__file__), '..', 'green-cycle-hub', 'backend')
backend_path = os.path.abspath(backend_path)

if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import uvicorn

from app.core.config import settings
from app.api import (
    auth, users, waste, processor, farmer, marketplace,
    learning, payments, admin, notifications, reports
)

# Initialize FastAPI app
app = FastAPI(
    title="SMACOM Backend API",
    description="Waste-to-Wealth System API (Vercel Edition)",
    version="1.0.0"
)

# CORS Middleware - Allow frontend domain
allowed_origins = [
    "https://www.smacom.co.ke",
    "https://smacom.co.ke",
    "https://smacom-project.vercel.app",
]
if settings.environment != "production":
    allowed_origins.extend([
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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
app.include_router(learning.router, prefix="/api/v1/learning", tags=["Learning Center"])
app.include_router(payments.router, prefix="/api/v1/payments", tags=["Payments"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(notifications.router, prefix="/api/v1/notifications", tags=["Notifications"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports"])

@app.get("/health")
@app.get("/api/health")
@app.get("/api/v1/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "environment": settings.environment,
        "database": "supabase"
    }

# Mount frontend static files
# On Vercel: frontend builds to green-cycle-hub/dist/
frontend_dist = Path(__file__).parent.parent / "green-cycle-hub" / "dist"

if frontend_dist.exists():
    print(f"✓ Mounting frontend static files from {frontend_dist}")
    app.mount("/", StaticFiles(directory=str(frontend_dist), html=True), name="frontend")
else:
    # Fallback: serve simple health check
    @app.get("/{path:path}")
    async def fallback(path: str):
        """Fallback route when frontend is not available"""
        if path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        # For SPA, return index.html (will 404 since it doesn't exist)
        raise HTTPException(status_code=503, detail="Frontend not deployed yet")

if __name__ == "__main__":

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

"""
SMACOM Backend - Main Application Entry Point
A waste-to-wealth system connecting waste producers, bio-processors, and farmers
"""

import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
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

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

# Try to mount frontend static files from multiple locations
frontend_paths = [
    Path(__file__).resolve().parent / "frontend-dist",
    Path(__file__).resolve().parent.parent.parent / "frontend-dist",
]

frontend_mounted = False
for frontend_path in frontend_paths:
    if frontend_path.exists():
        try:
            app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
            print(f"✓ Frontend mounted from {frontend_path}")
            frontend_mounted = True
            break
        except Exception as e:
            print(f"✗ Failed to mount {frontend_path}: {e}")

if not frontend_mounted:
    print("⚠ Frontend files not found, serving fallback page")
    
    @app.get("/", response_class=HTMLResponse)
    def read_root():
        """Fallback frontend HTML"""
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <title>SMACOM - Waste to Wealth</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
                .container { text-align: center; color: white; }
                h1 { font-size: 3em; margin-bottom: 0.5em; }
                p { font-size: 1.2em; margin-bottom: 1em; opacity: 0.9; }
                .status { background: rgba(255,255,255,0.1); padding: 2em; border-radius: 10px; backdrop-filter: blur(10px); }
                .api-links { margin-top: 2em; }
                a { color: white; text-decoration: none; margin: 0.5em 1em; display: inline-block; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="status">
                    <h1>SMACOM Backend API</h1>
                    <p>Waste-to-Wealth System</p>
                    <p>✓ Server is running</p>
                    <div class="api-links">
                        <a href="/docs">API Documentation</a>
                        <a href="/health">Health Check</a>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """

if __name__ == "__main__":
    debug = os.getenv("DEBUG", "false").lower() == "true" or settings.debug
    print(f"Starting server with DEBUG={debug}")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8080)),
        reload=debug
    )

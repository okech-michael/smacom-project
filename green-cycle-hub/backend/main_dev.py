"""
SMACOM Backend - Development/Inspection Edition with Full API
Complete FastAPI server with learning management and all dashboards
"""

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime, timezone
from typing import Optional, List
from pydantic import BaseModel

# Initialize FastAPI app
app = FastAPI(
    title="SMACOM Backend API",
    description="Waste-to-Wealth System API - Local Development",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# DATA MODELS
# ============================================

class Course(BaseModel):
    id: Optional[str] = None
    title: str
    instructor: str
    duration: str
    fee: str
    category: str = "Waste Management"
    youtube_url: str
    description: str = ""
    modules: int = 5
    created_at: Optional[str] = None

class Notification(BaseModel):
    id: int
    title: str
    time: str
    level: str

# ============================================
# PRODUCTION LEARNING CONTENT - REAL YOUTUBE
# ============================================

COURSES_DATA: List[Course] = [
    Course(
        id="course_001",
        title="Composting Fundamentals",
        instructor="The Waste Experts Academy",
        duration="6 hours",
        fee="KES 2,500",
        category="Composting",
        youtube_url="https://www.youtube.com/embed/dQw4w9WgXcQ",
        description="Learn the basics of composting from expert instructors. Perfect for beginners.",
        modules=8
    ),
    Course(
        id="course_002",
        title="Compost Heap Management 101",
        instructor="Sustainability Institute Kenya",
        duration="4 hours",
        fee="KES 1,800",
        category="Compost Heap Management",
        youtube_url="https://www.youtube.com/embed/aqz-KE-bpKQ",
        description="Master the art of managing compost heaps efficiently with proven techniques.",
        modules=6
    ),
    Course(
        id="course_003",
        title="Advanced Composting Techniques",
        instructor="Global Composting Network",
        duration="3 hours",
        fee="KES 1,200",
        category="Advanced Methods",
        youtube_url="https://www.youtube.com/embed/9bZkp7q19f0",
        description="Advance your composting skills with specialized techniques and best practices.",
        modules=5
    ),
    Course(
        id="course_004",
        title="Organic Waste Management",
        instructor="Environmental Solutions Lab",
        duration="5 hours",
        fee="KES 2,000",
        category="Waste Management",
        youtube_url="https://www.youtube.com/embed/nM4rXcJRq60",
        description="Comprehensive guide to managing organic waste sustainably.",
        modules=7
    ),
    Course(
        id="course_005",
        title="Circular Economy for Farmers",
        instructor="Agricultural Development Center",
        duration="4 hours",
        fee="KES 1,600",
        category="Circular Economy",
        youtube_url="https://www.youtube.com/embed/E7Yj4oTVMpI",
        description="How to implement circular economy principles on farms.",
        modules=6
    ),
    Course(
        id="course_006",
        title="IoT Monitoring for Composting Units",
        instructor="Smart Agriculture Institute",
        duration="3 hours",
        fee="KES 1,400",
        category="IoT & Technology",
        youtube_url="https://www.youtube.com/embed/CYLnKE-YkGs",
        description="Learn to use modern IoT systems for real-time compost monitoring.",
        modules=5
    ),
    Course(
        id="course_007",
        title="Sustainable Soil Health",
        instructor="Soil Science Academy",
        duration="2.5 hours",
        fee="KES 1,000",
        category="Soil Science",
        youtube_url="https://www.youtube.com/embed/oYXMiVvWt2Y",
        description="Build and maintain healthy soil using compost and sustainable practices.",
        modules=4
    ),
    Course(
        id="course_008",
        title="Marketplace & Business Skills",
        instructor="Digital Commerce Institute",
        duration="3 hours",
        fee="KES 900",
        category="Business",
        youtube_url="https://www.youtube.com/embed/5qap5aO4IWo",
        description="Sell your compost products effectively on the SMACOM marketplace.",
        modules=5
    ),
]

# ============================================
# DEMO DATA
# ============================================

DEMO_IOT_UNITS = [
    {"name": "Unit 1 West", "temp": 62, "moisture": 58, "co2": 1240, "fill": 74, "stage": "Active Composting", "progress": 65, "status": "optimal"},
    {"name": "Unit 2 East", "temp": 42, "moisture": 61, "co2": 890, "fill": 52, "stage": "Active Composting", "progress": 40, "status": "alert"},
    {"name": "Unit 3 North", "temp": 58, "moisture": 87, "co2": 1100, "fill": 87, "stage": "Maturation", "progress": 80, "status": "warning"},
]

DEMO_NOTIFICATIONS = [
    {"id": 1, "title": "Unit 2 East: moisture below threshold", "time": "5 min ago", "level": "alert"},
    {"id": 2, "title": "New pickup request from Green Grocer Market", "time": "22 min ago", "level": "info"},
    {"id": 3, "title": "Order ORD-1042 marked as delivered", "time": "1 h ago", "level": "info"},
    {"id": 4, "title": "Unit 3 North fill level above 85%", "time": "2 h ago", "level": "warning"},
]

DEMO_MARKETPLACE_PRODUCTS = [
    {"name": "Premium Organic Compost", "price": "4,500", "unit": "/ MT", "seller": "GreenCycle Processors", "category": "Fertiliser"},
    {"name": "Liquid Fertiliser", "price": "1,200", "unit": "/ 20L", "seller": "BioFarm Solutions", "category": "Fertiliser"},
    {"name": "Animal Feed Mix", "price": "2,800", "unit": "/ 50kg", "seller": "EcoFeed Africa", "category": "Feed"},
]

# ============================================
# API ENDPOINTS
# ============================================

@app.get("/")
async def root():
    return {
        "message": "SMACOM Backend API",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "docs": "/docs",
            "openapi": "/openapi.json"
        }
    }

@app.get("/api/v1/health")
async def health():
    return {"status": "healthy", "service": "smacom-backend"}

@app.get("/api/v1/auth/status")
async def auth_status():
    return {
        "service": "authentication",
        "status": "online",
        "note": "Verify JWT token to authenticate"
    }

@app.get("/api/v1/auth/me")
async def get_current_user(token: Optional[str] = None):
    """Get current authenticated user. For demo, returns mock user."""
    return {
        "id": "demo-user-001",
        "email": "demo@smacom.io",
        "full_name": "Demo User",
        "role": "learner",
        "organisation": "SMACOM Demo",
        "status": "active"
    }

# ============================================
# LEARNING COURSES API
# ============================================

@app.get("/api/v1/learning/courses")
async def get_courses(category: Optional[str] = None):
    """Get all available courses. Optionally filter by category."""
    courses = COURSES_DATA
    if category:
        courses = [c for c in COURSES_DATA if c.category.lower() == category.lower()]
    
    return {
        "success": True,
        "data": [c.dict() for c in courses],
        "total": len(courses)
    }

@app.get("/api/v1/learning/courses/{course_id}")
async def get_course(course_id: str):
    """Get a specific course by ID."""
    course = next((c for c in COURSES_DATA if c.id == course_id), None)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    return {
        "success": True,
        "data": course.dict()
    }

@app.get("/api/v1/learning/categories")
async def get_categories():
    """Get all available course categories."""
    categories = list(set(c.category for c in COURSES_DATA))
    return {
        "success": True,
        "data": categories
    }

# ============================================
# DASHBOARD APIs
# ============================================

@app.get("/api/v1/waste/stats")
async def get_waste_stats():
    """Get waste management statistics."""
    return {
        "success": True,
        "data": {
            "waste_collected": 42,
            "compost_produced": 21,
            "revenue": 128400,
            "active_users": 3214,
            "trend": "+8% MoM"
        }
    }

@app.get("/api/v1/waste/pickup-requests")
async def get_pickup_requests():
    """Get active pickup requests."""
    return {
        "success": True,
        "data": [
            {"id": "PU-2041", "producer": "Green Grocer Market", "type": "Food Waste", "quantity": 120, "distance": 3.2, "address": "Westlands, Nairobi"},
            {"id": "PU-2042", "producer": "Java House Kilimani", "type": "Food Waste", "quantity": 85, "distance": 5.6, "address": "Kilimani, Nairobi"},
            {"id": "PU-2043", "producer": "Karen Country Lodge", "type": "Yard Waste", "quantity": 240, "distance": 8.1, "address": "Karen, Nairobi"},
        ]
    }

@app.get("/api/v1/iot/units")
async def get_iot_units():
    """Get IoT unit status and sensor data."""
    return {
        "success": True,
        "data": DEMO_IOT_UNITS,
        "total": len(DEMO_IOT_UNITS)
    }

@app.get("/api/v1/marketplace/products")
async def get_marketplace_products():
    """Get marketplace products available for farmers."""
    return {
        "success": True,
        "data": DEMO_MARKETPLACE_PRODUCTS,
        "total": len(DEMO_MARKETPLACE_PRODUCTS)
    }

@app.get("/api/v1/notifications")
async def get_notifications(limit: int = 10):
    """Get recent notifications."""
    return {
        "success": True,
        "data": DEMO_NOTIFICATIONS[:limit]
    }

@app.get("/api/v1/admin/stats")
async def get_admin_stats():
    """Get comprehensive admin statistics."""
    return {
        "success": True,
        "data": {
            "waste_collected": 42,
            "compost_produced": 21,
            "revenue": 128400,
            "active_users": 3214,
            "co2_saved": 18.4,
            "waste_diverted": 42,
            "carbon_credits": 9.2,
            "environmental_score": 84
        }
    }

@app.get("/api/v1/admin/production-trend")
async def get_production_trend():
    """Get monthly production trend data."""
    trend = [
        {"month": "Dec", "compost": 14, "feed": 6},
        {"month": "Jan", "compost": 18, "feed": 8},
        {"month": "Feb", "compost": 16, "feed": 7},
        {"month": "Mar", "compost": 22, "feed": 10},
        {"month": "Apr", "compost": 19, "feed": 11},
        {"month": "May", "compost": 21, "feed": 12},
    ]
    return {
        "success": True,
        "data": trend
    }

# ============================================
# ENTRYPOINT
# ============================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

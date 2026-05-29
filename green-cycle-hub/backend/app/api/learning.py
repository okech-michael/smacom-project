from fastapi import APIRouter, Depends, HTTPException
from app.db.supabase_client import get_supabase
from app.core.dependencies import require_role, get_current_user
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone

router = APIRouter(tags=["Learning"])


def ok(data):
    return {"success": True, "data": data}


class CourseCreate(BaseModel):
    title: str
    description: str
    category: str
    content: str
    duration_minutes: int
    difficulty_level: str
    youtube_url: Optional[str] = None


class CourseEnrollment(BaseModel):
    course_id: str


@router.get("/courses")
def get_courses(
    category: Optional[str] = None,
    supabase=Depends(get_supabase)
):
    """Get available courses"""
    query = supabase.table("courses").select("*")
    if category:
        query = query.eq("category", category)
    result = query.execute()
    return ok(result.data if result.data else [])


@router.get("/courses/{course_id}")
def get_course(course_id: str, supabase=Depends(get_supabase)):
    """Get course details"""
    result = supabase.table("courses").select("*").eq("id", course_id).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Course not found")
    return ok(result.data)


@router.post("/courses")
def create_course(
    course: CourseCreate,
    current_user: dict = Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    """Create a new course (admin only)"""
    require_role(current_user, "admin")
    
    data = course.model_dump()
    data["created_by"] = current_user.get("id")
    data["created_at"] = datetime.now(timezone.utc).isoformat()
    
    result = supabase.table("courses").insert(data).execute()
    if not result.data:
        raise HTTPException(status_code=400, detail="Failed to create course")
    return ok(result.data[0])


@router.post("/enroll")
def enroll_course(
    enrollment: CourseEnrollment,
    current_user: dict = Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    """Enroll in a course"""
    data = {
        "user_id": current_user.get("id"),
        "course_id": enrollment.course_id,
        "enrolled_at": datetime.now(timezone.utc).isoformat(),
        "progress": 0
    }
    
    result = supabase.table("course_enrollments").insert(data).execute()
    if not result.data:
        raise HTTPException(status_code=400, detail="Failed to enroll in course")
    return ok(result.data[0])


@router.get("/my-courses")
def get_my_courses(
    current_user: dict = Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    """Get user's enrolled courses"""
    result = supabase.table("course_enrollments").select(
        "*, courses(*)"
    ).eq("user_id", current_user.get("id")).execute()
    return ok(result.data if result.data else [])


@router.put("/courses/{course_id}/progress")
def update_progress(
    course_id: str,
    progress: int,
    current_user: dict = Depends(get_current_user),
    supabase=Depends(get_supabase)
):
    """Update course progress"""
    result = supabase.table("course_enrollments").update(
        {"progress": progress, "updated_at": datetime.now(timezone.utc).isoformat()}
    ).eq("user_id", current_user.get("id")).eq("course_id", course_id).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return ok(result.data[0])
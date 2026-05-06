from fastapi import APIRouter, Depends
from app.db.supabase_client import get_supabase
from app.core.dependencies import require_role
from app.services.reports import generate_report
from pydantic import BaseModel

router = APIRouter(tags=["Reports"])


def ok(data):
    return {"success": True, "data": data}


class ReportRequest(BaseModel):
    report_type: str  # weekly | monthly
    format: str       # pdf | csv


@router.post("/generate")
async def create_report(
    payload: ReportRequest,
    current_user: dict = Depends(require_role("admin")),
    supabase=Depends(get_supabase),
):
    if payload.report_type not in ("weekly", "monthly"):
        return {"success": False, "error": "report_type must be weekly or monthly"}
    if payload.format not in ("pdf", "csv"):
        return {"success": False, "error": "format must be pdf or csv"}

    url = await generate_report(payload.report_type, payload.format, supabase)
    return ok({"download_url": url})


@router.get("")
async def list_reports(
    current_user: dict = Depends(require_role("admin")),
    supabase=Depends(get_supabase),
):
    objects = supabase.storage.from_("reports").list()
    reports = []
    for obj in (objects or []):
        public_url = supabase.storage.from_("reports").get_public_url(obj["name"])
        reports.append({"name": obj["name"], "created_at": obj.get("created_at"), "url": public_url})
    return ok({"reports": reports})
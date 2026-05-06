import csv
import io
from datetime import datetime, timezone, timedelta
from weasyprint import HTML
from app.services.sendgrid import _send


async def generate_report(report_type: str, fmt: str, supabase) -> str:
    """Compile and generate a weekly or monthly report. Returns download URL."""
    now = datetime.now(timezone.utc)

    if report_type == "weekly":
        since = now - timedelta(days=7)
        label = f"weekly_{now.strftime('%Y-%m-%d')}"
    else:
        since = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        label = f"monthly_{now.strftime('%Y-%m')}"

    since_str = since.isoformat()

    # Collect data
    intake = supabase.table("waste_intake_log").select("quantity_kg").gte("logged_at", since_str).execute().data or []
    total_waste_kg = sum(r["quantity_kg"] for r in intake)

    payments = supabase.table("payments").select("amount, reference_type")\
        .eq("status", "completed").gte("created_at", since_str).execute().data or []

    sales_revenue = sum(p["amount"] for p in payments if p["reference_type"] == "order")
    course_revenue = sum(p["amount"] for p in payments if p["reference_type"] == "course")
    platform_rev = sales_revenue * 0.07 + course_revenue

    users = supabase.table("users").select("id", count="exact").eq("status", "verified").execute()
    active_users = users.count or 0

    enrolments = supabase.table("enrolments").select("id", count="exact").gte("enrolled_at", since_str).execute()

    co2_saved = (total_waste_kg / 1000) * 0.44

    report_data = {
        "period": report_type,
        "generated_at": now.isoformat(),
        "waste_intake_kg": total_waste_kg,
        "sales_revenue_kes": sales_revenue,
        "course_revenue_kes": course_revenue,
        "platform_revenue_kes": round(platform_rev, 2),
        "co2_saved_mt": round(co2_saved, 3),
        "active_users": active_users,
        "new_enrolments": enrolments.count or 0,
    }

    filename = f"{label}.{fmt}"
    storage_path = f"reports/{filename}"

    if fmt == "csv":
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(report_data.keys())
        writer.writerow(report_data.values())
        content = output.getvalue().encode()
        content_type = "text/csv"
    else:
        html = _build_report_html(report_data, report_type)
        content = HTML(string=html).write_pdf()
        content_type = "application/pdf"

    supabase.storage.from_("reports").upload(
        storage_path, content, {"content-type": content_type, "upsert": "true"}
    )

    url = supabase.storage.from_("reports").get_public_url(storage_path)
    return url


def _build_report_html(data: dict, report_type: str) -> str:
    rows = "".join(f"<tr><td>{k.replace('_', ' ').title()}</td><td><strong>{v}</strong></td></tr>" for k, v in data.items())
    return f"""
    <!DOCTYPE html>
    <html>
    <head><style>
      body {{ font-family: Arial, sans-serif; padding: 40px; color: #1a1a1a; }}
      h1 {{ color: #2d6a4f; }} h2 {{ color: #555; font-size: 16px; }}
      table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
      td {{ padding: 10px 14px; border-bottom: 1px solid #e0e0e0; }}
      tr:nth-child(even) {{ background: #f9f9f9; }}
    </style></head>
    <body>
      <h1>SMACOM Solutions</h1>
      <h2>{report_type.title()} Performance Report — {data['generated_at'][:10]}</h2>
      <table>{rows}</table>
    </body>
    </html>
    """


async def auto_generate_and_notify(report_type: str, supabase, admin_email: str, admin_name: str):
    """Called by scheduled jobs. Generate report and email admin."""
    url = await generate_report(report_type, "pdf", supabase)
    _send(
        admin_email,
        f"SMACOM {report_type.title()} Report Ready",
        f"<p>Hi {admin_name},</p><p>Your {report_type} report is ready: <a href='{url}'>Download here</a></p>",
    )
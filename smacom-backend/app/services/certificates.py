from datetime import datetime, timezone
from weasyprint import HTML
from app.services.sendgrid import send_certificate_email

CERT_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {{
      font-family: 'Georgia', serif;
      background: #fff;
      color: #1a1a1a;
      margin: 0;
      padding: 60px;
    }}
    .border {{
      border: 8px double #2d6a4f;
      padding: 40px;
      text-align: center;
    }}
    .logo {{
      font-size: 28px;
      font-weight: bold;
      color: #2d6a4f;
      letter-spacing: 3px;
      margin-bottom: 10px;
    }}
    .tagline {{
      font-size: 13px;
      color: #555;
      margin-bottom: 30px;
    }}
    h1 {{
      font-size: 42px;
      color: #2d6a4f;
      margin: 10px 0;
    }}
    .presents {{
      font-size: 16px;
      color: #555;
      margin-bottom: 20px;
    }}
    .recipient {{
      font-size: 34px;
      font-style: italic;
      color: #1a1a1a;
      border-bottom: 2px solid #2d6a4f;
      display: inline-block;
      padding-bottom: 5px;
      margin-bottom: 20px;
    }}
    .course-title {{
      font-size: 22px;
      font-weight: bold;
      margin: 10px 0;
    }}
    .completion-date {{
      font-size: 14px;
      color: #555;
      margin: 20px 0;
    }}
    .cert-id {{
      font-size: 11px;
      color: #999;
      margin-top: 30px;
    }}
    .seal {{
      font-size: 48px;
      margin: 20px 0;
    }}
  </style>
</head>
<body>
  <div class="border">
    <div class="logo">SMACOM SOLUTIONS</div>
    <div class="tagline">Waste-to-Wealth Platform</div>
    <div class="seal">🌱</div>
    <h1>Certificate of Completion</h1>
    <p class="presents">This is to certify that</p>
    <div class="recipient">{full_name}</div>
    <p class="presents">has successfully completed</p>
    <div class="course-title">{course_title}</div>
    <p class="completion-date">Completed on {completion_date}</p>
    <p class="cert-id">Certificate ID: {cert_id}</p>
  </div>
</body>
</html>
"""


async def generate_certificate(user: dict, course_id: str, supabase) -> str:
    """Generate a PDF certificate, upload to Supabase Storage, and notify the learner."""

    course = supabase.table("courses").select("title").eq("id", course_id).single().execute().data
    course_title = course["title"] if course else "SMACOM Course"

    completion_date = datetime.now(timezone.utc).strftime("%d %B %Y")

    # Build certificate HTML
    html_content = CERT_TEMPLATE.format(
        full_name=user["full_name"],
        course_title=course_title,
        completion_date=completion_date,
        cert_id=f"SMCM-{user['id'][:8].upper()}-{course_id[:8].upper()}",
    )

    # Render to PDF
    pdf_bytes = HTML(string=html_content).write_pdf()

    # Upload to Supabase Storage
    storage_path = f"certificates/{user['id']}/{course_id}.pdf"
    supabase.storage.from_("certificates").upload(
        storage_path, pdf_bytes, {"content-type": "application/pdf", "upsert": "true"}
    )

    # Get public URL
    download_url = supabase.storage.from_("certificates").get_public_url(storage_path)

    # Save certificate record
    supabase.table("certificates").upsert({
        "learner_id": user["id"],
        "course_id": course_id,
        "storage_path": storage_path,
        "issued_at": datetime.now(timezone.utc).isoformat(),
    }).execute()

    # Email the learner
    try:
        await send_certificate_email(user["email"], user["full_name"], course_title, download_url)
    except Exception:
        pass

    return download_url
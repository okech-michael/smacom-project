import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from app.core.config import settings


def _send(to_email: str, subject: str, html_content: str) -> bool:
    """Send a transactional email via SendGrid."""
    if not settings.sendgrid_api_key:
        print(f"[SendGrid] API key not set. Would send: {subject} to {to_email}")
        return False

    message = Mail(
        from_email=settings.sendgrid_from_email,
        to_emails=to_email,
        subject=subject,
        html_content=html_content,
    )
    try:
        sg = SendGridAPIClient(settings.sendgrid_api_key)
        sg.send(message)
        return True
    except Exception as e:
        print(f"[SendGrid] Error sending email: {e}")
        return False


async def send_welcome_email(email: str, full_name: str):
    _send(email, "Welcome to SMACOM Solutions", f"""
    <h2>Welcome, {full_name}!</h2>
    <p>Thank you for registering with SMACOM Solutions — your partner in waste-to-wealth transformation.</p>
    <p>Your account is currently under review. You will receive an email once it has been verified.</p>
    <p>The SMACOM Team</p>
    """)


async def send_account_verified_email(email: str, full_name: str):
    frontend_url = os.getenv("FRONTEND_URL", "https://smacom.io")
    _send(email, "Your SMACOM Account Has Been Verified", f"""
    <h2>Great news, {full_name}!</h2>
    <p>Your SMACOM account has been verified. You can now log in and access all platform features.</p>
    <p><a href="{frontend_url}/login">Login to SMACOM</a></p>
    """)


async def send_collection_accepted_email(email: str, full_name: str, request_id: str):
    _send(email, "Your Waste Collection Request Has Been Accepted", f"""
    <h2>Hello {full_name},</h2>
    <p>A processor has been assigned to your waste collection request <strong>#{request_id[:8]}</strong>.</p>
    <p>They are on their way. Please ensure access to your collection point.</p>
    """)


async def send_batch_complete_email(email: str, full_name: str, unit_name: str):
    _send(email, "Composting Batch Complete", f"""
    <h2>Hello {full_name},</h2>
    <p>The composting batch in unit <strong>{unit_name}</strong> has reached 100% progress and is ready for harvest.</p>
    """)


async def send_temperature_alert_email(email: str, full_name: str, unit_name: str, temp: float):
    _send(email, f"⚠️ Temperature Alert — {unit_name}", f"""
    <h2>Alert: Temperature Out of Range</h2>
    <p>Unit <strong>{unit_name}</strong> has reported a temperature of <strong>{temp}°C</strong>, which is outside the optimal range (45–75°C).</p>
    <p>Please inspect the unit immediately.</p>
    """)


async def send_order_approved_email(email: str, full_name: str, order_id: str):
    _send(email, "Your SMACOM Order Has Been Approved", f"""
    <h2>Hello {full_name},</h2>
    <p>Your order <strong>#{order_id[:8]}</strong> has been approved and is being prepared for dispatch.</p>
    """)


async def send_payout_disbursed_email(email: str, full_name: str, amount: float):
    _send(email, "Payout Disbursed — SMACOM", f"""
    <h2>Hello {full_name},</h2>
    <p>A payout of <strong>KES {amount:,.2f}</strong> has been disbursed to your registered account.</p>
    """)


async def send_enrolment_confirmation_email(email: str, full_name: str, course_title: str):
    frontend_url = os.getenv("FRONTEND_URL", "https://smacom.io")
    _send(email, f"Enrolled: {course_title}", f"""
    <h2>Hello {full_name},</h2>
    <p>You have been successfully enrolled in <strong>{course_title}</strong>. Happy learning!</p>
    <p><a href="{frontend_url}/learning">Go to your courses</a></p>
    """)


async def send_certificate_email(email: str, full_name: str, course_title: str, download_url: str):
    _send(email, f"🎓 Certificate Issued: {course_title}", f"""
    <h2>Congratulations, {full_name}!</h2>
    <p>You have successfully completed <strong>{course_title}</strong>.</p>
    <p><a href="{download_url}">Download your certificate</a></p>
    """)
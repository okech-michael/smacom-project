from app.models.iot import IoTReading
from app.services.fcm import send_push_to_multiple
from app.services.sendgrid import send_temperature_alert_email, send_batch_complete_email
from datetime import datetime, timezone

ALERT_THRESHOLDS = {
    "temperature_out_of_range": lambda r: r.temperature_c is not None and (r.temperature_c < 45 or r.temperature_c > 75),
    "moisture_too_low":         lambda r: r.moisture_pct is not None and r.moisture_pct < 40,
    "moisture_too_high":        lambda r: r.moisture_pct is not None and r.moisture_pct > 75,
    "bin_nearly_full":          lambda r: r.fill_level_pct is not None and r.fill_level_pct >= 85,
    "batch_complete":           lambda r: r.progress_pct is not None and r.progress_pct >= 100,
}

ALERT_MESSAGES = {
    "temperature_out_of_range": lambda r: f"Temperature {r.temperature_c}°C is outside safe range (45–75°C).",
    "moisture_too_low":         lambda r: f"Moisture level {r.moisture_pct}% is too low (min 40%).",
    "moisture_too_high":        lambda r: f"Moisture level {r.moisture_pct}% is too high (max 75%).",
    "bin_nearly_full":          lambda r: f"Fill level at {r.fill_level_pct}% — bin needs emptying soon.",
    "batch_complete":           lambda r: "Composting batch is complete and ready for harvest.",
}

# Who to notify: processor=True, admin=True
NOTIFY_ADMIN = {"temperature_out_of_range", "bin_nearly_full", "batch_complete"}
CRITICAL_EMAIL = {"temperature_out_of_range", "batch_complete"}


async def evaluate_reading(reading: IoTReading, supabase):
    """Evaluate an IoT reading against alert thresholds and fire alerts as needed."""
    unit = supabase.table("processing_units").select("*, users!processor_id(id, email, full_name)")\
        .eq("id", reading.unit_id).single().execute().data

    if not unit:
        return

    processor = unit.get("users") or {}
    processor_id = processor.get("id")

    # Get admin user IDs
    admins = supabase.table("users").select("id").eq("role", "admin").execute().data or []
    admin_ids = [a["id"] for a in admins]

    for alert_type, condition in ALERT_THRESHOLDS.items():
        if not condition(reading):
            continue

        message = ALERT_MESSAGES[alert_type](reading)

        # Insert alert record
        supabase.table("iot_alerts").insert({
            "unit_id": reading.unit_id,
            "alert_type": alert_type,
            "message": message,
        }).execute()

        # Update unit status
        supabase.table("processing_units").update({"status": "alert"}).eq("id", reading.unit_id).execute()

        # Determine recipients
        notify_ids = [processor_id] if processor_id else []
        if alert_type in NOTIFY_ADMIN:
            notify_ids += admin_ids

        # In-app notifications
        for uid in set(notify_ids):
            supabase.table("notifications").insert({
                "user_id": uid,
                "title": f"IoT Alert: {alert_type.replace('_', ' ').title()}",
                "body": message,
                "type": alert_type,
                "linked_unit_id": reading.unit_id,
            }).execute()

        # FCM push
        await send_push_to_multiple(
            list(set(notify_ids)),
            f"Alert: {unit.get('unit_name', 'Unit')}",
            message,
            supabase=supabase,
        )

        # Critical email alerts
        if alert_type in CRITICAL_EMAIL and processor.get("email"):
            if alert_type == "temperature_out_of_range":
                await send_temperature_alert_email(
                    processor["email"], processor.get("full_name", ""), unit.get("unit_name", ""), reading.temperature_c
                )
            elif alert_type == "batch_complete":
                await send_batch_complete_email(
                    processor["email"], processor.get("full_name", ""), unit.get("unit_name", "")
                )
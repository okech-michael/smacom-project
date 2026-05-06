# MQTT message handlers are implemented inline in app/mqtt/broker.py
# This module is available for future handler extensions, e.g.:
#   - Command topics: smacom/units/{unit_id}/commands
#   - Firmware OTA topics
#   - Unit registration topics

async def handle_reading(payload: dict, supabase):
    """Route an incoming MQTT reading payload to the IoT processing pipeline."""
    from app.models.iot import IoTReading
    from app.api.iot import _process_reading
    reading = IoTReading(**payload)
    await _process_reading(reading, supabase)
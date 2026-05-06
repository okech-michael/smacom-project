import asyncio
import json
import aiomqtt
from app.core.config import settings

_mqtt_task = None


async def mqtt_listener(supabase):
    """
    Connect to the MQTT broker and listen for IoT sensor readings.
    Subscribes to: smacom/units/+/readings
    """
    from app.models.iot import IoTReading
    from app.api.iot import _process_reading

    broker_host = settings.mqtt_broker_host
    broker_port = settings.mqtt_broker_port

    while True:
        try:
            async with aiomqtt.Client(
                hostname=broker_host,
                port=broker_port,
                username=settings.mqtt_username or None,
                password=settings.mqtt_password or None,
            ) as client:
                print(f"[MQTT] Connected to broker at {broker_host}:{broker_port}")
                await client.subscribe("smacom/units/+/readings")

                async for message in client.messages:
                    try:
                        payload = json.loads(message.payload.decode())
                        reading = IoTReading(**payload)
                        await _process_reading(reading, supabase)
                    except Exception as e:
                        print(f"[MQTT] Failed to process message: {e}")

        except Exception as e:
            print(f"[MQTT] Connection error: {e}. Retrying in 10 seconds...")
            await asyncio.sleep(10)


def start_mqtt_listener(supabase):
    """Start the MQTT listener as a background asyncio task."""
    global _mqtt_task
    loop = asyncio.get_event_loop()
    _mqtt_task = loop.create_task(mqtt_listener(supabase))
    return _mqtt_task


def stop_mqtt_listener():
    """Cancel the MQTT listener task on shutdown."""
    global _mqtt_task
    if _mqtt_task and not _mqtt_task.done():
        _mqtt_task.cancel()
        print("[MQTT] Listener stopped")
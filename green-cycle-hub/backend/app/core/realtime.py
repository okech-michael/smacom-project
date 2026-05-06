from app.db.supabase_client import get_supabase_admin


async def broadcast_iot_reading(unit_id: str, payload: dict) -> None:
    """Broadcast a live IoT reading to Supabase Realtime channel for the unit."""
    supabase = get_supabase_admin()
    channel_name = f"unit:{unit_id}"
    try:
        supabase.realtime.channel(channel_name).send_broadcast(
            event="iot_reading",
            payload=payload,
        )
    except Exception as e:
        # Non-fatal — log and continue
        print(f"[Realtime] Broadcast failed for {channel_name}: {e}")
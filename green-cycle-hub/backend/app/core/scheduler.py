from apscheduler.schedulers.asyncio import AsyncIOScheduler
from datetime import datetime, timezone, timedelta

scheduler = AsyncIOScheduler(timezone="UTC")


def start_scheduler(supabase):
    """Register and start all scheduled background jobs."""

    # ── Re-alert unresolved IoT alerts every 5 minutes ──────────────────────
    @scheduler.scheduled_job("interval", minutes=5, id="recheck_iot_alerts")
    async def recheck_iot_alerts():
        threshold = (datetime.now(timezone.utc) - timedelta(minutes=30)).isoformat()
        alerts = supabase.table("iot_alerts").select("*, processing_units!inner(processor_id)")\
            .eq("resolved", False).lt("triggered_at", threshold).execute().data or []

        admins = supabase.table("users").select("id").eq("role", "admin").execute().data or []
        admin_ids = [a["id"] for a in admins]

        from app.services.fcm import send_push_to_multiple
        for alert in alerts:
            processor_id = alert.get("processing_units", {}).get("processor_id")
            notify_ids = list(set(([processor_id] if processor_id else []) + admin_ids))
            await send_push_to_multiple(notify_ids, "⚠️ Unresolved IoT Alert", alert["message"], supabase=supabase)

    # ── Update eco badges daily at midnight ──────────────────────────────────
    @scheduler.scheduled_job("cron", hour=0, minute=0, id="update_eco_badges")
    async def update_eco_badges():
        farmers = supabase.table("users").select("id").eq("role", "farmer").execute().data or []
        for farmer in farmers:
            fid = farmer["id"]
            orders = supabase.table("orders").select("total_amount")\
                .eq("farmer_id", fid).eq("status", "delivered").execute().data or []
            total_spend = sum(o["total_amount"] for o in orders)

            badge = "bronze"
            if total_spend >= 50000:
                badge = "gold"
            elif total_spend >= 10000:
                badge = "silver"

            supabase.table("users").update({"eco_badge": badge}).eq("id", fid).execute()

    # ── Monthly credit redemption (1st of month, midnight) ───────────────────
    @scheduler.scheduled_job("cron", day=1, hour=0, minute=0, id="monthly_credit_redemption")
    async def monthly_credit_redemption():
        from app.services.credits import redeem_credits
        producers = supabase.table("users").select("id, credits_balance")\
            .eq("role", "producer").gt("credits_balance", 0).execute().data or []
        for producer in producers:
            await redeem_credits(producer["id"], producer["credits_balance"], supabase)

    # ── Weekly auto-report (Sunday at 06:00) ─────────────────────────────────
    @scheduler.scheduled_job("cron", day_of_week="sun", hour=6, minute=0, id="weekly_report")
    async def weekly_report():
        await _run_report("weekly", supabase)

    # ── Monthly auto-report (1st of month at 06:00) ──────────────────────────
    @scheduler.scheduled_job("cron", day=1, hour=6, minute=0, id="monthly_report")
    async def monthly_report():
        await _run_report("monthly", supabase)

    # ── Check subscription expiry every hour ─────────────────────────────────
    @scheduler.scheduled_job("interval", hours=1, id="check_subscriptions")
    async def check_subscriptions():
        now = datetime.now(timezone.utc).isoformat()
        expired = supabase.table("users").select("id, email, full_name")\
            .eq("subscription_plan", "premium")\
            .lt("subscription_expires_at", now).execute().data or []

        from app.services.sendgrid import _send
        for user in expired:
            supabase.table("users").update({
                "subscription_plan": "free",
                "subscription_expires_at": None,
            }).eq("id", user["id"]).execute()
            _send(
                user["email"],
                "Your SMACOM Premium Subscription Has Expired",
                f"<p>Hi {user['full_name']},</p><p>Your Premium subscription has expired. Renew to continue accessing premium features.</p>",
            )

    scheduler.start()
    print("[Scheduler] All jobs registered and started")


async def _run_report(report_type: str, supabase):
    from app.services.reports import auto_generate_and_notify
    admins = supabase.table("users").select("email, full_name").eq("role", "admin").execute().data or []
    for admin in admins:
        await auto_generate_and_notify(report_type, supabase, admin["email"], admin["full_name"])


def stop_scheduler():
    if scheduler.running:
        scheduler.shutdown(wait=False)
        print("[Scheduler] Stopped")

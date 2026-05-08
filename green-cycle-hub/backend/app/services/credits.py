def _extract_data(result):
    if not result:
        return {}
    data = getattr(result, "data", None)
    if isinstance(data, list):
        return data[0] if data else {}
    return data or {}


async def award_credits(user_id: str, quantity_kg: float, rate: float, supabase) -> float:
    """Award credits to a producer based on kg of waste collected."""
    amount = round(quantity_kg * rate, 2)

    supabase.table("credits_ledger").insert({
        "user_id": user_id,
        "amount": amount,
        "direction": "credit",
        "reason": f"Waste collection reward: {quantity_kg}kg at {rate} credits/kg",
    }).execute()

    # Update running balance
    user = _extract_data(
        supabase.table("users").select("credits_balance").eq("id", user_id).single().execute()
    )
    new_balance = (user.get("credits_balance") or 0) + amount
    supabase.table("users").update({"credits_balance": new_balance}).eq("id", user_id).execute()

    return amount


async def redeem_credits(user_id: str, amount: float, supabase) -> bool:
    """Deduct credits from a producer and schedule a cash payout."""
    user = _extract_data(
        supabase.table("users").select("credits_balance").eq("id", user_id).single().execute()
    )
    if not user or (user.get("credits_balance") or 0) < amount:
        return False

    supabase.table("credits_ledger").insert({
        "user_id": user_id,
        "amount": amount,
        "direction": "debit",
        "reason": "Credit redemption payout",
    }).execute()

    new_balance = user.get("credits_balance", 0) - amount
    supabase.table("users").update({"credits_balance": new_balance}).eq("id", user_id).execute()

    supabase.table("payouts").insert({
        "recipient_id": user_id,
        "amount": amount,
        "reason": "Credits redemption",
        "status": "pending",
    }).execute()

    return True


async def get_balance(user_id: str, supabase) -> float:
    """Return current credits balance."""
    result = supabase.table("users").select("credits_balance").eq("id", user_id).single().execute()
    user = _extract_data(result)
    return user.get("credits_balance", 0.0)
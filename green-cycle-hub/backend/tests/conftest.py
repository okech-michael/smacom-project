"""
Shared pytest fixtures for the SMACOM test suite.
"""
import pytest
from unittest.mock import MagicMock, AsyncMock
from httpx import AsyncClient, ASGITransport
from main import app


# ── Supabase mock fixture ─────────────────────────────────────────────────────

@pytest.fixture
def mock_supabase():
    """
    Returns a MagicMock that mimics the Supabase client's
    fluent query builder interface (.table().select().eq()...execute()).
    """
    supabase = MagicMock()

    def make_query_chain():
        query = MagicMock()
        query.eq = MagicMock(return_value=query)
        query.neq = MagicMock(return_value=query)
        query.gt = MagicMock(return_value=query)
        query.gte = MagicMock(return_value=query)
        query.lt = MagicMock(return_value=query)
        query.lte = MagicMock(return_value=query)
        query.in_ = MagicMock(return_value=query)
        query.order = MagicMock(return_value=query)
        query.limit = MagicMock(return_value=query)
        query.range = MagicMock(return_value=query)

        single_chain = MagicMock()
        single_chain.execute = MagicMock(return_value=MagicMock(data=[], count=0))
        query.single = MagicMock(return_value=single_chain)
        query.execute = MagicMock(return_value=MagicMock(data=[], count=0))
        return query

    def make_chain():
        chain = MagicMock()
        chain.select = MagicMock(return_value=make_query_chain())
        chain.insert = MagicMock(return_value=make_query_chain())
        chain.update = MagicMock(return_value=make_query_chain())
        chain.upsert = MagicMock(return_value=make_query_chain())
        chain.delete = MagicMock(return_value=make_query_chain())
        return chain

    chain = make_chain()
    supabase.table = MagicMock(return_value=chain)
    supabase.storage = MagicMock()
    supabase.auth = MagicMock()
    supabase.rpc = MagicMock(return_value=MagicMock(execute=MagicMock(return_value=MagicMock(data=[]))))
    return supabase


# ── Authenticated user fixtures ───────────────────────────────────────────────

@pytest.fixture
def producer_user():
    return {
        "id": "producer-001",
        "email": "producer@test.com",
        "full_name": "Test Producer",
        "role": "producer",
        "status": "verified",
        "subscription_plan": "free",
        "credits_balance": 0,
        "eco_badge": "bronze",
    }


@pytest.fixture
def processor_user():
    return {
        "id": "processor-001",
        "email": "processor@test.com",
        "full_name": "Test Processor",
        "role": "processor",
        "status": "verified",
        "subscription_plan": "premium",
        "credits_balance": 0,
        "eco_badge": "bronze",
    }


@pytest.fixture
def farmer_user():
    return {
        "id": "farmer-001",
        "email": "farmer@test.com",
        "full_name": "Test Farmer",
        "role": "farmer",
        "status": "verified",
        "subscription_plan": "free",
        "credits_balance": 0,
        "eco_badge": "silver",
    }


@pytest.fixture
def admin_user():
    return {
        "id": "admin-001",
        "email": "admin@smacom.co.ke",
        "full_name": "SMACOM Admin",
        "role": "admin",
        "status": "verified",
        "subscription_plan": "premium",
        "credits_balance": 0,
        "eco_badge": "gold",
    }


@pytest.fixture
def learner_user():
    return {
        "id": "learner-001",
        "email": "learner@test.com",
        "full_name": "Test Learner",
        "role": "learner",
        "status": "verified",
        "subscription_plan": "free",
        "credits_balance": 0,
        "eco_badge": "bronze",
    }


# ── Sample data fixtures ──────────────────────────────────────────────────────

@pytest.fixture
def sample_waste_request():
    return {
        "id": "req-001",
        "producer_id": "producer-001",
        "waste_category": "organic",
        "waste_subtype": "food_waste",
        "quantity_kg": 50.0,
        "location_lat": -1.2921,
        "location_lng": 36.8219,
        "location_address": "Nairobi, Kenya",
        "disposal_fee": 250.0,
        "status": "pending",
        "processor_id": None,
    }


@pytest.fixture
def sample_iot_reading():
    from app.models.iot import IoTReading
    return IoTReading(
        unit_id="unit-001",
        temperature_c=60.0,
        moisture_pct=55.0,
        co2_ppm=1200.0,
        fill_level_pct=70.0,
        composting_stage="active",
        progress_pct=65.0,
    )


@pytest.fixture
def sample_payment():
    return {
        "id": "pay-001",
        "user_id": "producer-001",
        "reference_id": "req-001",
        "reference_type": "waste_request",
        "amount": 250.0,
        "provider": "mpesa",
        "status": "pending",
    }


@pytest.fixture
def sample_order():
    return {
        "id": "order-001",
        "farmer_id": "farmer-001",
        "status": "pending",
        "total_amount": 5000.0,
        "platform_commission": 350.0,
        "seller_payout": 4650.0,
    }

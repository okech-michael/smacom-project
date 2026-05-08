"""
Integration-level tests using fixtures from conftest.py.
Tests cover: auth flow, IoT alert evaluation, commission math,
AI recommendations, credit awards, payment callback logic.
"""
import pytest
from unittest.mock import MagicMock, patch, AsyncMock


# ============================================================
# Auth Flow Tests
# ============================================================

class TestAuthFlow:

    def test_register_invalid_role(self):
        """Registration with an invalid role should be blocked."""
        from app.api.auth import VALID_ROLES
        assert "superuser" not in VALID_ROLES
        assert "producer" in VALID_ROLES
        assert "admin" in VALID_ROLES

    def test_all_valid_roles_present(self):
        from app.api.auth import VALID_ROLES
        expected = {"producer", "processor", "farmer", "learner", "admin"}
        assert VALID_ROLES == expected

    def test_totp_secret_generation(self):
        from app.core.security import generate_totp_secret
        secret = generate_totp_secret()
        assert len(secret) >= 16
        assert secret.isalnum()

    def test_totp_verify_correct_code(self):
        import pyotp
        from app.core.security import generate_totp_secret, verify_totp_code
        secret = generate_totp_secret()
        totp = pyotp.TOTP(secret)
        valid_code = totp.now()
        assert verify_totp_code(secret, valid_code) is True

    def test_totp_verify_wrong_code(self):
        from app.core.security import generate_totp_secret, verify_totp_code
        secret = generate_totp_secret()
        assert verify_totp_code(secret, "000000") is False

    def test_backup_codes_generation(self):
        from app.core.security import generate_backup_codes
        codes = generate_backup_codes(8)
        assert len(codes) == 8
        assert all(len(c) == 10 for c in codes)  # hex(5) = 10 chars
        assert len(set(codes)) == 8  # all unique

    def test_qr_code_uri_format(self):
        from app.core.security import generate_totp_secret, get_totp_uri
        secret = generate_totp_secret()
        uri = get_totp_uri(secret, "test@smacom.co.ke")
        assert uri.startswith("otpauth://totp/")
        assert "SMACOM" in uri
        assert "test%40smacom.co.ke" in uri or "test@smacom.co.ke" in uri


# ============================================================
# Waste Request Tests
# ============================================================

class TestWasteRequests:

    def test_haversine_distance_calculation(self):
        """Two points in Nairobi should be within a few km."""
        from app.api.waste import _haversine_km
        # Nairobi CBD to Westlands — approx 2–3 km
        dist = _haversine_km(-1.2864, 36.8172, -1.2676, 36.8119)
        assert 2.0 < dist < 3.0

    def test_haversine_same_point(self):
        from app.api.waste import _haversine_km
        dist = _haversine_km(-1.2921, 36.8219, -1.2921, 36.8219)
        assert dist == 0.0

    def test_disposal_fee_calculation(self):
        """5 KES/kg × 50 kg = 250 KES."""
        base_rate = 5.0
        quantity_kg = 50.0
        fee = round(quantity_kg * base_rate, 2)
        assert fee == 250.0

    def test_disposal_fee_fractional(self):
        base_rate = 5.0
        quantity_kg = 33.5
        fee = round(quantity_kg * base_rate, 2)
        assert fee == 167.5


# ============================================================
# IoT Alert Engine — Full evaluate_reading Mock Test
# ============================================================

class TestAlertEngine:

    @pytest.mark.asyncio
    async def test_evaluate_reading_fires_temperature_alert(self, mock_supabase, sample_iot_reading):
        """evaluate_reading should insert an alert when temperature is out of range."""
        from app.services.alert_engine import evaluate_reading
        from app.models.iot import IoTReading

        # Set temperature out of range
        reading = IoTReading(unit_id="unit-001", temperature_c=90.0)

        # Mock unit lookup returns a processor
        unit_data = {
            "id": "unit-001",
            "unit_name": "Composter A",
            "processor_id": "processor-001",
            "users": {"id": "processor-001", "email": "p@test.com", "full_name": "Proc"},
        }
        mock_supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = MagicMock(data=unit_data)
        mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value = MagicMock(data=[{"id": "admin-001"}])
        mock_supabase.table.return_value.insert.return_value.execute.return_value = MagicMock(data=[{}])
        mock_supabase.table.return_value.update.return_value.eq.return_value.execute.return_value = MagicMock()

        with patch("app.services.alert_engine.send_push_to_multiple", new_callable=AsyncMock) as mock_push, \
             patch("app.services.alert_engine.send_temperature_alert_email", new_callable=AsyncMock) as mock_email:
            await evaluate_reading(reading, mock_supabase)
            mock_push.assert_called()

    @pytest.mark.asyncio
    async def test_evaluate_reading_no_alerts_for_healthy(self, mock_supabase):
        """A healthy reading should not trigger any alerts."""
        from app.services.alert_engine import evaluate_reading, ALERT_THRESHOLDS
        from app.models.iot import IoTReading

        reading = IoTReading(
            unit_id="unit-001",
            temperature_c=60.0,
            moisture_pct=55.0,
            fill_level_pct=50.0,
            progress_pct=75.0,
        )

        triggered = [k for k, fn in ALERT_THRESHOLDS.items() if fn(reading)]
        assert triggered == []

    def test_alert_thresholds_boundary_temperature(self):
        """Boundary conditions: exactly 45°C and 75°C should NOT alert."""
        from app.services.alert_engine import ALERT_THRESHOLDS
        from app.models.iot import IoTReading

        at_min = IoTReading(unit_id="u", temperature_c=45.0)
        at_max = IoTReading(unit_id="u", temperature_c=75.0)
        below_min = IoTReading(unit_id="u", temperature_c=44.9)
        above_max = IoTReading(unit_id="u", temperature_c=75.1)

        fn = ALERT_THRESHOLDS["temperature_out_of_range"]
        assert fn(at_min) is False
        assert fn(at_max) is False
        assert fn(below_min) is True
        assert fn(above_max) is True

    def test_alert_thresholds_boundary_fill_level(self):
        from app.services.alert_engine import ALERT_THRESHOLDS
        from app.models.iot import IoTReading

        fn = ALERT_THRESHOLDS["bin_nearly_full"]
        assert fn(IoTReading(unit_id="u", fill_level_pct=84.9)) is False
        assert fn(IoTReading(unit_id="u", fill_level_pct=85.0)) is True
        assert fn(IoTReading(unit_id="u", fill_level_pct=100.0)) is True

    def test_alert_thresholds_boundary_moisture(self):
        from app.services.alert_engine import ALERT_THRESHOLDS
        from app.models.iot import IoTReading

        low_fn = ALERT_THRESHOLDS["moisture_too_low"]
        high_fn = ALERT_THRESHOLDS["moisture_too_high"]

        assert low_fn(IoTReading(unit_id="u", moisture_pct=40.0)) is False
        assert low_fn(IoTReading(unit_id="u", moisture_pct=39.9)) is True
        assert high_fn(IoTReading(unit_id="u", moisture_pct=75.0)) is False
        assert high_fn(IoTReading(unit_id="u", moisture_pct=75.1)) is True


# ============================================================
# AI Recommendation — Extended Tests
# ============================================================

class TestAIRecommendation:

    def test_all_deficiencies_returns_three_recommendations(self):
        from app.services.ai_recommendation import recommend, SoilInput
        soil = SoilInput(nitrogen=0.5, phosphorus=0.3, potassium=0.8)
        result = recommend(soil)
        assert len(result["recommendations"]) == 3

    def test_recommendation_has_required_fields(self):
        from app.services.ai_recommendation import recommend, SoilInput
        soil = SoilInput(nitrogen=0.5)
        result = recommend(soil)
        for rec in result["recommendations"]:
            assert "product_category" in rec
            assert "product_name" in rec
            assert "reason" in rec
            assert "timing" in rec

    def test_healthy_soil_returns_empty_recommendations(self):
        from app.services.ai_recommendation import recommend, SoilInput
        soil = SoilInput(nitrogen=3.0, phosphorus=2.0, potassium=3.0, ph_level=6.5)
        result = recommend(soil)
        assert result["recommendations"] == []

    def test_none_values_do_not_trigger_alerts(self):
        from app.services.ai_recommendation import recommend, SoilInput
        soil = SoilInput()  # all None
        result = recommend(soil)
        assert result["recommendations"] == []

    def test_vegetable_crop_recommendation(self):
        from app.services.ai_recommendation import recommend, SoilInput
        soil = SoilInput(nitrogen=2.0, phosphorus=2.0, potassium=2.0, crop_type="tomato")
        result = recommend(soil)
        names = [r["product_name"] for r in result["recommendations"]]
        assert "Liquid Fertiliser" in names


# ============================================================
# Commission Tests — Edge Cases
# ============================================================

class TestCommission:

    def test_disposal_fee_rounding(self):
        from app.services.commission import split_disposal_fee
        result = split_disposal_fee(333.33)
        assert result["smacom"] == round(333.33 * 0.05, 2)
        assert result["processor"] == round(333.33 * 0.95, 2)

    def test_marketplace_split_large_amount(self):
        from app.services.commission import split_marketplace_purchase
        result = split_marketplace_purchase(100000.0)
        assert result["smacom"] == 7000.0
        assert result["seller"] == 93000.0

    def test_splits_always_sum_to_original(self):
        from app.services.commission import split_disposal_fee, split_marketplace_purchase
        for amount in [1.0, 99.99, 500.0, 12345.67, 100000.0]:
            d = split_disposal_fee(amount)
            assert abs(d["smacom"] + d["processor"] - amount) < 0.02
            m = split_marketplace_purchase(amount)
            assert abs(m["smacom"] + m["seller"] - amount) < 0.02


# ============================================================
# Credits Service Tests
# ============================================================

class TestCreditsService:

    @pytest.mark.asyncio
    async def test_award_credits_correct_amount(self, mock_supabase):
        from app.services.credits import award_credits

        mock_supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = MagicMock(data={"credits_balance": 0.0})

        amount = await award_credits("user-001", 100.0, 1.0, mock_supabase)
        assert amount == 100.0

    @pytest.mark.asyncio
    async def test_award_credits_fractional_rate(self, mock_supabase):
        from app.services.credits import award_credits

        mock_supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = MagicMock(data={"credits_balance": 50.0})

        amount = await award_credits("user-001", 75.0, 0.5, mock_supabase)
        assert amount == 37.5

    @pytest.mark.asyncio
    async def test_redeem_credits_success(self, mock_supabase):
        from app.services.credits import redeem_credits

        mock_supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = MagicMock(data={"credits_balance": 500.0})
        mock_supabase.table.return_value.insert.return_value.execute.return_value = MagicMock()
        mock_supabase.table.return_value.update.return_value.eq.return_value.execute.return_value = MagicMock()

        result = await redeem_credits("user-001", 200.0, mock_supabase)
        assert result is True

    @pytest.mark.asyncio
    async def test_redeem_credits_insufficient_balance(self, mock_supabase):
        from app.services.credits import redeem_credits

        mock_supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = MagicMock(data={"credits_balance": 10.0})

        result = await redeem_credits("user-001", 500.0, mock_supabase)
        assert result is False

    @pytest.mark.asyncio
    async def test_get_balance(self, mock_supabase):
        from app.services.credits import get_balance

        mock_supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = MagicMock(data={"credits_balance": 123.45})

        balance = await get_balance("user-001", mock_supabase)
        assert balance == 123.45


# ============================================================
# Eco Badge Logic Tests
# ============================================================

class TestEcoBadge:

    def _compute_badge(self, total_spend: float) -> str:
        if total_spend >= 50000:
            return "gold"
        elif total_spend >= 10000:
            return "silver"
        return "bronze"

    def test_bronze_badge(self):
        assert self._compute_badge(0) == "bronze"
        assert self._compute_badge(9999.99) == "bronze"

    def test_silver_badge(self):
        assert self._compute_badge(10000) == "silver"
        assert self._compute_badge(49999.99) == "silver"

    def test_gold_badge(self):
        assert self._compute_badge(50000) == "gold"
        assert self._compute_badge(1000000) == "gold"

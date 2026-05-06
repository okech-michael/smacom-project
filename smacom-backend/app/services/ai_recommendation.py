from pydantic import BaseModel
from typing import Optional


class SoilInput(BaseModel):
    nitrogen: Optional[float] = None
    phosphorus: Optional[float] = None
    potassium: Optional[float] = None
    ph_level: Optional[float] = None
    crop_type: Optional[str] = None
    # Allow extra fields from DB row (e.g. id, farmer_id, submitted_at)
    model_config = {"extra": "ignore"}


def recommend(soil: SoilInput) -> dict:
    """
    Rules-based soil recommendation engine.
    Returns product recommendations based on deficiencies detected.
    """
    recommendations = []

    # Nitrogen deficiency
    if soil.nitrogen is not None and soil.nitrogen < 1.5:
        recommendations.append({
            "product_category": "fertiliser",
            "product_name": "Premium Organic Compost",
            "quantity_mt": 1.5,
            "reason": f"Low nitrogen detected ({soil.nitrogen} g/kg). NPK 3-2-2 compost will restore soil nitrogen.",
            "timing": "Apply 30 days before sowing",
        })

    # Phosphorus deficiency
    if soil.phosphorus is not None and soil.phosphorus < 1.0:
        recommendations.append({
            "product_category": "fertiliser",
            "product_name": "Liquid Fertiliser",
            "quantity_litres": 20,
            "reason": f"Low phosphorus ({soil.phosphorus} g/kg). Liquid fertiliser improves root development.",
            "timing": "Apply at planting",
        })

    # Potassium deficiency
    if soil.potassium is not None and soil.potassium < 1.8:
        recommendations.append({
            "product_category": "eco_products",
            "product_name": "Biochar Soil Enhancer",
            "quantity_mt": 0.5,
            "reason": f"Low potassium ({soil.potassium} g/kg). Biochar improves water retention and potassium availability.",
            "timing": "Mix into top 10cm of soil before planting",
        })

    # pH too acidic
    if soil.ph_level is not None and soil.ph_level < 5.5:
        recommendations.append({
            "product_category": "eco_products",
            "product_name": "Agricultural Lime",
            "quantity_mt": 1.0,
            "reason": f"Soil pH {soil.ph_level} is too acidic. Lime will raise pH toward optimal 6.0–7.0 range.",
            "timing": "Apply 4–6 weeks before planting and incorporate into soil",
        })

    # pH too alkaline
    if soil.ph_level is not None and soil.ph_level > 7.5:
        recommendations.append({
            "product_category": "eco_products",
            "product_name": "Sulphur Amendment",
            "quantity_mt": 0.3,
            "reason": f"Soil pH {soil.ph_level} is too alkaline. Sulphur amendment will lower pH toward optimal range.",
            "timing": "Apply several weeks before planting",
        })

    # Crop-specific additions
    if soil.crop_type:
        crop = soil.crop_type.lower()
        if "maize" in crop or "corn" in crop:
            if not any(r["product_name"] == "Premium Organic Compost" for r in recommendations):
                recommendations.append({
                    "product_category": "fertiliser",
                    "product_name": "Premium Organic Compost",
                    "quantity_mt": 1.0,
                    "reason": "Maize is a heavy feeder. Organic compost improves overall soil structure and nutrients.",
                    "timing": "Incorporate into soil 2 weeks before planting",
                })
        elif "tomato" in crop or "vegetable" in crop:
            recommendations.append({
                "product_category": "fertiliser",
                "product_name": "Liquid Fertiliser",
                "quantity_litres": 15,
                "reason": "Vegetables benefit from liquid feed during active growth stages.",
                "timing": "Apply every 2 weeks during growing season",
            })

    if not recommendations:
        return {
            "message": "Soil levels are healthy. No urgent amendments needed.",
            "recommendations": [],
        }

    return {"recommendations": recommendations}
def split_disposal_fee(amount: float) -> dict:
    """
    Disposal fee split:
      - 5% retained by SMACOM
      - 95% paid to processor
    """
    smacom = round(amount * 0.05, 2)
    processor = round(amount * 0.95, 2)
    return {"smacom": smacom, "processor": processor}


def split_marketplace_purchase(amount: float) -> dict:
    """
    Marketplace purchase split:
      - 7% retained by SMACOM
      - 93% paid to seller
    """
    smacom = round(amount * 0.07, 2)
    seller = round(amount * 0.93, 2)
    return {"smacom": smacom, "seller": seller}
# rules.py
def apply_rules(subject: str, body: str, prediction: dict):
    text = f"{subject} {body}".lower()
    category = prediction["category"]

    if category == "Canceled Order Explanation" and "refund" in text:
        return {"category": "Refund Status", "rule_applied": True}

    return {"category": category, "rule_applied": False}

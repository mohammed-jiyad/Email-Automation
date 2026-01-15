# rules.py


def apply_rules(subject: str, body: str, prediction: dict):
    text = f"{subject} {body}".lower()

    # Default ML output
    category = prediction["category"]
    confidence = prediction.get("confidence", 0)

    # -----------------------------
    # 🔒 HIGH-PRIORITY RULES
    # -----------------------------

    # Password Reset (very strong intent)
    if any(
        k in text
        for k in [
            "forgot my password",
            "reset password",
            "password reset",
            "can't login",
            "cannot login",
            "unable to login",
        ]
    ):
        return {
            "category": "Password Reset",
            "confidence": 1.0,
            "rule_applied": True,
            "rule": "PASSWORD_RESET_OVERRIDE",
        }

    # Order Status (explicit order reference)
    if "order #" in text and any(
        k in text
        for k in ["status", "where is my order", "order update", "track my order"]
    ):
        return {
            "category": "Order Status Request",
            "confidence": 0.95,
            "rule_applied": True,
            "rule": "ORDER_STATUS_OVERRIDE",
        }

    # Refund Status
    if any(k in text for k in ["refund", "money back", "return my money"]):
        return {
            "category": "Refund Status",
            "confidence": 0.95,
            "rule_applied": True,
            "rule": "REFUND_OVERRIDE",
        }

    # -----------------------------
    # ⚠️ ML FALLBACK
    # -----------------------------
    return {
        "category": category,
        "confidence": confidence,
        "rule_applied": False,
        "rule": None,
    }

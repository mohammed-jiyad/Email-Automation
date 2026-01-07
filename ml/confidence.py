def calibrate_confidence(raw_confidence: float, rule_applied: bool):
    if rule_applied:
        return min(raw_confidence + 0.05, 0.99)

    if raw_confidence < 0.60:
        return raw_confidence * 0.8

    return raw_confidence

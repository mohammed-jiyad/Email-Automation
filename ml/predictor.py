from classifier import classify_with_bert
from rules import apply_rules
from confidence import calibrate_confidence


def predict_email(subject: str, body: str):
    bert_result = classify_with_bert(subject, body)

    rule_result = apply_rules(subject, body, bert_result)

    final_confidence = calibrate_confidence(
        bert_result["confidence"], rule_result["rule_applied"]
    )

    return {
        "category": rule_result["category"],
        "confidence": round(final_confidence, 4),
        "used_rules": rule_result["rule_applied"],
    }

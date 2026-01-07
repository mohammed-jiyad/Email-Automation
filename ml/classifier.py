import torch
import json
from transformers import AutoTokenizer, AutoModelForSequenceClassification

MODEL_PATH = "model/bert_email_model"
LABELS_PATH = "model/labels.json"

tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
model.eval()

with open(LABELS_PATH) as f:
    LABELS = json.load(f)


def classify_with_bert(subject: str, body: str):
    text = f"{subject} {body}"

    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=256,
    )

    with torch.no_grad():
        logits = model(**inputs).logits
        probs = torch.softmax(logits, dim=1)[0]

    confidence, class_id = torch.max(probs, dim=0)

    return {
        "category": LABELS[class_id.item()],
        "confidence": confidence.item(),
        "probs": probs.tolist(),
    }

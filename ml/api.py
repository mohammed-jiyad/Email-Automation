# api.py
from fastapi import FastAPI
from pydantic import BaseModel
from predictor import predict_email

app = FastAPI(title="Email Classification Service")


class EmailInput(BaseModel):
    subject: str
    body: str


@app.post("/classify")
def classify_email(data: EmailInput):
    return predict_email(data.subject, data.body)


@app.get("/health")
def health():
    return {"status": "ok"}

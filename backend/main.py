from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import os
import io
import PyPDF2

app = FastAPI(title="ResiLens AI API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(os.path.join(BASE_DIR, "model.pkl"))
vectorizer = joblib.load(os.path.join(BASE_DIR, "vectorizer.pkl"))


class ResumeInput(BaseModel):
    text: str


@app.get("/")
def root():
    return {"message": "ResiLens AI backend is running"}


# -----------------------------
# SHARED DECISION FUNCTION
# -----------------------------
def classify_resume(text: str):
    text_lower = text.lower()

    # Hard reject keywords (rule-based guardrail)
    hard_reject_keywords = [
        "ms word", "excel", "office assistant", "clerk",
        "administrative", "sales", "retail", "arts"
    ]

    text_vector = vectorizer.transform([text])
    probabilities = model.predict_proba(text_vector)[0]
    confidence = probabilities[1] * 100  # shortlisted probability

    # Rule-based override (industry practice)
    if any(word in text_lower for word in hard_reject_keywords):
        return "Rejected", round(min(confidence, 35), 2)

    # Threshold-based decision
    if confidence >= 65:
        return "Shortlisted", round(confidence, 2)
    elif confidence >= 45:
        return "Needs Review", round(confidence, 2)
    else:
        return "Rejected", round(confidence, 2)


# -----------------------------
# TEXT INPUT ENDPOINT
# -----------------------------
@app.post("/predict")
def predict_resume(data: ResumeInput):
    result, confidence = classify_resume(data.text)

    return {
        "result": result,
        "confidence": confidence
    }


# -----------------------------
# FILE INPUT ENDPOINT
# -----------------------------
@app.post("/predict-file")
async def predict_from_file(file: UploadFile = File(...)):
    if file.content_type not in ["application/pdf", "text/plain"]:
        return {"error": "Only PDF or TXT files are supported"}

    # Read file
    if file.content_type == "application/pdf":
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(await file.read()))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
    else:
        text = (await file.read()).decode("utf-8", errors="ignore")

    result, confidence = classify_resume(text)

    return {
        "result": result,
        "confidence": confidence,
        "text_preview": text[:1000]
    }





































# ______________________________________________________________________________________________________________________________________________


# To run the app, use the command:
# uvicorn backend.main:app --reload
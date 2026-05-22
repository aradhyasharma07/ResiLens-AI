from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from pymongo import MongoClient
from openai import OpenAI
from dotenv import load_dotenv
from pydantic import BaseModel

from werkzeug.security import (
    generate_password_hash,
    check_password_hash,
)

from datetime import datetime
from typing import Optional

import os
import io
# import re
import uuid
import certifi
import pickle
import fitz

from docx import Document

load_dotenv()

OPENROUTER_API_KEY = os.getenv(
    "OPENROUTER_API_KEY"
)

MONGO_URI = os.getenv(
    "MONGO_URI"
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://resilens-ai-frontend.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client_ai = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
)

mongo_client = MongoClient(
    MONGO_URI,
    tlsCAFile=certifi.where()
)

db = mongo_client[
    "resilens_ai"
]

collection = db[
    "resume_analysis"
]

users_collection = db[
    "users"
]

UPLOAD_FOLDER = (
    "uploaded_resumes"
)

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

MODEL_NAME = (
    "openrouter/auto"
)

INVALID_DOCUMENT_KEYWORDS = [

    "assignment",
    "chapter",
    "unit",
    "lecture",
    "notes",
    "question bank",
    "semester",
    "operating system",
    "data structure",
    "computer networks",
]

with open(
    "model.pkl",
    "rb"
) as f:

    ml_model = pickle.load(f)

with open(
    "vectorizer.pkl",
    "rb"
) as f:

    vectorizer = pickle.load(f)


def extract_text_from_pdf(
    file_bytes
):

    text = ""

    pdf_document = fitz.open(
    stream=file_bytes,
        filetype="pdf"
    )

    for page in pdf_document:

        text += (
            page.get_text()
            + "\n"
        )

    return text

def extract_text_from_docx(
    file_bytes
):

    text = ""

    doc = Document(
        io.BytesIO(
            file_bytes
        )
    )

    for para in (
        doc.paragraphs
    ):

        text += (
            para.text + "\n"
        )

    return text


def extract_resume_text(
    filename,
    file_bytes
):

    filename = (
        filename.lower()
    )

    if filename.endswith(
        ".pdf"
    ):

        return (
            extract_text_from_pdf(
                file_bytes
            )
        )

    elif filename.endswith(
        ".docx"
    ):

        return (
            extract_text_from_docx(
                file_bytes
            )
        )

    return file_bytes.decode(
        "utf-8",
        errors="ignore"
    )


def validate_resume_structure(
    resume_text
):

    cleaned_text = (
        resume_text.lower()
        .strip()
    )

    if len(cleaned_text) < 80:
        return False

    positive_signals = 0

    resume_keywords = [

        "experience",
        "education",
        "skills",
        "project",
        "projects",
        "internship",
        "work",
        "linkedin",
        "github",
        "email",
        "phone",
        "developer",
        "engineer",
        "react",
        "python",
        "javascript",
    ]

    for keyword in (
        resume_keywords
    ):

        if keyword in cleaned_text:
            positive_signals += 1

    invalid_signals = 0

    for keyword in (
        INVALID_DOCUMENT_KEYWORDS
    ):

        if keyword in cleaned_text:
            invalid_signals += 1

    if invalid_signals >= 4:
        return False

    return positive_signals >= 2


def predict_resume_ml(
    resume_text
):

    vec = vectorizer.transform(
        [resume_text]
    )

    proba = (
        ml_model.predict_proba(
            vec
        )[0]
    )

    shortlisted_prob = float(
        proba[1]
    )

    rejected_prob = float(
        proba[0]
    )

    if shortlisted_prob >= 0.50:

        prediction = (
            "Shortlisted"
        )

        confidence = float(
            round(
                shortlisted_prob * 100,
                2
            )
        )

    else:

        prediction = (
            "Rejected"
        )

        confidence = float(
            round(
                rejected_prob * 100,
                2
            )
        )

    skills_match = int(
        min(
            confidence + 5,
            100
        )
    )

    experience_fit = int(
        min(
            confidence * 0.9,
            100
        )
    )

    return (
        prediction,
        confidence,
        skills_match,
        experience_fit,
    )


def generate_ai_response(
    prompt
):

    try:

        response = (
            client_ai.chat.completions.create(

                model=MODEL_NAME,

                messages=[
                    {
                        "role":
                        "system",

                        "content":
                        (
                            "You are a professional ATS recruiter assistant."
                        ),
                    },

                    {
                        "role":
                        "user",

                        "content":
                        prompt,
                    },
                ],

                temperature=0.5,

                max_tokens=250,
            )
        )

        return (
            response
            .choices[0]
            .message
            .content
            .strip()
        )

    except Exception:

        return (
            "AI feedback temporarily unavailable."
        )


def get_ai_feedback(
    resume_text,
    jd_text,
    score,
    final_result,
):

    prompt = f"""
You are a professional recruiter.

Resume Match Score: {score}%
Final Result: {final_result}

Job Description:
{jd_text}

Resume:
{resume_text[:2500]}
"""

    return generate_ai_response(
        prompt
    )


class SignupModel(
    BaseModel
):
    name: str
    email: str
    password: str


class LoginModel(
    BaseModel
):
    email: str
    password: str


@app.post("/signup")
async def signup(
    user: SignupModel
):

    existing_user = (
        users_collection.find_one(
            {
                "email":
                user.email
            }
        )
    )

    if existing_user:

        return {
            "error":
            "User already exists"
        }

    hashed_password = (
        generate_password_hash(
            user.password
        )
    )

    users_collection.insert_one({

        "name":
        user.name,

        "email":
        user.email,

        "password":
        hashed_password,
    })

    return {

        "message":
        "Account created successfully",

        "user": {

            "name":
            user.name,

            "email":
            user.email,
        }
    }


@app.post("/login")
async def login(
    user: LoginModel
):

    existing_user = (
        users_collection.find_one(
            {
                "email":
                user.email
            }
        )
    )

    if not existing_user:

        return {
            "error":
            "User not found"
        }

    password_valid = (
        check_password_hash(
            existing_user[
                "password"
            ],
            user.password,
        )
    )

    if not password_valid:

        return {
            "error":
            "Invalid password"
        }

    return {

        "message":
        "Login successful",

        "user": {

            "name":
            existing_user[
                "name"
            ],

            "email":
            existing_user[
                "email"
            ],
        },
    }


@app.post("/analyze")
async def analyze_resume(

    file: UploadFile = File(...),

    job_description: str = Form(...),
):

    try:

        file_bytes = (
            await file.read()
        )

        unique_filename = (
            f"{uuid.uuid4()}_{file.filename}"
        )

        saved_file_path = (
            os.path.join(
                UPLOAD_FOLDER,
                unique_filename
            )
        )

        with open(
            saved_file_path,
            "wb"
        ) as f:

            f.write(file_bytes)

        resume_text = (
            extract_resume_text(
                file.filename,
                file_bytes,
            )
        )

        if not resume_text.strip():

            return {
                "error":
                "Could not extract text from resume."
            }

        is_valid_resume = (
            validate_resume_structure(
                resume_text
            )
        )

        if not is_valid_resume:

            return {

                "fileName":
                file.filename,

                "result":
                "Rejected",

                "confidence":
                0,

                "skillsMatch":
                0,

                "experienceFit":
                0,

                "feedback":
                (
                    "The uploaded document does not appear to be a valid professional resume."
                ),

                "matchedSkills":
                [],

                "preview":
                resume_text[:1500],

                "jobDescription":
                job_description,

                "time":
                datetime.now().strftime(
                    "%d %b %Y, %I:%M %p"
                ),

                "resumePath":
                saved_file_path,
            }

        (
            final_result,
            final_score,
            skills_match,
            experience_fit,
        ) = predict_resume_ml(
            resume_text
        )

        try:

            ai_feedback = (
                get_ai_feedback(

                    resume_text,

                    job_description,

                    final_score,

                    final_result,
                )
            )

        except Exception:

            ai_feedback = (
                "Resume analyzed successfully."
            )

        result = {

            "fileName":
            file.filename,

            "result":
            final_result,

            "confidence":
            final_score,

            "skillsMatch":
            skills_match,

            "experienceFit":
            experience_fit,

            "feedback":
            ai_feedback,

            "matchedSkills":
            [],

            "preview":
            resume_text[:4000],

            "jobDescription":
            job_description,

            "time":
            datetime.now().strftime(
                "%d %b %Y, %I:%M %p"
            ),

            "resumePath":
            saved_file_path,
        }

        inserted = (
            collection.insert_one(
                result
            )
        )

        result["_id"] = str(
            inserted.inserted_id
        )

        return result

    except Exception as e:

        return {
            "error":
            str(e)
        }


@app.get("/history")
def get_history():

    results = (
        collection.find()
        .sort("_id", -1)
        .limit(100)
    )

    final_results = []

    for item in results:

        item["_id"] = str(
            item["_id"]
        )

        final_results.append(
            item
        )

    return final_results


@app.get("/open-resume")
def open_resume(path: str):

    if os.path.exists(path):

        return FileResponse(
            path
        )

    return {
        "error":
        "Resume file not found"
    }


@app.post("/chat")
async def chat(
    message: dict
):

    try:

        user_message = (
            message.get(
                "message",
                ""
            )
        )

        response = (
            client_ai.chat.completions.create(

                model=MODEL_NAME,

                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are ResiLens AI recruiter assistant."
                        ),
                    },
                    {
                        "role": "user",
                        "content": user_message,
                    },
                ],

                max_tokens=300,
                temperature=0.7,
            )
        )

        reply = (
            response
            .choices[0]
            .message
            .content
        )

        return {
            "reply": reply
        }

    except Exception as e:

        print(
            "Chatbot Error:",
            str(e)
        )

        return {
            "reply":
            "I could not process that request right now."
        }
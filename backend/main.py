# 📁 main.py (FastAPI backend)
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import shutil
import os
from engagement_pipeline_img import run_engagement_pipeline  # or whichever file contains your pipeline

app = FastAPI()

# Enable CORS for Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload-video/")
async def upload_video(
    file: UploadFile = File(...),
    teacher_id: str = Form(...),
    subject: str = Form(...),
    grade: str = Form(...)
):
    os.makedirs("videos", exist_ok=True)
    file_path = os.path.join("videos", file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        results = run_engagement_pipeline(file_path)
        results.update({
            "teacher_id": teacher_id,
            "subject": subject,
            "grade": grade
        })
        return JSONResponse(content=results)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

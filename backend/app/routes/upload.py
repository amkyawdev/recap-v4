import os
import uuid
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Project, SubtitleTrack

router = APIRouter()

STORAGE_DIR = Path("/app/storage")


@router.post("/upload")
async def upload_video(
    file: UploadFile = File(...),
    user_session_id: str = Form(...),
    db: Session = Depends(get_db)
):
    project_id = str(uuid.uuid4())
    file_extension = file.filename.split(".")[-1] if "." in file.filename else "mp4"
    safe_filename = f"{project_id}.{file_extension}"
    file_path = STORAGE_DIR / "uploads" / safe_filename
    
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
    
    project = Project(
        id=project_id,
        user_session_id=user_session_id,
        original_video_path=str(file_path),
        status="editing"
    )
    db.add(project)
    
    subtitle = SubtitleTrack(
        project_id=project_id,
        srt_content="",
        font_family="Cloud AI Sans",
        font_color="#FFFFFF",
        font_size=24,
        background_opacity=0.5
    )
    db.add(subtitle)
    db.commit()
    db.refresh(project)
    
    return {
        "project_id": project_id,
        "status": "editing",
        "message": "Video uploaded successfully"
    }


@router.get("/projects/{project_id}")
async def get_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return {
        "id": project.id,
        "user_session_id": project.user_session_id,
        "original_video_path": project.original_video_path,
        "subtitled_video_path": project.subtitled_video_path,
        "status": project.status,
        "created_at": project.created_at
    }
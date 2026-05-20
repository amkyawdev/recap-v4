import os
import uuid
from pathlib import Path
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Project, RenderJob
from app.services.ffmpeg_service import render_video

router = APIRouter()

STORAGE_DIR = Path("/app/storage")


@router.post("/render/{project_id}")
async def start_render(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    render_job = RenderJob(
        project_id=project_id,
        status="processing"
    )
    db.add(render_job)
    db.commit()
    db.refresh(render_job)
    
    try:
        output_path = render_video(
            project.original_video_path,
            project.subtitles.srt_content if project.subtitles else "",
            STORAGE_DIR / "rendered"
        )
        
        render_job.status = "done"
        render_job.output_path = str(output_path)
        render_job.completed_at = datetime.now()
        
        project.status = "done"
        project.subtitled_video_path = str(output_path)
        
        db.commit()
    except Exception as e:
        render_job.status = "failed"
        db.commit()
        raise HTTPException(status_code=500, detail=f"Render failed: {str(e)}")
    
    return {
        "render_job_id": render_job.id,
        "status": render_job.status,
        "output_path": render_job.output_path
    }


@router.get("/render/status/{project_id}")
async def get_render_status(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    render_job = db.query(RenderJob).filter(RenderJob.project_id == project_id).order_by(RenderJob.started_at.desc()).first()
    
    if not render_job:
        return {"status": "pending", "message": "No render job"}
    
    return {
        "render_job_id": render_job.id,
        "status": render_job.status,
        "output_path": render_job.output_path,
        "message": "Render complete" if render_job.status == "done" else "Rendering in progress"
    }
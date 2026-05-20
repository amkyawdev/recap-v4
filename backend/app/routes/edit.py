from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import SubtitleTrack
from app.schemas import SubtitleTrackCreate, SubtitleTrackUpdate, SubtitleTrackResponse

router = APIRouter()


@router.put("/subtitle/{project_id}")
async def update_subtitle(
    project_id: str,
    subtitle_data: SubtitleTrackUpdate,
    db: Session = Depends(get_db)
):
    subtitle = db.query(SubtitleTrack).filter(SubtitleTrack.project_id == project_id).first()
    if not subtitle:
        raise HTTPException(status_code=404, detail="Subtitle track not found")
    
    subtitle.srt_content = subtitle_data.srt_content
    subtitle.font_family = subtitle_data.font_family
    subtitle.font_color = subtitle_data.font_color
    subtitle.font_size = subtitle_data.font_size
    subtitle.background_opacity = subtitle_data.background_opacity
    
    db.commit()
    db.refresh(subtitle)
    
    return {
        "project_id": project_id,
        "srt_content": subtitle.srt_content,
        "font_family": subtitle.font_family,
        "font_color": subtitle.font_color,
        "font_size": subtitle.font_size,
        "background_opacity": subtitle.background_opacity,
        "message": "Subtitle updated successfully"
    }


@router.get("/subtitle/{project_id}")
async def get_subtitle(project_id: str, db: Session = Depends(get_db)):
    subtitle = db.query(SubtitleTrack).filter(SubtitleTrack.project_id == project_id).first()
    if not subtitle:
        raise HTTPException(status_code=404, detail="Subtitle track not found")
    
    return {
        "project_id": subtitle.project_id,
        "srt_content": subtitle.srt_content,
        "font_family": subtitle.font_family,
        "font_color": subtitle.font_color,
        "font_size": subtitle.font_size,
        "background_opacity": subtitle.background_opacity
    }
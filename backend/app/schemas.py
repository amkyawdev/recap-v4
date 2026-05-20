from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class SubtitleTrackBase(BaseModel):
    srt_content: str = ""
    font_family: str = "Cloud AI Sans"
    font_color: str = "#FFFFFF"
    font_size: int = 24
    background_opacity: float = 0.5


class SubtitleTrackCreate(SubtitleTrackBase):
    pass


class SubtitleTrackUpdate(SubtitleTrackBase):
    pass


class SubtitleTrackResponse(SubtitleTrackBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True


class ProjectBase(BaseModel):
    user_session_id: str


class ProjectCreate(ProjectBase):
    pass


class ProjectResponse(ProjectBase):
    id: int
    original_video_path: Optional[str] = None
    subtitled_video_path: Optional[str] = None
    status: str = "uploading"
    created_at: datetime

    class Config:
        from_attributes = True


class RenderJobBase(BaseModel):
    project_id: int


class RenderJobCreate(RenderJobBase):
    pass


class RenderJobResponse(RenderJobBase):
    id: int
    status: str = "pending"
    output_path: Optional[str] = None
    started_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
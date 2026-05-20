from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_session_id = Column(String, index=True)
    original_video_path = Column(String)
    subtitled_video_path = Column(String, nullable=True)
    status = Column(String, default="uploading")
    created_at = Column(DateTime, server_default=func.now())

    subtitles = relationship("SubtitleTrack", back_populates="project", uselist=False)
    render_jobs = relationship("RenderJob", back_populates="project")


class SubtitleTrack(Base):
    __tablename__ = "subtitle_tracks"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    srt_content = Column(Text, default="")
    font_family = Column(String, default="Cloud AI Sans")
    font_color = Column(String, default="#FFFFFF")
    font_size = Column(Integer, default=24)
    background_opacity = Column(Float, default=0.5)

    project = relationship("Project", back_populates="subtitles")


class RenderJob(Base):
    __tablename__ = "render_jobs"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    status = Column(String, default="pending")
    output_path = Column(String, nullable=True)
    started_at = Column(DateTime, server_default=func.now())
    completed_at = Column(DateTime, nullable=True)

    project = relationship("Project", back_populates="render_jobs")
import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
from app.models import Base
from app.routes import upload, edit, render, about

app = FastAPI(title="Burme Movie Recap API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(edit.router, prefix="/api", tags=["edit"])
app.include_router(render.router, prefix="/api", tags=["render"])
app.include_router(about.router, prefix="/api", tags=["about"])

Base.metadata.create_all(bind=engine)

STORAGE_DIR = Path("/app/storage")
STORAGE_DIR.mkdir(parents=True, exist_ok=True)
(STORAGE_DIR / "uploads").mkdir(exist_ok=True)
(STORAGE_DIR / "subtitles").mkdir(exist_ok=True)
(STORAGE_DIR / "rendered").mkdir(exist_ok=True)
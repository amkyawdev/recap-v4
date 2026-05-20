from fastapi import APIRouter

router = APIRouter()


@router.get("/about")
async def get_about():
    return {
        "app_name": "Burme Movie Recap",
        "version": "1.0.0",
        "description": "Create stunning recap videos with custom subtitles in minutes",
        "tech_stack": {
            "frontend": "React + Vite + Tailwind CSS",
            "backend": "FastAPI (Python)",
            "video_processing": "FFmpeg",
            "container": "Docker"
        },
        "font_credit": "Cloud AI Sans - Designed for Cloud AI platform",
        "contact": "contact@burme.com",
        "github": "https://github.com/burme-recap"
    }
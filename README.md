# recap-v4
Webapp - Burme Movie Recap App

A native-style mobile web app with a gray/red glassmorphic UI and TikTok-like vertical video editing flow.

## Tech Stack

- Frontend: React (with Vite) + Tailwind CSS
- Backend: FastAPI (Python)
- Video Processing: FFmpeg (via ffmpeg-python wrapper)
- Container: Docker + Docker Compose
- Database: SQLite (local) / PostgreSQL (production)

## Getting Started

### Using Docker Compose

```bash
docker-compose up --build
```

### Manual Setup

#### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Default Ports

- Frontend: http://localhost:3000
- Backend: http://localhost:8000

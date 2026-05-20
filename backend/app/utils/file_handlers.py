import os
from pathlib import Path


def save_upload(file_bytes: bytes, filename: str, upload_dir: Path) -> Path:
    file_path = upload_dir / filename
    with open(file_path, "wb") as f:
        f.write(file_bytes)
    return file_path


def delete_file(file_path: str) -> bool:
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
        return False
    except Exception:
        return False


def get_file_size(file_path: str) -> int:
    try:
        return os.path.getsize(file_path)
    except Exception:
        return 0


def ensure_directory(dir_path: Path):
    dir_path.mkdir(parents=True, exist_ok=True)
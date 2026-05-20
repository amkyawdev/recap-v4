import os
import uuid
import ffmpeg
from pathlib import Path


def render_video(input_path: str, srt_content: str, output_dir: Path) -> Path:
    output_filename = f"{uuid.uuid4()}.mp4"
    output_path = output_dir / output_filename
    
    srt_filename = f"{uuid.uuid4()}.srt"
    srt_path = output_dir.parent / "subtitles" / srt_filename
    
    with open(srt_path, "w") as f:
        f.write(srt_content)
    
    if not srt_content.strip():
        os.system(f"cp {input_path} {output_path}")
        return output_path
    
    try:
        stream = ffmpeg.input(input_path)
        stream = ffmpeg.filter(
            stream, 
            'subtitles', 
            srt_path,
            force_style='FontName=Cloud AI Sans,FontSize=24,PrimaryColour=&H00FFFFFF,BackColour=&H80000000'
        )
        ffmpeg.output(stream, str(output_path), c='a', **{'c:v': 'libx264', 'preset': 'fast'}).run(overwrite_output=True, quiet=True)
    except ffmpeg.Error as e:
        print(f"FFmpeg error: {e.stderr}")
        os.system(f"cp {input_path} {output_path}")
    
    if os.path.exists(srt_path):
        os.remove(srt_path)
    
    return output_path
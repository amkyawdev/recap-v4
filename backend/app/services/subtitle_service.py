from typing import List


def parse_srt(srt_content: str) -> List[dict]:
    blocks = srt_content.strip().split("\n\n")
    subtitles = []
    
    for block in blocks:
        lines = block.strip().split("\n")
        if len(lines) < 3:
            continue
        
        try:
            index = int(lines[0])
            timing = lines[1]
            text = "\n".join(lines[2:])
            
            start_time, end_time = timing.split(" --> ")
            
            subtitles.append({
                "index": index,
                "start_time": start_time,
                "end_time": end_time,
                "text": text
            })
        except (ValueError, IndexError):
            continue
    
    return subtitles


def generate_srt(subtitles: List[dict]) -> str:
    blocks = []
    
    for i, sub in enumerate(subtitles, 1):
        block = f"{i}\n{sub['start_time']} --> {sub['end_time']}\n{sub['text']}"
        blocks.append(block)
    
    return "\n\n".join(blocks)


def format_timestamp(seconds: float) -> str:
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds % 1) * 1000)
    
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"
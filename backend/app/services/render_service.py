class RenderService:
    def __init__(self):
        self.jobs = {}
    
    def start_job(self, job_id: str, input_path: str, srt_content: str, output_path: str):
        self.jobs[job_id] = {
            "input_path": input_path,
            "srt_content": srt_content,
            "output_path": output_path,
            "status": "pending",
            "progress": 0
        }
    
    def get_status(self, job_id: str):
        return self.jobs.get(job_id)
    
    def update_progress(self, job_id: str, progress: int):
        if job_id in self.jobs:
            self.jobs[job_id]["progress"] = progress
    
    def complete(self, job_id: str):
        if job_id in self.jobs:
            self.jobs[job_id]["status"] = "done"
            self.jobs[job_id]["progress"] = 100
    
    def fail(self, job_id: str, error: str):
        if job_id in self.jobs:
            self.jobs[job_id]["status"] = "failed"
            self.jobs[job_id]["error"] = error
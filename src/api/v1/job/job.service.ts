import { TJob } from "./job.types";

class JobService {
  
  public async getAllJobs(): Promise<TJob[]> {
    const jobs: TJob[] = [
      {
        "id": "1029od",
        "title": "Frontend Developer"
      },
      {
        "id": "29d102",
        "title": "Backend Developer"
      }
    ]

    return jobs;
  }
}

export default JobService;
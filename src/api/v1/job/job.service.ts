import JobRepository from "./job.repository";
import { TJob } from "./job.types";

class JobService {
  private repository: JobRepository;

  constructor() {
    this.repository = new JobRepository();
  }
  
  public async getAllJobs(): Promise<TJob[]> {
    const jobs: TJob[] = await this.repository.getAllJobs();

    return jobs;
  }

  public async addJob(title: string): Promise<TJob> {
    try {
      const newJob: TJob = await this.repository.addJob(title);
      return newJob;
    }
    catch (err: any) {
      return err;
    }
  }
}

export default JobService;
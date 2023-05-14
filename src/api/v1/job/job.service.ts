import JobRepository from "./job.repository";
import { TJob } from "./job.types";

class JobService {
  private repository: JobRepository;

  constructor() {
    this.repository = new JobRepository();
  }
  
  // get all jobs
  public async getAllJobs(): Promise<TJob[]> {
    const jobs: TJob[] = await this.repository.getAllJobs();

    return jobs;
  }

  // add new job
  public async addJob(title: string): Promise<TJob> {
    try {
      const newJob: TJob = await this.repository.addJob(title);
      return newJob;
    }
    catch (err: any) {
      return err;
    }
  }

  // edit job
  public async editJob(id: string, title: string): Promise<TJob> {
    try {
      const updatedJob: TJob = await this.repository.editJob(id, title);
      return updatedJob;
    }
    catch (err: any) {
      return err;
    }
  }

  // delete job
  public async deleteJob(id: string): Promise<TJob> {
    try {
      const deletedJob: TJob = await this.repository.deleteJob(id);
      return deletedJob;
    }
    catch (err: any) {
      return err;
    }
  }
}

export default JobService;
import JobRepository from "./job.repository";
import { TJob } from "./job.types";

class JobService {
  private repository: JobRepository;

  constructor() {
    this.repository = new JobRepository();
  }
  
  // get paginated jobs
  public async getPaginatedJobs(
    limit: number,
    page: number
  ): Promise<{
    jobs: TJob[],
    totalItems: number,
    totalPages: number
  }> {
    try {
      const jobs: TJob[] = await this.repository.getAllJobs();
      const totalPages = Math.ceil(jobs.length / limit);

      const start = (page - 1) * limit;
      const end = page * limit;
      const paginatedJobs = jobs.slice(start, end);

      return { jobs: paginatedJobs, totalItems: jobs.length, totalPages };
    }
    catch (err: any) {
      throw new Error(err.message)
    }
  }

  // add new job
  public async addJob(title: string): Promise<TJob> {
    try {
      const newJob: TJob = await this.repository.addJob(title);
      return newJob;
    }
    catch (err: any) {
      throw new Error(err.message)
    }
  }

  // edit job
  public async editJob(id: string, title: string): Promise<TJob> {
    try {
      const updatedJob: TJob = await this.repository.editJob(id, title);
      return updatedJob;
    }
    catch (err: any) {
      throw new Error(err.message)
    }
  }

  // delete job
  public async deleteJob(id: string): Promise<TJob> {
    try {
      const deletedJob: TJob = await this.repository.deleteJob(id);
      return deletedJob;
    }
    catch (err: any) {
      throw new Error(err.message)
    }
  }
}

export default JobService;
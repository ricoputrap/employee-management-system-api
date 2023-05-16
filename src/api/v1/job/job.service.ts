import CustomError from "../../../config/custom-error";
import logger from "../../../config/logger";
import { STATUS_CODE } from "../../../constants/status-code.constants";
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
      const error: any = new Error(err.message)
      error.statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR;
      throw error;
    }
  }

  // add new job
  public async addJob(title: string): Promise<TJob> {
    try {
      // validate title not exists
      const jobByTitle: TJob | null = await this.repository.getJobByTitle(title);
      if (jobByTitle != null) {
        throw new CustomError(
          "Duplicate title: " + title + " already exists",
          STATUS_CODE.CONFLICT
        );
      }

      const newJob: TJob = await this.repository.addJob(title);
      return newJob;
    }
    catch (err: any) {
      const statusCode = err.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR;
      const message = err.message || "Unable to add job";
      
      logger.error("[JobService] addJob - error:" + err.toString());
      throw new CustomError(message, statusCode);
    }
  }

  // edit job
  public async editJob(id: string, title: string): Promise<TJob> {
    try {
      const job: TJob | null = await this.repository.getJobById(id);
      if (job == null) {
        throw new CustomError(
          "Job not found",
          STATUS_CODE.NOT_FOUND
        );
      }

      // validate title not exists
      const jobByTitle: TJob | null = await this.repository.getJobByTitle(title);
      if (jobByTitle != null) {
        throw new CustomError(
          "Duplicate title: " + title + " already exists",
          STATUS_CODE.CONFLICT
        );
      }

      const updatedJob: TJob = await this.repository.editJob(id, title);
      return updatedJob;
    }
    catch (err: any) {
      const statusCode = err.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR;
      const message = err.message || "Unable to edit job";
      
      logger.error("[JobService] editJob - error:" + err.toString());
      throw new CustomError(message, statusCode);
    }
  }

  // delete job and throw error with status code if any
  public async deleteJob(id: string): Promise<TJob> {
    try {
      const job: TJob | null = await this.repository.getJobById(id);
      logger.debug("[JobService] deleteJob - job:" + JSON.stringify(job));
      
      if (job == null) {
        throw new CustomError(
          "Job not found",
          STATUS_CODE.NOT_FOUND
        );
      }

      return await this.repository.deleteJob(id);
    }
    catch (err: any) {
      const statusCode = err.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR;
      const message = err.message || "Unable to delete job";
      
      logger.error("[JobService] deleteJob - error:" + err.toString());
      throw new CustomError(message, statusCode);
    }
  }

  // get repository for testing
  public getRepository(): JobRepository {
    return this.repository;
  }
}

export default JobService;
import { PrismaClient } from "@prisma/client";
import DbPrismaClient from "../../../database/DbPrismaClient";
import { TJob } from "./job.types";
import { randomUUID } from "crypto";
import logger from "../../../config/logger";

class JobRepository {
  private dbClient: PrismaClient = DbPrismaClient.getInstance();

  // get all jobs
  public async getAllJobs(): Promise<TJob[]> {
    try {
      const jobs: TJob[] = await this.dbClient.job.findMany();
      return jobs;
    }
    catch (err: any) {
      throw new Error(err.message)
    }
  }

  // get one job by id
  public async getJobById(id: string): Promise<TJob | null> {
    try {
      const job: TJob | null = await this.dbClient.job.findUnique({
        where: { id }
      });
      return job;
    }
    catch (err: any) {
      throw new Error(err)
    }
  }

  public async getJobByTitle(title: string): Promise<TJob | null> {
    try {
      const job: TJob | null = await this.dbClient.job.findFirst({
        where: { title }
      })
      return job;
    }
    catch (err: any) {
      throw new Error(err)
    }
  }

  // add job
  public async addJob(title: string): Promise<TJob> {
    try {
      const newJob: TJob = await this.dbClient.job.create({
        data: {
          id: randomUUID(),
          title: title,
        }
      });
      return newJob
    }
    catch (err: any) {
      throw new Error(err.message)
    }
  }

  // edit job
  public async editJob(id: string, title: string): Promise<TJob> {
    try {
      const updatedJob: TJob = await this.dbClient.job.update({
        where: {
          id: id
        },
        data: {
          title: title
        }
      });
      return updatedJob;
    }
    catch (err: any) {
      throw new Error(err.message)
    }
  }

  // delete job
  public async deleteJob(id: string): Promise<TJob> {
    try {
      logger.debug("repository id: ", id);
      return await this.dbClient.job.delete({
        where: {
          id: id
        }
      });
    }
    catch (err: any) {
      logger.error("repository deleteJob error: " + err);
      throw new Error(err.message);
    }
  }
}

export default JobRepository;
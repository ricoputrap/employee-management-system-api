import { PrismaClient } from "@prisma/client";
import DbPrismaClient from "../../../database/DbPrismaClient";
import { TJob } from "./job.types";
import { randomUUID, UUID } from "crypto";

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
      const deletedJob: TJob = await this.dbClient.job.delete({
        where: {
          id: id
        }
      });
      return deletedJob;
    }
    catch (err: any) {
      throw new Error(err.message)
    }
  }
}

export default JobRepository;
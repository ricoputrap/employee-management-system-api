import { PrismaClient } from "@prisma/client";
import DbPrismaClient from "../../../database/DbPrismaClient";
import { TJob } from "./job.types";
import { randomUUID, UUID } from "crypto";

class JobRepository {
  private dbClient: PrismaClient = DbPrismaClient.getInstance();

  public async getAllJobs(): Promise<TJob[]> {
    try {
      const jobs: TJob[] = await this.dbClient.job.findMany();
      return jobs;
    }
    catch (err: any) {
      return err;
    }
  }

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
      return err;
    }
  }
}

export default JobRepository;
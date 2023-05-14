import { Express, Request, Response, NextFunction } from "express"
import { JOB_PATH } from "../../../constants/api.constants"
import { STATUS_CODE } from "../../../constants/status-code.constants"
import JobService from "./job.service"
import { TJob } from "./job.types"

const JobAPI = (app: Express) => {
  const service = new JobService();
  
  // Get All Jobs
  app.get(JOB_PATH, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit: number = Number(req.query.limit) || 10;
      const page: number = Number(req.query.page) || 1;

      const jobs: TJob[] = await service.getAllJobs();
      const total_pages = Math.ceil(jobs.length / limit);

      const start = (page - 1) * limit;
      const end = page * limit;
      const paginatedJobs = jobs.slice(start, end);

      return res.status(STATUS_CODE.OK).json({
        data: paginatedJobs,
        page,
        total_pages,
        limit,
        total_items: jobs.length
      });
    }
    catch (err: any) {
      const errorResponse = {
        error: {
          message: "Internal Server Error",
          details: [
            {
              "message": "Unable to retrieve jobs"
            }
          ]
        }
      }

      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
  })

  // Add Job
  app.post(JOB_PATH, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title } = req.body;

      const newJob: TJob = await service.addJob(title);

      return res.status(STATUS_CODE.CREATED).json({
        data: newJob
      });
    }
    catch (err: any) {
      const errorResponse = {
        error: {
          message: "Internal Server Error",
          details: [
            {
              "message": "Unable to add job"
            }
          ]
        }
      }

      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
  });

  // edit job
  app.put(`${JOB_PATH}/:id`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { title } = req.body;
      const updatedJob: TJob = await service.editJob(id, title);
      return res.status(STATUS_CODE.OK).json({
        data: updatedJob
      });
    }
    catch (err: any) {
      const errorResponse = {
        error: {
          message: "Internal Server Error",
          details: [
            {
              "message": "Unable to edit job"
            }
          ]
        }
      }

      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
  });

  // delete job
  app.delete(`${JOB_PATH}/:id`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await service.deleteJob(id);
      return res.status(STATUS_CODE.NO_CONTENT).send();
    }
    catch (err: any) {
      const errorResponse = {
        error: {
          message: "Internal Server Error",
          details: [
            {
              "message": "Unable to delete job"
            }
          ]
        }
      }

      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
  });
}

export default JobAPI;
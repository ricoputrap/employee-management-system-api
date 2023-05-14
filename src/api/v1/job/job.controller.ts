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
      return res.status(STATUS_CODE.OK).json({
        data: jobs,
        page,
        total_pages: 1,
        limit,
        total_items: 2
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
}

export default JobAPI;
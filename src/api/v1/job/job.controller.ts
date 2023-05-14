import { Express, Request, Response, NextFunction } from "express"
import { JOB_PATH } from "../../../constants/api.constants"
import { STATUS_CODE } from "../../../constants/status-code.constants"

const JobAPI = (app: Express) => {
  
  // Get All Jobs
  app.get(JOB_PATH, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobs = [
        {
          "id": "1029od",
          "title": "Frontend Developer"
        },
        {
          "id": "29d102",
          "title": "Backend Developer"
        }
      ]
      return res.status(STATUS_CODE.OK).json({
        data: jobs,
        page: 1,
        total_pages: 1,
        limit: 10,
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
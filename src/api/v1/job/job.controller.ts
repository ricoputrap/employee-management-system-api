import { Request, Response, NextFunction, Router } from "express"
import logger from "../../../config/logger"
import { STATUS_CODE } from "../../../constants/status-code.constants"
import { TErrorDetail, TErrorResponse, TPaginationResponse, TSuccessResponse } from "../../../types/api.types";
import { constructErrorDuplicateResponse, constructErrorInternalServerResponse, constructErrorNotFoundResponse, constructErrorValidationResponse } from "../../../utils/apiResponses";
import JobService from "./job.service"
import { TJob } from "./job.types";

class JobController {
  private router: Router;
  private service: JobService;

  constructor(service: JobService) {
    this.router = Router();
    this.service = service;
    this.init();
  }

  public async getAllJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const limit: number = Number(req.query.limit) || 10;
      const page: number = Number(req.query.page) || 1;

      const { jobs, totalItems, totalPages } = await this.service.getPaginatedJobs(limit, page);

      const response: TPaginationResponse<TJob> = {
        data: jobs,
        pagination: {
          page,
          total_pages: totalPages,
          limit,
          total_items: totalItems
        }
      }

      return res.status(STATUS_CODE.OK).json(response);
    }
    catch (err: any) {
      logger.error("[JobController] getAllJobs error: " + err);
      const errorResponse: TErrorResponse = {
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
  }

  public async addJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { title } = req.body;

      // validate title not provided
      const errors: TErrorDetail[] = [];
      if (!title) {
        errors.push({
          field: "title",
          message: "Title is required"
        });
      }

      // return validation error
      if (errors.length > 0) {
        const errorResponse: TErrorResponse = constructErrorValidationResponse(errors);
        return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse);
      }

      // execute main processes
      const newJob: TJob = await this.service.addJob(title);
      const response: TSuccessResponse<TJob> = {
        data: newJob
      }

      return res.status(STATUS_CODE.CREATED).json(response);
    }
    catch (err: any) {
      logger.error("[JobController] addJob error: " + err);

      const statusCode = err.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR;
      const message = err.message || "Unable to add job";

      // return duplicate error
      if (statusCode === STATUS_CODE.CONFLICT) {
        const errorResponse: TErrorResponse = constructErrorDuplicateResponse([{
          field: "title",
          message: message
        }]);
        return res.status(statusCode).json(errorResponse);
      }

      // return internal server error
      const errors: TErrorDetail[] = [{ message: message }];
      const errorResponse: TErrorResponse = constructErrorInternalServerResponse(errors);
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
  }

  public async editJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { title } = req.body;

      // validate title not provided
      const errors: TErrorDetail[] = [];
      if (!title) {
        errors.push({
          field: "title",
          message: "Title is required"
        });
      }

      // validate id not provided
      if (!id) {
        errors.push({
          field: "id",
          message: "Id is required"
        });
      }

      // return validation error
      if (errors.length > 0) {
        const errorResponse: TErrorResponse = constructErrorValidationResponse(errors);
        return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse);
      }

      // execute main processes
      const updatedJob: TJob = await this.service.editJob(id, title);
      const response: TSuccessResponse<TJob> = {
        data: updatedJob
      }
      return res.status(STATUS_CODE.OK).json(response);
    }
    catch (err: any) {
      logger.error("[JobController] editJob error: " + err);

      const statusCode = err.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR;
      const message = err.message || "Unable to edit job";

      // return not found error
      if (statusCode === STATUS_CODE.NOT_FOUND) {
        const errorResponse: TErrorResponse = constructErrorNotFoundResponse([{
          field: "id",
          message: message
        }]);
        return res.status(statusCode).json(errorResponse);
      }

      // return duplicate error
      if (statusCode === STATUS_CODE.CONFLICT) {
        const errorResponse: TErrorResponse = constructErrorDuplicateResponse([{
          field: "title",
          message: message
        }]);
        return res.status(statusCode).json(errorResponse);
      }

      // return internal server error
      const errors: TErrorDetail[] = [{ message: message }];
      const errorResponse: TErrorResponse = constructErrorInternalServerResponse(errors);
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
  }

  public async deleteJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // validate id not provided
      const errors: TErrorDetail[] = [];
      if (!id) {
        errors.push({
          field: "id",
          message: "Id is required"
        });
      }

      // return validation error
      if (errors.length > 0) {
        const errorResponse: TErrorResponse = constructErrorValidationResponse(errors);
        return res.status(STATUS_CODE.BAD_REQUEST).json(errorResponse);
      }

      await this.service.deleteJob(id);
      return res.status(STATUS_CODE.NO_CONTENT).send();
    }
    catch (err: any) {
      logger.error("[JobController] deleteJob error: " + err);

      const statusCode = err.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR;
      const message = err.message || "Unable to delete job";

      // return not found error
      if (statusCode === STATUS_CODE.NOT_FOUND) {
        const errorResponse: TErrorResponse = constructErrorNotFoundResponse([{
          field: "id",
          message: message
        }]);
        return res.status(statusCode).json(errorResponse);
      }

      // return internal server error
      const errors: TErrorDetail[] = [{ message: message }];
      const errorResponse: TErrorResponse = constructErrorInternalServerResponse(errors);
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
  }

  private async init() {
    this.router.get("/", await this.getAllJobs.bind(this));
    this.router.post("/", await this.addJob.bind(this));
    this.router.put("/:id", await this.editJob.bind(this));
  }

  public getRouter(): Router {
    return this.router;
  }
}

export const JobRouter = (): Router => {
  const service = new JobService();
  const controller = new JobController(service);
  return controller.getRouter();
}


export default JobController;
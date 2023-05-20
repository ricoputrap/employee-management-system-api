import { Request, Response, NextFunction } from "express";
import { STATUS_CODE } from "../../../../constants/status-code.constants";
import { TJob } from "../job.types";
import JobService from "../job.service";
import JobController from "../job.controller";
import { TErrorResponse, TPaginationResponse, TSuccessResponse } from "../../../../types/api.types";
import CustomError from "../../../../config/custom-error";

describe("JobController", () => {
  let jobController: JobController;
  let mockService: JobService;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockService = new JobService();
    jobController = new JobController(mockService);
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  // Get All Jobs
  describe("GET /api/v1/jobs", () => {
    // success 200
    test("should return paginated jobs with 200 OK status code", async () => {
      // prepare expected response
      const mockJobs: TJob[] = [
        { id: '1', title: 'Job 1' },
        { id: '2', title: 'Job 2' },
        { id: '3', title: 'Job 3' },
      ];

      const expectedResponse: TPaginationResponse<TJob> = {
        data: mockJobs,
        pagination: {
          page: 1,
          total_pages: 1,
          limit: 10,
          total_items: 3,
        },
      };

      // mock service
      jest.spyOn(mockService, "getPaginatedJobs").mockResolvedValueOnce({
        jobs: mockJobs,
        totalItems: 3,
        totalPages: 1,
      });

      // mock request to have query params
      mockRequest = {
        query: {
          page: "1",
          limit: "10",
        },
      };

      // call controller
      await jobController.getAllJobs(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // expect response
      expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    // error 500
    test("should return 500 Internal Server Error when service throws error", async () => {
      // mock service
      jest.spyOn(mockService, "getPaginatedJobs").mockRejectedValueOnce(new Error("Unable to retrieve jobs"));

      // call controller
      await jobController.getAllJobs(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // expect response
      expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: "Internal Server Error",
          details: [
            {
              message: "Unable to retrieve jobs",
            },
          ],
        },
      });
    });
  });

  // Add Job
  describe("POST /api/v1/jobs", () => {
    // success 201
    test("should return new job with 201 Created status code", async () => {
      // prepare expected response
      const mockJob: TJob = { id: '1', title: 'Job 1' };

      const expectedResponse: TSuccessResponse<TJob> = {
        data: mockJob,
      };

      // mock service
      jest.spyOn(mockService, "addJob").mockResolvedValueOnce(mockJob);

      // mock request to have body
      mockRequest = {
        body: {
          title: "Job 1",
        },
      };

      // call controller
      await jobController.addJob(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // expect response
      expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    // error 400 - validation error (title is required)
    test("should return 400 Bad Request when title is not provided", async () => {
      // prepare expected response
      const expectedResponse: TErrorResponse = {
        error: {
          message: "Validation Error",
          details: [
            {
              field: "title",
              message: "Title is required",
            },
          ],
        },
      };

      // mock request to have body
      mockRequest = {
        body: {},
      };

      // call controller
      await jobController.addJob(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // expect response
      expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    // error 409 - duplicate error (title already exists)
    test("should return 409 Conflict when title already exists", async () => {
      // prepare expected response
      const expectedResponse: TErrorResponse = {
        error: {
          message: "Duplicate Error",
          details: [
            {
              field: "title",
              message: "Duplicate title: Job 1 already exists",
            },
          ],
        },
      };

      // mock service
      jest.spyOn(mockService, "addJob").mockRejectedValueOnce(new CustomError(
        "Duplicate title: Job 1 already exists",
        STATUS_CODE.CONFLICT
      ));

      // mock request to have body
      mockRequest = {
        body: {
          title: "Job 1",
        },
      };

      // call controller
      await jobController.addJob(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // expect response
      expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.CONFLICT);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    // error 500 - internal server error
    test("should return 500 Internal Server Error when service throws error", async () => {
      // mock service
      jest.spyOn(mockService, "addJob").mockRejectedValueOnce(new CustomError("Unable to add job"));

      // mock request to have body
      mockRequest = {
        body: {
          title: "Job 1",
        },
      };

      // call controller
      await jobController.addJob(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // expect response
      expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: "Internal Server Error",
          details: [
            {
              message: "Unable to add job",
            },
          ],
        },
      });
    });
  });

  // Edit Job
  describe("PUT /api/v1/jobs/:id", () => {
    // success 200
    test("should return updated job with 200 OK status code", async () => {
      // prepare expected response
      const mockJob: TJob = { id: '1', title: 'Job 1' };

      const expectedResponse: TSuccessResponse<TJob> = {
        data: mockJob,
      };

      // mock service
      jest.spyOn(mockService, "editJob").mockResolvedValueOnce(mockJob);

      // mock request to have body
      mockRequest = {
        params: {
          id: "1",
        },
        body: {
          title: "Job 1",
        },
      };

      // call controller
      await jobController.editJob(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // expect response
      expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    // error 400 - validation error (title is required)
    test("should return 400 Bad Request when title is not provided", async () => {
      // prepare expected response
      const expectedResponse: TErrorResponse = {
        error: {
          message: "Validation Error",
          details: [
            {
              field: "title",
              message: "Title is required",
            },
          ],
        },
      };

      // mock request to have body
      mockRequest = {
        params: {
          id: "1",
        },
        body: {},
      };

      // call controller
      await jobController.editJob(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // expect response
      expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    // error 400 - validation error (id is required)
    test("should return 400 Bad Request when id is not provided", async () => {
      // prepare expected response
      const expectedResponse: TErrorResponse = {
        error: {
          message: "Validation Error",
          details: [
            {
              field: "id",
              message: "Id is required",
            },
          ],
        },
      };

      // mock request to have body
      mockRequest = {
        params: {},
        body: {
          title: "Job 1",
        },
      };

      // call controller
      await jobController.editJob(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // expect response
      expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    // error 404 - not found error (job not found)
    test("should return 404 Not Found when job is not found", async () => {
      // prepare expected response
      const expectedResponse: TErrorResponse = {
        error: {
          message: "Not Found Error",
          details: [
            {
              field: "id",
              message: "Job not found",
            },
          ],
        },
      };

      // mock service
      jest.spyOn(mockService, "editJob").mockRejectedValueOnce(new CustomError(
        "Job not found",
        STATUS_CODE.NOT_FOUND
      ));

      // mock request to have body
      mockRequest = {
        params: {
          id: "1",
        },
        body: {
          title: "Job 1",
        },
      };

      // call controller
      await jobController.editJob(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // expect response
      expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    // error 409 - duplicate error (title already exists)
    test("should return 409 Conflict when title already exists", async () => {
      // prepare expected response
      const expectedResponse: TErrorResponse = {
        error: {
          message: "Duplicate Error",
          details: [
            {
              field: "title",
              message: "Duplicate title: Job 1 already exists",
            },
          ],
        },
      };

      // mock service
      jest.spyOn(mockService, "editJob").mockRejectedValueOnce(new CustomError(
        "Duplicate title: Job 1 already exists",
        STATUS_CODE.CONFLICT
      ));

      // mock request to have body
      mockRequest = {
        params: {
          id: "1",
        },
        body: {
          title: "Job 1",
        },
      };

      // call controller
      await jobController.editJob(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // expect response
      expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.CONFLICT);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    // error 500 - internal server error
    test("should return 500 Internal Server Error when service throws error", async () => {
      // mock service
      jest.spyOn(mockService, "editJob").mockRejectedValueOnce(new CustomError("Unable to edit job"));

      // mock request to have body
      mockRequest = {
        params: {
          id: "1",
        },
        body: {
          title: "Job 1",
        },
      };

      // call controller
      await jobController.editJob(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // expect response
      expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: "Internal Server Error",
          details: [
            {
              message: "Unable to edit job",
            },
          ],
        },
      });
    });
  });

  // Delete Job
  describe("DELETE /api/v1/jobs/:id", () => {
    // success 204
    test("should return 204 No Content status code", async () => {
      const mockJob: TJob = { id: "1", title: "Job 1" };

      // mock service
      jest.spyOn(mockService, "deleteJob").mockResolvedValueOnce(mockJob);

      // mock request to have body
      mockRequest = {
        params: {
          id: "1",
        },
      };

      // call controller
      await jobController.deleteJob(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // expect response
      expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.NO_CONTENT);
    });

    // error 400 - validation error (id is required)
    test("should return 400 Bad Request when id is not provided", async () => {
      // prepare expected response
      const expectedResponse: TErrorResponse = {
        error: {
          message: "Validation Error",
          details: [
            {
              field: "id",
              message: "Id is required",
            },
          ],
        },
      };

      // mock request to have body
      mockRequest = {
        params: {},
      };

      // call controller
      await jobController.deleteJob(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // expect response
      expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    // error 404 - not found error (job not found)
    test("should return 404 Not Found when job is not found", async () => {
      // prepare expected response
      const expectedResponse: TErrorResponse = {
        error: {
          message: "Not Found Error",
          details: [
            {
              field: "id",
              message: "Job not found",
            },
          ],
        },
      };

      // mock service
      jest.spyOn(mockService, "deleteJob").mockRejectedValueOnce(new CustomError(
        "Job not found",
        STATUS_CODE.NOT_FOUND
      ));

      // mock request to have body
      mockRequest = {
        params: {
          id: "1",
        },
      };

      // call controller
      await jobController.deleteJob(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // expect response
      expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    // error 500 - internal server error
    test("should return 500 Internal Server Error when service throws error", async () => {
      // mock service
      jest.spyOn(mockService, "deleteJob").mockRejectedValueOnce(new CustomError("Unable to delete job"));

      // mock request to have body
      mockRequest = {
        params: {
          id: "1",
        },
      };

      // call controller
      await jobController.deleteJob(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // expect response
      expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: "Internal Server Error",
          details: [
            {
              message: "Unable to delete job",
            },
          ],
        },
      });
    });
  });
})
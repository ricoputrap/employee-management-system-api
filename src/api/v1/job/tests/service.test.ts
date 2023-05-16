import CustomError from "../../../../config/custom-error";
import { STATUS_CODE } from "../../../../constants/status-code.constants";
import JobService from "../job.service";
import { TJob } from "../job.types";

describe("JobService", () => {
  let service: JobService;

  beforeEach(() => {
    service = new JobService();
  });

  afterEach(() => {
    jest.resetAllMocks();
  })

  describe("getPaginatedJobs", () => {
    test("should return paginated jobs", async () => {
      // mock the repository `getAllJobs` method
      const mockJobs: TJob[] = [
        { id: "1", title: "Job 1" },
        { id: "2", title: "Job 2" },
        { id: "3", title: "Job 3" }
      ];

      // define the expected results
      const limit: number = 3;
      const page: number = 1;
      const expectedTotalItems: number = mockJobs.length;
      const expectedTotalPages: number = Math.ceil(expectedTotalItems / 10);
      const mockGetAllJobs = jest.spyOn(service.getRepository(), "getAllJobs").mockResolvedValue(mockJobs);

      // call the service method
      const { jobs, totalItems, totalPages } = await service.getPaginatedJobs(limit, page);

      // assert the results
      expect(mockGetAllJobs).toHaveBeenCalledTimes(1);
      expect(jobs).toEqual(mockJobs);
      expect(totalItems).toEqual(expectedTotalItems);
      expect(totalPages).toEqual(expectedTotalPages);
    });

    // throw internal server error with status code if unable to retrieve jobs
    test("should throw internal server error with status code if unable to retrieve jobs", async () => {
      // mock the repository `getAllJobs` method
      const error = new Error("Unable to retrieve jobs");
      const mockGetAllJobs = jest.spyOn(service.getRepository(), "getAllJobs").mockRejectedValue(error);

      // define the expected results
      const limit: number = 3;
      const page: number = 1;

      // call the service method
      try {
        await service.getPaginatedJobs(limit, page);
      }
      catch (err: any) {
        expect(mockGetAllJobs).toHaveBeenCalledTimes(1);
        expect(err.statusCode).toEqual(500);
        expect(err.message).toEqual("Unable to retrieve jobs");
      }
    });
  });

  describe("addJob", () => {
    test("should add new job", async () => {
      // mock the repository `addJob` method
      const mockJob: TJob = { id: "1", title: "Job 1" };
      const mockGetJobByTitle = jest.spyOn(service.getRepository(), "getJobByTitle").mockResolvedValue(null);
      const mockAddJob = jest.spyOn(service.getRepository(), "addJob").mockResolvedValue(mockJob);

      // define the expected results
      const title: string = "Job 1";

      // call the service method
      const newJob: TJob = await service.addJob(title);

      // assert the results
      expect(mockGetJobByTitle).toHaveBeenCalledTimes(1);
      expect(mockAddJob).toHaveBeenCalledTimes(1);
      expect(newJob).toEqual(mockJob)
    });

    // throw duplicate error with status code if title already exists
    test("should throw duplicate error with status code if title already exists", async () => {
      // mock the repository `addJob` method
      const mockJob: TJob = { id: "1", title: "Job 1" };
      const error = new CustomError(`Duplicate title: ${mockJob.title} already exists`, STATUS_CODE.CONFLICT);
      const mockGetJobByTitle = jest.spyOn(service.getRepository(), "getJobByTitle").mockResolvedValue(mockJob);
      const mockAddJob = jest.spyOn(service.getRepository(), "addJob").mockRejectedValue(error);

      // call the service method
      try {
        await service.addJob(mockJob.title);
      }
      catch (err: any) {
        expect(mockGetJobByTitle).toHaveBeenCalledTimes(1);
        expect(mockAddJob).toHaveBeenCalledTimes(0);
        expect(err.statusCode).toEqual(409);
        expect(err.message).toEqual(`Duplicate title: ${mockJob.title} already exists`);
      }
    });

    // throw internal server error with status code if unable to add job
    test("should throw internal server error with status code if unable to add job", async () => {
      // mock the repository `addJob` method
      const error = new Error("Unable to add job");
      const mockGetJobByTitle = jest.spyOn(service.getRepository(), "getJobByTitle").mockResolvedValue(null);
      const mockAddJob = jest.spyOn(service.getRepository(), "addJob").mockRejectedValue(error);

      // define the expected results
      const title: string = "Job 1";

      // call the service method
      try {
        await service.addJob(title);
      }
      catch (err: any) {
        expect(mockGetJobByTitle).toHaveBeenCalledTimes(1);
        expect(mockAddJob).toHaveBeenCalledTimes(1);
        expect(err.statusCode).toEqual(500);
        expect(err.message).toEqual("Unable to add job");
      }
    });
  });

  describe("editJob", () => {
    test("should edit job", async () => {
      // mock the repository `editJob` method
      const mockJob: TJob = { id: "1", title: "Job 1" };
      const mockGetJobById = jest.spyOn(service.getRepository(), "getJobById").mockResolvedValue(mockJob);
      const mockGetJobByTitle = jest.spyOn(service.getRepository(), "getJobByTitle").mockResolvedValue(null);
      const mockEditJob = jest.spyOn(service.getRepository(), "editJob").mockResolvedValue(mockJob);

      // define the expected results
      const id: string = "1";
      const title: string = "Job 1";

      // call the service method
      const updatedJob: TJob = await service.editJob(id, title);

      // assert the results
      expect(mockGetJobById).toHaveBeenCalledTimes(1);
      expect(mockGetJobByTitle).toHaveBeenCalledTimes(1);
      expect(mockEditJob).toHaveBeenCalledTimes(1);
      expect(updatedJob).toEqual(mockJob);
    });

    // throw not found error with status code if job not found
    test("should throw not found error with status code if job not found", async () => {
      // mock the repository `editJob` method
      const error = new CustomError("Job not found", STATUS_CODE.NOT_FOUND);
      const mockGetJobById = jest.spyOn(service.getRepository(), "getJobById").mockResolvedValue(null);
      // const mockEditJob = jest.spyOn(service.getRepository(), "editJob").mockRejectedValue(error);

      // define the expected results
      const id: string = "1";
      const title: string = "Job 1";

      // call the service method
      try {
        await service.editJob(id, title);
      }
      catch (err: any) {
        expect(mockGetJobById).toHaveBeenCalledTimes(1);
        // expect(mockEditJob).toHaveBeenCalledTimes(0);
        expect(err.statusCode).toEqual(404);
        expect(err.message).toEqual("Job not found");
      }
    });

    // throw duplicate error with status code if title already exists
    test("should throw duplicate error with status code if title already exists", async () => {
      const mockJob: TJob = { id: "1", title: "Job 1" };
      const mockGetJobById = jest.spyOn(service.getRepository(), "getJobById").mockResolvedValue(mockJob);
      const mockGetJobByTitle = jest.spyOn(service.getRepository(), "getJobByTitle").mockResolvedValue(mockJob);

      // mock the repository `editJob` method
      const error = new CustomError("Duplicate title: Job 1 already exists", STATUS_CODE.CONFLICT);
      const mockEditJob = jest.spyOn(service.getRepository(), "editJob").mockRejectedValue(error);

      // define the expected results
      const id: string = "1";
      const title: string = "Job 1";

      // call the service method
      try {
        await service.editJob(id, title);
      }
      catch (err: any) {
        expect(mockGetJobById).toHaveBeenCalledTimes(1);
        expect(mockGetJobByTitle).toHaveBeenCalledTimes(1);
        expect(mockEditJob).toHaveBeenCalledTimes(0);
        expect(err.statusCode).toEqual(409);
        expect(err.message).toEqual("Duplicate title: Job 1 already exists");
      }
    });

    // throw internal server error with status code if unable to edit job
    test("should throw internal server error with status code if unable to edit job", async () => {
      const mockJob: TJob = { id: "1", title: "Job 1" };
      const mockGetJobById = jest.spyOn(service.getRepository(), "getJobById").mockResolvedValue(mockJob);
      const mockGetJobByTitle = jest.spyOn(service.getRepository(), "getJobByTitle").mockResolvedValue(null);

      // mock the repository `editJob` method
      const error = new CustomError("Unable to edit job");
      const mockEditJob = jest.spyOn(service.getRepository(), "editJob").mockRejectedValue(error);

      // define the expected results
      const id: string = "1";
      const title: string = "Job 1";

      // call the service method
      try {
        await service.editJob(id, title);
      }
      catch (err: any) {
        expect(mockGetJobById).toHaveBeenCalledTimes(1);
        expect(mockGetJobByTitle).toHaveBeenCalledTimes(1);
        expect(mockEditJob).toHaveBeenCalledTimes(1);
        expect(err.statusCode).toEqual(500);
        expect(err.message).toEqual("Unable to edit job");
      }
    });
  });

  describe("deleteJob", () => {
    test("should delete job", async () => {
      // mock the repository `deleteJob` method
      const mockJob: TJob = { id: "1", title: "Job 1" };
      const mockGetJobById = jest.spyOn(service.getRepository(), "getJobById").mockResolvedValue(mockJob);
      const mockDeleteJob = jest.spyOn(service.getRepository(), "deleteJob").mockResolvedValue(mockJob);

      // define the expected results
      const id: string = "1";

      // call the service method
      const deletedJob: TJob = await service.deleteJob(id);

      // assert the results
      expect(mockGetJobById).toHaveBeenCalledTimes(1);
      expect(mockDeleteJob).toHaveBeenCalledTimes(1);
      expect(deletedJob).toEqual(mockJob);
    });

    // throw not found error with status code if job not found
    test("should throw not found error with status code if job not found", async () => {
      // mock the repository `deleteJob` method
      const error = new CustomError("Job not found", STATUS_CODE.NOT_FOUND);
      const mockGetJobById = jest.spyOn(service.getRepository(), "getJobById").mockResolvedValue(null);
      const mockDeleteJob = jest.spyOn(service.getRepository(), "deleteJob").mockRejectedValue(error);

      // define the expected results
      const id: string = "1";

      // call the service method
      try {
        await service.deleteJob(id);
      }
      catch (err: any) {
        expect(mockGetJobById).toHaveBeenCalledTimes(1);
        expect(mockDeleteJob).toHaveBeenCalledTimes(0);
        expect(err.statusCode).toEqual(404);
        expect(err.message).toEqual("Job not found");
      }
    });

    // throw internal server error with status code if unable to delete job
    test("should throw internal server error with status code if unable to delete job", async () => {
      // mock the repository `getJobById` method
      const mockJob: TJob = { id: "1", title: "Job 1" };
      const mockGetJobById = jest.spyOn(service.getRepository(), "getJobById").mockResolvedValue(mockJob);

      // mock the repository `deleteJob` method
      const error = new CustomError("Unable to delete job");
      const mockDeleteJob = jest.spyOn(service.getRepository(), "deleteJob").mockRejectedValue(error);

      // define the expected results
      const id: string = "1";

      // call the service method
      try {
        await service.deleteJob(id);
      }
      catch (err: any) {
        expect(mockGetJobById).toHaveBeenCalledTimes(1);
        expect(mockDeleteJob).toHaveBeenCalledTimes(1);
        expect(err.statusCode).toEqual(500);
        expect(err.message).toEqual("Unable to delete job");
      }
    });
  });
})
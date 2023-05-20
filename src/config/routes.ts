import { Router } from "express";
import { JobRouter } from "../api/v1/job/job.controller";
import { JOB_PATH } from "../constants/api.constants";

export type TRoute = {
  path: string;
  router: Router;
}

const routes: TRoute[] = [
  { path: JOB_PATH, router: JobRouter() }
]

export default routes;
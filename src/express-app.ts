import { Express, Request, Response } from "express";
import JobAPI from "./api/v1/job/job.controller";

const expressApp = (app: Express) => {
  JobAPI(app);

  // catch error NOT FOUND when no route matches
  app.use("*", (req: Request, res: Response) => {
    const message = `Requested path ${req.path} not found!`;
    const err = new Error(message);

    res.status(404).send({
      success: false,
      message,
      stack: err.stack
    })
  })
}

export default expressApp;
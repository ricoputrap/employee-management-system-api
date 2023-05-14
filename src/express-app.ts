import { Express, Request, Response } from "express";

const expressApp = (app: Express) => {
  app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
  });

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
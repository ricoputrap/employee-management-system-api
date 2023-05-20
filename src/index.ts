import express, { Express } from "express";
import { PORT } from "./config";
import connectRoutes from "./utils/connectRoutes";

export const createApp = (): Express => {
  const app: Express = express();

  // middlewares
  app.use(express.json());
  
  // connect all routes
  connectRoutes(app);

  return app;
} 

const startServer = () => {
  const app: Express = createApp();

  app.listen(PORT, () => {
    console.log(`SERVER STARTS on PORT ${PORT}`);
  });
}

startServer();
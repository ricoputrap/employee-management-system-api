import express, { Express } from "express";
import { PORT } from "./config";
import expressApp from "./express-app";

const startServer = () => {
  const app: Express = express();

  app.use(express.json());
  expressApp(app);

  app.listen(PORT, () => {
    console.log(`SERVER STARTS on PORT ${PORT}`);
  });
}

startServer();
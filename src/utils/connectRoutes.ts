import { Express } from "express";
import routes, { TRoute } from "../config/routes"

const connectRoutes = (app: Express) => {
  routes.forEach((route: TRoute) => {
    app.use(route.path, route.router);
  })
}

export default connectRoutes;
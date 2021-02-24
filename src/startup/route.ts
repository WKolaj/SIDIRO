import logger from "../logger/logger";
import { Express } from "express";
import error from "../middleware/error";
import userRoute from "../routes/user";
import appRoute from "../routes/app";

export default async function(app: Express) {
  logger.info("initializing routes...");

  app.use("/customApi/user", userRoute);
  logger.info("User route initialized");

  app.use("/customApi/app", appRoute);
  logger.info("App route initialized");

  app.use(error);
  logger.info("Route error handler initialized");

  logger.info("routes initialized");
}

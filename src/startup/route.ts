import logger from "../logger/logger";
import { Express } from "express";
import error from "../middleware/error";
import userRoute from "../routes/user";
import configUserRoute from "../routes/config/user";
import configPlantRoute from "../routes/config/plant";
import configAppRoute from "../routes/config/app";
import configRoute from "../routes/config/config";

export default async function(app: Express) {
  logger.info("initializing routes...");

  app.use("/customApi/user", userRoute);
  logger.info("User route initialized");

  app.use("/customApi/config/user", configUserRoute);
  logger.info("Config user route initialized");

  app.use("/customApi/config/plant", configPlantRoute);
  logger.info("Config plant route initialized");

  app.use("/customApi/config/app", configAppRoute);
  logger.info("Config plant route initialized");

  app.use("/customApi/config", configRoute);
  logger.info("Config route initialized");

  app.use(error);
  logger.info("Route error handler initialized");

  logger.info("routes initialized");
}

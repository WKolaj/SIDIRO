import express from "express";
//Initializing proccess of automatically calling next when error occurs while request handling - in order to go to last middlware of logging error
import "express-async-errors";
import { config } from "node-config-ts";
import path from "path";
import logger from "../logger/logger";
import fetchUser from "../middleware/user/fetchUser";
import userFetch from "../middleware/user/fetchUser";
import configStartFunc from "./config";
import logsStartFunc from "./logs";
import routeStartFunc from "./route";
import appDataStartFunction from "./appData";

const app = express();

export default async function(workingDirName: string | null) {
  if (!workingDirName) workingDirName = __dirname;

  //Startup of application
  await configStartFunc();
  await logsStartFunc();
  await appDataStartFunction();

  const port = process.env.PORT || config.port;

  app.use(express.json());

  //Static front-end files are stored under public dir
  app.use(express.static(path.join(workingDirName, "public")));

  //Routes have to be initialized after initializing main middleware
  await routeStartFunc(app);

  //In order for react routing to work - implementing sending always for any not-recognized endpoints
  app.get("*", (req, res) => {
    res.sendFile(path.join(workingDirName + "/public/index.html"));
  });

  return app.listen(port, () => {
    logger.info(`Listening on port ${port}...`);
  });
}

import NotificationManager from "../classes/NotificationManager/NotificationManager";
import logger from "../logger/logger";

export default async function() {
  //Initializing notifications manager
  await NotificationManager.getInstance().init();

  logger.info("notification manager initialized!");
}

//TODO - add startup tests

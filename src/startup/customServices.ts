import CustomServiceManager from "../classes/CustomService/CustomServiceManager";
import logger from "../logger/logger";

export default async function() {
  //Initializing custom services
  await CustomServiceManager.getInstance().init();

  logger.info("notification manager initialized!");
}

//TODO - add startup tests

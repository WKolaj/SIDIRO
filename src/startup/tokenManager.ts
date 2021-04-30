import { config } from "node-config-ts";
import { MindSphereTokenManager } from "../classes/MindSphereService/MindSphereToken/MindSphereTokenManager";
import logger from "../logger/logger";

export default async function(): Promise<boolean> {
  logger.info("Initiliazing app token");

  //Checking if there is na access to mindsphere api
  try {
    await MindSphereTokenManager.getInstance(
      config.appSettings.appContainerTenant
    ).fetchNewToken();

    logger.info("app token initialized!");

    return true;
  } catch (err) {
    logger.error("Erro while initializing app token!");
    logger.error(err.message, err);

    return false;
  }
}

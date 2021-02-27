import { MindSphereAppsManager } from "../classes/MindSphereApp/MindSphereAppsManager";
import logger from "../logger/logger";

export default async function() {
  //Fetching all app data to the manager
  let appManager = MindSphereAppsManager.getInstance();

  let allAppsAssets = await appManager.getAllAppAssets();

  await Promise.all(
    allAppsAssets.map(
      (asset) =>
        new Promise(async (resolve: Function, reject: Function) => {
          try {
            await appManager.fetchAppFromAsset(asset);
            return resolve();
          } catch (err) {
            logger.error(`error while initializing app ${asset.name}`);
            logger.error(err.message, err);
            //Resolving in order not to throw in case of an error
            return resolve();
          }
        })
    )
  );

  logger.info("applications data initialized");
}

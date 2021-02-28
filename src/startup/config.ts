import { config } from "node-config-ts";
import logger from "../logger/logger";
import _ from "lodash";

let throwIfConfigDoesNotExist = (configName: string) => {
  let configValue = _.get(config, configName);
  if (configValue == null)
    throw new Error(`FATAL ERROR: ${configName} is not defined in config file`);
};

export default async function() {
  logger.info("initializing app configuration files...");

  throwIfConfigDoesNotExist("appCredentials.clientId");
  throwIfConfigDoesNotExist("appCredentials.clientSecret");
  throwIfConfigDoesNotExist("appCredentials.appName");
  throwIfConfigDoesNotExist("appCredentials.appVersion");
  throwIfConfigDoesNotExist("appCredentials.appId");

  throwIfConfigDoesNotExist("appSettings.appContainerTenant");
  throwIfConfigDoesNotExist("appSettings.appContainerAssetId");
  throwIfConfigDoesNotExist("appSettings.appContainerAssetType");
  throwIfConfigDoesNotExist("appSettings.appAssetType");
  throwIfConfigDoesNotExist("appSettings.subtenantAssetType");

  throwIfConfigDoesNotExist("userPermissions.superAdminRole");
  throwIfConfigDoesNotExist("userPermissions.globalAdminRole");
  throwIfConfigDoesNotExist("userPermissions.globalUserRole");
  throwIfConfigDoesNotExist("userPermissions.localAdminRole");
  throwIfConfigDoesNotExist("userPermissions.localUserRole");
  throwIfConfigDoesNotExist("userPermissions.msStandardUser");
  throwIfConfigDoesNotExist("userPermissions.msSubtenantUser");

  throwIfConfigDoesNotExist("tokenExpireAdditionalTime");

  throwIfConfigDoesNotExist("port");

  throwIfConfigDoesNotExist("logging.info.path");
  throwIfConfigDoesNotExist("logging.info.maxsize");
  throwIfConfigDoesNotExist("logging.info.maxFiles");

  throwIfConfigDoesNotExist("logging.warning.path");
  throwIfConfigDoesNotExist("logging.warning.maxsize");
  throwIfConfigDoesNotExist("logging.warning.maxFiles");

  throwIfConfigDoesNotExist("logging.error.path");
  throwIfConfigDoesNotExist("logging.error.maxsize");
  throwIfConfigDoesNotExist("logging.error.maxFiles");

  logger.info("app configuration files initialized");
}
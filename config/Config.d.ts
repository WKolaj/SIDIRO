/* tslint:disable */
/* eslint-disable */
declare module "node-config-ts" {
  interface IConfig {
    appCredentials: AppCredentials
    appSettings: AppSettings
    userPermissions: UserPermissions
    port: number
    tokenExpireAdditionalTime: number
    logging: Logging
  }
  interface Logging {
    info: Info
    warning: Info
    error: Info
  }
  interface Info {
    path: string
    maxsize: number
    maxFiles: number
  }
  interface UserPermissions {
    globalAdminScope: undefined
    globalUserScope: undefined
    localAdminScope: undefined
    localUserScope: undefined
    globalAdminGroup: undefined
    globalUserGroup: undefined
    localAdminGroup: undefined
    localUserGroup: undefined
    msStandardUserGroup: undefined
    msSubtenantUserGroup: undefined
    superAdminUserIds: undefined
  }
  interface AppSettings {
    appContainerTenant: undefined
    appContainerAssetId: undefined
    appContainerAssetType: undefined
    appAssetType: undefined
  }
  interface AppCredentials {
    clientId: undefined
    clientSecret: undefined
    appName: undefined
    appVersion: undefined
    appId: undefined
    hostTenant: undefined
  }
  export const config: Config
  export type Config = IConfig
}

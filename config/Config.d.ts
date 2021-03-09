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
    globalAdminScope: string
    globalUserScope: string
    localAdminScope: string
    localUserScope: string
    globalAdminGroup: string
    globalUserGroup: string
    localAdminGroup: string
    localUserGroup: string
    msStandardUserGroup: string
    msSubtenantUserGroup: string
    superAdminUserIds: string
  }
  interface AppSettings {
    appContainerTenant: string
    appContainerAssetId: string
    appContainerAssetType: string
    appAssetType: string
  }
  interface AppCredentials {
    clientId: string
    clientSecret: string
    appName: string
    appVersion: string
    appId: string
    hostTenant: string
  }
  export const config: Config
  export type Config = IConfig
}

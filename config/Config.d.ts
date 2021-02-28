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
    superAdminRole: string
    globalAdminRole: string
    globalUserRole: string
    localAdminRole: string
    localUserRole: string
    msStandardUser: string
    msSubtenantUser: string
  }
  interface AppSettings {
    appContainerTenant: string
    appContainerAssetId: string
    appContainerAssetType: string
    appAssetType: string
    subtenantAssetType: string
  }
  interface AppCredentials {
    clientId: string
    clientSecret: string
    appName: string
    appVersion: string
    appId: string
  }
  export const config: Config
  export type Config = IConfig
}

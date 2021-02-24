/* tslint:disable */
/* eslint-disable */
declare module "node-config-ts" {
  interface IConfig {
    appCredentials: AppCredentials
    appSettings: AppSettings
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
  interface AppSettings {
    appContainerTenant: undefined
    appContainerAssetId: undefined
    appContainerAssetType: string
    appAssetType: string
  }
  interface AppCredentials {
    clientId: undefined
    clientSecret: undefined
    appName: undefined
    appVersion: undefined
    appId: undefined
  }
  export const config: Config
  export type Config = IConfig
}

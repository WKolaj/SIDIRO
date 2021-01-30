/* tslint:disable */
/* eslint-disable */
declare module "node-config-ts" {
  interface IConfig {
    appCredentials: AppCredentials
    tokenExpireAdditionalTime: number
  }
  interface AppCredentials {
    xSpaceAuthKey: string
    appName: string
    appVersion: string
    hostTenant: string
    userTenant: string
  }
  export const config: Config
  export type Config = IConfig
}

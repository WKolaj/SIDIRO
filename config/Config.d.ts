/* tslint:disable */
/* eslint-disable */
declare module "node-config-ts" {
  interface IConfig {
    mindSphereAppToken: string
  }
  export const config: Config
  export type Config = IConfig
}

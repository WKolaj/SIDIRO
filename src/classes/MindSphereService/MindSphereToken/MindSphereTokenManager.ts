import { config } from "node-config-ts";
import axios from "axios";

const mindSphereTokenApiUrl = `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`;

export type MindSphereAppCredentials = {
  xSpaceAuthKey: string;
  appName: string;
  appVersion: string;
  hostTenant: string;
  userTenant: string;
};

/**
 * @description Class for managing MindSphere tokens
 */
export class MindSphereTokenManager {
  /**
   * @description Single instance of MindSphereTokenManagerObject
   */
  private static _instance: MindSphereTokenManager | null = null;

  /**
   * @description Method for getting instance of MindSphereTokenManager - creates new instance and return it if instance does not exist
   */
  public static getInstance(): MindSphereTokenManager {
    if (MindSphereTokenManager._instance == null) {
      MindSphereTokenManager._instance = new MindSphereTokenManager(
        {
          xSpaceAuthKey: config.appCredentials.xSpaceAuthKey,
          appName: config.appCredentials.appName,
          appVersion: config.appCredentials.appVersion,
          hostTenant: config.appCredentials.hostTenant,
          userTenant: config.appCredentials.userTenant,
        },
        config.tokenExpireAdditionalTime
      );
    }

    return MindSphereTokenManager._instance;
  }

  /**
   * @description application credentials
   */
  private _appCredentials: MindSphereAppCredentials;

  /**
   * @description actual token for authorization
   */
  private _token: null | string = null;

  /**
   * @description elapse date of actual token (in Unix format) - date already takes spare time into account
   */
  private _tokenExpireUnixDate: null | number = null;

  /**
   * @description additional spare time used for calulcating elapse date (in ms)
   */
  private _tokenExpireSpareTime: number;

  /**
   * @description Class for managing MindSphere tokens, Constructor is private - SINGLETON class
   * @param appCredentials Application credentials
   * @param tokenValidationSpareTime Additional spare time used for calulcating elapse date (in ms)
   */
  private constructor(
    appCredentials: MindSphereAppCredentials,
    tokenValidationSpareTime: number = 10000
  ) {
    this._appCredentials = appCredentials;
    this._tokenExpireSpareTime = tokenValidationSpareTime;
  }

  /**
   * @description Method for generating bearer token based for fetching the token from token service
   */
  private _generateBearerToken(): string {
    return `Basic ${this._appCredentials.xSpaceAuthKey}`;
  }

  /**
   * @description Method for fetching new token from MindSphere token service
   */
  public async fetchNewToken(): Promise<void> {
    let response = await axios.request({
      method: "POST",
      url: mindSphereTokenApiUrl,
      data: {
        appName: this._appCredentials.appName,
        appVersion: this._appCredentials.appVersion,
        hostTenant: this._appCredentials.hostTenant,
        userTenant: this._appCredentials.userTenant,
      },
      headers: {
        "Content-Type": "application/json",
        "X-SPACE-AUTH-KEY": this._generateBearerToken(),
      },
    });

    if (
      response.data == null ||
      response.data.access_token == null ||
      response.data.timestamp == null ||
      response.data.expires_in == null
    )
      throw new Error("Invalid response content while fetching new token");

    let newToken = response.data as {
      access_token: string;
      timestamp: number;
      expires_in: number;
    };

    this._token = newToken.access_token;

    //expires in is given in seconds - has to be multiplied by 1000
    this._tokenExpireUnixDate =
      newToken.timestamp +
      newToken.expires_in * 1000 -
      this._tokenExpireSpareTime;
  }

  /**
   * @description Method for getting token to authorize MindSphere service calls. If token does not exist, it is retrieved from MindSphere token service. If token exists and is valid (time not elapsed) it is simply returned
   */
  public async getToken(): Promise<string> {
    //Taking additional spare time to ensure api call timestamp not to elapse
    if (this._token == null || Date.now() >= this._tokenExpireUnixDate!) {
      await this.fetchNewToken();
    }

    if (this._token == null || this._tokenExpireUnixDate == null)
      throw new Error(
        "Token still doesn't exist after fetching from MindSphere API!"
      );

    return this._token;
  }
}

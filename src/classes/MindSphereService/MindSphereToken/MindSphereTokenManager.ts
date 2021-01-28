import request from "superagent";

const mindSphereTokenApi = `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`;

type MindSphereAppCredentials = {
  xSpaceAuthKey: string;
  appName: string;
  appVersion: string;
  hostTenant: string;
  userTenant: string;
};

/**
 * @description Class for managing MindSphere tokens
 */
class MindSphereTokenManager {
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
  private _tokenValidationUnixDate: null | number = null;

  /**
   * @description additional spare time used for calulcating elapse date (in ms)
   */
  private _tokenValidationSpareTime: number;

  /**
   * @description Class for managing MindSphere tokens
   * @param appCredentials Application credentials
   * @param tokenValidationSpareTime Additional spare time used for calulcating elapse date (in ms)
   */
  constructor(
    appCredentials: MindSphereAppCredentials,
    tokenValidationSpareTime: number = 10000
  ) {
    this._appCredentials = appCredentials;
    this._tokenValidationSpareTime = tokenValidationSpareTime;
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
    let data = await request
      .post(mindSphereTokenApi)
      .set("Content-Type", "application/json")
      .set("X-SPACE-AUTH-KEY", this._generateBearerToken())
      .set("Accept", "application/json")
      .send({
        appName: this._appCredentials.appName,
        appVersion: this._appCredentials.appVersion,
        hostTenant: this._appCredentials.hostTenant,
        userTenant: this._appCredentials.userTenant,
      });

    let newToken = JSON.parse(data.text) as {
      access_token: string;
      timestamp: number;
      expires_in: number;
    };

    this._token = newToken.access_token;

    //expires in is given in seconds - has to be multiplied by 1000
    this._tokenValidationUnixDate =
      newToken.timestamp +
      newToken.expires_in * 1000 -
      this._tokenValidationSpareTime;
  }

  /**
   * @description Method for getting token to authorize MindSphere service calls. If token does not exist, it is retrieved from MindSphere token service. If token exists and is valid (time not elapsed) it is simply returned
   */
  public async getToken(): Promise<string> {
    //Taking additional spare time to ensure api call timestamp not to elapse
    if (this._token == null || Date.now() >= this._tokenValidationUnixDate!) {
      await this.fetchNewToken();
    }

    if (this._token == null || this._tokenValidationUnixDate == null)
      throw new Error(
        "Token still doesn't exist after fetching from MindSphere API!"
      );

    return this._token;
  }
}

export default MindSphereTokenManager;

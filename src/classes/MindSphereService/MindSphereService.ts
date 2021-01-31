import { MindSphereTokenManager } from "./MindSphereToken/MindSphereTokenManager";
import axios, { AxiosResponse } from "axios";

type httpMethod = "GET" | "POST" | "PUT" | "DELETE";

export abstract class MindSphereService {
  protected _url: string;
  protected _tokenManager: MindSphereTokenManager;

  protected constructor(url: string) {
    this._url = url;
    this._tokenManager = MindSphereTokenManager.getInstance();
  }

  public static convertMindSphereDateToUnix(mindSphereDate: string) {
    return new Date(mindSphereDate).getTime();
  }

  public static convertUnixToMindSphereDate(unixDate: number) {
    return new Date(unixDate).toISOString();
  }

  protected async _getAuthToken() {
    let authToken = await this._tokenManager.getToken();
    return `Bearer ${authToken}`;
  }

  protected async _callAPI(
    method: httpMethod,
    url: string,
    params: { [key: string]: string | number | boolean } | null = null,
    data: any = null,
    headers: { [key: string]: string } = {}
  ) {
    let authToken = await this._getAuthToken();
    let headerToAppend = {
      Authorization: authToken,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    };

    return axios({
      method: method,
      url: url,
      headers: headerToAppend,
      data: data != null ? data : undefined,
      params: params != null ? params : undefined,
    });
  }
}

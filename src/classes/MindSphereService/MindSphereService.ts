import { MindSphereTokenManager } from "./MindSphereToken/MindSphereTokenManager";
import axios, { AxiosResponse } from "axios";
import { getStringBetweenCharacters } from "../../utilities/utilities";
import { head, isString } from "lodash";

export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

export type HTTPHeaders = { [key: string]: string | number | boolean | null };

export type MindSpherePaginatedResponse = {
  _embedded?: any;
  _links?: {
    first: {
      href: string;
    };
    self: {
      href: string;
    };
    next: {
      href: string;
    };
    last: {
      href: string;
    };
  };
  page?: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
};

export type MindSphereIndexedResponse = {
  resources: any[];
  startIndex: number;
  itemsPerPage: number;
  totalResults: number;
};

/**
 * @description Abstract class representing MindSphere Service - already fetches calls with Bearer Token
 */
export abstract class MindSphereService {
  /**
   * @description Main url of the service
   */
  protected _url: string;

  /**
   * @description Abstract class representing MindSphere Service - already fetches calls with Bearer Token
   * @param url  Main url of given service
   */
  protected constructor(url: string) {
    this._url = url;
  }

  /**
   * @description Method for getting token manager for given tenant name
   * @param tenantName Tenant name to get token manager for
   */
  protected _getTokenManager(tenantName: string) {
    return MindSphereTokenManager.getInstance(tenantName);
  }

  /**
   * @description Method for coverting MindSphere date to Unix Format
   * @param mindSphereDate MindSphere Date in ISO String format
   */
  public static convertMindSphereDateToUnix(mindSphereDate: string) {
    let date = Date.parse(mindSphereDate);
    if (isNaN(date)) throw new Error("Invalid date format");
    return date;
  }

  /**
   * @description Method for converting date in Unix Format to MindSphere (ISO Date) format
   * @param unixDate Unix date to convert
   */
  public static convertUnixToMindSphereDate(unixDate: number) {
    if (unixDate == null) throw new Error("Invalid unix date");

    return new Date(unixDate).toISOString();
  }

  /**
   * @description Method for checking if next response (in paginated call) is available
   * @param currentResponse current paginated response
   */
  private _nextPaginatedResponseAvailable(
    currentResponse: MindSpherePaginatedResponse
  ) {
    if (
      currentResponse == null ||
      currentResponse.page == null ||
      currentResponse.page.totalPages == null ||
      currentResponse.page.number == null
    )
      return false;

    if (
      currentResponse._links == null ||
      currentResponse._links.next == null ||
      currentResponse._links.next.href == null
    )
      return false;

    return currentResponse.page.number < currentResponse.page.totalPages - 1;
  }

  /**
   * @description Method for calling and getting responses of every call included in paginated MindSphere Call - eg. to get events data
   * @param tenant Name of the tenant to call API
   * @param method HTTP method
   * @param url url to call
   * @param params HTTP query params
   * @param data HTTP data
   * @param headers HTTP headers
   */
  protected async _callPaginatedAPI(
    tenant: string,
    method: HTTPMethod,
    url: string,
    params: any = null,
    data: any = null,
    headers: HTTPHeaders = {}
  ): Promise<MindSpherePaginatedResponse[]> {
    let firstResult = await this._callAPI(
      tenant,
      method,
      url,
      params,
      data,
      headers
    );
    let firstResponse: MindSpherePaginatedResponse = firstResult.data as MindSpherePaginatedResponse;
    let responsesToReturn = [firstResponse];
    let currentResponse = firstResponse;

    while (this._nextPaginatedResponseAvailable(currentResponse)) {
      let result = await this._callAPI(
        tenant,
        method,
        currentResponse._links!.next.href,
        null,
        null,
        headers
      );

      currentResponse = result.data;

      if (currentResponse != null) responsesToReturn.push(currentResponse);
    }

    return responsesToReturn;
  }

  /**
   * @description Method for checking if link header is a valid link header value (includes url of next linked request inside <>)
   * @param link header value to check
   */
  private _isLinkFromHeaderValid(link: string): boolean {
    if (!link.includes("<") || !link.includes(">")) return false;
    return true;
  }

  /**
   * @description Method for getting link to next Linked call from the header. Returns null if link cannot be retrieved - last call of the Linked call
   * @param response Current Axios response
   */
  private _getLinkFromHeader(response: AxiosResponse<any>): string | null {
    if (
      response == null ||
      response.headers == null ||
      response.headers.link == null ||
      !isString(response.headers.link)
    )
      return null;

    if (this._isLinkFromHeaderValid(response.headers.link)) {
      let linkFromHeader = getStringBetweenCharacters(
        response.headers.link,
        "<",
        ">"
      );
      if (linkFromHeader.length > 0) return linkFromHeader;
    }

    return null;
  }

  /**
   * @description Method for calling Linked API - where URL to retrieve next part of data is in header - eg. for getting Time-series data
   * @param tenant Name of the tenant to call API
   * @param method HTTP method
   * @param url starting URL
   * @param params HTTP query params
   * @param data HTTP body
   * @param headers HTTP headers
   */
  protected async _callLinkedAPI(
    tenant: string,
    method: HTTPMethod,
    url: string,
    params: any = null,
    data: any = null,
    headers: HTTPHeaders = {}
  ) {
    let firstResult = await this._callAPI(
      tenant,
      method,
      url,
      params,
      data,
      headers
    );
    let firstResponse: any = firstResult.data;
    let responsesToReturn: any[] = [firstResponse];
    let currentLink = this._getLinkFromHeader(firstResult);

    while (currentLink != null) {
      let result = await this._callAPI(
        tenant,
        method,
        currentLink,
        null,
        null,
        headers
      );

      let currentResponse = result.data;

      if (currentResponse != null) responsesToReturn.push(currentResponse);

      currentLink = this._getLinkFromHeader(result);
    }

    return responsesToReturn;
  }

  /**
   * @description Method for getting authorization token from token manager
   * @param tenant Name of the tenant to call API
   */
  protected async _getAuthToken(tenant: string) {
    let authToken = await this._getTokenManager(tenant).getToken();
    return `Bearer ${authToken}`;
  }

  /**
   * @description Method for calling the API in MindSphere - fetching token if has not been fetched before and embedding it into the call
   * @param tenant Name of the tenant to call API
   * @param method HTTP Method
   * @param url URL to call
   * @param params HTTP Query params
   * @param data HTTP Body
   * @param headers HTTP Headers
   */
  protected async _callAPI(
    tenant: string,
    method: HTTPMethod,
    url: string,
    params: any = null,
    data: any = null,
    headers: HTTPHeaders = {}
  ) {
    let authToken = await this._getAuthToken(tenant);

    let headerToAppend = {
      Authorization: authToken,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    };

    return axios.request({
      method: method,
      url: url,
      headers: headerToAppend,
      data: data != null ? data : undefined,
      params: params != null ? params : undefined,
    });
  }

  /**
   * @description Method for checking if next response (in paginated call) is available
   * @param currentResponse current paginated response
   */
  private _nextIndexedResponseAvailable(
    currentResponse: MindSphereIndexedResponse
  ) {
    if (
      currentResponse == null ||
      currentResponse.startIndex == null ||
      currentResponse.itemsPerPage == null ||
      currentResponse.totalResults == null
    )
      return false;

    return (
      currentResponse.startIndex - 1 + currentResponse.itemsPerPage <
      currentResponse.totalResults
    );
  }

  /**
   * @description Method for calling and getting responses of every call included in indexed MindSphere Call - eg. to get all users
   * @param tenant Name of the tenant to call API
   * @param method HTTP method
   * @param url url to call
   * @param itemsPerPage max item to get per one call
   * @param params HTTP query params
   * @param data HTTP data
   * @param headers HTTP headers
   */
  protected async _callIndexableAPI(
    tenant: string,
    method: HTTPMethod,
    url: string,
    itemsPerPage: number,
    params: any = null,
    data: any = null,
    headers: HTTPHeaders = {}
  ): Promise<MindSphereIndexedResponse[]> {
    let startIndex: number = 1;
    let paramsToSend = params != null ? { ...params } : {};
    let firstResult = await this._callAPI(
      tenant,
      method,
      url,
      { ...paramsToSend, startIndex: startIndex, count: itemsPerPage },
      data,
      headers
    );
    startIndex += itemsPerPage;
    let firstResponse: MindSphereIndexedResponse = firstResult.data as MindSphereIndexedResponse;
    let responsesToReturn = [firstResponse];
    let currentResponse = firstResponse;

    while (this._nextIndexedResponseAvailable(currentResponse)) {
      let result = await this._callAPI(
        tenant,
        method,
        url,
        { ...paramsToSend, startIndex: startIndex, count: itemsPerPage },
        data,
        headers
      );
      startIndex += itemsPerPage;

      currentResponse = result.data;

      if (currentResponse != null) responsesToReturn.push(currentResponse);
    }

    return responsesToReturn;
  }
}

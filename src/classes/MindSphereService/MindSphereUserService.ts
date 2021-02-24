import { filter } from "lodash";
import { MindSphereService } from "./MindSphereService";

const mindSphereUserApiUrl = `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`;
const maxNumberOfUsersInOneQuery = 100;

export type MindSphereUserData = {
  userName: string;
  name: {
    familyName?: string;
    givenName?: string;
  };
  active: boolean;
  subtenants?: {
    id: string;
  }[];
  id?: string;
  externalId?: string;
  emails?: {
    value: string;
  }[];
  groups?: {
    display: string;
    type: string;
    value?: string;
  }[];
};

/**
 * @description Class for representing MindSphere service for managing users
 */
export class MindSphereUserService extends MindSphereService {
  /**
   * @description Main instance of Singleton
   */
  private static _instance: MindSphereUserService | null = null;

  /**
   * @description Method for getting (or creating if not exists) main instance of Singleton
   */
  public static getInstance(): MindSphereUserService {
    if (MindSphereUserService._instance == null) {
      MindSphereUserService._instance = new MindSphereUserService(
        mindSphereUserApiUrl
      );
    }

    return MindSphereUserService._instance;
  }

  /**
   * @description Class for representing MindSphere service for managing users
   * @param url URL for managing users
   */
  private constructor(url: string) {
    super(url);
  }

  /**
   * @description Method for getting url to manage data of given user
   * @param userId userId to get the url
   */
  private _getUserUrl(userId: string) {
    return encodeURI(`${this._url}/${userId}`);
  }

  private _getUsersToCheckParams(
    subtenantName: string | null = null,
    userId: string | null = null,
    userName: string | null = null,
    userGroupId: string | null = null
  ) {
    let paramsToReturn: {
      subtenant?: string;
      filter?: string;
    } = {};

    let filters: string[] = [];
    if (userId != null) filters.push(`id eq "${userId}"`);
    if (userName != null) filters.push(`userName eq "${userName}"`);
    if (userGroupId != null) filters.push(`groups.display eq "${userGroupId}"`);

    if (filters.length > 0) {
      let filterString = filters.join(" and ");
      paramsToReturn.filter = filterString;
    }

    if (subtenantName != null) paramsToReturn.subtenant = subtenantName;

    return paramsToReturn;
  }

  public async getAllUsers(
    tenant: string,
    subtenantName: string | null = null,
    userId: string | null = null,
    userName: string | null = null,
    userGroupId: string | null = null
  ): Promise<MindSphereUserData[]> {
    let params = this._getUsersToCheckParams(
      subtenantName,
      userId,
      userName,
      userGroupId
    );

    let allRespones = await this._callIndexableAPI(
      tenant,
      "GET",
      this._url,
      maxNumberOfUsersInOneQuery,
      { ...params, sortBy: "id" }
    );

    //Collection for storing all names
    let allUsersToReturn: MindSphereUserData[] = [];

    for (let response of allRespones) {
      if (response.resources != null) {
        for (let user of response.resources) {
          if (user != null) allUsersToReturn.push(user as MindSphereUserData);
        }
      }
    }

    return allUsersToReturn;
  }

  public async getUser(
    tenant: string,
    userId: string
  ): Promise<MindSphereUserData> {
    let response = await this._callAPI(tenant, "GET", this._getUserUrl(userId));
    return response.data as MindSphereUserData;
  }

  public async createUser(
    tenant: string,
    userData: MindSphereUserData
  ): Promise<MindSphereUserData> {
    let response = await this._callAPI(tenant, "POST", this._url, null, {
      ...userData,
    });
    return response.data as MindSphereUserData;
  }

  public async updateUser(
    tenant: string,
    userId: string,
    userData: MindSphereUserData
  ): Promise<MindSphereUserData> {
    let response = await this._callAPI(
      tenant,
      "PUT",
      this._getUserUrl(userId),
      null,
      {
        ...userData,
      }
    );
    return response.data as MindSphereUserData;
  }

  public async deleteUser(tenant: string, userId: string) {
    await this._callAPI(tenant, "DELETE", this._getUserUrl(userId));
  }
}

//TODO - test this class

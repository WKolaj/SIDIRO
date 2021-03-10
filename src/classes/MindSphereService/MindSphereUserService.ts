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

  private _maxNumberOfUserPerOneCall: number;

  /**
   * @description Method for getting (or creating if not exists) main instance of Singleton
   */
  public static getInstance(): MindSphereUserService {
    if (MindSphereUserService._instance == null) {
      MindSphereUserService._instance = new MindSphereUserService(
        mindSphereUserApiUrl,
        maxNumberOfUsersInOneQuery
      );
    }

    return MindSphereUserService._instance;
  }

  /**
   * @description Class for representing MindSphere service for managing users
   * @param url URL for managing users
   * @param maxNumberOfUserPerOneCall Max number of user to get per one call
   */
  private constructor(url: string, maxNumberOfUserPerOneCall: number) {
    super(url);
    this._maxNumberOfUserPerOneCall = maxNumberOfUserPerOneCall;
  }

  /**
   * @description Method for getting url to manage data of given user
   * @param userId userId to get the url
   */
  private _getUserUrl(userId: string) {
    return encodeURI(`${this._url}/${userId}`);
  }

  private _getUsersToCheckParams(
    subtenantId: string | null = null,
    userId: string | null = null,
    userName: string | null = null
  ) {
    let paramsToReturn: {
      subtenant?: string;
      filter?: string;
    } = {};

    let filters: string[] = [];
    if (userId != null) filters.push(`id eq "${userId}"`);
    if (userName != null) filters.push(`username eq "${userName}"`);

    if (filters.length > 0) {
      let filterString = filters.join(" and ");
      paramsToReturn.filter = filterString;
    }

    if (subtenantId != null) paramsToReturn.subtenant = subtenantId;

    return paramsToReturn;
  }

  public async getAllUsers(
    tenant: string,
    subtenantId: string | null = null,
    userId: string | null = null,
    userName: string | null = null
  ): Promise<MindSphereUserData[]> {
    let params = this._getUsersToCheckParams(subtenantId, userId, userName);

    let allRespones = await this._callIndexableAPI(
      tenant,
      "GET",
      this._url,
      this._maxNumberOfUserPerOneCall,
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

  public async checkIfUserExists(
    tenant: string,
    userId: string | null,
    userName: string | null = null
  ): Promise<boolean> {
    if (userId == null && userName == null)
      throw new Error("Both userId and userName not specified");
    let allSuitableUsers = await this.getAllUsers(
      tenant,
      null,
      userId,
      userName
    );
    return allSuitableUsers.length > 0;
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

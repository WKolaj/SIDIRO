import { filter } from "lodash";
import { MindSphereService } from "./MindSphereService";

const mindSphereUserGroupApiUrl = `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`;
const maxNumberOfUserGroupsInOneQuery = 100;

export type MindSphereGroupMembership = {
  type: string;
  value: string;
};

export type MindSphereUserGroupData = {
  description: string;
  displayName: string;
  members: MindSphereGroupMembership[];
  id?: string;
};

/**
 * @description Class for representing MindSphere service managing user groups
 */
export class MindSphereUserGroupService extends MindSphereService {
  /**
   * @description Main instance of Singleton
   */
  private static _instance: MindSphereUserGroupService | null = null;

  private _maxNumberOfUserGroupsPerOneCall: number;

  /**
   * @description Method for getting (or creating if not exists) main instance of Singleton
   */
  public static getInstance(): MindSphereUserGroupService {
    if (MindSphereUserGroupService._instance == null) {
      MindSphereUserGroupService._instance = new MindSphereUserGroupService(
        mindSphereUserGroupApiUrl,
        maxNumberOfUserGroupsInOneQuery
      );
    }

    return MindSphereUserGroupService._instance;
  }

  /**
   * @description Class for representing MindSphere service for managing users
   * @param url URL for managing users
   * @param maxNumberOfUserGroupsPerOneCall Max number of user group to get per one call
   */
  private constructor(url: string, maxNumberOfUserGroupsPerOneCall: number) {
    super(url);
    this._maxNumberOfUserGroupsPerOneCall = maxNumberOfUserGroupsPerOneCall;
  }

  /**
   * @description Method for getting url to manage data of given user group
   * @param groupId groupId to get the url
   */
  private _getUserGroupUrl(groupId: string) {
    return encodeURI(`${this._url}/${groupId}`);
  }

  /**
   * @description Method for getting url to add user to group
   * @param groupId groupId to get the url
   */
  private _getUserGroupMembershipUrl(groupId: string) {
    return encodeURI(`${this._url}/${groupId}/members`);
  }

  /**
   * @description Method for getting url to remove user from group
   * @param groupId groupId to get the url
   * @param userId userId to delete from group
   */
  private _getUserGroupUrlToRemoveMember(groupId: string, userId: string) {
    return encodeURI(`${this._url}/${groupId}/members/${userId}`);
  }

  private _getGroupsToCheckParams(
    userGroupId: string | null = null,
    userGroupName: string | null = null
  ) {
    let paramsToReturn: {
      subtenant?: string;
      filter?: string;
    } = {};

    let filters: string[] = [];
    if (userGroupId != null) filters.push(`id eq "${userGroupId}"`);
    if (userGroupName != null)
      filters.push(`displayname eq "${userGroupName}"`);

    if (filters.length > 0) {
      let filterString = filters.join(" and ");
      paramsToReturn.filter = filterString;
    }

    return paramsToReturn;
  }

  public async getAllUserGroups(
    tenant: string,
    userGroupId: string | null = null,
    userGroupName: string | null = null
  ): Promise<MindSphereUserGroupData[]> {
    let params = this._getGroupsToCheckParams(userGroupId, userGroupName);

    let allRespones = await this._callIndexableAPI(
      tenant,
      "GET",
      this._url,
      this._maxNumberOfUserGroupsPerOneCall,
      { ...params, sortBy: "id" }
    );

    //Collection for storing all names
    let allUserGroupsToReturn: MindSphereUserGroupData[] = [];

    for (let response of allRespones) {
      if (response.resources != null) {
        for (let userGroup of response.resources) {
          if (userGroup != null)
            allUserGroupsToReturn.push(userGroup as MindSphereUserGroupData);
        }
      }
    }

    return allUserGroupsToReturn;
  }

  public async checkIfUserGroupExists(
    tenant: string,
    userGroupId: string | null,
    userGroupName: string | null = null
  ): Promise<boolean> {
    if (userGroupId == null && userGroupName == null)
      throw new Error("Both userGroupId and userGroupName not specified");
    let allSuitableGroups = await this.getAllUserGroups(
      tenant,
      userGroupId,
      userGroupName
    );
    return allSuitableGroups.length > 0;
  }

  public async getUserGroup(
    tenant: string,
    groupId: string
  ): Promise<MindSphereUserGroupData> {
    let response = await this._callAPI(
      tenant,
      "GET",
      this._getUserGroupUrl(groupId)
    );
    return response.data as MindSphereUserGroupData;
  }

  public async createUserGroup(
    tenant: string,
    groupData: MindSphereUserGroupData
  ): Promise<MindSphereUserGroupData> {
    let response = await this._callAPI(tenant, "POST", this._url, null, {
      ...groupData,
    });
    return response.data as MindSphereUserGroupData;
  }

  public async updateUserGroup(
    tenant: string,
    groupId: string,
    groupData: MindSphereUserGroupData
  ): Promise<MindSphereUserGroupData> {
    let response = await this._callAPI(
      tenant,
      "PUT",
      this._getUserGroupUrl(groupId),
      null,
      {
        ...groupData,
      }
    );
    return response.data as MindSphereUserGroupData;
  }

  public async deleteUserGroup(tenant: string, groupId: string) {
    await this._callAPI(tenant, "DELETE", this._getUserGroupUrl(groupId));
  }

  public async getGroupMembers(
    tenant: string,
    groupId: string
  ): Promise<MindSphereGroupMembership[]> {
    let response = await this._callAPI(
      tenant,
      "GET",
      this._getUserGroupMembershipUrl(groupId)
    );

    if (response == null || !Array.isArray(response.data)) return [];

    return response.data as MindSphereGroupMembership[];
  }

  public async checkIfUserIsAssignedToGroup(
    tenant: string,
    groupId: string,
    userId: string
  ): Promise<boolean> {
    let response = await this._callAPI(
      tenant,
      "GET",
      this._getUserGroupMembershipUrl(groupId)
    );

    if (response == null || !Array.isArray(response.data)) return false;

    let memebers = response.data as MindSphereGroupMembership[];

    return (
      memebers.find(
        (memeber) => memeber.type === "USER" && memeber.value === userId
      ) != null
    );
  }

  public async addUserToGroup(tenant: string, groupId: string, userId: string) {
    await this._callAPI(
      tenant,
      "POST",
      this._getUserGroupMembershipUrl(groupId),
      null,
      {
        type: "USER",
        value: userId,
      }
    );
  }

  public async removeUserFromGroup(
    tenant: string,
    groupId: string,
    userId: string
  ) {
    await this._callAPI(
      tenant,
      "DELETE",
      this._getUserGroupUrlToRemoveMember(groupId, userId)
    );
  }
}

//TODO - test this class

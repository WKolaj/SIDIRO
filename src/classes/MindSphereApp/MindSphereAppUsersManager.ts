import { config } from "node-config-ts";
import {
  MindSphereUserGroupData,
  MindSphereUserGroupService,
} from "../MindSphereService/MindSphereUserGroupService";
import {
  MindSphereUserData,
  MindSphereUserService,
} from "../MindSphereService/MindSphereUserService";
import { UserRole, UserStorageData } from "./MindSphereApp";
import { MindSphereDataStorage } from "../DataStorage/MindSphereDataStorage";
import { MindSphereUserJWTData } from "../../middleware/user/fetchUser";

/**
 * @description Class for managing mindsphere app users
 */
export class MindSphereAppUsersManager {
  protected _userDataStorage: MindSphereDataStorage<UserStorageData>;
  protected _initialized: boolean = false;
  protected _mindSphereUserService: MindSphereUserService;
  protected _mindSphereUserGroupService: MindSphereUserGroupService;

  protected _tenantName: string;
  public get TenantName() {
    return this._tenantName;
  }

  protected _subtenantId: string | null = null;
  public get SubtenantId() {
    return this._subtenantId;
  }

  protected _standardUserGroup: MindSphereUserGroupData | null = null;
  public get StandardUserGroup() {
    return this._standardUserGroup;
  }

  protected _subtenantUserGroup: MindSphereUserGroupData | null = null;
  public get SubtenantUserGroup() {
    return this._subtenantUserGroup;
  }

  protected _globalAdminGroup: MindSphereUserGroupData | null = null;
  public get GlobalAdminGroup() {
    return this._globalAdminGroup;
  }

  protected _globalUserGroup: MindSphereUserGroupData | null = null;
  public get GlobalUserGroup() {
    return this._globalUserGroup;
  }

  protected _localAdminGroup: MindSphereUserGroupData | null = null;
  public get LocalAdminGroup() {
    return this._localAdminGroup;
  }

  protected _localUserGroup: MindSphereUserGroupData | null = null;
  public get LocalUserGroup() {
    return this._localUserGroup;
  }

  public constructor(
    tenantName: string,
    userDataStorage: MindSphereDataStorage<UserStorageData>,
    subtenantId: string | null = null
  ) {
    this._tenantName = tenantName;
    this._userDataStorage = userDataStorage;
    this._subtenantId = subtenantId;
    this._mindSphereUserService = MindSphereUserService.getInstance();
    this._mindSphereUserGroupService = MindSphereUserGroupService.getInstance();
  }

  public async init() {
    await this._initUserGroups();

    this._initialized = true;
  }

  /**
   * @description Method for finding user group based on its display name in collection. NOTICE! Method throws if user is not found
   * @param allUserGroups Collection to check
   * @param displayName Display name to check
   */
  protected _findUserGroupBasedOnDisplayName(
    allUserGroups: MindSphereUserGroupData[],
    displayName: string
  ): MindSphereUserGroupData {
    let role = allUserGroups.find((group) => group.displayName === displayName);
    if (role == null) throw new Error(`User group ${displayName} not found!`);
    return role as MindSphereUserGroupData;
  }

  protected async _initUserGroups() {
    let allUserGroups = await MindSphereUserGroupService.getInstance().getAllUserGroups(
      this._tenantName
    );

    let standardUserGroup = this._findUserGroupBasedOnDisplayName(
      allUserGroups,
      config.userPermissions.msStandardUser
    );

    let subtenantUserGroup = this._findUserGroupBasedOnDisplayName(
      allUserGroups,
      config.userPermissions.msSubtenantUser
    );

    let globalAdminGroup = this._findUserGroupBasedOnDisplayName(
      allUserGroups,
      config.userPermissions.globalAdminRole
    );

    let globalUserGroup = this._findUserGroupBasedOnDisplayName(
      allUserGroups,
      config.userPermissions.globalUserRole
    );

    let localAdminGroup = this._findUserGroupBasedOnDisplayName(
      allUserGroups,
      config.userPermissions.localAdminRole
    );

    let localUserGroup = this._findUserGroupBasedOnDisplayName(
      allUserGroups,
      config.userPermissions.localUserRole
    );

    //In case some group is absent - at this point the mehtod will already have thrown
    this._standardUserGroup = standardUserGroup;
    this._subtenantUserGroup = subtenantUserGroup;
    this._globalAdminGroup = globalAdminGroup;
    this._globalUserGroup = globalUserGroup;
    this._localAdminGroup = localAdminGroup;
    this._localUserGroup = localUserGroup;
  }

  public static hasGlobalAdminScope(user: MindSphereUserJWTData) {
    return user.scope.includes(config.userPermissions.globalAdminRole);
  }

  public static hasGlobalUserScope(user: MindSphereUserJWTData) {
    return user.scope.includes(config.userPermissions.globalUserRole);
  }

  public static hasLocalAdminScope(user: MindSphereUserJWTData) {
    return user.scope.includes(config.userPermissions.localAdminRole);
  }

  public static hasLocalUserScope(user: MindSphereUserJWTData) {
    return user.scope.includes(config.userPermissions.localUserRole);
  }

  public static hasGlobalAdminRole(user: UserStorageData) {
    return user.permissions.role === UserRole.GlobalAdmin;
  }

  public static hasGlobalUserRole(user: UserStorageData) {
    return user.permissions.role === UserRole.GlobalUser;
  }

  public static hasLocalAdminRole(user: UserStorageData) {
    return user.permissions.role === UserRole.LocalAdmin;
  }

  public static hasLocalUserRole(user: UserStorageData) {
    return user.permissions.role === UserRole.LocalUser;
  }

  public getUserRoleBasedOnUserGroup(
    userGroup: MindSphereUserGroupData
  ): UserRole {
    if (!this._initialized) throw new Error(`UserManager not initialized!`);

    switch (userGroup.displayName) {
      case this.GlobalAdminGroup!.displayName:
        return UserRole.GlobalAdmin;
      case this.GlobalUserGroup!.displayName:
        return UserRole.GlobalUser;
      case this.LocalAdminGroup!.displayName:
        return UserRole.LocalAdmin;
      case this.LocalUserGroup!.displayName:
        return UserRole.LocalUser;
      default:
        throw Error(`Permissions ${userGroup.displayName} not recognized!`);
    }
  }

  public getUserGroupBasedOnUserRole(
    userRole: UserRole
  ): MindSphereUserGroupData {
    if (!this._initialized) throw new Error(`UserManager not initialized!`);

    switch (userRole) {
      case UserRole.GlobalAdmin:
        return this.GlobalAdminGroup!;
      case UserRole.GlobalUser:
        return this.GlobalUserGroup!;
      case UserRole.LocalAdmin:
        return this.LocalAdminGroup!;
      case UserRole.LocalUser:
        return this.LocalUserGroup!;
      default:
        throw Error(`Role ${userRole} not recognized!`);
    }
  }

  /**
   * @description Method for checking if user exists in MindSphere tenant based on userId or userEmail
   * @param userId Users id (optional)
   * @param userEmail Users email (optional)
   */
  public async checkIfUserIsCreatedInMindSphere(
    userId: string | null,
    userEmail: string | null = null
  ) {
    if (userId == null && userEmail == null)
      throw new Error(
        `Neither userId or userEmail passed to check if user exists`
      );
    return this._mindSphereUserService.checkIfUserExists(
      this.TenantName,
      userId,
      userEmail
    );
  }

  /**
   * @description Checking if user of given id is assigned to the application
   * @param userId User id to check
   */
  public async isUserAssignedToApp(userId: string) {
    let userData = await this._userDataStorage.getData(userId);
    return userData != null;
  }

  /**
   * @description Method for setting proper mindsphere groups for application user - based on storage data
   * @param userId User id of the user
   * @param userPayload Storage data based on which proper roles should be set
   */
  protected async _setProperMindSphereUserGroups(
    userId: string,
    userPayload: UserStorageData
  ) {
    let userMSData = await this._mindSphereUserService.getUser(
      this.TenantName,
      userId
    );

    let userPermissionGroup = await this.getUserGroupBasedOnUserRole(
      userPayload.permissions.role
    );

    //Checking if permissions should be changed
    let groupsToAdd: MindSphereUserGroupData[] = [];
    let groupsToRemove: MindSphereUserGroupData[] = [];
    let userPermissionGroupExists: boolean = false;
    let standardUserGroupExists: boolean = false;
    let subtenantUserGroupExists: boolean = false;

    for (let groupPayload of userMSData.groups!) {
      if (groupPayload.display === userPermissionGroup.displayName) {
        userPermissionGroupExists = true;
      } else if (groupPayload.display === this.GlobalAdminGroup!.displayName) {
        groupsToRemove.push(this.GlobalAdminGroup!);
      } else if (groupPayload.display === this.GlobalUserGroup!.displayName) {
        groupsToRemove.push(this.GlobalUserGroup!);
      } else if (groupPayload.display === this.LocalAdminGroup!.displayName) {
        groupsToRemove.push(this.LocalAdminGroup!);
      } else if (groupPayload.display === this.LocalUserGroup!.displayName) {
        groupsToRemove.push(this.LocalUserGroup!);
      } else if (groupPayload.display === this.StandardUserGroup!.displayName) {
        standardUserGroupExists = true;
      } else if (
        groupPayload.display === this.SubtenantUserGroup!.displayName
      ) {
        subtenantUserGroupExists = true;
      }
    }

    if (!userPermissionGroupExists) groupsToAdd.push(userPermissionGroup);
    if (this.SubtenantId != null && !subtenantUserGroupExists)
      groupsToAdd.push(this.SubtenantUserGroup!);
    if (this.SubtenantId == null && !standardUserGroupExists)
      groupsToAdd.push(this.StandardUserGroup!);

    //Adding new permissions to user
    await Promise.all(
      groupsToAdd.map(
        (userGroup) =>
          new Promise(async (resolve, reject) => {
            try {
              await this._mindSphereUserGroupService.addUserToGroup(
                this.TenantName,
                userGroup.id!,
                userId
              );
              return resolve(true);
            } catch (err) {
              return reject(err);
            }
          })
      )
    );

    //Removing unneccessary permissions
    await Promise.all(
      groupsToRemove.map(
        (userGroup) =>
          new Promise(async (resolve, reject) => {
            try {
              await this._mindSphereUserGroupService.removeUserFromGroup(
                this.TenantName,
                userGroup.id!,
                userId
              );
              return resolve(true);
            } catch (err) {
              return reject(err);
            }
          })
      )
    );
  }

  /**
   * @description Method for getting user from mindsphere
   * @param userId User id to get
   */
  public async getUser(
    userId: string
  ): Promise<{ msData: MindSphereUserData; storageData: UserStorageData }> {
    //Checking if edition is performed on the user associated with given app
    let userAssignedToApp = await this.isUserAssignedToApp(userId);
    if (!userAssignedToApp)
      throw Error("Cannot get user that is not assigned to the app!");

    let storageData = await this._userDataStorage.getData(userId);
    if (!storageData) throw Error("User does not exist in storage!");

    let msData = await this._mindSphereUserService.getUser(
      this.TenantName,
      userId
    );

    //Getting user to return
    return {
      storageData,
      msData,
    };
  }

  /**
   * @description Method for creating user in mindsphere and in storage based on user's payload from storage. NOTICE! Method returns id of created user
   * @param userStorageData User storage data based on which creation should be performed
   */
  public async createUser(
    userStorageData: UserStorageData
  ): Promise<{ msData: MindSphereUserData; storageData: UserStorageData }> {
    if (!this._initialized) throw new Error(`UserManager not initialized!`);

    let payloadToCreate: MindSphereUserData = {
      active: true,
      name: {},
      userName: userStorageData.email,
    };

    //Appending subtenant Id if app is assigned to subtenancy
    if (this.SubtenantId != null)
      payloadToCreate.subtenants = [
        {
          id: this.SubtenantId,
        },
      ];

    //Creating user in MindSphere
    let createdUser = await this._mindSphereUserService.createUser(
      this.TenantName,
      payloadToCreate
    );

    //Setting proper mindsphere user groups
    await this._setProperMindSphereUserGroups(createdUser.id!, userStorageData);

    //Creating user in storage
    await this._userDataStorage.setData(createdUser.id!, userStorageData);

    //Getting user again (needed due to the changes in memebership) to return
    let msData = await this._mindSphereUserService.getUser(
      this.TenantName,
      createdUser.id!
    );
    return { msData, storageData: userStorageData };
  }

  /**
   * @description Method for deleting user from both - mindsphere and app data
   * @param userId Id of user to delete
   */
  public async deleteUser(userId: string) {
    //Checking if deletion is performed on the user associated with given app
    let userAssignedToApp = await this.isUserAssignedToApp(userId);
    if (!userAssignedToApp)
      throw Error("Cannot delete user that is not assigned to the app!");

    //Deleting user from from MindSphere
    await this._mindSphereUserService.deleteUser(this.TenantName, userId);

    //Deleting user and its config from app data
    await this._userDataStorage.deleteData(userId);
  }

  /**
   * @description Method for updating the user
   * @param userId id of the user to update
   * @param userPayload User payload
   */
  public async updateUser(
    userId: string,
    userPayload: UserStorageData
  ): Promise<{ msData: MindSphereUserData; storageData: UserStorageData }> {
    //Checking if edition is performed on the user associated with given app
    let userAssignedToApp = await this.isUserAssignedToApp(userId);
    if (!userAssignedToApp)
      throw Error("Cannot edit user that is not assigned to the app!");

    //Setting proper mindsphere user groups
    await this._setProperMindSphereUserGroups(userId, userPayload);

    //Creating user in storage
    await this._userDataStorage.setData(userId, userPayload);

    //Getting user again (needed due to the changes in memebership) to return
    let updatedUser = await this._mindSphereUserService.getUser(
      this.TenantName,
      userId
    );

    return {
      msData: updatedUser,
      storageData: userPayload,
    };
  }
}

//TODO - test this class

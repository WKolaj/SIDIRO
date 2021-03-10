import { config } from "node-config-ts";
import { MindSphereDataStorage } from "../DataStorage/MindSphereDataStorage";
import {
  MindSphereUserData,
  MindSphereUserService,
} from "../MindSphereService/MindSphereUserService";
import {
  MindSphereUserGroupData,
  MindSphereUserGroupService,
} from "../MindSphereService/MindSphereUserGroupService";
import { MindSphereUserJWTData } from "../../middleware/tokenData/fetchTokenData";

export enum UserRole {
  "GlobalAdmin" = 0,
  "GlobalUser" = 1,
  "LocalAdmin" = 2,
  "LocalUser" = 3,
}

export enum PlantPermissions {
  "Admin" = 0,
  "User" = 1,
}

export interface UserStorageData {
  email: string;
  config: {
    [plantId: string]: object;
  };
  data: {
    [plantId: string]: object;
  };
  permissions: {
    role: UserRole;
    plants: { [plantId: string]: PlantPermissions };
  };
}

export interface PlanStorageData {
  config: object;
  data: object;
}

export interface AppStorageData {
  config: object;
  data: object;
}

const mainAppStorageId = "main";
const appStorageFileExtension = "app.config.json";
const plantStorageFileExtension = "plant.config.json";
const userStorageFileExtension = "user.config.json";

export class MindSphereApp {
  //#region ========== FIELDS ==========

  protected _initialized: boolean = false;
  protected _appStorage: MindSphereDataStorage<AppStorageData>;
  protected _plantStorage: MindSphereDataStorage<PlanStorageData>;
  protected _userStorage: MindSphereDataStorage<UserStorageData>;
  protected _mindSphereUserService: MindSphereUserService;
  protected _mindSphereUserGroupService: MindSphereUserGroupService;

  //#endregion ========== FIELDS ==========

  //#region ========== PROPERTIES ==========

  protected _storageTenant: string;
  /**
   * @description Name of the tenant where app config file is stored
   */
  get StorageTenant() {
    return this._storageTenant;
  }

  protected _appId: string;
  /**
   * @description Id of the app - build based on `${tenantId}.${subtenantId}` if subtenant exists or `${tenantId}` if only tenant
   */
  get AppId() {
    return this._appId;
  }

  protected _assetId: string;
  /**
   * @description id of asset associated with the app
   */
  get AssetId() {
    return this._assetId;
  }

  protected _tenantName: string;
  /**
   * @description name of the tenant associated with application
   */
  get TenantName() {
    return this._tenantName;
  }

  protected _subtenantId: string | null;
  /**
   * @description id of subtenant associated with application (if app runs as a subtenant)
   */
  get SubtenantId() {
    return this._subtenantId;
  }

  //#endregion ========== PROPERTIES ==========

  //#region ========== USER GROUPS ==========

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

  //#endregion ========== USER GROUPS ==========

  //#region ========== CONSTRUCTOR ==========

  /**
   * @description Class representing single instance of the app
   * @param storageTenant name of tenant where app config file is stored
   * @param appId  Id of the app - should be build based on `${tenantId}.${subtenantId}` if subtenant exists or `${tenantId}` if only tenant exists
   * @param assetId Id of asset associated with app
   * @param tenantName name of tenant assined
   */
  public constructor(
    storageTenant: string,
    appId: string,
    assetId: string,
    tenantName: string,
    subtenantId: string | null = null
  ) {
    this._storageTenant = storageTenant;
    this._appId = appId;
    this._assetId = assetId;
    this._tenantName = tenantName;
    this._subtenantId = subtenantId;
    this._mindSphereUserService = MindSphereUserService.getInstance();
    this._mindSphereUserGroupService = MindSphereUserGroupService.getInstance();
    this._appStorage = new MindSphereDataStorage(
      storageTenant,
      assetId,
      appStorageFileExtension
    );
    this._plantStorage = new MindSphereDataStorage(
      storageTenant,
      assetId,
      plantStorageFileExtension
    );
    this._userStorage = new MindSphereDataStorage(
      storageTenant,
      assetId,
      userStorageFileExtension
    );
  }

  //#endregion ========== CONSTRUCTOR ==========

  //#region ========== AUTHENTICATION AND AUTHORIZATION METHODS ==========

  public static getSuperAdminUserIds() {
    let usersString = config.userPermissions.superAdminUserIds! as string;
    return usersString.split(" ");
  }

  /**
   * @description Method for checking if user is a super admin
   * @param user user jwt data to check
   */
  public static async isSuperAdmin(user: MindSphereUserJWTData) {
    //Super Admin has to be assigned to the operator tenant - the same tenant when container is assigned
    if (user.ten !== config.appCredentials.hostTenant) return false;

    //Getting user from operator tenant to get his real id
    let users = await MindSphereUserService.getInstance().getAllUsers(
      user.ten,
      user.subtenant,
      null,
      user.email.toLowerCase()
    );

    //User not found - return false
    if (users.length < 1 || users[0].id == null) return false;

    let superAdminIds = MindSphereApp.getSuperAdminUserIds();

    return superAdminIds.includes(users[0].id);
  }

  public static hasGlobalAdminScope(user: MindSphereUserJWTData) {
    return user.scope.includes(config.userPermissions.globalAdminScope);
  }

  public static hasGlobalUserScope(user: MindSphereUserJWTData) {
    return user.scope.includes(config.userPermissions.globalUserScope);
  }

  public static hasLocalAdminScope(user: MindSphereUserJWTData) {
    return user.scope.includes(config.userPermissions.localAdminScope);
  }

  public static hasLocalUserScope(user: MindSphereUserJWTData) {
    return user.scope.includes(config.userPermissions.localUserScope);
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

  public static isLocalAdminOfPlant(plantId: string, user: UserStorageData) {
    return user.permissions.plants[plantId] === PlantPermissions.Admin;
  }

  public static isLocalUserOfPlant(plantId: string, user: UserStorageData) {
    return user.permissions.plants[plantId] === PlantPermissions.User;
  }

  public static hasLocalAccessToPlant(plantId: string, user: UserStorageData) {
    return (
      MindSphereApp.isLocalAdminOfPlant(plantId, user) ||
      MindSphereApp.isLocalUserOfPlant(plantId, user)
    );
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

  //#endregion ========== AUTHENTICATION AND AUTHORIZATION METHODS ==========

  //#region ========== INITIALIZATION ==========

  /**
   * @description Method for initializing application
   */
  public async init() {
    //Initializing user groups
    await this._initUserGroups();

    //Initializing storages
    await Promise.all([
      this._appStorage.init(),
      this._plantStorage.init(),
      this._userStorage.init(),
    ]);

    this._initialized = true;
  }

  /**
   * @description Method for initializing app user groups from mindSphere
   */
  protected async _initUserGroups() {
    let allUserGroups = await this._mindSphereUserGroupService.getAllUserGroups(
      this._tenantName
    );

    //Method for getting user group based on display name
    const findUserGroupBasedOnDisplayName = (displayName: string) => {
      let role = allUserGroups.find(
        (group) => group.displayName === displayName
      );
      if (role == null) throw new Error(`User group ${displayName} not found!`);
      return role;
    };

    let standardUserGroup = findUserGroupBasedOnDisplayName(
      config.userPermissions.msStandardUserGroup
    );

    let subtenantUserGroup = findUserGroupBasedOnDisplayName(
      config.userPermissions.msSubtenantUserGroup
    );

    let globalAdminGroup = findUserGroupBasedOnDisplayName(
      config.userPermissions.globalAdminGroup
    );

    let globalUserGroup = findUserGroupBasedOnDisplayName(
      config.userPermissions.globalUserGroup
    );

    let localAdminGroup = findUserGroupBasedOnDisplayName(
      config.userPermissions.localAdminGroup
    );

    let localUserGroup = findUserGroupBasedOnDisplayName(
      config.userPermissions.localUserGroup
    );

    //In case some group is absent - at this point the mehtod will already have thrown
    this._standardUserGroup = standardUserGroup;
    this._subtenantUserGroup = subtenantUserGroup;
    this._globalAdminGroup = globalAdminGroup;
    this._globalUserGroup = globalUserGroup;
    this._localAdminGroup = localAdminGroup;
    this._localUserGroup = localUserGroup;
  }

  //#endregion ========== INITIALIZATION ==========

  //#region ========== USER MANAGEMENT ==========

  /**
   * @description Method for getting user id from app tenant based on user email. Method returns null if user of given email does not exist
   * @param userEmail Email to get id from
   */
  async getUserIdIfExists(userEmail: string): Promise<string | null> {
    let allPossibleUsers = await this._mindSphereUserService.getAllUsers(
      this.TenantName,
      this.SubtenantId,
      null,
      userEmail.toLowerCase()
    );

    if (allPossibleUsers.length < 1 || allPossibleUsers[0].id == null)
      return null;

    return allPossibleUsers[0].id;
  }

  /**
   * @description Method for checking whether user of given email exists in storage
   * @param userEmail email to check
   */
  async userExistsInStorage(userEmail: string): Promise<boolean> {
    let usersObject = await this._userStorage.getAllData();
    let allUsers = Object.values(usersObject);
    return allUsers.find((user) => user.email === userEmail) != null;
  }

  /**
   * @description Method for checking whether user of given email exists in tenant
   * @param userEmail email to check
   */
  async userExistsInTenant(userEmail: string): Promise<boolean> {
    return this._mindSphereUserService.checkIfUserExists(
      this.TenantName,
      null,
      userEmail
    );
  }

  /**
   * @description Method for checking whether user of given email exists in both tenant and storage
   * @param userEmail
   */
  async userExistsInTenantAndStorage(userEmail: string): Promise<boolean> {
    let userExistsInTenant = await this.userExistsInTenant(userEmail);
    if (!userExistsInTenant) return false;
    let userExistsInStorage = await this.userExistsInStorage(userEmail);
    if (!userExistsInStorage) return false;
    return true;
  }

  /**
   * @description Method for checking if user of given id is assigned to app.
   * @param userId User id to check
   */
  async userAssignedToApp(userId: string): Promise<boolean> {
    let userData = await this._userStorage.getData(userId);
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
    let userAssignedToApp = await this.userAssignedToApp(userId);
    if (!userAssignedToApp)
      throw Error("Cannot get user that is not assigned to the app!");

    let storageData = await this._userStorage.getData(userId);
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
    await this._userStorage.setData(createdUser.id!, userStorageData);

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
    let userAssignedToApp = await this.userAssignedToApp(userId);
    if (!userAssignedToApp)
      throw Error("Cannot delete user that is not assigned to the app!");

    //Deleting user from from MindSphere
    await this._mindSphereUserService.deleteUser(this.TenantName, userId);

    //Deleting user and its config from app data
    await this._userStorage.deleteData(userId);
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
    let userAssignedToApp = await this.userAssignedToApp(userId);
    if (!userAssignedToApp)
      throw Error("Cannot edit user that is not assigned to the app!");

    //Setting proper mindsphere user groups
    await this._setProperMindSphereUserGroups(userId, userPayload);

    //Creating user in storage
    await this._userStorage.setData(userId, userPayload);

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

  //#endregion ========== USER MANAGEMENT ==========

  //#region ========== APP STORAGE DATA ==========

  public async getAppData(): Promise<AppStorageData | null> {
    return this._appStorage.getData(mainAppStorageId);
  }

  public async setAppData(appData: AppStorageData) {
    return this._appStorage.setData(mainAppStorageId, appData);
  }

  public async removeAppData() {
    return this._appStorage.deleteData(mainAppStorageId);
  }

  //#endregion ========== APP STORAGE DATA ==========

  //#region ========== USER STORAGE DATA ==========

  public async getUserData(userId: string): Promise<UserStorageData | null> {
    return this._userStorage.getData(userId);
  }

  public async setUserData(userId: string, userData: UserStorageData) {
    return this._userStorage.setData(userId, userData);
  }

  public async removeUserData(userId: string) {
    return this._userStorage.deleteData(userId);
  }

  public async getAllUsersData() {
    return this._userStorage.getAllData();
  }

  //#endregion ========== USER STORAGE DATA ==========

  //#region ========== PLANT STORAGE DATA ==========

  public async getPlantData(plantId: string): Promise<PlanStorageData | null> {
    return this._plantStorage.getData(plantId);
  }

  public async setPlantData(plantId: string, plantData: PlanStorageData) {
    return this._plantStorage.setData(plantId, plantData);
  }

  public async removePlantData(plantId: string) {
    return this._plantStorage.deleteData(plantId);
  }

  public async getAllPlantsData() {
    return this._plantStorage.getAllData();
  }

  //#endregion ========== PLANT STORAGE DATA ==========
}

import { config } from "node-config-ts";
import { MindSphereDataStorage } from "../DataStorage/MindSphereDataStorage";
import { MindSphereAppUsersManager } from "./MindSphereAppUsersManager";

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
  protected _appStorage: MindSphereDataStorage<AppStorageData>;
  protected _plantStorage: MindSphereDataStorage<PlanStorageData>;
  protected _userStorage: MindSphereDataStorage<UserStorageData>;

  protected _usersManager: MindSphereAppUsersManager;
  /**
   * @description Object to manage users of the app
   */
  get UsersManager() {
    return this._usersManager;
  }

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
    this._usersManager = new MindSphereAppUsersManager(
      this.TenantName,
      this._userStorage,
      this.SubtenantId
    );
  }

  public async init() {
    await this.UsersManager.init();

    //Initializing storages
    await Promise.all([
      this._appStorage.init(),
      this._plantStorage.init(),
      this._userStorage.init(),
    ]);
  }

  public async getAppData(): Promise<AppStorageData | null> {
    return this._appStorage.getData(mainAppStorageId);
  }

  public async setAppData(appData: AppStorageData) {
    return this._appStorage.setData(mainAppStorageId, appData);
  }

  public async removeAppData() {
    return this._appStorage.deleteData(mainAppStorageId);
  }

  public async getUserData(userId: string): Promise<UserStorageData | null> {
    return this._userStorage.getData(userId);
  }

  public async setUserData(userId: string, userData: UserStorageData) {
    return this._userStorage.setData(userId, userData);
  }

  public async removeUserData(userId: string) {
    return this._userStorage.deleteData(userId);
  }

  public async getAllUsers() {
    return this._userStorage.getAllData();
  }

  public async getPlantData(plantId: string): Promise<PlanStorageData | null> {
    return this._plantStorage.getData(plantId);
  }

  public async setPlantData(plantId: string, plantData: PlanStorageData) {
    return this._plantStorage.setData(plantId, plantData);
  }

  public async removePlantData(plantId: string) {
    return this._plantStorage.deleteData(plantId);
  }

  public async getAllPlants() {
    return this._plantStorage.getAllData();
  }
}

//TODO - test this class

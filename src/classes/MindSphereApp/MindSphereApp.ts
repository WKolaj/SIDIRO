import { config } from "node-config-ts";
import { MindSphereDataStorage } from "../DataStorage/MindSphereDataStorage";

export enum UserRole {
  "SuperAdmin",
  "GlobalAdmin",
  "GlobalUser",
  "LocalAdmin",
  "LocalUser",
}

export enum PlantPermissions {
  "User",
  "Admin",
}

export type UserStorageData = {
  config: object;
  data: object;
  permissions: {
    role: UserRole;
    plants: { [plantId: string]: PlantPermissions };
  };
};

export type PlanStorageData = {
  config: object;
  data: object;
};

export type AppStorageData = {
  config: object;
  data: object;
};

const appStorageFilePath = "main.app.config.json";
const appStorageFileExtension = "app.config.json";
const plantStorageFileExtension = "plant.config.json";
const userStorageFileExtension = "user.config.json";

export class MindSphereApp {
  protected _appStorage: MindSphereDataStorage<AppStorageData>;
  protected _plantStorage: MindSphereDataStorage<PlanStorageData>;
  protected _userStorage: MindSphereDataStorage<UserStorageData>;

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

  private _assetId: string;
  /**
   * @description id of asset associated with the app
   */
  get AssetId() {
    return this._assetId;
  }

  /**
   * @description Class representing single instance of the app
   * @param storageTenant name of tenant where app config file is stored
   * @param appId  Id of the app - should be build based on `${tenantId}.${subtenantId}` if subtenant exists or `${tenantId}` if only tenant exists
   * @param assetId Id of asset associated with app
   */
  public constructor(storageTenant: string, appId: string, assetId: string) {
    this._storageTenant = storageTenant;
    this._appId = appId;
    this._assetId = assetId;
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

  public async init() {
    //Initializing storages
    await Promise.all([
      this._appStorage.init(),
      this._plantStorage.init(),
      this._userStorage.init(),
    ]);
  }

  public async getAppData(): Promise<AppStorageData | null> {
    return this._appStorage.getData(appStorageFilePath);
  }

  public async setAppData(appData: AppStorageData) {
    return this._appStorage.setData(appStorageFilePath, appData);
  }

  public async getUserData(userId: string): Promise<UserStorageData | null> {
    return this._userStorage.getData(userId);
  }

  public async setUserData(userId: string, userData: UserStorageData) {
    return this._userStorage.setData(userId, userData);
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

  public async getAllPlants() {
    return this._plantStorage.getAllData();
  }
}

//TODO - test this class

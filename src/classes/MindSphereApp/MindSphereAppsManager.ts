import { config } from "node-config-ts";
import { MindSphereAssetService } from "../MindSphereService/MindSphereAssetService";
import { MindSphereApp } from "./MindSphereApp";

const appContainerTenant: string = config.appSettings.appContainerTenant!;
const appContainerAssetId: string = config.appSettings.appContainerAssetId!;
const appContainerAssetType: string = config.appSettings.appContainerAssetType!;
const appAssetType: string = config.appSettings.appAssetType!;

/**
 * @description Class for managing instances of MindSphere applications
 */
export class MindSphereAppsManager {
  private static _instance: MindSphereAppsManager | null;

  public static getInstance(): MindSphereAppsManager {
    if (MindSphereAppsManager._instance == null)
      MindSphereAppsManager._instance = new MindSphereAppsManager(
        appContainerTenant,
        appContainerAssetId,
        appAssetType
      );

    return MindSphereAppsManager._instance;
  }

  public static generateAppId(
    tenantId: string,
    subtenantId: string | undefined | null
  ): string {
    let idToReturn = tenantId;
    if (subtenantId != null) {
      idToReturn += `-${subtenantId}`;
    }
    return idToReturn;
  }

  private _storageTenant: string;
  private _mainAssetId: string;
  private _appAssetType: string;

  private _apps: { [key: string]: MindSphereApp } = {};

  public get Apps() {
    return { ...this._apps };
  }

  private constructor(
    storageTenant: string,
    mainAssetId: string,
    appAssetType: string
  ) {
    this._storageTenant = storageTenant;
    this._mainAssetId = mainAssetId;
    this._appAssetType = appAssetType;
  }

  public async checkIfAppExists(appId: string): Promise<string | null> {
    let allAssets = await MindSphereAssetService.getInstance().getAssets(
      this._storageTenant,
      appId,
      this._mainAssetId,
      this._appAssetType
    );

    if (allAssets.length < 1) return null;
    else return allAssets[0].assetId!;
  }

  public async createNewApp(appId: string): Promise<MindSphereApp> {
    let assetId = await this.checkIfAppExists(appId);
    if (assetId != null) throw new Error(`App ${appId} already exists!`);

    let assetForApp = await MindSphereAssetService.getInstance().createAsset(
      this._storageTenant,
      {
        name: appId,
        parentId: this._mainAssetId,
        typeId: this._appAssetType,
      }
    );

    let newApp = new MindSphereApp(
      this._storageTenant,
      appId,
      assetForApp.assetId!
    );

    await newApp.init();

    this._apps[appId] = newApp;

    return newApp;
  }

  public async deleteApp(appId: string) {
    let assetId = await this.checkIfAppExists(appId);
    if (assetId == null) throw new Error(`App ${appId} does not exist!`);

    await MindSphereAssetService.getInstance().deleteAsset(
      this._storageTenant,
      assetId
    );
  }

  public async fetchApp(appId: string): Promise<MindSphereApp> {
    let assetId = await this.checkIfAppExists(appId);
    if (assetId == null) throw new Error(`App ${appId} does not exist!`);

    let newApp = new MindSphereApp(this._storageTenant, appId, assetId);
    await newApp.init();
    this._apps[appId] = newApp;

    return newApp;
  }

  public async fetchAllApps(): Promise<{ [appId: string]: MindSphereApp }> {
    let allAssets = await MindSphereAssetService.getInstance().getAssets(
      this._storageTenant,
      null,
      this._mainAssetId,
      this._appAssetType
    );

    for (let asset of allAssets) {
      let newApp = new MindSphereApp(
        this._storageTenant,
        asset.name,
        asset.assetId!
      );
      await newApp.init();
      this._apps[asset.name] = newApp;
    }

    return this.Apps;
  }
}

//TODO - test this class

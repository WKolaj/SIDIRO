import { config } from "node-config-ts";
import {
  MindSphereAsset,
  MindSphereAssetService,
} from "../MindSphereService/MindSphereAssetService";
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
  ): string | null {
    if (tenantId == null || tenantId.length < 1) return null;

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

  public async getApp(appId: string): Promise<MindSphereApp> {
    if (this._apps[appId] == null) await this.fetchApp(appId);
    return this._apps[appId];
  }

  public async getAppAssetIdIfExists(appId: string): Promise<string | null> {
    let app = this._apps[appId];
    if (app != null) return app.AssetId;

    let allAssets = await MindSphereAssetService.getInstance().getAssets(
      this._storageTenant,
      appId,
      this._mainAssetId,
      this._appAssetType
    );

    if (allAssets.length < 1) return null;
    else return allAssets[0].assetId!;
  }

  public async checkIfAppExists(appId: string): Promise<boolean> {
    let assetId = await this.getAppAssetIdIfExists(appId);
    return assetId != null;
  }

  public async createNewApp(appId: string): Promise<MindSphereApp> {
    let appExists = await this.checkIfAppExists(appId);
    if (appExists) throw new Error(`App ${appId} already exists!`);

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
    let appAssetId = await this.getAppAssetIdIfExists(appId);
    if (appAssetId == null) throw new Error(`App ${appId} does not exist!`);

    await MindSphereAssetService.getInstance().deleteAsset(
      this._storageTenant,
      appAssetId!
    );
  }

  public async fetchApp(appId: string): Promise<MindSphereApp> {
    let appAssetId = await this.getAppAssetIdIfExists(appId);
    if (appAssetId == null) throw new Error(`App ${appId} does not exist!`);

    let newApp = new MindSphereApp(this._storageTenant, appId, appAssetId);
    await newApp.init();
    this._apps[appId] = newApp;

    return newApp;
  }

  public async fetchAppFromAsset(
    asset: MindSphereAsset
  ): Promise<MindSphereApp> {
    let newApp = new MindSphereApp(
      this._storageTenant,
      asset.name,
      asset.assetId!
    );
    await newApp.init();
    this._apps[asset.name] = newApp;

    return newApp;
  }

  public async getAllAppAssets(): Promise<MindSphereAsset[]> {
    return MindSphereAssetService.getInstance().getAssets(
      this._storageTenant,
      null,
      this._mainAssetId,
      this._appAssetType
    );
  }
}

//TODO - test this class

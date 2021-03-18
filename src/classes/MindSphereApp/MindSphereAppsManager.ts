import { config } from "node-config-ts";
import {
  MindSphereAsset,
  MindSphereAssetService,
} from "../MindSphereService/MindSphereAssetService";
import { MindSphereApp, UserRole } from "./MindSphereApp";

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

    let idToReturn = `ten-${tenantId}`;
    if (subtenantId != null) {
      if (subtenantId.length < 1) return null;
      idToReturn += `-sub-${subtenantId}`;
    }
    return idToReturn;
  }

  public static splitAppId(
    appId: string
  ): {
    tenantName: string;
    subtenantId: string | null;
  } {
    if (!appId.includes("ten-")) throw new Error("No tenant found!");

    if (appId.includes("-sub-")) {
      //Version with subtenant

      let splittedApp = appId.split("-sub-");
      if (splittedApp.length != 2)
        throw new Error(`Invalid appId format: ${appId}`);

      let tenantName = splittedApp[0].replace("ten-", "");
      if (tenantName.length < 1) throw new Error(`invalid tenant name`);

      let subtenantId: string | null = splittedApp[1];

      if (subtenantId.length < 1) subtenantId = null;

      return {
        tenantName: tenantName,
        subtenantId: subtenantId,
      };
    } else {
      //Version without subtenant
      let tenantName = appId.replace("ten-", "");

      if (tenantName.length < 1) throw new Error(`invalid tenant name`);
      return {
        tenantName: tenantName,
        subtenantId: null,
      };
    }
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
    if (this._apps[appId] == null) {
      let appAssetId = await this.getAppAssetIdIfExists(appId);
      if (appAssetId == null) throw new Error(`App ${appId} does not exist!`);

      await this.fetchApp(appId, appAssetId);
    }
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

  public async registerNewApp(appId: string): Promise<MindSphereApp> {
    let appExists = await this.checkIfAppExists(appId);
    if (appExists) throw new Error(`App ${appId} already exists!`);

    let appTenants = MindSphereAppsManager.splitAppId(appId);

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
      assetForApp.assetId!,
      appTenants.tenantName,
      appTenants.subtenantId
    );

    await newApp.init();

    this._apps[appId] = newApp;

    return newApp;
  }

  public async deregisterApp(appId: string) {
    let appAssetId = await this.getAppAssetIdIfExists(appId);
    if (appAssetId == null) throw new Error(`App ${appId} does not exist!`);

    await MindSphereAssetService.getInstance().deleteAsset(
      this._storageTenant,
      appAssetId!
    );

    if (this._apps[appId] != null) delete this._apps[appId];
  }

  public async fetchApp(
    appId: string,
    appAssetId: string
  ): Promise<MindSphereApp> {
    let appTenants = MindSphereAppsManager.splitAppId(appId);

    let newApp = new MindSphereApp(
      this._storageTenant,
      appId,
      appAssetId,
      appTenants.tenantName,
      appTenants.subtenantId
    );
    await newApp.init();
    this._apps[appId] = newApp;

    return newApp;
  }

  public async fetchAppFromAsset(
    asset: MindSphereAsset
  ): Promise<MindSphereApp> {
    if (asset.assetId == null) throw new Error("assets id not defined!");
    if (asset.name == null) throw new Error("assets name not defined!");

    return this.fetchApp(asset.name, asset.assetId);
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

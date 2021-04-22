import { CachedDataStorage } from "../DataStorage/CachedDataStorage";
import Sampler from "../Sampler/Sampler";
import {
  CustomServiceConfig,
  CustomServiceData,
  CustomServiceType,
} from "./CustomServiceManager";

abstract class CustomService<
  ServiceConfig extends CustomServiceConfig,
  ServiceData extends CustomServiceData
> {
  private _dataStorage: CachedDataStorage<ServiceConfig>;
  private _initialized: boolean = false;
  private _id: string;
  private _type: CustomServiceType;
  private _appID: string | null = null;
  private _plantID: string | null = null;
  private _sampleTime: number | null = null;
  private _lastRefreshTickID: number | null = null;
  private _initTickID: number | null = null;

  public get Initialized() {
    return this._initialized;
  }

  public get Type() {
    return this._type;
  }

  public get ID() {
    return this._id;
  }

  public get AppID() {
    return this._appID;
  }

  public get PlantID() {
    return this._plantID;
  }

  public get SampleTime() {
    return this._sampleTime;
  }

  public get LastRefreshTickID() {
    return this._lastRefreshTickID;
  }

  public get InitTickID() {
    return this._initTickID;
  }

  public constructor(
    type: CustomServiceType,
    id: string,
    dataStorage: CachedDataStorage<ServiceConfig>
  ) {
    this._type = type;
    this._id = id;
    this._dataStorage = dataStorage;
  }

  public async init(tickId: number, data: ServiceConfig) {
    if (!this.Initialized) {
      if (data.appId != null) this._appID = data.appId;
      if (data.plantId != null) this._plantID = data.plantId;

      this._sampleTime = data.sampleTime;

      await this._onInit(tickId, data);

      this._initTickID = tickId;
      this._initialized = true;
    }
  }

  protected abstract _onInit(
    tickId: number,
    data: ServiceConfig
  ): Promise<void>;

  public async refresh(tickId: number) {
    //Refreshing only if service is initialized and sample time matches tick id
    if (
      this.Initialized &&
      Sampler.doesSampleTimeMatchesTick(tickId, this.SampleTime!)
    ) {
      await this._onRefresh(tickId);

      this._lastRefreshTickID = tickId;
    }
  }
  protected abstract _onRefresh(tickId: number): Promise<void>;

  public async getConfig() {
    if (!this.Initialized) throw new Error("Service not initialized!");
    return this._dataStorage.getData(this.ID);
  }

  public async setConfig(payload: ServiceConfig) {
    if (!this.Initialized) throw new Error("Service not initialized!");
    await this._dataStorage.setData(this.ID, payload);
    return this._onSetStorageData(payload);
  }
  protected abstract _onSetStorageData(payload: ServiceConfig): Promise<void>;

  public abstract getData(): Promise<ServiceData>;

  public validateNewConfig(newConfig: ServiceConfig): string | null {
    //TODO - test this method

    if (newConfig.id !== this.ID) return "ID cannot be changed";
    if (newConfig.serviceType !== this.Type)
      return "ServiceType cannot be changed";
    if (newConfig.appId !== this.AppID) return "AppID cannot be changed";
    if (newConfig.plantId !== this.PlantID) return "AppID cannot be changed";

    return null;
  }
}

export default CustomService;

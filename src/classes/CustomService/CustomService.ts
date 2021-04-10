import { CachedDataStorage } from "../DataStorage/CachedDataStorage";
import Sampler from "../Sampler/Sampler";
import {
  CustomServicePayload,
  CustomServiceType,
} from "./CustomServiceManager";

abstract class CustomService<ServicePayload extends CustomServicePayload> {
  private _dataStorage: CachedDataStorage<ServicePayload>;
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
    dataStorage: CachedDataStorage<ServicePayload>
  ) {
    this._type = type;
    this._id = id;
    this._dataStorage = dataStorage;
  }

  public async init(tickId: number, data: ServicePayload) {
    if (!this.Initialized) {
      if (data?.appId != null) this._appID = data.appId;
      if (data?.plantId != null) this._plantID = data.plantId;

      this._sampleTime = data.sampleTime;

      await this._onInit(tickId);

      this._initTickID = tickId;
      this._initialized = true;
    }
  }
  public abstract _onInit(tickId: number): Promise<void>;

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
  public abstract _onRefresh(tickId: number): Promise<void>;

  public async getStorageData() {
    return this._dataStorage.getData(this.ID);
  }

  public async setStorageData(payload: ServicePayload) {
    return this._dataStorage.setData(this.ID, payload);
  }
}

export default CustomService;

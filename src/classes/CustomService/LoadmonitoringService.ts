import { CachedDataStorage } from "../DataStorage/CachedDataStorage";
import CustomService from "./CustomService";
import {
  CustomServiceConfig,
  CustomServiceData,
  CustomServiceType,
} from "./CustomServiceManager";

export interface LoadmonitoringConfig extends CustomServiceConfig {
  id: string;
  appId: string;
  plantId: string;
  sampleTime: number;
  serviceType: CustomServiceType.LoadmonitoringService;
  enabled: boolean;
  tenant: string;
  assetsIds: { assetId: string; propertyId: string }[];
  powerLosses: number;
  alertLimit: number;
  warningLimit: number;
  mailingList: string[];
}

export interface LoadmonitoringData extends CustomServiceData {}

class LoadmonitoringService extends CustomService<
  LoadmonitoringConfig,
  LoadmonitoringData
> {
  public constructor(
    id: string,
    dataStorage: CachedDataStorage<LoadmonitoringConfig>
  ) {
    super(CustomServiceType.LoadmonitoringService, id, dataStorage);
  }

  protected async _onInit(
    tickId: number,
    data: LoadmonitoringConfig
  ): Promise<void> {
    console.log(`${tickId} - ${this.ID}: service initialized!`);
  }

  protected async _onRefresh(tickId: number): Promise<void> {
    console.log(`${tickId} - ${this.ID}: service refreshed!`);
  }

  protected async _onSetStorageData(
    payload: LoadmonitoringConfig
  ): Promise<void> {
    console.log(`${this.ID}: new data set!`);
  }

  public async getPayloadData(): Promise<LoadmonitoringData> {
    return {
      initTickId: this.InitTickID,
      initialized: this.Initialized,
      lastRefreshTickId: this.LastRefreshTickID,
    };
  }
}

export default LoadmonitoringService;

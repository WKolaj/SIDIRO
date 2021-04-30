import { MindSphereDataStorage } from "../DataStorage/MindSphereDataStorage";
import { CachedDataStorage } from "../DataStorage/CachedDataStorage";
import { config } from "node-config-ts";
import CustomService from "./CustomService";
import Sampler from "../Sampler/Sampler";
import logger from "../../logger/logger";
import { generateRandomString } from "../../utilities/utilities";
import LoadmonitoringService, {
  LoadmonitoringConfig,
} from "./LoadmonitoringService";

const serviceFileExtension = "service.config.json";

export enum CustomServiceType {
  LoadmonitoringService = "LoadmonitoringService",
}

//Schema for data stored in storage
export interface CustomServiceConfig {
  id?: string;
  appId?: string;
  plantId?: string;
  sampleTime: number;
  serviceType: CustomServiceType;
}

//Schema for data returned as response
export interface CustomServiceData {
  lastRefreshTickId: number | null;
  initTickId: number | null;
  initialized: boolean;
}

class CustomServiceManager {
  private static _instance: CustomServiceManager | null = null;

  public static getInstance(): CustomServiceManager {
    if (CustomServiceManager._instance == null) {
      let newInstance = new CustomServiceManager(
        config.appSettings.appContainerTenant!,
        config.appSettings.serviceContainerAssetId!,
        serviceFileExtension
      );
      CustomServiceManager._instance = newInstance;
    }

    return CustomServiceManager._instance;
  }

  private _services: {
    [serviceID: string]: CustomService<CustomServiceConfig, CustomServiceData>;
  } = {};
  private _sampler: Sampler | null = null;
  private _dataStorage: CachedDataStorage<CustomServiceConfig>;
  private _initialized: boolean = false;
  private _lastRefreshTickID: number | null = null;
  private _initTickID: number | null = null;

  public get LastRefreshTickID() {
    return this._lastRefreshTickID;
  }

  public get InitTickID() {
    return this._initTickID;
  }

  public get Initialized() {
    return this._initialized;
  }

  private constructor(
    tenantID: string,
    assetID: string,
    fileExtension: string
  ) {
    //binding handler to this object
    this._handleSamplerTick = this._handleSamplerTick.bind(this);

    this._dataStorage = new MindSphereDataStorage<CustomServiceConfig>(
      tenantID,
      assetID,
      fileExtension
    );
  }

  public async init() {
    if (!this.Initialized) {
      let currentTick = Sampler.getCurrentTickNumber();

      await this._initDataStorage();
      await this._loadAndInitServices(currentTick);
      await this._initSampler();

      //Setting as initializied after all compoements were initialzied
      this._initialized = true;
      this._initTickID = currentTick;
    }
  }

  private async _initDataStorage() {
    await this._dataStorage.init();
  }

  private async _loadAndInitServices(tickNumber: number) {
    let allServiceData = await this._dataStorage.getAllData();
    for (let serviceId of Object.keys(allServiceData)) {
      try {
        let servicePayload = allServiceData[serviceId];
        let newService = this._createServiceBasedOnType(
          serviceId,
          servicePayload.serviceType
        );
        await newService.init(tickNumber, servicePayload);
        this._services[serviceId] = newService;
      } catch (err) {
        logger.error(
          `Error during initializing service ${serviceId}: ${err.message}`,
          err
        );
      }
    }
  }

  private _createServiceBasedOnType(
    id: string,
    type: CustomServiceType
  ): CustomService<CustomServiceConfig, CustomServiceData> {
    switch (type) {
      case CustomServiceType.LoadmonitoringService: {
        return new LoadmonitoringService(
          id,
          this._dataStorage as MindSphereDataStorage<LoadmonitoringConfig>
        );
      }
      default: {
        throw new Error(`Unrecognized service type: ${type}`);
      }
    }
  }

  private _initSampler() {
    this._sampler = new Sampler();
    //Method _handleSamplerTick bound in constructor
    this._sampler.ExternalTickHandler = this._handleSamplerTick;
    this._sampler.start();
  }

  private async _handleSamplerTick(tickId: number) {
    if (this.Initialized) {
      await this._refreshAllServices(tickId);
    }
  }

  private async _refreshAllServices(tickId: number) {
    let allServices = Object.values(this._services);
    let allRefreshActions = allServices.map(
      (service) =>
        new Promise(async (resolve, reject) => {
          //Try catch - in order to ensure that error will not crach whole app
          try {
            await service.refresh(tickId);
            return resolve(null);
          } catch (err) {
            logger.error(
              `Error during refreshing service ${service.ID}: ${err.message}`,
              err
            );
            return resolve(null);
          }
        })
    );

    //Double try catch - in order to ensure that there will be no crashes
    try {
      await Promise.all(allRefreshActions);
    } catch (err) {
      logger.error(`Error during refreshing services: ${err.message}`, err);
    }

    //Setting last refresh tick id after the refreshing
    this._lastRefreshTickID = tickId;
  }

  public async serviceExists(
    id: string,
    type: CustomServiceType | null = null,
    appId: string | null = null,
    plantId: string | null = null
  ) {
    if (!this.Initialized) throw new Error("ServiceManager not initialized!");
    let service = this._services[id];
    if (service == null) return false;

    if (type != null && service.Type !== type) return false;
    if (appId != null && service.AppID !== appId) return false;
    if (plantId != null && service.PlantID !== plantId) return false;

    return true;
  }

  public async getAllServices(
    type: CustomServiceType | null = null,
    appId: string | null = null,
    plantId: string | null = null
  ) {
    if (!this.Initialized) throw new Error("ServiceManager not initialized!");
    let filteredServices = Object.values(this._services);

    if (type != null)
      filteredServices = filteredServices.filter(
        (service) => service.Type === type
      );

    if (appId != null)
      filteredServices = filteredServices.filter(
        (service) => service.AppID === appId
      );

    if (plantId != null)
      filteredServices = filteredServices.filter(
        (service) => service.PlantID === plantId
      );

    return filteredServices;
  }

  public async getService(id: string) {
    if (!this.Initialized) throw new Error("ServiceManager not initialized!");
    let service = this._services[id];
    if (service == null) throw new Error(`Service ${id} not found!`);

    return service;
  }

  public async removeService(id: string) {
    if (!this.Initialized) throw new Error("ServiceManager not initialized!");
    if (this._services[id] == null) throw new Error(`Service ${id} not found!`);
    await this._dataStorage.deleteData(id);
    delete this._services[id];
  }

  public async updateService(id: string, payload: CustomServiceConfig) {
    if (!this.Initialized) throw new Error("ServiceManager not initialized!");
    let service = this._services[id];
    if (service == null) throw new Error(`Service ${id} not found!`);

    await service.setConfig(payload);
  }

  public async createService(payload: CustomServiceConfig): Promise<string> {
    if (!this.Initialized) throw new Error("ServiceManager not initialized!");
    let serviceId = generateRandomString(16);
    let payloadToCreate = { ...payload, id: serviceId };

    let service = this._createServiceBasedOnType(
      payloadToCreate.id,
      payloadToCreate.serviceType
    );

    await this._dataStorage.setData(payloadToCreate.id, payloadToCreate);

    let tickNumber = Sampler.getCurrentTickNumber();

    await service.init(tickNumber, payloadToCreate);

    this._services[serviceId] = service;

    return serviceId;
  }
}

export default CustomServiceManager;

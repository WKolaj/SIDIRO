import { MindSphereDataStorage } from "../DataStorage/MindSphereDataStorage";
import { CachedDataStorage } from "../DataStorage/CachedDataStorage";
import { config } from "node-config-ts";
import CustomService from "./CustomService";
import Sampler from "../Sampler/Sampler";
import TestCustomService from "./TestCustomService";
import logger from "../../logger/logger";
import { reject } from "lodash";
import { generateRandomString } from "../../utilities/utilities";

const serviceFileExtension = "service.config.json";

export enum CustomServiceType {
  TestCustomService = 0,
}

export interface CustomServicePayload {
  id?: string;
  appId?: string;
  plantId?: string;
  sampleTime: number;
  serviceType: CustomServiceType;
}

class CustomServiceManager {
  private static _instance: CustomServiceManager | null = null;

  public static getInstance(): CustomServiceManager {
    if (CustomServiceManager._instance == null) {
      let newInstance = new CustomServiceManager(
        config.appSettings.appContainerTenant,
        config.appSettings.appContainerAssetId,
        serviceFileExtension
      );
      CustomServiceManager._instance = newInstance;
    }

    return CustomServiceManager._instance;
  }

  private _services: { [serviceID: string]: CustomService } = {};
  private _sampler: Sampler = new Sampler();
  private _dataStorage: CachedDataStorage<CustomServicePayload>;
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
    this._dataStorage = new MindSphereDataStorage<CustomServicePayload>(
      tenantID,
      assetID,
      fileExtension
    );
  }

  public async init() {
    if (!this.Initialized) {
      await this._initDataStorage();
      await this._loadAndInitServices();
      await this._initSampler();
    }
  }

  private async _initDataStorage() {
    await this._dataStorage.init();
  }

  private async _loadAndInitServices() {
    let allServiceData = await this._dataStorage.getAllData();
    for (let serviceId of Object.keys(allServiceData)) {
      try {
        let tickNumber = Sampler.getCurrentTickNumber();
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
  ): CustomService {
    switch (type) {
      case CustomServiceType.TestCustomService: {
        return new TestCustomService(id, this._dataStorage);
      }
      default: {
        throw new Error(`Unrecognized service type! ${type}`);
      }
    }
  }

  private _initSampler() {
    this._sampler = new Sampler();
    this._sampler.ExternalTickHandler = this.handleSamplerTick;
    this._sampler.start();
  }

  private async handleSamplerTick(tickId: number) {
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
  }

  public async serviceExists(
    id: string,
    appId: string | null = null,
    plantId: string | null = null
  ) {
    let service = this._services[id];
    if (service == null) return false;

    if (appId != null && service.AppID !== appId) return false;
    if (plantId != null && service.PlantID !== plantId) return false;

    return true;
  }

  public async getAllServices(
    appId: string | null = null,
    plantId: string | null = null
  ) {
    let filteredServices = Object.values(this._services);

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
    let service = this._services[id];
    if (service == null) throw new Error(`Service ${id} not found!`);

    return service;
  }

  public async removeService(id: string) {
    if (this._services[id] == null) throw new Error(`Service ${id} not found!`);
    delete this._services[id];
    await this._dataStorage.deleteData(id);
  }

  public async updateService(id: string, payload: CustomServicePayload) {
    let service = this._services[id];
    if (service == null) throw new Error(`Service ${id} not found!`);

    await service.setStorageData(payload);
  }

  public async createService(payload: CustomServicePayload) {
    let serviceId = generateRandomString(16);
    let payloadToCreate = { ...payload, id: serviceId };

    let service = this._createServiceBasedOnType(
      payloadToCreate.id,
      payloadToCreate.serviceType
    );

    let tickNumber = Sampler.getCurrentTickNumber();

    await service.init(tickNumber, payloadToCreate);

    this._services[serviceId] = service;
  }
}

export default CustomServiceManager;

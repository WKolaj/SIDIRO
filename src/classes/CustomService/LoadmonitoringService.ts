import logger from "../../logger/logger";
import { CachedDataStorage } from "../DataStorage/CachedDataStorage";
import {
  MindSphereTimeSeriesService,
  TimeSeriesData,
} from "../MindSphereService/MindSphereTimeSeriesService";
import Sampler from "../Sampler/Sampler";
import CustomService from "./CustomService";
import {
  CustomServiceConfig,
  CustomServiceData,
  CustomServiceType,
} from "./CustomServiceManager";

export interface AssetData {
  assetId: string;
  aspectId: string;
  variableName: string;
  multiplier: number;
}

export interface LoadmonitoringConfig extends CustomServiceConfig {
  serviceType: CustomServiceType.LoadmonitoringService;
  enabled: boolean;
  tenant: string;
  assetIds: AssetData[];
  powerLosses: number;
  alertLimit: number;
  warningLimit: number;
  mailingList: string[];
  interval: number;
}

export interface EnergyPoint {
  tickId: number;
  value: number;
}

export interface LoadmonitoringData extends CustomServiceData {
  warningPoints: EnergyPoint[];
  alertPoints: EnergyPoint[];
  historicalPoints: EnergyPoint[];
  predictedPoints: EnergyPoint[];
  warningActive: boolean;
  alertActive: boolean;
  predictedConsumption: number;
  predictedPower: number;
}

class LoadmonitoringService extends CustomService<
  LoadmonitoringConfig,
  LoadmonitoringData
> {
  private _enabled: boolean | null = null;
  private _tenant: string | null = null;
  private _assetIds: Array<AssetData> | null = null;
  private _powerLosses: number | null = null;
  private _alertLimit: number | null = null;
  private _warningLimit: number | null = null;
  private _mailingList: string[] | null = null;
  private _interval: number | null = null;
  private _warningPoints: EnergyPoint[] = [];
  private _alertPoints: EnergyPoint[] = [];
  private _predictedPoints: EnergyPoint[] = [];
  private _historicalPoints: EnergyPoint[] = [];
  private _predictedPower: number = 0;
  private _predictedEnergy: number = 0;
  private _alerActive: boolean = false;
  private _warningActive: boolean = false;

  get Enabled() {
    return this._enabled;
  }

  get Tenant() {
    return this._tenant;
  }

  get AssetIds() {
    return this._assetIds;
  }

  get PowerLosses() {
    return this._powerLosses;
  }

  get AlertLimit() {
    return this._alertLimit;
  }

  get WarningLimit() {
    return this._warningLimit;
  }

  get Interval() {
    return this._interval;
  }

  get WarningPoints() {
    return this._warningPoints;
  }

  get AlertPoints() {
    return this._alertPoints;
  }

  get PredictedPoints() {
    return this._predictedPoints;
  }

  get HistoricalPoints() {
    return this._historicalPoints;
  }

  get PredictedPower() {
    return this._predictedPower;
  }

  get PredictedEnergy() {
    return this._predictedEnergy;
  }

  get AlertActive() {
    return this._alerActive;
  }

  get WarningActive() {
    return this._warningActive;
  }

  get MailingList() {
    return this._mailingList;
  }

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
    this._enabled = data.enabled;
    this._tenant = data.tenant;
    this._assetIds = data.assetIds;
    this._powerLosses = data.powerLosses;
    this._alertLimit = data.alertLimit;
    this._warningLimit = data.warningLimit;
    this._mailingList = data.mailingList;
    this._interval = data.interval;
  }

  protected async _onRefresh(tickId: number): Promise<void> {
    console.log(`${tickId} - ${this.ID}: service refreshed!`);
  }

  //TODO change to private after testing
  public _getActualTimeInterval(
    tickId: number
  ): { beginTickId: number; endTickId: number } {
    let intervalInSeconds = this.Interval! * 60;
    let beginingOfInterval = tickId - (tickId % intervalInSeconds);
    let endOfInterval = beginingOfInterval + intervalInSeconds;
    return {
      beginTickId: Sampler.convertTickNumberToDate(beginingOfInterval),
      endTickId: Sampler.convertTickNumberToDate(endOfInterval),
    };
  }

  private async _getActualData(tickId: number): Promise<EnergyPoint[]> {
    let energyPointsToReturn: EnergyPoint[] = [];

    let currentPeriod = this._getActualTimeInterval(tickId);

    return energyPointsToReturn;
  }

  //TODO change to private after testing
  public async _getMindSphereData(
    beginIntervalTime: number,
    endIntervalTime: number
  ): Promise<
    {
      [tickId: number]: {
        value: number | boolean | string | null;
      };
    }[]
  > {
    let mindSphereService = MindSphereTimeSeriesService.getInstance();

    let self = this;
    let promisesToInvoke: Promise<{
      [tickId: number]: {
        value: number | boolean | string | null;
      };
    }>[] = [];

    //Constructing refreshing promises - with the same order as asset ids
    for (let i = 0; i < this.AssetIds!.length; i++) {
      let assetObject = self.AssetIds![i];

      promisesToInvoke.push(
        new Promise(async (resolve, reject) => {
          try {
            //begin interval is exclusive - has to be set to smaller value
            let data = await mindSphereService.getValues(
              self.Tenant!,
              assetObject.assetId,
              assetObject.aspectId,
              beginIntervalTime - 60000,
              endIntervalTime
            );
            let dataToReturn = data[assetObject.variableName] ?? {};
            return resolve(dataToReturn);
          } catch (err) {
            logger.error(err.message, err);
            return resolve({});
          }
        })
      );
    }

    //Getting the data by invoking all promises
    return Promise.all(promisesToInvoke);
  }

  //TODO change to private after testing
  public _calculateActualDataBasedOnMindSphereData(
    beginIntervalTime: number,
    endIntervalTime: number,
    timeSeriesData: {
      [tickId: number]: {
        value: number | boolean | string | null;
      };
    }[]
  ): EnergyPoint[] {
    let energyLossesPerSubperiod = this.PowerLosses! / 60;

    let actualDataToReturn: EnergyPoint[] = [];
    let allPoints = this._getEnergyPointsTimeStamps(
      beginIntervalTime,
      endIntervalTime
    );

    if (allPoints.length < 1) return [];
    let initialCounterState: number = 0;

    for (let i = 0; i < allPoints.length; i++) {
      let pointTick = allPoints[i];
      let energyLosses = energyLossesPerSubperiod * i;
      let pointValue = energyLosses;
      let pointValid: boolean = false;

      for (let j = 0; j < this.AssetIds!.length; j++) {
        let assetObject = this.AssetIds![j];
        let assetValues = timeSeriesData[j];
        let assetPointValue = assetValues[pointTick];

        if (
          assetPointValue != null &&
          assetPointValue.value != null &&
          typeof assetPointValue.value === "number"
        ) {
          pointValue += assetPointValue.value * assetObject.multiplier;
          pointValid = true;
        } else {
          pointValid = false;
          break;
        }
      }

      if (pointValid) {
        if (i === 0) initialCounterState = pointValue;

        actualDataToReturn.push({
          tickId: pointTick,
          value: pointValue - initialCounterState,
        });
      } else if (i === 0) {
        //if there is no data for first step - data is invalid - return empty array
        return [];
      }
    }

    return actualDataToReturn;
  }

  //TODO change to private after testing
  public _calculateHistoricalPoints(
    beginIntervalTime: number,
    endIntervalTime: number,
    actualData: EnergyPoint[]
  ): EnergyPoint[] {
    return [...actualData];
  }

  //TODO change to private after testing
  public _calculatePredictedPoints(
    beginIntervalTime: number,
    endIntervalTime: number,
    actualData: EnergyPoint[]
  ): EnergyPoint[] {
    if (actualData.length < 2) return [];

    let lastEnergyStep =
      (60000 *
        (actualData[actualData.length - 1].value -
          actualData[actualData.length - 2].value)) /
      (actualData[actualData.length - 1].tickId -
        actualData[actualData.length - 2].tickId);
    let lastEnergyTickId = actualData[actualData.length - 1].tickId;
    let lastEnergyValue = actualData[actualData.length - 1].value;

    let energyPoints = this._getEnergyPointsTimeStamps(
      beginIntervalTime,
      endIntervalTime
    );

    //iterting via for loop to ensure order
    let remainingPoints = [];

    for (let i = 0; i < energyPoints.length; i++) {
      let point = energyPoints[i];
      if (point >= lastEnergyTickId) remainingPoints.push(point);
    }

    let pointsToReturn: EnergyPoint[] = [];

    for (let i = 0; i < remainingPoints.length; i++) {
      let value = lastEnergyValue + i * lastEnergyStep;
      let tickId = remainingPoints[i];

      pointsToReturn.push({
        tickId: tickId,
        value: value,
      });
    }

    return pointsToReturn;
  }

  //TODO change to private after testing
  public _getEnergyPointsTimeStamps(
    beginIntervalTime: number,
    endIntervalTime: number
  ): number[] {
    let points: number[] = [];

    let actualPoint = beginIntervalTime;
    while (actualPoint <= endIntervalTime) {
      points.push(actualPoint);
      actualPoint += 60000;
    }

    return points;
  }

  protected async _onSetStorageData(
    payload: LoadmonitoringConfig
  ): Promise<void> {
    this._enabled = payload.enabled;
    this._tenant = payload.tenant;
    this._assetIds = payload.assetIds;
    this._powerLosses = payload.powerLosses;
    this._alertLimit = payload.alertLimit;
    this._warningLimit = payload.warningLimit;
    this._mailingList = payload.mailingList;
    this._interval = payload.interval;
  }

  public async getPayloadData(): Promise<LoadmonitoringData> {
    if (!this.Initialized) throw new Error("Service not initialized!");
    return {
      initTickId: this.InitTickID,
      initialized: this.Initialized,
      lastRefreshTickId: this.LastRefreshTickID,
      warningPoints: this.WarningPoints!,
      alertPoints: this.AlertPoints!,
      historicalPoints: this.HistoricalPoints!,
      predictedPoints: this.PredictedPoints!,
      warningActive: this.WarningActive!,
      alertActive: this.AlertActive!,
      predictedConsumption: this.PredictedEnergy!,
      predictedPower: this.PredictedPower!,
    };
  }
}

export default LoadmonitoringService;

//TODO - test this class

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
import MailSender from "../MailSender/MailSender";
import webpush from "web-push";
import { readFileAsync } from "../../utilities/utilities";
import { config } from "node-config-ts";
import NotificationManager from "../NotificationManager/NotificationManager";
import { MindSphereDataStorage } from "../DataStorage/MindSphereDataStorage";

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
  mailingList: { email: string; language: "pl" | "en" }[];
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

const alertEmailContentPLPath = "emailTemplates/alertActivation_pl.html";
const alertEmailContentENPath = "emailTemplates/alertActivation_en.html";
const warningEmailContentPLPath = "emailTemplates/warningActivation_pl.html";
const warningEmailContentENPath = "emailTemplates/warningActivation_en.html";
const returnEmailContentPLPath = "emailTemplates/returnToNormalState_pl.html";
const returnEmailContentENPath = "emailTemplates/returnToNormalState_en.html";

const predictedPowerEmailPhrase = "$PREDICTED_POWER";
const actualDateEmailPhrase = "$ACTUAL_DATE";

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
  private _mailingList:
    | { email: string; language: "pl" | "en" }[]
    | null = null;
  private _interval: number | null = null;
  private _warningPoints: EnergyPoint[] = [];
  private _alertPoints: EnergyPoint[] = [];
  private _predictedPoints: EnergyPoint[] = [];
  private _historicalPoints: EnergyPoint[] = [];
  private _predictedPower: number = 0;
  private _predictedEnergy: number = 0;
  private _alertActive: boolean = false;
  private _warningActive: boolean = false;
  private _alertEmailContentPL: string | null = null;
  private _alertEmailContentEN: string | null = null;
  private _warningEmailContentPL: string | null = null;
  private _warningEmailContentEN: string | null = null;
  private _returnEmailContentPL: string | null = null;
  private _returnEmailContentEN: string | null = null;

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
    return this._alertActive;
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
    //TODO - test init email contents
    await this._initEmailContents();
  }

  private async _initEmailContents() {
    this._alertEmailContentEN = await readFileAsync(
      alertEmailContentENPath,
      "utf8"
    );
    this._alertEmailContentPL = await readFileAsync(
      alertEmailContentPLPath,
      "utf8"
    );
    this._warningEmailContentEN = await readFileAsync(
      warningEmailContentENPath,
      "utf8"
    );
    this._warningEmailContentPL = await readFileAsync(
      warningEmailContentPLPath,
      "utf8"
    );
    this._returnEmailContentEN = await readFileAsync(
      returnEmailContentENPath,
      "utf8"
    );
    this._returnEmailContentPL = await readFileAsync(
      returnEmailContentPLPath,
      "utf8"
    );
  }

  protected async _onRefresh(tickId: number): Promise<void> {
    if (this.Enabled) {
      await this._recalculate(tickId);
    } else {
      await this._disable();
    }
  }

  private async _disable() {
    this._historicalPoints = [];
    this._predictedPoints = [];
    this._alertActive = false;
    this._alertActive = false;
    this._predictedPower = 0;
    this._predictedEnergy = 0;
  }

  private async _recalculate(tickId: number) {
    let actualInterval = this._getActualTimeInterval(tickId);

    this._warningPoints = this._caclulateWarningPoints(
      actualInterval.beginTickId,
      actualInterval.endTickId
    );

    this._alertPoints = this._caclulateAlertPoints(
      actualInterval.beginTickId,
      actualInterval.endTickId
    );

    let actualData = await this._getActualData(
      actualInterval.beginTickId,
      actualInterval.endTickId
    );

    this._historicalPoints = this._calculateHistoricalPoints(
      actualInterval.beginTickId,
      actualInterval.endTickId,
      actualData
    );

    this._predictedPoints = this._calculatePredictedPoints(
      actualInterval.beginTickId,
      actualInterval.endTickId,
      actualData
    );

    let calculatedPredictedEnergy = this._calculatePredictedEnergy(
      this.HistoricalPoints,
      this.PredictedPoints
    );

    if (calculatedPredictedEnergy != null)
      this._predictedEnergy = calculatedPredictedEnergy;

    let calculatedPredictedPower = this._calculatePredictedPower(
      this.HistoricalPoints,
      this.PredictedPoints
    );

    if (calculatedPredictedPower != null)
      this._predictedPower = calculatedPredictedPower;

    await this._refreshWarningAndAlertState(tickId, this.PredictedPower);
  }

  private _getActualTimeInterval(
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

  private _caclulateAlertPoints(
    beginTickId: number,
    endTickId: number
  ): EnergyPoint[] {
    let energyPointTimeStamps = this._getEnergyPointsTimeStamps(
      beginTickId,
      endTickId
    );
    let energyStep = this.AlertLimit! / 60;

    let energyPointsToReturn: EnergyPoint[] = [];
    for (let i = 0; i < energyPointTimeStamps.length; i++) {
      let energyPointTimestamp = energyPointTimeStamps[i];

      energyPointsToReturn.push({
        tickId: energyPointTimestamp,
        value: energyStep * i,
      });
    }

    return energyPointsToReturn;
  }

  private _caclulateWarningPoints(
    beginTickId: number,
    endTickId: number
  ): EnergyPoint[] {
    let energyPointTimeStamps = this._getEnergyPointsTimeStamps(
      beginTickId,
      endTickId
    );
    let energyStep = this.WarningLimit! / 60;

    let energyPointsToReturn: EnergyPoint[] = [];
    for (let i = 0; i < energyPointTimeStamps.length; i++) {
      let energyPointTimestamp = energyPointTimeStamps[i];

      energyPointsToReturn.push({
        tickId: energyPointTimestamp,
        value: energyStep * i,
      });
    }

    return energyPointsToReturn;
  }

  private async _getActualData(
    beginTickId: number,
    endTickId: number
  ): Promise<EnergyPoint[]> {
    let mindSphereData = await this._getMindSphereData(beginTickId, endTickId);

    let actualData = this._calculateActualDataBasedOnMindSphereData(
      beginTickId,
      endTickId,
      mindSphereData
    );

    return actualData;
  }

  private async _getMindSphereData(
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

  private _calculateActualDataBasedOnMindSphereData(
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

  private _getEnergyPointsTimeStamps(
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

  private _calculateHistoricalPoints(
    beginIntervalTime: number,
    endIntervalTime: number,
    actualData: EnergyPoint[]
  ): EnergyPoint[] {
    return [...actualData];
  }

  private _calculatePredictedPoints(
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

  private _calculatePredictedEnergy(
    historicalPoints: EnergyPoint[],
    predictedPoints: EnergyPoint[]
  ): number | null {
    //returning null in order to prevent taking this values into account
    if (predictedPoints.length < 1) return null;
    if (historicalPoints.length < 1) return null;

    let consumptionIncrease =
      predictedPoints[predictedPoints.length - 1].value -
      historicalPoints[0].value;

    return consumptionIncrease;
  }

  private _calculatePredictedPower(
    historicalPoints: EnergyPoint[],
    predictedPoints: EnergyPoint[]
  ): number | null {
    //returning null in order to prevent taking this values into account
    if (predictedPoints.length < 1) return null;
    if (historicalPoints.length < 1) return null;

    let consumptionIncrease =
      predictedPoints[predictedPoints.length - 1].value -
      historicalPoints[0].value;

    let interval =
      predictedPoints[predictedPoints.length - 1].tickId -
      historicalPoints[0].tickId;

    return (60 * 60 * 1000 * consumptionIncrease) / interval;
  }

  private async _refreshWarningAndAlertState(
    tickId: number,
    predictedPower: number
  ) {
    let predictedPowerAboveAlert = predictedPower > this.AlertLimit!;
    let predictedPowerAboveWarning = predictedPower > this.WarningLimit!;

    if (predictedPowerAboveAlert) {
      //If going from warning to active - deactivating warning without notification but alert with notification
      this._warningActive = false;
      //Power above alert limit (and warning limit)
      if (!this.AlertActive) {
        this._alertActive = true;
        await this._notifyAlertActivation(tickId, predictedPower);
      }
    } else if (predictedPowerAboveWarning) {
      //Power above warning limit only

      //If going from alert to warning - activating warning without sending notificatoin
      if (this.AlertActive) {
        this._alertActive = false;
        this._warningActive = true;
      }
      //If going from normal state to warning - sending notification
      else if (!this.WarningActive) {
        this._warningActive = true;
        await this._notifyWarningActivation(tickId, predictedPower);
      }
    } else {
      //If alert is activate and warning is activate - deactivate alert with notification but warning without
      if (this.AlertActive) {
        this._warningActive = false;
        this._alertActive = false;
        await this._notifyAlertDeactivation(tickId, predictedPower);
      } else if (this.WarningActive) {
        //If only warning is active - deactivate warning with notification
        this._warningActive = false;
        await this._notifyWarningDeactivation(tickId, predictedPower);
      }
    }
  }

  private async _notifyAlertActivation(tickId: number, predictedPower: number) {
    try {
      await this._sendEmails(tickId, predictedPower, "alert");
    } catch (err) {
      logger.error(err.message, err);
    }
    try {
      await this._sendNotifications(tickId, predictedPower, "alert");
    } catch (err) {
      logger.error(err.message, err);
    }
  }

  private async _notifyAlertDeactivation(
    tickId: number,
    predictedPower: number
  ) {
    try {
      await this._sendEmails(tickId, predictedPower, "returning");
    } catch (err) {
      logger.error(err.message, err);
    }
    try {
      await this._sendNotifications(tickId, predictedPower, "returning");
    } catch (err) {
      logger.error(err.message, err);
    }
  }

  private async _notifyWarningActivation(
    tickId: number,
    predictedPower: number
  ) {
    try {
      await this._sendEmails(tickId, predictedPower, "warning");
    } catch (err) {
      logger.error(err.message, err);
    }
    try {
      await this._sendNotifications(tickId, predictedPower, "warning");
    } catch (err) {
      logger.error(err.message, err);
    }
  }

  private async _notifyWarningDeactivation(
    tickId: number,
    predictedPower: number
  ) {
    try {
      await this._sendEmails(tickId, predictedPower, "returning");
    } catch (err) {
      logger.error(err.message, err);
    }
    try {
      await this._sendNotifications(tickId, predictedPower, "returning");
    } catch (err) {
      logger.error(err.message, err);
    }
  }

  private async _sendEmails(
    tickId: number,
    predictedPower: number,
    severity: "warning" | "alert" | "returning"
  ) {
    let self = this;
    let promisesToInvoke: Promise<boolean>[] = [];

    for (let recipient of this.MailingList!) {
      promisesToInvoke.push(
        new Promise(async (resolve, reject) => {
          //Ensuring that sending email will not throw in case of sending data to a recipient throws
          try {
            let emailContent = self._getEmailContent(
              recipient.language,
              severity,
              predictedPower,
              tickId
            );
            await MailSender.getInstance().sendEmail(
              recipient.email,
              emailContent.subject,
              emailContent.content
            );
            return resolve(true);
          } catch (err) {
            logger.error(err.message, err);
            return resolve(false);
          }
        })
      );
    }

    await Promise.all(promisesToInvoke);
  }

  private _getEmailContent(
    lanugage: "en" | "pl",
    severity: "alert" | "warning" | "returning",
    predictedPower: number,
    tickId: number
  ): { subject: string; content: string } {
    let powerText = predictedPower.toFixed(2);
    let dateText = new Date(
      Sampler.convertTickNumberToDate(tickId)
    ).toISOString();

    switch (lanugage) {
      case "en": {
        let subject: string;
        let content: string;

        switch (severity) {
          case "alert": {
            subject = `Alert! - Incoming power exceeding: ${powerText}`;
            content = this._alertEmailContentEN!.replace(
              predictedPowerEmailPhrase,
              powerText
            ).replace(actualDateEmailPhrase, dateText);
            break;
          }

          case "warning": {
            subject = `Warning! - Predicted power above warning limit: ${powerText}`;
            content = this._warningEmailContentEN!.replace(
              predictedPowerEmailPhrase,
              powerText
            ).replace(actualDateEmailPhrase, dateText);
            break;
          }

          case "returning": {
            subject = `Information! - Predicted power below limits: ${powerText}`;
            content = this._returnEmailContentEN!.replace(
              predictedPowerEmailPhrase,
              powerText
            ).replace(actualDateEmailPhrase, dateText);
            break;
          }

          default:
            throw new Error("Severity not recognized!");
        }

        return {
          subject,
          content,
        };
      }
      case "pl": {
        let subject: string;
        let content: string;

        switch (severity) {
          case "alert": {
            subject = `Alarm! - Przewidywane przekrocznie mocy!: ${powerText}`;
            content = this._alertEmailContentPL!.replace(
              predictedPowerEmailPhrase,
              powerText
            ).replace(actualDateEmailPhrase, dateText);
            break;
          }

          case "warning": {
            subject = `Ostrzeżenie! - Przewidywana moc ponad progiem ostrzeżenia: ${powerText}`;
            content = this._warningEmailContentPL!.replace(
              predictedPowerEmailPhrase,
              powerText
            ).replace(actualDateEmailPhrase, dateText);
            break;
          }

          case "returning": {
            subject = `Informacja! - Przewidywana moc poniżej progów ostrzeżeniowych: ${powerText}`;
            content = this._returnEmailContentPL!.replace(
              predictedPowerEmailPhrase,
              powerText
            ).replace(actualDateEmailPhrase, dateText);
            break;
          }

          default:
            throw new Error("Severity not recognized!");
        }

        return {
          subject,
          content,
        };
      }
      default:
        throw new Error("Language not recognized!");
    }
  }

  private async _sendNotifications(
    tickId: number,
    predictedPower: number,
    severity: "warning" | "alert" | "returning"
  ) {
    let self = this;
    let promisesToInvoke: Promise<boolean>[] = [];

    let allSubscribers = await NotificationManager.getInstance().getSubscribers(
      this.ID
    );

    //If there are no subscribers there is no point to continue
    if (allSubscribers == null) return;

    for (let subscriber of allSubscribers) {
      promisesToInvoke.push(
        new Promise(async (resolve, reject) => {
          //Ensuring that sending email will not throw in case of sending data to a recipient throws
          try {
            let notificationContent = self._getNotificationContent(
              subscriber.language,
              severity,
              predictedPower,
              tickId
            );
            await NotificationManager.getInstance().sendNotification(
              subscriber.subscriptionData,
              JSON.stringify(notificationContent)
            );
            return resolve(true);
          } catch (err) {
            logger.error(err.message, err);
            return resolve(false);
          }
        })
      );
    }

    await Promise.all(promisesToInvoke);
  }

  private _getNotificationContent(
    lanugage: "en" | "pl",
    severity: "alert" | "warning" | "returning",
    predictedPower: number,
    tickId: number
  ): { title: string; body: string; icon: string } {
    let powerText = predictedPower.toFixed(2);
    let dateText = new Date(
      Sampler.convertTickNumberToDate(tickId)
    ).toISOString();

    switch (lanugage) {
      case "en": {
        let content: { title: string; body: string; icon: string };

        switch (severity) {
          case "alert": {
            content = {
              title: "Loadmonitoring alert!",
              body: `Incoming power exceeding: ${powerText} kW`,
              icon: config.notificationSending.alertIcon,
            };
            break;
          }

          case "warning": {
            content = {
              title: "Loadmonitoring warning!",
              body: `Predicted power above warning limit: ${powerText} kW`,
              icon: config.notificationSending.warningIcon,
            };

            break;
          }

          case "returning": {
            content = {
              title: "Loadmonitoring info!",
              body: `redicted power below limits again: ${powerText} kW`,
              icon: config.notificationSending.infoIcon,
            };
            break;
          }

          default:
            throw new Error("Severity not recognized!");
        }

        return content;
      }
      case "pl": {
        let content: { title: string; body: string; icon: string };

        switch (severity) {
          case "alert": {
            content = {
              title: "Strażnik mocy - alarm!",
              body: `Nadchodzące przekroczenie mocy: ${powerText} kW`,
              icon: config.notificationSending.alertIcon,
            };
            break;
          }

          case "warning": {
            content = {
              title: "Strażnik mocy - ostrzeżenie!",
              body: `Przewidywana moc ponad progiem ostrzeżenia: ${powerText} kW`,
              icon: config.notificationSending.warningIcon,
            };

            break;
          }

          case "returning": {
            content = {
              title: "Strażnik mocy - info!",
              body: `Powrót mocy ponizej progów alarmowych: ${powerText} kW`,
              icon: config.notificationSending.infoIcon,
            };
            break;
          }

          default:
            throw new Error("Severity not recognized!");
        }

        return content;
      }
      default:
        throw new Error("Language not recognized!");
    }
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

import { MindSphereService } from "./MindSphereService";

const mindSphereTimeSeriesApiUrl = `https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries`;

export type MindSphereTimeSeriesData = {
  _time: string;
  [key: string]: boolean | number | string | null;
};

export type TimeSeriesData = {
  [key: string]: {
    [key: number]: {
      value: number | boolean | string | null;
      qc?: number;
    };
  };
};

/**
 * @description Class for representing MindSphere service for storing time-series data
 */
export class MindSphereTimeSeriesService extends MindSphereService {
  /**
   * @description Main instance of Singleton
   */
  private static _instance: MindSphereTimeSeriesService | null = null;

  /**
   * @description Method for getting (or creating if not exists) main instance of Singleton
   */
  public static getInstance(): MindSphereTimeSeriesService {
    if (MindSphereTimeSeriesService._instance == null) {
      MindSphereTimeSeriesService._instance = new MindSphereTimeSeriesService(
        mindSphereTimeSeriesApiUrl
      );
    }

    return MindSphereTimeSeriesService._instance;
  }

  /**
   * @description Class for representing MindSphere service for storing time-series data
   * @param url URL for getting time-series data from
   */
  private constructor(url: string) {
    super(url);
  }

  /**
   * @description Method for checking if field is a field for QC code
   * @param property field name to check
   */
  public static checkIfPropertyIsQC(property: string) {
    return property.includes("_qc");
  }

  /**
   * @description Method for getting real name of property based on name with QC code
   * @param property field name with QC code
   */
  public static getPropertyNameFromQCProperty(property: string) {
    return property.replace("_qc", "");
  }

  /**
   * @description Method for getting the name of QC Property field based on normal property name
   * @param property
   */
  public static getQCPropertyFromPropertyName(property: string) {
    return `${property}_qc`;
  }

  /**
   * @description Method for getting TimeSeriesValue based on MindSphere time series response. Works on both - last values without qc or normal values with qc
   * @param data Array of values - EACH ELEMENT HAS TO HAVE DIFFERNET VARIABLE NAMES OR _time
   */
  public static convertMindSphereTimeSeriesToTimeSeriesData(
    data: MindSphereTimeSeriesData[] | MindSphereTimeSeriesData
  ) {
    //{ variableName1: { time1: { value: value1, qc: qc1 },time2: { value: value2, qc: qc2 }} }
    let objectToReturn: TimeSeriesData = {};
    //For normal API - data is not an array, so it is neccessary to create array with one element from it
    if (!Array.isArray(data)) data = [data];

    //Normal values are like (one element with timestamp and qc for each variable):
    //  [{ _time:ISOStringDate, var1Name: value1, var1Name_qc:QCNumber1, var2Name: value2, var2Name_qc:QCNumber2, ...}]
    //Values of lastValues are (seperate elements grouped by timestamp without qc):
    //  [ { _time:ISOStringDate1, var1Name: value1 , var2Name: value2 } , { _time:ISOStringDate2 , var3Name: value3 }]
    for (let raw of data) {
      //Every element has to have a _time property - if not it should not be taken into account
      if (raw._time != null) {
        //Converting time to UNIX format
        let convertedTime = MindSphereService.convertMindSphereDateToUnix(
          raw._time
        );

        //{ variableName1: qc1,variableName2: qc2,... }
        let qualityCodesToAdd: {
          [key: string]: number;
        } = {};

        //For every property - if it is not qc property or _time create seperate object with value and time in objectToReturn
        for (let property of Object.keys(raw)) {
          if (property !== "_time") {
            if (MindSphereTimeSeriesService.checkIfPropertyIsQC(property)) {
              //qc property - assigning it to qc to add
              qualityCodesToAdd[property] = raw[property] as number;
            } else {
              //Normal property - assign it
              if (objectToReturn[property] == null) {
                objectToReturn[property] = {
                  [convertedTime]: { value: raw[property] },
                };
              } else {
                objectToReturn[property][convertedTime] = {
                  value: raw[property],
                };
              }
            }
          }
        }

        //Adding qc to objectToReturn - if they exists
        for (let qcProperty of Object.keys(qualityCodesToAdd)) {
          //Getting real property name based on qc property name
          let realProperty = MindSphereTimeSeriesService.getPropertyNameFromQCProperty(
            qcProperty
          );

          //Assigning qc to property element - if it exists
          if (
            objectToReturn[realProperty] != null &&
            objectToReturn[realProperty][convertedTime] != null
          )
            objectToReturn[realProperty][convertedTime].qc =
              qualityCodesToAdd[qcProperty];
        }
      }
    }

    return objectToReturn;
  }

  /**
   * @description Method for converting TimeSeriesData to MindSphere standard
   * @param timeSeriesData Time series data to convert
   */
  public static convertTimeSeriesDataToMindSphereTimeSeries(
    timeSeriesData: TimeSeriesData
  ) {
    let dataGroupedByTime: { [key: string]: MindSphereTimeSeriesData } = {};

    for (let variableName of Object.keys(timeSeriesData)) {
      for (let time of Object.keys(timeSeriesData[variableName])) {
        let numberTime = +time;
        let mindSphereTime = MindSphereService.convertUnixToMindSphereDate(
          numberTime
        );
        if (dataGroupedByTime[mindSphereTime] == null) {
          dataGroupedByTime[mindSphereTime] = {
            _time: mindSphereTime,
            [variableName]: timeSeriesData[variableName][numberTime].value,
          };
        } else {
          dataGroupedByTime[mindSphereTime][variableName] =
            timeSeriesData[variableName][numberTime].value;
        }

        //appending qc if exists
        if (timeSeriesData[variableName][numberTime].qc != null) {
          dataGroupedByTime[mindSphereTime][
            MindSphereTimeSeriesService.getQCPropertyFromPropertyName(
              variableName
            )
          ] = timeSeriesData[variableName][numberTime].qc!;
        }
      }
    }
    return Object.values(dataGroupedByTime);
  }

  /**
   * Method for getting time series url to get data of given aspect
   * @param assetId id of asset that stores the aspect
   * @param aspectName name of aspect to get
   */
  private _getTimeSeriesUrl(assetId: string, aspectName: string) {
    return encodeURI(`${this._url}/${assetId}/${aspectName}`);
  }

  /**
   * @description Method for getting last values of given aspect (event if theirs timestamp is different)
   * @param assetId asset id to get data from
   * @param aspectName aspect name to get data from
   */
  public async getLastValues(assetId: string, aspectName: string) {
    let result = await this._callAPI(
      "GET",
      this._getTimeSeriesUrl(assetId, aspectName),
      { latestValue: true }
    );

    if (!Array.isArray(result.data))
      throw new Error("Invalid reponse data - should be na array");

    return MindSphereTimeSeriesService.convertMindSphereTimeSeriesToTimeSeriesData(
      result.data
    );
  }

  /**
   * @description Method for getting time-series data. NOTICE! Works event for huge intervals - calls API several times in order to retrieves all data without any limit. Beware of time for long intervals
   * @param assetId Id of asset to get
   * @param aspectName Name of aspect to get
   * @param fromUnixDate Date (in Unix) of start of the interval
   * @param toUnixDate Date (in Unix) of end of the interval
   */
  public async getValues(
    assetId: string,
    aspectName: string,
    fromUnixDate: number,
    toUnixDate: number
  ) {
    let results = await this._callLinkedAPI(
      "GET",
      this._getTimeSeriesUrl(assetId, aspectName),
      {
        from: MindSphereService.convertUnixToMindSphereDate(fromUnixDate),
        to: MindSphereService.convertUnixToMindSphereDate(toUnixDate),
        limit: 2000,
      }
    );
    let allData: MindSphereTimeSeriesData[] = [];

    for (let result of results) {
      if (result != null && Array.isArray(result)) {
        allData.push(...result);
      }
    }

    return MindSphereTimeSeriesService.convertMindSphereTimeSeriesToTimeSeriesData(
      allData
    );
  }

  /**
   * @description Method for setting timeseries data to MindSphere
   * @param assetId id of asset to set data
   * @param aspectName name of aspect to set data into
   * @param dataToSet data to set into the aspect
   */
  public async setValues(
    assetId: string,
    aspectName: string,
    dataToSet: TimeSeriesData
  ) {
    let dataToPut = MindSphereTimeSeriesService.convertTimeSeriesDataToMindSphereTimeSeries(
      dataToSet
    );
    if (dataToPut.length < 1) return;

    await this._callAPI(
      "PUT",
      this._getTimeSeriesUrl(assetId, aspectName),
      {},
      dataToPut
    );
  }

  /**
   * @description Method for deleting the values. NOTICE beware that there is a limit in MindSphere for one call of such method a day
   * @param assetId asset to delete data from
   * @param aspectName aspect name
   * @param fromUnixDate unix date to delete data from
   * @param toUnixDate unix date of the end of deleting interval
   */
  public async deleteValues(
    assetId: string,
    aspectName: string,
    fromUnixDate: number,
    toUnixDate: number
  ) {
    await this._callAPI("DELETE", this._getTimeSeriesUrl(assetId, aspectName), {
      from: MindSphereService.convertUnixToMindSphereDate(fromUnixDate),
      to: MindSphereService.convertUnixToMindSphereDate(toUnixDate),
    });
  }
}

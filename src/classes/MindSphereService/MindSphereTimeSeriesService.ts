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

export class MindSphereTimeSeriesService extends MindSphereService {
  private static _instance: MindSphereTimeSeriesService | null = null;

  public static getInstance(): MindSphereTimeSeriesService {
    if (MindSphereTimeSeriesService._instance == null) {
      MindSphereTimeSeriesService._instance = new MindSphereTimeSeriesService(
        mindSphereTimeSeriesApiUrl
      );
    }

    return MindSphereTimeSeriesService._instance;
  }

  private constructor(url: string) {
    super(url);
  }

  public static checkIfPropertyIsQC(property: string) {
    return property.includes("_qc");
  }

  public static getPropertyNameFromQCProperty(property: string) {
    return property.replace("_qc", "");
  }

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

  private _getTimeSeriesUrl(assetId: string, aspectName: string) {
    return encodeURI(`${this._url}/${assetId}/${aspectName}`);
  }

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

  public async getValues(
    assetId: string,
    aspectName: string,
    fromUnixDate: number,
    toUnixDate: number,
    limit: number = 2000
  ) {
    let result = await this._callAPI(
      "GET",
      this._getTimeSeriesUrl(assetId, aspectName),
      {
        from: MindSphereService.convertUnixToMindSphereDate(fromUnixDate),
        to: MindSphereService.convertUnixToMindSphereDate(toUnixDate),
        limit: limit,
      }
    );

    if (!Array.isArray(result.data))
      throw new Error("Invalid reponse data - should be na array");

    return MindSphereTimeSeriesService.convertMindSphereTimeSeriesToTimeSeriesData(
      result.data
    );
  }

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

export default MindSphereTimeSeriesService;

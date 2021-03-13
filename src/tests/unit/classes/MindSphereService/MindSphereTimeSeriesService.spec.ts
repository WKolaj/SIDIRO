import { MindSphereTokenManager } from "../../../../classes/MindSphereService/MindSphereToken/MindSphereTokenManager";
import axios from "axios";
import {
  MindSphereTimeSeriesService,
  MindSphereTimeSeriesData,
  TimeSeriesData,
} from "../../../../classes/MindSphereService/MindSphereTimeSeriesService";
import MockDate from "mockdate";
import { testPrivateProperty } from "../../../utilities/utilities";
import { encodeBase64 } from "../../../../utilities/utilities";

let mockedAxios = axios as any;

describe("MindSphereTimeSeriesService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    //Reseting static class
    (MindSphereTokenManager as any)._instances = {};
    (MindSphereTimeSeriesService as any)._instance = null;

    //Reseting axios
    mockedAxios.__reset();
  });

  afterEach(() => {
    jest.clearAllMocks();

    //Reseting static class
    (MindSphereTokenManager as any)._instances = {};
    (MindSphereTimeSeriesService as any)._instance = null;

    //Reseting axios
    mockedAxios.__reset();
  });

  describe("getInstance", () => {
    let tenantName: string;

    let exec = () => {
      return MindSphereTimeSeriesService.getInstance();
    };

    it("should return valid instance of MindSphereTimeSeriesService", () => {
      let result = exec();

      expect(result).not.toEqual(null);
      expect(result instanceof MindSphereTimeSeriesService).toEqual(true);
    });

    it("should return the same instance of MindSphereTimeSeriesService if called several times", () => {
      let result1 = exec();
      let result2 = exec();
      let result3 = exec();

      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
      expect(result3).toEqual(result1);
    });

    it("should properly set main url of MindSphere timeseries API", () => {
      let result = exec();

      testPrivateProperty(
        result,
        "_url",
        `https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries`
      );
    });
  });

  describe("checkIfPropertyIsQC", () => {
    let propertyName: string;

    beforeEach(() => {
      propertyName = "testProperty1234_qc";
    });

    let exec = () => {
      return MindSphereTimeSeriesService.checkIfPropertyIsQC(propertyName);
    };

    it("should return true if property name includes _qc", () => {
      propertyName = "testProperty1234_qc";

      let result = exec();

      expect(result).toEqual(true);
    });

    it("should return false if property name does not include _qc", () => {
      propertyName = "testProperty1234";

      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if property name is an empty string", () => {
      propertyName = "";

      let result = exec();

      expect(result).toEqual(false);
    });
  });

  describe("getPropertyNameFromQCProperty", () => {
    let propertyName: string;

    beforeEach(() => {
      propertyName = "testProperty1234_qc";
    });

    let exec = () => {
      return MindSphereTimeSeriesService.getPropertyNameFromQCProperty(
        propertyName
      );
    };

    it("should return property name without _qc - if property name is qc property", () => {
      propertyName = "testProperty1234_qc";

      let result = exec();

      expect(result).toEqual("testProperty1234");
    });

    it("should return property name  - if property name is a normal property name", () => {
      propertyName = "testProperty4321";

      let result = exec();

      expect(result).toEqual("testProperty4321");
    });
  });

  describe("getQCPropertyFromPropertyName", () => {
    let propertyName: string;

    beforeEach(() => {
      propertyName = "testProperty1234";
    });

    let exec = () => {
      return MindSphereTimeSeriesService.getQCPropertyFromPropertyName(
        propertyName
      );
    };

    it("should return property name without _qc - if property name is qc property", () => {
      propertyName = "testProperty1234";

      let result = exec();

      expect(result).toEqual("testProperty1234_qc");
    });
  });

  describe("convertMindSphereTimeSeriesToTimeSeriesData", () => {
    let dataFromMindSphere: any;

    beforeEach(() => {
      dataFromMindSphere = [
        {
          _time: "2021-01-31T13:00:00Z",
          variable1: 1001,
          variable1_qc: 1,
          variable2: 2001,
          variable2_qc: 2,
          variable3: 3001,
          variable3_qc: 3,
        },
        {
          _time: "2021-01-31T13:00:01Z",
          variable1: 1002,
          variable1_qc: 1,
          variable2: 2002,
          variable2_qc: 2,
          variable3: 3002,
          variable3_qc: 3,
        },
        {
          _time: "2021-01-31T13:00:02Z",
          variable1: 1003,
          variable1_qc: 1,
          variable2: 2003,
          variable2_qc: 2,
          variable3: 3003,
          variable3_qc: 3,
        },
      ];
    });

    let exec = () => {
      return MindSphereTimeSeriesService.convertMindSphereTimeSeriesToTimeSeriesData(
        dataFromMindSphere
      );
    };

    it("should convert MindSphere timeseries values to TimeSeriesData format", () => {
      let result = exec();

      let expectedResult: TimeSeriesData = {
        variable1: {
          1612098000000: { value: 1001, qc: 1 },
          1612098001000: { value: 1002, qc: 1 },
          1612098002000: { value: 1003, qc: 1 },
        },
        variable2: {
          1612098000000: { value: 2001, qc: 2 },
          1612098001000: { value: 2002, qc: 2 },
          1612098002000: { value: 2003, qc: 2 },
        },
        variable3: {
          1612098000000: { value: 3001, qc: 3 },
          1612098001000: { value: 3002, qc: 3 },
          1612098002000: { value: 3003, qc: 3 },
        },
      };

      expect(result).toEqual(expectedResult);
    });

    it("should convert MindSphere timeseries values to TimeSeriesData format - if there is no qc in some samples", () => {
      dataFromMindSphere = [
        {
          _time: "2021-01-31T13:00:00Z",
          variable1: 1001,
          variable1_qc: 1,
          variable2: 2001,
          variable3: 3001,
          variable3_qc: 3,
        },
        {
          _time: "2021-01-31T13:00:01Z",
          variable1: 1002,
          variable1_qc: 1,
          variable2: 2002,
          variable3: 3002,
          variable3_qc: 3,
        },
        {
          _time: "2021-01-31T13:00:02Z",
          variable1: 1003,
          variable1_qc: 1,
          variable2: 2003,
          variable3: 3003,
          variable3_qc: 3,
        },
      ];

      let result = exec();

      let expectedResult: TimeSeriesData = {
        variable1: {
          1612098000000: { value: 1001, qc: 1 },
          1612098001000: { value: 1002, qc: 1 },
          1612098002000: { value: 1003, qc: 1 },
        },
        variable2: {
          1612098000000: { value: 2001 },
          1612098001000: { value: 2002 },
          1612098002000: { value: 2003 },
        },
        variable3: {
          1612098000000: { value: 3001, qc: 3 },
          1612098001000: { value: 3002, qc: 3 },
          1612098002000: { value: 3003, qc: 3 },
        },
      };

      expect(result).toEqual(expectedResult);
    });

    it("should convert MindSphere timeseries values to TimeSeriesData format - if some values are null", () => {
      dataFromMindSphere = [
        {
          _time: "2021-01-31T13:00:00Z",
          variable1: 1001,
          variable1_qc: 1,
          variable2: null,
          variable2_qc: 2,
          variable3: 3001,
          variable3_qc: 3,
        },
        {
          _time: "2021-01-31T13:00:01Z",
          variable1: 1002,
          variable1_qc: 1,
          variable2: null,
          variable2_qc: 2,
          variable3: 3002,
          variable3_qc: 3,
        },
        {
          _time: "2021-01-31T13:00:02Z",
          variable1: 1003,
          variable1_qc: 1,
          variable2: null,
          variable2_qc: 2,
          variable3: 3003,
          variable3_qc: 3,
        },
      ];

      let result = exec();

      let expectedResult: TimeSeriesData = {
        variable1: {
          1612098000000: { value: 1001, qc: 1 },
          1612098001000: { value: 1002, qc: 1 },
          1612098002000: { value: 1003, qc: 1 },
        },
        variable2: {
          1612098000000: { value: null, qc: 2 },
          1612098001000: { value: null, qc: 2 },
          1612098002000: { value: null, qc: 2 },
        },
        variable3: {
          1612098000000: { value: 3001, qc: 3 },
          1612098001000: { value: 3002, qc: 3 },
          1612098002000: { value: 3003, qc: 3 },
        },
      };

      expect(result).toEqual(expectedResult);
    });

    it("should convert MindSphere timeseries values to TimeSeriesData format - if instead of array of data, a single sample is given", () => {
      dataFromMindSphere = {
        _time: "2021-01-31T13:00:00Z",
        variable1: 1001,
        variable1_qc: 1,
        variable2: 2001,
        variable2_qc: 2,
        variable3: 3001,
        variable3_qc: 3,
      };

      let result = exec();

      let expectedResult: TimeSeriesData = {
        variable1: {
          1612098000000: { value: 1001, qc: 1 },
        },
        variable2: {
          1612098000000: { value: 2001, qc: 2 },
        },
        variable3: {
          1612098000000: { value: 3001, qc: 3 },
        },
      };

      expect(result).toEqual(expectedResult);
    });

    it("should return empty object if data is an empty array", () => {
      dataFromMindSphere = [];

      let result = exec();

      let expectedResult: TimeSeriesData = {};

      expect(result).toEqual(expectedResult);
    });

    it("should return empty object if data is an empty object", () => {
      dataFromMindSphere = {};

      let result = exec();

      let expectedResult: TimeSeriesData = {};

      expect(result).toEqual(expectedResult);
    });

    it("should not add values with timestamp equal to null or undefined", () => {
      dataFromMindSphere = [
        {
          variable1: 1001,
          variable1_qc: 1,
          variable2: 2001,
          variable2_qc: 2,
          variable3: 3001,
          variable3_qc: 3,
        },
        {
          _time: "2021-01-31T13:00:01Z",
          variable1: 1002,
          variable1_qc: 1,
          variable2: 2002,
          variable2_qc: 2,
          variable3: 3002,
          variable3_qc: 3,
        },
        {
          _time: null,
          variable1: 1003,
          variable1_qc: 1,
          variable2: 2003,
          variable2_qc: 2,
          variable3: 3003,
          variable3_qc: 3,
        },
      ];

      let result = exec();

      let expectedResult: TimeSeriesData = {
        variable1: {
          1612098001000: { value: 1002, qc: 1 },
        },
        variable2: {
          1612098001000: { value: 2002, qc: 2 },
        },
        variable3: {
          1612098001000: { value: 3002, qc: 3 },
        },
      };

      expect(result).toEqual(expectedResult);
    });

    it("should not add values with qc code property - if normal property does not exist", () => {
      dataFromMindSphere = [
        {
          _time: "2021-01-31T13:00:00Z",
          variable1: 1001,
          variable1_qc: 1,
          variable2: 2001,
          variable2_qc: 2,
          variable3: 3001,
          variable3_qc: 3,
        },
        {
          _time: "2021-01-31T13:00:01Z",
          variable1: 1002,
          variable1_qc: 1,
          variable2_qc: 2,
          variable3: 3002,
          variable3_qc: 3,
        },
        {
          _time: "2021-01-31T13:00:02Z",
          variable1: 1003,
          variable1_qc: 1,
          variable2: 2003,
          variable2_qc: 2,
          variable3: 3003,
          variable3_qc: 3,
        },
      ];

      let result = exec();

      let expectedResult: TimeSeriesData = {
        variable1: {
          1612098000000: { value: 1001, qc: 1 },
          1612098001000: { value: 1002, qc: 1 },
          1612098002000: { value: 1003, qc: 1 },
        },
        variable2: {
          1612098000000: { value: 2001, qc: 2 },
          1612098002000: { value: 2003, qc: 2 },
        },
        variable3: {
          1612098000000: { value: 3001, qc: 3 },
          1612098001000: { value: 3002, qc: 3 },
          1612098002000: { value: 3003, qc: 3 },
        },
      };

      expect(result).toEqual(expectedResult);
    });
  });

  describe("convertTimeSeriesDataToMindSphereTimeSeries", () => {
    let timeSeriesData: TimeSeriesData;

    beforeEach(() => {
      timeSeriesData = {
        variable1: {
          1612098000000: { value: 1001, qc: 1 },
          1612098001000: { value: 1002, qc: 1 },
          1612098002000: { value: 1003, qc: 1 },
        },
        variable2: {
          1612098000000: { value: 2001, qc: 2 },
          1612098001000: { value: 2002, qc: 2 },
          1612098002000: { value: 2003, qc: 2 },
        },
        variable3: {
          1612098000000: { value: 3001, qc: 3 },
          1612098001000: { value: 3002, qc: 3 },
          1612098002000: { value: 3003, qc: 3 },
        },
      };
    });

    let exec = () => {
      return MindSphereTimeSeriesService.convertTimeSeriesDataToMindSphereTimeSeries(
        timeSeriesData
      );
    };

    it("should convert timeSeriesData to MindSphereTimeSeries", () => {
      let result = exec();

      let expectedResult: MindSphereTimeSeriesData[] = [
        {
          _time: "2021-01-31T13:00:00.000Z",
          variable1: 1001,
          variable1_qc: 1,
          variable2: 2001,
          variable2_qc: 2,
          variable3: 3001,
          variable3_qc: 3,
        },
        {
          _time: "2021-01-31T13:00:01.000Z",
          variable1: 1002,
          variable1_qc: 1,
          variable2: 2002,
          variable2_qc: 2,
          variable3: 3002,
          variable3_qc: 3,
        },
        {
          _time: "2021-01-31T13:00:02.000Z",
          variable1: 1003,
          variable1_qc: 1,
          variable2: 2003,
          variable2_qc: 2,
          variable3: 3003,
          variable3_qc: 3,
        },
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should convert timeSeriesData to MindSphereTimeSeries - even if qc is undefined", () => {
      timeSeriesData = {
        variable1: {
          1612098000000: { value: 1001, qc: 1 },
          1612098001000: { value: 1002, qc: 1 },
          1612098002000: { value: 1003, qc: 1 },
        },
        variable2: {
          1612098000000: { value: 2001, qc: 2 },
          1612098001000: { value: 2002 },
          1612098002000: { value: 2003, qc: 2 },
        },
        variable3: {
          1612098000000: { value: 3001, qc: 3 },
          1612098001000: { value: 3002, qc: 3 },
          1612098002000: { value: 3003, qc: 3 },
        },
      };

      let result = exec();

      let expectedResult: MindSphereTimeSeriesData[] = [
        {
          _time: "2021-01-31T13:00:00.000Z",
          variable1: 1001,
          variable1_qc: 1,
          variable2: 2001,
          variable2_qc: 2,
          variable3: 3001,
          variable3_qc: 3,
        },
        {
          _time: "2021-01-31T13:00:01.000Z",
          variable1: 1002,
          variable1_qc: 1,
          variable2: 2002,
          variable3: 3002,
          variable3_qc: 3,
        },
        {
          _time: "2021-01-31T13:00:02.000Z",
          variable1: 1003,
          variable1_qc: 1,
          variable2: 2003,
          variable2_qc: 2,
          variable3: 3003,
          variable3_qc: 3,
        },
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should convert timeSeriesData to MindSphereTimeSeries - if there are different timestamps for different variables", () => {
      timeSeriesData = {
        variable1: {
          1612098000000: { value: 1001, qc: 1 },
        },
        variable2: {
          1612098001000: { value: 2002, qc: 2 },
        },
        variable3: {
          1612098002000: { value: 3003, qc: 3 },
        },
      };

      let result = exec();

      let expectedResult: MindSphereTimeSeriesData[] = [
        {
          _time: "2021-01-31T13:00:00.000Z",
          variable1: 1001,
          variable1_qc: 1,
        },
        {
          _time: "2021-01-31T13:00:01.000Z",
          variable2: 2002,
          variable2_qc: 2,
        },
        {
          _time: "2021-01-31T13:00:02.000Z",
          variable3: 3003,
          variable3_qc: 3,
        },
      ];

      expect(result).toEqual(expectedResult);
    });

    it("should return empty array - if data is an empty object", () => {
      timeSeriesData = {};

      let result = exec();

      let expectedResult: MindSphereTimeSeriesData[] = [];

      expect(result).toEqual(expectedResult);
    });
  });

  describe("getLastValues", () => {
    let tenantName: string;
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereTimeSeriesService: MindSphereTimeSeriesService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let assetId: string;
    let aspectName: string;

    beforeEach(() => {
      //"2021-01-31T12:58:00.000Z" - 1612097880000
      //"2021-01-31T12:59:00.000Z" - 1612097940000
      //"2021-01-31T13:00:00.000Z" - 1612098000000
      //"2021-02-01T13:00:00.000Z" - 1612184400000
      mockedReturnDataCollection = [
        [
          {
            _time: "2021-01-31T12:58:00Z",
            variable1: 1001,
          },
          {
            _time: "2021-01-31T12:59:00Z",
            variable2: 2002,
            variable3: 3002,
          },
        ],
      ];
      mockedReturnStatusCollection = [200];
      mockedReturnHeadersCollection = [{}];
      mockedAuthToken = "testAuthToken1234";
      mockedAuthTokenElapsedTime = 1612184400000;
      mockedNow = 1612098000000;

      assetId = "testAssetId";
      aspectName = "testAspectName";
      tenantName = "testTenantName";
    });

    let exec = async () => {
      //Mocking Token Manager
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance(
        tenantName
      ) as any;
      mockedMindSphereTokenManager._token = mockedAuthToken;
      mockedMindSphereTokenManager._tokenExpireUnixDate = mockedAuthTokenElapsedTime;

      //Getting instance of time series service
      mindSphereTimeSeriesService = MindSphereTimeSeriesService.getInstance();

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereTimeSeriesService.getLastValues(
        tenantName,
        assetId,
        aspectName
      );
    };

    it("should call MindSphere time series API, get the data, convert it and return", async () => {
      let result = await exec();

      //Checking result
      let expectedResult: TimeSeriesData = {
        variable1: { 1612097880000: { value: 1001 } },
        variable2: { 1612097940000: { value: 2002 } },
        variable3: { 1612097940000: { value: 3002 } },
      };

      expect(result).toEqual(expectedResult);

      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/${assetId}/${aspectName}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          latestValue: true,
        },
      });
    });

    it("should call and return empty object - if timeseries data returned from MindSphere is an empty array", async () => {
      mockedReturnDataCollection = [[]];

      let result = await exec();

      //Checking result
      let expectedResult: TimeSeriesData = {};

      expect(result).toEqual(expectedResult);

      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/${assetId}/${aspectName}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          latestValue: true,
        },
      });
    });

    it("should fetch token first - if token has not been fetched before and than get the data, convert it and return", async () => {
      mockedAuthToken = null;
      mockedAuthTokenElapsedTime = null;

      //Setting token to return first time
      //token timestamp - "2021-01-31T12:58:00.000Z" - 1612097880000
      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //expires in "2021-01-31T13:31:18.766Z" 1612097880000 + 2000*1000-1234 = 1612099878766
      mockedNow = 1612098000000;
      //First axios call - fetch token, second get data
      mockedReturnDataCollection = [
        {
          access_token: "testAccessToken2",
          timestamp: 1612097880000,
          expires_in: 2000,
        },
        [
          {
            _time: "2021-01-31T12:58:00Z",
            variable1: 1001,
          },
          {
            _time: "2021-01-31T12:59:00Z",
            variable2: 2002,
            variable3: 3002,
          },
        ],
      ];

      mockedReturnStatusCollection = [200, 200];

      let result = await exec();

      //CHECKING RESULT
      let expectedResult: TimeSeriesData = {
        variable1: { 1612097880000: { value: 1001 } },
        variable2: { 1612097940000: { value: 2002 } },
        variable3: { 1612097940000: { value: 3002 } },
      };

      expect(result).toEqual(expectedResult);

      //CHECKING REQUESTS
      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      //First call - fetch token
      let base64Key = encodeBase64(`testClientId:testClientSecret`);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testTenantName",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic ${base64Key}`,
        },
      });

      //Second call - get data, using previously fetched token
      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/${assetId}/${aspectName}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          latestValue: true,
        },
      });
    });

    it("should fetch token first - if token has expired and than get the data, convert it and return", async () => {
      mockedAuthTokenElapsedTime = null;

      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //token elapsed time - "2021-01-31T12:58:00.000Z" 1612097880000
      mockedNow = 1612098000000;
      mockedAuthTokenElapsedTime = 1612097880000;

      //Setting new token to return first time
      //token timestamp - "2021-01-31T12:58:00.000Z" - 1612097880000
      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //expires in "2021-01-31T13:31:18.766Z" 1612097880000 + 2000*1000-1234 = 1612099878766

      //First axios call - fetch token, second get data
      mockedReturnDataCollection = [
        {
          access_token: "testAccessToken2",
          timestamp: 1612097880000,
          expires_in: 2000,
        },
        [
          {
            _time: "2021-01-31T12:58:00Z",
            variable1: 1001,
          },
          {
            _time: "2021-01-31T12:59:00Z",
            variable2: 2002,
            variable3: 3002,
          },
        ],
      ];

      mockedReturnStatusCollection = [200, 200];

      let result = await exec();

      //CHECKING RESULT
      let expectedResult: TimeSeriesData = {
        variable1: { 1612097880000: { value: 1001 } },
        variable2: { 1612097940000: { value: 2002 } },
        variable3: { 1612097940000: { value: 3002 } },
      };

      expect(result).toEqual(expectedResult);

      //CHECKING REQUESTS
      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      //First call - fetch token
      let base64Key = encodeBase64(`testClientId:testClientSecret`);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testTenantName",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic ${base64Key}`,
        },
      });

      //Second call - get data, using previously fetched token
      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/${assetId}/${aspectName}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          latestValue: true,
        },
      });
    });

    it("should reject - if return data is null", async () => {
      mockedReturnDataCollection = [null];

      await expect(exec()).rejects.toMatchObject({
        message: "Invalid reponse data - should be na array",
      });
    });

    it("should reject - if api call rejects", async () => {
      mockedAxios.__setMockError(new Error("test api call error"));

      await expect(exec()).rejects.toMatchObject({
        message: "test api call error",
      });
    });

    it("should reject - if api call return code different than 2xx", async () => {
      mockedReturnStatusCollection = [400];

      await expect(exec()).rejects.toMatchObject({
        message: `Server responded with status code: 400`,
      });
    });

    it("should reject - if fetching token rejects", async () => {
      mockedAuthToken = null;
      mockedAuthTokenElapsedTime = null;

      mockedAxios.__setMockError(new Error("test api call error"));

      await expect(exec()).rejects.toMatchObject({
        message: "test api call error",
      });

      //request called only once - while fetching token
      expect(axios.request).toHaveBeenCalledTimes(1);
    });
  });

  describe("getValues", () => {
    let tenantName: string;
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereTimeSeriesService: MindSphereTimeSeriesService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let assetId: string;
    let aspectName: string;
    let fromUnixDate: number;
    let toUnixDate: number;

    beforeEach(() => {
      //"2021-01-31T12:58:00.000Z" - 1612097880000
      //"2021-01-31T12:59:00.000Z" - 1612097940000
      //"2021-01-31T13:00:00.000Z" - 1612098000000
      //"2021-01-31T13:01:00.000Z" - 1612098060000
      //"2021-02-01T13:00:00.000Z" - 1612184400000
      mockedReturnDataCollection = [
        [
          {
            _time: "2021-01-31T12:58:00Z",
            variable1: 1001,
            variable1_qc: 1,
            variable2: 2001,
            variable2_qc: 2,
            variable3: 3001,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T12:59:00Z",
            variable1: 1002,
            variable1_qc: 1,
            variable2: 2002,
            variable2_qc: 2,
            variable3: 3002,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T13:00:00Z",
            variable1: 1003,
            variable1_qc: 1,
            variable2: 2003,
            variable2_qc: 2,
            variable3: 3003,
            variable3_qc: 3,
          },
        ],
      ];
      mockedReturnStatusCollection = [200];
      mockedReturnHeadersCollection = [{}];
      mockedAuthToken = "testAuthToken1234";
      mockedAuthTokenElapsedTime = 1612184400000;
      mockedNow = 1612098060000;

      tenantName = "testTenantName";
      assetId = "testAssetId";
      aspectName = "testAspectName";
      fromUnixDate = 1612097880000;
      toUnixDate = 1612098060000;
    });

    let exec = async () => {
      //Mocking Token Manager
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance(
        tenantName
      ) as any;
      mockedMindSphereTokenManager._token = mockedAuthToken;
      mockedMindSphereTokenManager._tokenExpireUnixDate = mockedAuthTokenElapsedTime;

      //Getting instance of time series service
      mindSphereTimeSeriesService = MindSphereTimeSeriesService.getInstance();

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereTimeSeriesService.getValues(
        tenantName,
        assetId,
        aspectName,
        fromUnixDate,
        toUnixDate
      );
    };

    it("should call MindSphere time series API, get the data, convert it and return - there is no next header", async () => {
      let result = await exec();

      //Checking result
      let expectedResult: TimeSeriesData = {
        variable1: {
          1612097880000: { value: 1001, qc: 1 },
          1612097940000: { value: 1002, qc: 1 },
          1612098000000: { value: 1003, qc: 1 },
        },
        variable2: {
          1612097880000: { value: 2001, qc: 2 },
          1612097940000: { value: 2002, qc: 2 },
          1612098000000: { value: 2003, qc: 2 },
        },
        variable3: {
          1612097880000: { value: 3001, qc: 3 },
          1612097940000: { value: 3002, qc: 3 },
          1612098000000: { value: 3003, qc: 3 },
        },
      };

      expect(result).toEqual(expectedResult);

      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/${assetId}/${aspectName}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          from: new Date(fromUnixDate).toISOString(),
          to: new Date(toUnixDate).toISOString(),
          limit: 2000,
        },
      });
    });

    it("should call MindSphere time series API, get the data, convert it and return - even if some data has not qc - there is no next header", async () => {
      mockedReturnDataCollection = [
        [
          {
            _time: "2021-01-31T12:58:00Z",
            variable1: 1001,
            variable1_qc: 1,
            variable2: 2001,
            variable3: 3001,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T12:59:00Z",
            variable1: 1002,
            variable1_qc: 1,
            variable2: 2002,
            variable3: 3002,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T13:00:00Z",
            variable1: 1003,
            variable1_qc: 1,
            variable2: 2003,
            variable3: 3003,
            variable3_qc: 3,
          },
        ],
      ];

      let result = await exec();

      //Checking result
      let expectedResult: TimeSeriesData = {
        variable1: {
          1612097880000: { value: 1001, qc: 1 },
          1612097940000: { value: 1002, qc: 1 },
          1612098000000: { value: 1003, qc: 1 },
        },
        variable2: {
          1612097880000: { value: 2001 },
          1612097940000: { value: 2002 },
          1612098000000: { value: 2003 },
        },
        variable3: {
          1612097880000: { value: 3001, qc: 3 },
          1612097940000: { value: 3002, qc: 3 },
          1612098000000: { value: 3003, qc: 3 },
        },
      };

      expect(result).toEqual(expectedResult);

      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/${assetId}/${aspectName}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          from: new Date(fromUnixDate).toISOString(),
          to: new Date(toUnixDate).toISOString(),
          limit: 2000,
        },
      });
    });

    it("should call and return empty object - if timeseries data returned from MindSphere is an empty array - there is no next header", async () => {
      mockedReturnDataCollection = [[]];

      let result = await exec();

      //Checking result
      let expectedResult: TimeSeriesData = {};

      expect(result).toEqual(expectedResult);

      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/${assetId}/${aspectName}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          from: new Date(fromUnixDate).toISOString(),
          to: new Date(toUnixDate).toISOString(),
          limit: 2000,
        },
      });
    });

    it("should reject - if api call rejects - there is no next header", async () => {
      mockedAxios.__setMockError(new Error("test api call error"));

      await expect(exec()).rejects.toMatchObject({
        message: "test api call error",
      });
    });

    it("should reject - if api call return code different than 2xx - there is no next header", async () => {
      mockedReturnStatusCollection = [400];

      await expect(exec()).rejects.toMatchObject({
        message: `Server responded with status code: 400`,
      });
    });

    it("should call MindSphere time series API several times until there is next header, get the data, convert it and return", async () => {
      mockedReturnDataCollection = [
        [
          {
            _time: "2021-01-31T12:58:00Z",
            variable1: 1001,
            variable1_qc: 1,
            variable2: 2001,
            variable2_qc: 2,
            variable3: 3001,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T12:59:00Z",
            variable1: 1002,
            variable1_qc: 1,
            variable2: 2002,
            variable2_qc: 2,
            variable3: 3002,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T13:00:00Z",
            variable1: 1003,
            variable1_qc: 1,
            variable2: 2003,
            variable2_qc: 2,
            variable3: 3003,
            variable3_qc: 3,
          },
        ],
        [
          {
            _time: "2021-01-31T13:58:00Z",
            variable1: 1101,
            variable1_qc: 1,
            variable2: 2101,
            variable2_qc: 2,
            variable3: 3101,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T13:59:00Z",
            variable1: 1102,
            variable1_qc: 1,
            variable2: 2102,
            variable2_qc: 2,
            variable3: 3102,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T14:00:00Z",
            variable1: 1103,
            variable1_qc: 1,
            variable2: 2103,
            variable2_qc: 2,
            variable3: 3103,
            variable3_qc: 3,
          },
        ],
        [
          {
            _time: "2021-01-31T14:58:00Z",
            variable1: 1201,
            variable1_qc: 1,
            variable2: 2201,
            variable2_qc: 2,
            variable3: 3201,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T14:59:00Z",
            variable1: 1202,
            variable1_qc: 1,
            variable2: 2202,
            variable2_qc: 2,
            variable3: 3202,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T15:00:00Z",
            variable1: 1203,
            variable1_qc: 1,
            variable2: 2203,
            variable2_qc: 2,
            variable3: 3203,
            variable3_qc: 3,
          },
        ],
      ];

      mockedReturnStatusCollection = [200];
      mockedReturnHeadersCollection = [
        {
          link: "first part of link <myLinkNumber1> other part of link",
        },
        {
          link: "first part of link <myLinkNumber2> other part of link",
        },
      ];

      let result = await exec();

      //Checking result
      let expectedResult: TimeSeriesData = {
        variable1: {
          1612097880000: { value: 1001, qc: 1 },
          1612097940000: { value: 1002, qc: 1 },
          1612098000000: { value: 1003, qc: 1 },
          1612101480000: { value: 1101, qc: 1 },
          1612101540000: { value: 1102, qc: 1 },
          1612101600000: { value: 1103, qc: 1 },
          1612105080000: { value: 1201, qc: 1 },
          1612105140000: { value: 1202, qc: 1 },
          1612105200000: { value: 1203, qc: 1 },
        },
        variable2: {
          1612097880000: { value: 2001, qc: 2 },
          1612097940000: { value: 2002, qc: 2 },
          1612098000000: { value: 2003, qc: 2 },
          1612101480000: { value: 2101, qc: 2 },
          1612101540000: { value: 2102, qc: 2 },
          1612101600000: { value: 2103, qc: 2 },
          1612105080000: { value: 2201, qc: 2 },
          1612105140000: { value: 2202, qc: 2 },
          1612105200000: { value: 2203, qc: 2 },
        },
        variable3: {
          1612097880000: { value: 3001, qc: 3 },
          1612097940000: { value: 3002, qc: 3 },
          1612098000000: { value: 3003, qc: 3 },
          1612101480000: { value: 3101, qc: 3 },
          1612101540000: { value: 3102, qc: 3 },
          1612101600000: { value: 3103, qc: 3 },
          1612105080000: { value: 3201, qc: 3 },
          1612105140000: { value: 3202, qc: 3 },
          1612105200000: { value: 3203, qc: 3 },
        },
      };

      expect(result).toEqual(expectedResult);

      //Axios request should have been called several times - getting all data until next header disappear
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/${assetId}/${aspectName}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          from: new Date(fromUnixDate).toISOString(),
          to: new Date(toUnixDate).toISOString(),
          limit: 2000,
        },
      });
      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `myLinkNumber1`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "GET",
        url: `myLinkNumber2`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    });

    it("should call MindSphere time series API several times until there is valid next header with <link> - lack of closing tag", async () => {
      mockedReturnDataCollection = [
        [
          {
            _time: "2021-01-31T12:58:00Z",
            variable1: 1001,
            variable1_qc: 1,
            variable2: 2001,
            variable2_qc: 2,
            variable3: 3001,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T12:59:00Z",
            variable1: 1002,
            variable1_qc: 1,
            variable2: 2002,
            variable2_qc: 2,
            variable3: 3002,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T13:00:00Z",
            variable1: 1003,
            variable1_qc: 1,
            variable2: 2003,
            variable2_qc: 2,
            variable3: 3003,
            variable3_qc: 3,
          },
        ],
        [
          {
            _time: "2021-01-31T13:58:00Z",
            variable1: 1101,
            variable1_qc: 1,
            variable2: 2101,
            variable2_qc: 2,
            variable3: 3101,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T13:59:00Z",
            variable1: 1102,
            variable1_qc: 1,
            variable2: 2102,
            variable2_qc: 2,
            variable3: 3102,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T14:00:00Z",
            variable1: 1103,
            variable1_qc: 1,
            variable2: 2103,
            variable2_qc: 2,
            variable3: 3103,
            variable3_qc: 3,
          },
        ],
        [
          {
            _time: "2021-01-31T14:58:00Z",
            variable1: 1201,
            variable1_qc: 1,
            variable2: 2201,
            variable2_qc: 2,
            variable3: 3201,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T14:59:00Z",
            variable1: 1202,
            variable1_qc: 1,
            variable2: 2202,
            variable2_qc: 2,
            variable3: 3202,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T15:00:00Z",
            variable1: 1203,
            variable1_qc: 1,
            variable2: 2203,
            variable2_qc: 2,
            variable3: 3203,
            variable3_qc: 3,
          },
        ],
      ];

      mockedReturnStatusCollection = [200];
      mockedReturnHeadersCollection = [
        {
          link: "first part of link <myLinkNumber1> other part of link",
        },
        {
          link: "first part of link <myLinkNumber2 other part of link",
        },
      ];

      let result = await exec();

      //Checking result
      let expectedResult: TimeSeriesData = {
        variable1: {
          1612097880000: { value: 1001, qc: 1 },
          1612097940000: { value: 1002, qc: 1 },
          1612098000000: { value: 1003, qc: 1 },
          1612101480000: { value: 1101, qc: 1 },
          1612101540000: { value: 1102, qc: 1 },
          1612101600000: { value: 1103, qc: 1 },
        },
        variable2: {
          1612097880000: { value: 2001, qc: 2 },
          1612097940000: { value: 2002, qc: 2 },
          1612098000000: { value: 2003, qc: 2 },
          1612101480000: { value: 2101, qc: 2 },
          1612101540000: { value: 2102, qc: 2 },
          1612101600000: { value: 2103, qc: 2 },
        },
        variable3: {
          1612097880000: { value: 3001, qc: 3 },
          1612097940000: { value: 3002, qc: 3 },
          1612098000000: { value: 3003, qc: 3 },
          1612101480000: { value: 3101, qc: 3 },
          1612101540000: { value: 3102, qc: 3 },
          1612101600000: { value: 3103, qc: 3 },
        },
      };

      expect(result).toEqual(expectedResult);

      //Axios request should have been called several times - getting all data until next header disappear
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/${assetId}/${aspectName}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          from: new Date(fromUnixDate).toISOString(),
          to: new Date(toUnixDate).toISOString(),
          limit: 2000,
        },
      });
      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `myLinkNumber1`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    });

    it("should call MindSphere time series API several times until there is valid next header with <link> - lack of opening tag", async () => {
      mockedReturnDataCollection = [
        [
          {
            _time: "2021-01-31T12:58:00Z",
            variable1: 1001,
            variable1_qc: 1,
            variable2: 2001,
            variable2_qc: 2,
            variable3: 3001,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T12:59:00Z",
            variable1: 1002,
            variable1_qc: 1,
            variable2: 2002,
            variable2_qc: 2,
            variable3: 3002,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T13:00:00Z",
            variable1: 1003,
            variable1_qc: 1,
            variable2: 2003,
            variable2_qc: 2,
            variable3: 3003,
            variable3_qc: 3,
          },
        ],
        [
          {
            _time: "2021-01-31T13:58:00Z",
            variable1: 1101,
            variable1_qc: 1,
            variable2: 2101,
            variable2_qc: 2,
            variable3: 3101,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T13:59:00Z",
            variable1: 1102,
            variable1_qc: 1,
            variable2: 2102,
            variable2_qc: 2,
            variable3: 3102,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T14:00:00Z",
            variable1: 1103,
            variable1_qc: 1,
            variable2: 2103,
            variable2_qc: 2,
            variable3: 3103,
            variable3_qc: 3,
          },
        ],
        [
          {
            _time: "2021-01-31T14:58:00Z",
            variable1: 1201,
            variable1_qc: 1,
            variable2: 2201,
            variable2_qc: 2,
            variable3: 3201,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T14:59:00Z",
            variable1: 1202,
            variable1_qc: 1,
            variable2: 2202,
            variable2_qc: 2,
            variable3: 3202,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T15:00:00Z",
            variable1: 1203,
            variable1_qc: 1,
            variable2: 2203,
            variable2_qc: 2,
            variable3: 3203,
            variable3_qc: 3,
          },
        ],
      ];

      mockedReturnStatusCollection = [200];
      mockedReturnHeadersCollection = [
        {
          link: "first part of link <myLinkNumber1> other part of link",
        },
        {
          link: "first part of link myLinkNumber2> other part of link",
        },
      ];

      let result = await exec();

      //Checking result
      let expectedResult: TimeSeriesData = {
        variable1: {
          1612097880000: { value: 1001, qc: 1 },
          1612097940000: { value: 1002, qc: 1 },
          1612098000000: { value: 1003, qc: 1 },
          1612101480000: { value: 1101, qc: 1 },
          1612101540000: { value: 1102, qc: 1 },
          1612101600000: { value: 1103, qc: 1 },
        },
        variable2: {
          1612097880000: { value: 2001, qc: 2 },
          1612097940000: { value: 2002, qc: 2 },
          1612098000000: { value: 2003, qc: 2 },
          1612101480000: { value: 2101, qc: 2 },
          1612101540000: { value: 2102, qc: 2 },
          1612101600000: { value: 2103, qc: 2 },
        },
        variable3: {
          1612097880000: { value: 3001, qc: 3 },
          1612097940000: { value: 3002, qc: 3 },
          1612098000000: { value: 3003, qc: 3 },
          1612101480000: { value: 3101, qc: 3 },
          1612101540000: { value: 3102, qc: 3 },
          1612101600000: { value: 3103, qc: 3 },
        },
      };

      expect(result).toEqual(expectedResult);

      //Axios request should have been called several times - getting all data until next header disappear
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/${assetId}/${aspectName}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          from: new Date(fromUnixDate).toISOString(),
          to: new Date(toUnixDate).toISOString(),
          limit: 2000,
        },
      });
      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `myLinkNumber1`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    });

    it("should call MindSphere time series API several times until there is valid next header with <link> - header is null", async () => {
      mockedReturnDataCollection = [
        [
          {
            _time: "2021-01-31T12:58:00Z",
            variable1: 1001,
            variable1_qc: 1,
            variable2: 2001,
            variable2_qc: 2,
            variable3: 3001,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T12:59:00Z",
            variable1: 1002,
            variable1_qc: 1,
            variable2: 2002,
            variable2_qc: 2,
            variable3: 3002,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T13:00:00Z",
            variable1: 1003,
            variable1_qc: 1,
            variable2: 2003,
            variable2_qc: 2,
            variable3: 3003,
            variable3_qc: 3,
          },
        ],
        [
          {
            _time: "2021-01-31T13:58:00Z",
            variable1: 1101,
            variable1_qc: 1,
            variable2: 2101,
            variable2_qc: 2,
            variable3: 3101,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T13:59:00Z",
            variable1: 1102,
            variable1_qc: 1,
            variable2: 2102,
            variable2_qc: 2,
            variable3: 3102,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T14:00:00Z",
            variable1: 1103,
            variable1_qc: 1,
            variable2: 2103,
            variable2_qc: 2,
            variable3: 3103,
            variable3_qc: 3,
          },
        ],
        [
          {
            _time: "2021-01-31T14:58:00Z",
            variable1: 1201,
            variable1_qc: 1,
            variable2: 2201,
            variable2_qc: 2,
            variable3: 3201,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T14:59:00Z",
            variable1: 1202,
            variable1_qc: 1,
            variable2: 2202,
            variable2_qc: 2,
            variable3: 3202,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T15:00:00Z",
            variable1: 1203,
            variable1_qc: 1,
            variable2: 2203,
            variable2_qc: 2,
            variable3: 3203,
            variable3_qc: 3,
          },
        ],
      ];

      mockedReturnStatusCollection = [200];
      mockedReturnHeadersCollection = [
        {
          link: "first part of link <myLinkNumber1> other part of link",
        },
        {
          link: null,
        },
      ];

      let result = await exec();

      //Checking result
      let expectedResult: TimeSeriesData = {
        variable1: {
          1612097880000: { value: 1001, qc: 1 },
          1612097940000: { value: 1002, qc: 1 },
          1612098000000: { value: 1003, qc: 1 },
          1612101480000: { value: 1101, qc: 1 },
          1612101540000: { value: 1102, qc: 1 },
          1612101600000: { value: 1103, qc: 1 },
        },
        variable2: {
          1612097880000: { value: 2001, qc: 2 },
          1612097940000: { value: 2002, qc: 2 },
          1612098000000: { value: 2003, qc: 2 },
          1612101480000: { value: 2101, qc: 2 },
          1612101540000: { value: 2102, qc: 2 },
          1612101600000: { value: 2103, qc: 2 },
        },
        variable3: {
          1612097880000: { value: 3001, qc: 3 },
          1612097940000: { value: 3002, qc: 3 },
          1612098000000: { value: 3003, qc: 3 },
          1612101480000: { value: 3101, qc: 3 },
          1612101540000: { value: 3102, qc: 3 },
          1612101600000: { value: 3103, qc: 3 },
        },
      };

      expect(result).toEqual(expectedResult);

      //Axios request should have been called several times - getting all data until next header disappear
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/${assetId}/${aspectName}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          from: new Date(fromUnixDate).toISOString(),
          to: new Date(toUnixDate).toISOString(),
          limit: 2000,
        },
      });
      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `myLinkNumber1`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    });

    it("should call MindSphere time series API several times until there is valid next header with <link> - header is not a string", async () => {
      mockedReturnDataCollection = [
        [
          {
            _time: "2021-01-31T12:58:00Z",
            variable1: 1001,
            variable1_qc: 1,
            variable2: 2001,
            variable2_qc: 2,
            variable3: 3001,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T12:59:00Z",
            variable1: 1002,
            variable1_qc: 1,
            variable2: 2002,
            variable2_qc: 2,
            variable3: 3002,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T13:00:00Z",
            variable1: 1003,
            variable1_qc: 1,
            variable2: 2003,
            variable2_qc: 2,
            variable3: 3003,
            variable3_qc: 3,
          },
        ],
        [
          {
            _time: "2021-01-31T13:58:00Z",
            variable1: 1101,
            variable1_qc: 1,
            variable2: 2101,
            variable2_qc: 2,
            variable3: 3101,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T13:59:00Z",
            variable1: 1102,
            variable1_qc: 1,
            variable2: 2102,
            variable2_qc: 2,
            variable3: 3102,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T14:00:00Z",
            variable1: 1103,
            variable1_qc: 1,
            variable2: 2103,
            variable2_qc: 2,
            variable3: 3103,
            variable3_qc: 3,
          },
        ],
        [
          {
            _time: "2021-01-31T14:58:00Z",
            variable1: 1201,
            variable1_qc: 1,
            variable2: 2201,
            variable2_qc: 2,
            variable3: 3201,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T14:59:00Z",
            variable1: 1202,
            variable1_qc: 1,
            variable2: 2202,
            variable2_qc: 2,
            variable3: 3202,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T15:00:00Z",
            variable1: 1203,
            variable1_qc: 1,
            variable2: 2203,
            variable2_qc: 2,
            variable3: 3203,
            variable3_qc: 3,
          },
        ],
      ];

      mockedReturnStatusCollection = [200];
      mockedReturnHeadersCollection = [
        {
          link: "first part of link <myLinkNumber1> other part of link",
        },
        {
          link: 1234,
        },
      ];

      let result = await exec();

      //Checking result
      let expectedResult: TimeSeriesData = {
        variable1: {
          1612097880000: { value: 1001, qc: 1 },
          1612097940000: { value: 1002, qc: 1 },
          1612098000000: { value: 1003, qc: 1 },
          1612101480000: { value: 1101, qc: 1 },
          1612101540000: { value: 1102, qc: 1 },
          1612101600000: { value: 1103, qc: 1 },
        },
        variable2: {
          1612097880000: { value: 2001, qc: 2 },
          1612097940000: { value: 2002, qc: 2 },
          1612098000000: { value: 2003, qc: 2 },
          1612101480000: { value: 2101, qc: 2 },
          1612101540000: { value: 2102, qc: 2 },
          1612101600000: { value: 2103, qc: 2 },
        },
        variable3: {
          1612097880000: { value: 3001, qc: 3 },
          1612097940000: { value: 3002, qc: 3 },
          1612098000000: { value: 3003, qc: 3 },
          1612101480000: { value: 3101, qc: 3 },
          1612101540000: { value: 3102, qc: 3 },
          1612101600000: { value: 3103, qc: 3 },
        },
      };

      expect(result).toEqual(expectedResult);

      //Axios request should have been called several times - getting all data until next header disappear
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/${assetId}/${aspectName}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          from: new Date(fromUnixDate).toISOString(),
          to: new Date(toUnixDate).toISOString(),
          limit: 2000,
        },
      });
      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `myLinkNumber1`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    });

    it("should call MindSphere time series API several times until there is valid next header with <link> - link in header is empty", async () => {
      mockedReturnDataCollection = [
        [
          {
            _time: "2021-01-31T12:58:00Z",
            variable1: 1001,
            variable1_qc: 1,
            variable2: 2001,
            variable2_qc: 2,
            variable3: 3001,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T12:59:00Z",
            variable1: 1002,
            variable1_qc: 1,
            variable2: 2002,
            variable2_qc: 2,
            variable3: 3002,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T13:00:00Z",
            variable1: 1003,
            variable1_qc: 1,
            variable2: 2003,
            variable2_qc: 2,
            variable3: 3003,
            variable3_qc: 3,
          },
        ],
        [
          {
            _time: "2021-01-31T13:58:00Z",
            variable1: 1101,
            variable1_qc: 1,
            variable2: 2101,
            variable2_qc: 2,
            variable3: 3101,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T13:59:00Z",
            variable1: 1102,
            variable1_qc: 1,
            variable2: 2102,
            variable2_qc: 2,
            variable3: 3102,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T14:00:00Z",
            variable1: 1103,
            variable1_qc: 1,
            variable2: 2103,
            variable2_qc: 2,
            variable3: 3103,
            variable3_qc: 3,
          },
        ],
        [
          {
            _time: "2021-01-31T14:58:00Z",
            variable1: 1201,
            variable1_qc: 1,
            variable2: 2201,
            variable2_qc: 2,
            variable3: 3201,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T14:59:00Z",
            variable1: 1202,
            variable1_qc: 1,
            variable2: 2202,
            variable2_qc: 2,
            variable3: 3202,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T15:00:00Z",
            variable1: 1203,
            variable1_qc: 1,
            variable2: 2203,
            variable2_qc: 2,
            variable3: 3203,
            variable3_qc: 3,
          },
        ],
      ];

      mockedReturnStatusCollection = [200];
      mockedReturnHeadersCollection = [
        {
          link: "first part of link <myLinkNumber1> other part of link",
        },
        {
          link: "first part of link <> other part of link",
        },
      ];

      let result = await exec();

      //Checking result
      let expectedResult: TimeSeriesData = {
        variable1: {
          1612097880000: { value: 1001, qc: 1 },
          1612097940000: { value: 1002, qc: 1 },
          1612098000000: { value: 1003, qc: 1 },
          1612101480000: { value: 1101, qc: 1 },
          1612101540000: { value: 1102, qc: 1 },
          1612101600000: { value: 1103, qc: 1 },
        },
        variable2: {
          1612097880000: { value: 2001, qc: 2 },
          1612097940000: { value: 2002, qc: 2 },
          1612098000000: { value: 2003, qc: 2 },
          1612101480000: { value: 2101, qc: 2 },
          1612101540000: { value: 2102, qc: 2 },
          1612101600000: { value: 2103, qc: 2 },
        },
        variable3: {
          1612097880000: { value: 3001, qc: 3 },
          1612097940000: { value: 3002, qc: 3 },
          1612098000000: { value: 3003, qc: 3 },
          1612101480000: { value: 3101, qc: 3 },
          1612101540000: { value: 3102, qc: 3 },
          1612101600000: { value: 3103, qc: 3 },
        },
      };

      expect(result).toEqual(expectedResult);

      //Axios request should have been called several times - getting all data until next header disappear
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/${assetId}/${aspectName}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          from: new Date(fromUnixDate).toISOString(),
          to: new Date(toUnixDate).toISOString(),
          limit: 2000,
        },
      });
      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `myLinkNumber1`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    });

    it("should reject - if one of api call throws", async () => {
      mockedReturnDataCollection = [
        [
          {
            _time: "2021-01-31T12:58:00Z",
            variable1: 1001,
            variable1_qc: 1,
            variable2: 2001,
            variable2_qc: 2,
            variable3: 3001,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T12:59:00Z",
            variable1: 1002,
            variable1_qc: 1,
            variable2: 2002,
            variable2_qc: 2,
            variable3: 3002,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T13:00:00Z",
            variable1: 1003,
            variable1_qc: 1,
            variable2: 2003,
            variable2_qc: 2,
            variable3: 3003,
            variable3_qc: 3,
          },
        ],
        [
          {
            _time: "2021-01-31T13:58:00Z",
            variable1: 1101,
            variable1_qc: 1,
            variable2: 2101,
            variable2_qc: 2,
            variable3: 3101,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T13:59:00Z",
            variable1: 1102,
            variable1_qc: 1,
            variable2: 2102,
            variable2_qc: 2,
            variable3: 3102,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T14:00:00Z",
            variable1: 1103,
            variable1_qc: 1,
            variable2: 2103,
            variable2_qc: 2,
            variable3: 3103,
            variable3_qc: 3,
          },
        ],
        [
          {
            _time: "2021-01-31T14:58:00Z",
            variable1: 1201,
            variable1_qc: 1,
            variable2: 2201,
            variable2_qc: 2,
            variable3: 3201,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T14:59:00Z",
            variable1: 1202,
            variable1_qc: 1,
            variable2: 2202,
            variable2_qc: 2,
            variable3: 3202,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T15:00:00Z",
            variable1: 1203,
            variable1_qc: 1,
            variable2: 2203,
            variable2_qc: 2,
            variable3: 3203,
            variable3_qc: 3,
          },
        ],
      ];

      mockedReturnStatusCollection = [200];
      mockedReturnHeadersCollection = [
        {
          link: "first part of link <myLinkNumber1> other part of link",
        },
        {
          link: "first part of link <myLinkNumber2> other part of link",
        },
      ];

      //Throwing during third call
      mockedAxios.__setMockError(new Error("test api call error"), 2);

      await expect(exec()).rejects.toMatchObject({
        message: "test api call error",
      });

      //request called 3 times, and 3rd threw
      expect(axios.request).toHaveBeenCalledTimes(3);

      expect(mockedAxios.request).toHaveBeenCalledTimes(3);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/${assetId}/${aspectName}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          from: new Date(fromUnixDate).toISOString(),
          to: new Date(toUnixDate).toISOString(),
          limit: 2000,
        },
      });
      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `myLinkNumber1`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "GET",
        url: `myLinkNumber2`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    });

    it("should not reject but not take this call into account - if one of api calls return invalid data - null", async () => {
      mockedReturnDataCollection = [
        [
          {
            _time: "2021-01-31T12:58:00Z",
            variable1: 1001,
            variable1_qc: 1,
            variable2: 2001,
            variable2_qc: 2,
            variable3: 3001,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T12:59:00Z",
            variable1: 1002,
            variable1_qc: 1,
            variable2: 2002,
            variable2_qc: 2,
            variable3: 3002,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T13:00:00Z",
            variable1: 1003,
            variable1_qc: 1,
            variable2: 2003,
            variable2_qc: 2,
            variable3: 3003,
            variable3_qc: 3,
          },
        ],
        null,
        [
          {
            _time: "2021-01-31T14:58:00Z",
            variable1: 1201,
            variable1_qc: 1,
            variable2: 2201,
            variable2_qc: 2,
            variable3: 3201,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T14:59:00Z",
            variable1: 1202,
            variable1_qc: 1,
            variable2: 2202,
            variable2_qc: 2,
            variable3: 3202,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T15:00:00Z",
            variable1: 1203,
            variable1_qc: 1,
            variable2: 2203,
            variable2_qc: 2,
            variable3: 3203,
            variable3_qc: 3,
          },
        ],
      ];

      mockedReturnStatusCollection = [200];
      mockedReturnHeadersCollection = [
        {
          link: "first part of link <myLinkNumber1> other part of link",
        },
        {
          link: "first part of link <myLinkNumber2> other part of link",
        },
      ];

      let result = await exec();

      //Checking result
      let expectedResult: TimeSeriesData = {
        variable1: {
          1612097880000: { value: 1001, qc: 1 },
          1612097940000: { value: 1002, qc: 1 },
          1612098000000: { value: 1003, qc: 1 },
          1612105080000: { value: 1201, qc: 1 },
          1612105140000: { value: 1202, qc: 1 },
          1612105200000: { value: 1203, qc: 1 },
        },
        variable2: {
          1612097880000: { value: 2001, qc: 2 },
          1612097940000: { value: 2002, qc: 2 },
          1612098000000: { value: 2003, qc: 2 },
          1612105080000: { value: 2201, qc: 2 },
          1612105140000: { value: 2202, qc: 2 },
          1612105200000: { value: 2203, qc: 2 },
        },
        variable3: {
          1612097880000: { value: 3001, qc: 3 },
          1612097940000: { value: 3002, qc: 3 },
          1612098000000: { value: 3003, qc: 3 },
          1612105080000: { value: 3201, qc: 3 },
          1612105140000: { value: 3202, qc: 3 },
          1612105200000: { value: 3203, qc: 3 },
        },
      };

      expect(result).toEqual(expectedResult);

      //Axios request should have been called several times - getting all data until next header disappear
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/${assetId}/${aspectName}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          from: new Date(fromUnixDate).toISOString(),
          to: new Date(toUnixDate).toISOString(),
          limit: 2000,
        },
      });
      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `myLinkNumber1`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "GET",
        url: `myLinkNumber2`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    });

    it("should fetch token first - if token has not been fetched before and than get the data, convert it and return", async () => {
      mockedAuthToken = null;
      mockedAuthTokenElapsedTime = null;

      //Setting token to return first time
      //token timestamp - "2021-01-31T12:58:00.000Z" - 1612097880000
      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //expires in "2021-01-31T13:31:18.766Z" 1612097880000 + 2000*1000-1234 = 1612099878766
      mockedNow = 1612098000000;
      //First axios call - fetch token, second get data
      mockedReturnDataCollection = [
        {
          access_token: "testAccessToken2",
          timestamp: 1612097880000,
          expires_in: 2000,
        },
        [
          {
            _time: "2021-01-31T12:58:00Z",
            variable1: 1001,
            variable1_qc: 1,
            variable2: 2001,
            variable2_qc: 2,
            variable3: 3001,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T12:59:00Z",
            variable1: 1002,
            variable1_qc: 1,
            variable2: 2002,
            variable2_qc: 2,
            variable3: 3002,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T13:00:00Z",
            variable1: 1003,
            variable1_qc: 1,
            variable2: 2003,
            variable2_qc: 2,
            variable3: 3003,
            variable3_qc: 3,
          },
        ],
      ];

      mockedReturnStatusCollection = [200, 200];

      let result = await exec();

      //CHECKING RESULT
      let expectedResult: TimeSeriesData = {
        variable1: {
          1612097880000: { value: 1001, qc: 1 },
          1612097940000: { value: 1002, qc: 1 },
          1612098000000: { value: 1003, qc: 1 },
        },
        variable2: {
          1612097880000: { value: 2001, qc: 2 },
          1612097940000: { value: 2002, qc: 2 },
          1612098000000: { value: 2003, qc: 2 },
        },
        variable3: {
          1612097880000: { value: 3001, qc: 3 },
          1612097940000: { value: 3002, qc: 3 },
          1612098000000: { value: 3003, qc: 3 },
        },
      };

      expect(result).toEqual(expectedResult);

      //CHECKING REQUESTS
      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      //First call - fetch token
      let base64Key = encodeBase64(`testClientId:testClientSecret`);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testTenantName",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic ${base64Key}`,
        },
      });

      //Second call - get data, using previously fetched token
      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/${assetId}/${aspectName}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          from: new Date(fromUnixDate).toISOString(),
          to: new Date(toUnixDate).toISOString(),
          limit: 2000,
        },
      });
    });

    it("should fetch token first - if token has expired and than get the data, convert it and return", async () => {
      mockedAuthTokenElapsedTime = null;

      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //token elapsed time - "2021-01-31T12:58:00.000Z" 1612097880000
      mockedNow = 1612098000000;
      mockedAuthTokenElapsedTime = 1612097880000;

      //Setting new token to return first time
      //token timestamp - "2021-01-31T12:58:00.000Z" - 1612097880000
      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //expires in "2021-01-31T13:31:18.766Z" 1612097880000 + 2000*1000-1234 = 1612099878766

      //First axios call - fetch token, second get data
      mockedReturnDataCollection = [
        {
          access_token: "testAccessToken2",
          timestamp: 1612097880000,
          expires_in: 2000,
        },
        [
          {
            _time: "2021-01-31T12:58:00Z",
            variable1: 1001,
            variable1_qc: 1,
            variable2: 2001,
            variable2_qc: 2,
            variable3: 3001,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T12:59:00Z",
            variable1: 1002,
            variable1_qc: 1,
            variable2: 2002,
            variable2_qc: 2,
            variable3: 3002,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T13:00:00Z",
            variable1: 1003,
            variable1_qc: 1,
            variable2: 2003,
            variable2_qc: 2,
            variable3: 3003,
            variable3_qc: 3,
          },
        ],
      ];

      mockedReturnStatusCollection = [200, 200];

      let result = await exec();

      //CHECKING RESULT
      let expectedResult: TimeSeriesData = {
        variable1: {
          1612097880000: { value: 1001, qc: 1 },
          1612097940000: { value: 1002, qc: 1 },
          1612098000000: { value: 1003, qc: 1 },
        },
        variable2: {
          1612097880000: { value: 2001, qc: 2 },
          1612097940000: { value: 2002, qc: 2 },
          1612098000000: { value: 2003, qc: 2 },
        },
        variable3: {
          1612097880000: { value: 3001, qc: 3 },
          1612097940000: { value: 3002, qc: 3 },
          1612098000000: { value: 3003, qc: 3 },
        },
      };

      expect(result).toEqual(expectedResult);

      //CHECKING REQUESTS
      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      //First call - fetch token
      let base64Key = encodeBase64(`testClientId:testClientSecret`);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testTenantName",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic ${base64Key}`,
        },
      });

      //Second call - get data, using previously fetched token
      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/${assetId}/${aspectName}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          from: new Date(fromUnixDate).toISOString(),
          to: new Date(toUnixDate).toISOString(),
          limit: 2000,
        },
      });
    });

    it("should not reject and return empty object - if returned data is null", async () => {
      mockedReturnDataCollection = [null];

      let result = await exec();

      expect(result).toEqual({});

      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/${assetId}/${aspectName}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          from: new Date(fromUnixDate).toISOString(),
          to: new Date(toUnixDate).toISOString(),
          limit: 2000,
        },
      });
    });

    it("should reject - if fetching token rejects", async () => {
      mockedAuthToken = null;
      mockedAuthTokenElapsedTime = null;

      mockedAxios.__setMockError(new Error("test api call error"));

      await expect(exec()).rejects.toMatchObject({
        message: "test api call error",
      });

      //request called only once - while fetching token
      expect(axios.request).toHaveBeenCalledTimes(1);
    });
  });

  describe("setValues", () => {
    let tenantName: string;
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereTimeSeriesService: MindSphereTimeSeriesService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let assetId: string;
    let aspectName: string;
    let dataToSend: TimeSeriesData;

    beforeEach(() => {
      //"2021-01-31T12:58:00.000Z" - 1612097880000
      //"2021-01-31T12:59:00.000Z" - 1612097940000
      //"2021-01-31T13:00:00.000Z" - 1612098000000
      //"2021-01-31T13:01:00.000Z" - 1612098060000
      //"2021-02-01T13:00:00.000Z" - 1612184400000
      mockedReturnDataCollection = [{}];

      dataToSend = {
        variable1: {
          1612097880000: { value: 1001, qc: 1 },
          1612097940000: { value: 1002, qc: 1 },
          1612098000000: { value: 1003, qc: 1 },
        },
        variable2: {
          1612097880000: { value: 2001, qc: 2 },
          1612097940000: { value: 2002, qc: 2 },
          1612098000000: { value: 2003, qc: 2 },
        },
        variable3: {
          1612097880000: { value: 3001, qc: 3 },
          1612097940000: { value: 3002, qc: 3 },
          1612098000000: { value: 3003, qc: 3 },
        },
      };
      mockedReturnStatusCollection = [200];
      mockedReturnHeadersCollection = [{}];
      mockedAuthToken = "testAuthToken1234";
      mockedAuthTokenElapsedTime = 1612184400000;
      mockedNow = 1612098060000;

      tenantName = "testTenantName";
      assetId = "testAssetId";
      aspectName = "testAspectName";
    });

    let exec = async () => {
      //Mocking Token Manager
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance(
        tenantName
      ) as any;
      mockedMindSphereTokenManager._token = mockedAuthToken;
      mockedMindSphereTokenManager._tokenExpireUnixDate = mockedAuthTokenElapsedTime;

      //Getting instance of time series service
      mindSphereTimeSeriesService = MindSphereTimeSeriesService.getInstance();

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereTimeSeriesService.setValues(
        tenantName,
        assetId,
        aspectName,
        dataToSend
      );
    };

    it("should convert the data and send it via calling MindSphere API", async () => {
      await exec();

      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "PUT",
        url: `https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/${assetId}/${aspectName}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: [
          {
            _time: "2021-01-31T12:58:00.000Z",
            variable1: 1001,
            variable1_qc: 1,
            variable2: 2001,
            variable2_qc: 2,
            variable3: 3001,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T12:59:00.000Z",
            variable1: 1002,
            variable1_qc: 1,
            variable2: 2002,
            variable2_qc: 2,
            variable3: 3002,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T13:00:00.000Z",
            variable1: 1003,
            variable1_qc: 1,
            variable2: 2003,
            variable2_qc: 2,
            variable3: 3003,
            variable3_qc: 3,
          },
        ],
        params: {},
      });
    });

    it("should convert the data and send it via calling MindSphere API - if some data do not have qc", async () => {
      dataToSend = {
        variable1: {
          1612097880000: { value: 1001, qc: 1 },
          1612097940000: { value: 1002, qc: 1 },
          1612098000000: { value: 1003, qc: 1 },
        },
        variable2: {
          1612097880000: { value: 2001 },
          1612097940000: { value: 2002 },
          1612098000000: { value: 2003 },
        },
        variable3: {
          1612097880000: { value: 3001, qc: 3 },
          1612097940000: { value: 3002, qc: 3 },
          1612098000000: { value: 3003, qc: 3 },
        },
      };

      await exec();

      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "PUT",
        url: `https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/${assetId}/${aspectName}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: [
          {
            _time: "2021-01-31T12:58:00.000Z",
            variable1: 1001,
            variable1_qc: 1,
            variable2: 2001,
            variable3: 3001,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T12:59:00.000Z",
            variable1: 1002,
            variable1_qc: 1,
            variable2: 2002,
            variable3: 3002,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T13:00:00.000Z",
            variable1: 1003,
            variable1_qc: 1,
            variable2: 2003,
            variable3: 3003,
            variable3_qc: 3,
          },
        ],
        params: {},
      });
    });

    it("should not call MindSphere API - if timeseries to send is an empty object", async () => {
      dataToSend = {};

      await exec();

      //Axios request should not have been called
      expect(mockedAxios.request).not.toHaveBeenCalled();
    });

    it("should fetch token first - if token has not been fetched before and than get the data, convert it and return", async () => {
      mockedAuthToken = null;
      mockedAuthTokenElapsedTime = null;

      //Setting token to return first time
      //token timestamp - "2021-01-31T12:58:00.000Z" - 1612097880000
      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //expires in "2021-01-31T13:31:18.766Z" 1612097880000 + 2000*1000-1234 = 1612099878766
      mockedNow = 1612098000000;
      //First axios call - fetch token, second get data
      mockedReturnDataCollection = [
        {
          access_token: "testAccessToken2",
          timestamp: 1612097880000,
          expires_in: 2000,
        },
        {},
      ];

      mockedReturnStatusCollection = [200, 200];

      await exec();

      //CHECKING REQUESTS
      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      //First call - fetch token
      let base64Key = encodeBase64(`testClientId:testClientSecret`);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testTenantName",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic ${base64Key}`,
        },
      });

      //Second call - get data, using previously fetched token
      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "PUT",
        url: `https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/${assetId}/${aspectName}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: [
          {
            _time: "2021-01-31T12:58:00.000Z",
            variable1: 1001,
            variable1_qc: 1,
            variable2: 2001,
            variable2_qc: 2,
            variable3: 3001,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T12:59:00.000Z",
            variable1: 1002,
            variable1_qc: 1,
            variable2: 2002,
            variable2_qc: 2,
            variable3: 3002,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T13:00:00.000Z",
            variable1: 1003,
            variable1_qc: 1,
            variable2: 2003,
            variable2_qc: 2,
            variable3: 3003,
            variable3_qc: 3,
          },
        ],
        params: {},
      });
    });

    it("should fetch token first - if token has expired and than get the data, convert it and return", async () => {
      mockedAuthTokenElapsedTime = null;

      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //token elapsed time - "2021-01-31T12:58:00.000Z" 1612097880000
      mockedNow = 1612098000000;
      mockedAuthTokenElapsedTime = 1612097880000;

      //Setting new token to return first time
      //token timestamp - "2021-01-31T12:58:00.000Z" - 1612097880000
      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //expires in "2021-01-31T13:31:18.766Z" 1612097880000 + 2000*1000-1234 = 1612099878766

      //First axios call - fetch token, second get data
      mockedReturnDataCollection = [
        {
          access_token: "testAccessToken2",
          timestamp: 1612097880000,
          expires_in: 2000,
        },
        {},
      ];

      mockedReturnStatusCollection = [200, 200];

      await exec();

      //CHECKING REQUESTS
      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      //First call - fetch token
      let base64Key = encodeBase64(`testClientId:testClientSecret`);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testTenantName",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic ${base64Key}`,
        },
      });

      //Second call - get data, using previously fetched token
      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "PUT",
        url: `https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/${assetId}/${aspectName}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: [
          {
            _time: "2021-01-31T12:58:00.000Z",
            variable1: 1001,
            variable1_qc: 1,
            variable2: 2001,
            variable2_qc: 2,
            variable3: 3001,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T12:59:00.000Z",
            variable1: 1002,
            variable1_qc: 1,
            variable2: 2002,
            variable2_qc: 2,
            variable3: 3002,
            variable3_qc: 3,
          },
          {
            _time: "2021-01-31T13:00:00.000Z",
            variable1: 1003,
            variable1_qc: 1,
            variable2: 2003,
            variable2_qc: 2,
            variable3: 3003,
            variable3_qc: 3,
          },
        ],
        params: {},
      });
    });

    it("should not reject - if return data is null", async () => {
      mockedReturnDataCollection = [null];

      await expect(exec()).resolves.not.toThrow();
    });

    it("should reject - if api call rejects", async () => {
      mockedAxios.__setMockError(new Error("test api call error"));

      await expect(exec()).rejects.toMatchObject({
        message: "test api call error",
      });
    });

    it("should reject - if api call return code different than 2xx", async () => {
      mockedReturnStatusCollection = [400];

      await expect(exec()).rejects.toMatchObject({
        message: `Server responded with status code: 400`,
      });
    });

    it("should reject - if fetching token rejects", async () => {
      mockedAuthToken = null;
      mockedAuthTokenElapsedTime = null;

      mockedAxios.__setMockError(new Error("test api call error"));

      await expect(exec()).rejects.toMatchObject({
        message: "test api call error",
      });

      //request called only once - while fetching token
      expect(axios.request).toHaveBeenCalledTimes(1);
    });
  });

  describe("deleteValues", () => {
    let tenantName: string;
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereTimeSeriesService: MindSphereTimeSeriesService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let assetId: string;
    let aspectName: string;
    let fromUnixDate: number;
    let toUnixDate: number;

    beforeEach(() => {
      //"2021-01-31T12:58:00.000Z" - 1612097880000
      //"2021-01-31T12:59:00.000Z" - 1612097940000
      //"2021-01-31T13:00:00.000Z" - 1612098000000
      //"2021-01-31T13:01:00.000Z" - 1612098060000
      //"2021-02-01T13:00:00.000Z" - 1612184400000
      mockedReturnDataCollection = [{}];
      mockedReturnStatusCollection = [200];
      mockedReturnHeadersCollection = [{}];
      mockedAuthToken = "testAuthToken1234";
      mockedAuthTokenElapsedTime = 1612184400000;
      mockedNow = 1612098060000;

      tenantName = "testTenantName";
      assetId = "testAssetId";
      aspectName = "testAspectName";
      fromUnixDate = 1612097880000;
      toUnixDate = 1612098060000;
    });

    let exec = async () => {
      //Mocking Token Manager
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance(
        tenantName
      ) as any;
      mockedMindSphereTokenManager._token = mockedAuthToken;
      mockedMindSphereTokenManager._tokenExpireUnixDate = mockedAuthTokenElapsedTime;

      //Getting instance of time series service
      mindSphereTimeSeriesService = MindSphereTimeSeriesService.getInstance();

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereTimeSeriesService.deleteValues(
        tenantName,
        assetId,
        aspectName,
        fromUnixDate,
        toUnixDate
      );
    };

    it("should call MindSphere time series API to delete data from given period", async () => {
      await exec();

      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "DELETE",
        url: `https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/${assetId}/${aspectName}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          from: new Date(fromUnixDate).toISOString(),
          to: new Date(toUnixDate).toISOString(),
        },
      });
    });

    it("should fetch token first - if token has not been fetched before and than get the data, convert it and return", async () => {
      mockedAuthToken = null;
      mockedAuthTokenElapsedTime = null;

      //Setting token to return first time
      //token timestamp - "2021-01-31T12:58:00.000Z" - 1612097880000
      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //expires in "2021-01-31T13:31:18.766Z" 1612097880000 + 2000*1000-1234 = 1612099878766
      mockedNow = 1612098000000;
      //First axios call - fetch token, second get data
      mockedReturnDataCollection = [
        {
          access_token: "testAccessToken2",
          timestamp: 1612097880000,
          expires_in: 2000,
        },
        {},
      ];

      mockedReturnStatusCollection = [200, 200];
      mockedReturnHeadersCollection = [{}, {}];

      let result = await exec();

      //CHECKING REQUESTS
      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      //First call - fetch token
      let base64Key = encodeBase64(`testClientId:testClientSecret`);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testTenantName",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic ${base64Key}`,
        },
      });

      //Second call - get data, using previously fetched token
      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "DELETE",
        url: `https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/${assetId}/${aspectName}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          from: new Date(fromUnixDate).toISOString(),
          to: new Date(toUnixDate).toISOString(),
        },
      });
    });

    it("should fetch token first - if token has expired and than get the data, convert it and return", async () => {
      mockedAuthTokenElapsedTime = null;

      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //token elapsed time - "2021-01-31T12:58:00.000Z" 1612097880000
      mockedNow = 1612098000000;
      mockedAuthTokenElapsedTime = 1612097880000;

      //Setting new token to return first time
      //token timestamp - "2021-01-31T12:58:00.000Z" - 1612097880000
      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //expires in "2021-01-31T13:31:18.766Z" 1612097880000 + 2000*1000-1234 = 1612099878766

      //First axios call - fetch token, second get data
      mockedReturnDataCollection = [
        {
          access_token: "testAccessToken2",
          timestamp: 1612097880000,
          expires_in: 2000,
        },
        {},
      ];

      mockedReturnStatusCollection = [200, 200];

      await exec();

      //CHECKING REQUESTS
      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      //First call - fetch token
      let base64Key = encodeBase64(`testClientId:testClientSecret`);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testTenantName",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic ${base64Key}`,
        },
      });

      //Second call - get data, using previously fetched token
      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "DELETE",
        url: `https://gateway.eu1.mindsphere.io/api/iottimeseries/v3/timeseries/${assetId}/${aspectName}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          from: new Date(fromUnixDate).toISOString(),
          to: new Date(toUnixDate).toISOString(),
        },
      });
    });

    it("should not reject - if return data is null", async () => {
      mockedReturnDataCollection = [null];

      await expect(exec()).resolves.not.toThrow();
    });

    it("should reject - if api call rejects", async () => {
      mockedAxios.__setMockError(new Error("test api call error"));

      await expect(exec()).rejects.toMatchObject({
        message: "test api call error",
      });
    });

    it("should reject - if api call return code different than 2xx", async () => {
      mockedReturnStatusCollection = [400];

      await expect(exec()).rejects.toMatchObject({
        message: `Server responded with status code: 400`,
      });
    });

    it("should reject - if fetching token rejects", async () => {
      mockedAuthToken = null;
      mockedAuthTokenElapsedTime = null;

      mockedAxios.__setMockError(new Error("test api call error"));

      await expect(exec()).rejects.toMatchObject({
        message: "test api call error",
      });

      //request called only once - while fetching token
      expect(axios.request).toHaveBeenCalledTimes(1);
    });
  });
});

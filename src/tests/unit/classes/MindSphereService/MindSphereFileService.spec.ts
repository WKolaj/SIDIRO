import { MindSphereTokenManager } from "../../../../classes/MindSphereService/MindSphereToken/MindSphereTokenManager";
import axios from "axios";
import { MindSphereFileService } from "../../../../classes/MindSphereService/MindSphereFileService";
import MockDate from "mockdate";
import { testPrivateProperty } from "../../../testUtilities";

let mockedAxios = axios as any;

describe("MindSphereFileService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    //Reseting static class
    (MindSphereTokenManager as any)._instance = null;
    (MindSphereFileService as any)._instance = null;

    //Reseting axios
    mockedAxios.__reset();
  });

  afterEach(() => {
    jest.clearAllMocks();

    //Reseting static class
    (MindSphereTokenManager as any)._instance = null;
    (MindSphereFileService as any)._instance = null;

    //Reseting axios
    mockedAxios.__reset();
  });

  describe("getInstance", () => {
    let mockedMindSphereTokenManager: MindSphereTokenManager;

    let exec = () => {
      //Getting token manager to check if it is the same as global instance
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance();

      return MindSphereFileService.getInstance();
    };

    it("should return valid instance of MindSphereFileService", () => {
      let result = exec();

      expect(result).not.toEqual(null);
      expect(result instanceof MindSphereFileService).toEqual(true);
    });

    it("should return the same instance of MindSphereFileService if called several times", () => {
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
        `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files`
      );
    });

    it("should properly set tokenManager", () => {
      let result = exec();

      testPrivateProperty(
        result,
        "_tokenManager",
        mockedMindSphereTokenManager
      );
    });
  });

  describe("checkIfFileExists", () => {
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereFileService: MindSphereFileService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let assetId: string;
    let fileName: string;

    beforeEach(() => {
      //"2021-01-31T12:58:00.000Z" - 1612097880000
      //"2021-01-31T12:59:00.000Z" - 1612097940000
      //"2021-01-31T13:00:00.000Z" - 1612098000000
      //"2021-01-31T13:01:00.000Z" - 1612098060000
      //"2021-02-01T13:00:00.000Z" - 1612184400000
      mockedReturnDataCollection = [
        [
          {
            name: "testFileName",
            path: "testAssetId/testFileName",
            size: 4321,
            created: "2021-01-31T12:58:00.000Z",
            updated: "2021-01-31T12:59:00.000Z",
            tenantId: "testTenant",
            storagePrefix: "testStoragePrefix",
            etag: 123,
          },
        ],
      ];
      mockedReturnStatusCollection = [200];
      mockedReturnHeadersCollection = [{}];
      mockedAuthToken = "testAuthToken1234";
      mockedAuthTokenElapsedTime = 1612184400000;
      mockedNow = 1612098060000;

      assetId = "testAssetId";
      fileName = "testFileName";
    });

    let exec = async () => {
      //Mocking Token Manager
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance() as any;
      mockedMindSphereTokenManager._token = mockedAuthToken;
      mockedMindSphereTokenManager._tokenExpireUnixDate = mockedAuthTokenElapsedTime;

      //Getting instance of time series service
      mindSphereFileService = MindSphereFileService.getInstance();

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereFileService.checkIfFileExists(assetId, fileName);
    };

    it("should return eTag value if file exists", async () => {
      let result = await exec();

      expect(result).toEqual(123);

      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `name eq '${fileName}'`,
        },
      });
    });

    it("should return eTag of first file value if more than one file exists", async () => {
      mockedReturnDataCollection = [
        [
          {
            name: "testFileName",
            path: "testAssetId/testFileName",
            size: 4321,
            created: "2021-01-31T12:58:00.000Z",
            updated: "2021-01-31T12:59:00.000Z",
            tenantId: "testTenant",
            storagePrefix: "testStoragePrefix",
            etag: 123,
          },
          {
            name: "testFileName2",
            path: "testAssetId/testFileName2",
            size: 24321,
            created: "2021-01-31T13:58:00.000Z",
            updated: "2021-01-31T13:59:00.000Z",
            tenantId: "testTenant2",
            storagePrefix: "testStoragePrefix2",
            etag: 567,
          },
        ],
      ];

      let result = await exec();

      expect(result).toEqual(123);

      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `name eq '${fileName}'`,
        },
      });
    });

    it("should return null if file does not exists - return empty data", async () => {
      mockedReturnDataCollection = [[]];

      let result = await exec();

      expect(result).toEqual(null);

      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `name eq '${fileName}'`,
        },
      });
    });

    it("should return null if data is null", async () => {
      mockedReturnDataCollection = [null];

      let result = await exec();

      expect(result).toEqual(null);

      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `name eq '${fileName}'`,
        },
      });
    });

    it("should return null if data is not defined", async () => {
      mockedReturnDataCollection = [undefined];

      let result = await exec();

      expect(result).toEqual(null);

      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `name eq '${fileName}'`,
        },
      });
    });

    it("should return null if etag is null", async () => {
      mockedReturnDataCollection = [
        [
          {
            name: "testFileName",
            path: "testAssetId/testFileName",
            size: 4321,
            created: "2021-01-31T12:58:00.000Z",
            updated: "2021-01-31T12:59:00.000Z",
            tenantId: "testTenant",
            storagePrefix: "testStoragePrefix",
            etag: null,
          },
        ],
      ];

      let result = await exec();

      expect(result).toEqual(null);

      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `name eq '${fileName}'`,
        },
      });
    });

    it("should return null if etag is not defined", async () => {
      mockedReturnDataCollection = [
        [
          {
            name: "testFileName",
            path: "testAssetId/testFileName",
            size: 4321,
            created: "2021-01-31T12:58:00.000Z",
            updated: "2021-01-31T12:59:00.000Z",
            tenantId: "testTenant",
            storagePrefix: "testStoragePrefix",
          },
        ],
      ];

      let result = await exec();

      expect(result).toEqual(null);

      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `name eq '${fileName}'`,
        },
      });
    });

    it("should throw if api call throws an error - eg. there is no asset", async () => {
      mockedAxios.__setMockError("testError");

      await expect(exec()).rejects.toEqual("testError");

      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `name eq '${fileName}'`,
        },
      });
    });

    it("should fetch token first - if token has not been fetched before and than get file and return its eTag", async () => {
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
            name: "testFileName",
            path: "testAssetId/testFileName",
            size: 4321,
            created: "2021-01-31T12:58:00.000Z",
            updated: "2021-01-31T12:59:00.000Z",
            tenantId: "testTenant",
            storagePrefix: "testStoragePrefix",
            etag: 123,
          },
        ],
      ];

      mockedReturnStatusCollection = [200, 200];

      let result = await exec();

      expect(result).toEqual(123);

      //CHECKING REQUESTS
      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      //First call - fetch token
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testUserTenant",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic testSpaceAuthKey`,
        },
      });

      //Second call - get file info using previously fetched token
      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `name eq '${fileName}'`,
        },
      });
    });

    it("should fetch token first - if token has expired and than get file and return its eTag", async () => {
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
            name: "testFileName",
            path: "testAssetId/testFileName",
            size: 4321,
            created: "2021-01-31T12:58:00.000Z",
            updated: "2021-01-31T12:59:00.000Z",
            tenantId: "testTenant",
            storagePrefix: "testStoragePrefix",
            etag: 123,
          },
        ],
      ];

      mockedReturnStatusCollection = [200, 200];

      let result = await exec();

      expect(result).toEqual(123);

      //CHECKING REQUESTS
      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      //First call - fetch token
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testUserTenant",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic testSpaceAuthKey`,
        },
      });

      //Second call - get file info using previously fetched token
      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `name eq '${fileName}'`,
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

  describe("getFileContent", () => {
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereFileService: MindSphereFileService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let assetId: string;
    let fileName: string;

    beforeEach(() => {
      //"2021-01-31T12:58:00.000Z" - 1612097880000
      //"2021-01-31T12:59:00.000Z" - 1612097940000
      //"2021-01-31T13:00:00.000Z" - 1612098000000
      //"2021-01-31T13:01:00.000Z" - 1612098060000
      //"2021-02-01T13:00:00.000Z" - 1612184400000
      mockedReturnDataCollection = [
        {
          abcd: 1234,
          efgh: 5678,
          ijkl: 9012,
        },
      ];
      mockedReturnStatusCollection = [200];
      mockedReturnHeadersCollection = [{}];
      mockedAuthToken = "testAuthToken1234";
      mockedAuthTokenElapsedTime = 1612184400000;
      mockedNow = 1612098060000;

      assetId = "testAssetId";
      fileName = "testFileName";
    });

    let exec = async () => {
      //Mocking Token Manager
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance() as any;
      mockedMindSphereTokenManager._token = mockedAuthToken;
      mockedMindSphereTokenManager._tokenExpireUnixDate = mockedAuthTokenElapsedTime;

      //Getting instance of time series service
      mindSphereFileService = MindSphereFileService.getInstance();

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereFileService.getFileContent(assetId, fileName);
    };

    it("should return file content if file exists", async () => {
      let result = await exec();

      expect(result).toEqual({
        abcd: 1234,
        efgh: 5678,
        ijkl: 9012,
      });

      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}/${fileName}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/octet-stream",
          Accept: "application/octet-stream",
        },
      });
    });

    it("should throw if api call throws an error", async () => {
      mockedAxios.__setMockError("testError");

      await expect(exec()).rejects.toEqual("testError");

      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}/${fileName}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/octet-stream",
          Accept: "application/octet-stream",
        },
      });
    });

    it("should fetch token first - if token has not been fetched before and than get file and return its eTag", async () => {
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
        {
          abcd: 1234,
          efgh: 5678,
          ijkl: 9012,
        },
      ];

      mockedReturnStatusCollection = [200, 200];

      let result = await exec();

      expect(result).toEqual({
        abcd: 1234,
        efgh: 5678,
        ijkl: 9012,
      });

      //CHECKING REQUESTS
      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      //First call - fetch token
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testUserTenant",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic testSpaceAuthKey`,
        },
      });

      //Second call - get file info using previously fetched token
      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}/${fileName}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/octet-stream",
          Accept: "application/octet-stream",
        },
      });
    });

    it("should fetch token first - if token has expired and than get file and return its eTag", async () => {
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

        {
          abcd: 1234,
          efgh: 5678,
          ijkl: 9012,
        },
      ];

      mockedReturnStatusCollection = [200, 200];

      let result = await exec();

      expect(result).toEqual({
        abcd: 1234,
        efgh: 5678,
        ijkl: 9012,
      });

      //CHECKING REQUESTS
      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      //First call - fetch token
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testUserTenant",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic testSpaceAuthKey`,
        },
      });

      //Second call - get file info using previously fetched token
      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}/${fileName}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/octet-stream",
          Accept: "application/octet-stream",
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

  describe("deleteFile", () => {
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereFileService: MindSphereFileService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let assetId: string;
    let fileName: string;

    beforeEach(() => {
      //"2021-01-31T12:58:00.000Z" - 1612097880000
      //"2021-01-31T12:59:00.000Z" - 1612097940000
      //"2021-01-31T13:00:00.000Z" - 1612098000000
      //"2021-01-31T13:01:00.000Z" - 1612098060000
      //"2021-02-01T13:00:00.000Z" - 1612184400000
      mockedReturnDataCollection = [];
      mockedReturnStatusCollection = [200];
      mockedReturnHeadersCollection = [{}];
      mockedAuthToken = "testAuthToken1234";
      mockedAuthTokenElapsedTime = 1612184400000;
      mockedNow = 1612098060000;

      assetId = "testAssetId";
      fileName = "testFileName";
    });

    let exec = async () => {
      //Mocking Token Manager
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance() as any;
      mockedMindSphereTokenManager._token = mockedAuthToken;
      mockedMindSphereTokenManager._tokenExpireUnixDate = mockedAuthTokenElapsedTime;

      //Getting instance of time series service
      mindSphereFileService = MindSphereFileService.getInstance();

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereFileService.deleteFile(assetId, fileName);
    };

    it("should call DELETE API of file", async () => {
      await exec();

      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "DELETE",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}/${fileName}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    });

    it("should throw if api call throws an error", async () => {
      mockedAxios.__setMockError("testError");

      await expect(exec()).rejects.toEqual("testError");

      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "DELETE",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}/${fileName}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    });

    it("should fetch token first - if token has not been fetched before and than get file and return its eTag", async () => {
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
      ];

      mockedReturnStatusCollection = [200, 200];

      await exec();

      //CHECKING REQUESTS
      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      //First call - fetch token
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testUserTenant",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic testSpaceAuthKey`,
        },
      });

      //Second call - get file info using previously fetched token
      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "DELETE",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}/${fileName}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    });

    it("should fetch token first - if token has expired and than get file and return its eTag", async () => {
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
      ];

      mockedReturnStatusCollection = [200, 200];

      await exec();

      //CHECKING REQUESTS
      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      //First call - fetch token
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testUserTenant",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic testSpaceAuthKey`,
        },
      });

      //Second call - get file info using previously fetched token
      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "DELETE",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}/${fileName}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
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

  describe("setFileContent", () => {
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereFileService: MindSphereFileService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let assetId: string;
    let fileName: string;
    let fileContent: any;

    beforeEach(() => {
      //"2021-01-31T12:58:00.000Z" - 1612097880000
      //"2021-01-31T12:59:00.000Z" - 1612097940000
      //"2021-01-31T13:00:00.000Z" - 1612098000000
      //"2021-01-31T13:01:00.000Z" - 1612098060000
      //"2021-02-01T13:00:00.000Z" - 1612184400000
      mockedReturnDataCollection = [
        [
          {
            name: "testFileName",
            path: "testAssetId/testFileName",
            size: 4321,
            created: "2021-01-31T12:58:00.000Z",
            updated: "2021-01-31T12:59:00.000Z",
            tenantId: "testTenant",
            storagePrefix: "testStoragePrefix",
            etag: 123,
          },
        ],
        {
          abcd: 1234,
          efgh: 5678,
          ijkl: 9012,
        },
      ];
      mockedReturnStatusCollection = [200];
      mockedReturnHeadersCollection = [{}];
      mockedAuthToken = "testAuthToken1234";
      mockedAuthTokenElapsedTime = 1612184400000;
      mockedNow = 1612098060000;

      assetId = "testAssetId";
      fileName = "testFileName";
      fileContent = {
        abcd: 1234,
        defg: 5678,
        hijk: 9012,
      };
    });

    let exec = async () => {
      //Mocking Token Manager
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance() as any;
      mockedMindSphereTokenManager._token = mockedAuthToken;
      mockedMindSphereTokenManager._tokenExpireUnixDate = mockedAuthTokenElapsedTime;

      //Getting instance of time series service
      mindSphereFileService = MindSphereFileService.getInstance();

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereFileService.setFileContent(
        assetId,
        fileName,
        fileContent
      );
    };

    it("should check if file exists, and if it exists call PUT API with IF-MATCH header with valid eTag number", async () => {
      await exec();

      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `name eq '${fileName}'`,
        },
      });
      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "PUT",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}/${fileName}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/octet-stream",
          Accept: "application/octet-stream",
          "If-Match": 123,
        },
        data: {
          ...fileContent,
        },
      });
    });

    it("should check if file exists, and if it does not exist call PUT API without IF-MATCH header", async () => {
      mockedReturnDataCollection = [
        [],
        {
          abcd: 1234,
          efgh: 5678,
          ijkl: 9012,
        },
      ];

      await exec();

      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `name eq '${fileName}'`,
        },
      });
      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "PUT",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}/${fileName}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/octet-stream",
          Accept: "application/octet-stream",
        },
        data: {
          ...fileContent,
        },
      });
    });

    it("should throw if API call throw - checking file API call", async () => {
      mockedAxios.__setMockError("testError");
      await expect(exec()).rejects.toEqual("testError");

      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `name eq '${fileName}'`,
        },
      });
    });

    it("should throw if API call throw - setting file API call", async () => {
      mockedAxios.__setMockError("testError", 1);
      await expect(exec()).rejects.toEqual("testError");

      expect(mockedAxios.request).toHaveBeenCalledTimes(2);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `name eq '${fileName}'`,
        },
      });
      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "PUT",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}/${fileName}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/octet-stream",
          Accept: "application/octet-stream",
          "If-Match": 123,
        },
        data: {
          ...fileContent,
        },
      });
    });

    it("should fetch token first - if token has not been fetched before and than get file and return its eTag", async () => {
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
            name: "testFileName",
            path: "testAssetId/testFileName",
            size: 4321,
            created: "2021-01-31T12:58:00.000Z",
            updated: "2021-01-31T12:59:00.000Z",
            tenantId: "testTenant",
            storagePrefix: "testStoragePrefix",
            etag: 123,
          },
        ],
        {
          abcd: 1234,
          efgh: 5678,
          ijkl: 9012,
        },
      ];

      mockedReturnStatusCollection = [200, 200, 200];

      await exec();

      //CHECKING REQUESTS
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);

      //First call - fetch token
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testUserTenant",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic testSpaceAuthKey`,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `name eq '${fileName}'`,
        },
      });

      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "PUT",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}/${fileName}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/octet-stream",
          Accept: "application/octet-stream",
          "If-Match": 123,
        },
        data: {
          ...fileContent,
        },
      });
    });

    it("should fetch token first - if token has expired and than get file and return its eTag", async () => {
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
            name: "testFileName",
            path: "testAssetId/testFileName",
            size: 4321,
            created: "2021-01-31T12:58:00.000Z",
            updated: "2021-01-31T12:59:00.000Z",
            tenantId: "testTenant",
            storagePrefix: "testStoragePrefix",
            etag: 123,
          },
        ],
        {
          abcd: 1234,
          efgh: 5678,
          ijkl: 9012,
        },
      ];

      mockedReturnStatusCollection = [200, 200, 200];

      await exec();

      //CHECKING REQUESTS
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);

      //First call - fetch token
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testUserTenant",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic testSpaceAuthKey`,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `name eq '${fileName}'`,
        },
      });

      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "PUT",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}/${fileName}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/octet-stream",
          Accept: "application/octet-stream",
          "If-Match": 123,
        },
        data: {
          ...fileContent,
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

  describe("getAllFileNamesFromAsset", () => {
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereFileService: MindSphereFileService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let assetId: string;
    let fileExtension: string | null | undefined;

    beforeEach(() => {
      //"2021-01-31T12:58:00.000Z" - 1612097880000
      //"2021-01-31T12:59:00.000Z" - 1612097940000
      //"2021-01-31T13:00:00.000Z" - 1612098000000
      //"2021-01-31T13:01:00.000Z" - 1612098060000
      //"2021-02-01T13:00:00.000Z" - 1612184400000
      mockedReturnDataCollection = [
        {},
        [
          {
            name: "testFileName1.json",
          },
          {
            name: "testFileName2.testExtension",
          },
          {
            name: "testFileName3.testExtension",
          },
          {
            name: "testFileName4.testExtension",
          },
          {
            name: "testFileName5.json",
          },
        ],
        [
          {
            name: "testFileName6.json",
          },
          {
            name: "testFileName7.testExtension",
          },
          {
            name: "testFileName8.testExtension",
          },
          {
            name: "testFileName9.testExtension",
          },
          {
            name: "testFileName10.json",
          },
        ],
        [
          {
            name: "testFileName11.json",
          },
          {
            name: "testFileName12.testExtension",
          },
          {
            name: "testFileName13.testExtension",
          },
          {
            name: "testFileName14.testExtension",
          },
          {
            name: "testFileName15.json",
          },
        ],
        [
          {
            name: "testFileName16.json",
          },
          {
            name: "testFileName17.testExtension",
          },
          {
            name: "testFileName18.testExtension",
          },
          {
            name: "testFileName19.testExtension",
          },
          {
            name: "testFileName20.json",
          },
        ],
        [
          {
            name: "testFileName21.json",
          },
          {
            name: "testFileName22.testExtension",
          },
          {
            name: "testFileName23.testExtension",
          },
          {
            name: "testFileName24.testExtension",
          },
          {
            name: "testFileName25.json",
          },
        ],
      ];
      mockedReturnHeadersCollection = [{ count: 2500 }];
      mockedReturnStatusCollection = [200, 200, 200, 200, 200, 200];
      mockedAuthToken = "testAuthToken1234";
      mockedAuthTokenElapsedTime = 1612184400000;
      mockedNow = 1612098060000;

      assetId = "testAssetId";
      fileExtension = "testExtension";
    });

    let exec = async () => {
      //Mocking Token Manager
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance() as any;
      mockedMindSphereTokenManager._token = mockedAuthToken;
      mockedMindSphereTokenManager._tokenExpireUnixDate = mockedAuthTokenElapsedTime;

      //Getting instance of time series service
      mindSphereFileService = MindSphereFileService.getInstance();

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereFileService.getAllFileNamesFromAsset(
        assetId,
        fileExtension
      );
    };

    it("should call search file api first - to get total number of files - and then call search file api according to total number of files and limit", async () => {
      mockedReturnDataCollection = [
        {},
        [
          {
            name: "testFileName1.json",
          },
          {
            name: "testFileName2.testExtension",
          },
          {
            name: "testFileName3.testExtension",
          },
          {
            name: "testFileName4.testExtension",
          },
          {
            name: "testFileName5.json",
          },
        ],
        [
          {
            name: "testFileName6.json",
          },
          {
            name: "testFileName7.testExtension",
          },
          {
            name: "testFileName8.testExtension",
          },
          {
            name: "testFileName9.testExtension",
          },
          {
            name: "testFileName10.json",
          },
        ],
        [
          {
            name: "testFileName11.json",
          },
          {
            name: "testFileName12.testExtension",
          },
          {
            name: "testFileName13.testExtension",
          },
          {
            name: "testFileName14.testExtension",
          },
          {
            name: "testFileName15.json",
          },
        ],
        [
          {
            name: "testFileName16.json",
          },
          {
            name: "testFileName17.testExtension",
          },
          {
            name: "testFileName18.testExtension",
          },
          {
            name: "testFileName19.testExtension",
          },
          {
            name: "testFileName20.json",
          },
        ],
        [
          {
            name: "testFileName21.json",
          },
          {
            name: "testFileName22.testExtension",
          },
          {
            name: "testFileName23.testExtension",
          },
          {
            name: "testFileName24.testExtension",
          },
          {
            name: "testFileName25.json",
          },
        ],
      ];

      mockedReturnHeadersCollection = [{ count: 2500 }];

      let result = await exec();

      expect(result).toBeDefined();
      expect(result.length).toEqual(15);
      expect(result).toContain("testFileName2.testExtension");
      expect(result).toContain("testFileName3.testExtension");
      expect(result).toContain("testFileName4.testExtension");
      expect(result).toContain("testFileName7.testExtension");
      expect(result).toContain("testFileName8.testExtension");
      expect(result).toContain("testFileName9.testExtension");
      expect(result).toContain("testFileName12.testExtension");
      expect(result).toContain("testFileName13.testExtension");
      expect(result).toContain("testFileName14.testExtension");
      expect(result).toContain("testFileName17.testExtension");
      expect(result).toContain("testFileName18.testExtension");
      expect(result).toContain("testFileName19.testExtension");
      expect(result).toContain("testFileName22.testExtension");
      expect(result).toContain("testFileName23.testExtension");
      expect(result).toContain("testFileName24.testExtension");

      //Axios request should have been called six times - first when calculating number of files, than 5 x to get name of files
      expect(mockedAxios.request).toHaveBeenCalledTimes(6);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: true,
        },
      });

      //Checking rest mock calls - every call should be of the same api but with different offset
      let restCalls = mockedAxios.request.mock.calls.slice(1, 6);

      //Sorting calls on the basis of offset
      let sortedCalls = restCalls.sort(
        (a: any, b: any) => a[0].params.offset - b[0].params.offset
      );

      expect(sortedCalls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 0,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 500,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[2][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 1000,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[3][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 1500,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[4][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 2000,
          limit: 500,
          order: "name asc",
        },
      });
    });

    it("should call search file api first - to get total number of files - if some of call returns empty arrays", async () => {
      mockedReturnDataCollection = [
        {},
        [
          {
            name: "testFileName1.json",
          },
          {
            name: "testFileName2.testExtension",
          },
          {
            name: "testFileName3.testExtension",
          },
          {
            name: "testFileName4.testExtension",
          },
          {
            name: "testFileName5.json",
          },
        ],
        [],
        [
          {
            name: "testFileName11.json",
          },
          {
            name: "testFileName12.testExtension",
          },
          {
            name: "testFileName13.testExtension",
          },
          {
            name: "testFileName14.testExtension",
          },
          {
            name: "testFileName15.json",
          },
        ],
        [
          {
            name: "testFileName16.json",
          },
          {
            name: "testFileName17.testExtension",
          },
          {
            name: "testFileName18.testExtension",
          },
          {
            name: "testFileName19.testExtension",
          },
          {
            name: "testFileName20.json",
          },
        ],
        [
          {
            name: "testFileName21.json",
          },
          {
            name: "testFileName22.testExtension",
          },
          {
            name: "testFileName23.testExtension",
          },
          {
            name: "testFileName24.testExtension",
          },
          {
            name: "testFileName25.json",
          },
        ],
      ];

      mockedReturnHeadersCollection = [{ count: 2500 }];

      let result = await exec();

      expect(result).toBeDefined();
      expect(result.length).toEqual(12);
      expect(result).toContain("testFileName2.testExtension");
      expect(result).toContain("testFileName3.testExtension");
      expect(result).toContain("testFileName4.testExtension");
      expect(result).toContain("testFileName12.testExtension");
      expect(result).toContain("testFileName13.testExtension");
      expect(result).toContain("testFileName14.testExtension");
      expect(result).toContain("testFileName17.testExtension");
      expect(result).toContain("testFileName18.testExtension");
      expect(result).toContain("testFileName19.testExtension");
      expect(result).toContain("testFileName22.testExtension");
      expect(result).toContain("testFileName23.testExtension");
      expect(result).toContain("testFileName24.testExtension");

      //Axios request should have been called six times - first when calculating number of files, than 5 x to get name of files
      expect(mockedAxios.request).toHaveBeenCalledTimes(6);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: true,
        },
      });

      //Checking rest mock calls - every call should be of the same api but with different offset
      let restCalls = mockedAxios.request.mock.calls.slice(1, 6);

      //Sorting calls on the basis of offset
      let sortedCalls = restCalls.sort(
        (a: any, b: any) => a[0].params.offset - b[0].params.offset
      );

      expect(sortedCalls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 0,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 500,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[2][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 1000,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[3][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 1500,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[4][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 2000,
          limit: 500,
          order: "name asc",
        },
      });
    });

    it("should call search file api first - to get total number of files - if some of call returns null", async () => {
      mockedReturnDataCollection = [
        {},
        [
          {
            name: "testFileName1.json",
          },
          {
            name: "testFileName2.testExtension",
          },
          {
            name: "testFileName3.testExtension",
          },
          {
            name: "testFileName4.testExtension",
          },
          {
            name: "testFileName5.json",
          },
        ],
        null,
        [
          {
            name: "testFileName11.json",
          },
          {
            name: "testFileName12.testExtension",
          },
          {
            name: "testFileName13.testExtension",
          },
          {
            name: "testFileName14.testExtension",
          },
          {
            name: "testFileName15.json",
          },
        ],
        [
          {
            name: "testFileName16.json",
          },
          {
            name: "testFileName17.testExtension",
          },
          {
            name: "testFileName18.testExtension",
          },
          {
            name: "testFileName19.testExtension",
          },
          {
            name: "testFileName20.json",
          },
        ],
        [
          {
            name: "testFileName21.json",
          },
          {
            name: "testFileName22.testExtension",
          },
          {
            name: "testFileName23.testExtension",
          },
          {
            name: "testFileName24.testExtension",
          },
          {
            name: "testFileName25.json",
          },
        ],
      ];

      mockedReturnHeadersCollection = [{ count: 2500 }];

      let result = await exec();

      expect(result).toBeDefined();
      expect(result.length).toEqual(12);
      expect(result).toContain("testFileName2.testExtension");
      expect(result).toContain("testFileName3.testExtension");
      expect(result).toContain("testFileName4.testExtension");
      expect(result).toContain("testFileName12.testExtension");
      expect(result).toContain("testFileName13.testExtension");
      expect(result).toContain("testFileName14.testExtension");
      expect(result).toContain("testFileName17.testExtension");
      expect(result).toContain("testFileName18.testExtension");
      expect(result).toContain("testFileName19.testExtension");
      expect(result).toContain("testFileName22.testExtension");
      expect(result).toContain("testFileName23.testExtension");
      expect(result).toContain("testFileName24.testExtension");

      //Axios request should have been called six times - first when calculating number of files, than 5 x to get name of files
      expect(mockedAxios.request).toHaveBeenCalledTimes(6);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: true,
        },
      });

      //Checking rest mock calls - every call should be of the same api but with different offset
      let restCalls = mockedAxios.request.mock.calls.slice(1, 6);

      //Sorting calls on the basis of offset
      let sortedCalls = restCalls.sort(
        (a: any, b: any) => a[0].params.offset - b[0].params.offset
      );

      expect(sortedCalls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 0,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 500,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[2][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 1000,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[3][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 1500,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[4][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 2000,
          limit: 500,
          order: "name asc",
        },
      });
    });

    it("should call search file api first - to get total number of files - if some of call returns all names with different extensions", async () => {
      mockedReturnDataCollection = [
        {},
        [
          {
            name: "testFileName1.json",
          },
          {
            name: "testFileName2.testExtension",
          },
          {
            name: "testFileName3.testExtension",
          },
          {
            name: "testFileName4.testExtension",
          },
          {
            name: "testFileName5.json",
          },
        ],
        [
          {
            name: "testFileName6.json",
          },
          {
            name: "testFileName7.json",
          },
          {
            name: "testFileName8.json",
          },
          {
            name: "testFileName9.json",
          },
          {
            name: "testFileName10.json",
          },
        ],
        [
          {
            name: "testFileName11.json",
          },
          {
            name: "testFileName12.testExtension",
          },
          {
            name: "testFileName13.testExtension",
          },
          {
            name: "testFileName14.testExtension",
          },
          {
            name: "testFileName15.json",
          },
        ],
        [
          {
            name: "testFileName16.json",
          },
          {
            name: "testFileName17.testExtension",
          },
          {
            name: "testFileName18.testExtension",
          },
          {
            name: "testFileName19.testExtension",
          },
          {
            name: "testFileName20.json",
          },
        ],
        [
          {
            name: "testFileName21.json",
          },
          {
            name: "testFileName22.testExtension",
          },
          {
            name: "testFileName23.testExtension",
          },
          {
            name: "testFileName24.testExtension",
          },
          {
            name: "testFileName25.json",
          },
        ],
      ];

      mockedReturnHeadersCollection = [{ count: 2500 }];

      let result = await exec();

      expect(result).toBeDefined();
      expect(result.length).toEqual(12);
      expect(result).toContain("testFileName2.testExtension");
      expect(result).toContain("testFileName3.testExtension");
      expect(result).toContain("testFileName4.testExtension");
      expect(result).toContain("testFileName12.testExtension");
      expect(result).toContain("testFileName13.testExtension");
      expect(result).toContain("testFileName14.testExtension");
      expect(result).toContain("testFileName17.testExtension");
      expect(result).toContain("testFileName18.testExtension");
      expect(result).toContain("testFileName19.testExtension");
      expect(result).toContain("testFileName22.testExtension");
      expect(result).toContain("testFileName23.testExtension");
      expect(result).toContain("testFileName24.testExtension");

      //Axios request should have been called six times - first when calculating number of files, than 5 x to get name of files
      expect(mockedAxios.request).toHaveBeenCalledTimes(6);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: true,
        },
      });

      //Checking rest mock calls - every call should be of the same api but with different offset
      let restCalls = mockedAxios.request.mock.calls.slice(1, 6);

      //Sorting calls on the basis of offset
      let sortedCalls = restCalls.sort(
        (a: any, b: any) => a[0].params.offset - b[0].params.offset
      );

      expect(sortedCalls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 0,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 500,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[2][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 1000,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[3][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 1500,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[4][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 2000,
          limit: 500,
          order: "name asc",
        },
      });
    });

    it("should call search file api first - to get total number of files - if some of call returns data with no name", async () => {
      mockedReturnDataCollection = [
        {},
        [
          {
            name: "testFileName1.json",
          },
          {
            name: "testFileName2.testExtension",
          },
          {
            name: "testFileName3.testExtension",
          },
          {
            name: "testFileName4.testExtension",
          },
          {
            name: "testFileName5.json",
          },
        ],
        [{}, {}, {}, {}, {}],
        [
          {
            name: "testFileName11.json",
          },
          {
            name: "testFileName12.testExtension",
          },
          {
            name: "testFileName13.testExtension",
          },
          {
            name: "testFileName14.testExtension",
          },
          {
            name: "testFileName15.json",
          },
        ],
        [
          {
            name: "testFileName16.json",
          },
          {
            name: "testFileName17.testExtension",
          },
          {
            name: "testFileName18.testExtension",
          },
          {
            name: "testFileName19.testExtension",
          },
          {
            name: "testFileName20.json",
          },
        ],
        [
          {
            name: "testFileName21.json",
          },
          {
            name: "testFileName22.testExtension",
          },
          {
            name: "testFileName23.testExtension",
          },
          {
            name: "testFileName24.testExtension",
          },
          {
            name: "testFileName25.json",
          },
        ],
      ];

      mockedReturnHeadersCollection = [{ count: 2500 }];

      let result = await exec();

      expect(result).toBeDefined();
      expect(result.length).toEqual(12);
      expect(result).toContain("testFileName2.testExtension");
      expect(result).toContain("testFileName3.testExtension");
      expect(result).toContain("testFileName4.testExtension");
      expect(result).toContain("testFileName12.testExtension");
      expect(result).toContain("testFileName13.testExtension");
      expect(result).toContain("testFileName14.testExtension");
      expect(result).toContain("testFileName17.testExtension");
      expect(result).toContain("testFileName18.testExtension");
      expect(result).toContain("testFileName19.testExtension");
      expect(result).toContain("testFileName22.testExtension");
      expect(result).toContain("testFileName23.testExtension");
      expect(result).toContain("testFileName24.testExtension");

      //Axios request should have been called six times - first when calculating number of files, than 5 x to get name of files
      expect(mockedAxios.request).toHaveBeenCalledTimes(6);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: true,
        },
      });

      //Checking rest mock calls - every call should be of the same api but with different offset
      let restCalls = mockedAxios.request.mock.calls.slice(1, 6);

      //Sorting calls on the basis of offset
      let sortedCalls = restCalls.sort(
        (a: any, b: any) => a[0].params.offset - b[0].params.offset
      );

      expect(sortedCalls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 0,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 500,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[2][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 1000,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[3][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 1500,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[4][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 2000,
          limit: 500,
          order: "name asc",
        },
      });
    });

    it("should call search file api first - to get total number of files - if some of call returns data with nulls", async () => {
      mockedReturnDataCollection = [
        {},
        [
          {
            name: "testFileName1.json",
          },
          {
            name: "testFileName2.testExtension",
          },
          {
            name: "testFileName3.testExtension",
          },
          {
            name: "testFileName4.testExtension",
          },
          {
            name: "testFileName5.json",
          },
        ],
        [null, null, null, null, null],
        [
          {
            name: "testFileName11.json",
          },
          {
            name: "testFileName12.testExtension",
          },
          {
            name: "testFileName13.testExtension",
          },
          {
            name: "testFileName14.testExtension",
          },
          {
            name: "testFileName15.json",
          },
        ],
        [
          {
            name: "testFileName16.json",
          },
          {
            name: "testFileName17.testExtension",
          },
          {
            name: "testFileName18.testExtension",
          },
          {
            name: "testFileName19.testExtension",
          },
          {
            name: "testFileName20.json",
          },
        ],
        [
          {
            name: "testFileName21.json",
          },
          {
            name: "testFileName22.testExtension",
          },
          {
            name: "testFileName23.testExtension",
          },
          {
            name: "testFileName24.testExtension",
          },
          {
            name: "testFileName25.json",
          },
        ],
      ];

      mockedReturnHeadersCollection = [{ count: 2500 }];

      let result = await exec();

      expect(result).toBeDefined();
      expect(result.length).toEqual(12);
      expect(result).toContain("testFileName2.testExtension");
      expect(result).toContain("testFileName3.testExtension");
      expect(result).toContain("testFileName4.testExtension");
      expect(result).toContain("testFileName12.testExtension");
      expect(result).toContain("testFileName13.testExtension");
      expect(result).toContain("testFileName14.testExtension");
      expect(result).toContain("testFileName17.testExtension");
      expect(result).toContain("testFileName18.testExtension");
      expect(result).toContain("testFileName19.testExtension");
      expect(result).toContain("testFileName22.testExtension");
      expect(result).toContain("testFileName23.testExtension");
      expect(result).toContain("testFileName24.testExtension");

      //Axios request should have been called six times - first when calculating number of files, than 5 x to get name of files
      expect(mockedAxios.request).toHaveBeenCalledTimes(6);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: true,
        },
      });

      //Checking rest mock calls - every call should be of the same api but with different offset
      let restCalls = mockedAxios.request.mock.calls.slice(1, 6);

      //Sorting calls on the basis of offset
      let sortedCalls = restCalls.sort(
        (a: any, b: any) => a[0].params.offset - b[0].params.offset
      );

      expect(sortedCalls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 0,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 500,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[2][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 1000,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[3][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 1500,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[4][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 2000,
          limit: 500,
          order: "name asc",
        },
      });
    });

    it("should call search file api first - to get total number of files - if count is smaller than file limit (499)", async () => {
      mockedReturnDataCollection = [
        {},
        [
          {
            name: "testFileName1.json",
          },
          {
            name: "testFileName2.testExtension",
          },
          {
            name: "testFileName3.testExtension",
          },
          {
            name: "testFileName4.testExtension",
          },
          {
            name: "testFileName5.json",
          },
        ],
      ];

      mockedReturnHeadersCollection = [{ count: 499 }];

      let result = await exec();

      expect(result).toBeDefined();
      expect(result.length).toEqual(3);
      expect(result).toContain("testFileName2.testExtension");
      expect(result).toContain("testFileName3.testExtension");
      expect(result).toContain("testFileName4.testExtension");

      //Axios request should have been called two times - first when calculating number of files, than  to get name of files
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: true,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 0,
          limit: 500,
          order: "name asc",
        },
      });
    });

    it("should return empty array - if there are only names with different extensions", async () => {
      mockedReturnDataCollection = [
        {},
        [
          {
            name: "testFileName1.json",
          },
          {
            name: "testFileName2.json",
          },
          {
            name: "testFileName3.json",
          },
          {
            name: "testFileName4.json",
          },
          {
            name: "testFileName5.json",
          },
        ],
        [
          {
            name: "testFileName6.json",
          },
          {
            name: "testFileName7.json",
          },
          {
            name: "testFileName8.json",
          },
          {
            name: "testFileName9.json",
          },
          {
            name: "testFileName10.json",
          },
        ],
        [
          {
            name: "testFileName11.json",
          },
          {
            name: "testFileName12.json",
          },
          {
            name: "testFileName13.json",
          },
          {
            name: "testFileName14.json",
          },
          {
            name: "testFileName15.json",
          },
        ],
        [
          {
            name: "testFileName16.json",
          },
          {
            name: "testFileName17.json",
          },
          {
            name: "testFileName18.json",
          },
          {
            name: "testFileName19.json",
          },
          {
            name: "testFileName20.json",
          },
        ],
        [
          {
            name: "testFileName21.json",
          },
          {
            name: "testFileName22.json",
          },
          {
            name: "testFileName23.json",
          },
          {
            name: "testFileName24.json",
          },
          {
            name: "testFileName25.json",
          },
        ],
      ];

      mockedReturnHeadersCollection = [{ count: 2500 }];

      let result = await exec();

      expect(result).toEqual([]);

      //Axios request should have been called six times - first when calculating number of files, than 5 x to get name of files
      expect(mockedAxios.request).toHaveBeenCalledTimes(6);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: true,
        },
      });

      //Checking rest mock calls - every call should be of the same api but with different offset
      let restCalls = mockedAxios.request.mock.calls.slice(1, 6);

      //Sorting calls on the basis of offset
      let sortedCalls = restCalls.sort(
        (a: any, b: any) => a[0].params.offset - b[0].params.offset
      );

      expect(sortedCalls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 0,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 500,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[2][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 1000,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[3][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 1500,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[4][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 2000,
          limit: 500,
          order: "name asc",
        },
      });
    });

    it("should return empty array - if there are only empty arrays in response", async () => {
      mockedReturnDataCollection = [{}, [], [], [], [], []];

      mockedReturnHeadersCollection = [{ count: 2500 }];

      let result = await exec();

      expect(result).toEqual([]);

      //Axios request should have been called six times - first when calculating number of files, than 5 x to get name of files
      expect(mockedAxios.request).toHaveBeenCalledTimes(6);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: true,
        },
      });

      //Checking rest mock calls - every call should be of the same api but with different offset
      let restCalls = mockedAxios.request.mock.calls.slice(1, 6);

      //Sorting calls on the basis of offset
      let sortedCalls = restCalls.sort(
        (a: any, b: any) => a[0].params.offset - b[0].params.offset
      );

      expect(sortedCalls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 0,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 500,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[2][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 1000,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[3][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 1500,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[4][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 2000,
          limit: 500,
          order: "name asc",
        },
      });
    });

    it("should not filter files - if extension is set to undefined", async () => {
      fileExtension = undefined;

      let result = await exec();

      expect(result).toBeDefined();
      expect(result.length).toEqual(25);
      expect(result).toContain("testFileName1.json");
      expect(result).toContain("testFileName2.testExtension");
      expect(result).toContain("testFileName3.testExtension");
      expect(result).toContain("testFileName4.testExtension");
      expect(result).toContain("testFileName5.json");
      expect(result).toContain("testFileName6.json");
      expect(result).toContain("testFileName7.testExtension");
      expect(result).toContain("testFileName8.testExtension");
      expect(result).toContain("testFileName9.testExtension");
      expect(result).toContain("testFileName10.json");
      expect(result).toContain("testFileName11.json");
      expect(result).toContain("testFileName12.testExtension");
      expect(result).toContain("testFileName13.testExtension");
      expect(result).toContain("testFileName14.testExtension");
      expect(result).toContain("testFileName15.json");
      expect(result).toContain("testFileName16.json");
      expect(result).toContain("testFileName17.testExtension");
      expect(result).toContain("testFileName18.testExtension");
      expect(result).toContain("testFileName19.testExtension");
      expect(result).toContain("testFileName20.json");
      expect(result).toContain("testFileName21.json");
      expect(result).toContain("testFileName22.testExtension");
      expect(result).toContain("testFileName23.testExtension");
      expect(result).toContain("testFileName24.testExtension");
      expect(result).toContain("testFileName25.json");

      //Axios request should have been called six times - first when calculating number of files, than 5 x to get name of files
      expect(mockedAxios.request).toHaveBeenCalledTimes(6);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: true,
        },
      });

      //Checking rest mock calls - every call should be of the same api but with different offset
      let restCalls = mockedAxios.request.mock.calls.slice(1, 6);

      //Sorting calls on the basis of offset
      let sortedCalls = restCalls.sort(
        (a: any, b: any) => a[0].params.offset - b[0].params.offset
      );

      expect(sortedCalls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 0,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 500,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[2][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 1000,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[3][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 1500,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[4][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 2000,
          limit: 500,
          order: "name asc",
        },
      });
    });

    it("should not filter files - if extension is set to null", async () => {
      fileExtension = null;

      let result = await exec();

      expect(result).toBeDefined();
      expect(result.length).toEqual(25);
      expect(result).toContain("testFileName1.json");
      expect(result).toContain("testFileName2.testExtension");
      expect(result).toContain("testFileName3.testExtension");
      expect(result).toContain("testFileName4.testExtension");
      expect(result).toContain("testFileName5.json");
      expect(result).toContain("testFileName6.json");
      expect(result).toContain("testFileName7.testExtension");
      expect(result).toContain("testFileName8.testExtension");
      expect(result).toContain("testFileName9.testExtension");
      expect(result).toContain("testFileName10.json");
      expect(result).toContain("testFileName11.json");
      expect(result).toContain("testFileName12.testExtension");
      expect(result).toContain("testFileName13.testExtension");
      expect(result).toContain("testFileName14.testExtension");
      expect(result).toContain("testFileName15.json");
      expect(result).toContain("testFileName16.json");
      expect(result).toContain("testFileName17.testExtension");
      expect(result).toContain("testFileName18.testExtension");
      expect(result).toContain("testFileName19.testExtension");
      expect(result).toContain("testFileName20.json");
      expect(result).toContain("testFileName21.json");
      expect(result).toContain("testFileName22.testExtension");
      expect(result).toContain("testFileName23.testExtension");
      expect(result).toContain("testFileName24.testExtension");
      expect(result).toContain("testFileName25.json");

      //Axios request should have been called six times - first when calculating number of files, than 5 x to get name of files
      expect(mockedAxios.request).toHaveBeenCalledTimes(6);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: true,
        },
      });

      //Checking rest mock calls - every call should be of the same api but with different offset
      let restCalls = mockedAxios.request.mock.calls.slice(1, 6);

      //Sorting calls on the basis of offset
      let sortedCalls = restCalls.sort(
        (a: any, b: any) => a[0].params.offset - b[0].params.offset
      );

      expect(sortedCalls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 0,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 500,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[2][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 1000,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[3][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 1500,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[4][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 2000,
          limit: 500,
          order: "name asc",
        },
      });
    });

    it("should call search file api first - to get total number of files and return empty array - if count is 0", async () => {
      mockedReturnDataCollection = [
        {},
        [
          {
            name: "testFileName1.json",
          },
          {
            name: "testFileName2.testExtension",
          },
          {
            name: "testFileName3.testExtension",
          },
          {
            name: "testFileName4.testExtension",
          },
          {
            name: "testFileName5.json",
          },
        ],
      ];

      mockedReturnHeadersCollection = [{ count: 0 }];

      let result = await exec();

      expect(result).toBeDefined();
      expect(result).toEqual([]);

      //Axios request should have been called one time
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: true,
        },
      });
    });

    it("should call search file api first - to get total number of files and return empty array - if there is no count", async () => {
      mockedReturnDataCollection = [
        null,
        [
          {
            name: "testFileName1.json",
          },
          {
            name: "testFileName2.testExtension",
          },
          {
            name: "testFileName3.testExtension",
          },
          {
            name: "testFileName4.testExtension",
          },
          {
            name: "testFileName5.json",
          },
        ],
      ];

      mockedReturnHeadersCollection = [{}];

      let result = await exec();

      expect(result).toBeDefined();
      expect(result).toEqual([]);

      //Axios request should have been called one time
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: true,
        },
      });
    });

    it("should throw if search file api call throws an error", async () => {
      mockedAxios.__setMockError("testError");

      await expect(exec()).rejects.toEqual("testError");

      //Axios request should have been called one time
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: true,
        },
      });
    });

    it("should throw if calls of other api call throws", async () => {
      mockedAxios.__setMockError("testError", 2);

      await expect(exec()).rejects.toEqual("testError");

      //Axios request should have been called six times - first when calculating number of files, than 5 x to get name of files
      expect(mockedAxios.request).toHaveBeenCalledTimes(6);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: true,
        },
      });

      //Checking rest mock calls - every call should be of the same api but with different offset
      let restCalls = mockedAxios.request.mock.calls.slice(1, 6);

      //Sorting calls on the basis of offset
      let sortedCalls = restCalls.sort(
        (a: any, b: any) => a[0].params.offset - b[0].params.offset
      );

      expect(sortedCalls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 0,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 500,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[2][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 1000,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[3][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 1500,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[4][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 2000,
          limit: 500,
          order: "name asc",
        },
      });
    });

    it("should fetch token first - if token has not been fetched before and than get file and return its eTag", async () => {
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
        ...mockedReturnDataCollection,
      ];

      mockedReturnStatusCollection = [200, 200];
      mockedReturnHeadersCollection = [{}, ...mockedReturnHeadersCollection];

      let result = await exec();

      expect(result).toBeDefined();
      expect(result.length).toEqual(15);
      expect(result).toContain("testFileName2.testExtension");
      expect(result).toContain("testFileName3.testExtension");
      expect(result).toContain("testFileName4.testExtension");
      expect(result).toContain("testFileName7.testExtension");
      expect(result).toContain("testFileName8.testExtension");
      expect(result).toContain("testFileName9.testExtension");
      expect(result).toContain("testFileName12.testExtension");
      expect(result).toContain("testFileName13.testExtension");
      expect(result).toContain("testFileName14.testExtension");
      expect(result).toContain("testFileName17.testExtension");
      expect(result).toContain("testFileName18.testExtension");
      expect(result).toContain("testFileName19.testExtension");
      expect(result).toContain("testFileName22.testExtension");
      expect(result).toContain("testFileName23.testExtension");
      expect(result).toContain("testFileName24.testExtension");

      //Axios request should have been called seven times - first when fetching token, then calculating number of files, than 5 x to get name of files
      expect(mockedAxios.request).toHaveBeenCalledTimes(7);

      //First call - fetch token
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testUserTenant",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic testSpaceAuthKey`,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: true,
        },
      });

      //Checking rest mock calls - every call should be of the same api but with different offset
      let restCalls = mockedAxios.request.mock.calls.slice(2, 7);

      //Sorting calls on the basis of offset
      let sortedCalls = restCalls.sort(
        (a: any, b: any) => a[0].params.offset - b[0].params.offset
      );

      expect(sortedCalls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 0,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 500,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[2][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 1000,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[3][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 1500,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[4][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 2000,
          limit: 500,
          order: "name asc",
        },
      });
    });

    it("should fetch token first - if token has expired and than get file and return its eTag", async () => {
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

        ...mockedReturnDataCollection,
      ];

      mockedReturnStatusCollection = [200, 200];

      mockedReturnHeadersCollection = [{}, ...mockedReturnHeadersCollection];

      let result = await exec();

      expect(result).toBeDefined();
      expect(result.length).toEqual(15);
      expect(result).toContain("testFileName2.testExtension");
      expect(result).toContain("testFileName3.testExtension");
      expect(result).toContain("testFileName4.testExtension");
      expect(result).toContain("testFileName7.testExtension");
      expect(result).toContain("testFileName8.testExtension");
      expect(result).toContain("testFileName9.testExtension");
      expect(result).toContain("testFileName12.testExtension");
      expect(result).toContain("testFileName13.testExtension");
      expect(result).toContain("testFileName14.testExtension");
      expect(result).toContain("testFileName17.testExtension");
      expect(result).toContain("testFileName18.testExtension");
      expect(result).toContain("testFileName19.testExtension");
      expect(result).toContain("testFileName22.testExtension");
      expect(result).toContain("testFileName23.testExtension");
      expect(result).toContain("testFileName24.testExtension");

      //Axios request should have been called seven times - first when fetching token, then calculating number of files, than 5 x to get name of files
      expect(mockedAxios.request).toHaveBeenCalledTimes(7);

      //First call - fetch token
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testUserTenant",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic testSpaceAuthKey`,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: true,
        },
      });

      //Checking rest mock calls - every call should be of the same api but with different offset
      let restCalls = mockedAxios.request.mock.calls.slice(2, 7);

      //Sorting calls on the basis of offset
      let sortedCalls = restCalls.sort(
        (a: any, b: any) => a[0].params.offset - b[0].params.offset
      );

      expect(sortedCalls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 0,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 500,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[2][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 1000,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[3][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 1500,
          limit: 500,
          order: "name asc",
        },
      });
      expect(sortedCalls[4][0]).toMatchObject({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files/${assetId}`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          offset: 2000,
          limit: 500,
          order: "name asc",
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
});

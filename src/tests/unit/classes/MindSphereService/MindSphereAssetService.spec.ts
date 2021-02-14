import { MindSphereTokenManager } from "../../../../classes/MindSphereService/MindSphereToken/MindSphereTokenManager";
import axios from "axios";
import { MindSphereAssetService } from "../../../../classes/MindSphereService/MindSphereAssetService";
import MockDate from "mockdate";
import { testPrivateProperty } from "../../../testUtilities";

let mockedAxios = axios as any;

describe("MindSphereAssetService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    //Reseting static class
    (MindSphereTokenManager as any)._instance = null;
    (MindSphereAssetService as any)._instance = null;

    //Reseting axios
    mockedAxios.__reset();
  });

  afterEach(() => {
    jest.clearAllMocks();

    //Reseting static class
    (MindSphereTokenManager as any)._instance = null;
    (MindSphereAssetService as any)._instance = null;

    //Reseting axios
    mockedAxios.__reset();
  });

  describe("getInstance", () => {
    let mockedMindSphereTokenManager: MindSphereTokenManager;

    let exec = () => {
      //Getting token manager to check if it is the same as global instance
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance();

      return MindSphereAssetService.getInstance();
    };

    it("should return valid instance of MindSphereAssetService", () => {
      let result = exec();

      expect(result).not.toEqual(null);
      expect(result instanceof MindSphereAssetService).toEqual(true);
    });

    it("should return the same instance of MindSphereAssetService if called several times", () => {
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
        `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`
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

  describe("checkIfAssetExists", () => {
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereAssetService: MindSphereAssetService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let assetId: string;

    beforeEach(() => {
      mockedReturnDataCollection = [
        {
          _embedded: {
            assets: [
              { name: "fakeAsset1", etag: 1 },
              { name: "fakeAsset2", etag: 2 },
              { name: "fakeAsset3", etag: 3 },
            ],
          },
          _links: {
            first: {
              href: "firstLink1",
            },
            self: {
              href: "selfLink1",
            },
            next: {
              href: "nextLink1",
            },
            last: {
              href: "lastLink1",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 0,
          },
        },
        {
          _embedded: {
            assets: [
              { name: "fakeAsset4", etag: 4 },
              { name: "fakeAsset5", etag: 5 },
              { name: "fakeAsset6", etag: 6 },
            ],
          },
          _links: {
            first: {
              href: "firstLink2",
            },
            self: {
              href: "selfLink2",
            },
            next: {
              href: "nextLink2",
            },
            last: {
              href: "lastLink2",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 1,
          },
        },
        {
          _embedded: {
            assets: [
              { name: "fakeAsset7", etag: 7 },
              { name: "fakeAsset8", etag: 8 },
              { name: "fakeAsset9", etag: 9 },
            ],
          },
          _links: {
            first: {
              href: "firstLink3",
            },
            self: {
              href: "selfLink3",
            },
            next: {
              href: "nextLink3",
            },
            last: {
              href: "lastLink3",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 2,
          },
        },
      ];
      mockedReturnStatusCollection = [200, 200, 200];
      mockedReturnHeadersCollection = [{}, {}, {}];
      mockedAuthToken = "testAuthToken1234";
      mockedAuthTokenElapsedTime = 1612184400000;
      mockedNow = 1612098060000;
      assetId = "testAsset";
    });

    let exec = async () => {
      //Mocking Token Manager
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance() as any;
      mockedMindSphereTokenManager._token = mockedAuthToken;
      mockedMindSphereTokenManager._tokenExpireUnixDate = mockedAuthTokenElapsedTime;

      //Getting instance of service
      mindSphereAssetService = MindSphereAssetService.getInstance();

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereAssetService.checkIfAssetExists(assetId);
    };

    it("should properly call MindSphere Get Assets API only once despite more pages and return eTag value - if assets are present in response", async () => {
      let result = await exec();

      expect(result).toEqual(1);

      //Call only once - despite there are more pages
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            assetId: assetId,
          },
        },
      });
    });

    it("should properly call MindSphere Get Assets API only once and return eTag value - if there are only one page", async () => {
      mockedReturnDataCollection = [
        {
          _embedded: {
            assets: [
              { name: "fakeAsset1", etag: 1 },
              { name: "fakeAsset2", etag: 2 },
              { name: "fakeAsset3", etag: 3 },
            ],
          },
          _links: {
            first: {
              href: "firstLink1",
            },
            self: {
              href: "selfLink1",
            },
            next: {
              href: "nextLink1",
            },
            last: {
              href: "lastLink1",
            },
          },
          page: {
            size: 3,
            totalElements: 3,
            totalPages: 1,
            number: 0,
          },
        },
      ];

      let result = await exec();

      expect(result).toEqual(1);

      //Call only once - despite there are more pages
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            assetId: assetId,
          },
        },
      });
    });

    it("should properly call MindSphere Get Assets API only once and return eTag value - if there is only one asset in response", async () => {
      mockedReturnDataCollection = [
        {
          _embedded: {
            assets: [{ name: "fakeAsset1", etag: 1 }],
          },
          _links: {
            first: {
              href: "firstLink1",
            },
            self: {
              href: "selfLink1",
            },
            next: {
              href: "nextLink1",
            },
            last: {
              href: "lastLink1",
            },
          },
          page: {
            size: 3,
            totalElements: 1,
            totalPages: 1,
            number: 0,
          },
        },
      ];

      let result = await exec();

      expect(result).toEqual(1);

      //Call only once - despite there are more pages
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            assetId: assetId,
          },
        },
      });
    });

    it("should properly call MindSphere Get Assets API only once and return null - if there is null response", async () => {
      mockedReturnDataCollection = [
        null,
        {
          _embedded: {
            assets: [
              { name: "fakeAsset4", etag: 4 },
              { name: "fakeAsset5", etag: 5 },
              { name: "fakeAsset6", etag: 6 },
            ],
          },
          _links: {
            first: {
              href: "firstLink2",
            },
            self: {
              href: "selfLink2",
            },
            next: {
              href: "nextLink2",
            },
            last: {
              href: "lastLink2",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 1,
          },
        },
        {
          _embedded: {
            assets: [
              { name: "fakeAsset7", etag: 7 },
              { name: "fakeAsset8", etag: 8 },
              { name: "fakeAsset9", etag: 9 },
            ],
          },
          _links: {
            first: {
              href: "firstLink3",
            },
            self: {
              href: "selfLink3",
            },
            next: {
              href: "nextLink3",
            },
            last: {
              href: "lastLink3",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 2,
          },
        },
      ];
      let result = await exec();

      expect(result).toEqual(null);

      //Call only once - despite there are more pages
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            assetId: assetId,
          },
        },
      });
    });

    it("should properly call MindSphere Get Assets API only once and return null - if there is no _embedded in response", async () => {
      mockedReturnDataCollection = [
        {},
        {
          _embedded: {
            assets: [
              { name: "fakeAsset4", etag: 4 },
              { name: "fakeAsset5", etag: 5 },
              { name: "fakeAsset6", etag: 6 },
            ],
          },
          _links: {
            first: {
              href: "firstLink2",
            },
            self: {
              href: "selfLink2",
            },
            next: {
              href: "nextLink2",
            },
            last: {
              href: "lastLink2",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 1,
          },
        },
        {
          _embedded: {
            assets: [
              { name: "fakeAsset7", etag: 7 },
              { name: "fakeAsset8", etag: 8 },
              { name: "fakeAsset9", etag: 9 },
            ],
          },
          _links: {
            first: {
              href: "firstLink3",
            },
            self: {
              href: "selfLink3",
            },
            next: {
              href: "nextLink3",
            },
            last: {
              href: "lastLink3",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 2,
          },
        },
      ];
      let result = await exec();

      expect(result).toEqual(null);

      //Call only once - despite there are more pages
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            assetId: assetId,
          },
        },
      });
    });

    it("should properly call MindSphere Get Assets API only once and return null - if there is no _embedded.assets in response", async () => {
      mockedReturnDataCollection = [
        {
          _embedded: {},
          _links: {
            first: {
              href: "firstLink1",
            },
            self: {
              href: "selfLink1",
            },
            next: {
              href: "nextLink1",
            },
            last: {
              href: "lastLink1",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 0,
          },
        },
        {
          _embedded: {
            assets: [
              { name: "fakeAsset4", etag: 4 },
              { name: "fakeAsset5", etag: 5 },
              { name: "fakeAsset6", etag: 6 },
            ],
          },
          _links: {
            first: {
              href: "firstLink2",
            },
            self: {
              href: "selfLink2",
            },
            next: {
              href: "nextLink2",
            },
            last: {
              href: "lastLink2",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 1,
          },
        },
        {
          _embedded: {
            assets: [
              { name: "fakeAsset7", etag: 7 },
              { name: "fakeAsset8", etag: 8 },
              { name: "fakeAsset9", etag: 9 },
            ],
          },
          _links: {
            first: {
              href: "firstLink3",
            },
            self: {
              href: "selfLink3",
            },
            next: {
              href: "nextLink3",
            },
            last: {
              href: "lastLink3",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 2,
          },
        },
      ];
      let result = await exec();

      expect(result).toEqual(null);

      //Call only once - despite there are more pages
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            assetId: assetId,
          },
        },
      });
    });

    it("should properly call MindSphere Get Assets API only once and return null - if _embedded.assets is not an array", async () => {
      mockedReturnDataCollection = [
        {
          _embedded: {
            assets: 1234,
          },
          _links: {
            first: {
              href: "firstLink1",
            },
            self: {
              href: "selfLink1",
            },
            next: {
              href: "nextLink1",
            },
            last: {
              href: "lastLink1",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 0,
          },
        },
        {
          _embedded: {
            assets: [
              { name: "fakeAsset4", etag: 4 },
              { name: "fakeAsset5", etag: 5 },
              { name: "fakeAsset6", etag: 6 },
            ],
          },
          _links: {
            first: {
              href: "firstLink2",
            },
            self: {
              href: "selfLink2",
            },
            next: {
              href: "nextLink2",
            },
            last: {
              href: "lastLink2",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 1,
          },
        },
        {
          _embedded: {
            assets: [
              { name: "fakeAsset7", etag: 7 },
              { name: "fakeAsset8", etag: 8 },
              { name: "fakeAsset9", etag: 9 },
            ],
          },
          _links: {
            first: {
              href: "firstLink3",
            },
            self: {
              href: "selfLink3",
            },
            next: {
              href: "nextLink3",
            },
            last: {
              href: "lastLink3",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 2,
          },
        },
      ];
      let result = await exec();

      expect(result).toEqual(null);

      //Call only once - despite there are more pages
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            assetId: assetId,
          },
        },
      });
    });

    it("should properly call MindSphere Get Assets API only once and return null - if first asset has no etag property", async () => {
      mockedReturnDataCollection = [
        {
          _embedded: {
            assets: [
              { name: "fakeAsset1" },
              { name: "fakeAsset2", etag: 2 },
              { name: "fakeAsset3", etag: 3 },
            ],
          },
          _links: {
            first: {
              href: "firstLink1",
            },
            self: {
              href: "selfLink1",
            },
            next: {
              href: "nextLink1",
            },
            last: {
              href: "lastLink1",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 0,
          },
        },
        ,
        {
          _embedded: {
            assets: [
              { name: "fakeAsset4", etag: 4 },
              { name: "fakeAsset5", etag: 5 },
              { name: "fakeAsset6", etag: 6 },
            ],
          },
          _links: {
            first: {
              href: "firstLink2",
            },
            self: {
              href: "selfLink2",
            },
            next: {
              href: "nextLink2",
            },
            last: {
              href: "lastLink2",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 1,
          },
        },
        {
          _embedded: {
            assets: [
              { name: "fakeAsset7", etag: 7 },
              { name: "fakeAsset8", etag: 8 },
              { name: "fakeAsset9", etag: 9 },
            ],
          },
          _links: {
            first: {
              href: "firstLink3",
            },
            self: {
              href: "selfLink3",
            },
            next: {
              href: "nextLink3",
            },
            last: {
              href: "lastLink3",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 2,
          },
        },
      ];
      let result = await exec();

      expect(result).toEqual(null);

      //Call only once - despite there are more pages
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            assetId: assetId,
          },
        },
      });
    });

    it("should throw if first api call throws an error", async () => {
      mockedAxios.__setMockError("testError");

      await expect(exec()).rejects.toEqual("testError");

      //Call only once
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            assetId: assetId,
          },
        },
      });
    });

    it("should fetch token first - if token has not been fetched before and than get and return the event", async () => {
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

      mockedReturnStatusCollection = [200, ...mockedReturnStatusCollection];

      let result = await exec();

      expect(result).toEqual(1);

      //Axios request should have been called two times - fetching token and calling api
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

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            assetId: assetId,
          },
        },
      });
    });

    it("should fetch token first - if token has expired and than get and return the event", async () => {
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

      mockedReturnStatusCollection = [200, ...mockedReturnStatusCollection];

      let result = await exec();

      expect(result).toEqual(1);

      //Axios request should have been called two times - fetching token and calling api
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

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            assetId: assetId,
          },
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

  describe("getAssets", () => {
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereAssetService: MindSphereAssetService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let parentId: string | null;
    let name: string | null;
    let assetType: string | null;

    beforeEach(() => {
      mockedReturnDataCollection = [
        {
          _embedded: {
            assets: [
              { name: "fakeAsset1", etag: 1 },
              { name: "fakeAsset2", etag: 2 },
              { name: "fakeAsset3", etag: 3 },
            ],
          },
          _links: {
            first: {
              href: "firstLink1",
            },
            self: {
              href: "selfLink1",
            },
            next: {
              href: "nextLink1",
            },
            last: {
              href: "lastLink1",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 0,
          },
        },
        {
          _embedded: {
            assets: [
              { name: "fakeAsset4", etag: 4 },
              { name: "fakeAsset5", etag: 5 },
              { name: "fakeAsset6", etag: 6 },
            ],
          },
          _links: {
            first: {
              href: "firstLink2",
            },
            self: {
              href: "selfLink2",
            },
            next: {
              href: "nextLink2",
            },
            last: {
              href: "lastLink2",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 1,
          },
        },
        {
          _embedded: {
            assets: [
              { name: "fakeAsset7", etag: 7 },
              { name: "fakeAsset8", etag: 8 },
              { name: "fakeAsset9", etag: 9 },
            ],
          },
          _links: {
            first: {
              href: "firstLink3",
            },
            self: {
              href: "selfLink3",
            },
            next: {
              href: "nextLink3",
            },
            last: {
              href: "lastLink3",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 2,
          },
        },
      ];
      mockedReturnStatusCollection = [200, 200, 200];
      mockedReturnHeadersCollection = [{}, {}, {}];
      mockedAuthToken = "testAuthToken1234";
      mockedAuthTokenElapsedTime = 1612184400000;
      mockedNow = 1612098060000;
      name = "testAssetName";
      parentId = "testParentId";
      assetType = "testAssetType";
    });

    let exec = async () => {
      //Mocking Token Manager
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance() as any;
      mockedMindSphereTokenManager._token = mockedAuthToken;
      mockedMindSphereTokenManager._tokenExpireUnixDate = mockedAuthTokenElapsedTime;

      //Getting instance of service
      mindSphereAssetService = MindSphereAssetService.getInstance();

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereAssetService.getAssets(name, parentId, assetType);
    };

    it("should properly call MindSphere Get Assets API for every page and return all assets from all pages - if there is more than one page", async () => {
      let result = await exec();

      expect(result).toEqual([
        { name: "fakeAsset1", etag: 1 },
        { name: "fakeAsset2", etag: 2 },
        { name: "fakeAsset3", etag: 3 },
        { name: "fakeAsset4", etag: 4 },
        { name: "fakeAsset5", etag: 5 },
        { name: "fakeAsset6", etag: 6 },
        { name: "fakeAsset7", etag: 7 },
        { name: "fakeAsset8", etag: 8 },
        { name: "fakeAsset9", etag: 9 },
      ]);

      //Call three times - for every page
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            parentId: parentId,
            name: name,
            typeId: assetType,
          },
          size: 100,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `nextLink1`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });

      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "GET",
        url: `nextLink2`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });
    });

    it("should properly call MindSphere Get Assets API and return assets from only one page - if there is only one page", async () => {
      mockedReturnDataCollection = [
        {
          _embedded: {
            assets: [
              { name: "fakeAsset1", etag: 1 },
              { name: "fakeAsset2", etag: 2 },
              { name: "fakeAsset3", etag: 3 },
            ],
          },
          _links: {
            first: {
              href: "firstLink1",
            },
            self: {
              href: "selfLink1",
            },
            next: {
              href: "nextLink1",
            },
            last: {
              href: "lastLink1",
            },
          },
          page: {
            size: 3,
            totalElements: 3,
            totalPages: 1,
            number: 0,
          },
        },
      ];

      let result = await exec();

      expect(result).toEqual([
        { name: "fakeAsset1", etag: 1 },
        { name: "fakeAsset2", etag: 2 },
        { name: "fakeAsset3", etag: 3 },
      ]);

      //Call three times - for every page
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            parentId: parentId,
            name: name,
            typeId: assetType,
          },
          size: 100,
        },
      });
    });

    it("should properly call MindSphere Get Assets API for every page and return all assets from all pages - if there is no href in next link in one of pages", async () => {
      mockedReturnDataCollection = [
        {
          _embedded: {
            assets: [
              { name: "fakeAsset1", etag: 1 },
              { name: "fakeAsset2", etag: 2 },
              { name: "fakeAsset3", etag: 3 },
            ],
          },
          _links: {
            first: {
              href: "firstLink1",
            },
            self: {
              href: "selfLink1",
            },
            next: {
              href: "nextLink1",
            },
            last: {
              href: "lastLink1",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 0,
          },
        },
        {
          _embedded: {
            assets: [
              { name: "fakeAsset4", etag: 4 },
              { name: "fakeAsset5", etag: 5 },
              { name: "fakeAsset6", etag: 6 },
            ],
          },
          _links: {
            first: {
              href: "firstLink2",
            },
            self: {
              href: "selfLink2",
            },
            next: {},
            last: {
              href: "lastLink2",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 1,
          },
        },
        {
          _embedded: {
            assets: [
              { name: "fakeAsset7", etag: 7 },
              { name: "fakeAsset8", etag: 8 },
              { name: "fakeAsset9", etag: 9 },
            ],
          },
          _links: {
            first: {
              href: "firstLink3",
            },
            self: {
              href: "selfLink3",
            },
            next: {
              href: "nextLink3",
            },
            last: {
              href: "lastLink3",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 2,
          },
        },
      ];

      let result = await exec();

      expect(result).toEqual([
        { name: "fakeAsset1", etag: 1 },
        { name: "fakeAsset2", etag: 2 },
        { name: "fakeAsset3", etag: 3 },
        { name: "fakeAsset4", etag: 4 },
        { name: "fakeAsset5", etag: 5 },
        { name: "fakeAsset6", etag: 6 },
      ]);

      //Call three times - for every page
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            parentId: parentId,
            name: name,
            typeId: assetType,
          },
          size: 100,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `nextLink1`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });
    });

    it("should properly call MindSphere Get Assets API for every page and return all assets from all pages - if there is no next link in one of pages", async () => {
      mockedReturnDataCollection = [
        {
          _embedded: {
            assets: [
              { name: "fakeAsset1", etag: 1 },
              { name: "fakeAsset2", etag: 2 },
              { name: "fakeAsset3", etag: 3 },
            ],
          },
          _links: {
            first: {
              href: "firstLink1",
            },
            self: {
              href: "selfLink1",
            },
            next: {
              href: "nextLink1",
            },
            last: {
              href: "lastLink1",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 0,
          },
        },
        {
          _embedded: {
            assets: [
              { name: "fakeAsset4", etag: 4 },
              { name: "fakeAsset5", etag: 5 },
              { name: "fakeAsset6", etag: 6 },
            ],
          },
          _links: {
            first: {
              href: "firstLink2",
            },
            self: {
              href: "selfLink2",
            },
            last: {
              href: "lastLink2",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 1,
          },
        },
        {
          _embedded: {
            assets: [
              { name: "fakeAsset7", etag: 7 },
              { name: "fakeAsset8", etag: 8 },
              { name: "fakeAsset9", etag: 9 },
            ],
          },
          _links: {
            first: {
              href: "firstLink3",
            },
            self: {
              href: "selfLink3",
            },
            next: {
              href: "nextLink3",
            },
            last: {
              href: "lastLink3",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 2,
          },
        },
      ];

      let result = await exec();

      expect(result).toEqual([
        { name: "fakeAsset1", etag: 1 },
        { name: "fakeAsset2", etag: 2 },
        { name: "fakeAsset3", etag: 3 },
        { name: "fakeAsset4", etag: 4 },
        { name: "fakeAsset5", etag: 5 },
        { name: "fakeAsset6", etag: 6 },
      ]);

      //Call three times - for every page
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            parentId: parentId,
            name: name,
            typeId: assetType,
          },
          size: 100,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `nextLink1`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });
    });

    it("should properly call MindSphere Get Assets API for every page and return all assets from all pages - if there is no _links in one of pages", async () => {
      mockedReturnDataCollection = [
        {
          _embedded: {
            assets: [
              { name: "fakeAsset1", etag: 1 },
              { name: "fakeAsset2", etag: 2 },
              { name: "fakeAsset3", etag: 3 },
            ],
          },
          _links: {
            first: {
              href: "firstLink1",
            },
            self: {
              href: "selfLink1",
            },
            next: {
              href: "nextLink1",
            },
            last: {
              href: "lastLink1",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 0,
          },
        },
        {
          _embedded: {
            assets: [
              { name: "fakeAsset4", etag: 4 },
              { name: "fakeAsset5", etag: 5 },
              { name: "fakeAsset6", etag: 6 },
            ],
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 1,
          },
        },
        {
          _embedded: {
            assets: [
              { name: "fakeAsset7", etag: 7 },
              { name: "fakeAsset8", etag: 8 },
              { name: "fakeAsset9", etag: 9 },
            ],
          },
          _links: {
            first: {
              href: "firstLink3",
            },
            self: {
              href: "selfLink3",
            },
            next: {
              href: "nextLink3",
            },
            last: {
              href: "lastLink3",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 2,
          },
        },
      ];

      let result = await exec();

      expect(result).toEqual([
        { name: "fakeAsset1", etag: 1 },
        { name: "fakeAsset2", etag: 2 },
        { name: "fakeAsset3", etag: 3 },
        { name: "fakeAsset4", etag: 4 },
        { name: "fakeAsset5", etag: 5 },
        { name: "fakeAsset6", etag: 6 },
      ]);

      //Call three times - for every page
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            parentId: parentId,
            name: name,
            typeId: assetType,
          },
          size: 100,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `nextLink1`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });
    });

    it("should properly call MindSphere Get Assets API for every page and return all assets from all pages - if there is no page number in one of pages", async () => {
      mockedReturnDataCollection = [
        {
          _embedded: {
            assets: [
              { name: "fakeAsset1", etag: 1 },
              { name: "fakeAsset2", etag: 2 },
              { name: "fakeAsset3", etag: 3 },
            ],
          },
          _links: {
            first: {
              href: "firstLink1",
            },
            self: {
              href: "selfLink1",
            },
            next: {
              href: "nextLink1",
            },
            last: {
              href: "lastLink1",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 0,
          },
        },
        {
          _embedded: {
            assets: [
              { name: "fakeAsset4", etag: 4 },
              { name: "fakeAsset5", etag: 5 },
              { name: "fakeAsset6", etag: 6 },
            ],
          },
          _links: {
            first: {
              href: "firstLink2",
            },
            self: {
              href: "selfLink2",
            },
            next: {
              href: "nextLink2",
            },
            last: {
              href: "lastLink2",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
          },
        },
        {
          _embedded: {
            assets: [
              { name: "fakeAsset7", etag: 7 },
              { name: "fakeAsset8", etag: 8 },
              { name: "fakeAsset9", etag: 9 },
            ],
          },
          _links: {
            first: {
              href: "firstLink3",
            },
            self: {
              href: "selfLink3",
            },
            next: {
              href: "nextLink3",
            },
            last: {
              href: "lastLink3",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 2,
          },
        },
      ];

      let result = await exec();

      expect(result).toEqual([
        { name: "fakeAsset1", etag: 1 },
        { name: "fakeAsset2", etag: 2 },
        { name: "fakeAsset3", etag: 3 },
        { name: "fakeAsset4", etag: 4 },
        { name: "fakeAsset5", etag: 5 },
        { name: "fakeAsset6", etag: 6 },
      ]);

      //Call three times - for every page
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            parentId: parentId,
            name: name,
            typeId: assetType,
          },
          size: 100,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `nextLink1`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });
    });

    it("should properly call MindSphere Get Assets API for every page and return all assets from all pages - if there is no total pages in one of pages", async () => {
      mockedReturnDataCollection = [
        {
          _embedded: {
            assets: [
              { name: "fakeAsset1", etag: 1 },
              { name: "fakeAsset2", etag: 2 },
              { name: "fakeAsset3", etag: 3 },
            ],
          },
          _links: {
            first: {
              href: "firstLink1",
            },
            self: {
              href: "selfLink1",
            },
            next: {
              href: "nextLink1",
            },
            last: {
              href: "lastLink1",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 0,
          },
        },
        {
          _embedded: {
            assets: [
              { name: "fakeAsset4", etag: 4 },
              { name: "fakeAsset5", etag: 5 },
              { name: "fakeAsset6", etag: 6 },
            ],
          },
          _links: {
            first: {
              href: "firstLink2",
            },
            self: {
              href: "selfLink2",
            },
            next: {
              href: "nextLink2",
            },
            last: {
              href: "lastLink2",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            number: 1,
          },
        },
        {
          _embedded: {
            assets: [
              { name: "fakeAsset7", etag: 7 },
              { name: "fakeAsset8", etag: 8 },
              { name: "fakeAsset9", etag: 9 },
            ],
          },
          _links: {
            first: {
              href: "firstLink3",
            },
            self: {
              href: "selfLink3",
            },
            next: {
              href: "nextLink3",
            },
            last: {
              href: "lastLink3",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 2,
          },
        },
      ];

      let result = await exec();

      expect(result).toEqual([
        { name: "fakeAsset1", etag: 1 },
        { name: "fakeAsset2", etag: 2 },
        { name: "fakeAsset3", etag: 3 },
        { name: "fakeAsset4", etag: 4 },
        { name: "fakeAsset5", etag: 5 },
        { name: "fakeAsset6", etag: 6 },
      ]);

      //Call three times - for every page
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            parentId: parentId,
            name: name,
            typeId: assetType,
          },
          size: 100,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `nextLink1`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });
    });

    it("should properly call MindSphere Get Assets API for every page and return all assets from all pages - if there is no pages in one page", async () => {
      mockedReturnDataCollection = [
        {
          _embedded: {
            assets: [
              { name: "fakeAsset1", etag: 1 },
              { name: "fakeAsset2", etag: 2 },
              { name: "fakeAsset3", etag: 3 },
            ],
          },
          _links: {
            first: {
              href: "firstLink1",
            },
            self: {
              href: "selfLink1",
            },
            next: {
              href: "nextLink1",
            },
            last: {
              href: "lastLink1",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 0,
          },
        },
        {
          _embedded: {
            assets: [
              { name: "fakeAsset4", etag: 4 },
              { name: "fakeAsset5", etag: 5 },
              { name: "fakeAsset6", etag: 6 },
            ],
          },
          _links: {
            first: {
              href: "firstLink2",
            },
            self: {
              href: "selfLink2",
            },
            next: {
              href: "nextLink2",
            },
            last: {
              href: "lastLink2",
            },
          },
        },
        {
          _embedded: {
            assets: [
              { name: "fakeAsset7", etag: 7 },
              { name: "fakeAsset8", etag: 8 },
              { name: "fakeAsset9", etag: 9 },
            ],
          },
          _links: {
            first: {
              href: "firstLink3",
            },
            self: {
              href: "selfLink3",
            },
            next: {
              href: "nextLink3",
            },
            last: {
              href: "lastLink3",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 2,
          },
        },
      ];

      let result = await exec();

      expect(result).toEqual([
        { name: "fakeAsset1", etag: 1 },
        { name: "fakeAsset2", etag: 2 },
        { name: "fakeAsset3", etag: 3 },
        { name: "fakeAsset4", etag: 4 },
        { name: "fakeAsset5", etag: 5 },
        { name: "fakeAsset6", etag: 6 },
      ]);

      //Call three times - for every page
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            parentId: parentId,
            name: name,
            typeId: assetType,
          },
          size: 100,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `nextLink1`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });
    });

    it("should properly call MindSphere Get Assets API for every page and return all assets from all pages - if one page is null response", async () => {
      mockedReturnDataCollection = [
        {
          _embedded: {
            assets: [
              { name: "fakeAsset1", etag: 1 },
              { name: "fakeAsset2", etag: 2 },
              { name: "fakeAsset3", etag: 3 },
            ],
          },
          _links: {
            first: {
              href: "firstLink1",
            },
            self: {
              href: "selfLink1",
            },
            next: {
              href: "nextLink1",
            },
            last: {
              href: "lastLink1",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 0,
          },
        },
        null,
        {
          _embedded: {
            assets: [
              { name: "fakeAsset7", etag: 7 },
              { name: "fakeAsset8", etag: 8 },
              { name: "fakeAsset9", etag: 9 },
            ],
          },
          _links: {
            first: {
              href: "firstLink3",
            },
            self: {
              href: "selfLink3",
            },
            next: {
              href: "nextLink3",
            },
            last: {
              href: "lastLink3",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 2,
          },
        },
      ];

      let result = await exec();

      expect(result).toEqual([
        { name: "fakeAsset1", etag: 1 },
        { name: "fakeAsset2", etag: 2 },
        { name: "fakeAsset3", etag: 3 },
      ]);

      //Call three times - for every page
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            parentId: parentId,
            name: name,
            typeId: assetType,
          },
          size: 100,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `nextLink1`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });
    });

    it("should not take one page into account - if assets array is empty in this page", async () => {
      mockedReturnDataCollection = [
        {
          _embedded: {
            assets: [
              { name: "fakeAsset1", etag: 1 },
              { name: "fakeAsset2", etag: 2 },
              { name: "fakeAsset3", etag: 3 },
            ],
          },
          _links: {
            first: {
              href: "firstLink1",
            },
            self: {
              href: "selfLink1",
            },
            next: {
              href: "nextLink1",
            },
            last: {
              href: "lastLink1",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 0,
          },
        },
        {
          _embedded: {
            assets: [],
          },
          _links: {
            first: {
              href: "firstLink2",
            },
            self: {
              href: "selfLink2",
            },
            next: {
              href: "nextLink2",
            },
            last: {
              href: "lastLink2",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 1,
          },
        },
        {
          _embedded: {
            assets: [
              { name: "fakeAsset7", etag: 7 },
              { name: "fakeAsset8", etag: 8 },
              { name: "fakeAsset9", etag: 9 },
            ],
          },
          _links: {
            first: {
              href: "firstLink3",
            },
            self: {
              href: "selfLink3",
            },
            next: {
              href: "nextLink3",
            },
            last: {
              href: "lastLink3",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 2,
          },
        },
      ];

      let result = await exec();

      expect(result).toEqual([
        { name: "fakeAsset1", etag: 1 },
        { name: "fakeAsset2", etag: 2 },
        { name: "fakeAsset3", etag: 3 },
        { name: "fakeAsset7", etag: 7 },
        { name: "fakeAsset8", etag: 8 },
        { name: "fakeAsset9", etag: 9 },
      ]);

      //Call three times - for every page
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            parentId: parentId,
            name: name,
            typeId: assetType,
          },
          size: 100,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `nextLink1`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });

      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "GET",
        url: `nextLink2`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });
    });

    it("should not take one page into account - if assets is not na array in one page", async () => {
      mockedReturnDataCollection = [
        {
          _embedded: {
            assets: [
              { name: "fakeAsset1", etag: 1 },
              { name: "fakeAsset2", etag: 2 },
              { name: "fakeAsset3", etag: 3 },
            ],
          },
          _links: {
            first: {
              href: "firstLink1",
            },
            self: {
              href: "selfLink1",
            },
            next: {
              href: "nextLink1",
            },
            last: {
              href: "lastLink1",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 0,
          },
        },
        {
          _embedded: {
            assets: 1234,
          },
          _links: {
            first: {
              href: "firstLink2",
            },
            self: {
              href: "selfLink2",
            },
            next: {
              href: "nextLink2",
            },
            last: {
              href: "lastLink2",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 1,
          },
        },
        {
          _embedded: {
            assets: [
              { name: "fakeAsset7", etag: 7 },
              { name: "fakeAsset8", etag: 8 },
              { name: "fakeAsset9", etag: 9 },
            ],
          },
          _links: {
            first: {
              href: "firstLink3",
            },
            self: {
              href: "selfLink3",
            },
            next: {
              href: "nextLink3",
            },
            last: {
              href: "lastLink3",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 2,
          },
        },
      ];

      let result = await exec();

      expect(result).toEqual([
        { name: "fakeAsset1", etag: 1 },
        { name: "fakeAsset2", etag: 2 },
        { name: "fakeAsset3", etag: 3 },
        { name: "fakeAsset7", etag: 7 },
        { name: "fakeAsset8", etag: 8 },
        { name: "fakeAsset9", etag: 9 },
      ]);

      //Call three times - for every page
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            parentId: parentId,
            name: name,
            typeId: assetType,
          },
          size: 100,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `nextLink1`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });

      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "GET",
        url: `nextLink2`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });
    });

    it("should not take one page into account - if there is no assets in one page", async () => {
      mockedReturnDataCollection = [
        {
          _embedded: {
            assets: [
              { name: "fakeAsset1", etag: 1 },
              { name: "fakeAsset2", etag: 2 },
              { name: "fakeAsset3", etag: 3 },
            ],
          },
          _links: {
            first: {
              href: "firstLink1",
            },
            self: {
              href: "selfLink1",
            },
            next: {
              href: "nextLink1",
            },
            last: {
              href: "lastLink1",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 0,
          },
        },
        {
          _embedded: {},
          _links: {
            first: {
              href: "firstLink2",
            },
            self: {
              href: "selfLink2",
            },
            next: {
              href: "nextLink2",
            },
            last: {
              href: "lastLink2",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 1,
          },
        },
        {
          _embedded: {
            assets: [
              { name: "fakeAsset7", etag: 7 },
              { name: "fakeAsset8", etag: 8 },
              { name: "fakeAsset9", etag: 9 },
            ],
          },
          _links: {
            first: {
              href: "firstLink3",
            },
            self: {
              href: "selfLink3",
            },
            next: {
              href: "nextLink3",
            },
            last: {
              href: "lastLink3",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 2,
          },
        },
      ];

      let result = await exec();

      expect(result).toEqual([
        { name: "fakeAsset1", etag: 1 },
        { name: "fakeAsset2", etag: 2 },
        { name: "fakeAsset3", etag: 3 },
        { name: "fakeAsset7", etag: 7 },
        { name: "fakeAsset8", etag: 8 },
        { name: "fakeAsset9", etag: 9 },
      ]);

      //Call three times - for every page
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            parentId: parentId,
            name: name,
            typeId: assetType,
          },
          size: 100,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `nextLink1`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });

      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "GET",
        url: `nextLink2`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });
    });

    it("should not take one page into account - if there is no _embedded in one page", async () => {
      mockedReturnDataCollection = [
        {
          _embedded: {
            assets: [
              { name: "fakeAsset1", etag: 1 },
              { name: "fakeAsset2", etag: 2 },
              { name: "fakeAsset3", etag: 3 },
            ],
          },
          _links: {
            first: {
              href: "firstLink1",
            },
            self: {
              href: "selfLink1",
            },
            next: {
              href: "nextLink1",
            },
            last: {
              href: "lastLink1",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 0,
          },
        },
        {
          _links: {
            first: {
              href: "firstLink2",
            },
            self: {
              href: "selfLink2",
            },
            next: {
              href: "nextLink2",
            },
            last: {
              href: "lastLink2",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 1,
          },
        },
        {
          _embedded: {
            assets: [
              { name: "fakeAsset7", etag: 7 },
              { name: "fakeAsset8", etag: 8 },
              { name: "fakeAsset9", etag: 9 },
            ],
          },
          _links: {
            first: {
              href: "firstLink3",
            },
            self: {
              href: "selfLink3",
            },
            next: {
              href: "nextLink3",
            },
            last: {
              href: "lastLink3",
            },
          },
          page: {
            size: 3,
            totalElements: 9,
            totalPages: 3,
            number: 2,
          },
        },
      ];

      let result = await exec();

      expect(result).toEqual([
        { name: "fakeAsset1", etag: 1 },
        { name: "fakeAsset2", etag: 2 },
        { name: "fakeAsset3", etag: 3 },
        { name: "fakeAsset7", etag: 7 },
        { name: "fakeAsset8", etag: 8 },
        { name: "fakeAsset9", etag: 9 },
      ]);

      //Call three times - for every page
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            parentId: parentId,
            name: name,
            typeId: assetType,
          },
          size: 100,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `nextLink1`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });

      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "GET",
        url: `nextLink2`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });
    });

    it("should not include name in filter - if name is null", async () => {
      name = null;

      let result = await exec();

      expect(result).toEqual([
        { name: "fakeAsset1", etag: 1 },
        { name: "fakeAsset2", etag: 2 },
        { name: "fakeAsset3", etag: 3 },
        { name: "fakeAsset4", etag: 4 },
        { name: "fakeAsset5", etag: 5 },
        { name: "fakeAsset6", etag: 6 },
        { name: "fakeAsset7", etag: 7 },
        { name: "fakeAsset8", etag: 8 },
        { name: "fakeAsset9", etag: 9 },
      ]);

      //Call three times - for every page
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            parentId: parentId,
            typeId: assetType,
          },
          size: 100,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `nextLink1`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });

      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "GET",
        url: `nextLink2`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });
    });

    it("should not include parentId in filter - if parentId is null", async () => {
      parentId = null;

      let result = await exec();

      expect(result).toEqual([
        { name: "fakeAsset1", etag: 1 },
        { name: "fakeAsset2", etag: 2 },
        { name: "fakeAsset3", etag: 3 },
        { name: "fakeAsset4", etag: 4 },
        { name: "fakeAsset5", etag: 5 },
        { name: "fakeAsset6", etag: 6 },
        { name: "fakeAsset7", etag: 7 },
        { name: "fakeAsset8", etag: 8 },
        { name: "fakeAsset9", etag: 9 },
      ]);

      //Call three times - for every page
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            name: name,
            typeId: assetType,
          },
          size: 100,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `nextLink1`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });

      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "GET",
        url: `nextLink2`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });
    });

    it("should not include typeId in filter - if typeId is null", async () => {
      assetType = null;

      let result = await exec();

      expect(result).toEqual([
        { name: "fakeAsset1", etag: 1 },
        { name: "fakeAsset2", etag: 2 },
        { name: "fakeAsset3", etag: 3 },
        { name: "fakeAsset4", etag: 4 },
        { name: "fakeAsset5", etag: 5 },
        { name: "fakeAsset6", etag: 6 },
        { name: "fakeAsset7", etag: 7 },
        { name: "fakeAsset8", etag: 8 },
        { name: "fakeAsset9", etag: 9 },
      ]);

      //Call three times - for every page
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            name: name,
            parentId: parentId,
          },
          size: 100,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `nextLink1`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });

      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "GET",
        url: `nextLink2`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });
    });

    it("should not include filter in request - if name, parentId and typeId are null", async () => {
      name = null;
      parentId = null;
      assetType = null;

      let result = await exec();

      expect(result).toEqual([
        { name: "fakeAsset1", etag: 1 },
        { name: "fakeAsset2", etag: 2 },
        { name: "fakeAsset3", etag: 3 },
        { name: "fakeAsset4", etag: 4 },
        { name: "fakeAsset5", etag: 5 },
        { name: "fakeAsset6", etag: 6 },
        { name: "fakeAsset7", etag: 7 },
        { name: "fakeAsset8", etag: 8 },
        { name: "fakeAsset9", etag: 9 },
      ]);

      //Call three times - for every page
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          size: 100,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `nextLink1`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });

      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "GET",
        url: `nextLink2`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });
    });

    it("should throw if first api call throws an error", async () => {
      mockedAxios.__setMockError("testError");

      await expect(exec()).rejects.toEqual("testError");

      //Call only once
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            parentId: parentId,
            name: name,
            typeId: assetType,
          },
          size: 100,
        },
      });
    });

    it("should throw if further api call throws an error", async () => {
      mockedAxios.__setMockError("testError", 2);

      await expect(exec()).rejects.toEqual("testError");

      //Call three times - 3rd throws
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            parentId: parentId,
            name: name,
            typeId: assetType,
          },
          size: 100,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `nextLink1`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });

      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "GET",
        url: `nextLink2`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });
    });

    it("should fetch token first - if token has not been fetched before and than get and return the event", async () => {
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

      mockedReturnStatusCollection = [200, ...mockedReturnStatusCollection];

      let result = await exec();

      expect(result).toEqual([
        { name: "fakeAsset1", etag: 1 },
        { name: "fakeAsset2", etag: 2 },
        { name: "fakeAsset3", etag: 3 },
        { name: "fakeAsset4", etag: 4 },
        { name: "fakeAsset5", etag: 5 },
        { name: "fakeAsset6", etag: 6 },
        { name: "fakeAsset7", etag: 7 },
        { name: "fakeAsset8", etag: 8 },
        { name: "fakeAsset9", etag: 9 },
      ]);

      //Axios request should have been called four times - fetching token and calling api
      expect(mockedAxios.request).toHaveBeenCalledTimes(4);
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
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            parentId: parentId,
            name: name,
            typeId: assetType,
          },
          size: 100,
        },
      });

      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "GET",
        url: `nextLink1`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });

      expect(mockedAxios.request.mock.calls[3][0]).toEqual({
        method: "GET",
        url: `nextLink2`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });
    });

    it("should fetch token first - if token has expired and than get and return the event", async () => {
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

      mockedReturnStatusCollection = [200, ...mockedReturnStatusCollection];

      let result = await exec();

      expect(result).toEqual([
        { name: "fakeAsset1", etag: 1 },
        { name: "fakeAsset2", etag: 2 },
        { name: "fakeAsset3", etag: 3 },
        { name: "fakeAsset4", etag: 4 },
        { name: "fakeAsset5", etag: 5 },
        { name: "fakeAsset6", etag: 6 },
        { name: "fakeAsset7", etag: 7 },
        { name: "fakeAsset8", etag: 8 },
        { name: "fakeAsset9", etag: 9 },
      ]);

      //Axios request should have been called four times - fetching token and calling api
      expect(mockedAxios.request).toHaveBeenCalledTimes(4);
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
        url: `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            parentId: parentId,
            name: name,
            typeId: assetType,
          },
          size: 100,
        },
      });

      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "GET",
        url: `nextLink1`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
      });

      expect(mockedAxios.request.mock.calls[3][0]).toEqual({
        method: "GET",
        url: `nextLink2`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
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

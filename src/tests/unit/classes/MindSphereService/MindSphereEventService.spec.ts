import { MindSphereTokenManager } from "../../../../classes/MindSphereService/MindSphereToken/MindSphereTokenManager";
import axios from "axios";
import {
  MindSphereEventService,
  MindSphereStandardEvent,
} from "../../../../classes/MindSphereService/MindSphereEventService";
import MockDate from "mockdate";
import { testPrivateProperty } from "../../../testUtilities";
import { encodeBase64 } from "../../../../utilities/utilities";

let mockedAxios = axios as any;

describe("MindSphereEventService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    //Reseting static class
    (MindSphereTokenManager as any)._instance = null;
    (MindSphereEventService as any)._instance = null;

    //Reseting axios
    mockedAxios.__reset();
  });

  afterEach(() => {
    jest.clearAllMocks();

    //Reseting static class
    (MindSphereTokenManager as any)._instance = null;
    (MindSphereEventService as any)._instance = null;

    //Reseting axios
    mockedAxios.__reset();
  });

  describe("getInstance", () => {
    let exec = () => {
      return MindSphereEventService.getInstance();
    };

    it("should return valid instance of MindSphereEventService", () => {
      let result = exec();

      expect(result).not.toEqual(null);
      expect(result instanceof MindSphereEventService).toEqual(true);
    });

    it("should return the same instance of MindSphereEventService if called several times", () => {
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
        `https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events`
      );
    });
  });

  describe("getEvent", () => {
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereEventService: MindSphereEventService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let eventId: string;
    let tenantName: string;

    beforeEach(() => {
      mockedReturnDataCollection = [
        {
          id: "testId",
          etag: 123,
          typeId: "FakeEvent",
          timestamp: "2021-01-31T12:58:00.000Z",
          entityId: "fakeEntityID",
          severity: 10,
          description: "fakeDescription",
          code: "fakeCode",
          source: "fakeSource",
          acknowledged: false,
          correlationId: "fakeCorrelationid",
        },
      ];
      mockedReturnStatusCollection = [200];
      mockedReturnHeadersCollection = [{}];
      mockedAuthToken = "testAuthToken1234";
      mockedAuthTokenElapsedTime = 1612184400000;
      mockedNow = 1612098060000;

      eventId = "testEventId";
      tenantName = "testTenantName";
    });

    let exec = async () => {
      //Mocking Token Manager
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance(
        tenantName
      ) as any;
      mockedMindSphereTokenManager._token = mockedAuthToken;
      mockedMindSphereTokenManager._tokenExpireUnixDate = mockedAuthTokenElapsedTime;

      //Getting instance of service
      mindSphereEventService = MindSphereEventService.getInstance();

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereEventService.getEvent(tenantName, eventId);
    };

    it("should return event if it exists", async () => {
      let result = await exec();

      expect(result).toEqual({
        id: "testId",
        etag: 123,
        typeId: "FakeEvent",
        timestamp: "2021-01-31T12:58:00.000Z",
        entityId: "fakeEntityID",
        severity: 10,
        description: "fakeDescription",
        code: "fakeCode",
        source: "fakeSource",
        acknowledged: false,
        correlationId: "fakeCorrelationid",
      });

      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events/${eventId}`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
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
        url: `https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events/${eventId}`,
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
        {
          id: "testId",
          etag: 123,
          typeId: "FakeEvent",
          timestamp: "2021-01-31T12:58:00.000Z",
          entityId: "fakeEntityID",
          severity: 10,
          description: "fakeDescription",
          code: "fakeCode",
          source: "fakeSource",
          acknowledged: false,
          correlationId: "fakeCorrelationid",
        },
      ];

      mockedReturnStatusCollection = [200, 200];

      let result = await exec();

      expect(result).toEqual({
        id: "testId",
        etag: 123,
        typeId: "FakeEvent",
        timestamp: "2021-01-31T12:58:00.000Z",
        entityId: "fakeEntityID",
        severity: 10,
        description: "fakeDescription",
        code: "fakeCode",
        source: "fakeSource",
        acknowledged: false,
        correlationId: "fakeCorrelationid",
      });

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

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events/${eventId}`,
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

        {
          id: "testId",
          etag: 123,
          typeId: "FakeEvent",
          timestamp: "2021-01-31T12:58:00.000Z",
          entityId: "fakeEntityID",
          severity: 10,
          description: "fakeDescription",
          code: "fakeCode",
          source: "fakeSource",
          acknowledged: false,
          correlationId: "fakeCorrelationid",
        },
      ];

      mockedReturnStatusCollection = [200, 200];

      let result = await exec();

      expect(result).toEqual({
        id: "testId",
        etag: 123,
        typeId: "FakeEvent",
        timestamp: "2021-01-31T12:58:00.000Z",
        entityId: "fakeEntityID",
        severity: 10,
        description: "fakeDescription",
        code: "fakeCode",
        source: "fakeSource",
        acknowledged: false,
        correlationId: "fakeCorrelationid",
      });

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

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events/${eventId}`,
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

  describe("getEvents", () => {
    let tenantName: string;
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereEventService: MindSphereEventService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let assetID: string;
    let fromDate: number;
    let toDate: number;
    let source: string | null;

    beforeEach(() => {
      mockedReturnDataCollection = [
        {
          _embedded: {
            events: ["fakeEvent1", "fakeEvent2", "fakeEvent3"],
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
            events: ["fakeEvent4", "fakeEvent5", "fakeEvent6"],
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
            events: ["fakeEvent7", "fakeEvent8", "fakeEvent9"],
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

      assetID = "testAssetId";
      //1581319800000 - "2020-02-10T07:30:00.000Z"
      fromDate = 1581319800000;
      //1581320100000 - "2020-02-10T07:35:00.000Z"
      toDate = 1581320100000;
      source = "testSource";
      tenantName = "testTenantName";
    });

    let exec = async () => {
      //Mocking Token Manager
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance(
        tenantName
      ) as any;
      mockedMindSphereTokenManager._token = mockedAuthToken;
      mockedMindSphereTokenManager._tokenExpireUnixDate = mockedAuthTokenElapsedTime;

      //Getting instance of service
      mindSphereEventService = MindSphereEventService.getInstance();

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereEventService.getEvents(
        tenantName,
        assetID,
        fromDate,
        toDate,
        source
      );
    };

    it("should return all events - if there are more than one page of events", async () => {
      let result = await exec();

      expect(result).toEqual([
        "fakeEvent1",
        "fakeEvent2",
        "fakeEvent3",
        "fakeEvent4",
        "fakeEvent5",
        "fakeEvent6",
        "fakeEvent7",
        "fakeEvent8",
        "fakeEvent9",
      ]);

      //Axios request should have been called three times - getting three pages
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            entityId: assetID,
            timestamp: {
              after: "2020-02-10T07:30:00.000Z",
              before: "2020-02-10T07:35:00.000Z",
            },
            source: source,
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

    it("should return events from one page - if there is only one event page - page number is equal to total pages number -1", async () => {
      mockedReturnDataCollection = [
        {
          _embedded: {
            events: ["fakeEvent1", "fakeEvent2", "fakeEvent3"],
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

      expect(result).toEqual(["fakeEvent1", "fakeEvent2", "fakeEvent3"]);

      //Axios request should have been called only once - while getting the first page
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            entityId: assetID,
            timestamp: {
              after: "2020-02-10T07:30:00.000Z",
              before: "2020-02-10T07:35:00.000Z",
            },
            source: source,
          },
          size: 100,
        },
      });
    });

    it("should return events from one page - if there is no page in response", async () => {
      delete mockedReturnDataCollection[0].page;

      let result = await exec();

      expect(result).toEqual(["fakeEvent1", "fakeEvent2", "fakeEvent3"]);

      //Axios request should have been called only once - while getting the first page
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            entityId: assetID,
            timestamp: {
              after: "2020-02-10T07:30:00.000Z",
              before: "2020-02-10T07:35:00.000Z",
            },
            source: source,
          },
          size: 100,
        },
      });
    });

    it("should return events from one page - if there is no total pages in response", async () => {
      delete mockedReturnDataCollection[0].page.totalPages;

      let result = await exec();

      expect(result).toEqual(["fakeEvent1", "fakeEvent2", "fakeEvent3"]);

      //Axios request should have been called only once - while getting the first page
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            entityId: assetID,
            timestamp: {
              after: "2020-02-10T07:30:00.000Z",
              before: "2020-02-10T07:35:00.000Z",
            },
            source: source,
          },
          size: 100,
        },
      });
    });

    it("should return events from one page - if there is no page number in response", async () => {
      delete mockedReturnDataCollection[0].page.number;

      let result = await exec();

      expect(result).toEqual(["fakeEvent1", "fakeEvent2", "fakeEvent3"]);

      //Axios request should have been called only once - while getting the first page
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            entityId: assetID,
            timestamp: {
              after: "2020-02-10T07:30:00.000Z",
              before: "2020-02-10T07:35:00.000Z",
            },
            source: source,
          },
          size: 100,
        },
      });
    });

    it("should return events from one page - if there is no links in response", async () => {
      delete mockedReturnDataCollection[0]._links;

      let result = await exec();

      expect(result).toEqual(["fakeEvent1", "fakeEvent2", "fakeEvent3"]);

      //Axios request should have been called only once - while getting the first page
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            entityId: assetID,
            timestamp: {
              after: "2020-02-10T07:30:00.000Z",
              before: "2020-02-10T07:35:00.000Z",
            },
            source: source,
          },
          size: 100,
        },
      });
    });

    it("should return events from one page - if there is no next link in response", async () => {
      delete mockedReturnDataCollection[0]._links.next;

      let result = await exec();

      expect(result).toEqual(["fakeEvent1", "fakeEvent2", "fakeEvent3"]);

      //Axios request should have been called only once - while getting the first page
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            entityId: assetID,
            timestamp: {
              after: "2020-02-10T07:30:00.000Z",
              before: "2020-02-10T07:35:00.000Z",
            },
            source: source,
          },
          size: 100,
        },
      });
    });

    it("should return events from one page - if there is no next link href in response", async () => {
      delete mockedReturnDataCollection[0]._links.next.href;

      let result = await exec();

      expect(result).toEqual(["fakeEvent1", "fakeEvent2", "fakeEvent3"]);

      //Axios request should have been called only once - while getting the first page
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            entityId: assetID,
            timestamp: {
              after: "2020-02-10T07:30:00.000Z",
              before: "2020-02-10T07:35:00.000Z",
            },
            source: source,
          },
          size: 100,
        },
      });
    });

    it("should not throw but stop calling further request - if data of one request is null", async () => {
      //null between 2nd and 3rd call
      mockedReturnDataCollection = [
        {
          _embedded: {
            events: ["fakeEvent1", "fakeEvent2", "fakeEvent3"],
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
            events: ["fakeEvent4", "fakeEvent5", "fakeEvent6"],
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
        null,
        {
          _embedded: {
            events: ["fakeEvent7", "fakeEvent8", "fakeEvent9"],
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
        "fakeEvent1",
        "fakeEvent2",
        "fakeEvent3",
        "fakeEvent4",
        "fakeEvent5",
        "fakeEvent6",
      ]);

      //Axios request should have been called three times - getting three pages, 3rd returns null
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            entityId: assetID,
            timestamp: {
              after: "2020-02-10T07:30:00.000Z",
              before: "2020-02-10T07:35:00.000Z",
            },
            source: source,
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

    it("should not include source in filter - if it is null", async () => {
      source = null;

      let result = await exec();

      expect(result).toEqual([
        "fakeEvent1",
        "fakeEvent2",
        "fakeEvent3",
        "fakeEvent4",
        "fakeEvent5",
        "fakeEvent6",
        "fakeEvent7",
        "fakeEvent8",
        "fakeEvent9",
      ]);

      //Axios request should have been called three times - getting three pages
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            entityId: assetID,
            timestamp: {
              after: "2020-02-10T07:30:00.000Z",
              before: "2020-02-10T07:35:00.000Z",
            },
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

    it("should throw if first api call throws an error", async () => {
      mockedAxios.__setMockError("testError");

      await expect(exec()).rejects.toEqual("testError");

      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            entityId: assetID,
            timestamp: {
              after: "2020-02-10T07:30:00.000Z",
              before: "2020-02-10T07:35:00.000Z",
            },
            source: source,
          },
          size: 100,
        },
      });
    });

    it("should throw if further api call throws and error", async () => {
      //thrid call throws
      mockedAxios.__setMockError("testError", 2);

      await expect(exec()).rejects.toEqual("testError");

      //Axios request should have been called three times - getting three pages
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            entityId: assetID,
            timestamp: {
              after: "2020-02-10T07:30:00.000Z",
              before: "2020-02-10T07:35:00.000Z",
            },
            source: source,
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
        "fakeEvent1",
        "fakeEvent2",
        "fakeEvent3",
        "fakeEvent4",
        "fakeEvent5",
        "fakeEvent6",
        "fakeEvent7",
        "fakeEvent8",
        "fakeEvent9",
      ]);

      //Axios request should have been called three times - getting three pages
      expect(mockedAxios.request).toHaveBeenCalledTimes(4);
      let base64Key = encodeBase64(`testClientId:testClientSecret`);
      //First call - fetch token
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

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            entityId: assetID,
            timestamp: {
              after: "2020-02-10T07:30:00.000Z",
              before: "2020-02-10T07:35:00.000Z",
            },
            source: source,
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
        "fakeEvent1",
        "fakeEvent2",
        "fakeEvent3",
        "fakeEvent4",
        "fakeEvent5",
        "fakeEvent6",
        "fakeEvent7",
        "fakeEvent8",
        "fakeEvent9",
      ]);

      //Axios request should have been called three times - getting three pages
      expect(mockedAxios.request).toHaveBeenCalledTimes(4);
      let base64Key = encodeBase64(`testClientId:testClientSecret`);
      //First call - fetch token
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

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        params: {
          filter: {
            entityId: assetID,
            timestamp: {
              after: "2020-02-10T07:30:00.000Z",
              before: "2020-02-10T07:35:00.000Z",
            },
            source: source,
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

  describe("postEvent", () => {
    let tenantName: string;
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereEventService: MindSphereEventService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let eventId: string;
    let eventPayload: MindSphereStandardEvent;

    beforeEach(() => {
      tenantName = "testTenantName";
      mockedReturnDataCollection = [{}];
      mockedReturnStatusCollection = [200];
      mockedReturnHeadersCollection = [{}];
      mockedAuthToken = "testAuthToken1234";
      mockedAuthTokenElapsedTime = 1612184400000;
      mockedNow = 1612098060000;

      eventPayload = {
        id: "testId",
        etag: 123,
        typeId: "FakeEvent",
        timestamp: "2021-01-31T12:58:00.000Z",
        entityId: "fakeEntityID",
        severity: 10,
        description: "fakeDescription",
        code: "fakeCode",
        source: "fakeSource",
        acknowledged: false,
        correlationId: "fakeCorrelationid",
      };
    });

    let exec = async () => {
      //Mocking Token Manager
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance(
        tenantName
      ) as any;
      mockedMindSphereTokenManager._token = mockedAuthToken;
      mockedMindSphereTokenManager._tokenExpireUnixDate = mockedAuthTokenElapsedTime;

      //Getting instance of service
      mindSphereEventService = MindSphereEventService.getInstance();

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereEventService.postEvent(tenantName, eventPayload);
    };

    it("should post event payload to MindSphere", async () => {
      await exec();

      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "POST",
        url: `https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        data: eventPayload,
      });
    });

    it("should set typeId as MindSphereStandardEvent if typeId is not defined", async () => {
      delete eventPayload.typeId;

      await exec();

      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "POST",
        url: `https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        data: {
          ...eventPayload,
          typeId:
            "com.siemens.mindsphere.eventmgmt.event.type.MindSphereStandardEvent",
        },
      });
    });

    it("should throw if api call throws an error", async () => {
      mockedAxios.__setMockError("testError");

      await expect(exec()).rejects.toEqual("testError");

      //Axios request should have been called only once - token had been fetched before
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "POST",
        url: `https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        data: eventPayload,
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

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "POST",
        url: `https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        data: eventPayload,
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

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "POST",
        url: `https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
        },
        data: eventPayload,
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

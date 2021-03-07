import { MindSphereTokenManager } from "../../../../classes/MindSphereService/MindSphereToken/MindSphereTokenManager";
import { testPrivateProperty } from "../../../testUtilities";
import axios from "axios";
import MockDate from "mockdate";
import { encodeBase64 } from "../../../../utilities/utilities";

let mockedAxios = axios as any;

describe("MindSphereService", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    //Reseting static class
    (MindSphereTokenManager as any)._instances = {};

    //Reseting axios
    mockedAxios.__reset();
  });

  afterEach(() => {
    jest.clearAllMocks();

    //Reseting static class
    (MindSphereTokenManager as any)._instances = {};

    //Reseting axios
    mockedAxios.__reset();
  });

  describe("getInstances", () => {
    let tenantName: string;

    beforeEach(() => {
      tenantName = "testTenantName";
    });

    let exec = () => {
      return MindSphereTokenManager.getInstance(tenantName);
    };

    it("should return valid instance of MindSphereTokenManager if it does not exist in instances", () => {
      let result = exec();

      expect(result).not.toEqual(null);
      expect(result instanceof MindSphereTokenManager).toEqual(true);
    });

    it("should return the same instance of MindSphereTokenManager if called several times", () => {
      let result1 = exec();
      let result2 = exec();
      let result3 = exec();

      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
      expect(result3).toEqual(result1);
    });

    it("should properly set up app tenant", () => {
      let result = exec() as any;

      testPrivateProperty(result, "_tenant", "testTenantName");
    });

    it("should properly set up app tenant in more then one token managers", () => {
      tenantName = "testTenant1";
      let result1 = exec();
      tenantName = "testTenant2";
      let result2 = exec();
      tenantName = "testTenant3";
      let result3 = exec();

      testPrivateProperty(result1, "_tenant", "testTenant1");
      testPrivateProperty(result2, "_tenant", "testTenant2");
      testPrivateProperty(result3, "_tenant", "testTenant3");
    });

    it("should properly set up app credentials", () => {
      let result = exec() as any;

      let expectedAppCredentials = {
        clientId: "testClientId",
        clientSecret: "testClientSecret",
        appName: "testAppName",
        appVersion: "testAppVersion",
        appId: "testAppId",
        hostTenant: "testHostTenant",
      };

      testPrivateProperty(result, "_appCredentials", expectedAppCredentials);
    });

    it("should properly set up expire time", () => {
      let result = exec() as any;

      testPrivateProperty(result, "_tokenExpireSpareTime", 1234);
    });
  });

  describe("fetchNewToken", () => {
    let instance: MindSphereTokenManager;
    let tenantName: string;

    beforeEach(() => {
      tenantName = "testTenantName";
    });

    let exec = async () => {
      instance = MindSphereTokenManager.getInstance(tenantName);
      return instance.fetchNewToken();
    };

    it("should fetch new token from the server using proper call", async () => {
      //1611949571000 - Fri Jan 29 2021 20:46:11 GMT+0100 (Central European Standard Time)
      mockedAxios.__setMockResponseData({
        access_token: "testAccessToken",
        timestamp: 1611949571000,
        expires_in: 2000,
      });

      await exec();

      //Token should be fetched and saved
      testPrivateProperty(instance, "_token", "testAccessToken");

      //Expire time should be fetched, calulcated and saved
      let expectedExpireDate = 1611949571000 + 2000 * 1000 - 1234;
      testPrivateProperty(instance, "_tokenExpireUnixDate", expectedExpireDate);

      //Fetching should be performed by calling mindsphere token api with proper headers and credentials
      let base64Key = encodeBase64(`testClientId:testClientSecret`);
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
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
    });

    it("should fetch new token even if token has already been fetched", async () => {
      //1611949571000 - Fri Jan 29 2021 20:46:11 GMT+0100 (Central European Standard Time)
      mockedAxios.__setMockResponseData({
        access_token: "testAccessToken",
        timestamp: 1611949571000,
        expires_in: 2000,
      });

      await exec();

      //Token should be fetched and saved
      testPrivateProperty(instance, "_token", "testAccessToken");

      //Expire time should be fetched, calulcated and saved
      let expectedExpireDate1 = 1611949571000 + 2000 * 1000 - 1234;
      testPrivateProperty(
        instance,
        "_tokenExpireUnixDate",
        expectedExpireDate1
      );

      mockedAxios.__setMockResponseData({
        access_token: "testAccessToken2",
        timestamp: 1611949572000,
        expires_in: 3000,
      });

      await instance.fetchNewToken();

      //Token should be fetched and saved
      testPrivateProperty(instance, "_token", "testAccessToken2");

      //Expire time should be fetched, calulcated and saved
      let expectedExpireDate2 = 1611949572000 + 3000 * 1000 - 1234;
      testPrivateProperty(
        instance,
        "_tokenExpireUnixDate",
        expectedExpireDate2
      );

      //Fetching should be performed by calling mindsphere token api with proper headers and credentials x2
      let base64Key = encodeBase64(`testClientId:testClientSecret`);
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);
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
    });

    it("should throw and do not set new token - if there is an error while calling API", async () => {
      mockedAxios.__setMockError(new Error("testError"));

      await expect(exec()).rejects.toMatchObject({ message: "testError" });

      //token should not be fetched
      //Token should be fetched and saved
      testPrivateProperty(instance, "_token", null);

      //Expire time should be fetched, calulcated and saved
      testPrivateProperty(instance, "_tokenExpireUnixDate", null);
    });

    it("should throw and do not set new token - if result is different than 2xx and calling API rejects", async () => {
      mockedAxios.__setMockError(null);
      mockedAxios.__setMockResponseStatus(400);

      await expect(exec()).rejects.toMatchObject({
        message: "Server responded with status code: 400",
      });

      //token should not be fetched
      //Token should be fetched and saved
      testPrivateProperty(instance, "_token", null);

      //Expire time should be fetched, calulcated and saved
      testPrivateProperty(instance, "_tokenExpireUnixDate", null);
    });

    it("should throw and do not set new token - if there is no access_token in result", async () => {
      //1611949571000 - Fri Jan 29 2021 20:46:11 GMT+0100 (Central European Standard Time)
      mockedAxios.__setMockResponseData({
        timestamp: 1611949571000,
        expires_in: 2000,
      });

      await expect(exec()).rejects.toMatchObject({
        message: "Invalid response content while fetching new token",
      });

      //token should not be fetched
      //Token should be fetched and saved
      testPrivateProperty(instance, "_token", null);

      //Expire time should be fetched, calulcated and saved
      testPrivateProperty(instance, "_tokenExpireUnixDate", null);
    });

    it("should throw and do not set new token - if there is no timestamp in result", async () => {
      mockedAxios.__setMockResponseData({
        access_token: "testAccessToken",
        expires_in: 2000,
      });

      await expect(exec()).rejects.toMatchObject({
        message: "Invalid response content while fetching new token",
      });

      //token should not be fetched
      //Token should be fetched and saved
      testPrivateProperty(instance, "_token", null);

      //Expire time should be fetched, calulcated and saved
      testPrivateProperty(instance, "_tokenExpireUnixDate", null);
    });

    it("should throw and do not set new token - if there is no expires_in in result", async () => {
      mockedAxios.__setMockResponseData({
        access_token: "testAccessToken",
        timestamp: 1611949571000,
      });

      await expect(exec()).rejects.toMatchObject({
        message: "Invalid response content while fetching new token",
      });

      //token should not be fetched
      //Token should be fetched and saved
      testPrivateProperty(instance, "_token", null);

      //Expire time should be fetched, calulcated and saved
      testPrivateProperty(instance, "_tokenExpireUnixDate", null);
    });
  });

  describe("getToken", () => {
    let tenantName: string;
    let instance: MindSphereTokenManager;

    beforeEach(() => {
      tenantName = "testTenantName";
    });

    let exec = async () => {
      instance = MindSphereTokenManager.getInstance(tenantName);
      return instance.getToken();
    };

    it("should fetch new token from the server using proper call and return it - if token has not been fetched before", async () => {
      //1611949571000 - Fri Jan 29 2021 20:46:11 GMT+0100 (Central European Standard Time)
      mockedAxios.__setMockResponseData({
        access_token: "testAccessToken",
        timestamp: 1611949571000,
        expires_in: 2000,
      });

      let result = await exec();

      expect(result).toEqual("testAccessToken");

      //Token should be fetched and saved
      testPrivateProperty(instance, "_token", "testAccessToken");

      //Expire time should be fetched, calulcated and saved
      let expectedExpireDate = 1611949571000 + 2000 * 1000 - 1234;
      testPrivateProperty(instance, "_tokenExpireUnixDate", expectedExpireDate);

      //Fetching should be performed by calling mindsphere token api with proper headers and credentials
      let base64Key = encodeBase64(`testClientId:testClientSecret`);
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
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
    });

    it("should not fetch new token if token has already been fetched and has not expired", async () => {
      //1611949571000 - Fri Jan 29 2021 20:46:11 GMT+0100 (Central European Standard Time)

      //Mocking actual date
      MockDate.set(1611949571000);

      mockedAxios.__setMockResponseData({
        access_token: "testAccessToken",
        timestamp: 1611949571000,
        expires_in: 2000,
      });

      await exec();

      //Mocking actual date - 1234 additional time so expires is 2000*1000 -1234 = 1998766, setting one ms shorter time
      MockDate.set(1611949571000 + 1998765);

      mockedAxios.__setMockResponseData({
        access_token: "testAccessToken2",
        timestamp: Date.now(),
        expires_in: 2000,
      });

      //getting token once again
      let result = await instance.getToken();

      //token should not have been fetched
      expect(result).toEqual("testAccessToken");
      testPrivateProperty(instance, "_token", "testAccessToken");

      //Expire time should be fetched, calulcated and saved
      testPrivateProperty(
        instance,
        "_tokenExpireUnixDate",
        1611949571000 + 1998766
      );

      //Fetching should be preformed only once - at the begining
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);
    });

    it("should fetch new token if token has already been fetched and has expired", async () => {
      //1611949571000 - Fri Jan 29 2021 20:46:11 GMT+0100 (Central European Standard Time)

      //Mocking actual date
      MockDate.set(1611949571000);

      mockedAxios.__setMockResponseData({
        access_token: "testAccessToken",
        timestamp: 1611949571000,
        expires_in: 2000,
      });

      await exec();

      //Mocking actual date - 1234 additional time so expires is 2000*1000 - 1234 = 1998766, setting one ms longer time
      MockDate.set(1611949571000 + 1998767);

      mockedAxios.__setMockResponseData({
        access_token: "testAccessToken2",
        timestamp: Date.now(),
        expires_in: 3000,
      });

      //getting token once again
      let result = await instance.getToken();

      //token should have been fetched
      expect(result).toEqual("testAccessToken2");
      testPrivateProperty(instance, "_token", "testAccessToken2");

      //Expire time should be fetched, calulcated and saved
      testPrivateProperty(
        instance,
        "_tokenExpireUnixDate",
        1611949571000 + 1998767 + 3000 * 1000 - 1234
      );

      //Fetching should be preformed twice - at the begining and when fetching new token
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);
    });

    it("should throw and do not set new token - if there is an error while calling API", async () => {
      mockedAxios.__setMockError(new Error("testError"));

      await expect(exec()).rejects.toMatchObject({ message: "testError" });

      //token should not be fetched
      //Token should be fetched and saved
      testPrivateProperty(instance, "_token", null);

      //Expire time should be fetched, calulcated and saved
      testPrivateProperty(instance, "_tokenExpireUnixDate", null);
    });

    it("should throw and do not set new token - if result is different than 2xx and calling API rejects", async () => {
      mockedAxios.__setMockError(null);
      mockedAxios.__setMockResponseStatus(400);

      await expect(exec()).rejects.toMatchObject({
        message: "Server responded with status code: 400",
      });

      //token should not be fetched
      //Token should be fetched and saved
      testPrivateProperty(instance, "_token", null);

      //Expire time should be fetched, calulcated and saved
      testPrivateProperty(instance, "_tokenExpireUnixDate", null);
    });

    it("should throw and do not set new token - if there is no access_token in result", async () => {
      //1611949571000 - Fri Jan 29 2021 20:46:11 GMT+0100 (Central European Standard Time)
      mockedAxios.__setMockResponseData({
        timestamp: 1611949571000,
        expires_in: 2000,
      });

      await expect(exec()).rejects.toMatchObject({
        message: "Invalid response content while fetching new token",
      });

      //token should not be fetched
      //Token should be fetched and saved
      testPrivateProperty(instance, "_token", null);

      //Expire time should be fetched, calulcated and saved
      testPrivateProperty(instance, "_tokenExpireUnixDate", null);
    });

    it("should throw and do not set new token - if there is no timestamp in result", async () => {
      mockedAxios.__setMockResponseData({
        access_token: "testAccessToken",
        expires_in: 2000,
      });

      await expect(exec()).rejects.toMatchObject({
        message: "Invalid response content while fetching new token",
      });

      //token should not be fetched
      //Token should be fetched and saved
      testPrivateProperty(instance, "_token", null);

      //Expire time should be fetched, calulcated and saved
      testPrivateProperty(instance, "_tokenExpireUnixDate", null);
    });

    it("should throw and do not set new token - if there is no expires_in in result", async () => {
      mockedAxios.__setMockResponseData({
        access_token: "testAccessToken",
        timestamp: 1611949571000,
      });

      await expect(exec()).rejects.toMatchObject({
        message: "Invalid response content while fetching new token",
      });

      //token should not be fetched
      //Token should be fetched and saved
      testPrivateProperty(instance, "_token", null);

      //Expire time should be fetched, calulcated and saved
      testPrivateProperty(instance, "_tokenExpireUnixDate", null);
    });
  });
});

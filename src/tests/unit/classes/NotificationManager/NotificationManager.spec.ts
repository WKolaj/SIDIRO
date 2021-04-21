import { MindSphereFileService } from "../../../../classes/MindSphereService/MindSphereFileService";
import {
  getAllFileNamesFromAsset,
  getFileContent,
  MockedFileServiceContent,
  mockMsFileService,
  setFileContent,
} from "../../../utilities/mockMsFileService";
import logger from "../../../../logger/logger";
import { MindSphereDataStorage } from "../../../../classes/DataStorage/MindSphereDataStorage";
import {
  getPrivateProperty,
  invokePrivateMethod,
  setPrivateProperty,
  testPrivateProperty,
} from "../../../utilities/utilities";
import webpush from "web-push";
import NotificationManager, {
  SubscriberPayload,
} from "../../../../classes/NotificationManager/NotificationManager";

describe("LoadmonitoringService", () => {
  let fileServiceContent: MockedFileServiceContent;
  let logErrorMockFunc: jest.Mock;

  beforeEach(async () => {
    //Clearing MindSphereServices
    (MindSphereFileService as any)._instance = null;

    //Clearing sending mails and notification
    (NotificationManager as any)._instance = null;

    //Reseting throwing by webpush and nodemailer
    (webpush as any).__setThrowOnNotification(null);

    fileServiceContent = {
      hostTenant: {
        notificationsAssetId: {
          "testLoadmonitoringServiceId1.sub.json": [
            {
              language: "pl",
              subscriptionData: {
                endpoint: "testEndpoint11",
                keys: {
                  p256dh: "testKey11",
                  auth: "testAuth11",
                },
              },
            },
            {
              language: "en",
              subscriptionData: {
                endpoint: "testEndpoint12",
                keys: {
                  p256dh: "testKey12",
                  auth: "testAuth12",
                },
              },
            },
            {
              language: "pl",
              subscriptionData: {
                endpoint: "testEndpoint13",
                keys: {
                  p256dh: "testKey13",
                  auth: "testAuth13",
                },
              },
            },
          ],
          "testLoadmonitoringServiceId2.sub.json": [
            {
              language: "pl",
              subscriptionData: {
                endpoint: "testEndpoint21",
                keys: {
                  p256dh: "testKey21",
                  auth: "testAuth21",
                },
              },
            },
            {
              language: "en",
              subscriptionData: {
                endpoint: "testEndpoint22",
                keys: {
                  p256dh: "testKey22",
                  auth: "testAuth22",
                },
              },
            },
            {
              language: "pl",
              subscriptionData: {
                endpoint: "testEndpoint23",
                keys: {
                  p256dh: "testKey23",
                  auth: "testAuth23",
                },
              },
            },
          ],
          "testLoadmonitoringServiceId3.sub.json": [
            {
              language: "pl",
              subscriptionData: {
                endpoint: "testEndpoint31",
                keys: {
                  p256dh: "testKey31",
                  auth: "testAuth31",
                },
              },
            },
            {
              language: "en",
              subscriptionData: {
                endpoint: "testEndpoint32",
                keys: {
                  p256dh: "testKey32",
                  auth: "testAuth32",
                },
              },
            },
            {
              language: "pl",
              subscriptionData: {
                endpoint: "testEndpoint33",
                keys: {
                  p256dh: "testKey33",
                  auth: "testAuth33",
                },
              },
            },
          ],
        },
      },
    };

    jest.clearAllMocks();

    logErrorMockFunc = jest.fn();

    logger.error = logErrorMockFunc;
  });

  afterEach(async () => {
    //Clearing MindSphereServices
    (MindSphereFileService as any)._instance = null;

    //Clearing sending mails and notification
    (NotificationManager as any)._instance = null;

    //Reseting throwing by webpush and nodemailer
    (webpush as any).__setThrowOnNotification(null);

    jest.clearAllMocks();
  });

  const beforeExec = async () => {
    await mockMsFileService(fileServiceContent);
  };

  describe("getInstance", () => {
    let exec = () => {
      return NotificationManager.getInstance();
    };

    it("should return valid instance of NotificationManager", () => {
      let result = exec();

      expect(result).not.toEqual(null);
      expect(result instanceof NotificationManager).toEqual(true);
    });

    it("should return the same instance of NotificationManager if called several times", () => {
      let result1 = exec();
      let result2 = exec();
      let result3 = exec();

      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
      expect(result3).toEqual(result1);
    });

    it("should create and set dataStorage", () => {
      let result = exec();

      let internalDataStorage = getPrivateProperty(
        result,
        "_subscribersStorage"
      ) as MindSphereDataStorage<SubscriberPayload[]>;

      expect(internalDataStorage).toBeDefined();
      expect(internalDataStorage instanceof MindSphereDataStorage).toEqual(
        true
      );
    });

    it("should set proper values of properties", () => {
      let result = exec();

      expect(result.Initialized).toEqual(false);
    });

    it("should not set proper vapid keys - set while initialzing", () => {
      exec();

      let mockedSetVapidDetails = webpush.setVapidDetails as jest.Mock;
      expect(mockedSetVapidDetails).not.toHaveBeenCalled();
    });
  });

  describe("init", () => {
    let notificationManager: NotificationManager;
    let getFileContentThrows: boolean;

    beforeEach(() => {
      getFileContentThrows = false;
    });

    let exec = async () => {
      await beforeExec();

      notificationManager = NotificationManager.getInstance();

      if (getFileContentThrows) {
        let getFileContentMockFunc = jest.fn(async () => {
          throw new Error("test get file content func error");
        });
        MindSphereFileService.getInstance().getFileContent = getFileContentMockFunc;
      }

      return notificationManager.init();
    };

    it("should set initialization flag to true", async () => {
      await exec();

      expect(notificationManager.Initialized).toEqual(true);
    });

    it("should set proper vapid keys", async () => {
      await exec();

      let mockedSetVapidDetails = webpush.setVapidDetails as jest.Mock;
      expect(mockedSetVapidDetails).toHaveBeenCalledTimes(1);
      expect(mockedSetVapidDetails.mock.calls[0]).toEqual([
        `mailto:<testNotification@test.email.com>`,
        "testNotificationPublicKey",
        "testNotificationPrivateKey",
      ]);
    });

    it("should properly fetch all notification details", async () => {
      await exec();

      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(1);
      expect(getAllFileNamesFromAsset.mock.calls[0]).toEqual([
        "hostTenant",
        "notificationsAssetId",
        "sub.json",
      ]);

      expect(getFileContent).toHaveBeenCalledTimes(3);
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "notificationsAssetId",
        "testLoadmonitoringServiceId1.sub.json",
      ]);
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "notificationsAssetId",
        "testLoadmonitoringServiceId2.sub.json",
      ]);
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "notificationsAssetId",
        "testLoadmonitoringServiceId3.sub.json",
      ]);

      let storage = getPrivateProperty(
        notificationManager,
        "_subscribersStorage"
      ) as MindSphereDataStorage<SubscriberPayload[]>;

      let expectedCache = {
        testLoadmonitoringServiceId1: [
          {
            language: "pl",
            subscriptionData: {
              endpoint: "testEndpoint11",
              keys: {
                p256dh: "testKey11",
                auth: "testAuth11",
              },
            },
          },
          {
            language: "en",
            subscriptionData: {
              endpoint: "testEndpoint12",
              keys: {
                p256dh: "testKey12",
                auth: "testAuth12",
              },
            },
          },
          {
            language: "pl",
            subscriptionData: {
              endpoint: "testEndpoint13",
              keys: {
                p256dh: "testKey13",
                auth: "testAuth13",
              },
            },
          },
        ],
        testLoadmonitoringServiceId2: [
          {
            language: "pl",
            subscriptionData: {
              endpoint: "testEndpoint21",
              keys: {
                p256dh: "testKey21",
                auth: "testAuth21",
              },
            },
          },
          {
            language: "en",
            subscriptionData: {
              endpoint: "testEndpoint22",
              keys: {
                p256dh: "testKey22",
                auth: "testAuth22",
              },
            },
          },
          {
            language: "pl",
            subscriptionData: {
              endpoint: "testEndpoint23",
              keys: {
                p256dh: "testKey23",
                auth: "testAuth23",
              },
            },
          },
        ],
        testLoadmonitoringServiceId3: [
          {
            language: "pl",
            subscriptionData: {
              endpoint: "testEndpoint31",
              keys: {
                p256dh: "testKey31",
                auth: "testAuth31",
              },
            },
          },
          {
            language: "en",
            subscriptionData: {
              endpoint: "testEndpoint32",
              keys: {
                p256dh: "testKey32",
                auth: "testAuth32",
              },
            },
          },
          {
            language: "pl",
            subscriptionData: {
              endpoint: "testEndpoint33",
              keys: {
                p256dh: "testKey33",
                auth: "testAuth33",
              },
            },
          },
        ],
      };

      testPrivateProperty(storage, "_cacheData", expectedCache);
    });

    it("should throw and not init NotificationManager - if getFileContent throws", async () => {
      getFileContentThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "test get file content func error",
      });

      //#region ===== CHECKING VAPID DETAILS =====

      let mockedSetVapidDetails = webpush.setVapidDetails as jest.Mock;
      expect(mockedSetVapidDetails).not.toHaveBeenCalled();

      //#endregion ===== CHECKING VAPID DETAILS =====

      //#region ===== CHECKING STORAGE =====

      let storage = getPrivateProperty(
        notificationManager,
        "_subscribersStorage"
      ) as MindSphereDataStorage<SubscriberPayload[]>;

      testPrivateProperty(storage, "_cacheData", {});

      //#endregion ===== CHECKING STORAGE =====

      //#region ===== CHECKING INITIALIZATION FLAG =====

      expect(notificationManager.Initialized).toEqual(false);

      //#endregion ===== CHECKING INITIALIZATION FLAG =====
    });
  });

  describe("sendNotification", () => {
    let notificationManager: NotificationManager;
    let initNotificationManager: boolean;
    let subscriptionData: webpush.PushSubscription;
    let content: string;

    beforeEach(() => {
      initNotificationManager = true;
      subscriptionData = {
        endpoint: "testEndpoint1",
        keys: {
          auth: "testAuth1",
          p256dh: "testPass1",
        },
      };
      content = "Test content 1";
    });

    let exec = async () => {
      await beforeExec();

      notificationManager = NotificationManager.getInstance();

      if (initNotificationManager) await notificationManager.init();

      return notificationManager.sendNotification(subscriptionData, content);
    };

    it("should invoke webpush sendNotification method", async () => {
      await exec();

      let sendNotificationMock = webpush.sendNotification as jest.Mock;
      expect(sendNotificationMock).toHaveBeenCalledTimes(1);
      expect(sendNotificationMock.mock.calls[0]).toEqual([
        subscriptionData,
        content,
      ]);
    });

    it("should throw and not invoke webpush sendNotification method - if notificationManager has not been initialized", async () => {
      initNotificationManager = false;

      await expect(exec()).rejects.toMatchObject({
        message: "NotificationManager not initialized!",
      });

      let sendNotificationMock = webpush.sendNotification as jest.Mock;
      expect(sendNotificationMock).not.toHaveBeenCalled();
    });
  });

  describe("getSubscribers", () => {
    let notificationManager: NotificationManager;
    let initNotificationManager: boolean;
    let serviceId: string;

    beforeEach(() => {
      initNotificationManager = true;
      serviceId = "testLoadmonitoringServiceId2";
    });

    let exec = async () => {
      await beforeExec();

      notificationManager = NotificationManager.getInstance();

      if (initNotificationManager) await notificationManager.init();

      return notificationManager.getSubscribers(serviceId);
    };

    it("should return all subscribers from storage", async () => {
      let result = await exec();

      let expectedResult =
        fileServiceContent["hostTenant"]["notificationsAssetId"][
          `${serviceId}.sub.json`
        ];

      expect(result).toEqual(expectedResult);
    });

    it("should return empty array - if content in fileServiceContent is empty", async () => {
      fileServiceContent["hostTenant"]["notificationsAssetId"][
        `${serviceId}.sub.json`
      ] = [];

      let result = await exec();

      expect(result).toEqual([]);
    });

    it("should return null - if there is no service of given id in storage", async () => {
      serviceId = "fakeServiceId";

      let result = await exec();

      expect(result).toEqual(null);
    });

    it("should throw - if notificationManager has not been initialized", async () => {
      initNotificationManager = false;

      await expect(exec()).rejects.toMatchObject({
        message: "NotificationManager not initialized!",
      });
    });
  });

  describe("checkIfSubscriberExists", () => {
    let notificationManager: NotificationManager;
    let initNotificationManager: boolean;
    let serviceId: string;
    let subscriptionData: webpush.PushSubscription;

    beforeEach(() => {
      initNotificationManager = true;
      serviceId = "testLoadmonitoringServiceId2";
      subscriptionData = {
        endpoint: "testEndpoint22",
        keys: {
          p256dh: "testKey22",
          auth: "testAuth22",
        },
      };
    });

    let exec = async () => {
      await beforeExec();

      notificationManager = NotificationManager.getInstance();

      if (initNotificationManager) await notificationManager.init();

      return notificationManager.checkIfSubscriberExists(
        serviceId,
        subscriptionData
      );
    };

    it("should return true - if subscriber exists for given service", async () => {
      serviceId = "testLoadmonitoringServiceId2";
      subscriptionData = {
        endpoint: "testEndpoint22",
        keys: {
          p256dh: "testKey22",
          auth: "testAuth22",
        },
      };

      let result = await exec();

      expect(result).toEqual(true);
    });

    it("should return false - if subscriber does not exist for given service but exists for different service", async () => {
      serviceId = "testLoadmonitoringServiceId2";
      subscriptionData = {
        endpoint: "testEndpoint12",
        keys: {
          p256dh: "testKey12",
          auth: "testAuth12",
        },
      };

      let result = await exec();

      expect(result).toEqual(false);
    });

    it("should return false - if subscriber does not exist", async () => {
      serviceId = "testLoadmonitoringServiceId2";
      subscriptionData = {
        endpoint: "fakeEndpoint",
        keys: {
          p256dh: "fakeKey",
          auth: "fakeAuth",
        },
      };

      let result = await exec();

      expect(result).toEqual(false);
    });

    it("should return false - if service does not exists but subscriber do exists", async () => {
      serviceId = "fakeServiceId";
      subscriptionData = {
        endpoint: "testEndpoint12",
        keys: {
          p256dh: "testKey12",
          auth: "testAuth12",
        },
      };

      let result = await exec();

      expect(result).toEqual(false);
    });

    it("should return false - if service does not exists and subscriber does not exist", async () => {
      serviceId = "fakeServiceId";
      subscriptionData = {
        endpoint: "fakeEndpoint",
        keys: {
          p256dh: "fakeKey",
          auth: "fakeAuth",
        },
      };

      let result = await exec();

      expect(result).toEqual(false);
    });

    it("should throw - if notificationManager has not been initialized", async () => {
      initNotificationManager = false;

      await expect(exec()).rejects.toMatchObject({
        message: "NotificationManager not initialized!",
      });
    });
  });

  describe("addSubscriber", () => {
    let notificationManager: NotificationManager;
    let initNotificationManager: boolean;
    let serviceId: string;
    let subscriptionData: SubscriberPayload;
    let setFileContentThrows: boolean;

    beforeEach(() => {
      initNotificationManager = true;
      serviceId = "testLoadmonitoringServiceId2";
      subscriptionData = {
        language: "pl",
        subscriptionData: {
          endpoint: "testEndpoint24",
          keys: {
            p256dh: "testKey24",
            auth: "testAuth24",
          },
        },
      };
      setFileContentThrows = false;
    });

    let exec = async () => {
      await beforeExec();

      notificationManager = NotificationManager.getInstance();

      if (initNotificationManager) await notificationManager.init();

      if (setFileContentThrows) {
        MindSphereFileService.getInstance().setFileContent = jest.fn(
          async () => {
            throw new Error("Test set file content error");
          }
        );
      }

      return notificationManager.addSubscriber(serviceId, subscriptionData);
    };

    it("should add subscriber to storage", async () => {
      serviceId = "testLoadmonitoringServiceId2";
      subscriptionData = {
        language: "pl",
        subscriptionData: {
          endpoint: "testEndpoint24",
          keys: {
            p256dh: "testKey24",
            auth: "testAuth24",
          },
        },
      };

      await exec();

      //#region ===== CHECKING API CALL =====

      let expectedNewPayload = [
        ...fileServiceContent["hostTenant"]["notificationsAssetId"][
          "testLoadmonitoringServiceId2.sub.json"
        ],
        subscriptionData,
      ];

      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "notificationsAssetId",
        "testLoadmonitoringServiceId2.sub.json",
        expectedNewPayload,
      ]);

      //#endregion ===== CHECKING API CALL =====

      //#region ===== CHECKING STORAGE =====

      let storage = getPrivateProperty(
        notificationManager,
        "_subscribersStorage"
      ) as MindSphereDataStorage<SubscriberPayload[]>;

      let expectedCache = {
        testLoadmonitoringServiceId1: [
          ...fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId1.sub.json"
          ],
        ],
        testLoadmonitoringServiceId2: [
          ...fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId2.sub.json"
          ],
          subscriptionData,
        ],
        testLoadmonitoringServiceId3: [
          ...fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId3.sub.json"
          ],
        ],
      };

      testPrivateProperty(storage, "_cacheData", expectedCache);

      //#endregion ===== CHECKING STORAGE =====
    });

    it("should add subscriber to storage - even if given subscriber already exists", async () => {
      serviceId = "testLoadmonitoringServiceId2";
      subscriptionData = {
        language: "pl",
        subscriptionData: {
          endpoint: "testEndpoint22",
          keys: {
            p256dh: "testKey22",
            auth: "testAuth22",
          },
        },
      };

      await exec();

      //#region ===== CHECKING API CALL =====

      let expectedNewPayload = [
        ...fileServiceContent["hostTenant"]["notificationsAssetId"][
          "testLoadmonitoringServiceId2.sub.json"
        ],
        subscriptionData,
      ];

      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "notificationsAssetId",
        "testLoadmonitoringServiceId2.sub.json",
        expectedNewPayload,
      ]);

      //#endregion ===== CHECKING API CALL =====

      //#region ===== CHECKING STORAGE =====

      let storage = getPrivateProperty(
        notificationManager,
        "_subscribersStorage"
      ) as MindSphereDataStorage<SubscriberPayload[]>;

      let expectedCache = {
        testLoadmonitoringServiceId1: [
          ...fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId1.sub.json"
          ],
        ],
        testLoadmonitoringServiceId2: [
          ...fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId2.sub.json"
          ],
          subscriptionData,
        ],
        testLoadmonitoringServiceId3: [
          ...fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId3.sub.json"
          ],
        ],
      };

      testPrivateProperty(storage, "_cacheData", expectedCache);

      //#endregion ===== CHECKING STORAGE =====
    });

    it("should not throw, create new service instorage and add subscription to it - if service of given id does not exist", async () => {
      serviceId = "testLoadmonitoringServiceId4";
      subscriptionData = {
        language: "pl",
        subscriptionData: {
          endpoint: "testEndpoint42",
          keys: {
            p256dh: "testKey42",
            auth: "testAuth42",
          },
        },
      };

      await exec();

      //#region ===== CHECKING API CALL =====

      let expectedNewPayload = [subscriptionData];

      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "notificationsAssetId",
        "testLoadmonitoringServiceId4.sub.json",
        expectedNewPayload,
      ]);

      //#endregion ===== CHECKING API CALL =====

      //#region ===== CHECKING STORAGE =====

      let storage = getPrivateProperty(
        notificationManager,
        "_subscribersStorage"
      ) as MindSphereDataStorage<SubscriberPayload[]>;

      let expectedCache = {
        testLoadmonitoringServiceId1: [
          ...fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId1.sub.json"
          ],
        ],
        testLoadmonitoringServiceId2: [
          ...fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId2.sub.json"
          ],
        ],
        testLoadmonitoringServiceId3: [
          ...fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId3.sub.json"
          ],
        ],
        testLoadmonitoringServiceId4: [subscriptionData],
      };

      testPrivateProperty(storage, "_cacheData", expectedCache);

      //#endregion ===== CHECKING STORAGE =====
    });

    it("should throw and not change content of storage - if notificationManager has not been initialized", async () => {
      initNotificationManager = false;

      await expect(exec()).rejects.toMatchObject({
        message: "NotificationManager not initialized!",
      });

      //#region ===== CHECKING API CALL =====

      expect(setFileContent).not.toHaveBeenCalled();

      //#endregion ===== CHECKING API CALL =====

      //#region ===== CHECKING STORAGE =====

      let storage = getPrivateProperty(
        notificationManager,
        "_subscribersStorage"
      ) as MindSphereDataStorage<SubscriberPayload[]>;

      //Empty content - manager not initialized
      let expectedCache = {};

      testPrivateProperty(storage, "_cacheData", expectedCache);

      //#endregion ===== CHECKING STORAGE =====
    });

    it("should throw and not change content of storage - if setFileContent throws", async () => {
      setFileContentThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "Test set file content error",
      });

      //#region ===== CHECKING STORAGE =====

      let storage = getPrivateProperty(
        notificationManager,
        "_subscribersStorage"
      ) as MindSphereDataStorage<SubscriberPayload[]>;

      let expectedCache = {
        testLoadmonitoringServiceId1: [
          ...fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId1.sub.json"
          ],
        ],
        testLoadmonitoringServiceId2: [
          ...fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId2.sub.json"
          ],
        ],
        testLoadmonitoringServiceId3: [
          ...fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId3.sub.json"
          ],
        ],
      };

      testPrivateProperty(storage, "_cacheData", expectedCache);

      //#endregion ===== CHECKING STORAGE =====
    });
  });

  describe("removeSubscriber", () => {
    let notificationManager: NotificationManager;
    let initNotificationManager: boolean;
    let serviceId: string;
    let subscriptionData: webpush.PushSubscription;
    let setFileContentThrows: boolean;

    beforeEach(() => {
      initNotificationManager = true;
      serviceId = "testLoadmonitoringServiceId2";
      subscriptionData = {
        endpoint: "testEndpoint22",
        keys: {
          p256dh: "testKey22",
          auth: "testAuth22",
        },
      };
      setFileContentThrows = false;
    });

    let exec = async () => {
      await beforeExec();

      notificationManager = NotificationManager.getInstance();

      if (initNotificationManager) await notificationManager.init();

      if (setFileContentThrows) {
        MindSphereFileService.getInstance().setFileContent = jest.fn(
          async () => {
            throw new Error("Test set file content error");
          }
        );
      }

      return notificationManager.removeSubscriber(serviceId, subscriptionData);
    };

    it("should remove subscriber from storage", async () => {
      serviceId = "testLoadmonitoringServiceId2";
      subscriptionData = {
        endpoint: "testEndpoint22",
        keys: {
          p256dh: "testKey22",
          auth: "testAuth22",
        },
      };

      await exec();

      //#region ===== CHECKING API CALL =====

      let expectedNewPayload = [
        fileServiceContent["hostTenant"]["notificationsAssetId"][
          "testLoadmonitoringServiceId2.sub.json"
        ][0],
        fileServiceContent["hostTenant"]["notificationsAssetId"][
          "testLoadmonitoringServiceId2.sub.json"
        ][2],
      ];

      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "notificationsAssetId",
        "testLoadmonitoringServiceId2.sub.json",
        expectedNewPayload,
      ]);

      //#endregion ===== CHECKING API CALL =====

      //#region ===== CHECKING STORAGE =====

      let storage = getPrivateProperty(
        notificationManager,
        "_subscribersStorage"
      ) as MindSphereDataStorage<SubscriberPayload[]>;

      let expectedCache = {
        testLoadmonitoringServiceId1: [
          ...fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId1.sub.json"
          ],
        ],
        testLoadmonitoringServiceId2: [
          fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId2.sub.json"
          ][0],
          fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId2.sub.json"
          ][2],
        ],
        testLoadmonitoringServiceId3: [
          ...fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId3.sub.json"
          ],
        ],
      };

      testPrivateProperty(storage, "_cacheData", expectedCache);

      //#endregion ===== CHECKING STORAGE =====
    });

    it("should not remove subscriber from storage - if there is no subscriber of subscription data", async () => {
      serviceId = "testLoadmonitoringServiceId2";
      subscriptionData = {
        endpoint: "testEndpoint24",
        keys: {
          p256dh: "testKey24",
          auth: "testAuth24",
        },
      };

      await exec();

      //#region ===== CHECKING API CALL =====

      expect(setFileContent).not.toHaveBeenCalled();

      //#endregion ===== CHECKING API CALL =====

      //#region ===== CHECKING STORAGE =====

      let storage = getPrivateProperty(
        notificationManager,
        "_subscribersStorage"
      ) as MindSphereDataStorage<SubscriberPayload[]>;

      let expectedCache = {
        testLoadmonitoringServiceId1: [
          ...fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId1.sub.json"
          ],
        ],
        testLoadmonitoringServiceId2: [
          fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId2.sub.json"
          ][0],
          fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId2.sub.json"
          ][1],
          fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId2.sub.json"
          ][2],
        ],
        testLoadmonitoringServiceId3: [
          ...fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId3.sub.json"
          ],
        ],
      };

      testPrivateProperty(storage, "_cacheData", expectedCache);

      //#endregion ===== CHECKING STORAGE =====
    });

    it("should not remove subscriber from storage - if there is no service of given id", async () => {
      serviceId = "testLoadmonitoringServiceId4";
      subscriptionData = {
        endpoint: "testEndpoint22",
        keys: {
          p256dh: "testKey22",
          auth: "testAuth22",
        },
      };

      await exec();

      //#region ===== CHECKING API CALL =====

      expect(setFileContent).not.toHaveBeenCalled();

      //#endregion ===== CHECKING API CALL =====

      //#region ===== CHECKING STORAGE =====

      let storage = getPrivateProperty(
        notificationManager,
        "_subscribersStorage"
      ) as MindSphereDataStorage<SubscriberPayload[]>;

      let expectedCache = {
        testLoadmonitoringServiceId1: [
          ...fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId1.sub.json"
          ],
        ],
        testLoadmonitoringServiceId2: [
          fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId2.sub.json"
          ][0],
          fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId2.sub.json"
          ][1],
          fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId2.sub.json"
          ][2],
        ],
        testLoadmonitoringServiceId3: [
          ...fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId3.sub.json"
          ],
        ],
      };

      testPrivateProperty(storage, "_cacheData", expectedCache);

      //#endregion ===== CHECKING STORAGE =====
    });

    it("should throw and not remove subscriber from storage - if norificiation manager has not been initialzied", async () => {
      initNotificationManager = false;

      await expect(exec()).rejects.toMatchObject({
        message: "NotificationManager not initialized!",
      });

      //#region ===== CHECKING API CALL =====

      expect(setFileContent).not.toHaveBeenCalled();

      //#endregion ===== CHECKING API CALL =====

      //#region ===== CHECKING STORAGE =====

      let storage = getPrivateProperty(
        notificationManager,
        "_subscribersStorage"
      ) as MindSphereDataStorage<SubscriberPayload[]>;

      //Cache should be empty - manager not initialized
      let expectedCache = {};

      testPrivateProperty(storage, "_cacheData", expectedCache);

      //#endregion ===== CHECKING STORAGE =====
    });

    it("should throw and not remove subscriber from storage - if setFileContent throws", async () => {
      setFileContentThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "Test set file content error",
      });

      //#region ===== CHECKING STORAGE =====

      let storage = getPrivateProperty(
        notificationManager,
        "_subscribersStorage"
      ) as MindSphereDataStorage<SubscriberPayload[]>;

      //Cache should be empty - manager not initialized
      let expectedCache = {
        testLoadmonitoringServiceId1: [
          ...fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId1.sub.json"
          ],
        ],
        testLoadmonitoringServiceId2: [
          fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId2.sub.json"
          ][0],
          fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId2.sub.json"
          ][1],
          fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId2.sub.json"
          ][2],
        ],
        testLoadmonitoringServiceId3: [
          ...fileServiceContent["hostTenant"]["notificationsAssetId"][
            "testLoadmonitoringServiceId3.sub.json"
          ],
        ],
      };

      testPrivateProperty(storage, "_cacheData", expectedCache);

      //#endregion ===== CHECKING STORAGE =====
    });
  });
});

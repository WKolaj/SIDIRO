import CustomService from "../../../../classes/CustomService/CustomService";
import { MindSphereFileService } from "../../../../classes/MindSphereService/MindSphereFileService";
import {
  getFileContent,
  MockedFileServiceContent,
  mockMsFileService,
  setFileContent,
} from "../../../utilities/mockMsFileService";
import logger from "../../../../logger/logger";
import CustomServiceManager, {
  CustomServicePayload,
  CustomServiceType,
} from "../../../../classes/CustomService/CustomServiceManager";
import { CachedDataStorage } from "../../../../classes/DataStorage/CachedDataStorage";
import { MindSphereDataStorage } from "../../../../classes/DataStorage/MindSphereDataStorage";
import {
  setPrivateProperty,
  testPrivateProperty,
  getPrivateProperty,
} from "../../../utilities/utilities";
import { cloneObject } from "../../../../utilities/utilities";
import Sampler from "../../../../classes/Sampler/Sampler";
import MockDate from "mockdate";

interface TestCustomServicePayload extends CustomServicePayload {
  testData: any;
}

//Creating mocked custom service class
class MockedCustomService extends CustomService<TestCustomServicePayload> {
  public constructor(
    id: string,
    dataStorage: CachedDataStorage<TestCustomServicePayload>
  ) {
    super("MockedCustomService" as any, id, dataStorage);
  }

  public __onInitMockFunc = jest.fn();
  public async _onInit(
    tickId: number,
    data: TestCustomServicePayload
  ): Promise<void> {
    return this.__onInitMockFunc(tickId, data);
  }

  public __onRefreshMockFunc = jest.fn();
  public async _onRefresh(tickId: number): Promise<void> {
    return this.__onRefreshMockFunc(tickId);
  }

  public __onSetStorageDataMockFunc = jest.fn();
  public async _onSetStorageData(
    payload: TestCustomServicePayload
  ): Promise<void> {
    return this.__onSetStorageDataMockFunc(payload);
  }
}

describe("CustomService", () => {
  let fileServiceContent: MockedFileServiceContent;
  let logErrorMockFunc: jest.Mock;
  let mockCustomServiceType: string;
  let createServiceBasedOnTypeMockFunc: jest.Mock;

  const mockCreateServiceBasedOnTypeMockFunc = (
    customServiceManager: CustomServiceManager
  ) => {
    //Creating mock function
    createServiceBasedOnTypeMockFunc = jest.fn((id: string, type: any) => {
      switch (type) {
        case mockCustomServiceType: {
          return new MockedCustomService(
            id,
            getPrivateProperty(customServiceManager, "_dataStorage")
          );
        }
        default: {
          throw new Error(`Unrecognized service type: ${type}`);
        }
      }
    });

    //Mocking method
    setPrivateProperty(
      customServiceManager,
      "_createServiceBasedOnType",
      createServiceBasedOnTypeMockFunc
    );
  };

  beforeEach(async () => {
    //Clearing MindSphereServices
    (MindSphereFileService as any)._instance = null;

    //Clearing CustomServiceManager
    (CustomServiceManager as any)._instance = null;

    fileServiceContent = {
      hostTenant: {
        testServiceContainerAssetId: {
          "testCustomServiceId1.service.config.json": {
            sampleTime: 100,
            serviceType: "MockedCustomService" as any,
            testData: { ab12: "ef12" },
            appId: "testAppId1",
            id: "testCustomServiceId1",
            plantId: "testPlantId1",
          },
          "testCustomServiceId2.service.config.json": {
            sampleTime: 200,
            serviceType: "MockedCustomService" as any,
            testData: { ab23: "ef23" },
            appId: "testAppId1",
            id: "testCustomServiceId2",
            plantId: "testPlantId1",
          },
          "testCustomServiceId3.service.config.json": {
            sampleTime: 300,
            serviceType: "MockedCustomService" as any,
            testData: { ab45: "ef45" },
            appId: "testAppId1",
            id: "testCustomServiceId3",
            plantId: "testPlantId2",
          },
          "testCustomServiceId4.service.config.json": {
            sampleTime: 400,
            serviceType: "MockedCustomService" as any,
            testData: { ab67: "ef67" },
            appId: "testAppId2",
            id: "testCustomServiceId4",
            plantId: "testPlantId2",
          },
          "testCustomServiceId5.service.config.json": {
            sampleTime: 500,
            serviceType: "MockedCustomService" as any,
            testData: { ab89: "ef89" },
            appId: "testAppId2",
            id: "testCustomServiceId5",
            plantId: "testPlantId3",
          },
          "testCustomServiceId6.service.config.json": {
            sampleTime: 600,
            serviceType: "MockedCustomService" as any,
            testData: { ab01: "ef01" },
            appId: "testAppId2",
            id: "testCustomServiceId6",
            plantId: "testPlantId3",
          },
          "testCustomServiceId7.service.config.json": {
            sampleTime: 700,
            serviceType: "MockedCustomService" as any,
            testData: { ab23: "ef23" },
            appId: "testAppId3",
            id: "testCustomServiceId7",
            plantId: "testPlantId4",
          },
          "testCustomServiceId8.service.config.json": {
            sampleTime: 800,
            serviceType: "MockedCustomService" as any,
            testData: { ab45: "ef45" },
            appId: "testAppId3",
            id: "testCustomServiceId8",
            plantId: "testPlantId4",
          },
          "testCustomServiceId9.service.config.json": {
            sampleTime: 900,
            serviceType: "MockedCustomService" as any,
            testData: { ab67: "ef67" },
            appId: "testAppId3",
            id: "testCustomServiceId9",
            plantId: "testPlantId5",
          },
        },
      },
    };

    jest.clearAllMocks();

    logErrorMockFunc = jest.fn();
    mockCustomServiceType = "MockedCustomService";

    logger.error = logErrorMockFunc;
  });

  afterEach(async () => {
    //Stopping sampler if CustomerServiceManager exists
    let convertedCustomServiceManager = CustomServiceManager as any;
    if (
      convertedCustomServiceManager._instance != null &&
      convertedCustomServiceManager._sampler != null
    )
      convertedCustomServiceManager._sampler.stop();

    //Clearing CustomServiceManager
    (CustomServiceManager as any)._instance = null;

    //Clearing MindSphereServices
    (MindSphereFileService as any)._instance = null;

    jest.clearAllMocks();
  });

  const beforeExec = async () => {
    await mockMsFileService(fileServiceContent);
  };

  describe("getInstance", () => {
    let exec = () => {
      return CustomServiceManager.getInstance();
    };

    it("should return valid instance of CustomServiceManager", () => {
      let result = exec();

      expect(result).not.toEqual(null);
      expect(result instanceof CustomServiceManager).toEqual(true);
    });

    it("should return the same instance of CustomServiceManager if called several times", () => {
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
        "_dataStorage"
      ) as MindSphereDataStorage<CustomServicePayload>;

      expect(internalDataStorage).toBeDefined();
      expect(internalDataStorage instanceof MindSphereDataStorage).toEqual(
        true
      );

      //Storage parameters should be initialized properly
      expect(internalDataStorage.Tenant).toEqual("hostTenant");
      expect(internalDataStorage.AssetId).toEqual(
        "testServiceContainerAssetId"
      );
      expect(internalDataStorage.Extension).toEqual("service.config.json");
    });

    it("should properly set other properties", () => {
      let result = exec();

      expect(result.InitTickID).toEqual(null);
      expect(result.Initialized).toEqual(false);
      expect(result.LastRefreshTickID).toEqual(null);
      testPrivateProperty(result, "_sampler", null);
      testPrivateProperty(result, "_services", {});
    });
  });

  describe("init", () => {
    let customServiceManager: CustomServiceManager;
    let currentDate: number;

    beforeEach(() => {
      currentDate = 12345678;
    });

    let exec = async () => {
      await beforeExec();

      MockDate.set(currentDate);

      customServiceManager = CustomServiceManager.getInstance();
      mockCreateServiceBasedOnTypeMockFunc(customServiceManager);

      return customServiceManager.init();
    };

    it("should properly initialize customServiceManager - set initialize to true, currentDate to initTickId, create and initialize services based on content in MindSphere and init and start sampler - if there are some services", async () => {
      await exec();

      //#region ===== CHECKING PROPERTIES =====

      expect(customServiceManager.LastRefreshTickID).toEqual(null);
      //12345678 -> 12345.678 -> 12346
      expect(customServiceManager.InitTickID).toEqual(12346);
      expect(customServiceManager.Initialized).toEqual(true);

      //#endregion ===== CHECKING PROPERTIES =====

      //#region ===== CHECKING SERVICES =====

      let services = getPrivateProperty(customServiceManager, "_services");
      expect(services).toBeDefined();

      let allServiceIdsFromManager = Object.keys(services).sort();
      let allServiceIdsFromFileService = Object.keys(
        fileServiceContent["hostTenant"]["testServiceContainerAssetId"]
      )
        .filter((filePath) => filePath.includes(".service.config.json"))
        .map((filePath) => filePath.replace(".service.config.json", ""))
        .sort();

      //Services from Manager and in MindSphere file service should be identical
      expect(allServiceIdsFromManager).toEqual(allServiceIdsFromFileService);

      for (let serviceId of allServiceIdsFromManager) {
        let service = services[serviceId] as MockedCustomService;
        let servicePayload = fileServiceContent["hostTenant"][
          "testServiceContainerAssetId"
        ][`${serviceId}.service.config.json`] as TestCustomServicePayload;

        //Checking if init was called properly
        expect(service.__onInitMockFunc).toHaveBeenCalledTimes(1);
        expect(service.__onInitMockFunc.mock.calls[0]).toEqual([
          12346,
          servicePayload,
        ]);
      }

      //#endregion ===== CHECKING SERVICES =====

      //#region ===== CHECKING SAMPLER =====

      let sampler = getPrivateProperty(
        customServiceManager,
        "_sampler"
      ) as Sampler;
      expect(sampler).toBeDefined();

      expect(sampler.Active).toEqual(true);

      //Checkings sampler function
      testPrivateProperty(
        customServiceManager,
        "_handleSamplerTick",
        sampler.ExternalTickHandler
      );

      //#endregion ===== CHECKING SAMPLER =====
    });

    it("should properly initialize customServiceManager - set initialize to true, currentDate to initTickId, create and initialize services based on content in MindSphere and init and start sampler - if there are no services", async () => {
      fileServiceContent["hostTenant"]["testServiceContainerAssetId"] = {};

      await exec();

      //#region ===== CHECKING PROPERTIES =====

      expect(customServiceManager.LastRefreshTickID).toEqual(null);
      //12345678 -> 12345.678 -> 12346
      expect(customServiceManager.InitTickID).toEqual(12346);
      expect(customServiceManager.Initialized).toEqual(true);

      //#endregion ===== CHECKING PROPERTIES =====

      //#region ===== CHECKING SERVICES =====

      let services = getPrivateProperty(customServiceManager, "_services");
      expect(services).toEqual({});

      //#endregion ===== CHECKING SERVICES =====

      //#region ===== CHECKING SAMPLER =====

      let sampler = getPrivateProperty(
        customServiceManager,
        "_sampler"
      ) as Sampler;
      expect(sampler).toBeDefined();

      expect(sampler.Active).toEqual(true);

      //Checkings sampler function
      testPrivateProperty(
        customServiceManager,
        "_handleSamplerTick",
        sampler.ExternalTickHandler
      );
      //#endregion ===== CHECKING SAMPLER =====
    });

    it("should properly initialize customServiceManager - set initialize to true, currentDate to initTickId, create and initialize services based on content in MindSphere and init and start sampler - if one of services throws while initialziation", async () => {
      //Deliberatelly setting service type not to be recognized - in order to throw error when initialzing
      fileServiceContent["hostTenant"]["testServiceContainerAssetId"][
        "testCustomServiceId5.service.config.json"
      ].serviceType = "FakeServiceType";

      await exec();

      //#region ===== CHECKING PROPERTIES =====

      expect(customServiceManager.LastRefreshTickID).toEqual(null);
      //12345678 -> 12345.678 -> 12346
      expect(customServiceManager.InitTickID).toEqual(12346);
      expect(customServiceManager.Initialized).toEqual(true);

      //#endregion ===== CHECKING PROPERTIES =====

      //#region ===== CHECKING SERVICES =====

      let services = getPrivateProperty(customServiceManager, "_services");
      expect(services).toBeDefined();

      let allServiceIdsFromManager = Object.keys(services).sort();

      //testCustomServiceId5 should not be present in payload - throw during initialization
      let allServiceIdsFromFileService = Object.keys(
        fileServiceContent["hostTenant"]["testServiceContainerAssetId"]
      )
        .filter(
          (filePath) =>
            filePath.includes(".service.config.json") &&
            filePath !== "testCustomServiceId5.service.config.json"
        )
        .map((filePath) => filePath.replace(".service.config.json", ""))
        .sort();

      //Services from Manager and in MindSphere file service should be identical
      expect(allServiceIdsFromManager).toEqual(allServiceIdsFromFileService);

      for (let serviceId of allServiceIdsFromManager) {
        let service = services[serviceId] as MockedCustomService;
        let servicePayload = fileServiceContent["hostTenant"][
          "testServiceContainerAssetId"
        ][`${serviceId}.service.config.json`] as TestCustomServicePayload;

        //Checking if init was called properly
        expect(service.__onInitMockFunc).toHaveBeenCalledTimes(1);
        expect(service.__onInitMockFunc.mock.calls[0]).toEqual([
          12346,
          servicePayload,
        ]);
      }
      //#endregion ===== CHECKING SERVICES =====

      //#region ===== CHECKING SAMPLER =====

      let sampler = getPrivateProperty(
        customServiceManager,
        "_sampler"
      ) as Sampler;
      expect(sampler).toBeDefined();

      expect(sampler.Active).toEqual(true);

      //Checkings sampler's tick handler
      testPrivateProperty(
        customServiceManager,
        "_handleSamplerTick",
        sampler.ExternalTickHandler
      );

      //#endregion ===== CHECKING SAMPLER =====

      //#region ===== CHECKING LOGGER CALL =====

      //Logger should have been called - during fail of initialization
      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Error during initializing service testCustomServiceId5: Unrecognized service type: FakeServiceType"
      );

      //#endregion ===== CHECKING LOGGER CALL =====
    });

    it("should do nothing - if service already initialized", async () => {
      customServiceManager = CustomServiceManager.getInstance();
      setPrivateProperty(customServiceManager, "_initialized", true);

      await exec();

      //#region ===== CHECKING PROPERTIES =====

      expect(customServiceManager.LastRefreshTickID).toEqual(null);
      expect(customServiceManager.InitTickID).toEqual(null);
      expect(customServiceManager.Initialized).toEqual(true);

      //#endregion ===== CHECKING PROPERTIES =====

      //#region ===== CHECKING SERVICES =====

      let services = getPrivateProperty(customServiceManager, "_services");
      expect(services).toEqual({});

      //#endregion ===== CHECKING SERVICES =====

      //#region ===== CHECKING SAMPLER =====

      let sampler = getPrivateProperty(
        customServiceManager,
        "_sampler"
      ) as Sampler;
      expect(sampler).toEqual(null);

      //#endregion ===== CHECKING SAMPLER =====
    });
  });

  describe("_handleSamplerTick", () => {
    let customServiceManager: CustomServiceManager;
    let currentDate: number;
    let tickId: number;
    let initService: boolean;
    let forceService5ToThrowWhileRefreshing: boolean;

    beforeEach(() => {
      currentDate = 12345678;
      tickId = 5000;
      initService = true;
      forceService5ToThrowWhileRefreshing = false;
    });

    let exec = async () => {
      await beforeExec();

      MockDate.set(currentDate);

      customServiceManager = CustomServiceManager.getInstance();
      mockCreateServiceBasedOnTypeMockFunc(customServiceManager);

      if (initService) await customServiceManager.init();
      if (forceService5ToThrowWhileRefreshing) {
        let services = getPrivateProperty(customServiceManager, "_services");
        let firstService = services[
          "testCustomServiceId5"
        ] as MockedCustomService;
        firstService.__onRefreshMockFunc = jest.fn(async () => {
          throw new Error("testCustomerServiceId5 test refresh error");
        });
      }

      return (customServiceManager as any)._handleSamplerTick(tickId);
    };

    it("should refresh all services that suit given id", async () => {
      await exec();

      //#region ===== CHECKING PROPERTIES =====

      expect(customServiceManager.LastRefreshTickID).toEqual(tickId);
      expect(customServiceManager.InitTickID).toEqual(12346);
      expect(customServiceManager.Initialized).toEqual(true);

      //#endregion ===== CHECKING PROPERTIES =====

      //#region ===== CHECKING SERVICES =====

      let services = getPrivateProperty(customServiceManager, "_services");

      let allServiceIds = Object.keys(
        fileServiceContent["hostTenant"]["testServiceContainerAssetId"]
      )
        .filter((filePath) => filePath.includes(".service.config.json"))
        .map((filePath) => filePath.replace(".service.config.json", ""))
        .sort();

      for (let serviceId of allServiceIds) {
        let servicePayload =
          fileServiceContent["hostTenant"]["testServiceContainerAssetId"][
            `${serviceId}.service.config.json`
          ];

        let service = services[serviceId] as MockedCustomService;

        //All service that suit tick id should have been refreshed and others not
        if (tickId % servicePayload.sampleTime === 0) {
          expect(service.__onRefreshMockFunc).toHaveBeenCalledTimes(1);
          expect(service.__onRefreshMockFunc.mock.calls[0]).toEqual([tickId]);
        } else {
          expect(service.__onRefreshMockFunc).not.toHaveBeenCalled();
        }
      }

      //#endregion ===== CHECKING SERVICES =====

      //#region ===== CHECKING SAMPLER =====

      //Sampler should remain active after the refresh
      let sampler = getPrivateProperty(
        customServiceManager,
        "_sampler"
      ) as Sampler;
      expect(sampler.Active).toEqual(true);

      //#endregion ===== CHECKING SAMPLER =====
    });

    it("should not refresh any service - if there are no services that suits given tickId", async () => {
      //sampleTimes of services are 100,200,300,...,900
      tickId = 123456789;

      await exec();

      //#region ===== CHECKING PROPERTIES =====

      expect(customServiceManager.LastRefreshTickID).toEqual(tickId);
      expect(customServiceManager.InitTickID).toEqual(12346);
      expect(customServiceManager.Initialized).toEqual(true);

      //#endregion ===== CHECKING PROPERTIES =====

      //#region ===== CHECKING SERVICES =====

      let services = getPrivateProperty(customServiceManager, "_services");

      let allServiceIds = Object.keys(
        fileServiceContent["hostTenant"]["testServiceContainerAssetId"]
      )
        .filter((filePath) => filePath.includes(".service.config.json"))
        .map((filePath) => filePath.replace(".service.config.json", ""))
        .sort();

      for (let serviceId of allServiceIds) {
        let service = services[serviceId] as MockedCustomService;

        //Every service should not have been refreshed
        expect(service.__onRefreshMockFunc).not.toHaveBeenCalled();
      }

      //#endregion ===== CHECKING SERVICES =====

      //#region ===== CHECKING SAMPLER =====

      //Sampler should remain active after the refresh
      let sampler = getPrivateProperty(
        customServiceManager,
        "_sampler"
      ) as Sampler;
      expect(sampler.Active).toEqual(true);

      //#endregion ===== CHECKING SAMPLER =====
    });

    it("should refresh all services - if all services suits given id", async () => {
      //sampleTimes of services are 100,200,300,...,900
      tickId = 100 * 2 * 3 * 4 * 5 * 6 * 7 * 8 * 9;

      await exec();

      //#region ===== CHECKING PROPERTIES =====

      expect(customServiceManager.LastRefreshTickID).toEqual(tickId);
      expect(customServiceManager.InitTickID).toEqual(12346);
      expect(customServiceManager.Initialized).toEqual(true);

      //#endregion ===== CHECKING PROPERTIES =====

      //#region ===== CHECKING SERVICES =====

      let services = getPrivateProperty(customServiceManager, "_services");

      let allServiceIds = Object.keys(
        fileServiceContent["hostTenant"]["testServiceContainerAssetId"]
      )
        .filter((filePath) => filePath.includes(".service.config.json"))
        .map((filePath) => filePath.replace(".service.config.json", ""))
        .sort();

      for (let serviceId of allServiceIds) {
        let service = services[serviceId] as MockedCustomService;

        //All services should have been refreshed
        expect(service.__onRefreshMockFunc).toHaveBeenCalledTimes(1);
        expect(service.__onRefreshMockFunc.mock.calls[0]).toEqual([tickId]);
      }

      //#endregion ===== CHECKING SERVICES =====

      //#region ===== CHECKING SAMPLER =====

      //Sampler should remain active after the refresh
      let sampler = getPrivateProperty(
        customServiceManager,
        "_sampler"
      ) as Sampler;
      expect(sampler.Active).toEqual(true);

      //#endregion ===== CHECKING SAMPLER =====
    });

    it("should not refresh any service - if there are no services", async () => {
      fileServiceContent["hostTenant"]["testServiceContainerAssetId"] = {};

      await exec();

      //#region ===== CHECKING PROPERTIES =====

      expect(customServiceManager.LastRefreshTickID).toEqual(tickId);
      expect(customServiceManager.InitTickID).toEqual(12346);
      expect(customServiceManager.Initialized).toEqual(true);

      //#endregion ===== CHECKING PROPERTIES =====

      //#region ===== CHECKING SAMPLER =====

      //Sampler should remain active after the refresh
      let sampler = getPrivateProperty(
        customServiceManager,
        "_sampler"
      ) as Sampler;
      expect(sampler.Active).toEqual(true);

      //#endregion ===== CHECKING SAMPLER =====
    });

    it("should do nothing and not refresh any service - if manager is not initialized", async () => {
      initService = false;

      await exec();

      //#region ===== CHECKING PROPERTIES =====

      expect(customServiceManager.LastRefreshTickID).toEqual(null);
      expect(customServiceManager.InitTickID).toEqual(null);
      expect(customServiceManager.Initialized).toEqual(false);

      //#endregion ===== CHECKING PROPERTIES =====

      //#region ===== CHECKING SERVICES =====

      let services = getPrivateProperty(customServiceManager, "_services");

      expect(services).toEqual({});

      //#endregion ===== CHECKING SERVICES =====

      //#region ===== CHECKING SAMPLER =====

      //Sampler should remain active after the refresh
      let sampler = getPrivateProperty(
        customServiceManager,
        "_sampler"
      ) as Sampler;
      expect(sampler).toEqual(null);

      //#endregion ===== CHECKING SAMPLER =====
    });

    it("should refresh all services and not throw - even if some service throws while refreshing", async () => {
      forceService5ToThrowWhileRefreshing = true;

      await exec();

      //#region ===== CHECKING PROPERTIES =====

      expect(customServiceManager.LastRefreshTickID).toEqual(tickId);
      expect(customServiceManager.InitTickID).toEqual(12346);
      expect(customServiceManager.Initialized).toEqual(true);

      //#endregion ===== CHECKING PROPERTIES =====

      //#region ===== CHECKING SERVICES =====

      let services = getPrivateProperty(customServiceManager, "_services");

      let allServiceIds = Object.keys(
        fileServiceContent["hostTenant"]["testServiceContainerAssetId"]
      )
        .filter((filePath) => filePath.includes(".service.config.json"))
        .map((filePath) => filePath.replace(".service.config.json", ""))
        .sort();

      for (let serviceId of allServiceIds) {
        let servicePayload =
          fileServiceContent["hostTenant"]["testServiceContainerAssetId"][
            `${serviceId}.service.config.json`
          ];

        let service = services[serviceId] as MockedCustomService;

        //All service that suit tick id should have been refreshed and others not
        //OnRefresh stil should have been called - despite it throws
        if (tickId % servicePayload.sampleTime === 0) {
          expect(service.__onRefreshMockFunc).toHaveBeenCalledTimes(1);
          expect(service.__onRefreshMockFunc.mock.calls[0]).toEqual([tickId]);
        } else {
          expect(service.__onRefreshMockFunc).not.toHaveBeenCalled();
        }
      }

      //Checking service that throws
      let serviceThatThrows = services[
        "testCustomServiceId5"
      ] as MockedCustomService;
      expect(serviceThatThrows.__onRefreshMockFunc).toHaveBeenCalledTimes(1);
      expect(serviceThatThrows.__onRefreshMockFunc.mock.calls[0]).toEqual([
        tickId,
      ]);
      //service should not have finish refreshing
      expect(serviceThatThrows.LastRefreshTickID).toEqual(null);

      //#endregion ===== CHECKING SERVICES =====

      //#region ===== CHECKING SAMPLER =====

      //Sampler should remain active after the refresh
      let sampler = getPrivateProperty(
        customServiceManager,
        "_sampler"
      ) as Sampler;
      expect(sampler.Active).toEqual(true);

      //#endregion ===== CHECKING SAMPLER =====

      //#region ===== CHECKING LOGGER =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Error during refreshing service testCustomServiceId5: testCustomerServiceId5 test refresh error"
      );

      //#endregion ===== CHECKING LOGGER =====
    });
  });
});

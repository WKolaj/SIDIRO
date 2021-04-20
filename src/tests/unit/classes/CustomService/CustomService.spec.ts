import CustomService from "../../../../classes/CustomService/CustomService";
import { MindSphereFileService } from "../../../../classes/MindSphereService/MindSphereFileService";
import {
  getFileContent,
  MockedFileServiceContent,
  mockMsFileService,
  setFileContent,
} from "../../../utilities/mockMsFileService";
import logger from "../../../../logger/logger";
import {
  CustomServiceConfig,
  CustomServiceType,
  CustomServiceData,
} from "../../../../classes/CustomService/CustomServiceManager";
import { CachedDataStorage } from "../../../../classes/DataStorage/CachedDataStorage";
import { MindSphereDataStorage } from "../../../../classes/DataStorage/MindSphereDataStorage";
import {
  setPrivateProperty,
  testPrivateProperty,
} from "../../../utilities/utilities";
import { cloneObject } from "../../../../utilities/utilities";

interface TestCustomServiceConfig extends CustomServiceConfig {
  testConfig: any;
}

interface TestCustomServiceData extends CustomServiceData {
  testData: any;
}

//Creating mocked custom service class
class MockedCustomService extends CustomService<
  TestCustomServiceConfig,
  TestCustomServiceData
> {
  public constructor(
    customServiceType: any,
    id: string,
    dataStorage: CachedDataStorage<TestCustomServiceConfig>
  ) {
    super(customServiceType, id, dataStorage);
  }

  public __onInitMockFunc = jest.fn();
  public async _onInit(
    tickId: number,
    data: TestCustomServiceConfig
  ): Promise<void> {
    return this.__onInitMockFunc(tickId, data);
  }

  public __onRefreshMockFunc = jest.fn();
  public async _onRefresh(tickId: number): Promise<void> {
    return this.__onRefreshMockFunc(tickId);
  }

  public __onSetStorageDataMockFunc = jest.fn();
  public async _onSetStorageData(
    payload: TestCustomServiceConfig
  ): Promise<void> {
    return this.__onSetStorageDataMockFunc(payload);
  }

  public async getData(): Promise<TestCustomServiceData> {
    return {
      initTickId: this.InitTickID,
      initialized: this.Initialized,
      lastRefreshTickId: this.LastRefreshTickID,
      testData: {
        abcd: 1234,
      },
    };
  }
}

describe("CustomService", () => {
  let fileServiceContent: MockedFileServiceContent;
  let logErrorMockFunc: jest.Mock;

  beforeEach(async () => {
    //Clearing MindSphereServices
    (MindSphereFileService as any)._instance = null;

    fileServiceContent = {
      hostTenant: {
        testServiceContainerAssetId: {
          "testCustomServiceId.service.config.json": {
            sampleTime: 100,
            serviceType: "TestCustomServicePayload" as any,
            testConfig: { abcd: "efgh" },
            appId: "testAppId",
            id: "testCustomServiceId",
            plantId: "testPlantId",
          },
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

    jest.clearAllMocks();
  });

  const beforeExec = async () => {
    await mockMsFileService(fileServiceContent);
  };

  describe("constructor", () => {
    let id: string;
    let type: string;
    let dataStorage: MindSphereDataStorage<TestCustomServiceConfig>;

    beforeEach(() => {
      id = "testCustomServiceId";
      type = "testCustomServiceType";
      dataStorage = new MindSphereDataStorage(
        "hostTenant",
        "testServiceContainerAssetId",
        ".service.config.json"
      );
    });

    let exec = async () => {
      await beforeExec();
      return new MockedCustomService(type, id, dataStorage);
    };

    it("should create and return new CustomService", async () => {
      let result = await exec();

      expect(result).toBeDefined();
    });

    it("should properties and fields of created CustomService object", async () => {
      let result = await exec();

      //Properties should be assigned
      expect(result.ID).toEqual(id);
      expect(result.Type).toEqual(type);
      //AppId, plantId and sample time should initially be set to null
      expect(result.AppID).toEqual(null);
      expect(result.PlantID).toEqual(null);
      expect(result.SampleTime).toEqual(null);
      //Storage should be assigned
      testPrivateProperty(result, "_dataStorage", dataStorage);
      //CustomService should not be initialzied from the begining
      expect(result.Initialized).toEqual(false);
      expect(result.InitTickID).toEqual(null);
      expect(result.LastRefreshTickID).toEqual(null);
    });
  });

  describe("init", () => {
    let id: string;
    let type: string;
    let dataStorage: MindSphereDataStorage<TestCustomServiceConfig>;
    let customService: CustomService<
      TestCustomServiceConfig,
      TestCustomServiceData
    >;
    let tickId: number;
    let initPayload: TestCustomServiceConfig;
    let initialized: boolean;

    beforeEach(() => {
      id = "testCustomServiceId";
      type = "testCustomServiceType";
      initialized = false;
      tickId = 1234;
      initPayload = {
        sampleTime: 4321,
        serviceType: "TestCustomServicePayload" as any,
        testConfig: { abcd: "efgh" },
        appId: "testAppId",
        id: "testCustomServiceId",
        plantId: "testPlantId",
      };
      dataStorage = new MindSphereDataStorage(
        "hostTenant",
        "testServiceContainerAssetId",
        ".service.config.json"
      );
    });

    let exec = async () => {
      await beforeExec();

      customService = new MockedCustomService(type, id, dataStorage);

      setPrivateProperty(customService, "_initialized", initialized);

      let payloadToInitialize = cloneObject(initPayload);
      return customService.init(tickId, payloadToInitialize);
    };

    it("should set initialize flag to true and InitTickId to value of tickId", async () => {
      await exec();

      expect(customService.Initialized).toEqual(true);
      expect(customService.InitTickID).toEqual(tickId);
    });

    it("should set AppId of the service - if appId is present in payload", async () => {
      initPayload.appId = "testAppId";

      await exec();

      expect(customService.AppID).toEqual(initPayload.appId);
    });

    it("should not set AppId of the service - if appId is not defined in payload", async () => {
      delete initPayload.appId;

      await exec();

      expect(customService.AppID).toEqual(null);
    });

    it("should set PlantId of the service - if plantId is present in payload", async () => {
      initPayload.plantId = "testPlantId";

      await exec();

      expect(customService.PlantID).toEqual(initPayload.plantId);
    });

    it("should not set PlantId of the service - if plantId is not present in payload", async () => {
      delete initPayload.plantId;

      await exec();

      expect(customService.PlantID).toEqual(null);
    });

    it("should invoke onInit with valid tick id", async () => {
      await exec();

      let mockedCustomService = customService as MockedCustomService;

      expect(mockedCustomService.__onInitMockFunc).toHaveBeenCalledTimes(1);
      expect(mockedCustomService.__onInitMockFunc.mock.calls[0]).toEqual([
        tickId,
        initPayload,
      ]);
    });

    it("should not set properties or call onInit - if customerService has already been initialized", async () => {
      initialized = true;

      await exec();

      let mockedCustomService = customService as MockedCustomService;

      //Initialzie should stay as true
      expect(mockedCustomService.Initialized).toEqual(true);

      //All properties should have default values
      expect(mockedCustomService.InitTickID).toEqual(null);
      expect(mockedCustomService.PlantID).toEqual(null);
      expect(mockedCustomService.AppID).toEqual(null);
      expect(mockedCustomService.SampleTime).toEqual(null);

      //OnInit should not have been called
      expect(mockedCustomService.__onInitMockFunc).not.toHaveBeenCalled();
    });

    it("should not fetch data from storage - fetching based on CustomerServiceManager", async () => {
      await exec();

      //OnInit should not have been called
      expect(getFileContent).not.toHaveBeenCalled();
    });
  });

  describe("refresh", () => {
    let id: string;
    let type: string;
    let dataStorage: MindSphereDataStorage<TestCustomServiceConfig>;
    let customService: CustomService<
      TestCustomServiceConfig,
      TestCustomServiceData
    >;
    let initTickId: number;
    let initPayload: TestCustomServiceConfig;
    let initialize: boolean;
    let tickId: number;
    let previousLastRefreshId: number | null;

    beforeEach(() => {
      id = "testCustomServiceId";
      type = "testCustomServiceType";
      initialize = true;
      initTickId = 123;
      tickId = 1000;
      initPayload = {
        sampleTime: 100,
        serviceType: "TestCustomServicePayload" as any,
        testConfig: { abcd: "efgh" },
        appId: "testAppId",
        id: "testCustomServiceId",
        plantId: "testPlantId",
      };
      dataStorage = new MindSphereDataStorage(
        "hostTenant",
        "testServiceContainerAssetId",
        ".service.config.json"
      );
      previousLastRefreshId = 234;
    });

    let exec = async () => {
      await beforeExec();

      customService = new MockedCustomService(type, id, dataStorage);

      if (initialize) {
        let payloadToInitialize = cloneObject(initPayload);
        await customService.init(initTickId, payloadToInitialize);
      }

      if (previousLastRefreshId != null) {
        setPrivateProperty(
          customService,
          "_lastRefreshTickID",
          previousLastRefreshId
        );
      }

      return customService.refresh(tickId);
    };

    it("should call OnRefresh and set LastRefreshTickID - if service is initialized and tickId corresponds to sampleTime", async () => {
      tickId = 1000;
      initPayload.sampleTime = 100;

      await exec();

      let mockedCustomService = customService as MockedCustomService;

      expect(mockedCustomService.__onRefreshMockFunc).toHaveBeenCalledTimes(1);
      expect(mockedCustomService.__onRefreshMockFunc.mock.calls[0]).toEqual([
        tickId,
      ]);
      expect(mockedCustomService.LastRefreshTickID).toEqual(tickId);
    });

    it("should not call OnRefresh and not set LastRefreshTickID - if service is initialized but tickId does not correspond to sampleTime", async () => {
      tickId = 1000;
      initPayload.sampleTime = 123;

      await exec();

      let mockedCustomService = customService as MockedCustomService;

      expect(mockedCustomService.__onRefreshMockFunc).not.toHaveBeenCalled();
      expect(mockedCustomService.LastRefreshTickID).toEqual(
        previousLastRefreshId
      );
    });

    it("should not call OnRefresh and not set LastRefreshTickID - if service is initialized but tickId does not correspond to sampleTime", async () => {
      tickId = 1000;
      initPayload.sampleTime = 123;

      await exec();

      let mockedCustomService = customService as MockedCustomService;

      expect(mockedCustomService.__onRefreshMockFunc).not.toHaveBeenCalled();
      expect(mockedCustomService.LastRefreshTickID).toEqual(
        previousLastRefreshId
      );
    });

    it("should not call OnRefresh and not set LastRefreshTickID - if service is not initialized, tickId corresponds to sampleTime", async () => {
      tickId = 1000;
      initPayload.sampleTime = 100;
      initialize = false;

      await exec();

      let mockedCustomService = customService as MockedCustomService;

      expect(mockedCustomService.__onRefreshMockFunc).not.toHaveBeenCalled();
      expect(mockedCustomService.LastRefreshTickID).toEqual(
        previousLastRefreshId
      );
    });

    it("should not fetch data from storage - fetching based on CustomerServiceManager", async () => {
      await exec();

      //OnInit should not have been called
      expect(getFileContent).not.toHaveBeenCalled();
    });
  });

  describe("getConfig", () => {
    let id: string;
    let type: string;
    let dataStorage: MindSphereDataStorage<TestCustomServiceConfig>;
    let customService: CustomService<
      TestCustomServiceConfig,
      TestCustomServiceData
    >;
    let initTickId: number;
    let initPayload: TestCustomServiceConfig;
    let initialize: boolean;
    let initializeStorage: boolean;

    beforeEach(() => {
      id = "testCustomServiceId";
      type = "testCustomServiceType";
      initializeStorage = true;
      initialize = true;
      initTickId = 123;
      initPayload = {
        sampleTime: 100,
        serviceType: "TestCustomServicePayload" as any,
        testConfig: { abcd: "efgh" },
        appId: "testAppId",
        id: "testCustomServiceId",
        plantId: "testPlantId",
      };
      dataStorage = new MindSphereDataStorage(
        "hostTenant",
        "testServiceContainerAssetId",
        "service.config.json"
      );
    });

    let exec = async () => {
      await beforeExec();

      if (initializeStorage) await dataStorage.init();

      customService = new MockedCustomService(type, id, dataStorage);

      if (initialize) {
        let payloadToInitialize = cloneObject(initPayload);
        await customService.init(initTickId, payloadToInitialize);
      }

      return customService.getConfig();
    };

    it("should fetch data from storage and return it - if storage has not been initialzied before", async () => {
      initializeStorage = false;
      let result = await exec();

      expect(result).toEqual(initPayload);
      expect(getFileContent).toHaveBeenCalledTimes(1);
      expect(getFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "testServiceContainerAssetId",
        "testCustomServiceId.service.config.json",
      ]);
    });

    it("should not fetch data but return it from cache - if storage has been initialzied before", async () => {
      initializeStorage = false;
      let result = await exec();

      expect(result).toEqual(initPayload);
      //GetFileContent called only during initialziation
      expect(getFileContent).toHaveBeenCalledTimes(1);
      expect(getFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "testServiceContainerAssetId",
        "testCustomServiceId.service.config.json",
      ]);
    });

    it("should return null - if there is no data of given id in storage or in cache", async () => {
      id = "fakeTestCustomServiceId";

      let result = await exec();

      expect(result).toEqual(null);
    });

    it("should throw - if service has not been initialized before", async () => {
      initialize = false;
      await expect(exec()).rejects.toMatchObject({
        message: "Service not initialized!",
      });
    });
  });

  describe("setStorageData", () => {
    let id: string;
    let type: string;
    let dataStorage: MindSphereDataStorage<TestCustomServiceConfig>;
    let customService: CustomService<
      TestCustomServiceConfig,
      TestCustomServiceData
    >;
    let initTickId: number;
    let initPayload: TestCustomServiceConfig;
    let initialize: boolean;
    let initializeStorage: boolean;
    let newPayload: TestCustomServiceConfig;
    let setFileContentThrows: boolean;

    beforeEach(() => {
      id = "testCustomServiceId";
      type = "testCustomServiceType";
      initializeStorage = true;
      initialize = true;
      initTickId = 123;
      setFileContentThrows = false;
      initPayload = {
        sampleTime: 100,
        serviceType: "TestCustomServicePayload" as any,
        testConfig: { abcd: "efgh" },
        appId: "testAppId",
        id: "testCustomServiceId",
        plantId: "testPlantId",
      };
      dataStorage = new MindSphereDataStorage(
        "hostTenant",
        "testServiceContainerAssetId",
        "service.config.json"
      );
      newPayload = {
        sampleTime: 200,
        serviceType: "TestCustomServicePayload" as any,
        testConfig: { ijkl: "mnop" },
        appId: "testAppId",
        id: "testCustomServiceId",
        plantId: "testPlantId",
      };
    });

    let exec = async () => {
      await beforeExec();

      if (initializeStorage) await dataStorage.init();

      customService = new MockedCustomService(type, id, dataStorage);

      if (initialize) {
        let payloadToInitialize = cloneObject(initPayload);
        await customService.init(initTickId, payloadToInitialize);
      }

      if (setFileContentThrows) {
        MindSphereFileService.getInstance().setFileContent = jest.fn(
          async () => {
            throw new Error("Test set file content error");
          }
        );
      }

      return customService.setConfig(newPayload);
    };

    it("should update data in storage and call onSetStorageData", async () => {
      await exec();

      //getFileContent should have been called during initialization
      expect(getFileContent).toHaveBeenCalledTimes(1);
      expect(getFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "testServiceContainerAssetId",
        "testCustomServiceId.service.config.json",
      ]);
      //setFileContent should have been called to set data into storage
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "testServiceContainerAssetId",
        "testCustomServiceId.service.config.json",
        newPayload,
      ]);
      let mockedCustomService = customService as MockedCustomService;
      //onSetStorageData should have been called to set data in service after setting it in storage
      expect(
        mockedCustomService.__onSetStorageDataMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mockedCustomService.__onSetStorageDataMockFunc.mock.calls[0]
      ).toEqual([newPayload]);

      //New data should be accessible by calling getFileContent
      let resultContent = await customService.getConfig();
      expect(resultContent).toEqual(newPayload);
    });

    it("should update data in storage and call onSetStorageData - even if storage has not been fetched before", async () => {
      initializeStorage = false;

      await exec();

      //getFileContent should not have been called - lack of initialziation
      expect(getFileContent).not.toHaveBeenCalled();
      //setFileContent should have been called to set data into storage
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "testServiceContainerAssetId",
        "testCustomServiceId.service.config.json",
        newPayload,
      ]);
      let mockedCustomService = customService as MockedCustomService;
      //onSetStorageData should have been called to set data in service after setting it in storage
      expect(
        mockedCustomService.__onSetStorageDataMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mockedCustomService.__onSetStorageDataMockFunc.mock.calls[0]
      ).toEqual([newPayload]);

      //New data should be accessible by calling getFileContent
      let resultContent = await customService.getConfig();
      expect(resultContent).toEqual(newPayload);
    });

    it("should set data into storage and call onSetStorageData - even if there is no dataStorage of given id", async () => {
      id = "fakeTestCustomServiceId";

      await exec();

      //getFileContent should have been called during initialization
      expect(getFileContent).toHaveBeenCalledTimes(1);
      expect(getFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "testServiceContainerAssetId",
        "testCustomServiceId.service.config.json",
      ]);
      //setFileContent should have been called to set data into storage
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "testServiceContainerAssetId",
        "fakeTestCustomServiceId.service.config.json",
        newPayload,
      ]);
      let mockedCustomService = customService as MockedCustomService;
      //onSetStorageData should have been called to set data in service after setting it in storage
      expect(
        mockedCustomService.__onSetStorageDataMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mockedCustomService.__onSetStorageDataMockFunc.mock.calls[0]
      ).toEqual([newPayload]);

      //New data should be accessible by calling getFileContent
      let resultContent = await customService.getConfig();
      expect(resultContent).toEqual(newPayload);
    });

    it("should throw and not update data in storage and not call onSetStorageData - if service has not been initialized", async () => {
      initialize = false;

      await expect(exec()).rejects.toMatchObject({
        message: "Service not initialized!",
      });

      //getFileContent should have been called during initialization
      expect(getFileContent).toHaveBeenCalledTimes(1);
      expect(getFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "testServiceContainerAssetId",
        "testCustomServiceId.service.config.json",
      ]);
      //setFileContent should not have been called
      expect(setFileContent).not.toHaveBeenCalled();

      let mockedCustomService = customService as MockedCustomService;
      //onSetStorageData should not have been called
      expect(
        mockedCustomService.__onSetStorageDataMockFunc
      ).not.toHaveBeenCalled();
    });

    it("should throw and not call onSetStorageData - if setFileContent throws", async () => {
      setFileContentThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "Test set file content error",
      });

      //getFileContent should have been called during initialization
      expect(getFileContent).toHaveBeenCalledTimes(1);
      expect(getFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "testServiceContainerAssetId",
        "testCustomServiceId.service.config.json",
      ]);
      //setFileContent should not have been called (invoking different mock function that throws)
      expect(setFileContent).not.toHaveBeenCalled();

      let mockedCustomService = customService as MockedCustomService;
      //onSetStorageData should not have been called
      expect(
        mockedCustomService.__onSetStorageDataMockFunc
      ).not.toHaveBeenCalled();

      //Data should be accessible as they were before
      let resultContent = await customService.getConfig();
      expect(resultContent).toEqual(initPayload);
    });
  });
});

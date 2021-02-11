import { MindSphereDataStorage } from "../../../../classes/DataStorage/MindSphereDataStorage";
import { MindSphereFileService } from "../../../../classes/MindSphereService/MindSphereFileService";
import { MindSphereTokenManager } from "../../../../classes/MindSphereService/MindSphereToken/MindSphereTokenManager";
import { snooze } from "../../../../utilities/utilities";

describe("MindSphereDataStorage", () => {
  let mindSphereFileService: MindSphereFileService;
  let mindSphereDataStorageGetFileMockFunc: jest.Mock;
  let mindSphereDataStorageSetFileMockFunc: jest.Mock;
  let mindSphereDataStorageCheckFileMockFunc: jest.Mock;
  let mockedGetFileResult: any;
  let mockedCheckFileResult: any;

  beforeEach(() => {
    //Clearing MindSphereServices
    (MindSphereTokenManager as any)._instance = null;
    (MindSphereFileService as any)._instance = null;

    //Mocking MindSphereFileService
    mockedGetFileResult = { testFileContent: "testFileContentValue" };
    //Etag value
    mockedCheckFileResult = 123;

    mindSphereDataStorageGetFileMockFunc = jest.fn(async () => {
      return mockedGetFileResult;
    });
    mindSphereDataStorageSetFileMockFunc = jest.fn();
    mindSphereDataStorageCheckFileMockFunc = jest.fn(async () => {
      return mockedCheckFileResult;
    });
    mindSphereFileService = MindSphereFileService.getInstance();
    mindSphereFileService.checkIfFileExists = mindSphereDataStorageCheckFileMockFunc;
    mindSphereFileService.getFileContent = mindSphereDataStorageGetFileMockFunc;
    mindSphereFileService.setFileContent = mindSphereDataStorageSetFileMockFunc;
  });

  afterEach(() => {
    //Clearing MindSphereServices
    (MindSphereTokenManager as any)._instance = null;
    (MindSphereFileService as any)._instance = null;
  });

  describe("constructor", () => {
    let AssetId: string;

    beforeEach(() => {
      AssetId = "testAssetId";
    });

    let exec = () => {
      return new MindSphereDataStorage(AssetId);
    };

    it("should create and return valid MindSphereDataStorage with valid AssetId", () => {
      let result = exec();

      expect(result).toBeDefined();
      expect(result.AssetId).toEqual("testAssetId");
    });

    it("should get new instance of MindSphereFileService", () => {
      let result = exec() as any;

      expect(result._fileService).toBeDefined();
      expect(
        result._fileService instanceof MindSphereDataStorage
      ).toBeDefined();
    });
  });

  describe("dataExists", () => {
    let mindSphereDataStorage: MindSphereDataStorage<any>;
    let assetId: string;
    let dataId: string;
    let cacheContent: any;

    beforeEach(() => {
      assetId = "testAssetId";
      dataId = "testFile2";
      cacheContent = {};
    });

    let exec = async () => {
      mindSphereDataStorage = new MindSphereDataStorage<any>(assetId);

      //Setting cache content for check behaviour based on cache content
      (mindSphereDataStorage as any)._cacheData = cacheContent;

      return mindSphereDataStorage.dataExists(dataId);
    };

    it("should call checkFile with valid parameters - if cache is empty", async () => {
      await exec();

      expect(mindSphereDataStorageCheckFileMockFunc).toHaveBeenCalledTimes(1);
      expect(mindSphereDataStorageCheckFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereDataStorageCheckFileMockFunc.mock.calls[0][1]).toEqual(
        "testFile2.json"
      );
    });

    it("should not call checkFile - if data exists in cache", async () => {
      cacheContent = {
        [dataId]: "fakeContent",
      };
      await exec();

      expect(mindSphereDataStorageCheckFileMockFunc).not.toHaveBeenCalled();
    });

    it("should return true if checkFile returns etag (value) and cache is empty", async () => {
      mockedCheckFileResult = true;

      let result = await exec();

      expect(result).toEqual(true);
    });

    it("should return false if checkFile returns null and cache is empty", async () => {
      mockedCheckFileResult = null;

      let result = await exec();

      expect(result).toEqual(false);
    });

    it("should return true if checkFile returns null but file exists in cache", async () => {
      mockedCheckFileResult = null;
      cacheContent = {
        [dataId]: "fakeContent",
      };

      let result = await exec();

      expect(result).toEqual(true);
    });

    it("should throw if checkFile throws", async () => {
      mindSphereFileService.checkIfFileExists = jest.fn(async () => {
        await snooze(100);
        throw new Error("testError");
      });

      await expect(exec()).rejects.toMatchObject({ message: "testError" });
    });
  });

  describe("getData", () => {
    let mindSphereDataStorage: MindSphereDataStorage<any>;
    let assetId: string;
    let dataId: string;
    let cacheContent: any;

    beforeEach(() => {
      assetId = "testAssetId";
      dataId = "testFile2";
      cacheContent = {};
    });

    let exec = async () => {
      mindSphereDataStorage = new MindSphereDataStorage<any>(assetId);

      //Setting cache content for check if value is returned from cache or from file
      (mindSphereDataStorage as any)._cacheData = cacheContent;

      return mindSphereDataStorage.getData(dataId);
    };

    it("should fetch cache and return content of getFile method - if cache is empty", async () => {
      cacheContent = {};

      let result = await exec();

      //Checking checkFile call
      expect(mindSphereDataStorageCheckFileMockFunc).toHaveBeenCalledTimes(1);
      expect(mindSphereDataStorageCheckFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereDataStorageCheckFileMockFunc.mock.calls[0][1]).toEqual(
        "testFile2.json"
      );

      //Checking getFile call
      expect(mindSphereDataStorageGetFileMockFunc).toHaveBeenCalledTimes(1);
      expect(mindSphereDataStorageGetFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereDataStorageGetFileMockFunc.mock.calls[0][1]).toEqual(
        "testFile2.json"
      );

      //Checking result
      expect(result).toEqual(mockedGetFileResult);

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({
        [dataId]: mockedGetFileResult,
      });
    });

    it("should return null and not call getFile or fetch cache - if cache is empty and checkFile returns null", async () => {
      mockedCheckFileResult = null;

      cacheContent = {};

      let result = await exec();

      expect(result).toEqual(null);

      expect(mindSphereDataStorageCheckFileMockFunc).toHaveBeenCalledTimes(1);
      expect(mindSphereDataStorageCheckFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereDataStorageCheckFileMockFunc.mock.calls[0][1]).toEqual(
        "testFile2.json"
      );

      expect(mindSphereDataStorageGetFileMockFunc).not.toHaveBeenCalled();

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({});
    });

    it("should return content from cache and not call checkFile or getFile - if content in cache exists", async () => {
      cacheContent = {
        [dataId]: {
          lol: 123,
        },
      };
      let result = await exec();

      expect(result).toEqual({ lol: 123 });

      expect(mindSphereDataStorageCheckFileMockFunc).not.toHaveBeenCalled();
      expect(mindSphereDataStorageCheckFileMockFunc).not.toHaveBeenCalled();

      //Checking content cache

      expect((mindSphereDataStorage as any)._cacheData).toEqual({
        [dataId]: {
          lol: 123,
        },
      });
    });

    it("should return null and not fetch cache - if cache is empty and getFile returns null", async () => {
      mockedGetFileResult = null;

      cacheContent = {};

      let result = await exec();

      expect(result).toEqual(null);

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({});
    });

    it("should throw if checkFile throws", async () => {
      cacheContent = {};

      mindSphereFileService.checkIfFileExists = jest.fn(async () => {
        await snooze(100);
        throw new Error("testError");
      });

      await expect(exec()).rejects.toMatchObject({ message: "testError" });
      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({});
    });

    it("should throw if getFile throws", async () => {
      cacheContent = {};

      mindSphereFileService.getFileContent = jest.fn(async () => {
        await snooze(100);
        throw new Error("testError");
      });

      await expect(exec()).rejects.toMatchObject({ message: "testError" });
      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({});
    });
  });

  describe("setData", () => {
    let mindSphereDataStorage: MindSphereDataStorage<any>;
    let assetId: string;
    let dataId: string;
    let dataToSet: any;
    let cacheContent: any;

    beforeEach(() => {
      assetId = "testAssetId";
      dataId = "testFile4";
      dataToSet = { mno: "prs123" };
      cacheContent = {};
    });

    let exec = async () => {
      mindSphereDataStorage = new MindSphereDataStorage<any>(assetId);

      //Setting cache content for check the behaviour with filled cache
      (mindSphereDataStorage as any)._cacheData = cacheContent;

      return mindSphereDataStorage.setData(dataId, dataToSet);
    };

    it("should call setFile method and set data in cache - if cache is empty and content in cache does not exist", async () => {
      cacheContent = {};

      await exec();

      expect(mindSphereDataStorageSetFileMockFunc).toHaveBeenCalledTimes(1);
      expect(mindSphereDataStorageSetFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereDataStorageSetFileMockFunc.mock.calls[0][1]).toEqual(
        "testFile4.json"
      );
      expect(mindSphereDataStorageSetFileMockFunc.mock.calls[0][2]).toEqual({
        mno: "prs123",
      });

      //Checking cache
      let mockedMindSphereDataStorage = mindSphereDataStorage as any;

      expect(mockedMindSphereDataStorage._cacheData[dataId]).toEqual({
        mno: "prs123",
      });
    });

    it("should call setFile method and override data in cache - if cache is empty and content in cache exists", async () => {
      cacheContent = {
        [dataId]: "abcd",
      };

      await exec();

      expect(mindSphereDataStorageSetFileMockFunc).toHaveBeenCalledTimes(1);
      expect(mindSphereDataStorageSetFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereDataStorageSetFileMockFunc.mock.calls[0][1]).toEqual(
        "testFile4.json"
      );
      expect(mindSphereDataStorageSetFileMockFunc.mock.calls[0][2]).toEqual({
        mno: "prs123",
      });

      //Checking cache
      let mockedMindSphereDataStorage = mindSphereDataStorage as any;

      expect(mockedMindSphereDataStorage._cacheData[dataId]).toEqual({
        mno: "prs123",
      });
    });

    it("should throw and not set data in cache if setFile throws", async () => {
      mindSphereFileService.setFileContent = jest.fn(async () => {
        await snooze(100);
        throw new Error("testError");
      });

      await expect(exec()).rejects.toMatchObject({ message: "testError" });
      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({});
    });
  });
});

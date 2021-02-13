import "jest-extended";
import { MindSphereDataStorage } from "../../../../classes/DataStorage/MindSphereDataStorage";
import { MindSphereFileService } from "../../../../classes/MindSphereService/MindSphereFileService";
import { MindSphereTokenManager } from "../../../../classes/MindSphereService/MindSphereToken/MindSphereTokenManager";
import { snooze } from "../../../../utilities/utilities";

describe("MindSphereDataStorage", () => {
  let mindSphereFileService: MindSphereFileService;
  let mindSphereFileServiceGetFileMockFunc: jest.Mock;
  let mindSphereFileServiceSetFileMockFunc: jest.Mock;
  let mindSphereFileServiceCheckFileMockFunc: jest.Mock;
  let mindSphereFileServiceGetAllFileNamesMockFunc: jest.Mock;
  let mockedGetFileResult: any;
  let mockedCheckFileResult: any;
  let mockedGetAllFilesResult: any;

  beforeEach(() => {
    //Clearing MindSphereServices
    (MindSphereTokenManager as any)._instance = null;
    (MindSphereFileService as any)._instance = null;

    //Mocking MindSphereFileService
    mockedGetFileResult = { testFileContent: "testFileContentValue" };
    //Etag value
    mockedCheckFileResult = 123;
    mockedGetAllFilesResult = [
      "testFile1.json",
      "testFile2.json",
      "testFile3.json",
      "testFile4.json",
      "testFile5.json",
    ];

    mindSphereFileServiceGetFileMockFunc = jest.fn(async () => {
      return mockedGetFileResult;
    });
    mindSphereFileServiceSetFileMockFunc = jest.fn();
    mindSphereFileServiceCheckFileMockFunc = jest.fn(async () => {
      return mockedCheckFileResult;
    });
    mindSphereFileServiceGetAllFileNamesMockFunc = jest.fn(async () => {
      return mockedGetAllFilesResult;
    });
    mindSphereFileService = MindSphereFileService.getInstance();
    mindSphereFileService.checkIfFileExists = mindSphereFileServiceCheckFileMockFunc;
    mindSphereFileService.getFileContent = mindSphereFileServiceGetFileMockFunc;
    mindSphereFileService.setFileContent = mindSphereFileServiceSetFileMockFunc;
    mindSphereFileService.getAllFileNamesFromAsset = mindSphereFileServiceGetAllFileNamesMockFunc;
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

      expect(mindSphereFileServiceCheckFileMockFunc).toHaveBeenCalledTimes(1);
      expect(mindSphereFileServiceCheckFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceCheckFileMockFunc.mock.calls[0][1]).toEqual(
        "testFile2.json"
      );
    });

    it("should not call checkFile - if data exists in cache", async () => {
      cacheContent = {
        [dataId]: "fakeContent",
      };
      await exec();

      expect(mindSphereFileServiceCheckFileMockFunc).not.toHaveBeenCalled();
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
      expect(mindSphereFileServiceCheckFileMockFunc).toHaveBeenCalledTimes(1);
      expect(mindSphereFileServiceCheckFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceCheckFileMockFunc.mock.calls[0][1]).toEqual(
        "testFile2.json"
      );

      //Checking getFile call
      expect(mindSphereFileServiceGetFileMockFunc).toHaveBeenCalledTimes(1);
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[0][1]).toEqual(
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

      expect(mindSphereFileServiceCheckFileMockFunc).toHaveBeenCalledTimes(1);
      expect(mindSphereFileServiceCheckFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceCheckFileMockFunc.mock.calls[0][1]).toEqual(
        "testFile2.json"
      );

      expect(mindSphereFileServiceGetFileMockFunc).not.toHaveBeenCalled();

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

      expect(mindSphereFileServiceCheckFileMockFunc).not.toHaveBeenCalled();
      expect(mindSphereFileServiceCheckFileMockFunc).not.toHaveBeenCalled();

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

      expect(mindSphereFileServiceSetFileMockFunc).toHaveBeenCalledTimes(1);
      expect(mindSphereFileServiceSetFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceSetFileMockFunc.mock.calls[0][1]).toEqual(
        "testFile4.json"
      );
      expect(mindSphereFileServiceSetFileMockFunc.mock.calls[0][2]).toEqual({
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

      expect(mindSphereFileServiceSetFileMockFunc).toHaveBeenCalledTimes(1);
      expect(mindSphereFileServiceSetFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceSetFileMockFunc.mock.calls[0][1]).toEqual(
        "testFile4.json"
      );
      expect(mindSphereFileServiceSetFileMockFunc.mock.calls[0][2]).toEqual({
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

  describe("getAllIds", () => {
    let mindSphereDataStorage: MindSphereDataStorage<any>;
    let assetId: string;
    let cacheContent: any;

    beforeEach(() => {
      assetId = "testAssetId";
      cacheContent = {};
    });

    let exec = async () => {
      mindSphereDataStorage = new MindSphereDataStorage<any>(assetId);

      //Setting cache content for check if value is returned from cache or from file
      (mindSphereDataStorage as any)._cacheData = cacheContent;

      return mindSphereDataStorage.getAllIds();
    };

    it("should not fetch cache call GetAllFileNames and return ids of all files", async () => {
      cacheContent = {};

      mockedGetAllFilesResult = [
        "testFile1.json",
        "testFile2.json",
        "testFile3.json",
        "testFile4.json",
        "testFile5.json",
      ];

      let result = await exec();

      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][0]
      ).toEqual("testAssetId");
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][1]
      ).toEqual("json");

      //Checking result
      expect(result).toEqual([
        "testFile1",
        "testFile2",
        "testFile3",
        "testFile4",
        "testFile5",
      ]);

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({});
    });

    it("should not fetch cache call GetAllFileNames and return empty array - if GetAllFileNames returns empty array", async () => {
      cacheContent = {};

      mockedGetAllFilesResult = [];

      let result = await exec();

      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][0]
      ).toEqual("testAssetId");
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][1]
      ).toEqual("json");

      //Checking result
      expect(result).toEqual([]);

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({});
    });

    it("should return ids from cache - if cache is not empty and GetAllFileNames return empty array", async () => {
      cacheContent = {
        testFile6: "abcd123",
        testFile7: "abcd124",
        testFile8: "abcd125",
      };

      mockedGetAllFilesResult = [];

      let result = await exec();

      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][0]
      ).toEqual("testAssetId");
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][1]
      ).toEqual("json");

      //Checking result
      expect(result).toEqual(["testFile6", "testFile7", "testFile8"]);

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({
        testFile6: "abcd123",
        testFile7: "abcd124",
        testFile8: "abcd125",
      });
    });

    it("should return combined fileNames from cache and from result of GetAllFileNames - if cache is not empty", async () => {
      cacheContent = {
        testFile6: "abcd123",
        testFile7: "abcd124",
        testFile8: "abcd125",
      };

      mockedGetAllFilesResult = [
        "testFile1.json",
        "testFile2.json",
        "testFile3.json",
        "testFile4.json",
        "testFile5.json",
      ];

      let result = await exec();

      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][0]
      ).toEqual("testAssetId");
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][1]
      ).toEqual("json");

      //Checking result
      expect(result).toEqual([
        "testFile6",
        "testFile7",
        "testFile8",
        "testFile1",
        "testFile2",
        "testFile3",
        "testFile4",
        "testFile5",
      ]);

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({
        testFile6: "abcd123",
        testFile7: "abcd124",
        testFile8: "abcd125",
      });
    });

    it("should return combined fileNames from cache and from result of GetAllFileNames - if cache is not empty and there are duplicates in cache and storage", async () => {
      cacheContent = {
        testFile4: "abcd121",
        testFile5: "abcd122",
        testFile6: "abcd123",
        testFile7: "abcd124",
        testFile8: "abcd125",
      };

      mockedGetAllFilesResult = [
        "testFile1.json",
        "testFile2.json",
        "testFile3.json",
        "testFile4.json",
        "testFile5.json",
      ];

      let result = await exec();

      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][0]
      ).toEqual("testAssetId");
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][1]
      ).toEqual("json");

      //Checking result
      expect(result).toEqual([
        "testFile4",
        "testFile5",
        "testFile6",
        "testFile7",
        "testFile8",
        "testFile1",
        "testFile2",
        "testFile3",
      ]);

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({
        testFile4: "abcd121",
        testFile5: "abcd122",
        testFile6: "abcd123",
        testFile7: "abcd124",
        testFile8: "abcd125",
      });
    });

    it("should throw if GetAllFileNames throws", async () => {
      cacheContent = {};

      mindSphereFileService.getAllFileNamesFromAsset = jest.fn(async () => {
        await snooze(100);
        throw new Error("testError");
      });

      await expect(exec()).rejects.toMatchObject({ message: "testError" });
      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({});
    });
  });

  describe("fetchData", () => {
    let mindSphereDataStorage: MindSphereDataStorage<any>;
    let assetId: string;
    let cacheContent: any;
    let dataId: string;

    beforeEach(() => {
      assetId = "testAssetId";
      cacheContent = {};
      dataId = "testDataId";
    });

    let exec = async () => {
      mindSphereDataStorage = new MindSphereDataStorage<any>(assetId);

      //Setting cache content for check if value is returned from cache or from file
      (mindSphereDataStorage as any)._cacheData = cacheContent;

      return mindSphereDataStorage.fetchData(dataId);
    };

    it("should call GetFile and fetch cache with the result - if checkFile returns valid etag", async () => {
      //Adding one additional item to cache to check if it is not deleted
      cacheContent = {
        testId2: {
          oldContent: "5678",
        },
      };

      //Setting etag
      mockedCheckFileResult = 123;

      mockedGetFileResult = {
        testContent1: 123,
        testContent2: 456,
        testContent3: 789,
      };

      await exec();

      //Check file should have been called
      expect(mindSphereFileServiceCheckFileMockFunc).toHaveBeenCalledTimes(1);
      expect(mindSphereFileServiceCheckFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceCheckFileMockFunc.mock.calls[0][1]).toEqual(
        "testDataId.json"
      );

      //Get file should have been called
      expect(mindSphereFileServiceGetFileMockFunc).toHaveBeenCalledTimes(1);
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[0][1]).toEqual(
        "testDataId.json"
      );

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({
        testDataId: {
          testContent1: 123,
          testContent2: 456,
          testContent3: 789,
        },
        testId2: {
          oldContent: "5678",
        },
      });
    });

    it("should call GetFile fetch cache and replace existing one with the result - if there is data of givenId in cache", async () => {
      cacheContent = {
        testDataId: {
          oldContent: "1234",
        },
        testId2: {
          oldContent: "5678",
        },
      };

      //Setting etag
      mockedCheckFileResult = 123;

      mockedGetFileResult = {
        testContent1: 123,
        testContent2: 456,
        testContent3: 789,
      };

      await exec();

      //Check file should have been called
      expect(mindSphereFileServiceCheckFileMockFunc).toHaveBeenCalledTimes(1);
      expect(mindSphereFileServiceCheckFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceCheckFileMockFunc.mock.calls[0][1]).toEqual(
        "testDataId.json"
      );

      //Get file should have been called
      expect(mindSphereFileServiceGetFileMockFunc).toHaveBeenCalledTimes(1);
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[0][1]).toEqual(
        "testDataId.json"
      );

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({
        testDataId: {
          testContent1: 123,
          testContent2: 456,
          testContent3: 789,
        },
        testId2: {
          oldContent: "5678",
        },
      });
    });

    it("should call CheckFile and delete content from cache - if checkIfFileExists returns null and cache exists", async () => {
      cacheContent = {
        testDataId: {
          oldContent: "1234",
        },
      };

      //Setting etag
      mockedCheckFileResult = null;

      mockedGetFileResult = {
        testContent1: 123,
        testContent2: 456,
        testContent3: 789,
      };

      await exec();

      expect(mindSphereFileServiceCheckFileMockFunc).toHaveBeenCalledTimes(1);
      expect(mindSphereFileServiceCheckFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceCheckFileMockFunc.mock.calls[0][1]).toEqual(
        "testDataId.json"
      );

      //Getting file should not be called if there is no such file
      expect(mindSphereFileServiceGetFileMockFunc).not.toHaveBeenCalled();

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({});
    });

    it("should call CheckFile and leave cache as it is - if checkIfFileExists returns null and there is no such dataId in cache", async () => {
      cacheContent = {
        testId2: {
          oldContent: "5678",
        },
      };

      //Setting etag
      mockedCheckFileResult = null;

      mockedGetFileResult = {
        testContent1: 123,
        testContent2: 456,
        testContent3: 789,
      };

      await exec();

      expect(mindSphereFileServiceCheckFileMockFunc).toHaveBeenCalledTimes(1);
      expect(mindSphereFileServiceCheckFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceCheckFileMockFunc.mock.calls[0][1]).toEqual(
        "testDataId.json"
      );

      //Getting file should not be called if there is no such file
      expect(mindSphereFileServiceGetFileMockFunc).not.toHaveBeenCalled();

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({
        testId2: {
          oldContent: "5678",
        },
      });
    });

    it("should throw and not change cache if CheckFile throws", async () => {
      cacheContent = {
        testId2: {
          oldContent: "5678",
        },
      };

      mindSphereFileService.checkIfFileExists = jest.fn(async () => {
        await snooze(100);
        throw new Error("testError");
      });

      await expect(exec()).rejects.toMatchObject({ message: "testError" });
      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({
        testId2: {
          oldContent: "5678",
        },
      });
    });

    it("should throw and not change cache if GetFile throws", async () => {
      cacheContent = {
        testId2: {
          oldContent: "5678",
        },
      };

      mindSphereFileService.getFileContent = jest.fn(async () => {
        await snooze(100);
        throw new Error("testError");
      });

      await expect(exec()).rejects.toMatchObject({ message: "testError" });
      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({
        testId2: {
          oldContent: "5678",
        },
      });
    });
  });

  describe("fetchAllData", () => {
    let mindSphereDataStorage: MindSphereDataStorage<any>;
    let assetId: string;
    let cacheContent: any;
    let mockGetFileDataToReturnCollection: { [key: string]: any };

    beforeEach(() => {
      assetId = "testAssetId";
      cacheContent = {};
      mockedGetAllFilesResult = [
        "testFile1.json",
        "testFile2.json",
        "testFile3.json",
        "testFile4.json",
        "testFile5.json",
      ];

      mockGetFileDataToReturnCollection = {
        "testFile1.json": { abcd: 1234 },
        "testFile2.json": { efgh: 5678 },
        "testFile3.json": { ijkl: 9012 },
        "testFile4.json": { mnop: 3456 },
        "testFile5.json": { rstu: 7890 },
      };

      mindSphereFileServiceGetFileMockFunc = jest.fn(
        async (assetId: string, fileName: string) => {
          await snooze(10);
          return mockGetFileDataToReturnCollection[fileName];
        }
      );

      mindSphereFileService.getFileContent = mindSphereFileServiceGetFileMockFunc;
    });

    let exec = async () => {
      mindSphereDataStorage = new MindSphereDataStorage<any>(assetId);

      //Setting cache content for check if value is returned from cache or from file
      (mindSphereDataStorage as any)._cacheData = cacheContent;

      return mindSphereDataStorage.fetchAllData();
    };

    it("should call GetFileNames and then GetFile and insert values of every file to storage", async () => {
      cacheContent = {};

      await exec();

      //Check file should have been called
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][0]
      ).toEqual("testAssetId");
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][1]
      ).toEqual("json");

      //Get file should have been called 5 times
      expect(mindSphereFileServiceGetFileMockFunc).toHaveBeenCalledTimes(5);
      //Get file should have been called after GetAllFileNames
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledBefore(mindSphereFileServiceGetFileMockFunc);

      //Get file should be called for every file name returned from GetAllFileNames with no particular order
      //For every call asset id should be the same
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[1][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[2][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[3][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[4][0]).toEqual(
        "testAssetId"
      );
      //File names should be called with no particular order - Promise.all
      let arrayOfSecondArguments = [
        mindSphereFileServiceGetFileMockFunc.mock.calls[0][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[1][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[2][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[3][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[4][1],
      ];
      expect(arrayOfSecondArguments).toContain("testFile1.json");
      expect(arrayOfSecondArguments).toContain("testFile2.json");
      expect(arrayOfSecondArguments).toContain("testFile3.json");
      expect(arrayOfSecondArguments).toContain("testFile4.json");
      expect(arrayOfSecondArguments).toContain("testFile5.json");

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({
        testFile1: { abcd: 1234 },
        testFile2: { efgh: 5678 },
        testFile3: { ijkl: 9012 },
        testFile4: { mnop: 3456 },
        testFile5: { rstu: 7890 },
      });
    });

    it("should call GetFileNames and then GetFile and insert values of every file to storage - even if they already exist in cache", async () => {
      cacheContent = {
        testFile2: { abcd: 5678 },
        testFile3: { efgh: 9012 },
        testFile4: { ijkl: 3456 },
      };

      await exec();

      //Check file should have been called
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][0]
      ).toEqual("testAssetId");
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][1]
      ).toEqual("json");

      //Get file should have been called 5 times
      expect(mindSphereFileServiceGetFileMockFunc).toHaveBeenCalledTimes(5);
      //Get file should have been called after GetAllFileNames
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledBefore(mindSphereFileServiceGetFileMockFunc);

      //Get file should be called for every file name returned from GetAllFileNames with no particular order
      //For every call asset id should be the same
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[1][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[2][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[3][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[4][0]).toEqual(
        "testAssetId"
      );
      //File names should be called with no particular order - Promise.all
      let arrayOfSecondArguments = [
        mindSphereFileServiceGetFileMockFunc.mock.calls[0][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[1][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[2][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[3][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[4][1],
      ];
      expect(arrayOfSecondArguments).toContain("testFile1.json");
      expect(arrayOfSecondArguments).toContain("testFile2.json");
      expect(arrayOfSecondArguments).toContain("testFile3.json");
      expect(arrayOfSecondArguments).toContain("testFile4.json");
      expect(arrayOfSecondArguments).toContain("testFile5.json");

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({
        testFile1: { abcd: 1234 },
        testFile2: { efgh: 5678 },
        testFile3: { ijkl: 9012 },
        testFile4: { mnop: 3456 },
        testFile5: { rstu: 7890 },
      });
    });

    it("should call GetFileNames and then GetFile, insert values of every file to storage and delete the ones not returned via getAllFileNames - even if they already exist in cache", async () => {
      cacheContent = {
        testFile2: { abcd: 5678 },
        testFile3: { efgh: 9012 },
        testFile4: { ijkl: 3456 },
        testFile6: { oprs: 900 },
        testFile7: { tuwx: 800 },
      };

      await exec();

      //Check file should have been called
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][0]
      ).toEqual("testAssetId");
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][1]
      ).toEqual("json");

      //Get file should have been called 5 times
      expect(mindSphereFileServiceGetFileMockFunc).toHaveBeenCalledTimes(5);
      //Get file should have been called after GetAllFileNames
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledBefore(mindSphereFileServiceGetFileMockFunc);

      //Get file should be called for every file name returned from GetAllFileNames with no particular order
      //For every call asset id should be the same
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[1][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[2][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[3][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[4][0]).toEqual(
        "testAssetId"
      );
      //File names should be called with no particular order - Promise.all
      let arrayOfSecondArguments = [
        mindSphereFileServiceGetFileMockFunc.mock.calls[0][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[1][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[2][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[3][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[4][1],
      ];
      expect(arrayOfSecondArguments).toContain("testFile1.json");
      expect(arrayOfSecondArguments).toContain("testFile2.json");
      expect(arrayOfSecondArguments).toContain("testFile3.json");
      expect(arrayOfSecondArguments).toContain("testFile4.json");
      expect(arrayOfSecondArguments).toContain("testFile5.json");

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({
        testFile1: { abcd: 1234 },
        testFile2: { efgh: 5678 },
        testFile3: { ijkl: 9012 },
        testFile4: { mnop: 3456 },
        testFile5: { rstu: 7890 },
      });
    });

    it("should clear cache - if GetFileNames return empty array", async () => {
      cacheContent = {
        testFile2: { abcd: 5678 },
        testFile3: { efgh: 9012 },
        testFile4: { ijkl: 3456 },
      };

      mockedGetAllFilesResult = [];

      await exec();

      //Check file should have been called
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][0]
      ).toEqual("testAssetId");
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][1]
      ).toEqual("json");

      //Get file should not have been called
      expect(mindSphereFileServiceGetFileMockFunc).not.toHaveBeenCalled();

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({});
    });

    it("should call GetFileNames and then GetFile and insert values of every file to storage that is not null - GetFileNames returns null values", async () => {
      cacheContent = {};

      mockedGetAllFilesResult = [
        "testFile1.json",
        "testFile2.json",
        null,
        "testFile4.json",
        "testFile5.json",
      ];

      await exec();

      //Check file should have been called
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][0]
      ).toEqual("testAssetId");
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][1]
      ).toEqual("json");

      //Get file should have been called 4 times
      expect(mindSphereFileServiceGetFileMockFunc).toHaveBeenCalledTimes(4);
      //Get file should have been called after GetAllFileNames
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledBefore(mindSphereFileServiceGetFileMockFunc);

      //Get file should be called for every file name returned from GetAllFileNames with no particular order
      //For every call asset id should be the same
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[1][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[2][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[3][0]).toEqual(
        "testAssetId"
      );
      //File names should be called with no particular order - Promise.all
      let arrayOfSecondArguments = [
        mindSphereFileServiceGetFileMockFunc.mock.calls[0][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[1][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[2][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[3][1],
      ];
      expect(arrayOfSecondArguments).toContain("testFile1.json");
      expect(arrayOfSecondArguments).toContain("testFile2.json");
      expect(arrayOfSecondArguments).toContain("testFile4.json");
      expect(arrayOfSecondArguments).toContain("testFile5.json");

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({
        testFile1: { abcd: 1234 },
        testFile2: { efgh: 5678 },
        testFile4: { mnop: 3456 },
        testFile5: { rstu: 7890 },
      });
    });

    it("should delete file from cache - if GetFile returns null for given file", async () => {
      cacheContent = {};

      mockGetFileDataToReturnCollection = {
        "testFile1.json": { abcd: 1234 },
        "testFile2.json": { efgh: 5678 },
        "testFile3.json": null,
        "testFile4.json": { mnop: 3456 },
        "testFile5.json": { rstu: 7890 },
      };

      await exec();

      //Check file should have been called
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][0]
      ).toEqual("testAssetId");
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][1]
      ).toEqual("json");

      //Get file should have been called 5 times
      expect(mindSphereFileServiceGetFileMockFunc).toHaveBeenCalledTimes(5);
      //Get file should have been called after GetAllFileNames
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledBefore(mindSphereFileServiceGetFileMockFunc);

      //Get file should be called for every file name returned from GetAllFileNames with no particular order
      //For every call asset id should be the same
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[1][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[2][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[3][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[4][0]).toEqual(
        "testAssetId"
      );
      //File names should be called with no particular order - Promise.all
      let arrayOfSecondArguments = [
        mindSphereFileServiceGetFileMockFunc.mock.calls[0][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[1][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[2][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[3][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[4][1],
      ];
      expect(arrayOfSecondArguments).toContain("testFile1.json");
      expect(arrayOfSecondArguments).toContain("testFile2.json");
      expect(arrayOfSecondArguments).toContain("testFile3.json");
      expect(arrayOfSecondArguments).toContain("testFile4.json");
      expect(arrayOfSecondArguments).toContain("testFile5.json");

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({
        testFile1: { abcd: 1234 },
        testFile2: { efgh: 5678 },
        testFile4: { mnop: 3456 },
        testFile5: { rstu: 7890 },
      });
    });

    it("should throw and clear cache - if GetAllFiles throws", async () => {
      //Setting cache content in order to ensure that nothing was changed
      cacheContent = {
        testFile2: { abcd: 5678 },
        testFile3: { efgh: 9012 },
        testFile4: { ijkl: 3456 },
      };

      mindSphereFileServiceGetAllFileNamesMockFunc = jest.fn(async () => {
        throw new Error("testError");
      });
      mindSphereFileService.getAllFileNamesFromAsset = mindSphereFileServiceGetAllFileNamesMockFunc;

      await expect(exec()).rejects.toMatchObject({ message: "testError" });

      //Check file should have been called
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][0]
      ).toEqual("testAssetId");
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][1]
      ).toEqual("json");

      //Get file should have not have been called
      expect(mindSphereFileServiceGetFileMockFunc).not.toHaveBeenCalled();
      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({});
    });

    it("should throw and clear cache - if GetFile throws", async () => {
      //Setting cache content in order to ensure that nothing was changed
      cacheContent = {
        testFile2: { abcd: 5678 },
        testFile3: { efgh: 9012 },
        testFile4: { ijkl: 3456 },
      };

      mindSphereFileService.getFileContent = jest.fn(async () => {
        throw new Error("testError");
      });

      await expect(exec()).rejects.toMatchObject({ message: "testError" });

      //Check file should have been called
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][0]
      ).toEqual("testAssetId");
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][1]
      ).toEqual("json");

      //Get file should have not have been called
      expect(mindSphereFileServiceGetFileMockFunc).not.toHaveBeenCalled();
      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({});
    });
  });

  describe("init", () => {
    let mindSphereDataStorage: MindSphereDataStorage<any>;
    let assetId: string;
    let cacheContent: any;
    let mockGetFileDataToReturnCollection: { [key: string]: any };

    beforeEach(() => {
      assetId = "testAssetId";
      cacheContent = {};
      mockedGetAllFilesResult = [
        "testFile1.json",
        "testFile2.json",
        "testFile3.json",
        "testFile4.json",
        "testFile5.json",
      ];

      mockGetFileDataToReturnCollection = {
        "testFile1.json": { abcd: 1234 },
        "testFile2.json": { efgh: 5678 },
        "testFile3.json": { ijkl: 9012 },
        "testFile4.json": { mnop: 3456 },
        "testFile5.json": { rstu: 7890 },
      };

      mindSphereFileServiceGetFileMockFunc = jest.fn(
        async (assetId: string, fileName: string) => {
          await snooze(10);
          return mockGetFileDataToReturnCollection[fileName];
        }
      );

      mindSphereFileService.getFileContent = mindSphereFileServiceGetFileMockFunc;
    });

    let exec = async () => {
      mindSphereDataStorage = new MindSphereDataStorage<any>(assetId);

      //Setting cache content for check if value is returned from cache or from file
      (mindSphereDataStorage as any)._cacheData = cacheContent;

      return mindSphereDataStorage.init();
    };

    it("should call GetFileNames and then GetFile and insert values of every file to storage", async () => {
      cacheContent = {};

      await exec();

      //Check file should have been called
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][0]
      ).toEqual("testAssetId");
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][1]
      ).toEqual("json");

      //Get file should have been called 5 times
      expect(mindSphereFileServiceGetFileMockFunc).toHaveBeenCalledTimes(5);
      //Get file should have been called after GetAllFileNames
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledBefore(mindSphereFileServiceGetFileMockFunc);

      //Get file should be called for every file name returned from GetAllFileNames with no particular order
      //For every call asset id should be the same
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[1][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[2][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[3][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[4][0]).toEqual(
        "testAssetId"
      );
      //File names should be called with no particular order - Promise.all
      let arrayOfSecondArguments = [
        mindSphereFileServiceGetFileMockFunc.mock.calls[0][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[1][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[2][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[3][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[4][1],
      ];
      expect(arrayOfSecondArguments).toContain("testFile1.json");
      expect(arrayOfSecondArguments).toContain("testFile2.json");
      expect(arrayOfSecondArguments).toContain("testFile3.json");
      expect(arrayOfSecondArguments).toContain("testFile4.json");
      expect(arrayOfSecondArguments).toContain("testFile5.json");

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({
        testFile1: { abcd: 1234 },
        testFile2: { efgh: 5678 },
        testFile3: { ijkl: 9012 },
        testFile4: { mnop: 3456 },
        testFile5: { rstu: 7890 },
      });
    });

    it("should call GetFileNames and then GetFile and insert values of every file to storage - even if they already exist in cache", async () => {
      cacheContent = {
        testFile2: { abcd: 5678 },
        testFile3: { efgh: 9012 },
        testFile4: { ijkl: 3456 },
      };

      await exec();

      //Check file should have been called
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][0]
      ).toEqual("testAssetId");
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][1]
      ).toEqual("json");

      //Get file should have been called 5 times
      expect(mindSphereFileServiceGetFileMockFunc).toHaveBeenCalledTimes(5);
      //Get file should have been called after GetAllFileNames
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledBefore(mindSphereFileServiceGetFileMockFunc);

      //Get file should be called for every file name returned from GetAllFileNames with no particular order
      //For every call asset id should be the same
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[1][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[2][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[3][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[4][0]).toEqual(
        "testAssetId"
      );
      //File names should be called with no particular order - Promise.all
      let arrayOfSecondArguments = [
        mindSphereFileServiceGetFileMockFunc.mock.calls[0][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[1][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[2][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[3][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[4][1],
      ];
      expect(arrayOfSecondArguments).toContain("testFile1.json");
      expect(arrayOfSecondArguments).toContain("testFile2.json");
      expect(arrayOfSecondArguments).toContain("testFile3.json");
      expect(arrayOfSecondArguments).toContain("testFile4.json");
      expect(arrayOfSecondArguments).toContain("testFile5.json");

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({
        testFile1: { abcd: 1234 },
        testFile2: { efgh: 5678 },
        testFile3: { ijkl: 9012 },
        testFile4: { mnop: 3456 },
        testFile5: { rstu: 7890 },
      });
    });

    it("should call GetFileNames and then GetFile, insert values of every file to storage and delete the ones not returned via getAllFileNames - even if they already exist in cache", async () => {
      cacheContent = {
        testFile2: { abcd: 5678 },
        testFile3: { efgh: 9012 },
        testFile4: { ijkl: 3456 },
        testFile6: { oprs: 900 },
        testFile7: { tuwx: 800 },
      };

      await exec();

      //Check file should have been called
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][0]
      ).toEqual("testAssetId");
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][1]
      ).toEqual("json");

      //Get file should have been called 5 times
      expect(mindSphereFileServiceGetFileMockFunc).toHaveBeenCalledTimes(5);
      //Get file should have been called after GetAllFileNames
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledBefore(mindSphereFileServiceGetFileMockFunc);

      //Get file should be called for every file name returned from GetAllFileNames with no particular order
      //For every call asset id should be the same
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[1][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[2][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[3][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[4][0]).toEqual(
        "testAssetId"
      );
      //File names should be called with no particular order - Promise.all
      let arrayOfSecondArguments = [
        mindSphereFileServiceGetFileMockFunc.mock.calls[0][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[1][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[2][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[3][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[4][1],
      ];
      expect(arrayOfSecondArguments).toContain("testFile1.json");
      expect(arrayOfSecondArguments).toContain("testFile2.json");
      expect(arrayOfSecondArguments).toContain("testFile3.json");
      expect(arrayOfSecondArguments).toContain("testFile4.json");
      expect(arrayOfSecondArguments).toContain("testFile5.json");

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({
        testFile1: { abcd: 1234 },
        testFile2: { efgh: 5678 },
        testFile3: { ijkl: 9012 },
        testFile4: { mnop: 3456 },
        testFile5: { rstu: 7890 },
      });
    });

    it("should clear cache - if GetFileNames return empty array", async () => {
      cacheContent = {
        testFile2: { abcd: 5678 },
        testFile3: { efgh: 9012 },
        testFile4: { ijkl: 3456 },
      };

      mockedGetAllFilesResult = [];

      await exec();

      //Check file should have been called
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][0]
      ).toEqual("testAssetId");
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][1]
      ).toEqual("json");

      //Get file should not have been called
      expect(mindSphereFileServiceGetFileMockFunc).not.toHaveBeenCalled();

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({});
    });

    it("should call GetFileNames and then GetFile and insert values of every file to storage that is not null - GetFileNames returns null values", async () => {
      cacheContent = {};

      mockedGetAllFilesResult = [
        "testFile1.json",
        "testFile2.json",
        null,
        "testFile4.json",
        "testFile5.json",
      ];

      await exec();

      //Check file should have been called
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][0]
      ).toEqual("testAssetId");
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][1]
      ).toEqual("json");

      //Get file should have been called 4 times
      expect(mindSphereFileServiceGetFileMockFunc).toHaveBeenCalledTimes(4);
      //Get file should have been called after GetAllFileNames
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledBefore(mindSphereFileServiceGetFileMockFunc);

      //Get file should be called for every file name returned from GetAllFileNames with no particular order
      //For every call asset id should be the same
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[1][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[2][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[3][0]).toEqual(
        "testAssetId"
      );
      //File names should be called with no particular order - Promise.all
      let arrayOfSecondArguments = [
        mindSphereFileServiceGetFileMockFunc.mock.calls[0][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[1][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[2][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[3][1],
      ];
      expect(arrayOfSecondArguments).toContain("testFile1.json");
      expect(arrayOfSecondArguments).toContain("testFile2.json");
      expect(arrayOfSecondArguments).toContain("testFile4.json");
      expect(arrayOfSecondArguments).toContain("testFile5.json");

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({
        testFile1: { abcd: 1234 },
        testFile2: { efgh: 5678 },
        testFile4: { mnop: 3456 },
        testFile5: { rstu: 7890 },
      });
    });

    it("should delete file from cache - if GetFile returns null for given file", async () => {
      cacheContent = {};

      mockGetFileDataToReturnCollection = {
        "testFile1.json": { abcd: 1234 },
        "testFile2.json": { efgh: 5678 },
        "testFile3.json": null,
        "testFile4.json": { mnop: 3456 },
        "testFile5.json": { rstu: 7890 },
      };

      await exec();

      //Check file should have been called
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][0]
      ).toEqual("testAssetId");
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][1]
      ).toEqual("json");

      //Get file should have been called 5 times
      expect(mindSphereFileServiceGetFileMockFunc).toHaveBeenCalledTimes(5);
      //Get file should have been called after GetAllFileNames
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledBefore(mindSphereFileServiceGetFileMockFunc);

      //Get file should be called for every file name returned from GetAllFileNames with no particular order
      //For every call asset id should be the same
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[1][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[2][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[3][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[4][0]).toEqual(
        "testAssetId"
      );
      //File names should be called with no particular order - Promise.all
      let arrayOfSecondArguments = [
        mindSphereFileServiceGetFileMockFunc.mock.calls[0][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[1][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[2][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[3][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[4][1],
      ];
      expect(arrayOfSecondArguments).toContain("testFile1.json");
      expect(arrayOfSecondArguments).toContain("testFile2.json");
      expect(arrayOfSecondArguments).toContain("testFile3.json");
      expect(arrayOfSecondArguments).toContain("testFile4.json");
      expect(arrayOfSecondArguments).toContain("testFile5.json");

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({
        testFile1: { abcd: 1234 },
        testFile2: { efgh: 5678 },
        testFile4: { mnop: 3456 },
        testFile5: { rstu: 7890 },
      });
    });

    it("should throw and clear cache - if GetAllFiles throws", async () => {
      //Setting cache content in order to ensure that nothing was changed
      cacheContent = {
        testFile2: { abcd: 5678 },
        testFile3: { efgh: 9012 },
        testFile4: { ijkl: 3456 },
      };

      mindSphereFileServiceGetAllFileNamesMockFunc = jest.fn(async () => {
        throw new Error("testError");
      });
      mindSphereFileService.getAllFileNamesFromAsset = mindSphereFileServiceGetAllFileNamesMockFunc;

      await expect(exec()).rejects.toMatchObject({ message: "testError" });

      //Check file should have been called
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][0]
      ).toEqual("testAssetId");
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][1]
      ).toEqual("json");

      //Get file should have not have been called
      expect(mindSphereFileServiceGetFileMockFunc).not.toHaveBeenCalled();
      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({});
    });

    it("should throw and clear cache - if GetFile throws", async () => {
      //Setting cache content in order to ensure that nothing was changed
      cacheContent = {
        testFile2: { abcd: 5678 },
        testFile3: { efgh: 9012 },
        testFile4: { ijkl: 3456 },
      };

      mindSphereFileServiceGetFileMockFunc = jest.fn(async () => {
        throw new Error("testError");
      });
      mindSphereFileService.getFileContent = mindSphereFileServiceGetFileMockFunc;

      await expect(exec()).rejects.toMatchObject({ message: "testError" });

      //Check file should have been called
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][0]
      ).toEqual("testAssetId");
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][1]
      ).toEqual("json");

      //Get file should be called and throw
      expect(mindSphereFileServiceGetFileMockFunc).toHaveBeenCalled();
      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({});
    });
  });

  describe("getAllData", () => {
    let mindSphereDataStorage: MindSphereDataStorage<any>;
    let assetId: string;
    let cacheContent: any;
    let mockGetFileDataToReturnCollection: { [key: string]: any };

    beforeEach(() => {
      assetId = "testAssetId";
      cacheContent = {
        testFile3: { efgh: 9012 },
        testFile4: { ijkl: 3456 },
        testFile6: { oprs: 900 },
        testFile7: { tuwx: 800 },
        testFile8: { yzab: 700 },
      };
      mockedGetAllFilesResult = [
        "testFile1.json",
        "testFile2.json",
        "testFile3.json",
        "testFile4.json",
        "testFile5.json",
      ];

      mockGetFileDataToReturnCollection = {
        "testFile1.json": { abcd: 1234 },
        "testFile2.json": { efgh: 5678 },
        "testFile3.json": { ijkl: 9012 },
        "testFile4.json": { mnop: 3456 },
        "testFile5.json": { rstu: 7890 },
      };

      mindSphereFileServiceGetFileMockFunc = jest.fn(
        async (assetId: string, fileName: string) => {
          await snooze(10);
          return mockGetFileDataToReturnCollection[fileName];
        }
      );

      mindSphereFileService.getFileContent = mindSphereFileServiceGetFileMockFunc;
    });

    let exec = async () => {
      mindSphereDataStorage = new MindSphereDataStorage<any>(assetId);

      //Setting cache content for check if value is returned from cache or from file
      (mindSphereDataStorage as any)._cacheData = cacheContent;

      return mindSphereDataStorage.getAllData();
    };

    it("should returned all data - from storage and cache and fetch all data from storage not present in cache", async () => {
      cacheContent = {
        testFile3: { efgh: 9012 },
        testFile4: { ijkl: 3456 },
        testFile6: { oprs: 900 },
        testFile7: { tuwx: 800 },
        testFile8: { yzab: 700 },
      };
      mockedGetAllFilesResult = [
        "testFile1.json",
        "testFile2.json",
        "testFile3.json",
        "testFile4.json",
        "testFile5.json",
      ];

      mockGetFileDataToReturnCollection = {
        "testFile1.json": { abcd: 1234 },
        "testFile2.json": { efgh: 5678 },
        "testFile3.json": { ijkl: 9012 },
        "testFile4.json": { mnop: 3456 },
        "testFile5.json": { rstu: 7890 },
      };

      let result = await exec();

      //Result should store values from cache and storage
      expect(result).toEqual({
        testFile1: { abcd: 1234 },
        testFile2: { efgh: 5678 },
        testFile3: { efgh: 9012 },
        testFile4: { ijkl: 3456 },
        testFile5: { rstu: 7890 },
        testFile6: { oprs: 900 },
        testFile7: { tuwx: 800 },
        testFile8: { yzab: 700 },
      });

      //Check file should have been called
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][0]
      ).toEqual("testAssetId");
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][1]
      ).toEqual("json");

      //Get file should have been called 2 times - for files 1,2 and 5
      expect(mindSphereFileServiceGetFileMockFunc).toHaveBeenCalledTimes(3);
      //Get file should have been called after GetAllFileNames
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledBefore(mindSphereFileServiceGetFileMockFunc);

      //Get file should be called for every file name returned from GetAllFileNames with no particular order
      //For every call asset id should be the same
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[1][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[2][0]).toEqual(
        "testAssetId"
      );

      //File names should be called with no particular order - Promise.all
      let arrayOfSecondArguments = [
        mindSphereFileServiceGetFileMockFunc.mock.calls[0][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[1][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[2][1],
      ];
      expect(arrayOfSecondArguments).toContain("testFile1.json");
      expect(arrayOfSecondArguments).toContain("testFile2.json");
      expect(arrayOfSecondArguments).toContain("testFile5.json");

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({
        testFile1: { abcd: 1234 },
        testFile2: { efgh: 5678 },
        testFile3: { efgh: 9012 },
        testFile4: { ijkl: 3456 },
        testFile5: { rstu: 7890 },
        testFile6: { oprs: 900 },
        testFile7: { tuwx: 800 },
        testFile8: { yzab: 700 },
      });
    });

    it("should returned all data only from storage and fetch all data from storage to cache - if cache is empty", async () => {
      cacheContent = {};
      mockedGetAllFilesResult = [
        "testFile1.json",
        "testFile2.json",
        "testFile3.json",
        "testFile4.json",
        "testFile5.json",
      ];

      mockGetFileDataToReturnCollection = {
        "testFile1.json": { abcd: 1234 },
        "testFile2.json": { efgh: 5678 },
        "testFile3.json": { ijkl: 9012 },
        "testFile4.json": { mnop: 3456 },
        "testFile5.json": { rstu: 7890 },
      };

      let result = await exec();

      //Result should store values from cache and storage
      expect(result).toEqual({
        testFile1: { abcd: 1234 },
        testFile2: { efgh: 5678 },
        testFile3: { ijkl: 9012 },
        testFile4: { mnop: 3456 },
        testFile5: { rstu: 7890 },
      });

      //Check file should have been called
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][0]
      ).toEqual("testAssetId");
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][1]
      ).toEqual("json");

      //Get file should have been called 2 times - for files 1,2 and 5
      expect(mindSphereFileServiceGetFileMockFunc).toHaveBeenCalledTimes(5);
      //Get file should have been called after GetAllFileNames
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledBefore(mindSphereFileServiceGetFileMockFunc);

      //Get file should be called for every file name returned from GetAllFileNames with no particular order
      //For every call asset id should be the same
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[1][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[2][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[3][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[4][0]).toEqual(
        "testAssetId"
      );

      //File names should be called with no particular order - Promise.all
      let arrayOfSecondArguments = [
        mindSphereFileServiceGetFileMockFunc.mock.calls[0][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[1][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[2][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[3][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[4][1],
      ];
      expect(arrayOfSecondArguments).toContain("testFile1.json");
      expect(arrayOfSecondArguments).toContain("testFile2.json");
      expect(arrayOfSecondArguments).toContain("testFile3.json");
      expect(arrayOfSecondArguments).toContain("testFile4.json");
      expect(arrayOfSecondArguments).toContain("testFile5.json");

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({
        testFile1: { abcd: 1234 },
        testFile2: { efgh: 5678 },
        testFile3: { ijkl: 9012 },
        testFile4: { mnop: 3456 },
        testFile5: { rstu: 7890 },
      });
    });

    it("should returned all data only from storage and don't clean cache if getAllFiles returns empty array", async () => {
      cacheContent = {
        testFile3: { efgh: 9012 },
        testFile4: { ijkl: 3456 },
        testFile6: { oprs: 900 },
        testFile7: { tuwx: 800 },
        testFile8: { yzab: 700 },
      };
      mockedGetAllFilesResult = [];

      let result = await exec();

      //Result should store values from cache and storage
      expect(result).toEqual({
        testFile3: { efgh: 9012 },
        testFile4: { ijkl: 3456 },
        testFile6: { oprs: 900 },
        testFile7: { tuwx: 800 },
        testFile8: { yzab: 700 },
      });

      //Check file should have been called
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][0]
      ).toEqual("testAssetId");
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][1]
      ).toEqual("json");

      //Get file should not have been called
      expect(mindSphereFileServiceGetFileMockFunc).not.toHaveBeenCalled();
      //Get file should have been called after GetAllFileNames

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({
        testFile3: { efgh: 9012 },
        testFile4: { ijkl: 3456 },
        testFile6: { oprs: 900 },
        testFile7: { tuwx: 800 },
        testFile8: { yzab: 700 },
      });
    });

    it("should returned all data - from storage and cache and fetch all data from storage not present in cache, except fileNames returned as null by GetAllFileNames", async () => {
      cacheContent = {
        testFile3: { efgh: 9012 },
        testFile4: { ijkl: 3456 },
        testFile6: { oprs: 900 },
        testFile7: { tuwx: 800 },
        testFile8: { yzab: 700 },
      };
      mockedGetAllFilesResult = [
        "testFile1.json",
        null,
        "testFile3.json",
        "testFile4.json",
        "testFile5.json",
      ];

      mockGetFileDataToReturnCollection = {
        "testFile1.json": { abcd: 1234 },
        "testFile2.json": { efgh: 5678 },
        "testFile3.json": { ijkl: 9012 },
        "testFile4.json": { mnop: 3456 },
        "testFile5.json": { rstu: 7890 },
      };

      let result = await exec();

      //Result should store values from cache and storage
      expect(result).toEqual({
        testFile1: { abcd: 1234 },
        testFile3: { efgh: 9012 },
        testFile4: { ijkl: 3456 },
        testFile5: { rstu: 7890 },
        testFile6: { oprs: 900 },
        testFile7: { tuwx: 800 },
        testFile8: { yzab: 700 },
      });

      //Check file should have been called
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][0]
      ).toEqual("testAssetId");
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][1]
      ).toEqual("json");

      //Get file should have been called 2 times - for files 1 and 5
      expect(mindSphereFileServiceGetFileMockFunc).toHaveBeenCalledTimes(2);
      //Get file should have been called after GetAllFileNames
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledBefore(mindSphereFileServiceGetFileMockFunc);

      //Get file should be called for every file name returned from GetAllFileNames with no particular order
      //For every call asset id should be the same
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[1][0]).toEqual(
        "testAssetId"
      );

      //File names should be called with no particular order - Promise.all
      let arrayOfSecondArguments = [
        mindSphereFileServiceGetFileMockFunc.mock.calls[0][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[1][1],
      ];
      expect(arrayOfSecondArguments).toContain("testFile1.json");
      expect(arrayOfSecondArguments).toContain("testFile5.json");

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({
        testFile1: { abcd: 1234 },
        testFile3: { efgh: 9012 },
        testFile4: { ijkl: 3456 },
        testFile5: { rstu: 7890 },
        testFile6: { oprs: 900 },
        testFile7: { tuwx: 800 },
        testFile8: { yzab: 700 },
      });
    });

    it("should returned all data - from storage and cache and fetch all data from storage not present in cache, except file that's content was returned as null", async () => {
      cacheContent = {
        testFile3: { efgh: 9012 },
        testFile4: { ijkl: 3456 },
        testFile6: { oprs: 900 },
        testFile7: { tuwx: 800 },
        testFile8: { yzab: 700 },
      };
      mockedGetAllFilesResult = [
        "testFile1.json",
        "testFile2.json",
        "testFile3.json",
        "testFile4.json",
        "testFile5.json",
      ];

      mockGetFileDataToReturnCollection = {
        "testFile1.json": { abcd: 1234 },
        "testFile2.json": null,
        "testFile3.json": { ijkl: 9012 },
        "testFile4.json": { mnop: 3456 },
        "testFile5.json": { rstu: 7890 },
      };

      let result = await exec();

      //Result should store values from cache and storage
      expect(result).toEqual({
        testFile1: { abcd: 1234 },
        testFile3: { efgh: 9012 },
        testFile4: { ijkl: 3456 },
        testFile5: { rstu: 7890 },
        testFile6: { oprs: 900 },
        testFile7: { tuwx: 800 },
        testFile8: { yzab: 700 },
      });

      //Check file should have been called
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][0]
      ).toEqual("testAssetId");
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][1]
      ).toEqual("json");

      //Get file should have been called 2 times - for files 1,2 and 5
      expect(mindSphereFileServiceGetFileMockFunc).toHaveBeenCalledTimes(3);
      //Get file should have been called after GetAllFileNames
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledBefore(mindSphereFileServiceGetFileMockFunc);

      //Get file should be called for every file name returned from GetAllFileNames with no particular order
      //For every call asset id should be the same
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[0][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[1][0]).toEqual(
        "testAssetId"
      );
      expect(mindSphereFileServiceGetFileMockFunc.mock.calls[2][0]).toEqual(
        "testAssetId"
      );

      //File names should be called with no particular order - Promise.all
      let arrayOfSecondArguments = [
        mindSphereFileServiceGetFileMockFunc.mock.calls[0][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[1][1],
        mindSphereFileServiceGetFileMockFunc.mock.calls[2][1],
      ];
      expect(arrayOfSecondArguments).toContain("testFile1.json");
      expect(arrayOfSecondArguments).toContain("testFile2.json");
      expect(arrayOfSecondArguments).toContain("testFile5.json");

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({
        testFile1: { abcd: 1234 },
        testFile3: { efgh: 9012 },
        testFile4: { ijkl: 3456 },
        testFile5: { rstu: 7890 },
        testFile6: { oprs: 900 },
        testFile7: { tuwx: 800 },
        testFile8: { yzab: 700 },
      });
    });

    it("should throw and not change cache - if getAllFileNames throw", async () => {
      cacheContent = {
        testFile3: { efgh: 9012 },
        testFile4: { ijkl: 3456 },
        testFile6: { oprs: 900 },
        testFile7: { tuwx: 800 },
        testFile8: { yzab: 700 },
      };

      mindSphereFileServiceGetAllFileNamesMockFunc = jest.fn(async () => {
        throw new Error("testError");
      });
      mindSphereFileService.getAllFileNamesFromAsset = mindSphereFileServiceGetAllFileNamesMockFunc;

      await expect(exec()).rejects.toMatchObject({
        message: "testError",
      });

      //Check file should have been called
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][0]
      ).toEqual("testAssetId");
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][1]
      ).toEqual("json");

      //Get file should not have been called
      expect(mindSphereFileServiceGetFileMockFunc).not.toHaveBeenCalled();
      //Get file should have been called after GetAllFileNames

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({
        testFile3: { efgh: 9012 },
        testFile4: { ijkl: 3456 },
        testFile6: { oprs: 900 },
        testFile7: { tuwx: 800 },
        testFile8: { yzab: 700 },
      });
    });

    it("should throw and not change cache - if getAllFileNames throw", async () => {
      cacheContent = {
        testFile3: { efgh: 9012 },
        testFile4: { ijkl: 3456 },
        testFile6: { oprs: 900 },
        testFile7: { tuwx: 800 },
        testFile8: { yzab: 700 },
      };

      mindSphereFileServiceGetFileMockFunc = jest.fn(async () => {
        throw new Error("testError");
      });
      mindSphereFileService.getFileContent = mindSphereFileServiceGetFileMockFunc;

      await expect(exec()).rejects.toMatchObject({
        message: "testError",
      });

      //Check file should have been called
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc
      ).toHaveBeenCalledTimes(1);
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][0]
      ).toEqual("testAssetId");
      expect(
        mindSphereFileServiceGetAllFileNamesMockFunc.mock.calls[0][1]
      ).toEqual("json");

      //Get file should have been called and throw
      expect(mindSphereFileServiceGetFileMockFunc).toHaveBeenCalled();

      //Checking cache content
      expect((mindSphereDataStorage as any)._cacheData).toEqual({
        testFile3: { efgh: 9012 },
        testFile4: { ijkl: 3456 },
        testFile6: { oprs: 900 },
        testFile7: { tuwx: 800 },
        testFile8: { yzab: 700 },
      });
    });
  });
});

import { FileDataStorage } from "../../../../classes/DataStorage/FileDataStorage";
import {
  checkIfFileExistsAsync,
  clearDirectoryAsync,
  createDirIfNotExists,
  readFileAsync,
  writeFileAsync,
  removeDirectoryIfExists,
  checkIfDirectoryExistsAsync,
  removeFileIfExistsAsync,
} from "../../../../utilities/utilities";
import * as utilties from "../../../../utilities/utilities";
import fs from "fs";

const testDirPath = "__testDir/fileDataStorage";

describe("FileDataStorage", () => {
  beforeEach(async () => {
    await createDirIfNotExists(testDirPath);
    await clearDirectoryAsync(testDirPath);
  });

  afterEach(async () => {
    let dirExists = await checkIfDirectoryExistsAsync(testDirPath);
    if (dirExists) await clearDirectoryAsync(testDirPath);
  });

  describe("constructor", () => {
    let dirPath: string;
    let extension: string;

    beforeEach(() => {
      dirPath = testDirPath;
      extension = "testExtension";
    });

    let exec = () => {
      return new FileDataStorage(dirPath, extension);
    };

    it("should create and return valid FileDataStorage with valid dirPath", () => {
      let result = exec();

      expect(result).toBeDefined();
      expect(result.DirPath).toEqual(dirPath);
    });
  });

  describe("dataExists", () => {
    let fileDataStorage: FileDataStorage<any>;
    let dirPath: string;
    let extension: string;
    let dataId: string;
    let file1Path: string;
    let file1Content: any;
    let file1Create: boolean;
    let file2Path: string;
    let file2Content: any;
    let file2Create: boolean;
    let file3Path: string;
    let file3Content: any;
    let file3Create: boolean;
    let cacheContent: any;

    beforeEach(() => {
      dirPath = testDirPath;
      extension = "testExtension";
      dataId = "testFile2";
      file1Path = `${testDirPath}/testFile1.testExtension`;
      file1Content = { abcd: 123 };
      file1Create = true;
      file2Path = `${testDirPath}/testFile2.testExtension`;
      file2Content = { efgh: 456 };
      file2Create = true;
      file3Path = `${testDirPath}/testFile3.testExtension`;
      file3Content = { ijkl: 789 };
      file3Create = true;
      cacheContent = {};
    });

    let exec = async () => {
      if (file1Create)
        await writeFileAsync(file1Path, JSON.stringify(file1Content), "utf8");
      if (file2Create)
        await writeFileAsync(file2Path, JSON.stringify(file2Content), "utf8");
      if (file3Create)
        await writeFileAsync(file3Path, JSON.stringify(file3Content), "utf8");
      fileDataStorage = new FileDataStorage<any>(dirPath, extension);

      //Setting cache content for check behaviour based on cache content
      (fileDataStorage as any)._cacheData = cacheContent;

      return fileDataStorage.dataExists(dataId);
    };

    it("should return true if file of given id exists", async () => {
      let result = await exec();

      expect(result).toEqual(true);
    });

    it("should return false if file of given id does not exist", async () => {
      dataId = "fakeName";

      let result = await exec();

      expect(result).toEqual(false);
    });

    it("should return false if file of given id does exist but with different extension than given extension", async () => {
      dataId = "fakeName";
      await writeFileAsync(
        `${testDirPath}/fakeName.txt`,
        "fakeContent",
        "utf8"
      );

      let result = await exec();

      expect(result).toEqual(false);
    });

    it("should return false if directory of given name does not exist", async () => {
      dirPath = "fakeDir";

      let result = await exec();

      expect(result).toEqual(false);
    });

    it("should return true if file of given id exists in cache but not as a file", async () => {
      dataId = "fakeName";

      cacheContent = {
        [dataId]: { fakeContent: 123 },
      };

      let result = await exec();

      expect(result).toEqual(true);
    });
  });

  describe("getData", () => {
    let fileDataStorage: FileDataStorage<any>;
    let dirPath: string;
    let extension: string;
    let dataId: string;
    let file1Path: string;
    let file1Content: any;
    let file1Create: boolean;
    let file2Path: string;
    let file2Content: any;
    let file2Create: boolean;
    let file3Path: string;
    let file3Content: any;
    let file3Create: boolean;
    let cacheContent: any;

    beforeEach(() => {
      dirPath = testDirPath;
      dataId = "testFile2";
      extension = "testExtension";
      file1Path = `${testDirPath}/testFile1.testExtension`;
      file1Content = { abcd: 123 };
      file1Create = true;
      file2Path = `${testDirPath}/testFile2.testExtension`;
      file2Content = { efgh: 456 };
      file2Create = true;
      file3Path = `${testDirPath}/testFile3.testExtension`;
      file3Content = { ijkl: 789 };
      file3Create = true;
      cacheContent = {};
    });

    let exec = async () => {
      if (file1Create)
        await writeFileAsync(file1Path, JSON.stringify(file1Content), "utf8");
      if (file2Create)
        await writeFileAsync(file2Path, JSON.stringify(file2Content), "utf8");
      if (file3Create)
        await writeFileAsync(file3Path, JSON.stringify(file3Content), "utf8");
      fileDataStorage = new FileDataStorage<any>(dirPath, extension);

      //Setting cache content for check if value is returned from cache or from file
      (fileDataStorage as any)._cacheData = cacheContent;

      return fileDataStorage.getData(dataId);
    };

    it("should return content of file - if file exists and id is not present in cache", async () => {
      cacheContent = {};

      let result = await exec();

      expect(result).toEqual({ efgh: 456 });
    });

    it("should return content from cache - if content in cache exists", async () => {
      cacheContent = {
        [dataId]: {
          lol: 123,
        },
      };
      let result = await exec();

      expect(result).toEqual({ lol: 123 });
    });

    it("should fetch cache cotent - if cache for this file does not exist", async () => {
      cacheContent = {};

      await exec();

      expect((fileDataStorage as any)._cacheData[dataId]).toEqual({
        efgh: 456,
      });
    });

    it("should fetch cache and return content of file - even if it is not a valid JSON", async () => {
      cacheContent = {};

      //Instead of creating file in exec - creating now with invalid content
      file2Create = false;
      await writeFileAsync(file2Path, "not a valid json content", "utf8");

      let result = await exec();

      expect(result).toEqual("not a valid json content");

      expect((fileDataStorage as any)._cacheData[dataId]).toEqual(
        "not a valid json content"
      );
    });

    it("should return content from cache - if content in cache exists, but file does not", async () => {
      dataId = "fakeDataId";
      cacheContent = {
        [dataId]: {
          lol: 123,
        },
      };
      let result = await exec();

      expect(result).toEqual({ lol: 123 });
    });

    it("should return null if file of given id does not exist", async () => {
      dataId = "fakeName";

      let result = await exec();

      expect(result).toEqual(null);
    });

    it("should return null if file of given id does exist but with different extension than testExtension", async () => {
      dataId = "fakeName";
      await writeFileAsync(
        `${testDirPath}/fakeName.txt`,
        "fakeContent",
        "utf8"
      );

      let result = await exec();

      expect(result).toEqual(null);
    });

    it("should return false if directory of given name does not exist", async () => {
      dirPath = "fakeDir";

      let result = await exec();

      expect(result).toEqual(null);
    });
  });

  describe("setData", () => {
    let fileDataStorage: FileDataStorage<any>;
    let extension: string;
    let dirPath: string;
    let dataId: string;
    let dataToSet: any;
    let file1Path: string;
    let file1Content: any;
    let file1Create: boolean;
    let file2Path: string;
    let file2Content: any;
    let file2Create: boolean;
    let file3Path: string;
    let file3Content: any;
    let file3Create: boolean;
    let cacheContent: any;

    beforeEach(() => {
      dirPath = testDirPath;
      dataId = "testFile4";
      extension = "testExtension";
      file1Path = `${testDirPath}/testFile1.testExtension`;
      file1Content = { abcd: 123 };
      file1Create = true;
      file2Path = `${testDirPath}/testFile2.testExtension`;
      file2Content = { efgh: 456 };
      file2Create = true;
      file3Path = `${testDirPath}/testFile3.testExtension`;
      file3Content = { ijkl: 789 };
      file3Create = true;
      dataToSet = { mno: "prs123" };
      cacheContent = {};
    });

    let exec = async () => {
      if (file1Create)
        await writeFileAsync(file1Path, JSON.stringify(file1Content), "utf8");
      if (file2Create)
        await writeFileAsync(file2Path, JSON.stringify(file2Content), "utf8");
      if (file3Create)
        await writeFileAsync(file3Path, JSON.stringify(file3Content), "utf8");
      fileDataStorage = new FileDataStorage<any>(dirPath, extension);

      //Setting cache content for check if value is returned from cache or from file
      (fileDataStorage as any)._cacheData = cacheContent;

      return fileDataStorage.setData(dataId, dataToSet);
    };

    it("should set content inside file and inside cache - if file doesn't exist before, cache is empty", async () => {
      cacheContent = {};

      await exec();

      let fileExists = await checkIfFileExistsAsync(
        `${testDirPath}/testFile4.testExtension`
      );
      expect(fileExists).toEqual(true);

      let fileContent = await readFileAsync(
        `${testDirPath}/testFile4.testExtension`,
        "utf8"
      );

      expect(fileContent).toEqual(JSON.stringify({ mno: "prs123" }));

      //Checking cache
      let mockedFileDataStorage = fileDataStorage as any;

      expect(mockedFileDataStorage._cacheData[dataId]).toEqual({
        mno: "prs123",
      });
    });

    it("should set content inside file and inside cache - if file already exists, cache is empty", async () => {
      cacheContent = {};

      dataId = "testFile2";

      await exec();

      let fileExists = await checkIfFileExistsAsync(
        `${testDirPath}/testFile2.testExtension`
      );
      expect(fileExists).toEqual(true);

      let fileContent = await readFileAsync(
        `${testDirPath}/testFile2.testExtension`,
        "utf8"
      );

      expect(fileContent).toEqual(JSON.stringify({ mno: "prs123" }));

      //Checking cache
      let mockedFileDataStorage = fileDataStorage as any;

      expect(mockedFileDataStorage._cacheData[dataId]).toEqual({
        mno: "prs123",
      });
    });

    it("should set content inside file and inside cache - if file doesn't exist before, cache is filled with data", async () => {
      cacheContent = { [dataId]: { abcd: "fakeData" } };

      await exec();

      let fileExists = await checkIfFileExistsAsync(
        `${testDirPath}/testFile4.testExtension`
      );
      expect(fileExists).toEqual(true);

      let fileContent = await readFileAsync(
        `${testDirPath}/testFile4.testExtension`,
        "utf8"
      );

      expect(fileContent).toEqual(JSON.stringify({ mno: "prs123" }));

      //Checking cache
      let mockedFileDataStorage = fileDataStorage as any;

      expect(mockedFileDataStorage._cacheData[dataId]).toEqual({
        mno: "prs123",
      });
    });

    it("should set content inside file and inside cache - if file already exists, cache is filled with data", async () => {
      cacheContent = { [dataId]: { abcd: "fakeData" } };

      dataId = "testFile2";

      await exec();

      let fileExists = await checkIfFileExistsAsync(
        `${testDirPath}/testFile2.testExtension`
      );
      expect(fileExists).toEqual(true);

      let fileContent = await readFileAsync(
        `${testDirPath}/testFile2.testExtension`,
        "utf8"
      );

      expect(fileContent).toEqual(JSON.stringify({ mno: "prs123" }));

      //Checking cache
      let mockedFileDataStorage = fileDataStorage as any;

      expect(mockedFileDataStorage._cacheData[dataId]).toEqual({
        mno: "prs123",
      });
    });

    it("should get the same data after set - if file already exists - if content is in cache", async () => {
      dataId = "testFile2";

      await exec();

      let dataFromGet = await fileDataStorage.getData(dataId);

      expect(dataFromGet).toEqual({
        mno: "prs123",
      });
    });

    it("should get the same data after set - if file already exists - if cache is empty", async () => {
      dataId = "testFile2";

      await exec();

      (fileDataStorage as any)._cacheData = {};

      let dataFromGet = await fileDataStorage.getData(dataId);

      expect(dataFromGet).toEqual({
        mno: "prs123",
      });
    });

    it("should throw and not set data in cache - if saving file throws", async () => {
      //creating fake name includding dir that does not exist - to throw that file cannot be created
      dataId = "fakeDir/testFile2";

      await expect(exec()).rejects.toBeDefined();

      expect((fileDataStorage as any)._cacheData).toEqual({});
    });
  });

  describe("getAllIds", () => {
    let fileDataStorage: FileDataStorage<any>;
    let dirPath: string;
    let extension: string;
    let dataId: string;
    let file1Path: string;
    let file1Content: any;
    let file1Create: boolean;
    let file2Path: string;
    let file2Content: any;
    let file2Create: boolean;
    let file3Path: string;
    let file3Content: any;
    let file3Create: boolean;
    let cacheContent: any;

    beforeEach(() => {
      dirPath = testDirPath;
      dataId = "testFile2";
      extension = "testExtension";
      file1Path = `${testDirPath}/testFile1.testExtension`;
      file1Content = { abcd: 123 };
      file1Create = true;
      file2Path = `${testDirPath}/testFile2.testExtension`;
      file2Content = { efgh: 456 };
      file2Create = true;
      file3Path = `${testDirPath}/testFile3.testExtension`;
      file3Content = { ijkl: 789 };
      file3Create = true;
      cacheContent = {};
    });

    let exec = async () => {
      if (file1Create)
        await writeFileAsync(file1Path, JSON.stringify(file1Content), "utf8");
      if (file2Create)
        await writeFileAsync(file2Path, JSON.stringify(file2Content), "utf8");
      if (file3Create)
        await writeFileAsync(file3Path, JSON.stringify(file3Content), "utf8");
      fileDataStorage = new FileDataStorage<any>(dirPath, extension);

      //Setting cache content for check if value is returned from cache or from file
      (fileDataStorage as any)._cacheData = cacheContent;

      return fileDataStorage.getAllIds();
    };

    it("should return combined file names from cache and from storage and not to change cache - if storage and cache are not empty and have common keys", async () => {
      cacheContent = {
        testFile2: { abcd: 1234 },
        testFile4: { efgh: 4567 },
        testFile5: { ijkl: 8901 },
      };

      let result = await exec();

      expect(result).toEqual([
        "testFile2",
        "testFile4",
        "testFile5",
        "testFile1",
        "testFile3",
      ]);

      //Checking cache content
      expect((fileDataStorage as any)._cacheData).toEqual({
        testFile2: { abcd: 1234 },
        testFile4: { efgh: 4567 },
        testFile5: { ijkl: 8901 },
      });
    });

    it("should return combined file names from cache and from storage and not to change cache - if storage and cache are not empty and have no common keys", async () => {
      cacheContent = {
        testFile4: { abcd: 1234 },
        testFile5: { efgh: 4567 },
        testFile6: { ijkl: 8901 },
      };

      let result = await exec();

      expect(result).toEqual([
        "testFile4",
        "testFile5",
        "testFile6",
        "testFile1",
        "testFile2",
        "testFile3",
      ]);

      //Checking cache content
      expect((fileDataStorage as any)._cacheData).toEqual({
        testFile4: { abcd: 1234 },
        testFile5: { efgh: 4567 },
        testFile6: { ijkl: 8901 },
      });
    });

    it("should return all json file names and not change cache - if cache is empty but storage is not", async () => {
      cacheContent = {};

      let result = await exec();

      expect(result).toEqual(["testFile1", "testFile2", "testFile3"]);

      //Checking cache content
      expect((fileDataStorage as any)._cacheData).toEqual({});
    });

    it("should return all json file names and not change cache - if storage is empty but cache is not", async () => {
      cacheContent = {
        testFile2: { abcd: 1234 },
        testFile4: { efgh: 4567 },
        testFile5: { ijkl: 8901 },
      };

      file1Create = false;
      file2Create = false;
      file3Create = false;

      let result = await exec();

      expect(result).toEqual(["testFile2", "testFile4", "testFile5"]);

      //Checking cache content
      expect((fileDataStorage as any)._cacheData).toEqual({
        testFile2: { abcd: 1234 },
        testFile4: { efgh: 4567 },
        testFile5: { ijkl: 8901 },
      });
    });

    it("should not take other files to account - if they are not a json files", async () => {
      cacheContent = {};

      await writeFileAsync(
        `${testDirPath}/testFile4.txt`,
        JSON.stringify("file4"),
        "utf8"
      );
      await writeFileAsync(
        `${testDirPath}/testFile5.log`,
        JSON.stringify("file5"),
        "utf8"
      );

      let result = await exec();

      expect(result).toEqual(["testFile1", "testFile2", "testFile3"]);

      //Checking cache content
      expect((fileDataStorage as any)._cacheData).toEqual({});
    });

    it("should return empty array - if content is empty and there are no files", async () => {
      file1Create = false;
      file2Create = false;
      file3Create = false;
      cacheContent = {};

      let result = await exec();

      expect(result).toEqual([]);
    });

    it("should throw and not change cache - if there are no directory to search", async () => {
      cacheContent = {
        testFile2: { abcd: 1234 },
        testFile4: { efgh: 4567 },
        testFile5: { ijkl: 8901 },
      };

      //Files cannot be created for directory that does not exist
      file1Create = false;
      file2Create = false;
      file3Create = false;

      await removeDirectoryIfExists(testDirPath);

      await expect(exec()).rejects.toMatchObject({
        code: "ENOENT",
      });

      //Checking cache content
      expect((fileDataStorage as any)._cacheData).toEqual({
        testFile2: { abcd: 1234 },
        testFile4: { efgh: 4567 },
        testFile5: { ijkl: 8901 },
      });
    });
  });

  describe("fetchData", () => {
    let fileDataStorage: FileDataStorage<any>;
    let dirPath: string;
    let extension: string;
    let dataId: string;
    let file1Path: string;
    let file1Content: any;
    let file1Create: boolean;
    let file2Path: string;
    let file2Content: any;
    let file2Create: boolean;
    let file3Path: string;
    let file3Content: any;
    let file3Create: boolean;
    let cacheContent: any;

    beforeEach(() => {
      dirPath = testDirPath;
      dataId = "testFile2";
      extension = "testExtension";
      file1Path = `${testDirPath}/testFile1.testExtension`;
      file1Content = { abcd: 123 };
      file1Create = true;
      file2Path = `${testDirPath}/testFile2.testExtension`;
      file2Content = { efgh: 456 };
      file2Create = true;
      file3Path = `${testDirPath}/testFile3.testExtension`;
      file3Content = { ijkl: 789 };
      file3Create = true;
      cacheContent = {};
    });

    let exec = async () => {
      if (file1Create)
        await writeFileAsync(file1Path, JSON.stringify(file1Content), "utf8");
      if (file2Create)
        await writeFileAsync(file2Path, JSON.stringify(file2Content), "utf8");
      if (file3Create)
        await writeFileAsync(file3Path, JSON.stringify(file3Content), "utf8");
      fileDataStorage = new FileDataStorage<any>(dirPath, extension);

      //Setting cache content for check if value is returned from cache or from file
      (fileDataStorage as any)._cacheData = cacheContent;

      return fileDataStorage.fetchData(dataId);
    };

    it("should fetch cache cotent - if cache is empty", async () => {
      cacheContent = {};

      await exec();

      expect((fileDataStorage as any)._cacheData[dataId]).toEqual({
        efgh: 456,
      });
    });

    it("should fetch cache content - if cache for this file does not exist, but is not empty", async () => {
      cacheContent = {
        testCacheData1: { abcd: 1234 },
      };

      await exec();

      expect((fileDataStorage as any)._cacheData).toEqual({
        testCacheData1: { abcd: 1234 },
        testFile2: {
          efgh: 456,
        },
      });
    });

    it("should remove entry from cache - if file does not exists for this entry", async () => {
      cacheContent = {
        testCacheData1: { abcd: 1234 },
        testFile2: {
          ijkl: 7890,
        },
      };

      file2Create = false;

      await exec();

      expect((fileDataStorage as any)._cacheData).toEqual({
        testCacheData1: { abcd: 1234 },
      });
    });

    it("should fetch cache content (overwrite it) - if cache for this file does exists", async () => {
      cacheContent = {
        testCacheData1: { abcd: 1234 },
        testFile2: {
          defg: 123,
        },
      };

      await exec();

      expect((fileDataStorage as any)._cacheData).toEqual({
        testCacheData1: { abcd: 1234 },
        testFile2: {
          efgh: 456,
        },
      });
    });

    it("should fetch cache content - even if file content is not a valid JSON", async () => {
      cacheContent = {
        testCacheData1: { abcd: 1234 },
      };

      //Instead of creating file in exec - creating now with invalid content
      file2Create = false;
      await writeFileAsync(file2Path, "not a valid json content", "utf8");

      await exec();

      expect((fileDataStorage as any)._cacheData).toEqual({
        testCacheData1: { abcd: 1234 },
        testFile2: "not a valid json content",
      });
    });

    it("should not fetch cache cotent - if file for this id does not exist", async () => {
      cacheContent = {
        testCacheData1: { abcd: 1234 },
      };

      file2Create = false;

      await exec();

      expect((fileDataStorage as any)._cacheData).toEqual({
        testCacheData1: { abcd: 1234 },
      });
    });

    it("should fetch cache and return content of file - even if it is not a valid JSON", async () => {
      cacheContent = {};

      //Instead of creating file in exec - creating now with invalid content
      file2Create = false;
      await writeFileAsync(file2Path, "not a valid json content", "utf8");

      await exec();

      expect((fileDataStorage as any)._cacheData[dataId]).toEqual(
        "not a valid json content"
      );
    });

    it("should not throw and not change cache - if there is no directory", async () => {
      cacheContent = {
        testCacheData1: { abcd: 1234 },
      };

      //Cannot create file if directory does not exist
      file1Create = false;
      file2Create = false;
      file3Create = false;

      await removeDirectoryIfExists(testDirPath);

      await exec();

      expect((fileDataStorage as any)._cacheData).toEqual({
        testCacheData1: { abcd: 1234 },
      });
    });
  });

  describe("fetchAllData", () => {
    let fileDataStorage: FileDataStorage<any>;
    let dirPath: string;
    let extension: string;
    let file1Path: string;
    let file1Content: any;
    let file1Create: boolean;
    let file2Path: string;
    let file2Content: any;
    let file2Create: boolean;
    let file3Path: string;
    let file3Content: any;
    let file3Create: boolean;
    let cacheContent: any;

    beforeEach(() => {
      dirPath = testDirPath;
      extension = "testExtension";
      file1Path = `${testDirPath}/testFile1.testExtension`;
      file1Content = { abcd: 123 };
      file1Create = true;
      file2Path = `${testDirPath}/testFile2.testExtension`;
      file2Content = { efgh: 456 };
      file2Create = true;
      file3Path = `${testDirPath}/testFile3.testExtension`;
      file3Content = { ijkl: 789 };
      file3Create = true;
      cacheContent = {};
    });

    let exec = async () => {
      if (file1Create)
        await writeFileAsync(file1Path, JSON.stringify(file1Content), "utf8");
      if (file2Create)
        await writeFileAsync(file2Path, JSON.stringify(file2Content), "utf8");
      if (file3Create)
        await writeFileAsync(file3Path, JSON.stringify(file3Content), "utf8");
      fileDataStorage = new FileDataStorage<any>(dirPath, extension);

      //Setting cache content for check if value is returned from cache or from file
      (fileDataStorage as any)._cacheData = cacheContent;

      return fileDataStorage.fetchAllData();
    };

    it("should fetch content from all files to cache - if cache is empty", async () => {
      cacheContent = {};

      await exec();

      expect((fileDataStorage as any)._cacheData).toEqual({
        testFile1: { abcd: 123 },
        testFile2: { efgh: 456 },
        testFile3: { ijkl: 789 },
      });
    });

    it("should fetch content from all files to cache (override files data) - if cache is not empty", async () => {
      cacheContent = {
        testFile1: { abcde: 1234 },
        testFile2: { efghi: 4567 },
        testFile3: { ijklm: 7890 },
      };

      await exec();

      expect((fileDataStorage as any)._cacheData).toEqual({
        testFile1: { abcd: 123 },
        testFile2: { efgh: 456 },
        testFile3: { ijkl: 789 },
      });
    });

    it("should fetch content from all files to cache (delete entries which file does not exist) - if cache is not empty", async () => {
      cacheContent = {
        testFile4: { efghi: 4567 },
        testFile5: { ijklm: 7890 },
      };

      await exec();

      expect((fileDataStorage as any)._cacheData).toEqual({
        testFile1: { abcd: 123 },
        testFile2: { efgh: 456 },
        testFile3: { ijkl: 789 },
      });
    });

    it("should fetch content from all files with empty object - if cache is not empty but there is no file in dir", async () => {
      cacheContent = {
        testFile1: { abcde: 1234 },
        testFile2: { efghi: 4567 },
        testFile3: { ijklm: 7890 },
      };

      file1Create = false;
      file2Create = false;
      file3Create = false;

      await exec();

      expect((fileDataStorage as any)._cacheData).toEqual({});
    });

    it("should fetch content from all files to cache - if file content is not a valid JSON", async () => {
      cacheContent = {
        testFile1: { abcde: 1234 },
        testFile2: { efghi: 4567 },
        testFile3: { ijklm: 7890 },
      };

      //Instead of creating file in exec - creating now with invalid content
      file2Create = false;
      await writeFileAsync(file2Path, "not a valid json content", "utf8");

      await exec();

      expect((fileDataStorage as any)._cacheData).toEqual({
        testFile1: { abcd: 123 },
        testFile2: "not a valid json content",
        testFile3: { ijkl: 789 },
      });
    });

    it("should fetch content from all files to cache - if file content is empty", async () => {
      cacheContent = {
        testFile1: { abcde: 1234 },
        testFile2: { efghi: 4567 },
        testFile3: { ijklm: 7890 },
      };

      //Instead of creating file in exec - creating now with invalid content
      file2Create = false;
      await writeFileAsync(file2Path, "", "utf8");

      await exec();

      expect((fileDataStorage as any)._cacheData).toEqual({
        testFile1: { abcd: 123 },
        testFile2: "",
        testFile3: { ijkl: 789 },
      });
    });

    it("should throw and not change cache - if dir does not exist", async () => {
      cacheContent = {};

      await exec();

      expect((fileDataStorage as any)._cacheData).toEqual({
        testFile1: { abcd: 123 },
        testFile2: { efgh: 456 },
        testFile3: { ijkl: 789 },
      });
    });
  });

  describe("init", () => {
    let fileDataStorage: FileDataStorage<any>;
    let dirPath: string;
    let extension: string;
    let file1Path: string;
    let file1Content: any;
    let file1Create: boolean;
    let file2Path: string;
    let file2Content: any;
    let file2Create: boolean;
    let file3Path: string;
    let file3Content: any;
    let file3Create: boolean;
    let cacheContent: any;

    beforeEach(() => {
      dirPath = testDirPath;
      extension = "testExtension";
      file1Path = `${testDirPath}/testFile1.testExtension`;
      file1Content = { abcd: 123 };
      file1Create = true;
      file2Path = `${testDirPath}/testFile2.testExtension`;
      file2Content = { efgh: 456 };
      file2Create = true;
      file3Path = `${testDirPath}/testFile3.testExtension`;
      file3Content = { ijkl: 789 };
      file3Create = true;
      cacheContent = {};
    });

    let exec = async () => {
      if (file1Create)
        await writeFileAsync(file1Path, JSON.stringify(file1Content), "utf8");
      if (file2Create)
        await writeFileAsync(file2Path, JSON.stringify(file2Content), "utf8");
      if (file3Create)
        await writeFileAsync(file3Path, JSON.stringify(file3Content), "utf8");
      fileDataStorage = new FileDataStorage<any>(dirPath, extension);

      //Setting cache content for check if value is returned from cache or from file
      (fileDataStorage as any)._cacheData = cacheContent;

      return fileDataStorage.init();
    };

    it("should fetch content from all files to cache - if cache is empty", async () => {
      cacheContent = {};

      await exec();

      expect((fileDataStorage as any)._cacheData).toEqual({
        testFile1: { abcd: 123 },
        testFile2: { efgh: 456 },
        testFile3: { ijkl: 789 },
      });
    });

    it("should fetch content from all files to cache (override files data) - if cache is not empty", async () => {
      cacheContent = {
        testFile1: { abcde: 1234 },
        testFile2: { efghi: 4567 },
        testFile3: { ijklm: 7890 },
      };

      await exec();

      expect((fileDataStorage as any)._cacheData).toEqual({
        testFile1: { abcd: 123 },
        testFile2: { efgh: 456 },
        testFile3: { ijkl: 789 },
      });
    });

    it("should fetch content from all files to cache (delete entries which file does not exist) - if cache is not empty", async () => {
      cacheContent = {
        testFile4: { efghi: 4567 },
        testFile5: { ijklm: 7890 },
      };

      await exec();

      expect((fileDataStorage as any)._cacheData).toEqual({
        testFile1: { abcd: 123 },
        testFile2: { efgh: 456 },
        testFile3: { ijkl: 789 },
      });
    });

    it("should fetch content from all files with empty object - if cache is not empty but there is no file in dir", async () => {
      cacheContent = {
        testFile1: { abcde: 1234 },
        testFile2: { efghi: 4567 },
        testFile3: { ijklm: 7890 },
      };

      file1Create = false;
      file2Create = false;
      file3Create = false;

      await exec();

      expect((fileDataStorage as any)._cacheData).toEqual({});
    });

    it("should fetch content from all files to cache - if file content is not a valid JSON", async () => {
      cacheContent = {
        testFile1: { abcde: 1234 },
        testFile2: { efghi: 4567 },
        testFile3: { ijklm: 7890 },
      };

      //Instead of creating file in exec - creating now with invalid content
      file2Create = false;
      await writeFileAsync(file2Path, "not a valid json content", "utf8");

      await exec();

      expect((fileDataStorage as any)._cacheData).toEqual({
        testFile1: { abcd: 123 },
        testFile2: "not a valid json content",
        testFile3: { ijkl: 789 },
      });
    });

    it("should fetch content from all files to cache - if file content is empty", async () => {
      cacheContent = {
        testFile1: { abcde: 1234 },
        testFile2: { efghi: 4567 },
        testFile3: { ijklm: 7890 },
      };

      //Instead of creating file in exec - creating now with invalid content
      file2Create = false;
      await writeFileAsync(file2Path, "", "utf8");

      await exec();

      expect((fileDataStorage as any)._cacheData).toEqual({
        testFile1: { abcd: 123 },
        testFile2: "",
        testFile3: { ijkl: 789 },
      });
    });

    it("should throw and not change cache - if dir does not exist", async () => {
      cacheContent = {};

      await exec();

      expect((fileDataStorage as any)._cacheData).toEqual({
        testFile1: { abcd: 123 },
        testFile2: { efgh: 456 },
        testFile3: { ijkl: 789 },
      });
    });
  });

  describe("getAllData", () => {
    let fileDataStorage: FileDataStorage<any>;
    let dirPath: string;
    let extension: string;
    let file1Path: string;
    let file1Content: any;
    let file1Create: boolean;
    let file2Path: string;
    let file2Content: any;
    let file2Create: boolean;
    let file3Path: string;
    let file3Content: any;
    let file3Create: boolean;
    let cacheContent: any;

    beforeEach(() => {
      dirPath = testDirPath;
      extension = "testExtension";
      file1Path = `${testDirPath}/testFile1.testExtension`;
      file1Content = { abcd: 123 };
      file1Create = true;
      file2Path = `${testDirPath}/testFile2.testExtension`;
      file2Content = { efgh: 456 };
      file2Create = true;
      file3Path = `${testDirPath}/testFile3.testExtension`;
      file3Content = { ijkl: 789 };
      file3Create = true;
      cacheContent = {
        testFile3: { abcde: 1234 },
        testFile4: { efghi: 4567 },
        testFile5: { ijklm: 7890 },
      };
    });

    let exec = async () => {
      if (file1Create)
        await writeFileAsync(file1Path, JSON.stringify(file1Content), "utf8");
      if (file2Create)
        await writeFileAsync(file2Path, JSON.stringify(file2Content), "utf8");
      if (file3Create)
        await writeFileAsync(file3Path, JSON.stringify(file3Content), "utf8");
      fileDataStorage = new FileDataStorage<any>(dirPath, extension);

      //Setting cache content for check if value is returned from cache or from file
      (fileDataStorage as any)._cacheData = cacheContent;

      return fileDataStorage.getAllData();
    };

    it("should combine and return data from both - cache and files and fetch data for all ids not present in cache but present in storage", async () => {
      cacheContent = {
        testFile3: { abcde: 1234 },
        testFile4: { efghi: 4567 },
        testFile5: { ijklm: 7890 },
      };

      file1Path = `${testDirPath}/testFile1.testExtension`;
      file1Content = { abcd: 123 };
      file2Path = `${testDirPath}/testFile2.testExtension`;
      file2Content = { efgh: 456 };
      file3Path = `${testDirPath}/testFile3.testExtension`;
      file3Content = { ijkl: 789 };

      let result = await exec();

      expect(result).toEqual({
        testFile3: { abcde: 1234 },
        testFile4: { efghi: 4567 },
        testFile5: { ijklm: 7890 },
        testFile1: { abcd: 123 },
        testFile2: { efgh: 456 },
      });

      //Cache should have been fetched
      expect((fileDataStorage as any)._cacheData).toEqual({
        testFile3: { abcde: 1234 },
        testFile4: { efghi: 4567 },
        testFile5: { ijklm: 7890 },
        testFile1: { abcd: 123 },
        testFile2: { efgh: 456 },
      });
    });

    it("should return data only from cache - if files do not exist", async () => {
      cacheContent = {
        testFile3: { abcde: 1234 },
        testFile4: { efghi: 4567 },
        testFile5: { ijklm: 7890 },
      };

      file1Create = false;
      file2Create = false;
      file3Create = false;

      let result = await exec();

      expect(result).toEqual({
        testFile3: { abcde: 1234 },
        testFile4: { efghi: 4567 },
        testFile5: { ijklm: 7890 },
      });

      //Cache should have been fetched
      expect((fileDataStorage as any)._cacheData).toEqual({
        testFile3: { abcde: 1234 },
        testFile4: { efghi: 4567 },
        testFile5: { ijklm: 7890 },
      });
    });

    it("should return data only from files and fetch cache - if cache is empty", async () => {
      cacheContent = {};

      file1Path = `${testDirPath}/testFile1.testExtension`;
      file1Content = { abcd: 123 };
      file2Path = `${testDirPath}/testFile2.testExtension`;
      file2Content = { efgh: 456 };
      file3Path = `${testDirPath}/testFile3.testExtension`;
      file3Content = { ijkl: 789 };

      let result = await exec();

      expect(result).toEqual({
        testFile1: { abcd: 123 },
        testFile2: { efgh: 456 },
        testFile3: { ijkl: 789 },
      });

      //Cache should have been fetched
      expect((fileDataStorage as any)._cacheData).toEqual({
        testFile1: { abcd: 123 },
        testFile2: { efgh: 456 },
        testFile3: { ijkl: 789 },
      });
    });

    it("should throw and not change cache - if there is no directory", async () => {
      cacheContent = {
        testFile3: { abcde: 1234 },
        testFile4: { efghi: 4567 },
        testFile5: { ijklm: 7890 },
      };

      await removeDirectoryIfExists(testDirPath);

      //Cannot create files in directory that does not exist
      file1Create = false;
      file2Create = false;
      file3Create = false;

      await expect(exec()).rejects.toMatchObject({
        code: "ENOENT",
      });

      //Cache should not have changed
      expect((fileDataStorage as any)._cacheData).toEqual({
        testFile3: { abcde: 1234 },
        testFile4: { efghi: 4567 },
        testFile5: { ijklm: 7890 },
      });
    });
  });

  describe("deleteData", () => {
    let fileDataStorage: FileDataStorage<any>;
    let extension: string;
    let dirPath: string;
    let dataId: string;
    let file1Path: string;
    let file1Content: any;
    let file1Create: boolean;
    let file2Path: string;
    let file2Content: any;
    let file2Create: boolean;
    let file3Path: string;
    let file3Content: any;
    let file3Create: boolean;
    let cacheContent: any;
    let deleteFileFromStroageThrows: boolean;

    beforeEach(() => {
      deleteFileFromStroageThrows = false;
      dirPath = testDirPath;
      dataId = "testFile2";
      extension = "testExtension";
      file1Path = `${testDirPath}/testFile1.testExtension`;
      file1Content = { abcd: 123 };
      file1Create = true;
      file2Path = `${testDirPath}/testFile2.testExtension`;
      file2Content = { efgh: 456 };
      file2Create = true;
      file3Path = `${testDirPath}/testFile3.testExtension`;
      file3Content = { ijkl: 789 };
      file3Create = true;
      cacheContent = {};
    });

    let exec = async () => {
      if (file1Create)
        await writeFileAsync(file1Path, JSON.stringify(file1Content), "utf8");
      if (file2Create)
        await writeFileAsync(file2Path, JSON.stringify(file2Content), "utf8");
      if (file3Create)
        await writeFileAsync(file3Path, JSON.stringify(file3Content), "utf8");
      fileDataStorage = new FileDataStorage<any>(dirPath, extension);

      //Setting cache content for check if value is returned from cache or from file
      (fileDataStorage as any)._cacheData = cacheContent;

      if (deleteFileFromStroageThrows)
        (fileDataStorage as any)._deleteDataFromStorage = jest.fn(async () => {
          throw new Error("test read file error");
        });

      return fileDataStorage.deleteData(dataId);
    };

    it("should delete content form cache and delete file - if both exists", async () => {
      cacheContent = {
        testFile1: {
          testContent1: 1001,
        },
        testFile2: {
          testContent2: 2001,
        },
        testFile3: {
          testContent3: 3001,
        },
      };

      await exec();

      let fileExists = await checkIfFileExistsAsync(
        `${testDirPath}/testFile2.testExtension`
      );
      expect(fileExists).toEqual(false);

      //Checking cache
      let mockedFileDataStorage = fileDataStorage as any;

      expect(mockedFileDataStorage._cacheData).toEqual({
        testFile1: {
          testContent1: 1001,
        },
        testFile3: {
          testContent3: 3001,
        },
      });
    });

    it("should only delete file - if data does not exist in cache", async () => {
      cacheContent = {
        testFile1: {
          testContent1: 1001,
        },
        testFile3: {
          testContent3: 3001,
        },
      };

      await exec();

      let fileExists = await checkIfFileExistsAsync(
        `${testDirPath}/testFile2.testExtension`
      );
      expect(fileExists).toEqual(false);

      //Checking cache
      let mockedFileDataStorage = fileDataStorage as any;

      expect(mockedFileDataStorage._cacheData).toEqual({
        testFile1: {
          testContent1: 1001,
        },
        testFile3: {
          testContent3: 3001,
        },
      });
    });

    it("should only delete content from cache - if file does not exist", async () => {
      cacheContent = {
        testFile1: {
          testContent1: 1001,
        },
        testFile2: {
          testContent2: 2001,
        },
        testFile3: {
          testContent3: 3001,
        },
      };

      file2Create = false;

      await exec();

      let fileExists = await checkIfFileExistsAsync(
        `${testDirPath}/testFile2.testExtension`
      );
      expect(fileExists).toEqual(false);

      //Checking cache
      let mockedFileDataStorage = fileDataStorage as any;

      expect(mockedFileDataStorage._cacheData).toEqual({
        testFile1: {
          testContent1: 1001,
        },
        testFile3: {
          testContent3: 3001,
        },
      });
    });

    it("should throw and no delete content from cache - if deleting file throws", async () => {
      cacheContent = {
        testFile1: {
          testContent1: 1001,
        },
        testFile2: {
          testContent2: 2001,
        },
        testFile3: {
          testContent3: 3001,
        },
      };

      deleteFileFromStroageThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "test read file error",
      });

      //File should not have been deleted
      let fileExists = await checkIfFileExistsAsync(
        `${testDirPath}/testFile2.testExtension`
      );
      expect(fileExists).toEqual(true);

      //Data should have stayed in cache as it was
      let mockedFileDataStorage = fileDataStorage as any;

      expect(mockedFileDataStorage._cacheData).toEqual({
        testFile1: {
          testContent1: 1001,
        },
        testFile2: {
          testContent2: 2001,
        },
        testFile3: {
          testContent3: 3001,
        },
      });
    });
  });
});

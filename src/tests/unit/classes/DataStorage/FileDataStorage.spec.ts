import { FileDataStorage } from "../../../../classes/DataStorage/FileDataStorage";
import {
  checkIfFileExistsAsync,
  clearDirectoryAsync,
  readFileAsync,
  writeFileAsync,
} from "../../../../utilities/utilities";

const testDirPath = "__testDir";

describe("FileDataStorage", () => {
  beforeEach(async () => {
    await clearDirectoryAsync(testDirPath);
  });

  afterEach(async () => {
    await clearDirectoryAsync(testDirPath);
  });

  describe("constructor", () => {
    let dirPath: string;

    beforeEach(() => {
      dirPath = testDirPath;
    });

    let exec = () => {
      return new FileDataStorage(dirPath);
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
      file1Path = `${testDirPath}/testFile1.json`;
      file1Content = { abcd: 123 };
      file1Create = true;
      file2Path = `${testDirPath}/testFile2.json`;
      file2Content = { efgh: 456 };
      file2Create = true;
      file3Path = `${testDirPath}/testFile3.json`;
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
      fileDataStorage = new FileDataStorage<any>(dirPath);

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

    it("should return false if file of given id does exist but with different extension than JSON", async () => {
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
      file1Path = `${testDirPath}/testFile1.json`;
      file1Content = { abcd: 123 };
      file1Create = true;
      file2Path = `${testDirPath}/testFile2.json`;
      file2Content = { efgh: 456 };
      file2Create = true;
      file3Path = `${testDirPath}/testFile3.json`;
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
      fileDataStorage = new FileDataStorage<any>(dirPath);

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

    it("should return null if file of given id does exist but with different extension than JSON", async () => {
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
      file1Path = `${testDirPath}/testFile1.json`;
      file1Content = { abcd: 123 };
      file1Create = true;
      file2Path = `${testDirPath}/testFile2.json`;
      file2Content = { efgh: 456 };
      file2Create = true;
      file3Path = `${testDirPath}/testFile3.json`;
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
      fileDataStorage = new FileDataStorage<any>(dirPath);

      //Setting cache content for check if value is returned from cache or from file
      (fileDataStorage as any)._cacheData = cacheContent;

      return fileDataStorage.setData(dataId, dataToSet);
    };

    it("should set content inside file and inside cache - if file doesn't exist before, cache is empty", async () => {
      cacheContent = {};

      await exec();

      let fileExists = await checkIfFileExistsAsync(
        `${testDirPath}/testFile4.json`
      );
      expect(fileExists).toEqual(true);

      let fileContent = await readFileAsync(
        `${testDirPath}/testFile4.json`,
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
        `${testDirPath}/testFile2.json`
      );
      expect(fileExists).toEqual(true);

      let fileContent = await readFileAsync(
        `${testDirPath}/testFile2.json`,
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
        `${testDirPath}/testFile4.json`
      );
      expect(fileExists).toEqual(true);

      let fileContent = await readFileAsync(
        `${testDirPath}/testFile4.json`,
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
        `${testDirPath}/testFile2.json`
      );
      expect(fileExists).toEqual(true);

      let fileContent = await readFileAsync(
        `${testDirPath}/testFile2.json`,
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
});

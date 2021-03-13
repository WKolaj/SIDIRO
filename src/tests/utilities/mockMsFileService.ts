import { MindSphereFileService } from "../../classes/MindSphereService/MindSphereFileService";
import { cloneObject } from "../../utilities/utilities";

export type MockedFileServiceContent = {
  [tenantName: string]: {
    [assetId: string]: {
      [filePath: string]: any;
    };
  };
};

let mindSphereContent: MockedFileServiceContent = {};
let serviceAvailable: boolean = true;

export function setServiceAvailable(available: boolean) {
  serviceAvailable = available;
}

export function mockMsFileService(
  fileServiceContent: MockedFileServiceContent
) {
  mindSphereContent = cloneObject(fileServiceContent);
  const fileService = MindSphereFileService.getInstance();
  fileService.checkIfFileExists = checkIfFileExists;
  fileService.getAllFileNamesFromAsset = getAllFileNamesFromAsset;
  fileService.getFileContent = getFileContent;
  fileService.setFileContent = setFileContent;
  fileService.deleteFile = deleteFile;
  fileService.countTotalNumberOfFiles = countTotalNumberOfFiles;
}

export const checkIfFileExists = jest.fn(
  async (tenantName: string, assetId: string, filePath: string) => {
    if (!serviceAvailable) throw new Error("Service not available!");
    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");
    if (mindSphereContent[tenantName][assetId] == null)
      throw new Error("Asset id not found in given tenant");

    let fileContent = mindSphereContent[tenantName][assetId][filePath];

    if (fileContent == null) return null;

    return Math.round(Math.random() * 1000);
  }
);

export const getAllFileNamesFromAsset = jest.fn(
  async (tenantName: string, assetId: string, extension: string | null) => {
    if (!serviceAvailable) throw new Error("Service not available!");
    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");
    if (mindSphereContent[tenantName][assetId] == null)
      throw new Error("Asset id not found in given tenant");

    let allFileNames = Object.keys(mindSphereContent[tenantName][assetId]);
    let filteredNames = allFileNames;

    if (extension != null)
      filteredNames = allFileNames.filter((fileName) =>
        fileName.includes(extension)
      );

    return filteredNames;
  }
);

export const getFileContent = jest.fn(
  async (tenantName: string, assetId: string, filePath: string) => {
    if (!serviceAvailable) throw new Error("Service not available!");
    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");
    if (mindSphereContent[tenantName][assetId] == null)
      throw new Error("Asset id not found in given tenant");
    if (mindSphereContent[tenantName][assetId][filePath] == null)
      throw new Error("File not found");

    let contentToReturn = cloneObject(
      mindSphereContent[tenantName][assetId][filePath]
    );

    return contentToReturn;
  }
);

export const setFileContent = jest.fn(
  async (
    tenantName: string,
    assetId: string,
    filePath: string,
    fileContent: any
  ) => {
    if (!serviceAvailable) throw new Error("Service not available!");
    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");
    if (mindSphereContent[tenantName][assetId] == null)
      throw new Error("Asset id not found in given tenant");

    let contentToSet = cloneObject(fileContent);
    mindSphereContent[tenantName][assetId][filePath] = contentToSet;
  }
);

export const deleteFile = jest.fn(
  async (tenantName: string, assetId: string, filePath: string) => {
    if (!serviceAvailable) throw new Error("Service not available!");
    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");
    if (mindSphereContent[tenantName][assetId] == null)
      throw new Error("Asset id not found in given tenant");
    if (mindSphereContent[tenantName][assetId][filePath] == null)
      throw new Error("File not found");

    delete mindSphereContent[tenantName][assetId][filePath];
  }
);

export const countTotalNumberOfFiles = jest.fn(
  async (tenantName: string, assetId: string) => {
    if (!serviceAvailable) throw new Error("Service not available!");
    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");
    if (mindSphereContent[tenantName][assetId] == null)
      throw new Error("Asset id not found in given tenant");

    return Object.keys(mindSphereContent[tenantName][assetId]).length;
  }
);

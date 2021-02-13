import { MindSphereService } from "./MindSphereService";

const mindSphereFileSeriesApiUrl = `https://gateway.eu1.mindsphere.io/api/iotfile/v3/files`;

export type MindSphereTimeFileData = {
  name: string;
  path: string;
  size: number;
  created: string;
  updated: string;
  tenantId: string;
  storagePrefix: string;
  etag: number;
};

/**
 * @description Class for representing file service of MindSphere
 */
export class MindSphereFileService extends MindSphereService {
  /**
   * @description Main instance of Singleton
   */
  private static _instance: MindSphereFileService | null = null;

  /**
   * @description Method for getting (or creating if not exists) main instance of Singleton
   */
  public static getInstance(): MindSphereFileService {
    if (MindSphereFileService._instance == null) {
      MindSphereFileService._instance = new MindSphereFileService(
        mindSphereFileSeriesApiUrl
      );
    }

    return MindSphereFileService._instance;
  }

  /**
   * @description Class for representing file service of MindSphere
   * @param url URL of MindSphere File Service
   */
  private constructor(url: string) {
    super(url);
  }

  /**
   * @description Method for getting url to get content of given file
   * @param assetId asset id stroing the file
   * @param fileName name of file to download
   */
  private _getFileServiceUrl(assetId: string, fileName: string) {
    return encodeURI(`${this._url}/${assetId}/${fileName}`);
  }

  /**
   * @description Method for getting url to check if file of given name exists. (name given in filter)
   * @param assetId asset id storing the file
   */
  private _getFileToCheckUrl(assetId: string) {
    return encodeURI(`${this._url}/${assetId}`);
  }

  /**
   * @description Method for getting filter to get file by name
   * @param fileName Name of file to filter
   */
  private _getFileToCheckFilter(fileName: string) {
    return `name eq '${fileName}'`;
  }

  /**
   * @description Method for checking if file of given name exists for given tenant. Returns eTag of file if it exists or null otherwise
   * @param assetId assetId
   * @param fileName fileName (with extension) to find
   */
  public async checkIfFileExists(assetId: string, fileName: string) {
    //Calling api in order to get file properties
    let result: { data: MindSphereTimeFileData[] } = await this._callAPI(
      "GET",
      this._getFileToCheckUrl(assetId),
      {
        filter: this._getFileToCheckFilter(fileName),
      }
    );

    //Returning null if there is no data in result or data is empty or there is no etag in file properties
    //Due to filter - only one tag should exists
    if (
      result.data == null ||
      result.data.length < 1 ||
      result.data[0].etag == null
    )
      return null;

    //Returning etag if etag exists
    return result.data[0].etag;
  }

  /**
   * @description Method for getting content of the file
   * @param assetId id of asset to store the file
   * @param fileName name of file to store
   */
  public async getFileContent(assetId: string, fileName: string): Promise<any> {
    let result = await this._callAPI(
      "GET",
      this._getFileServiceUrl(assetId, fileName),
      null,
      null,
      {
        "Content-Type": "application/octet-stream",
        Accept: "application/octet-stream",
      }
    );

    return result.data;
  }

  /**
   * @description Method for setting content of the file. Method creates new file if file does not exist or replace the file if it exists
   * @param assetId Id of asset to set the file into
   * @param fileName name of file to set
   * @param fileContent content of the file
   */
  public async setFileContent(
    assetId: string,
    fileName: string,
    fileContent: any
  ) {
    //Check if file exists
    let eTagNumber = await this.checkIfFileExists(assetId, fileName);

    let headers: { [key: string]: string | boolean | number | null } = {
      "Content-Type": "application/octet-stream",
      Accept: "application/octet-stream",
    };

    //eTag is null if file does not exist
    if (eTagNumber != null) headers["If-Match"] = eTagNumber;

    await this._callAPI(
      "PUT",
      this._getFileServiceUrl(assetId, fileName),
      null,
      fileContent,
      headers
    );
  }

  /**
   * @description Method for deleting the file from the MindSphere - NOTICE! Throws if there is no such file
   * @param assetId Id of asset to delete the file from
   * @param fileName Name of the file to delete
   */
  public async deleteFile(assetId: string, fileName: string) {
    await this._callAPI("DELETE", this._getFileServiceUrl(assetId, fileName));
  }

  /**
   * @description Method for getting all files from given asset
   * @param assetId id of asset where files are stored
   * @param extension file extension - optional
   */
  public async getAllFileNamesFromAsset(
    assetId: string,
    extension: string | null = null
  ): Promise<string[]> {
    //Getting result and returning it if it is valid
    let result: { data: MindSphereTimeFileData[] } = await this._callAPI(
      "GET",
      this._getFileToCheckUrl(assetId)
    );

    if (result.data == null || !Array.isArray(result.data)) return [];

    let fileNames = result.data
      .filter((fileData) => fileData != null && fileData.name != null)
      .map((fileData) => fileData.name);

    let fileNamesToReturn = fileNames;

    let extensionWithDot = `.${extension}`;

    //Filtering extensions manually - filtering it via MindSphere takes too much time
    if (extension != null)
      fileNamesToReturn = fileNames.filter((fileName) =>
        fileName.includes(extensionWithDot)
      );

    return fileNamesToReturn;
  }
}

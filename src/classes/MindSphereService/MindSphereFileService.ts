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

export class MindSphereFileService extends MindSphereService {
  private static _instance: MindSphereFileService | null = null;

  public static getInstance(): MindSphereFileService {
    if (MindSphereFileService._instance == null) {
      MindSphereFileService._instance = new MindSphereFileService(
        mindSphereFileSeriesApiUrl
      );
    }

    return MindSphereFileService._instance;
  }

  private constructor(url: string) {
    super(url);
  }

  private _getFileServiceUrl(assetId: string, fileName: string) {
    return encodeURI(`${this._url}/${assetId}/${fileName}`);
  }

  private _getFileToCheckUrl(assetId: string) {
    return encodeURI(`${this._url}/${assetId}`);
  }

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

  public async deleteFile(assetId: string, fileName: string) {
    await this._callAPI("DELETE", this._getFileServiceUrl(assetId, fileName));
  }
}

//TODO - add comments to this class
//TODO - add tests for this class

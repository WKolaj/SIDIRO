import { MindSphereService } from "./MindSphereService";

const mindSphereAssetsApiUrl = `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`;

/**
 * @description Class for representing MindSphere service for storing time-series data
 */
export class MindSphereAssetSerivce extends MindSphereService {
  /**
   * @description Main instance of Singleton
   */
  private static _instance: MindSphereAssetSerivce | null = null;

  /**
   * @description Method for getting (or creating if not exists) main instance of Singleton
   */
  public static getInstance(): MindSphereAssetSerivce {
    if (MindSphereAssetSerivce._instance == null) {
      MindSphereAssetSerivce._instance = new MindSphereAssetSerivce(
        mindSphereAssetsApiUrl
      );
    }

    return MindSphereAssetSerivce._instance;
  }

  /**
   * @description Class for representing MindSphere service for storing time-series data
   * @param url URL for getting time-series data from
   */
  private constructor(url: string) {
    super(url);
  }

  /**
   * Method for getting url to access assets data
   * @param assetId id of asset
   */
  private _getAssetURL(assetId: string) {
    return encodeURI(`${this._url}/${assetId}`);
  }

  /**
   * Method for getting asset
   * @param assetId id of asset to get
   */
  public async getAsset(assetId: string) {
    //TODO - add types for asset creation
    let result = await this._callAPI(
      "GET",
      this._getAssetURL(assetId),
      null,
      null,
      {
        Accept: "application/json, text/plain, */*",
      }
    );
    return result.data;
  }
}

//TODO - test this class

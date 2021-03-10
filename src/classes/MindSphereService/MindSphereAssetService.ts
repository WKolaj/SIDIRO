import {
  MindSpherePaginatedResponse,
  MindSphereService,
} from "./MindSphereService";

const mindSphereAssetsApiUrl = `https://gateway.eu1.mindsphere.io/api/assetmanagement/v3/assets`;

/**
 * @description Type representing asset's data
 */
export type MindSphereAsset = {
  name: string;
  parentId: string;
  typeId: string;
  externalId?: string;
  description?: string;
  location?: {
    country: string;
    region: string;
    locality: string;
    streetAddress: string;
    postalCode: string;
    longitude: number;
    latitude: number;
  };
  variables?: any[];
  aspects?: any[];
  fileAssignments?: any[];
  timezone?: string;
  twinType?: string;
  tenantId?: string;
  subTenant?: string;
  assetId?: string;
  locks?: any[];
  deleted?: string;
  sharing?: any;
  etag?: number;
  _links?: {
    self?: {
      href: string;
    };
    parent?: {
      href: string;
    };
    children?: {
      href: string;
    };
    variables?: {
      href: string;
    };
    aspects?: {
      href: string;
    };
    t2Tenant?: {
      href: string;
    };
    location?: {
      href: string;
    };
  };
  hierarchyPath?: any[];
};

/**
 * @description Class for representing MindSphere service for storing time-series data
 */
export class MindSphereAssetService extends MindSphereService {
  /**
   * @description Main instance of Singleton
   */
  private static _instance: MindSphereAssetService | null = null;

  /**
   * @description Method for getting (or creating if not exists) main instance of Singleton
   */
  public static getInstance(): MindSphereAssetService {
    if (MindSphereAssetService._instance == null) {
      MindSphereAssetService._instance = new MindSphereAssetService(
        mindSphereAssetsApiUrl
      );
    }

    return MindSphereAssetService._instance;
  }

  /**
   * @description Class for representing MindSphere service for storing time-series data
   * @param url URL for getting time-series data from
   */
  private constructor(url: string) {
    super(url);
  }

  /**
   * @description Method for getting filter to get assets of given type from given parent asset
   * @param name Asset name
   * @param parentAssetId Parent asset
   * @param assetType Asset type
   */
  private _getAssetsFilter(
    name: string | null = null,
    parentAssetId: string | null = null,
    assetType: string | null = null
  ) {
    if (parentAssetId == null && name == null && assetType == null) return null;

    let filterToReturn: {
      name?: string;
      parentId?: string;
      typeId?: string;
    } = {};
    if (parentAssetId != null) filterToReturn.parentId = parentAssetId;
    if (name != null) filterToReturn.name = name;
    if (assetType != null) filterToReturn.typeId = assetType;

    return filterToReturn;
  }

  /**
   * @description Method for getting filter to get assets of given type from given parent asset
   * @param name Asset name
   * @param parentAssetId Parent asset
   * @param assetType Asset type
   */
  private _getAssetCheckFilter(assetId: string) {
    return {
      assetId: assetId,
    };
  }

  /**
   * Method for getting url to access assets data
   * @param assetId id of asset
   */
  private _getAssetURL(assetId: string) {
    return encodeURI(`${this._url}/${assetId}`);
  }

  /**
   * Method for getting asset. NOTICE! Method returns null if asset does not exist or etag of asset if it exists
   * @param tenant tenant to call API
   * @param assetId id of asset to get
   */
  public async checkIfAssetExists(
    tenant: string,
    assetId: string
  ): Promise<number | null> {
    let result = await this._callAPI(
      tenant,
      "GET",
      this._url,
      { filter: this._getAssetCheckFilter(assetId) },
      null,
      {
        Accept: "application/json, text/plain, */*",
      }
    );

    //Checking if response is valid and there is at least one asset
    if (
      result?.data?._embedded?.assets == null ||
      !Array.isArray(result.data._embedded.assets) ||
      result.data._embedded.assets.length < 1 ||
      result.data._embedded.assets[0].etag == null
    )
      return null;

    return result.data._embedded.assets[0].etag;
  }

  /**
   * Method for getting assets
   * @param tenant tenant to call API
   * @param name name of assets to get (optional)
   * @param parentId id of asset's parent (optional)
   * @param assetType type of asset (optional)
   */
  public async getAssets(
    tenant: string,
    name: string | null = null,
    parentId: string | null = null,
    assetType: string | null = null
  ): Promise<MindSphereAsset[]> {
    //Generating call params
    let params: { filter?: any; size: number } = { size: 100 };
    let filter = this._getAssetsFilter(name, parentId, assetType);
    if (filter != null) params.filter = filter;
    let responses = await this._callPaginatedAPI(
      tenant,
      "GET",
      this._url,
      params,
      null,
      {
        Accept: "application/json, text/plain, */*",
      }
    );

    let allAssets: MindSphereAsset[] = [];

    for (let response of responses) {
      if (
        response._embedded != null &&
        response._embedded.assets != null &&
        Array.isArray(response._embedded.assets)
      )
        allAssets.push(...response._embedded.assets);
    }

    return allAssets;
  }

  /**
   * Method for getting asset
   * @param tenant tenant to call API
   * @param assetId id of asset to get
   */
  public async getAsset(
    tenant: string,
    assetId: string
  ): Promise<MindSphereAsset> {
    let result = await this._callAPI(
      tenant,
      "GET",
      this._getAssetURL(assetId),
      null,
      null,
      {
        Accept: "application/json, text/plain, */*",
      }
    );
    return result.data as MindSphereAsset;
  }

  /**
   * Method for creating an asset
   * @param tenant tenant to call API
   * @param assetPayload asset payload used for creation
   */
  public async createAsset(
    tenant: string,
    assetPayload: MindSphereAsset
  ): Promise<MindSphereAsset> {
    let result = await this._callAPI(
      tenant,
      "POST",
      this._url,
      null,
      {
        ...assetPayload,
      },
      {
        Accept: "application/json, text/plain, */*",
      }
    );
    return result.data as MindSphereAsset;
  }

  /**
   * @description Method for updating the asset. NOTICE! Returns new updated payload or null - if there is no asset of given id
   * @param tenant tenant to call API
   * @param assetId asset id to update
   * @param assetPayload asset payload used for update
   */
  public async updateAsset(
    tenant: string,
    assetId: string,
    assetPayload: MindSphereAsset
  ): Promise<MindSphereAsset | null> {
    let eTagNumber = await this.checkIfAssetExists(tenant, assetId);
    if (eTagNumber == null) return null;

    let result = await this._callAPI(
      tenant,
      "PUT",
      this._getAssetURL(assetId),
      null,
      {
        ...assetPayload,
      },
      {
        Accept: "application/json, text/plain, */*",
        "If-Match": eTagNumber,
      }
    );
    return result.data as MindSphereAsset;
  }

  /**
   * Method for deleting an asset. NOTICE - returns number of etag of deleted asset or null if there was no asset of given id
   * @param tenant tenant to call API
   * @param assetId id of asset to delete
   */
  public async deleteAsset(
    tenant: string,
    assetId: string
  ): Promise<number | null> {
    let eTagNumber = await this.checkIfAssetExists(tenant, assetId);
    if (eTagNumber == null) return null;

    await this._callAPI(
      tenant,
      "DELETE",
      this._getAssetURL(assetId),
      null,
      null,
      {
        Accept: "application/json, text/plain, */*",
        "If-Match": eTagNumber,
      }
    );

    return eTagNumber;
  }
}

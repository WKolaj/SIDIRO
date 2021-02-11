import { DataStorage } from "./DataStorage";

type DataDictionary<T> = {
  [key: string]: T;
};

export abstract class CachedDataStorage<T> extends DataStorage<T> {
  private _cacheData: DataDictionary<T> = {};

  protected _getDataInCache(id: string): T {
    return this._cacheData[id];
  }

  protected _setDataToCache(id: string, data: T): void {
    this._cacheData[id] = data;
  }

  public async dataExists(id: string): Promise<boolean> {
    if (this._getDataInCache(id) != null) return true;
    return await this._dataExistsInStorage(id);
  }

  public async getData(id: string): Promise<T | null> {
    //Fetching the data from storage to cashe - if it doesn't exist
    if (this._getDataInCache(id) == null) {
      //Checking if file exists in storage and returning null if not
      let fileExists = await this._dataExistsInStorage(id);
      if (!fileExists) return null;

      //Getting data from storage and setting it inside cashe data
      let result = await this._getDataFromStorage(id);
      if (result != null) this._setDataToCache(id, result);
    }

    //Retruning the data from cashe
    return this._getDataInCache(id) ?? null;
  }

  public async setData(id: string, data: T): Promise<void> {
    await this._setDataInStorage(id, data);
    this._setDataToCache(id, data);
  }

  public async init(): Promise<void> {}

  protected abstract _getDataFromStorage(id: string): Promise<T | null>;

  protected abstract _setDataInStorage(id: string, data: T): Promise<void>;

  protected abstract _dataExistsInStorage(id: string): Promise<boolean>;
}

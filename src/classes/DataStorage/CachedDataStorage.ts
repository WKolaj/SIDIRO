import { DataStorage } from "./DataStorage";
import { removeDuplicatesFromArray } from "../../utilities/utilities";
import { Dictionary } from "lodash";

type DataDictionary<T> = {
  [key: string]: T;
};

export abstract class CachedDataStorage<T> extends DataStorage<T> {
  private _cacheData: DataDictionary<T> = {};

  protected _getDataFromCache(id: string): T {
    return this._cacheData[id];
  }

  protected _setDataInCache(id: string, data: T): void {
    this._cacheData[id] = data;
  }

  protected _clearDataInCache(id: string): void {
    //TODO draw this method in class diagram
    if (this._cacheData[id] != null) delete this._cacheData[id];
  }

  protected _clearAllDataInCache(): void {
    //TODO draw this method in class diagram
    this._cacheData = {};
  }

  protected _getAllIdsFromCache(): string[] {
    //TODO - test this method
    return Object.keys(this._cacheData);
  }

  protected _getAllDataFromCache(): { [key: string]: T } {
    //TODO - test this method
    return { ...this._cacheData };
  }

  /**
   * @description Method for fetching all data from MindSphere File Service. NOTICE! All data in cache that do not exist in File Service are deleted
   */
  public async fetchAllData(): Promise<void> {
    //TODO - test this method
    //Clearing cache
    this._clearAllDataInCache();

    //Getting all data from storage
    let allIds = await this._getAllIdsFromStorage();

    //Fetching data from all absent data
    await Promise.all(allIds.map((id) => this.fetchData(id)));
  }

  public async fetchData(id: string): Promise<void> {
    //TODO - test this method
    let dataToSet = null;

    //Checking if file exists in storage and getting its data if file exists
    let fileExists = await this._dataExistsInStorage(id);
    if (fileExists) {
      let result = await this._getDataFromStorage(id);
      if (result != null) dataToSet = result;
    }

    //Setting Data in cache or clear the cash if dataToSet was not retrieved properly or file does not exist
    if (dataToSet != null) this._setDataInCache(id, dataToSet);
    else this._clearDataInCache(id);
  }

  public async dataExists(id: string): Promise<boolean> {
    if (this._getDataFromCache(id) != null) return true;
    return await this._dataExistsInStorage(id);
  }

  public async getData(id: string): Promise<T | null> {
    //Fetching the data from storage to cashe - if it doesn't exist
    if (this._getDataFromCache(id) == null) {
      await this.fetchData(id);
    }

    //Retruning the data from cashe
    return this._getDataFromCache(id) ?? null;
  }

  public async setData(id: string, data: T): Promise<void> {
    await this._setDataInStorage(id, data);
    this._setDataInCache(id, data);
  }

  public async getAllIds(): Promise<string[]> {
    //TODO - test this method
    let idsFromCache = this._getAllIdsFromCache();
    let idsFromStorage = await this._getAllIdsFromStorage();
    return removeDuplicatesFromArray([...idsFromCache, ...idsFromStorage]);
  }

  public async getAllData(): Promise<{ [key: string]: T }> {
    //TODO - test this method
    let allIdsFromStorage = await this._getAllIdsFromStorage();
    let allIdsFromCache = await this._getAllIdsFromCache();

    //Calculating ids to fetch
    let absentIdsFromStorage = allIdsFromStorage.filter(
      (id) => !allIdsFromCache.includes(id)
    );

    //Fetching data from all absent data
    await Promise.all(absentIdsFromStorage.map((id) => this.fetchData(id)));

    //Returning copy of all data
    return { ...this._cacheData };
  }

  public async init(): Promise<void> {
    await this.fetchAllData();
  }

  protected abstract _getDataFromStorage(id: string): Promise<T | null>;

  protected abstract _setDataInStorage(id: string, data: T): Promise<void>;

  protected abstract _dataExistsInStorage(id: string): Promise<boolean>;

  protected abstract _getAllIdsFromStorage(): Promise<string[]>;
}

import { DataStorage } from "./DataStorage";

type DataDictionary<T> = {
  [key: string]: T;
};

export abstract class CashedDataStorage<T> extends DataStorage<T> {
  private _casheData: DataDictionary<T> = {};

  private _getDataFromCashe(id: string): T {
    return this._casheData[id];
  }

  private _setDataToCashe(id: string, data: T): void {
    this._casheData[id] = data;
  }

  public async dataExists(id: string): Promise<boolean> {
    if (this._casheData[id] != null) return true;
    return await this._dataExistsInStorage(id);
  }

  public async getData(id: string): Promise<T | null> {
    //Fetching the data from storage to cashe - if it doesn't exist
    if (this._casheData[id] == null) {
      //Checking if file exists in storage and returning null if not
      let fileExists = await this._dataExistsInStorage(id);
      if (!fileExists) return null;

      //Getting data from storage and setting it inside cashe data
      let result = await this._getDataFromStorage(id);
      if (result != null) this._casheData[id] = result;
    }

    //Retruning the data from cashe
    return this._casheData[id];
  }

  public async setData(id: string, data: T): Promise<void> {
    await this._setDataInStorage(id, data);
    this._casheData[id] = data;
  }

  public async init(): Promise<void> {}

  protected abstract _getDataFromStorage(id: string): Promise<T | null>;

  protected abstract _setDataInStorage(id: string, data: T): Promise<void>;

  protected abstract _dataExistsInStorage(id: string): Promise<boolean>;
}

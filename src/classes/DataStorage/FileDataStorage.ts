import { CachedDataStorage } from "./CachedDataStorage";
import path from "path";
import {
  checkIfFileExistsAsync,
  readFileAsync,
  writeFileAsync,
} from "../../utilities/utilities";

export class FileDataStorage<T> extends CachedDataStorage<T> {
  private _dirPath: string;

  get DirPath(): string {
    return this._dirPath;
  }

  constructor(dirPath: string) {
    super();
    this._dirPath = dirPath;
  }

  private _getFilePathBasedOnId(id: string): string {
    return path.join(this.DirPath, `${id}.json`);
  }

  protected async _dataExistsInStorage(id: string): Promise<boolean> {
    let filePath = this._getFilePathBasedOnId(id);
    return checkIfFileExistsAsync(filePath);
  }

  protected async _getDataFromStorage(id: string): Promise<T> {
    let filePath = this._getFilePathBasedOnId(id);
    let fileContent = JSON.parse(await readFileAsync(filePath, "utf8"));
    return fileContent as T;
  }

  protected async _setDataInStorage(id: string, data: T): Promise<void> {
    let filePath = this._getFilePathBasedOnId(id);
    await writeFileAsync(filePath, JSON.stringify(data), "utf8");
  }
}

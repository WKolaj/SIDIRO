import { CachedDataStorage } from "./CachedDataStorage";
import path from "path";
import {
  checkIfFileExistsAsync,
  readFileAsync,
  writeFileAsync,
  readDirAsync,
  isStringAValidJSON,
  removeFileIfExistsAsync,
} from "../../utilities/utilities";

export class FileDataStorage<T> extends CachedDataStorage<T> {
  private _dirPath: string;
  private _extension: string;

  get DirPath(): string {
    return this._dirPath;
  }

  get Extension(): string {
    return this._extension;
  }

  constructor(dirPath: string, extension: string) {
    super();
    this._dirPath = dirPath;
    this._extension = extension;
  }

  private _getFilePathBasedOnId(id: string): string {
    return path.join(this.DirPath, `${id}.${this.Extension}`);
  }

  private _getIdBasedOnFileName(path: string): string {
    return path.replace(`.${this.Extension}`, "");
  }

  private _isFilePathValid(path: string): boolean {
    return path.includes(`.${this.Extension}`);
  }

  protected async _dataExistsInStorage(id: string): Promise<boolean> {
    let filePath = this._getFilePathBasedOnId(id);
    return checkIfFileExistsAsync(filePath);
  }

  protected async _getDataFromStorage(id: string): Promise<T> {
    let filePath = this._getFilePathBasedOnId(id);
    let stringContent = await readFileAsync(filePath, "utf8");
    let fileContent = isStringAValidJSON(stringContent)
      ? JSON.parse(stringContent)
      : stringContent;
    return fileContent as T;
  }

  protected async _setDataInStorage(id: string, data: T): Promise<void> {
    let filePath = this._getFilePathBasedOnId(id);
    await writeFileAsync(filePath, JSON.stringify(data), "utf8");
  }

  protected async _getAllIdsFromStorage(): Promise<string[]> {
    return (await readDirAsync(this.DirPath))
      .filter((path) => this._isFilePathValid(path))
      .map((fileName) => this._getIdBasedOnFileName(fileName));
  }

  protected async _deleteDataFromStorage(id: string): Promise<void> {
    let filePath = this._getFilePathBasedOnId(id);
    await removeFileIfExistsAsync(filePath);
  }
}

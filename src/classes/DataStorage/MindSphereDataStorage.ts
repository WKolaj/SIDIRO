import { MindSphereFileService } from "../MindSphereService/MindSphereFileService";
import { CachedDataStorage } from "./CachedDataStorage";

export class MindSphereDataStorage<T> extends CachedDataStorage<T> {
  private _fileService: MindSphereFileService = MindSphereFileService.getInstance();

  private _assetId: string;

  get AssetId(): string {
    return this._assetId;
  }

  constructor(assetId: string) {
    super();
    this._assetId = assetId;
  }

  private _getFilePathBasedOnId(id: string): string {
    return `${id}.json`;
  }

  private _getIdBasedOnFileName(fileName: string): string {
    return fileName.replace(".json", "");
  }

  protected async _dataExistsInStorage(id: string): Promise<boolean> {
    let filePath = this._getFilePathBasedOnId(id);
    let fileETag = await this._fileService.checkIfFileExists(
      this.AssetId,
      filePath
    );
    return fileETag != null;
  }

  protected async _getDataFromStorage(id: string): Promise<T> {
    let filePath = this._getFilePathBasedOnId(id);
    let result = await this._fileService.getFileContent(this.AssetId, filePath);
    return result as T;
  }

  protected async _setDataInStorage(id: string, data: T): Promise<void> {
    let filePath = this._getFilePathBasedOnId(id);
    await this._fileService.setFileContent(this.AssetId, filePath, data);
  }

  protected async _getAllIdsFromStorage(): Promise<string[]> {
    return (
      await this._fileService.getAllFileNamesFromAsset(this.AssetId, "json")
    )
      .filter((fileName) => fileName != null)
      .map((fileName) => this._getIdBasedOnFileName(fileName));
  }
}

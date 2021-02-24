import { MindSphereFileService } from "../MindSphereService/MindSphereFileService";
import { CachedDataStorage } from "./CachedDataStorage";

export class MindSphereDataStorage<T> extends CachedDataStorage<T> {
  private _fileService: MindSphereFileService = MindSphereFileService.getInstance();

  //TODO - test and include changes associated with tenant call in class diagram
  private _tenant: string;
  private _assetId: string;
  private _extension: string;

  get Tenant(): string {
    return this._tenant;
  }

  get AssetId(): string {
    return this._assetId;
  }

  get Extension(): string {
    return this._extension;
  }

  constructor(tenant: string, assetId: string, extension: string) {
    super();
    this._tenant = tenant;
    this._assetId = assetId;
    this._extension = extension;
  }

  private _getFilePathBasedOnId(id: string): string {
    return `${id}.${this.Extension}`;
  }

  private _getIdBasedOnFileName(fileName: string): string {
    return fileName.replace(`.${this.Extension}`, "");
  }

  protected async _dataExistsInStorage(id: string): Promise<boolean> {
    let filePath = this._getFilePathBasedOnId(id);
    let fileETag = await this._fileService.checkIfFileExists(
      this.Tenant,
      this.AssetId,
      filePath
    );
    return fileETag != null;
  }

  protected async _getDataFromStorage(id: string): Promise<T> {
    let filePath = this._getFilePathBasedOnId(id);
    let result = await this._fileService.getFileContent(
      this.Tenant,
      this.AssetId,
      filePath
    );
    return result as T;
  }

  protected async _setDataInStorage(id: string, data: T): Promise<void> {
    let filePath = this._getFilePathBasedOnId(id);
    await this._fileService.setFileContent(
      this.Tenant,
      this.AssetId,
      filePath,
      data
    );
  }

  protected async _getAllIdsFromStorage(): Promise<string[]> {
    return (
      await this._fileService.getAllFileNamesFromAsset(
        this.AssetId,
        this.Extension
      )
    )
      .filter((fileName) => fileName != null)
      .map((fileName) => this._getIdBasedOnFileName(fileName));
  }
}

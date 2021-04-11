import { CachedDataStorage } from "../DataStorage/CachedDataStorage";
import CustomService from "./CustomService";
import {
  CustomServicePayload,
  CustomServiceType,
} from "./CustomServiceManager";

export interface TestCustomServicePayload extends CustomServicePayload {
  serviceType: CustomServiceType.TestCustomService;
}

class TestCustomService extends CustomService<TestCustomServicePayload> {
  public constructor(
    id: string,
    dataStorage: CachedDataStorage<TestCustomServicePayload>
  ) {
    super(CustomServiceType.TestCustomService, id, dataStorage);
  }

  protected async _onInit(
    tickId: number,
    data: TestCustomServicePayload
  ): Promise<void> {
    console.log(`${tickId} - ${this.ID}: service initialized!`);
  }

  protected async _onRefresh(tickId: number): Promise<void> {
    console.log(`${tickId} - ${this.ID}: service refreshed!`);
  }

  protected async _onSetStorageData(
    payload: TestCustomServicePayload
  ): Promise<void> {
    console.log(`${this.ID}: new data set!`);
  }
}

export default TestCustomService;

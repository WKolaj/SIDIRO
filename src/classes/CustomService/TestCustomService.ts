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

  public async _onInit(tickId: number): Promise<void> {
    console.log(`${tickId} - ${this.ID}: service initialized!`);
  }

  public async _onRefresh(tickId: number): Promise<void> {
    console.log(`${tickId} - ${this.ID}: service refreshed!`);
  }
}

export default TestCustomService;

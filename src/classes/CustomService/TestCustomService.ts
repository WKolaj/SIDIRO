import CustomService from "./CustomService";

class TestCustomService extends CustomService {
  public async _onInit(tickId: number): Promise<void> {
    console.log(`${tickId} - ${this.ID}: service initialized!`);
  }

  public async _onRefresh(tickId: number): Promise<void> {
    console.log(`${tickId} - ${this.ID}: service refreshed!`);
  }
}

export default TestCustomService;

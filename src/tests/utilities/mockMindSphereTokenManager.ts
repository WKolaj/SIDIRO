import { MindSphereTokenManager } from "../../classes/MindSphereService/MindSphereToken/MindSphereTokenManager";
import { generateRandomString } from "../../utilities/utilities";

let managers: { [tenantName: string]: MockedMindSphereTokenManager } = {};

export const mockMindSphereTokenManager = () => {
  (MindSphereTokenManager as any).getInstance = getMindSphereTokenManagerInstanceMock;
};

export const clearMindSphereTokenManagerInstanceMock = () => {
  managers = {};
};

export const getMindSphereTokenManagerInstanceMock = (tenantName: string) => {
  if (managers[tenantName] == null)
    managers[tenantName] = new MockedMindSphereTokenManager(tenantName);

  return managers[tenantName];
};

export const fetchNewTokenMockFunc = jest.fn(async () => {});

class MockedMindSphereTokenManager {
  private _tenant: string;

  private _token: null | string = null;

  constructor(tenant: string) {
    this._tenant = tenant;
  }

  public async fetchNewToken(): Promise<void> {
    let newToken = generateRandomString(6);
    this._token = newToken;
  }

  public async getToken(): Promise<string> {
    if (this._token == null) await this.fetchNewToken();

    return this._token!;
  }
}

import { MindSphereTokenManager } from "../../../../classes/MindSphereService/MindSphereToken/MindSphereTokenManager";
import axios from "axios";
import { MindSphereEventService } from "../../../../classes/MindSphereService/MindSphereEventService";
import MockDate from "mockdate";
import { testPrivateProperty } from "../../../testUtilities";

let mockedAxios = axios as any;

describe("MindSphereEventService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    //Reseting static class
    (MindSphereTokenManager as any)._instance = null;
    (MindSphereEventService as any)._instance = null;

    //Reseting axios
    mockedAxios.__reset();
  });

  afterEach(() => {
    jest.clearAllMocks();

    //Reseting static class
    (MindSphereTokenManager as any)._instance = null;
    (MindSphereEventService as any)._instance = null;

    //Reseting axios
    mockedAxios.__reset();
  });

  describe("getInstance", () => {
    let mockedMindSphereTokenManager: MindSphereTokenManager;

    let exec = () => {
      //Getting token manager to check if it is the same as global instance
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance();

      return MindSphereEventService.getInstance();
    };

    it("should return valid instance of MindSphereEventService", () => {
      let result = exec();

      expect(result).not.toEqual(null);
      expect(result instanceof MindSphereEventService).toEqual(true);
    });

    it("should return the same instance of MindSphereEventService if called several times", () => {
      let result1 = exec();
      let result2 = exec();
      let result3 = exec();

      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
      expect(result3).toEqual(result1);
    });

    it("should properly set main url of MindSphere timeseries API", () => {
      let result = exec();

      testPrivateProperty(
        result,
        "_url",
        `https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events`
      );
    });

    it("should properly set tokenManager", () => {
      let result = exec();

      testPrivateProperty(
        result,
        "_tokenManager",
        mockedMindSphereTokenManager
      );
    });
  });

  //TODO - add tests for other event service methods - including pagination
});

import { MindSphereService } from "../../../../classes/MindSphereService/MindSphereService";

describe("MindSphereService", () => {
  describe("convertUnixToMindSphereDate", () => {
    let unixDate: any;
    beforeEach(() => {
      //1612102081656 - 2021-01-31T14:08:01.656Z
      unixDate = 1612102081656;
    });

    let exec = () => {
      return MindSphereService.convertUnixToMindSphereDate(unixDate);
    };

    it("should properly convert and return date to MindSphere format", () => {
      let result = exec();
      expect(result).toEqual("2021-01-31T14:08:01.656Z");
    });

    it("should throw if time is null", () => {
      unixDate = null;
      expect(exec).toThrow("Invalid unix date");
    });

    it("should throw if time is undefined", () => {
      unixDate = null;
      expect(exec).toThrow("Invalid unix date");
    });
  });

  describe("convertUnixToMindSphereDate", () => {
    let mindSphereDate: any;
    beforeEach(() => {
      //1612102081656 - 2021-01-31T14:08:01.656Z
      mindSphereDate = "2021-01-31T14:08:01.656Z";
    });

    let exec = () => {
      return MindSphereService.convertMindSphereDateToUnix(mindSphereDate);
    };

    it("should properly convert and return date to MindSphere format", () => {
      let result = exec();
      expect(result).toEqual(1612102081656);
    });

    it("should throw if time is null", () => {
      mindSphereDate = null;
      expect(exec).toThrow("Invalid date format");
    });

    it("should throw if time is undefined", () => {
      mindSphereDate = null;
      expect(exec).toThrow("Invalid date format");
    });

    it("should throw if time is invalid string", () => {
      mindSphereDate = "abcd1234";
      expect(exec).toThrow("Invalid date format");
    });

    it("should not throw if time is 1970", () => {
      mindSphereDate = "1970-01-01T00:00:00.000Z";
      let result = exec();
      expect(result).toEqual(0);
    });
  });
});

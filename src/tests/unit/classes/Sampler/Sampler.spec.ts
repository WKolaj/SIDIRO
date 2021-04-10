import Sampler from "../../../../classes/Sampler/Sampler";
import { snooze } from "../../../../utilities/utilities";
import {
  setPrivateProperty,
  testPrivateProperty,
} from "../../../utilities/utilities";
import MockDate from "mockdate";

describe("Sampler", () => {
  describe("constructor", () => {
    let exec = () => {
      return new Sampler();
    };

    it("should create new Sampler and init its properties", () => {
      let result = exec();

      expect(result).toBeDefined();
      expect(result.Active).toEqual(false);
      expect(result.InternalTickInterval).toEqual(100);
      expect(result.LastExternalTickNumber).toEqual(0);
      expect(result.ExternalTickHandler).toEqual(null);
      testPrivateProperty(result, "_internalTickHandler", null);
    });
  });

  describe("doesSampleTimeMatchesTick", () => {
    let tickId: number;
    let tickNumber: number;

    beforeEach(() => {
      tickId = 15;
      tickNumber = 150;
    });

    let exec = () => {
      return Sampler.doesSampleTimeMatchesTick(tickNumber, tickId);
    };

    it("should return true if tickNumber matches tickId", () => {
      let result = exec();

      expect(result).toBeTruthy();
    });

    it("should return true if tickNumber doest not match tickId", () => {
      tickNumber = 151;

      let result = exec();

      expect(result).toBeFalsy();
    });

    it("should always return false if tickId is zero", () => {
      tickId = 0;

      let result = exec();

      expect(result).toBeFalsy();
    });
  });

  describe("convertDateToTickNumber", () => {
    let date: number;

    beforeEach(() => {
      date = 1234;
    });

    let exec = () => {
      return Sampler.convertDateToTickNumber(date);
    };

    it("should convert date to tickId - divide it by 1000 and round", () => {
      let result = exec();

      expect(result).toEqual(1);
    });

    it("should round to nearest value if value is lesser", () => {
      date = 2999;
      let result = exec();

      expect(result).toEqual(3);
    });

    it("should round to nearest value if value is greater", () => {
      date = 3001;
      let result = exec();

      expect(result).toEqual(3);
    });

    it("should round to nearest value if value is lesser", () => {
      date = 2999;
      let result = exec();

      expect(result).toEqual(3);
    });

    it("should round to nearest value if value is greater", () => {
      date = 3001;
      let result = exec();

      expect(result).toEqual(3);
    });
  });

  describe("convertTickNumberToDate", () => {
    let tickNumber: number;

    beforeEach(() => {
      tickNumber = 1234;
    });

    let exec = () => {
      return Sampler.convertTickNumberToDate(tickNumber);
    };

    it("should convert tickNumber to date - multiply it by 1000 ", () => {
      let result = exec();

      expect(result).toEqual(1234 * 1000);
    });
  });

  describe("_shouldExternalTickBeEmitted", () => {
    let sampler: Sampler;
    let lastTickTimeNumber: number;
    let timeNumber: number;

    beforeEach(() => {
      sampler = new Sampler();
      lastTickTimeNumber = 100;
      timeNumber = 100;
    });

    let exec = () => {
      setPrivateProperty(
        sampler,
        "_lastExternalTickNumber",
        lastTickTimeNumber
      );
      return (sampler as any)._shouldExternalTickBeEmitted(timeNumber);
    };

    it("should return false if _lastExternalTickNumber is equal actual tickTimeNumber", () => {
      let result = exec();

      expect(result).toBeFalsy();
    });

    it("should return true if _lastExternalTickNumber is different than actual tickTimeNumber", () => {
      timeNumber = 150;
      let result = exec();

      expect(result).toBeTruthy();
    });
  });

  describe("_onInternalTick", () => {
    let sampler: Sampler;
    let externalTickHandler: jest.Mock | null;
    let externalTickHandlerInnerMock: jest.Mock;
    let shouldEmitMockFunc: jest.Mock;
    let shouldEmit: boolean;
    let active: boolean;

    beforeEach(() => {
      active = true;
      //additional method in order to check whether externalTickHandler was awaited
      externalTickHandlerInnerMock = jest.fn();
      externalTickHandler = jest.fn(async (tickNumber) => {
        await snooze(100);
        externalTickHandlerInnerMock(tickNumber);
      });
      sampler = new Sampler();
      shouldEmit = true;
    });

    let exec = () => {
      setPrivateProperty(sampler, "_active", active);
      sampler.ExternalTickHandler = externalTickHandler;
      shouldEmitMockFunc = jest.fn(() => {
        return shouldEmit;
      });
      setPrivateProperty(
        sampler,
        "_shouldExternalTickBeEmitted",
        shouldEmitMockFunc
      );
      return (sampler as any)._onInternalTick();
    };

    it("Should invoke externalTickHandler and await for externalTickHandlerInnerMock with argument of new timeNumber", async () => {
      let firstDate = Sampler.convertDateToTickNumber(Date.now());

      await exec();

      let lastDate = Sampler.convertDateToTickNumber(Date.now());

      expect(externalTickHandler).toHaveBeenCalledTimes(1);
      expect(externalTickHandler!.mock.calls[0][0]).toBeGreaterThanOrEqual(
        firstDate
      );
      expect(externalTickHandler!.mock.calls[0][0]).toBeLessThanOrEqual(
        lastDate
      );

      expect(externalTickHandlerInnerMock).toHaveBeenCalledTimes(1);
      expect(
        externalTickHandlerInnerMock.mock.calls[0][0]
      ).toBeGreaterThanOrEqual(firstDate);
      expect(externalTickHandlerInnerMock.mock.calls[0][0]).toBeLessThanOrEqual(
        lastDate
      );
    });

    it("Should set lastExternalTickId to new timeNumber", async () => {
      externalTickHandler = jest.fn(async () => {
        throw new Error("test error");
      });

      let beginDate = Sampler.convertDateToTickNumber(Date.now());
      await exec();
      let endDate = Sampler.convertDateToTickNumber(Date.now());

      expect(sampler.LastExternalTickNumber >= beginDate).toEqual(true);
      expect(sampler.LastExternalTickNumber <= endDate).toEqual(true);
    });

    it("Should set lastExternalTickId to new timeNumber - even if external tick handler throws", async () => {
      let beginDate = Sampler.convertDateToTickNumber(Date.now());
      await exec();
      let endDate = Sampler.convertDateToTickNumber(Date.now());

      expect(sampler.LastExternalTickNumber >= beginDate).toEqual(true);
      expect(sampler.LastExternalTickNumber <= endDate).toEqual(true);
    });

    it("Should not call anything if sampler is not active", async () => {
      active = false;

      await exec();

      expect(externalTickHandler).not.toHaveBeenCalled();

      expect(externalTickHandlerInnerMock).not.toHaveBeenCalled();
    });

    it("Should not call anything if should emit return false", async () => {
      shouldEmit = false;

      await exec();

      expect(externalTickHandler).not.toHaveBeenCalled();

      expect(externalTickHandlerInnerMock).not.toHaveBeenCalled();
    });

    it("Should not call anything and not throw if there is no TickHandler", async () => {
      externalTickHandler = null;

      await exec();
    });

    it("Should not throw if external tick handler throws", async () => {
      externalTickHandler = jest.fn(async () => {
        throw new Error("test error");
      });

      await expect(
        new Promise(async (resolve, reject) => {
          try {
            await exec();
            return resolve(true);
          } catch (err) {
            return reject(err);
          }
        })
      ).resolves.toBeDefined();
    });
  });

  describe("start", () => {
    let sampler: Sampler;
    let onInternalTickMock: jest.Mock;
    let active: boolean;

    beforeEach(() => {
      jest.useFakeTimers();

      active = false;
      onInternalTickMock = jest.fn();

      sampler = new Sampler();
    });

    let exec = () => {
      setPrivateProperty(sampler, "_onInternalTick", onInternalTickMock);
      setPrivateProperty(sampler, "_active", active);
      return sampler.start();
    };

    it("Should start handler invoking tick every 100 ms", () => {
      exec();
      jest.advanceTimersByTime(1000);

      expect(onInternalTickMock).toHaveBeenCalledTimes(10);
      expect((sampler as any)._internalTickHandler).toBeDefined();
    });

    it("Should set active to true", () => {
      exec();
      expect(sampler.Active).toEqual(true);
    });

    it("Should not start handler invoking tick every 100 ms if sampler already active", () => {
      active = true;
      exec();
      jest.advanceTimersByTime(1000);

      expect(onInternalTickMock).not.toHaveBeenCalled();
    });
  });

  describe("stop", () => {
    let sampler: Sampler;
    let onInternalTickMock: jest.Mock;
    let active: boolean;
    let setInternalTickHandlerToNull: boolean;

    beforeEach(() => {
      sampler = new Sampler();
      onInternalTickMock = jest.fn();
      setPrivateProperty(sampler, "_onInternalTick", onInternalTickMock);
      active = true;
      setInternalTickHandlerToNull = false;
    });

    let exec = () => {
      jest.useFakeTimers();

      sampler.start();
      setPrivateProperty(sampler, "_active", active);

      if (setInternalTickHandlerToNull)
        setPrivateProperty(sampler, "_internalTickHandler", null);

      return sampler.stop();
    };

    it("Should stop sampler intervalHandler and stop invoking onInternalTick", () => {
      exec();

      testPrivateProperty(sampler, "_internalTickHandler", null);

      jest.advanceTimersByTime(1000);

      expect(onInternalTickMock).not.toHaveBeenCalled();
    });

    it("Should set active to false", () => {
      exec();
      expect(sampler.Active).toEqual(false);
    });

    it("Should set active to false - even if _internalTickHandler is null", () => {
      setInternalTickHandlerToNull = true;

      exec();

      expect(sampler.Active).toEqual(false);
    });

    it("Should not stop handler invoking tick every 100 ms if sampler not active", () => {
      active = false;
      exec();
      jest.advanceTimersByTime(1000);

      expect(onInternalTickMock).toHaveBeenCalledTimes(10);
    });
  });

  describe("LastExternalTickNumber", () => {
    let sampler: Sampler;

    let exec = () => {
      sampler = new Sampler();
      return sampler.LastExternalTickNumber;
    };

    it("should return LastExternalTickNumber", () => {
      let result = exec();

      testPrivateProperty(sampler, "_lastExternalTickNumber", result);
    });
  });

  describe("InternalTickInterval", () => {
    let sampler: Sampler;

    let exec = () => {
      sampler = new Sampler();
      return sampler.InternalTickInterval;
    };

    it("should return InternalTickInterval", () => {
      let result = exec();
      testPrivateProperty(sampler, "_internalTickInterval", result);
    });
  });

  describe("Active", () => {
    let sampler: Sampler;

    let exec = () => {
      sampler = new Sampler();
      return sampler.Active;
    };

    it("should return Active", () => {
      let result = exec();
      testPrivateProperty(sampler, "_active", result);
    });
  });

  describe("getCurrentTickNumber", () => {
    let actualDate: number;

    beforeEach(() => {
      actualDate = 123456789;
    });

    let exec = () => {
      MockDate.set(actualDate);
      return Sampler.getCurrentTickNumber();
    };

    it("should return valid tick id based on current date", () => {
      let result = exec();
      //123456789 -> 123456.789 -> 123457
      expect(result).toEqual(123457);
    });
  });
});

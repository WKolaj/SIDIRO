import {
  MindSphereTimeSeriesData,
  MindSphereTimeSeriesService,
  TimeSeriesData,
} from "../../classes/MindSphereService/MindSphereTimeSeriesService";
import { cloneObject } from "../../utilities/utilities";

export type MockedTimeSeriesServiceContent = {
  [tenantName: string]: {
    [assetId: string]: {
      [aspectName: string]: TimeSeriesData;
    };
  };
};

let mindSphereContent: MockedTimeSeriesServiceContent = {};
let serviceAvailable: boolean = true;

export function setTimeSeriesServiceAvailable(available: boolean) {
  serviceAvailable = available;
}

export function mockMsTimeSeriesService(
  timeSeriesServiceContent: MockedTimeSeriesServiceContent
) {
  mindSphereContent = cloneObject(timeSeriesServiceContent);
  const timeSeriesService = MindSphereTimeSeriesService.getInstance();
  timeSeriesService.getLastValues = getLastValues;
  timeSeriesService.getValues = getValues;
  timeSeriesService.setValues = setValues;
  timeSeriesService.deleteValues = deleteValues;
}

export const getLastValues = jest.fn(
  async (
    tenantName: string,
    assetId: string,
    aspectName: string
  ): Promise<TimeSeriesData> => {
    if (!serviceAvailable) throw new Error("Service not available!");
    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");
    if (mindSphereContent[tenantName][assetId] == null)
      throw new Error("Asset id not found in given tenant");
    if (mindSphereContent[tenantName][assetId][aspectName] == null)
      throw new Error("Aspect not found");

    let variables = cloneObject(
      mindSphereContent[tenantName][assetId][aspectName]
    );

    let dataToReturn: TimeSeriesData = {};

    for (let variable of Object.keys(variables)) {
      let values = variables[variable];
      let tickIds = Object.keys(values)
        .map((value) => parseInt(value))
        .sort();

      if (tickIds.length > 0) {
        let lastTick = tickIds[tickIds.length - 1];
        let lastValue = values[lastTick];
        dataToReturn[variable] = {
          [lastTick]: lastValue,
        };
      }
    }

    return dataToReturn;
  }
);

export const getValues = jest.fn(
  async (
    tenantName: string,
    assetId: string,
    aspectName: string,
    fromTime: number,
    toTime: number
  ): Promise<TimeSeriesData> => {
    if (!serviceAvailable) throw new Error("Service not available!");
    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");
    if (mindSphereContent[tenantName][assetId] == null)
      throw new Error("Asset id not found in given tenant");
    if (mindSphereContent[tenantName][assetId][aspectName] == null)
      throw new Error("Aspect not found");

    let variables = cloneObject(
      mindSphereContent[tenantName][assetId][aspectName]
    );

    let dataToReturn: TimeSeriesData = {};

    for (let variable of Object.keys(variables)) {
      dataToReturn[variable] = {};
      let values = variables[variable];
      let tickIds = Object.keys(values).map((value) => parseInt(value));

      for (let tickId of tickIds) {
        //From is exclusive and to is inclusive
        if (tickId > fromTime && tickId <= toTime) {
          dataToReturn[variable][tickId] = values[tickId];
        }
      }
    }

    return dataToReturn;
  }
);

export const setValues = jest.fn(
  async (
    tenantName: string,
    assetId: string,
    aspectName: string,
    dataToSet: TimeSeriesData
  ): Promise<void> => {
    if (!serviceAvailable) throw new Error("Service not available!");
    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");
    if (mindSphereContent[tenantName][assetId] == null)
      throw new Error("Asset id not found in given tenant");
    if (mindSphereContent[tenantName][assetId][aspectName] == null)
      throw new Error("Aspect not found");

    let variablesToSet = Object.keys(dataToSet);

    for (let variableName of variablesToSet) {
      if (
        mindSphereContent[tenantName][assetId][aspectName][variableName] == null
      )
        throw new Error("Variable name not found in asset");
    }

    for (let variableName of variablesToSet) {
      let variableData = dataToSet[variableName];
      mindSphereContent[tenantName][assetId][aspectName][variableName] = {
        ...mindSphereContent[tenantName][assetId][aspectName][variableName],
        ...variableData,
      };
    }
  }
);

export const deleteValues = jest.fn(
  async (
    tenantName: string,
    assetId: string,
    aspectName: string,
    fromTime: number,
    toTime: number
  ): Promise<void> => {
    if (!serviceAvailable) throw new Error("Service not available!");
    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");
    if (mindSphereContent[tenantName][assetId] == null)
      throw new Error("Asset id not found in given tenant");
    if (mindSphereContent[tenantName][assetId][aspectName] == null)
      throw new Error("Aspect not found");

    let variables = mindSphereContent[tenantName][assetId][aspectName];

    for (let variable of Object.keys(variables)) {
      let values = variables[variable];
      let tickIds = Object.keys(values).map((value) => parseInt(value));

      for (let tickId of tickIds) {
        //From is exclusive and to is inclusive
        if (tickId > fromTime && tickId <= toTime) {
          delete variables[variable][tickId];
        }
      }
    }
  }
);

import {
  MindSphereAsset,
  MindSphereAssetService,
} from "../../classes/MindSphereService/MindSphereAssetService";
import { cloneObject, generateRandomString } from "../../utilities/utilities";

export type MockedAssetServiceContent = {
  [tenantName: string]: {
    [assetId: string]: MindSphereAsset;
  };
};

let mindSphereContent: MockedAssetServiceContent = {};
let serviceAvailable: boolean = true;

export function setAssetServiceAvailable(available: boolean) {
  serviceAvailable = available;
}

export function mockMsAssetService(
  assetServiceContent: MockedAssetServiceContent
) {
  mindSphereContent = cloneObject(assetServiceContent);
  const assetService = MindSphereAssetService.getInstance();
  assetService.checkIfAssetExists = checkIfAssetExists;
  assetService.getAssets = getAssets;
  assetService.getAsset = getAsset;
  assetService.createAsset = createAsset;
  assetService.deleteAsset = deleteAsset;
  assetService.updateAsset = updateAsset;
}

export const checkIfAssetExists = jest.fn(
  async (tenantName: string, assetId: string) => {
    if (!serviceAvailable) throw new Error("Service not available!");
    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    if (mindSphereContent[tenantName][assetId] == null) return null;

    return Math.round(Math.random() * 1000);
  }
);

export const getAssets = jest.fn(
  async (
    tenantName: string,
    name: string | null = null,
    parentId: string | null = null,
    assetType: string | null = null
  ) => {
    if (!serviceAvailable) throw new Error("Service not available!");
    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    let allAssets = Object.values(mindSphereContent[tenantName]);

    let filteredAssets = allAssets;

    if (name != null)
      filteredAssets = filteredAssets.filter((asset) => asset.name === name);

    if (parentId != null)
      filteredAssets = filteredAssets.filter(
        (asset) => asset.parentId === parentId
      );

    if (assetType != null)
      filteredAssets = filteredAssets.filter(
        (asset) => asset.typeId === assetType
      );

    return cloneObject(filteredAssets) as MindSphereAsset[];
  }
);

export const getAsset = jest.fn(async (tenantName: string, assetId: string) => {
  if (!serviceAvailable) throw new Error("Service not available!");
  if (mindSphereContent[tenantName] == null)
    throw new Error("Tenant of given name not found");
  if (mindSphereContent[tenantName][assetId] == null)
    throw new Error("Asset of given id not found");

  return cloneObject(mindSphereContent[tenantName][assetId]) as MindSphereAsset;
});

export const createAsset = jest.fn(
  async (tenantName: string, assetPayload: MindSphereAsset) => {
    if (!serviceAvailable) throw new Error("Service not available!");
    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    let payloadToSet = cloneObject(assetPayload) as MindSphereAsset;
    payloadToSet.assetId = generateRandomString(16);

    mindSphereContent[tenantName][payloadToSet.assetId] = payloadToSet;

    return cloneObject(payloadToSet) as MindSphereAsset;
  }
);

export const deleteAsset = jest.fn(
  async (tenantName: string, assetId: string) => {
    if (!serviceAvailable) throw new Error("Service not available!");
    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");
    if (mindSphereContent[tenantName][assetId] == null) return null;

    delete mindSphereContent[tenantName][assetId];

    return Math.round(Math.random() * 1000);
  }
);

export const updateAsset = jest.fn(
  async (
    tenantName: string,
    assetId: string,
    assetPayload: MindSphereAsset
  ) => {
    if (!serviceAvailable) throw new Error("Service not available!");
    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");
    if (mindSphereContent[tenantName][assetId] == null) return null;

    let currentPayload = mindSphereContent[tenantName][assetId];

    if (assetPayload.assetId !== currentPayload.assetId)
      throw new Error("Id cannot be modified!");
    if (assetPayload.typeId !== currentPayload.typeId)
      throw new Error("Type id cannot be modified!");

    mindSphereContent[tenantName][assetId] = cloneObject(assetPayload);

    return cloneObject(assetPayload) as MindSphereAsset;
  }
);

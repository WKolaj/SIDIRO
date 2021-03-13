import { clone } from "lodash";
import {
  MindSphereUserData,
  MindSphereUserService,
} from "../../classes/MindSphereService/MindSphereUserService";
import { cloneObject, generateRandomString } from "../../utilities/utilities";
import { UserStorageData } from "../../classes/MindSphereApp/MindSphereApp";

export type MockedUserServiceContent = {
  [tenantName: string]: {
    [userId: string]: MindSphereUserData;
  };
};

let mindSphereContent: MockedUserServiceContent = {};
let serviceAvailable: boolean = true;

export function setServiceAvailable(available: boolean) {
  serviceAvailable = available;
}

export function mockMsUserService(serviceContent: MockedUserServiceContent) {
  mindSphereContent = cloneObject(serviceContent);
  const msService = MindSphereUserService.getInstance();
  msService.checkIfUserExists = checkIfUserExists;
  msService.getAllUsers = getAllUsers;
  msService.getUser = getUser;
  msService.createUser = createUser;
  msService.updateUser = updateUser;
  msService.deleteUser = deleteUser;
}

export const checkIfUserExists = jest.fn(
  async (
    tenantName: string,
    userId: string | null,
    userName: string | null = null
  ) => {
    if (!serviceAvailable) throw new Error("Service not available!");
    if (userId == null && userName == null)
      throw new Error("Both user user id and user user name cannot be null!");

    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    if (userId != null) {
      let user = mindSphereContent[tenantName][userId];
      if (user == null) return false;
      if (userName != null) return user.userName === userName;
      else return true;
    } else {
      return (
        Object.values(mindSphereContent[tenantName]).find(
          (user) => user.userName === userName
        ) != null
      );
    }
  }
);

export const getAllUsers = jest.fn(
  async (
    tenantName: string,
    subtenantId: string | null,
    userId: string | null,
    userName: string | null = null
  ) => {
    if (!serviceAvailable) throw new Error("Service not available!");

    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    let allUsers = Object.values(mindSphereContent[tenantName]);

    let filteredUsers = allUsers;

    if (subtenantId != null)
      filteredUsers = filteredUsers.filter((user) =>
        user.subtenants?.find((subtenant) => subtenant.id === subtenantId)
      );

    if (userId != null)
      filteredUsers = filteredUsers.filter((user) => user.id === userId);

    if (userName != null)
      filteredUsers = filteredUsers.filter(
        (user) => user.userName === userName
      );

    return filteredUsers;
  }
);

export const getUser = jest.fn(async (tenantName: string, userId: string) => {
  if (!serviceAvailable) throw new Error("Service not available!");

  if (mindSphereContent[tenantName] == null)
    throw new Error("Tenant of given name not found");

  if (mindSphereContent[tenantName][userId] == null)
    throw new Error("User of given id not found");

  return cloneObject(mindSphereContent[tenantName][userId]);
});

export const createUser = jest.fn(
  async (tenantName: string, userData: MindSphereUserData) => {
    if (!serviceAvailable) throw new Error("Service not available!");

    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    let payloadToSet = cloneObject(userData) as MindSphereUserData;
    payloadToSet.id = generateRandomString(16);

    mindSphereContent[tenantName][payloadToSet.id] = payloadToSet;

    return cloneObject(payloadToSet);
  }
);

export const updateUser = jest.fn(
  async (tenantName: string, userId: string, userData: MindSphereUserData) => {
    if (!serviceAvailable) throw new Error("Service not available!");

    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    if (mindSphereContent[tenantName][userId] == null)
      throw new Error("User of given id not found!");

    let payloadToSet = cloneObject(userData) as MindSphereUserData;

    mindSphereContent[tenantName][userId] = payloadToSet;

    return cloneObject(payloadToSet);
  }
);

export const deleteUser = jest.fn(
  async (tenantName: string, userId: string) => {
    if (!serviceAvailable) throw new Error("Service not available!");

    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    if (mindSphereContent[tenantName][userId] == null)
      throw new Error("User of given id not found!");

    delete mindSphereContent[tenantName][userId];
  }
);

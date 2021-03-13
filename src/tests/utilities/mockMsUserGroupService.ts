import { clone } from "lodash";
import {
  MindSphereUserGroupData,
  MindSphereUserGroupService,
} from "../../classes/MindSphereService/MindSphereUserGroupService";
import { cloneObject, generateRandomString } from "../../utilities/utilities";

export type MockedUserGroupServiceContent = {
  [tenantName: string]: {
    [groupId: string]: MindSphereUserGroupData;
  };
};

let mindSphereContent: MockedUserGroupServiceContent = {};
let serviceAvailable: boolean = true;

export function setServiceAvailable(available: boolean) {
  serviceAvailable = available;
}

export function mockMsUserGroupService(
  serviceContent: MockedUserGroupServiceContent
) {
  mindSphereContent = cloneObject(serviceContent);
  const msService = MindSphereUserGroupService.getInstance();
  msService.checkIfUserGroupExists = checkIfUserGroupExists;
  msService.getAllUserGroups = getAllUserGroups;
  msService.getUserGroup = getUserGroup;
  msService.createUserGroup = createUserGroup;
  msService.deleteUserGroup = deleteUserGroup;
  msService.updateUserGroup = updateUserGroup;
  msService.checkIfUserIsAssignedToGroup = checkIfUserIsAssignedToGroup;
  msService.getGroupMembers = getGroupMembers;
  msService.addUserToGroup = addUserToGroup;
  msService.removeUserFromGroup = removeUserFromGroup;
}

export const checkIfUserGroupExists = jest.fn(
  async (
    tenantName: string,
    userGroupId: string | null,
    userGroupName: string | null = null
  ) => {
    if (!serviceAvailable) throw new Error("Service not available!");
    if (userGroupId == null && userGroupName == null)
      throw new Error("Both user group id and user group name cannot be null!");

    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    if (userGroupId != null) {
      let userGroup = mindSphereContent[tenantName][userGroupId];
      if (userGroup == null) return false;
      if (userGroupName != null) return userGroup.displayName === userGroupName;
      else return true;
    } else {
      return (
        Object.values(mindSphereContent[tenantName]).find(
          (group) => group.displayName === userGroupName
        ) != null
      );
    }
  }
);

export const getAllUserGroups = jest.fn(
  async (
    tenantName: string,
    userGroupId: string | null,
    userGroupName: string | null = null
  ) => {
    if (!serviceAvailable) throw new Error("Service not available!");
    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    let allGroups = Object.values(mindSphereContent[tenantName]);

    let filteredGroups = allGroups;

    if (userGroupId != null)
      filteredGroups = filteredGroups.filter(
        (group) => group.id === userGroupId
      );

    if (userGroupName != null)
      filteredGroups = filteredGroups.filter(
        (group) => group.displayName === userGroupName
      );

    return cloneObject(filteredGroups);
  }
);

export const getUserGroup = jest.fn(
  async (tenantName: string, groupId: string) => {
    if (!serviceAvailable) throw new Error("Service not available!");
    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    let group = mindSphereContent[tenantName][groupId];

    if (group == null) throw new Error("Group not found");

    return clone(group);
  }
);

export const createUserGroup = jest.fn(
  async (tenantName: string, groupPayload: MindSphereUserGroupData) => {
    if (!serviceAvailable) throw new Error("Service not available!");
    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    if (
      Object.values(mindSphereContent[tenantName]).find(
        (group) => group.displayName === groupPayload.displayName
      )
    )
      throw new Error("User group of given display name already exists!");

    let payloadToSet = cloneObject(groupPayload) as MindSphereUserGroupData;
    payloadToSet.id = generateRandomString(16);

    mindSphereContent[tenantName][payloadToSet.id] = payloadToSet;

    return payloadToSet;
  }
);

export const deleteUserGroup = jest.fn(
  async (tenantName: string, groupId: string) => {
    if (!serviceAvailable) throw new Error("Service not available!");
    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    let group = mindSphereContent[tenantName][groupId];

    if (group == null) throw new Error("Group not found");

    delete mindSphereContent[tenantName][groupId];
  }
);

export const updateUserGroup = jest.fn(
  async (
    tenantName: string,
    groupId: string,
    groupData: MindSphereUserGroupData
  ) => {
    if (!serviceAvailable) throw new Error("Service not available!");
    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    let group = mindSphereContent[tenantName][groupId];
    if (group == null) throw new Error("Group not found");

    let payloadToSet = cloneObject(groupData);
    mindSphereContent[tenantName][groupId] = payloadToSet;

    return payloadToSet;
  }
);

export const checkIfUserIsAssignedToGroup = jest.fn(
  async (tenantName: string, groupId: string, userId: string) => {
    if (!serviceAvailable) throw new Error("Service not available!");
    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    let group = mindSphereContent[tenantName][groupId];
    if (group == null) throw new Error("Group not found");

    return (
      mindSphereContent[tenantName][groupId].members.find(
        (membership) => membership.value === userId
      ) != null
    );
  }
);

export const getGroupMembers = jest.fn(
  async (tenantName: string, groupId: string) => {
    if (!serviceAvailable) throw new Error("Service not available!");
    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    let group = mindSphereContent[tenantName][groupId];
    if (group == null) throw new Error("Group not found");

    return cloneObject(mindSphereContent[tenantName][groupId].members);
  }
);

export const addUserToGroup = jest.fn(
  async (tenantName: string, groupId: string, userId: string) => {
    if (!serviceAvailable) throw new Error("Service not available!");
    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    let group = mindSphereContent[tenantName][groupId];
    if (group == null) throw new Error("Group not found");

    if (
      mindSphereContent[tenantName][groupId].members.find(
        (membership) => membership.value === userId
      ) != null
    )
      throw new Error("user is already assigned to group!");

    mindSphereContent[tenantName][groupId].members.push({
      type: "USER",
      value: userId,
    });
  }
);

export const removeUserFromGroup = jest.fn(
  async (tenantName: string, groupId: string, userId: string) => {
    if (!serviceAvailable) throw new Error("Service not available!");
    if (mindSphereContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    let group = mindSphereContent[tenantName][groupId];
    if (group == null) throw new Error("Group not found");

    if (
      mindSphereContent[tenantName][groupId].members.find(
        (membership) => membership.value === userId
      ) == null
    )
      throw new Error("user is not assigned to group!");

    mindSphereContent[tenantName][groupId].members = mindSphereContent[
      tenantName
    ][groupId].members.filter((membership) => membership.value !== userId);
  }
);

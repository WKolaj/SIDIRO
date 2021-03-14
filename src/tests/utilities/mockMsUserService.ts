import {
  MindSphereUserData,
  MindSphereUserService,
} from "../../classes/MindSphereService/MindSphereUserService";
import { cloneObject, generateRandomString } from "../../utilities/utilities";
import {
  MindSphereUserGroupData,
  MindSphereUserGroupService,
} from "../../classes/MindSphereService/MindSphereUserGroupService";

export type MockedUserServiceContent = {
  [tenantName: string]: {
    [userId: string]: MindSphereUserData;
  };
};

let mindSphereUserContent: MockedUserServiceContent = {};
let userServiceAvailable: boolean = true;

export function setUserServiceAvailable(available: boolean) {
  userServiceAvailable = available;
}

export function mockMsUserService(serviceContent: MockedUserServiceContent) {
  mindSphereUserContent = cloneObject(serviceContent);
  const msService = MindSphereUserService.getInstance();
  msService.checkIfUserExists = checkIfUserExists;
  msService.getAllUsers = getAllUsers;
  msService.getUser = getUser;
  msService.createUser = createUser;
  msService.updateUser = updateUser;
  msService.deleteUser = deleteUser;
}

const setUserGroups = function(
  tenantName: string,
  user: MindSphereUserData
): void {
  user.groups = [];

  if (mindSphereUserGroupContent[tenantName] == null) return;

  for (let group of Object.values(mindSphereUserGroupContent[tenantName])) {
    if (
      group.members.find((membership) => membership.value === user.id!) != null
    )
      user.groups.push({
        display: group.displayName,
        type: "DIRECT",
        value: group.id,
      });
  }
};

export const checkIfUserExists = jest.fn(
  async (
    tenantName: string,
    userId: string | null,
    userName: string | null = null
  ) => {
    if (!userServiceAvailable) throw new Error("Service not available!");
    if (userId == null && userName == null)
      throw new Error("Both user user id and user user name cannot be null!");

    if (mindSphereUserContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    if (userId != null) {
      let user = mindSphereUserContent[tenantName][userId];
      if (user == null) return false;
      if (userName != null) return user.userName === userName;
      else return true;
    } else {
      return (
        Object.values(mindSphereUserContent[tenantName]).find(
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
    if (!userServiceAvailable) throw new Error("Service not available!");

    if (mindSphereUserContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    let allUsers = cloneObject(
      Object.values(mindSphereUserContent[tenantName])
    ) as MindSphereUserData[];

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

    //Setting users groups
    filteredUsers.map((user) => setUserGroups(tenantName, user));

    return filteredUsers;
  }
);

export const getUser = jest.fn(async (tenantName: string, userId: string) => {
  if (!userServiceAvailable) throw new Error("Service not available!");

  if (mindSphereUserContent[tenantName] == null)
    throw new Error("Tenant of given name not found");

  if (mindSphereUserContent[tenantName][userId] == null)
    throw new Error("User of given id not found");

  let userObject = cloneObject(mindSphereUserContent[tenantName][userId]);
  //Setting users groups
  setUserGroups(tenantName, userObject);

  return userObject;
});

export const createUser = jest.fn(
  async (tenantName: string, userData: MindSphereUserData) => {
    if (!userServiceAvailable) throw new Error("Service not available!");

    if (mindSphereUserContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    let payloadToSet = cloneObject(userData) as MindSphereUserData;
    payloadToSet.id = generateRandomString(16);
    //Groups cannot be set while creating new user
    payloadToSet.groups = [];

    mindSphereUserContent[tenantName][payloadToSet.id] = payloadToSet;

    payloadToSet.groups = [];

    return cloneObject(payloadToSet);
  }
);

export const updateUser = jest.fn(
  async (tenantName: string, userId: string, userData: MindSphereUserData) => {
    if (!userServiceAvailable) throw new Error("Service not available!");

    if (mindSphereUserContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    if (mindSphereUserContent[tenantName][userId] == null)
      throw new Error("User of given id not found!");

    let payloadToSet = cloneObject(userData) as MindSphereUserData;

    if (payloadToSet.id !== userId) throw new Error("Id cannot be changed!");

    //Users cannot be set in users payload - they are retrieved dynamically
    payloadToSet.groups = [];

    mindSphereUserContent[tenantName][userId] = cloneObject(payloadToSet);

    setUserGroups(tenantName, payloadToSet);

    return cloneObject(payloadToSet);
  }
);

export const deleteUser = jest.fn(
  async (tenantName: string, userId: string) => {
    if (!userServiceAvailable) throw new Error("Service not available!");

    if (mindSphereUserContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    if (mindSphereUserContent[tenantName][userId] == null)
      throw new Error("User of given id not found!");

    //Deleting user from groups associated with him
    Object.values(mindSphereUserGroupContent[tenantName]).map(
      (group) =>
        (group.members = group.members.filter(
          (membeship) => membeship.value !== userId
        ))
    );

    delete mindSphereUserContent[tenantName][userId];
  }
);

export type MockedUserGroupServiceContent = {
  [tenantName: string]: {
    [groupId: string]: MindSphereUserGroupData;
  };
};

let mindSphereUserGroupContent: MockedUserGroupServiceContent = {};
let useGroupServiceAvailable: boolean = true;

export function setUserGroupServiceAvailable(available: boolean) {
  useGroupServiceAvailable = available;
}

export function mockMsUserGroupService(
  serviceContent: MockedUserGroupServiceContent
) {
  mindSphereUserGroupContent = cloneObject(serviceContent);
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
    if (!useGroupServiceAvailable) throw new Error("Service not available!");
    if (userGroupId == null && userGroupName == null)
      throw new Error("Both user group id and user group name cannot be null!");

    if (mindSphereUserGroupContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    if (userGroupId != null) {
      let userGroup = mindSphereUserGroupContent[tenantName][userGroupId];
      if (userGroup == null) return false;
      if (userGroupName != null) return userGroup.displayName === userGroupName;
      else return true;
    } else {
      return (
        Object.values(mindSphereUserGroupContent[tenantName]).find(
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
    if (!useGroupServiceAvailable) throw new Error("Service not available!");
    if (mindSphereUserGroupContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    let allGroups = Object.values(mindSphereUserGroupContent[tenantName]);

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
    if (!useGroupServiceAvailable) throw new Error("Service not available!");
    if (mindSphereUserGroupContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    let group = mindSphereUserGroupContent[tenantName][groupId];

    if (group == null) throw new Error("Group not found");

    return cloneObject(group);
  }
);

export const createUserGroup = jest.fn(
  async (tenantName: string, groupPayload: MindSphereUserGroupData) => {
    if (!useGroupServiceAvailable) throw new Error("Service not available!");
    if (mindSphereUserGroupContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    if (
      Object.values(mindSphereUserGroupContent[tenantName]).find(
        (group) => group.displayName === groupPayload.displayName
      )
    )
      throw new Error("User group of given display name already exists!");

    let payloadToSet = cloneObject(groupPayload) as MindSphereUserGroupData;
    payloadToSet.id = generateRandomString(16);

    mindSphereUserGroupContent[tenantName][payloadToSet.id] = payloadToSet;

    return payloadToSet;
  }
);

export const deleteUserGroup = jest.fn(
  async (tenantName: string, groupId: string) => {
    if (!useGroupServiceAvailable) throw new Error("Service not available!");
    if (mindSphereUserGroupContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    let group = mindSphereUserGroupContent[tenantName][groupId];

    if (group == null) throw new Error("Group not found");

    delete mindSphereUserGroupContent[tenantName][groupId];
  }
);

export const updateUserGroup = jest.fn(
  async (
    tenantName: string,
    groupId: string,
    groupData: MindSphereUserGroupData
  ) => {
    if (!useGroupServiceAvailable) throw new Error("Service not available!");
    if (mindSphereUserGroupContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    let group = mindSphereUserGroupContent[tenantName][groupId];
    if (group == null) throw new Error("Group not found");

    if (group.id !== groupId) throw new Error("Id cannot be changed!");

    let payloadToSet = cloneObject(groupData);
    mindSphereUserGroupContent[tenantName][groupId] = payloadToSet;

    return payloadToSet;
  }
);

export const checkIfUserIsAssignedToGroup = jest.fn(
  async (tenantName: string, groupId: string, userId: string) => {
    if (!useGroupServiceAvailable) throw new Error("Service not available!");
    if (mindSphereUserGroupContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    let group = mindSphereUserGroupContent[tenantName][groupId];
    if (group == null) throw new Error("Group not found");

    return (
      mindSphereUserGroupContent[tenantName][groupId].members.find(
        (membership) => membership.value === userId
      ) != null
    );
  }
);

export const getGroupMembers = jest.fn(
  async (tenantName: string, groupId: string) => {
    if (!useGroupServiceAvailable) throw new Error("Service not available!");
    if (mindSphereUserGroupContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    let group = mindSphereUserGroupContent[tenantName][groupId];
    if (group == null) throw new Error("Group not found");

    return cloneObject(mindSphereUserGroupContent[tenantName][groupId].members);
  }
);

export const addUserToGroup = jest.fn(
  async (tenantName: string, groupId: string, userId: string) => {
    if (!useGroupServiceAvailable) throw new Error("Service not available!");
    if (mindSphereUserGroupContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    let group = mindSphereUserGroupContent[tenantName][groupId];
    if (group == null) throw new Error("Group not found");

    if (
      mindSphereUserGroupContent[tenantName][groupId].members.find(
        (membership) => membership.value === userId
      ) != null
    )
      throw new Error("user is already assigned to group!");

    mindSphereUserGroupContent[tenantName][groupId].members.push({
      type: "USER",
      value: userId,
    });
  }
);

export const removeUserFromGroup = jest.fn(
  async (tenantName: string, groupId: string, userId: string) => {
    if (!useGroupServiceAvailable) throw new Error("Service not available!");
    if (mindSphereUserGroupContent[tenantName] == null)
      throw new Error("Tenant of given name not found");

    let group = mindSphereUserGroupContent[tenantName][groupId];
    if (group == null) throw new Error("Group not found");

    if (
      mindSphereUserGroupContent[tenantName][groupId].members.find(
        (membership) => membership.value === userId
      ) == null
    )
      throw new Error("user is not assigned to group!");

    mindSphereUserGroupContent[tenantName][
      groupId
    ].members = mindSphereUserGroupContent[tenantName][groupId].members.filter(
      (membership) => membership.value !== userId
    );
  }
);

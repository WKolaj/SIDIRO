import request from "supertest";
import {
  PlantPermissions,
  UserRole,
  UserStorageData,
} from "../../../../../classes/MindSphereApp/MindSphereApp";
import { MindSphereFileService } from "../../../../../classes/MindSphereService/MindSphereFileService";
import {
  MindSphereUserData,
  MindSphereUserService,
} from "../../../../../classes/MindSphereService/MindSphereUserService";
import {
  MockedAssetServiceContent,
  checkIfAssetExists,
  createAsset,
  deleteAsset,
  getAsset,
  getAssets,
  updateAsset,
  mockMsAssetService,
  setAssetServiceAvailable,
} from "../../../../utilities/mockMsAssetService";
import {
  MockedFileServiceContent,
  mockMsFileService,
  checkIfFileExists,
  countTotalNumberOfFiles,
  deleteFile,
  getAllFileNamesFromAsset,
  getFileContent,
  setFileContent,
  setFileServiceAvailable,
  setFileServiceContent,
} from "../../../../utilities/mockMsFileService";
import {
  MockedUserGroupServiceContent,
  MockedUserServiceContent,
  mockMsUserGroupService,
  mockMsUserService,
  checkIfUserExists,
  addUserToGroup,
  checkIfUserGroupExists,
  checkIfUserIsAssignedToGroup,
  createUser,
  createUserGroup,
  deleteUser,
  deleteUserGroup,
  getAllUserGroups,
  getAllUsers,
  getGroupMembers,
  getUser,
  getUserGroup,
  removeUserFromGroup,
  setUserGroupServiceAvailable,
  setUserServiceAvailable,
  updateUser,
  updateUserGroup,
} from "../../../../utilities/mockMsUserService";
import { MindSphereUserGroupService } from "../../../../../classes/MindSphereService/MindSphereUserGroupService";
import { MindSphereAssetService } from "../../../../../classes/MindSphereService/MindSphereAssetService";
import { MindSphereAppsManager } from "../../../../../classes/MindSphereApp/MindSphereAppsManager";
import appStart from "../../../../../startup/app";
import { Server } from "http";
import jwt from "jsonwebtoken";
import { MindSphereUserJWTData } from "../../../../../middleware/tokenData/fetchTokenData";
import logger from "../../../../../logger/logger";
import { cloneObject } from "../../../../../utilities/utilities";
import { config } from "node-config-ts";
import {
  clearMindSphereTokenManagerInstanceMock,
  mockMindSphereTokenManager,
} from "../../../../utilities/mockMindSphereTokenManager";

describe("config user route", () => {
  let userServiceContent: MockedUserServiceContent;
  let userGroupServiceContent: MockedUserGroupServiceContent;
  let fileServiceContent: MockedFileServiceContent;
  let assetServiceContent: MockedAssetServiceContent;
  let logErrorMockFunc: jest.Mock;
  let server: Server;

  beforeEach(async () => {
    //Clear MindSphere token manager
    clearMindSphereTokenManagerInstanceMock();

    //Clearing MindSphereServices
    (MindSphereUserService as any)._instance = null;
    (MindSphereUserGroupService as any)._instance = null;
    (MindSphereFileService as any)._instance = null;
    (MindSphereAssetService as any)._instance = null;

    //Clearing app manager
    (MindSphereAppsManager as any)._instance = null;

    userServiceContent = {
      testTenant1: {
        testGlobalAdmin11: {
          active: true,
          name: {
            familyName: "testGlobalAdmin11FamilyName",
            givenName: "testGlobalAdmin11GivenName",
          },
          userName: "test_global_admin_11@user.name",
          emails: [
            {
              value: "testGlobalAdmin11Email",
            },
          ],
          groups: [],
          externalId: "testGlobalAdmin11ExternalId",
          id: "testGlobalAdmin11",
        },
        testLocalAdmin11: {
          active: true,
          name: {
            familyName: "testLocalAdmin11FamilyName",
            givenName: "testLocalAdmin11GivenName",
          },
          userName: "test_local_admin_11@user.name",
          emails: [
            {
              value: "testLocalAdmin11Email",
            },
          ],
          groups: [],
          externalId: "testLocalAdmin11ExternalId",
          id: "testLocalAdmin11",
        },
        testGlobalUser11: {
          active: true,
          name: {
            familyName: "testGlobalUser11FamilyName",
            givenName: "testGlobalUser11GivenName",
          },
          userName: "test_global_user_11@user.name",
          emails: [
            {
              value: "testGlobalUser11Email",
            },
          ],
          groups: [],
          externalId: "testGlobalUser11ExternalId",
          id: "testGlobalUser11",
        },
        testLocalUser11: {
          active: true,
          name: {
            familyName: "testLocalUser11FamilyName",
            givenName: "testLocalUser11GivenName",
          },
          userName: "test_local_user_11@user.name",
          emails: [
            {
              value: "testLocalUser11Email",
            },
          ],
          groups: [],
          externalId: "testLocalUser11ExternalId",
          id: "testLocalUser11",
        },
        testGlobalAdmin12: {
          active: true,
          name: {
            familyName: "testGlobalAdmin12FamilyName",
            givenName: "testGlobalAdmin12GivenName",
          },
          userName: "test_global_admin_12@user.name",
          emails: [
            {
              value: "testGlobalAdmin12Email",
            },
          ],
          groups: [],
          externalId: "testGlobalAdmin12ExternalId",
          id: "testGlobalAdmin12",
          subtenants: [
            {
              id: "subtenant1",
            },
          ],
        },
        testLocalAdmin12: {
          active: true,
          name: {
            familyName: "testLocalAdmin12FamilyName",
            givenName: "testLocalAdmin12GivenName",
          },
          userName: "test_local_admin_12@user.name",
          emails: [
            {
              value: "testLocalAdmin12Email",
            },
          ],
          groups: [],
          externalId: "testLocalAdmin12ExternalId",
          id: "testLocalAdmin12",
          subtenants: [
            {
              id: "subtenant1",
            },
          ],
        },
        testGlobalUser12: {
          active: true,
          name: {
            familyName: "testGlobalUser12FamilyName",
            givenName: "testGlobalUser12GivenName",
          },
          userName: "test_global_user_12@user.name",
          emails: [
            {
              value: "testGlobalUser12Email",
            },
          ],
          groups: [],
          externalId: "testGlobalUser12ExternalId",
          id: "testGlobalUser12",
          subtenants: [
            {
              id: "subtenant1",
            },
          ],
        },
        testLocalUser12: {
          active: true,
          name: {
            familyName: "testLocalUser12FamilyName",
            givenName: "testLocalUser12GivenName",
          },
          userName: "test_local_user_12@user.name",
          emails: [
            {
              value: "testLocalUser12Email",
            },
          ],
          groups: [],
          externalId: "testLocalUser12ExternalId",
          id: "testLocalUser12",
          subtenants: [
            {
              id: "subtenant1",
            },
          ],
        },
      },
      testTenant2: {
        testGlobalAdmin21: {
          active: true,
          name: {
            familyName: "testGlobalAdmin21FamilyName",
            givenName: "testGlobalAdmin21GivenName",
          },
          userName: "test_global_admin_21@user.name",
          emails: [
            {
              value: "testGlobalAdmin21Email",
            },
          ],
          groups: [],
          externalId: "testGlobalAdmin21ExternalId",
          id: "testGlobalAdmin21",
        },
        testLocalAdmin21: {
          active: true,
          name: {
            familyName: "testLocalAdmin21FamilyName",
            givenName: "testLocalAdmin21GivenName",
          },
          userName: "test_local_admin_21@user.name",
          emails: [
            {
              value: "testLocalAdmin21Email",
            },
          ],
          groups: [],
          externalId: "testLocalAdmin21ExternalId",
          id: "testLocalAdmin21",
        },
        testGlobalUser21: {
          active: true,
          name: {
            familyName: "testGlobalUser21FamilyName",
            givenName: "testGlobalUser21GivenName",
          },
          userName: "test_global_user_21@user.name",
          emails: [
            {
              value: "testGlobalUser21Email",
            },
          ],
          groups: [],
          externalId: "testGlobalUser21ExternalId",
          id: "testGlobalUser21",
        },
        testLocalUser21: {
          active: true,
          name: {
            familyName: "testLocalUser21FamilyName",
            givenName: "testLocalUser21GivenName",
          },
          userName: "test_local_user_21@user.name",
          emails: [
            {
              value: "testLocalUser21Email",
            },
          ],
          groups: [],
          externalId: "testLocalUser21ExternalId",
          id: "testLocalUser21",
        },
        testGlobalAdmin22: {
          active: true,
          name: {
            familyName: "testGlobalAdmin22FamilyName",
            givenName: "testGlobalAdmin22GivenName",
          },
          userName: "test_global_admin_22@user.name",
          emails: [
            {
              value: "testGlobalAdmin22Email",
            },
          ],
          groups: [],
          externalId: "testGlobalAdmin22ExternalId",
          id: "testGlobalAdmin22",
          subtenants: [
            {
              id: "subtenant2",
            },
          ],
        },
        testLocalAdmin22: {
          active: true,
          name: {
            familyName: "testLocalAdmin22FamilyName",
            givenName: "testLocalAdmin22GivenName",
          },
          userName: "test_local_admin_22@user.name",
          emails: [
            {
              value: "testLocalAdmin22Email",
            },
          ],
          groups: [],
          externalId: "testLocalAdmin22ExternalId",
          id: "testLocalAdmin22",
          subtenants: [
            {
              id: "subtenant2",
            },
          ],
        },
        testGlobalUser22: {
          active: true,
          name: {
            familyName: "testGlobalUser22FamilyName",
            givenName: "testGlobalUser22GivenName",
          },
          userName: "test_global_user_22@user.name",
          emails: [
            {
              value: "testGlobalUser22Email",
            },
          ],
          groups: [],
          externalId: "testGlobalUser22ExternalId",
          id: "testGlobalUser22",
          subtenants: [
            {
              id: "subtenant2",
            },
          ],
        },
        testLocalUser22: {
          active: true,
          name: {
            familyName: "testLocalUser22FamilyName",
            givenName: "testLocalUser22GivenName",
          },
          userName: "test_local_user_22@user.name",
          emails: [
            {
              value: "testLocalUser22Email",
            },
          ],
          groups: [],
          externalId: "testLocalUser22ExternalId",
          id: "testLocalUser22",
          subtenants: [
            {
              id: "subtenant2",
            },
          ],
        },
      },
      testTenant3: {
        testGlobalAdmin31: {
          active: true,
          name: {
            familyName: "testGlobalAdmin31FamilyName",
            givenName: "testGlobalAdmin31GivenName",
          },
          userName: "test_global_admin_31@user.name",
          emails: [
            {
              value: "testGlobalAdmin31Email",
            },
          ],
          groups: [],
          externalId: "testGlobalAdmin31ExternalId",
          id: "testGlobalAdmin31",
        },
        testLocalAdmin31: {
          active: true,
          name: {
            familyName: "testLocalAdmin31FamilyName",
            givenName: "testLocalAdmin31GivenName",
          },
          userName: "test_local_admin_31@user.name",
          emails: [
            {
              value: "testLocalAdmin31Email",
            },
          ],
          groups: [],
          externalId: "testLocalAdmin31ExternalId",
          id: "testLocalAdmin31",
        },
        testGlobalUser31: {
          active: true,
          name: {
            familyName: "testGlobalUser31FamilyName",
            givenName: "testGlobalUser31GivenName",
          },
          userName: "test_global_user_31@user.name",
          emails: [
            {
              value: "testGlobalUser31Email",
            },
          ],
          groups: [],
          externalId: "testGlobalUser31ExternalId",
          id: "testGlobalUser31",
        },
        testLocalUser31: {
          active: true,
          name: {
            familyName: "testLocalUser31FamilyName",
            givenName: "testLocalUser31GivenName",
          },
          userName: "test_local_user_31@user.name",
          emails: [
            {
              value: "testLocalUser31Email",
            },
          ],
          groups: [],
          externalId: "testLocalUser31ExternalId",
          id: "testLocalUser31",
        },
        testGlobalAdmin32: {
          active: true,
          name: {
            familyName: "testGlobalAdmin32FamilyName",
            givenName: "testGlobalAdmin32GivenName",
          },
          userName: "test_global_admin_32@user.name",
          emails: [
            {
              value: "testGlobalAdmin32Email",
            },
          ],
          groups: [],
          externalId: "testGlobalAdmin32ExternalId",
          id: "testGlobalAdmin32",
          subtenants: [
            {
              id: "subtenant3",
            },
          ],
        },
        testLocalAdmin32: {
          active: true,
          name: {
            familyName: "testLocalAdmin32FamilyName",
            givenName: "testLocalAdmin32GivenName",
          },
          userName: "test_local_admin_32@user.name",
          emails: [
            {
              value: "testLocalAdmin32Email",
            },
          ],
          groups: [],
          externalId: "testLocalAdmin32ExternalId",
          id: "testLocalAdmin32",
          subtenants: [
            {
              id: "subtenant3",
            },
          ],
        },
        testGlobalUser32: {
          active: true,
          name: {
            familyName: "testGlobalUser32FamilyName",
            givenName: "testGlobalUser32GivenName",
          },
          userName: "test_global_user_32@user.name",
          emails: [
            {
              value: "testGlobalUser32Email",
            },
          ],
          groups: [],
          externalId: "testGlobalUser32ExternalId",
          id: "testGlobalUser32",
          subtenants: [
            {
              id: "subtenant3",
            },
          ],
        },
        testLocalUser32: {
          active: true,
          name: {
            familyName: "testLocalUser32FamilyName",
            givenName: "testLocalUser32GivenName",
          },
          userName: "test_local_user_32@user.name",
          emails: [
            {
              value: "testLocalUser32Email",
            },
          ],
          groups: [],
          externalId: "testLocalUser32ExternalId",
          id: "testLocalUser32",
          subtenants: [
            {
              id: "subtenant3",
            },
          ],
        },
      },
      hostTenant: {
        testSuperAdmin1: {
          active: true,
          name: {
            familyName: "testSuperAdmin1FamilyName",
            givenName: "testSuperAdmin1GivenName",
          },
          userName: "test_super_admin_1@user.name",
          emails: [
            {
              value: "testSuperAdmin1Email",
            },
          ],
          groups: [],
          externalId: "testSuperAdmin1ExternalId",
          id: "testSuperAdmin1",
        },
        testSuperAdmin2: {
          active: true,
          name: {
            familyName: "testSuperAdmin2FamilyName",
            givenName: "testSuperAdmin2GivenName",
          },
          userName: "test_super_admin_2@user.name",
          emails: [
            {
              value: "testSuperAdmin2Email",
            },
          ],
          groups: [],
          externalId: "testSuperAdmin2ExternalId",
          id: "testSuperAdmin2",
        },
        testSuperAdmin3: {
          active: true,
          name: {
            familyName: "testSuperAdmin3FamilyName",
            givenName: "testSuperAdmin3GivenName",
          },
          userName: "test_super_admin_3@user.name",
          emails: [
            {
              value: "testSuperAdmin3Email",
            },
          ],
          groups: [],
          externalId: "testSuperAdmin3ExternalId",
          id: "testSuperAdmin3",
          subtenants: [
            {
              id: "subtenant4",
            },
          ],
        },
        testSuperAdmin4: {
          active: true,
          name: {
            familyName: "testSuperAdmin4FamilyName",
            givenName: "testSuperAdmin4GivenName",
          },
          userName: "test_super_admin_4@user.name",
          emails: [
            {
              value: "testSuperAdmin4Email",
            },
          ],
          groups: [],
          externalId: "testSuperAdmin4ExternalId",
          id: "testSuperAdmin4",
          subtenants: [
            {
              id: "subtenant4",
            },
          ],
        },
      },
    };

    userGroupServiceContent = {
      testTenant1: {
        globalAdminGroup: {
          id: "globalAdminGroup",
          description: "globalAdminGroupDescription",
          displayName: "globalAdminGroupDisplayName",
          members: [
            {
              type: "USER",
              value: "testGlobalAdmin11",
            },
            {
              type: "USER",
              value: "testGlobalAdmin12",
            },
          ],
        },
        globalUserGroup: {
          id: "globalUserGroup",
          description: "globalUserGroupDescription",
          displayName: "globalUserGroupDisplayName",
          members: [
            {
              type: "USER",
              value: "testGlobalUser11",
            },
            {
              type: "USER",
              value: "testGlobalUser12",
            },
          ],
        },
        localUserGroup: {
          id: "localUserGroup",
          description: "localUserGroupDescription",
          displayName: "localUserGroupDisplayName",
          members: [
            {
              type: "USER",
              value: "testLocalUser11",
            },
            {
              type: "USER",
              value: "testLocalUser12",
            },
          ],
        },
        localAdminGroup: {
          id: "localAdminGroup",
          description: "localAdminGroupDescription",
          displayName: "localAdminGroupDisplayName",
          members: [
            {
              type: "USER",
              value: "testLocalAdmin11",
            },
            {
              type: "USER",
              value: "testLocalAdmin12",
            },
          ],
        },
        standardUserGroup: {
          id: "standardUserGroup",
          description: "standardUserGroupDescription",
          displayName: "standardUserGroupDisplayName",
          members: [
            {
              type: "USER",
              value: "testGlobalAdmin11",
            },
            {
              type: "USER",
              value: "testGlobalUser11",
            },
            {
              type: "USER",
              value: "testLocalAdmin11",
            },
            {
              type: "USER",
              value: "testLocalUser11",
            },
          ],
        },
        subtenantUserGroup: {
          id: "subtenantUserGroup",
          description: "subtenantUserGroupDescription",
          displayName: "subtenantUserGroupDisplayName",
          members: [
            {
              type: "USER",
              value: "testGlobalAdmin12",
            },
            {
              type: "USER",
              value: "testGlobalUser12",
            },
            {
              type: "USER",
              value: "testLocalAdmin12",
            },
            {
              type: "USER",
              value: "testLocalUser12",
            },
          ],
        },
      },
      testTenant2: {
        globalAdminGroup: {
          id: "globalAdminGroup",
          description: "globalAdminGroupDescription",
          displayName: "globalAdminGroupDisplayName",
          members: [
            {
              type: "USER",
              value: "testGlobalAdmin21",
            },
            {
              type: "USER",
              value: "testGlobalAdmin22",
            },
          ],
        },
        globalUserGroup: {
          id: "globalUserGroup",
          description: "globalUserGroupDescription",
          displayName: "globalUserGroupDisplayName",
          members: [
            {
              type: "USER",
              value: "testGlobalUser21",
            },
            {
              type: "USER",
              value: "testGlobalUser22",
            },
          ],
        },
        localUserGroup: {
          id: "localUserGroup",
          description: "localUserGroupDescription",
          displayName: "localUserGroupDisplayName",
          members: [
            {
              type: "USER",
              value: "testLocalUser21",
            },
            {
              type: "USER",
              value: "testLocalUser22",
            },
          ],
        },
        localAdminGroup: {
          id: "localAdminGroup",
          description: "localAdminGroupDescription",
          displayName: "localAdminGroupDisplayName",
          members: [
            {
              type: "USER",
              value: "testLocalAdmin21",
            },
            {
              type: "USER",
              value: "testLocalAdmin22",
            },
          ],
        },
        standardUserGroup: {
          id: "standardUserGroup",
          description: "standardUserGroupDescription",
          displayName: "standardUserGroupDisplayName",
          members: [
            {
              type: "USER",
              value: "testGlobalAdmin21",
            },
            {
              type: "USER",
              value: "testGlobalUser21",
            },
            {
              type: "USER",
              value: "testLocalAdmin21",
            },
            {
              type: "USER",
              value: "testLocalUser21",
            },
          ],
        },
        subtenantUserGroup: {
          id: "subtenantUserGroup",
          description: "subtenantUserGroupDescription",
          displayName: "subtenantUserGroupDisplayName",
          members: [
            {
              type: "USER",
              value: "testGlobalAdmin22",
            },
            {
              type: "USER",
              value: "testGlobalUser22",
            },
            {
              type: "USER",
              value: "testLocalAdmin22",
            },
            {
              type: "USER",
              value: "testLocalUser22",
            },
          ],
        },
      },
      testTenant3: {
        globalAdminGroup: {
          id: "globalAdminGroup",
          description: "globalAdminGroupDescription",
          displayName: "globalAdminGroupDisplayName",
          members: [
            {
              type: "USER",
              value: "testGlobalAdmin31",
            },
            {
              type: "USER",
              value: "testGlobalAdmin32",
            },
          ],
        },
        globalUserGroup: {
          id: "globalUserGroup",
          description: "globalUserGroupDescription",
          displayName: "globalUserGroupDisplayName",
          members: [
            {
              type: "USER",
              value: "testGlobalUser31",
            },
            {
              type: "USER",
              value: "testGlobalUser32",
            },
          ],
        },
        localUserGroup: {
          id: "localUserGroup",
          description: "localUserGroupDescription",
          displayName: "localUserGroupDisplayName",
          members: [
            {
              type: "USER",
              value: "testLocalUser31",
            },
            {
              type: "USER",
              value: "testLocalUser32",
            },
          ],
        },
        localAdminGroup: {
          id: "localAdminGroup",
          description: "localAdminGroupDescription",
          displayName: "localAdminGroupDisplayName",
          members: [
            {
              type: "USER",
              value: "testLocalAdmin31",
            },
            {
              type: "USER",
              value: "testLocalAdmin32",
            },
          ],
        },
        standardUserGroup: {
          id: "standardUserGroup",
          description: "standardUserGroupDescription",
          displayName: "standardUserGroupDisplayName",
          members: [
            {
              type: "USER",
              value: "testGlobalAdmin31",
            },
            {
              type: "USER",
              value: "testGlobalUser31",
            },
            {
              type: "USER",
              value: "testLocalAdmin31",
            },
            {
              type: "USER",
              value: "testLocalUser31",
            },
          ],
        },
        subtenantUserGroup: {
          id: "subtenantUserGroup",
          description: "subtenantUserGroupDescription",
          displayName: "subtenantUserGroupDisplayName",
          members: [
            {
              type: "USER",
              value: "testGlobalAdmin32",
            },
            {
              type: "USER",
              value: "testGlobalUser32",
            },
            {
              type: "USER",
              value: "testLocalAdmin32",
            },
            {
              type: "USER",
              value: "testLocalUser32",
            },
          ],
        },
      },
      hostTenant: {},
    };

    fileServiceContent = {
      hostTenant: {
        "ten-testTenant1-asset-id": {
          "main.app.config.json": {
            data: {
              testApp1Data: "testApp1DataValue",
            },
            config: {
              testApp1Config: "testApp1ConfigValue",
            },
            maxNumberOfUsers: 5,
          },
          "testPlant1.plant.config.json": {
            data: {
              testPlant1Data: "testPlant1DataValue",
            },
            config: {
              testPlant1Config: "testPlant1ConfigValue",
            },
          },
          "testPlant2.plant.config.json": {
            data: {
              testPlant2Data: "testPlant2DataValue",
            },
            config: {
              testPlant2Config: "testPlant2ConfigValue",
            },
          },
          "testPlant3.plant.config.json": {
            data: {
              testPlant3Data: "testPlant3DataValue",
            },
            config: {
              testPlant3Config: "testPlant3ConfigValue",
            },
          },
          "testGlobalAdmin11.user.config.json": {
            data: {
              testPlant1: {
                testGlobalAdmin11TestPlant1Data:
                  "testGlobalAdmin11TestPlant1DataValue",
              },
              testPlant2: {
                testGlobalAdmin11TestPlant2Data:
                  "testGlobalAdmin11TestPlant2DataValue",
              },
              testPlant3: {
                testGlobalAdmin11TestPlant3Data:
                  "testGlobalAdmin11TestPlant3DataValue",
              },
            },
            config: {
              testPlant1: {
                testGlobalAdmin11TestPlant1Config:
                  "testGlobalAdmin11TestPlant1ConfigValue",
              },
              testPlant2: {
                testGlobalAdmin11TestPlant2Config:
                  "testGlobalAdmin11TestPlant2ConfigValue",
              },
              testPlant3: {
                testGlobalAdmin11TestPlant3Config:
                  "testGlobalAdmin11TestPlant3ConfigValue",
              },
            },
            userName: "test_global_admin_11@user.name",
            permissions: {
              role: UserRole.GlobalAdmin,
              plants: {
                testPlant1: PlantPermissions.Admin,
                testPlant2: PlantPermissions.Admin,
                testPlant3: PlantPermissions.Admin,
              },
            },
          },
          "testGlobalUser11.user.config.json": {
            data: {
              testPlant1: {
                testGlobalUser11TestPlant1Data:
                  "testGlobalUser11TestPlant1DataValue",
              },
              testPlant2: {
                testGlobalUser11TestPlant2Data:
                  "testGlobalUser11TestPlant2DataValue",
              },
              testPlant3: {
                testGlobalUser11TestPlant3Data:
                  "testGlobalUser11TestPlant3DataValue",
              },
            },
            config: {
              testPlant1: {
                testGlobalUser11TestPlant1Config:
                  "testGlobalUser11TestPlant1ConfigValue",
              },
              testPlant2: {
                testGlobalUser11TestPlant2Config:
                  "testGlobalUser11TestPlant2ConfigValue",
              },
              testPlant3: {
                testGlobalUser11TestPlant3Config:
                  "testGlobalUser11TestPlant3ConfigValue",
              },
            },
            userName: "test_global_user_11@user.name",
            permissions: {
              role: UserRole.GlobalUser,
              plants: {
                testPlant1: PlantPermissions.User,
                testPlant2: PlantPermissions.User,
                testPlant3: PlantPermissions.User,
              },
            },
          },
          "testLocalAdmin11.user.config.json": {
            data: {
              testPlant1: {
                testLocalAdmin11TestPlant1Data:
                  "testLocalAdmin11TestPlant1DataValue",
              },
              testPlant2: {
                testLocalAdmin11TestPlant2Data:
                  "testLocalAdmin11TestPlant2DataValue",
              },
            },
            config: {
              testPlant1: {
                testLocalAdmin11TestPlant1Config:
                  "testLocalAdmin11TestPlant1ConfigValue",
              },
              testPlant2: {
                testLocalAdmin11TestPlant2Config:
                  "testLocalAdmin11TestPlant2ConfigValue",
              },
            },
            userName: "test_local_admin_11@user.name",
            permissions: {
              role: UserRole.LocalAdmin,
              plants: {
                testPlant1: PlantPermissions.User,
                testPlant2: PlantPermissions.Admin,
              },
            },
          },
          "testLocalUser11.user.config.json": {
            data: {
              testPlant2: {
                testLocalUser11TestPlant2Data:
                  "testLocalUser11TestPlant2DataValue",
              },
              testPlant3: {
                testLocalUser11TestPlant3Data:
                  "testLocalUser11TestPlant3DataValue",
              },
            },
            config: {
              testPlant2: {
                testLocalUser11TestPlant2Config:
                  "testLocalUser11TestPlant2ConfigValue",
              },
              testPlant3: {
                testLocalUser11TestPlant3Config:
                  "testLocalUser11TestPlant3ConfigValue",
              },
            },
            userName: "test_local_user_11@user.name",
            permissions: {
              role: UserRole.LocalUser,
              plants: {
                testPlant2: PlantPermissions.User,
                testPlant3: PlantPermissions.User,
              },
            },
          },
        },
        "ten-testTenant1-sub-subtenant1-asset-id": {
          "main.app.config.json": {
            data: {
              testApp2Data: "testApp2DataValue",
            },
            config: {
              testApp2Config: "testApp2ConfigValue",
            },
            maxNumberOfUsers: 5,
          },
          "testPlant4.plant.config.json": {
            data: {
              testPlant4Data: "testPlant4DataValue",
            },
            config: {
              testPlant4Config: "testPlant4ConfigValue",
            },
          },
          "testPlant5.plant.config.json": {
            data: {
              testPlant5Data: "testPlant5DataValue",
            },
            config: {
              testPlant5Config: "testPlant5ConfigValue",
            },
          },
          "testPlant6.plant.config.json": {
            data: {
              testPlant6Data: "testPlant6DataValue",
            },
            config: {
              testPlant6Config: "testPlant6ConfigValue",
            },
          },
          "testGlobalAdmin12.user.config.json": {
            data: {
              testPlant4: {
                testGlobalAdmin12TestPlant4Data:
                  "testGlobalAdmin12TestPlant4DataValue",
              },
              testPlant5: {
                testGlobalAdmin12TestPlant5Data:
                  "testGlobalAdmin12TestPlant5DataValue",
              },
              testPlant6: {
                testGlobalAdmin12TestPlant6Data:
                  "testGlobalAdmin12TestPlant6DataValue",
              },
            },
            config: {
              testPlant4: {
                testGlobalAdmin12TestPlant4Config:
                  "testGlobalAdmin12TestPlant4ConfigValue",
              },
              testPlant5: {
                testGlobalAdmin12TestPlant5Config:
                  "testGlobalAdmin12TestPlant5ConfigValue",
              },
              testPlant6: {
                testGlobalAdmin12TestPlant6Config:
                  "testGlobalAdmin12TestPlant6ConfigValue",
              },
            },
            userName: "test_global_admin_12@user.name",
            permissions: {
              role: UserRole.GlobalAdmin,
              plants: {
                testPlant4: PlantPermissions.Admin,
                testPlant5: PlantPermissions.Admin,
                testPlant6: PlantPermissions.Admin,
              },
            },
          },
          "testGlobalUser12.user.config.json": {
            data: {
              testPlant4: {
                testGlobalUser12TestPlant4Data:
                  "testGlobalUser12TestPlant4DataValue",
              },
              testPlant5: {
                testGlobalUser12TestPlant5Data:
                  "testGlobalUser12TestPlant5DataValue",
              },
              testPlant6: {
                testGlobalUser12TestPlant6Data:
                  "testGlobalUser12TestPlant6DataValue",
              },
            },
            config: {
              testPlant4: {
                testGlobalUser12TestPlant4Config:
                  "testGlobalUser12TestPlant4ConfigValue",
              },
              testPlant5: {
                testGlobalUser12TestPlant5Config:
                  "testGlobalUser12TestPlant5ConfigValue",
              },
              testPlant6: {
                testGlobalUser12TestPlant6Config:
                  "testGlobalUser12TestPlant6ConfigValue",
              },
            },
            userName: "test_global_user_12@user.name",
            permissions: {
              role: UserRole.GlobalUser,
              plants: {
                testPlant4: PlantPermissions.User,
                testPlant5: PlantPermissions.User,
                testPlant6: PlantPermissions.User,
              },
            },
          },
          "testLocalAdmin12.user.config.json": {
            data: {
              testPlant4: {
                testLocalAdmin12TestPlant4Data:
                  "testLocalAdmin12TestPlant4DataValue",
              },
              testPlant5: {
                testLocalAdmin12TestPlant5Data:
                  "testLocalAdmin12TestPlant5DataValue",
              },
            },
            config: {
              testPlant4: {
                testLocalAdmin12TestPlant4Config:
                  "testLocalAdmin12TestPlant4ConfigValue",
              },
              testPlant5: {
                testLocalAdmin12TestPlant5Config:
                  "testLocalAdmin12TestPlant5ConfigValue",
              },
            },
            userName: "test_local_admin_12@user.name",
            permissions: {
              role: UserRole.LocalAdmin,
              plants: {
                testPlant4: PlantPermissions.User,
                testPlant5: PlantPermissions.Admin,
              },
            },
          },
          "testLocalUser12.user.config.json": {
            data: {
              testPlant5: {
                testLocalUser12TestPlant5Data:
                  "testLocalUser12TestPlant5DataValue",
              },
              testPlant6: {
                testLocalUser12TestPlant6Data:
                  "testLocalUser12TestPlant6DataValue",
              },
            },
            config: {
              testPlant5: {
                testLocalUser12TestPlant5Config:
                  "testLocalUser12TestPlant5ConfigValue",
              },
              testPlant6: {
                testLocalUser12TestPlant6Config:
                  "testLocalUser12TestPlant6ConfigValue",
              },
            },
            userName: "test_local_user_12@user.name",
            permissions: {
              role: UserRole.LocalUser,
              plants: {
                testPlant5: PlantPermissions.User,
                testPlant6: PlantPermissions.User,
              },
            },
          },
        },
        "ten-testTenant2-asset-id": {
          "main.app.config.json": {
            data: {
              testApp3Data: "testApp3DataValue",
            },
            config: {
              testApp3Config: "testApp3ConfigValue",
            },
            maxNumberOfUsers: 5,
          },
          "testPlant1.plant.config.json": {
            data: {
              testPlant1Data: "testPlant1DataValue",
            },
            config: {
              testPlant1Config: "testPlant1ConfigValue",
            },
          },
          "testPlant2.plant.config.json": {
            data: {
              testPlant2Data: "testPlant2DataValue",
            },
            config: {
              testPlant2Config: "testPlant2ConfigValue",
            },
          },
          "testPlant3.plant.config.json": {
            data: {
              testPlant3Data: "testPlant3DataValue",
            },
            config: {
              testPlant3Config: "testPlant3ConfigValue",
            },
          },
          "testGlobalAdmin21.user.config.json": {
            data: {
              testPlant1: {
                testGlobalAdmin21TestPlant1Data:
                  "testGlobalAdmin21TestPlant1DataValue",
              },
              testPlant2: {
                testGlobalAdmin21TestPlant2Data:
                  "testGlobalAdmin21TestPlant2DataValue",
              },
              testPlant3: {
                testGlobalAdmin21TestPlant3Data:
                  "testGlobalAdmin21TestPlant3DataValue",
              },
            },
            config: {
              testPlant1: {
                testGlobalAdmin21TestPlant1Config:
                  "testGlobalAdmin21TestPlant1ConfigValue",
              },
              testPlant2: {
                testGlobalAdmin21TestPlant2Config:
                  "testGlobalAdmin21TestPlant2ConfigValue",
              },
              testPlant3: {
                testGlobalAdmin21TestPlant3Config:
                  "testGlobalAdmin21TestPlant3ConfigValue",
              },
            },
            userName: "test_global_admin_21@user.name",
            permissions: {
              role: UserRole.GlobalAdmin,
              plants: {
                testPlant1: PlantPermissions.Admin,
                testPlant2: PlantPermissions.Admin,
                testPlant3: PlantPermissions.Admin,
              },
            },
          },
          "testGlobalUser21.user.config.json": {
            data: {
              testPlant1: {
                testGlobalUser21TestPlant1Data:
                  "testGlobalUser21TestPlant1DataValue",
              },
              testPlant2: {
                testGlobalUser21TestPlant2Data:
                  "testGlobalUser21TestPlant2DataValue",
              },
              testPlant3: {
                testGlobalUser21TestPlant3Data:
                  "testGlobalUser21TestPlant3DataValue",
              },
            },
            config: {
              testPlant1: {
                testGlobalUser21TestPlant1Config:
                  "testGlobalUser21TestPlant1ConfigValue",
              },
              testPlant2: {
                testGlobalUser21TestPlant2Config:
                  "testGlobalUser21TestPlant2ConfigValue",
              },
              testPlant3: {
                testGlobalUser21TestPlant3Config:
                  "testGlobalUser21TestPlant3ConfigValue",
              },
            },
            userName: "test_global_user_21@user.name",
            permissions: {
              role: UserRole.GlobalUser,
              plants: {
                testPlant1: PlantPermissions.User,
                testPlant2: PlantPermissions.User,
                testPlant3: PlantPermissions.User,
              },
            },
          },
          "testLocalAdmin21.user.config.json": {
            data: {
              testPlant1: {
                testLocalAdmin21TestPlant1Data:
                  "testLocalAdmin21TestPlant1DataValue",
              },
              testPlant2: {
                testLocalAdmin21TestPlant2Data:
                  "testLocalAdmin21TestPlant2DataValue",
              },
            },
            config: {
              testPlant1: {
                testLocalAdmin21TestPlant1Config:
                  "testLocalAdmin21TestPlant1ConfigValue",
              },
              testPlant2: {
                testLocalAdmin21TestPlant2Config:
                  "testLocalAdmin21TestPlant2ConfigValue",
              },
            },
            userName: "test_local_admin_21@user.name",
            permissions: {
              role: UserRole.LocalAdmin,
              plants: {
                testPlant1: PlantPermissions.User,
                testPlant2: PlantPermissions.Admin,
              },
            },
          },
          "testLocalUser21.user.config.json": {
            data: {
              testPlant2: {
                testLocalUser21TestPlant2Data:
                  "testLocalUser21TestPlant2DataValue",
              },
              testPlant3: {
                testLocalUser21TestPlant3Data:
                  "testLocalUser21TestPlant3DataValue",
              },
            },
            config: {
              testPlant2: {
                testLocalUser21TestPlant2Config:
                  "testLocalUser21TestPlant2onfigValue",
              },
              testPlant3: {
                testLocalUser21TestPlant3Config:
                  "testLocalUser21TestPlant3ConfigValue",
              },
            },
            userName: "test_local_user_21@user.name",
            permissions: {
              role: UserRole.LocalUser,
              plants: {
                testPlant2: PlantPermissions.User,
                testPlant3: PlantPermissions.User,
              },
            },
          },
        },
        "ten-testTenant2-sub-subtenant2-asset-id": {
          "main.app.config.json": {
            data: {
              testApp4Data: "testApp4DataValue",
            },
            config: {
              testApp4Config: "testApp4ConfigValue",
            },
            maxNumberOfUsers: 5,
          },
          "testPlant4.plant.config.json": {
            data: {
              testPlant4Data: "testPlant4DataValue",
            },
            config: {
              testPlant4Config: "testPlant4ConfigValue",
            },
          },
          "testPlant5.plant.config.json": {
            data: {
              testPlant5Data: "testPlant5DataValue",
            },
            config: {
              testPlant5Config: "testPlant5ConfigValue",
            },
          },
          "testPlant6.plant.config.json": {
            data: {
              testPlant6Data: "testPlant6DataValue",
            },
            config: {
              testPlant6Config: "testPlant6ConfigValue",
            },
          },
          "testGlobalAdmin22.user.config.json": {
            data: {
              testPlant4: {
                testGlobalAdmin22TestPlant4Data:
                  "testGlobalAdmin22TestPlant4DataValue",
              },
              testPlant5: {
                testGlobalAdmin22TestPlant5Data:
                  "testGlobalAdmin22TestPlant5DataValue",
              },
              testPlant6: {
                testGlobalAdmin22TestPlant6Data:
                  "testGlobalAdmin22TestPlant6DataValue",
              },
            },
            config: {
              testPlant4: {
                testGlobalAdmin22TestPlant4Config:
                  "testGlobalAdmin22TestPlant4ConfigValue",
              },
              testPlant5: {
                testGlobalAdmin22TestPlant5Config:
                  "testGlobalAdmin22TestPlant5ConfigValue",
              },
              testPlant6: {
                testGlobalAdmin22TestPlant6Config:
                  "testGlobalAdmin22TestPlant6ConfigValue",
              },
            },
            userName: "test_global_admin_22@user.name",
            permissions: {
              role: UserRole.GlobalAdmin,
              plants: {
                testPlant4: PlantPermissions.Admin,
                testPlant5: PlantPermissions.Admin,
                testPlant6: PlantPermissions.Admin,
              },
            },
          },
          "testGlobalUser22.user.config.json": {
            data: {
              testPlant4: {
                testGlobalUser22TestPlant4Data:
                  "testGlobalUser22TestPlant4DataValue",
              },
              testPlant5: {
                testGlobalUser22TestPlant5Data:
                  "testGlobalUser22TestPlant5DataValue",
              },
              testPlant6: {
                testGlobalUser22TestPlant6Data:
                  "testGlobalUser22TestPlant6DataValue",
              },
            },
            config: {
              testPlant4: {
                testGlobalUser22TestPlant4Config:
                  "testGlobalUser22TestPlant4ConfigValue",
              },
              testPlant5: {
                testGlobalUser22TestPlant5Config:
                  "testGlobalUser22TestPlant5ConfigValue",
              },
              testPlant6: {
                testGlobalUser22TestPlant6Config:
                  "testGlobalUser22TestPlant6ConfigValue",
              },
            },
            userName: "test_global_user_22@user.name",
            permissions: {
              role: UserRole.GlobalUser,
              plants: {
                testPlant4: PlantPermissions.User,
                testPlant5: PlantPermissions.User,
                testPlant6: PlantPermissions.User,
              },
            },
          },
          "testLocalAdmin22.user.config.json": {
            data: {
              testPlant4: {
                testLocalAdmin22TestPlant4Data:
                  "testLocalAdmin22TestPlant4DataValue",
              },
              testPlant5: {
                testLocalAdmin22TestPlant5Data:
                  "testLocalAdmin22TestPlant5DataValue",
              },
            },
            config: {
              testPlant4: {
                testLocalAdmin22TestPlant4Config:
                  "testLocalAdmin22TestPlant4ConfigValue",
              },
              testPlant5: {
                testLocalAdmin22TestPlant5Config:
                  "testLocalAdmin22TestPlant5ConfigValue",
              },
            },
            userName: "test_local_admin_22@user.name",
            permissions: {
              role: UserRole.LocalAdmin,
              plants: {
                testPlant4: PlantPermissions.User,
                testPlant5: PlantPermissions.Admin,
              },
            },
          },
          "testLocalUser22.user.config.json": {
            data: {
              testPlant5: {
                testLocalUser22TestPlant5Data:
                  "testLocalUser22TestPlant5DataValue",
              },
              testPlant6: {
                testLocalUser22TestPlant6Data:
                  "testLocalUser22TestPlant6DataValue",
              },
            },
            config: {
              testPlant5: {
                testLocalUser22TestPlant5Config:
                  "testLocalUser22TestPlant5ConfigValue",
              },
              testPlant6: {
                testLocalUser22TestPlant6Config:
                  "testLocalUser22TestPlant6ConfigValue",
              },
            },
            userName: "test_local_user_22@user.name",
            permissions: {
              role: UserRole.LocalUser,
              plants: {
                testPlant5: PlantPermissions.User,
                testPlant6: PlantPermissions.User,
              },
            },
          },
        },
        "ten-testTenant3-asset-id": {
          "main.app.config.json": {
            data: {
              testApp5Data: "testApp5DataValue",
            },
            config: {
              testApp5Config: "testApp5ConfigValue",
            },
            maxNumberOfUsers: 5,
          },
          "testPlant1.plant.config.json": {
            data: {
              testPlant1Data: "testPlant1DataValue",
            },
            config: {
              testPlant1Config: "testPlant1ConfigValue",
            },
          },
          "testPlant2.plant.config.json": {
            data: {
              testPlant2Data: "testPlant2DataValue",
            },
            config: {
              testPlant2Config: "testPlant2ConfigValue",
            },
          },
          "testPlant3.plant.config.json": {
            data: {
              testPlant3Data: "testPlant3DataValue",
            },
            config: {
              testPlant3Config: "testPlant3ConfigValue",
            },
          },
          "testGlobalAdmin31.user.config.json": {
            data: {
              testPlant1: {
                testGlobalAdmin31TestPlant1Data:
                  "testGlobalAdmin31TestPlant1DataValue",
              },
              testPlant2: {
                testGlobalAdmin31TestPlant2Data:
                  "testGlobalAdmin31TestPlant2DataValue",
              },
              testPlant3: {
                testGlobalAdmin31TestPlant3Data:
                  "testGlobalAdmin31TestPlant3DataValue",
              },
            },
            config: {
              testPlant1: {
                testGlobalAdmin31TestPlant1Config:
                  "testGlobalAdmin31TestPlant1ConfigValue",
              },
              testPlant2: {
                testGlobalAdmin31TestPlant2Config:
                  "testGlobalAdmin31TestPlant2ConfigValue",
              },
              testPlant3: {
                testGlobalAdmin31TestPlant3Config:
                  "testGlobalAdmin31TestPlant3ConfigValue",
              },
            },
            userName: "test_global_admin_31@user.name",
            permissions: {
              role: UserRole.GlobalAdmin,
              plants: {
                testPlant1: PlantPermissions.Admin,
                testPlant2: PlantPermissions.Admin,
                testPlant3: PlantPermissions.Admin,
              },
            },
          },
          "testGlobalUser31.user.config.json": {
            data: {
              testPlant1: {
                testGlobalUser31TestPlant1Data:
                  "testGlobalUser31TestPlant1DataValue",
              },
              testPlant2: {
                testGlobalUser31TestPlant2Data:
                  "testGlobalUser31TestPlant2DataValue",
              },
              testPlant3: {
                testGlobalUser31TestPlant3Data:
                  "testGlobalUser31TestPlant3DataValue",
              },
            },
            config: {
              testPlant1: {
                testGlobalUser31TestPlant1Config:
                  "testGlobalUser31TestPlant1ConfigValue",
              },
              testPlant2: {
                testGlobalUser31TestPlant2Config:
                  "testGlobalUser31TestPlant2ConfigValue",
              },
              testPlant3: {
                testGlobalUser31TestPlant3Config:
                  "testGlobalUser31TestPlant3ConfigValue",
              },
            },
            userName: "test_global_user_31@user.name",
            permissions: {
              role: UserRole.GlobalUser,
              plants: {
                testPlant1: PlantPermissions.User,
                testPlant2: PlantPermissions.User,
                testPlant3: PlantPermissions.User,
              },
            },
          },
          "testLocalAdmin31.user.config.json": {
            data: {
              testPlant1: {
                testLocalAdmin31TestPlant1Data:
                  "testLocalAdmin31TestPlant1DataValue",
              },
              testPlant2: {
                testLocalAdmin31TestPlant2Data:
                  "testLocalAdmin31TestPlant2DataValue",
              },
            },
            config: {
              testPlant1: {
                testLocalAdmin31TestPlant1Config:
                  "testLocalAdmin31TestPlant1ConfigValue",
              },
              testPlant2: {
                testLocalAdmin31TestPlant2Config:
                  "testLocalAdmin31TestPlant2ConfigValue",
              },
            },
            userName: "test_local_admin_31@user.name",
            permissions: {
              role: UserRole.LocalAdmin,
              plants: {
                testPlant1: PlantPermissions.User,
                testPlant2: PlantPermissions.Admin,
              },
            },
          },
          "testLocalUser31.user.config.json": {
            data: {
              testPlant2: {
                testLocalUser31TestPlant2Data:
                  "testLocalUser31TestPlant2DataValue",
              },
              testPlant3: {
                testLocalUser31TestPlant3Data:
                  "testLocalUser31TestPlant3DataValue",
              },
            },
            config: {
              testPlant2: {
                testLocalUser31TestPlant2Config:
                  "testLocalUser31TestPlant2ConfigValue",
              },
              testPlant3: {
                testLocalUser31TestPlant3Config:
                  "testLocalUser31TestPlant3ConfigValue",
              },
            },
            userName: "test_local_user_31@user.name",
            permissions: {
              role: UserRole.LocalUser,
              plants: {
                testPlant2: PlantPermissions.User,
                testPlant3: PlantPermissions.User,
              },
            },
          },
        },
        "ten-testTenant3-sub-subtenant3-asset-id": {
          "main.app.config.json": {
            data: {
              testApp6Data: "testApp6DataValue",
            },
            config: {
              testApp6Config: "testApp6ConfigValue",
            },
            maxNumberOfUsers: 5,
          },
          "testPlant4.plant.config.json": {
            data: {
              testPlant4Data: "testPlant4DataValue",
            },
            config: {
              testPlant4Config: "testPlant4ConfigValue",
            },
          },
          "testPlant5.plant.config.json": {
            data: {
              testPlant5Data: "testPlant5DataValue",
            },
            config: {
              testPlant5Config: "testPlant5ConfigValue",
            },
          },
          "testPlant6.plant.config.json": {
            data: {
              testPlant6Data: "testPlant6DataValue",
            },
            config: {
              testPlant6Config: "testPlant6ConfigValue",
            },
          },
          "testGlobalAdmin32.user.config.json": {
            data: {
              testPlant4: {
                testGlobalAdmin32TestPlant4Data:
                  "testGlobalAdmin32TestPlant4DataValue",
              },
              testPlant5: {
                testGlobalAdmin32TestPlant5Data:
                  "testGlobalAdmin32TestPlant5DataValue",
              },
              testPlant6: {
                testGlobalAdmin32TestPlant6Data:
                  "testGlobalAdmin32TestPlant6DataValue",
              },
            },
            config: {
              testPlant4: {
                testGlobalAdmin32TestPlant4Config:
                  "testGlobalAdmin32TestPlant4ConfigValue",
              },
              testPlant5: {
                testGlobalAdmin32TestPlant5Config:
                  "testGlobalAdmin32TestPlant5ConfigValue",
              },
              testPlant6: {
                testGlobalAdmin32TestPlant6Config:
                  "testGlobalAdmin32TestPlant6ConfigValue",
              },
            },
            userName: "test_global_admin_32@user.name",
            permissions: {
              role: UserRole.GlobalAdmin,
              plants: {
                testPlant4: PlantPermissions.Admin,
                testPlant5: PlantPermissions.Admin,
                testPlant6: PlantPermissions.Admin,
              },
            },
          },
          "testGlobalUser32.user.config.json": {
            data: {
              testPlant4: {
                testGlobalUser32TestPlant4Data:
                  "testGlobalUser32TestPlant4DataValue",
              },
              testPlant5: {
                testGlobalUser32TestPlant5Data:
                  "testGlobalUser32TestPlant5DataValue",
              },
              testPlant6: {
                testGlobalUser32TestPlant6Data:
                  "testGlobalUser32TestPlant6DataValue",
              },
            },
            config: {
              testPlant4: {
                testGlobalUser32TestPlant4Config:
                  "testGlobalUser32TestPlant4ConfigValue",
              },
              testPlant5: {
                testGlobalUser32TestPlant5Config:
                  "testGlobalUser32TestPlant5ConfigValue",
              },
              testPlant6: {
                testGlobalUser32TestPlant6Config:
                  "testGlobalUser32TestPlant6ConfigValue",
              },
            },
            userName: "test_global_user_32@user.name",
            permissions: {
              role: UserRole.GlobalUser,
              plants: {
                testPlant4: PlantPermissions.User,
                testPlant5: PlantPermissions.User,
                testPlant6: PlantPermissions.User,
              },
            },
          },
          "testLocalAdmin32.user.config.json": {
            data: {
              testPlant4: {
                testLocalAdmin32TestPlant4Data:
                  "testLocalAdmin32TestPlant4DataValue",
              },
              testPlant5: {
                testLocalAdmin32TestPlant5Data:
                  "testLocalAdmin32TestPlant5DataValue",
              },
            },
            config: {
              testPlant4: {
                testLocalAdmin32TestPlant4Config:
                  "testLocalAdmin32TestPlant4ConfigValue",
              },
              testPlant5: {
                testLocalAdmin32TestPlant5Config:
                  "testLocalAdmin32TestPlant5ConfigValue",
              },
            },
            userName: "test_local_admin_32@user.name",
            permissions: {
              role: UserRole.LocalAdmin,
              plants: {
                testPlant4: PlantPermissions.User,
                testPlant5: PlantPermissions.Admin,
              },
            },
          },
          "testLocalUser32.user.config.json": {
            data: {
              testPlant5: {
                testLocalUser32TestPlant5Data:
                  "testLocalUser32TestPlant5DataValue",
              },
              testPlant6: {
                testLocalUser32TestPlant6Data:
                  "testLocalUser32TestPlant6DataValue",
              },
            },
            config: {
              testPlant5: {
                testLocalUser32TestPlant5Config:
                  "testLocalUser32TestPlant5ConfigValue",
              },
              testPlant6: {
                testLocalUser32TestPlant6Config:
                  "testLocalUser32TestPlant6ConfigValue",
              },
            },
            userName: "test_local_user_32@user.name",
            permissions: {
              role: UserRole.LocalUser,
              plants: {
                testPlant5: PlantPermissions.User,
                testPlant6: PlantPermissions.User,
              },
            },
          },
        },
        notificationsAssetId: {},
        testServiceContainerAssetId: {},
      },
    };

    assetServiceContent = {
      hostTenant: {
        testAppContainerAssetId: {
          name: "testAppContainerName",
          parentId: "hostTenantAssetId",
          typeId: "testAppContainerAssetType",
          assetId: "testAppContainerAssetId",
          etag: 0,
          tenantId: "hostTenant",
        },
        "ten-testTenant1-asset-id": {
          name: "ten-testTenant1",
          parentId: "testAppContainerAssetId",
          typeId: "testAppAssetType",
          assetId: "ten-testTenant1-asset-id",
          etag: 0,
          tenantId: "hostTenant",
        },
        "ten-testTenant1-sub-subtenant1-asset-id": {
          name: "ten-testTenant1-sub-subtenant1",
          parentId: "testAppContainerAssetId",
          typeId: "testAppAssetType",
          assetId: "ten-testTenant1-sub-subtenant1-asset-id",
          etag: 0,
          tenantId: "hostTenant",
        },
        "ten-testTenant2-asset-id": {
          name: "ten-testTenant2",
          parentId: "testAppContainerAssetId",
          typeId: "testAppAssetType",
          assetId: "ten-testTenant2-asset-id",
          etag: 0,
          tenantId: "hostTenant",
        },
        "ten-testTenant2-sub-subtenant2-asset-id": {
          name: "ten-testTenant2-sub-subtenant2",
          parentId: "testAppContainerAssetId",
          typeId: "testAppAssetType",
          assetId: "ten-testTenant2-sub-subtenant2-asset-id",
          etag: 0,
          tenantId: "hostTenant",
        },
        "ten-testTenant3-asset-id": {
          name: "ten-testTenant3",
          parentId: "testAppContainerAssetId",
          typeId: "testAppAssetType",
          assetId: "ten-testTenant3-asset-id",
          etag: 0,
          tenantId: "hostTenant",
        },
        "ten-testTenant3-sub-subtenant3-asset-id": {
          name: "ten-testTenant3-sub-subtenant3",
          parentId: "testAppContainerAssetId",
          typeId: "testAppAssetType",
          assetId: "ten-testTenant3-sub-subtenant3-asset-id",
          etag: 0,
          tenantId: "hostTenant",
        },
      },
    };

    jest.clearAllMocks();

    logErrorMockFunc = jest.fn();

    logger.error = logErrorMockFunc;
  });

  afterEach(async () => {
    //Clear MindSphere token manager
    clearMindSphereTokenManagerInstanceMock();

    //Clearing MindSphereServices
    (MindSphereUserService as any)._instance = null;
    (MindSphereUserGroupService as any)._instance = null;
    (MindSphereFileService as any)._instance = null;
    (MindSphereAssetService as any)._instance = null;

    //Clearing app manager
    (MindSphereAppsManager as any)._instance = null;

    jest.clearAllMocks();

    //stopping the server if exists
    if (server != null) await server.close();
  });

  const beforeExec = async () => {
    await mockMindSphereTokenManager();
    await mockMsUserGroupService(userGroupServiceContent);
    await mockMsUserService(userServiceContent);
    await mockMsFileService(fileServiceContent);
    await mockMsAssetService(assetServiceContent);

    //Starting the app
    server = await appStart(__dirname);
  };

  /**
   * @description Method for creating response contain user data payloads for local plant
   */
  const getUserDataResponse = (
    appId: string,
    appAssetId: string,
    userId: string,
    plantId: string
  ) => {
    const tenantName = "hostTenant";

    let userPayload: any = {};

    let userStorageContent = cloneObject(
      fileServiceContent[tenantName][appAssetId][`${userId}.user.config.json`]
    );

    userPayload = {
      ...userStorageContent,
      userId: userId,
      appId: appId,
    };

    userPayload.data = {
      [plantId]: userStorageContent.data[plantId],
    };

    userPayload.config = {
      [plantId]: userStorageContent.config[plantId],
    };

    userPayload.permissions.plants = {
      [plantId]: userStorageContent.permissions.plants[plantId],
    };

    return userPayload;
  };

  /**
   * @description Method for creating response contain all user data payloads for local plant
   */
  const getUsersDataResponse = (
    appId: string,
    appAssetId: string,
    plantId: string
  ) => {
    const tenantName = "hostTenant";

    let userPayloads: any = {};

    let allUsersFilePaths = Object.keys(
      fileServiceContent[tenantName][appAssetId]
    ).filter((fielPath) => fielPath.includes(`.user.config.json`));

    for (let filePath of allUsersFilePaths) {
      let fileContent = fileServiceContent[tenantName][appAssetId][filePath];
      if (fileContent.permissions.plants[plantId] != null) {
        let userId = filePath.replace(`.user.config.json`, "");
        userPayloads[userId] = getUserDataResponse(
          appId,
          appAssetId,
          userId,
          plantId
        );
      }
    }

    return userPayloads;
  };

  describe("GET /local/:appId/:plantId", () => {
    //Inputs
    let requestHeaders: any;
    let userPayload: MindSphereUserJWTData;
    let appId: string;
    let plantId: string;
    let getAllUsersThrows: boolean;

    //Outputs
    let expectedValidCall: boolean;
    let expectedResponseCode: number;
    let expectedErrorText: string | null;
    let expectedGetAllUsersCallNumber: number;
    let expectedGetAssetsCallNumber: number;
    let expectedGetFileContentCallNumber: number;
    let expectedGetFileContentCallParameters: Array<any>[];
    let expectedFileServiceContent: any;

    beforeEach(() => {
      //Inputs
      requestHeaders = {};
      appId = "ten-testTenant2-sub-subtenant2";
      plantId = "testPlant5";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      getAllUsersThrows = false;

      //Outputs
      expectedValidCall = true;
      expectedResponseCode = 200;
      expectedErrorText = null;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);
    });

    let exec = async () => {
      await beforeExec();

      if (getAllUsersThrows) {
        MindSphereUserService.getInstance().getAllUsers = jest.fn(async () => {
          throw new Error("Test get all users error");
        });
      }

      return request(server)
        .get(`/customApi/config/user/local/${appId}/${plantId}`)
        .set(requestHeaders)
        .send();
    };

    const testLocalUsersGet = async () => {
      let result = await exec();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(expectedResponseCode);

      if (expectedValidCall) {
        let expectedPayload = getUsersDataResponse(
          appId,
          `${appId}-asset-id`,
          plantId
        );

        expect(result.body).toEqual(expectedPayload);
      } else {
        expect(result.text).toEqual(expectedErrorText);
      }

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(expectedGetAllUsersCallNumber);
      if (expectedGetAllUsersCallNumber > 0) {
        expect(getAllUsers.mock.calls[0]).toEqual([
          userPayload.ten,
          userPayload.subtenant != null ? userPayload.subtenant : null,
          null,
          userPayload.user_name,
        ]);
      }

      //Checking if app exists - should be invoked only one time during initalization
      expect(getAssets).toHaveBeenCalledTimes(expectedGetAssetsCallNumber);
      if (expectedGetAssetsCallNumber > 0) {
        expect(getAssets.mock.calls[0]).toEqual([
          "hostTenant",
          null,
          "testAppContainerAssetId",
          "testAppAssetType",
        ]);
      }

      //Then users data should be fetched - without getFileContent - invoked during initialization - 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48
      expect(getFileContent).toHaveBeenCalledTimes(
        expectedGetFileContentCallNumber
      );
      if (expectedGetFileContentCallNumber > 0) {
        for (let parameters of expectedGetFileContentCallParameters) {
          expect(getFileContent.mock.calls).toContainEqual(parameters);
        }
      }

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let app = MindSphereAppsManager.getInstance().Apps[appId] as any;

      //Checking app only if it exists - ther are some cases where api calls about app that does not exist
      if (app != null) {
        let storagePayload = app._userStorage._cacheData;

        let allUsersPayload: any = {};

        let userFilePaths = Object.keys(
          expectedFileServiceContent["hostTenant"][`${appId}-asset-id`]
        ).filter((filePath) => filePath.includes(".user.config.json"));

        for (let userFilePath of userFilePaths) {
          let userFileContent =
            expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
              userFilePath
            ];
          let userId = userFilePath.replace(".user.config.json", "");
          allUsersPayload[userId] = {
            ...userFileContent,
          };
        }

        expect(storagePayload).toEqual(allUsersPayload);
      }

      //#endregion  =====  CHECKING STORAGE =====
    };

    it("should return 200 and local payload with all users that have permissions to the given plant", async () => {
      await testLocalUsersGet();
    });

    it("should return 200 and local payload with all users that have permissions to the given plant - if all users of the app have permissions to the plant", async () => {
      plantId = "testPlant5";

      await testLocalUsersGet();
    });

    it("should return 200 and local payload with all users that have permissions to the given plant - if only some users of the app have permissions to the plant", async () => {
      plantId = "testPlant4";
      //User calling the api has to have an administrative permissions to the plant
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUsersGet();
    });

    it("should return 200 and local payload with all users that have permissions to the given plant - if only one user has permissions to the app", async () => {
      plantId = "testPlant7";
      //User calling the api has to have an administrative permissions to the plant
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].data[plantId] = { fakeData: 1234 };
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].config[plantId] = { fakeConfig: 1234 };

      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUsersGet();
    });

    it("should return 200 and local payload with all users that have permissions to the given plant - subtenant app", async () => {
      appId = "ten-testTenant2-sub-subtenant2";
      plantId = "testPlant5";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      await testLocalUsersGet();
    });

    it("should return 200 and local payload with all users that have permissions to the given plant - tenant app", async () => {
      appId = "ten-testTenant2";
      plantId = "testPlant2";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_21@user.name",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      await testLocalUsersGet();
    });

    it("should return 404 - if there is no plant of given id", async () => {
      plantId = "fakePlant";

      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";

      await testLocalUsersGet();
    });

    it("should return 200 and fetch users from storage - if they don't exist in cache - tenant app", async () => {
      let testGlobalUser22Payload =
        fileServiceContent["hostTenant"][`${appId}-asset-id`][
          `testGlobalUser22.user.config.json`
        ];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ];

      let testLocalUser22Payload =
        fileServiceContent["hostTenant"][`${appId}-asset-id`][
          `testLocalUser22.user.config.json`
        ];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ];

      //Initializing app without user's data
      await beforeExec();

      //Adding user's data
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ] = testGlobalUser22Payload;
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ] = testLocalUser22Payload;

      setFileServiceContent(fileServiceContent);

      let result = await request(server)
        .get(`/customApi/config/user/local/${appId}/${plantId}`)
        .set(requestHeaders)
        .send();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(expectedResponseCode);

      let expectedPayload = getUsersDataResponse(
        appId,
        `${appId}-asset-id`,
        plantId
      );

      expect(result.body).toEqual(expectedPayload);

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        userPayload.ten,
        userPayload.subtenant != null ? userPayload.subtenant : null,
        null,
        userPayload.user_name,
      ]);

      //Checking if app exists - should be invoked only one time during initalization
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //Then users data should be fetched - at first it should be called 46 times during initalizatoin and then 2 times for fetching new users data
      expect(getFileContent).toHaveBeenCalledTimes(48);
      let laterCalls = [
        getFileContent.mock.calls[46],
        getFileContent.mock.calls[47],
      ];

      expect(laterCalls).toContainEqual([
        "hostTenant",
        `${appId}-asset-id`,
        "testLocalUser22.user.config.json",
      ]);
      expect(laterCalls).toContainEqual([
        "hostTenant",
        `${appId}-asset-id`,
        "testGlobalUser22.user.config.json",
      ]);

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let app = MindSphereAppsManager.getInstance().Apps[appId] as any;

      //Checking app only if it exists - ther are some cases where api calls about app that does not exist
      if (app != null) {
        let storagePayload = app._userStorage._cacheData;

        let allUsersPayload: any = {};

        let userFilePaths = Object.keys(
          fileServiceContent["hostTenant"][`${appId}-asset-id`]
        ).filter((filePath) => filePath.includes(".user.config.json"));

        for (let userFilePath of userFilePaths) {
          let userFileContent =
            fileServiceContent["hostTenant"][`${appId}-asset-id`][userFilePath];
          let userId = userFilePath.replace(".user.config.json", "");
          allUsersPayload[userId] = {
            ...userFileContent,
          };
        }

        expect(storagePayload).toEqual(allUsersPayload);
      }

      //#endregion  =====  CHECKING STORAGE =====
    });

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should return 404 and not get all users - if global admin without access to the given plant attempts to get all users", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].data[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].config[plantId];

      expectedFileServiceContent = cloneObject(fileServiceContent);

      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUsersGet();
    });

    it("should return 404 and not get all users - if global admin with user access to the given plant attempts to get all users", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.User;

      expectedFileServiceContent = cloneObject(fileServiceContent);

      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUsersGet();
    });

    it("should return 200 and get all users - if global admin with admin access to the given plant attempts to get all users", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUsersGet();
    });

    it("should return 403 and not get all users - if global user without access to the given plant attempts to get all users", async () => {
      userPayload = {
        client_id: "testGlobalUserClientId",
        email: "testGlobalUserEmail",
        scope: ["testGlobalUserScope"],
        ten: "testTenant2",
        user_name: "test_global_user_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].permissions.plants[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].data[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].config[plantId];

      expectedFileServiceContent = cloneObject(fileServiceContent);

      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global admin or local admin!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUsersGet();
    });

    it("should return 403 and not get all users - if global user with user access to the given plant attempts to get all users", async () => {
      userPayload = {
        client_id: "testGlobalUserClientId",
        email: "testGlobalUserEmail",
        scope: ["testGlobalUserScope"],
        ten: "testTenant2",
        user_name: "test_global_user_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      expectedFileServiceContent = cloneObject(fileServiceContent);

      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global admin or local admin!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUsersGet();
    });

    it("should return 404 and not get all users - if local admin without access to the given plant attempts to get all users", async () => {
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.plants[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].data[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].config[plantId];

      expectedFileServiceContent = cloneObject(fileServiceContent);

      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUsersGet();
    });

    it("should return 404 and not get all users - if local admin with user access to the given plant attempts to get all users", async () => {
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.User;

      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUsersGet();
    });

    it("should return 200 and get all users - if local admin with admin access to the given plant attempts to get all users", async () => {
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUsersGet();
    });

    it("should return 403 and not get all users - if local user without access to the given plant attempts to get all users", async () => {
      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_local_user_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ].permissions.plants[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ].data[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ].config[plantId];

      expectedFileServiceContent = cloneObject(fileServiceContent);

      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global admin or local admin!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUsersGet();
    });

    it("should return 403 and not get all users - if local user with user access to the given plant attempts to get all users", async () => {
      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_local_user_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      expectedFileServiceContent = cloneObject(fileServiceContent);

      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global admin or local admin!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUsersGet();
    });

    it("should return 403 and not get all users - if user's jwt payload does not have tenant assigned", async () => {
      delete (userPayload as any).ten;

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Invalid application id generated from user payload!";
      expectedFileServiceContent = cloneObject(fileServiceContent);
      //GetAllUser should not be called - call ended before fetching user's data
      expectedGetAllUsersCallNumber = 0;

      await testLocalUsersGet();
    });

    it("should return 403 and not get all users - if there is no application of given id", async () => {
      appId = "ten-fakeTen-sub-fakeSub";
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "fakeTen",
        user_name: "test_global_admin_22@user.name",
        subtenant: "fakeSub",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Application of given id not found for the user!";
      expectedFileServiceContent = cloneObject(fileServiceContent);
      //GetAllUser should not be called - call ended before fetching user's data
      expectedGetAllUsersCallNumber = 0;
      //GetAssets should be called x2 - try fetching fake app
      expectedGetAssetsCallNumber = 2;

      await testLocalUsersGet();
    });

    it("should return 403 and not get all users - if app id in user's payload and param differs", async () => {
      appId = "ten-testTenant2";
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. No access to given application!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUsersGet();
    });

    it("should return 403 and not get all users - if there is no application data for given app", async () => {
      delete fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["main.app.config.json"];

      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Main application settings not found for the user!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      //GetAllUser should not be called - call ended before fetching user's data
      expectedGetAllUsersCallNumber = 0;
      //47 calls of getFileContent - no file containing one main app data
      expectedGetFileContentCallNumber = 47;

      await testLocalUsersGet();
    });

    it("should return 403 and not get all users - if user has valid scope, doest not exist in user service but exists in file service", async () => {
      //Adding user to file service for the app
      fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testFakeUser23.user.config.json"] = {
        data: {
          testPlant4: {
            testFakeUser23TestPlant4Data: "testFakeUser23TestPlant4DataValue",
          },
          testPlant5: {
            testFakeUser23TestPlant5Data: "testFakeUser23TestPlant5DataValue",
          },
        },
        config: {
          testPlant4: {
            testFakeUser23TestPlant4Config:
              "testFakeUser23TestPlant4ConfigValue",
          },
          testPlant5: {
            testFakeUser23TestPlant5Config:
              "testFakeUser23TestPlant5ConfigValue",
          },
        },
        userName: "test_fake_user_23@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant5: PlantPermissions.User,
            testPlant6: PlantPermissions.User,
          },
        },
      };

      //Creating new user's jwt payload
      userPayload = {
        client_id: "testFakeUserClientId",
        email: "testFakeUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_fake_user_23@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. User of given name not found!";
      expectedFileServiceContent = cloneObject(fileServiceContent);
      //49 calls of getFileContent - one additional user
      expectedGetFileContentCallNumber = 49;

      await testLocalUsersGet();
    });

    it("should return 403 and not get all users - if user has valid scope, exists in user service but does not exist in file service", async () => {
      userServiceContent["testTenant2"]["testFakeUser23"] = {
        active: true,
        name: {
          familyName: "testFakeUser23FamilyName",
          givenName: "testFakeUser23GivenName",
        },
        userName: "test_fake_user_23@user.name",
        emails: [
          {
            value: "testFakeUser23Email",
          },
        ],
        groups: [],
        externalId: "testFakeUser23ExternalId",
        id: "testFakeUser23",
        subtenants: [
          {
            id: "subtenant2",
          },
        ],
      };

      userGroupServiceContent.testTenant2.globalAdminGroup.members.push({
        type: "USER",
        value: "testFakeUser23",
      });

      userGroupServiceContent.testTenant2.subtenantUserGroup.members.push({
        type: "USER",
        value: "testFakeUser23",
      });

      //Creating new user's jwt payload
      userPayload = {
        client_id: "testFakeUserClientId",
        email: "testFakeUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_fake_user_23@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User does not exist for given app id!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUsersGet();
    });

    it("should return 403 and not get all users - if user has no access to the app - invalid scope", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["fakeScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22_user_name",
      };

      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Forbidden access. No scope found to access the app!";
      expectedFileServiceContent = cloneObject(fileServiceContent);
      //0 calls of getAllUsers - not fetching user's data - checking scope before fetching
      expectedGetAllUsersCallNumber = 0;

      await testLocalUsersGet();
    });

    it("should return 403 and not get all users - if subtenant user attempts to get user for tenant app", async () => {
      appId = "ten-testTenant2";
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22@user.name",
        subtenant: "subtenant2",
      };

      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. No access to given application!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUsersGet();
    });

    it("should return 403 and not get all users - if tenant user attempts to get user for subtenant app", async () => {
      appId = "ten-testTenant2-sub-subtenant2";
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_21@user.name",
      };

      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. No access to given application!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUsersGet();
    });

    it("should return 401 - if authorization token is invalid - no bearer prefix", async () => {
      requestHeaders["authorization"] = jwt.sign(userPayload, "testPrivateKey");

      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";
      expectedFileServiceContent = cloneObject(fileServiceContent);
      //No calling getAllUsers - returning before fetching user's data
      expectedGetAllUsersCallNumber = 0;

      await testLocalUsersGet();
    });

    it("should return 401 - if authorization token is invalid - invalid token", async () => {
      requestHeaders["authorization"] =
        "Bearer thisIsTheFakeValueOfTheJWTToken";

      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";
      expectedFileServiceContent = cloneObject(fileServiceContent);
      //No calling getAllUsers - returning before fetching user's data
      expectedGetAllUsersCallNumber = 0;

      await testLocalUsersGet();
    });

    it("should return 401 - if authorization token is invalid - no token provided", async () => {
      delete requestHeaders["authorization"];

      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";
      expectedFileServiceContent = cloneObject(fileServiceContent);
      //No calling getAllUsers - returning before fetching user's data
      expectedGetAllUsersCallNumber = 0;

      await testLocalUsersGet();
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========

    //#region ========== MINDSPHERE SERVICE THROWS ==========

    it("should return 500 and not get all users - if get all users throws", async () => {
      getAllUsersThrows = true;

      expectedValidCall = false;
      expectedResponseCode = 500;
      expectedErrorText = `Ups.. Something fails..`;
      expectedFileServiceContent = cloneObject(fileServiceContent);
      //0 calls for getAllUsers - becouse getAllUsers mock is overridden with a different mocked method
      expectedGetAllUsersCallNumber = 0;

      await testLocalUsersGet();

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test get all users error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    it("should return 500 and not get all users - if there is no user in file storage cache but is in storage and getFileContent throws", async () => {
      let oldUserPayload =
        fileServiceContent["hostTenant"][`${appId}-asset-id`][
          `testLocalUser22.user.config.json`
        ];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ];
      let oldFileServiceContent = cloneObject(fileServiceContent);

      //Initializing app without user's data
      await beforeExec();

      //Mocking get file content to throw
      MindSphereFileService.getInstance().getFileContent = jest.fn(async () => {
        throw new Error("Test get file content error");
      });

      //Adding user's data
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ] = oldUserPayload;

      //Setting new file service content
      setFileServiceContent(fileServiceContent);

      let result = await request(server)
        .get(`/customApi/config/user/local/${appId}/${plantId}`)
        .set(requestHeaders)
        .send();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(500);

      expect(result.text).toEqual(`Ups.. Something fails..`);

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        userPayload.ten,
        userPayload.subtenant != null ? userPayload.subtenant : null,
        null,
        userPayload.user_name,
      ]);

      //Checking if app exists - should be invoked only one time during initalization
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //Then users data should be fetched - without one file - 47
      //48th call should not be taken into account - method overridden with throwing mock
      expect(getFileContent).toHaveBeenCalledTimes(47);

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      //Storage should be left without fetched data
      let storagePayload = (MindSphereAppsManager.getInstance().Apps[
        appId
      ] as any)._userStorage._cacheData;

      let allUsersPayload: any = {};

      let userFilePaths = Object.keys(
        oldFileServiceContent["hostTenant"][`${appId}-asset-id`]
      ).filter((filePath) => filePath.includes(".user.config.json"));

      for (let userFilePath of userFilePaths) {
        let userFileContent =
          oldFileServiceContent["hostTenant"][`${appId}-asset-id`][
            userFilePath
          ];
        let userId = userFilePath.replace(".user.config.json", "");
        allUsersPayload[userId] = {
          ...userFileContent,
        };
      }

      expect(storagePayload).toEqual(allUsersPayload);

      //#endregion  =====  CHECKING STORAGE =====

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test get file content error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    //#endregion ========== MINDSPHERE SERVICE THROWS ==========
  });

  describe("GET /local/:appId/:plantId/:userId", () => {
    //Inputs
    let requestHeaders: any;
    let userPayload: MindSphereUserJWTData;
    let appId: string;
    let userId: string;
    let plantId: string;
    let getAllUsersThrows: boolean;

    //Outputs
    let expectedValidCall: boolean;
    let expectedResponseCode: number;
    let expectedErrorText: string | null;
    let expectedGetAllUsersCallNumber: number;
    let expectedGetAssetsCallNumber: number;
    let expectedGetFileContentCallNumber: number;
    let expectedGetFileContentCallParameters: Array<any>[];
    let expectedFileServiceContent: any;

    beforeEach(() => {
      //Inputs
      requestHeaders = {};
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalUser22";
      plantId = "testPlant5";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      getAllUsersThrows = false;

      //Outputs
      expectedValidCall = true;
      expectedResponseCode = 200;
      expectedErrorText = null;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);
    });

    let exec = async () => {
      await beforeExec();

      if (getAllUsersThrows) {
        MindSphereUserService.getInstance().getAllUsers = jest.fn(async () => {
          throw new Error("Test get all users error");
        });
      }

      return request(server)
        .get(`/customApi/config/user/local/${appId}/${plantId}/${userId}`)
        .set(requestHeaders)
        .send();
    };

    const testLocalUserGet = async () => {
      let result = await exec();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(expectedResponseCode);

      if (expectedValidCall) {
        let expectedPayload = getUserDataResponse(
          appId,
          `${appId}-asset-id`,
          userId,
          plantId
        );

        expect(result.body).toEqual(expectedPayload);
      } else {
        expect(result.text).toEqual(expectedErrorText);
      }

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(expectedGetAllUsersCallNumber);
      if (expectedGetAllUsersCallNumber > 0) {
        expect(getAllUsers.mock.calls[0]).toEqual([
          userPayload.ten,
          userPayload.subtenant != null ? userPayload.subtenant : null,
          null,
          userPayload.user_name,
        ]);
      }

      //Checking if app exists - should be invoked only one time during initalization
      expect(getAssets).toHaveBeenCalledTimes(expectedGetAssetsCallNumber);
      if (expectedGetAssetsCallNumber > 0) {
        expect(getAssets.mock.calls[0]).toEqual([
          "hostTenant",
          null,
          "testAppContainerAssetId",
          "testAppAssetType",
        ]);
      }

      //Then users data should be fetched - without getFileContent - invoked during initialization - 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48
      expect(getFileContent).toHaveBeenCalledTimes(
        expectedGetFileContentCallNumber
      );
      if (expectedGetFileContentCallNumber > 0) {
        for (let parameters of expectedGetFileContentCallParameters) {
          expect(getFileContent.mock.calls).toContainEqual(parameters);
        }
      }

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let app = MindSphereAppsManager.getInstance().Apps[appId] as any;

      //Checking app only if it exists - ther are some cases where api calls about app that does not exist
      if (app != null) {
        let storagePayload = app._userStorage._cacheData;

        let allUsersPayload: any = {};

        let userFilePaths = Object.keys(
          expectedFileServiceContent["hostTenant"][`${appId}-asset-id`]
        ).filter((filePath) => filePath.includes(".user.config.json"));

        for (let userFilePath of userFilePaths) {
          let userFileContent =
            expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
              userFilePath
            ];
          let userId = userFilePath.replace(".user.config.json", "");
          allUsersPayload[userId] = {
            ...userFileContent,
          };
        }

        expect(storagePayload).toEqual(allUsersPayload);
      }

      //#endregion  =====  CHECKING STORAGE =====
    };

    it("should return 200 and local payload of user of the app", async () => {
      await testLocalUserGet();
    });

    it("should return 200 and local payload of user of the app - user is local user - app is subtenant", async () => {
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalUser22";
      plantId = "testPlant5";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      await testLocalUserGet();
    });

    it("should return 200 and local payload of user of the app - user is local admin - app is subtenant", async () => {
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalAdmin22";
      plantId = "testPlant5";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      await testLocalUserGet();
    });

    it("should return 200 and local payload of user of the app - user is global user - app is subtenant", async () => {
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testGlobalUser22";
      plantId = "testPlant5";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      await testLocalUserGet();
    });

    it("should return 200 and local payload of user of the app - user is global admin - app is subtenant", async () => {
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testGlobalAdmin22";
      plantId = "testPlant5";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      await testLocalUserGet();
    });

    it("should return 200 and local payload of user of the app - user is local user - app is tenant", async () => {
      appId = "ten-testTenant2";
      userId = "testLocalUser21";
      plantId = "testPlant2";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_21@user.name",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      await testLocalUserGet();
    });

    it("should return 200 and local payload of user of the app - user is local admin - app is tenant", async () => {
      appId = "ten-testTenant2";
      userId = "testLocalAdmin21";
      plantId = "testPlant2";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_21@user.name",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      await testLocalUserGet();
    });

    it("should return 200 and local payload of user of the app - user is global user - app is tenant", async () => {
      appId = "ten-testTenant2";
      userId = "testGlobalUser21";
      plantId = "testPlant2";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_21@user.name",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      await testLocalUserGet();
    });

    it("should return 200 and local payload of user of the app - user is global admin - app is tenant", async () => {
      appId = "ten-testTenant2";
      userId = "testGlobalAdmin21";
      plantId = "testPlant2";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_21@user.name",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      await testLocalUserGet();
    });

    it("should return 200 and local payload of user of the app - if user has only access to this plant", async () => {
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].data.testPlant6;
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].config.testPlant6;
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.plants.testPlant6;

      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUserGet();
    });

    it("should return 200 and local payload of user of the app - if user has access to multiple plants", async () => {
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].data.testPlant6 = { data: "fakePlantData" };

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].config.testPlant6 = { data: "fakePlantConfig" };
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.plants.testPlant6 = PlantPermissions.User;

      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUserGet();
    });

    it("should return 200 and local payload of user of the app - if user has user access to the plant", async () => {
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.User;

      await testLocalUserGet();
    });

    it("should return 200 and local payload of user of the app - if user has admin access to the plant", async () => {
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalAdmin22";

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      await testLocalUserGet();
    });

    it("should return 404 - if user has no access to the plant", async () => {
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].data[plantId];

      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].config[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.plants[plantId];

      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "User not found!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUserGet();
    });

    it("should return 404 - if user has invalid access to the plant", async () => {
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.plants[plantId] = 123;

      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "User not found!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUserGet();
    });

    it("should return 404 - if there is no plant of given id", async () => {
      plantId = "fakePlant";

      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";

      await testLocalUserGet();
    });

    it("should return 404 - if there is no user of given id in fileService in cache or in storage", async () => {
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ];

      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "User not found!";
      //One file less = config file of user
      expectedGetFileContentCallNumber = 47;
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUserGet();
    });

    it("should return 200 - if there is no user of given id in userService but he exists in file storage", async () => {
      delete userServiceContent["testTenant2"][userId];

      await testLocalUserGet();
    });

    it("should fetch user's data and return 200 - if there is no user of given id in cache but exists in storage", async () => {
      let oldUserPayload =
        fileServiceContent["hostTenant"][`${appId}-asset-id`][
          `${userId}.user.config.json`
        ];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ];

      //Initializing app without user's data
      await beforeExec();

      //Adding user's data
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = oldUserPayload;

      //Setting new file service content
      setFileServiceContent(fileServiceContent);

      let result = await request(server)
        .get(`/customApi/config/user/local/${appId}/${plantId}/${userId}`)
        .set(requestHeaders)
        .send();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(200);

      let expectedPayload = getUserDataResponse(
        appId,
        `${appId}-asset-id`,
        userId,
        plantId
      );

      expect(result.body).toEqual(expectedPayload);

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        userPayload.ten,
        userPayload.subtenant != null ? userPayload.subtenant : null,
        null,
        userPayload.user_name,
      ]);

      //Checking if app exists - should be invoked only one time during initalization
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //Then users data should be fetched - with get FileContent - invoked during initialization (47 times + 1 during fetching) - 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48
      expect(getFileContent).toHaveBeenCalledTimes(
        expectedGetFileContentCallNumber
      );
      expect(getFileContent.mock.calls[47]).toEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `${userId}.user.config.json`,
      ]);

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let storagePayload = (MindSphereAppsManager.getInstance().Apps[
        appId
      ] as any)._userStorage._cacheData;

      let allUsersPayload: any = {};

      let userFilePaths = Object.keys(
        fileServiceContent["hostTenant"][`${appId}-asset-id`]
      ).filter((filePath) => filePath.includes(".user.config.json"));

      for (let userFilePath of userFilePaths) {
        let userFileContent =
          fileServiceContent["hostTenant"][`${appId}-asset-id`][userFilePath];
        let userId = userFilePath.replace(".user.config.json", "");
        allUsersPayload[userId] = {
          ...userFileContent,
        };
      }

      expect(storagePayload).toEqual(allUsersPayload);

      //#endregion  =====  CHECKING STORAGE =====
    });

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should return 404 and not get user - if global admin without access to the given plant attempts to get the user", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].data[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].config[plantId];

      expectedFileServiceContent = cloneObject(fileServiceContent);

      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUserGet();
    });

    it("should return 404 and not get user - if global admin with user access to the given plant attempts to get the user", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.User;

      expectedFileServiceContent = cloneObject(fileServiceContent);

      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUserGet();
    });

    it("should return 200 and get user - if global admin with admin access to the given plant attempts to get the user", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUserGet();
    });

    it("should return 403 and not get user - if global user without access to the given plant attempts to get the user", async () => {
      userPayload = {
        client_id: "testGlobalUserClientId",
        email: "testGlobalUserEmail",
        scope: ["testGlobalUserScope"],
        ten: "testTenant2",
        user_name: "test_global_user_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].permissions.plants[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].data[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].config[plantId];

      expectedFileServiceContent = cloneObject(fileServiceContent);

      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global admin or local admin!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUserGet();
    });

    it("should return 403 and not get user - if global user with user access to the given plant attempts to get the user", async () => {
      userPayload = {
        client_id: "testGlobalUserClientId",
        email: "testGlobalUserEmail",
        scope: ["testGlobalUserScope"],
        ten: "testTenant2",
        user_name: "test_global_user_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      expectedFileServiceContent = cloneObject(fileServiceContent);

      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global admin or local admin!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUserGet();
    });

    it("should return 403 and not get user - if local admin without access to the given plant attempts to get the user", async () => {
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.plants[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].data[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].config[plantId];

      expectedFileServiceContent = cloneObject(fileServiceContent);

      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUserGet();
    });

    it("should return 403 and not get user - if local admin with user access to the given plant attempts to get the user", async () => {
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.User;

      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUserGet();
    });

    it("should return 200 and get user - if local admin with admin access to the given plant attempts to get the user", async () => {
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUserGet();
    });

    it("should return 403 and not get user - if local user without access to the given plant attempts to get the user", async () => {
      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_local_user_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ].permissions.plants[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ].data[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ].config[plantId];

      expectedFileServiceContent = cloneObject(fileServiceContent);

      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global admin or local admin!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUserGet();
    });

    it("should return 403 and not get user - if local user with user access to the given plant attempts to get the user", async () => {
      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_local_user_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      expectedFileServiceContent = cloneObject(fileServiceContent);

      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global admin or local admin!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUserGet();
    });

    it("should return 403 and not get the user - if user's jwt payload does not have tenant assigned", async () => {
      delete (userPayload as any).ten;

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Invalid application id generated from user payload!";
      expectedFileServiceContent = cloneObject(fileServiceContent);
      //GetAllUser should not be called - call ended before fetching user's data
      expectedGetAllUsersCallNumber = 0;

      await testLocalUserGet();
    });

    it("should return 403 and not get the user - if there is no application of given id", async () => {
      appId = "ten-fakeTen-sub-fakeSub";
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "fakeTen",
        user_name: "test_global_admin_22@user.name",
        subtenant: "fakeSub",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Application of given id not found for the user!";
      expectedFileServiceContent = cloneObject(fileServiceContent);
      //GetAllUser should not be called - call ended before fetching user's data
      expectedGetAllUsersCallNumber = 0;
      //GetAssets should be called x2 - try fetching fake app
      expectedGetAssetsCallNumber = 2;

      await testLocalUserGet();
    });

    it("should return 403 and not get the user - if app id in user's payload and param differs", async () => {
      appId = "ten-testTenant2";
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. No access to given application!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUserGet();
    });

    it("should return 403 and not get the user - if there is no application data for given app", async () => {
      delete fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["main.app.config.json"];

      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Main application settings not found for the user!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      //GetAllUser should not be called - call ended before fetching user's data
      expectedGetAllUsersCallNumber = 0;
      //47 calls of getFileContent - no file containing one main app data
      expectedGetFileContentCallNumber = 47;

      await testLocalUserGet();
    });

    it("should return 403 and not get the user - if user has valid scope, doest not exist in user service but exists in file service", async () => {
      //Adding user to file service for the app
      fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testFakeUser23.user.config.json"] = {
        data: {
          testPlant4: {
            testFakeUser23TestPlant4Data: "testFakeUser23TestPlant4DataValue",
          },
          testPlant5: {
            testFakeUser23TestPlant5Data: "testFakeUser23TestPlant5DataValue",
          },
        },
        config: {
          testPlant4: {
            testFakeUser23TestPlant4Config:
              "testFakeUser23TestPlant4ConfigValue",
          },
          testPlant5: {
            testFakeUser23TestPlant5Config:
              "testFakeUser23TestPlant5ConfigValue",
          },
        },
        userName: "test_fake_user_23@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant5: PlantPermissions.User,
            testPlant6: PlantPermissions.User,
          },
        },
      };

      //Creating new user's jwt payload
      userPayload = {
        client_id: "testFakeUserClientId",
        email: "testFakeUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_fake_user_23@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. User of given name not found!";
      expectedFileServiceContent = cloneObject(fileServiceContent);
      //49 calls of getFileContent - one additional user
      expectedGetFileContentCallNumber = 49;

      await testLocalUserGet();
    });

    it("should return 403 and not get the user - if user has valid scope, exists in user service but does not exist in file service", async () => {
      userServiceContent["testTenant2"]["testFakeUser23"] = {
        active: true,
        name: {
          familyName: "testFakeUser23FamilyName",
          givenName: "testFakeUser23GivenName",
        },
        userName: "test_fake_user_23@user.name",
        emails: [
          {
            value: "testFakeUser23Email",
          },
        ],
        groups: [],
        externalId: "testFakeUser23ExternalId",
        id: "testFakeUser23",
        subtenants: [
          {
            id: "subtenant2",
          },
        ],
      };

      userGroupServiceContent.testTenant2.globalAdminGroup.members.push({
        type: "USER",
        value: "testFakeUser23",
      });

      userGroupServiceContent.testTenant2.subtenantUserGroup.members.push({
        type: "USER",
        value: "testFakeUser23",
      });

      //Creating new user's jwt payload
      userPayload = {
        client_id: "testFakeUserClientId",
        email: "testFakeUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_fake_user_23@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User does not exist for given app id!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUserGet();
    });

    it("should return 403 and not get the user - if user has no access to the app - invalid scope", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["fakeScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22_user_name",
      };

      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Forbidden access. No scope found to access the app!";
      expectedFileServiceContent = cloneObject(fileServiceContent);
      //0 calls of getAllUsers - not fetching user's data - checking scope before fetching
      expectedGetAllUsersCallNumber = 0;

      await testLocalUserGet();
    });

    it("should return 403 and not get the user - if subtenant user attempts to get user for tenant app", async () => {
      appId = "ten-testTenant2";
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22@user.name",
        subtenant: "subtenant2",
      };

      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. No access to given application!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUserGet();
    });

    it("should return 403 and not get the user - if tenant user attempts to get user for subtenant app", async () => {
      appId = "ten-testTenant2-sub-subtenant2";
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_21@user.name",
      };

      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. No access to given application!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testLocalUserGet();
    });

    it("should return 401 - if authorization token is invalid - no bearer prefix", async () => {
      requestHeaders["authorization"] = jwt.sign(userPayload, "testPrivateKey");

      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";
      expectedFileServiceContent = cloneObject(fileServiceContent);
      //No calling getAllUsers - returning before fetching user's data
      expectedGetAllUsersCallNumber = 0;

      await testLocalUserGet();
    });

    it("should return 401 - if authorization token is invalid - invalid token", async () => {
      requestHeaders["authorization"] =
        "Bearer thisIsTheFakeValueOfTheJWTToken";

      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";
      expectedFileServiceContent = cloneObject(fileServiceContent);
      //No calling getAllUsers - returning before fetching user's data
      expectedGetAllUsersCallNumber = 0;

      await testLocalUserGet();
    });

    it("should return 401 - if authorization token is invalid - no token provided", async () => {
      delete requestHeaders["authorization"];

      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";
      expectedFileServiceContent = cloneObject(fileServiceContent);
      //No calling getAllUsers - returning before fetching user's data
      expectedGetAllUsersCallNumber = 0;

      await testLocalUserGet();
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========

    //#region ========== MINDSPHERE SERVICE THROWS ==========

    it("should return 500 and not get the user - if get all users throws", async () => {
      getAllUsersThrows = true;

      expectedValidCall = false;
      expectedResponseCode = 500;
      expectedErrorText = `Ups.. Something fails..`;
      expectedFileServiceContent = cloneObject(fileServiceContent);
      //0 calls for getAllUsers - becouse getAllUsers mock is overridden with a different mocked method
      expectedGetAllUsersCallNumber = 0;

      await testLocalUserGet();

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test get all users error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    it("should return 500 and not get the user - if there is no user in file storage cache but is in storage and getFileContent throws", async () => {
      let oldUserPayload =
        fileServiceContent["hostTenant"][`${appId}-asset-id`][
          `${userId}.user.config.json`
        ];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ];
      let oldFileServiceContent = cloneObject(fileServiceContent);

      //Initializing app without user's data
      await beforeExec();

      //Mocking get file content to throw
      MindSphereFileService.getInstance().getFileContent = jest.fn(async () => {
        throw new Error("Test get file content error");
      });

      //Adding user's data
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = oldUserPayload;

      //Setting new file service content
      setFileServiceContent(fileServiceContent);

      let result = await request(server)
        .get(`/customApi/config/user/local/${appId}/${plantId}/${userId}`)
        .set(requestHeaders)
        .send();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(500);

      expect(result.text).toEqual(`Ups.. Something fails..`);

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        userPayload.ten,
        userPayload.subtenant != null ? userPayload.subtenant : null,
        null,
        userPayload.user_name,
      ]);

      //Checking if app exists - should be invoked only one time during initalization
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //Then users data should be fetched - without one file - 47
      //48th call should not be taken into account - method overridden with throwing mock
      expect(getFileContent).toHaveBeenCalledTimes(47);

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      //Storage should be left without fetched data
      let storagePayload = (MindSphereAppsManager.getInstance().Apps[
        appId
      ] as any)._userStorage._cacheData;

      let allUsersPayload: any = {};

      let userFilePaths = Object.keys(
        oldFileServiceContent["hostTenant"][`${appId}-asset-id`]
      ).filter((filePath) => filePath.includes(".user.config.json"));

      for (let userFilePath of userFilePaths) {
        let userFileContent =
          oldFileServiceContent["hostTenant"][`${appId}-asset-id`][
            userFilePath
          ];
        let userId = userFilePath.replace(".user.config.json", "");
        allUsersPayload[userId] = {
          ...userFileContent,
        };
      }

      expect(storagePayload).toEqual(allUsersPayload);

      //#endregion  =====  CHECKING STORAGE =====

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test get file content error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    //#endregion ========== MINDSPHERE SERVICE THROWS ==========
  });

  describe("POST /local/:appId/:plantId/", () => {
    //Inputs
    let requestHeaders: any;
    let requestBody: any;
    let userPayload: MindSphereUserJWTData;
    let appId: string;
    let plantId: string;
    let getAllUsersThrows: boolean;
    let setFileContentThrows: boolean;
    let createUserThrows: boolean;

    //Outputs
    let expectedValidCall: boolean;
    let expectedResponseCode: number;
    let expectedErrorText: string | null;
    let expectedGetAllUsersCallNumber: number;
    let expectedGetAssetsCallNumber: number;
    let expectedGetFileContentCallNumber: number;
    let expectedSetFileContentCallNumber: number;
    let expectedCreateUserCallNumber: number;
    let expectedAddUserToGroupCallNumber: number;
    let expectedAddUserToGroupGroupIds: Array<string>;

    beforeEach(() => {
      //Inputs
      requestHeaders = {};
      appId = "ten-testTenant2-sub-subtenant2";
      plantId = "testPlant5";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      requestBody = {
        data: {
          testPlant5: {
            testFakeUser1TestPlant5Data: "testFakeUser1TestPlant5DataValue",
          },
        },
        config: {
          testPlant5: {
            testFakeUser1TestPlant5Config: "testFakeUser1TestPlant5ConfigValue",
          },
        },
        userName: "test_fake_user_1@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant5: PlantPermissions.User,
          },
        },
      };
      getAllUsersThrows = false;
      setFileContentThrows = false;
      createUserThrows = false;

      //Outputs
      expectedValidCall = true;
      expectedResponseCode = 200;
      expectedErrorText = null;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 1;
      expectedCreateUserCallNumber = 1;
      expectedAddUserToGroupCallNumber = 2;
      expectedAddUserToGroupGroupIds = ["subtenantUserGroup", "localUserGroup"];
    });

    let exec = async () => {
      await beforeExec();

      if (getAllUsersThrows) {
        MindSphereUserService.getInstance().getAllUsers = jest.fn(async () => {
          throw new Error("Test get all users error");
        });
      }

      if (setFileContentThrows) {
        MindSphereFileService.getInstance().setFileContent = jest.fn(
          async () => {
            throw new Error("Test set file content error");
          }
        );
      }

      if (createUserThrows) {
        MindSphereUserService.getInstance().createUser = jest.fn(async () => {
          throw new Error("Test create user error");
        });
      }

      return request(server)
        .post(`/customApi/config/user/local/${appId}/${plantId}`)
        .set(requestHeaders)
        .send(requestBody);
    };

    const testLocalUserPost = async () => {
      //#region ===== CHECKING RESPONSE =====

      let result = await exec();

      expect(result.status).toEqual(expectedResponseCode);

      if (expectedValidCall) {
        //Getting new created user id
        expect(result.body).toBeDefined();
        expect(result.body.userId).toBeDefined();

        let userId = result.body.userId;

        let expectedResponsePayload = {
          ...cloneObject(requestBody),
          appId: appId,
          userId: userId,
        };

        expect(result.body).toEqual(expectedResponsePayload);
      } else {
        expect(result.text).toEqual(expectedErrorText);
      }

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(expectedGetAllUsersCallNumber);
      if (expectedGetAllUsersCallNumber > 0) {
        expect(getAllUsers.mock.calls[0]).toEqual([
          userPayload.ten,
          userPayload.subtenant != null ? userPayload.subtenant : null,
          null,
          userPayload.user_name,
        ]);
      }

      //Checking if app exists - should be invoked only one time during initalization
      expect(getAssets).toHaveBeenCalledTimes(expectedGetAssetsCallNumber);
      if (expectedGetAssetsCallNumber > 0) {
        expect(getAssets.mock.calls[0]).toEqual([
          "hostTenant",
          null,
          "testAppContainerAssetId",
          "testAppAssetType",
        ]);
      }

      //Then users data should be fetched - without getFileContent - invoked during initialization - 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48
      expect(getFileContent).toHaveBeenCalledTimes(
        expectedGetFileContentCallNumber
      );

      //SetFileContent should have been called
      expect(setFileContent).toHaveBeenCalledTimes(
        expectedSetFileContentCallNumber
      );
      if (expectedSetFileContentCallNumber > 0) {
        let expectedParameters = [
          "hostTenant",
          `${appId}-asset-id`,
          `${result.body.userId}.user.config.json`,
          {
            ...cloneObject(requestBody),
          },
        ];
        expect(setFileContent.mock.calls).toContainEqual(expectedParameters);
      }

      //CreateUser should have been called
      expect(createUser).toHaveBeenCalledTimes(expectedCreateUserCallNumber);
      if (expectedCreateUserCallNumber > 0) {
        let expectedMSData: MindSphereUserData = {
          active: true,
          name: {},
          userName: requestBody.userName,
        };

        //Appending subtenant Id if app is assigned to subtenancy
        if (userPayload.subtenant != null)
          expectedMSData.subtenants = [
            {
              id: userPayload.subtenant,
            },
          ];

        let expectedParameters = ["testTenant2", expectedMSData];
        expect(createUser.mock.calls).toContainEqual(expectedParameters);
      }

      //User should be added to proper groups
      expect(addUserToGroup).toHaveBeenCalledTimes(
        expectedAddUserToGroupCallNumber
      );
      if (expectedAddUserToGroupCallNumber > 0) {
        let userId = (await createUser.mock.results[0].value).id;
        for (let userGroupId of expectedAddUserToGroupGroupIds) {
          expect(addUserToGroup.mock.calls).toContainEqual([
            userPayload.ten,
            userGroupId,
            userId,
          ]);
        }
      }

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let app = MindSphereAppsManager.getInstance().Apps[appId] as any;

      //Checking app only if it exists - ther are some cases where api calls about app that does not exist
      if (app != null) {
        let storagePayload = app._userStorage._cacheData;

        let allUsersPayload: any = {};

        let userFilePaths = Object.keys(
          fileServiceContent["hostTenant"][`${appId}-asset-id`]
        ).filter((filePath) => filePath.includes(".user.config.json"));

        for (let userFilePath of userFilePaths) {
          let userFileContent =
            fileServiceContent["hostTenant"][`${appId}-asset-id`][userFilePath];
          let userId = userFilePath.replace(".user.config.json", "");
          allUsersPayload[userId] = {
            ...userFileContent,
          };
        }

        //If creation was successfull - new created user should exists in payload
        if (expectedValidCall) {
          allUsersPayload[result.body.userId] = {
            ...requestBody,
          };
        }

        expect(storagePayload).toEqual(allUsersPayload);
      }

      //#endregion  =====  CHECKING STORAGE =====
    };

    it("should create user and return 200 with local payload of created user", async () => {
      await testLocalUserPost();
    });

    it("should create user and return 200 with local payload of created user - app is subtenant app", async () => {
      appId = "ten-testTenant2-sub-subtenant2";
      plantId = "testPlant5";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      requestBody = {
        data: {
          testPlant5: {
            testFakeUser1TestPlant5Data: "testFakeUser1TestPlant5DataValue",
          },
        },
        config: {
          testPlant5: {
            testFakeUser1TestPlant5Config: "testFakeUser1TestPlant5ConfigValue",
          },
        },
        userName: "test_fake_user_1@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant5: PlantPermissions.User,
          },
        },
      };

      await testLocalUserPost();
    });

    it("should create user and return 200 with local payload of created user - app is tenant app", async () => {
      appId = "ten-testTenant2";
      plantId = "testPlant2";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_21@user.name",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      requestBody = {
        data: {
          testPlant2: {
            testFakeUser1TestPlant2Data: "testFakeUser1TestPlant2DataValue",
          },
        },
        config: {
          testPlant2: {
            testFakeUser1TestPlant2Config: "testFakeUser1TestPlant2ConfigValue",
          },
        },
        userName: "test_fake_user_1@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant2: PlantPermissions.User,
          },
        },
      };

      expectedAddUserToGroupGroupIds = ["standardUserGroup", "localUserGroup"];

      await testLocalUserPost();
    });

    it("should not create user and return 400 - if user of given username already exists in user service and in file storage", async () => {
      //Inputs
      requestBody.userName = "test_local_user_22@user.name";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `User of name: test_local_user_22@user.name - already exists!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should not create user and return 400 - if user of given username already exists in user service but not in in file storage", async () => {
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ];

      //Inputs
      requestBody.userName = "test_local_user_22@user.name";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `User of name: test_local_user_22@user.name - already exists!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      //One user less
      expectedGetFileContentCallNumber = 47;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should not create user and return 400 - if number of users extends limit for the app", async () => {
      //Inputs
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `main.app.config.json`
      ].maxNumberOfUsers = 4;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `Max number of users: 4 reached`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should not create user and return 400 - if number of users is already above the limit", async () => {
      //Inputs
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `main.app.config.json`
      ].maxNumberOfUsers = 3;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `Max number of users: 3 reached`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should create user and return 200 - if number of users limit is null (no limit)", async () => {
      //Inputs
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `main.app.config.json`
      ].maxNumberOfUsers = null;

      await testLocalUserPost();
    });

    //#region ========== BODY VALIDATION =========

    it("should return 400 - if request is not a valid JSON", async () => {
      requestBody = "fakeBody";

      await beforeExec();

      let result = await request(server)
        .post(`/customApi/config/user/local/${appId}/${plantId}`)
        .send('{"invalid"}')
        .type("json");

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(400);
      expect(result.text).toEqual("Invalid request content");

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should not have been fetched - quiting before checking the user
      expect(getAllUsers).not.toHaveBeenCalled();

      //Checking if app exists - should be invoked only one time during initalization
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //Then users data should be fetched - without getFileContent - invoked during initialization - 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48
      expect(getFileContent).toHaveBeenCalledTimes(48);

      //SetFileContent should not have been called
      expect(setFileContent).not.toHaveBeenCalled();

      //CreateUser should not have been called
      expect(createUser).not.toHaveBeenCalled();

      //AddUserToGroup should not have been called
      expect(addUserToGroup).not.toHaveBeenCalled();

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      //Storage should not have changed
      let app = MindSphereAppsManager.getInstance().Apps[appId] as any;

      let storagePayload = app._userStorage._cacheData;

      let allUsersPayload: any = {};

      let userFilePaths = Object.keys(
        fileServiceContent["hostTenant"][`${appId}-asset-id`]
      ).filter((filePath) => filePath.includes(".user.config.json"));

      for (let userFilePath of userFilePaths) {
        let userFileContent =
          fileServiceContent["hostTenant"][`${appId}-asset-id`][userFilePath];
        let userId = userFilePath.replace(".user.config.json", "");
        allUsersPayload[userId] = {
          ...userFileContent,
        };
      }

      expect(storagePayload).toEqual(allUsersPayload);

      //#endregion  =====  CHECKING STORAGE =====
    });

    it("should return 400 and not create new user - if there is an attempt to create user with user id", async () => {
      //Inputs
      requestBody.userId = "fakeUserId";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"userId" is not allowed`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if there is an attempt to create user with app id", async () => {
      //Inputs
      requestBody.appId = "fakeAppId";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"appId" is not allowed`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if userName is not defined", async () => {
      delete requestBody.userName;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"userName" is required`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if userName is null", async () => {
      requestBody.userName = null;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"userName" must be a string`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if userName has invalid type (number)", async () => {
      requestBody.userName = 1234;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"userName" must be a string`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if userName is invalid email", async () => {
      requestBody.userName = "fakeEmailValue";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"userName" must be a valid email`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if data is undefined", async () => {
      delete requestBody.data;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"data" is required`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if data is null", async () => {
      requestBody.data = null;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"data" must be of type object`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if data has invalid type (string)", async () => {
      requestBody.data = "testData";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"data" must be of type object`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if data is an empty object - permissions of plants exist", async () => {
      requestBody.data = {};

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `User data invalid - plantIds in data and in permissions must be identical!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if data is an empty object - permissions of plants don't exist", async () => {
      requestBody.data = {};
      requestBody.config = {};
      requestBody.permissions.plants = {};

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `Cannot create user with access to different plants locally!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 200 and create new user - if data has nested properties ", async () => {
      //Creating nested properties
      requestBody.data = {
        testPlant5: {
          a: {
            b: {
              c: {
                d: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
              },
            },
          },
          e: {
            f: {
              g: {
                h: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
              },
            },
          },
        },
      };

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if data is not an empty object - permissions of plants don't exist", async () => {
      requestBody.config = {};
      requestBody.permissions.plants = {};

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `User data invalid - plantIds in data and in permissions must be identical!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if data has additional plant id", async () => {
      requestBody.data["fakePlantId"] = { test: 1234 };

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `User data invalid - plantIds in data and in permissions must be identical!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if config is undefined", async () => {
      delete requestBody.config;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"config" is required`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if config is null", async () => {
      requestBody.config = null;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"config" must be of type object`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if config has invalid type (string)", async () => {
      requestBody.config = "testData";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"config" must be of type object`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if config is an empty object - permissions of plants exist", async () => {
      requestBody.config = {};

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `User config invalid - plantIds in config and in permissions must be identical!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if config is an empty object - permissions of plants don't exist", async () => {
      requestBody.data = {};
      requestBody.config = {};
      requestBody.permissions.plants = {};

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `Cannot create user with access to different plants locally!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 200 and not create new user - if config has nested properties ", async () => {
      //Creating nested properties
      requestBody.config = {
        testPlant5: {
          a: {
            b: {
              c: {
                d: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
              },
            },
          },
          e: {
            f: {
              g: {
                h: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
              },
            },
          },
        },
      };

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if config is not an empty object - permissions of plants don't exist", async () => {
      requestBody.data = {};
      requestBody.permissions.plants = {};

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `User config invalid - plantIds in config and in permissions must be identical!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if config has additional plant id", async () => {
      requestBody.config["fakePlantId"] = { test: 1234 };

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `User config invalid - plantIds in config and in permissions must be identical!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if permissions is undefined", async () => {
      delete requestBody.permissions;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions" is required`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if permissions is null", async () => {
      requestBody.permissions = null;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions" must be of type object`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if permissions has invalid type (string)", async () => {
      requestBody.permissions = "testData";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions" must be of type object`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if permissions.role is undefined", async () => {
      delete requestBody.permissions.role;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions.role" is required`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if permissions.role is null", async () => {
      requestBody.permissions.role = null;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions.role" must be one of [0, 1, 2, 3]`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if permissions.role has invalid type (string)", async () => {
      requestBody.permissions.role = "testData";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions.role" must be one of [0, 1, 2, 3]`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if permissions.role has invalid value", async () => {
      requestBody.permissions.role = 5;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions.role" must be one of [0, 1, 2, 3]`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if permissions.role is a global admin", async () => {
      requestBody.permissions.role = UserRole.GlobalAdmin;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `Cannot create user with global access locally!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if permissions.role is a global user", async () => {
      requestBody.permissions.role = UserRole.GlobalUser;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `Cannot create user with global access locally!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 200 and create new user - if permissions.role is a local admin", async () => {
      requestBody.permissions.role = UserRole.LocalAdmin;

      //Outputs
      expectedAddUserToGroupGroupIds = [
        "subtenantUserGroup",
        "localAdminGroup",
      ];

      await testLocalUserPost();
    });

    it("should return 200 and create new user - if permissions.role is a local user", async () => {
      requestBody.permissions.role = UserRole.LocalAdmin;

      //Outputs
      expectedAddUserToGroupGroupIds = [
        "subtenantUserGroup",
        "localAdminGroup",
      ];

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if permissions.plants is undefined", async () => {
      delete requestBody.permissions.plants;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions.plants" is required`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if permissions.plants is null", async () => {
      requestBody.permissions.plants = null;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions.plants" must be of type object`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if permissions.plants has invalid type (string)", async () => {
      requestBody.permissions.plants = "testData";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions.plants" must be of type object`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if permissions.plants is an empty object - permissions exists in config and data", async () => {
      requestBody.permissions.plants = {};

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `User config invalid - plantIds in config and in permissions must be identical!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if permissions.plants is an empty object - permissions does not exist in config and data", async () => {
      requestBody.data = {};
      requestBody.config = {};
      requestBody.permissions.plants = {};

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `Cannot create user with access to different plants locally!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if permissions.plants has one additional plant - permissions exists in config and data", async () => {
      requestBody.permissions.plants["fakePlant"] = 1;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `User config invalid - plantIds in config and in permissions must be identical!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if permissions.plants of one plant is null", async () => {
      requestBody.permissions.plants["fakePlant"] = null;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions.plants.fakePlant" must be one of [0, 1]`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if permissions.plants of one plant has invalid type - string", async () => {
      requestBody.permissions.plants["fakePlant"] = "abcd1234";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions.plants.fakePlant" must be one of [0, 1]`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if permissions.plants of one plant has invalid number - float", async () => {
      requestBody.permissions.plants["fakePlant"] = 0.123;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions.plants.fakePlant" must be one of [0, 1]`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if permissions.plants of one plant has invalid number - below 0", async () => {
      requestBody.permissions.plants["fakePlant"] = -1;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions.plants.fakePlant" must be one of [0, 1]`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if permissions.plants of one plant has invalid number - above 1", async () => {
      requestBody.permissions.plants["fakePlant"] = 2;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions.plants.fakePlant" must be one of [0, 1]`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if role is a globalUser but permissions to plant is an admin", async () => {
      requestBody.permissions.role = UserRole.GlobalUser;
      requestBody.permissions.plants = {
        testPlant5: PlantPermissions.Admin,
      };

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `Users role should be a local or global admin, if they have administrative permissions for a plant!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if role is a localUser but permissions to plant is an admin", async () => {
      requestBody.permissions.role = UserRole.LocalUser;
      requestBody.permissions.plants = {
        testPlant5: PlantPermissions.Admin,
      };

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `Users role should be a local or global admin, if they have administrative permissions for a plant!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if there is an attempt to create local user with access to several plants locally", async () => {
      requestBody.permissions.role = UserRole.LocalUser;
      requestBody.permissions.plants = {
        testPlant4: PlantPermissions.User,
        testPlant5: PlantPermissions.User,
      };
      requestBody.data = {
        testPlant4: { fakeData: 123 },
        testPlant5: { fakeData: 123 },
      };
      requestBody.config = {
        testPlant4: { fakeData: 123 },
        testPlant5: { fakeData: 123 },
      };

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `Cannot create user with access to different plants locally!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not create new user - if there is an attempt to create local admin with access to several plants locally", async () => {
      requestBody.permissions.role = UserRole.LocalAdmin;
      requestBody.permissions.plants = {
        testPlant4: PlantPermissions.User,
        testPlant5: PlantPermissions.Admin,
      };
      requestBody.data = {
        testPlant4: { fakeData: 123 },
        testPlant5: { fakeData: 123 },
      };
      requestBody.config = {
        testPlant4: { fakeData: 123 },
        testPlant5: { fakeData: 123 },
      };

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `Cannot create user with access to different plants locally!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    //#endregion ========== BODY VALIDATION =========

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should return 404 and not create user - if global admin without access to the given plant attempts to create the user", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].data[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].config[plantId];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 404 and not create user - if global admin with user access to the given plant attempts to create the user", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.User;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 200 and create user - if global admin with admin access to the given plant attempts to create the user", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      await testLocalUserPost();
    });

    it("should return 403 and not create the user - if global user without access to the given plant attempts to create the user", async () => {
      userPayload = {
        client_id: "testGlobalUserClientId",
        email: "testGlobalUserEmail",
        scope: ["testGlobalUserScope"],
        ten: "testTenant2",
        user_name: "test_global_user_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].permissions.plants[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].data[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].config[plantId];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global admin or local admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 403 and not create the user - if global user with user access to the given plant attempts to create the user", async () => {
      userPayload = {
        client_id: "testGlobalUserClientId",
        email: "testGlobalUserEmail",
        scope: ["testGlobalUserScope"],
        ten: "testTenant2",
        user_name: "test_global_user_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global admin or local admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 404 and not create the user - if local admin without access to the given plant attempts to create the user", async () => {
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.plants[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].data[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].config[plantId];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 404 and not create the user - if local admin with user access to the given plant attempts to create the user", async () => {
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.User;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 200 and create the user - if local admin with admin access to the given plant attempts to create the user", async () => {
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      await testLocalUserPost();
    });

    it("should return 403 and not create the user - if local user without access to the given plant attempts to create the user", async () => {
      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_local_user_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ].permissions.plants[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ].data[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ].config[plantId];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global admin or local admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 403 and not create the user - if local user with user access to the given plant attempts to create the user", async () => {
      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_local_user_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global admin or local admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 403 and not create the user - if user's jwt payload does not have tenant assigned", async () => {
      delete (userPayload as any).ten;

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Invalid application id generated from user payload!";
      //GetAllUser should not be called - call ended before fetching user's data
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 403 and not create the user - if there is no application of given id", async () => {
      appId = "ten-fakeTen-sub-fakeSub";
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "fakeTen",
        user_name: "test_global_admin_22@user.name",
        subtenant: "fakeSub",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Application of given id not found for the user!";
      //GetAllUser should not be called - call ended before fetching user's data
      expectedGetAllUsersCallNumber = 0;
      //GetAssets should be called x2 - try fetching fake app
      expectedGetAssetsCallNumber = 2;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 403 and not create the user - if app id in user's payload and param differs", async () => {
      appId = "ten-testTenant2";
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. No access to given application!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 403 and not create the user - if there is no application data for given app", async () => {
      delete fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["main.app.config.json"];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Main application settings not found for the user!";
      //GetAllUser should not be called - call ended before fetching user's data
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      //47 calls of getFileContent - no file containing one main app data
      expectedGetFileContentCallNumber = 47;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 403 and not create the user - if user has valid scope, doest not exist in user service but exists in file service", async () => {
      //Adding user to file service for the app
      fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testFakeUser23.user.config.json"] = {
        data: {
          testPlant4: {
            testFakeUser23TestPlant4Data: "testFakeUser23TestPlant4DataValue",
          },
          testPlant5: {
            testFakeUser23TestPlant5Data: "testFakeUser23TestPlant5DataValue",
          },
        },
        config: {
          testPlant4: {
            testFakeUser23TestPlant4Config:
              "testFakeUser23TestPlant4ConfigValue",
          },
          testPlant5: {
            testFakeUser23TestPlant5Config:
              "testFakeUser23TestPlant5ConfigValue",
          },
        },
        userName: "test_fake_user_23@user.name",
        permissions: {
          role: UserRole.LocalAdmin,
          plants: {
            testPlant5: PlantPermissions.Admin,
            testPlant6: PlantPermissions.Admin,
          },
        },
      };

      //Creating new user's jwt payload
      userPayload = {
        client_id: "testFakeUserClientId",
        email: "testFakeUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_fake_user_23@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. User of given name not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      //49 calls of getFileContent - one additional user
      expectedGetFileContentCallNumber = 49;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 403 and not create the user - if user has valid scope, exists in user service but does not exist in file service", async () => {
      userServiceContent["testTenant2"]["testFakeUser23"] = {
        active: true,
        name: {
          familyName: "testFakeUser23FamilyName",
          givenName: "testFakeUser23GivenName",
        },
        userName: "test_fake_user_23@user.name",
        emails: [
          {
            value: "testFakeUser23Email",
          },
        ],
        groups: [],
        externalId: "testFakeUser23ExternalId",
        id: "testFakeUser23",
        subtenants: [
          {
            id: "subtenant2",
          },
        ],
      };

      userGroupServiceContent.testTenant2.globalAdminGroup.members.push({
        type: "USER",
        value: "testFakeUser23",
      });

      userGroupServiceContent.testTenant2.subtenantUserGroup.members.push({
        type: "USER",
        value: "testFakeUser23",
      });

      //Creating new user's jwt payload
      userPayload = {
        client_id: "testFakeUserClientId",
        email: "testFakeUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_fake_user_23@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User does not exist for given app id!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 403 and not create the user - if user has no access to the app - invalid scope", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["fakeScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22_user_name",
      };

      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Forbidden access. No scope found to access the app!";
      //0 calls of getAllUsers - not fetching user's data - checking scope before fetching
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 403 and not create the user - if subtenant user attempts to create user for tenant app", async () => {
      appId = "ten-testTenant2";
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22@user.name",
        subtenant: "subtenant2",
      };

      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. No access to given application!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 403 and not create the user - if tenant user attempts to create user for subtenant app", async () => {
      appId = "ten-testTenant2-sub-subtenant2";
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_21@user.name",
      };

      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. No access to given application!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 401 - if authorization token is invalid - no bearer prefix", async () => {
      requestHeaders["authorization"] = jwt.sign(userPayload, "testPrivateKey");

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";
      //No calling getAllUsers - returning before fetching user's data
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 401 - if authorization token is invalid - invalid token", async () => {
      requestHeaders["authorization"] =
        "Bearer thisIsTheFakeValueOfTheJWTToken";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";
      //No calling getAllUsers - returning before fetching user's data
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 401 - if authorization token is invalid - no token provided", async () => {
      delete requestHeaders["authorization"];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";
      //No calling getAllUsers - returning before fetching user's data
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========

    //#region ========== MINDSPHERE SERVICE THROWS ==========

    it("should return 500 and not create the user - if get all users throws", async () => {
      getAllUsersThrows = true;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 500;
      expectedErrorText = `Ups.. Something fails..`;
      //0 calls for getAllUsers - becouse getAllUsers mock is overridden with a different mocked method
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test get all users error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    it("should return 500 and not create the user - if createUser throws", async () => {
      createUserThrows = true;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 500;
      expectedErrorText = `Ups.. Something fails..`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      //0 calls for createUser - becouse createUser mock is overridden with a different mocked method
      expectedCreateUserCallNumber = 0;
      expectedAddUserToGroupCallNumber = 0;

      await testLocalUserPost();

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test create user error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    it("should return 500, create in mindphere but not create user locally - if set file content throws", async () => {
      setFileContentThrows = true;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 500;
      expectedErrorText = `Ups.. Something fails..`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //0 calls for setFileContent - becouse setFileContent mock is overridden with a different mocked method
      expectedSetFileContentCallNumber = 0;
      expectedCreateUserCallNumber = 1;
      expectedAddUserToGroupCallNumber = 2;

      await testLocalUserPost();

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test set file content error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    //#endregion ========== MINDSPHERE SERVICE THROWS ==========
  });

  describe("PUT /local/:appId/:plantId/:userId", () => {
    //Inputs
    let requestHeaders: any;
    let requestBody: any;
    let userPayload: MindSphereUserJWTData;
    let appId: string;
    let plantId: string;
    let getAllUsersThrows: boolean;
    let setFileContentThrows: boolean;
    let userId: string;

    //Outputs
    let expectedValidCall: boolean;
    let expectedResponseCode: number;
    let expectedErrorText: string | null;
    let expectedGetAllUsersCallNumber: number;
    let expectedGetAssetsCallNumber: number;
    let expectedGetFileContentCallNumber: number;
    let expectedSetFileContentCallNumber: number;

    beforeEach(() => {
      //Inputs
      requestHeaders = {};
      appId = "ten-testTenant2-sub-subtenant2";
      plantId = "testPlant5";
      userId = "testLocalUser22";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      requestBody = {
        data: {
          testPlant5: {
            testLocalUser22TestPlant5Data:
              "testLocalUser22TestPlant5DataModifiedValue",
          },
        },
        config: {
          testPlant5: {
            testLocalUser22TestPlant5Config:
              "testLocalUser22TestPlant5ConfigModifiedValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant5: PlantPermissions.User,
          },
        },
      };
      getAllUsersThrows = false;
      setFileContentThrows = false;

      //Outputs
      expectedValidCall = true;
      expectedResponseCode = 200;
      expectedErrorText = null;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 1;
    });

    let exec = async () => {
      await beforeExec();

      if (getAllUsersThrows) {
        MindSphereUserService.getInstance().getAllUsers = jest.fn(async () => {
          throw new Error("Test get all users error");
        });
      }

      if (setFileContentThrows) {
        MindSphereFileService.getInstance().setFileContent = jest.fn(
          async () => {
            throw new Error("Test set file content error");
          }
        );
      }

      return request(server)
        .put(`/customApi/config/user/local/${appId}/${plantId}/${userId}`)
        .set(requestHeaders)
        .send(requestBody);
    };

    const testLocalUserPost = async () => {
      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(expectedResponseCode);

      if (expectedValidCall) {
        //Getting new created user id
        expect(result.body).toBeDefined();
        expect(result.body.userId).toBeDefined();

        let userId = result.body.userId;

        let expectedResponsePayload = {
          ...cloneObject(requestBody),
          appId: appId,
          userId: userId,
        };

        expect(result.body).toEqual(expectedResponsePayload);
      } else {
        expect(result.text).toEqual(expectedErrorText);
      }

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(expectedGetAllUsersCallNumber);
      if (expectedGetAllUsersCallNumber > 0) {
        expect(getAllUsers.mock.calls[0]).toEqual([
          userPayload.ten,
          userPayload.subtenant != null ? userPayload.subtenant : null,
          null,
          userPayload.user_name,
        ]);
      }

      //Checking if app exists - should be invoked only one time during initalization
      expect(getAssets).toHaveBeenCalledTimes(expectedGetAssetsCallNumber);
      if (expectedGetAssetsCallNumber > 0) {
        expect(getAssets.mock.calls[0]).toEqual([
          "hostTenant",
          null,
          "testAppContainerAssetId",
          "testAppAssetType",
        ]);
      }

      //Then users data should be fetched - without getFileContent - invoked during initialization - 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48
      expect(getFileContent).toHaveBeenCalledTimes(
        expectedGetFileContentCallNumber
      );

      //SetFileContent should have been called
      expect(setFileContent).toHaveBeenCalledTimes(
        expectedSetFileContentCallNumber
      );
      if (expectedSetFileContentCallNumber > 0) {
        let expectedNewFileContent = cloneObject(
          fileServiceContent["hostTenant"][`${appId}-asset-id`][
            `${userId}.user.config.json`
          ]
        );
        //only values for local plant should have been updated
        expectedNewFileContent.data[plantId] = requestBody.data[plantId];
        expectedNewFileContent.config[plantId] = requestBody.config[plantId];
        expectedNewFileContent.permissions.role = requestBody.permissions.role;
        expectedNewFileContent.permissions.plants[plantId] =
          requestBody.permissions.plants[plantId];

        let expectedParameters = [
          "hostTenant",
          `${appId}-asset-id`,
          `${result.body.userId}.user.config.json`,
          expectedNewFileContent,
        ];

        expect(setFileContent.mock.calls).toContainEqual(expectedParameters);
      }

      //Local update of roles and permissions is forbidden - therefore both addUserToGroup and removeUserFromGroup should not have been called
      expect(addUserToGroup).not.toHaveBeenCalled();
      expect(removeUserFromGroup).not.toHaveBeenCalled();

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let app = MindSphereAppsManager.getInstance().Apps[appId] as any;

      //Checking app only if it exists - ther are some cases where api calls about app that does not exist
      if (app != null) {
        let storagePayload = app._userStorage._cacheData;

        let allUsersPayload: any = {};

        let userFilePaths = Object.keys(
          fileServiceContent["hostTenant"][`${appId}-asset-id`]
        ).filter((filePath) => filePath.includes(".user.config.json"));

        for (let userFilePath of userFilePaths) {
          let userFileContent =
            fileServiceContent["hostTenant"][`${appId}-asset-id`][userFilePath];
          let userId = userFilePath.replace(".user.config.json", "");
          allUsersPayload[userId] = cloneObject(userFileContent);
        }

        //If creation was successfull - updated user should exists - but only values for local plant should have been updated
        if (expectedValidCall) {
          allUsersPayload[result.body.userId] = cloneObject(
            allUsersPayload[result.body.userId]
          );
          allUsersPayload[result.body.userId].data[plantId] =
            requestBody.data[plantId];
          allUsersPayload[result.body.userId].config[plantId] =
            requestBody.config[plantId];
          allUsersPayload[result.body.userId].permissions.role =
            requestBody.permissions.role;
          allUsersPayload[result.body.userId].permissions.plants[plantId] =
            requestBody.permissions.plants[plantId];
        }

        expect(storagePayload).toEqual(allUsersPayload);
      }

      //#endregion  =====  CHECKING STORAGE =====
    };

    it("should update user and return 200 with new local payload of updated user", async () => {
      await testLocalUserPost();
    });

    it("should update user and return 200 with new local payload of updated user - if app is subtenant app", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      plantId = "testPlant5";
      userId = "testLocalUser22";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      requestBody = {
        data: {
          testPlant5: {
            testLocalUser22TestPlant5Data:
              "testLocalUser22TestPlant5DataModifiedValue",
          },
        },
        config: {
          testPlant5: {
            testLocalUser22TestPlant5Config:
              "testLocalUser22TestPlant5ConfigModifiedValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant5: PlantPermissions.User,
          },
        },
      };

      //Outputs
      expectedValidCall = true;
      expectedResponseCode = 200;
      expectedErrorText = null;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 1;

      await testLocalUserPost();
    });

    it("should update user and return 200 with new local payload of updated user - if app is a tenant app", async () => {
      //Inputs
      appId = "ten-testTenant2";
      plantId = "testPlant2";
      userId = "testLocalUser21";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_21@user.name",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      requestBody = {
        data: {
          testPlant2: {
            testLocalUser21TestPlant2Data:
              "testLocalUser21TestPlant2DataModifiedValue",
          },
        },
        config: {
          testPlant2: {
            testLocalUser21TestPlant2Config:
              "testLocalUser21TestPlant2ConfigModifiedValue",
          },
        },
        userName: "test_local_user_21@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant2: PlantPermissions.User,
          },
        },
      };

      //Outputs
      expectedValidCall = true;
      expectedResponseCode = 200;
      expectedErrorText = null;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 1;

      await testLocalUserPost();
    });

    it("should not update user and return 404 - if there is no user of given id", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      plantId = "testPlant5";
      userId = "fakeUserId";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = `User not found!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should not update user and return 404 - if user exists in fileService, but does not exist in userService", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      plantId = "testPlant5";
      userId = "testLocalUser22";
      delete userServiceContent["testTenant2"][userId];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = `User of name: test_local_user_22@user.name does not exist in tenant!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should fetch and update user and return 200 - if user exists in fileService in storage but not in cache, and exists in userService", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      plantId = "testPlant5";
      userId = "testLocalUser22";
      let oldUserPayload =
        fileServiceContent["hostTenant"][`${appId}-asset-id`][
          `${userId}.user.config.json`
        ];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ];

      await beforeExec();

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = oldUserPayload;
      setFileServiceContent(fileServiceContent);

      let result = await request(server)
        .put(`/customApi/config/user/local/${appId}/${plantId}/${userId}`)
        .set(requestHeaders)
        .send(requestBody);

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(expectedResponseCode);

      //Getting new created user id
      expect(result.body).toBeDefined();

      let expectedResponsePayload = {
        ...cloneObject(requestBody),
        appId: appId,
        userId: userId,
      };

      expect(result.body).toEqual(expectedResponsePayload);

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(expectedGetAllUsersCallNumber);
      if (expectedGetAllUsersCallNumber > 0) {
        expect(getAllUsers.mock.calls[0]).toEqual([
          userPayload.ten,
          userPayload.subtenant != null ? userPayload.subtenant : null,
          null,
          userPayload.user_name,
        ]);
      }

      //Checking if app exists - should be invoked only one time during initalization
      expect(getAssets).toHaveBeenCalledTimes(expectedGetAssetsCallNumber);
      if (expectedGetAssetsCallNumber > 0) {
        expect(getAssets.mock.calls[0]).toEqual([
          "hostTenant",
          null,
          "testAppContainerAssetId",
          "testAppAssetType",
        ]);
      }

      //Then users data should be fetched - during call
      expect(getFileContent).toHaveBeenCalledTimes(48);
      expect(getFileContent.mock.calls[47]).toEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `${userId}.user.config.json`,
      ]);

      //SetFileContent should have been called
      expect(setFileContent).toHaveBeenCalledTimes(1);
      let expectedNewFileContent = cloneObject(
        fileServiceContent["hostTenant"][`${appId}-asset-id`][
          `${userId}.user.config.json`
        ]
      );
      //only values for local plant should have been updated
      expectedNewFileContent.data[plantId] = requestBody.data[plantId];
      expectedNewFileContent.config[plantId] = requestBody.config[plantId];
      expectedNewFileContent.permissions.role = requestBody.permissions.role;
      expectedNewFileContent.permissions.plants[plantId] =
        requestBody.permissions.plants[plantId];

      let expectedParameters = [
        "hostTenant",
        `${appId}-asset-id`,
        `${result.body.userId}.user.config.json`,
        expectedNewFileContent,
      ];

      expect(setFileContent.mock.calls[0]).toEqual(expectedParameters);

      //Local update of roles and permissions is forbidden - therefore both addUserToGroup and removeUserFromGroup should not have been called
      expect(addUserToGroup).not.toHaveBeenCalled();
      expect(removeUserFromGroup).not.toHaveBeenCalled();

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let app = MindSphereAppsManager.getInstance().Apps[appId] as any;

      //Checking app only if it exists - ther are some cases where api calls about app that does not exist
      if (app != null) {
        let storagePayload = app._userStorage._cacheData;

        let allUsersPayload: any = {};

        let userFilePaths = Object.keys(
          fileServiceContent["hostTenant"][`${appId}-asset-id`]
        ).filter((filePath) => filePath.includes(".user.config.json"));

        for (let userFilePath of userFilePaths) {
          let userFileContent =
            fileServiceContent["hostTenant"][`${appId}-asset-id`][userFilePath];
          let userId = userFilePath.replace(".user.config.json", "");
          allUsersPayload[userId] = cloneObject(userFileContent);
        }

        allUsersPayload[result.body.userId] = cloneObject(
          allUsersPayload[result.body.userId]
        );
        allUsersPayload[result.body.userId].data[plantId] =
          requestBody.data[plantId];
        allUsersPayload[result.body.userId].config[plantId] =
          requestBody.config[plantId];
        allUsersPayload[result.body.userId].permissions.role =
          requestBody.permissions.role;
        allUsersPayload[result.body.userId].permissions.plants[plantId] =
          requestBody.permissions.plants[plantId];

        expect(storagePayload).toEqual(allUsersPayload);
      }

      //#endregion  =====  CHECKING STORAGE =====
    });

    it("should not update user and return 404 - if there is no plantId of given id", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      plantId = "fakePlant";
      userId = "testLocalUser22";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    //#region ========== BODY VALIDATION =========

    it("should return 400 - if request is not a valid JSON", async () => {
      requestBody = "fakeBody";

      await beforeExec();

      let result = await request(server)
        .put(`/customApi/config/user/local/${appId}/${plantId}`)
        .send('{"invalid"}')
        .type("json");

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(400);
      expect(result.text).toEqual("Invalid request content");

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should not have been fetched
      expect(getAllUsers).toHaveBeenCalledTimes(0);

      //Checking if app exists - should be invoked only one time during initalization
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //Then users data should be fetched - without getFileContent - invoked during initialization - 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48
      expect(getFileContent).toHaveBeenCalledTimes(48);

      //SetFileContent should have been called
      expect(setFileContent).toHaveBeenCalledTimes(0);

      //Local update of roles and permissions is forbidden - therefore both addUserToGroup and removeUserFromGroup should not have been called
      expect(addUserToGroup).not.toHaveBeenCalled();
      expect(removeUserFromGroup).not.toHaveBeenCalled();

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let app = MindSphereAppsManager.getInstance().Apps[appId] as any;

      let storagePayload = app._userStorage._cacheData;

      let allUsersPayload: any = {};

      let userFilePaths = Object.keys(
        fileServiceContent["hostTenant"][`${appId}-asset-id`]
      ).filter((filePath) => filePath.includes(".user.config.json"));

      for (let userFilePath of userFilePaths) {
        let userFileContent =
          fileServiceContent["hostTenant"][`${appId}-asset-id`][userFilePath];
        let userId = userFilePath.replace(".user.config.json", "");
        allUsersPayload[userId] = {
          ...userFileContent,
        };
      }

      expect(storagePayload).toEqual(allUsersPayload);

      //#endregion  =====  CHECKING STORAGE =====
    });

    it("should return 400 and not update the user - if there is an attempt to edit user with user id", async () => {
      //Inputs
      requestBody.userId = "fakeUserId";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"userId" is not allowed`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if there is an attempt to edit user with app id", async () => {
      //Inputs
      requestBody.appId = "fakeAppId";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"appId" is not allowed`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if userName is not defined", async () => {
      delete requestBody.userName;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"userName" is required`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if userName is null", async () => {
      requestBody.userName = null;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"userName" must be a string`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if userName has invalid type (number)", async () => {
      requestBody.userName = 1234;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"userName" must be a string`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if userName is invalid email", async () => {
      requestBody.userName = "fakeEmailValue";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"userName" must be a valid email`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if there is an attempt to edit userName", async () => {
      requestBody.userName = "new_user_name@fake.email";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `Users userName cannot be edited!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if data is undefined", async () => {
      delete requestBody.data;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"data" is required`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if data is null", async () => {
      requestBody.data = null;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"data" must be of type object`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if data has invalid type (string)", async () => {
      requestBody.data = "testData";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"data" must be of type object`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if data is an empty object - permissions of plants exist", async () => {
      requestBody.data = {};

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `User data invalid - plantIds in data and in permissions must be identical!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if data is an empty object - permissions of plants don't exist", async () => {
      requestBody.data = {};
      requestBody.config = {};
      requestBody.permissions.plants = {};

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `Cannot grant users's permission to different plant locally!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 200 and update the user - if data has nested properties ", async () => {
      //Creating nested properties
      requestBody.data = {
        testPlant5: {
          a: {
            b: {
              c: {
                d: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
              },
            },
          },
          e: {
            f: {
              g: {
                h: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
              },
            },
          },
        },
      };

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if data is not an empty object - permissions of plants don't exist", async () => {
      requestBody.config = {};
      requestBody.permissions.plants = {};

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `User data invalid - plantIds in data and in permissions must be identical!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if data has additional plant id", async () => {
      requestBody.data["fakePlantId"] = { test: 1234 };

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `User data invalid - plantIds in data and in permissions must be identical!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if config is undefined", async () => {
      delete requestBody.config;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"config" is required`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if config is null", async () => {
      requestBody.config = null;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"config" must be of type object`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if config has invalid type (string)", async () => {
      requestBody.config = "testData";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"config" must be of type object`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if config is an empty object - permissions of plants exist", async () => {
      requestBody.config = {};

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `User config invalid - plantIds in config and in permissions must be identical!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if config is an empty object - permissions of plants don't exist", async () => {
      requestBody.data = {};
      requestBody.config = {};
      requestBody.permissions.plants = {};

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `Cannot grant users's permission to different plant locally!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 200 and not update the user - if config has nested properties ", async () => {
      //Creating nested properties
      requestBody.config = {
        testPlant5: {
          a: {
            b: {
              c: {
                d: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
              },
            },
          },
          e: {
            f: {
              g: {
                h: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
              },
            },
          },
        },
      };

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if config is not an empty object - permissions of plants don't exist", async () => {
      requestBody.data = {};
      requestBody.permissions.plants = {};

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `User config invalid - plantIds in config and in permissions must be identical!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if config has additional plant id", async () => {
      requestBody.config["fakePlantId"] = { test: 1234 };

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `User config invalid - plantIds in config and in permissions must be identical!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if permissions is undefined", async () => {
      delete requestBody.permissions;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions" is required`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if permissions is null", async () => {
      requestBody.permissions = null;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions" must be of type object`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if permissions has invalid type (string)", async () => {
      requestBody.permissions = "testData";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions" must be of type object`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;
      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if permissions.role is undefined", async () => {
      delete requestBody.permissions.role;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions.role" is required`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if permissions.role is null", async () => {
      requestBody.permissions.role = null;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions.role" must be one of [0, 1, 2, 3]`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if permissions.role has invalid type (string)", async () => {
      requestBody.permissions.role = "testData";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions.role" must be one of [0, 1, 2, 3]`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if permissions.role has invalid value", async () => {
      requestBody.permissions.role = 5;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions.role" must be one of [0, 1, 2, 3]`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if permissions.plants is undefined", async () => {
      delete requestBody.permissions.plants;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions.plants" is required`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if permissions.plants is null", async () => {
      requestBody.permissions.plants = null;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions.plants" must be of type object`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if permissions.plants has invalid type (string)", async () => {
      requestBody.permissions.plants = "testData";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions.plants" must be of type object`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if permissions.plants is an empty object - permissions exists in config and data", async () => {
      requestBody.permissions.plants = {};

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `User config invalid - plantIds in config and in permissions must be identical!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if permissions.plants is an empty object - permissions does not exist in config and data", async () => {
      requestBody.data = {};
      requestBody.config = {};
      requestBody.permissions.plants = {};

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `Cannot grant users's permission to different plant locally!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if permissions.plants has one additional plant - permissions exists in config and data", async () => {
      requestBody.permissions.plants["fakePlant"] = 1;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `User config invalid - plantIds in config and in permissions must be identical!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if permissions.plants of one plant is null", async () => {
      requestBody.permissions.plants["fakePlant"] = null;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions.plants.fakePlant" must be one of [0, 1]`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if permissions.plants of one plant has invalid type - string", async () => {
      requestBody.permissions.plants["fakePlant"] = "abcd1234";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions.plants.fakePlant" must be one of [0, 1]`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if permissions.plants of one plant has invalid number - float", async () => {
      requestBody.permissions.plants["fakePlant"] = 0.123;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions.plants.fakePlant" must be one of [0, 1]`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if permissions.plants of one plant has invalid number - below 0", async () => {
      requestBody.permissions.plants["fakePlant"] = -1;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions.plants.fakePlant" must be one of [0, 1]`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if permissions.plants of one plant has invalid number - above 1", async () => {
      requestBody.permissions.plants["fakePlant"] = 2;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `"permissions.plants.fakePlant" must be one of [0, 1]`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if role is a globalUser but permissions to plant is an admin", async () => {
      requestBody.permissions.role = UserRole.GlobalUser;
      requestBody.permissions.plants = {
        testPlant5: PlantPermissions.Admin,
      };

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `Users role should be a local or global admin, if they have administrative permissions for a plant!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if role is a localUser but permissions to plant is an admin", async () => {
      requestBody.permissions.role = UserRole.LocalUser;
      requestBody.permissions.plants = {
        testPlant5: PlantPermissions.Admin,
      };

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `Users role should be a local or global admin, if they have administrative permissions for a plant!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if there is an attempt to edit local user with access to several plants locally", async () => {
      requestBody.permissions.role = UserRole.LocalUser;
      requestBody.permissions.plants = {
        testPlant4: PlantPermissions.User,
        testPlant5: PlantPermissions.User,
      };
      requestBody.data = {
        testPlant4: { fakeData: 123 },
        testPlant5: { fakeData: 123 },
      };
      requestBody.config = {
        testPlant4: { fakeData: 123 },
        testPlant5: { fakeData: 123 },
      };

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `Cannot grant users's permission to different plant locally!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 400 and not update the user - if there is an attempt to edit local admin with access to several plants locally", async () => {
      requestBody.permissions.role = UserRole.LocalAdmin;
      requestBody.permissions.plants = {
        testPlant4: PlantPermissions.User,
        testPlant5: PlantPermissions.Admin,
      };
      requestBody.data = {
        testPlant4: { fakeData: 123 },
        testPlant5: { fakeData: 123 },
      };
      requestBody.config = {
        testPlant4: { fakeData: 123 },
        testPlant5: { fakeData: 123 },
      };

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `Cannot grant users's permission to different plant locally!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should update user and return 200 with new local payload of updated user - if user is local user with user access to plant", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      plantId = "testPlant5";
      userId = "testLocalUser22";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      requestBody = {
        data: {
          testPlant5: {
            testLocalUser22TestPlant5Data:
              "testLocalUser22TestPlant5DataModifiedValue",
          },
        },
        config: {
          testPlant5: {
            testLocalUser22TestPlant5Config:
              "testLocalUser22TestPlant5ConfigModifiedValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant5: PlantPermissions.User,
          },
        },
      };

      //Outputs
      expectedValidCall = true;
      expectedResponseCode = 200;
      expectedErrorText = null;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 1;

      await testLocalUserPost();
    });

    it("should not update user and return 404 - if user is local user without access to plant", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      plantId = "testPlant5";
      userId = "testLocalUser22";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      requestBody = {
        data: {
          testPlant5: {
            testLocalUser22TestPlant5Data:
              "testLocalUser22TestPlant5DataModifiedValue",
          },
        },
        config: {
          testPlant5: {
            testLocalUser22TestPlant5Config:
              "testLocalUser22TestPlant5ConfigModifiedValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant5: PlantPermissions.User,
          },
        },
      };
      //Removing user access from plant
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].config[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].data[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.plants[plantId];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = `User not found!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should update user and return 200 with new local payload of updated user - if user is local admin with user access to plant", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      plantId = "testPlant5";
      userId = "testLocalUser22";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      requestBody = {
        data: {
          testPlant5: {
            testLocalUser22TestPlant5Data:
              "testLocalUser22TestPlant5DataModifiedValue",
          },
        },
        config: {
          testPlant5: {
            testLocalUser22TestPlant5Config:
              "testLocalUser22TestPlant5ConfigModifiedValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.LocalAdmin,
          plants: {
            testPlant5: PlantPermissions.User,
          },
        },
      };
      //Setting localUser22 to be LocalAdmin at the begining
      //Setting new user global role
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.role = UserRole.LocalAdmin;
      //Moving user to a proper group
      userGroupServiceContent.testTenant2.localUserGroup.members = userGroupServiceContent.testTenant2.localUserGroup.members.filter(
        (group) => group.value !== userId
      );
      userGroupServiceContent.testTenant2.localAdminGroup.members.push({
        type: "USER",
        value: userId,
      });
      //Setting proper user local permissions
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.User;

      //Outputs
      expectedValidCall = true;
      expectedResponseCode = 200;
      expectedErrorText = null;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 1;

      await testLocalUserPost();
    });

    it("should update user and return 200 with new local payload of updated user - if user is local admin with admin access to plant", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      plantId = "testPlant5";
      userId = "testLocalUser22";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      requestBody = {
        data: {
          testPlant5: {
            testLocalUser22TestPlant5Data:
              "testLocalUser22TestPlant5DataModifiedValue",
          },
        },
        config: {
          testPlant5: {
            testLocalUser22TestPlant5Config:
              "testLocalUser22TestPlant5ConfigModifiedValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.LocalAdmin,
          plants: {
            testPlant5: PlantPermissions.Admin,
          },
        },
      };
      //Setting localUser22 to be LocalAdmin at the begining
      //Setting new user global role
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.role = UserRole.LocalAdmin;
      //Moving user to a proper group
      userGroupServiceContent.testTenant2.localUserGroup.members = userGroupServiceContent.testTenant2.localUserGroup.members.filter(
        (group) => group.value !== userId
      );
      userGroupServiceContent.testTenant2.localAdminGroup.members.push({
        type: "USER",
        value: userId,
      });
      //Setting proper user local permissions
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      //Outputs
      expectedValidCall = true;
      expectedResponseCode = 200;
      expectedErrorText = null;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 1;

      await testLocalUserPost();
    });

    it("should not update user and return 404 - if user is local admin without access to plant", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      plantId = "testPlant5";
      userId = "testLocalUser22";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      requestBody = {
        data: {
          testPlant5: {
            testLocalUser22TestPlant5Data:
              "testLocalUser22TestPlant5DataModifiedValue",
          },
        },
        config: {
          testPlant5: {
            testLocalUser22TestPlant5Config:
              "testLocalUser22TestPlant5ConfigModifiedValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.LocalAdmin,
          plants: {
            testPlant5: PlantPermissions.Admin,
          },
        },
      };
      //Setting localUser22 to be LocalAdmin at the begining
      //Setting new user global role
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.role = UserRole.LocalAdmin;
      //Moving user to a proper group
      userGroupServiceContent.testTenant2.localUserGroup.members = userGroupServiceContent.testTenant2.localUserGroup.members.filter(
        (group) => group.value !== userId
      );
      userGroupServiceContent.testTenant2.localAdminGroup.members.push({
        type: "USER",
        value: userId,
      });
      //Setting proper user local permissions
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;
      //Removing user access from plant
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].config[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].data[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.plants[plantId];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = `User not found!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should not update user and return 400 - if user is global user with user access to plant", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      plantId = "testPlant5";
      userId = "testGlobalUser22";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      requestBody = {
        data: {
          testPlant5: {
            testGlobalUser22TestPlant5Data:
              "testGlobalUser22TestPlant5DataModifiedValue",
          },
        },
        config: {
          testPlant5: {
            testGlobalUser22TestPlant5Config:
              "testGlobalUser22TestPlant5ConfigModifiedValue",
          },
        },
        userName: "test_global_user_22@user.name",
        permissions: {
          role: UserRole.GlobalUser,
          plants: {
            testPlant5: PlantPermissions.User,
          },
        },
      };

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = "Cannot edit global admin or global user locally!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should not update user and return 404 - if user is global user without user access to plant", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      plantId = "testPlant5";
      userId = "testGlobalUser22";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      requestBody = {
        data: {
          testPlant5: {
            testGlobalUser22TestPlant5Data:
              "testGlobalUser22TestPlant5DataModifiedValue",
          },
        },
        config: {
          testPlant5: {
            testGlobalUser22TestPlant5Config:
              "testGlobalUser22TestPlant5ConfigModifiedValue",
          },
        },
        userName: "test_global_user_22@user.name",
        permissions: {
          role: UserRole.GlobalUser,
          plants: {
            testPlant5: PlantPermissions.User,
          },
        },
      };
      //Removing user access from plant
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].config[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].data[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.plants[plantId];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "User not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should not update user and return 400 - if user is global admin with user access to plant", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      plantId = "testPlant5";
      userId = "testGlobalAdmin22";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      requestBody = {
        data: {
          testPlant5: {
            testGlobalAdmin22TestPlant5Data:
              "testGlobalAdmin22TestPlant5DataModifiedValue",
          },
        },
        config: {
          testPlant5: {
            testGlobalAdmin22TestPlant5Config:
              "testGlobalAdmin22TestPlant5ConfigModifiedValue",
          },
        },
        userName: "test_global_admin_22@user.name",
        permissions: {
          role: UserRole.GlobalAdmin,
          plants: {
            testPlant5: PlantPermissions.User,
          },
        },
      };

      //Setting proper user local permissions
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.User;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = "Cannot edit global admin or global user locally!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should not update user and return 400 - if user is global admin with admin access to plant", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      plantId = "testPlant5";
      userId = "testGlobalAdmin22";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      requestBody = {
        data: {
          testPlant5: {
            testGlobalAdmin22TestPlant5Data:
              "testGlobalAdmin22TestPlant5DataModifiedValue",
          },
        },
        config: {
          testPlant5: {
            testGlobalAdmin22TestPlant5Config:
              "testGlobalAdmin22TestPlant5ConfigModifiedValue",
          },
        },
        userName: "test_global_admin_22@user.name",
        permissions: {
          role: UserRole.GlobalAdmin,
          plants: {
            testPlant5: PlantPermissions.Admin,
          },
        },
      };

      //Setting proper user local permissions
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = "Cannot edit global admin or global user locally!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should not update user and return 404 - if user is global admin without access to plant", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      plantId = "testPlant5";
      userId = "testGlobalAdmin22";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      requestBody = {
        data: {
          testPlant5: {
            testGlobalAdmin22TestPlant5Data:
              "testGlobalAdmin22TestPlant5DataModifiedValue",
          },
        },
        config: {
          testPlant5: {
            testGlobalAdmin22TestPlant5Config:
              "testGlobalAdmin22TestPlant5ConfigModifiedValue",
          },
        },
        userName: "test_global_admin_22@user.name",
        permissions: {
          role: UserRole.GlobalAdmin,
          plants: {
            testPlant5: PlantPermissions.Admin,
          },
        },
      };
      //Removing user access from plant
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].config[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].data[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.plants[plantId];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "User not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should not update user and return 400 - if there is an attempt to change local permissions to Admin", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      plantId = "testPlant5";
      userId = "testLocalUser22";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      requestBody = {
        data: {
          testPlant5: {
            testLocalUser22TestPlant5Data:
              "testLocalUser22TestPlant5DataModifiedValue",
          },
        },
        config: {
          testPlant5: {
            testLocalUser22TestPlant5Config:
              "testLocalUser22TestPlant5ConfigModifiedValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.LocalAdmin,
          plants: {
            testPlant5: PlantPermissions.Admin,
          },
        },
      };
      //Setting localUser22 to be LocalAdmin at the begining
      //Setting new user global role
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.role = UserRole.LocalAdmin;
      //Moving user to a proper group
      userGroupServiceContent.testTenant2.localUserGroup.members = userGroupServiceContent.testTenant2.localUserGroup.members.filter(
        (group) => group.value !== userId
      );
      userGroupServiceContent.testTenant2.localAdminGroup.members.push({
        type: "USER",
        value: userId,
      });
      //Setting proper user local permissions
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.User;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = "Plant permissions cannot be edited localy!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should not update user and return 400 - if there is an attempt to change local permissions to User", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      plantId = "testPlant5";
      userId = "testLocalUser22";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      requestBody = {
        data: {
          testPlant5: {
            testLocalUser22TestPlant5Data:
              "testLocalUser22TestPlant5DataModifiedValue",
          },
        },
        config: {
          testPlant5: {
            testLocalUser22TestPlant5Config:
              "testLocalUser22TestPlant5ConfigModifiedValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.LocalAdmin,
          plants: {
            testPlant5: PlantPermissions.User,
          },
        },
      };
      //Setting localUser22 to be LocalAdmin at the begining
      //Setting new user global role
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.role = UserRole.LocalAdmin;
      //Moving user to a proper group
      userGroupServiceContent.testTenant2.localUserGroup.members = userGroupServiceContent.testTenant2.localUserGroup.members.filter(
        (group) => group.value !== userId
      );
      userGroupServiceContent.testTenant2.localAdminGroup.members.push({
        type: "USER",
        value: userId,
      });
      //Setting proper user local permissions
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = "Plant permissions cannot be edited localy!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should not update user and return 400 - if there is an attempt to change global role to Local User", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      plantId = "testPlant5";
      userId = "testLocalAdmin22";

      requestBody = {
        data: {
          testPlant5: {
            testLocalAdmin22TestPlant5Data:
              "testLocalAdmin22TestPlant5DataModifiedValue",
          },
        },
        config: {
          testPlant5: {
            testLocalAdmin22TestPlant5Config:
              "testLocalAdmin22TestPlant5ConfigModifiedValue",
          },
        },
        userName: "test_local_admin_22@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant5: PlantPermissions.User,
          },
        },
      };

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = "Users global role cannot be edited localy!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should not update user and return 400 - if there is an attempt to change global role to Local Admin", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      plantId = "testPlant5";
      userId = "testLocalUser22";

      requestBody = {
        data: {
          testPlant5: {
            testLocalUser22TestPlant5Data:
              "testLocalUser22TestPlant5DataModifiedValue",
          },
        },
        config: {
          testPlant5: {
            testLocalUser22TestPlant5Config:
              "testLocalUser22TestPlant5ConfigModifiedValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.LocalAdmin,
          plants: {
            testPlant5: PlantPermissions.User,
          },
        },
      };

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = "Users global role cannot be edited localy!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should not update user and return 400 - if there is an attempt to change global role to Global User", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      plantId = "testPlant5";
      userId = "testLocalUser22";

      requestBody = {
        data: {
          testPlant5: {
            testLocalUser22TestPlant5Data:
              "testLocalUser22TestPlant5DataModifiedValue",
          },
        },
        config: {
          testPlant5: {
            testLocalUser22TestPlant5Config:
              "testLocalUser22TestPlant5ConfigModifiedValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.GlobalUser,
          plants: {
            testPlant5: PlantPermissions.User,
          },
        },
      };

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = "Users global role cannot be edited localy!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should not update user and return 400 - if there is an attempt to change global role to Global Admin", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      plantId = "testPlant5";
      userId = "testLocalUser22";

      requestBody = {
        data: {
          testPlant5: {
            testLocalUser22TestPlant5Data:
              "testLocalUser22TestPlant5DataModifiedValue",
          },
        },
        config: {
          testPlant5: {
            testLocalUser22TestPlant5Config:
              "testLocalUser22TestPlant5ConfigModifiedValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.GlobalAdmin,
          plants: {
            testPlant5: PlantPermissions.User,
          },
        },
      };

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = "Users global role cannot be edited localy!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    //#endregion ========== BODY VALIDATION =========

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should return 404 and not edit the user - if global admin without access to the given plant attempts to edit the user", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].data[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].config[plantId];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 404 and not edit the user - if global admin with user access to the given plant attempts to edit the user", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.User;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 200 and edit the user - if global admin with admin access to the given plant attempts to edit the user", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      await testLocalUserPost();
    });

    it("should return 403 and not edit the user - if global user without access to the given plant attempts to edit the user", async () => {
      userPayload = {
        client_id: "testGlobalUserClientId",
        email: "testGlobalUserEmail",
        scope: ["testGlobalUserScope"],
        ten: "testTenant2",
        user_name: "test_global_user_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].permissions.plants[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].data[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].config[plantId];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global admin or local admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 403 and not edit the user - if global user with user access to the given plant attempts to edit the user", async () => {
      userPayload = {
        client_id: "testGlobalUserClientId",
        email: "testGlobalUserEmail",
        scope: ["testGlobalUserScope"],
        ten: "testTenant2",
        user_name: "test_global_user_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global admin or local admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 404 and not edit the user - if local admin without access to the given plant attempts to edit the user", async () => {
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.plants[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].data[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].config[plantId];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 404 and not edit the user - if local admin with user access to the given plant attempts to edit the user", async () => {
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.User;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 200 and edit the user - if local admin with admin access to the given plant attempts to edit the user", async () => {
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      await testLocalUserPost();
    });

    it("should return 403 and not edit the user - if local user without access to the given plant attempts to edit the user", async () => {
      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_local_user_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ].permissions.plants[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ].data[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ].config[plantId];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global admin or local admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 403 and not edit the user - if local user with user access to the given plant attempts to edit the user", async () => {
      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_local_user_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global admin or local admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 403 and not edit the user - if user's jwt payload does not have tenant assigned", async () => {
      delete (userPayload as any).ten;

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Invalid application id generated from user payload!";
      //GetAllUser should not be called - call ended before fetching user's data
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 403 and not edit the user - if there is no application of given id", async () => {
      appId = "ten-fakeTen-sub-fakeSub";
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "fakeTen",
        user_name: "test_global_admin_22@user.name",
        subtenant: "fakeSub",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Application of given id not found for the user!";
      //GetAllUser should not be called - call ended before fetching user's data
      expectedGetAllUsersCallNumber = 0;
      //GetAssets should be called x2 - try fetching fake app
      expectedGetAssetsCallNumber = 2;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 403 and not edit the user - if app id in user's payload and param differs", async () => {
      appId = "ten-testTenant2";
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. No access to given application!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 403 and not edit the user - if there is no application data for given app", async () => {
      delete fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["main.app.config.json"];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Main application settings not found for the user!";
      //GetAllUser should not be called - call ended before fetching user's data
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      //47 calls of getFileContent - no file containing one main app data
      expectedGetFileContentCallNumber = 47;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 403 and not edit the user - if user has valid scope, doest not exist in user service but exists in file service", async () => {
      //Adding user to file service for the app
      fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testFakeUser23.user.config.json"] = {
        data: {
          testPlant4: {
            testFakeUser23TestPlant4Data: "testFakeUser23TestPlant4DataValue",
          },
          testPlant5: {
            testFakeUser23TestPlant5Data: "testFakeUser23TestPlant5DataValue",
          },
        },
        config: {
          testPlant4: {
            testFakeUser23TestPlant4Config:
              "testFakeUser23TestPlant4ConfigValue",
          },
          testPlant5: {
            testFakeUser23TestPlant5Config:
              "testFakeUser23TestPlant5ConfigValue",
          },
        },
        userName: "test_fake_user_23@user.name",
        permissions: {
          role: UserRole.LocalAdmin,
          plants: {
            testPlant5: PlantPermissions.Admin,
            testPlant6: PlantPermissions.Admin,
          },
        },
      };

      //Creating new user's jwt payload
      userPayload = {
        client_id: "testFakeUserClientId",
        email: "testFakeUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_fake_user_23@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. User of given name not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      //49 calls of getFileContent - one additional user
      expectedGetFileContentCallNumber = 49;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 403 and not edit the user - if user has valid scope, exists in user service but does not exist in file service", async () => {
      userServiceContent["testTenant2"]["testFakeUser23"] = {
        active: true,
        name: {
          familyName: "testFakeUser23FamilyName",
          givenName: "testFakeUser23GivenName",
        },
        userName: "test_fake_user_23@user.name",
        emails: [
          {
            value: "testFakeUser23Email",
          },
        ],
        groups: [],
        externalId: "testFakeUser23ExternalId",
        id: "testFakeUser23",
        subtenants: [
          {
            id: "subtenant2",
          },
        ],
      };

      userGroupServiceContent.testTenant2.globalAdminGroup.members.push({
        type: "USER",
        value: "testFakeUser23",
      });

      userGroupServiceContent.testTenant2.subtenantUserGroup.members.push({
        type: "USER",
        value: "testFakeUser23",
      });

      //Creating new user's jwt payload
      userPayload = {
        client_id: "testFakeUserClientId",
        email: "testFakeUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_fake_user_23@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User does not exist for given app id!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 403 and not edit the user - if user has no access to the app - invalid scope", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["fakeScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22_user_name",
      };

      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Forbidden access. No scope found to access the app!";
      //0 calls of getAllUsers - not fetching user's data - checking scope before fetching
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 403 and not edit the user - if subtenant user attempts to edit the user for tenant app", async () => {
      appId = "ten-testTenant2";
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22@user.name",
        subtenant: "subtenant2",
      };

      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. No access to given application!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 403 and not edit the user - if tenant user attempts to edit the user for subtenant app", async () => {
      appId = "ten-testTenant2-sub-subtenant2";
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_21@user.name",
      };

      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. No access to given application!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 401 - if authorization token is invalid - no bearer prefix", async () => {
      requestHeaders["authorization"] = jwt.sign(userPayload, "testPrivateKey");

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";
      //No calling getAllUsers - returning before fetching user's data
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 401 - if authorization token is invalid - invalid token", async () => {
      requestHeaders["authorization"] =
        "Bearer thisIsTheFakeValueOfTheJWTToken";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";
      //No calling getAllUsers - returning before fetching user's data
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    it("should return 401 - if authorization token is invalid - no token provided", async () => {
      delete requestHeaders["authorization"];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";
      //No calling getAllUsers - returning before fetching user's data
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========

    //#region ========== MINDSPHERE SERVICE THROWS ==========

    it("should return 500 and not create the user - if get all users throws", async () => {
      getAllUsersThrows = true;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 500;
      expectedErrorText = `Ups.. Something fails..`;
      //0 calls for getAllUsers - becouse getAllUsers mock is overridden with a different mocked method
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test get all users error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    it("should return 500, create in mindphere but not create user locally - if set file content throws", async () => {
      setFileContentThrows = true;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 500;
      expectedErrorText = `Ups.. Something fails..`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //0 calls for setFileContent - becouse setFileContent mock is overridden with a different mocked method
      expectedSetFileContentCallNumber = 0;

      await testLocalUserPost();

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test set file content error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    //#endregion ========== MINDSPHERE SERVICE THROWS ==========
  });

  describe("DELETE /local/:appId/:plantId/:userId", () => {
    //Inputs
    let requestHeaders: any;
    let userPayload: MindSphereUserJWTData;
    let appId: string;
    let userId: string;
    let plantId: string;
    let getAllUsersThrows: boolean;
    let setFileThrows: boolean;
    let deleteFileThrows: boolean;
    let deleteUserThrows: boolean;

    //Outputs
    let expectedValidCall: boolean;
    let expectedResponseCode: number;
    let expectedErrorText: string | null;
    let expectedGetAllUsersCallNumber: number;
    let expectedGetAssetsCallNumber: number;
    let expectedGetFileContentCallNumber: number;
    let expectedFileServiceContent: any;
    let expectedSetFileContentCallNumber: number;
    let expectedDeleteFileCallNumber: number;
    let expectedDeleteUserCallNumber: number;

    beforeEach(() => {
      //Inputs
      requestHeaders = {};
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalUser22";
      plantId = "testPlant5";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      getAllUsersThrows = false;
      setFileThrows = false;
      deleteFileThrows = false;
      deleteUserThrows = false;

      //Outputs
      expectedValidCall = true;
      expectedResponseCode = 200;
      expectedErrorText = null;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should have the same number of users but with deleted plant ids
      expectedFileServiceContent = cloneObject(fileServiceContent);
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].config[plantId];
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].data[plantId];
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.plants[plantId];
      expectedSetFileContentCallNumber = 1;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;
    });

    let exec = async () => {
      await beforeExec();

      if (getAllUsersThrows) {
        MindSphereUserService.getInstance().getAllUsers = jest.fn(async () => {
          throw new Error("Test get all users error");
        });
      }

      if (setFileThrows) {
        MindSphereFileService.getInstance().setFileContent = jest.fn(
          async () => {
            throw new Error("Test set file content error");
          }
        );
      }

      if (deleteFileThrows) {
        MindSphereFileService.getInstance().deleteFile = jest.fn(async () => {
          throw new Error("Test delete file error");
        });
      }

      if (deleteUserThrows) {
        MindSphereUserService.getInstance().deleteUser = jest.fn(async () => {
          throw new Error("Test delete user error");
        });
      }

      return request(server)
        .delete(`/customApi/config/user/local/${appId}/${plantId}/${userId}`)
        .set(requestHeaders)
        .send();
    };

    const testLocalUserDelete = async () => {
      let result = await exec();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(expectedResponseCode);

      if (expectedValidCall) {
        let expectedPaylod = getUserDataResponse(
          appId,
          `${appId}-asset-id`,
          userId,
          plantId
        );

        expect(result.body).toEqual(expectedPaylod);
      } else {
        expect(result.text).toEqual(expectedErrorText);
      }

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(expectedGetAllUsersCallNumber);
      if (expectedGetAllUsersCallNumber > 0) {
        expect(getAllUsers.mock.calls[0]).toEqual([
          userPayload.ten,
          userPayload.subtenant != null ? userPayload.subtenant : null,
          null,
          userPayload.user_name,
        ]);
      }

      //Checking if app exists - should be invoked only one time during initalization
      expect(getAssets).toHaveBeenCalledTimes(expectedGetAssetsCallNumber);
      if (expectedGetAssetsCallNumber > 0) {
        expect(getAssets.mock.calls[0]).toEqual([
          "hostTenant",
          null,
          "testAppContainerAssetId",
          "testAppAssetType",
        ]);
      }

      //Then users data should be fetched - without getFileContent - invoked during initialization - 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48
      expect(getFileContent).toHaveBeenCalledTimes(
        expectedGetFileContentCallNumber
      );

      //Delete file should have been called
      expect(deleteFile).toHaveBeenCalledTimes(expectedDeleteFileCallNumber);
      if (expectedDeleteFileCallNumber > 0) {
        expect(deleteFile.mock.calls).toContainEqual([
          "hostTenant",
          `${appId}-asset-id`,
          `${userId}.user.config.json`,
        ]);
      }

      //Set file should have been called - if this is not the only plant for the user
      expect(setFileContent).toHaveBeenCalledTimes(
        expectedSetFileContentCallNumber
      );
      if (expectedSetFileContentCallNumber > 0) {
        let expectedUpdatePayload = cloneObject(
          fileServiceContent["hostTenant"][`${appId}-asset-id`][
            `${userId}.user.config.json`
          ]
        );
        delete expectedUpdatePayload.config[plantId];
        delete expectedUpdatePayload.data[plantId];
        delete expectedUpdatePayload.permissions.plants[plantId];

        expect(setFileContent.mock.calls).toContainEqual([
          "hostTenant",
          `${appId}-asset-id`,
          `${userId}.user.config.json`,
          expectedUpdatePayload,
        ]);
      }

      //Delete user should have been called - if this is the only plant for the user
      expect(deleteUser).toHaveBeenCalledTimes(expectedDeleteUserCallNumber);
      if (expectedDeleteUserCallNumber > 0) {
        expect(deleteUser.mock.calls).toContainEqual([userPayload.ten, userId]);
      }

      //Update user should never be called - don't change user's permissions
      expect(updateUser).not.toHaveBeenCalled();

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let app = MindSphereAppsManager.getInstance().Apps[appId] as any;

      //Checking app only if it exists - ther are some cases where api calls about app that does not exist
      if (app != null) {
        let storagePayload = app._userStorage._cacheData;

        let allUsersPayload: any = {};

        let userFilePaths = Object.keys(
          expectedFileServiceContent["hostTenant"][`${appId}-asset-id`]
        ).filter((filePath) => filePath.includes(".user.config.json"));

        for (let userFilePath of userFilePaths) {
          let userFileContent =
            expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
              userFilePath
            ];
          let userId = userFilePath.replace(".user.config.json", "");
          allUsersPayload[userId] = {
            ...userFileContent,
          };
        }

        expect(storagePayload).toEqual(allUsersPayload);
      }

      //#endregion  =====  CHECKING STORAGE =====
    };

    it("should return 200, delete plantIds from user and return local payload of user of the app", async () => {
      await testLocalUserDelete();
    });

    it("should return 200, delete plantIds from user and return local payload of user of the app - if user has multiple plants - subtenant app", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalUser22";
      plantId = "testPlant5";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = {
        data: {
          testPlant5: {
            testLocalUser22TestPlant5Data: "testLocalUser22TestPlant5DataValue",
          },
          testPlant6: {
            testLocalUser22TestPlant6Data: "testLocalUser22TestPlant6DataValue",
          },
        },
        config: {
          testPlant5: {
            testLocalUser22TestPlant5Config:
              "testLocalUser22TestPlant5ConfigValue",
          },
          testPlant6: {
            testLocalUser22TestPlant6Config:
              "testLocalUser22TestPlant6ConfigValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant5: PlantPermissions.User,
            testPlant6: PlantPermissions.User,
          },
        },
      };

      //Outputs
      expectedValidCall = true;
      expectedResponseCode = 200;
      expectedErrorText = null;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should have the same number of users but with deleted plant ids
      expectedFileServiceContent = cloneObject(fileServiceContent);
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].config[plantId];
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].data[plantId];
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.plants[plantId];
      expectedSetFileContentCallNumber = 1;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 200, delete user and return local payload of user of the app - if user has access only to given app - subtenant app", async () => {
      //Inputs

      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalUser22";
      plantId = "testPlant5";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = {
        data: {
          testPlant5: {
            testLocalUser22TestPlant5Data: "testLocalUser22TestPlant5DataValue",
          },
        },
        config: {
          testPlant5: {
            testLocalUser22TestPlant5Config:
              "testLocalUser22TestPlant5ConfigValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant5: PlantPermissions.User,
          },
        },
      };

      //Outputs
      expectedValidCall = true;
      expectedResponseCode = 200;
      expectedErrorText = null;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have user of userId anymore
      expectedFileServiceContent = cloneObject(fileServiceContent);
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ];
      //SetFile should not have been called - it should have been deleted instead
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 1;
      //User should be deleted from MindSphere
      expectedDeleteUserCallNumber = 1;

      await testLocalUserDelete();
    });

    it("should return 200, delete plantIds from user and return local payload of user of the app - if user has multiple plants - tenant app", async () => {
      //Inputs
      appId = "ten-testTenant2";
      userId = "testLocalUser21";
      plantId = "testPlant2";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_21@user.name",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = {
        data: {
          testPlant2: {
            testLocalUser21TestPlant2Data: "testLocalUser21TestPlant2DataValue",
          },
          testPlant3: {
            testLocalUser21TestPlant3Data: "testLocalUser21TestPlant3DataValue",
          },
        },
        config: {
          testPlant2: {
            testLocalUser21TestPlant2Config:
              "testLocalUser21TestPlant2onfigValue",
          },
          testPlant3: {
            testLocalUser21TestPlant3Config:
              "testLocalUser21TestPlant3ConfigValue",
          },
        },
        userName: "test_local_user_21@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant2: PlantPermissions.User,
            testPlant3: PlantPermissions.User,
          },
        },
      };

      //Outputs
      expectedValidCall = true;
      expectedResponseCode = 200;
      expectedErrorText = null;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should have the same number of users but with deleted plant ids
      expectedFileServiceContent = cloneObject(fileServiceContent);
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].config[plantId];
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].data[plantId];
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.plants[plantId];
      expectedSetFileContentCallNumber = 1;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 200, delete user and return local payload of user of the app - if user has access only to given app - tenant app", async () => {
      //Inputs
      appId = "ten-testTenant2";
      userId = "testLocalUser21";
      plantId = "testPlant2";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_21@user.name",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = {
        data: {
          testPlant2: {
            testLocalUser21TestPlant2Data: "testLocalUser21TestPlant2DataValue",
          },
        },
        config: {
          testPlant2: {
            testLocalUser21TestPlant2Config:
              "testLocalUser21TestPlant2onfigValue",
          },
        },
        userName: "test_local_user_21@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant2: PlantPermissions.User,
          },
        },
      };

      //Outputs
      expectedValidCall = true;
      expectedResponseCode = 200;
      expectedErrorText = null;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have user of userId anymore
      expectedFileServiceContent = cloneObject(fileServiceContent);
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ];
      //SetFile should not have been called - it should have been deleted instead
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 1;
      //User should be deleted from MindSphere
      expectedDeleteUserCallNumber = 1;

      await testLocalUserDelete();
    });

    it("should return 200, delete plantIds from user and return local payload of user of the app - if user has access to multiple plants (user) - user to delete is local user", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalUser22";
      plantId = "testPlant5";
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = {
        data: {
          testPlant5: {
            testLocalUser22TestPlant5Data: "testLocalUser22TestPlant5DataValue",
          },
          testPlant6: {
            testLocalUser22TestPlant6Data: "testLocalUser22TestPlant6DataValue",
          },
        },
        config: {
          testPlant5: {
            testLocalUser22TestPlant5Config:
              "testLocalUser22TestPlant5ConfigValue",
          },
          testPlant6: {
            testLocalUser22TestPlant6Config:
              "testLocalUser22TestPlant6ConfigValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant5: PlantPermissions.User,
            testPlant6: PlantPermissions.User,
          },
        },
      };

      //Outputs
      expectedValidCall = true;
      expectedResponseCode = 200;
      expectedErrorText = null;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should have the same number of users but with deleted plant ids
      expectedFileServiceContent = cloneObject(fileServiceContent);
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].config[plantId];
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].data[plantId];
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.plants[plantId];
      expectedSetFileContentCallNumber = 1;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 200, delete user and return local payload of user of the app - if user has access only to given app (user) - user to delete is local user", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalUser22";
      plantId = "testPlant5";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = {
        data: {
          testPlant5: {
            testLocalUser22TestPlant5Data: "testLocalUser22TestPlant5DataValue",
          },
        },
        config: {
          testPlant5: {
            testLocalUser22TestPlant5Config:
              "testLocalUser22TestPlant5ConfigValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant5: PlantPermissions.User,
          },
        },
      };

      //Outputs
      expectedValidCall = true;
      expectedResponseCode = 200;
      expectedErrorText = null;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have user of userId anymore
      expectedFileServiceContent = cloneObject(fileServiceContent);
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ];
      //SetFile should not have been called - it should have been deleted instead
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 1;
      //User should be deleted from MindSphere
      expectedDeleteUserCallNumber = 1;

      await testLocalUserDelete();
    });

    it("should return 404, and do nothing - if user has no access to the app - user to delete is local user", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalUser22";
      plantId = "testPlant5";
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = {
        data: {
          testPlant6: {
            testLocalUser22TestPlant6Data: "testLocalUser22TestPlant6DataValue",
          },
        },
        config: {
          testPlant6: {
            testLocalUser22TestPlant6Config:
              "testLocalUser22TestPlant6ConfigValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant6: PlantPermissions.User,
          },
        },
      };

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = `User not found!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      //No SetFileContent / DeleteFile / DeleteUser have been called
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 200, delete plantIds from user and return local payload of user of the app - if user has multiple plants (admin) - user to delete is local admin", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalAdmin22";
      plantId = "testPlant5";
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = {
        data: {
          testPlant5: {
            testLocalAdmin22TestPlant5Data:
              "testLocalAdmin22TestPlant5DataValue",
          },
          testPlant6: {
            testLocalAdmin22TestPlant6Data:
              "testLocalAdmin22TestPlant6DataValue",
          },
        },
        config: {
          testPlant5: {
            testLocalAdmin22TestPlant5Config:
              "testLocalAdmin22TestPlant5ConfigValue",
          },
          testPlant6: {
            testLocalAdmin22TestPlant6Config:
              "testLocalAdmin22TestPlant6ConfigValue",
          },
        },
        userName: "test_local_admin_22@user.name",
        permissions: {
          role: UserRole.LocalAdmin,
          plants: {
            testPlant5: PlantPermissions.Admin,
            testPlant6: PlantPermissions.Admin,
          },
        },
      };

      //Outputs
      expectedValidCall = true;
      expectedResponseCode = 200;
      expectedErrorText = null;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should have the same number of users but with deleted plant ids
      expectedFileServiceContent = cloneObject(fileServiceContent);
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].config[plantId];
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].data[plantId];
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.plants[plantId];
      expectedSetFileContentCallNumber = 1;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 200, delete user and return local payload of user of the app - if user has access only to given app (admin) - user to delete is local user", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalAdmin22";
      plantId = "testPlant5";
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = {
        data: {
          testPlant5: {
            testLocalAdmin22TestPlant5Data:
              "testLocalAdmin22TestPlant5DataValue",
          },
        },
        config: {
          testPlant5: {
            testLocalAdmin22TestPlant5Config:
              "testLocalAdmin22TestPlant5ConfigValue",
          },
        },
        userName: "test_local_admin_22@user.name",
        permissions: {
          role: UserRole.LocalAdmin,
          plants: {
            testPlant5: PlantPermissions.Admin,
          },
        },
      };

      //Outputs
      expectedValidCall = true;
      expectedResponseCode = 200;
      expectedErrorText = null;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have user of userId anymore
      expectedFileServiceContent = cloneObject(fileServiceContent);
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ];
      //SetFile should not have been called - it should have been deleted instead
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 1;
      //User should be deleted from MindSphere
      expectedDeleteUserCallNumber = 1;

      await testLocalUserDelete();
    });

    it("should return 200, delete plantIds from user and return local payload of user of the app - if user has multiple plants (user) - user to delete is local admin", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalUser22";
      plantId = "testPlant5";
      //Making testLocalUser a local admin
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = {
        data: {
          testPlant5: {
            testLocalUser22TestPlant5Data: "testLocalUser22TestPlant5DataValue",
          },
          testPlant6: {
            testLocalUser22TestPlant6Data: "testLocalUser22TestPlant6DataValue",
          },
        },
        config: {
          testPlant5: {
            testLocalUser22TestPlant5Config:
              "testLocalUser22TestPlant5ConfigValue",
          },
          testPlant6: {
            testLocalUser22TestPlant6Config:
              "testLocalUser22TestPlant6ConfigValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.LocalAdmin,
          plants: {
            testPlant5: PlantPermissions.User,
            testPlant6: PlantPermissions.User,
          },
        },
      };
      //Moving user to a proper group
      userGroupServiceContent.testTenant2.localUserGroup.members = userGroupServiceContent.testTenant2.localUserGroup.members.filter(
        (group) => group.value !== userId
      );
      userGroupServiceContent.testTenant2.localAdminGroup.members.push({
        type: "USER",
        value: userId,
      });

      //Outputs
      expectedValidCall = true;
      expectedResponseCode = 200;
      expectedErrorText = null;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should have the same number of users but with deleted plant ids
      expectedFileServiceContent = cloneObject(fileServiceContent);
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].config[plantId];
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].data[plantId];
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.plants[plantId];
      expectedSetFileContentCallNumber = 1;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 200, delete user and return local payload of user of the app - if user has access only to given app (user) - user to delete is local user", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalUser22";
      plantId = "testPlant5";
      //Making testLocalUser a local admin
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = {
        data: {
          testPlant5: {
            testLocalUserTestPlant5Data: "testLocalUserTestPlant5DataValue",
          },
        },
        config: {
          testPlant5: {
            testLocalUserTestPlant5Config: "testLocalUserTestPlant5ConfigValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.LocalAdmin,
          plants: {
            testPlant5: PlantPermissions.User,
          },
        },
      };
      //Moving user to a proper group
      userGroupServiceContent.testTenant2.localUserGroup.members = userGroupServiceContent.testTenant2.localUserGroup.members.filter(
        (group) => group.value !== userId
      );
      userGroupServiceContent.testTenant2.localAdminGroup.members.push({
        type: "USER",
        value: userId,
      });

      //Outputs
      expectedValidCall = true;
      expectedResponseCode = 200;
      expectedErrorText = null;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have user of userId anymore
      expectedFileServiceContent = cloneObject(fileServiceContent);
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ];
      //SetFile should not have been called - it should have been deleted instead
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 1;
      //User should be deleted from MindSphere
      expectedDeleteUserCallNumber = 1;

      await testLocalUserDelete();
    });

    it("should return 404, and do nothing - if user has no access to the app - user to delete is a local admin", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalUser22";
      plantId = "testPlant5";
      //Making testLocalUser a local admin
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = {
        data: {
          testPlant6: {
            testLocalUser22TestPlant6Data: "testLocalUser22TestPlant6DataValue",
          },
        },
        config: {
          testPlant6: {
            testLocalUser22TestPlant6Config:
              "testLocalUser22TestPlant6ConfigValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.LocalAdmin,
          plants: {
            testPlant6: PlantPermissions.Admin,
          },
        },
      };
      //Moving user to a proper group
      userGroupServiceContent.testTenant2.localUserGroup.members = userGroupServiceContent.testTenant2.localUserGroup.members.filter(
        (group) => group.value !== userId
      );
      userGroupServiceContent.testTenant2.localAdminGroup.members.push({
        type: "USER",
        value: userId,
      });

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = `User not found!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      //No SetFileContent / DeleteFile / DeleteUser have been called
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 400, and not delete plantIds from user - if user has access to multiple plants (user) - user to delete is global user", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testGlobalUser22";
      plantId = "testPlant5";
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = {
        data: {
          testPlant5: {
            testGlobalUser22TestPlant5Data:
              "testGlobalUser22TestPlant5DataValue",
          },
          testPlant6: {
            testGlobalUser22TestPlant6Data:
              "testGlobalUser22TestPlant6DataValue",
          },
        },
        config: {
          testPlant5: {
            testGlobalUser22TestPlant5Config:
              "testGlobalUser22TestPlant5ConfigValue",
          },
          testPlant6: {
            testGlobalUser22TestPlant6Config:
              "testGlobalUser22TestPlant6ConfigValue",
          },
        },
        userName: "test_global_user_22@user.name",
        permissions: {
          role: UserRole.GlobalUser,
          plants: {
            testPlant5: PlantPermissions.User,
            testPlant6: PlantPermissions.User,
          },
        },
      };

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = "Cannot delete global admin or global user locally!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 400, and not delete user - if user has access only to given app (user) - user to delete is global user", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testGlobalUser22";
      plantId = "testPlant5";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = {
        data: {
          testPlant5: {
            testGlobalUser22TestPlant5Data:
              "testGlobalUser22TestPlant5DataValue",
          },
        },
        config: {
          testPlant5: {
            testGlobalUser22TestPlant5Config:
              "testGlobalUser22TestPlant5ConfigValue",
          },
        },
        userName: "test_global_user_22@user.name",
        permissions: {
          role: UserRole.GlobalUser,
          plants: {
            testPlant5: PlantPermissions.User,
          },
        },
      };

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = "Cannot delete global admin or global user locally!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 404, and do nothing - if user has no access to the app - user to delete is global user", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testGlobalUser22";
      plantId = "testPlant5";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = {
        data: {
          testPlant6: {
            testGlobalUser22TestPlant6Data:
              "testGlobalUser22TestPlant6DataValue",
          },
        },
        config: {
          testPlant6: {
            testGlobalUser22TestPlant6Config:
              "testGlobalUser22TestPlant6ConfigValue",
          },
        },
        userName: "test_global_user_22@user.name",
        permissions: {
          role: UserRole.GlobalUser,
          plants: {
            testPlant6: PlantPermissions.User,
          },
        },
      };

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = `User not found!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      //No SetFileContent / DeleteFile / DeleteUser have been called
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 400, and not delete plantIds from user - if user has access to multiple plants (user) - user to delete is global user", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testGlobalAdmin22";
      plantId = "testPlant5";
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = {
        data: {
          testPlant5: {
            testGlobalAdmin22TestPlant5Data:
              "testGlobalAdmin22TestPlant5DataValue",
          },
          testPlant6: {
            testGlobalAdmin22TestPlant6Data:
              "testGlobalAdmin22TestPlant6DataValue",
          },
        },
        config: {
          testPlant5: {
            testGlobalAdmin22TestPlant5Config:
              "testGlobalAdmin22TestPlant5ConfigValue",
          },
          testPlant6: {
            testGlobalAdmin22TestPlant6Config:
              "testGlobalAdmin22TestPlant6ConfigValue",
          },
        },
        userName: "test_global_admin_22@user.name",
        permissions: {
          role: UserRole.GlobalAdmin,
          plants: {
            testPlant5: PlantPermissions.User,
            testPlant6: PlantPermissions.User,
          },
        },
      };

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = "Cannot delete global admin or global user locally!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 400, and not delete user - if user has access only to given app (user) - user to delete is global user", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testGlobalAdmin22";
      plantId = "testPlant5";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = {
        data: {
          testPlant5: {
            testGlobalAdmin22TestPlant5Data:
              "testGlobalAdmin22TestPlant5DataValue",
          },
        },
        config: {
          testPlant5: {
            testGlobalAdmin22TestPlant5Config:
              "testGlobalAdmin22TestPlant5ConfigValue",
          },
        },
        userName: "test_global_admin_22@user.name",
        permissions: {
          role: UserRole.GlobalAdmin,
          plants: {
            testPlant5: PlantPermissions.User,
          },
        },
      };

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = "Cannot delete global admin or global user locally!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 404, and do nothing - if user has no access to the app - user to delete is global user", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testGlobalAdmin22";
      plantId = "testPlant5";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = {
        data: {
          testPlant6: {
            testGlobalAdmin22TestPlant6Data:
              "testGlobalAdmin22TestPlant6DataValue",
          },
        },
        config: {
          testPlant6: {
            testGlobalAdmin22TestPlant6Config:
              "testGlobalAdmin22TestPlant6ConfigValue",
          },
        },
        userName: "test_global_admin_22@user.name",
        permissions: {
          role: UserRole.GlobalAdmin,
          plants: {
            testPlant6: PlantPermissions.User,
          },
        },
      };

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = `User not found!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      //No SetFileContent / DeleteFile / DeleteUser have been called
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 404 - if user has no access to the plant", async () => {
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].data[plantId];

      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].config[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.plants[plantId];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "User not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 404 - if user has invalid access to the plant", async () => {
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.plants[plantId] = 123;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "User not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 404 - if there is no plant of given id", async () => {
      plantId = "fakePlant";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 404 - if there is no user of given id", async () => {
      userId = "fakeUserId";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "User not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 404 - if there is no user of given id in fileService in cache or in storage", async () => {
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "User not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      //One file less = config file of user
      expectedGetFileContentCallNumber = 47;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 404 - if there is no user of given id in userService  - if user has multiple plants (user) ", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalUser22";
      plantId = "testPlant5";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = {
        data: {
          testPlant5: {
            testLocalUser22TestPlant5Data: "testLocalUser22TestPlant5DataValue",
          },
          testPlant6: {
            testLocalUser22TestPlant6Data: "testLocalUser22TestPlant6DataValue",
          },
        },
        config: {
          testPlant5: {
            testLocalUser22TestPlant5Config:
              "testLocalUser22TestPlant5ConfigValue",
          },
          testPlant6: {
            testLocalUser22TestPlant6Config:
              "testLocalUser22TestPlant6ConfigValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant5: PlantPermissions.User,
            testPlant6: PlantPermissions.User,
          },
        },
      };
      //Deleting user from user service
      delete userServiceContent["testTenant2"][userId];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText =
        "User of name: test_local_user_22@user.name does not exist in tenant!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 404 - if there is no user of given id in userService  - if user has access only to given plant (user) ", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalUser22";
      plantId = "testPlant5";
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = {
        data: {
          testPlant5: {
            testLocalUser22TestPlant5Data: "testLocalUser22TestPlant5DataValue",
          },
        },
        config: {
          testPlant5: {
            testLocalUser22TestPlant5Config:
              "testLocalUser22TestPlant5ConfigValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant5: PlantPermissions.User,
          },
        },
      };
      //Deleting user from user service
      delete userServiceContent["testTenant2"][userId];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText =
        "User of name: test_local_user_22@user.name does not exist in tenant!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 200, fetch the user and then remove plant ids from its storage - if user exists in storage but not in cache - user has access to multiple plants (user)", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalUser22";
      plantId = "testPlant5";
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ];
      let oldUserPayload = {
        data: {
          testPlant5: {
            testLocalUser22TestPlant5Data: "testLocalUser22TestPlant5DataValue",
          },
          testPlant6: {
            testLocalUser22TestPlant6Data: "testLocalUser22TestPlant6DataValue",
          },
        },
        config: {
          testPlant5: {
            testLocalUser22TestPlant5Config:
              "testLocalUser22TestPlant5ConfigValue",
          },
          testPlant6: {
            testLocalUser22TestPlant6Config:
              "testLocalUser22TestPlant6ConfigValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant5: PlantPermissions.User,
            testPlant6: PlantPermissions.User,
          },
        },
      };

      await beforeExec();

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = oldUserPayload;
      setFileServiceContent(fileServiceContent);

      let result = await request(server)
        .delete(`/customApi/config/user/local/${appId}/${plantId}/${userId}`)
        .set(requestHeaders)
        .send();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(expectedResponseCode);

      let expectedPaylod = getUserDataResponse(
        appId,
        `${appId}-asset-id`,
        userId,
        plantId
      );

      expect(result.body).toEqual(expectedPaylod);

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        userPayload.ten,
        userPayload.subtenant != null ? userPayload.subtenant : null,
        null,
        userPayload.user_name,
      ]);

      //Checking if app exists - should be invoked only one time during initalization
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //Then users data should be called 47 during initalization + 1 during fetching the user's storage data during deletion
      expect(getFileContent).toHaveBeenCalledTimes(48);
      expect(getFileContent.mock.calls[47]).toEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `${userId}.user.config.json`,
      ]);

      //Delete file should not have been called
      expect(deleteFile).not.toHaveBeenCalled();

      //Set file should have been called
      expect(setFileContent).toHaveBeenCalledTimes(1);
      let expectedUpdatePayload = cloneObject(
        fileServiceContent["hostTenant"][`${appId}-asset-id`][
          `${userId}.user.config.json`
        ]
      );
      delete expectedUpdatePayload.config[plantId];
      delete expectedUpdatePayload.data[plantId];
      delete expectedUpdatePayload.permissions.plants[plantId];

      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `${userId}.user.config.json`,
        expectedUpdatePayload,
      ]);

      //Delete user should not have been called
      expect(deleteUser).not.toHaveBeenCalled();

      //Update user should never be called - don't change user's permissions
      expect(updateUser).not.toHaveBeenCalled();

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let app = MindSphereAppsManager.getInstance().Apps[appId] as any;

      let storagePayload = app._userStorage._cacheData;

      let allUsersPayload: any = {};

      let userFilePaths = Object.keys(
        fileServiceContent["hostTenant"][`${appId}-asset-id`]
      ).filter((filePath) => filePath.includes(".user.config.json"));

      for (let userFilePath of userFilePaths) {
        let userFileContent =
          fileServiceContent["hostTenant"][`${appId}-asset-id`][userFilePath];
        let userId = userFilePath.replace(".user.config.json", "");
        allUsersPayload[userId] = {
          ...userFileContent,
        };
      }

      //User should not have access to given plants
      delete allUsersPayload[userId].config[plantId];
      delete allUsersPayload[userId].data[plantId];
      delete allUsersPayload[userId].permissions.plants[plantId];

      expect(storagePayload).toEqual(allUsersPayload);

      //#endregion  =====  CHECKING STORAGE =====
    });

    it("should return 200, fetch the user and then remove it from service and storage - if user exists in storage but not in cache - user has access only to given plant (user)", async () => {
      //Inputs
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalUser22";
      plantId = "testPlant5";
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ];
      let oldUserPayload = {
        data: {
          testPlant5: {
            testLocalUser22TestPlant5Data: "testLocalUser22TestPlant5DataValue",
          },
        },
        config: {
          testPlant5: {
            testLocalUser22TestPlant5Config:
              "testLocalUser22TestPlant5ConfigValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant5: PlantPermissions.User,
          },
        },
      };

      await beforeExec();

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = oldUserPayload;
      setFileServiceContent(fileServiceContent);

      let result = await request(server)
        .delete(`/customApi/config/user/local/${appId}/${plantId}/${userId}`)
        .set(requestHeaders)
        .send();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(expectedResponseCode);

      let expectedPaylod = getUserDataResponse(
        appId,
        `${appId}-asset-id`,
        userId,
        plantId
      );

      expect(result.body).toEqual(expectedPaylod);

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        userPayload.ten,
        userPayload.subtenant != null ? userPayload.subtenant : null,
        null,
        userPayload.user_name,
      ]);

      //Checking if app exists - should be invoked only one time during initalization
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //Then users data should be called 47 during initalization + 1 during fetching the user's storage data during deletion
      expect(getFileContent).toHaveBeenCalledTimes(48);
      expect(getFileContent.mock.calls[47]).toEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `${userId}.user.config.json`,
      ]);

      //Delete file should have been called
      expect(deleteFile).toHaveBeenCalledTimes(1);
      expect(deleteFile.mock.calls).toContainEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `${userId}.user.config.json`,
      ]);

      //Set file should not have been called
      expect(setFileContent).not.toHaveBeenCalled();

      //Delete user should have been called
      expect(deleteUser).toHaveBeenCalledTimes(1);
      expect(deleteUser.mock.calls[0]).toEqual([userPayload.ten, userId]);

      //Update user should never be called - don't change user's permissions
      expect(updateUser).not.toHaveBeenCalled();

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let app = MindSphereAppsManager.getInstance().Apps[appId] as any;

      //Checking app only if it exists - ther are some cases where api calls about app that does not exist
      if (app != null) {
        let storagePayload = app._userStorage._cacheData;

        let allUsersPayload: any = {};

        let userFilePaths = Object.keys(
          fileServiceContent["hostTenant"][`${appId}-asset-id`]
        ).filter((filePath) => filePath.includes(".user.config.json"));

        for (let userFilePath of userFilePaths) {
          let userFileContent =
            fileServiceContent["hostTenant"][`${appId}-asset-id`][userFilePath];
          let userId = userFilePath.replace(".user.config.json", "");
          allUsersPayload[userId] = {
            ...userFileContent,
          };
        }

        //User should not be present in storage cache
        delete allUsersPayload[userId];

        expect(storagePayload).toEqual(allUsersPayload);
      }

      //#endregion  =====  CHECKING STORAGE =====
    });

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should return 404 and not delete the user - if global admin without access to the given plant attempts to delete the user", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].data[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].config[plantId];

      expectedFileServiceContent = cloneObject(fileServiceContent);

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 404 and not delete the user - if global admin with user access to the given plant attempts to delete the user", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.User;

      expectedFileServiceContent = cloneObject(fileServiceContent);

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 200 and delete the user - if global admin with admin access to the given plant attempts to delete the user", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      expectedFileServiceContent = cloneObject(fileServiceContent);
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].config[plantId];
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].data[plantId];
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.plants[plantId];

      await testLocalUserDelete();
    });

    it("should return 403 and not delete the user - if global user without access to the given plant attempts to delete the user", async () => {
      userPayload = {
        client_id: "testGlobalUserClientId",
        email: "testGlobalUserEmail",
        scope: ["testGlobalUserScope"],
        ten: "testTenant2",
        user_name: "test_global_user_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].permissions.plants[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].data[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].config[plantId];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global admin or local admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 403 and not delete the user - if global user with user access to the given plant attempts to delete the user", async () => {
      userPayload = {
        client_id: "testGlobalUserClientId",
        email: "testGlobalUserEmail",
        scope: ["testGlobalUserScope"],
        ten: "testTenant2",
        user_name: "test_global_user_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global admin or local admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 404 and not delete the user - if local admin without access to the given plant attempts to delete the user", async () => {
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.plants[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].data[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].config[plantId];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 404 and not delete the user - if local admin with user access to the given plant attempts to delete the user", async () => {
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.User;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 200 and delete the user - if local admin with admin access to the given plant attempts to delete the user", async () => {
      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_local_admin_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      expectedFileServiceContent = cloneObject(fileServiceContent);
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].config[plantId];
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].data[plantId];
      delete expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ].permissions.plants[plantId];

      await testLocalUserDelete();
    });

    it("should return 403 and not delete the user - if local user without access to the given plant attempts to delete the user", async () => {
      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_local_user_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ].permissions.plants[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ].data[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ].config[plantId];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global admin or local admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 403 and not delete the user - if local user with user access to the given plant attempts to delete the user", async () => {
      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_local_user_22@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global admin or local admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 403 and not delete the user - if user's jwt payload does not have tenant assigned", async () => {
      delete (userPayload as any).ten;

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Invalid application id generated from user payload!";
      //GetAllUser should not be called - call ended before fetching user's data
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 403 and not delete the user - if there is no application of given id", async () => {
      appId = "ten-fakeTen-sub-fakeSub";
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "fakeTen",
        user_name: "test_global_admin_22@user.name",
        subtenant: "fakeSub",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Application of given id not found for the user!";
      //GetAllUser should not be called - call ended before fetching user's data
      expectedGetAllUsersCallNumber = 0;
      //GetAssets should be called x2 - try fetching fake app
      expectedGetAssetsCallNumber = 2;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 403 and not delete the user - if app id in user's payload and param differs", async () => {
      appId = "ten-testTenant2";
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. No access to given application!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 403 and not delete the user - if there is no application data for given app", async () => {
      delete fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["main.app.config.json"];

      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Main application settings not found for the user!";
      expectedFileServiceContent = cloneObject(fileServiceContent);

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Main application settings not found for the user!";
      //GetAllUser should not be called - call ended before fetching user's data
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      //47 calls of getFileContent - no file containing one main app data
      expectedGetFileContentCallNumber = 47;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 403 and not delete the user - if user has valid scope, doest not exist in user service but exists in file service", async () => {
      //Adding user to file service for the app
      fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testFakeUser23.user.config.json"] = {
        data: {
          testPlant4: {
            testFakeUser23TestPlant4Data: "testFakeUser23TestPlant4DataValue",
          },
          testPlant5: {
            testFakeUser23TestPlant5Data: "testFakeUser23TestPlant5DataValue",
          },
        },
        config: {
          testPlant4: {
            testFakeUser23TestPlant4Config:
              "testFakeUser23TestPlant4ConfigValue",
          },
          testPlant5: {
            testFakeUser23TestPlant5Config:
              "testFakeUser23TestPlant5ConfigValue",
          },
        },
        userName: "test_fake_user_23@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant5: PlantPermissions.User,
            testPlant6: PlantPermissions.User,
          },
        },
      };

      //Creating new user's jwt payload
      userPayload = {
        client_id: "testFakeUserClientId",
        email: "testFakeUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_fake_user_23@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. User of given name not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      //49 calls of getFileContent - one additional user
      expectedGetFileContentCallNumber = 49;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 403 and not delete the user - if user has valid scope, exists in user service but does not exist in file service", async () => {
      userServiceContent["testTenant2"]["testFakeUser23"] = {
        active: true,
        name: {
          familyName: "testFakeUser23FamilyName",
          givenName: "testFakeUser23GivenName",
        },
        userName: "test_fake_user_23@user.name",
        emails: [
          {
            value: "testFakeUser23Email",
          },
        ],
        groups: [],
        externalId: "testFakeUser23ExternalId",
        id: "testFakeUser23",
        subtenants: [
          {
            id: "subtenant2",
          },
        ],
      };

      userGroupServiceContent.testTenant2.globalAdminGroup.members.push({
        type: "USER",
        value: "testFakeUser23",
      });

      userGroupServiceContent.testTenant2.subtenantUserGroup.members.push({
        type: "USER",
        value: "testFakeUser23",
      });

      //Creating new user's jwt payload
      userPayload = {
        client_id: "testFakeUserClientId",
        email: "testFakeUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_fake_user_23@user.name",
        subtenant: "subtenant2",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User does not exist for given app id!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 403 and not delete the user - if user has no access to the app - invalid scope", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["fakeScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22_user_name",
      };

      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Forbidden access. No scope found to access the app!";
      //0 calls of getAllUsers - not fetching user's data - checking scope before fetching
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 403 and not delete the user - if subtenant user attempts to get user for tenant app", async () => {
      appId = "ten-testTenant2";
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22@user.name",
        subtenant: "subtenant2",
      };

      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. No access to given application!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 403 and not delete the user - if tenant user attempts to get user for subtenant app", async () => {
      appId = "ten-testTenant2-sub-subtenant2";
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_21@user.name",
      };

      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. No access to given application!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 401 - if authorization token is invalid - no bearer prefix", async () => {
      requestHeaders["authorization"] = jwt.sign(userPayload, "testPrivateKey");

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";
      //No calling getAllUsers - returning before fetching user's data
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 401 - if authorization token is invalid - invalid token", async () => {
      requestHeaders["authorization"] =
        "Bearer thisIsTheFakeValueOfTheJWTToken";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";
      //No calling getAllUsers - returning before fetching user's data
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    it("should return 401 - if authorization token is invalid - no token provided", async () => {
      delete requestHeaders["authorization"];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";
      //No calling getAllUsers - returning before fetching user's data
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========

    //#region ========== MINDSPHERE SERVICE THROWS ==========

    it("should return 500 and not delete the user or its plantIds - if get all users throws", async () => {
      getAllUsersThrows = true;

      expectedValidCall = false;
      expectedResponseCode = 500;
      expectedErrorText = `Ups.. Something fails..`;
      //0 calls for getAllUsers - becouse getAllUsers mock is overridden with a different mocked method
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test get all users error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    it("should return 500 and not delete the user or its plantIds - if delete user throws - user has access only to given plant (user)", async () => {
      deleteUserThrows = true;
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = {
        data: {
          testPlant5: {
            testLocalUser22TestPlant5Data: "testLocalUser22TestPlant5DataValue",
          },
        },
        config: {
          testPlant5: {
            testLocalUser22TestPlant5Config:
              "testLocalUser22TestPlant5ConfigValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant5: PlantPermissions.User,
          },
        },
      };

      expectedValidCall = false;
      expectedResponseCode = 500;
      expectedErrorText = `Ups.. Something fails..`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      //0 calls for deleteUser - becouse deleteUser mock is overridden with a different mocked method
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test delete user error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    it("should return 500 and delete user from service - if delete file throws - user has access only to given plant (user)", async () => {
      deleteFileThrows = true;
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = {
        data: {
          testPlant5: {
            testLocalUser22TestPlant5Data: "testLocalUser22TestPlant5DataValue",
          },
        },
        config: {
          testPlant5: {
            testLocalUser22TestPlant5Config:
              "testLocalUser22TestPlant5ConfigValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant5: PlantPermissions.User,
          },
        },
      };

      expectedValidCall = false;
      expectedResponseCode = 500;
      expectedErrorText = `Ups.. Something fails..`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      expectedSetFileContentCallNumber = 0;
      //0 calls for deleteFile - becouse deleteFile mock is overridden with a different mocked method
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 1;

      await testLocalUserDelete();

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test delete file error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    it("should return 500 and not delete the user or its plantIds - if set file throws - user has access to multiple plants (user)", async () => {
      setFileThrows = true;
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = {
        data: {
          testPlant5: {
            testLocalUser22TestPlant5Data: "testLocalUser22TestPlant5DataValue",
          },
          testPlant6: {
            testLocalUser22TestPlant6Data: "testLocalUser22TestPlant6DataValue",
          },
        },
        config: {
          testPlant5: {
            testLocalUser22TestPlant5Config:
              "testLocalUser22TestPlant5ConfigValue",
          },
          testPlant6: {
            testLocalUser22TestPlant6Config:
              "testLocalUser22TestPlant6ConfigValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant5: PlantPermissions.User,
            testPlant6: PlantPermissions.User,
          },
        },
      };

      expectedValidCall = false;
      expectedResponseCode = 500;
      expectedErrorText = `Ups.. Something fails..`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //FileService content should not have changed
      expectedFileServiceContent = cloneObject(fileServiceContent);
      //0 calls for setFileContent - becouse setFileContent mock is overridden with a different mocked method
      expectedSetFileContentCallNumber = 0;
      expectedDeleteFileCallNumber = 0;
      expectedDeleteUserCallNumber = 0;

      await testLocalUserDelete();

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test set file content error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    //#endregion ========== MINDSPHERE SERVICE THROWS ==========
  });
});

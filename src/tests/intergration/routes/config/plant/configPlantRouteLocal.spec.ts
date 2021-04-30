import request from "supertest";
import {
  PlantPermissions,
  UserRole,
  UserStorageData,
} from "../../../../../classes/MindSphereApp/MindSphereApp";
import { MindSphereFileService } from "../../../../../classes/MindSphereService/MindSphereFileService";
import { MindSphereUserService } from "../../../../../classes/MindSphereService/MindSphereUserService";
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

describe("config plant route", () => {
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
   * @description Method for creating response containt all plants data payloads to which user has na access
   */
  const getUserPlantsDataResponse = (
    appId: string,
    appAssetId: string,
    userName: string
  ) => {
    const tenantName = "hostTenant";

    //Finding payload of given user by username
    let allUsersPayload = Object.values(
      fileServiceContent[tenantName][appAssetId]
    ) as UserStorageData[];
    let userPayload = allUsersPayload.find(
      (payload) => payload.userName === userName
    )!;

    let userPlantsPayload: any = {};

    for (let plantId of Object.keys(userPayload.permissions.plants)) {
      let plantPermissions = userPayload.permissions.plants[plantId];

      if (
        plantPermissions === PlantPermissions.User ||
        plantPermissions === PlantPermissions.Admin
      ) {
        let plantPayload = getPlantDataResponse(appId, appAssetId, plantId);
        if (plantPayload != null) userPlantsPayload[plantId] = plantPayload;
      }
    }

    return userPlantsPayload;
  };

  /**
   * @description Method for creating response contain plant data payload
   */
  const getPlantDataResponse = (
    appId: string,
    appAssetId: string,
    plantId: string
  ) => {
    let plantPayload: any = {};

    let plantStorageContent = getPlantsStorageContent(appId, appAssetId);

    if (plantStorageContent[plantId] == null) return null;

    plantPayload = {
      ...plantStorageContent[plantId],
      plantId: plantId,
      appId: appId,
    };

    return plantPayload;
  };

  /**
   * @description Method for getting content of plants storage
   */
  const getPlantsStorageContent = (appId: string, appAssetId: string) => {
    const tenantName = "hostTenant";

    let allPlantsPayload: any = {};

    let plantFilePaths = Object.keys(
      fileServiceContent[tenantName][appAssetId]
    ).filter((filePath) => filePath.includes(".plant.config.json"));

    for (let plantFilePath of plantFilePaths) {
      let plantFileContent =
        fileServiceContent[tenantName][appAssetId][plantFilePath];
      let plantId = plantFilePath.replace(".plant.config.json", "");
      allPlantsPayload[plantId] = {
        ...plantFileContent,
      };
    }

    return allPlantsPayload;
  };

  describe("GET /local/:appId", () => {
    let requestHeaders: any;
    let userPayload: MindSphereUserJWTData;
    let appId: string;
    let getAllUsersThrows: boolean;

    //Outputs
    let expectedValidCall: boolean;
    let expectedResponseCode: number;
    let expectedErrorText: string | null;
    let expectedGetAllUsersCallNumber: number;
    let expectedGetAssetsCallNumber: number;
    let expectedGetFileContentCallNumber: number;

    beforeEach(() => {
      //Inputs
      requestHeaders = {};
      appId = "ten-testTenant2-sub-subtenant2";
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
    });

    let exec = async () => {
      await beforeExec();

      if (getAllUsersThrows) {
        MindSphereUserService.getInstance().getAllUsers = jest.fn(async () => {
          throw new Error("Test get all users error");
        });
      }

      return request(server)
        .get(`/customApi/config/plant/local/${appId}`)
        .set(requestHeaders)
        .send();
    };

    const testLocalPlantsGet = async () => {
      let result = await exec();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(expectedResponseCode);

      if (expectedValidCall) {
        let expectedPayload = getUserPlantsDataResponse(
          appId,
          `${appId}-asset-id`,
          userPayload.user_name
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

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let app = MindSphereAppsManager.getInstance().Apps[appId] as any;

      //Testing app only if it exists
      if (app != null) {
        let storagePayload = (MindSphereAppsManager.getInstance().Apps[
          appId
        ] as any)._plantStorage._cacheData;

        let allPlantsPayload: any = {};

        let plantFilePaths = Object.keys(
          fileServiceContent["hostTenant"][`${appId}-asset-id`]
        ).filter((filePath) => filePath.includes(".plant.config.json"));

        for (let plantFilePath of plantFilePaths) {
          let plantFileContent =
            fileServiceContent["hostTenant"][`${appId}-asset-id`][
              plantFilePath
            ];
          let plantId = plantFilePath.replace(".plant.config.json", "");
          allPlantsPayload[plantId] = {
            ...plantFileContent,
          };
        }

        expect(storagePayload).toEqual(allPlantsPayload);
      }

      //#endregion  =====  CHECKING STORAGE =====
    };

    it("should return 200 and payload of all plants of the app available for the user", async () => {
      await testLocalPlantsGet();
    });

    it("should return 200 and payload of all plants of the app available for the user - if app is a subtenant app", async () => {
      appId = "ten-testTenant2-sub-subtenant2";
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

      await testLocalPlantsGet();
    });

    it("should return 200 and payload of all plants of the app available for the user - if app is a tenant app", async () => {
      appId = "ten-testTenant2";
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

      await testLocalPlantsGet();
    });

    it("should fetch plants data and return 200 - if there are plants in storage but not in cache", async () => {
      let oldPlant4 =
        fileServiceContent["hostTenant"][`${appId}-asset-id`][
          `testPlant4.plant.config.json`
        ];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testPlant4.plant.config.json`
      ];
      let oldPlant5 =
        fileServiceContent["hostTenant"][`${appId}-asset-id`][
          `testPlant5.plant.config.json`
        ];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testPlant5.plant.config.json`
      ];

      await beforeExec();

      //Restoring plant's data to file service
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testPlant4.plant.config.json`
      ] = oldPlant4;
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testPlant5.plant.config.json`
      ] = oldPlant5;

      //Setting file service content again
      setFileServiceContent(fileServiceContent);

      let result = await request(server)
        .get(`/customApi/config/plant/local/${appId}`)
        .set(requestHeaders)
        .send();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(expectedResponseCode);

      let expectedPayload = getUserPlantsDataResponse(
        appId,
        `${appId}-asset-id`,
        userPayload.user_name
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

      //Then plants data should be fetched - 46 times + 2 times when getting all plants
      expect(getFileContent).toHaveBeenCalledTimes(48);
      let laterPlantCalls = [
        getFileContent.mock.calls[46],
        getFileContent.mock.calls[47],
      ];

      expect(laterPlantCalls).toContainEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `testPlant4.plant.config.json`,
      ]);

      expect(laterPlantCalls).toContainEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `testPlant5.plant.config.json`,
      ]);

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      //Plant's storage payload should contain call plants - together with plant's fetched later

      let storagePayload = (MindSphereAppsManager.getInstance().Apps[
        appId
      ] as any)._plantStorage._cacheData;

      let allPlantsPayload: any = {};

      let plantFilePaths = Object.keys(
        fileServiceContent["hostTenant"][`${appId}-asset-id`]
      ).filter((filePath) => filePath.includes(".plant.config.json"));

      for (let plantFilePath of plantFilePaths) {
        let plantFileContent =
          fileServiceContent["hostTenant"][`${appId}-asset-id`][plantFilePath];
        let plantId = plantFilePath.replace(".plant.config.json", "");
        allPlantsPayload[plantId] = {
          ...plantFileContent,
        };
      }

      expect(storagePayload).toEqual(allPlantsPayload);

      //#endregion  =====  CHECKING STORAGE =====
    });

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should return 200 and payload of all plants of the app available for the user - if user has no plants available", async () => {
      //Deleting plants from
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].data = {};
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].config = {};
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.plants = {};

      await testLocalPlantsGet();
    });

    it("should return 200 and payload of all plants of the app available for the user - if user has only one plant available", async () => {
      //Inputs
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].data = { testPlant4: { testPlant4Data: "testPlant4DataValue" } };
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].config = { testPlant4: { testPlant4Config: "testPlant4ConfigValue" } };
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.plants = {
        testPlant4: PlantPermissions.User,
      };

      await testLocalPlantsGet();
    });

    it("should return 200 and payload of all plants of the app available for the user - if user has all plants available", async () => {
      //Inputs
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].data = {
        testPlant4: { testPlant4Data: "testPlant4DataValue" },
        testPlant5: { testPlant5Data: "testPlant5DataValue" },
        testPlant6: { testPlant6Data: "testPlant6DataValue" },
      };
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].config = {
        testPlant4: { testPlant4Config: "testPlant4ConfigValue" },
        testPlant5: { testPlant5Config: "testPlant5ConfigValue" },
        testPlant6: { testPlant6Config: "testPlant6ConfigValue" },
      };
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.plants = {
        testPlant4: PlantPermissions.User,
        testPlant5: PlantPermissions.User,
        testPlant6: PlantPermissions.User,
      };

      await testLocalPlantsGet();
    });

    it("should return 200 and payload of all plants of the app available for the user - if user has more plants available then there are payloads available", async () => {
      //Inputs
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].data = {
        testPlant4: { testPlant4Data: "testPlant4DataValue" },
        testPlant5: { testPlant5Data: "testPlant5DataValue" },
        testPlant6: { testPlant6Data: "testPlant6DataValue" },
        testPlant7: { testPlant7Data: "testPlant7DataValue" },
      };
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].config = {
        testPlant4: { testPlant4Config: "testPlant4ConfigValue" },
        testPlant5: { testPlant5Config: "testPlant5ConfigValue" },
        testPlant6: { testPlant6Config: "testPlant6ConfigValue" },
        testPlant7: { testPlant7Config: "testPlant7ConfigValue" },
      };
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.plants = {
        testPlant4: PlantPermissions.User,
        testPlant5: PlantPermissions.User,
        testPlant6: PlantPermissions.User,
        testPlant7: PlantPermissions.User,
      };

      await testLocalPlantsGet();
    });

    it("should return 200 and payload of all plants of the app available for the user - if user has User access to the plant", async () => {
      //Inputs
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].data = { testPlant4: { testPlant4Data: "testPlant4DataValue" } };
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].config = { testPlant4: { testPlant4Config: "testPlant4ConfigValue" } };
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.plants = {
        testPlant4: PlantPermissions.User,
      };

      await testLocalPlantsGet();
    });

    it("should return 200 and payload of all plants of the app available for the user - if user has Admin access to the plant", async () => {
      //Inputs
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].data = { testPlant4: { testPlant4Data: "testPlant4DataValue" } };
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].config = { testPlant4: { testPlant4Config: "testPlant4ConfigValue" } };
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.plants = {
        testPlant4: PlantPermissions.Admin,
      };

      await testLocalPlantsGet();
    });

    it("should return 200 and payload of all plants of the app available for the user - if global admin tries to get the plants", async () => {
      appId = "ten-testTenant2-sub-subtenant2";
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

      await testLocalPlantsGet();
    });

    it("should return 200 and payload of all plants of the app available for the user - if global user tries to get the plants", async () => {
      appId = "ten-testTenant2-sub-subtenant2";
      userPayload = {
        client_id: "testGlobalUserClientId",
        email: "testGlobalUserEmail",
        scope: ["testGlobalUserScope"],
        ten: "testTenant2",
        user_name: "test_global_user_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      await testLocalPlantsGet();
    });

    it("should return 200 and payload of all plants of the app available for the user - if local admin tries to get the plants", async () => {
      appId = "ten-testTenant2-sub-subtenant2";
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

      await testLocalPlantsGet();
    });

    it("should return 200 and payload of all plants of the app available for the user - if local user tries to get the plants", async () => {
      appId = "ten-testTenant2-sub-subtenant2";
      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_local_user_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      await testLocalPlantsGet();
    });

    it("should return 403 and not get all plants - if user's jwt payload does not have tenant assigned", async () => {
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

      await testLocalPlantsGet();
    });

    it("should return 403 and not get all plants - if there is no application of given id", async () => {
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

      await testLocalPlantsGet();
    });

    it("should return 403 and not get all plants - if app id in user's payload and param differs", async () => {
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

      await testLocalPlantsGet();
    });

    it("should return 403 and not get all plants - if there is no application data for given app", async () => {
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

      await testLocalPlantsGet();
    });

    it("should return 403 and not get all plants - if user has invalid role", async () => {
      //Adding user to file service for the app
      (fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.role = 99),
        //Outputs
        (expectedValidCall = false);
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global user or admin or local user or admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;

      await testLocalPlantsGet();
    });

    it("should return 403 and not get all plants - if user has valid scope, doest not exist in user service but exists in file service", async () => {
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

      await testLocalPlantsGet();
    });

    it("should return 403 and not get all plants - if user has valid scope, exists in user service but does not exist in file service", async () => {
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

      await testLocalPlantsGet();
    });

    it("should return 403 and not get all plants - if user has no access to the app - invalid scope", async () => {
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

      await testLocalPlantsGet();
    });

    it("should return 403 and not get all plants - if subtenant user attempts to get user for tenant app", async () => {
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

      await testLocalPlantsGet();
    });

    it("should return 403 and not get all plants - if tenant user attempts to get user for subtenant app", async () => {
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

      await testLocalPlantsGet();
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

      await testLocalPlantsGet();
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

      await testLocalPlantsGet();
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

      await testLocalPlantsGet();
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========

    //#region ========== MINDSPHERE SERVICE THROWS ==========

    it("should return 500 and not get all plants - if get all users throws", async () => {
      getAllUsersThrows = true;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 500;
      expectedErrorText = `Ups.. Something fails..`;
      //0 calls for getAllUsers - becouse getAllUsers mock is overridden with a different mocked method
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;

      await testLocalPlantsGet();

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test get all users error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    it("should return 500 and not get all plants  - if plants does not exists in cache but in storage and getFileContent throws", async () => {
      let oldPlant5 =
        fileServiceContent["hostTenant"][`${appId}-asset-id`][
          `testPlant5.plant.config.json`
        ];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testPlant5.plant.config.json`
      ];

      await beforeExec();

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testPlant5.plant.config.json`
      ] = oldPlant5;

      //Setting file service content again
      setFileServiceContent(fileServiceContent);

      MindSphereFileService.getInstance().getFileContent = jest.fn(async () => {
        throw new Error("Test get all users error");
      });

      let result = await request(server)
        .get(`/customApi/config/plant/local/${appId}`)
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
      expect(getAssets).toHaveBeenCalledTimes(expectedGetAssetsCallNumber);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //GetFileContent should be called 47 times - 48th is calling a different mock function
      expect(getFileContent).toHaveBeenCalledTimes(47);

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let app = MindSphereAppsManager.getInstance().Apps[appId] as any;

      //Testing app only if it exists
      if (app != null) {
        let storagePayload = (MindSphereAppsManager.getInstance().Apps[
          appId
        ] as any)._plantStorage._cacheData;

        let allPlantsPayload: any = {};

        let plantFilePaths = Object.keys(
          fileServiceContent["hostTenant"][`${appId}-asset-id`]
        ).filter((filePath) => filePath.includes(".plant.config.json"));

        for (let plantFilePath of plantFilePaths) {
          let plantFileContent =
            fileServiceContent["hostTenant"][`${appId}-asset-id`][
              plantFilePath
            ];
          let plantId = plantFilePath.replace(".plant.config.json", "");
          allPlantsPayload[plantId] = {
            ...plantFileContent,
          };
        }

        //storage should not contain not fetched data
        delete allPlantsPayload["testPlant5"];

        expect(storagePayload).toEqual(allPlantsPayload);
      }

      //#endregion  =====  CHECKING STORAGE =====

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test get all users error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    //#endregion ========== MINDSPHERE SERVICE THROWS ==========
  });

  describe("GET /local/:appId/:plantId", () => {
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
    });

    let exec = async () => {
      await beforeExec();

      if (getAllUsersThrows) {
        MindSphereUserService.getInstance().getAllUsers = jest.fn(async () => {
          throw new Error("Test get all users error");
        });
      }

      return request(server)
        .get(`/customApi/config/plant/local/${appId}/${plantId}`)
        .set(requestHeaders)
        .send();
    };

    const testLocalPlantGet = async () => {
      let result = await exec();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(expectedResponseCode);

      if (expectedValidCall) {
        let expectedPayload = getPlantDataResponse(
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

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let app = MindSphereAppsManager.getInstance().Apps[appId] as any;

      //Testing app only if it exists
      if (app != null) {
        let storagePayload = (MindSphereAppsManager.getInstance().Apps[
          appId
        ] as any)._plantStorage._cacheData;

        let allPlantsPayload: any = {};

        let plantFilePaths = Object.keys(
          fileServiceContent["hostTenant"][`${appId}-asset-id`]
        ).filter((filePath) => filePath.includes(".plant.config.json"));

        for (let plantFilePath of plantFilePaths) {
          let plantFileContent =
            fileServiceContent["hostTenant"][`${appId}-asset-id`][
              plantFilePath
            ];
          let plantId = plantFilePath.replace(".plant.config.json", "");
          allPlantsPayload[plantId] = {
            ...plantFileContent,
          };
        }

        expect(storagePayload).toEqual(allPlantsPayload);
      }

      //#endregion  =====  CHECKING STORAGE =====
    };

    it("should return 200 and payload of given plant", async () => {
      await testLocalPlantGet();
    });

    it("should return 200 and payload of given plant - if app is a subtenant app", async () => {
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

      await testLocalPlantGet();
    });

    it("should return 200 and payload of given plant - if app is a tenant app", async () => {
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

      await testLocalPlantGet();
    });

    it("should fetch the plant's data and return 200 - if plant's data exists in storage but not in cache", async () => {
      let oldPlant5 =
        fileServiceContent["hostTenant"][`${appId}-asset-id`][
          `testPlant5.plant.config.json`
        ];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testPlant5.plant.config.json`
      ];

      await beforeExec();

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testPlant5.plant.config.json`
      ] = oldPlant5;

      //Setting file service content again
      setFileServiceContent(fileServiceContent);

      let result = await request(server)
        .get(`/customApi/config/plant/local/${appId}/${plantId}`)
        .set(requestHeaders)
        .send();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(expectedResponseCode);

      let expectedPayload = getPlantDataResponse(
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

      //getFileContent should have been called 47 times during initialization and 48th time during fetching plant's data
      expect(getFileContent).toHaveBeenCalledTimes(48);
      expect(getFileContent.mock.calls[47]).toEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `${plantId}.plant.config.json`,
      ]);

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let app = MindSphereAppsManager.getInstance().Apps[appId] as any;

      let storagePayload = (MindSphereAppsManager.getInstance().Apps[
        appId
      ] as any)._plantStorage._cacheData;

      let allPlantsPayload: any = {};

      let plantFilePaths = Object.keys(
        fileServiceContent["hostTenant"][`${appId}-asset-id`]
      ).filter((filePath) => filePath.includes(".plant.config.json"));

      for (let plantFilePath of plantFilePaths) {
        let plantFileContent =
          fileServiceContent["hostTenant"][`${appId}-asset-id`][plantFilePath];
        let plantId = plantFilePath.replace(".plant.config.json", "");
        allPlantsPayload[plantId] = {
          ...plantFileContent,
        };
      }

      expect(storagePayload).toEqual(allPlantsPayload);

      //#endregion  =====  CHECKING STORAGE =====
    });

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should return 404 - if there is no plant of given id", async () => {
      plantId = "fakePlant";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;

      await testLocalPlantGet();
    });

    it("should return 404 - if there is no plant's data for given plantId but it exists in user's permissions", async () => {
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${plantId}.plant.config.json`
      ];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant data not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      //One file of plant does not exist
      expectedGetFileContentCallNumber = 47;

      await testLocalPlantGet();
    });

    it("should return 404 - if user is a local user without local access to given plant", async () => {
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ].permissions.plants[plantId];

      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_local_user_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;

      await testLocalPlantGet();
    });

    it("should return 404 - if user is a local admin without local access to given plant", async () => {
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.plants[plantId];

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

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;

      await testLocalPlantGet();
    });

    it("should return 404 - if user is a global user without local access to given plant", async () => {
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].permissions.plants[plantId];

      userPayload = {
        client_id: "testGlobalUserClientId",
        email: "testGlobalUserEmail",
        scope: ["testGlobalUserScope"],
        ten: "testTenant2",
        user_name: "test_global_user_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;

      await testLocalPlantGet();
    });

    it("should return 404 - if user is a global admin without local access to given plant", async () => {
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId];

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
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;

      await testLocalPlantGet();
    });

    it("should return 200 - if user is a local user with user access to the plant", async () => {
      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_local_user_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.User;

      await testLocalPlantGet();
    });

    it("should return 200 - if user is a local admin with user access to the plant", async () => {
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
        `testLocalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.User;

      await testLocalPlantGet();
    });

    it("should return 200 - if user is a global user with user access to the plant", async () => {
      userPayload = {
        client_id: "testGlobalUserClientId",
        email: "testGlobalUserEmail",
        scope: ["testGlobalUserScope"],
        ten: "testTenant2",
        user_name: "test_global_user_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.User;

      await testLocalPlantGet();
    });

    it("should return 200 - if user is a global admin with user access to the plant", async () => {
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
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.User;

      await testLocalPlantGet();
    });

    it("should return 200 - if user is a local admin with admin access to the plant", async () => {
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
        `testLocalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      await testLocalPlantGet();
    });

    it("should return 200 - if user is a global admin with admin access to the plant", async () => {
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
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      await testLocalPlantGet();
    });

    it("should return 404 - if user is a local user with invalid user role", async () => {
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ].permissions.plants[plantId] = 99;

      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_local_user_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;

      await testLocalPlantGet();
    });

    it("should return 404 - if user is a local admin with invalid user role", async () => {
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.plants[plantId] = 99;

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

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;

      await testLocalPlantGet();
    });

    it("should return 404 - if user is a global user with invalid user role", async () => {
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].permissions.plants[plantId] = 99;

      userPayload = {
        client_id: "testGlobalUserClientId",
        email: "testGlobalUserEmail",
        scope: ["testGlobalUserScope"],
        ten: "testTenant2",
        user_name: "test_global_user_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;

      await testLocalPlantGet();
    });

    it("should return 404 - if user is a global admin with invalid user role", async () => {
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId] = 99;

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
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;

      await testLocalPlantGet();
    });

    it("should return 403 and not get the plant - if user's jwt payload does not have tenant assigned", async () => {
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

      await testLocalPlantGet();
    });

    it("should return 403 and not get the plant - if there is no application of given id", async () => {
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

      await testLocalPlantGet();
    });

    it("should return 403 and not get the plant - if app id in user's payload and param differs", async () => {
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

      await testLocalPlantGet();
    });

    it("should return 403 and not get the plant - if there is no application data for given app", async () => {
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

      await testLocalPlantGet();
    });

    it("should return 403 and not get the plant - if user has invalid role", async () => {
      //Adding user to file service for the app
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.role = 99;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global user or admin or local user or admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;

      await testLocalPlantGet();
    });

    it("should return 403 and not get the plant - if user has valid scope, doest not exist in user service but exists in file service", async () => {
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

      await testLocalPlantGet();
    });

    it("should return 403 and not get the plant - if user has valid scope, exists in user service but does not exist in file service", async () => {
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

      await testLocalPlantGet();
    });

    it("should return 403 and not get the plant - if user has no access to the app - invalid scope", async () => {
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

      await testLocalPlantGet();
    });

    it("should return 403 and not get the plant - if subtenant user attempts to get user for tenant app", async () => {
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

      await testLocalPlantGet();
    });

    it("should return 403 and not get the plant - if tenant user attempts to get user for subtenant app", async () => {
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

      await testLocalPlantGet();
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

      await testLocalPlantGet();
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

      await testLocalPlantGet();
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

      await testLocalPlantGet();
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========

    //#region ========== MINDSPHERE SERVICE THROWS ==========

    it("should return 500 and not get plant - if get all users throws", async () => {
      getAllUsersThrows = true;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 500;
      expectedErrorText = `Ups.. Something fails..`;
      //0 calls for getAllUsers - becouse getAllUsers mock is overridden with a different mocked method
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;

      await testLocalPlantGet();

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test get all users error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    it("should return 500 and not get plant - if plant does not exists in cache but in storage and getFileContent throws", async () => {
      let oldPlant5 =
        fileServiceContent["hostTenant"][`${appId}-asset-id`][
          `testPlant5.plant.config.json`
        ];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testPlant5.plant.config.json`
      ];

      await beforeExec();

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testPlant5.plant.config.json`
      ] = oldPlant5;

      //Setting file service content again
      setFileServiceContent(fileServiceContent);

      MindSphereFileService.getInstance().getFileContent = jest.fn(async () => {
        throw new Error("Test get all users error");
      });

      let result = await request(server)
        .get(`/customApi/config/plant/local/${appId}/${plantId}`)
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
      expect(getAssets).toHaveBeenCalledTimes(expectedGetAssetsCallNumber);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //GetFileContent should be called 47 times - 48th is calling a different mock function
      expect(getFileContent).toHaveBeenCalledTimes(47);

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let app = MindSphereAppsManager.getInstance().Apps[appId] as any;

      //Testing app only if it exists
      if (app != null) {
        let storagePayload = (MindSphereAppsManager.getInstance().Apps[
          appId
        ] as any)._plantStorage._cacheData;

        let allPlantsPayload: any = {};

        let plantFilePaths = Object.keys(
          fileServiceContent["hostTenant"][`${appId}-asset-id`]
        ).filter((filePath) => filePath.includes(".plant.config.json"));

        for (let plantFilePath of plantFilePaths) {
          let plantFileContent =
            fileServiceContent["hostTenant"][`${appId}-asset-id`][
              plantFilePath
            ];
          let plantId = plantFilePath.replace(".plant.config.json", "");
          allPlantsPayload[plantId] = {
            ...plantFileContent,
          };
        }

        //storage should not contain not fetched data
        delete allPlantsPayload[plantId];

        expect(storagePayload).toEqual(allPlantsPayload);
      }

      //#endregion  =====  CHECKING STORAGE =====

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test get all users error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    //#endregion ========== MINDSPHERE SERVICE THROWS ==========
  });

  describe("PUT /local/:appId/:plantId", () => {
    let requestHeaders: any;
    let requestBody: any;
    let userPayload: MindSphereUserJWTData;
    let appId: string;
    let plantId: string;
    let getAllUsersThrows: boolean;
    let setFileContentThrows: boolean;

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
        plantId: plantId,
        data: {
          testPlant5Data: "testPlant5ModifiedDataValue",
        },
        config: {
          testPlant5Config: "testPlant5ModifiedConfigValue",
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
        .put(`/customApi/config/plant/local/${appId}/${plantId}`)
        .set(requestHeaders)
        .send(requestBody);
    };

    const testLocalPlantUpdate = async () => {
      let result = await exec();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(expectedResponseCode);

      if (expectedValidCall) {
        let expectedPayload = {
          ...requestBody,
          appId: appId,
        };

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

      expect(setFileContent).toHaveBeenCalledTimes(
        expectedSetFileContentCallNumber
      );
      if (expectedSetFileContentCallNumber > 0) {
        expect(setFileContent.mock.calls[0]).toEqual([
          "hostTenant",
          `${appId}-asset-id`,
          `${plantId}.plant.config.json`,
          {
            data: requestBody.data,
            config: requestBody.config,
          },
        ]);
      }

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let app = MindSphereAppsManager.getInstance().Apps[appId] as any;

      //Testing app only if it exists
      if (app != null) {
        let storagePayload = (MindSphereAppsManager.getInstance().Apps[
          appId
        ] as any)._plantStorage._cacheData;

        let allPlantsPayload: any = {};

        let plantFilePaths = Object.keys(
          fileServiceContent["hostTenant"][`${appId}-asset-id`]
        ).filter((filePath) => filePath.includes(".plant.config.json"));

        for (let plantFilePath of plantFilePaths) {
          let plantFileContent =
            fileServiceContent["hostTenant"][`${appId}-asset-id`][
              plantFilePath
            ];
          let plantId = plantFilePath.replace(".plant.config.json", "");
          allPlantsPayload[plantId] = {
            ...plantFileContent,
          };
        }

        //If call is valid - payload in storage should have been updated
        if (expectedValidCall) {
          allPlantsPayload[plantId] = {
            data: requestBody.data,
            config: requestBody.config,
          };
        }

        expect(storagePayload).toEqual(allPlantsPayload);
      }

      //#endregion  =====  CHECKING STORAGE =====
    };

    it("should update plant's data and return 200", async () => {
      await testLocalPlantUpdate();
    });

    it("should update plant's data and return 200 - if app is a subtenant app", async () => {
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
        plantId: plantId,
        data: {
          testPlant5Data: "testPlant5ModifiedDataValue",
        },
        config: {
          testPlant5Config: "testPlant5ModifiedConfigValue",
        },
      };

      await testLocalPlantUpdate();
    });

    it("should update plant's data and return 200 - if app is a tenant app", async () => {
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
        plantId: plantId,
        data: {
          testPlant2Data: "testPlant2ModifiedDataValue",
        },
        config: {
          testPlant2Config: "testPlant2ModifiedConfigValue",
        },
      };

      await testLocalPlantUpdate();
    });

    it("should fetch the plant's data then update it and return 200 - if plant's data exists in storage but not in cache", async () => {
      let oldPlant5 =
        fileServiceContent["hostTenant"][`${appId}-asset-id`][
          `testPlant5.plant.config.json`
        ];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testPlant5.plant.config.json`
      ];

      await beforeExec();

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testPlant5.plant.config.json`
      ] = oldPlant5;

      //Setting file service content again
      setFileServiceContent(fileServiceContent);

      let result = await request(server)
        .put(`/customApi/config/plant/local/${appId}/${plantId}`)
        .set(requestHeaders)
        .send(requestBody);

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(expectedResponseCode);

      let expectedPayload = {
        ...requestBody,
        appId: appId,
      };

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

      //getFileContent should have been called 47 times during initialization and 48th time during fetching plant's data
      expect(getFileContent).toHaveBeenCalledTimes(48);
      expect(getFileContent.mock.calls[47]).toEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `${plantId}.plant.config.json`,
      ]);

      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `${plantId}.plant.config.json`,
        {
          data: requestBody.data,
          config: requestBody.config,
        },
      ]);

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let app = MindSphereAppsManager.getInstance().Apps[appId] as any;

      let storagePayload = app._plantStorage._cacheData;

      let allPlantsPayload: any = {};

      let plantFilePaths = Object.keys(
        fileServiceContent["hostTenant"][`${appId}-asset-id`]
      ).filter((filePath) => filePath.includes(".plant.config.json"));

      for (let plantFilePath of plantFilePaths) {
        let plantFileContent =
          fileServiceContent["hostTenant"][`${appId}-asset-id`][plantFilePath];
        let plantId = plantFilePath.replace(".plant.config.json", "");
        allPlantsPayload[plantId] = {
          ...plantFileContent,
        };
      }

      //If call is valid - payload in storage should have been updated
      allPlantsPayload[plantId] = {
        data: requestBody.data,
        config: requestBody.config,
      };

      expect(storagePayload).toEqual(allPlantsPayload);

      //#endregion  =====  CHECKING STORAGE =====
    });

    //#region ========== BODY VALIDATION =========

    it("should return 400 - if request is not a valid JSON", async () => {
      requestBody = "fakeBody";

      await beforeExec();

      let result = await request(server)
        .put(`/customApi/config/plant/local/${appId}/${plantId}`)
        .send('{"invalid"}')
        .type("json");

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(400);

      expect(result.text).toEqual("Invalid request content");

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
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

      expect(setFileContent).toHaveBeenCalledTimes(0);

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let app = MindSphereAppsManager.getInstance().Apps[appId] as any;

      //Testing app only if it exists
      if (app != null) {
        let storagePayload = (MindSphereAppsManager.getInstance().Apps[
          appId
        ] as any)._plantStorage._cacheData;

        let allPlantsPayload: any = {};

        let plantFilePaths = Object.keys(
          fileServiceContent["hostTenant"][`${appId}-asset-id`]
        ).filter((filePath) => filePath.includes(".plant.config.json"));

        for (let plantFilePath of plantFilePaths) {
          let plantFileContent =
            fileServiceContent["hostTenant"][`${appId}-asset-id`][
              plantFilePath
            ];
          let plantId = plantFilePath.replace(".plant.config.json", "");
          allPlantsPayload[plantId] = {
            ...plantFileContent,
          };
        }

        expect(storagePayload).toEqual(allPlantsPayload);
      }

      //#endregion  =====  CHECKING STORAGE =====
    });

    it("should return 400 and not update the plant - if there is an attempt to update plant with appId in body", async () => {
      //Inputs
      requestBody.appId = appId;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `\"appId\" is not allowed`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalPlantUpdate();
    });

    it("should return 400 and not update the plant - if plant id is not defined", async () => {
      //Inputs
      delete requestBody.plantId;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `\"plantId\" is required`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalPlantUpdate();
    });

    it("should return 400 and not update the plant - if plant id is null", async () => {
      //Inputs
      requestBody.plantId = null;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `\"plantId\" must be a string`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalPlantUpdate();
    });

    it("should return 400 and not update the plant - if plant id is invalid type - number", async () => {
      //Inputs
      requestBody.plantId = 1234;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `\"plantId\" must be a string`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalPlantUpdate();
    });

    it("should return 400 and not update the plant - if plant id is an empty string", async () => {
      //Inputs
      requestBody.plantId = "";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `\"plantId\" is not allowed to be empty`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalPlantUpdate();
    });

    it("should return 400 and not update the plant - if plant id in request body is different then plantId in params", async () => {
      //Inputs
      requestBody.plantId = "testPlant6";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `Plant id cannot be changed!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalPlantUpdate();
    });

    it("should return 400 and not update the plant - if data in payload is undefined", async () => {
      //Inputs
      delete requestBody.data;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `\"data\" is required`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalPlantUpdate();
    });

    it("should return 400 and not update the plant - if data in payload is null", async () => {
      //Inputs
      requestBody.data = null;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `\"data\" must be of type object`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalPlantUpdate();
    });

    it("should return 400 and not update the plant - if data in payload is not an object (string)", async () => {
      //Inputs
      requestBody.data = "abcd1234";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `\"data\" must be of type object`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalPlantUpdate();
    });

    it("should return 200 and update the plant - if data in payload is not an empty object", async () => {
      //Inputs
      requestBody.data = {};

      //Outputs
      expectedValidCall = true;
      expectedResponseCode = 200;
      expectedErrorText = null;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 1;

      await testLocalPlantUpdate();
    });

    it("should return 200 and update the plant - if data in payload is a nested property", async () => {
      //Inputs
      requestBody.data = {
        a: {
          c: {
            e: 1234,
            f: 4321,
          },
          d: {
            g: 1234,
            h: 4321,
          },
        },
        b: {
          i: {
            k: "abcd",
            l: "dcba",
          },
          j: {
            m: "abcd",
            n: "dcba",
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

      await testLocalPlantUpdate();
    });

    it("should return 400 and not update the plant - if config in payload is undefined", async () => {
      //Inputs
      delete requestBody.config;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `\"config\" is required`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalPlantUpdate();
    });

    it("should return 400 and not update the plant - if config in payload is null", async () => {
      //Inputs
      requestBody.config = null;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `\"config\" must be of type object`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalPlantUpdate();
    });

    it("should return 400 and not update the plant - if config in payload is not an object (string)", async () => {
      //Inputs
      requestBody.config = "abcd1234";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `\"config\" must be of type object`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalPlantUpdate();
    });

    it("should return 200 and update the plant - if config in payload is not an empty object", async () => {
      //Inputs
      requestBody.config = {};

      //Outputs
      expectedValidCall = true;
      expectedResponseCode = 200;
      expectedErrorText = null;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 1;

      await testLocalPlantUpdate();
    });

    it("should return 200 and update the plant - if config in payload is a nested property", async () => {
      //Inputs
      requestBody.config = {
        a: {
          c: {
            e: 1234,
            f: 4321,
          },
          d: {
            g: 1234,
            h: 4321,
          },
        },
        b: {
          i: {
            k: "abcd",
            l: "dcba",
          },
          j: {
            m: "abcd",
            n: "dcba",
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

      await testLocalPlantUpdate();
    });

    //#endregion ========== BODY VALIDATION =========

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should return 404 - if there is no plant of given id", async () => {
      plantId = "fakePlant";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalPlantUpdate();
    });

    it("should return 404 - if there is no plant's data for given plantId but it exists in user's permissions", async () => {
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${plantId}.plant.config.json`
      ];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant data not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      //One file of plant does not exist
      expectedGetFileContentCallNumber = 47;
      expectedSetFileContentCallNumber = 0;

      await testLocalPlantUpdate();
    });

    it("should return 403 - if user is a local user without local access to given plant", async () => {
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ].permissions.plants[plantId];

      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_local_user_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global admin or local admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalPlantUpdate();
    });

    it("should return 404 - if user is a local admin without local access to given plant", async () => {
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.plants[plantId];

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

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalPlantUpdate();
    });

    it("should return 403 - if user is a global user without local access to given plant", async () => {
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].permissions.plants[plantId];

      userPayload = {
        client_id: "testGlobalUserClientId",
        email: "testGlobalUserEmail",
        scope: ["testGlobalUserScope"],
        ten: "testTenant2",
        user_name: "test_global_user_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global admin or local admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalPlantUpdate();
    });

    it("should return 404 - if user is a global admin without local access to given plant", async () => {
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId];

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
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalPlantUpdate();
    });

    it("should return 403 - if user is a local user with user access to the plant", async () => {
      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_local_user_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.User;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global admin or local admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalPlantUpdate();
    });

    it("should return 404 - if user is a local admin with user access to the plant", async () => {
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

      await testLocalPlantUpdate();
    });

    it("should return 403 - if user is a global user with user access to the plant", async () => {
      userPayload = {
        client_id: "testGlobalUserClientId",
        email: "testGlobalUserEmail",
        scope: ["testGlobalUserScope"],
        ten: "testTenant2",
        user_name: "test_global_user_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.User;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global admin or local admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalPlantUpdate();
    });

    it("should return 404 - if user is a global admin with user access to the plant", async () => {
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

      await testLocalPlantUpdate();
    });

    it("should return 200 - if user is a local admin with admin access to the plant", async () => {
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
        `testLocalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      await testLocalPlantUpdate();
    });

    it("should return 200 - if user is a global admin with admin access to the plant", async () => {
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
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId] = PlantPermissions.Admin;

      await testLocalPlantUpdate();
    });

    it("should return 403 - if user is a local user with invalid user role", async () => {
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalUser22.user.config.json`
      ].permissions.plants[plantId] = 99;

      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_local_user_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global admin or local admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalPlantUpdate();
    });

    it("should return 404 - if user is a local admin with invalid user role", async () => {
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.plants[plantId] = 99;

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

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalPlantUpdate();
    });

    it("should return 403 - if user is a global user with invalid user role", async () => {
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].permissions.plants[plantId] = 99;

      userPayload = {
        client_id: "testGlobalUserClientId",
        email: "testGlobalUserEmail",
        scope: ["testGlobalUserScope"],
        ten: "testTenant2",
        user_name: "test_global_user_22@user.name",
        subtenant: "subtenant2",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global admin or local admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalPlantUpdate();
    });

    it("should return 404 - if user is a global admin with invalid user role", async () => {
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId] = 99;

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
      expectedResponseCode = 404;
      expectedErrorText = "Plant of given id not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalPlantUpdate();
    });

    it("should return 403 and not update the plant - if user's jwt payload does not have tenant assigned", async () => {
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

      await testLocalPlantUpdate();
    });

    it("should return 403 and not update the plant - if there is no application of given id", async () => {
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

      await testLocalPlantUpdate();
    });

    it("should return 403 and not update the plant - if app id in user's payload and param differs", async () => {
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

      await testLocalPlantUpdate();
    });

    it("should return 403 and not update the plant - if there is no application data for given app", async () => {
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

      await testLocalPlantUpdate();
    });

    it("should return 403 and not update the plant - if user has invalid role", async () => {
      //Adding user to file service for the app
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ].permissions.role = 99;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global admin or local admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testLocalPlantUpdate();
    });

    it("should return 403 and not update the plant - if user has valid scope, doest not exist in user service but exists in file service", async () => {
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
      expectedSetFileContentCallNumber = 0;

      await testLocalPlantUpdate();
    });

    it("should return 403 and not update the plant - if user has valid scope, exists in user service but does not exist in file service", async () => {
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

      await testLocalPlantUpdate();
    });

    it("should return 403 and not update the plant - if user has no access to the app - invalid scope", async () => {
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

      await testLocalPlantUpdate();
    });

    it("should return 403 and not update the plant - if subtenant user attempts to update user for tenant app", async () => {
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

      await testLocalPlantUpdate();
    });

    it("should return 403 and not update the plant - if tenant user attempts to update user for subtenant app", async () => {
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

      await testLocalPlantUpdate();
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

      await testLocalPlantUpdate();
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

      await testLocalPlantUpdate();
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

      await testLocalPlantUpdate();
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========

    //#region ========== MINDSPHERE SERVICE THROWS ==========

    it("should return 500 and not create the plant - if get all users throws", async () => {
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

      await testLocalPlantUpdate();

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test get all users error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    it("should return 500 and not create the plant - if set file content throws", async () => {
      setFileContentThrows = true;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 500;
      expectedErrorText = `Ups.. Something fails..`;
      //0 calls for getAllUsers - becouse getAllUsers mock is overridden with a different mocked method
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //0 calls for setFileContent - becouse setFileContent mock is overridden with a different mocked method
      expectedSetFileContentCallNumber = 0;

      await testLocalPlantUpdate();

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

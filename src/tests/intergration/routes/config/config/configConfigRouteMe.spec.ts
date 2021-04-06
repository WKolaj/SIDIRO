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

describe("config config route", () => {
  let userServiceContent: MockedUserServiceContent;
  let userGroupServiceContent: MockedUserGroupServiceContent;
  let fileServiceContent: MockedFileServiceContent;
  let assetServiceContent: MockedAssetServiceContent;
  let logErrorMockFunc: jest.Mock;
  let server: Server;

  beforeEach(async () => {
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
    await mockMsUserGroupService(userGroupServiceContent);
    await mockMsUserService(userServiceContent);
    await mockMsFileService(fileServiceContent);
    await mockMsAssetService(assetServiceContent);

    //Starting the app
    server = await appStart(__dirname);
  };

  const getAppIdFromUserPaylad = (userPayload: MindSphereUserJWTData) => {
    return userPayload.subtenant != null
      ? `ten-${userPayload.ten}-sub-${userPayload.subtenant}`
      : `ten-${userPayload.ten}`;
  };

  /**
   * @description Method for creating response contain plant data payload
   */
  const getConfigResponse = (userPayload: MindSphereUserJWTData) => {
    let appId = getAppIdFromUserPaylad(userPayload);
    let appAssetId = `${appId}-asset-id`;

    let appDataStorageContent = getAppsStorageContent(appId, appAssetId);
    let plantDataStorageContent = getPlantsStorageContent(appId, appAssetId);
    let userDataStorageContent = getUsersStorageContent(appId, appAssetId);

    let payloadToReturn: any = {};
    payloadToReturn.appData = {
      ...appDataStorageContent["main"],
      appId: appId,
    };

    let userId = Object.keys(userServiceContent[userPayload.ten]).find(
      (id) =>
        userServiceContent[userPayload.ten][id].userName ===
        userPayload.user_name
    );
    let userData = {
      ...userDataStorageContent[userId!],
      userId: userId,
      appId: appId,
    };

    payloadToReturn.userData = userData;

    payloadToReturn.plantsData = {};
    //If user is global user or a global admin - he should have access to every plant
    if (
      userData.permissions.role === UserRole.GlobalAdmin ||
      userData.permissions.role === UserRole.GlobalUser
    ) {
      for (let plantId of Object.keys(plantDataStorageContent)) {
        payloadToReturn.plantsData[plantId] = {
          ...plantDataStorageContent[plantId],
          plantId: plantId,
          appId: appId,
        };
      }
    } else {
      for (let plantId of Object.keys(userData.permissions.plants)) {
        if (plantDataStorageContent[plantId] != null) {
          payloadToReturn.plantsData[plantId] = {
            ...plantDataStorageContent[plantId],
            plantId: plantId,
            appId: appId,
          };
        }
      }
    }

    return payloadToReturn;
  };

  /**
   * @description Method for getting content of plants storage
   */
  const getAppsStorageContent = (appId: string, appAssetId: string) => {
    const tenantName = "hostTenant";

    let allAppsPayload: any = {};

    let appFilePaths = Object.keys(
      fileServiceContent[tenantName][appAssetId]
    ).filter((filePath) => filePath.includes(".app.config.json"));

    for (let appFilePath of appFilePaths) {
      let appFileContent =
        fileServiceContent[tenantName][appAssetId][appFilePath];
      let appId = appFilePath.replace(".app.config.json", "");
      allAppsPayload[appId] = {
        ...appFileContent,
      };
    }

    return allAppsPayload;
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

  /**
   * @description Method for getting content of users storage
   */
  const getUsersStorageContent = (appId: string, appAssetId: string) => {
    const tenantName = "hostTenant";

    let allUsersPayload: any = {};

    let userFilePaths = Object.keys(
      fileServiceContent[tenantName][appAssetId]
    ).filter((filePath) => filePath.includes(".user.config.json"));

    for (let userFilePath of userFilePaths) {
      let userFileContent =
        fileServiceContent[tenantName][appAssetId][userFilePath];
      let userId = userFilePath.replace(".user.config.json", "");
      allUsersPayload[userId] = {
        ...userFileContent,
      };
    }

    return allUsersPayload;
  };

  describe("GET /me/", () => {
    let requestHeaders: any;
    let userPayload: MindSphereUserJWTData;
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
        .get(`/customApi/config/me`)
        .set(requestHeaders)
        .send();
    };

    const testMeConfigGet = async () => {
      let result = await exec();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(expectedResponseCode);

      if (expectedValidCall) {
        let expectedPayload = getConfigResponse(userPayload);

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

      let app = MindSphereAppsManager.getInstance().Apps[
        getAppIdFromUserPaylad(userPayload)
      ] as any;

      //Testing app only if it exists
      if (app != null) {
        //CHECKING PLANT'S STORAGE
        let plantsStorage = app._plantStorage._cacheData;

        let allPlantsPayload: any = {};

        let plantFilePaths = Object.keys(
          fileServiceContent["hostTenant"][
            `${getAppIdFromUserPaylad(userPayload)}-asset-id`
          ]
        ).filter((filePath) => filePath.includes(".plant.config.json"));

        for (let plantFilePath of plantFilePaths) {
          let plantFileContent =
            fileServiceContent["hostTenant"][
              `${getAppIdFromUserPaylad(userPayload)}-asset-id`
            ][plantFilePath];
          let plantId = plantFilePath.replace(".plant.config.json", "");
          allPlantsPayload[plantId] = {
            ...plantFileContent,
          };
        }

        expect(plantsStorage).toEqual(allPlantsPayload);

        //CHECKING USER'S STORAGE
        let usersStorage = app._userStorage._cacheData;

        let allUsersPayload: any = {};

        let userFilePaths = Object.keys(
          fileServiceContent["hostTenant"][
            `${getAppIdFromUserPaylad(userPayload)}-asset-id`
          ]
        ).filter((filePath) => filePath.includes(".user.config.json"));

        for (let userFilePath of userFilePaths) {
          let userFileContent =
            fileServiceContent["hostTenant"][
              `${getAppIdFromUserPaylad(userPayload)}-asset-id`
            ][userFilePath];
          let userId = userFilePath.replace(".user.config.json", "");
          allUsersPayload[userId] = {
            ...userFileContent,
          };
        }

        expect(usersStorage).toEqual(allUsersPayload);

        //CHECKING APP'S STORAGE
        let storagePayload = app._appStorage._cacheData;

        let allAppsPayload: any = {};

        let appFilePaths = Object.keys(
          fileServiceContent["hostTenant"][
            `${getAppIdFromUserPaylad(userPayload)}-asset-id`
          ]
        ).filter((filePath) => filePath.includes(".app.config.json"));

        for (let appFilePath of appFilePaths) {
          let appFileContent =
            fileServiceContent["hostTenant"][
              `${getAppIdFromUserPaylad(userPayload)}-asset-id`
            ][appFilePath];
          let appId = appFilePath.replace(".app.config.json", "");
          allAppsPayload[appId] = {
            ...appFileContent,
          };
        }

        expect(storagePayload).toEqual(allAppsPayload);
      }

      //#endregion  =====  CHECKING APP DATA STORAGE =====
    };

    it("should return 200 and whole payload of config - app, plants and user's", async () => {
      await testMeConfigGet();
    });

    it("should return 200 and whole payload of config - app, plants and user's - if app is a subtenant app", async () => {
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

      await testMeConfigGet();
    });

    it("should return 200 and whole payload of config - app, plants and user's - if app is a tenant app", async () => {
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

      await testMeConfigGet();
    });

    it("should return 200 and whole payload of config - if there are no plant's in user's app", async () => {
      //Inputs
      delete fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testPlant4.plant.config.json"];
      delete fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testPlant5.plant.config.json"];
      delete fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testPlant6.plant.config.json"];
      fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testLocalAdmin22.user.config.json"].config = {};
      fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testLocalAdmin22.user.config.json"].data = {};
      fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testLocalAdmin22.user.config.json"].permissions.plants = {};

      //Outputs
      expectedValidCall = true;
      expectedResponseCode = 200;
      expectedErrorText = null;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      //there are no 3 plant's file available - 48 - 3
      expectedGetFileContentCallNumber = 45;

      await testMeConfigGet();
    });

    it("should return 200 and whole payload of config - if there are no plant's in user's app but the exists in user's storage data", async () => {
      //Inputs
      delete fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testPlant4.plant.config.json"];
      delete fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testPlant5.plant.config.json"];
      delete fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testPlant6.plant.config.json"];

      //Outputs
      expectedValidCall = true;
      expectedResponseCode = 200;
      expectedErrorText = null;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      //there are no 3 plant's file available - 48 - 3
      expectedGetFileContentCallNumber = 45;

      await testMeConfigGet();
    });

    it("should return 200 and whole payload of config - if there are plants in user's app but user doesn't have access to any plant", async () => {
      //Inputs
      fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testLocalAdmin22.user.config.json"].config = {};
      fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testLocalAdmin22.user.config.json"].data = {};
      fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testLocalAdmin22.user.config.json"].permissions.plants = {};

      await testMeConfigGet();
    });

    it("should fetch app's and user's and plant's data and return 200 - if all data have not existed before in cache but in storage", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

      let oldTotalData = fileServiceContent["hostTenant"][`${appId}-asset-id`];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`];

      await beforeExec();

      fileServiceContent["hostTenant"][`${appId}-asset-id`] = oldTotalData;

      //Setting file service content again
      setFileServiceContent(fileServiceContent);

      let result = await request(server)
        .get(`/customApi/config/me`)
        .set(requestHeaders)
        .send();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(200);

      let expectedPayload = getConfigResponse(userPayload);

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

      //Called 3 times - 1 x initialization, 1 x checking if app exists, 1x fetching apps asset
      expect(getAssets).toHaveBeenCalledTimes(3);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);
      expect(getAssets.mock.calls[1]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);
      expect(getAssets.mock.calls[2]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //39 times during initialization + 1 x for app data, 4 x for user's data, 3 x for plant's data
      expect(getFileContent).toHaveBeenCalledTimes(48);
      let laterCalls = [
        getFileContent.mock.calls[40],
        getFileContent.mock.calls[41],
        getFileContent.mock.calls[42],
        getFileContent.mock.calls[43],
        getFileContent.mock.calls[44],
        getFileContent.mock.calls[45],
        getFileContent.mock.calls[46],
        getFileContent.mock.calls[47],
      ];

      expect(laterCalls).toContainEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `main.app.config.json`,
      ]);
      expect(laterCalls).toContainEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `testLocalUser22.user.config.json`,
      ]);
      expect(laterCalls).toContainEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `testLocalAdmin22.user.config.json`,
      ]);
      expect(laterCalls).toContainEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `testGlobalUser22.user.config.json`,
      ]);
      expect(laterCalls).toContainEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `testGlobalAdmin22.user.config.json`,
      ]);
      expect(laterCalls).toContainEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `testPlant4.plant.config.json`,
      ]);
      expect(laterCalls).toContainEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `testPlant5.plant.config.json`,
      ]);
      expect(laterCalls).toContainEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `testPlant6.plant.config.json`,
      ]);

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let app = MindSphereAppsManager.getInstance().Apps[
        getAppIdFromUserPaylad(userPayload)
      ] as any;

      //Testing app only if it exists
      if (app != null) {
        //CHECKING PLANT'S STORAGE
        let plantsStorage = app._plantStorage._cacheData;

        let allPlantsPayload: any = {};

        let plantFilePaths = Object.keys(
          fileServiceContent["hostTenant"][
            `${getAppIdFromUserPaylad(userPayload)}-asset-id`
          ]
        ).filter((filePath) => filePath.includes(".plant.config.json"));

        for (let plantFilePath of plantFilePaths) {
          let plantFileContent =
            fileServiceContent["hostTenant"][
              `${getAppIdFromUserPaylad(userPayload)}-asset-id`
            ][plantFilePath];
          let plantId = plantFilePath.replace(".plant.config.json", "");
          allPlantsPayload[plantId] = {
            ...plantFileContent,
          };
        }

        expect(plantsStorage).toEqual(allPlantsPayload);

        //CHECKING USER'S STORAGE
        let usersStorage = app._userStorage._cacheData;

        let allUsersPayload: any = {};

        let userFilePaths = Object.keys(
          fileServiceContent["hostTenant"][
            `${getAppIdFromUserPaylad(userPayload)}-asset-id`
          ]
        ).filter((filePath) => filePath.includes(".user.config.json"));

        for (let userFilePath of userFilePaths) {
          let userFileContent =
            fileServiceContent["hostTenant"][
              `${getAppIdFromUserPaylad(userPayload)}-asset-id`
            ][userFilePath];
          let userId = userFilePath.replace(".user.config.json", "");
          allUsersPayload[userId] = {
            ...userFileContent,
          };
        }

        expect(usersStorage).toEqual(allUsersPayload);

        //CHECKING APP'S STORAGE
        let storagePayload = app._appStorage._cacheData;

        let allAppsPayload: any = {};

        let appFilePaths = Object.keys(
          fileServiceContent["hostTenant"][
            `${getAppIdFromUserPaylad(userPayload)}-asset-id`
          ]
        ).filter((filePath) => filePath.includes(".app.config.json"));

        for (let appFilePath of appFilePaths) {
          let appFileContent =
            fileServiceContent["hostTenant"][
              `${getAppIdFromUserPaylad(userPayload)}-asset-id`
            ][appFilePath];
          let appId = appFilePath.replace(".app.config.json", "");
          allAppsPayload[appId] = {
            ...appFileContent,
          };
        }

        expect(storagePayload).toEqual(allAppsPayload);
      }

      //#endregion  =====  CHECKING APP DATA STORAGE =====
    });

    it("should fetch app's data and return 200 - if app's data exists in storage but not in cache", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

      let oldAppData =
        fileServiceContent["hostTenant"][`${appId}-asset-id`][
          `main.app.config.json`
        ];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `main.app.config.json`
      ];

      await beforeExec();

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `main.app.config.json`
      ] = oldAppData;

      //Setting file service content again
      setFileServiceContent(fileServiceContent);

      let result = await request(server)
        .get(`/customApi/config/me`)
        .set(requestHeaders)
        .send();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(200);

      let expectedPayload = getConfigResponse(userPayload);

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

      //47 times during initialization, 48th time - fetching app's data
      expect(getFileContent).toHaveBeenCalledTimes(48);
      expect(getFileContent.mock.calls[47]).toEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `main.app.config.json`,
      ]);

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let app = MindSphereAppsManager.getInstance().Apps[
        getAppIdFromUserPaylad(userPayload)
      ] as any;

      //Testing app only if it exists
      if (app != null) {
        //CHECKING PLANT'S STORAGE
        let plantsStorage = app._plantStorage._cacheData;

        let allPlantsPayload: any = {};

        let plantFilePaths = Object.keys(
          fileServiceContent["hostTenant"][
            `${getAppIdFromUserPaylad(userPayload)}-asset-id`
          ]
        ).filter((filePath) => filePath.includes(".plant.config.json"));

        for (let plantFilePath of plantFilePaths) {
          let plantFileContent =
            fileServiceContent["hostTenant"][
              `${getAppIdFromUserPaylad(userPayload)}-asset-id`
            ][plantFilePath];
          let plantId = plantFilePath.replace(".plant.config.json", "");
          allPlantsPayload[plantId] = {
            ...plantFileContent,
          };
        }

        expect(plantsStorage).toEqual(allPlantsPayload);

        //CHECKING USER'S STORAGE
        let usersStorage = app._userStorage._cacheData;

        let allUsersPayload: any = {};

        let userFilePaths = Object.keys(
          fileServiceContent["hostTenant"][
            `${getAppIdFromUserPaylad(userPayload)}-asset-id`
          ]
        ).filter((filePath) => filePath.includes(".user.config.json"));

        for (let userFilePath of userFilePaths) {
          let userFileContent =
            fileServiceContent["hostTenant"][
              `${getAppIdFromUserPaylad(userPayload)}-asset-id`
            ][userFilePath];
          let userId = userFilePath.replace(".user.config.json", "");
          allUsersPayload[userId] = {
            ...userFileContent,
          };
        }

        expect(usersStorage).toEqual(allUsersPayload);

        //CHECKING APP'S STORAGE
        let storagePayload = app._appStorage._cacheData;

        let allAppsPayload: any = {};

        let appFilePaths = Object.keys(
          fileServiceContent["hostTenant"][
            `${getAppIdFromUserPaylad(userPayload)}-asset-id`
          ]
        ).filter((filePath) => filePath.includes(".app.config.json"));

        for (let appFilePath of appFilePaths) {
          let appFileContent =
            fileServiceContent["hostTenant"][
              `${getAppIdFromUserPaylad(userPayload)}-asset-id`
            ][appFilePath];
          let appId = appFilePath.replace(".app.config.json", "");
          allAppsPayload[appId] = {
            ...appFileContent,
          };
        }

        expect(storagePayload).toEqual(allAppsPayload);
      }

      //#endregion  =====  CHECKING APP DATA STORAGE =====
    });

    it("should fetch user's data and return 200 - if user's data exists in storage but not in cache", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

      let oldUserData =
        fileServiceContent["hostTenant"][`${appId}-asset-id`][
          `testLocalAdmin22.user.config.json`
        ];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ];

      await beforeExec();

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ] = oldUserData;

      //Setting file service content again
      setFileServiceContent(fileServiceContent);

      let result = await request(server)
        .get(`/customApi/config/me`)
        .set(requestHeaders)
        .send();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(200);

      let expectedPayload = getConfigResponse(userPayload);

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

      //47 times during initialization, 48th time - fetching users's data
      expect(getFileContent).toHaveBeenCalledTimes(48);
      expect(getFileContent.mock.calls[47]).toEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `testLocalAdmin22.user.config.json`,
      ]);

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let app = MindSphereAppsManager.getInstance().Apps[
        getAppIdFromUserPaylad(userPayload)
      ] as any;

      //Testing app only if it exists
      if (app != null) {
        //CHECKING PLANT'S STORAGE
        let plantsStorage = app._plantStorage._cacheData;

        let allPlantsPayload: any = {};

        let plantFilePaths = Object.keys(
          fileServiceContent["hostTenant"][
            `${getAppIdFromUserPaylad(userPayload)}-asset-id`
          ]
        ).filter((filePath) => filePath.includes(".plant.config.json"));

        for (let plantFilePath of plantFilePaths) {
          let plantFileContent =
            fileServiceContent["hostTenant"][
              `${getAppIdFromUserPaylad(userPayload)}-asset-id`
            ][plantFilePath];
          let plantId = plantFilePath.replace(".plant.config.json", "");
          allPlantsPayload[plantId] = {
            ...plantFileContent,
          };
        }

        expect(plantsStorage).toEqual(allPlantsPayload);

        //CHECKING USER'S STORAGE
        let usersStorage = app._userStorage._cacheData;

        let allUsersPayload: any = {};

        let userFilePaths = Object.keys(
          fileServiceContent["hostTenant"][
            `${getAppIdFromUserPaylad(userPayload)}-asset-id`
          ]
        ).filter((filePath) => filePath.includes(".user.config.json"));

        for (let userFilePath of userFilePaths) {
          let userFileContent =
            fileServiceContent["hostTenant"][
              `${getAppIdFromUserPaylad(userPayload)}-asset-id`
            ][userFilePath];
          let userId = userFilePath.replace(".user.config.json", "");
          allUsersPayload[userId] = {
            ...userFileContent,
          };
        }

        expect(usersStorage).toEqual(allUsersPayload);

        //CHECKING APP'S STORAGE
        let storagePayload = app._appStorage._cacheData;

        let allAppsPayload: any = {};

        let appFilePaths = Object.keys(
          fileServiceContent["hostTenant"][
            `${getAppIdFromUserPaylad(userPayload)}-asset-id`
          ]
        ).filter((filePath) => filePath.includes(".app.config.json"));

        for (let appFilePath of appFilePaths) {
          let appFileContent =
            fileServiceContent["hostTenant"][
              `${getAppIdFromUserPaylad(userPayload)}-asset-id`
            ][appFilePath];
          let appId = appFilePath.replace(".app.config.json", "");
          allAppsPayload[appId] = {
            ...appFileContent,
          };
        }

        expect(storagePayload).toEqual(allAppsPayload);
      }

      //#endregion  =====  CHECKING APP DATA STORAGE =====
    });

    it("should fetch plant's data and return 200 - if plant's data exists in storage but not in cache", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

      let oldPlantData =
        fileServiceContent["hostTenant"][`${appId}-asset-id`][
          `testPlant5.plant.config.json`
        ];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testPlant5.plant.config.json`
      ];

      await beforeExec();

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testPlant5.plant.config.json`
      ] = oldPlantData;

      //Setting file service content again
      setFileServiceContent(fileServiceContent);

      let result = await request(server)
        .get(`/customApi/config/me`)
        .set(requestHeaders)
        .send();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(200);

      let expectedPayload = getConfigResponse(userPayload);

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

      //47 times during initialization, 48th time - fetching plant's data
      expect(getFileContent).toHaveBeenCalledTimes(48);
      expect(getFileContent.mock.calls[47]).toEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `testPlant5.plant.config.json`,
      ]);

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let app = MindSphereAppsManager.getInstance().Apps[
        getAppIdFromUserPaylad(userPayload)
      ] as any;

      //Testing app only if it exists
      if (app != null) {
        //CHECKING PLANT'S STORAGE
        let plantsStorage = app._plantStorage._cacheData;

        let allPlantsPayload: any = {};

        let plantFilePaths = Object.keys(
          fileServiceContent["hostTenant"][
            `${getAppIdFromUserPaylad(userPayload)}-asset-id`
          ]
        ).filter((filePath) => filePath.includes(".plant.config.json"));

        for (let plantFilePath of plantFilePaths) {
          let plantFileContent =
            fileServiceContent["hostTenant"][
              `${getAppIdFromUserPaylad(userPayload)}-asset-id`
            ][plantFilePath];
          let plantId = plantFilePath.replace(".plant.config.json", "");
          allPlantsPayload[plantId] = {
            ...plantFileContent,
          };
        }

        expect(plantsStorage).toEqual(allPlantsPayload);

        //CHECKING USER'S STORAGE
        let usersStorage = app._userStorage._cacheData;

        let allUsersPayload: any = {};

        let userFilePaths = Object.keys(
          fileServiceContent["hostTenant"][
            `${getAppIdFromUserPaylad(userPayload)}-asset-id`
          ]
        ).filter((filePath) => filePath.includes(".user.config.json"));

        for (let userFilePath of userFilePaths) {
          let userFileContent =
            fileServiceContent["hostTenant"][
              `${getAppIdFromUserPaylad(userPayload)}-asset-id`
            ][userFilePath];
          let userId = userFilePath.replace(".user.config.json", "");
          allUsersPayload[userId] = {
            ...userFileContent,
          };
        }

        expect(usersStorage).toEqual(allUsersPayload);

        //CHECKING APP'S STORAGE
        let storagePayload = app._appStorage._cacheData;

        let allAppsPayload: any = {};

        let appFilePaths = Object.keys(
          fileServiceContent["hostTenant"][
            `${getAppIdFromUserPaylad(userPayload)}-asset-id`
          ]
        ).filter((filePath) => filePath.includes(".app.config.json"));

        for (let appFilePath of appFilePaths) {
          let appFileContent =
            fileServiceContent["hostTenant"][
              `${getAppIdFromUserPaylad(userPayload)}-asset-id`
            ][appFilePath];
          let appId = appFilePath.replace(".app.config.json", "");
          allAppsPayload[appId] = {
            ...appFileContent,
          };
        }

        expect(storagePayload).toEqual(allAppsPayload);
      }

      //#endregion  =====  CHECKING APP DATA STORAGE =====
    });

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should return 200 - if user is a local user", async () => {
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

      await testMeConfigGet();
    });

    it("should return 200 - if user is a local admin", async () => {
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

      await testMeConfigGet();
    });

    it("should return 200 - if user is a global user", async () => {
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

      await testMeConfigGet();
    });

    it("should return 200 - if user is a global admin", async () => {
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

      await testMeConfigGet();
    });

    it("should return 200 and payload with all plants - if user is a global admin and has no access to every plant", async () => {
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

      let appId = getAppIdFromUserPaylad(userPayload);

      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants["testPlant5"];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].data["testPlant5"];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].config["testPlant5"];

      await testMeConfigGet();
    });

    it("should return 200 and payload with all plants - if user is a global user and has no access to every plant", async () => {
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

      let appId = getAppIdFromUserPaylad(userPayload);

      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].permissions.plants["testPlant5"];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].data["testPlant5"];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].config["testPlant5"];

      await testMeConfigGet();
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

      await testMeConfigGet();
    });

    it("should return 403 and not get the plant - if there is no application of given id", async () => {
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

      await testMeConfigGet();
    });

    it("should return 403 and not get the plant - if user has no access to given app", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant1",
        user_name: "test_global_admin_22@user.name",
        subtenant: "subtenant1",
      };
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
      expectedGetFileContentCallNumber = 48;

      await testMeConfigGet();
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

      await testMeConfigGet();
    });

    it("should return 403 and not get the plant - if user has invalid role", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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

      await testMeConfigGet();
    });

    it("should return 403 and not get the plant - if user has invalid scope", async () => {
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

      await testMeConfigGet();
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
          role: UserRole.GlobalAdmin,
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
        scope: ["testGlobalAdminScope"],
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

      await testMeConfigGet();
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
        scope: ["testGlobalAdminScope"],
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

      await testMeConfigGet();
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

      await testMeConfigGet();
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

      await testMeConfigGet();
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

      await testMeConfigGet();
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========

    //#region ========== MINDSPHERE SERVICE THROWS ==========

    it("should return 500 and not get config data - if get all users throws", async () => {
      getAllUsersThrows = true;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 500;
      expectedErrorText = `Ups.. Something fails..`;
      //0 calls for getAllUsers - becouse getAllUsers mock is overridden with a different mocked method
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;

      await testMeConfigGet();

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test get all users error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    it("should return 500 and not get config data - if app's data does not exists in cache but in storage and getFileContent throws", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

      let oldAppData =
        fileServiceContent["hostTenant"][`${appId}-asset-id`][
          `main.app.config.json`
        ];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `main.app.config.json`
      ];

      await beforeExec();

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `main.app.config.json`
      ] = oldAppData;

      //Setting file service content again
      setFileServiceContent(fileServiceContent);

      MindSphereFileService.getInstance().getFileContent = jest.fn(async () => {
        throw new Error("Test get file content error");
      });

      let result = await request(server)
        .get(`/customApi/config/me`)
        .set(requestHeaders)
        .send();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(500);
      expect(result.text).toEqual(`Ups.. Something fails..`);

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //GetAllUsers should not have been called - getting app data before
      expect(getAllUsers).not.toHaveBeenCalled();

      //Checking if app exists - should be invoked only one time during initalization
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //GetFileContent should be called 47 times - 48th time is a different mocked function that throws
      expect(getFileContent).toHaveBeenCalledTimes(47);

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let app = MindSphereAppsManager.getInstance().Apps[
        getAppIdFromUserPaylad(userPayload)
      ] as any;

      //Testing app only if it exists
      if (app != null) {
        //CHECKING PLANT'S STORAGE
        let plantsStorage = app._plantStorage._cacheData;

        let allPlantsPayload: any = {};

        let plantFilePaths = Object.keys(
          fileServiceContent["hostTenant"][
            `${getAppIdFromUserPaylad(userPayload)}-asset-id`
          ]
        ).filter((filePath) => filePath.includes(".plant.config.json"));

        for (let plantFilePath of plantFilePaths) {
          let plantFileContent =
            fileServiceContent["hostTenant"][
              `${getAppIdFromUserPaylad(userPayload)}-asset-id`
            ][plantFilePath];
          let plantId = plantFilePath.replace(".plant.config.json", "");
          allPlantsPayload[plantId] = {
            ...plantFileContent,
          };
        }

        expect(plantsStorage).toEqual(allPlantsPayload);

        //CHECKING USER'S STORAGE
        let usersStorage = app._userStorage._cacheData;

        let allUsersPayload: any = {};

        let userFilePaths = Object.keys(
          fileServiceContent["hostTenant"][
            `${getAppIdFromUserPaylad(userPayload)}-asset-id`
          ]
        ).filter((filePath) => filePath.includes(".user.config.json"));

        for (let userFilePath of userFilePaths) {
          let userFileContent =
            fileServiceContent["hostTenant"][
              `${getAppIdFromUserPaylad(userPayload)}-asset-id`
            ][userFilePath];
          let userId = userFilePath.replace(".user.config.json", "");
          allUsersPayload[userId] = {
            ...userFileContent,
          };
        }

        expect(usersStorage).toEqual(allUsersPayload);

        //CHECKING APP'S STORAGE
        let storagePayload = app._appStorage._cacheData;

        let allAppsPayload: any = {};

        expect(storagePayload).toEqual(allAppsPayload);
      }

      //#endregion  =====  CHECKING APP DATA STORAGE =====

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test get file content error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    it("should return 500 and not get config data - if plant's data does not exists in cache but in storage and getFileContent throws", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

      let oldPlantData =
        fileServiceContent["hostTenant"][`${appId}-asset-id`][
          `testPlant5.plant.config.json`
        ];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testPlant5.plant.config.json`
      ];

      await beforeExec();

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testPlant5.plant.config.json`
      ] = oldPlantData;

      //Setting file service content again
      setFileServiceContent(fileServiceContent);

      MindSphereFileService.getInstance().getFileContent = jest.fn(async () => {
        throw new Error("Test get file content error");
      });

      let result = await request(server)
        .get(`/customApi/config/me`)
        .set(requestHeaders)
        .send();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(500);
      expect(result.text).toEqual(`Ups.. Something fails..`);

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //GetAllUsers should have been called times 1 - fetching user's data based on jwt
      expect(getAllUsers).toHaveBeenCalledTimes(1);

      //Checking if app exists - should be invoked only one time during initalization
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //GetFileContent should be called 47 times - 48th time is a different mocked function that throws
      expect(getFileContent).toHaveBeenCalledTimes(47);

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let app = MindSphereAppsManager.getInstance().Apps[
        getAppIdFromUserPaylad(userPayload)
      ] as any;

      //Testing app only if it exists
      if (app != null) {
        //CHECKING PLANT'S STORAGE
        let plantsStorage = app._plantStorage._cacheData;

        let allPlantsPayload: any = {};

        let plantFilePaths = Object.keys(
          fileServiceContent["hostTenant"][
            `${getAppIdFromUserPaylad(userPayload)}-asset-id`
          ]
        ).filter((filePath) => filePath.includes(".plant.config.json"));

        for (let plantFilePath of plantFilePaths) {
          let plantFileContent =
            fileServiceContent["hostTenant"][
              `${getAppIdFromUserPaylad(userPayload)}-asset-id`
            ][plantFilePath];
          let plantId = plantFilePath.replace(".plant.config.json", "");
          allPlantsPayload[plantId] = {
            ...plantFileContent,
          };
        }

        delete allPlantsPayload["testPlant5"];

        expect(plantsStorage).toEqual(allPlantsPayload);

        //CHECKING USER'S STORAGE
        let usersStorage = app._userStorage._cacheData;

        let allUsersPayload: any = {};

        let userFilePaths = Object.keys(
          fileServiceContent["hostTenant"][
            `${getAppIdFromUserPaylad(userPayload)}-asset-id`
          ]
        ).filter((filePath) => filePath.includes(".user.config.json"));

        for (let userFilePath of userFilePaths) {
          let userFileContent =
            fileServiceContent["hostTenant"][
              `${getAppIdFromUserPaylad(userPayload)}-asset-id`
            ][userFilePath];
          let userId = userFilePath.replace(".user.config.json", "");
          allUsersPayload[userId] = {
            ...userFileContent,
          };
        }

        expect(usersStorage).toEqual(allUsersPayload);

        //CHECKING APP'S STORAGE
        let storagePayload = app._appStorage._cacheData;

        let allAppsPayload: any = {};

        let appFilePaths = Object.keys(
          fileServiceContent["hostTenant"][
            `${getAppIdFromUserPaylad(userPayload)}-asset-id`
          ]
        ).filter((filePath) => filePath.includes(".app.config.json"));

        for (let appFilePath of appFilePaths) {
          let appFileContent =
            fileServiceContent["hostTenant"][
              `${getAppIdFromUserPaylad(userPayload)}-asset-id`
            ][appFilePath];
          let appId = appFilePath.replace(".app.config.json", "");
          allAppsPayload[appId] = {
            ...appFileContent,
          };
        }

        expect(storagePayload).toEqual(allAppsPayload);
      }

      //#endregion  =====  CHECKING APP DATA STORAGE =====

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test get file content error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    it("should return 500 and not get config data - if user's data does not exists in cache but in storage and getFileContent throws", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

      let oldUserData =
        fileServiceContent["hostTenant"][`${appId}-asset-id`][
          `testLocalAdmin22.user.config.json`
        ];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ];

      await beforeExec();

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testLocalAdmin22.user.config.json`
      ] = oldUserData;

      //Setting file service content again
      setFileServiceContent(fileServiceContent);

      MindSphereFileService.getInstance().getFileContent = jest.fn(async () => {
        throw new Error("Test get file content error");
      });

      let result = await request(server)
        .get(`/customApi/config/me`)
        .set(requestHeaders)
        .send();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(500);
      expect(result.text).toEqual(`Ups.. Something fails..`);

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //GetAllUsers should have been called times 1 - fetching user's data based on jwt
      expect(getAllUsers).toHaveBeenCalledTimes(1);

      //Checking if app exists - should be invoked only one time during initalization
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //GetFileContent should be called 47 times - 48th time is a different mocked function that throws
      expect(getFileContent).toHaveBeenCalledTimes(47);

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let app = MindSphereAppsManager.getInstance().Apps[
        getAppIdFromUserPaylad(userPayload)
      ] as any;

      //Testing app only if it exists
      if (app != null) {
        //CHECKING PLANT'S STORAGE
        let plantsStorage = app._plantStorage._cacheData;

        let allPlantsPayload: any = {};

        let plantFilePaths = Object.keys(
          fileServiceContent["hostTenant"][
            `${getAppIdFromUserPaylad(userPayload)}-asset-id`
          ]
        ).filter((filePath) => filePath.includes(".plant.config.json"));

        for (let plantFilePath of plantFilePaths) {
          let plantFileContent =
            fileServiceContent["hostTenant"][
              `${getAppIdFromUserPaylad(userPayload)}-asset-id`
            ][plantFilePath];
          let plantId = plantFilePath.replace(".plant.config.json", "");
          allPlantsPayload[plantId] = {
            ...plantFileContent,
          };
        }

        expect(plantsStorage).toEqual(allPlantsPayload);

        //CHECKING USER'S STORAGE
        let usersStorage = app._userStorage._cacheData;

        let allUsersPayload: any = {};

        let userFilePaths = Object.keys(
          fileServiceContent["hostTenant"][
            `${getAppIdFromUserPaylad(userPayload)}-asset-id`
          ]
        ).filter((filePath) => filePath.includes(".user.config.json"));

        for (let userFilePath of userFilePaths) {
          let userFileContent =
            fileServiceContent["hostTenant"][
              `${getAppIdFromUserPaylad(userPayload)}-asset-id`
            ][userFilePath];
          let userId = userFilePath.replace(".user.config.json", "");
          allUsersPayload[userId] = {
            ...userFileContent,
          };
        }

        delete allUsersPayload["testLocalAdmin22"];

        expect(usersStorage).toEqual(allUsersPayload);

        //CHECKING APP'S STORAGE
        let storagePayload = app._appStorage._cacheData;

        let allAppsPayload: any = {};

        let appFilePaths = Object.keys(
          fileServiceContent["hostTenant"][
            `${getAppIdFromUserPaylad(userPayload)}-asset-id`
          ]
        ).filter((filePath) => filePath.includes(".app.config.json"));

        for (let appFilePath of appFilePaths) {
          let appFileContent =
            fileServiceContent["hostTenant"][
              `${getAppIdFromUserPaylad(userPayload)}-asset-id`
            ][appFilePath];
          let appId = appFilePath.replace(".app.config.json", "");
          allAppsPayload[appId] = {
            ...appFileContent,
          };
        }

        expect(storagePayload).toEqual(allAppsPayload);
      }

      //#endregion  =====  CHECKING APP DATA STORAGE =====

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test get file content error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });
    //#endregion ========== MINDSPHERE SERVICE THROWS ==========
  });
});

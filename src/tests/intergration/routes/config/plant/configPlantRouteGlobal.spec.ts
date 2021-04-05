import request from "supertest";
import {
  PlantPermissions,
  UserRole,
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

describe("config plant route", () => {
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

  /**
   * @description Method for creating response containt all plants data payloads
   */
  const getAllPlantsDataResponse = (appId: string, appAssetId: string) => {
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
        appId: appId,
        plantId: plantId,
      };
    }

    return allPlantsPayload;
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

  describe("GET /global/:appId", () => {
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
    let expectedGetFileContentCallParameters: Array<any>[];
    let expectedFileServiceContent: any;

    beforeEach(() => {
      //Inputs
      requestHeaders = {};
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
        .get(`/customApi/config/plant/global/${appId}`)
        .set(requestHeaders)
        .send();
    };

    const testGlobalPlantsGet = async () => {
      let result = await exec();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(expectedResponseCode);

      if (expectedValidCall) {
        let expectedPayload = getAllPlantsDataResponse(
          appId,
          `${appId}-asset-id`
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

      let storagePayload = (MindSphereAppsManager.getInstance().Apps[
        appId
      ] as any)._plantStorage._cacheData;

      let allPlantsPayload: any = {};

      let plantFilePaths = Object.keys(
        expectedFileServiceContent["hostTenant"][`${appId}-asset-id`]
      ).filter((filePath) => filePath.includes(".plant.config.json"));

      for (let plantFilePath of plantFilePaths) {
        let plantFileContent =
          expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
            plantFilePath
          ];
        let plantId = plantFilePath.replace(".plant.config.json", "");
        allPlantsPayload[plantId] = {
          ...plantFileContent,
        };
      }

      expect(storagePayload).toEqual(allPlantsPayload);

      //#endregion  =====  CHECKING STORAGE =====
    };

    it("should return 200 and payload of all plants of the app", async () => {
      await testGlobalPlantsGet();
    });

    it("should return 200 and payload of all plants of the app - if app is a subtenant app", async () => {
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

      await testGlobalPlantsGet();
    });

    it("should return 200 and payload of all plants of the app - if app is a tenant app", async () => {
      appId = "ten-testTenant2";
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

      await testGlobalPlantsGet();
    });

    it("should fetch all plant's data and return 200 and payload of all plants of the app - if some plants don't exist in cache", async () => {
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
        .get(`/customApi/config/plant/global/${appId}`)
        .set(requestHeaders)
        .send();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(expectedResponseCode);

      let expectedPayload = getAllPlantsDataResponse(
        appId,
        `${appId}-asset-id`
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

    it("should return 200 and payload of all plants of the app - even if user does not have access to all the apps - user is global admin", async () => {
      //Inputs
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
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].data["testPlant4"];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].config["testPlant4"];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants["testPlant4"];

      await testGlobalPlantsGet();
    });

    it("should return 200 and payload of all plants of the app - even if user does not have access to all the apps - user is global user", async () => {
      //Inputs
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
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].data["testPlant4"];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].config["testPlant4"];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].permissions.plants["testPlant4"];

      await testGlobalPlantsGet();
    });

    it("should return 403 - if local user calls API", async () => {
      //Inputs
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
        "Access denied. User must be a global user or global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 403 - if local admin calls API", async () => {
      //Inputs
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
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global user or global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 200 and payload of all plants of the app - if global user calls API", async () => {
      //Inputs
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

      await testGlobalPlantsGet();
    });

    it("should return 200 and payload of all plants of the app - if global admin calls API", async () => {
      //Inputs
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

      await testGlobalPlantsGet();
    });

    it("should return 403 - if user is a subtenant user and local admin - valid scope invalid role", async () => {
      fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testGlobalAdmin22.user.config.json"].permissions.role =
        UserRole.LocalAdmin;

      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
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
      expectedErrorText =
        "Access denied. User must be a global user or global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 403 - if user is a subtenant user and local user - valid scope invalid role", async () => {
      fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testGlobalAdmin22.user.config.json"].permissions.role =
        UserRole.LocalUser;

      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
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
      expectedErrorText =
        "Access denied. User must be a global user or global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 403 - if user is a tenant user and local user - valid scope invalid role", async () => {
      fileServiceContent["hostTenant"]["ten-testTenant2-asset-id"][
        "testGlobalAdmin21.user.config.json"
      ].permissions.role = UserRole.LocalUser;

      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_21@user.name",
      };

      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      appId = "ten-testTenant2";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global user or global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 403 - if user is a subtenant user and local admin - invalid scope, valid role", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testLocalUserScope"],
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
      expectedErrorText =
        "Access denied. User must be a global user or global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 403 - if user is a subtenant user and local user - invalid scope, valid role", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testLocalAdminScope"],
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
      expectedErrorText =
        "Access denied. User must be a global user or global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 403 - if user is a tenant user and local admin - invalid scope, valid role", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_21@user.name",
      };

      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      appId = "ten-testTenant2";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global user or global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 403 - if user is a tenant user and local user - invalid scope, valid role", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_21@user.name",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      appId = "ten-testTenant2";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global user or global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 403 - if user is a subtenant user and local admin - invalid scope and role", async () => {
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
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global user or global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 403 - if user is a subtenant user and local user - invalid scope and role", async () => {
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
        "Access denied. User must be a global user or global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 403 - if user is a tenant user and local admin - invalid scope and role", async () => {
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

      appId = "ten-testTenant2";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global user or global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 403 - if user is a tenant user and local user - invalid scope and role", async () => {
      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_local_user_21@user.name",
      };

      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      appId = "ten-testTenant2";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global user or global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 403 - if user is trying to access not his app - subtenant user, tenant app", async () => {
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
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 403 - if user is trying to access not his app - tenant user, subtenant app", async () => {
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
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 403 - if user is trying to access not his app - subtenant user, other subtenant app", async () => {
      appId = "ten-testTenant1-sub-subtenant1";

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
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 403 - if user is trying to access not his app - tenant user, other tenant app", async () => {
      appId = "ten-testTenant1";

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
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 403 - if user's payload does not have tenant assigned", async () => {
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
      //GetAllUsers should not have been called - checking app before
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 403 - if there is no application - subtenant user", async () => {
      userPayload.ten = "fakeTenant";

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Application of given id not found for the user!";
      //GetAllUsers should not have been called - checking app before
      expectedGetAllUsersCallNumber = 0;
      //GetAssets called twice - try to fetch fake app
      expectedGetAssetsCallNumber = 2;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 403 - if there is no application data for given user - subtenant user", async () => {
      delete fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["main.app.config.json"];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Main application settings not found for the user!";
      //GetAllUsers should not have been called - checking app before
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      //GetFileContent invoked only 47 times - no main config file for one of the apps
      expectedGetFileContentCallNumber = 47;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 403 - if user has valid scope, exists in user service exists but does not exist in file service - subtenant user", async () => {
      //Adding new user to user service
      userServiceContent["testTenant2"] = {
        ...userServiceContent["testTenant2"],
        testFakeUser23: {
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
        },
      };

      //Assinging user to local user group in tenant
      userGroupServiceContent.testTenant2.localUserGroup.members = [
        ...userGroupServiceContent.testTenant2.localUserGroup.members,
        {
          type: "USER",
          value: "testFakeUser23",
        },
      ];

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
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 403 - if user has valid scope, doest not exist in user service but exists in file service - subtenant user", async () => {
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
      //GetFileContent call 49 times - additional user's data
      expectedGetFileContentCallNumber = 49;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 403 - if user has invalid scope - subtenant user", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["fakeScope"],
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
      expectedErrorText = "Forbidden access. No scope found to access the app!";
      //GetAllUsers should not have been called - checking scope before
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 403 - if there is no application - tenant user", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_21@user.name",
      };

      userPayload.ten = "fakeTenant";

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Application of given id not found for the user!";
      //GetAllUsers should not have been called - checking scope before
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 2;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 403 - if there is no application data for given user - tenant user", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_21@user.name",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      delete fileServiceContent["hostTenant"]["ten-testTenant2-asset-id"][
        "main.app.config.json"
      ];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Main application settings not found for the user!";
      //GetAllUsers should not have been called - checking scope before
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      //GetFileContent called 47 times - lack of one file, app config file
      expectedGetFileContentCallNumber = 47;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 403 - if user has valid scope, doest not exist in user service but exists in file service - tenant user", async () => {
      //Adding user to file service for the app
      fileServiceContent["hostTenant"]["ten-testTenant2-asset-id"][
        "testFakeUser23.user.config.json"
      ] = {
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
      //GetAllUsers should not have been called - checking scope before
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      //GetFileContent called 49 times - one additional user data
      expectedGetFileContentCallNumber = 49;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 403 - if user has invalid scope - tenant user", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["fakeScope"],
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
      expectedErrorText = "Forbidden access. No scope found to access the app!";
      //GetAllUsers called 0 times - first check the users scope
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 401 - if there is no authorization token in header", async () => {
      delete requestHeaders["authorization"];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";
      //GetAllUsers called 0 times - first check the users scope
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 401 - if authorization token is invalid - no bearer prefix", async () => {
      requestHeaders["authorization"] = jwt.sign(userPayload, "testPrivateKey");

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";
      //GetAllUsers called 0 times - first check the users scope
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
    });

    it("should return 401 - if authorization token is invalid - invalid token", async () => {
      requestHeaders["authorization"] =
        "Bearer thisIsTheFakeValueOfTheJWTToken";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";
      //GetAllUsers called 0 times - first check the users scope
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();
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
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantsGet();

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test get all users error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    it("should return 500 and not get all plants - if there are plants data to be fetch and get file content throws", async () => {
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

      //Setting get file content to throw
      MindSphereFileService.getInstance().getFileContent = jest.fn(async () => {
        throw new Error("Test get file content error");
      });

      let result = await request(server)
        .get(`/customApi/config/plant/global/${appId}`)
        .set(requestHeaders)
        .send();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(500);

      expect(result.text).toEqual("Ups.. Something fails..");

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

      //Then plants data should be fetched - called only 46 time - not taking two calls when invoking route - mocking with other throwing mock function
      expect(getFileContent).toHaveBeenCalledTimes(46);

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      //Storage should not contain new plant's data

      let storagePayload = (MindSphereAppsManager.getInstance().Apps[
        appId
      ] as any)._plantStorage._cacheData;

      let allPlantsPayload: any = {};

      let plantFilePaths = Object.keys(
        expectedFileServiceContent["hostTenant"][`${appId}-asset-id`]
      ).filter((filePath) => filePath.includes(".plant.config.json"));

      for (let plantFilePath of plantFilePaths) {
        let plantFileContent =
          expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
            plantFilePath
          ];
        let plantId = plantFilePath.replace(".plant.config.json", "");
        allPlantsPayload[plantId] = {
          ...plantFileContent,
        };
      }

      delete allPlantsPayload[`testPlant4`];
      delete allPlantsPayload[`testPlant5`];

      expect(storagePayload).toEqual(allPlantsPayload);

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

  describe("GET /global/:appId/:plantId", () => {
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
        .get(`/customApi/config/plant/global/${appId}/${plantId}`)
        .set(requestHeaders)
        .send();
    };

    const testGlobalPlantGet = async () => {
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
      if (expectedGetFileContentCallNumber > 0) {
        for (let parameters of expectedGetFileContentCallParameters) {
          expect(getFileContent.mock.calls).toContainEqual(parameters);
        }
      }

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let storagePayload = (MindSphereAppsManager.getInstance().Apps[
        appId
      ] as any)._plantStorage._cacheData;

      let allPlantsPayload: any = {};

      let plantFilePaths = Object.keys(
        expectedFileServiceContent["hostTenant"][`${appId}-asset-id`]
      ).filter((filePath) => filePath.includes(".plant.config.json"));

      for (let plantFilePath of plantFilePaths) {
        let plantFileContent =
          expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
            plantFilePath
          ];
        let plantId = plantFilePath.replace(".plant.config.json", "");
        allPlantsPayload[plantId] = {
          ...plantFileContent,
        };
      }

      expect(storagePayload).toEqual(allPlantsPayload);

      //#endregion  =====  CHECKING STORAGE =====
    };

    it("should return 200 and payload of given plant of the app", async () => {
      await testGlobalPlantGet();
    });

    it("should return 200 and payload of given plant of the app - if app is a subtenant app", async () => {
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

      await testGlobalPlantGet();
    });

    it("should return 200 and payload of given plant of the app - if app is a tenant app", async () => {
      appId = "ten-testTenant2";
      plantId = "testPlant2";
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

      await testGlobalPlantGet();
    });

    it("should fetch plant's data and return 200 and payload of given plant of the app - if plant doesn't exist in cache", async () => {
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
        .get(`/customApi/config/plant/global/${appId}/${plantId}`)
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

      //Then plants data should be fetched - 47 times + 1 time1 when getting the plant
      expect(getFileContent).toHaveBeenCalledTimes(48);
      expect(getFileContent.mock.calls[47]).toEqual([
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

    it("should return 404 - if plant of given id does not exist", async () => {
      plantId = "fakePlantId";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant data not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should return 403 - if local user calls API", async () => {
      //Inputs
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
        "Access denied. User must be a global user or global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    it("should return 403 - if local admin calls API", async () => {
      //Inputs
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
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global user or global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    it("should return 403 - if user is a subtenant user and local admin - valid scope invalid role", async () => {
      fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testGlobalAdmin22.user.config.json"].permissions.role =
        UserRole.LocalAdmin;

      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
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
      expectedErrorText =
        "Access denied. User must be a global user or global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    it("should return 403 - if user is a subtenant user and local user - valid scope invalid role", async () => {
      fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testGlobalAdmin22.user.config.json"].permissions.role =
        UserRole.LocalUser;

      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
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
      expectedErrorText =
        "Access denied. User must be a global user or global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    it("should return 403 - if user is a subtenant user and local admin - invalid scope, valid role", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testLocalUserScope"],
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
      expectedErrorText =
        "Access denied. User must be a global user or global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    it("should return 403 - if user is a subtenant user and local user - invalid scope, valid role", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testLocalAdminScope"],
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
      expectedErrorText =
        "Access denied. User must be a global user or global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    it("should return 403 - if user is a tenant user and local admin - invalid scope, valid role", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_21@user.name",
      };

      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      appId = "ten-testTenant2";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global user or global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    it("should return 403 - if user is a tenant user and local user - invalid scope, valid role", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_21@user.name",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      appId = "ten-testTenant2";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global user or global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    it("should return 403 - if user is a subtenant user and local admin - invalid scope and role", async () => {
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
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global user or global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    it("should return 403 - if user is a subtenant user and local user - invalid scope and role", async () => {
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
        "Access denied. User must be a global user or global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    it("should return 403 - if user is a tenant user and local admin - invalid scope and role", async () => {
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

      appId = "ten-testTenant2";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global user or global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    it("should return 403 - if user is a tenant user and local user - invalid scope and role", async () => {
      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_local_user_21@user.name",
      };

      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      appId = "ten-testTenant2";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global user or global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    it("should return 200 and payload of given plant of the app - if global user calls API", async () => {
      //Inputs
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

      await testGlobalPlantGet();
    });

    it("should return 200 and payload of given plant of the app - if global admin calls API", async () => {
      //Inputs
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

      await testGlobalPlantGet();
    });

    it("should return 200 and payload of given plant - even if user does not have access to the apps - user is global admin", async () => {
      //Inputs
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
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].data[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].config[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId];

      await testGlobalPlantGet();
    });

    it("should return 200 and payload of given plant - even if user does not have access to the apps - user is global user", async () => {
      //Inputs
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
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].data[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].config[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalUser22.user.config.json`
      ].permissions.plants[plantId];

      await testGlobalPlantGet();
    });

    it("should return 403 - if user is trying to access not his app - subtenant user, tenant app", async () => {
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
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    it("should return 403 - if user is trying to access not his app - tenant user, subtenant app", async () => {
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
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    it("should return 403 - if user is trying to access not his app - subtenant user, other subtenant app", async () => {
      appId = "ten-testTenant1-sub-subtenant1";

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
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    it("should return 403 - if user is trying to access not his app - tenant user, other tenant app", async () => {
      appId = "ten-testTenant1";

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
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    it("should return 403 - if user's payload does not have tenant assigned", async () => {
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
      //GetAllUsers should not have been called - checking app before
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    it("should return 403 - if there is no application - subtenant user", async () => {
      userPayload.ten = "fakeTenant";

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Application of given id not found for the user!";
      //GetAllUsers should not have been called - checking app before
      expectedGetAllUsersCallNumber = 0;
      //GetAssets called twice - try to fetch fake app
      expectedGetAssetsCallNumber = 2;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    it("should return 403 - if there is no application data for given user - subtenant user", async () => {
      delete fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["main.app.config.json"];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Main application settings not found for the user!";
      //GetAllUsers should not have been called - checking app before
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      //GetFileContent invoked only 47 times - no main config file for one of the apps
      expectedGetFileContentCallNumber = 47;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    it("should return 403 - if user has valid scope, exists in user service exists but does not exist in file service - subtenant user", async () => {
      //Adding new user to user service
      userServiceContent["testTenant2"] = {
        ...userServiceContent["testTenant2"],
        testFakeUser23: {
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
        },
      };

      //Assinging user to local user group in tenant
      userGroupServiceContent.testTenant2.localUserGroup.members = [
        ...userGroupServiceContent.testTenant2.localUserGroup.members,
        {
          type: "USER",
          value: "testFakeUser23",
        },
      ];

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
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    it("should return 403 - if user has valid scope, doest not exist in user service but exists in file service - subtenant user", async () => {
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
      //GetFileContent call 49 times - additional user's data
      expectedGetFileContentCallNumber = 49;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    it("should return 403 - if user has invalid scope - subtenant user", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["fakeScope"],
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
      expectedErrorText = "Forbidden access. No scope found to access the app!";
      //GetAllUsers should not have been called - checking scope before
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    it("should return 403 - if there is no application - tenant user", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_21@user.name",
      };

      userPayload.ten = "fakeTenant";

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Application of given id not found for the user!";
      //GetAllUsers should not have been called - checking scope before
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 2;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    it("should return 403 - if there is no application data for given user - tenant user", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_21@user.name",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      delete fileServiceContent["hostTenant"]["ten-testTenant2-asset-id"][
        "main.app.config.json"
      ];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Main application settings not found for the user!";
      //GetAllUsers should not have been called - checking scope before
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      //GetFileContent called 47 times - lack of one file, app config file
      expectedGetFileContentCallNumber = 47;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    it("should return 403 - if user has valid scope, doest not exist in user service but exists in file service - tenant user", async () => {
      //Adding user to file service for the app
      fileServiceContent["hostTenant"]["ten-testTenant2-asset-id"][
        "testFakeUser23.user.config.json"
      ] = {
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
      //GetAllUsers should not have been called - checking scope before
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      //GetFileContent called 49 times - one additional user data
      expectedGetFileContentCallNumber = 49;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    it("should return 403 - if user has invalid scope - tenant user", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["fakeScope"],
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
      expectedErrorText = "Forbidden access. No scope found to access the app!";
      //GetAllUsers called 0 times - first check the users scope
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    it("should return 401 - if there is no authorization token in header", async () => {
      delete requestHeaders["authorization"];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";
      //GetAllUsers called 0 times - first check the users scope
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    it("should return 401 - if authorization token is invalid - no bearer prefix", async () => {
      requestHeaders["authorization"] = jwt.sign(userPayload, "testPrivateKey");

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";
      //GetAllUsers called 0 times - first check the users scope
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    it("should return 401 - if authorization token is invalid - invalid token", async () => {
      requestHeaders["authorization"] =
        "Bearer thisIsTheFakeValueOfTheJWTToken";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";
      //GetAllUsers called 0 times - first check the users scope
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========

    //#region ========== MINDSPHERE SERVICE THROWS ==========

    it("should return 500 and not get the plant - if get all users throws", async () => {
      getAllUsersThrows = true;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 500;
      expectedErrorText = `Ups.. Something fails..`;
      //0 calls for getAllUsers - becouse getAllUsers mock is overridden with a different mocked method
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedGetFileContentCallParameters = [];
      expectedFileServiceContent = cloneObject(fileServiceContent);

      await testGlobalPlantGet();

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test get all users error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    it("should return 500 and not get the plant - if there is no plant in cache but there is in storage and get file content throws", async () => {
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
        `testPlant5.plant.config.json`
      ] = oldPlant5;

      //Setting file service content again
      setFileServiceContent(fileServiceContent);

      //Setting get file content to throw
      MindSphereFileService.getInstance().getFileContent = jest.fn(async () => {
        throw new Error("Test get file content error");
      });

      let result = await request(server)
        .get(`/customApi/config/plant/global/${appId}/${plantId}`)
        .set(requestHeaders)
        .send();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(500);

      expect(result.text).toEqual("Ups.. Something fails..");

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

      //Then plants data should be fetched - called only 47 time - not taking one call when invoking route - mocking with other throwing mock function
      expect(getFileContent).toHaveBeenCalledTimes(47);

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      //Storage should not contain new plant's data

      let storagePayload = (MindSphereAppsManager.getInstance().Apps[
        appId
      ] as any)._plantStorage._cacheData;

      let allPlantsPayload: any = {};

      let plantFilePaths = Object.keys(
        expectedFileServiceContent["hostTenant"][`${appId}-asset-id`]
      ).filter((filePath) => filePath.includes(".plant.config.json"));

      for (let plantFilePath of plantFilePaths) {
        let plantFileContent =
          expectedFileServiceContent["hostTenant"][`${appId}-asset-id`][
            plantFilePath
          ];
        let plantId = plantFilePath.replace(".plant.config.json", "");
        allPlantsPayload[plantId] = {
          ...plantFileContent,
        };
      }

      delete allPlantsPayload[plantId];

      expect(storagePayload).toEqual(allPlantsPayload);

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

  describe("POST /global/:appId/:plantId", () => {
    let requestHeaders: any;
    let userPayload: MindSphereUserJWTData;
    let appId: string;
    let requestBody: any;
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
      requestBody = {
        plantId: "testPlant7",
        data: {
          testPlant7Data: "testPlant7DataValue",
        },
        config: {
          testPlant7Config: "testPlant7ConfigValue",
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
        .post(`/customApi/config/plant/global/${appId}`)
        .set(requestHeaders)
        .send(requestBody);
    };

    const testGlobalPlantCreate = async () => {
      let result = await exec();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(expectedResponseCode);

      if (expectedValidCall) {
        expect(result.body.plantId).toBeDefined();
        expect(result.body.plantId).toEqual(requestBody.plantId);

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

      //Then users data should be fetched - without getFileContent - invoked during initialization - 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48
      expect(setFileContent).toHaveBeenCalledTimes(
        expectedSetFileContentCallNumber
      );
      if (expectedSetFileContentCallNumber > 0) {
        expect(setFileContent.mock.calls[0]).toEqual([
          "hostTenant",
          `${appId}-asset-id`,
          `${requestBody.plantId}.plant.config.json`,
          {
            data: { ...requestBody.data },
            config: { ...requestBody.config },
          },
        ]);
      }

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

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
      //If valid call - plant storage should be appended with new plant data
      if (expectedValidCall) {
        allPlantsPayload[requestBody.plantId] = {
          data: { ...requestBody.data },
          config: { ...requestBody.config },
        };
      }

      expect(storagePayload).toEqual(allPlantsPayload);

      //#endregion  =====  CHECKING STORAGE =====
    };

    it("should return create new plant and return 200", async () => {
      await testGlobalPlantCreate();
    });

    it("should return create new plant and return 200 - if app is a subtenant app", async () => {
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
      requestBody = {
        plantId: "testPlant7",
        data: {
          testPlant7Data: "testPlant7DataValue",
        },
        config: {
          testPlant7Config: "testPlant7ConfigValue",
        },
      };

      await testGlobalPlantCreate();
    });

    it("should return create new plant and return 200 - if app is a tenant app", async () => {
      appId = "ten-testTenant2";
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
      requestBody = {
        plantId: "testPlant7",
        data: {
          testPlant7Data: "testPlant7DataValue",
        },
        config: {
          testPlant7Config: "testPlant7ConfigValue",
        },
      };

      await testGlobalPlantCreate();
    });

    //#region ========== BODY VALIDATION =========

    it("should return 400 and not create new plant - if there is an attempt to create plant with appId", async () => {
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

      await testGlobalPlantCreate();
    });

    it("should return 400 and not create new plant - if plant id is not defined", async () => {
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

      await testGlobalPlantCreate();
    });

    it("should return 400 and not create new plant - if plant id is null", async () => {
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

      await testGlobalPlantCreate();
    });

    it("should return 400 and not create new plant - if plant id is invalid type - number", async () => {
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

      await testGlobalPlantCreate();
    });

    it("should return 400 and not create new plant - if plant id is an empty string", async () => {
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

      await testGlobalPlantCreate();
    });

    it("should return 400 and not create new plant - if plant of given plantId already exists", async () => {
      //Inputs
      requestBody.plantId = "testPlant5";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 400;
      expectedErrorText = `Plant of given id already exists!`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 400 and not create new plant - if plant of given plantId already exists in file service but has not been fetched before", async () => {
      //Inputs
      requestBody.plantId = "testPlant5";
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
        .post(`/customApi/config/plant/global/${appId}`)
        .set(requestHeaders)
        .send(requestBody);

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(400);
      expect(result.text).toEqual(`Plant of given id already exists!`);

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

      //GetFileContent should be called 47 times during initialiaiton and then 1x during creating plant - fetching non-fetched data
      expect(getFileContent).toHaveBeenCalledTimes(48);
      expect(getFileContent.mock.calls[47]).toEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `testPlant5.plant.config.json`,
      ]);

      //Set file should not have been called
      expect(setFileContent).toHaveBeenCalledTimes(0);

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

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

    it("should return 400 and not create new plant - if data in payload is undefined", async () => {
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

      await testGlobalPlantCreate();
    });

    it("should return 400 and not create new plant - if data in payload is null", async () => {
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

      await testGlobalPlantCreate();
    });

    it("should return 400 and not create new plant - if data in payload is not an object (string)", async () => {
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

      await testGlobalPlantCreate();
    });

    it("should return 200 and create new plant - if data in payload is not an empty object", async () => {
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

      await testGlobalPlantCreate();
    });

    it("should return 200 and create new plant - if data in payload is a nested property", async () => {
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

      await testGlobalPlantCreate();
    });

    it("should return 400 and not create new plant - if config in payload is undefined", async () => {
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

      await testGlobalPlantCreate();
    });

    it("should return 400 and not create new plant - if config in payload is null", async () => {
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

      await testGlobalPlantCreate();
    });

    it("should return 400 and not create new plant - if config in payload is not an object (string)", async () => {
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

      await testGlobalPlantCreate();
    });

    it("should return 200 and create new plant - if config in payload is not an empty object", async () => {
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

      await testGlobalPlantCreate();
    });

    it("should return 200 and create new plant - if config in payload is a nested property", async () => {
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

      await testGlobalPlantCreate();
    });

    //#endregion ========== BODY VALIDATION =========

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should return 403 - if local user calls API", async () => {
      //Inputs
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
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 403 - if local admin calls API", async () => {
      //Inputs
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
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 403 - if global user calls API", async () => {
      //Inputs
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
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 200 and create new plant - if global admin calls API", async () => {
      //Inputs
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
      expectedValidCall = true;
      expectedResponseCode = 200;
      expectedErrorText = null;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 1;

      await testGlobalPlantCreate();
    });

    it("should return 403 - if user is a subtenant user and local admin - valid scope invalid role", async () => {
      fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testGlobalAdmin22.user.config.json"].permissions.role =
        UserRole.LocalAdmin;

      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
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
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 403 - if user is a subtenant user and local user - valid scope invalid role", async () => {
      fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testGlobalAdmin22.user.config.json"].permissions.role =
        UserRole.LocalUser;

      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
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
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 403 - if user is a subtenant user and global user - valid scope invalid role", async () => {
      fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testGlobalAdmin22.user.config.json"].permissions.role =
        UserRole.GlobalUser;

      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
        scope: ["testGlobalUserScope"],
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
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 403 - if user is a subtenant user and local admin - invalid scope, valid role", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testLocalUserScope"],
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
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 403 - if user is a subtenant user and local user - invalid scope, valid role", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testLocalAdminScope"],
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
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 403 - if user is a subtenant user and global user - invalid scope, valid role", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalUserScope"],
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
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 403 - if user is a tenant user and local admin - invalid scope, valid role", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_21@user.name",
      };

      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      appId = "ten-testTenant2";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 403 - if user is a tenant user and local user - invalid scope, valid role", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_21@user.name",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      appId = "ten-testTenant2";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 403 - if user is a tenant user and global user - invalid scope, valid role", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalUserScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_21@user.name",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      appId = "ten-testTenant2";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 403 - if user is a subtenant user and local admin - invalid scope and role", async () => {
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
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 403 - if user is a subtenant user and local user - invalid scope and role", async () => {
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
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 403 - if user is a subtenant user and global user - invalid scope and role", async () => {
      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
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
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 403 - if user is a tenant user and local admin - invalid scope and role", async () => {
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

      appId = "ten-testTenant2";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 403 - if user is a tenant user and local user - invalid scope and role", async () => {
      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_local_user_21@user.name",
      };

      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      appId = "ten-testTenant2";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 403 - if user is a tenant user and global user - invalid scope and role", async () => {
      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
        scope: ["testGlobalUserScope"],
        ten: "testTenant2",
        user_name: "test_global_user_21@user.name",
      };

      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      appId = "ten-testTenant2";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 403 - if user is trying to access not his app - subtenant user, tenant app", async () => {
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

      await testGlobalPlantCreate();
    });

    it("should return 403 - if user is trying to access not his app - tenant user, subtenant app", async () => {
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

      await testGlobalPlantCreate();
    });

    it("should return 403 - if user is trying to access not his app - subtenant user, other subtenant app", async () => {
      appId = "ten-testTenant1-sub-subtenant1";

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

      await testGlobalPlantCreate();
    });

    it("should return 403 - if user is trying to access not his app - tenant user, other tenant app", async () => {
      appId = "ten-testTenant1";

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

      await testGlobalPlantCreate();
    });

    it("should return 403 - if user's payload does not have tenant assigned", async () => {
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
      //GetAllUsers should not have been called - checking app before
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 403 - if there is no application - subtenant user", async () => {
      userPayload.ten = "fakeTenant";

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Application of given id not found for the user!";
      //GetAllUsers should not have been called - checking app before
      expectedGetAllUsersCallNumber = 0;
      //GetAssets should have been called x2 - trying to fetch fake app
      expectedGetAssetsCallNumber = 2;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 403 - if there is no application data for given user - subtenant user", async () => {
      delete fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["main.app.config.json"];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Main application settings not found for the user!";
      //GetAllUsers should not have been called - checking app before
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      //GetFileContent invoked only 47 times - no main config file for one of the apps
      expectedGetFileContentCallNumber = 47;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 403 - if user has valid scope, exists in user service exists but does not exist in file service - subtenant user", async () => {
      //Adding new user to user service
      userServiceContent["testTenant2"] = {
        ...userServiceContent["testTenant2"],
        testFakeUser23: {
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
        },
      };

      //Assinging user to local user group in tenant
      userGroupServiceContent.testTenant2.localUserGroup.members = [
        ...userGroupServiceContent.testTenant2.localUserGroup.members,
        {
          type: "USER",
          value: "testFakeUser23",
        },
      ];

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

      await testGlobalPlantCreate();
    });

    it("should return 403 - if user has valid scope, doest not exist in user service but exists in file service - subtenant user", async () => {
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
      //GetFileContent call 49 times - additional user's data
      expectedGetFileContentCallNumber = 49;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 403 - if user has invalid scope - subtenant user", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["fakeScope"],
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
      expectedErrorText = "Forbidden access. No scope found to access the app!";
      //GetAllUsers should not have been called - checking scope before
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 403 - if there is no application - tenant user", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_21@user.name",
      };

      userPayload.ten = "fakeTenant";

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Application of given id not found for the user!";
      //GetAllUsers should not have been called - checking scope before
      expectedGetAllUsersCallNumber = 0;
      //GetAssets should have been called x2 - trying to fetch fake app
      expectedGetAssetsCallNumber = 2;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 403 - if there is no application data for given user - tenant user", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_21@user.name",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      delete fileServiceContent["hostTenant"]["ten-testTenant2-asset-id"][
        "main.app.config.json"
      ];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Main application settings not found for the user!";
      //GetAllUsers should not have been called - checking scope before
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      //GetFileContent called 47 times - lack of one file, app config file
      expectedGetFileContentCallNumber = 47;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 403 - if user has valid scope, doest not exist in user service but exists in file service - tenant user", async () => {
      //Adding user to file service for the app
      fileServiceContent["hostTenant"]["ten-testTenant2-asset-id"][
        "testFakeUser23.user.config.json"
      ] = {
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
      //GetFileContent called 49 times - one additional user data
      expectedGetFileContentCallNumber = 49;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 403 - if user has invalid scope - tenant user", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["fakeScope"],
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
      expectedErrorText = "Forbidden access. No scope found to access the app!";
      //GetAllUsers called 0 times - first check the users scope
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 401 - if there is no authorization token in header", async () => {
      delete requestHeaders["authorization"];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";
      //GetAllUsers called 0 times - first check the users scope
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 401 - if authorization token is invalid - no bearer prefix", async () => {
      requestHeaders["authorization"] = jwt.sign(userPayload, "testPrivateKey");

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";
      //GetAllUsers called 0 times - first check the users scope
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
    });

    it("should return 401 - if authorization token is invalid - invalid token", async () => {
      requestHeaders["authorization"] =
        "Bearer thisIsTheFakeValueOfTheJWTToken";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";
      //GetAllUsers called 0 times - first check the users scope
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedSetFileContentCallNumber = 0;

      await testGlobalPlantCreate();
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

      await testGlobalPlantCreate();

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

      await testGlobalPlantCreate();

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test set file content error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    //#endregion ========== MINDSPHERE SERVICE THROWS ==========
  });

  describe("DELETE /global/:appId/:plantId", () => {
    let requestHeaders: any;
    let userPayload: MindSphereUserJWTData;
    let appId: string;
    let plantId: string;
    let getAllUsersThrows: boolean;
    let deleteFileThrows: boolean;

    //Outputs
    let expectedValidCall: boolean;
    let expectedResponseCode: number;
    let expectedErrorText: string | null;
    let expectedGetAllUsersCallNumber: number;
    let expectedGetAssetsCallNumber: number;
    let expectedGetFileContentCallNumber: number;
    let expectedDeleteFileCallNumber: number;

    beforeEach(() => {
      //Inputs
      requestHeaders = {};
      appId = "ten-testTenant2-sub-subtenant2";
      plantId = "testPlant5";
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
      getAllUsersThrows = false;
      deleteFileThrows = false;

      //Outputs
      expectedValidCall = true;
      expectedResponseCode = 200;
      expectedErrorText = null;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 1;
    });

    let exec = async () => {
      await beforeExec();

      if (getAllUsersThrows) {
        MindSphereUserService.getInstance().getAllUsers = jest.fn(async () => {
          throw new Error("Test get all users error");
        });
      }

      if (deleteFileThrows) {
        MindSphereFileService.getInstance().deleteFile = jest.fn(async () => {
          throw new Error("Test delete file error");
        });
      }

      return request(server)
        .delete(`/customApi/config/plant/global/${appId}/${plantId}`)
        .set(requestHeaders)
        .send();
    };

    const testGlobalPlantDelete = async () => {
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

      //Then users data should be fetched - without getFileContent - invoked during initialization - 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48
      expect(deleteFile).toHaveBeenCalledTimes(expectedDeleteFileCallNumber);
      if (expectedDeleteFileCallNumber > 0) {
        expect(deleteFile.mock.calls[0]).toEqual([
          "hostTenant",
          `${appId}-asset-id`,
          `${plantId}.plant.config.json`,
        ]);
      }

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

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

      //If call is valid - plant should be deleted from cache
      if (expectedValidCall) {
        delete allPlantsPayload[plantId];
      }

      expect(storagePayload).toEqual(allPlantsPayload);

      //#endregion  =====  CHECKING STORAGE =====
    };

    it("should delete plant and return 200", async () => {
      await testGlobalPlantDelete();
    });

    it("should delete plant and return 200 - if app is a subtenant app", async () => {
      appId = "ten-testTenant2-sub-subtenant2";
      plantId = "testPlant5";
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

      await testGlobalPlantDelete();
    });

    it("should delete plant and return 200 - if app is a tenant app", async () => {
      appId = "ten-testTenant2";
      plantId = "testPlant2";
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

      await testGlobalPlantDelete();
    });

    it("should fetch plant's data, delete it and return 200 - if plant exists in storage but not in cache", async () => {
      let oldPlantPayload =
        fileServiceContent["hostTenant"][`${appId}-asset-id`][
          `${plantId}.plant.config.json`
        ];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${plantId}.plant.config.json`
      ];

      await beforeExec();

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${plantId}.plant.config.json`
      ] = oldPlantPayload;
      setFileServiceContent(fileServiceContent);

      let result = await request(server)
        .delete(`/customApi/config/plant/global/${appId}/${plantId}`)
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

      //GetFileContent should be called 47 times during initialization and then 48th time during fetching plant's data
      expect(getFileContent).toHaveBeenCalledTimes(48);
      expect(getFileContent.mock.calls[47]).toEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `${plantId}.plant.config.json`,
      ]);

      expect(deleteFile).toHaveBeenCalledTimes(1);
      expect(deleteFile.mock.calls[0]).toEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `${plantId}.plant.config.json`,
      ]);

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

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

      //If call is valid - plant should be deleted from cache
      delete allPlantsPayload[plantId];

      expect(storagePayload).toEqual(allPlantsPayload);

      //#endregion  =====  CHECKING STORAGE =====
    });

    it("should return 404 and not delete any plant - if there is no plant of given id", async () => {
      //Inputs
      plantId = "fakePlant";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant data not found!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should return 403 - if local user calls API", async () => {
      //Inputs
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
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if local admin calls API", async () => {
      //Inputs
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
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if global user calls API", async () => {
      //Inputs
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
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 200 - if global admin calls API", async () => {
      //Inputs
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

      await testGlobalPlantDelete();
    });

    it("should return 403 - if user is a subtenant user and local admin - valid scope invalid role", async () => {
      fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testGlobalAdmin22.user.config.json"].permissions.role =
        UserRole.LocalAdmin;

      userPayload = {
        client_id: "testLocalAdminClientId",
        email: "testLocalAdminEmail",
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
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if user is a subtenant user and local user - valid scope invalid role", async () => {
      fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testGlobalAdmin22.user.config.json"].permissions.role =
        UserRole.LocalUser;

      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
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
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if user is a subtenant user and global user - valid scope invalid role", async () => {
      fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testGlobalAdmin22.user.config.json"].permissions.role =
        UserRole.GlobalUser;

      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
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
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if user is a subtenant user and local admin - invalid scope, valid role", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testLocalUserScope"],
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
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if user is a subtenant user and local user - invalid scope, valid role", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testLocalAdminScope"],
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
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if user is a subtenant user and global user - invalid scope, valid role", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalUserScope"],
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
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if user is a tenant user and local admin - invalid scope, valid role", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testLocalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_21@user.name",
      };

      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      appId = "ten-testTenant2";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if user is a tenant user and local user - invalid scope, valid role", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_21@user.name",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      appId = "ten-testTenant2";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if user is a tenant user and global user - invalid scope, valid role", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalUserScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_21@user.name",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      appId = "ten-testTenant2";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if user is a subtenant user and local admin - invalid scope and role", async () => {
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
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if user is a subtenant user and local user - invalid scope and role", async () => {
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
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if user is a subtenant user and gloal user - invalid scope and role", async () => {
      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
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
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if user is a tenant user and local admin - invalid scope and role", async () => {
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

      appId = "ten-testTenant2";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if user is a tenant user and local user - invalid scope and role", async () => {
      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
        scope: ["testLocalUserScope"],
        ten: "testTenant2",
        user_name: "test_local_user_21@user.name",
      };

      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      appId = "ten-testTenant2";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if user is a tenant user and global user - invalid scope and role", async () => {
      userPayload = {
        client_id: "testLocalUserClientId",
        email: "testLocalUserEmail",
        scope: ["testGlobalUserScope"],
        ten: "testTenant2",
        user_name: "test_global_user_21@user.name",
      };

      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      appId = "ten-testTenant2";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Access denied. User must be a global admin!";
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 200 and payload of given plant - even if user does not have access to the plant - user is global admin", async () => {
      //Inputs
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
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].data[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].config[plantId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.plants[plantId];

      await testGlobalPlantDelete();
    });

    it("should return 403 - if user is trying to access not his app - subtenant user, tenant app", async () => {
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
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if user is trying to access not his app - tenant user, subtenant app", async () => {
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
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if user is trying to access not his app - subtenant user, other subtenant app", async () => {
      appId = "ten-testTenant1-sub-subtenant1";

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
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if user is trying to access not his app - tenant user, other tenant app", async () => {
      appId = "ten-testTenant1";

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
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if user's payload does not have tenant assigned", async () => {
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
      //GetAllUsers should not have been called - checking app before
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if there is no application - subtenant user", async () => {
      userPayload.ten = "fakeTenant";

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Application of given id not found for the user!";
      //GetAllUsers should not have been called - checking app before
      expectedGetAllUsersCallNumber = 0;
      //GetAssets called twice - try to fetch fake app
      expectedGetAssetsCallNumber = 2;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if there is no application data for given user - subtenant user", async () => {
      delete fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["main.app.config.json"];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Main application settings not found for the user!";
      //GetAllUsers should not have been called - checking app before
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      //GetFileContent invoked only 47 times - no main config file for one of the apps
      expectedGetFileContentCallNumber = 47;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if user has valid scope, exists in user service exists but does not exist in file service - subtenant user", async () => {
      //Adding new user to user service
      userServiceContent["testTenant2"] = {
        ...userServiceContent["testTenant2"],
        testFakeUser23: {
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
        },
      };

      //Assinging user to local user group in tenant
      userGroupServiceContent.testTenant2.localUserGroup.members = [
        ...userGroupServiceContent.testTenant2.localUserGroup.members,
        {
          type: "USER",
          value: "testFakeUser23",
        },
      ];

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
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if user has valid scope, doest not exist in user service but exists in file service - subtenant user", async () => {
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
      //GetFileContent call 49 times - additional user's data
      expectedGetFileContentCallNumber = 49;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if user has invalid scope - subtenant user", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["fakeScope"],
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
      expectedErrorText = "Forbidden access. No scope found to access the app!";
      //GetAllUsers should not have been called - checking scope before
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if there is no application - tenant user", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_21@user.name",
      };

      userPayload.ten = "fakeTenant";

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Application of given id not found for the user!";
      //GetAllUsers should not have been called - checking scope before
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 2;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if there is no application data for given user - tenant user", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["testGlobalAdminScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_21@user.name",
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      delete fileServiceContent["hostTenant"]["ten-testTenant2-asset-id"][
        "main.app.config.json"
      ];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Main application settings not found for the user!";
      //GetAllUsers should not have been called - checking scope before
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      //GetFileContent called 47 times - lack of one file, app config file
      expectedGetFileContentCallNumber = 47;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if user has valid scope, doest not exist in user service but exists in file service - tenant user", async () => {
      //Adding user to file service for the app
      fileServiceContent["hostTenant"]["ten-testTenant2-asset-id"][
        "testFakeUser23.user.config.json"
      ] = {
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
      //GetAllUsers should not have been called - checking scope before
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      //GetFileContent called 49 times - one additional user data
      expectedGetFileContentCallNumber = 49;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 403 - if user has invalid scope - tenant user", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["fakeScope"],
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
      expectedErrorText = "Forbidden access. No scope found to access the app!";
      //GetAllUsers called 0 times - first check the users scope
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 401 - if there is no authorization token in header", async () => {
      delete requestHeaders["authorization"];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";
      //GetAllUsers called 0 times - first check the users scope
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 401 - if authorization token is invalid - no bearer prefix", async () => {
      requestHeaders["authorization"] = jwt.sign(userPayload, "testPrivateKey");

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";
      //GetAllUsers called 0 times - first check the users scope
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    it("should return 401 - if authorization token is invalid - invalid token", async () => {
      requestHeaders["authorization"] =
        "Bearer thisIsTheFakeValueOfTheJWTToken";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";
      //GetAllUsers called 0 times - first check the users scope
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========

    //#region ========== MINDSPHERE SERVICE THROWS ==========

    it("should return 500 and not delete the plant - if get all users throws", async () => {
      getAllUsersThrows = true;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 500;
      expectedErrorText = `Ups.. Something fails..`;
      //0 calls for getAllUsers - becouse getAllUsers mock is overridden with a different mocked method
      expectedGetAllUsersCallNumber = 0;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test get all users error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    it("should return 500 and not delete the plant - if delete file throws", async () => {
      deleteFileThrows = true;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 500;
      expectedErrorText = `Ups.. Something fails..`;
      expectedGetAllUsersCallNumber = 1;
      expectedGetAssetsCallNumber = 1;
      expectedGetFileContentCallNumber = 48;
      //0 calls for deleteFile - becouse deleteFile mock is overridden with a different mocked method
      expectedDeleteFileCallNumber = 0;

      await testGlobalPlantDelete();

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test delete file error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    //#endregion ========== MINDSPHERE SERVICE THROWS ==========
  });
});

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

describe("config user route", () => {
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

  describe("GET /me", () => {
    let requestHeaders: any;
    let userPayload: MindSphereUserJWTData;
    let getAllUsersThrows: boolean;

    beforeEach(() => {
      requestHeaders = {};
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
    });

    let exec = async () => {
      await beforeExec();

      if (getAllUsersThrows) {
        MindSphereUserService.getInstance().getAllUsers = jest.fn(async () => {
          throw new Error("Test get all users error");
        });
      }

      return request(server)
        .get("/customApi/config/user/me")
        .set(requestHeaders)
        .send();
    };

    it("should return 200 and payload of the user - if user is a subtenant user and global admin", async () => {
      let result = await exec();
      expect(result.status).toEqual(200);

      //#region ===== CHECKING RESPONSE =====

      let expectedPayload = {
        ...fileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-asset-id"
        ]["testGlobalAdmin22.user.config.json"],
        appId: "ten-testTenant2-sub-subtenant2",
        userId: "testGlobalAdmin22",
      };

      expect(result.body).toEqual(expectedPayload);

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        "subtenant2",
        null,
        "test_global_admin_22@user.name",
      ]);

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
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-asset-id",
        "testGlobalAdmin22.user.config.json",
      ]);

      //#endregion ===== CHECKING API CALLS =====
    });

    it("should return 200 and payload of the user - if user is a subtenant user and global user", async () => {
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

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(200);

      let expectedPayload = {
        ...fileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-asset-id"
        ]["testGlobalUser22.user.config.json"],
        appId: "ten-testTenant2-sub-subtenant2",
        userId: "testGlobalUser22",
      };

      expect(result.body).toEqual(expectedPayload);

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        "subtenant2",
        null,
        "test_global_user_22@user.name",
      ]);

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
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-asset-id",
        "testGlobalUser22.user.config.json",
      ]);

      //#endregion ===== CHECKING API CALLS =====
    });

    it("should return 200 and payload of the user - if user is a subtenant user and local admin", async () => {
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

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(200);

      let expectedPayload = {
        ...fileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-asset-id"
        ]["testLocalAdmin22.user.config.json"],
        appId: "ten-testTenant2-sub-subtenant2",
        userId: "testLocalAdmin22",
      };

      expect(result.body).toEqual(expectedPayload);

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        "subtenant2",
        null,
        "test_local_admin_22@user.name",
      ]);

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
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-asset-id",
        "testLocalAdmin22.user.config.json",
      ]);

      //#endregion ===== CHECKING API CALLS =====
    });

    it("should return 200 and payload of the user - if user is a subtenant user and local user", async () => {
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

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(200);

      let expectedPayload = {
        ...fileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-asset-id"
        ]["testLocalUser22.user.config.json"],
        appId: "ten-testTenant2-sub-subtenant2",
        userId: "testLocalUser22",
      };

      expect(result.body).toEqual(expectedPayload);

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        "subtenant2",
        null,
        "test_local_user_22@user.name",
      ]);

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
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-asset-id",
        "testLocalUser22.user.config.json",
      ]);

      //#endregion ===== CHECKING API CALLS =====
    });

    it("should return 200 and payload of the user - if user is a tenant user and global admin", async () => {
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

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(200);

      let expectedPayload = {
        ...fileServiceContent["hostTenant"]["ten-testTenant2-asset-id"][
          "testGlobalAdmin21.user.config.json"
        ],
        appId: "ten-testTenant2",
        userId: "testGlobalAdmin21",
      };

      expect(result.body).toEqual(expectedPayload);

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        null,
        null,
        "test_global_admin_21@user.name",
      ]);

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
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-asset-id",
        "testGlobalAdmin21.user.config.json",
      ]);

      //#endregion ===== CHECKING API CALLS =====
    });

    it("should return 200 and payload of the user - if user is a tenant user and global user", async () => {
      userPayload = {
        client_id: "testGlobalUserClientId",
        email: "testGlobalUserEmail",
        scope: ["testGlobalUserScope"],
        ten: "testTenant2",
        user_name: "test_global_user_21@user.name",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(200);

      let expectedPayload = {
        ...fileServiceContent["hostTenant"]["ten-testTenant2-asset-id"][
          "testGlobalUser21.user.config.json"
        ],
        appId: "ten-testTenant2",
        userId: "testGlobalUser21",
      };

      expect(result.body).toEqual(expectedPayload);

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        null,
        null,
        "test_global_user_21@user.name",
      ]);

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
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-asset-id",
        "testGlobalUser21.user.config.json",
      ]);

      //#endregion ===== CHECKING API CALLS =====
    });

    it("should return 200 and payload of the user - if user is a tenant user and local admin", async () => {
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

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(200);

      let expectedPayload = {
        ...fileServiceContent["hostTenant"]["ten-testTenant2-asset-id"][
          "testLocalAdmin21.user.config.json"
        ],
        appId: "ten-testTenant2",
        userId: "testLocalAdmin21",
      };

      expect(result.body).toEqual(expectedPayload);

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        null,
        null,
        "test_local_admin_21@user.name",
      ]);

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
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-asset-id",
        "testLocalAdmin21.user.config.json",
      ]);

      //#endregion ===== CHECKING API CALLS =====
    });

    it("should return 200 and payload of the user - if user is a tenant user and local user", async () => {
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

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(200);

      let expectedPayload = {
        ...fileServiceContent["hostTenant"]["ten-testTenant2-asset-id"][
          "testLocalUser21.user.config.json"
        ],
        appId: "ten-testTenant2",
        userId: "testLocalUser21",
      };

      expect(result.body).toEqual(expectedPayload);

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        null,
        null,
        "test_local_user_21@user.name",
      ]);

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
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-asset-id",
        "testLocalUser21.user.config.json",
      ]);

      //#endregion ===== CHECKING API CALLS =====
    });

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should return 403 - if user's payload does not have tenant assigned", async () => {
      delete (userPayload as any).ten;

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(403);
      expect(result.text).toEqual(
        "Access denied. Invalid application id generated from user payload!"
      );

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should not be fetched
      expect(getAllUsers).not.toHaveBeenCalled();

      //Checking if app exists - should be invoked only one time during initalization
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //TUsers data should be fetched only during initialization - 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48
      expect(checkIfFileExists).toHaveBeenCalledTimes(48);
      expect(getFileContent).toHaveBeenCalledTimes(48);

      //#endregion ===== CHECKING API CALLS =====
    });

    it("should return 403 - if there is no application - subtenant user", async () => {
      userPayload.ten = "fakeTenant";

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(403);
      expect(result.text).toEqual(
        "Access denied. Application of given id not found for the user!"
      );

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //Checking if app exists - should be invoked two times - one time during initialization, second during checking if app of given "fake name" exists
      expect(getAssets).toHaveBeenCalledTimes(2);
      expect(getAssets.mock.calls[1]).toEqual([
        "hostTenant",
        "ten-fakeTenant-sub-subtenant2",
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //User id should not be fetched - invalid app id
      expect(getAllUsers).not.toHaveBeenCalled();

      //Then users data should be fetched - without getFileContent - invoked during initialization - 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48
      expect(checkIfFileExists).toHaveBeenCalledTimes(48);
      expect(getFileContent).toHaveBeenCalledTimes(48);

      //#endregion ===== CHECKING API CALLS =====
    });

    it("should return 403 - if there is no application data for given user - subtenant user", async () => {
      delete fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["main.app.config.json"];

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(403);
      expect(result.text).toEqual(
        "Access denied. Main application settings not found for the user!"
      );

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //Checking if app exists - should be invoked one time during initialization
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //User id should not be fetched - invalid app id
      expect(getAllUsers).not.toHaveBeenCalled();

      //Then users data should be fetched - without getFileContent - invoked during initialization - 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48 - 1 (main app config)
      //Check file data from app config should be called, but not get file content
      expect(checkIfFileExists).toHaveBeenCalledTimes(48);
      expect(checkIfFileExists.mock.calls[47]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-asset-id",
        "main.app.config.json",
      ]);
      expect(getFileContent).toHaveBeenCalledTimes(47);

      //#endregion ===== CHECKING API CALLS =====
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

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(403);
      expect(result.text).toEqual(
        "Access denied. User does not exist for given app id!"
      );

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //Checking if app exists - should be invoked only one time during initalization
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        "subtenant2",
        null,
        "test_fake_user_23@user.name",
      ]);

      //Check file data should be additonally invoked but not getFileContent- 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48 + 1 fake user
      expect(checkIfFileExists).toHaveBeenCalledTimes(49);
      expect(checkIfFileExists.mock.calls[48]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-asset-id",
        "testFakeUser23.user.config.json",
      ]);
      expect(getFileContent).toHaveBeenCalledTimes(48);

      //#endregion ===== CHECKING API CALLS =====
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

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(403);
      expect(result.text).toEqual(
        "Access denied. User of given name not found!"
      );

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //Checking if app exists - should be invoked only one time during initalization
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        "subtenant2",
        null,
        "test_fake_user_23@user.name",
      ]);

      //Check file data and get file data should be called only during initialization - 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48 + 1 fake user data
      expect(checkIfFileExists).toHaveBeenCalledTimes(49);
      expect(getFileContent).toHaveBeenCalledTimes(49);

      //#endregion ===== CHECKING API CALLS =====
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

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(403);
      expect(result.text).toEqual(
        "Forbidden access. No scope found to access the app!"
      );

      //#endregion ===== CHECKING RESPONSE =====
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

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(403);
      expect(result.text).toEqual(
        "Access denied. Application of given id not found for the user!"
      );

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //Checking if app exists - should be invoked two times - one time during initialization, second during checking if app of given "fake name" exists
      expect(getAssets).toHaveBeenCalledTimes(2);
      expect(getAssets.mock.calls[1]).toEqual([
        "hostTenant",
        "ten-fakeTenant",
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //User id should not be fetched - invalid app id
      expect(getAllUsers).not.toHaveBeenCalled();

      //Then users data should be fetched - without getFileContent - invoked during initialization - 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48
      expect(checkIfFileExists).toHaveBeenCalledTimes(48);
      expect(getFileContent).toHaveBeenCalledTimes(48);

      //#endregion ===== CHECKING API CALLS =====
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

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(403);
      expect(result.text).toEqual(
        "Access denied. Main application settings not found for the user!"
      );

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //Checking if app exists - should be invoked one time during initialization
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //User id should not be fetched - invalid app id
      expect(getAllUsers).not.toHaveBeenCalled();

      //Then users data should be fetched - without getFileContent - invoked during initialization - 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48 - 1 (main app config)
      //Check file data from app config should be called, but not get file content
      expect(checkIfFileExists).toHaveBeenCalledTimes(48);
      expect(checkIfFileExists.mock.calls[47]).toEqual([
        "hostTenant",
        "ten-testTenant2-asset-id",
        "main.app.config.json",
      ]);
      expect(getFileContent).toHaveBeenCalledTimes(47);

      //#endregion ===== CHECKING API CALLS =====
    });

    it("should return 403 - if user has valid scope, exists in user service exists but does not exist in file service - tenant user", async () => {
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
      };

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(403);
      expect(result.text).toEqual(
        "Access denied. User does not exist for given app id!"
      );

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //Checking if app exists - should be invoked only one time during initalization
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        null,
        null,
        "test_fake_user_23@user.name",
      ]);

      //Check file data should be additonally invoked but not getFileContent- 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48 + 1 fake user
      expect(checkIfFileExists).toHaveBeenCalledTimes(49);
      expect(checkIfFileExists.mock.calls[48]).toEqual([
        "hostTenant",
        "ten-testTenant2-asset-id",
        "testFakeUser23.user.config.json",
      ]);
      expect(getFileContent).toHaveBeenCalledTimes(48);

      //#endregion ===== CHECKING API CALLS =====
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

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(403);
      expect(result.text).toEqual(
        "Access denied. User of given name not found!"
      );

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //Checking if app exists - should be invoked only one time during initalization
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        null,
        null,
        "test_fake_user_23@user.name",
      ]);

      //Check file data and get file data should be called only during initialization - 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48 + 1 fake user data
      expect(checkIfFileExists).toHaveBeenCalledTimes(49);
      expect(getFileContent).toHaveBeenCalledTimes(49);

      //#endregion ===== CHECKING API CALLS =====
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

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(403);
      expect(result.text).toEqual(
        "Forbidden access. No scope found to access the app!"
      );

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //Checking if app exists - should be invoked only one time during initalization
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //Get all users should not have been called - returning before fetching id
      expect(getAllUsers).not.toHaveBeenCalled();

      //Check file data and get file data should be called only during initialization - 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48
      expect(checkIfFileExists).toHaveBeenCalledTimes(48);
      expect(getFileContent).toHaveBeenCalledTimes(48);

      //#endregion ===== CHECKING API CALLS =====
    });

    it("should return 401 - if there is no authorization token in header", async () => {
      delete requestHeaders["authorization"];

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(401);
      expect(result.text).toEqual(
        "Access denied. No token provided to fetch the user or token is invalid!"
      );

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //Checking if app exists - should be invoked only one time during initalization
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //Get all users should not have been called - returning before fetching id
      expect(getAllUsers).not.toHaveBeenCalled();

      //Check file data and get file data should be called only during initialization - 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48
      expect(checkIfFileExists).toHaveBeenCalledTimes(48);
      expect(getFileContent).toHaveBeenCalledTimes(48);

      //#endregion ===== CHECKING API CALLS =====
    });

    it("should return 401 - if authorization token is invalid - no bearer prefix", async () => {
      requestHeaders["authorization"] = jwt.sign(userPayload, "testPrivateKey");

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(401);
      expect(result.text).toEqual(
        "Access denied. No token provided to fetch the user or token is invalid!"
      );

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //Checking if app exists - should be invoked only one time during initalization
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //Get all users should not have been called - returning before fetching id
      expect(getAllUsers).not.toHaveBeenCalled();

      //Check file data and get file data should be called only during initialization - 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48
      expect(checkIfFileExists).toHaveBeenCalledTimes(48);
      expect(getFileContent).toHaveBeenCalledTimes(48);

      //#endregion ===== CHECKING API CALLS =====
    });

    it("should return 401 - if authorization token is invalid - invalid token", async () => {
      requestHeaders["authorization"] =
        "Bearer thisIsTheFakeValueOfTheJWTToken";

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(401);
      expect(result.text).toEqual(
        "Access denied. No token provided to fetch the user or token is invalid!"
      );

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //Checking if app exists - should be invoked only one time during initalization
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //Get all users should not have been called - returning before fetching id
      expect(getAllUsers).not.toHaveBeenCalled();

      //Check file data and get file data should be called only during initialization - 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48
      expect(checkIfFileExists).toHaveBeenCalledTimes(48);
      expect(getFileContent).toHaveBeenCalledTimes(48);

      //#endregion ===== CHECKING API CALLS =====
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========

    //#region ========== MINDSPHERE SERVICE THROWS ==========

    it("should return 500 and not update user - if getAllUsers throws", async () => {
      getAllUsersThrows = true;

      let result = await exec();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(500);

      expect(result.text).toEqual(`Ups.. Something fails..`);

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test get all users error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    //#endregion ========== MINDSPHERE SERVICE THROWS ==========
  });

  describe("PUT /me", () => {
    let requestHeaders: any;
    let requestBody: any;
    let userPayload: MindSphereUserJWTData;
    let setFileThrows: boolean;
    let getAllUsersThrows: boolean;

    beforeEach(() => {
      requestHeaders = {};
      requestBody = {
        data: {
          testPlant4: {
            testGlobalAdmin22TestPlant4Data:
              "testGlobalAdmin22TestPlant4DataModifiedValue",
          },
          testPlant5: {
            testGlobalAdmin22TestPlant5Data:
              "testGlobalAdmin22TestPlant5DataModifiedValue",
          },
          testPlant6: {
            testGlobalAdmin22TestPlant6Data:
              "testGlobalAdmin22TestPlant6DataModifiedValue",
          },
        },
        config: {
          testPlant4: {
            testGlobalAdmin22TestPlant4Config:
              "testGlobalAdmin22TestPlant4ConfigModifiedValue",
          },
          testPlant5: {
            testGlobalAdmin22TestPlant5Config:
              "testGlobalAdmin22TestPlant5ConfigModifiedValue",
          },
          testPlant6: {
            testGlobalAdmin22TestPlant6Config:
              "testGlobalAdmin22TestPlant6ConfigModifiedValue",
          },
        },
        permissions: {
          role: UserRole.GlobalAdmin,
          plants: {
            testPlant4: PlantPermissions.Admin,
            testPlant5: PlantPermissions.Admin,
            testPlant6: PlantPermissions.Admin,
          },
        },
        userName: "test_global_admin_22@user.name",
      };
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
      setFileThrows = false;
      getAllUsersThrows = false;
    });

    let exec = async () => {
      await beforeExec();

      if (setFileThrows) {
        MindSphereFileService.getInstance().setFileContent = jest.fn(
          async () => {
            throw new Error("Test set content error");
          }
        );
      }

      if (getAllUsersThrows) {
        MindSphereUserService.getInstance().getAllUsers = jest.fn(async () => {
          throw new Error("Test get all users error");
        });
      }

      return request(server)
        .put("/customApi/config/user/me")
        .set(requestHeaders)
        .send(requestBody);
    };

    it("should return 200 and payload of the updated user - if user is a subtenant user and global admin", async () => {
      let result = await exec();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(200);

      let expectedResult = {
        ...requestBody,
        userId: "testGlobalAdmin22",
        appId: "ten-testTenant2-sub-subtenant2",
      };
      expect(result.body).toEqual(expectedResult);

      //#endregion ===== CHECKING RESPONSE =====

      //#region  =====  CHECKING STORAGE =====

      let storagePayload = (MindSphereAppsManager.getInstance().Apps[
        "ten-testTenant2-sub-subtenant2"
      ] as any)._userStorage._cacheData["testGlobalAdmin22"];

      expect(storagePayload).toEqual(requestBody);

      //#endregion  =====  CHECKING STORAGE =====

      //#region  =====  CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        "subtenant2",
        null,
        "test_global_admin_22@user.name",
      ]);

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
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-asset-id",
        "testGlobalAdmin22.user.config.json",
      ]);

      //Set file content should have been called
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-asset-id",
        "testGlobalAdmin22.user.config.json",
        requestBody,
      ]);

      //#endregion  =====  CHECKING API CALLS =====
    });

    it("should return 200 and payload of the updated user - if user is a subtenant user and global user", async () => {
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
      requestBody = {
        data: {
          testPlant4: {
            testGlobalUser22TestPlant4Data:
              "testGlobalUser22TestPlant4DataModifiedValue",
          },
          testPlant5: {
            testGlobalUser22TestPlant5Data:
              "testGlobalUser22TestPlant5DataModifiedValue",
          },
          testPlant6: {
            testGlobalUser22TestPlant6Data:
              "testGlobalUser22TestPlant6DataModifiedValue",
          },
        },
        config: {
          testPlant4: {
            testGlobalUser22TestPlant4Config:
              "testGlobalUser22TestPlant4ConfigModifiedValue",
          },
          testPlant5: {
            testGlobalUser22TestPlant5Config:
              "testGlobalUser22TestPlant5ConfigModifiedValue",
          },
          testPlant6: {
            testGlobalUser22TestPlant6Config:
              "testGlobalUser22TestPlant6ConfigModifiedValue",
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
      };

      let result = await exec();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(200);

      let expectedResult = {
        ...requestBody,
        userId: "testGlobalUser22",
        appId: "ten-testTenant2-sub-subtenant2",
      };
      expect(result.body).toEqual(expectedResult);

      //#endregion ===== CHECKING RESPONSE =====

      //#region  =====  CHECKING STORAGE =====

      let storagePayload = (MindSphereAppsManager.getInstance().Apps[
        "ten-testTenant2-sub-subtenant2"
      ] as any)._userStorage._cacheData["testGlobalUser22"];

      expect(storagePayload).toEqual(requestBody);

      //#endregion  =====  CHECKING STORAGE =====

      //#region  =====  CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        "subtenant2",
        null,
        "test_global_user_22@user.name",
      ]);

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
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-asset-id",
        "testGlobalUser22.user.config.json",
      ]);

      //Set file content should have been called
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-asset-id",
        "testGlobalUser22.user.config.json",
        requestBody,
      ]);

      //#endregion  =====  CHECKING API CALLS =====
    });

    it("should return 200 and payload of the updated user - if user is a subtenant user and local admin", async () => {
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
          testPlant4: {
            testLocalAdmin22TestPlant4Data:
              "testLocalAdmin22TestPlant4DataModifiedValue",
          },
          testPlant5: {
            testLocalAdmin22TestPlant5Data:
              "testLocalAdmin22TestPlant5DataModifiedValue",
          },
        },
        config: {
          testPlant4: {
            testLocalAdmin22TestPlant4Config:
              "testLocalAdmin22TestPlant4ConfigModifiedValue",
          },
          testPlant5: {
            testLocalAdmin22TestPlant5Config:
              "testLocalAdmin22TestPlant5ConfigModifiedValue",
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
      };

      let result = await exec();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(200);

      let expectedResult = {
        ...requestBody,
        userId: "testLocalAdmin22",
        appId: "ten-testTenant2-sub-subtenant2",
      };
      expect(result.body).toEqual(expectedResult);

      //#endregion ===== CHECKING RESPONSE =====

      //#region  =====  CHECKING STORAGE =====

      let storagePayload = (MindSphereAppsManager.getInstance().Apps[
        "ten-testTenant2-sub-subtenant2"
      ] as any)._userStorage._cacheData["testLocalAdmin22"];

      expect(storagePayload).toEqual(requestBody);

      //#endregion  =====  CHECKING STORAGE =====

      //#region  =====  CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        "subtenant2",
        null,
        "test_local_admin_22@user.name",
      ]);

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
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-asset-id",
        "testLocalAdmin22.user.config.json",
      ]);

      //Set file content should have been called
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-asset-id",
        "testLocalAdmin22.user.config.json",
        requestBody,
      ]);

      //#endregion  =====  CHECKING API CALLS =====
    });

    it("should return 200 and payload of the updated user - if user is a subtenant user and local user", async () => {
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
      requestBody = {
        data: {
          testPlant5: {
            testLocalUser22TestPlant5Data:
              "testLocalUser22TestPlant5DataModifiedValue",
          },
          testPlant6: {
            testLocalUser22TestPlant6Data:
              "testLocalUser22TestPlant6DataModifiedValue",
          },
        },
        config: {
          testPlant5: {
            testLocalUser22TestPlant5Config:
              "testLocalUser22TestPlant5ConfigModifiedValue",
          },
          testPlant6: {
            testLocalUser22TestPlant6Config:
              "testLocalUser22TestPlant6ConfigModifiedValue",
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

      let result = await exec();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(200);

      let expectedResult = {
        ...requestBody,
        userId: "testLocalUser22",
        appId: "ten-testTenant2-sub-subtenant2",
      };
      expect(result.body).toEqual(expectedResult);

      //#endregion ===== CHECKING RESPONSE =====

      //#region  =====  CHECKING STORAGE =====

      let storagePayload = (MindSphereAppsManager.getInstance().Apps[
        "ten-testTenant2-sub-subtenant2"
      ] as any)._userStorage._cacheData["testLocalUser22"];

      expect(storagePayload).toEqual(requestBody);

      //#endregion  =====  CHECKING STORAGE =====

      //#region  =====  CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        "subtenant2",
        null,
        "test_local_user_22@user.name",
      ]);

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
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-asset-id",
        "testLocalUser22.user.config.json",
      ]);

      //Set file content should have been called
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-asset-id",
        "testLocalUser22.user.config.json",
        requestBody,
      ]);

      //#endregion  =====  CHECKING API CALLS =====
    });

    it("should return 200 and payload of the updated user - if user is a tenant user and global admin", async () => {
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
        data: {
          testPlant1: {
            testGlobalAdmin21TestPlant1Data:
              "testGlobalAdmin21TestPlant1DataModifiedValue",
          },
          testPlant2: {
            testGlobalAdmin21TestPlant2Data:
              "testGlobalAdmin21TestPlant2DataModifiedValue",
          },
          testPlant3: {
            testGlobalAdmin21TestPlant3Data:
              "testGlobalAdmin21TestPlant3DataModifiedValue",
          },
        },
        config: {
          testPlant1: {
            testGlobalAdmin21TestPlant1Config:
              "testGlobalAdmin21TestPlant1ConfigModifiedValue",
          },
          testPlant2: {
            testGlobalAdmin21TestPlant2Config:
              "testGlobalAdmin21TestPlant2ConfigModifiedValue",
          },
          testPlant3: {
            testGlobalAdmin21TestPlant3Config:
              "testGlobalAdmin21TestPlant3ConfigModifiedValue",
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
      };

      let result = await exec();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(200);

      let expectedResult = {
        ...requestBody,
        userId: "testGlobalAdmin21",
        appId: "ten-testTenant2",
      };
      expect(result.body).toEqual(expectedResult);

      //#endregion ===== CHECKING RESPONSE =====

      //#region  =====  CHECKING STORAGE =====

      let storagePayload = (MindSphereAppsManager.getInstance().Apps[
        "ten-testTenant2"
      ] as any)._userStorage._cacheData["testGlobalAdmin21"];

      expect(storagePayload).toEqual(requestBody);

      //#endregion  =====  CHECKING STORAGE =====

      //#region  =====  CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        null,
        null,
        "test_global_admin_21@user.name",
      ]);

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
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-asset-id",
        "testGlobalAdmin21.user.config.json",
      ]);

      //Set file content should have been called
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-asset-id",
        "testGlobalAdmin21.user.config.json",
        requestBody,
      ]);

      //#endregion  =====  CHECKING API CALLS =====
    });

    it("should return 200 and payload of the updated user - if user is a tenant user and global user", async () => {
      userPayload = {
        client_id: "testGlobalUserClientId",
        email: "testGlobalUserEmail",
        scope: ["testGlobalUserScope"],
        ten: "testTenant2",
        user_name: "test_global_user_21@user.name",
      };
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;
      requestBody = {
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
      };

      let result = await exec();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(200);

      let expectedResult = {
        ...requestBody,
        userId: "testGlobalUser21",
        appId: "ten-testTenant2",
      };
      expect(result.body).toEqual(expectedResult);

      //#endregion ===== CHECKING RESPONSE =====

      //#region  =====  CHECKING STORAGE =====

      let storagePayload = (MindSphereAppsManager.getInstance().Apps[
        "ten-testTenant2"
      ] as any)._userStorage._cacheData["testGlobalUser21"];

      expect(storagePayload).toEqual(requestBody);

      //#endregion  =====  CHECKING STORAGE =====

      //#region  =====  CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        null,
        null,
        "test_global_user_21@user.name",
      ]);

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
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-asset-id",
        "testGlobalUser21.user.config.json",
      ]);

      //Set file content should have been called
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-asset-id",
        "testGlobalUser21.user.config.json",
        requestBody,
      ]);

      //#endregion  =====  CHECKING API CALLS =====
    });

    it("should return 200 and payload of the updated user - if user is a tenant user and local admin", async () => {
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
          testPlant1: {
            testLocalAdmin21TestPlant1Data:
              "testLocalAdmin21TestPlant1DataModifiedValue",
          },
          testPlant2: {
            testLocalAdmin21TestPlant2Data:
              "testLocalAdmin21TestPlant2DataModifiedValue",
          },
        },
        config: {
          testPlant1: {
            testLocalAdmin21TestPlant1Config:
              "testLocalAdmin21TestPlant1ConfigModifiedValue",
          },
          testPlant2: {
            testLocalAdmin21TestPlant2Config:
              "testLocalAdmin21TestPlant2ConfigModifiedValue",
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
      };

      let result = await exec();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(200);

      let expectedResult = {
        ...requestBody,
        userId: "testLocalAdmin21",
        appId: "ten-testTenant2",
      };
      expect(result.body).toEqual(expectedResult);

      //#endregion ===== CHECKING RESPONSE =====

      //#region  =====  CHECKING STORAGE =====

      let storagePayload = (MindSphereAppsManager.getInstance().Apps[
        "ten-testTenant2"
      ] as any)._userStorage._cacheData["testLocalAdmin21"];

      expect(storagePayload).toEqual(requestBody);

      //#endregion  =====  CHECKING STORAGE =====

      //#region  =====  CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        null,
        null,
        "test_local_admin_21@user.name",
      ]);

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
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-asset-id",
        "testLocalAdmin21.user.config.json",
      ]);

      //Set file content should have been called
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-asset-id",
        "testLocalAdmin21.user.config.json",
        requestBody,
      ]);

      //#endregion  =====  CHECKING API CALLS =====
    });

    it("should return 200 and payload of the updated user - if user is a tenant user and local user", async () => {
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
      requestBody = {
        data: {
          testPlant2: {
            testLocalUser21TestPlant2Data:
              "testLocalUser21TestPlant2DataModifiedValue",
          },
          testPlant3: {
            testLocalUser21TestPlant3Data:
              "testLocalUser21TestPlant3DataModifiedValue",
          },
        },
        config: {
          testPlant2: {
            testLocalUser21TestPlant2Config:
              "testLocalUser21TestPlant2onfigModifiedValue",
          },
          testPlant3: {
            testLocalUser21TestPlant3Config:
              "testLocalUser21TestPlant3ConfigModifiedValue",
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

      let result = await exec();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(200);

      let expectedResult = {
        ...requestBody,
        userId: "testLocalUser21",
        appId: "ten-testTenant2",
      };
      expect(result.body).toEqual(expectedResult);

      //#endregion ===== CHECKING RESPONSE =====

      //#region  =====  CHECKING STORAGE =====

      let storagePayload = (MindSphereAppsManager.getInstance().Apps[
        "ten-testTenant2"
      ] as any)._userStorage._cacheData["testLocalUser21"];

      expect(storagePayload).toEqual(requestBody);

      //#endregion  =====  CHECKING STORAGE =====

      //#region  =====  CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        null,
        null,
        "test_local_user_21@user.name",
      ]);

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
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-asset-id",
        "testLocalUser21.user.config.json",
      ]);

      //Set file content should have been called
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-asset-id",
        "testLocalUser21.user.config.json",
        requestBody,
      ]);

      //#endregion  =====  CHECKING API CALLS =====
    });

    const testBodyValidation = async (
      editedBody: any,
      validCall: boolean,
      responseCode: number,
      errorText: string | null
    ) => {
      requestBody = editedBody;

      let result = await exec();

      if (validCall) {
        //#region ===== CHECKING RESPONSE =====

        let expectedResult = {
          ...requestBody,
          userId: "testGlobalAdmin22",
          appId: "ten-testTenant2-sub-subtenant2",
        };
        expect(result.body).toEqual(expectedResult);

        //#endregion ===== CHECKING RESPONSE =====

        //#region  =====  CHECKING STORAGE =====

        let userStorageContent = (MindSphereAppsManager.getInstance().Apps[
          "ten-testTenant2-sub-subtenant2"
        ] as any)._userStorage._cacheData;

        //Creating expected storage of users
        let expectedStoragePayload: any = {};

        let allFilePaths = Object.keys(
          fileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-asset-id"
          ]
        );

        for (let filePath of allFilePaths) {
          if (filePath.includes(".user.config.json")) {
            let fileContent =
              fileServiceContent["hostTenant"][
                "ten-testTenant2-sub-subtenant2-asset-id"
              ][filePath];
            let userId = filePath.replace(".user.config.json", "");
            expectedStoragePayload[userId] = fileContent;
          }
        }

        expectedStoragePayload["testGlobalAdmin22"] = requestBody;

        expect(userStorageContent).toEqual(expectedStoragePayload);

        //#endregion  =====  CHECKING STORAGE =====

        //#region  =====  CHECKING API CALLS =====

        //User id should be fetched - via getAllUsers with proper filtering
        expect(getAllUsers).toHaveBeenCalledTimes(1);
        expect(getAllUsers.mock.calls[0]).toEqual([
          "testTenant2",
          "subtenant2",
          null,
          "test_global_admin_22@user.name",
        ]);

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
        expect(getFileContent.mock.calls).toContainEqual([
          "hostTenant",
          "ten-testTenant2-sub-subtenant2-asset-id",
          "testGlobalAdmin22.user.config.json",
        ]);

        //Set file content should have been called
        expect(setFileContent).toHaveBeenCalledTimes(1);
        expect(setFileContent.mock.calls).toContainEqual([
          "hostTenant",
          "ten-testTenant2-sub-subtenant2-asset-id",
          "testGlobalAdmin22.user.config.json",
          requestBody,
        ]);

        //#endregion  =====  CHECKING API CALLS =====
      } else {
        //#region ===== CHECKING RESPONSE =====

        expect(result.status).toEqual(responseCode);
        expect(result.text).toEqual(errorText);

        //#endregion ===== CHECKING RESPONSE =====

        //#region  =====  CHECKING STORAGE =====

        let userStorageContent = (MindSphereAppsManager.getInstance().Apps[
          "ten-testTenant2-sub-subtenant2"
        ] as any)._userStorage._cacheData;

        //Creating expected storage of users
        let expectedStoragePayload: any = {};

        let allFilePaths = Object.keys(
          fileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-asset-id"
          ]
        );

        for (let filePath of allFilePaths) {
          if (filePath.includes(".user.config.json")) {
            let fileContent =
              fileServiceContent["hostTenant"][
                "ten-testTenant2-sub-subtenant2-asset-id"
              ][filePath];
            let userId = filePath.replace(".user.config.json", "");
            expectedStoragePayload[userId] = fileContent;
          }
        }

        expect(userStorageContent).toEqual(expectedStoragePayload);

        //#endregion  =====  CHECKING STORAGE =====

        //#region  =====  CHECKING API CALLS =====

        //User id should be fetched - via getAllUsers with proper filtering
        expect(getAllUsers).toHaveBeenCalledTimes(1);
        expect(getAllUsers.mock.calls[0]).toEqual([
          "testTenant2",
          "subtenant2",
          null,
          "test_global_admin_22@user.name",
        ]);

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
        expect(getFileContent.mock.calls).toContainEqual([
          "hostTenant",
          "ten-testTenant2-sub-subtenant2-asset-id",
          "testGlobalAdmin22.user.config.json",
        ]);

        //Set file content should not have been called
        expect(setFileContent).not.toHaveBeenCalled();

        //#endregion  =====  CHECKING API CALLS =====
      }
    };

    //#region ========== BODY VALIDATION =========

    it("should return 400 - if request is not a valid JSON", async () => {
      requestBody = "fakeBody";

      await beforeExec();

      let result = await request(server)
        .put("/customApi/config/user/me")
        .send('{"invalid"}')
        .type("json");

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(400);
      expect(result.text).toEqual("Invalid request content");

      //#endregion ===== CHECKING RESPONSE =====

      //#region  =====  CHECKING STORAGE =====

      let userStorageContent = (MindSphereAppsManager.getInstance().Apps[
        "ten-testTenant2-sub-subtenant2"
      ] as any)._userStorage._cacheData;

      //Creating expected storage of users
      let expectedStoragePayload: any = {};

      let allFilePaths = Object.keys(
        fileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-asset-id"
        ]
      );

      for (let filePath of allFilePaths) {
        if (filePath.includes(".user.config.json")) {
          let fileContent =
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-asset-id"
            ][filePath];
          let userId = filePath.replace(".user.config.json", "");
          expectedStoragePayload[userId] = fileContent;
        }
      }

      expect(userStorageContent).toEqual(expectedStoragePayload);

      //#endregion  =====  CHECKING STORAGE =====

      //#region  =====  CHECKING API CALLS =====

      //User id should not be fetched
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
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-asset-id",
        "testGlobalAdmin22.user.config.json",
      ]);

      //Set file content should not have been called
      expect(setFileContent).not.toHaveBeenCalled();

      //#endregion  =====  CHECKING API CALLS =====
    });

    it("should return 400 and not update user - if there is an attempt to set userId", async () => {
      requestBody.userId = "fakeUserId";

      await testBodyValidation(
        requestBody,
        false,
        400,
        `"userId" is not allowed`
      );
    });

    it("should return 400 and not update user - if there is an attempt to set appId", async () => {
      requestBody.appId = "fakeAppId";

      await testBodyValidation(
        requestBody,
        false,
        400,
        `"appId" is not allowed`
      );
    });

    it("should return 400 and not update user - if userName is not defined", async () => {
      delete requestBody.userName;

      await testBodyValidation(
        requestBody,
        false,
        400,
        `"userName" is required`
      );
    });

    it("should return 400 and not update user - if userName is null", async () => {
      requestBody.userName = null;

      await testBodyValidation(
        requestBody,
        false,
        400,
        `"userName" must be a string`
      );
    });

    it("should return 400 and not update user - if userName has invalid type (number)", async () => {
      requestBody.userName = 1234;

      await testBodyValidation(
        requestBody,
        false,
        400,
        `"userName" must be a string`
      );
    });

    it("should return 400 and not update user - if userName is invalid email", async () => {
      requestBody.userName = "fakeEmailValue";

      await testBodyValidation(
        requestBody,
        false,
        400,
        `"userName" must be a valid email`
      );
    });

    it("should return 400 and not update user - if data is undefined", async () => {
      delete requestBody.data;

      await testBodyValidation(requestBody, false, 400, `"data" is required`);
    });

    it("should return 400 and not update user - if data is null", async () => {
      requestBody.data = null;

      await testBodyValidation(
        requestBody,
        false,
        400,
        `"data" must be of type object`
      );
    });

    it("should return 400 and not update user - if data has invalid type (string)", async () => {
      requestBody.data = "testData";

      await testBodyValidation(
        requestBody,
        false,
        400,
        `"data" must be of type object`
      );
    });

    it("should return 400 and not update user - if data is an empty object - permissions of plants exist", async () => {
      requestBody.data = {};

      await testBodyValidation(
        requestBody,
        false,
        400,
        `User data invalid - plantIds in data and in permissions must be identical!`
      );
    });

    it("should return 200 and not update user - if data is an empty object - permissions of plants don't exist", async () => {
      requestBody.data = {};
      requestBody.config = {};
      requestBody.permissions.plants = {};

      let userFilePayload =
        fileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-asset-id"
        ]["testGlobalAdmin22.user.config.json"];

      userFilePayload.data = {};
      userFilePayload.config = {};
      userFilePayload.permissions.plants = {};

      await testBodyValidation(requestBody, true, 200, null);
    });

    it("should return 200 and not update user - if data has nested properties ", async () => {
      //Creating nested properties
      requestBody.data = {
        testPlant4: {
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
        testPlant6: {
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

      await testBodyValidation(requestBody, true, 200, null);
    });

    it("should return 400 and not update user - if data is not an empty object - permissions of plants don't exist", async () => {
      requestBody.config = {};
      requestBody.permissions.plants = {};

      await testBodyValidation(
        requestBody,
        false,
        400,
        `User data invalid - plantIds in data and in permissions must be identical!`
      );
    });

    it("should return 400 and not update user - if data has additional plant id", async () => {
      requestBody.data["fakePlantId"] = { test: 1234 };

      await testBodyValidation(
        requestBody,
        false,
        400,
        `User data invalid - plantIds in data and in permissions must be identical!`
      );
    });

    it("should return 400 and not update user - if config is undefined", async () => {
      delete requestBody.config;

      await testBodyValidation(requestBody, false, 400, `"config" is required`);
    });

    it("should return 400 and not update user - if config is null", async () => {
      requestBody.config = null;

      await testBodyValidation(
        requestBody,
        false,
        400,
        `"config" must be of type object`
      );
    });

    it("should return 400 and not update user - if config has invalid type (string)", async () => {
      requestBody.config = "testData";

      await testBodyValidation(
        requestBody,
        false,
        400,
        `"config" must be of type object`
      );
    });

    it("should return 400 and not update user - if config is an empty object - permissions of plants exist", async () => {
      requestBody.config = {};

      await testBodyValidation(
        requestBody,
        false,
        400,
        `User config invalid - plantIds in config and in permissions must be identical!`
      );
    });

    it("should return 200 and not update user - if config is an empty object - permissions of plants don't exist", async () => {
      requestBody.data = {};
      requestBody.config = {};
      requestBody.permissions.plants = {};

      let userFilePayload =
        fileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-asset-id"
        ]["testGlobalAdmin22.user.config.json"];

      userFilePayload.data = {};
      userFilePayload.config = {};
      userFilePayload.permissions.plants = {};

      await testBodyValidation(requestBody, true, 200, null);
    });

    it("should return 200 and not update user - if config has nested properties ", async () => {
      //Creating nested properties
      requestBody.config = {
        testPlant4: {
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
        testPlant6: {
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

      await testBodyValidation(requestBody, true, 200, null);
    });

    it("should return 400 and not update user - if config is not an empty object - permissions of plants don't exist", async () => {
      requestBody.data = {};
      requestBody.permissions.plants = {};

      await testBodyValidation(
        requestBody,
        false,
        400,
        `User config invalid - plantIds in config and in permissions must be identical!`
      );
    });

    it("should return 400 and not update user - if config has additional plant id", async () => {
      requestBody.config["fakePlantId"] = { test: 1234 };

      await testBodyValidation(
        requestBody,
        false,
        400,
        `User config invalid - plantIds in config and in permissions must be identical!`
      );
    });

    it("should return 400 and not update user - if permissions is undefined", async () => {
      delete requestBody.permissions;

      await testBodyValidation(
        requestBody,
        false,
        400,
        `"permissions" is required`
      );
    });

    it("should return 400 and not update user - if permissions is null", async () => {
      requestBody.permissions = null;

      await testBodyValidation(
        requestBody,
        false,
        400,
        `"permissions" must be of type object`
      );
    });

    it("should return 400 and not update user - if permissions has invalid type (string)", async () => {
      requestBody.permissions = "testData";

      await testBodyValidation(
        requestBody,
        false,
        400,
        `"permissions" must be of type object`
      );
    });

    it("should return 400 and not update user - if permissions.role is undefined", async () => {
      delete requestBody.permissions.role;

      await testBodyValidation(
        requestBody,
        false,
        400,
        `"permissions.role" is required`
      );
    });

    it("should return 400 and not update user - if permissions.role is null", async () => {
      requestBody.permissions.role = null;

      await testBodyValidation(
        requestBody,
        false,
        400,
        `"permissions.role" must be one of [0, 1, 2, 3]`
      );
    });

    it("should return 400 and not update user - if permissions.role has invalid type (string)", async () => {
      requestBody.permissions.role = "testData";

      await testBodyValidation(
        requestBody,
        false,
        400,
        `"permissions.role" must be one of [0, 1, 2, 3]`
      );
    });

    it("should return 400 and not update user - if permissions.plants is undefined", async () => {
      delete requestBody.permissions.plants;

      await testBodyValidation(
        requestBody,
        false,
        400,
        `"permissions.plants" is required`
      );
    });

    it("should return 400 and not update user - if permissions.plants is null", async () => {
      requestBody.permissions.plants = null;

      await testBodyValidation(
        requestBody,
        false,
        400,
        `"permissions.plants" must be of type object`
      );
    });

    it("should return 400 and not update user - if permissions.plants has invalid type (string)", async () => {
      requestBody.permissions.plants = "testData";

      await testBodyValidation(
        requestBody,
        false,
        400,
        `"permissions.plants" must be of type object`
      );
    });

    it("should return 400 and not update user - if permissions.plants has invalid type (string)", async () => {
      requestBody.permissions.plants = "testData";

      await testBodyValidation(
        requestBody,
        false,
        400,
        `"permissions.plants" must be of type object`
      );
    });

    it("should return 400 and not update user - if permissions.plants is an empty object - permissions exists in config and data", async () => {
      requestBody.permissions.plants = {};

      await testBodyValidation(
        requestBody,
        false,
        400,
        `User config invalid - plantIds in config and in permissions must be identical!`
      );
    });

    it("should return 200 and not update user - if permissions.plants is an empty object - permissions does not exist in config and data", async () => {
      requestBody.data = {};
      requestBody.config = {};
      requestBody.permissions.plants = {};

      let userFilePayload =
        fileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-asset-id"
        ]["testGlobalAdmin22.user.config.json"];

      userFilePayload.data = {};
      userFilePayload.config = {};
      userFilePayload.permissions.plants = {};

      await testBodyValidation(requestBody, true, 200, null);
    });

    it("should return 400 and not update user - if permissions.plants is has one additional plant - permissions exists in config and data", async () => {
      requestBody.permissions.plants["fakePlant"] = 0;

      await testBodyValidation(
        requestBody,
        false,
        400,
        `User config invalid - plantIds in config and in permissions must be identical!`
      );
    });

    it("should return 400 and not update user - if permissions.plants is null", async () => {
      requestBody.permissions.plants["fakePlant"] = null;

      await testBodyValidation(
        requestBody,
        false,
        400,
        `"permissions.plants.fakePlant" must be one of [0, 1]`
      );
    });

    it("should return 400 and not update user - if permissions.plants has invalid type - string", async () => {
      requestBody.permissions.plants["fakePlant"] = "abcd1234";

      await testBodyValidation(
        requestBody,
        false,
        400,
        `"permissions.plants.fakePlant" must be one of [0, 1]`
      );
    });

    it("should return 400 and not update user - if permissions.plants has invalid number - float", async () => {
      requestBody.permissions.plants["fakePlant"] = 0.123;

      await testBodyValidation(
        requestBody,
        false,
        400,
        `"permissions.plants.fakePlant" must be one of [0, 1]`
      );
    });

    it("should return 400 and not update user - if permissions.plants has invalid number - below 0", async () => {
      requestBody.permissions.plants["fakePlant"] = -1;

      await testBodyValidation(
        requestBody,
        false,
        400,
        `"permissions.plants.fakePlant" must be one of [0, 1]`
      );
    });

    it("should return 400 and not update user - if permissions.plants has invalid number - above 1", async () => {
      requestBody.permissions.plants["fakePlant"] = 2;

      await testBodyValidation(
        requestBody,
        false,
        400,
        `"permissions.plants.fakePlant" must be one of [0, 1]`
      );
    });

    it("should return 400 and not update user - if role is a globalUser but permissions to plant is an admin", async () => {
      requestBody.permissions.role = UserRole.GlobalUser;
      requestBody.permissions.plants = {
        testPlant4: PlantPermissions.Admin,
        testPlant5: PlantPermissions.Admin,
        testPlant6: PlantPermissions.Admin,
      };

      await testBodyValidation(
        requestBody,
        false,
        400,
        `Users role should be a local or global admin, if they have administrative permissions for a plant!`
      );
    });

    it("should return 400 and not update user - if role is a localUser but permissions to plant is an admin", async () => {
      requestBody.permissions.role = UserRole.LocalUser;
      requestBody.permissions.plants = {
        testPlant4: PlantPermissions.Admin,
        testPlant5: PlantPermissions.Admin,
        testPlant6: PlantPermissions.Admin,
      };

      await testBodyValidation(
        requestBody,
        false,
        400,
        `Users role should be a local or global admin, if they have administrative permissions for a plant!`
      );
    });

    it("should return 400 and not update user - if user tries to change his permissions", async () => {
      requestBody.permissions.role = UserRole.LocalAdmin;

      await testBodyValidation(
        requestBody,
        false,
        400,
        `Users role cannot be modified!`
      );
    });

    it("should return 400 and not update user - if user tries to change his userName", async () => {
      requestBody.userName = "newFakeUserName@fake.email";

      await testBodyValidation(
        requestBody,
        false,
        400,
        `Users name cannot be modified!`
      );
    });

    it("should return 400 and not update user - if user tries to change his plants permissions", async () => {
      requestBody.data = {
        testPlant5: {
          testLocalAdmin22TestPlant5Data: "testLocalAdmin22TestPlant5DataValue",
        },
      };
      requestBody.config = {
        testPlant5: {
          testLocalAdmin22TestPlant5Config:
            "testLocalAdmin22TestPlant5ConfigValue",
        },
      };
      (requestBody.permissions.plants = {
        testPlant5: PlantPermissions.Admin,
      }),
        await testBodyValidation(
          requestBody,
          false,
          400,
          `Users plant permissions cannot be modified!`
        );
    });

    //#endregion ========== BODY VALIDATION =========

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should return 403 and not update user - if user's payload does not have tenant assigned", async () => {
      delete (userPayload as any).ten;

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(403);
      expect(result.text).toEqual(
        "Access denied. Invalid application id generated from user payload!"
      );

      //#endregion ===== CHECKING RESPONSE =====

      //#region  =====  CHECKING STORAGE =====

      let userStorageContent = (MindSphereAppsManager.getInstance().Apps[
        "ten-testTenant2-sub-subtenant2"
      ] as any)._userStorage._cacheData;

      //Creating expected storage of users
      let expectedStoragePayload: any = {};

      let allFilePaths = Object.keys(
        fileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-asset-id"
        ]
      );

      for (let filePath of allFilePaths) {
        if (filePath.includes(".user.config.json")) {
          let fileContent =
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-asset-id"
            ][filePath];
          let userId = filePath.replace(".user.config.json", "");
          expectedStoragePayload[userId] = fileContent;
        }
      }

      expect(userStorageContent).toEqual(expectedStoragePayload);

      //#endregion  =====  CHECKING STORAGE =====

      //#region  =====  CHECKING API CALLS =====

      //User id should not be fetched
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
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-asset-id",
        "testGlobalAdmin22.user.config.json",
      ]);

      //Set file content should not have been called
      expect(setFileContent).not.toHaveBeenCalled();

      //#endregion  =====  CHECKING API CALLS =====
    });

    it("should return 403 and not update user - if there is no application", async () => {
      userPayload.ten = "fakeTenant";

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(403);
      expect(result.text).toEqual(
        "Access denied. Application of given id not found for the user!"
      );

      //#endregion ===== CHECKING RESPONSE =====

      //#region  =====  CHECKING STORAGE =====

      let userStorageContent = (MindSphereAppsManager.getInstance().Apps[
        "ten-testTenant2-sub-subtenant2"
      ] as any)._userStorage._cacheData;

      //Creating expected storage of users
      let expectedStoragePayload: any = {};

      let allFilePaths = Object.keys(
        fileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-asset-id"
        ]
      );

      for (let filePath of allFilePaths) {
        if (filePath.includes(".user.config.json")) {
          let fileContent =
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-asset-id"
            ][filePath];
          let userId = filePath.replace(".user.config.json", "");
          expectedStoragePayload[userId] = fileContent;
        }
      }

      expect(userStorageContent).toEqual(expectedStoragePayload);

      //#endregion  =====  CHECKING STORAGE =====

      //#region  =====  CHECKING API CALLS =====

      //User id should not be fetched
      expect(getAllUsers).not.toHaveBeenCalled();

      //Checking if app exists - should be invoked only two times - during initalization and to check whether fake app exists
      expect(getAssets).toHaveBeenCalledTimes(2);
      expect(getAssets.mock.calls[1]).toEqual([
        "hostTenant",
        "ten-fakeTenant-sub-subtenant2",
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //Then users data should be fetched - invoked during initialization - 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48
      expect(getFileContent).toHaveBeenCalledTimes(48);

      //Set file content should not have been called
      expect(setFileContent).not.toHaveBeenCalled();

      //#endregion  =====  CHECKING API CALLS =====
    });

    it("should return 403 and not update user - if there is no application data for given user", async () => {
      delete fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["main.app.config.json"];

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(403);
      expect(result.text).toEqual(
        "Access denied. Main application settings not found for the user!"
      );

      //#endregion ===== CHECKING RESPONSE =====

      //#region  =====  CHECKING STORAGE =====

      let userStorageContent = (MindSphereAppsManager.getInstance().Apps[
        "ten-testTenant2-sub-subtenant2"
      ] as any)._userStorage._cacheData;

      //Creating expected storage of users
      let expectedStoragePayload: any = {};

      let allFilePaths = Object.keys(
        fileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-asset-id"
        ]
      );

      for (let filePath of allFilePaths) {
        if (filePath.includes(".user.config.json")) {
          let fileContent =
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-asset-id"
            ][filePath];
          let userId = filePath.replace(".user.config.json", "");
          expectedStoragePayload[userId] = fileContent;
        }
      }

      expect(userStorageContent).toEqual(expectedStoragePayload);

      //#endregion  =====  CHECKING STORAGE =====

      //#region  =====  CHECKING API CALLS =====

      //User id should not be fetched
      expect(getAllUsers).not.toHaveBeenCalled();

      //Checking if app exists - should be invoked only one time - during initalization
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //Then users data should be fetched - invoked during initialization - 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48 - 1 main config
      //But check file should be invoked 48 times

      expect(checkIfFileExists).toHaveBeenCalledTimes(48);
      expect(checkIfFileExists.mock.calls[47]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-asset-id",
        "main.app.config.json",
      ]);
      expect(getFileContent).toHaveBeenCalledTimes(47);

      //Set file content should not have been called
      expect(setFileContent).not.toHaveBeenCalled();

      //#endregion  =====  CHECKING API CALLS =====
    });

    it("should return 403 and not update user - if user has valid scope, exists in user service exists but does not exist in file service", async () => {
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

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(403);
      expect(result.text).toEqual(
        "Access denied. User does not exist for given app id!"
      );

      //#endregion ===== CHECKING RESPONSE =====

      //#region  =====  CHECKING STORAGE =====

      let userStorageContent = (MindSphereAppsManager.getInstance().Apps[
        "ten-testTenant2-sub-subtenant2"
      ] as any)._userStorage._cacheData;

      //Creating expected storage of users
      let expectedStoragePayload: any = {};

      let allFilePaths = Object.keys(
        fileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-asset-id"
        ]
      );

      for (let filePath of allFilePaths) {
        if (filePath.includes(".user.config.json")) {
          let fileContent =
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-asset-id"
            ][filePath];
          let userId = filePath.replace(".user.config.json", "");
          expectedStoragePayload[userId] = fileContent;
        }
      }

      expect(userStorageContent).toEqual(expectedStoragePayload);

      //#endregion  =====  CHECKING STORAGE =====

      //#region  =====  CHECKING API CALLS =====

      //User id should be fetched
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        "subtenant2",
        null,
        "test_fake_user_23@user.name",
      ]);

      //Checking if app exists - should be invoked only one time - during initalization
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //Then users data should be fetched - invoked during initialization + during checking of new user - 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48
      //But check file should be invoked 49 times + one fake user
      expect(checkIfFileExists).toHaveBeenCalledTimes(49);
      expect(checkIfFileExists.mock.calls[48]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-asset-id",
        "testFakeUser23.user.config.json",
      ]);
      expect(getFileContent).toHaveBeenCalledTimes(48);

      //Set file content should not have been called
      expect(setFileContent).not.toHaveBeenCalled();

      //#endregion  =====  CHECKING API CALLS =====
    });

    it("should return 403 and not update user - if user has valid scope, doest not exist in user service but exists in file service", async () => {
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

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(403);
      expect(result.text).toEqual(
        "Access denied. User of given name not found!"
      );

      //#endregion ===== CHECKING RESPONSE =====

      //#region  =====  CHECKING STORAGE =====

      let userStorageContent = (MindSphereAppsManager.getInstance().Apps[
        "ten-testTenant2-sub-subtenant2"
      ] as any)._userStorage._cacheData;

      //Creating expected storage of users
      let expectedStoragePayload: any = {};

      let allFilePaths = Object.keys(
        fileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-asset-id"
        ]
      );

      for (let filePath of allFilePaths) {
        if (filePath.includes(".user.config.json")) {
          let fileContent =
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-asset-id"
            ][filePath];
          let userId = filePath.replace(".user.config.json", "");
          expectedStoragePayload[userId] = fileContent;
        }
      }

      expect(userStorageContent).toEqual(expectedStoragePayload);

      //#endregion  =====  CHECKING STORAGE =====

      //#region  =====  CHECKING API CALLS =====

      //There should be an attempt to fetch users id
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        "subtenant2",
        null,
        "test_fake_user_23@user.name",
      ]);

      //Checking if app exists - should be invoked only one time - during initalization
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //Then users data should be fetched - invoked during initialization - 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48 + 1 additional user
      expect(checkIfFileExists).toHaveBeenCalledTimes(49);
      expect(getFileContent).toHaveBeenCalledTimes(49);

      //Set file content should not have been called
      expect(setFileContent).not.toHaveBeenCalled();

      //#endregion  =====  CHECKING API CALLS =====
    });

    it("should return 403 and not update user - if user has invalid scope", async () => {
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

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(403);
      expect(result.text).toEqual(
        "Forbidden access. No scope found to access the app!"
      );

      //#endregion ===== CHECKING RESPONSE =====

      //#region  =====  CHECKING STORAGE =====

      let userStorageContent = (MindSphereAppsManager.getInstance().Apps[
        "ten-testTenant2-sub-subtenant2"
      ] as any)._userStorage._cacheData;

      //Creating expected storage of users
      let expectedStoragePayload: any = {};

      let allFilePaths = Object.keys(
        fileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-asset-id"
        ]
      );

      for (let filePath of allFilePaths) {
        if (filePath.includes(".user.config.json")) {
          let fileContent =
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-asset-id"
            ][filePath];
          let userId = filePath.replace(".user.config.json", "");
          expectedStoragePayload[userId] = fileContent;
        }
      }

      expect(userStorageContent).toEqual(expectedStoragePayload);

      //#endregion  =====  CHECKING STORAGE =====

      //#region  =====  CHECKING API CALLS =====

      //User id should not be fetched
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
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-asset-id",
        "testGlobalAdmin22.user.config.json",
      ]);

      //Set file content should not have been called
      expect(setFileContent).not.toHaveBeenCalled();

      //#endregion  =====  CHECKING API CALLS =====
    });

    it("should return 403 and not update user - if user has no access to the app - invalid scope", async () => {
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

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(403);
      expect(result.text).toEqual(
        "Forbidden access. No scope found to access the app!"
      );

      //#endregion ===== CHECKING RESPONSE =====

      //#region  =====  CHECKING STORAGE =====

      let userStorageContent = (MindSphereAppsManager.getInstance().Apps[
        "ten-testTenant2-sub-subtenant2"
      ] as any)._userStorage._cacheData;

      //Creating expected storage of users
      let expectedStoragePayload: any = {};

      let allFilePaths = Object.keys(
        fileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-asset-id"
        ]
      );

      for (let filePath of allFilePaths) {
        if (filePath.includes(".user.config.json")) {
          let fileContent =
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-asset-id"
            ][filePath];
          let userId = filePath.replace(".user.config.json", "");
          expectedStoragePayload[userId] = fileContent;
        }
      }

      expect(userStorageContent).toEqual(expectedStoragePayload);

      //#endregion  =====  CHECKING STORAGE =====

      //#region  =====  CHECKING API CALLS =====

      //User id should not be fetched
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
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-asset-id",
        "testGlobalAdmin22.user.config.json",
      ]);

      //Set file content should not have been called
      expect(setFileContent).not.toHaveBeenCalled();

      //#endregion  =====  CHECKING API CALLS =====
    });

    it("should return 401 and not update user - if there is no authorization token in header", async () => {
      delete requestHeaders["authorization"];

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(401);
      expect(result.text).toEqual(
        "Access denied. No token provided to fetch the user or token is invalid!"
      );

      //#endregion ===== CHECKING RESPONSE =====

      //#region  =====  CHECKING STORAGE =====

      let userStorageContent = (MindSphereAppsManager.getInstance().Apps[
        "ten-testTenant2-sub-subtenant2"
      ] as any)._userStorage._cacheData;

      //Creating expected storage of users
      let expectedStoragePayload: any = {};

      let allFilePaths = Object.keys(
        fileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-asset-id"
        ]
      );

      for (let filePath of allFilePaths) {
        if (filePath.includes(".user.config.json")) {
          let fileContent =
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-asset-id"
            ][filePath];
          let userId = filePath.replace(".user.config.json", "");
          expectedStoragePayload[userId] = fileContent;
        }
      }

      expect(userStorageContent).toEqual(expectedStoragePayload);

      //#endregion  =====  CHECKING STORAGE =====

      //#region  =====  CHECKING API CALLS =====

      //User id should not be fetched
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
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-asset-id",
        "testGlobalAdmin22.user.config.json",
      ]);

      //Set file content should not have been called
      expect(setFileContent).not.toHaveBeenCalled();

      //#endregion  =====  CHECKING API CALLS =====
    });

    it("should return 401 - if authorization token is invalid - no bearer prefix", async () => {
      requestHeaders["authorization"] = jwt.sign(userPayload, "testPrivateKey");

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(401);
      expect(result.text).toEqual(
        "Access denied. No token provided to fetch the user or token is invalid!"
      );

      //#endregion ===== CHECKING RESPONSE =====

      //#region  =====  CHECKING STORAGE =====

      let userStorageContent = (MindSphereAppsManager.getInstance().Apps[
        "ten-testTenant2-sub-subtenant2"
      ] as any)._userStorage._cacheData;

      //Creating expected storage of users
      let expectedStoragePayload: any = {};

      let allFilePaths = Object.keys(
        fileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-asset-id"
        ]
      );

      for (let filePath of allFilePaths) {
        if (filePath.includes(".user.config.json")) {
          let fileContent =
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-asset-id"
            ][filePath];
          let userId = filePath.replace(".user.config.json", "");
          expectedStoragePayload[userId] = fileContent;
        }
      }

      expect(userStorageContent).toEqual(expectedStoragePayload);

      //#endregion  =====  CHECKING STORAGE =====

      //#region  =====  CHECKING API CALLS =====

      //User id should not be fetched
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
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-asset-id",
        "testGlobalAdmin22.user.config.json",
      ]);

      //Set file content should not have been called
      expect(setFileContent).not.toHaveBeenCalled();

      //#endregion  =====  CHECKING API CALLS =====
    });

    it("should return 401 - if authorization token is invalid - invalid token", async () => {
      requestHeaders["authorization"] =
        "Bearer thisIsTheFakeValueOfTheJWTToken";

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(401);
      expect(result.text).toEqual(
        "Access denied. No token provided to fetch the user or token is invalid!"
      );

      //#endregion ===== CHECKING RESPONSE =====

      //#region  =====  CHECKING STORAGE =====

      let userStorageContent = (MindSphereAppsManager.getInstance().Apps[
        "ten-testTenant2-sub-subtenant2"
      ] as any)._userStorage._cacheData;

      //Creating expected storage of users
      let expectedStoragePayload: any = {};

      let allFilePaths = Object.keys(
        fileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-asset-id"
        ]
      );

      for (let filePath of allFilePaths) {
        if (filePath.includes(".user.config.json")) {
          let fileContent =
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-asset-id"
            ][filePath];
          let userId = filePath.replace(".user.config.json", "");
          expectedStoragePayload[userId] = fileContent;
        }
      }

      expect(userStorageContent).toEqual(expectedStoragePayload);

      //#endregion  =====  CHECKING STORAGE =====

      //#region  =====  CHECKING API CALLS =====

      //User id should not be fetched
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
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-asset-id",
        "testGlobalAdmin22.user.config.json",
      ]);

      //Set file content should not have been called
      expect(setFileContent).not.toHaveBeenCalled();

      //#endregion  =====  CHECKING API CALLS =====
    });

    it("should return 403 - if user has valid scope to access app, but not valid permisssions in data", async () => {
      fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testGlobalAdmin22.user.config.json"].permissions.role = 123;

      //#region ===== CHECKING RESPONSE =====

      let result = await exec();
      expect(result.status).toEqual(403);
      expect(result.text).toEqual(
        "Access denied. User must be a global user or admin or local user or admin!"
      );

      //#endregion ===== CHECKING RESPONSE =====

      //#region  =====  CHECKING STORAGE =====

      let userStorageContent = (MindSphereAppsManager.getInstance().Apps[
        "ten-testTenant2-sub-subtenant2"
      ] as any)._userStorage._cacheData;

      //Creating expected storage of users
      let expectedStoragePayload: any = {};

      let allFilePaths = Object.keys(
        fileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-asset-id"
        ]
      );

      for (let filePath of allFilePaths) {
        if (filePath.includes(".user.config.json")) {
          let fileContent =
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-asset-id"
            ][filePath];
          let userId = filePath.replace(".user.config.json", "");
          expectedStoragePayload[userId] = fileContent;
        }
      }

      expect(userStorageContent).toEqual(expectedStoragePayload);

      //#endregion  =====  CHECKING STORAGE =====

      //#region  =====  CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        "subtenant2",
        null,
        "test_global_admin_22@user.name",
      ]);

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
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-asset-id",
        "testGlobalAdmin21.user.config.json",
      ]);

      //Set file content should not have been called
      expect(setFileContent).not.toHaveBeenCalled();

      //#endregion  =====  CHECKING API CALLS =====
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========

    //#region ========== MINDSPHERE SERVICE THROWS ==========

    it("should return 500 and not update user - if setFileThrows", async () => {
      setFileThrows = true;

      let result = await exec();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(500);

      expect(result.text).toEqual(`Ups.. Something fails..`);

      //#endregion ===== CHECKING RESPONSE =====

      //#region  =====  CHECKING STORAGE =====

      //User stroge content should not have changed
      let userStorageContent = (MindSphereAppsManager.getInstance().Apps[
        "ten-testTenant2-sub-subtenant2"
      ] as any)._userStorage._cacheData;

      //Creating expected storage of users
      let expectedStoragePayload: any = {};

      let allFilePaths = Object.keys(
        fileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-asset-id"
        ]
      );

      for (let filePath of allFilePaths) {
        if (filePath.includes(".user.config.json")) {
          let fileContent =
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-asset-id"
            ][filePath];
          let userId = filePath.replace(".user.config.json", "");
          expectedStoragePayload[userId] = fileContent;
        }
      }

      expect(userStorageContent).toEqual(expectedStoragePayload);

      //#endregion  =====  CHECKING STORAGE =====

      //#region  =====  CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        "subtenant2",
        null,
        "test_global_admin_22@user.name",
      ]);

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
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-asset-id",
        "testGlobalAdmin22.user.config.json",
      ]);

      //#endregion  =====  CHECKING API CALLS =====

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test set content error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    it("should return 500 and not update user - if getAllUsers throws", async () => {
      getAllUsersThrows = true;

      let result = await exec();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(500);

      expect(result.text).toEqual(`Ups.. Something fails..`);

      //#endregion ===== CHECKING RESPONSE =====

      //#region  =====  CHECKING STORAGE =====

      //User stroge content should not have changed
      let userStorageContent = (MindSphereAppsManager.getInstance().Apps[
        "ten-testTenant2-sub-subtenant2"
      ] as any)._userStorage._cacheData;

      //Creating expected storage of users
      let expectedStoragePayload: any = {};

      let allFilePaths = Object.keys(
        fileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-asset-id"
        ]
      );

      for (let filePath of allFilePaths) {
        if (filePath.includes(".user.config.json")) {
          let fileContent =
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-asset-id"
            ][filePath];
          let userId = filePath.replace(".user.config.json", "");
          expectedStoragePayload[userId] = fileContent;
        }
      }

      expect(userStorageContent).toEqual(expectedStoragePayload);

      //#endregion  =====  CHECKING STORAGE =====

      //#region  =====  CHECKING API CALLS =====

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
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-asset-id",
        "testGlobalAdmin22.user.config.json",
      ]);

      //#endregion  =====  CHECKING API CALLS =====

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test get all users error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    //#endregion ========== MINDSPHERE SERVICE THROWS ==========
  });
});

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
   * @description Method for creating response containt all users data payloads
   */
  const getAllUsersDataResponse = (appId: string, appAssetId: string) => {
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
        userId: userId,
        appId: appId,
      };
    }

    return allUsersPayload;
  };

  /**
   * @description Method for creating response contain user data payloads
   */
  const getUserDataResponse = (
    appId: string,
    appAssetId: string,
    userId: string
  ) => {
    let userPayload: any = {};

    let userStorageContent = getUsersStorageContent(appId, appAssetId);

    userPayload = {
      ...userStorageContent[userId],
      userId: userId,
      appId: appId,
    };

    return userPayload;
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

  describe("GET /global/:appId", () => {
    let requestHeaders: any;
    let userPayload: MindSphereUserJWTData;
    let appId: string;
    let getAllUsersThrows: boolean;

    beforeEach(() => {
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
    });

    let exec = async () => {
      await beforeExec();

      if (getAllUsersThrows) {
        MindSphereUserService.getInstance().getAllUsers = jest.fn(async () => {
          throw new Error("Test get all users error");
        });
      }

      return request(server)
        .get(`/customApi/config/user/global/${appId}`)
        .set(requestHeaders)
        .send();
    };

    const testGlobalUsersGet = async (
      validCall: boolean,
      responseCode: number,
      errorText: string | null,
      expectedGetAllUsersCallNumber: number = 1,
      expectedGetAssetsCallNumber: number = 1,
      expectedGetFileContentCallNumber: number = 48,
      expectedGetFileContentCallParameters: Array<any>[] = [],
      expectedFileServiceContent: any
    ) => {
      let result = await exec();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(responseCode);

      if (validCall) {
        let expectedPayload = getAllUsersDataResponse(
          appId,
          `${appId}-asset-id`
        );

        expect(result.body).toEqual(expectedPayload);
      } else {
        expect(result.text).toEqual(errorText);
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
      ] as any)._userStorage._cacheData;

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

      //#endregion  =====  CHECKING STORAGE =====
    };

    it("should return 200 and payload of all users of the app - if user is a subtenant user and global admin", async () => {
      await testGlobalUsersGet(
        true,
        200,
        null,
        1,
        1,
        48,
        undefined,
        fileServiceContent
      );
    });

    it("should return 200 and payload of all users of the app - if user is a subtenant user and global user", async () => {
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

      await testGlobalUsersGet(
        true,
        200,
        null,
        1,
        1,
        48,
        undefined,
        fileServiceContent
      );
    });

    it("should return 200 and payload of all users of the app - if user is a tenant user and global admin", async () => {
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

      await testGlobalUsersGet(
        true,
        200,
        null,
        1,
        1,
        48,
        undefined,
        fileServiceContent
      );
    });

    it("should return 200 and payload of all users of the app - if user is a tenant user and global user", async () => {
      appId = "ten-testTenant2";
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

      await testGlobalUsersGet(
        true,
        200,
        null,
        1,
        1,
        48,
        undefined,
        fileServiceContent
      );
    });

    it("should return 200 and payload of the users - together with fetching new users - if there are more users in file service that has not been fetched before", async () => {
      userServiceContent.testTenant2.testFakeUser1 = {
        active: true,
        name: {
          familyName: "testFakeUser1FamilyName",
          givenName: "testFakeUser1GivenName",
        },
        userName: "test_fake_user_1@user.name",
        emails: [
          {
            value: "testFakeUser1Email",
          },
        ],
        groups: [],
        externalId: "testFakeUser1ExternalId",
        id: "testFakeUser1",
      };

      userGroupServiceContent.testTenant2.localUserGroup.members.push({
        type: "USER",
        value: "testFakeUser1",
      });

      userGroupServiceContent.testTenant2.subtenantUserGroup.members.push({
        type: "USER",
        value: "testFakeUser1",
      });

      //#region ===== EXEC =====

      //Initializing app
      await beforeExec();

      //Setting new file service content
      let newFileServiceContent = cloneObject(fileServiceContent);
      newFileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testFakeUser1.user.config.json"] = {
        data: {
          testPlant5: {
            testFakeUser1TestPlant5Data: "testFakeUser1TestPlant5DataValue",
          },
          testPlant6: {
            testFakeUser1TestPlant6Data: "testFakeUser1TestPlant6DataValue",
          },
        },
        config: {
          testPlant5: {
            testFakeUser1TestPlant5Config: "testFakeUser1TestPlant5ConfigValue",
          },
          testPlant6: {
            testFakeUser1TestPlant6Config: "testFakeUser1TestPlant6ConfigValue",
          },
        },
        userName: "test_fake_user_1@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant5: PlantPermissions.User,
            testPlant6: PlantPermissions.User,
          },
        },
      };

      await setFileServiceContent(newFileServiceContent);

      let result = await request(server)
        .get(`/customApi/config/user/global/${appId}`)
        .set(requestHeaders)
        .send();

      //#endregion ===== EXEC =====

      let expectedPayload = getAllUsersDataResponse(
        "ten-testTenant2-sub-subtenant2",
        "ten-testTenant2-sub-subtenant2-asset-id"
      );

      expectedPayload["testFakeUser1"] = {
        ...newFileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-asset-id"
        ]["testFakeUser1.user.config.json"],
        appId: "ten-testTenant2-sub-subtenant2",
        userId: "testFakeUser1",
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

      //Then users data should be fetched - without getFileContent - invoked during initialization - 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48 + 1 - fetching new file
      expect(getFileContent).toHaveBeenCalledTimes(49);
      expect(getFileContent.mock.calls[48]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-asset-id",
        "testFakeUser1.user.config.json",
      ]);

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let storagePayload = (MindSphereAppsManager.getInstance().Apps[
        "ten-testTenant2-sub-subtenant2"
      ] as any)._userStorage._cacheData;

      let allUsersPayload: any = {};

      let userFilePaths = Object.keys(
        newFileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-asset-id"
        ]
      ).filter((filePath) => filePath.includes(".user.config.json"));

      for (let userFilePath of userFilePaths) {
        let userFileContent =
          newFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-asset-id"
          ][userFilePath];
        let userId = userFilePath.replace(".user.config.json", "");
        allUsersPayload[userId] = {
          ...userFileContent,
        };
      }

      expect(storagePayload).toEqual(allUsersPayload);

      //#endregion  =====  CHECKING STORAGE =====
    });

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

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

      await testGlobalUsersGet(
        false,
        403,
        "Access denied. User must be a global user or global admin!",
        1,
        1,
        48,
        undefined,
        fileServiceContent
      );
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

      await testGlobalUsersGet(
        false,
        403,
        "Access denied. User must be a global user or global admin!",
        1,
        1,
        48,
        undefined,
        fileServiceContent
      );
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

      await testGlobalUsersGet(
        false,
        403,
        "Access denied. User must be a global user or global admin!",
        1,
        1,
        48,
        undefined,
        fileServiceContent
      );
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

      await testGlobalUsersGet(
        false,
        403,
        "Access denied. User must be a global user or global admin!",
        1,
        1,
        48,
        undefined,
        fileServiceContent
      );
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

      await testGlobalUsersGet(
        false,
        403,
        "Access denied. User must be a global user or global admin!",
        1,
        1,
        48,
        undefined,
        fileServiceContent
      );
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

      await testGlobalUsersGet(
        false,
        403,
        "Access denied. User must be a global user or global admin!",
        1,
        1,
        48,
        undefined,
        fileServiceContent
      );
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

      await testGlobalUsersGet(
        false,
        403,
        "Access denied. User must be a global user or global admin!",
        1,
        1,
        48,
        undefined,
        fileServiceContent
      );
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

      await testGlobalUsersGet(
        false,
        403,
        "Access denied. User must be a global user or global admin!",
        1,
        1,
        48,
        undefined,
        fileServiceContent
      );
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

      await testGlobalUsersGet(
        false,
        403,
        "Access denied. User must be a global user or global admin!",
        1,
        1,
        48,
        undefined,
        fileServiceContent
      );
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

      await testGlobalUsersGet(
        false,
        403,
        "Access denied. User must be a global user or global admin!",
        1,
        1,
        48,
        undefined,
        fileServiceContent
      );
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

      await testGlobalUsersGet(
        false,
        403,
        "Access denied. No access to given application!",
        1,
        1,
        48,
        undefined,
        fileServiceContent
      );
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

      await testGlobalUsersGet(
        false,
        403,
        "Access denied. No access to given application!",
        1,
        1,
        48,
        undefined,
        fileServiceContent
      );
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

      await testGlobalUsersGet(
        false,
        403,
        "Access denied. No access to given application!",
        1,
        1,
        48,
        undefined,
        fileServiceContent
      );
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

      await testGlobalUsersGet(
        false,
        403,
        "Access denied. No access to given application!",
        1,
        1,
        48,
        undefined,
        fileServiceContent
      );
    });

    it("should return 403 - if user's payload does not have tenant assigned", async () => {
      delete (userPayload as any).ten;

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //GetAllUsers should not be called - invalid app id and blocked stright away
      await testGlobalUsersGet(
        false,
        403,
        "Access denied. Invalid application id generated from user payload!",
        0,
        1,
        48,
        undefined,
        fileServiceContent
      );
    });

    it("should return 403 - if there is no application - subtenant user", async () => {
      userPayload.ten = "fakeTenant";

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //GetAssets called twice - try to fetch new app
      await testGlobalUsersGet(
        false,
        403,
        "Access denied. Application of given id not found for the user!",
        0,
        2,
        48,
        undefined,
        fileServiceContent
      );
    });

    it("should return 403 - if there is no application data for given user - subtenant user", async () => {
      delete fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["main.app.config.json"];

      //One user file should not be fetched during initialization
      await testGlobalUsersGet(
        false,
        403,
        "Access denied. Main application settings not found for the user!",
        0,
        undefined,
        47,
        undefined,
        fileServiceContent
      );
    });

    it("should return 403 - if user has valid scope, exists in user service but does not exist in file service - subtenant user", async () => {
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

      await testGlobalUsersGet(
        false,
        403,
        "Access denied. User does not exist for given app id!",
        undefined,
        undefined,
        48,
        undefined,
        fileServiceContent
      );
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

      //GetFileContent should be called 49 times - one additional user
      await testGlobalUsersGet(
        false,
        403,
        "Access denied. User of given name not found!",
        undefined,
        undefined,
        49,
        undefined,
        fileServiceContent
      );
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

      //User should not have been fetched - checking scope first
      await testGlobalUsersGet(
        false,
        403,
        "Forbidden access. No scope found to access the app!",
        0,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
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

      //GetAssets should have been called twice - try fetching new app
      await testGlobalUsersGet(
        false,
        403,
        "Access denied. Application of given id not found for the user!",
        0,
        2,
        undefined,
        undefined,
        fileServiceContent
      );
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

      //GetFileContent should be invoked only 47 times - 1 time less due to lack of main app config file
      await testGlobalUsersGet(
        false,
        403,
        "Access denied. Main application settings not found for the user!",
        0,
        undefined,
        47,
        undefined,
        fileServiceContent
      );
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

      await testGlobalUsersGet(
        false,
        403,
        "Access denied. User does not exist for given app id!",
        undefined,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
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

      //GetFileContent should be called one more time - fetching new user data
      await testGlobalUsersGet(
        false,
        403,
        "Access denied. User of given name not found!",
        undefined,
        undefined,
        49,
        undefined,
        fileServiceContent
      );
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

      //GetAllUsers should not be called - scope invalid before fetching the app or user data
      await testGlobalUsersGet(
        false,
        403,
        "Forbidden access. No scope found to access the app!",
        0,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
    });

    it("should return 401 - if there is no authorization token in header", async () => {
      delete requestHeaders["authorization"];

      //GetAllUsers should not be called - token invalid before fetching the app or user data
      await testGlobalUsersGet(
        false,
        401,
        "Access denied. No token provided to fetch the user or token is invalid!",
        0,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
    });

    it("should return 401 - if authorization token is invalid - no bearer prefix", async () => {
      requestHeaders["authorization"] = jwt.sign(userPayload, "testPrivateKey");

      //GetAllUsers should not be called - token invalid before fetching the app or user data
      await testGlobalUsersGet(
        false,
        401,
        "Access denied. No token provided to fetch the user or token is invalid!",
        0,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
    });

    it("should return 401 - if authorization token is invalid - invalid token", async () => {
      requestHeaders["authorization"] =
        "Bearer thisIsTheFakeValueOfTheJWTToken";

      //GetAllUsers should not be called - token invalid before fetching the app or user data
      await testGlobalUsersGet(
        false,
        401,
        "Access denied. No token provided to fetch the user or token is invalid!",
        0,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========

    //#region ========== MINDSPHERE SERVICE THROWS ==========

    it("should return 500 - if getAllUsers throws", async () => {
      getAllUsersThrows = true;

      //GetAllUsers call 0 times - ovveridden with mock throw function
      await testGlobalUsersGet(
        false,
        500,
        `Ups.. Something fails..`,
        0,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test get all users error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    //#endregion ========== MINDSPHERE SERVICE THROWS ==========
  });

  describe("GET /global/:appId/:userId", () => {
    let requestHeaders: any;
    let userPayload: MindSphereUserJWTData;
    let appId: string;
    let userId: string;
    let getAllUsersThrows: boolean;

    beforeEach(() => {
      requestHeaders = {};
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalUser22";
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
        .get(`/customApi/config/user/global/${appId}/${userId}`)
        .set(requestHeaders)
        .send();
    };

    const testGlobalUserGet = async (
      validCall: boolean,
      responseCode: number,
      errorText: string | null,
      expectedGetAllUsersCallNumber: number = 1,
      expectedGetAssetsCallNumber: number = 1,
      expectedGetFileContentCallNumber: number = 48,
      expectedGetFileContentCallParameters: Array<any>[] = [],
      expectedFileServiceContent: any
    ) => {
      let result = await exec();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(responseCode);

      if (validCall) {
        let expectedPayload = getUserDataResponse(
          appId,
          `${appId}-asset-id`,
          userId
        );

        expect(result.body).toEqual(expectedPayload);
      } else {
        expect(result.text).toEqual(errorText);
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
      ] as any)._userStorage._cacheData;

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

      //#endregion  =====  CHECKING STORAGE =====
    };

    it("should return 200 and payload user of the app - if user who requests API is a subtenant user and global admin", async () => {
      await testGlobalUserGet(
        true,
        200,
        null,
        undefined,
        undefined,
        undefined,
        [["hostTenant", `${appId}-asset-id`, `${userId}.user.config.json`]],
        fileServiceContent
      );
    });

    it("should return 200 and payload user of the app - if user who requests API is a subtenant user and global user", async () => {
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

      await testGlobalUserGet(
        true,
        200,
        null,
        undefined,
        undefined,
        undefined,
        [["hostTenant", `${appId}-asset-id`, `${userId}.user.config.json`]],
        fileServiceContent
      );
    });

    it("should return 200 and payload user of the app - if user who requests API is a tenant user and global admin", async () => {
      appId = "ten-testTenant2";
      userId = "testLocalUser21";

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

      await testGlobalUserGet(
        true,
        200,
        null,
        undefined,
        undefined,
        undefined,
        [["hostTenant", `${appId}-asset-id`, `${userId}.user.config.json`]],
        fileServiceContent
      );
    });

    it("should return 200 and payload user of the app - if user who requests API is a tenant user and global user", async () => {
      userId = "testLocalUser21";
      appId = "ten-testTenant2";
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

      await testGlobalUserGet(
        true,
        200,
        null,
        undefined,
        undefined,
        undefined,
        [["hostTenant", `${appId}-asset-id`, `${userId}.user.config.json`]],
        fileServiceContent
      );
    });

    it("should return 200 and payload user of the app - if user who requests API is a global admin, user to get is a global admin", async () => {
      userId = "testGlobalAdmin22";

      await testGlobalUserGet(
        true,
        200,
        null,
        undefined,
        undefined,
        undefined,
        [["hostTenant", `${appId}-asset-id`, `${userId}.user.config.json`]],
        fileServiceContent
      );
    });

    it("should return 200 and payload user of the app - if user who requests API is a global admin, user to get is a global user", async () => {
      userId = "testGlobalUser22";

      await testGlobalUserGet(
        true,
        200,
        null,
        undefined,
        undefined,
        undefined,
        [["hostTenant", `${appId}-asset-id`, `${userId}.user.config.json`]],
        fileServiceContent
      );
    });

    it("should return 200 and payload user of the app - if user who requests API is a global admin, user to get is a local admin", async () => {
      userId = "testLocalAdmin22";

      await testGlobalUserGet(
        true,
        200,
        null,
        undefined,
        undefined,
        undefined,
        [["hostTenant", `${appId}-asset-id`, `${userId}.user.config.json`]],
        fileServiceContent
      );
    });

    it("should return 200 and payload user of the app - if user who requests API is a global admin, user to get is a local user", async () => {
      userId = "testLocalUser22";

      await testGlobalUserGet(
        true,
        200,
        null,
        undefined,
        undefined,
        undefined,
        [["hostTenant", `${appId}-asset-id`, `${userId}.user.config.json`]],
        fileServiceContent
      );
    });

    it("should return 200 and payload user of the app - if user who requests API is a global user, user to get is a global admin", async () => {
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

      userId = "testGlobalAdmin22";

      await testGlobalUserGet(
        true,
        200,
        null,
        undefined,
        undefined,
        undefined,
        [["hostTenant", `${appId}-asset-id`, `${userId}.user.config.json`]],
        fileServiceContent
      );
    });

    it("should return 200 and payload user of the app - if user who requests API is a global user, user to get is a global user", async () => {
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

      userId = "testGlobalUser22";

      await testGlobalUserGet(
        true,
        200,
        null,
        undefined,
        undefined,
        undefined,
        [["hostTenant", `${appId}-asset-id`, `${userId}.user.config.json`]],
        fileServiceContent
      );
    });

    it("should return 200 and payload user of the app - if user who requests API is a global user, user to get is a local admin", async () => {
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

      userId = "testLocalAdmin22";

      await testGlobalUserGet(
        true,
        200,
        null,
        undefined,
        undefined,
        undefined,
        [["hostTenant", `${appId}-asset-id`, `${userId}.user.config.json`]],
        fileServiceContent
      );
    });

    it("should return 200 and payload user of the app - if user who requests API is a global user, user to get is a local user", async () => {
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

      userId = "testLocalUser22";

      await testGlobalUserGet(
        true,
        200,
        null,
        undefined,
        undefined,
        undefined,
        [["hostTenant", `${appId}-asset-id`, `${userId}.user.config.json`]],
        fileServiceContent
      );
    });

    it("should return 200 and payload of the user - together with fetching new user - if user exists in storage but not in cache", async () => {
      userServiceContent.testTenant2.testFakeUser1 = {
        active: true,
        name: {
          familyName: "testFakeUser1FamilyName",
          givenName: "testFakeUser1GivenName",
        },
        userName: "test_fake_user_1@user.name",
        emails: [
          {
            value: "testFakeUser1Email",
          },
        ],
        groups: [],
        externalId: "testFakeUser1ExternalId",
        id: "testFakeUser1",
      };

      userGroupServiceContent.testTenant2.localUserGroup.members.push({
        type: "USER",
        value: "testFakeUser1",
      });

      userGroupServiceContent.testTenant2.subtenantUserGroup.members.push({
        type: "USER",
        value: "testFakeUser1",
      });

      //Initializing app
      await beforeExec();

      //Setting new file service content
      let newFileServiceContent = cloneObject(fileServiceContent);
      newFileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["testFakeUser1.user.config.json"] = {
        data: {
          testPlant5: {
            testFakeUser1TestPlant5Data: "testFakeUser1TestPlant5DataValue",
          },
          testPlant6: {
            testFakeUser1TestPlant6Data: "testFakeUser1TestPlant6DataValue",
          },
        },
        config: {
          testPlant5: {
            testFakeUser1TestPlant5Config: "testFakeUser1TestPlant5ConfigValue",
          },
          testPlant6: {
            testFakeUser1TestPlant6Config: "testFakeUser1TestPlant6ConfigValue",
          },
        },
        userName: "test_fake_user_1@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant5: PlantPermissions.User,
            testPlant6: PlantPermissions.User,
          },
        },
      };

      userId = "testFakeUser1";

      await setFileServiceContent(newFileServiceContent);

      let result = await request(server)
        .get(`/customApi/config/user/global/${appId}/${userId}`)
        .set(requestHeaders)
        .send();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(200);

      let expectedPayload = {
        ...newFileServiceContent["hostTenant"][`${appId}-asset-id`][
          `${userId}.user.config.json`
        ],
        appId: appId,
        userId: userId,
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

      //Then users data should be fetched - without getFileContent - invoked during initialization - 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48 + 1 - fetching new file
      expect(getFileContent).toHaveBeenCalledTimes(49);
      expect(getFileContent.mock.calls[48]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-asset-id",
        "testFakeUser1.user.config.json",
      ]);

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let storagePayload = (MindSphereAppsManager.getInstance().Apps[
        "ten-testTenant2-sub-subtenant2"
      ] as any)._userStorage._cacheData;

      let allUsersPayload: any = {};

      let userFilePaths = Object.keys(
        newFileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-asset-id"
        ]
      ).filter((filePath) => filePath.includes(".user.config.json"));

      for (let userFilePath of userFilePaths) {
        let userFileContent =
          newFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-asset-id"
          ][userFilePath];
        let userId = userFilePath.replace(".user.config.json", "");
        allUsersPayload[userId] = {
          ...userFileContent,
        };
      }

      expect(storagePayload).toEqual(allUsersPayload);

      //#endregion  =====  CHECKING STORAGE =====
    });

    it("should return 200 - eve if user exists in storage and cache but not exists in tenant", async () => {
      delete userServiceContent["testTenant2"][userId];

      await testGlobalUserGet(
        true,
        200,
        null,
        undefined,
        undefined,
        undefined,
        [["hostTenant", `${appId}-asset-id`, `${userId}.user.config.json`]],
        fileServiceContent
      );
    });

    it("should return 404 - if there is no user of given id", async () => {
      userId = "fakeId";

      await testGlobalUserGet(
        false,
        404,
        "User not found!",
        undefined,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
    });
    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

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

      await testGlobalUserGet(
        false,
        403,
        "Access denied. User must be a global user or global admin!",
        undefined,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
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

      await testGlobalUserGet(
        false,
        403,
        "Access denied. User must be a global user or global admin!",
        undefined,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
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

      await testGlobalUserGet(
        false,
        403,
        "Access denied. User must be a global user or global admin!",
        undefined,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
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

      //GetAllUsers should not have been called - checking scope before
      await testGlobalUserGet(
        false,
        403,
        "Access denied. User must be a global user or global admin!",
        undefined,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
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

      //GetAllUsers should not have been called - checking scope before
      await testGlobalUserGet(
        false,
        403,
        "Access denied. User must be a global user or global admin!",
        undefined,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
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

      //GetAllUsers should not have been called - checking scope before
      await testGlobalUserGet(
        false,
        403,
        "Access denied. User must be a global user or global admin!",
        undefined,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
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

      //GetAllUsers should not have been called - checking scope before
      await testGlobalUserGet(
        false,
        403,
        "Access denied. User must be a global user or global admin!",
        undefined,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
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

      //GetAllUsers should not have been called - checking scope before
      await testGlobalUserGet(
        false,
        403,
        "Access denied. User must be a global user or global admin!",
        undefined,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
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

      //GetAllUsers should not have been called - checking scope before
      await testGlobalUserGet(
        false,
        403,
        "Access denied. User must be a global user or global admin!",
        undefined,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
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

      //GetAllUsers should not have been called - checking scope before
      await testGlobalUserGet(
        false,
        403,
        "Access denied. User must be a global user or global admin!",
        undefined,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
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

      //GetAllUsers should not have been called - checking scope before
      await testGlobalUserGet(
        false,
        403,
        "Access denied. User must be a global user or global admin!",
        undefined,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
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

      await testGlobalUserGet(
        false,
        403,
        "Access denied. No access to given application!",
        undefined,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
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

      await testGlobalUserGet(
        false,
        403,
        "Access denied. No access to given application!",
        undefined,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
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

      await testGlobalUserGet(
        false,
        403,
        "Access denied. No access to given application!",
        undefined,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
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

      await testGlobalUserGet(
        false,
        403,
        "Access denied. No access to given application!",
        undefined,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
    });

    it("should return 403 - if user's payload does not have tenant assigned", async () => {
      delete (userPayload as any).ten;

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //GetAllUsers should not have been called - checking app before
      await testGlobalUserGet(
        false,
        403,
        "Access denied. Invalid application id generated from user payload!",
        0,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
    });

    it("should return 403 - if there is no application - subtenant user", async () => {
      userPayload.ten = "fakeTenant";

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //GetAllUsers should not have been called - checking app before
      //GetAssets called twice - try to fetch fake app
      await testGlobalUserGet(
        false,
        403,
        "Access denied. Application of given id not found for the user!",
        0,
        2,
        undefined,
        undefined,
        fileServiceContent
      );
    });

    it("should return 403 - if there is no application data for given user - subtenant user", async () => {
      delete fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["main.app.config.json"];

      //GetAllUsers should not have been called - checking app before
      //GetFileContent invoked only 47 times - no main config file for one of the apps
      await testGlobalUserGet(
        false,
        403,
        "Access denied. Main application settings not found for the user!",
        0,
        undefined,
        47,
        undefined,
        fileServiceContent
      );
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

      await testGlobalUserGet(
        false,
        403,
        "Access denied. User does not exist for given app id!",
        undefined,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
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

      //GetFileContent call 49 times - additional user's data
      await testGlobalUserGet(
        false,
        403,
        "Access denied. User of given name not found!",
        undefined,
        undefined,
        49,
        undefined,
        fileServiceContent
      );
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

      //GetAllUsers should not have been called - checking scope before
      await testGlobalUserGet(
        false,
        403,
        "Forbidden access. No scope found to access the app!",
        0,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
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

      //GetAllUsers should not have been called - checking app before
      //GetAssets called 2 times - try to fetch not existing app
      await testGlobalUserGet(
        false,
        403,
        "Access denied. Application of given id not found for the user!",
        0,
        2,
        undefined,
        undefined,
        fileServiceContent
      );
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

      //GetAllUsers should not have been called - checking app before
      //GetFileContent called 47 times - lack of one file, app config file
      await testGlobalUserGet(
        false,
        403,
        "Access denied. Main application settings not found for the user!",
        0,
        undefined,
        47,
        undefined,
        fileServiceContent
      );
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

      //GetFileContent called 49 times - one additional user data
      await testGlobalUserGet(
        false,
        403,
        "Access denied. User of given name not found!",
        undefined,
        undefined,
        49,
        undefined,
        fileServiceContent
      );
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

      //GetAllUsers called 0 times - first check the users scope
      await testGlobalUserGet(
        false,
        403,
        "Forbidden access. No scope found to access the app!",
        0,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
    });

    it("should return 401 - if there is no authorization token in header", async () => {
      delete requestHeaders["authorization"];

      //GetAllUsers called 0 times - first check token
      await testGlobalUserGet(
        false,
        401,
        "Access denied. No token provided to fetch the user or token is invalid!",
        0,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
    });

    it("should return 401 - if authorization token is invalid - no bearer prefix", async () => {
      requestHeaders["authorization"] = jwt.sign(userPayload, "testPrivateKey");

      //GetAllUsers called 0 times - first check token
      await testGlobalUserGet(
        false,
        401,
        "Access denied. No token provided to fetch the user or token is invalid!",
        0,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
    });

    it("should return 401 - if authorization token is invalid - invalid token", async () => {
      requestHeaders["authorization"] =
        "Bearer thisIsTheFakeValueOfTheJWTToken";

      //GetAllUsers called 0 times - first check token
      await testGlobalUserGet(
        false,
        401,
        "Access denied. No token provided to fetch the user or token is invalid!",
        0,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========

    //#region ========== MINDSPHERE SERVICE THROWS ==========

    it("should return 500 - if getAllUsers throws", async () => {
      getAllUsersThrows = true;

      //GetAllUsers called 0 times - first check token
      await testGlobalUserGet(
        false,
        500,
        `Ups.. Something fails..`,
        0,
        undefined,
        undefined,
        undefined,
        fileServiceContent
      );

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test get all users error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    //#endregion ========== MINDSPHERE SERVICE THROWS ==========
  });

  describe("POST /global/:appId", () => {
    let requestBody: any;
    let requestHeaders: any;
    let userPayload: MindSphereUserJWTData;
    let appId: string;
    let getAllUsersThrows: boolean;
    let setFileContentThrows: boolean;
    let createUserThrows: boolean;

    beforeEach(() => {
      requestHeaders = {};
      requestBody = {
        data: {
          testPlant4: {
            testFakeUser1TestPlant4Data: "testFakeUser1TestPlant4DataValue",
          },
          testPlant5: {
            testFakeUser1TestPlant5Data: "testFakeUser1TestPlant5DataValue",
          },
          testPlant6: {
            testFakeUser1TestPlant6Data: "testFakeUser1TestPlant6DataValue",
          },
        },
        config: {
          testPlant4: {
            testFakeUser1TestPlant4Config: "testFakeUser1TestPlant4ConfigValue",
          },
          testPlant5: {
            testFakeUser1TestPlant5Config: "testFakeUser1TestPlant5ConfigValue",
          },
          testPlant6: {
            testFakeUser1TestPlant6Config: "testFakeUser1TestPlant6ConfigValue",
          },
        },
        userName: "test_fake_user_1@user.name",
        permissions: {
          role: UserRole.GlobalAdmin,
          plants: {
            testPlant4: PlantPermissions.Admin,
            testPlant5: PlantPermissions.Admin,
            testPlant6: PlantPermissions.User,
          },
        },
      };
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
      setFileContentThrows = false;
      createUserThrows = false;
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
        .post(`/customApi/config/user/global/${appId}`)
        .set(requestHeaders)
        .send(requestBody);
    };

    const testGlobalUserCreation = async (
      validCall: boolean,
      responseCode: number,
      expectedAssignedUserGroupIds: string[] | null,
      errorText: string | null,
      expectedGetAllUsersCallNumber: number = 1,
      expectedGetAssetsCallNumber: number = 1,
      expectedGetFileContentCallNumber: number = 48,
      expectedCreateUserCallNumber: number = 1,
      expectedAddUserToGroupCallNumber: number = 2,
      expectedSetFileContentCallNumber: number = 1
    ) => {
      let result = await exec();

      if (validCall) {
        //#region ===== CHECKING RESPONSE =====

        expect(result.status).toEqual(200);

        //Id of the user should be generated automatically
        expect(result.body.userId).toBeDefined();
        let userId = result.body.userId;

        let expectedPayload = {
          ...requestBody,
          appId: appId,
          userId: userId,
        };

        expect(result.body).toEqual(expectedPayload);

        let appTenant = userPayload.ten;
        let appSubtenant =
          userPayload.subtenant != null ? userPayload.subtenant : null;
        let appAssetId = `${appId}-asset-id`;

        //#endregion ===== CHECKING RESPONSE =====

        //#region ===== CHECKING API CALLS =====

        //User id should be fetched - via getAllUsers with proper filtering
        expect(getAllUsers).toHaveBeenCalledTimes(
          expectedGetAllUsersCallNumber
        );
        if (expectedGetAllUsersCallNumber > 0) {
          expect(getAllUsers.mock.calls[0]).toEqual([
            appTenant,
            appSubtenant,
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

        //User should be created in MindSphere
        expect(createUser).toHaveBeenCalledTimes(expectedCreateUserCallNumber);
        if (expectedCreateUserCallNumber > 0) {
          let expectedCreationPayload: any = {
            active: true,
            name: {},
            userName: requestBody.userName,
          };

          if (appSubtenant != null)
            expectedCreationPayload.subtenants = [
              {
                id: appSubtenant,
              },
            ];

          //User should be created
          expect(createUser.mock.calls[0]).toEqual([
            appTenant,
            expectedCreationPayload,
          ]);
        }

        //User should be assigned to propert groups
        expect(addUserToGroup).toHaveBeenCalledTimes(
          expectedAddUserToGroupCallNumber
        );
        if (expectedAddUserToGroupCallNumber > 0) {
          //Every expected group should be assigned to user
          for (let groupId of expectedAssignedUserGroupIds!) {
            expect(addUserToGroup.mock.calls).toContainEqual([
              appTenant,
              groupId,
              userId,
            ]);
          }
        }

        //User should be created in File Content
        expect(setFileContent).toHaveBeenCalledTimes(
          expectedSetFileContentCallNumber
        );
        if (expectedSetFileContentCallNumber > 0) {
          expect(setFileContent.mock.calls[0]).toEqual([
            "hostTenant",
            appAssetId,
            `${userId}.user.config.json`,
            requestBody,
          ]);
        }

        //#endregion ===== CHECKING API CALLS =====

        //#region  =====  CHECKING STORAGE =====

        let appInstance = MindSphereAppsManager.getInstance().Apps[appId];

        let storagePayload = (appInstance as any)._userStorage._cacheData;

        let expectedStorageContent = getUsersStorageContent(appId, appAssetId);
        expectedStorageContent[userId] = requestBody;

        expect(storagePayload).toEqual(expectedStorageContent);

        //User should be accessible now via getUser
        let userData = await appInstance.getUser(userId);

        let expectedStorageData = requestBody;
        expect(userData.storageData).toEqual(expectedStorageData);

        let expectedMsData: any = {
          active: true,
          name: {},
          userName: requestBody.userName,
          groups: expectedAssignedUserGroupIds!.map((groupId) => {
            return {
              display: `${groupId}DisplayName`,
              type: "DIRECT",
              value: groupId,
            };
          }),
          id: userId,
        };

        //Adding subtenant to paylod if exists for the app
        if (appSubtenant != null)
          expectedMsData.subtenants = [
            {
              id: appSubtenant,
            },
          ];

        expect(userData.msData).toEqual(expectedMsData);

        //#endregion  =====  CHECKING STORAGE =====
      } else {
        //#region ===== CHECKING RESPONSE =====

        expect(result.status).toEqual(responseCode);
        expect(result.text).toEqual(errorText);

        //#endregion ===== CHECKING RESPONSE =====

        //#region  =====  CHECKING STORAGE =====

        let appToCheckStorage = MindSphereAppsManager.getInstance().Apps[
          appId
        ] as any;

        //Checking storage for the app only if the app exists
        if (appToCheckStorage != null) {
          //Storage should not have changed
          let userStorageContent = appToCheckStorage._userStorage._cacheData;

          //Creating expected storage of users
          let expectedStoragePayload = getUsersStorageContent(
            appId,
            `${appId}-asset-id`
          );

          expect(userStorageContent).toEqual(expectedStoragePayload);
        }

        //#endregion  =====  CHECKING STORAGE =====

        //#region  =====  CHECKING API CALLS =====

        //User id should be fetched - via getAllUsers with proper filtering
        expect(getAllUsers).toHaveBeenCalledTimes(
          expectedGetAllUsersCallNumber
        );
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

        //User should be created in MindSphere
        expect(createUser).toHaveBeenCalledTimes(expectedCreateUserCallNumber);
        if (expectedCreateUserCallNumber > 0) {
          let expectedCreationPayload: any = {
            active: true,
            name: {},
            userName: requestBody.userName,
          };

          if (userPayload.subtenant != null)
            expectedCreationPayload.subtenants = [
              {
                id: userPayload.subtenant,
              },
            ];

          //User should be created
          expect(createUser.mock.calls[0]).toEqual([
            userPayload.ten,
            expectedCreationPayload,
          ]);
        }

        //User should be assigned to propert groups
        expect(addUserToGroup).toHaveBeenCalledTimes(
          expectedAddUserToGroupCallNumber
        );
        if (expectedAddUserToGroupCallNumber > 0) {
          let userId = (await createUser.mock.results[0].value).id;
          //Every expected group should be assigned to user
          for (let groupId of expectedAssignedUserGroupIds!) {
            expect(addUserToGroup.mock.calls).toContainEqual([
              userPayload.ten,
              groupId,
              userId,
            ]);
          }
        }

        //User should be created in File Content
        expect(setFileContent).toHaveBeenCalledTimes(
          expectedSetFileContentCallNumber
        );
        if (expectedSetFileContentCallNumber > 0) {
          let userId = (await createUser.mock.results[0].value).id;
          expect(setFileContent.mock.calls[0]).toEqual([
            "hostTenant",
            `${appId}-asset-id`,
            `${userId}.user.config.json`,
            requestBody,
          ]);
        }

        //#endregion  =====  CHECKING API CALLS =====
      }
    };

    it("should create user in MindSphere and in storage and return 200 with a payload of created user - user to create is a global admin, app is subtenant", async () => {
      requestBody.permissions = {
        role: UserRole.GlobalAdmin,
        plants: {
          testPlant4: PlantPermissions.User,
          testPlant5: PlantPermissions.User,
          testPlant6: PlantPermissions.User,
        },
      };

      await testGlobalUserCreation(
        true,
        200,
        ["globalAdminGroup", "subtenantUserGroup"],
        null
      );
    });

    it("should create user in MindSphere and in storage and return 200 with a payload of created user - user to create is a global user, app is subtenant", async () => {
      requestBody.permissions = {
        role: UserRole.GlobalUser,
        plants: {
          testPlant4: PlantPermissions.User,
          testPlant5: PlantPermissions.User,
          testPlant6: PlantPermissions.User,
        },
      };

      await testGlobalUserCreation(
        true,
        200,
        ["globalUserGroup", "subtenantUserGroup"],
        null
      );
    });

    it("should create user in MindSphere and in storage and return 200 with a payload of created user - user to create is a local admin, app is subtenant", async () => {
      requestBody.permissions = {
        role: UserRole.LocalAdmin,
        plants: {
          testPlant4: PlantPermissions.Admin,
          testPlant5: PlantPermissions.Admin,
          testPlant6: PlantPermissions.User,
        },
      };

      await testGlobalUserCreation(
        true,
        200,
        ["localAdminGroup", "subtenantUserGroup"],
        null
      );
    });

    it("should create user in MindSphere and in storage and return 200 with a payload of created user - user to create is a local user, app is subtenant", async () => {
      requestBody.permissions = {
        role: UserRole.LocalUser,
        plants: {
          testPlant4: PlantPermissions.User,
          testPlant5: PlantPermissions.User,
          testPlant6: PlantPermissions.User,
        },
      };

      await testGlobalUserCreation(
        true,
        200,
        ["localUserGroup", "subtenantUserGroup"],
        null
      );
    });

    it("should create user in MindSphere and in storage and return 200 with a payload of created user - user to create is a global admin, app is tenant", async () => {
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

      requestBody.permissions = {
        role: UserRole.GlobalAdmin,
        plants: {
          testPlant4: PlantPermissions.Admin,
          testPlant5: PlantPermissions.Admin,
          testPlant6: PlantPermissions.User,
        },
      };

      await testGlobalUserCreation(
        true,
        200,
        ["globalAdminGroup", "standardUserGroup"],
        null
      );
    });

    it("should create user in MindSphere and in storage and return 200 with a payload of created user - user to create is a global user, app is tenant", async () => {
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

      requestBody.permissions = {
        role: UserRole.GlobalUser,
        plants: {
          testPlant4: PlantPermissions.User,
          testPlant5: PlantPermissions.User,
          testPlant6: PlantPermissions.User,
        },
      };

      await testGlobalUserCreation(
        true,
        200,
        ["globalUserGroup", "standardUserGroup"],
        null
      );
    });

    it("should create user in MindSphere and in storage and return 200 with a payload of created user - user to create is a local admin, app is tenant", async () => {
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

      requestBody.permissions = {
        role: UserRole.LocalAdmin,
        plants: {
          testPlant4: PlantPermissions.Admin,
          testPlant5: PlantPermissions.Admin,
          testPlant6: PlantPermissions.User,
        },
      };

      await testGlobalUserCreation(
        true,
        200,
        ["localAdminGroup", "standardUserGroup"],
        null
      );
    });

    it("should create user in MindSphere and in storage and return 200 with a payload of created user - user to create is a local user, app is tenant", async () => {
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

      requestBody.permissions = {
        role: UserRole.LocalUser,
        plants: {
          testPlant4: PlantPermissions.User,
          testPlant5: PlantPermissions.User,
          testPlant6: PlantPermissions.User,
        },
      };

      await testGlobalUserCreation(
        true,
        200,
        ["localUserGroup", "standardUserGroup"],
        null
      );
    });

    it("should return 400 - if user of given username already exists for the same app", async () => {
      requestBody.userName = "test_local_user_22@user.name";

      await testGlobalUserCreation(
        false,
        400,
        null,
        `User of user name: test_local_user_22@user.name - already exists!`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 - if user of given username doesn't exist for the same app but exists for the same tenant", async () => {
      requestBody.userName = "test_local_user_21@user.name";

      await testGlobalUserCreation(
        false,
        400,
        null,
        `User of user name: test_local_user_21@user.name - already exists!`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create user - if there is a limit in user creation for the app, and number of users exceeds the limit", async () => {
      fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["main.app.config.json"].maxNumberOfUsers = 4;

      await testGlobalUserCreation(
        false,
        400,
        null,
        `Max number of users: 4 reached`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 200 and create user - if there is no limit in user creation for the app", async () => {
      fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["main.app.config.json"].maxNumberOfUsers = null;

      await testGlobalUserCreation(
        true,
        200,
        ["globalAdminGroup", "subtenantUserGroup"],
        null
      );
    });

    it("should return 200 and create the user - if user of given username exists for different tenant", async () => {
      requestBody.userName = "test_local_user_11@user.name";

      await testGlobalUserCreation(
        true,
        200,
        ["globalAdminGroup", "subtenantUserGroup"],
        null
      );
    });

    //#region ========== BODY VALIDATION =========

    it("should return 400 - if request is not a valid JSON", async () => {
      requestBody = "fakeBody";

      await beforeExec();

      let result = await request(server)
        .post(`/customApi/config/user/global/${appId}`)
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

      //Create user should not have been called
      expect(createUser).not.toHaveBeenCalled();

      //Add user to group should not have been called
      expect(addUserToGroup).not.toHaveBeenCalled();

      //#endregion  =====  CHECKING API CALLS =====
    });

    it("should return 400 and not create new user - if there is an attempt to create user with user id", async () => {
      requestBody.userId = "fakeUserId";

      await testGlobalUserCreation(
        false,
        400,
        null,
        `"userId" is not allowed`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if there is an attempt to create user with app id", async () => {
      requestBody.appId = "fakeAppId";

      await testGlobalUserCreation(
        false,
        400,
        null,
        `"appId" is not allowed`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if userName is not defined", async () => {
      delete requestBody.userName;

      await testGlobalUserCreation(
        false,
        400,
        null,
        `"userName" is required`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if userName is null", async () => {
      requestBody.userName = null;

      await testGlobalUserCreation(
        false,
        400,
        null,
        `"userName" must be a string`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if userName has invalid type (number)", async () => {
      requestBody.userName = 1234;

      await testGlobalUserCreation(
        false,
        400,
        null,
        `"userName" must be a string`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if userName is invalid email", async () => {
      requestBody.userName = "fakeEmailValue";

      await testGlobalUserCreation(
        false,
        400,
        null,
        `"userName" must be a valid email`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if data is undefined", async () => {
      delete requestBody.data;

      await testGlobalUserCreation(
        false,
        400,
        null,
        `"data" is required`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if data is null", async () => {
      requestBody.data = null;

      await testGlobalUserCreation(
        false,
        400,
        null,
        `"data" must be of type object`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if data has invalid type (string)", async () => {
      requestBody.data = "testData";

      await testGlobalUserCreation(
        false,
        400,
        null,
        `"data" must be of type object`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if data is an empty object - permissions of plants exist", async () => {
      requestBody.data = {};

      await testGlobalUserCreation(
        false,
        400,
        null,
        `User data invalid - plantIds in data and in permissions must be identical!`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 200 and create new user - if data is an empty object - permissions of plants don't exist", async () => {
      requestBody.data = {};
      requestBody.config = {};
      requestBody.permissions.plants = {};

      await testGlobalUserCreation(
        true,
        200,
        ["globalAdminGroup", "subtenantUserGroup"],
        null
      );
    });

    it("should return 200 and create new user - if data has nested properties ", async () => {
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

      await testGlobalUserCreation(
        true,
        200,
        ["globalAdminGroup", "subtenantUserGroup"],
        null
      );
    });

    it("should return 400 and not create new user - if data is not an empty object - permissions of plants don't exist", async () => {
      requestBody.config = {};
      requestBody.permissions.plants = {};

      await testGlobalUserCreation(
        false,
        400,
        null,

        `User data invalid - plantIds in data and in permissions must be identical!`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if data has additional plant id", async () => {
      requestBody.data["fakePlantId"] = { test: 1234 };

      await testGlobalUserCreation(
        false,
        400,
        null,
        `User data invalid - plantIds in data and in permissions must be identical!`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if config is undefined", async () => {
      delete requestBody.config;

      await testGlobalUserCreation(
        false,
        400,
        null,
        `"config" is required`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if config is null", async () => {
      requestBody.config = null;

      await testGlobalUserCreation(
        false,
        400,
        null,
        `"config" must be of type object`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if config has invalid type (string)", async () => {
      requestBody.config = "testData";

      await testGlobalUserCreation(
        false,
        400,
        null,
        `"config" must be of type object`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if config is an empty object - permissions of plants exist", async () => {
      requestBody.config = {};

      await testGlobalUserCreation(
        false,
        400,
        null,
        `User config invalid - plantIds in config and in permissions must be identical!`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 200 and not create new user - if config is an empty object - permissions of plants don't exist", async () => {
      requestBody.data = {};
      requestBody.config = {};
      requestBody.permissions.plants = {};

      await testGlobalUserCreation(
        true,
        200,
        ["globalAdminGroup", "subtenantUserGroup"],
        null
      );
    });

    it("should return 200 and not create new user - if config has nested properties ", async () => {
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

      await testGlobalUserCreation(
        true,
        200,
        ["globalAdminGroup", "subtenantUserGroup"],
        null
      );
    });

    it("should return 400 and not create new user - if config is not an empty object - permissions of plants don't exist", async () => {
      requestBody.data = {};
      requestBody.permissions.plants = {};

      await testGlobalUserCreation(
        false,
        400,
        null,
        `User config invalid - plantIds in config and in permissions must be identical!`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if config has additional plant id", async () => {
      requestBody.config["fakePlantId"] = { test: 1234 };

      await testGlobalUserCreation(
        false,
        400,
        null,
        `User config invalid - plantIds in config and in permissions must be identical!`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if permissions is undefined", async () => {
      delete requestBody.permissions;

      await testGlobalUserCreation(
        false,
        400,
        null,
        `"permissions" is required`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if permissions is null", async () => {
      requestBody.permissions = null;

      await testGlobalUserCreation(
        false,
        400,
        null,
        `"permissions" must be of type object`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if permissions has invalid type (string)", async () => {
      requestBody.permissions = "testData";

      await testGlobalUserCreation(
        false,
        400,
        null,
        `"permissions" must be of type object`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if permissions.role is undefined", async () => {
      delete requestBody.permissions.role;

      await testGlobalUserCreation(
        false,
        400,
        null,
        `"permissions.role" is required`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if permissions.role is null", async () => {
      requestBody.permissions.role = null;

      await testGlobalUserCreation(
        false,
        400,
        null,
        `"permissions.role" must be one of [0, 1, 2, 3]`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if permissions.role has invalid type (string)", async () => {
      requestBody.permissions.role = "testData";

      await testGlobalUserCreation(
        false,
        400,
        null,
        `"permissions.role" must be one of [0, 1, 2, 3]`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if permissions.role has invalid value", async () => {
      requestBody.permissions.role = 5;

      await testGlobalUserCreation(
        false,
        400,
        null,
        `"permissions.role" must be one of [0, 1, 2, 3]`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if permissions.plants is undefined", async () => {
      delete requestBody.permissions.plants;

      await testGlobalUserCreation(
        false,
        400,
        null,
        `"permissions.plants" is required`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if permissions.plants is null", async () => {
      requestBody.permissions.plants = null;

      await testGlobalUserCreation(
        false,
        400,
        null,
        `"permissions.plants" must be of type object`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if permissions.plants has invalid type (string)", async () => {
      requestBody.permissions.plants = "testData";

      await testGlobalUserCreation(
        false,
        400,
        null,
        `"permissions.plants" must be of type object`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if permissions.plants is an empty object - permissions exists in config and data", async () => {
      requestBody.permissions.plants = {};

      await testGlobalUserCreation(
        false,
        400,
        null,
        `User config invalid - plantIds in config and in permissions must be identical!`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 200 and not create new user - if permissions.plants is an empty object - permissions does not exist in config and data", async () => {
      requestBody.data = {};
      requestBody.config = {};
      requestBody.permissions.plants = {};

      await testGlobalUserCreation(
        true,
        200,
        ["globalAdminGroup", "subtenantUserGroup"],
        null
      );
    });

    it("should return 400 and not create new user - if permissions.plants has one additional plant - permissions exists in config and data", async () => {
      requestBody.permissions.plants["fakePlant"] = 0;

      await testGlobalUserCreation(
        false,
        400,
        null,
        `User config invalid - plantIds in config and in permissions must be identical!`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if permissions.plants of one plant is null", async () => {
      requestBody.permissions.plants["fakePlant"] = null;

      await testGlobalUserCreation(
        false,
        400,
        null,
        `"permissions.plants.fakePlant" must be one of [0, 1]`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if permissions.plants of one plant has invalid type - string", async () => {
      requestBody.permissions.plants["fakePlant"] = "abcd1234";

      await testGlobalUserCreation(
        false,
        400,
        null,
        `"permissions.plants.fakePlant" must be one of [0, 1]`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if permissions.plants of one plant has invalid number - float", async () => {
      requestBody.permissions.plants["fakePlant"] = 0.123;

      await testGlobalUserCreation(
        false,
        400,
        null,
        `"permissions.plants.fakePlant" must be one of [0, 1]`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if permissions.plants of one plant has invalid number - below 0", async () => {
      requestBody.permissions.plants["fakePlant"] = -1;

      await testGlobalUserCreation(
        false,
        400,
        null,
        `"permissions.plants.fakePlant" must be one of [0, 1]`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if permissions.plants of one plant has invalid number - above 1", async () => {
      requestBody.permissions.plants["fakePlant"] = 2;

      await testGlobalUserCreation(
        false,
        400,
        null,
        `"permissions.plants.fakePlant" must be one of [0, 1]`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if role is a globalUser but permissions to plant is an admin", async () => {
      requestBody.permissions.role = UserRole.GlobalUser;
      requestBody.permissions.plants = {
        testPlant4: PlantPermissions.Admin,
        testPlant5: PlantPermissions.Admin,
        testPlant6: PlantPermissions.Admin,
      };

      await testGlobalUserCreation(
        false,
        400,
        null,
        `Users role should be a local or global admin, if they have administrative permissions for a plant!`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 400 and not create new user - if role is a localUser but permissions to plant is an admin", async () => {
      requestBody.permissions.role = UserRole.LocalUser;
      requestBody.permissions.plants = {
        testPlant4: PlantPermissions.Admin,
        testPlant5: PlantPermissions.Admin,
        testPlant6: PlantPermissions.Admin,
      };

      await testGlobalUserCreation(
        false,
        400,
        null,
        `Users role should be a local or global admin, if they have administrative permissions for a plant!`,
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    //#endregion ========== BODY VALIDATION =========

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should return 403 and not create user - if global user attempts to create user", async () => {
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

      //GetAllUsers should be called - fetching users data
      await testGlobalUserCreation(
        false,
        403,
        null,
        "Access denied. User must be a global admin!",
        1,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 403 and not create user - if local admin attempts to create user", async () => {
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

      //GetAllUsers should be called - fetching users data
      await testGlobalUserCreation(
        false,
        403,
        null,
        "Access denied. User must be a global admin!",
        1,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 403 and not create user - if local user attempts to create user", async () => {
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

      //GetAllUsers should be called - fetching users data
      await testGlobalUserCreation(
        false,
        403,
        null,
        "Access denied. User must be a global admin!",
        1,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 403 and not create user - if user's jwt payload does not have tenant assigned", async () => {
      delete (userPayload as any).ten;

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      await testGlobalUserCreation(
        false,
        403,
        null,
        "Access denied. Invalid application id generated from user payload!",
        0,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 403 and not create user - if there is no application of given id", async () => {
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

      //2 x GetAssets call - try fetching new app
      await testGlobalUserCreation(
        false,
        403,
        null,
        "Access denied. Application of given id not found for the user!",
        0,
        2,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 403 and not create user - if app id in user's payload and param differs", async () => {
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

      await testGlobalUserCreation(
        false,
        403,
        null,
        "Access denied. No access to given application!",
        1,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 403 and not create user - if there is no application data for given app", async () => {
      delete fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["main.app.config.json"];

      await testGlobalUserCreation(
        false,
        403,
        null,
        "Access denied. Main application settings not found for the user!",
        0,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 403 and not create user - if user has valid scope, doest not exist in user service but exists in file service", async () => {
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

      //GetAllUsers should be caled - try fetching user's data
      await testGlobalUserCreation(
        false,
        403,
        null,
        "Access denied. User of given name not found!",
        1,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 403 and not create user - if user has valid scope, exists in user service but does not exist in file service", async () => {
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

      //GetAllUsers should be caled - try fetching user's data
      await testGlobalUserCreation(
        false,
        403,
        null,
        "Access denied. User does not exist for given app id!",
        1,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 403 and not create user - if user has no access to the app - invalid scope", async () => {
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

      //Get all users should not have been called - checking scope before fetching user
      await testGlobalUserCreation(
        false,
        403,
        null,
        "Forbidden access. No scope found to access the app!",
        0,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 403 and not create user - if subtenant user attempts to create user for tenant app", async () => {
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

      //Get all users should have been called - checking user's app assingment
      await testGlobalUserCreation(
        false,
        403,
        null,
        "Access denied. No access to given application!",
        1,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 403 and not create user - if tenant user attempts to create user for subtenant app", async () => {
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

      //Get all users should have been called - checking user's app assingment
      await testGlobalUserCreation(
        false,
        403,
        null,
        "Access denied. No access to given application!",
        1,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 401 - if authorization token is invalid - no bearer prefix", async () => {
      requestHeaders["authorization"] = jwt.sign(userPayload, "testPrivateKey");

      await testGlobalUserCreation(
        false,
        401,
        null,
        "Access denied. No token provided to fetch the user or token is invalid!",
        0,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 401 - if authorization token is invalid - invalid token", async () => {
      requestHeaders["authorization"] =
        "Bearer thisIsTheFakeValueOfTheJWTToken";

      await testGlobalUserCreation(
        false,
        401,
        null,
        "Access denied. No token provided to fetch the user or token is invalid!",
        0,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    it("should return 401 - if authorization token is invalid - no token provided", async () => {
      delete requestHeaders["authorization"];

      await testGlobalUserCreation(
        false,
        401,
        null,
        "Access denied. No token provided to fetch the user or token is invalid!",
        0,
        undefined,
        undefined,
        0,
        0,
        0
      );
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========

    //#region ========== MINDSPHERE SERVICE THROWS ==========

    it("should return 500 and not create user - if get all users throws", async () => {
      getAllUsersThrows = true;

      //0 calls for getAllUsers - becouse getAllUsers mock is overridden with a different mocked method
      await testGlobalUserCreation(
        false,
        500,
        null,
        "Ups.. Something fails..",
        0,
        undefined,
        undefined,
        0,
        0,
        0
      );

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test get all users error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    it("should return 500 and not create user - if create user throws", async () => {
      createUserThrows = true;

      //0 calls for create user - becouse createUser mock is overridden with a different mocked method
      await testGlobalUserCreation(
        false,
        500,
        null,
        "Ups.. Something fails..",
        undefined,
        undefined,
        undefined,
        0,
        0,
        0
      );

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test create user error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    it("should return 500 and not create user - if set file content", async () => {
      setFileContentThrows = true;

      //0 calls for set file content - becouse setFileContent mock is overridden with a different mocked method
      await testGlobalUserCreation(
        false,
        500,
        ["globalAdminGroup", "subtenantUserGroup"],
        "Ups.. Something fails..",
        undefined,
        undefined,
        undefined,
        1,
        2,
        0
      );

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test set file content error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    //#endregion ========== MINDSPHERE SERVICE THROWS ==========
  });

  describe("PUT /global/:appId/:userId", () => {
    let requestBody: any;
    let requestHeaders: any;
    let userPayload: MindSphereUserJWTData;
    let appId: string;
    let userId: string;
    let getAllUsersThrows: boolean;
    let setFileContentThrows: boolean;
    let addUserToGroupThrows: boolean;

    beforeEach(() => {
      requestHeaders = {};
      requestBody = {
        data: {
          testPlant4: {
            testLocalUser22TestPlant4Data:
              "testLocalUser22TestPlant4DataModifiedValue",
          },
          testPlant5: {
            testLocalUser22TestPlant5Data:
              "testLocalUser22TestPlant5DataModifiedValue",
          },
        },
        config: {
          testPlant4: {
            testLocalUser22TestPlant4Config:
              "testLocalUser22TestPlant4ConfigModifiedValue",
          },
          testPlant5: {
            testLocalUser22TestPlant5Config:
              "testLocalUser22TestPlant5ConfigModifiedValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.GlobalAdmin,
          plants: {
            testPlant4: PlantPermissions.Admin,
            testPlant5: PlantPermissions.User,
          },
        },
      };
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalUser22";
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
      setFileContentThrows = false;
      addUserToGroupThrows = false;
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

      if (addUserToGroupThrows) {
        MindSphereUserGroupService.getInstance().addUserToGroup = jest.fn(
          async () => {
            throw new Error("Test add user to group error");
          }
        );
      }

      return request(server)
        .put(`/customApi/config/user/global/${appId}/${userId}`)
        .set(requestHeaders)
        .send(requestBody);
    };

    const testGlobalUserEdition = async (
      validCall: boolean,
      responseCode: number,
      errorText: string | null,
      expectedFinalUserGroupIds: string[] | null = [
        "globalAdminGroup",
        "subtenantUserGroup",
      ],
      expectedGetAllUsersCallNumber: number = 1,
      expectedGetAssetsCallNumber: number = 1,
      expectedGetFileContentCallNumber: number = 48,
      expectedUpdateUserCallNumber: number = 0,
      expectedAddUserToGroupCallNumber: number = 1,
      expectedAddUserToGroupParameters: Array<any[]> = [
        ["testTenant2", "globalAdminGroup", "testLocalUser22"],
      ],
      expectedRemoveUserFromGroupCallNumber: number = 1,
      expectedRemoveUserFromGroupParameters: Array<any[]> = [
        ["testTenant2", "localUserGroup", "testLocalUser22"],
      ],
      expectedSetFileContentCallNumber: number = 1,
      expectedSetFileContentParameters: Array<any[]> = [
        [
          "hostTenant",
          "ten-testTenant2-sub-subtenant2-asset-id",
          "testLocalUser22.user.config.json",
          {
            data: {
              testPlant4: {
                testLocalUser22TestPlant4Data:
                  "testLocalUser22TestPlant4DataModifiedValue",
              },
              testPlant5: {
                testLocalUser22TestPlant5Data:
                  "testLocalUser22TestPlant5DataModifiedValue",
              },
            },
            config: {
              testPlant4: {
                testLocalUser22TestPlant4Config:
                  "testLocalUser22TestPlant4ConfigModifiedValue",
              },
              testPlant5: {
                testLocalUser22TestPlant5Config:
                  "testLocalUser22TestPlant5ConfigModifiedValue",
              },
            },
            userName: "test_local_user_22@user.name",
            permissions: {
              role: UserRole.GlobalAdmin,
              plants: {
                testPlant4: PlantPermissions.Admin,
                testPlant5: PlantPermissions.User,
              },
            },
          },
        ],
      ]
    ) => {
      let result = await exec();

      //#region ===== CHECKING RESPONSE =====

      if (validCall) {
        expect(result.status).toEqual(200);

        let expectedPayload = {
          ...requestBody,
          appId: appId,
          userId: userId,
        };

        expect(result.body).toEqual(expectedPayload);
      } else {
        expect(result.status).toEqual(responseCode);
        expect(result.text).toEqual(errorText);
      }

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(expectedGetAllUsersCallNumber);
      if (expectedGetAllUsersCallNumber > 0) {
        expect(getAllUsers.mock.calls[0]).toEqual([
          userPayload.ten,
          userPayload.subtenant ?? null,
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

      //Update user should most likely not be called
      expect(updateUser).toHaveBeenCalledTimes(expectedUpdateUserCallNumber);

      //User should be assigned to propert groups
      expect(addUserToGroup).toHaveBeenCalledTimes(
        expectedAddUserToGroupCallNumber
      );
      if (expectedAddUserToGroupCallNumber > 0) {
        for (let addUserToGroupParameters of expectedAddUserToGroupParameters!) {
          expect(addUserToGroup.mock.calls).toContainEqual(
            addUserToGroupParameters
          );
        }
      }

      //User should be removed from proper groups
      expect(removeUserFromGroup).toHaveBeenCalledTimes(
        expectedRemoveUserFromGroupCallNumber
      );
      if (expectedRemoveUserFromGroupCallNumber > 0) {
        for (let removeUserFromGroupParameters of expectedRemoveUserFromGroupParameters!) {
          expect(removeUserFromGroup.mock.calls).toContainEqual(
            removeUserFromGroupParameters
          );
        }
      }

      //User should be created in File Content
      expect(setFileContent).toHaveBeenCalledTimes(
        expectedSetFileContentCallNumber
      );
      if (expectedSetFileContentCallNumber > 0) {
        for (let setFileContentParameters of expectedSetFileContentParameters!) {
          expect(setFileContent.mock.calls).toContainEqual(
            setFileContentParameters
          );
        }
      }

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      if (validCall) {
        let appInstance = MindSphereAppsManager.getInstance().Apps[appId];

        let storagePayload = (appInstance as any)._userStorage._cacheData;

        let expectedStorageContent = getUsersStorageContent(
          appId,
          `${appId}-asset-id`
        );
        expectedStorageContent[userId] = requestBody;

        expect(storagePayload).toEqual(expectedStorageContent);

        //User should be accessible now via getUser
        let userData = await appInstance.getUser(userId);

        let expectedStorageData = requestBody;
        expect(userData.storageData).toEqual(expectedStorageData);

        let userContent = userServiceContent[userPayload.ten][userId];

        let expectedMsData: any = {
          ...userContent,
          userName: requestBody.userName,
          groups: expectedFinalUserGroupIds!.map((groupId) => {
            return {
              display: `${groupId}DisplayName`,
              type: "DIRECT",
              value: groupId,
            };
          }),
          id: userId,
        };

        //Adding subtenant to paylod if exists for the app
        if (userPayload.subtenant != null)
          expectedMsData.subtenants = [
            {
              id: userPayload.subtenant,
            },
          ];

        expect(userData.msData).toEqual(expectedMsData);
      } else {
        //Storage should not have changed
        let appInstance = MindSphereAppsManager.getInstance().Apps[appId];

        if (appInstance != null) {
          let storagePayload = (appInstance as any)._userStorage._cacheData;

          let expectedStorageContent = getUsersStorageContent(
            appId,
            `${appId}-asset-id`
          );

          //User payload should not have changed
          expect(storagePayload).toEqual(expectedStorageContent);
        }
      }

      //#endregion  =====  CHECKING STORAGE =====
    };

    it("should update user in MindSphere and in storage and return 200 with a payload of created user", async () => {
      await testGlobalUserEdition(true, 200, null);
    });

    it("should update user in MindSphere and in storage and return 200 with a payload of created user - if user to update is local user and current user is global admin", async () => {
      requestBody = {
        data: {
          testPlant4: {
            testLocalUser22TestPlant4Data:
              "testLocalUser22TestPlant4DataModifiedValue",
          },
        },
        config: {
          testPlant4: {
            testLocalUser22TestPlant4Config:
              "testLocalUser22TestPlant4ConfigModifiedValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant4: PlantPermissions.User,
          },
        },
      };
      userId = "testLocalUser22";
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

      await testGlobalUserEdition(
        true,
        200,
        null,
        ["localUserGroup", "subtenantUserGroup"],
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        1,
        [
          [
            "hostTenant",
            `${appId}-asset-id`,
            `${userId}.user.config.json`,
            requestBody,
          ],
        ]
      );
    });

    it("should update user in MindSphere and in storage and return 200 with a payload of created user - if user to update is a local admin and current user is global admin", async () => {
      requestBody = {
        data: {
          testPlant4: {
            testLocalAdmin22TestPlant4Data:
              "testLocalAdmin22TestPlant4DataModifiedValue",
          },
        },
        config: {
          testPlant4: {
            testLocalAdmin22TestPlant4Config:
              "testLocalAdmin22TestPlant4ConfigModifiedValue",
          },
        },
        userName: "test_local_admin_22@user.name",
        permissions: {
          role: UserRole.LocalAdmin,
          plants: {
            testPlant4: PlantPermissions.Admin,
          },
        },
      };
      userId = "testLocalAdmin22";
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

      await testGlobalUserEdition(
        true,
        200,
        null,
        ["localAdminGroup", "subtenantUserGroup"],
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        1,
        [
          [
            "hostTenant",
            `${appId}-asset-id`,
            `${userId}.user.config.json`,
            requestBody,
          ],
        ]
      );
    });

    it("should update user in MindSphere and in storage and return 200 with a payload of created user - if user to update is a global user and current user is global admin", async () => {
      requestBody = {
        data: {
          testPlant4: {
            testGlobalUser22TestPlant4Data:
              "testGlobalUser22TestPlant4DataModifiedValue",
          },
        },
        config: {
          testPlant4: {
            testGlobalUser22TestPlant4Config:
              "testGlobalUser22TestPlant4ConfigModifiedValue",
          },
        },
        userName: "test_global_user_22@user.name",
        permissions: {
          role: UserRole.GlobalUser,
          plants: {
            testPlant4: PlantPermissions.User,
          },
        },
      };
      userId = "testGlobalUser22";
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

      await testGlobalUserEdition(
        true,
        200,
        null,
        ["globalUserGroup", "subtenantUserGroup"],
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        1,
        [
          [
            "hostTenant",
            `${appId}-asset-id`,
            `${userId}.user.config.json`,
            requestBody,
          ],
        ]
      );
    });

    it("should update user in MindSphere and in storage and return 200 with a payload of created user - if user to update is a global admin and current user is global admin", async () => {
      requestBody = {
        data: {
          testPlant4: {
            testGlobalAdmin22TestPlant4Data:
              "testGlobalAdmin22TestPlant4DataModifiedValue",
          },
        },
        config: {
          testPlant4: {
            testGlobalAdmin22TestPlant4Config:
              "testGlobalAdmin22TestPlant4ConfigModifiedValue",
          },
        },
        userName: "test_global_admin_22@user.name",
        permissions: {
          role: UserRole.GlobalAdmin,
          plants: {
            testPlant4: PlantPermissions.User,
          },
        },
      };
      userId = "testGlobalAdmin22";
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

      await testGlobalUserEdition(
        true,
        200,
        null,
        ["globalAdminGroup", "subtenantUserGroup"],
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        1,
        [
          [
            "hostTenant",
            `${appId}-asset-id`,
            `${userId}.user.config.json`,
            requestBody,
          ],
        ]
      );
    });

    it("should update user in MindSphere and in storage and return 200 with a payload of created user - subtenant app", async () => {
      requestBody = {
        data: {
          testPlant4: {
            testLocalUser22TestPlant4Data:
              "testLocalUser22TestPlant4DataModifiedValue",
          },
          testPlant5: {
            testLocalUser22TestPlant5Data:
              "testLocalUser22TestPlant5DataModifiedValue",
          },
        },
        config: {
          testPlant4: {
            testLocalUser22TestPlant4Config:
              "testLocalUser22TestPlant4ConfigModifiedValue",
          },
          testPlant5: {
            testLocalUser22TestPlant5Config:
              "testLocalUser22TestPlant5ConfigModifiedValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.GlobalAdmin,
          plants: {
            testPlant4: PlantPermissions.Admin,
            testPlant5: PlantPermissions.User,
          },
        },
      };
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalUser22";
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

      await testGlobalUserEdition(true, 200, null);
    });

    it("should update user in MindSphere and in storage and return 200 with a payload of created user - tenant app", async () => {
      requestBody = {
        data: {
          testPlant4: {
            testLocalUser21TestPlant4Data:
              "testLocalUser21TestPlant4DataModifiedValue",
          },
          testPlant5: {
            testLocalUser21TestPlant5Data:
              "testLocalUser21TestPlant5DataModifiedValue",
          },
        },
        config: {
          testPlant4: {
            testLocalUser21TestPlant4Config:
              "testLocalUser21TestPlant4ConfigModifiedValue",
          },
          testPlant5: {
            testLocalUser21TestPlant5Config:
              "testLocalUser21TestPlant5ConfigModifiedValue",
          },
        },
        userName: "test_local_user_21@user.name",
        permissions: {
          role: UserRole.GlobalAdmin,
          plants: {
            testPlant4: PlantPermissions.Admin,
            testPlant5: PlantPermissions.User,
          },
        },
      };
      appId = "ten-testTenant2";
      userId = "testLocalUser21";
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

      await testGlobalUserEdition(
        true,
        200,
        null,
        ["globalAdminGroup", "standardUserGroup"],
        undefined,
        undefined,
        undefined,
        undefined,
        1,
        [["testTenant2", "globalAdminGroup", "testLocalUser21"]],
        1,
        [["testTenant2", "localUserGroup", "testLocalUser21"]],
        undefined,
        [
          [
            "hostTenant",
            `${appId}-asset-id`,
            `${userId}.user.config.json`,
            requestBody,
          ],
        ]
      );
    });

    it("should degrade user to local user - if new role is a local user", async () => {
      requestBody = {
        data: {
          testPlant4: {
            testLocalAdmin22TestPlant4Data:
              "testLocalAdmin22TestPlant4DataModifiedValue",
          },
        },
        config: {
          testPlant4: {
            testLocalAdmin22TestPlant4Config:
              "testLocalAdmin22TestPlant4ConfigModifiedValue",
          },
        },
        userName: "test_local_admin_22@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant4: PlantPermissions.User,
          },
        },
      };
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalAdmin22";
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

      await testGlobalUserEdition(
        true,
        200,
        null,
        ["localUserGroup", "subtenantUserGroup"],
        undefined,
        undefined,
        undefined,
        undefined,
        1,
        [["testTenant2", "localUserGroup", userId]],
        1,
        [["testTenant2", "localAdminGroup", userId]],
        undefined,
        [
          [
            "hostTenant",
            `${appId}-asset-id`,
            `${userId}.user.config.json`,
            requestBody,
          ],
        ]
      );
    });

    it("should promote user to local admin - if new role is a local admin", async () => {
      requestBody = {
        data: {
          testPlant4: {
            testLocalUser22TestPlant4Data:
              "testLocalUser22TestPlant4DataModifiedValue",
          },
        },
        config: {
          testPlant4: {
            testLocalUser22TestPlant4Config:
              "testLocalUser22TestPlant4ConfigModifiedValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.LocalAdmin,
          plants: {
            testPlant4: PlantPermissions.Admin,
          },
        },
      };
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalUser22";
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

      await testGlobalUserEdition(
        true,
        200,
        null,
        ["localAdminGroup", "subtenantUserGroup"],
        undefined,
        undefined,
        undefined,
        undefined,
        1,
        [["testTenant2", "localAdminGroup", userId]],
        1,
        [["testTenant2", "localUserGroup", userId]],
        undefined,
        [
          [
            "hostTenant",
            `${appId}-asset-id`,
            `${userId}.user.config.json`,
            requestBody,
          ],
        ]
      );
    });

    it("should promote user to global user - if new role is a global user", async () => {
      requestBody = {
        data: {
          testPlant4: {
            testLocalUser22TestPlant4Data:
              "testLocalUser22TestPlant4DataModifiedValue",
          },
        },
        config: {
          testPlant4: {
            testLocalUser22TestPlant4Config:
              "testLocalUser22TestPlant4ConfigModifiedValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.GlobalUser,
          plants: {
            testPlant4: PlantPermissions.User,
          },
        },
      };
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalUser22";
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

      await testGlobalUserEdition(
        true,
        200,
        null,
        ["globalUserGroup", "subtenantUserGroup"],
        undefined,
        undefined,
        undefined,
        undefined,
        1,
        [["testTenant2", "globalUserGroup", userId]],
        1,
        [["testTenant2", "localUserGroup", userId]],
        undefined,
        [
          [
            "hostTenant",
            `${appId}-asset-id`,
            `${userId}.user.config.json`,
            requestBody,
          ],
        ]
      );
    });

    it("should promote user to global user - if new role is a global admin", async () => {
      requestBody = {
        data: {
          testPlant4: {
            testLocalUser22TestPlant4Data:
              "testLocalUser22TestPlant4DataModifiedValue",
          },
        },
        config: {
          testPlant4: {
            testLocalUser22TestPlant4Config:
              "testLocalUser22TestPlant4ConfigModifiedValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.GlobalAdmin,
          plants: {
            testPlant4: PlantPermissions.Admin,
          },
        },
      };
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalUser22";
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

      await testGlobalUserEdition(
        true,
        200,
        null,
        ["globalAdminGroup", "subtenantUserGroup"],
        undefined,
        undefined,
        undefined,
        undefined,
        1,
        [["testTenant2", "globalAdminGroup", userId]],
        1,
        [["testTenant2", "localUserGroup", userId]],
        undefined,
        [
          [
            "hostTenant",
            `${appId}-asset-id`,
            `${userId}.user.config.json`,
            requestBody,
          ],
        ]
      );
    });

    it("should not change users memebership - if there is no change in membership in user's payload", async () => {
      requestBody = {
        data: {
          testPlant4: {
            testLocalUser22TestPlant4Data:
              "testLocalUser22TestPlant4DataModifiedValue",
          },
        },
        config: {
          testPlant4: {
            testLocalUser22TestPlant4Config:
              "testLocalUser22TestPlant4ConfigModifiedValue",
          },
        },
        userName: "test_local_user_22@user.name",
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            testPlant4: PlantPermissions.User,
          },
        },
      };
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalUser22";
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

      await testGlobalUserEdition(
        true,
        200,
        null,
        ["localUserGroup", "subtenantUserGroup"],
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        undefined,
        [
          [
            "hostTenant",
            `${appId}-asset-id`,
            `${userId}.user.config.json`,
            requestBody,
          ],
        ]
      );
    });

    it("should fetch user and update him - if user exists in service, does not exist in cache but exists in storage", async () => {
      let userFileContent =
        fileServiceContent["hostTenant"][`${appId}-asset-id`][
          `${userId}.user.config.json`
        ];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ];

      //Initializing whole service
      await beforeExec();

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = userFileContent;

      //Setting new file content
      setFileServiceContent(fileServiceContent);

      let result = await request(server)
        .put(`/customApi/config/user/global/${appId}/${userId}`)
        .set(requestHeaders)
        .send(requestBody);

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(200);

      //Id of the user should be generated automatically
      expect(result.body.userId).toBeDefined();

      let expectedPayload = {
        ...requestBody,
        appId: appId,
        userId: userId,
      };

      expect(result.body).toEqual(expectedPayload);

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        userPayload.ten,
        userPayload.subtenant,
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

      //Then users data should be fetched - without getFileContent - invoked during initialization 47 times (without one user) and one time when update is called
      expect(getFileContent).toHaveBeenCalledTimes(48);
      expect(getFileContent.mock.calls[47]).toEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `${userId}.user.config.json`,
      ]);

      //Update user should most likely not be called
      expect(updateUser).not.toHaveBeenCalled();

      //User should be assigned to propert groups
      expect(addUserToGroup).toHaveBeenCalledTimes(1);
      expect(addUserToGroup.mock.calls[0]).toEqual([
        "testTenant2",
        "globalAdminGroup",
        userId,
      ]);

      //User should be removed from proper groups
      expect(removeUserFromGroup).toHaveBeenCalledTimes(1);
      expect(removeUserFromGroup.mock.calls[0]).toEqual([
        "testTenant2",
        "localUserGroup",
        userId,
      ]);

      //User should be created in File Content
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `${userId}.user.config.json`,
        requestBody,
      ]);

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      let appInstance = MindSphereAppsManager.getInstance().Apps[appId];

      let storagePayload = (appInstance as any)._userStorage._cacheData;

      let expectedStorageContent = getUsersStorageContent(
        appId,
        `${appId}-asset-id`
      );
      expectedStorageContent[userId] = requestBody;

      expect(storagePayload).toEqual(expectedStorageContent);

      //User should be accessible now via getUser
      let userData = await appInstance.getUser(userId);

      let expectedStorageData = requestBody;
      expect(userData.storageData).toEqual(expectedStorageData);

      let userContent = userServiceContent[userPayload.ten][userId];

      let expectedMsData: any = {
        ...userContent,
        userName: requestBody.userName,
        groups: [
          {
            display: `globalAdminGroupDisplayName`,
            type: "DIRECT",
            value: "globalAdminGroup",
          },
          {
            display: `subtenantUserGroupDisplayName`,
            type: "DIRECT",
            value: "subtenantUserGroup",
          },
        ],
        id: userId,
        subtenants: [
          {
            id: "subtenant2",
          },
        ],
      };

      expect(userData.msData).toEqual(expectedMsData);

      //#endregion  =====  CHECKING STORAGE =====
    });

    it("should not update user in MindSphere nor in storage and return 404 - if user of given id does not exist in user service but exists in cache and storage", async () => {
      delete userServiceContent["testTenant2"][userId];

      await testGlobalUserEdition(
        false,
        404,
        `User of name: test_local_user_22@user.name does not exist in tenant!`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should not update user in MindSphere nor in storage and return 404 - if user of given id does not exist in userService nor in cache or storage ", async () => {
      userId = "fakeUserId";

      await testGlobalUserEdition(
        false,
        404,
        "User of id: fakeUserId does not exist!",
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    //#region ========== BODY VALIDATION =========

    it("should return 400 - if request is not a valid JSON", async () => {
      requestBody = "fakeBody";

      await beforeExec();

      let result = await request(server)
        .put(`/customApi/config/user/global/${appId}/${userId}`)
        .send('{"invalid"}')
        .type("json");

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(400);
      expect(result.text).toEqual("Invalid request content");

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should not be fetched
      expect(getAllUsers).toHaveBeenCalledTimes(0);

      //Checking if app exists - should be invoked only one time during initalization
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //Users data should be fetched - without getFileContent - invoked during initialization - 6 (6 apps) x 8 files (1 main, 4 users, 3 plants) = 48
      expect(getFileContent).toHaveBeenCalledTimes(48);

      //Update user should not be called
      expect(updateUser).not.toHaveBeenCalled();

      //User assignment should not have changed
      expect(addUserToGroup).not.toHaveBeenCalled();
      expect(removeUserFromGroup).not.toHaveBeenCalled();

      //File content should not have changed
      expect(setFileContent).not.toHaveBeenCalled();

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      //Storage should not have changed
      let appInstance = MindSphereAppsManager.getInstance().Apps[appId];

      if (appInstance != null) {
        let storagePayload = (appInstance as any)._userStorage._cacheData;

        let expectedStorageContent = getUsersStorageContent(
          appId,
          `${appId}-asset-id`
        );

        //User payload should not have changed
        expect(storagePayload).toEqual(expectedStorageContent);
      }

      //#endregion  =====  CHECKING STORAGE =====
    });

    it("should return 400 and not edit user - if there is an attempt to change userName", async () => {
      requestBody.userName = "newFakeUserName@fake.email";

      await testGlobalUserEdition(
        false,
        400,
        `Users name cannot be modified!`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if there is an attempt to change userId", async () => {
      requestBody.userId = "fakeUserId";

      await testGlobalUserEdition(
        false,
        400,
        `"userId" is not allowed`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if there is an attempt to change appId", async () => {
      requestBody.appId = "fakAppId";

      await testGlobalUserEdition(
        false,
        400,
        `"appId" is not allowed`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if userName is not defined", async () => {
      delete requestBody.userName;

      await testGlobalUserEdition(
        false,
        400,
        `"userName" is required`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if userName is null", async () => {
      requestBody.userName = null;

      await testGlobalUserEdition(
        false,
        400,
        `"userName" must be a string`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if userName has invalid type (number)", async () => {
      requestBody.userName = 1234;

      await testGlobalUserEdition(
        false,
        400,
        `"userName" must be a string`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if userName is invalid email", async () => {
      requestBody.userName = "fakeEmailValue";

      await testGlobalUserEdition(
        false,
        400,
        `"userName" must be a valid email`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if data is undefined", async () => {
      delete requestBody.data;

      await testGlobalUserEdition(
        false,
        400,
        `"data" is required`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if data is null", async () => {
      requestBody.data = null;

      await testGlobalUserEdition(
        false,
        400,
        `"data" must be of type object`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if data has invalid type (string)", async () => {
      requestBody.data = "testData";

      await testGlobalUserEdition(
        false,
        400,
        `"data" must be of type object`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if data is an empty object - permissions of plants exist", async () => {
      requestBody.data = {};

      await testGlobalUserEdition(
        false,
        400,
        `User data invalid - plantIds in data and in permissions must be identical!`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 200 and edit user - if data is an empty object - permissions of plants don't exist", async () => {
      requestBody.data = {};
      requestBody.config = {};
      requestBody.permissions.plants = {};

      await testGlobalUserEdition(
        true,
        200,
        null,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        [
          [
            "hostTenant",
            `${appId}-asset-id`,
            `${userId}.user.config.json`,
            requestBody,
          ],
        ]
      );
    });

    it("should return 200 and edit user - if data has nested properties ", async () => {
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
      };

      await testGlobalUserEdition(
        true,
        200,
        null,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        [
          [
            "hostTenant",
            `${appId}-asset-id`,
            `${userId}.user.config.json`,
            requestBody,
          ],
        ]
      );
    });

    it("should return 400 and not edit user - if data is not an empty object - permissions of plants don't exist", async () => {
      requestBody.config = {};
      requestBody.permissions.plants = {};

      await testGlobalUserEdition(
        false,
        400,
        `User data invalid - plantIds in data and in permissions must be identical!`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if data has additional plant id", async () => {
      requestBody.data["fakePlantId"] = { test: 1234 };

      await testGlobalUserEdition(
        false,
        400,
        `User data invalid - plantIds in data and in permissions must be identical!`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if config is undefined", async () => {
      delete requestBody.config;

      await testGlobalUserEdition(
        false,
        400,
        `"config" is required`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if config is null", async () => {
      requestBody.config = null;

      await testGlobalUserEdition(
        false,
        400,
        `"config" must be of type object`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if config has invalid type (string)", async () => {
      requestBody.config = "testData";

      await testGlobalUserEdition(
        false,
        400,
        `"config" must be of type object`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if config is an empty object - permissions of plants exist", async () => {
      requestBody.config = {};

      await testGlobalUserEdition(
        false,
        400,
        `User config invalid - plantIds in config and in permissions must be identical!`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 200 and not edit user - if config is an empty object - permissions of plants don't exist", async () => {
      requestBody.data = {};
      requestBody.config = {};
      requestBody.permissions.plants = {};

      await testGlobalUserEdition(
        true,
        200,
        null,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        [
          [
            "hostTenant",
            `${appId}-asset-id`,
            `${userId}.user.config.json`,
            requestBody,
          ],
        ]
      );
    });

    it("should return 200 and not edit user - if config has nested properties ", async () => {
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
      };

      await testGlobalUserEdition(
        true,
        200,
        null,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        [
          [
            "hostTenant",
            `${appId}-asset-id`,
            `${userId}.user.config.json`,
            requestBody,
          ],
        ]
      );
    });

    it("should return 400 and not edit user - if config is not an empty object - permissions of plants don't exist", async () => {
      requestBody.data = {};
      requestBody.permissions.plants = {};

      await testGlobalUserEdition(
        false,
        400,
        `User config invalid - plantIds in config and in permissions must be identical!`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if config has additional plant id", async () => {
      requestBody.config["fakePlantId"] = { test: 1234 };

      await testGlobalUserEdition(
        false,
        400,
        `User config invalid - plantIds in config and in permissions must be identical!`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if permissions is undefined", async () => {
      delete requestBody.permissions;

      await testGlobalUserEdition(
        false,
        400,
        `"permissions" is required`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if permissions is null", async () => {
      requestBody.permissions = null;

      await testGlobalUserEdition(
        false,
        400,
        `"permissions" must be of type object`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if permissions has invalid type (string)", async () => {
      requestBody.permissions = "testData";

      await testGlobalUserEdition(
        false,
        400,
        `"permissions" must be of type object`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if permissions.role is undefined", async () => {
      delete requestBody.permissions.role;

      await testGlobalUserEdition(
        false,
        400,
        `"permissions.role" is required`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if permissions.role is null", async () => {
      requestBody.permissions.role = null;

      await testGlobalUserEdition(
        false,
        400,
        `"permissions.role" must be one of [0, 1, 2, 3]`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if permissions.role has invalid type (string)", async () => {
      requestBody.permissions.role = "testData";

      await testGlobalUserEdition(
        false,
        400,
        `"permissions.role" must be one of [0, 1, 2, 3]`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if permissions.role has invalid value", async () => {
      requestBody.permissions.role = 5;

      await testGlobalUserEdition(
        false,
        400,
        `"permissions.role" must be one of [0, 1, 2, 3]`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if permissions.plants is undefined", async () => {
      delete requestBody.permissions.plants;

      await testGlobalUserEdition(
        false,
        400,
        `"permissions.plants" is required`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if permissions.plants is null", async () => {
      requestBody.permissions.plants = null;

      await testGlobalUserEdition(
        false,
        400,
        `"permissions.plants" must be of type object`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if permissions.plants has invalid type (string)", async () => {
      requestBody.permissions.plants = "testData";

      await testGlobalUserEdition(
        false,
        400,
        `"permissions.plants" must be of type object`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if permissions.plants is an empty object - permissions exists in config and data", async () => {
      requestBody.permissions.plants = {};

      await testGlobalUserEdition(
        false,
        400,
        `User config invalid - plantIds in config and in permissions must be identical!`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 200 and not edit user - if permissions.plants is an empty object - permissions does not exist in config and data", async () => {
      requestBody.data = {};
      requestBody.config = {};
      requestBody.permissions.plants = {};

      await testGlobalUserEdition(
        true,
        200,
        null,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        [
          [
            "hostTenant",
            `${appId}-asset-id`,
            `${userId}.user.config.json`,
            requestBody,
          ],
        ]
      );
    });

    it("should return 400 and not edit user - if permissions.plants has one additional plant - permissions exists in config and data", async () => {
      requestBody.permissions.plants["fakePlant"] = 0;

      await testGlobalUserEdition(
        false,
        400,
        `User config invalid - plantIds in config and in permissions must be identical!`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if permissions.plants of one plant is null", async () => {
      requestBody.permissions.plants["fakePlant"] = null;

      await testGlobalUserEdition(
        false,
        400,
        `"permissions.plants.fakePlant" must be one of [0, 1]`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if permissions.plants of one plant has invalid type - string", async () => {
      requestBody.permissions.plants["fakePlant"] = "abcd1234";

      await testGlobalUserEdition(
        false,
        400,
        `"permissions.plants.fakePlant" must be one of [0, 1]`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if permissions.plants of one plant has invalid number - float", async () => {
      requestBody.permissions.plants["fakePlant"] = 0.123;

      await testGlobalUserEdition(
        false,
        400,
        `"permissions.plants.fakePlant" must be one of [0, 1]`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if permissions.plants of one plant has invalid number - below 0", async () => {
      requestBody.permissions.plants["fakePlant"] = -1;

      await testGlobalUserEdition(
        false,
        400,
        `"permissions.plants.fakePlant" must be one of [0, 1]`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if permissions.plants of one plant has invalid number - above 1", async () => {
      requestBody.permissions.plants["fakePlant"] = 2;

      await testGlobalUserEdition(
        false,
        400,
        `"permissions.plants.fakePlant" must be one of [0, 1]`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if role is a globalUser but permissions to plant is an admin", async () => {
      requestBody.permissions.role = UserRole.GlobalUser;
      requestBody.permissions.plants = {
        testPlant4: PlantPermissions.Admin,
        testPlant5: PlantPermissions.Admin,
        testPlant6: PlantPermissions.Admin,
      };

      await testGlobalUserEdition(
        false,
        400,
        `Users role should be a local or global admin, if they have administrative permissions for a plant!`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 400 and not edit user - if role is a localUser but permissions to plant is an admin", async () => {
      requestBody.permissions.role = UserRole.LocalUser;
      requestBody.permissions.plants = {
        testPlant4: PlantPermissions.Admin,
        testPlant5: PlantPermissions.Admin,
        testPlant6: PlantPermissions.Admin,
      };

      await testGlobalUserEdition(
        false,
        400,
        `Users role should be a local or global admin, if they have administrative permissions for a plant!`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    //#endregion ========== BODY VALIDATION =========

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should return 403 and not edit user - if global user attempts to edit user", async () => {
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

      await testGlobalUserEdition(
        false,
        403,
        "Access denied. User must be a global admin!",
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 403 and not edit user - if local admin attempts to edit user", async () => {
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

      await testGlobalUserEdition(
        false,
        403,
        "Access denied. User must be a global admin!",
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 403 and not edit user - if local user attempts to edit user", async () => {
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

      await testGlobalUserEdition(
        false,
        403,
        "Access denied. User must be a global admin!",
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 403 and not edit user - if user's jwt payload does not have tenant assigned", async () => {
      delete (userPayload as any).ten;

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //GetAllUser should not be called - call ended before fetching user's data
      await testGlobalUserEdition(
        false,
        403,
        "Access denied. Invalid application id generated from user payload!",
        undefined,
        0,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 403 and not edit user - if there is no application of given id", async () => {
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

      //2 x GetAssets call - try fetching new app
      //GetAllUser should not be called - call ended before fetching user's data
      await testGlobalUserEdition(
        false,
        403,
        "Access denied. Application of given id not found for the user!",
        undefined,
        0,
        2,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 403 and not edit user - if app id in user's payload and param differs", async () => {
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

      await testGlobalUserEdition(
        false,
        403,
        "Access denied. No access to given application!",
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 403 and not edit user - if there is no application data for given app", async () => {
      delete fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["main.app.config.json"];

      //GetAllUser should not be called - call ended before fetching user's data
      //47 calls of getFileContent - no file containing one main app data
      await testGlobalUserEdition(
        false,
        403,
        "Access denied. Main application settings not found for the user!",
        undefined,
        0,
        undefined,
        47,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 403 and not edit user - if user has valid scope, doest not exist in user service but exists in file service", async () => {
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

      //49 calls of getFileContent - one additional user
      await testGlobalUserEdition(
        false,
        403,
        "Access denied. User of given name not found!",
        undefined,
        undefined,
        undefined,
        49,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 403 and not edit user - if user has valid scope, exists in user service but does not exist in file service", async () => {
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

      await testGlobalUserEdition(
        false,
        403,
        "Access denied. User does not exist for given app id!",
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 403 and not edit user - if user has no access to the app - invalid scope", async () => {
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

      //0 calls of getAllUsers - not fetching user's data - checking scope before fetching
      await testGlobalUserEdition(
        false,
        403,
        "Forbidden access. No scope found to access the app!",
        undefined,
        0,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 403 and not edit user - if subtenant user attempts to edit user for tenant app", async () => {
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

      await testGlobalUserEdition(
        false,
        403,
        "Access denied. No access to given application!",
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 403 and not edit user - if tenant user attempts to edit user for subtenant app", async () => {
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

      await testGlobalUserEdition(
        false,
        403,
        "Access denied. No access to given application!",
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 401 - if authorization token is invalid - no bearer prefix", async () => {
      requestHeaders["authorization"] = jwt.sign(userPayload, "testPrivateKey");

      //No calling getAllUsers - returning before fetching user's data
      await testGlobalUserEdition(
        false,
        401,
        "Access denied. No token provided to fetch the user or token is invalid!",
        undefined,
        0,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 401 - if authorization token is invalid - invalid token", async () => {
      requestHeaders["authorization"] =
        "Bearer thisIsTheFakeValueOfTheJWTToken";

      //No calling getAllUsers - returning before fetching user's data
      await testGlobalUserEdition(
        false,
        401,
        "Access denied. No token provided to fetch the user or token is invalid!",
        undefined,
        0,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    it("should return 401 - if authorization token is invalid - no token provided", async () => {
      delete requestHeaders["authorization"];

      //No calling getAllUsers - returning before fetching user's data
      await testGlobalUserEdition(
        false,
        401,
        "Access denied. No token provided to fetch the user or token is invalid!",
        undefined,
        0,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========

    //#region ========== MINDSPHERE SERVICE THROWS ==========

    it("should return 500 and not edit user - if get all users throws", async () => {
      getAllUsersThrows = true;

      //0 calls for getAllUsers - becouse getAllUsers mock is overridden with a different mocked method
      await testGlobalUserEdition(
        false,
        500,
        `Ups.. Something fails..`,
        undefined,
        0,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0
      );

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test get all users error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    it("should return 500 and not edit user - if set file content throws", async () => {
      setFileContentThrows = true;

      //0 calls for set file content - becouse setFileContent mock is overridden with a different mocked method
      //API Calls for changing user's role should have been called
      await testGlobalUserEdition(
        false,
        500,
        `Ups.. Something fails..`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0
      );

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test set file content error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    it("should return 500 and not edit user - if add memeber to group fails", async () => {
      addUserToGroupThrows = true;

      //0 calls for set file content - it should not have been called
      //0 calls for adding user to group - mocking it with different method that throws
      //API Calls for removing user from group should not have been called
      await testGlobalUserEdition(
        false,
        500,
        `Ups.. Something fails..`,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        0,
        [],
        0,
        [],
        0,
        []
      );

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test add user to group error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    //#endregion ========== MINDSPHERE SERVICE THROWS ==========
  });

  describe("DELETE /global/:appId/:userId", () => {
    let requestHeaders: any;
    let userPayload: MindSphereUserJWTData;
    let appId: string;
    let userId: string;
    let getAllUsersThrows: boolean;
    let deleteFileThrows: boolean;
    let deleteUserThrows: boolean;

    beforeEach(() => {
      requestHeaders = {};
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalUser22";
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
      deleteUserThrows = false;
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

      if (deleteUserThrows) {
        MindSphereUserService.getInstance().deleteUser = jest.fn(async () => {
          throw new Error("Test delete user error");
        });
      }

      return request(server)
        .delete(`/customApi/config/user/global/${appId}/${userId}`)
        .set(requestHeaders)
        .send();
    };

    const testGlobalUserDeletion = async (
      validCall: boolean,
      responseCode: number,
      errorText: string | null,
      expectedGetAllUsersCallNumber: number = 1,
      expectedGetAssetsCallNumber: number = 1,
      expectedGetFileContentCallNumber: number = 48,
      expectedDeleteUserCalls: number = 1,
      expectedDeleteFileCalls: number = 1
    ) => {
      let result = await exec();

      //#region ===== CHECKING RESPONSE =====

      if (validCall) {
        expect(result.status).toEqual(200);

        let expectedPayload = getUserDataResponse(
          appId,
          `${appId}-asset-id`,
          userId
        );

        expect(result.body).toEqual(expectedPayload);
      } else {
        expect(result.status).toEqual(responseCode);
        expect(result.text).toEqual(errorText);
      }

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(expectedGetAllUsersCallNumber);
      if (expectedGetAllUsersCallNumber > 0) {
        expect(getAllUsers.mock.calls[0]).toEqual([
          userPayload.ten,
          userPayload.subtenant ?? null,
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

      //Delete user should have been called properly
      expect(deleteUser).toHaveBeenCalledTimes(expectedDeleteUserCalls);
      if (expectedDeleteUserCalls > 0) {
        expect(deleteUser.mock.calls).toContainEqual([userPayload.ten, userId]);
      }

      //Delete file content should have been called properly
      expect(deleteFile).toHaveBeenCalledTimes(expectedDeleteFileCalls);
      if (expectedDeleteFileCalls > 0) {
        expect(deleteFile.mock.calls).toContainEqual([
          "hostTenant",
          `${appId}-asset-id`,
          `${userId}.user.config.json`,
        ]);
      }

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      if (validCall) {
        //Storage should have changed
        let appInstance = MindSphereAppsManager.getInstance().Apps[appId];

        let storagePayload = (appInstance as any)._userStorage._cacheData;

        let expectedStorageContent = getUsersStorageContent(
          appId,
          `${appId}-asset-id`
        );
        delete expectedStorageContent[userId];

        expect(storagePayload).toEqual(expectedStorageContent);
      } else {
        //Storage should not have changed
        let appInstance = MindSphereAppsManager.getInstance().Apps[appId];

        if (appInstance != null) {
          let storagePayload = (appInstance as any)._userStorage._cacheData;

          let expectedStorageContent = getUsersStorageContent(
            appId,
            `${appId}-asset-id`
          );

          //User payload should not have changed
          expect(storagePayload).toEqual(expectedStorageContent);
        }
      }

      //#endregion  =====  CHECKING STORAGE =====
    };

    it("should delete user in MindSphere and in storage and return 200 with a payload of deleted user", async () => {
      await testGlobalUserDeletion(true, 200, null);
    });

    it("should delete user - if there is an attempt to delete local user - subtenant app", async () => {
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalUser22";

      await testGlobalUserDeletion(true, 200, null);
    });

    it("should delete user - if there is an attempt to delete local admin - subtenant app", async () => {
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testLocalAdmin22";

      await testGlobalUserDeletion(true, 200, null);
    });

    it("should delete user - if there is an attempt to delete global user - subtenant app", async () => {
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testGlobalUser22";

      await testGlobalUserDeletion(true, 200, null);
    });

    it("should delete user - if there is an attempt to delete global admin - subtenant app", async () => {
      appId = "ten-testTenant2-sub-subtenant2";
      userId = "testGlobalAdmin22";

      await testGlobalUserDeletion(true, 200, null);
    });

    it("should delete user - if there is an attempt to delete local user - tenant app", async () => {
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

      appId = "ten-testTenant2";
      userId = "testLocalUser21";

      await testGlobalUserDeletion(true, 200, null);
    });

    it("should delete user - if there is an attempt to delete local admin - tenant app", async () => {
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

      appId = "ten-testTenant2";
      userId = "testLocalAdmin21";

      await testGlobalUserDeletion(true, 200, null);
    });

    it("should delete user - if there is an attempt to delete global user - tenant app", async () => {
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

      appId = "ten-testTenant2";
      userId = "testGlobalUser21";

      await testGlobalUserDeletion(true, 200, null);
    });

    it("should delete user - if there is an attempt to delete global admin - tenant app", async () => {
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

      appId = "ten-testTenant2";
      userId = "testGlobalAdmin21";

      await testGlobalUserDeletion(true, 200, null);
    });

    it("should fetch user and delete him - if user exists in storage but not in cache", async () => {
      let userFileContent =
        fileServiceContent["hostTenant"][`${appId}-asset-id`][
          `${userId}.user.config.json`
        ];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ];

      //Initializing whole service
      await beforeExec();

      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ] = userFileContent;

      //Setting new file content
      setFileServiceContent(fileServiceContent);

      let result = await request(server)
        .delete(`/customApi/config/user/global/${appId}/${userId}`)
        .set(requestHeaders)
        .send();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(200);

      let expectedPayload = getUserDataResponse(
        appId,
        `${appId}-asset-id`,
        userId
      );

      expect(result.body).toEqual(expectedPayload);

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //User id should be fetched - via getAllUsers with proper filtering
      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        userPayload.ten,
        userPayload.subtenant ?? null,
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

      //Then users data should be fetched - without getFileContent - invoked during initialization 47 times (without one user) and one time when delete is called
      expect(getFileContent).toHaveBeenCalledTimes(48);
      expect(getFileContent.mock.calls[47]).toEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `${userId}.user.config.json`,
      ]);

      //Delete user should have been called properly
      expect(deleteUser).toHaveBeenCalledTimes(1);
      expect(deleteUser.mock.calls).toContainEqual([userPayload.ten, userId]);

      //Delete file content should have been called properly
      expect(deleteFile).toHaveBeenCalledTimes(1);
      expect(deleteFile.mock.calls).toContainEqual([
        "hostTenant",
        `${appId}-asset-id`,
        `${userId}.user.config.json`,
      ]);

      //#endregion ===== CHECKING API CALLS =====

      //#region  =====  CHECKING STORAGE =====

      //Storage should have changed
      let appInstance = MindSphereAppsManager.getInstance().Apps[appId];

      let storagePayload = (appInstance as any)._userStorage._cacheData;

      let expectedStorageContent = getUsersStorageContent(
        appId,
        `${appId}-asset-id`
      );
      delete expectedStorageContent[userId];

      expect(storagePayload).toEqual(expectedStorageContent);

      //#endregion  =====  CHECKING STORAGE =====
    });

    it("should not delete user and return 404 - if user exists in storage and cache but does not exist in user service", async () => {
      delete userServiceContent["testTenant2"][userId];

      await testGlobalUserDeletion(
        false,
        404,
        `User of name: test_local_user_22@user.name does not exist in tenant!`,
        undefined,
        undefined,
        undefined,
        0,
        0
      );
    });

    it("should not delete user and return 404 - if user does not exist in storage but does exist in user service", async () => {
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ];

      //Only 47 x getFileContent call - one file of user config less
      await testGlobalUserDeletion(
        false,
        404,
        `User of id: testLocalUser22 does not exist!`,
        undefined,
        undefined,
        47,
        0,
        0
      );
    });

    it("should not delete user and return 404 - if user does not exist in storage nor cache nor in user service", async () => {
      delete userServiceContent["testTenant2"][userId];
      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${userId}.user.config.json`
      ];

      //Only 47 x getFileContent call - one file of user config less
      await testGlobalUserDeletion(
        false,
        404,
        `User of id: testLocalUser22 does not exist!`,
        undefined,
        undefined,
        47,
        0,
        0
      );
    });

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should return 403 and not delete user - if global user attempts to delete user", async () => {
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

      await testGlobalUserDeletion(
        false,
        403,
        "Access denied. User must be a global admin!",
        undefined,
        undefined,
        undefined,
        0,
        0
      );
    });

    it("should return 403 and not delete user - if local admin attempts to delete user", async () => {
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

      await testGlobalUserDeletion(
        false,
        403,
        "Access denied. User must be a global admin!",
        undefined,
        undefined,
        undefined,
        0,
        0
      );
    });

    it("should return 403 and not delete user - if local user attempts to delete user", async () => {
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

      await testGlobalUserDeletion(
        false,
        403,
        "Access denied. User must be a global admin!",
        undefined,
        undefined,
        undefined,
        0,
        0
      );
    });

    it("should return 403 and not delete user - if user's jwt payload does not have tenant assigned", async () => {
      delete (userPayload as any).ten;

      //Assinging jwt to header
      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //GetAllUser should not be called - call ended before fetching user's data
      await testGlobalUserDeletion(
        false,
        403,
        "Access denied. Invalid application id generated from user payload!",
        0,
        undefined,
        undefined,
        0,
        0
      );
    });

    it("should return 403 and not delete user - if there is no application of given id", async () => {
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

      //GetAllUser should not be called - call ended before fetching user's data
      //GetAssets should be called x2 - try fetching fake app
      await testGlobalUserDeletion(
        false,
        403,
        "Access denied. Application of given id not found for the user!",
        0,
        2,
        undefined,
        0,
        0
      );
    });

    it("should return 403 and not delete user - if app id in user's payload and param differs", async () => {
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

      await testGlobalUserDeletion(
        false,
        403,
        "Access denied. No access to given application!",
        undefined,
        undefined,
        undefined,
        0,
        0
      );
    });

    it("should return 403 and not delete user - if there is no application data for given app", async () => {
      delete fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["main.app.config.json"];

      //GetAllUser should not be called - call ended before fetching user's data
      //47 calls of getFileContent - no file containing one main app data
      await testGlobalUserDeletion(
        false,
        403,
        "Access denied. Main application settings not found for the user!",
        0,
        undefined,
        47,
        0,
        0
      );
    });

    it("should return 403 and not delete user - if user has valid scope, doest not exist in user service but exists in file service", async () => {
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

      //49 calls of getFileContent - one additional user
      await testGlobalUserDeletion(
        false,
        403,
        "Access denied. User of given name not found!",
        undefined,
        undefined,
        49,
        0,
        0
      );
    });

    it("should return 403 and not delete user - if user has valid scope, exists in user service but does not exist in file service", async () => {
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

      await testGlobalUserDeletion(
        false,
        403,
        "Access denied. User does not exist for given app id!",
        undefined,
        undefined,
        undefined,
        0,
        0
      );
    });

    it("should return 403 and not delete user - if user has no access to the app - invalid scope", async () => {
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

      //0 calls of getAllUsers - not fetching user's data - checking scope before fetching
      await testGlobalUserDeletion(
        false,
        403,
        "Forbidden access. No scope found to access the app!",
        0,
        undefined,
        undefined,
        0,
        0
      );
    });

    it("should return 403 and not delete user - if subtenant user attempts to delete user for tenant app", async () => {
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

      await testGlobalUserDeletion(
        false,
        403,
        "Access denied. No access to given application!",
        undefined,
        undefined,
        undefined,
        0,
        0
      );
    });

    it("should return 403 and not delete user - if tenant user attempts to delete user for subtenant app", async () => {
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

      await testGlobalUserDeletion(
        false,
        403,
        "Access denied. No access to given application!",
        undefined,
        undefined,
        undefined,
        0,
        0
      );
    });

    it("should return 401 - if authorization token is invalid - no bearer prefix", async () => {
      requestHeaders["authorization"] = jwt.sign(userPayload, "testPrivateKey");

      //No calling getAllUsers - returning before fetching user's data
      await testGlobalUserDeletion(
        false,
        401,
        "Access denied. No token provided to fetch the user or token is invalid!",
        0,
        undefined,
        undefined,
        0,
        0
      );
    });

    it("should return 401 - if authorization token is invalid - invalid token", async () => {
      requestHeaders["authorization"] =
        "Bearer thisIsTheFakeValueOfTheJWTToken";

      //No calling getAllUsers - returning before fetching user's data
      await testGlobalUserDeletion(
        false,
        401,
        "Access denied. No token provided to fetch the user or token is invalid!",
        0,
        undefined,
        undefined,
        0,
        0
      );
    });

    it("should return 401 - if authorization token is invalid - no token provided", async () => {
      delete requestHeaders["authorization"];

      //No calling getAllUsers - returning before fetching user's data
      await testGlobalUserDeletion(
        false,
        401,
        "Access denied. No token provided to fetch the user or token is invalid!",
        0,
        undefined,
        undefined,
        0,
        0
      );
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========

    //#region ========== MINDSPHERE SERVICE THROWS ==========

    it("should return 500 and not delete user - if get all users throws", async () => {
      getAllUsersThrows = true;

      //0 calls for getAllUsers - becouse getAllUsers mock is overridden with a different mocked method
      await testGlobalUserDeletion(
        false,
        500,
        `Ups.. Something fails..`,
        0,
        undefined,
        undefined,
        0,
        0
      );

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test get all users error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    it("should return 500 and not delete user - if delete file throws", async () => {
      deleteFileThrows = true;

      //0 calls for delete file - becouse deleteFile mock is overridden with a different mocked method
      //API Calls for deleting user from mindsphere should have been called
      await testGlobalUserDeletion(
        false,
        500,
        `Ups.. Something fails..`,
        undefined,
        undefined,
        undefined,
        undefined,
        0
      );

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test delete file error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    it("should return 500 and not delete user - if add memeber to group fails", async () => {
      deleteUserThrows = true;

      //0 calls for delete file - it should not have been called
      //0 calls for deleting user - mocking it with different method that throws
      await testGlobalUserDeletion(
        false,
        500,
        `Ups.. Something fails..`,
        undefined,
        undefined,
        undefined,
        0,
        0
      );

      //#region ===== CHECKING LOGGING =====

      expect(logErrorMockFunc).toHaveBeenCalledTimes(1);
      expect(logErrorMockFunc.mock.calls[0][0]).toEqual(
        "Test delete user error"
      );

      //#endregion ===== CHECKING LOGGING =====
    });

    //#endregion ========== MINDSPHERE SERVICE THROWS ==========
  });
});

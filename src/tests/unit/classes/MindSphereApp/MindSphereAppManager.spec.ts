import { config } from "node-config-ts";
import {
  MindSphereApp,
  PlantPermissions,
  UserRole,
  UserStorageData,
  AppStorageData,
  PlantStorageData,
} from "../../../../classes/MindSphereApp/MindSphereApp";
import { MindSphereFileService } from "../../../../classes/MindSphereService/MindSphereFileService";
import { MindSphereUserService } from "../../../../classes/MindSphereService/MindSphereUserService";
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
} from "../../../utilities/mockMsAssetService";
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
} from "../../../utilities/mockMsFileService";
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
} from "../../../utilities/mockMsUserService";
import { MindSphereUserGroupService } from "../../../../classes/MindSphereService/MindSphereUserGroupService";
import {
  setPrivateProperty,
  testPrivateProperty,
} from "../../../utilities/utilities";
import {
  MindSphereAsset,
  MindSphereAssetService,
} from "../../../../classes/MindSphereService/MindSphereAssetService";
import { MindSphereAppsManager } from "../../../../classes/MindSphereApp/MindSphereAppsManager";

describe("MindSphereApp", () => {
  let userServiceContent: MockedUserServiceContent;
  let userGroupServiceContent: MockedUserGroupServiceContent;
  let fileServiceContent: MockedFileServiceContent;
  let assetServiceContent: MockedAssetServiceContent;

  beforeEach(() => {
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
          userName: "test_global_admin_11_user_name",
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
          userName: "test_local_admin_11_user_name",
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
          userName: "test_global_user_11_user_name",
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
          userName: "test_local_user_11_user_name",
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
          userName: "test_global_admin_12_user_name",
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
          userName: "test_local_admin_12_user_name",
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
          userName: "test_global_user_12_user_name",
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
          userName: "test_local_user_12_user_name",
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
          userName: "test_global_admin_21_user_name",
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
          userName: "test_local_admin_21_user_name",
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
          userName: "test_global_user_21_user_name",
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
          userName: "test_local_user_21_user_name",
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
          userName: "test_global_admin_22_user_name",
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
          userName: "test_local_admin_22_user_name",
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
          userName: "test_global_user_22_user_name",
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
          userName: "test_local_user_22_user_name",
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
          userName: "test_global_admin_31_user_name",
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
          userName: "test_local_admin_31_user_name",
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
          userName: "test_global_user_31_user_name",
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
          userName: "test_local_user_31_user_name",
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
          userName: "test_global_admin_32_user_name",
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
          userName: "test_local_admin_32_user_name",
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
          userName: "test_global_user_32_user_name",
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
          userName: "test_local_user_32_user_name",
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
          userName: "test_super_admin_1_user_name",
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
          userName: "test_super_admin_2_user_name",
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
          userName: "test_super_admin_3_user_name",
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
          userName: "test_super_admin_4_user_name",
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
        "ten-testTenant1-id": {
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
            userName: "test_global_admin_11_user_name",
            permissions: {
              role: UserRole.GlobalAdmin,
              permissions: {
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
            userName: "test_global_user_11_user_name",
            permissions: {
              role: UserRole.GlobalUser,
              permissions: {
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
            userName: "test_local_admin_11_user_name",
            permissions: {
              role: UserRole.LocalAdmin,
              permissions: {
                testPlant1: PlantPermissions.User,
                testPlant2: PlantPermissions.Admin,
              },
            },
          },
          "testLocalUser11.user.config.json": {
            data: {
              testPlant1: {
                testLocalUser11TestPlant1Data:
                  "testLocalUser11TestPlant1DataValue",
              },
              testPlant2: {
                testLocalUser11TestPlant2Data:
                  "testLocalUser11TestPlant2DataValue",
              },
            },
            config: {
              testPlant1: {
                testLocalUser11TestPlant1Config:
                  "testLocalUser11TestPlant1ConfigValue",
              },
              testPlant2: {
                testLocalUser11TestPlant2Config:
                  "testLocalUser11TestPlant2ConfigValue",
              },
            },
            userName: "test_local_user_11_user_name",
            permissions: {
              role: UserRole.LocalUser,
              permissions: {
                testPlant2: PlantPermissions.User,
                testPlant3: PlantPermissions.User,
              },
            },
          },
        },
        "ten-testTenant1-sub-subtenant1-id": {
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
            userName: "test_global_admin_12_user_name",
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
            userName: "test_global_user_12_user_name",
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
            userName: "test_local_admin_12_user_name",
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
              testPlant4: {
                testLocalUser12TestPlant4Data:
                  "testLocalUser12TestPlant4DataValue",
              },
              testPlant5: {
                testLocalUser12TestPlant5Data:
                  "testLocalUser12TestPlant5DataValue",
              },
            },
            config: {
              testPlant4: {
                testLocalUser12TestPlant4Config:
                  "testLocalUser12TestPlant4ConfigValue",
              },
              testPlant5: {
                testLocalUser12TestPlant5Config:
                  "testLocalUser12TestPlant5ConfigValue",
              },
            },
            userName: "test_local_user_12_user_name",
            permissions: {
              role: UserRole.LocalUser,
              plants: {
                testPlant5: PlantPermissions.User,
                testPlant6: PlantPermissions.User,
              },
            },
          },
        },
        "ten-testTenant2-id": {
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
            userName: "test_global_admin_21_user_name",
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
            userName: "test_global_user_21_user_name",
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
            userName: "test_local_admin_21_user_name",
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
              testPlant1: {
                testLocalUser21TestPlant1Data:
                  "testLocalUser21TestPlant1DataValue",
              },
              testPlant2: {
                testLocalUser21TestPlant2Data:
                  "testLocalUser21TestPlant2DataValue",
              },
            },
            config: {
              testPlant1: {
                testLocalUser21TestPlant1Config:
                  "testLocalUser21TestPlant1ConfigValue",
              },
              testPlant2: {
                testLocalUser21TestPlant2Config:
                  "testLocalUser21TestPlant2ConfigValue",
              },
            },
            userName: "test_local_user_21_user_name",
            permissions: {
              role: UserRole.LocalUser,
              plants: {
                testPlant2: PlantPermissions.User,
                testPlant3: PlantPermissions.User,
              },
            },
          },
        },
        "ten-testTenant2-sub-subtenant2-id": {
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
            userName: "test_global_admin_22_user_name",
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
            userName: "test_global_user_22_user_name",
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
            userName: "test_local_admin_22_user_name",
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
              testPlant4: {
                testLocalUser22TestPlant4Data:
                  "testLocalUser22TestPlant4DataValue",
              },
              testPlant5: {
                testLocalUser22TestPlant5Data:
                  "testLocalUser22TestPlant5DataValue",
              },
            },
            config: {
              testPlant4: {
                testLocalUser22TestPlant4Config:
                  "testLocalUser22TestPlant4ConfigValue",
              },
              testPlant5: {
                testLocalUser22TestPlant5Config:
                  "testLocalUser22TestPlant5ConfigValue",
              },
            },
            userName: "test_local_user_22_user_name",
            permissions: {
              role: UserRole.LocalUser,
              plants: {
                testPlant5: PlantPermissions.User,
                testPlant6: PlantPermissions.User,
              },
            },
          },
        },
        "ten-testTenant3-id": {
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
            userName: "test_global_admin_31_user_name",
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
            userName: "test_global_user_31_user_name",
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
            userName: "test_local_admin_31_user_name",
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
              testPlant1: {
                testLocalUser31TestPlant1Data:
                  "testLocalUser31TestPlant1DataValue",
              },
              testPlant2: {
                testLocalUser31TestPlant2Data:
                  "testLocalUser31TestPlant2DataValue",
              },
            },
            config: {
              testPlant1: {
                testLocalUser31TestPlant1Config:
                  "testLocalUser31TestPlant1ConfigValue",
              },
              testPlant2: {
                testLocalUser31TestPlant2Config:
                  "testLocalUser31TestPlant2ConfigValue",
              },
            },
            userName: "test_local_user_31_user_name",
            permissions: {
              role: UserRole.LocalUser,
              plants: {
                testPlant2: PlantPermissions.User,
                testPlant3: PlantPermissions.User,
              },
            },
          },
        },
        "ten-testTenant3-sub-subtenant3-id": {
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
            userName: "test_global_admin_32_user_name",
            permissions: {
              role: UserRole.GlobalAdmin,
              permissions: {
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
            userName: "test_global_user_32_user_name",
            permissions: {
              role: UserRole.GlobalUser,
              permissions: {
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
            userName: "test_local_admin_32_user_name",
            permissions: {
              role: UserRole.LocalAdmin,
              permissions: {
                testPlant4: PlantPermissions.User,
                testPlant5: PlantPermissions.Admin,
              },
            },
          },
          "testLocalUser32.user.config.json": {
            data: {
              testPlant4: {
                testLocalUser32TestPlant4Data:
                  "testLocalUser32TestPlant4DataValue",
              },
              testPlant5: {
                testLocalUser32TestPlant5Data:
                  "testLocalUser32TestPlant5DataValue",
              },
            },
            config: {
              testPlant4: {
                testLocalUser32TestPlant4Config:
                  "testLocalUser32TestPlant4ConfigValue",
              },
              testPlant5: {
                testLocalUser32TestPlant5Config:
                  "testLocalUser32TestPlant5ConfigValue",
              },
            },
            userName: "test_local_user_32_user_name",
            permissions: {
              role: UserRole.LocalUser,
              permissions: {
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
        "ten-testTenant1-id": {
          name: "ten-testTenant1",
          parentId: "testAppContainerAssetId",
          typeId: "testAppAssetType",
          assetId: "ten-testTenant1-id",
          etag: 0,
          tenantId: "hostTenant",
        },
        "ten-testTenant1-sub-subtenant1-id": {
          name: "ten-testTenant1-sub-subtenant1",
          parentId: "testAppContainerAssetId",
          typeId: "testAppAssetType",
          assetId: "ten-testTenant1-sub-subtenant1-id",
          etag: 0,
          tenantId: "hostTenant",
        },
        "ten-testTenant2-id": {
          name: "ten-testTenant2",
          parentId: "testAppContainerAssetId",
          typeId: "testAppAssetType",
          assetId: "ten-testTenant2-id",
          etag: 0,
          tenantId: "hostTenant",
        },
        "ten-testTenant2-sub-subtenant2-id": {
          name: "ten-testTenant2-sub-subtenant2",
          parentId: "testAppContainerAssetId",
          typeId: "testAppAssetType",
          assetId: "ten-testTenant2-sub-subtenant2-id",
          etag: 0,
          tenantId: "hostTenant",
        },
        "ten-testTenant3-id": {
          name: "ten-testTenant3",
          parentId: "testAppContainerAssetId",
          typeId: "testAppAssetType",
          assetId: "ten-testTenant3-id",
          etag: 0,
          tenantId: "hostTenant",
        },
        "ten-testTenant3-sub-subtenant3-id": {
          name: "ten-testTenant3-sub-subtenant3",
          parentId: "testAppContainerAssetId",
          typeId: "testAppAssetType",
          assetId: "ten-testTenant3-sub-subtenant3-id",
          etag: 0,
          tenantId: "hostTenant",
        },
      },
    };

    jest.clearAllMocks();
  });

  afterEach(() => {
    //Clearing MindSphereServices
    (MindSphereUserService as any)._instance = null;
    (MindSphereUserGroupService as any)._instance = null;
    (MindSphereFileService as any)._instance = null;
    (MindSphereAssetService as any)._instance = null;

    //Clearing app manager
    (MindSphereAppsManager as any)._instance = null;

    jest.clearAllMocks();
  });

  const beforeExec = async () => {
    await mockMsUserGroupService(userGroupServiceContent);
    await mockMsUserService(userServiceContent);
    await mockMsFileService(fileServiceContent);
    await mockMsAssetService(assetServiceContent);
  };

  describe("generateAppId", () => {
    let tenantId: string | null | undefined;
    let subtenantId: string | null | undefined;

    beforeEach(() => {
      tenantId = "testTenant1";
      subtenantId = "subtenant1";
    });

    let exec = () => {
      return MindSphereAppsManager.generateAppId(tenantId as any, subtenantId);
    };

    it("should generate valid app id based on tenantId and subtenantId", () => {
      let result = exec();

      expect(result).toEqual("ten-testTenant1-sub-subtenant1");
    });

    it("should generate valid app id based only on tenant - if subtenant id is null", () => {
      subtenantId = null;

      let result = exec();

      expect(result).toEqual("ten-testTenant1");
    });

    it("should generate valid app id based only on tenant - if subtenant id is undefined", () => {
      subtenantId = undefined;

      let result = exec();

      expect(result).toEqual("ten-testTenant1");
    });

    it("should return null if tenantId is null", () => {
      tenantId = null;

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return null if tenantId is undefined", () => {
      tenantId = undefined;

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return null if tenantId id is empty", () => {
      tenantId = "";

      let result = exec();

      expect(result).toEqual(null);
    });

    it("should return null if subtenantId id is empty", () => {
      subtenantId = "";

      let result = exec();

      expect(result).toEqual(null);
    });
  });

  describe("splitAppId", () => {
    let appId: string;

    beforeEach(() => {
      appId = "ten-testTenant1-sub-subtenant1";
    });

    let exec = () => {
      return MindSphereAppsManager.splitAppId(appId);
    };

    it("should retrieve tenant and subtenant name based on app id", () => {
      let result = exec();

      expect(result).toEqual({
        tenantName: "testTenant1",
        subtenantId: "subtenant1",
      });
    });

    it("should return subtenant as null - if there is no subtenant in name", () => {
      appId = "ten-testTenant1";

      let result = exec();

      expect(result).toEqual({
        tenantName: "testTenant1",
        subtenantId: null,
      });
    });

    it("should return subtenant as null - if there is no subtenant is empty", () => {
      appId = "ten-testTenant1-sub-";

      let result = exec();

      expect(result).toEqual({
        tenantName: "testTenant1",
        subtenantId: null,
      });
    });

    it("should throw if there is no tenant name", () => {
      appId = "testTenant1-sub-subtenant2";

      expect(exec).toThrow("No tenant found!");
    });

    it("should throw if tenant name is empty - subtenant exists", () => {
      appId = "ten--sub-subtenant2";

      expect(exec).toThrow("invalid tenant name");
    });

    it("should throw if tenant name is empty - subtenant doest no exist", () => {
      appId = "ten-";

      expect(exec).toThrow("invalid tenant name");
    });

    it("should throw if there are more subnet phrases -sub- then one", () => {
      appId = "ten-testTenant1-sub-subtenant2-sub-test";

      expect(exec).toThrow(
        `Invalid appId format: ten-testTenant1-sub-subtenant2-sub-test`
      );
    });
  });

  describe("getInstance", () => {
    let exec = () => {
      return MindSphereAppsManager.getInstance();
    };

    it("should return valid instance of MindSphereAppsManager", () => {
      let result = exec();

      expect(result).not.toEqual(null);
      expect(result instanceof MindSphereAppsManager).toEqual(true);
    });

    it("should return the same instance of MindSphereAppsManager if called several times", () => {
      let result1 = exec();
      let result2 = exec();
      let result3 = exec();

      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
      expect(result3).toEqual(result1);
    });

    it("should set proper values of properties", () => {
      let result = exec();

      testPrivateProperty(result, "_storageTenant", "hostTenant");
      testPrivateProperty(result, "_mainAssetId", "testAppContainerAssetId");
      testPrivateProperty(result, "_appAssetType", "testAppAssetType");
    });
  });

  describe("getAppAssetIdIfExists", () => {
    let mindSphereAppsManager: MindSphereAppsManager;
    let appId: string;
    let fetchAppBefore: boolean;
    let getAssetsThrows: boolean;

    beforeEach(async () => {
      appId = "ten-testTenant2-sub-subtenant2";
      fetchAppBefore = false;
      getAssetsThrows = false;
    });

    let exec = async () => {
      await beforeExec();
      mindSphereAppsManager = MindSphereAppsManager.getInstance();

      if (fetchAppBefore) {
        let newApp = new MindSphereApp(
          "hostTenant",
          appId,
          "ten-testTenant2-sub-subtenant2-id",
          "testTenant2",
          "subtenant2"
        );
        await newApp.init();
        setPrivateProperty(mindSphereAppsManager, "_apps", {
          [appId]: newApp,
        });
      }

      if (getAssetsThrows) {
        MindSphereAssetService.getInstance().getAssets = jest.fn(async () => {
          throw new Error("get assets test error");
        });
      }

      return mindSphereAppsManager.getAppAssetIdIfExists(appId);
    };

    it("should call MindSphereAssetService and return app asset id if it exists, and has not been fetched before", async () => {
      let result = await exec();

      expect(result).toEqual("ten-testTenant2-sub-subtenant2-id");

      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);
    });

    it("should not call MindSphereAssetService but return app asset id if it exists, and has been fetched before", async () => {
      fetchAppBefore = true;
      let result = await exec();

      expect(result).toEqual("ten-testTenant2-sub-subtenant2-id");

      expect(getAssets).not.toHaveBeenCalled();
    });

    it("should return null if app asset does not exist - wrong name", async () => {
      appId = "fakeAppId";

      let result = await exec();

      expect(result).toEqual(null);

      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        "fakeAppId",
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);
    });

    it("should return null if app asset does not exist - wrong asset type", async () => {
      assetServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-id"
      ].typeId = "fakeTypeId";

      let result = await exec();

      expect(result).toEqual(null);

      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);
    });

    it("should return null if app asset does not exist - wrong parent id", async () => {
      assetServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-id"
      ].parentId = "fakeParentId";

      let result = await exec();

      expect(result).toEqual(null);

      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);
    });

    it("should return null if app asset does not exist - no assets", async () => {
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
        },
      };

      let result = await exec();

      expect(result).toEqual(null);

      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);
    });

    it("should throw if getAssets throws", async () => {
      getAssetsThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "get assets test error",
      });
    });
  });

  describe("checkIfAppExists", () => {
    let mindSphereAppsManager: MindSphereAppsManager;
    let appId: string;
    let fetchAppBefore: boolean;
    let getAssetsThrows: boolean;

    beforeEach(async () => {
      appId = "ten-testTenant2-sub-subtenant2";
      fetchAppBefore = false;
      getAssetsThrows = false;
    });

    let exec = async () => {
      await beforeExec();
      mindSphereAppsManager = MindSphereAppsManager.getInstance();

      if (fetchAppBefore) {
        let newApp = new MindSphereApp(
          "hostTenant",
          appId,
          "ten-testTenant2-sub-subtenant2-id",
          "testTenant2",
          "subtenant2"
        );
        await newApp.init();
        setPrivateProperty(mindSphereAppsManager, "_apps", {
          [appId]: newApp,
        });
      }

      if (getAssetsThrows) {
        MindSphereAssetService.getInstance().getAssets = jest.fn(async () => {
          throw new Error("get assets test error");
        });
      }

      return mindSphereAppsManager.checkIfAppExists(appId);
    };

    it("should call MindSphereAssetService and return true if it exists, and has not been fetched before", async () => {
      let result = await exec();

      expect(result).toEqual(true);

      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);
    });

    it("should not call MindSphereAssetService but return true if it exists, and has been fetched before", async () => {
      fetchAppBefore = true;
      let result = await exec();

      expect(result).toEqual(true);

      expect(getAssets).not.toHaveBeenCalled();
    });

    it("should return false if app asset does not exist - wrong name", async () => {
      appId = "fakeAppId";

      let result = await exec();

      expect(result).toEqual(false);

      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        "fakeAppId",
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);
    });

    it("should return false if app asset does not exist - wrong asset type", async () => {
      assetServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-id"
      ].typeId = "fakeTypeId";

      let result = await exec();

      expect(result).toEqual(false);

      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);
    });

    it("should return false if app asset does not exist - wrong parent id", async () => {
      assetServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-id"
      ].parentId = "fakeParentId";

      let result = await exec();

      expect(result).toEqual(false);

      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);
    });

    it("should return null if app asset does not exist - no assets", async () => {
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
        },
      };

      let result = await exec();

      expect(result).toEqual(false);

      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);
    });

    it("should throw if getAssets throws", async () => {
      getAssetsThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "get assets test error",
      });
    });
  });

  /**
   * @description Method for checking if app has been fetched correctly - created, initialized, and assigned to the apps of manager
   * @param appId
   * @param appAssetId
   * @param appTenantName
   * @param appSubtenantId
   */
  const testIfAppWasFetchedProperly = async (
    appId: string,
    appAssetId: string,
    appTenantName: string,
    appSubtenantId: string | null
  ) => {
    let mindSphereAppsManager = MindSphereAppsManager.getInstance();

    //Getting the app
    let app = mindSphereAppsManager.Apps[appId];
    expect(app).toBeDefined();

    //Checking apps properties
    expect(app.AssetId).toEqual(appAssetId);
    expect(app.AppId).toEqual(appId);
    expect(app.TenantName).toEqual(appTenantName);
    expect(app.SubtenantId).toEqual(appSubtenantId);
    expect(app.StorageTenant).toEqual("hostTenant");
    testPrivateProperty(app, "_initialized", true);

    //Checking apps user groups
    let standardUserGroupPayload =
      userGroupServiceContent[appTenantName]["standardUserGroup"];
    expect(app.StandardUserGroup).toEqual(standardUserGroupPayload);

    let subtenantUserGroupPayload =
      userGroupServiceContent[appTenantName]["subtenantUserGroup"];
    expect(app.SubtenantUserGroup).toEqual(subtenantUserGroupPayload);

    let globalAdminGroupPayload =
      userGroupServiceContent[appTenantName]["globalAdminGroup"];
    expect(app.GlobalAdminGroup).toEqual(globalAdminGroupPayload);

    let globalUserGroupPayload =
      userGroupServiceContent[appTenantName]["globalUserGroup"];
    expect(app.GlobalUserGroup).toEqual(globalUserGroupPayload);

    let localAdminGroupPayload =
      userGroupServiceContent[appTenantName]["localAdminGroup"];
    expect(app.LocalAdminGroup).toEqual(localAdminGroupPayload);

    let localUserGroupPayload =
      userGroupServiceContent[appTenantName]["localUserGroup"];
    expect(app.LocalUserGroup).toEqual(localUserGroupPayload);

    //Checking calls for getting file names for every storage - at least 3 times
    expect(getAllFileNamesFromAsset.mock.calls.length).toBeGreaterThanOrEqual(
      3
    );
    expect(getAllFileNamesFromAsset.mock.calls).toContainEqual([
      "hostTenant",
      appAssetId,
      "app.config.json",
    ]);
    expect(getAllFileNamesFromAsset.mock.calls).toContainEqual([
      "hostTenant",
      appAssetId,
      "plant.config.json",
    ]);
    expect(getAllFileNamesFromAsset.mock.calls).toContainEqual([
      "hostTenant",
      appAssetId,
      "user.config.json",
    ]);

    //Checking calls for getting files
    let allAppFilePaths = Object.keys(
      fileServiceContent["hostTenant"][appAssetId]
    );

    let mainFilePaths = allAppFilePaths.filter((filePath) =>
      filePath.includes(".app.config.json")
    );
    let userFilePaths = allAppFilePaths.filter((filePath) =>
      filePath.includes(".user.config.json")
    );
    let plantFilePaths = allAppFilePaths.filter((filePath) =>
      filePath.includes(".plant.config.json")
    );

    //Every file should have been fetched
    expect(getFileContent.mock.calls.length).toBeGreaterThanOrEqual(
      mainFilePaths.length + userFilePaths.length + plantFilePaths.length
    );

    //Checking main files
    for (let filePath of mainFilePaths) {
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        appAssetId,
        filePath,
      ]);
    }

    //Checking user files
    for (let filePath of userFilePaths) {
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        appAssetId,
        filePath,
      ]);
    }

    //Checking plant files
    for (let filePath of plantFilePaths) {
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        appAssetId,
        filePath,
      ]);
    }

    //Checking app storage data
    let expectedAppStorageContent: any = {};
    for (let filePath of mainFilePaths) {
      let fileContent = fileServiceContent["hostTenant"][appAssetId][filePath];
      let fileId = filePath.replace(".app.config.json", "");
      expectedAppStorageContent[fileId] = fileContent;
    }
    expect((app as any)._appStorage._cacheData).toEqual(
      expectedAppStorageContent
    );

    //Checking user storage data
    let expectedUserStorageContent: any = {};
    for (let filePath of userFilePaths) {
      let fileContent = fileServiceContent["hostTenant"][appAssetId][filePath];
      let fileId = filePath.replace(".user.config.json", "");
      expectedUserStorageContent[fileId] = fileContent;
    }
    expect((app as any)._userStorage._cacheData).toEqual(
      expectedUserStorageContent
    );

    //Checking plant storage data
    let expectedPlantStorageContent: any = {};
    for (let filePath of plantFilePaths) {
      let fileContent = fileServiceContent["hostTenant"][appAssetId][filePath];
      let fileId = filePath.replace(".plant.config.json", "");
      expectedPlantStorageContent[fileId] = fileContent;
    }
    expect((app as any)._plantStorage._cacheData).toEqual(
      expectedPlantStorageContent
    );
  };

  describe("fetchApp", () => {
    let mindSphereAppsManager: MindSphereAppsManager;
    let appId: string;
    let appAssetId: string;
    let getAllFilesThrows: boolean;
    let fetchAppBefore: boolean;

    beforeEach(async () => {
      appId = "ten-testTenant2-sub-subtenant2";
      appAssetId = "ten-testTenant2-sub-subtenant2-id";
      getAllFilesThrows = false;
      fetchAppBefore = false;
    });

    let exec = async () => {
      await beforeExec();
      mindSphereAppsManager = MindSphereAppsManager.getInstance();

      if (fetchAppBefore) {
        let assetId = await mindSphereAppsManager.getAppAssetIdIfExists(appId);
        await mindSphereAppsManager.fetchApp(appId, assetId!);
      }

      if (getAllFilesThrows) {
        MindSphereFileService.getInstance().getAllFileNamesFromAsset = jest.fn(
          async () => {
            throw new Error("test get all files error");
          }
        );
      }

      return mindSphereAppsManager.fetchApp(appId, appAssetId);
    };

    it("should fetch app - create it, initialize it, assign it to the apps and then return it - if app id contains subtenant", async () => {
      let result = await exec();

      expect(result).toBeDefined();
      expect(result).toEqual(mindSphereAppsManager.Apps[appId]);

      await testIfAppWasFetchedProperly(
        appId,
        appAssetId,
        "testTenant2",
        "subtenant2"
      );
    });

    it("should fetch app - create it, initialize it, assign it to the apps and then return it - if app is not a subtenant app", async () => {
      appId = "ten-testTenant2";
      appAssetId = "ten-testTenant2-id";

      let result = await exec();

      expect(result).toBeDefined();
      expect(result).toEqual(mindSphereAppsManager.Apps[appId]);

      await testIfAppWasFetchedProperly(appId, appAssetId, "testTenant2", null);
    });

    it("should throw and not assigned app - if initialziation of the app throws", async () => {
      getAllFilesThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "test get all files error",
      });

      expect(mindSphereAppsManager.Apps[appId]).not.toBeDefined();
    });

    it("should throw and not assigned app - if there is no tenant id in app id", async () => {
      appId = "testTenant2";

      await expect(exec()).rejects.toMatchObject({
        message: "No tenant found!",
      });

      expect(mindSphereAppsManager.Apps[appId]).not.toBeDefined();
    });

    it("should throw and not assigned app - if there is no asset of given id", async () => {
      appAssetId = "ten-testTenant2-id-fake";

      await expect(exec()).rejects.toMatchObject({
        message: "Asset id not found in given tenant",
      });

      expect(mindSphereAppsManager.Apps[appId]).not.toBeDefined();
    });

    it("should refetch app - create it, initialize it, assign it to the apps and then return it - if app is a subtenant app and already exists", async () => {
      fetchAppBefore = true;

      let result = await exec();

      expect(result).toBeDefined();
      expect(result).toEqual(mindSphereAppsManager.Apps[appId]);

      await testIfAppWasFetchedProperly(
        appId,
        appAssetId,
        "testTenant2",
        "subtenant2"
      );

      //App should have been fetched twice
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(6);
      expect(getFileContent).toHaveBeenCalledTimes(16);
    });

    it("should refetch app - create it, initialize it, assign it to the apps and then return it - if app is a not subtenant app and already exists", async () => {
      fetchAppBefore = true;
      appId = "ten-testTenant2";
      appAssetId = "ten-testTenant2-id";

      let result = await exec();

      expect(result).toBeDefined();
      expect(result).toEqual(mindSphereAppsManager.Apps[appId]);

      await testIfAppWasFetchedProperly(appId, appAssetId, "testTenant2", null);

      //App should have been fetched twice
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(6);
      expect(getFileContent).toHaveBeenCalledTimes(16);
    });
  });

  describe("fetchAppFromAsset", () => {
    let mindSphereAppsManager: MindSphereAppsManager;
    let assetData: MindSphereAsset;
    let getAllFilesThrows: boolean;
    let fetchAppBefore: boolean;

    beforeEach(async () => {
      assetData = {
        name: "ten-testTenant2-sub-subtenant2",
        parentId: "testAppContainerAssetId",
        typeId: "testAppAssetType",
        assetId: "ten-testTenant2-sub-subtenant2-id",
      };
      getAllFilesThrows = false;
      fetchAppBefore = false;
    });

    let exec = async () => {
      await beforeExec();
      mindSphereAppsManager = MindSphereAppsManager.getInstance();

      if (fetchAppBefore) {
        await mindSphereAppsManager.fetchApp(
          assetData.name,
          assetData.assetId!
        );
      }

      if (getAllFilesThrows) {
        MindSphereFileService.getInstance().getAllFileNamesFromAsset = jest.fn(
          async () => {
            throw new Error("test get all files error");
          }
        );
      }

      return mindSphereAppsManager.fetchAppFromAsset(assetData);
    };

    it("should fetch app - create it, initialize it, assign it to the apps and then return it - if app id contains subtenant", async () => {
      let result = await exec();

      expect(result).toBeDefined();
      expect(result).toEqual(mindSphereAppsManager.Apps[assetData.name!]);

      await testIfAppWasFetchedProperly(
        assetData.name,
        assetData.assetId!,
        "testTenant2",
        "subtenant2"
      );
    });

    it("should fetch app - create it, initialize it, assign it to the apps and then return it - if app is not a subtenant app", async () => {
      assetData.name = "ten-testTenant2";
      assetData.assetId = "ten-testTenant2-id";

      let result = await exec();

      expect(result).toBeDefined();
      expect(result).toEqual(mindSphereAppsManager.Apps[assetData.name!]);

      await testIfAppWasFetchedProperly(
        assetData.name,
        assetData.assetId!,
        "testTenant2",
        null
      );
    });

    it("should throw and not assigned app - if initialziation of the app throws", async () => {
      getAllFilesThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "test get all files error",
      });

      expect(mindSphereAppsManager.Apps[assetData.name!]).not.toBeDefined();
    });

    it("should throw and not assigned app - if there is no tenant id in app id", async () => {
      assetData.name! = "testTenant2";

      await expect(exec()).rejects.toMatchObject({
        message: "No tenant found!",
      });

      expect(mindSphereAppsManager.Apps[assetData.name!]).not.toBeDefined();
    });

    it("should throw and not assigned app - if there is no asset of given id", async () => {
      assetData.assetId! = "ten-testTenant2-id-fake";

      await expect(exec()).rejects.toMatchObject({
        message: "Asset id not found in given tenant",
      });

      expect(mindSphereAppsManager.Apps[assetData.name!]).not.toBeDefined();
    });

    it("should throw and not assigned app - if there is no asset id in assets payload", async () => {
      delete assetData.assetId;

      await expect(exec()).rejects.toMatchObject({
        message: "assets id not defined!",
      });

      expect(mindSphereAppsManager.Apps[assetData.name!]).not.toBeDefined();
    });

    it("should throw and not assigned app - if there is no asset name in assets payload", async () => {
      delete (assetData as any).name;

      await expect(exec()).rejects.toMatchObject({
        message: "assets name not defined!",
      });
    });

    it("should refetch app - create it, initialize it, assign it to the apps and then return it - if app is a subtenant app and already exists", async () => {
      fetchAppBefore = true;

      let result = await exec();

      expect(result).toBeDefined();
      expect(result).toEqual(mindSphereAppsManager.Apps[assetData.name]);

      await testIfAppWasFetchedProperly(
        assetData.name,
        assetData.assetId!,
        "testTenant2",
        "subtenant2"
      );

      //App should have been fetched twice
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(6);
      expect(getFileContent).toHaveBeenCalledTimes(16);
    });

    it("should refetch app - create it, initialize it, assign it to the apps and then return it - if app is a not subtenant app and already exists", async () => {
      fetchAppBefore = true;
      assetData.name = "ten-testTenant2";
      assetData.assetId = "ten-testTenant2-id";

      let result = await exec();

      expect(result).toBeDefined();
      expect(result).toEqual(mindSphereAppsManager.Apps[assetData.name]);

      await testIfAppWasFetchedProperly(
        assetData.name,
        assetData.assetId!,
        "testTenant2",
        null
      );

      //App should have been fetched twice
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(6);
      expect(getFileContent).toHaveBeenCalledTimes(16);
    });
  });

  describe("getApp", () => {
    let mindSphereAppsManager: MindSphereAppsManager;
    let fetchAppBefore: boolean;
    let appId: string;
    let getAllFilesThrows: boolean;
    let getAssetsThrows: boolean;

    beforeEach(async () => {
      appId = "ten-testTenant2-sub-subtenant2";
      fetchAppBefore = false;
      getAllFilesThrows = false;
      getAssetsThrows = false;
    });

    let exec = async () => {
      await beforeExec();
      mindSphereAppsManager = MindSphereAppsManager.getInstance();
      if (fetchAppBefore) {
        let assetId = await mindSphereAppsManager.getAppAssetIdIfExists(appId);
        await mindSphereAppsManager.fetchApp(appId, assetId!);
      }

      if (getAllFilesThrows) {
        MindSphereFileService.getInstance().getAllFileNamesFromAsset = jest.fn(
          async () => {
            throw new Error("test get all files error");
          }
        );
      }

      if (getAssetsThrows) {
        MindSphereAssetService.getInstance().getAssets = jest.fn(async () => {
          throw new Error("test get assets error");
        });
      }

      return mindSphereAppsManager.getApp(appId);
    };

    it("should get apps asset id to fetch it first - if app is a subtenant app", async () => {
      await exec();

      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);
    });

    it("should get apps asset id to fetch it first - if app is a tenant app", async () => {
      appId = "ten-testTenant2";
      await exec();

      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2",
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);
    });

    it("should throw and not fetch the app - if app does not exist - if app is a subtenant app", async () => {
      delete assetServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-id"
      ];

      await expect(exec()).rejects.toMatchObject({
        message: "App ten-testTenant2-sub-subtenant2 does not exist!",
      });

      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //Any mindsphere API should not have been called except getAssets
      expect(getAllFileNamesFromAsset).not.toHaveBeenCalled();
      expect(getFileContent).not.toHaveBeenCalled();

      //App should not exist in manager
      expect(mindSphereAppsManager.Apps[appId]).not.toBeDefined();
    });

    it("should throw and not fetch the app - if app does not exist - if app is a tenant app", async () => {
      appId = "ten-testTenant2";
      delete assetServiceContent["hostTenant"]["ten-testTenant2-id"];

      await expect(exec()).rejects.toMatchObject({
        message: "App ten-testTenant2 does not exist!",
      });

      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2",
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //Any mindsphere API should not have been called except getAssets
      expect(getAllFileNamesFromAsset).not.toHaveBeenCalled();
      expect(getFileContent).not.toHaveBeenCalled();

      //App should not exist in manager
      expect(mindSphereAppsManager.Apps[appId]).not.toBeDefined();
    });

    it("should fetch the app, and return it - if it has not been fetched before - if app is a subtenant app", async () => {
      let result = await exec();

      expect(result).toBeDefined();
      expect(result).toEqual(mindSphereAppsManager.Apps[appId]);

      await testIfAppWasFetchedProperly(
        appId,
        result.AssetId,
        "testTenant2",
        "subtenant2"
      );
    });

    it("should fetch the app, and return it - if it has not been fetched before - if app is a tenant app", async () => {
      appId = "ten-testTenant2";
      let result = await exec();

      expect(result).toBeDefined();
      expect(result).toEqual(mindSphereAppsManager.Apps[appId]);

      await testIfAppWasFetchedProperly(
        appId,
        result.AssetId,
        "testTenant2",
        null
      );
    });

    it("should not fetch the app again, but only return it - if it has already been fetched", async () => {
      fetchAppBefore = true;

      let result = await exec();

      expect(result).toBeDefined();
      expect(result).toEqual(mindSphereAppsManager.Apps[appId]);

      await testIfAppWasFetchedProperly(
        appId,
        result.AssetId,
        "testTenant2",
        "subtenant2"
      );

      //App should have been fetched only one time
      //Checking calls for getting file names for every storage - exactly three times, for one app and three storages - app, user and plants
      expect(getAllFileNamesFromAsset.mock.calls.length).toEqual(3);
    });

    it("should not fetch the app again, but only return it - if it has already been fetched, app is a tenant app", async () => {
      appId = "ten-testTenant2";
      fetchAppBefore = true;

      let result = await exec();

      expect(result).toBeDefined();
      expect(result).toEqual(mindSphereAppsManager.Apps[appId]);

      await testIfAppWasFetchedProperly(
        appId,
        result.AssetId,
        "testTenant2",
        null
      );

      //App should have been fetched only one time
      //Checking calls for getting file names for every storage - exactly three times, for one app and three storages - app, user and plants
      expect(getAllFileNamesFromAsset.mock.calls.length).toEqual(3);
    });

    it("should throw and not assigned the app - if get assets throws", async () => {
      getAssetsThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "test get assets error",
      });

      expect(mindSphereAppsManager.Apps[appId]).not.toBeDefined();

      //Any mindsphere API should not have been called except getAssets
      expect(getAllFileNamesFromAsset).not.toHaveBeenCalled();
      expect(getFileContent).not.toHaveBeenCalled();

      //App should not exist in manager
      expect(mindSphereAppsManager.Apps[appId]).not.toBeDefined();
    });

    it("should throw and not assigned the app - if initialziation of the app throws", async () => {
      getAllFilesThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "test get all files error",
      });

      expect(mindSphereAppsManager.Apps[appId]).not.toBeDefined();
    });
  });

  describe("getAllAppAssets", () => {
    let mindSphereAppsManager: MindSphereAppsManager;
    let fetchAppBefore: boolean;
    let getAssetsThrows: boolean;

    beforeEach(async () => {
      fetchAppBefore = false;
      getAssetsThrows = false;
    });

    let exec = async () => {
      await beforeExec();
      mindSphereAppsManager = MindSphereAppsManager.getInstance();

      if (getAssetsThrows) {
        MindSphereAssetService.getInstance().getAssets = jest.fn(async () => {
          throw new Error("test get assets error");
        });
      }

      return mindSphereAppsManager.getAllAppAssets();
    };

    it("should get and return all apps assets", async () => {
      let result = await exec();

      //All assets with proper type and proper parent id should have been returned
      let expectedResult = Object.values(
        assetServiceContent["hostTenant"]
      ).filter(
        (asset) =>
          asset.typeId === "testAppAssetType" &&
          asset.parentId === "testAppContainerAssetId"
      );
      expect(result).toEqual(expectedResult);

      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);
    });

    it("should get and return all apps assets - if there are more assets with different parentId or different asset type", async () => {
      let result = await exec();

      //Asset with invalid parent id
      assetServiceContent["hostTenant"]["fakeAsset1Id"] = {
        name: "fakeAsset1",
        parentId: "fakeParentId",
        typeId: "testAppAssetType",
        assetId: "fakeAsset1Id",
      };

      //Asset with invalid type id
      assetServiceContent["hostTenant"]["fakeAsset2Id"] = {
        name: "fakeAsset2",
        parentId: "testAppContainerAssetId",
        typeId: "fakeAppAssetType",
        assetId: "fakeAsset2Id",
      };

      //Asset with invalid type id and parent id
      assetServiceContent["hostTenant"]["fakeAsset3Id"] = {
        name: "fakeAsset3",
        parentId: "fakeParentId",
        typeId: "fakeAppAssetType",
        assetId: "fakeAsset3Id",
      };

      //All assets with proper type and proper parent id should have been returned
      let expectedResult = Object.values(
        assetServiceContent["hostTenant"]
      ).filter(
        (asset) =>
          asset.typeId === "testAppAssetType" &&
          asset.parentId === "testAppContainerAssetId"
      );
      expect(result).toEqual(expectedResult);

      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);
    });

    it("should not fetch any app", async () => {
      await exec();

      expect(mindSphereAppsManager.Apps).toEqual({});
    });

    it("should throw if getAssets throws", async () => {
      getAssetsThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "test get assets error",
      });

      expect(mindSphereAppsManager.Apps).toEqual({});
    });
  });

  describe("deregisterApp", () => {
    let mindSphereAppsManager: MindSphereAppsManager;
    let fetchAppBefore: boolean;
    let appId: string;
    let deleteAssetThrows: boolean;
    let getAssetsThrows: boolean;

    beforeEach(async () => {
      appId = "ten-testTenant2-sub-subtenant2";
      fetchAppBefore = true;
      deleteAssetThrows = false;
      getAssetsThrows = false;
    });

    let exec = async () => {
      await beforeExec();
      mindSphereAppsManager = MindSphereAppsManager.getInstance();

      if (fetchAppBefore) {
        let assetId = await mindSphereAppsManager.getAppAssetIdIfExists(appId);
        await mindSphereAppsManager.fetchApp(appId, assetId!);
      }

      if (deleteAssetThrows) {
        MindSphereAssetService.getInstance().deleteAsset = jest.fn(async () => {
          throw new Error("test delete asset error");
        });
      }

      if (getAssetsThrows) {
        MindSphereAssetService.getInstance().getAssets = jest.fn(async () => {
          throw new Error("test get assets error");
        });
      }

      return mindSphereAppsManager.deregisterApp(appId);
    };

    it("should delete app - if app has been fetched before and is a subtenant app", async () => {
      await exec();

      //First - there should be a check if asset exists
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //Second - asset should have been deleted
      expect(deleteAsset).toHaveBeenCalledTimes(1);
      expect(deleteAsset.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
      ]);

      //Application should not be present in manager
      expect(
        mindSphereAppsManager.Apps["ten-testTenant2-sub-subtenant2"]
      ).not.toBeDefined();
    });

    it("should delete app - if app has not been fetched before and is a subtenant app", async () => {
      fetchAppBefore = false;

      await exec();

      //First - there should be a check if asset exists
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //Second - asset should have been deleted
      expect(deleteAsset).toHaveBeenCalledTimes(1);
      expect(deleteAsset.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
      ]);

      //Application should not be present in manager
      expect(
        mindSphereAppsManager.Apps["ten-testTenant2-sub-subtenant2"]
      ).not.toBeDefined();
    });

    it("should delete app - if app has been fetched before and is a tenant app", async () => {
      appId = "ten-testTenant2";

      await exec();

      //First - there should be a check if asset exists
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2",
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //Second - asset should have been deleted
      expect(deleteAsset).toHaveBeenCalledTimes(1);
      expect(deleteAsset.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-id",
      ]);

      //Application should not be present in manager
      expect(mindSphereAppsManager.Apps["ten-testTenant2"]).not.toBeDefined();
    });

    it("should delete app - if app has not been fetched before and is a tenant app", async () => {
      appId = "ten-testTenant2";
      fetchAppBefore = false;

      await exec();

      //First - there should be a check if asset exists
      expect(getAssets).toHaveBeenCalledTimes(1);
      expect(getAssets.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2",
        "testAppContainerAssetId",
        "testAppAssetType",
      ]);

      //Second - asset should have been deleted
      expect(deleteAsset).toHaveBeenCalledTimes(1);
      expect(deleteAsset.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-id",
      ]);

      //Application should not be present in manager
      expect(mindSphereAppsManager.Apps["ten-testTenant2"]).not.toBeDefined();
    });

    it("should throw and not delete the app - if get assets throws", async () => {
      //app cannot be fetched - becouse the the AppExists will return true if it exists in payload
      fetchAppBefore = false;
      getAssetsThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "test get assets error",
      });

      //Second - asset should have not have been called
      expect(deleteAsset).not.toHaveBeenCalled();
    });

    it("should throw and not delete the app - if delete asset throws", async () => {
      deleteAssetThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "test delete asset error",
      });

      //Application should be present in manager
      expect(
        mindSphereAppsManager.Apps["ten-testTenant2-sub-subtenant2"]
      ).toBeDefined();
      expect(
        mindSphereAppsManager.Apps["ten-testTenant2-sub-subtenant2"].AppId
      ).toEqual(appId);
    });

    it("should throw and not delete the app - if app does not exist", async () => {
      appId = "ten-testTenant2-sub-subtenant3";
      //Cannot fetch app that is not present - with invalid appId
      fetchAppBefore = false;

      await expect(exec()).rejects.toMatchObject({
        message: `App ten-testTenant2-sub-subtenant3 does not exist!`,
      });

      //Second - asset should have not have been called
      expect(deleteAsset).not.toHaveBeenCalled();
    });
  });

  describe("registerApp", () => {
    let mindSphereAppsManager: MindSphereAppsManager;
    let appId: string;
    let createAssetThrows: boolean;
    let getAssetsThrows: boolean;
    let fetchAppBefore: boolean;
    let appInstanceBefore: MindSphereApp;
    let getAllFilesThrows: boolean;

    beforeEach(async () => {
      appId = "ten-testTenant2-sub-subtenant3";
      createAssetThrows = false;
      getAssetsThrows = false;
      fetchAppBefore = false;
      getAllFilesThrows = false;
    });

    let exec = async () => {
      await beforeExec();
      mindSphereAppsManager = MindSphereAppsManager.getInstance();

      if (fetchAppBefore) {
        let assetId = await mindSphereAppsManager.getAppAssetIdIfExists(appId);
        appInstanceBefore = await mindSphereAppsManager.fetchApp(
          appId,
          assetId!
        );
      }

      if (createAssetThrows) {
        MindSphereAssetService.getInstance().createAsset = jest.fn(async () => {
          throw new Error("test create asset error");
        });
      }

      if (getAssetsThrows) {
        MindSphereAssetService.getInstance().getAssets = jest.fn(async () => {
          throw new Error("test get assets error");
        });
      }

      if (getAllFilesThrows) {
        MindSphereFileService.getInstance().getAllFileNamesFromAsset = jest.fn(
          async () => {
            throw new Error("test get all files error");
          }
        );
      }

      return mindSphereAppsManager.registerNewApp(appId);
    };

    it("should create, register and return new app - if it is a subtenant app", async () => {
      //It is not neccessary to create new user groups for app - tenant already exists with valid user groups
      let result = await exec();

      //CHECKING RESULT

      //Checking apps properties
      expect(result.AssetId).toBeDefined();
      expect(result.AppId).toEqual(appId);
      expect(result.TenantName).toEqual("testTenant2");
      expect(result.SubtenantId).toEqual("subtenant3");
      expect(result.StorageTenant).toEqual("hostTenant");
      testPrivateProperty(result, "_initialized", true);

      //Checking apps user groups
      let standardUserGroupPayload =
        userGroupServiceContent["testTenant2"]["standardUserGroup"];
      expect(result.StandardUserGroup).toEqual(standardUserGroupPayload);

      let subtenantUserGroupPayload =
        userGroupServiceContent["testTenant2"]["subtenantUserGroup"];
      expect(result.SubtenantUserGroup).toEqual(subtenantUserGroupPayload);

      let globalAdminGroupPayload =
        userGroupServiceContent["testTenant2"]["globalAdminGroup"];
      expect(result.GlobalAdminGroup).toEqual(globalAdminGroupPayload);

      let globalUserGroupPayload =
        userGroupServiceContent["testTenant2"]["globalUserGroup"];
      expect(result.GlobalUserGroup).toEqual(globalUserGroupPayload);

      let localAdminGroupPayload =
        userGroupServiceContent["testTenant2"]["localAdminGroup"];
      expect(result.LocalAdminGroup).toEqual(localAdminGroupPayload);

      let localUserGroupPayload =
        userGroupServiceContent["testTenant2"]["localUserGroup"];
      expect(result.LocalUserGroup).toEqual(localUserGroupPayload);

      //Checking calls for getting file names for every storage - at least 3 times
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(3);
      expect(getAllFileNamesFromAsset.mock.calls).toContainEqual([
        "hostTenant",
        result.AssetId,
        "app.config.json",
      ]);
      expect(getAllFileNamesFromAsset.mock.calls).toContainEqual([
        "hostTenant",
        result.AssetId,
        "plant.config.json",
      ]);
      expect(getAllFileNamesFromAsset.mock.calls).toContainEqual([
        "hostTenant",
        result.AssetId,
        "user.config.json",
      ]);

      //Asset is empty - get file content should not have been called
      expect(getFileContent).not.toHaveBeenCalled();

      //Checking app storage data
      expect((result as any)._appStorage._cacheData).toEqual({});

      //Checking user storage data
      expect((result as any)._userStorage._cacheData).toEqual({});

      //Checking plant storage data
      expect((result as any)._plantStorage._cacheData).toEqual({});

      //CHECKING APP MANAGER

      //Application should be present in manager
      expect(mindSphereAppsManager.Apps[appId]).toBeDefined();

      //Result should be equal to the app in mindSphereAppsManager
      expect(result).toEqual(mindSphereAppsManager.Apps[appId]);
    });

    it("should create, register and return new app - if it is a tenant app", async () => {
      //Tenant has not existed before so it must contain app users groups - creating it in userGroupsContent

      userGroupServiceContent["testTenant4"] = {
        globalAdminGroup: {
          id: "globalAdminGroup",
          description: "globalAdminGroupDescription",
          displayName: "globalAdminGroupDisplayName",
          members: [],
        },
        globalUserGroup: {
          id: "globalUserGroup",
          description: "globalUserGroupDescription",
          displayName: "globalUserGroupDisplayName",
          members: [],
        },
        localUserGroup: {
          id: "localUserGroup",
          description: "localUserGroupDescription",
          displayName: "localUserGroupDisplayName",
          members: [],
        },
        localAdminGroup: {
          id: "localAdminGroup",
          description: "localAdminGroupDescription",
          displayName: "localAdminGroupDisplayName",
          members: [],
        },
        standardUserGroup: {
          id: "standardUserGroup",
          description: "standardUserGroupDescription",
          displayName: "standardUserGroupDisplayName",
          members: [],
        },
        subtenantUserGroup: {
          id: "subtenantUserGroup",
          description: "subtenantUserGroupDescription",
          displayName: "subtenantUserGroupDisplayName",
          members: [],
        },
      };

      appId = "ten-testTenant4";

      let result = await exec();

      //CHECKING RESULT

      //Checking apps properties
      expect(result.AssetId).toBeDefined();
      expect(result.AppId).toEqual(appId);
      expect(result.TenantName).toEqual("testTenant4");
      expect(result.SubtenantId).toEqual(null);
      expect(result.StorageTenant).toEqual("hostTenant");
      testPrivateProperty(result, "_initialized", true);

      //Checking apps user groups
      let standardUserGroupPayload =
        userGroupServiceContent["testTenant4"]["standardUserGroup"];
      expect(result.StandardUserGroup).toEqual(standardUserGroupPayload);

      let subtenantUserGroupPayload =
        userGroupServiceContent["testTenant4"]["subtenantUserGroup"];
      expect(result.SubtenantUserGroup).toEqual(subtenantUserGroupPayload);

      let globalAdminGroupPayload =
        userGroupServiceContent["testTenant4"]["globalAdminGroup"];
      expect(result.GlobalAdminGroup).toEqual(globalAdminGroupPayload);

      let globalUserGroupPayload =
        userGroupServiceContent["testTenant4"]["globalUserGroup"];
      expect(result.GlobalUserGroup).toEqual(globalUserGroupPayload);

      let localAdminGroupPayload =
        userGroupServiceContent["testTenant4"]["localAdminGroup"];
      expect(result.LocalAdminGroup).toEqual(localAdminGroupPayload);

      let localUserGroupPayload =
        userGroupServiceContent["testTenant4"]["localUserGroup"];
      expect(result.LocalUserGroup).toEqual(localUserGroupPayload);

      //Checking calls for getting file names for every storage - at least 3 times
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(3);
      expect(getAllFileNamesFromAsset.mock.calls).toContainEqual([
        "hostTenant",
        result.AssetId,
        "app.config.json",
      ]);
      expect(getAllFileNamesFromAsset.mock.calls).toContainEqual([
        "hostTenant",
        result.AssetId,
        "plant.config.json",
      ]);
      expect(getAllFileNamesFromAsset.mock.calls).toContainEqual([
        "hostTenant",
        result.AssetId,
        "user.config.json",
      ]);

      //Asset is empty - get file content should not have been called
      expect(getFileContent).not.toHaveBeenCalled();

      //Checking app storage data
      expect((result as any)._appStorage._cacheData).toEqual({});

      //Checking user storage data
      expect((result as any)._userStorage._cacheData).toEqual({});

      //Checking plant storage data
      expect((result as any)._plantStorage._cacheData).toEqual({});

      //CHECKING APP MANAGER

      //Application should be present in manager
      expect(mindSphereAppsManager.Apps[appId]).toBeDefined();

      //Result should be equal to the app in mindSphereAppsManager
      expect(result).toEqual(mindSphereAppsManager.Apps[appId]);
    });

    it("should throw and not create new asset - if app already exists but is not fetched - if it is a subtenant app", async () => {
      appId = "ten-testTenant2-sub-subtenant2";

      await expect(exec()).rejects.toMatchObject({
        message: "App ten-testTenant2-sub-subtenant2 already exists!",
      });

      expect(createAsset).not.toHaveBeenCalled();

      //Application should not have been fetched or created
      expect(mindSphereAppsManager.Apps[appId]).not.toBeDefined();
    });

    it("should throw and not create new asset - if app already exists but is not fetched - if it is a tenant app", async () => {
      appId = "ten-testTenant2";

      await expect(exec()).rejects.toMatchObject({
        message: "App ten-testTenant2 already exists!",
      });

      expect(createAsset).not.toHaveBeenCalled();

      //Application should not have been fetched or created
      expect(mindSphereAppsManager.Apps[appId]).not.toBeDefined();
    });

    it("should throw and not create new asset - if app already exists but is not fetched - if it is a subtenant app", async () => {
      fetchAppBefore = true;
      appId = "ten-testTenant2-sub-subtenant2";

      await expect(exec()).rejects.toMatchObject({
        message: "App ten-testTenant2-sub-subtenant2 already exists!",
      });

      expect(createAsset).not.toHaveBeenCalled();

      //Checking if app instance was not modified
      expect(mindSphereAppsManager.Apps[appId] === appInstanceBefore).toEqual(
        true
      );
    });

    it("should throw and not create new asset - if app already exists but is not fetched - if it is a tenant app", async () => {
      fetchAppBefore = true;
      appId = "ten-testTenant2";

      await expect(exec()).rejects.toMatchObject({
        message: "App ten-testTenant2 already exists!",
      });

      expect(createAsset).not.toHaveBeenCalled();

      //Checking if app instance was not modified
      expect(mindSphereAppsManager.Apps[appId] === appInstanceBefore).toEqual(
        true
      );
    });

    it("should throw and not create new app - if create asset throws", async () => {
      createAssetThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "test create asset error",
      });

      //Application should not have been fetched or created
      expect(mindSphereAppsManager.Apps[appId]).not.toBeDefined();
    });

    it("should throw and not create new app - if getAssetsThrows throws", async () => {
      getAssetsThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "test get assets error",
      });

      //Application should not have been fetched or created
      expect(mindSphereAppsManager.Apps[appId]).not.toBeDefined();
    });

    it("should throw and not create new app - if app throws during initialziation", async () => {
      getAllFilesThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "test get all files error",
      });

      //Application should not have been fetched or created
      expect(mindSphereAppsManager.Apps[appId]).not.toBeDefined();
    });
  });
});

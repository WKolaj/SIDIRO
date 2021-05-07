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
import {
  MindSphereUserGroupData,
  MindSphereUserGroupService,
} from "../../../../classes/MindSphereService/MindSphereUserGroupService";
import { MindSphereUserService } from "../../../../classes/MindSphereService/MindSphereUserService";
import { MindSphereUserJWTData } from "../../../../middleware/tokenData/fetchTokenData";
import { cloneObject } from "../../../../utilities/utilities";
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
import {
  setPrivateProperty,
  testPrivateProperty,
} from "../../../utilities/utilities";

describe("MindSphereApp", () => {
  let userServiceContent: MockedUserServiceContent;
  let userGroupServiceContent: MockedUserGroupServiceContent;
  let fileServiceContent: MockedFileServiceContent;

  beforeEach(() => {
    //Clearing MindSphereServices
    (MindSphereUserService as any)._instance = null;
    (MindSphereUserGroupService as any)._instance = null;
    (MindSphereFileService as any)._instance = null;

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

    jest.clearAllMocks();
  });

  afterEach(() => {
    //Clearing MindSphereServices
    (MindSphereUserService as any)._instance = null;
    (MindSphereUserGroupService as any)._instance = null;
    (MindSphereFileService as any)._instance = null;

    jest.clearAllMocks();
  });

  const beforeExec = async () => {
    await mockMsUserGroupService(userGroupServiceContent);
    await mockMsUserService(userServiceContent);
    await mockMsFileService(fileServiceContent);
  };

  //#region ===== AUTHORIZATION & AUTHENTICATION =====

  describe("getSuperAdminUserIds", () => {
    let superAdminUserIdEnvVar: string;

    beforeEach(() => {
      superAdminUserIdEnvVar =
        "testSuperAdmin1 testSuperAdmin2 testSuperAdmin3";
    });

    let exec = async () => {
      await beforeExec();
      (config.userPermissions
        .superAdminUserIds as any) = superAdminUserIdEnvVar;
      return MindSphereApp.getSuperAdminUserIds();
    };

    it("should return collection of super admin users id - if there are several ids", async () => {
      let result = await exec();
      expect(result).toEqual([
        "testSuperAdmin1",
        "testSuperAdmin2",
        "testSuperAdmin3",
      ]);
    });

    it("should return collection of super admin users id - if there is only one super admin id", async () => {
      superAdminUserIdEnvVar = "testSuperAdmin1";
      let result = await exec();
      expect(result).toEqual(["testSuperAdmin1"]);
    });

    it("should return empty array if there is no super admin id", async () => {
      superAdminUserIdEnvVar = "";
      let result = await exec();
      expect(result).toEqual([]);
    });
  });

  describe("isSuperAdmin", () => {
    let superAdminUserIdEnvVar: string;
    let hostTenantEnvVar: string;
    let userData: MindSphereUserJWTData;

    beforeEach(() => {
      superAdminUserIdEnvVar =
        "testSuperAdmin1 testSuperAdmin2 testSuperAdmin3 testSuperAdmin4";
      hostTenantEnvVar = "hostTenant";
      userData = {
        client_id: "testClientId",
        email: "testEmail",
        scope: [],
        ten: "hostTenant",
        user_name: "test_super_admin_3_user_name",
        subtenant: "subtenant4",
      };
    });

    let exec = async () => {
      await beforeExec();
      (config.userPermissions
        .superAdminUserIds as any) = superAdminUserIdEnvVar;
      (config.appCredentials.hostTenant as any) = hostTenantEnvVar;
      return MindSphereApp.isSuperAdmin(userData);
    };

    it("should call mindSphere get all users method - to check if user of given email exists for tenant and subtenant and return true if user exists and its id is inside superAdminIds env", async () => {
      //superAdmins 1 and superAdmins 2 are users with subtenants
      let result = await exec();

      expect(result).toEqual(true);

      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "hostTenant",
        "subtenant4",
        null,
        "test_super_admin_3_user_name",
      ]);
    });

    it("should call mindSphere get all users method - to check if user of given email exists for tenant and subtenant and return true if user exists and its id is inside superAdminIds env - if there is no subtenant for user", async () => {
      //superAdmins 1 and superAdmins 2 are users without subtenants
      userData = {
        client_id: "testClientId",
        email: "testEmail",
        scope: [],
        ten: "hostTenant",
        user_name: "test_super_admin_2_user_name",
      };

      let result = await exec();
      expect(result).toEqual(true);

      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "hostTenant",
        null,
        null,
        "test_super_admin_2_user_name",
      ]);
    });

    it("should call mindSphere get all users method - to check if user of given email exists for tenant and subtenant and return false if there is no user returned by this API CALL", async () => {
      userData.user_name = "fakeUser";

      let result = await exec();

      expect(result).toEqual(false);

      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "hostTenant",
        "subtenant4",
        null,
        "fakeUser",
      ]);
    });

    it("should call mindSphere get all users method - to check if user of given email exists for tenant and subtenant and return false if user returned by API call has no id given", async () => {
      delete userServiceContent["hostTenant"]["testSuperAdmin3"].id;

      let result = await exec();

      expect(result).toEqual(false);

      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "hostTenant",
        "subtenant4",
        null,
        "test_super_admin_3_user_name",
      ]);
    });

    it("should call mindSphere get all users method - to check if user of given email exists for tenant and subtenant and return false if user is from different tenant then host tenant", async () => {
      userData = {
        client_id: "testClientId",
        email: "testEmail",
        scope: [],
        ten: "fakeTenant",
        user_name: "test_super_admin_2_user_name",
      };

      let result = await exec();
      expect(result).toEqual(false);
      expect(getAllUsers).not.toHaveBeenCalled();
    });

    it("should call mindSphere get all users method - to check if user of given email exists for tenant and subtenant and return false if user id is not present in superAdminIds in env", async () => {
      superAdminUserIdEnvVar =
        "testSuperAdmin1 testSuperAdmin2 testSuperAdmin4";

      let result = await exec();
      expect(result).toEqual(false);

      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "hostTenant",
        "subtenant4",
        null,
        "test_super_admin_3_user_name",
      ]);
    });

    it("should call mindSphere get all users method - to check if user of given email exists for tenant and subtenant and return false if there is not superAdminIds in env", async () => {
      superAdminUserIdEnvVar = "";

      let result = await exec();

      expect(result).toEqual(false);

      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "hostTenant",
        "subtenant4",
        null,
        "test_super_admin_3_user_name",
      ]);
    });

    it("should call mindSphere get all users method - to check if user of given email exists for tenant and subtenant and there is only one user in superAdminIds", async () => {
      superAdminUserIdEnvVar = "testSuperAdmin3";

      let result = await exec();
      expect(result).toEqual(true);

      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "hostTenant",
        "subtenant4",
        null,
        "test_super_admin_3_user_name",
      ]);
    });
  });

  describe("hasGlobalAdminScope", () => {
    let globalAdminScopeEnvVar: string;
    let userData: MindSphereUserJWTData;

    beforeEach(() => {
      globalAdminScopeEnvVar = "testGlobalAdminScope";
      userData = {
        client_id: "testClientId",
        email: "testEmail",
        scope: ["testScope1", "testGlobalAdminScope", "testScope3"],
        ten: "testTenant",
        subtenant: "testSubtenant",
        user_name: "testUserName",
      };
    });

    let exec = async () => {
      await beforeExec();
      (config.userPermissions.globalAdminScope as any) = globalAdminScopeEnvVar;
      return MindSphereApp.hasGlobalAdminScope(userData);
    };

    it("should return true if users scope includes global admin scope", async () => {
      let result = await exec();
      expect(result).toEqual(true);
    });

    it("should return false if users scope does not include global admin scope", async () => {
      userData.scope = ["testScope1", "testScope2", "testScope3"];
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if users scope is an empty array", async () => {
      userData.scope = [];
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if users scope is null", async () => {
      (userData as any).scope = null;
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if users scope is undefined", async () => {
      (userData as any).scope = undefined;
      let result = await exec();
      expect(result).toEqual(false);
    });
  });

  describe("hasGlobalUserScope", () => {
    let globalAdminScopeEnvVar: string;
    let userData: MindSphereUserJWTData;

    beforeEach(() => {
      globalAdminScopeEnvVar = "testGlobalUserScope";
      userData = {
        client_id: "testClientId",
        email: "testEmail",
        scope: ["testScope1", "testGlobalUserScope", "testScope3"],
        ten: "testTenant",
        subtenant: "testSubtenant",
        user_name: "testUserName",
      };
    });

    let exec = async () => {
      await beforeExec();
      (config.userPermissions.globalAdminScope as any) = globalAdminScopeEnvVar;
      return MindSphereApp.hasGlobalUserScope(userData);
    };

    it("should return true if users scope includes global user scope", async () => {
      let result = await exec();
      expect(result).toEqual(true);
    });

    it("should return false if users scope does not include global user scope", async () => {
      userData.scope = ["testScope1", "testScope2", "testScope3"];
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if users scope is an empty array", async () => {
      userData.scope = [];
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if users scope is null", async () => {
      (userData as any).scope = null;
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if users scope is undefined", async () => {
      (userData as any).scope = undefined;
      let result = await exec();
      expect(result).toEqual(false);
    });
  });

  describe("hasLocalAdminScope", () => {
    let globalAdminScopeEnvVar: string;
    let userData: MindSphereUserJWTData;

    beforeEach(() => {
      globalAdminScopeEnvVar = "testLocalAdminScope";
      userData = {
        client_id: "testClientId",
        email: "testEmail",
        scope: ["testScope1", "testLocalAdminScope", "testScope3"],
        ten: "testTenant",
        subtenant: "testSubtenant",
        user_name: "testUserName",
      };
    });

    let exec = async () => {
      await beforeExec();

      (config.userPermissions.globalAdminScope as any) = globalAdminScopeEnvVar;
      return MindSphereApp.hasLocalAdminScope(userData);
    };

    it("should return true if users scope includes local admin scope", async () => {
      let result = await exec();
      expect(result).toEqual(true);
    });

    it("should return false if users scope does not include local admin scope", async () => {
      userData.scope = ["testScope1", "testScope2", "testScope3"];
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if users scope is an empty array", async () => {
      userData.scope = [];
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if users scope is null", async () => {
      (userData as any).scope = null;
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if users scope is undefined", async () => {
      (userData as any).scope = undefined;
      let result = await exec();
      expect(result).toEqual(false);
    });
  });

  describe("hasLocalUserScope", () => {
    let globalAdminScopeEnvVar: string;
    let userData: MindSphereUserJWTData;

    beforeEach(() => {
      globalAdminScopeEnvVar = "testLocalUserScope";
      userData = {
        client_id: "testClientId",
        email: "testEmail",
        scope: ["testScope1", "testLocalUserScope", "testScope3"],
        ten: "testTenant",
        subtenant: "testSubtenant",
        user_name: "testUserName",
      };
    });

    let exec = async () => {
      await beforeExec();

      (config.userPermissions.globalAdminScope as any) = globalAdminScopeEnvVar;
      return MindSphereApp.hasLocalUserScope(userData);
    };

    it("should return true if users scope includes local user scope", async () => {
      let result = await exec();
      expect(result).toEqual(true);
    });

    it("should return false if users scope does not include local user scope", async () => {
      userData.scope = ["testScope1", "testScope2", "testScope3"];
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if users scope is an empty array", async () => {
      userData.scope = [];
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if users scope is null", async () => {
      (userData as any).scope = null;
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if users scope is undefined", async () => {
      (userData as any).scope = undefined;
      let result = await exec();
      expect(result).toEqual(false);
    });
  });

  describe("hasGlobalAdminRole", () => {
    let userData: UserStorageData;

    beforeEach(() => {
      userData = {
        config: {},
        data: {},
        userName: "testUserEmail",
        permissions: {
          plants: {},
          role: UserRole.GlobalAdmin,
        },
      };
    });

    let exec = async () => {
      await beforeExec();

      return MindSphereApp.hasGlobalAdminRole(userData);
    };

    it("should return true if user has global admin role", async () => {
      let result = await exec();
      expect(result).toEqual(true);
    });

    it("should return false if user has different role", async () => {
      userData.permissions.role = UserRole.GlobalUser;
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if user invalid role = 5", async () => {
      userData.permissions.role = 5;
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if user invalid role = null", async () => {
      (userData.permissions as any).role = null;
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if user invalid role = undefined", async () => {
      (userData.permissions as any).role = undefined;
      let result = await exec();
      expect(result).toEqual(false);
    });
  });

  describe("hasGlobalUserRole", () => {
    let userData: UserStorageData;

    beforeEach(() => {
      userData = {
        config: {},
        data: {},
        userName: "testUserEmail",
        permissions: {
          plants: {},
          role: UserRole.GlobalUser,
        },
      };
    });

    let exec = async () => {
      await beforeExec();

      return MindSphereApp.hasGlobalUserRole(userData);
    };

    it("should return true if user has global user role", async () => {
      let result = await exec();
      expect(result).toEqual(true);
    });

    it("should return false if user has different role", async () => {
      userData.permissions.role = UserRole.GlobalAdmin;
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if user invalid role = 5", async () => {
      userData.permissions.role = 5;
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if user invalid role = null", async () => {
      (userData.permissions as any).role = null;
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if user invalid role = undefined", async () => {
      (userData.permissions as any).role = undefined;
      let result = await exec();
      expect(result).toEqual(false);
    });
  });

  describe("hasLocalAdminRole", () => {
    let userData: UserStorageData;

    beforeEach(() => {
      userData = {
        config: {},
        data: {},
        userName: "testUserEmail",
        permissions: {
          plants: {},
          role: UserRole.LocalAdmin,
        },
      };
    });

    let exec = async () => {
      await beforeExec();

      return MindSphereApp.hasLocalAdminRole(userData);
    };

    it("should return true if user has local admin role", async () => {
      let result = await exec();
      expect(result).toEqual(true);
    });

    it("should return false if user has different role", async () => {
      userData.permissions.role = UserRole.GlobalAdmin;
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if user invalid role = 5", async () => {
      userData.permissions.role = 5;
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if user invalid role = null", async () => {
      (userData.permissions as any).role = null;
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if user invalid role = undefined", async () => {
      (userData.permissions as any).role = undefined;
      let result = await exec();
      expect(result).toEqual(false);
    });
  });

  describe("hasLocalUserRole", () => {
    let userData: UserStorageData;

    beforeEach(() => {
      userData = {
        config: {},
        data: {},
        userName: "testUserEmail",
        permissions: {
          plants: {},
          role: UserRole.LocalUser,
        },
      };
    });

    let exec = async () => {
      await beforeExec();

      return MindSphereApp.hasLocalUserRole(userData);
    };

    it("should return true if user has local user role", async () => {
      let result = await exec();
      expect(result).toEqual(true);
    });

    it("should return false if user has different role", async () => {
      userData.permissions.role = UserRole.GlobalAdmin;
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if user invalid role = 5", async () => {
      userData.permissions.role = 5;
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if user invalid role = null", async () => {
      (userData.permissions as any).role = null;
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if user invalid role = undefined", async () => {
      (userData.permissions as any).role = undefined;
      let result = await exec();
      expect(result).toEqual(false);
    });
  });

  describe("isLocalAdminOfPlant", () => {
    let plantId: string;
    let userData: UserStorageData;

    beforeEach(() => {
      plantId = "testfakePlant2";
      userData = {
        config: {},
        data: {},
        userName: "testUserEmail",
        permissions: {
          plants: {
            testfakePlant1: PlantPermissions.User,
            testfakePlant2: PlantPermissions.Admin,
            testfakePlant3: PlantPermissions.User,
          },
          role: UserRole.LocalAdmin,
        },
      };
    });

    let exec = async () => {
      await beforeExec();
      return MindSphereApp.isLocalAdminOfPlant(plantId, userData);
    };

    it("should return true if user has local admin permissions to given plant", async () => {
      let result = await exec();
      expect(result).toEqual(true);
    });

    it("should return false if user has local user permissions to given plant", async () => {
      userData.permissions.plants.testfakePlant2 = PlantPermissions.User;
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if user invalid local permissions = 5", async () => {
      userData.permissions.plants.testfakePlant2 = 5;
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if user invalid local permissions = null", async () => {
      (userData.permissions.plants as any).testfakePlant2 = null;
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if user invalid local permissions = undefined", async () => {
      (userData.permissions.plants as any).testfakePlant2 = undefined;
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if user has no access to any plant", async () => {
      userData.permissions.plants = {};
      let result = await exec();
      expect(result).toEqual(false);
    });
  });

  describe("isLocalUserOfPlant", () => {
    let plantId: string;
    let userData: UserStorageData;

    beforeEach(() => {
      plantId = "testfakePlant2";
      userData = {
        config: {},
        data: {},
        userName: "testUserEmail",
        permissions: {
          plants: {
            testfakePlant1: PlantPermissions.Admin,
            testfakePlant2: PlantPermissions.User,
            testfakePlant3: PlantPermissions.Admin,
          },
          role: UserRole.LocalAdmin,
        },
      };
    });

    let exec = async () => {
      await beforeExec();
      return MindSphereApp.isLocalUserOfPlant(plantId, userData);
    };

    it("should return true if user has local user permissions to given plant", async () => {
      let result = await exec();
      expect(result).toEqual(true);
    });

    it("should return false if user has local admin permissions to given plant", async () => {
      userData.permissions.plants.testfakePlant2 = PlantPermissions.Admin;
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if user invalid local permissions = 5", async () => {
      userData.permissions.plants.testfakePlant2 = 5;
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if user invalid local permissions = null", async () => {
      (userData.permissions.plants as any).testfakePlant2 = null;
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if user invalid local permissions = undefined", async () => {
      (userData.permissions.plants as any).testfakePlant2 = undefined;
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if user has no access to any plant", async () => {
      userData.permissions.plants = {};
      let result = await exec();
      expect(result).toEqual(false);
    });
  });

  describe("hasLocalAccessToPlant", () => {
    let plantId: string;
    let userData: UserStorageData;

    beforeEach(() => {
      plantId = "testfakePlant2";
      userData = {
        config: {},
        data: {},
        userName: "testUserEmail",
        permissions: {
          plants: {
            testfakePlant1: PlantPermissions.Admin,
            testfakePlant2: PlantPermissions.Admin,
            testfakePlant3: PlantPermissions.Admin,
          },
          role: UserRole.LocalAdmin,
        },
      };
    });

    let exec = async () => {
      await beforeExec();
      return MindSphereApp.hasLocalAccessToPlant(plantId, userData);
    };

    it("should return true if user has local user permissions to given plant", async () => {
      let result = await exec();
      expect(result).toEqual(true);
    });

    it("should return true if user has local user permissions to given plant", async () => {
      userData.permissions.plants.testfakePlant2 = PlantPermissions.User;
      let result = await exec();
      expect(result).toEqual(true);
    });

    it("should return false if user invalid local permissions = 5", async () => {
      userData.permissions.plants.testfakePlant2 = 5;
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if user invalid local permissions = null", async () => {
      (userData.permissions.plants as any).testfakePlant2 = null;
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if user invalid local permissions = undefined", async () => {
      (userData.permissions.plants as any).testfakePlant2 = undefined;
      let result = await exec();
      expect(result).toEqual(false);
    });

    it("should return false if user has no access to any plant", async () => {
      userData.permissions.plants = {};
      let result = await exec();
      expect(result).toEqual(false);
    });
  });

  describe("getUserRoleBasedOnUserGroup", () => {
    let mindSphereApp: MindSphereApp;
    let initialized: boolean;
    let globalAdminGroup: MindSphereUserGroupData;
    let globalUserGroup: MindSphereUserGroupData;
    let localAdminGroup: MindSphereUserGroupData;
    let localUserGroup: MindSphereUserGroupData;
    let userGroupData: MindSphereUserGroupData;

    beforeEach(() => {
      initialized = true;

      globalAdminGroup = {
        description: "testGlobalAdminDescription",
        displayName: "testGlobalAdminDisplayName",
        members: [],
        id: "testGlobalAdminId",
      };

      globalUserGroup = {
        description: "testGlobalUserDescription",
        displayName: "testGlobalUserDisplayName",
        members: [],
        id: "testGlobalUserId",
      };

      localAdminGroup = {
        description: "testLocalAdminDescription",
        displayName: "testLocalAdminDisplayName",
        members: [],
        id: "testLocalAdminId",
      };

      localUserGroup = {
        description: "testLocalUserDescription",
        displayName: "testLocalUserDisplayName",
        members: [],
        id: "testLocalUserId",
      };

      userGroupData = {
        description: "testGlobalAdminDescription",
        displayName: "testGlobalAdminDisplayName",
        members: [],
        id: "testGlobalAdminId",
      };
    });

    let exec = async () => {
      await beforeExec();
      mindSphereApp = new MindSphereApp(
        "testStorageTenant",
        "testAppId",
        "testAssetId",
        "testTenant",
        "testSubtenantId"
      );

      setPrivateProperty(mindSphereApp, "_globalAdminGroup", globalAdminGroup);
      setPrivateProperty(mindSphereApp, "_globalUserGroup", globalUserGroup);
      setPrivateProperty(mindSphereApp, "_localAdminGroup", localAdminGroup);
      setPrivateProperty(mindSphereApp, "_localUserGroup", localUserGroup);
      setPrivateProperty(mindSphereApp, "_initialized", initialized);

      return mindSphereApp.getUserRoleBasedOnUserGroup(userGroupData);
    };

    it("should return GlobalAdmin if userGroupData has GlobalAdmin display name", async () => {
      userGroupData = {
        description: "testGlobalAdminDescription",
        displayName: "testGlobalAdminDisplayName",
        members: [],
        id: "testGlobalAdminId",
      };
      let result = await exec();
      expect(result).toEqual(UserRole.GlobalAdmin);
    });

    it("should return GlobalUser if userGroupData has GlobalUser display name", async () => {
      userGroupData = {
        description: "testGlobalUserDescription",
        displayName: "testGlobalUserDisplayName",
        members: [],
        id: "testGlobalUserId",
      };
      let result = await exec();
      expect(result).toEqual(UserRole.GlobalUser);
    });

    it("should return LocalAdmin if userGroupData has LocalAdmin display name", async () => {
      userGroupData = {
        description: "testLocalAdminDescription",
        displayName: "testLocalAdminDisplayName",
        members: [],
        id: "testLocalAdminId",
      };
      let result = await exec();
      expect(result).toEqual(UserRole.LocalAdmin);
    });

    it("should return LocalUser if userGroupData has LocalUser display name", async () => {
      userGroupData = {
        description: "testLocalUserDescription",
        displayName: "testLocalUserDisplayName",
        members: [],
        id: "testLocalUserId",
      };
      let result = await exec();
      expect(result).toEqual(UserRole.LocalUser);
    });

    it("should throw if id of group is not recognized", async () => {
      userGroupData = {
        description: "testFakeUserDescription",
        displayName: "testFakeUserDisplayName",
        members: [],
        id: "testFakeUserId",
      };
      await expect(exec()).rejects.toMatchObject({
        message: `Permissions testFakeUserDisplayName not recognized!`,
      });
    });

    it("should throw if app is not initialized", async () => {
      initialized = false;
      await expect(exec()).rejects.toMatchObject({
        message: `Application not initialized!`,
      });
    });
  });

  describe("getUserGroupBasedOnUserRole", () => {
    let mindSphereApp: MindSphereApp;
    let initialized: boolean;
    let globalAdminGroup: MindSphereUserGroupData;
    let globalUserGroup: MindSphereUserGroupData;
    let localAdminGroup: MindSphereUserGroupData;
    let localUserGroup: MindSphereUserGroupData;
    let userRole: UserRole;

    beforeEach(() => {
      initialized = true;

      globalAdminGroup = {
        description: "testGlobalAdminDescription",
        displayName: "testGlobalAdminDisplayName",
        members: [],
        id: "testGlobalAdminId",
      };

      globalUserGroup = {
        description: "testGlobalUserDescription",
        displayName: "testGlobalUserDisplayName",
        members: [],
        id: "testGlobalUserId",
      };

      localAdminGroup = {
        description: "testLocalAdminDescription",
        displayName: "testLocalAdminDisplayName",
        members: [],
        id: "testLocalAdminId",
      };

      localUserGroup = {
        description: "testLocalUserDescription",
        displayName: "testLocalUserDisplayName",
        members: [],
        id: "testLocalUserId",
      };

      userRole = UserRole.GlobalAdmin;
    });

    let exec = async () => {
      await beforeExec();
      mindSphereApp = new MindSphereApp(
        "testStorageTenant",
        "testAppId",
        "testAssetId",
        "testTenant",
        "testSubtenantId"
      );

      setPrivateProperty(mindSphereApp, "_globalAdminGroup", globalAdminGroup);
      setPrivateProperty(mindSphereApp, "_globalUserGroup", globalUserGroup);
      setPrivateProperty(mindSphereApp, "_localAdminGroup", localAdminGroup);
      setPrivateProperty(mindSphereApp, "_localUserGroup", localUserGroup);
      setPrivateProperty(mindSphereApp, "_initialized", initialized);

      return mindSphereApp.getUserGroupBasedOnUserRole(userRole);
    };

    it("should return GlobalAdmin user group if role is GlobalAdmin", async () => {
      userRole = UserRole.GlobalAdmin;
      let result = await exec();
      expect(result).toEqual(globalAdminGroup);
    });

    it("should return GlobalUser user group if role is GlobalUser", async () => {
      userRole = UserRole.GlobalUser;
      let result = await exec();
      expect(result).toEqual(globalUserGroup);
    });

    it("should return LocalAdmin user group if role is LocalAdmin", async () => {
      userRole = UserRole.LocalAdmin;
      let result = await exec();
      expect(result).toEqual(localAdminGroup);
    });

    it("should return LocalUser user group if role is LocalUser", async () => {
      userRole = UserRole.LocalUser;
      let result = await exec();
      expect(result).toEqual(localUserGroup);
    });

    it("should throw if role is not recognized", async () => {
      userRole = 5;
      await expect(exec()).rejects.toMatchObject({
        message: `Role 5 not recognized!`,
      });
    });

    it("should throw if app is not initialized", async () => {
      initialized = false;
      await expect(exec()).rejects.toMatchObject({
        message: `Application not initialized!`,
      });
    });
  });

  //#endregion ===== AUTHORIZATION & AUTHENTICATION =====

  //#region ===== CONTRUCTOR & INITIALIZATION =====

  describe("constructor", () => {
    let mindSphereApp: MindSphereApp;
    let storageTenant: string;
    let appId: string;
    let assetId: string;
    let appTenant: string;
    let subtenantId: string | null = null;

    beforeEach(() => {
      storageTenant = "testStorageTenant";
      appId = "testAppId";
      assetId = "testAssetId";
      appTenant = "testAppTenant";
      subtenantId = "testSubtenantId";
    });

    let exec = () => {
      return new MindSphereApp(
        storageTenant,
        appId,
        assetId,
        appTenant,
        subtenantId
      );
    };

    it("should create new MindSphereApp and set its properties, together with initialization flag (to false)", () => {
      let result = exec();
      expect(result).toBeDefined();
      expect(result.AssetId).toEqual(assetId);
      expect(result.AppId).toEqual(appId);
      expect(result.TenantName).toEqual(appTenant);
      expect(result.SubtenantId).toEqual(subtenantId);
      expect(result.StorageTenant).toEqual(storageTenant);
      testPrivateProperty(result, "_initialized", false);
    });

    it("should create new MindSphereApp and set its user groups to null", () => {
      let result = exec();
      expect(result.GlobalAdminGroup).toEqual(null);
      expect(result.GlobalUserGroup).toEqual(null);
      expect(result.LocalUserGroup).toEqual(null);
      expect(result.LocalAdminGroup).toEqual(null);
      expect(result.StandardUserGroup).toEqual(null);
      expect(result.SubtenantUserGroup).toEqual(null);
    });

    it("should create storages and set its content to empty object", () => {
      let result = exec();
      let anyResult = result as any;
      expect(anyResult._appStorage).toBeDefined();
      expect(anyResult._appStorage._cacheData).toEqual({});
      expect(anyResult._userStorage).toBeDefined();
      expect(anyResult._userStorage._cacheData).toEqual({});
      expect(anyResult._appStorage).toBeDefined();
      expect(anyResult._appStorage._cacheData).toEqual({});
    });
  });

  describe("init", () => {
    let mindSphereApp: MindSphereApp;
    let storageTenant: string;
    let appId: string;
    let assetId: string;
    let appTenant: string;
    let subtenantId: string | null = null;
    let getAllUserGroupsThrows: boolean;
    let getAllFilesThrows: boolean;
    let getFileContentThrows: boolean;
    let checkFileThrows: boolean;

    beforeEach(async () => {
      storageTenant = "hostTenant";
      appId = "ten-testTenant2-sub-subtenant2";
      assetId = "ten-testTenant2-sub-subtenant2-id";
      appTenant = "testTenant2";
      subtenantId = "subtenant2";

      getAllUserGroupsThrows = false;
      getAllFilesThrows = false;
      getFileContentThrows = false;
      checkFileThrows = false;
    });

    let exec = async () => {
      await beforeExec();

      if (getAllUserGroupsThrows) {
        let getAllUserGroupsMockFunc = jest.fn(async () => {
          throw new Error("test get all User Groups mock func error");
        });
        MindSphereUserGroupService.getInstance().getAllUserGroups = getAllUserGroupsMockFunc;
      }

      if (getAllFilesThrows) {
        let getAllFilesGroupsMockFunc = jest.fn(async () => {
          throw new Error("test get all Files mock func error");
        });
        MindSphereFileService.getInstance().getAllFileNamesFromAsset = getAllFilesGroupsMockFunc;
      }

      if (getFileContentThrows) {
        let getFileContentMockFunc = jest.fn(async () => {
          throw new Error("test get file content func error");
        });
        MindSphereFileService.getInstance().getFileContent = getFileContentMockFunc;
      }

      if (checkFileThrows) {
        let checkFileMockFunc = jest.fn(async () => {
          throw new Error("test check file func error");
        });
        MindSphereFileService.getInstance().checkIfFileExists = checkFileMockFunc;
      }

      mindSphereApp = new MindSphereApp(
        storageTenant,
        appId,
        assetId,
        appTenant,
        subtenantId
      );

      return mindSphereApp.init();
    };

    it("should get and assign all user groups to the app", async () => {
      await exec();

      expect(getAllUserGroups).toHaveBeenCalledTimes(1);
      expect(getAllUserGroups.mock.calls[0]).toEqual(["testTenant2"]);

      expect(mindSphereApp.StandardUserGroup).toEqual({
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
      });

      expect(mindSphereApp.SubtenantUserGroup).toEqual({
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
      });

      expect(mindSphereApp.GlobalAdminGroup).toEqual({
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
      });

      expect(mindSphereApp.GlobalUserGroup).toEqual({
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
      });

      expect(mindSphereApp.LocalAdminGroup).toEqual({
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
      });

      expect(mindSphereApp.LocalUserGroup).toEqual({
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
      });
    });

    it("should call getFilesAll files and then getFile for every returned filename - for every storage and fetch all data in storages", async () => {
      await exec();

      //Checking calls for getting file names for every storage
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(3);

      expect(getAllFileNamesFromAsset.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "app.config.json",
      ]);

      expect(getAllFileNamesFromAsset.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "plant.config.json",
      ]);

      expect(getAllFileNamesFromAsset.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "user.config.json",
      ]);

      //Checking calls for getting files - called 1 x app, 4 x user, 3 x plant = 8 calls
      expect(getFileContent).toHaveBeenCalledTimes(8);

      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "main.app.config.json",
      ]);
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "testGlobalAdmin22.user.config.json",
      ]);
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "testGlobalUser22.user.config.json",
      ]);
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "testLocalAdmin22.user.config.json",
      ]);
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "testLocalUser22.user.config.json",
      ]);
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "testPlant4.plant.config.json",
      ]);
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "testPlant5.plant.config.json",
      ]);
      expect(getFileContent.mock.calls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "testPlant6.plant.config.json",
      ]);

      //Checking cache content of storages
      expect((mindSphereApp as any)._appStorage._cacheData).toEqual({
        main: {
          data: {
            testApp4Data: "testApp4DataValue",
          },
          config: {
            testApp4Config: "testApp4ConfigValue",
          },
          maxNumberOfUsers: 5,
        },
      });
      expect((mindSphereApp as any)._userStorage._cacheData).toEqual({
        testGlobalAdmin22: {
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
        testGlobalUser22: {
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
        testLocalAdmin22: {
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
        testLocalUser22: {
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
      });
      expect((mindSphereApp as any)._plantStorage._cacheData).toEqual({
        testPlant4: {
          data: {
            testPlant4Data: "testPlant4DataValue",
          },
          config: {
            testPlant4Config: "testPlant4ConfigValue",
          },
        },
        testPlant5: {
          data: {
            testPlant5Data: "testPlant5DataValue",
          },
          config: {
            testPlant5Config: "testPlant5ConfigValue",
          },
        },
        testPlant6: {
          data: {
            testPlant6Data: "testPlant6DataValue",
          },
          config: {
            testPlant6Config: "testPlant6ConfigValue",
          },
        },
      });
    });

    it("should set _initialized flag to true", async () => {
      await exec();
      testPrivateProperty(mindSphereApp, "_initialized", true);
    });

    it("should throw and not initialize app - if there is no user in returned user group", async () => {
      userGroupServiceContent["testTenant2"] = {};

      await expect(exec()).rejects.toMatchObject({
        message: `User group standardUserGroupDisplayName not found!`,
      });

      //Getting user should be called normally
      expect(getAllUserGroups).toHaveBeenCalledTimes(1);
      expect(getAllUserGroups.mock.calls[0]).toEqual(["testTenant2"]);

      //Storage fetch data should not have been called
      expect(getAllFileNamesFromAsset).not.toHaveBeenCalled();
      expect(getFileContent).not.toHaveBeenCalled();

      //user groups should not have been set
      expect(mindSphereApp.StandardUserGroup).toEqual(null);
      expect(mindSphereApp.SubtenantUserGroup).toEqual(null);
      expect(mindSphereApp.GlobalAdminGroup).toEqual(null);
      expect(mindSphereApp.GlobalUserGroup).toEqual(null);
      expect(mindSphereApp.LocalAdminGroup).toEqual(null);
      expect(mindSphereApp.LocalUserGroup).toEqual(null);

      //Storage cache should not have been set
      expect((mindSphereApp as any)._appStorage._cacheData).toEqual({});
      expect((mindSphereApp as any)._userStorage._cacheData).toEqual({});
      expect((mindSphereApp as any)._plantStorage._cacheData).toEqual({});

      //Intialized flag should not have been set
      testPrivateProperty(mindSphereApp, "_initialized", false);
    });

    it("should throw and not initialize app - if there is no global admin user in returned user group", async () => {
      //Removing standard mindsphere user
      delete userGroupServiceContent["testTenant2"]["globalAdminGroup"];

      await expect(exec()).rejects.toMatchObject({
        message: `User group globalAdminGroupDisplayName not found!`,
      });

      //Getting user should be called normally
      expect(getAllUserGroups).toHaveBeenCalledTimes(1);
      expect(getAllUserGroups.mock.calls[0]).toEqual(["testTenant2"]);

      //Storage fetch data should not have been called
      expect(getAllFileNamesFromAsset).not.toHaveBeenCalled();
      expect(getFileContent).not.toHaveBeenCalled();

      //Intialized flag should not have been set
      testPrivateProperty(mindSphereApp, "_initialized", false);
    });

    it("should throw and not initialize app - if calling get all user groups throws", async () => {
      getAllUserGroupsThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "test get all User Groups mock func error",
      });

      //Storage fetch data should not have been called
      expect(getAllFileNamesFromAsset).not.toHaveBeenCalled();
      expect(getFileContent).not.toHaveBeenCalled();

      //Intialized flag should not have been set
      testPrivateProperty(mindSphereApp, "_initialized", false);
    });

    it("should throw and not initialize app - if calling get all file names throws", async () => {
      getAllFilesThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "test get all Files mock func error",
      });

      //Getting user should be called normally
      expect(getAllUserGroups).toHaveBeenCalledTimes(1);
      expect(getAllUserGroups.mock.calls[0]).toEqual(["testTenant2"]);

      //Fetch seperate files data should not have been called
      expect(getFileContent).not.toHaveBeenCalled();

      //Intialized flag should not have been set
      testPrivateProperty(mindSphereApp, "_initialized", false);
    });

    it("should throw and not initialize app - if calling get file throws", async () => {
      getFileContentThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "test get file content func error",
      });

      //Getting user should be called normally
      expect(getAllUserGroups).toHaveBeenCalledTimes(1);
      expect(getAllUserGroups.mock.calls[0]).toEqual(["testTenant2"]);

      //Storage fetch data should have been called normally
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(3);

      //Intialized flag should not have been set
      testPrivateProperty(mindSphereApp, "_initialized", false);
    });

    it("should throw and not initialize app - if calling check file throws", async () => {
      checkFileThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "test check file func error",
      });

      //Getting user should be called normally
      expect(getAllUserGroups).toHaveBeenCalledTimes(1);
      expect(getAllUserGroups.mock.calls[0]).toEqual(["testTenant2"]);

      //Storage fetch data should have been called normally
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(3);

      //Storage fetch data should not have been called
      expect(getFileContent).not.toHaveBeenCalled();

      //Intialized flag should not have been set
      testPrivateProperty(mindSphereApp, "_initialized", false);
    });
  });

  //#endregion ===== CONTRUCTOR & INITIALIZATION =====

  //#region ===== APP STORAGE DATA =====

  describe("fetchAppData", () => {
    let mindSphereApp: MindSphereApp;
    let storageTenant: string;
    let appId: string;
    let assetId: string;
    let appTenant: string;
    let subtenantId: string | null;
    let initApp: boolean;
    let newAppData: AppStorageData | null;
    let getFileContentThrows: boolean;
    let checkFileReturnsNull: boolean;

    beforeEach(async () => {
      storageTenant = "hostTenant";
      appId = "ten-testTenant2-sub-subtenant2";
      assetId = "ten-testTenant2-sub-subtenant2-id";
      appTenant = "testTenant2";
      subtenantId = "subtenant2";
      initApp = true;
      newAppData = {
        config: { newAppConfig: "newAppConfigValue" },
        data: { newAppData: "newAppDataValue" },
        maxNumberOfUsers: 10,
      };
      getFileContentThrows = false;
      checkFileReturnsNull = false;
    });

    let exec = async () => {
      await beforeExec();

      mindSphereApp = new MindSphereApp(
        storageTenant,
        appId,
        assetId,
        appTenant,
        subtenantId
      );
      if (initApp) await mindSphereApp.init();

      if (newAppData) {
        fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2-id"][
          "main.app.config.json"
        ] = newAppData;
        await mockMsFileService(fileServiceContent);
      }

      if (getFileContentThrows)
        MindSphereFileService.getInstance().getFileContent = jest.fn(
          async () => {
            throw new Error("Test get file content error");
          }
        );

      if (checkFileReturnsNull)
        MindSphereFileService.getInstance().checkIfFileExists = jest.fn(
          async () => null
        );

      return mindSphereApp.fetchAppData();
    };

    it("should fetch new data from main app file to app storage", async () => {
      await exec();

      //8 times during initialization, 9th time during fetching
      expect(getFileContent).toHaveBeenCalledTimes(9);
      expect(getFileContent.mock.calls[8]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "main.app.config.json",
      ]);

      //Cache data of storage should be fetched
      expect((mindSphereApp as any)._appStorage._cacheData["main"]).toEqual(
        newAppData
      );
    });

    it("should throw and not fetch new data from main app file to app storage and clear storage from main app content - if get file method throws", async () => {
      getFileContentThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "Test get file content error",
      });

      //Cache data of storage should not have been refetched
      expect(
        (mindSphereApp as any)._appStorage._cacheData["main"]
      ).not.toBeDefined();

      //Main config should be accessible to fetch when trying to get and fetch data later
      MindSphereFileService.getInstance().getFileContent = getFileContent;

      let data = await mindSphereApp.getAppData();

      expect(data).toEqual(newAppData);
      //Data should have been fetched
      expect((mindSphereApp as any)._appStorage._cacheData["main"]).toEqual(
        newAppData
      );
    });

    it("should not throw but not fetch new data from main app file to app storage and clear storage from main app content - if check file returns null - no main file available", async () => {
      checkFileReturnsNull = true;

      await exec();
      //Cache data of storage should not have been refetched
      expect(
        (mindSphereApp as any)._appStorage._cacheData["main"]
      ).not.toBeDefined();

      //Main config should be accessible to fetch when trying to get and fetch data later
      MindSphereFileService.getInstance().checkIfFileExists = checkIfFileExists;

      let data = await mindSphereApp.getAppData();
      expect(data).toEqual(newAppData);

      //Data should have been fetched
      expect((mindSphereApp as any)._appStorage._cacheData["main"]).toEqual(
        newAppData
      );
    });

    it("should throw and not fetch new data if app is not initialized", async () => {
      initApp = false;

      await expect(exec()).rejects.toMatchObject({
        message: `Application not initialized!`,
      });

      expect(getFileContent).not.toHaveBeenCalled();

      //Cache data of storage should be fetched
      expect((mindSphereApp as any)._appStorage._cacheData).toEqual({});
    });
  });

  describe("getAppData", () => {
    let mindSphereApp: MindSphereApp;
    let storageTenant: string;
    let appId: string;
    let assetId: string;
    let appTenant: string;
    let subtenantId: string | null;
    let initApp: boolean;
    let newAppData: AppStorageData | null;
    let mainAppDataExistsInCache: boolean;

    beforeEach(async () => {
      storageTenant = "hostTenant";
      appId = "ten-testTenant2-sub-subtenant2";
      assetId = "ten-testTenant2-sub-subtenant2-id";
      appTenant = "testTenant2";
      subtenantId = "subtenant2";
      initApp = true;
      mainAppDataExistsInCache = true;
      newAppData = {
        config: { newAppConfig: "newAppConfigValue" },
        data: { newAppData: "newAppDataValue" },
        maxNumberOfUsers: 5,
      };
    });

    let exec = async () => {
      await beforeExec();

      mindSphereApp = new MindSphereApp(
        storageTenant,
        appId,
        assetId,
        appTenant,
        subtenantId
      );
      if (initApp) await mindSphereApp.init();

      if (newAppData) {
        fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2-id"][
          "main.app.config.json"
        ] = newAppData;
        await mockMsFileService(fileServiceContent);
      }

      if (!mainAppDataExistsInCache)
        delete (mindSphereApp as any)._appStorage._cacheData["main"];

      return mindSphereApp.getAppData();
    };

    it("should not fetch new data from main app file but return app data from cache", async () => {
      let result = await exec();

      expect(result).toEqual({
        config: {
          testApp4Config: "testApp4ConfigValue",
        },
        data: {
          testApp4Data: "testApp4DataValue",
        },
        maxNumberOfUsers: 5,
      });

      //8 times during initialization, 9th time during fetching was not called
      expect(getFileContent).toHaveBeenCalledTimes(8);
      expect(checkIfFileExists).toHaveBeenCalledTimes(8);

      //Cache data should not be changed
      expect((mindSphereApp as any)._appStorage._cacheData["main"]).toEqual({
        config: {
          testApp4Config: "testApp4ConfigValue",
        },
        data: {
          testApp4Data: "testApp4DataValue",
        },
        maxNumberOfUsers: 5,
      });
    });

    it("should fetch new data from main app file and return app data from cache - if main app key does not exist in app data cache", async () => {
      mainAppDataExistsInCache = false;

      let result = await exec();
      expect(result).toEqual(newAppData);

      //8 times during initialization, 9th time during fetching
      expect(getFileContent).toHaveBeenCalledTimes(9);
      expect(checkIfFileExists).toHaveBeenCalledTimes(9);

      //Cache data should not be changed
      expect((mindSphereApp as any)._appStorage._cacheData["main"]).toEqual(
        newAppData
      );
    });

    it("should throw and not fetch new data if app is not initialized", async () => {
      initApp = false;
      await expect(exec()).rejects.toMatchObject({
        message: `Application not initialized!`,
      });

      //Cache data of storage should be fetched
      expect((mindSphereApp as any)._appStorage._cacheData).toEqual({});
    });
  });

  describe("setAppData", () => {
    let mindSphereApp: MindSphereApp;
    let storageTenant: string;
    let appId: string;
    let assetId: string;
    let appTenant: string;
    let subtenantId: string | null;
    let initApp: boolean;
    let newAppData: AppStorageData;
    let setFileContentThrows: boolean;

    beforeEach(async () => {
      storageTenant = "hostTenant";
      appId = "ten-testTenant2-sub-subtenant2";
      assetId = "ten-testTenant2-sub-subtenant2-id";
      appTenant = "testTenant2";
      subtenantId = "subtenant2";
      initApp = true;
      newAppData = {
        config: { newAppConfig: "newAppConfigValue" },
        data: { newAppData: "newAppDataValue" },
        maxNumberOfUsers: 10,
      };
      setFileContentThrows = false;
    });

    let exec = async () => {
      await beforeExec();

      mindSphereApp = new MindSphereApp(
        storageTenant,
        appId,
        assetId,
        appTenant,
        subtenantId
      );

      if (initApp) await mindSphereApp.init();

      if (setFileContentThrows) {
        let setFileMockFunc: jest.Mock = jest.fn(async () => {
          throw new Error("Test set file error");
        });
        MindSphereFileService.getInstance().setFileContent = setFileMockFunc;
      }

      return mindSphereApp.setAppData(newAppData);
    };

    it("should set data in both FileService and in cache", async () => {
      await exec();

      //Set file should be called in order to set new app data
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "main.app.config.json",
        newAppData,
      ]);

      //Cache data should be changed to new version
      expect((mindSphereApp as any)._appStorage._cacheData["main"]).toEqual(
        newAppData
      );

      //New data should be accessible via getAppData
      let appData = await mindSphereApp.getAppData();

      expect(appData).toEqual(newAppData);
    });

    it("should set data if main data have not exited before", async () => {
      //CRUCIAL FEATURE! - NEW, REGISTERED APP DOES NOT HAVE APP SETTINGS FILE!

      delete fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-id"
      ]["main.app.config.json"];

      await exec();

      //Set file should be called in order to set new app data
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "main.app.config.json",
        newAppData,
      ]);

      //Cache data should be changed to new version
      expect((mindSphereApp as any)._appStorage._cacheData["main"]).toEqual(
        newAppData
      );

      //New data should be accessible via getAppData
      let appData = await mindSphereApp.getAppData();

      expect(appData).toEqual(newAppData);
    });

    it("should not set new data in cache and throw - if set file throws", async () => {
      setFileContentThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: `Test set file error`,
      });

      let oldAppData = {
        config: {
          testApp4Config: "testApp4ConfigValue",
        },
        data: {
          testApp4Data: "testApp4DataValue",
        },
        maxNumberOfUsers: 5,
      };

      //Cache data should not have been changed
      expect((mindSphereApp as any)._appStorage._cacheData["main"]).toEqual(
        oldAppData
      );

      //Old data should be accessible via getAppData
      let appData = await mindSphereApp.getAppData();
      expect(appData).toEqual(oldAppData);
    });

    it("should throw and not set new data if app is not initialized", async () => {
      initApp = false;

      await expect(exec()).rejects.toMatchObject({
        message: `Application not initialized!`,
      });

      //SetFile should not have been called
      expect(setFileContent).not.toHaveBeenCalled();

      //Cache data should not have been changed - app not initialized so it is empty
      expect((mindSphereApp as any)._appStorage._cacheData).toEqual({});
    });
  });

  describe("removeAppData", () => {
    let mindSphereApp: MindSphereApp;
    let storageTenant: string;
    let appId: string;
    let assetId: string;
    let appTenant: string;
    let subtenantId: string | null;
    let initApp: boolean;
    let deleteFileThrows: boolean;

    beforeEach(async () => {
      storageTenant = "hostTenant";
      appId = "ten-testTenant2-sub-subtenant2";
      assetId = "ten-testTenant2-sub-subtenant2-id";
      appTenant = "testTenant2";
      subtenantId = "subtenant2";
      initApp = true;
      deleteFileThrows = false;
    });

    let exec = async () => {
      await beforeExec();

      mindSphereApp = new MindSphereApp(
        storageTenant,
        appId,
        assetId,
        appTenant,
        subtenantId
      );

      if (deleteFileThrows) {
        let deleteFileMockFunc: jest.Mock = jest.fn(async () => {
          throw new Error("Test delete file error");
        });

        MindSphereFileService.getInstance().deleteFile = deleteFileMockFunc;
      }

      if (initApp) await mindSphereApp.init();
      return mindSphereApp.removeAppData();
    };

    it("should delete app data from cache and from storage", async () => {
      await exec();

      //Delete file should be called in order to set new app data
      expect(deleteFile).toHaveBeenCalledTimes(1);
      expect(deleteFile.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "main.app.config.json",
      ]);

      //Cache data should be deleted
      expect(
        (mindSphereApp as any)._appStorage._cacheData["main"]
      ).not.toBeDefined();
    });

    it("should throw and not delete app data from cache - if delete file throws", async () => {
      deleteFileThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: `Test delete file error`,
      });

      let oldAppData = {
        config: {
          testApp4Config: "testApp4ConfigValue",
        },
        data: {
          testApp4Data: "testApp4DataValue",
        },
        maxNumberOfUsers: 5,
      };

      //Cache data should not have be deleted
      expect((mindSphereApp as any)._appStorage._cacheData["main"]).toEqual(
        oldAppData
      );

      //Data should be accessible via get
      let appData = await mindSphereApp.getAppData();
      expect(appData).toEqual(oldAppData);
    });

    it("should throw and not delete app data if app is not initialized", async () => {
      initApp = false;

      await expect(exec()).rejects.toMatchObject({
        message: `Application not initialized!`,
      });

      //DeleteFile should not have been called
      expect(deleteFile).not.toHaveBeenCalled();

      //Cache data should not have been changed - app not initialized so it is empty
      expect((mindSphereApp as any)._appStorage._cacheData).toEqual({});
    });
  });

  //#endregion ===== APP STORAGE DATA =====

  //#region ===== USER STORAGE DATA =====

  describe("fetchUserData", () => {
    let mindSphereApp: MindSphereApp;
    let storageTenant: string;
    let appId: string;
    let assetId: string;
    let appTenant: string;
    let subtenantId: string | null;
    let initApp: boolean;
    let checkFileReturnsNull: boolean;
    let getFileContentThrows: boolean;
    let newUserData: {
      [userId: string]: UserStorageData;
    };

    beforeEach(async () => {
      storageTenant = "hostTenant";
      appId = "ten-testTenant2-sub-subtenant2";
      assetId = "ten-testTenant2-sub-subtenant2-id";
      appTenant = "testTenant2";
      subtenantId = "subtenant2";
      initApp = true;
      newUserData = {
        "testGlobalAdmin22.user.config.json": {
          data: {
            testPlant4: {
              testGlobalAdmin22TestPlant4Data:
                "testGlobalAdmin22TestPlant4DataNewValue",
            },
            testPlant5: {
              testGlobalAdmin22TestPlant5Data:
                "testGlobalAdmin22TestPlant5DataNewValue",
            },
            testPlant6: {
              testGlobalAdmin22TestPlant6Data:
                "testGlobalAdmin22TestPlant6DataNewValue",
            },
          },
          config: {
            testPlant4: {
              testGlobalAdmin22TestPlant4Config:
                "testGlobalAdmin22TestPlant4ConfigNewValue",
            },
            testPlant5: {
              testGlobalAdmin22TestPlant5Config:
                "testGlobalAdmin22TestPlant5ConfigNewValue",
            },
            testPlant6: {
              testGlobalAdmin22TestPlant6Config:
                "testGlobalAdmin22TestPlant6ConfigNewValue",
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
                "testGlobalUser22TestPlant4DataNewValue",
            },
            testPlant5: {
              testGlobalUser22TestPlant5Data:
                "testGlobalUser22TestPlant5DataNewValue",
            },
            testPlant6: {
              testGlobalUser22TestPlant6Data:
                "testGlobalUser22TestPlant6DataNewValue",
            },
          },
          config: {
            testPlant4: {
              testGlobalUser22TestPlant4Config:
                "testGlobalUser22TestPlant4ConfigNewValue",
            },
            testPlant5: {
              testGlobalUser22TestPlant5Config:
                "testGlobalUser22TestPlant5ConfigNewValue",
            },
            testPlant6: {
              testGlobalUser22TestPlant6Config:
                "testGlobalUser22TestPlant6ConfigNewValue",
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
        "fakeUser3.user.config.json": {
          config: {
            fakePlant1: { fakeUserConfig: "editedFakeUser3ConfigPlant1" },
            fakePlant2: { fakeUserConfig: "editedFakeUser3ConfigPlant2" },
          },
          data: {
            fakePlant1: { fakeUserData: "editedFakeUser3DataPlant1" },
            fakePlant2: { fakeUserData: "editedFakeUser3DataPlant2" },
          },
          permissions: {
            role: UserRole.LocalAdmin,
            plants: {
              fakePlant1: PlantPermissions.User,
              fakePlant2: PlantPermissions.Admin,
            },
          },
          userName: "editedFakeUser3Email",
        },
        "fakeUser4.user.config.json": {
          config: {
            fakePlant2: { fakeUserConfig: "fakeUser4ConfigPlant2" },
            fakePlant3: { fakeUserConfig: "fakeUser4ConfigPlant3" },
          },
          data: {
            fakePlant2: { fakeUserData: "fakeUser4DataPlant2" },
            fakePlant3: { fakeUserData: "fakeUser4DataPlant3" },
          },
          permissions: {
            role: UserRole.LocalUser,
            plants: {
              fakePlant2: PlantPermissions.User,
              fakePlant3: PlantPermissions.User,
            },
          },
          userName: "fakeUser4Email",
        },
        "fakeUser5.user.config.json": {
          config: {
            fakePlant2: { fakeUserConfig: "fakeUser5ConfigPlant2" },
            fakePlant3: { fakeUserConfig: "fakeUser5ConfigPlant3" },
          },
          data: {
            fakePlant2: { fakeUserData: "fakeUser5DataPlant2" },
            fakePlant3: { fakeUserData: "fakeUser5DataPlant3" },
          },
          permissions: {
            role: UserRole.LocalUser,
            plants: {
              fakePlant2: PlantPermissions.User,
              fakePlant3: PlantPermissions.User,
            },
          },
          userName: "fakeUser5Email",
        },
        "fakeUser6.user.config.json": {
          config: {
            fakePlant1: { fakeUserConfig: "editedFakeUser6ConfigPlant1" },
            fakePlant2: { fakeUserConfig: "editedFakeUser6ConfigPlant2" },
            fakePlant3: { fakeUserConfig: "editedFakeUser6ConfigPlant3" },
          },
          data: {
            fakePlant1: { fakeUserData: "editedFakeUser6DataPlant1" },
            fakePlant2: { fakeUserData: "editedFakeUser6DataPlant2" },
            fakePlant3: { fakeUserData: "editedFakeUser6DataPlant3" },
          },
          permissions: {
            role: UserRole.GlobalUser,
            plants: {
              fakePlant1: PlantPermissions.User,
              fakePlant2: PlantPermissions.User,
              fakePlant3: PlantPermissions.User,
            },
          },
          userName: "editedFakeUser6Email",
        },
      };
      getFileContentThrows = false;
      checkFileReturnsNull = false;
    });

    let exec = async () => {
      await beforeExec();

      mindSphereApp = new MindSphereApp(
        storageTenant,
        appId,
        assetId,
        appTenant,
        subtenantId
      );
      if (initApp) await mindSphereApp.init();

      if (newUserData) {
        fileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-id"
        ] = {
          "main.app.config.json":
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-id"
            ]["main.app.config.json"],
          "testPlant4.plant.config.json":
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-id"
            ]["testPlant4.plant.config.json"],
          "testPlant5.plant.config.json":
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-id"
            ]["testPlant5.plant.config.json"],
          "testPlant6.plant.config.json":
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-id"
            ]["testPlant6.plant.config.json"],
          ...newUserData,
        };
        await mockMsFileService(fileServiceContent);
      }

      if (getFileContentThrows)
        MindSphereFileService.getInstance().getFileContent = jest.fn(
          async () => {
            throw new Error("Test get file content error");
          }
        );

      if (checkFileReturnsNull)
        MindSphereFileService.getInstance().checkIfFileExists = jest.fn(
          async () => null
        );

      return mindSphereApp.fetchUserData();
    };

    it("should fetch new data from users files to app storage", async () => {
      await exec();

      //3 time during initialization, 1 times during new fetching
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(4);
      expect(getAllFileNamesFromAsset.mock.calls[3]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "user.config.json",
      ]);

      //8 times during initialization, 6 times during new fetching (fetching both - old and new users )
      expect(getFileContent).toHaveBeenCalledTimes(14);

      let laterMockCalls = [
        getFileContent.mock.calls[8],
        getFileContent.mock.calls[9],
        getFileContent.mock.calls[10],
        getFileContent.mock.calls[11],
        getFileContent.mock.calls[12],
        getFileContent.mock.calls[13],
      ];

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "fakeUser3.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "fakeUser4.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "fakeUser5.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "fakeUser6.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "testGlobalAdmin22.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "testGlobalUser22.user.config.json",
      ]);

      //Cache data of storage should be fetched
      let expectedCache = {
        testGlobalAdmin22: newUserData["testGlobalAdmin22.user.config.json"],
        testGlobalUser22: newUserData["testGlobalUser22.user.config.json"],
        fakeUser3: newUserData["fakeUser3.user.config.json"],
        fakeUser4: newUserData["fakeUser4.user.config.json"],
        fakeUser5: newUserData["fakeUser5.user.config.json"],
        fakeUser6: newUserData["fakeUser6.user.config.json"],
      };

      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should throw and not fetch any data - return empty cache - if getFile throws during getting new data", async () => {
      getFileContentThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "Test get file content error",
      });

      expect((mindSphereApp as any)._userStorage._cacheData).toEqual({});
    });

    it("should not throw but clear all cache data - if checkFile returns null", async () => {
      checkFileReturnsNull = true;
      await exec();

      //8 times during initialization, 0 after - due to check file equal to null
      expect(getFileContent).toHaveBeenCalledTimes(8);
      expect((mindSphereApp as any)._userStorage._cacheData).toEqual({});
    });

    it("should throw and not fetch new data if app is not initialized", async () => {
      initApp = false;
      await expect(exec()).rejects.toMatchObject({
        message: `Application not initialized!`,
      });

      expect(getFileContent).not.toHaveBeenCalled();

      //Cache data of storage should be fetched
      expect((mindSphereApp as any)._userStorage._cacheData).toEqual({});
    });
  });

  describe("getUserData", () => {
    let mindSphereApp: MindSphereApp;
    let storageTenant: string;
    let appId: string;
    let assetId: string;
    let appTenant: string;
    let subtenantId: string | null;
    let initApp: boolean;
    let newUserData: {
      [userId: string]: UserStorageData;
    };
    let userId: string;
    let getFileContentThrows: boolean;

    beforeEach(async () => {
      storageTenant = "hostTenant";
      appId = "ten-testTenant2-sub-subtenant2";
      assetId = "ten-testTenant2-sub-subtenant2-id";
      appTenant = "testTenant2";
      subtenantId = "subtenant2";
      initApp = true;
      userId = "testGlobalUser22";
      newUserData = {
        "testGlobalUser22.user.config.json": {
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
        "newFakeUser.user.config.json": {
          data: {
            testPlant4: {
              newFakeUserTestPlant4Data:
                "newFakeUserTestPlant4DataModifiedValue",
            },
            testPlant5: {
              newFakeUserTestPlant5Data:
                "newFakeUserTestPlant5DataModifiedValue",
            },
            testPlant6: {
              newFakeUserTestPlant6Data:
                "newFakeUserTestPlant6DataModifiedValue",
            },
          },
          config: {
            testPlant4: {
              newFakeUserTestPlant4Config:
                "newFakeUserTestPlant4ConfigModifiedValue",
            },
            testPlant5: {
              newFakeUserTestPlant5Config:
                "newFakeUserTestPlant5ConfigModifiedValue",
            },
            testPlant6: {
              newFakeUserTestPlant6Config:
                "newFakeUserTestPlant6ConfigModifiedValue",
            },
          },
          userName: "new_fake_user_user_name",
          permissions: {
            role: UserRole.GlobalUser,
            plants: {
              testPlant4: PlantPermissions.User,
              testPlant5: PlantPermissions.User,
              testPlant6: PlantPermissions.User,
            },
          },
        },
      };
    });

    let exec = async () => {
      await beforeExec();

      mindSphereApp = new MindSphereApp(
        storageTenant,
        appId,
        assetId,
        appTenant,
        subtenantId
      );
      if (initApp) await mindSphereApp.init();

      if (newUserData) {
        fileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-id"
        ] = {
          "main.app.config.json":
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-id"
            ]["main.app.config.json"],
          "testPlant4.plant.config.json":
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-id"
            ]["testPlant4.plant.config.json"],
          "testPlant5.plant.config.json":
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-id"
            ]["testPlant5.plant.config.json"],
          "testPlant6.plant.config.json":
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-id"
            ]["testPlant6.plant.config.json"],
          ...newUserData,
        };
        await mockMsFileService(fileServiceContent);
      }

      if (getFileContentThrows)
        MindSphereFileService.getInstance().getFileContent = jest.fn(
          async () => {
            throw new Error("Test get file content error");
          }
        );

      return mindSphereApp.getUserData(userId);
    };

    it("should return new user from cache - if user of given id exists in cache", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);

      let result = await exec();

      let expectedResult =
        oldFileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-id"
        ]["testGlobalUser22.user.config.json"];

      expect(result).toEqual(expectedResult);

      //8 times during initialization, 0 after
      expect(getFileContent).toHaveBeenCalledTimes(8);

      //Cache should stay without changes
      let expectedCache = {
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalAdmin22.user.config.json"],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalUser22.user.config.json"],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalAdmin22.user.config.json"],
        testLocalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalUser22.user.config.json"],
      };

      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should fetch and return new user from cache - if user of given id doesnt exist in cache", async () => {
      userId = "newFakeUser";

      let oldFileServiceContent = cloneObject(fileServiceContent);

      let result = await exec();

      let expectedResult = newUserData["newFakeUser.user.config.json"];

      expect(result).toEqual(expectedResult);

      //8 times during initialization, 1 after
      expect(getFileContent).toHaveBeenCalledTimes(9);
      expect(getFileContent.mock.calls[8]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "newFakeUser.user.config.json",
      ]);

      //Cache should have changed
      let expectedCache = {
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalAdmin22.user.config.json"],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalUser22.user.config.json"],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalAdmin22.user.config.json"],
        testLocalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalUser22.user.config.json"],
        newFakeUser: newUserData["newFakeUser.user.config.json"],
      };

      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should throw and not change cache - if get file content throws", async () => {
      userId = "newFakeUser";
      getFileContentThrows = true;

      let oldFileServiceContent = cloneObject(fileServiceContent);

      await expect(exec()).rejects.toMatchObject({
        message: "Test get file content error",
      });

      //Cache should stay without changes
      let expectedCache = {
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalAdmin22.user.config.json"],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalUser22.user.config.json"],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalAdmin22.user.config.json"],
        testLocalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalUser22.user.config.json"],
      };
      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should not and return null - if user does not exists in storage and in cache", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);
      userId = "invalidFakeUser";

      let result = await exec();

      expect(result).toEqual(null);

      //8 times during initialization, 1 after - using check to check if file exists and dont call it
      expect(checkIfFileExists).toHaveBeenCalledTimes(9);
      expect(checkIfFileExists.mock.calls[8]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "invalidFakeUser.user.config.json",
      ]);
      //8 times during initialization, 0 after - using check to check if file exists and dont call it
      expect(getFileContent).toHaveBeenCalledTimes(8);

      //Cache should stay without changes
      let expectedCache = {
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalAdmin22.user.config.json"],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalUser22.user.config.json"],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalAdmin22.user.config.json"],
        testLocalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalUser22.user.config.json"],
      };
      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should throw and not fetch new user if app is not initialized", async () => {
      initApp = false;

      await expect(exec()).rejects.toMatchObject({
        message: `Application not initialized!`,
      });

      expect(getFileContent).not.toHaveBeenCalled();

      //Cache data of storage should be fetched
      expect((mindSphereApp as any)._userStorage._cacheData).toEqual({});
    });
  });

  describe("setUserData", () => {
    let mindSphereApp: MindSphereApp;
    let storageTenant: string;
    let appId: string;
    let assetId: string;
    let appTenant: string;
    let subtenantId: string | null;
    let initApp: boolean;
    let userId: string;
    let newUserData: UserStorageData;
    let setFileContentThrows: boolean;

    beforeEach(async () => {
      storageTenant = "hostTenant";
      appId = "ten-testTenant2-sub-subtenant2";
      assetId = "ten-testTenant2-sub-subtenant2-id";
      appTenant = "testTenant2";
      subtenantId = "subtenant2";
      initApp = true;
      userId = "fakeUser5";
      newUserData = {
        config: {
          fakePlant2: { fakeUserConfig: "fakeUser5ConfigPlant2" },
          fakePlant3: { fakeUserConfig: "fakeUser5ConfigPlant3" },
        },
        data: {
          fakePlant2: { fakeUserData: "fakeUser5DataPlant2" },
          fakePlant3: { fakeUserData: "fakeUser5DataPlant3" },
        },
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            fakePlant2: PlantPermissions.User,
            fakePlant3: PlantPermissions.User,
          },
        },
        userName: "fakeUser5Email",
      };
      setFileContentThrows = false;
    });

    let exec = async () => {
      await beforeExec();

      mindSphereApp = new MindSphereApp(
        storageTenant,
        appId,
        assetId,
        appTenant,
        subtenantId
      );

      if (initApp) await mindSphereApp.init();

      if (setFileContentThrows)
        MindSphereFileService.getInstance().setFileContent = jest.fn(
          async () => {
            throw new Error("Test set file content error");
          }
        );

      return mindSphereApp.setUserData(userId, newUserData);
    };

    it("should set new user data in cache and in storage - if there is no user of given id", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);

      await exec();

      //8 times during initialization, 0 after
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "fakeUser5.user.config.json",
        newUserData,
      ]);

      //Cache should have changed
      let expectedCache = {
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalAdmin22.user.config.json"],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalUser22.user.config.json"],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalAdmin22.user.config.json"],
        testLocalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalUser22.user.config.json"],
        [userId]: newUserData,
      };
      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );

      //User should be accessible via getUser
      let userData = await mindSphereApp.getUserData(userId);
      expect(userData).toEqual(newUserData);
    });

    it("should set new user data in cache and in storage - if user of given id already exists", async () => {
      userId = "testGlobalUser22";
      let oldFileServiceContent = cloneObject(fileServiceContent);

      await exec();

      //8 times during initialization, 0 after
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "testGlobalUser22.user.config.json",
        newUserData,
      ]);

      //Cache should have changed
      let expectedCache = {
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalAdmin22.user.config.json"],
        testGlobalUser22: newUserData,
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalAdmin22.user.config.json"],
        testLocalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalUser22.user.config.json"],
      };

      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );

      //User should be accessible via getUser
      let userData = await mindSphereApp.getUserData(userId);

      expect(userData).toEqual(newUserData);
    });

    it("should not set new user data in cache and throw - if set file throws, user does not exists in cache", async () => {
      setFileContentThrows = true;
      let oldFileServiceContent = cloneObject(fileServiceContent);

      await expect(exec()).rejects.toMatchObject({
        message: "Test set file content error",
      });

      //Cache should not have changed
      let expectedCache = {
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalAdmin22.user.config.json"],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalUser22.user.config.json"],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalAdmin22.user.config.json"],
        testLocalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalUser22.user.config.json"],
      };

      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should not set new user data in cache and throw - if set file throws, user exists in cache", async () => {
      userId = "testGlobalUser22";

      setFileContentThrows = true;
      let oldFileServiceContent = cloneObject(fileServiceContent);

      await expect(exec()).rejects.toMatchObject({
        message: "Test set file content error",
      });

      //Cache should not have changed
      let expectedCache = {
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalAdmin22.user.config.json"],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalUser22.user.config.json"],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalAdmin22.user.config.json"],
        testLocalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalUser22.user.config.json"],
      };

      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should throw and not set new user if app is not initialized", async () => {
      initApp = false;

      await expect(exec()).rejects.toMatchObject({
        message: `Application not initialized!`,
      });

      //SetFile should not have been called
      expect(setFileContent).not.toHaveBeenCalled();

      //Cache data should not have been changed - app not initialized so it is empty
      expect((mindSphereApp as any)._userStorage._cacheData).toEqual({});
    });
  });

  describe("removeUserData", () => {
    let mindSphereApp: MindSphereApp;
    let storageTenant: string;
    let appId: string;
    let assetId: string;
    let appTenant: string;
    let subtenantId: string | null;
    let initApp: boolean;
    let userId: string;
    let deleteFileThrows: boolean;

    beforeEach(async () => {
      storageTenant = "hostTenant";
      appId = "ten-testTenant2-sub-subtenant2";
      assetId = "ten-testTenant2-sub-subtenant2-id";
      appTenant = "testTenant2";
      subtenantId = "subtenant2";
      initApp = true;
      userId = "testGlobalUser22";
      deleteFileThrows = false;
    });

    let exec = async () => {
      await beforeExec();

      mindSphereApp = new MindSphereApp(
        storageTenant,
        appId,
        assetId,
        appTenant,
        subtenantId
      );

      if (initApp) await mindSphereApp.init();

      if (deleteFileThrows)
        MindSphereFileService.getInstance().deleteFile = jest.fn(async () => {
          throw new Error("Test delete file error");
        });

      return mindSphereApp.removeUserData(userId);
    };

    it("should delete user from cache and storage - if user of given id exists in cache", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);

      await exec();

      expect(deleteFile).toHaveBeenCalledTimes(1);
      expect(deleteFile.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "testGlobalUser22.user.config.json",
      ]);

      //Cache should have changed
      let expectedCache = {
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalAdmin22.user.config.json"],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalAdmin22.user.config.json"],
        testLocalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalUser22.user.config.json"],
      };

      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should not throw and not change cache - if there is no such user in cache and storage", async () => {
      userId = "newFakeUser";

      let oldFileServiceContent = cloneObject(fileServiceContent);

      await exec();

      //Check file should have been called additional time, but not delete file - checking before deleting
      expect(checkIfFileExists).toHaveBeenCalledTimes(9);
      expect(checkIfFileExists.mock.calls[8]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "newFakeUser.user.config.json",
      ]);
      expect(deleteFile).not.toHaveBeenCalled();

      //Cache should stay without changes
      let expectedCache = {
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalAdmin22.user.config.json"],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalUser22.user.config.json"],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalAdmin22.user.config.json"],
        testLocalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalUser22.user.config.json"],
      };

      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should throw and not change cache - if user of given id exists and delete file throws", async () => {
      deleteFileThrows = true;

      userId = "testGlobalUser22";
      let oldFileServiceContent = cloneObject(fileServiceContent);

      await expect(exec()).rejects.toMatchObject({
        message: "Test delete file error",
      });

      //Check file should have been called additional time, but not delete file - checking before deleting
      expect(
        MindSphereFileService.getInstance().deleteFile
      ).toHaveBeenCalledTimes(1);
      expect(
        (MindSphereFileService.getInstance().deleteFile as jest.Mock).mock
          .calls[0]
      ).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "testGlobalUser22.user.config.json",
      ]);

      //Cache should stay without changes
      let expectedCache = {
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalAdmin22.user.config.json"],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalUser22.user.config.json"],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalAdmin22.user.config.json"],
        testLocalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalUser22.user.config.json"],
      };

      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should throw and not change cache or storage if app is not initialized", async () => {
      initApp = false;

      await expect(exec()).rejects.toMatchObject({
        message: `Application not initialized!`,
      });

      expect(deleteFile).not.toHaveBeenCalled();

      //Cache data of storage should be fetched
      expect((mindSphereApp as any)._userStorage._cacheData).toEqual({});
    });
  });

  describe("getAllUsers", () => {
    let mindSphereApp: MindSphereApp;
    let storageTenant: string;
    let appId: string;
    let assetId: string;
    let appTenant: string;
    let subtenantId: string | null;
    let initApp: boolean;
    let newUserData: {
      [userId: string]: UserStorageData;
    };
    let getAllFilesThrows: boolean;
    let getFileContentThrows: boolean;
    let checkFileReturnsNull: boolean;

    beforeEach(async () => {
      storageTenant = "hostTenant";
      appId = "ten-testTenant2-sub-subtenant2";
      assetId = "ten-testTenant2-sub-subtenant2-id";
      appTenant = "testTenant2";
      subtenantId = "subtenant2";
      initApp = true;
      newUserData = {
        "testGlobalAdmin22.user.config.json": {
          data: {
            testPlant4: {
              testGlobalAdmin22TestPlant4Data:
                "testGlobalAdmin22TestPlant4DataNewValue",
            },
            testPlant5: {
              testGlobalAdmin22TestPlant5Data:
                "testGlobalAdmin22TestPlant5DataNewValue",
            },
            testPlant6: {
              testGlobalAdmin22TestPlant6Data:
                "testGlobalAdmin22TestPlant6DataNewValue",
            },
          },
          config: {
            testPlant4: {
              testGlobalAdmin22TestPlant4Config:
                "testGlobalAdmin22TestPlant4ConfigNewValue",
            },
            testPlant5: {
              testGlobalAdmin22TestPlant5Config:
                "testGlobalAdmin22TestPlant5ConfigNewValue",
            },
            testPlant6: {
              testGlobalAdmin22TestPlant6Config:
                "testGlobalAdmin22TestPlant6ConfigNewValue",
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
                "testGlobalUser22TestPlant4DataNewValue",
            },
            testPlant5: {
              testGlobalUser22TestPlant5Data:
                "testGlobalUser22TestPlant5DataNewValue",
            },
            testPlant6: {
              testGlobalUser22TestPlant6Data:
                "testGlobalUser22TestPlant6DataNewValue",
            },
          },
          config: {
            testPlant4: {
              testGlobalUser22TestPlant4Config:
                "testGlobalUser22TestPlant4ConfigNewValue",
            },
            testPlant5: {
              testGlobalUser22TestPlant5Config:
                "testGlobalUser22TestPlant5ConfigNewValue",
            },
            testPlant6: {
              testGlobalUser22TestPlant6Config:
                "testGlobalUser22TestPlant6ConfigNewValue",
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
        "fakeUser3.user.config.json": {
          config: {
            fakePlant1: { fakeUserConfig: "editedFakeUser3ConfigPlant1" },
            fakePlant2: { fakeUserConfig: "editedFakeUser3ConfigPlant2" },
          },
          data: {
            fakePlant1: { fakeUserData: "editedFakeUser3DataPlant1" },
            fakePlant2: { fakeUserData: "editedFakeUser3DataPlant2" },
          },
          permissions: {
            role: UserRole.LocalAdmin,
            plants: {
              fakePlant1: PlantPermissions.User,
              fakePlant2: PlantPermissions.Admin,
            },
          },
          userName: "editedFakeUser3Email",
        },
        "fakeUser4.user.config.json": {
          config: {
            fakePlant2: { fakeUserConfig: "fakeUser4ConfigPlant2" },
            fakePlant3: { fakeUserConfig: "fakeUser4ConfigPlant3" },
          },
          data: {
            fakePlant2: { fakeUserData: "fakeUser4DataPlant2" },
            fakePlant3: { fakeUserData: "fakeUser4DataPlant3" },
          },
          permissions: {
            role: UserRole.LocalUser,
            plants: {
              fakePlant2: PlantPermissions.User,
              fakePlant3: PlantPermissions.User,
            },
          },
          userName: "fakeUser4Email",
        },
        "fakeUser5.user.config.json": {
          config: {
            fakePlant2: { fakeUserConfig: "fakeUser5ConfigPlant2" },
            fakePlant3: { fakeUserConfig: "fakeUser5ConfigPlant3" },
          },
          data: {
            fakePlant2: { fakeUserData: "fakeUser5DataPlant2" },
            fakePlant3: { fakeUserData: "fakeUser5DataPlant3" },
          },
          permissions: {
            role: UserRole.LocalUser,
            plants: {
              fakePlant2: PlantPermissions.User,
              fakePlant3: PlantPermissions.User,
            },
          },
          userName: "fakeUser5Email",
        },
        "fakeUser6.user.config.json": {
          config: {
            fakePlant1: { fakeUserConfig: "editedFakeUser6ConfigPlant1" },
            fakePlant2: { fakeUserConfig: "editedFakeUser6ConfigPlant2" },
            fakePlant3: { fakeUserConfig: "editedFakeUser6ConfigPlant3" },
          },
          data: {
            fakePlant1: { fakeUserData: "editedFakeUser6DataPlant1" },
            fakePlant2: { fakeUserData: "editedFakeUser6DataPlant2" },
            fakePlant3: { fakeUserData: "editedFakeUser6DataPlant3" },
          },
          permissions: {
            role: UserRole.GlobalUser,
            plants: {
              fakePlant1: PlantPermissions.User,
              fakePlant2: PlantPermissions.User,
              fakePlant3: PlantPermissions.User,
            },
          },
          userName: "editedFakeUser6Email",
        },
      };
      checkFileReturnsNull = false;
      getAllFilesThrows = false;
      getFileContentThrows = false;
    });

    let exec = async () => {
      await beforeExec();

      mindSphereApp = new MindSphereApp(
        storageTenant,
        appId,
        assetId,
        appTenant,
        subtenantId
      );

      if (initApp) await mindSphereApp.init();

      if (newUserData) {
        fileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-id"
        ] = {
          "main.app.config.json":
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-id"
            ]["main.app.config.json"],
          "testPlant4.plant.config.json":
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-id"
            ]["testPlant4.plant.config.json"],
          "testPlant5.plant.config.json":
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-id"
            ]["testPlant5.plant.config.json"],
          "testPlant6.plant.config.json":
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-id"
            ]["testPlant6.plant.config.json"],
          ...newUserData,
        };

        await mockMsFileService(fileServiceContent);
      }

      if (getAllFilesThrows)
        MindSphereFileService.getInstance().getAllFileNamesFromAsset = jest.fn(
          async () => {
            throw new Error("Get all files test error");
          }
        );

      if (getFileContentThrows)
        MindSphereFileService.getInstance().getFileContent = jest.fn(
          async () => {
            throw new Error("Get file content test error");
          }
        );

      if (checkFileReturnsNull)
        MindSphereFileService.getInstance().checkIfFileExists = jest.fn(
          async () => null
        );

      return mindSphereApp.getAllUsersData();
    };

    it("should return all user from - cache and storage, but fetch to cache only users not present in cache", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);

      let result = await exec();

      let expectedResults = {
        testLocalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalUser22.user.config.json"],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalAdmin22.user.config.json"],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalAdmin22.user.config.json"],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalUser22.user.config.json"],
        fakeUser3: newUserData["fakeUser3.user.config.json"],
        fakeUser4: newUserData["fakeUser4.user.config.json"],
        fakeUser5: newUserData["fakeUser5.user.config.json"],
        fakeUser6: newUserData["fakeUser6.user.config.json"],
      };

      expect(result).toEqual(expectedResults);

      //Get all files should be invoked one additional time after initializiation (3x during initialization)
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(4);
      expect(getAllFileNamesFromAsset.mock.calls[3]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "user.config.json",
      ]);

      //Get files should be invoked for every user existing in storage but not in cache - additional 4x times, 8xtimes during initialization
      expect(getFileContent).toHaveBeenCalledTimes(12);

      let laterMockCalls = [
        getFileContent.mock.calls[8],
        getFileContent.mock.calls[9],
        getFileContent.mock.calls[10],
        getFileContent.mock.calls[11],
      ];

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "fakeUser3.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "fakeUser4.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "fakeUser5.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "fakeUser6.user.config.json",
      ]);

      //Cache data of users not present before should be fetched
      let expectedCache = {
        testLocalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalUser22.user.config.json"],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalAdmin22.user.config.json"],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalAdmin22.user.config.json"],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalUser22.user.config.json"],
        fakeUser3: newUserData["fakeUser3.user.config.json"],
        fakeUser4: newUserData["fakeUser4.user.config.json"],
        fakeUser5: newUserData["fakeUser5.user.config.json"],
        fakeUser6: newUserData["fakeUser6.user.config.json"],
      };
      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should return all user from - cache and storage, but fetch to cache only users not present in cache - if there are no same users in cache and in storage", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);
      delete newUserData["testGlobalAdmin22.user.config.json"];
      delete newUserData["testGlobalUser22.user.config.json"];

      let result = await exec();

      let expectedResults = {
        testLocalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalUser22.user.config.json"],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalAdmin22.user.config.json"],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalAdmin22.user.config.json"],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalUser22.user.config.json"],
        fakeUser3: newUserData["fakeUser3.user.config.json"],
        fakeUser4: newUserData["fakeUser4.user.config.json"],
        fakeUser5: newUserData["fakeUser5.user.config.json"],
        fakeUser6: newUserData["fakeUser6.user.config.json"],
      };

      expect(result).toEqual(expectedResults);

      //Get all files should be invoked one additional time after initializiation (3x during initialization)
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(4);
      expect(getAllFileNamesFromAsset.mock.calls[3]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "user.config.json",
      ]);

      //Get files should be invoked for every user existing in storage but not in cache - additional 4x times, 8xtimes during initialization
      expect(getFileContent).toHaveBeenCalledTimes(12);

      let laterMockCalls = [
        getFileContent.mock.calls[8],
        getFileContent.mock.calls[9],
        getFileContent.mock.calls[10],
        getFileContent.mock.calls[11],
      ];

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "fakeUser3.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "fakeUser4.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "fakeUser5.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "fakeUser6.user.config.json",
      ]);

      //Cache data of users not present before should be fetched
      let expectedCache = {
        testLocalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalUser22.user.config.json"],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalAdmin22.user.config.json"],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalAdmin22.user.config.json"],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalUser22.user.config.json"],

        fakeUser3: newUserData["fakeUser3.user.config.json"],
        fakeUser4: newUserData["fakeUser4.user.config.json"],
        fakeUser5: newUserData["fakeUser5.user.config.json"],
        fakeUser6: newUserData["fakeUser6.user.config.json"],
      };
      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should return all user only from cache and not fetch to cache any user - if there are only the same users in cache and in storage", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);

      //Leaving only old users in storage
      delete newUserData["fakeUser3.user.config.json"];
      delete newUserData["fakeUser4.user.config.json"];
      delete newUserData["fakeUser5.user.config.json"];
      delete newUserData["fakeUser6.user.config.json"];

      let result = await exec();

      let expectedResults = {
        testLocalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalUser22.user.config.json"],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalAdmin22.user.config.json"],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalAdmin22.user.config.json"],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalUser22.user.config.json"],
      };

      expect(result).toEqual(expectedResults);

      //Get all files should be invoked one additional time after initializiation (3x during initialization)
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(4);
      expect(getAllFileNamesFromAsset.mock.calls[3]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "user.config.json",
      ]);

      //Get files should not be invoked after initialization - 8x times during initialization
      expect(getFileContent).toHaveBeenCalledTimes(8);

      //Cache data of users not present before should be fetched
      let expectedCache = {
        testLocalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalUser22.user.config.json"],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalAdmin22.user.config.json"],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalAdmin22.user.config.json"],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalUser22.user.config.json"],
      };
      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should throw and not update cache - if get all files throws", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);
      getAllFilesThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "Get all files test error",
      });

      //Get files should not be invoked after initialization - 8x times during initialization
      expect(getFileContent).toHaveBeenCalledTimes(8);

      //Cache data should not have been changed
      let expectedCache = {
        testLocalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalUser22.user.config.json"],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalAdmin22.user.config.json"],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalAdmin22.user.config.json"],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalUser22.user.config.json"],
      };

      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should throw and not update cache - if get file throws", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);
      getFileContentThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "Get file content test error",
      });

      //Cache data should not have been changed
      let expectedCache = {
        testLocalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalUser22.user.config.json"],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalAdmin22.user.config.json"],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalAdmin22.user.config.json"],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalUser22.user.config.json"],
      };

      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should not throw but not fetch to cache any user and not call getFile - if check file returns null", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);

      checkFileReturnsNull = true;

      let result = await exec();

      let expectedResults = {
        testLocalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalUser22.user.config.json"],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalAdmin22.user.config.json"],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalAdmin22.user.config.json"],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalUser22.user.config.json"],
      };

      expect(result).toEqual(expectedResults);

      //Get all files should be invoked one additional time after initializiation (3x during initialization)
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(4);
      expect(getAllFileNamesFromAsset.mock.calls[3]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "user.config.json",
      ]);

      //Get files should not be invoked after initialization - 8x times during initialization
      expect(getFileContent).toHaveBeenCalledTimes(8);

      //Cache data of users not present before should be fetched
      let expectedCache = {
        testLocalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalUser22.user.config.json"],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testLocalAdmin22.user.config.json"],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalAdmin22.user.config.json"],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testGlobalUser22.user.config.json"],
      };
      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should throw and not fetch any data to cache if app is not initialized", async () => {
      initApp = false;
      await expect(exec()).rejects.toMatchObject({
        message: `Application not initialized!`,
      });

      expect(getFileContent).not.toHaveBeenCalled();

      //Cache data of storage should be fetched
      expect((mindSphereApp as any)._userStorage._cacheData).toEqual({});
    });
  });

  //#endregion ===== USER STORAGE DATA =====

  //#region ===== PLANT STORAGE DATA =====

  describe("fetchPlantData", () => {
    let mindSphereApp: MindSphereApp;
    let storageTenant: string;
    let appId: string;
    let assetId: string;
    let appTenant: string;
    let subtenantId: string | null;
    let initApp: boolean;
    let checkFileReturnsNull: boolean;
    let getFileContentThrows: boolean;
    let newPlantData: {
      [plantId: string]: PlantStorageData;
    };

    beforeEach(async () => {
      storageTenant = "hostTenant";
      appId = "ten-testTenant2-sub-subtenant2";
      assetId = "ten-testTenant2-sub-subtenant2-id";
      appTenant = "testTenant2";
      subtenantId = "subtenant2";
      initApp = true;
      newPlantData = {
        "testPlant5.plant.config.json": {
          data: {
            testPlant5Data: "testPlant5DataModifiedValue",
          },
          config: {
            testPlant5Config: "testPlant5ConfigModifiedValue",
          },
        },
        "testPlant6.plant.config.json": {
          data: {
            testPlant6Data: "testPlant6DataModifiedValue",
          },
          config: {
            testPlant6Config: "testPlant6ConfigModifiedValue",
          },
        },
        "testPlant7.plant.config.json": {
          data: {
            testPlant6Data: "testPlant7DataModifiedValue",
          },
          config: {
            testPlant6Config: "testPlant7ConfigModifiedValue",
          },
        },
        "testPlant8.plant.config.json": {
          data: {
            testPlant6Data: "testPlant8DataModifiedValue",
          },
          config: {
            testPlant6Config: "testPlant8ConfigModifiedValue",
          },
        },
      };
      getFileContentThrows = false;
      checkFileReturnsNull = false;
    });

    let exec = async () => {
      await beforeExec();

      mindSphereApp = new MindSphereApp(
        storageTenant,
        appId,
        assetId,
        appTenant,
        subtenantId
      );
      if (initApp) await mindSphereApp.init();

      if (newPlantData) {
        fileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-id"
        ] = {
          "main.app.config.json":
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-id"
            ]["main.app.config.json"],
          "testGlobalAdmin22.user.config.json":
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-id"
            ]["testGlobalAdmin22.user.config.json"],
          "testGlobalUser22.user.config.json":
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-id"
            ]["testGlobalUser22.user.config.json"],
          "testLocalAdmin22.user.config.json":
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-id"
            ]["testLocalAdmin22.user.config.json"],
          "testLocalUser22.user.config.json":
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-id"
            ]["testLocalUser22.user.config.json"],
          ...newPlantData,
        };

        await mockMsFileService(fileServiceContent);
      }

      if (getFileContentThrows)
        MindSphereFileService.getInstance().getFileContent = jest.fn(
          async () => {
            throw new Error("Test get file content error");
          }
        );

      if (checkFileReturnsNull)
        MindSphereFileService.getInstance().checkIfFileExists = jest.fn(
          async () => null
        );

      return mindSphereApp.fetchPlantData();
    };

    it("should fetch new data from plant files to app storage", async () => {
      await exec();

      //3 time during initialization, 1 times during new fetching
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(4);
      expect(getAllFileNamesFromAsset.mock.calls[3]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "plant.config.json",
      ]);

      //8 times during initialization, 4 times during new fetching (fetching both - old and new plants )
      expect(getFileContent).toHaveBeenCalledTimes(12);

      let laterMockCalls = [
        getFileContent.mock.calls[8],
        getFileContent.mock.calls[9],
        getFileContent.mock.calls[10],
        getFileContent.mock.calls[11],
      ];

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "testPlant5.plant.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "testPlant6.plant.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "testPlant7.plant.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "testPlant8.plant.config.json",
      ]);

      //Cache data of storage should be fetched
      let expectedCache = {
        testPlant5: newPlantData["testPlant5.plant.config.json"],
        testPlant6: newPlantData["testPlant6.plant.config.json"],
        testPlant7: newPlantData["testPlant7.plant.config.json"],
        testPlant8: newPlantData["testPlant8.plant.config.json"],
      };

      expect((mindSphereApp as any)._plantStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should throw and not fetch any data - return empty cache - if getFile throws during getting new data", async () => {
      getFileContentThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "Test get file content error",
      });

      expect((mindSphereApp as any)._plantStorage._cacheData).toEqual({});
    });

    it("should not throw but clear all cache data - if checkFile returns null", async () => {
      checkFileReturnsNull = true;
      await exec();

      //8 times during initialization, 0 after - due to check file equal to null
      expect(getFileContent).toHaveBeenCalledTimes(8);
      expect((mindSphereApp as any)._plantStorage._cacheData).toEqual({});
    });

    it("should throw and not fetch new data if app is not initialized", async () => {
      initApp = false;
      await expect(exec()).rejects.toMatchObject({
        message: `Application not initialized!`,
      });

      expect(getFileContent).not.toHaveBeenCalled();

      //Cache data of storage should be fetched
      expect((mindSphereApp as any)._plantStorage._cacheData).toEqual({});
    });
  });

  describe("getPlantData", () => {
    let mindSphereApp: MindSphereApp;
    let storageTenant: string;
    let appId: string;
    let assetId: string;
    let appTenant: string;
    let subtenantId: string | null;
    let initApp: boolean;
    let newPlantData: {
      [userId: string]: PlantStorageData;
    };
    let plantId: string;
    let getFileContentThrows: boolean;

    beforeEach(async () => {
      storageTenant = "hostTenant";
      appId = "ten-testTenant2-sub-subtenant2";
      assetId = "ten-testTenant2-sub-subtenant2-id";
      appTenant = "testTenant2";
      subtenantId = "subtenant2";
      initApp = true;
      plantId = "testPlant6";
      newPlantData = {
        "testPlant5.plant.config.json": {
          data: {
            testPlant5Data: "testPlant5DataModifiedValue",
          },
          config: {
            testPlant5Config: "testPlant5ConfigModifiedValue",
          },
        },
        "testPlant6.plant.config.json": {
          data: {
            testPlant6Data: "testPlant6DataModifiedValue",
          },
          config: {
            testPlant6Config: "testPlant6ConfigModifiedValue",
          },
        },
        "testPlant7.plant.config.json": {
          data: {
            testPlant6Data: "testPlant7DataModifiedValue",
          },
          config: {
            testPlant6Config: "testPlant7ConfigModifiedValue",
          },
        },
        "testPlant8.plant.config.json": {
          data: {
            testPlant6Data: "testPlant8DataModifiedValue",
          },
          config: {
            testPlant6Config: "testPlant8ConfigModifiedValue",
          },
        },
      };
    });

    let exec = async () => {
      await beforeExec();

      mindSphereApp = new MindSphereApp(
        storageTenant,
        appId,
        assetId,
        appTenant,
        subtenantId
      );
      if (initApp) await mindSphereApp.init();

      if (newPlantData) {
        fileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-id"
        ] = {
          "main.app.config.json":
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-id"
            ]["main.app.config.json"],
          "testGlobalAdmin22.user.config.json":
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-id"
            ]["testGlobalAdmin22.user.config.json"],
          "testGlobalUser22.user.config.json":
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-id"
            ]["testGlobalUser22.user.config.json"],
          "testLocalAdmin22.user.config.json":
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-id"
            ]["testLocalAdmin22.user.config.json"],
          "testLocalUser22.user.config.json":
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-id"
            ]["testLocalUser22.user.config.json"],
          ...newPlantData,
        };

        await mockMsFileService(fileServiceContent);
      }

      if (getFileContentThrows)
        MindSphereFileService.getInstance().getFileContent = jest.fn(
          async () => {
            throw new Error("Test get file content error");
          }
        );

      return mindSphereApp.getPlantData(plantId);
    };

    it("should return new plant from cache - if plant of given id exists in cache", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);

      let result = await exec();

      let expectedResult =
        oldFileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-id"
        ]["testPlant6.plant.config.json"];

      expect(result).toEqual(expectedResult);

      //8 times during initialization, 0 after
      expect(getFileContent).toHaveBeenCalledTimes(8);

      //Cache should stay without changes
      let expectedCache = {
        testPlant4:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant4.plant.config.json"],
        testPlant5:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant5.plant.config.json"],
        testPlant6:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant6.plant.config.json"],
      };

      expect((mindSphereApp as any)._plantStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should fetch and return new plant from cache - if plant of given id doesnt exist in cache", async () => {
      plantId = "testPlant7";

      let oldFileServiceContent = cloneObject(fileServiceContent);

      let result = await exec();

      let expectedResult = newPlantData["testPlant7.plant.config.json"];

      expect(result).toEqual(expectedResult);

      //8 times during initialization, 1 after
      expect(getFileContent).toHaveBeenCalledTimes(9);
      expect(getFileContent.mock.calls[8]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "testPlant7.plant.config.json",
      ]);

      //Cache should have changed
      let expectedCache = {
        testPlant4:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant4.plant.config.json"],
        testPlant5:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant5.plant.config.json"],
        testPlant6:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant6.plant.config.json"],
        testPlant7: newPlantData["testPlant7.plant.config.json"],
      };

      expect((mindSphereApp as any)._plantStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should throw and not change cache - if get file content throws", async () => {
      plantId = "testPlant7";
      getFileContentThrows = true;

      let oldFileServiceContent = cloneObject(fileServiceContent);

      await expect(exec()).rejects.toMatchObject({
        message: "Test get file content error",
      });

      //Cache should stay without changes
      let expectedCache = {
        testPlant4:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant4.plant.config.json"],
        testPlant5:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant5.plant.config.json"],
        testPlant6:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant6.plant.config.json"],
      };

      expect((mindSphereApp as any)._plantStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should not throw and return null - if plant does not exist in storage and in cache", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);
      plantId = "invalidPlantId";

      let result = await exec();

      expect(result).toEqual(null);

      //8 times during initialization, 1 after - using check to check if file exists and dont call it
      expect(checkIfFileExists).toHaveBeenCalledTimes(9);
      expect(checkIfFileExists.mock.calls[8]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "invalidPlantId.plant.config.json",
      ]);

      //8 times during initialization, 0 after - using check to check if file exists and dont call it
      expect(getFileContent).toHaveBeenCalledTimes(8);

      //Cache should stay without changes
      let expectedCache = {
        testPlant4:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant4.plant.config.json"],
        testPlant5:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant5.plant.config.json"],
        testPlant6:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant6.plant.config.json"],
      };

      expect((mindSphereApp as any)._plantStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should throw and not fetch new plant if app is not initialized", async () => {
      initApp = false;

      await expect(exec()).rejects.toMatchObject({
        message: `Application not initialized!`,
      });

      expect(getFileContent).not.toHaveBeenCalled();

      //Cache data of storage should be fetched
      expect((mindSphereApp as any)._plantStorage._cacheData).toEqual({});
    });
  });

  describe("setPlantData", () => {
    let mindSphereApp: MindSphereApp;
    let storageTenant: string;
    let appId: string;
    let assetId: string;
    let appTenant: string;
    let subtenantId: string | null;
    let initApp: boolean;
    let plantId: string;
    let newPlantData: PlantStorageData;
    let setFileContentThrows: boolean;

    beforeEach(async () => {
      storageTenant = "hostTenant";
      appId = "ten-testTenant2-sub-subtenant2";
      assetId = "ten-testTenant2-sub-subtenant2-id";
      appTenant = "testTenant2";
      subtenantId = "subtenant2";
      initApp = true;
      plantId = "testPlant7";
      newPlantData = {
        config: {
          testPlant7Config: "testPlant7ConfigValue",
        },
        data: {
          testPlant7Data: "testPlant7DataValue",
        },
      };
      setFileContentThrows = false;
    });

    let exec = async () => {
      await beforeExec();

      mindSphereApp = new MindSphereApp(
        storageTenant,
        appId,
        assetId,
        appTenant,
        subtenantId
      );

      if (initApp) await mindSphereApp.init();

      if (setFileContentThrows)
        MindSphereFileService.getInstance().setFileContent = jest.fn(
          async () => {
            throw new Error("Test set file content error");
          }
        );

      return mindSphereApp.setPlantData(plantId, newPlantData);
    };

    it("should set new plant data in cache and in storage - if there is no plant of given id", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);

      await exec();

      //8 times during initialization, 0 after
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "testPlant7.plant.config.json",
        newPlantData,
      ]);

      //Cache should have changed
      let expectedCache = {
        testPlant4:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant4.plant.config.json"],
        testPlant5:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant5.plant.config.json"],
        testPlant6:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant6.plant.config.json"],
        testPlant7: newPlantData,
      };

      expect((mindSphereApp as any)._plantStorage._cacheData).toEqual(
        expectedCache
      );

      //Plant should be accessible via getPlant
      let plantData = await mindSphereApp.getPlantData(plantId);
      expect(plantData).toEqual(newPlantData);
    });

    it("should set new plant data in cache and in storage - if plant of given id already exists", async () => {
      plantId = "testPlant5";
      let oldFileServiceContent = cloneObject(fileServiceContent);

      await exec();

      //8 times during initialization, 0 after
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "testPlant5.plant.config.json",
        newPlantData,
      ]);

      //Cache should have changed
      let expectedCache = {
        testPlant4:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant4.plant.config.json"],
        testPlant5: newPlantData,
        testPlant6:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant6.plant.config.json"],
      };

      expect((mindSphereApp as any)._plantStorage._cacheData).toEqual(
        expectedCache
      );

      //Plant should be accessible via getUser
      let plantData = await mindSphereApp.getPlantData(plantId);

      expect(plantData).toEqual(newPlantData);
    });

    it("should not set new plant data in cache and throw - if set file throws, plant does not exist in cache", async () => {
      plantId = "testPlant7";
      setFileContentThrows = true;
      let oldFileServiceContent = cloneObject(fileServiceContent);

      await expect(exec()).rejects.toMatchObject({
        message: "Test set file content error",
      });

      //Cache should stay without changes
      let expectedCache = {
        testPlant4:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant4.plant.config.json"],
        testPlant5:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant5.plant.config.json"],
        testPlant6:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant6.plant.config.json"],
      };

      expect((mindSphereApp as any)._plantStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should not set new plant data in cache and throw - if set file throws, plant exists in cache", async () => {
      plantId = "testPlant5";

      setFileContentThrows = true;
      let oldFileServiceContent = cloneObject(fileServiceContent);

      await expect(exec()).rejects.toMatchObject({
        message: "Test set file content error",
      });

      //Cache should stay without changes
      let expectedCache = {
        testPlant4:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant4.plant.config.json"],
        testPlant5:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant5.plant.config.json"],
        testPlant6:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant6.plant.config.json"],
      };

      expect((mindSphereApp as any)._plantStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should throw and not set new plant if app is not initialized", async () => {
      initApp = false;

      await expect(exec()).rejects.toMatchObject({
        message: `Application not initialized!`,
      });

      //SetFile should not have been called
      expect(setFileContent).not.toHaveBeenCalled();

      //Cache data should not have been changed - app not initialized so it is empty
      expect((mindSphereApp as any)._plantStorage._cacheData).toEqual({});
    });
  });

  describe("removePlantData", () => {
    let mindSphereApp: MindSphereApp;
    let storageTenant: string;
    let appId: string;
    let assetId: string;
    let appTenant: string;
    let subtenantId: string | null;
    let initApp: boolean;
    let plantId: string;
    let deleteFileThrows: boolean;

    beforeEach(async () => {
      storageTenant = "hostTenant";
      appId = "ten-testTenant2-sub-subtenant2";
      assetId = "ten-testTenant2-sub-subtenant2-id";
      appTenant = "testTenant2";
      subtenantId = "subtenant2";
      initApp = true;
      plantId = "testPlant5";
      deleteFileThrows = false;
    });

    let exec = async () => {
      await beforeExec();

      mindSphereApp = new MindSphereApp(
        storageTenant,
        appId,
        assetId,
        appTenant,
        subtenantId
      );

      if (initApp) await mindSphereApp.init();

      if (deleteFileThrows)
        MindSphereFileService.getInstance().deleteFile = jest.fn(async () => {
          throw new Error("Test delete file error");
        });

      return mindSphereApp.removePlantData(plantId);
    };

    it("should delete plant from cache and storage - if plant of given id exists in cache", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);

      await exec();

      expect(deleteFile).toHaveBeenCalledTimes(1);
      expect(deleteFile.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "testPlant5.plant.config.json",
      ]);

      //Cache should have changed
      let expectedCache = {
        testPlant4:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant4.plant.config.json"],
        testPlant6:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant6.plant.config.json"],
      };

      expect((mindSphereApp as any)._plantStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should not throw and not change cache - if there is no such plant in cache and storage", async () => {
      plantId = "newFakePlant";

      let oldFileServiceContent = cloneObject(fileServiceContent);

      await exec();

      //Check file should have been called additional time, but not delete file - checking before deleting
      expect(checkIfFileExists).toHaveBeenCalledTimes(9);
      expect(checkIfFileExists.mock.calls[8]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "newFakePlant.plant.config.json",
      ]);
      expect(deleteFile).not.toHaveBeenCalled();

      //Cache should stay without changes
      let expectedCache = {
        testPlant4:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant4.plant.config.json"],
        testPlant5:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant5.plant.config.json"],
        testPlant6:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant6.plant.config.json"],
      };

      expect((mindSphereApp as any)._plantStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should throw and not change cache - if plant of given id exists and delete file throws", async () => {
      deleteFileThrows = true;

      plantId = "testPlant5";
      let oldFileServiceContent = cloneObject(fileServiceContent);

      await expect(exec()).rejects.toMatchObject({
        message: "Test delete file error",
      });

      //Check file should have been called additional time, but not delete file - checking before deleting
      expect(
        MindSphereFileService.getInstance().deleteFile
      ).toHaveBeenCalledTimes(1);
      expect(
        (MindSphereFileService.getInstance().deleteFile as jest.Mock).mock
          .calls[0]
      ).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "testPlant5.plant.config.json",
      ]);

      //Cache should stay without changes
      let expectedCache = {
        testPlant4:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant4.plant.config.json"],
        testPlant5:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant5.plant.config.json"],
        testPlant6:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant6.plant.config.json"],
      };

      expect((mindSphereApp as any)._plantStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should throw and not change cache or storage if app is not initialized", async () => {
      initApp = false;

      await expect(exec()).rejects.toMatchObject({
        message: `Application not initialized!`,
      });

      expect(deleteFile).not.toHaveBeenCalled();

      //Cache data of storage should be fetched
      expect((mindSphereApp as any)._plantStorage._cacheData).toEqual({});
    });
  });

  describe("getAllPlants", () => {
    let mindSphereApp: MindSphereApp;
    let storageTenant: string;
    let appId: string;
    let assetId: string;
    let appTenant: string;
    let subtenantId: string | null;
    let initApp: boolean;
    let newPlantData: {
      [userId: string]: PlantStorageData;
    };
    let getAllFilesThrows: boolean;
    let getFileContentThrows: boolean;
    let checkFileReturnsNull: boolean;

    beforeEach(async () => {
      storageTenant = "hostTenant";
      appId = "ten-testTenant2-sub-subtenant2";
      assetId = "ten-testTenant2-sub-subtenant2-id";
      appTenant = "testTenant2";
      subtenantId = "subtenant2";
      initApp = true;
      newPlantData = {
        "testPlant5.plant.config.json": {
          data: {
            testPlant5Data: "testPlant5DataModifiedValue",
          },
          config: {
            testPlant5Config: "testPlant5ConfigModifiedValue",
          },
        },
        "testPlant6.plant.config.json": {
          data: {
            testPlant6Data: "testPlant6DataModifiedValue",
          },
          config: {
            testPlant6Config: "testPlant6ConfigModifiedValue",
          },
        },
        "testPlant7.plant.config.json": {
          data: {
            testPlant6Data: "testPlant7DataModifiedValue",
          },
          config: {
            testPlant6Config: "testPlant7ConfigModifiedValue",
          },
        },
        "testPlant8.plant.config.json": {
          data: {
            testPlant6Data: "testPlant8DataModifiedValue",
          },
          config: {
            testPlant6Config: "testPlant8ConfigModifiedValue",
          },
        },
      };
      getAllFilesThrows = false;
      getFileContentThrows = false;
    });

    let exec = async () => {
      await beforeExec();

      mindSphereApp = new MindSphereApp(
        storageTenant,
        appId,
        assetId,
        appTenant,
        subtenantId
      );

      if (initApp) await mindSphereApp.init();

      if (newPlantData) {
        fileServiceContent["hostTenant"][
          "ten-testTenant2-sub-subtenant2-id"
        ] = {
          "main.app.config.json":
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-id"
            ]["main.app.config.json"],
          "testGlobalAdmin22.user.config.json":
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-id"
            ]["testGlobalAdmin22.user.config.json"],
          "testGlobalUser22.user.config.json":
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-id"
            ]["testGlobalUser22.user.config.json"],
          "testLocalAdmin22.user.config.json":
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-id"
            ]["testLocalAdmin22.user.config.json"],
          "testLocalUser22.user.config.json":
            fileServiceContent["hostTenant"][
              "ten-testTenant2-sub-subtenant2-id"
            ]["testLocalUser22.user.config.json"],
          ...newPlantData,
        };

        await mockMsFileService(fileServiceContent);
      }

      if (getAllFilesThrows)
        MindSphereFileService.getInstance().getAllFileNamesFromAsset = jest.fn(
          async () => {
            throw new Error("Get all files test error");
          }
        );

      if (getFileContentThrows)
        MindSphereFileService.getInstance().getFileContent = jest.fn(
          async () => {
            throw new Error("Get file content test error");
          }
        );

      if (checkFileReturnsNull)
        MindSphereFileService.getInstance().checkIfFileExists = jest.fn(
          async () => null
        );

      return mindSphereApp.getAllPlantsData();
    };

    it("should return all plants from - cache and storage, but fetch to cache only plants not present in cache", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);

      let result = await exec();

      let expectedResults = {
        testPlant4:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant4.plant.config.json"],
        testPlant5:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant5.plant.config.json"],
        testPlant6:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant6.plant.config.json"],
        testPlant7: newPlantData["testPlant7.plant.config.json"],
        testPlant8: newPlantData["testPlant8.plant.config.json"],
      };

      expect(result).toEqual(expectedResults);

      //Get all files should be invoked one additional time after initializiation (3x during initialization)
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(4);
      expect(getAllFileNamesFromAsset.mock.calls[3]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "plant.config.json",
      ]);

      //Get files should be invoked for every plant existing in storage but not in cache - additional 2x times, 8xtimes during initialization
      expect(getFileContent).toHaveBeenCalledTimes(10);

      let laterMockCalls = [
        getFileContent.mock.calls[8],
        getFileContent.mock.calls[9],
      ];

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "testPlant7.plant.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "testPlant8.plant.config.json",
      ]);

      //Cache data of plants not present before should be fetched
      let expectedCache = {
        testPlant4:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant4.plant.config.json"],
        testPlant5:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant5.plant.config.json"],
        testPlant6:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant6.plant.config.json"],
        testPlant7: newPlantData["testPlant7.plant.config.json"],
        testPlant8: newPlantData["testPlant8.plant.config.json"],
      };

      expect((mindSphereApp as any)._plantStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should return all plants from - cache and storage, but fetch to cache only plants not present in cache - if there are no same plants in cache and in storage", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);
      delete newPlantData["testPlant5.plant.config.json"];
      delete newPlantData["testPlant6.plant.config.json"];

      let result = await exec();

      let expectedResults = {
        testPlant4:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant4.plant.config.json"],
        testPlant5:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant5.plant.config.json"],
        testPlant6:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant6.plant.config.json"],
        testPlant7: newPlantData["testPlant7.plant.config.json"],
        testPlant8: newPlantData["testPlant8.plant.config.json"],
      };

      expect(result).toEqual(expectedResults);

      //Get all files should be invoked one additional time after initializiation (3x during initialization)
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(4);
      expect(getAllFileNamesFromAsset.mock.calls[3]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "plant.config.json",
      ]);

      //Get files should be invoked for every plant existing in storage but not in cache - additional 2x times, 8xtimes during initialization
      expect(getFileContent).toHaveBeenCalledTimes(10);

      let laterMockCalls = [
        getFileContent.mock.calls[8],
        getFileContent.mock.calls[9],
      ];

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "testPlant7.plant.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "testPlant8.plant.config.json",
      ]);

      //Cache data of plants not present before should be fetched
      let expectedCache = {
        testPlant4:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant4.plant.config.json"],
        testPlant5:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant5.plant.config.json"],
        testPlant6:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant6.plant.config.json"],
        testPlant7: newPlantData["testPlant7.plant.config.json"],
        testPlant8: newPlantData["testPlant8.plant.config.json"],
      };

      expect((mindSphereApp as any)._plantStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should return all plants only from cache and not fetch to cache any plant - if there are only the same plants in cache and in storage", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);

      //Leaving only old plants in storage
      delete newPlantData["testPlant7.plant.config.json"];
      delete newPlantData["testPlant8.plant.config.json"];

      let result = await exec();

      let expectedResults = {
        testPlant4:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant4.plant.config.json"],
        testPlant5:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant5.plant.config.json"],
        testPlant6:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant6.plant.config.json"],
      };

      expect(result).toEqual(expectedResults);

      //Get all files should be invoked one additional time after initializiation (3x during initialization)
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(4);
      expect(getAllFileNamesFromAsset.mock.calls[3]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "plant.config.json",
      ]);

      //Get files should not be invoked after initialization - 8x times during initialization
      expect(getFileContent).toHaveBeenCalledTimes(8);

      //Cache data of users not present before should be fetched
      let expectedCache = {
        testPlant4:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant4.plant.config.json"],
        testPlant5:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant5.plant.config.json"],
        testPlant6:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant6.plant.config.json"],
      };

      expect((mindSphereApp as any)._plantStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should throw and not update cache - if get all files throws", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);
      getAllFilesThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "Get all files test error",
      });

      //Get files should not be invoked after initialization - 8x times during initialization
      expect(getFileContent).toHaveBeenCalledTimes(8);

      //Cache data should not have been changed
      let expectedCache = {
        testPlant4:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant4.plant.config.json"],
        testPlant5:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant5.plant.config.json"],
        testPlant6:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant6.plant.config.json"],
      };

      expect((mindSphereApp as any)._plantStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should throw and not update cache - if get file throws", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);
      getFileContentThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "Get file content test error",
      });

      //Cache data should not have been changed
      let expectedCache = {
        testPlant4:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant4.plant.config.json"],
        testPlant5:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant5.plant.config.json"],
        testPlant6:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant6.plant.config.json"],
      };

      expect((mindSphereApp as any)._plantStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should not throw but not fetch to cache any plant and not call getFile - if check file returns null", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);

      checkFileReturnsNull = true;

      let result = await exec();

      let expectedResults = {
        testPlant4:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant4.plant.config.json"],
        testPlant5:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant5.plant.config.json"],
        testPlant6:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant6.plant.config.json"],
      };

      expect(result).toEqual(expectedResults);

      //Get all files should be invoked one additional time after initializiation (3x during initialization)
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(4);
      expect(getAllFileNamesFromAsset.mock.calls[3]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2-id",
        "plant.config.json",
      ]);

      //Get files should not be invoked after initialization - 8x times during initialization
      expect(getFileContent).toHaveBeenCalledTimes(8);

      //Cache data of users not present before should be fetched
      let expectedCache = {
        testPlant4:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant4.plant.config.json"],
        testPlant5:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant5.plant.config.json"],
        testPlant6:
          oldFileServiceContent["hostTenant"][
            "ten-testTenant2-sub-subtenant2-id"
          ]["testPlant6.plant.config.json"],
      };
      expect((mindSphereApp as any)._plantStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should throw and not fetch any data to cache if app is not initialized", async () => {
      initApp = false;

      await expect(exec()).rejects.toMatchObject({
        message: `Application not initialized!`,
      });

      expect(getFileContent).not.toHaveBeenCalled();

      //Cache data of storage should be fetched
      expect((mindSphereApp as any)._plantStorage._cacheData).toEqual({});
    });
  });

  //#endregion ===== PLANT STORAGE DATA =====
});

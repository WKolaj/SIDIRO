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
import {
  MindSphereUserData,
  MindSphereUserService,
} from "../../../../classes/MindSphereService/MindSphereUserService";
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
  setServiceAvailable,
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
        "ten-testTenant1": {
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
        "ten-testTenant1-sub-subtenant1": {
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
        "ten-testTenant2": {
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
        "ten-testTenant2-sub-subtenant2": {
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
        "ten-testTenant3": {
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
        "ten-testTenant3-sub-subtenant3": {
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

  //#region ===== USER MANAGEMENT =====

  describe("getUserIdIfExists", () => {
    let mindSphereApp: MindSphereApp;
    let storageTenant: string;
    let appId: string;
    let assetId: string;
    let appTenant: string;
    let subtenantId: string | null;
    let initApp: boolean;
    let userName: string;
    let getAllUsersThrows: boolean;

    beforeEach(async () => {
      storageTenant = "hostTenant";
      appId = "ten-testTenant2-sub-subtenant2";
      assetId = "ten-testTenant2-sub-subtenant2";
      appTenant = "testTenant2";
      subtenantId = "subtenant2";
      initApp = true;
      userName = "test_local_admin_22_user_name";
      getAllUsersThrows = false;
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

      if (getAllUsersThrows)
        MindSphereUserService.getInstance().getAllUsers = jest.fn(async () => {
          throw new Error("Test get all users error");
        });

      return mindSphereApp.getUserIdIfExists(userName);
    };

    it("should call MindSphere user API and return id of the user if it exists in MindSphere", async () => {
      let result = await exec();

      expect(result).toEqual("testLocalAdmin22");

      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        "subtenant2",
        null,
        "test_local_admin_22_user_name",
      ]);
    });

    it("should call MindSphere user API and return id of the user if it exists in MindSphere - even if it does not exist in file content", async () => {
      delete fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
        "testLocalAdmin22.user.config.json"
      ];

      let result = await exec();

      expect(result).toEqual("testLocalAdmin22");

      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        "subtenant2",
        null,
        "test_local_admin_22_user_name",
      ]);
    });

    it("should call MindSphere user API but return null if user exists in MindSphere tenant, but has not right subtenant assigned", async () => {
      //admin 21 is a user without subtenant assigned
      userName = "test_local_admin_21_user_name";

      let result = await exec();

      expect(result).toEqual(null);

      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        "subtenant2",
        null,
        "test_local_admin_21_user_name",
      ]);
    });

    it("should call MindSphere user API and return id of the user if it exists in MindSphere - user is not a subtenant user", async () => {
      //admin 21 is a user without subtenant assigned
      userName = "test_local_admin_21_user_name";
      appTenant = "testTenant2";
      subtenantId = null;

      let result = await exec();

      expect(result).toEqual("testLocalAdmin21");

      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        null,
        null,
        "test_local_admin_21_user_name",
      ]);
    });

    it("should call MindSphere user API and return id of the user if it exists in MindSphere - event if it is subtenant user but app is not for subtenant user", async () => {
      //We should assume that users contain subtenants may also be users of the app without subtenant
      //admin 22 is a user with subtenant assigned
      userName = "test_local_admin_22_user_name";
      appTenant = "testTenant2";
      subtenantId = null;

      let result = await exec();

      expect(result).toEqual("testLocalAdmin22");

      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        null,
        null,
        "test_local_admin_22_user_name",
      ]);
    });

    it("should call MindSphere user API but return null if user does not exist in MindSphere tenant", async () => {
      userName = "fakeUserName";

      let result = await exec();

      expect(result).toEqual(null);

      expect(getAllUsers).toHaveBeenCalledTimes(1);
      expect(getAllUsers.mock.calls[0]).toEqual([
        "testTenant2",
        "subtenant2",
        null,
        "fakeUserName",
      ]);
    });

    it("should throw if getAllUsers throws", async () => {
      getAllUsersThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "Test get all users error",
      });
    });

    it("should throw and not call getAllUsers - if app is not initialized", async () => {
      initApp = false;

      await expect(exec()).rejects.toMatchObject({
        message: "Application not initialized!",
      });

      expect(getAllUsers).not.toHaveBeenCalled();
    });
  });

  describe("userExistsInStorage", () => {
    let mindSphereApp: MindSphereApp;
    let storageTenant: string;
    let appId: string;
    let assetId: string;
    let appTenant: string;
    let subtenantId: string | null;
    let initApp: boolean;
    let userName: string;
    let newUserData: {
      [userId: string]: UserStorageData;
    };
    let getAllFilesThrows: boolean;
    let getFileContentThrows: boolean;
    let checkFileReturnsNull: boolean;

    beforeEach(async () => {
      storageTenant = "hostTenant";
      appId = "ten-testTenant2-sub-subtenant2";
      assetId = "ten-testTenant2-sub-subtenant2";
      appTenant = "testTenant2";
      subtenantId = "subtenant2";
      initApp = true;
      userName = "test_local_admin_22_user_name";
      newUserData = {
        "testLocalAdmin22.user.config.json": {
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
          userName: "test_local_admin_22_user_name",
          permissions: {
            role: UserRole.LocalAdmin,
            plants: {
              testPlant4: PlantPermissions.User,
              testPlant5: PlantPermissions.Admin,
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
        fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"] = {
          "main.app.config.json":
            fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
              "main.app.config.json"
            ],
          "testPlant4.plant.config.json":
            fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
              "testPlant4.plant.config.json"
            ],
          "testPlant5.plant.config.json":
            fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
              "testPlant5.plant.config.json"
            ],
          "testPlant6.plant.config.json":
            fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
              "testPlant6.plant.config.json"
            ],
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

      return mindSphereApp.userExistsInStorage(userName);
    };

    it("should return true if user exists in data storage in cache", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);

      let result = await exec();

      expect(result).toEqual(true);

      //Get all files should be invoked one additional time after initializiation (3x during initialization)
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(4);
      expect(getAllFileNamesFromAsset.mock.calls[3]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
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
        "ten-testTenant2-sub-subtenant2",
        "fakeUser3.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "fakeUser4.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "fakeUser5.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "fakeUser6.user.config.json",
      ]);

      //Cache data of users not present before should be fetched
      let expectedCache = {
        testLocalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalUser22.user.config.json"
          ],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalAdmin22.user.config.json"
          ],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalAdmin22.user.config.json"
          ],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalUser22.user.config.json"
          ],
        fakeUser3: newUserData["fakeUser3.user.config.json"],
        fakeUser4: newUserData["fakeUser4.user.config.json"],
        fakeUser5: newUserData["fakeUser5.user.config.json"],
        fakeUser6: newUserData["fakeUser6.user.config.json"],
      };

      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should return true if user exists in data storage in storage, not in cache", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);

      userName = "fakeUser4Email";

      let result = await exec();

      expect(result).toEqual(true);

      //Get all files should be invoked one additional time after initializiation (3x during initialization)
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(4);
      expect(getAllFileNamesFromAsset.mock.calls[3]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
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
        "ten-testTenant2-sub-subtenant2",
        "fakeUser3.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "fakeUser4.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "fakeUser5.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "fakeUser6.user.config.json",
      ]);

      //Cache data of users not present before should be fetched
      let expectedCache = {
        testLocalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalUser22.user.config.json"
          ],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalAdmin22.user.config.json"
          ],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalAdmin22.user.config.json"
          ],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalUser22.user.config.json"
          ],
        fakeUser3: newUserData["fakeUser3.user.config.json"],
        fakeUser4: newUserData["fakeUser4.user.config.json"],
        fakeUser5: newUserData["fakeUser5.user.config.json"],
        fakeUser6: newUserData["fakeUser6.user.config.json"],
      };

      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should return false if user does not exist in storage", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);

      userName = "fake_invalid_user_name";

      let result = await exec();

      expect(result).toEqual(false);

      //Get all files should be invoked one additional time after initializiation (3x during initialization)
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(4);
      expect(getAllFileNamesFromAsset.mock.calls[3]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
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
        "ten-testTenant2-sub-subtenant2",
        "fakeUser3.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "fakeUser4.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "fakeUser5.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "fakeUser6.user.config.json",
      ]);

      //Cache data of users not present before should be fetched
      let expectedCache = {
        testLocalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalUser22.user.config.json"
          ],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalAdmin22.user.config.json"
          ],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalAdmin22.user.config.json"
          ],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalUser22.user.config.json"
          ],
        fakeUser3: newUserData["fakeUser3.user.config.json"],
        fakeUser4: newUserData["fakeUser4.user.config.json"],
        fakeUser5: newUserData["fakeUser5.user.config.json"],
        fakeUser6: newUserData["fakeUser6.user.config.json"],
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
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalUser22.user.config.json"
          ],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalAdmin22.user.config.json"
          ],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalAdmin22.user.config.json"
          ],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalUser22.user.config.json"
          ],
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
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalUser22.user.config.json"
          ],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalAdmin22.user.config.json"
          ],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalAdmin22.user.config.json"
          ],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalUser22.user.config.json"
          ],
      };

      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should not throw but return true - if check file returns null but user exists in cache", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);

      checkFileReturnsNull = true;

      let result = await exec();

      expect(result).toEqual(true);

      //Get all files should be invoked one additional time after initializiation (3x during initialization)
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(4);
      expect(getAllFileNamesFromAsset.mock.calls[3]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "user.config.json",
      ]);

      //Get files should not be invoked after initialization - 8x times during initialization
      expect(getFileContent).toHaveBeenCalledTimes(8);

      //Cache data of users not present before should be fetched
      let expectedCache = {
        testLocalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalUser22.user.config.json"
          ],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalAdmin22.user.config.json"
          ],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalAdmin22.user.config.json"
          ],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalUser22.user.config.json"
          ],
      };
      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should not throw but return false - if check file returns null but user exists in cache", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);

      checkFileReturnsNull = true;

      userName = "fakeUser4Email";

      let result = await exec();

      expect(result).toEqual(false);

      //Get all files should be invoked one additional time after initializiation (3x during initialization)
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(4);
      expect(getAllFileNamesFromAsset.mock.calls[3]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "user.config.json",
      ]);

      //Get files should not be invoked after initialization - 8x times during initialization
      expect(getFileContent).toHaveBeenCalledTimes(8);

      //Cache data of users not present before should be fetched
      let expectedCache = {
        testLocalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalUser22.user.config.json"
          ],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalAdmin22.user.config.json"
          ],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalAdmin22.user.config.json"
          ],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalUser22.user.config.json"
          ],
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

  describe("userExistsInTenant", () => {
    let mindSphereApp: MindSphereApp;
    let storageTenant: string;
    let appId: string;
    let assetId: string;
    let appTenant: string;
    let subtenantId: string | null;
    let initApp: boolean;
    let userName: string;
    let checkIfUserExistsThrows: boolean;

    beforeEach(async () => {
      storageTenant = "hostTenant";
      appId = "ten-testTenant2-sub-subtenant2";
      assetId = "ten-testTenant2-sub-subtenant2";
      appTenant = "testTenant2";
      subtenantId = "subtenant2";
      initApp = true;
      userName = "test_local_admin_22_user_name";
      checkIfUserExistsThrows = false;
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

      if (checkIfUserExistsThrows)
        MindSphereUserService.getInstance().checkIfUserExists = jest.fn(
          async () => {
            throw new Error("Test check if user exists error");
          }
        );

      return mindSphereApp.userExistsInTenant(userName);
    };

    it("should call MindSphere user API and return true if user exists in MindSphere tenant", async () => {
      let result = await exec();

      expect(result).toEqual(true);

      expect(checkIfUserExists).toHaveBeenCalledTimes(1);
      expect(checkIfUserExists.mock.calls[0]).toEqual([
        "testTenant2",
        null,
        "test_local_admin_22_user_name",
      ]);
    });

    it("should call MindSphere user API and return false if user does not exist in MindSphere tenant", async () => {
      userName = "fakeUserName";

      let result = await exec();

      expect(result).toEqual(false);

      expect(checkIfUserExists).toHaveBeenCalledTimes(1);
      expect(checkIfUserExists.mock.calls[0]).toEqual([
        "testTenant2",
        null,
        "fakeUserName",
      ]);
    });

    it("should call MindSphere user API and return true if user exists in tenant but not in subtenant of the app", async () => {
      userName = "test_local_admin_21_user_name";

      let result = await exec();

      expect(result).toEqual(true);

      expect(checkIfUserExists).toHaveBeenCalledTimes(1);
      expect(checkIfUserExists.mock.calls[0]).toEqual([
        "testTenant2",
        null,
        "test_local_admin_21_user_name",
      ]);
    });

    it("should throw if checkIfUserExists throws", async () => {
      checkIfUserExistsThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "Test check if user exists error",
      });
    });

    it("should throw and not call checkIfUserExists - if app is not initialized", async () => {
      initApp = false;

      await expect(exec()).rejects.toMatchObject({
        message: "Application not initialized!",
      });

      expect(checkIfUserExists).not.toHaveBeenCalled();
    });
  });

  describe("userExistsInTenantAndStorage", () => {
    let mindSphereApp: MindSphereApp;
    let storageTenant: string;
    let appId: string;
    let assetId: string;
    let appTenant: string;
    let subtenantId: string | null;
    let initApp: boolean;
    let userName: string;
    let checkIfUserExistsThrows: boolean;
    let newUserData: {
      [userId: string]: UserStorageData;
    };
    let getAllFilesThrows: boolean;
    let getFileContentThrows: boolean;
    let checkFileReturnsNull: boolean;

    beforeEach(async () => {
      storageTenant = "hostTenant";
      appId = "ten-testTenant2-sub-subtenant2";
      assetId = "ten-testTenant2-sub-subtenant2";
      appTenant = "testTenant2";
      subtenantId = "subtenant2";
      initApp = true;
      userName = "test_local_admin_22_user_name";
      checkIfUserExistsThrows = false;
      newUserData = {
        "testLocalAdmin22.user.config.json": {
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
          userName: "test_local_admin_22_user_name",
          permissions: {
            role: UserRole.LocalAdmin,
            plants: {
              testPlant4: PlantPermissions.User,
              testPlant5: PlantPermissions.Admin,
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
      getAllFilesThrows = false;
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
        fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"] = {
          "main.app.config.json":
            fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
              "main.app.config.json"
            ],
          "testPlant4.plant.config.json":
            fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
              "testPlant4.plant.config.json"
            ],
          "testPlant5.plant.config.json":
            fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
              "testPlant5.plant.config.json"
            ],
          "testPlant6.plant.config.json":
            fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
              "testPlant6.plant.config.json"
            ],
          ...newUserData,
        };

        await mockMsFileService(fileServiceContent);
      }

      if (checkIfUserExistsThrows)
        MindSphereUserService.getInstance().checkIfUserExists = jest.fn(
          async () => {
            throw new Error("Test check if user exists error");
          }
        );

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

      return mindSphereApp.userExistsInTenantAndStorage(userName);
    };

    it("should call MindSphere user API and return true if user exists in MindSphere tenant and in app's user storage in cache", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);
      let result = await exec();

      expect(result).toEqual(true);

      expect(checkIfUserExists).toHaveBeenCalledTimes(1);
      expect(checkIfUserExists.mock.calls[0]).toEqual([
        "testTenant2",
        null,
        "test_local_admin_22_user_name",
      ]);

      //3 calls during initializaiton, 4th during checking
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(4);
      expect(getAllFileNamesFromAsset.mock.calls[3]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "user.config.json",
      ]);

      //8 calls during initializaiton, 9,10,11,12 during checking
      expect(getFileContent).toHaveBeenCalledTimes(12);

      let laterMockCalls = [
        getFileContent.mock.calls[8],
        getFileContent.mock.calls[9],
        getFileContent.mock.calls[10],
        getFileContent.mock.calls[11],
      ];

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "fakeUser3.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "fakeUser4.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "fakeUser5.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "fakeUser6.user.config.json",
      ]);

      //Cache data of users not present before should be fetched
      let expectedCache = {
        testLocalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalUser22.user.config.json"
          ],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalAdmin22.user.config.json"
          ],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalAdmin22.user.config.json"
          ],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalUser22.user.config.json"
          ],
        fakeUser3: newUserData["fakeUser3.user.config.json"],
        fakeUser4: newUserData["fakeUser4.user.config.json"],
        fakeUser5: newUserData["fakeUser5.user.config.json"],
        fakeUser6: newUserData["fakeUser6.user.config.json"],
      };

      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should call MindSphere user API and return true if user exists in MindSphere tenant and in app's user storage in storage", async () => {
      delete fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
        "testLocalAdmin22.user.config.json"
      ];
      let oldFileServiceContent = cloneObject(fileServiceContent);
      let result = await exec();

      expect(result).toEqual(true);

      expect(checkIfUserExists).toHaveBeenCalledTimes(1);
      expect(checkIfUserExists.mock.calls[0]).toEqual([
        "testTenant2",
        null,
        "test_local_admin_22_user_name",
      ]);

      //3 calls during initializaiton, 4th during checking
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(4);
      expect(getAllFileNamesFromAsset.mock.calls[3]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "user.config.json",
      ]);

      //7 calls during initializaiton, 8,9,10,11,12 during checking
      expect(getFileContent).toHaveBeenCalledTimes(12);

      let laterMockCalls = [
        getFileContent.mock.calls[7],
        getFileContent.mock.calls[8],
        getFileContent.mock.calls[9],
        getFileContent.mock.calls[10],
        getFileContent.mock.calls[11],
      ];

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testLocalAdmin22.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "fakeUser3.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "fakeUser4.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "fakeUser5.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "fakeUser6.user.config.json",
      ]);

      //Cache data of users not present before should be fetched
      let expectedCache = {
        testLocalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalUser22.user.config.json"
          ],
        testLocalAdmin22: newUserData["testLocalAdmin22.user.config.json"],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalAdmin22.user.config.json"
          ],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalUser22.user.config.json"
          ],
        fakeUser3: newUserData["fakeUser3.user.config.json"],
        fakeUser4: newUserData["fakeUser4.user.config.json"],
        fakeUser5: newUserData["fakeUser5.user.config.json"],
        fakeUser6: newUserData["fakeUser6.user.config.json"],
      };

      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should call MindSphere user API and return false if user does not exist in MindSphere tenant", async () => {
      delete userServiceContent["testTenant2"]["testLocalAdmin22"];

      let result = await exec();

      expect(result).toEqual(false);

      expect(checkIfUserExists).toHaveBeenCalledTimes(1);
      expect(checkIfUserExists.mock.calls[0]).toEqual([
        "testTenant2",
        null,
        "test_local_admin_22_user_name",
      ]);

      //Get all File names and get file content should not have been called
      //3 calls during initialization
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(3);

      //8 calls during initialization
      expect(getFileContent).toHaveBeenCalledTimes(8);
    });

    it("should call MindSphere user API and return false if user does not exist in MindSphere storage cache and storage", async () => {
      //Deleting user from storage and cache
      delete fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
        "testLocalAdmin22.user.config.json"
      ];
      delete newUserData["testLocalAdmin22.user.config.json"];

      let oldFileServiceContent = cloneObject(fileServiceContent);
      let result = await exec();

      expect(result).toEqual(false);

      expect(checkIfUserExists).toHaveBeenCalledTimes(1);
      expect(checkIfUserExists.mock.calls[0]).toEqual([
        "testTenant2",
        null,
        "test_local_admin_22_user_name",
      ]);

      //3 calls during initializaiton, 4th during checking
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(4);
      expect(getAllFileNamesFromAsset.mock.calls[3]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "user.config.json",
      ]);

      //7 calls during initializaiton, 8,9,10,11 during checking
      expect(getFileContent).toHaveBeenCalledTimes(11);

      let laterMockCalls = [
        getFileContent.mock.calls[7],
        getFileContent.mock.calls[8],
        getFileContent.mock.calls[9],
        getFileContent.mock.calls[10],
      ];

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "fakeUser3.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "fakeUser4.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "fakeUser5.user.config.json",
      ]);

      expect(laterMockCalls).toContainEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "fakeUser6.user.config.json",
      ]);

      //Cache data of users not present before should be fetched
      let expectedCache = {
        testLocalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalUser22.user.config.json"
          ],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalAdmin22.user.config.json"
          ],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalUser22.user.config.json"
          ],
        fakeUser3: newUserData["fakeUser3.user.config.json"],
        fakeUser4: newUserData["fakeUser4.user.config.json"],
        fakeUser5: newUserData["fakeUser5.user.config.json"],
        fakeUser6: newUserData["fakeUser6.user.config.json"],
      };

      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should throw if MindSphere getAllFilesThrows throws", async () => {
      getAllFilesThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "Get all files test error",
      });
    });

    it("should throw if MindSphere getFileContent throws", async () => {
      getFileContentThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "Get file content test error",
      });
    });

    it("should not throw but return false if MindSphere checkFile returns null and user is not inside storage cache", async () => {
      checkFileReturnsNull = true;
      delete fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
        "testLocalAdmin22.user.config.json"
      ];

      let oldFileServiceContent = cloneObject(fileServiceContent);

      let result = await exec();

      expect(result).toEqual(false);

      expect(checkIfUserExists).toHaveBeenCalledTimes(1);
      expect(checkIfUserExists.mock.calls[0]).toEqual([
        "testTenant2",
        null,
        "test_local_admin_22_user_name",
      ]);

      //3 calls during initializaiton, 4th during checking
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(4);
      expect(getAllFileNamesFromAsset.mock.calls[3]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "user.config.json",
      ]);

      //7 calls during initializaiton ONLY - check returns false
      expect(getFileContent).toHaveBeenCalledTimes(7);

      //Cache data of users not present before should be fetched
      let expectedCache = {
        testLocalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalUser22.user.config.json"
          ],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalAdmin22.user.config.json"
          ],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalUser22.user.config.json"
          ],
      };

      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should not throw but return true if MindSphere checkFile returns null but user is inside storage cache", async () => {
      checkFileReturnsNull = true;

      let oldFileServiceContent = cloneObject(fileServiceContent);

      let result = await exec();

      expect(result).toEqual(true);

      expect(checkIfUserExists).toHaveBeenCalledTimes(1);
      expect(checkIfUserExists.mock.calls[0]).toEqual([
        "testTenant2",
        null,
        "test_local_admin_22_user_name",
      ]);

      //3 calls during initializaiton, 4th during checking
      expect(getAllFileNamesFromAsset).toHaveBeenCalledTimes(4);
      expect(getAllFileNamesFromAsset.mock.calls[3]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "user.config.json",
      ]);

      //8 calls during initializaiton ONLY - check returns false
      expect(getFileContent).toHaveBeenCalledTimes(8);

      //Cache data of users not present before should be fetched
      let expectedCache = {
        testLocalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalUser22.user.config.json"
          ],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalAdmin22.user.config.json"
          ],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalAdmin22.user.config.json"
          ],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalUser22.user.config.json"
          ],
      };

      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should throw and not call any API - if app is not initialized", async () => {
      initApp = false;

      await expect(exec()).rejects.toMatchObject({
        message: "Application not initialized!",
      });

      expect(checkIfUserExists).not.toHaveBeenCalled();
      expect(getAllFileNamesFromAsset).not.toHaveBeenCalled();
      expect(getFileContent).not.toHaveBeenCalled();
    });
  });

  describe("userAssignedToApp", () => {
    let mindSphereApp: MindSphereApp;
    let storageTenant: string;
    let appId: string;
    let assetId: string;
    let appTenant: string;
    let subtenantId: string | null;
    let initApp: boolean;
    let userId: string;
    let newUserData: {
      [userId: string]: UserStorageData;
    };
    let getFileContentThrows: boolean;
    let checkFileReturnsNull: boolean;

    beforeEach(async () => {
      storageTenant = "hostTenant";
      appId = "ten-testTenant2-sub-subtenant2";
      assetId = "ten-testTenant2-sub-subtenant2";
      appTenant = "testTenant2";
      subtenantId = "subtenant2";
      initApp = true;
      userId = "testLocalAdmin22";
      newUserData = {
        "testLocalAdmin22.user.config.json": {
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
          userName: "test_local_admin_22_user_name",
          permissions: {
            role: UserRole.LocalAdmin,
            plants: {
              testPlant4: PlantPermissions.User,
              testPlant5: PlantPermissions.Admin,
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
        fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"] = {
          "main.app.config.json":
            fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
              "main.app.config.json"
            ],
          "testPlant4.plant.config.json":
            fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
              "testPlant4.plant.config.json"
            ],
          "testPlant5.plant.config.json":
            fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
              "testPlant5.plant.config.json"
            ],
          "testPlant6.plant.config.json":
            fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
              "testPlant6.plant.config.json"
            ],
          ...newUserData,
        };

        await mockMsFileService(fileServiceContent);
      }

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

      return mindSphereApp.userAssignedToApp(userId);
    };

    it("should return true if user exists in data storage in cache", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);

      let result = await exec();

      expect(result).toEqual(true);

      //Get file and check if file exists should not be invoked after initialzation - user already in cache
      expect(getFileContent).toHaveBeenCalledTimes(8);
      expect(checkIfFileExists).toHaveBeenCalledTimes(8);

      //Cache should not have changed
      let expectedCache = {
        testLocalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalUser22.user.config.json"
          ],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalAdmin22.user.config.json"
          ],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalAdmin22.user.config.json"
          ],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalUser22.user.config.json"
          ],
      };

      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should return true if user exists in data storage in storage", async () => {
      delete fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
        "testLocalAdmin22.user.config.json"
      ];

      let oldFileServiceContent = cloneObject(fileServiceContent);

      let result = await exec();

      expect(result).toEqual(true);

      //Get file and check if file exists should be invoked one additional time(x1) after initialization (x7)
      expect(checkIfFileExists).toHaveBeenCalledTimes(8);
      expect(checkIfFileExists.mock.calls[7]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testLocalAdmin22.user.config.json",
      ]);
      expect(getFileContent).toHaveBeenCalledTimes(8);
      expect(getFileContent.mock.calls[7]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testLocalAdmin22.user.config.json",
      ]);

      //Cache should have changed - fetch new user from storage
      let expectedCache = {
        testLocalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalUser22.user.config.json"
          ],
        testLocalAdmin22: newUserData["testLocalAdmin22.user.config.json"],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalAdmin22.user.config.json"
          ],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalUser22.user.config.json"
          ],
      };

      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should return false if user does not exist in data storage in storage or cache", async () => {
      delete fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
        "testLocalAdmin22.user.config.json"
      ];
      delete newUserData["testLocalAdmin22.user.config.json"];

      let oldFileServiceContent = cloneObject(fileServiceContent);

      let result = await exec();

      expect(result).toEqual(false);

      //check if file exists should be invoked one additional time(x1) after initialization (x7)
      expect(checkIfFileExists).toHaveBeenCalledTimes(8);
      expect(checkIfFileExists.mock.calls[7]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testLocalAdmin22.user.config.json",
      ]);

      //Get file should be called only during initialization (x7)
      expect(getFileContent).toHaveBeenCalledTimes(7);

      //Cache should have changed - fetch new user from storage
      let expectedCache = {
        testLocalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalUser22.user.config.json"
          ],
        testLocalAdmin22: newUserData["testLocalAdmin22.user.config.json"],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalAdmin22.user.config.json"
          ],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalUser22.user.config.json"
          ],
      };

      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should return false if check file returns null and user does not exist in cache", async () => {
      delete fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
        "testLocalAdmin22.user.config.json"
      ];
      checkFileReturnsNull = true;

      let oldFileServiceContent = cloneObject(fileServiceContent);

      let result = await exec();

      expect(result).toEqual(false);

      //Get file should be called only during initialization (x7) - check file returns null
      expect(getFileContent).toHaveBeenCalledTimes(7);

      //Cache should not have changed
      let expectedCache = {
        testLocalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalUser22.user.config.json"
          ],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalAdmin22.user.config.json"
          ],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalUser22.user.config.json"
          ],
      };

      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should return true if check file returns null but user exists in cache", async () => {
      checkFileReturnsNull = true;

      let oldFileServiceContent = cloneObject(fileServiceContent);

      let result = await exec();

      expect(result).toEqual(true);

      //Get file should be called only during initialization (x8) - check file returns null
      expect(getFileContent).toHaveBeenCalledTimes(8);

      //Cache should not have changed
      let expectedCache = {
        testLocalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalUser22.user.config.json"
          ],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalAdmin22.user.config.json"
          ],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalAdmin22.user.config.json"
          ],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalUser22.user.config.json"
          ],
      };

      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should throw - if get file content throws and user does not exist in cache", async () => {
      delete fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
        "testLocalAdmin22.user.config.json"
      ];
      getFileContentThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "Get file content test error",
      });
    });

    it("should throw and not call any API - if app is not initialized", async () => {
      initApp = false;

      await expect(exec()).rejects.toMatchObject({
        message: "Application not initialized!",
      });

      expect(checkIfUserExists).not.toHaveBeenCalled();
      expect(getFileContent).not.toHaveBeenCalled();
    });
  });

  describe("getUser", () => {
    let mindSphereApp: MindSphereApp;
    let storageTenant: string;
    let appId: string;
    let assetId: string;
    let appTenant: string;
    let subtenantId: string | null;
    let initApp: boolean;
    let userId: string;
    let newUserData: {
      [userId: string]: UserStorageData;
    };
    let getFileContentThrows: boolean;
    let checkFileReturnsNull: boolean;

    beforeEach(async () => {
      storageTenant = "hostTenant";
      appId = "ten-testTenant2-sub-subtenant2";
      assetId = "ten-testTenant2-sub-subtenant2";
      appTenant = "testTenant2";
      subtenantId = "subtenant2";
      initApp = true;
      userId = "testLocalAdmin22";
      newUserData = {
        "testLocalAdmin22.user.config.json": {
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
          userName: "test_local_admin_22_user_name",
          permissions: {
            role: UserRole.LocalAdmin,
            plants: {
              testPlant4: PlantPermissions.User,
              testPlant5: PlantPermissions.Admin,
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
        fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"] = {
          "main.app.config.json":
            fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
              "main.app.config.json"
            ],
          "testPlant4.plant.config.json":
            fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
              "testPlant4.plant.config.json"
            ],
          "testPlant5.plant.config.json":
            fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
              "testPlant5.plant.config.json"
            ],
          "testPlant6.plant.config.json":
            fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
              "testPlant6.plant.config.json"
            ],
          ...newUserData,
        };

        await mockMsFileService(fileServiceContent);
      }

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

      return mindSphereApp.getUser(userId);
    };

    it("should return user storage data and user mindsphere data with fetched groups if user exists in MindSphere and in data storage in cache", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);

      let result = await exec();

      let expectedResult = {
        msData: userServiceContent["testTenant2"]["testLocalAdmin22"],
        storageData:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalAdmin22.user.config.json"
          ],
      };

      for (let group of Object.values(userGroupServiceContent["testTenant2"])) {
        if (
          group.members.find((user) => user.value === "testLocalAdmin22") !=
          null
        )
          expectedResult.msData.groups!.push({
            display: group.displayName,
            type: "DIRECT",
            value: group.id!,
          });
      }

      expect(result).toEqual(expectedResult);

      //Get user MindSphere API should have been called
      expect(getUser).toHaveBeenCalledTimes(1);
      expect(getUser.mock.calls[0]).toEqual([
        "testTenant2",
        "testLocalAdmin22",
      ]);
    });

    it("should return user storage data and user mindsphere data with fetched groups if user exists in MindSphere and in data storage in storage - not cache", async () => {
      delete fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
        "testLocalAdmin22.user.config.json"
      ];

      let oldFileServiceContent = cloneObject(fileServiceContent);

      let result = await exec();

      let expectedResult = {
        msData: userServiceContent["testTenant2"]["testLocalAdmin22"],
        storageData: newUserData["testLocalAdmin22.user.config.json"],
      };

      for (let group of Object.values(userGroupServiceContent["testTenant2"])) {
        if (
          group.members.find((user) => user.value === "testLocalAdmin22") !=
          null
        )
          expectedResult.msData.groups!.push({
            display: group.displayName,
            type: "DIRECT",
            value: group.id!,
          });
      }

      expect(result).toEqual(expectedResult);

      //Get user MindSphere API should have been called
      expect(getUser).toHaveBeenCalledTimes(1);
      expect(getUser.mock.calls[0]).toEqual([
        "testTenant2",
        "testLocalAdmin22",
      ]);
    });

    it("should return user storage data and user mindsphere data with fetched groups if user exists in MindSphere and in data storage in cache, but user does not have any group assigned", async () => {
      //Removing user from every group it exists in
      for (let group of Object.values(userGroupServiceContent["testTenant2"])) {
        group.members = group.members.filter(
          (user) => user.value !== "testLocalAdmin22"
        );
      }

      let oldFileServiceContent = cloneObject(fileServiceContent);

      let result = await exec();

      let expectedResult = {
        msData: userServiceContent["testTenant2"]["testLocalAdmin22"],
        storageData:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalAdmin22.user.config.json"
          ],
      };

      expectedResult.msData.groups = [];

      expect(result).toEqual(expectedResult);

      //Get user MindSphere API should have been called
      expect(getUser).toHaveBeenCalledTimes(1);
      expect(getUser.mock.calls[0]).toEqual([
        "testTenant2",
        "testLocalAdmin22",
      ]);
    });

    it("should throw if there is no such user in mindsphere tenant", async () => {
      delete userServiceContent["testTenant2"]["testLocalAdmin22"];

      let oldFileServiceContent = cloneObject(fileServiceContent);

      let result = await expect(exec()).rejects.toMatchObject({
        message: "User of given id not found",
      });

      //Get user MindSphere API should have been called
      expect(getUser).toHaveBeenCalledTimes(1);
      expect(getUser.mock.calls[0]).toEqual([
        "testTenant2",
        "testLocalAdmin22",
      ]);
    });

    it("should throw if user is not assigned to the app", async () => {
      //Test local admin is assigned to the same tenant but not to this app (with subtenant)
      userId = "testLocalAdmin21";

      await expect(exec()).rejects.toMatchObject({
        message: "Cannot get user that is not assigned to the app!",
      });

      //Get user MindSphere API should not have been called - user not assinged to the app
      expect(getUser).not.toHaveBeenCalled();
    });

    it("should throw if user is not inside cache and checkFileReturnsNull returns null", async () => {
      delete fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
        "testLocalAdmin22.user.config.json"
      ];

      checkFileReturnsNull = true;

      await expect(exec()).rejects.toMatchObject({
        message: "Cannot get user that is not assigned to the app!",
      });

      //Get user MindSphere API should not have been called - user not assinged to the app
      expect(getUser).not.toHaveBeenCalled();
    });

    it("should throw if user is not inside cache and getFileContent throws", async () => {
      delete fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
        "testLocalAdmin22.user.config.json"
      ];

      getFileContentThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "Get file content test error",
      });

      //Get user MindSphere API should not have been called - user not assinged to the app
      expect(getUser).not.toHaveBeenCalled();
    });

    it("should throw and not call any API - if app is not initialzied", async () => {
      initApp = false;

      await expect(exec()).rejects.toMatchObject({
        message: "Application not initialized!",
      });

      //Get user MindSphere API should not have been called - user not assinged to the app
      expect(getUser).not.toHaveBeenCalled();
    });
  });

  describe("createUser", () => {
    let mindSphereApp: MindSphereApp;
    let storageTenant: string;
    let appId: string;
    let assetId: string;
    let appTenant: string;
    let subtenantId: string | null;
    let initApp: boolean;
    let userPayload: UserStorageData;
    let addUserToGroupThrows: boolean;
    let createUserThrows: boolean;

    beforeEach(async () => {
      storageTenant = "hostTenant";
      appId = "ten-testTenant2-sub-subtenant2";
      assetId = "ten-testTenant2-sub-subtenant2";
      appTenant = "testTenant2";
      subtenantId = "subtenant2";
      initApp = true;
      userPayload = {
        config: {
          fakePlant1: { fakeUserConfig: "newUserPlant1Config" },
          fakePlant2: { fakeUserConfig: "newUserPlant2Config" },
        },
        data: {
          fakePlant1: { fakeUserData: "newUserPlant1Data" },
          fakePlant2: { fakeUserData: "newUserPlant2Data" },
        },
        permissions: {
          role: UserRole.LocalAdmin,
          plants: {
            fakePlant1: PlantPermissions.User,
            fakePlant2: PlantPermissions.Admin,
          },
        },
        userName: "newUserUserName",
      };
      addUserToGroupThrows = false;
      createUserThrows = false;
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

      if (addUserToGroupThrows)
        MindSphereUserGroupService.getInstance().addUserToGroup = jest.fn(
          async () => {
            throw new Error("add user to group test error");
          }
        );

      if (createUserThrows)
        MindSphereUserService.getInstance().createUser = jest.fn(async () => {
          throw new Error("create user test error");
        });

      return mindSphereApp.createUser(userPayload);
    };

    it("should create user in storage and in MindSphere user service and return its payload - if app is a subtenant app", async () => {
      let result = await exec();

      //Id of user should have been assigned
      expect(result.msData.id).toBeDefined();

      //User should be accessible via getUser
      let createdUser = await mindSphereApp.getUser(result.msData.id!);

      let expectedStorageData: UserStorageData = userPayload;
      let expectedMSData: MindSphereUserData = {
        active: true,
        name: {},
        userName: userPayload.userName,
        subtenants: [
          {
            id: subtenantId!,
          },
        ],
        groups: [
          {
            display: "localAdminGroupDisplayName",
            type: "DIRECT",
            value: "localAdminGroup",
          },
          {
            display: "subtenantUserGroupDisplayName",
            type: "DIRECT",
            value: "subtenantUserGroup",
          },
        ],
      };

      expect(createdUser.storageData).toEqual(expectedStorageData);
      expect(createdUser.msData).toMatchObject(expectedMSData);
    });

    it("should return created user - if app is a subtenant app", async () => {
      let result = await exec();

      let expectedStorageData: UserStorageData = userPayload;
      let expectedMSData: MindSphereUserData = {
        active: true,
        name: {},
        userName: userPayload.userName,
        subtenants: [
          {
            id: subtenantId!,
          },
        ],
        groups: [
          {
            display: "localAdminGroupDisplayName",
            type: "DIRECT",
            value: "localAdminGroup",
          },
          {
            display: "subtenantUserGroupDisplayName",
            type: "DIRECT",
            value: "subtenantUserGroup",
          },
        ],
      };

      expect(result.storageData).toEqual(expectedStorageData);
      expect(result.msData).toMatchObject(expectedMSData);
    });

    it("should call create user and setFile while creating user - if app is a subtenant app", async () => {
      let result = await exec();

      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        `${result.msData.id}.user.config.json`,
        userPayload,
      ]);

      expect(createUser).toHaveBeenCalledTimes(1);
      expect(createUser.mock.calls[0]).toEqual([
        "testTenant2",
        {
          active: true,
          name: {},
          userName: userPayload.userName,
          subtenants: [
            {
              id: subtenantId!,
            },
          ],
        },
      ]);
    });

    it("should assign standard subtenant user group and permissions group - if app is a subtenant app", async () => {
      let result = await exec();

      expect(addUserToGroup).toHaveBeenCalledTimes(2);
      expect(addUserToGroup.mock.calls).toContainEqual([
        "testTenant2",
        "localAdminGroup",
        result.msData.id,
      ]);
      expect(addUserToGroup.mock.calls).toContainEqual([
        "testTenant2",
        "subtenantUserGroup",
        result.msData.id,
      ]);
    });

    it("should create user in storage and in MindSphere user service and return its payload - if app is not subtenant app", async () => {
      appId = "ten-testTenant2";
      assetId = "ten-testTenant2";
      appTenant = "testTenant2";
      subtenantId = null;

      let result = await exec();

      //Id of user should have been assigned
      expect(result.msData.id).toBeDefined();

      //User should be accessible via getUser
      let createdUser = await mindSphereApp.getUser(result.msData.id!);

      let expectedStorageData: UserStorageData = userPayload;
      let expectedMSData: MindSphereUserData = {
        active: true,
        name: {},
        userName: userPayload.userName,
        groups: [
          {
            display: "localAdminGroupDisplayName",
            type: "DIRECT",
            value: "localAdminGroup",
          },
          {
            display: "standardUserGroupDisplayName",
            type: "DIRECT",
            value: "standardUserGroup",
          },
        ],
      };

      expect(createdUser.storageData).toEqual(expectedStorageData);
      expect(createdUser.msData).toMatchObject(expectedMSData);
    });

    it("should return created user - if app is not a subtenant app", async () => {
      appId = "ten-testTenant2";
      assetId = "ten-testTenant2";
      appTenant = "testTenant2";
      subtenantId = null;

      let result = await exec();

      let expectedStorageData: UserStorageData = userPayload;
      let expectedMSData: MindSphereUserData = {
        active: true,
        name: {},
        userName: userPayload.userName,
        groups: [
          {
            display: "localAdminGroupDisplayName",
            type: "DIRECT",
            value: "localAdminGroup",
          },
          {
            display: "standardUserGroupDisplayName",
            type: "DIRECT",
            value: "standardUserGroup",
          },
        ],
      };

      expect(result.storageData).toEqual(expectedStorageData);
      expect(result.msData).toMatchObject(expectedMSData);
    });

    it("should call create user and setFile while creating user - if app is not a subtenant app", async () => {
      appId = "ten-testTenant2";
      assetId = "ten-testTenant2";
      appTenant = "testTenant2";
      subtenantId = null;

      let result = await exec();

      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2",
        `${result.msData.id}.user.config.json`,
        userPayload,
      ]);

      expect(createUser).toHaveBeenCalledTimes(1);
      expect(createUser.mock.calls[0]).toEqual([
        "testTenant2",
        {
          active: true,
          name: {},
          userName: userPayload.userName,
        },
      ]);
    });

    it("should assign standard subtenant user group and permissions group - if app is not a subtenant app", async () => {
      appId = "ten-testTenant2";
      assetId = "ten-testTenant2";
      appTenant = "testTenant2";
      subtenantId = null;

      let result = await exec();

      expect(addUserToGroup).toHaveBeenCalledTimes(2);
      expect(addUserToGroup.mock.calls).toContainEqual([
        "testTenant2",
        "localAdminGroup",
        result.msData.id,
      ]);
      expect(addUserToGroup.mock.calls).toContainEqual([
        "testTenant2",
        "standardUserGroup",
        result.msData.id,
      ]);
    });

    it("should create user and assign proper groups to him - if created user is a global admin", async () => {
      userPayload.permissions.role = UserRole.GlobalAdmin;

      let result = await exec();

      //Id of user should have been assigned
      expect(result.msData.id).toBeDefined();

      //User file content should be set
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        `${result.msData.id}.user.config.json`,
        userPayload,
      ]);

      //User should be created in MindSphere
      expect(createUser).toHaveBeenCalledTimes(1);
      expect(createUser.mock.calls[0]).toEqual([
        "testTenant2",
        {
          active: true,
          name: {},
          userName: userPayload.userName,
          subtenants: [
            {
              id: subtenantId!,
            },
          ],
        },
      ]);

      //Add user to group should be called two times
      expect(addUserToGroup).toHaveBeenCalledTimes(2);
      expect(addUserToGroup.mock.calls).toContainEqual([
        "testTenant2",
        "globalAdminGroup",
        result.msData.id,
      ]);
      expect(addUserToGroup.mock.calls).toContainEqual([
        "testTenant2",
        "subtenantUserGroup",
        result.msData.id,
      ]);

      //User should be accessible via getUser
      let createdUser = await mindSphereApp.getUser(result.msData.id!);

      let expectedStorageData: UserStorageData = userPayload;
      let expectedMSData: MindSphereUserData = {
        active: true,
        name: {},
        userName: userPayload.userName,
        subtenants: [
          {
            id: subtenantId!,
          },
        ],
        groups: [
          {
            display: "globalAdminGroupDisplayName",
            type: "DIRECT",
            value: "globalAdminGroup",
          },
          {
            display: "subtenantUserGroupDisplayName",
            type: "DIRECT",
            value: "subtenantUserGroup",
          },
        ],
      };

      expect(createdUser.storageData).toEqual(expectedStorageData);
      expect(createdUser.msData).toMatchObject(expectedMSData);
    });

    it("should create user and assign proper groups to him - if created user is a global user", async () => {
      userPayload.permissions.role = UserRole.GlobalUser;

      let result = await exec();

      //Id of user should have been assigned
      expect(result.msData.id).toBeDefined();

      //User file content should be set
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        `${result.msData.id}.user.config.json`,
        userPayload,
      ]);

      //User should be created in MindSphere
      expect(createUser).toHaveBeenCalledTimes(1);
      expect(createUser.mock.calls[0]).toEqual([
        "testTenant2",
        {
          active: true,
          name: {},
          userName: userPayload.userName,
          subtenants: [
            {
              id: subtenantId!,
            },
          ],
        },
      ]);

      //Add user to group should be called two times
      expect(addUserToGroup).toHaveBeenCalledTimes(2);
      expect(addUserToGroup.mock.calls).toContainEqual([
        "testTenant2",
        "globalUserGroup",
        result.msData.id,
      ]);
      expect(addUserToGroup.mock.calls).toContainEqual([
        "testTenant2",
        "subtenantUserGroup",
        result.msData.id,
      ]);

      //User should be accessible via getUser
      let createdUser = await mindSphereApp.getUser(result.msData.id!);

      let expectedStorageData: UserStorageData = userPayload;
      let expectedMSData: MindSphereUserData = {
        active: true,
        name: {},
        userName: userPayload.userName,
        subtenants: [
          {
            id: subtenantId!,
          },
        ],
        groups: [
          {
            display: "globalUserGroupDisplayName",
            type: "DIRECT",
            value: "globalUserGroup",
          },
          {
            display: "subtenantUserGroupDisplayName",
            type: "DIRECT",
            value: "subtenantUserGroup",
          },
        ],
      };

      expect(createdUser.storageData).toEqual(expectedStorageData);
      expect(createdUser.msData).toMatchObject(expectedMSData);
    });

    it("should create user and assign proper groups to him - if created user is a local admin", async () => {
      userPayload.permissions.role = UserRole.LocalAdmin;

      let result = await exec();

      //Id of user should have been assigned
      expect(result.msData.id).toBeDefined();

      //User file content should be set
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        `${result.msData.id}.user.config.json`,
        userPayload,
      ]);

      //User should be created in MindSphere
      expect(createUser).toHaveBeenCalledTimes(1);
      expect(createUser.mock.calls[0]).toEqual([
        "testTenant2",
        {
          active: true,
          name: {},
          userName: userPayload.userName,
          subtenants: [
            {
              id: subtenantId!,
            },
          ],
        },
      ]);

      //Add user to group should be called two times
      expect(addUserToGroup).toHaveBeenCalledTimes(2);
      expect(addUserToGroup.mock.calls).toContainEqual([
        "testTenant2",
        "localAdminGroup",
        result.msData.id,
      ]);
      expect(addUserToGroup.mock.calls).toContainEqual([
        "testTenant2",
        "subtenantUserGroup",
        result.msData.id,
      ]);

      //User should be accessible via getUser
      let createdUser = await mindSphereApp.getUser(result.msData.id!);

      let expectedStorageData: UserStorageData = userPayload;
      let expectedMSData: MindSphereUserData = {
        active: true,
        name: {},
        userName: userPayload.userName,
        subtenants: [
          {
            id: subtenantId!,
          },
        ],
        groups: [
          {
            display: "localAdminGroupDisplayName",
            type: "DIRECT",
            value: "localAdminGroup",
          },
          {
            display: "subtenantUserGroupDisplayName",
            type: "DIRECT",
            value: "subtenantUserGroup",
          },
        ],
      };

      expect(createdUser.storageData).toEqual(expectedStorageData);
      expect(createdUser.msData).toMatchObject(expectedMSData);
    });

    it("should create user and assign proper groups to him - if created user is a local user", async () => {
      userPayload.permissions.role = UserRole.LocalUser;

      let result = await exec();

      //Id of user should have been assigned
      expect(result.msData.id).toBeDefined();

      //User file content should be set
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        `${result.msData.id}.user.config.json`,
        userPayload,
      ]);

      //User should be created in MindSphere
      expect(createUser).toHaveBeenCalledTimes(1);
      expect(createUser.mock.calls[0]).toEqual([
        "testTenant2",
        {
          active: true,
          name: {},
          userName: userPayload.userName,
          subtenants: [
            {
              id: subtenantId!,
            },
          ],
        },
      ]);

      //Add user to group should be called two times
      expect(addUserToGroup).toHaveBeenCalledTimes(2);
      expect(addUserToGroup.mock.calls).toContainEqual([
        "testTenant2",
        "localUserGroup",
        result.msData.id,
      ]);
      expect(addUserToGroup.mock.calls).toContainEqual([
        "testTenant2",
        "subtenantUserGroup",
        result.msData.id,
      ]);

      //User should be accessible via getUser
      let createdUser = await mindSphereApp.getUser(result.msData.id!);

      let expectedStorageData: UserStorageData = userPayload;
      let expectedMSData: MindSphereUserData = {
        active: true,
        name: {},
        userName: userPayload.userName,
        subtenants: [
          {
            id: subtenantId!,
          },
        ],
        groups: [
          {
            display: "localUserGroupDisplayName",
            type: "DIRECT",
            value: "localUserGroup",
          },
          {
            display: "subtenantUserGroupDisplayName",
            type: "DIRECT",
            value: "subtenantUserGroup",
          },
        ],
      };

      expect(createdUser.storageData).toEqual(expectedStorageData);
      expect(createdUser.msData).toMatchObject(expectedMSData);
    });

    it("should throw and not create any user in storage or in MindSphere - if app is not initialized", async () => {
      initApp = false;

      await expect(exec()).rejects.toMatchObject({
        message: "Application not initialized!",
      });

      //Any user file content should not have been set
      expect(setFileContent).not.toHaveBeenCalled();

      //Any user should not have been created
      expect(createUser).not.toHaveBeenCalled();
    });

    it("should throw and not create any user in storage or in MindSphere - if create user throws", async () => {
      createUserThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "create user test error",
      });

      //User should not have been set in storage
      expect(setFileContent).not.toHaveBeenCalled();
    });

    it("should throw and not create any user in storage or in MindSphere - if add user to group throws", async () => {
      addUserToGroupThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "add user to group test error",
      });

      //User should not have been set in storage
      expect(setFileContent).not.toHaveBeenCalled();
    });
  });

  describe("deleteUser", () => {
    let mindSphereApp: MindSphereApp;
    let storageTenant: string;
    let appId: string;
    let assetId: string;
    let appTenant: string;
    let subtenantId: string | null;
    let initApp: boolean;
    let userId: string;
    let newUserData: {
      [userId: string]: UserStorageData;
    };
    let deleteUserThrows: boolean;

    beforeEach(async () => {
      storageTenant = "hostTenant";
      appId = "ten-testTenant2-sub-subtenant2";
      assetId = "ten-testTenant2-sub-subtenant2";
      appTenant = "testTenant2";
      subtenantId = "subtenant2";
      initApp = true;
      userId = "testLocalAdmin22";
      newUserData = {
        "testLocalAdmin22.user.config.json": {
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
          userName: "test_local_admin_22_user_name",
          permissions: {
            role: UserRole.LocalAdmin,
            plants: {
              testPlant4: PlantPermissions.User,
              testPlant5: PlantPermissions.Admin,
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
      deleteUserThrows = false;
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
        fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"] = {
          "main.app.config.json":
            fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
              "main.app.config.json"
            ],
          "testPlant4.plant.config.json":
            fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
              "testPlant4.plant.config.json"
            ],
          "testPlant5.plant.config.json":
            fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
              "testPlant5.plant.config.json"
            ],
          "testPlant6.plant.config.json":
            fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
              "testPlant6.plant.config.json"
            ],
          ...newUserData,
        };

        await mockMsFileService(fileServiceContent);
      }

      if (deleteUserThrows)
        MindSphereUserService.getInstance().deleteUser = jest.fn(async () => {
          throw new Error("Test delete user error");
        });

      return mindSphereApp.deleteUser(userId);
    };

    it("should delete user from MindSphere tenant and from storage", async () => {
      let oldFileServiceContent = cloneObject(fileServiceContent);

      await exec();

      //Delete user MindSphere API should have been called
      expect(deleteUser).toHaveBeenCalledTimes(1);
      expect(deleteUser.mock.calls[0]).toEqual([
        "testTenant2",
        "testLocalAdmin22",
      ]);

      //Delete file should have been called
      expect(deleteFile).toHaveBeenCalledTimes(1);
      expect(deleteFile.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testLocalAdmin22.user.config.json",
      ]);

      let expectedCache = {
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalAdmin22.user.config.json"
          ],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalUser22.user.config.json"
          ],
        testLocalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalUser22.user.config.json"
          ],
      };

      //User should have disappear from cache
      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should throw and not delete user - if it exists but is not assigned to this app - app is for subtenant, user from the same tenant, but lack of subtenant", async () => {
      userId = "testLocalAdmin21";
      let oldFileServiceContent = cloneObject(fileServiceContent);

      await expect(exec()).rejects.toMatchObject({
        message: "Cannot delete user that is not assigned to the app!",
      });

      //Delete user MindSphere API should have been called
      expect(deleteUser).not.toHaveBeenCalled();
      expect(deleteFile).not.toHaveBeenCalled();

      let expectedCache = {
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalAdmin22.user.config.json"
          ],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalAdmin22.user.config.json"
          ],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalUser22.user.config.json"
          ],
        testLocalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalUser22.user.config.json"
          ],
      };

      //User should have disappear from cache
      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should throw and not delete user - if it exists but is not assigned to this app - app is for tenant, user from the same tenant, but additional subtenant", async () => {
      appId = "ten-testTenant2";
      assetId = "ten-testTenant2";
      appTenant = "testTenant2";
      subtenantId = null;

      userId = "testLocalAdmin22";
      let oldFileServiceContent = cloneObject(fileServiceContent);

      await expect(exec()).rejects.toMatchObject({
        message: "Cannot delete user that is not assigned to the app!",
      });

      //Delete user MindSphere API should have been called
      expect(deleteUser).not.toHaveBeenCalled();
      expect(deleteFile).not.toHaveBeenCalled();

      let expectedCache = {
        testLocalAdmin21:
          oldFileServiceContent["hostTenant"]["ten-testTenant2"][
            "testLocalAdmin21.user.config.json"
          ],
        testGlobalAdmin21:
          oldFileServiceContent["hostTenant"]["ten-testTenant2"][
            "testGlobalAdmin21.user.config.json"
          ],
        testGlobalUser21:
          oldFileServiceContent["hostTenant"]["ten-testTenant2"][
            "testGlobalUser21.user.config.json"
          ],
        testLocalUser21:
          oldFileServiceContent["hostTenant"]["ten-testTenant2"][
            "testLocalUser21.user.config.json"
          ],
      };

      //User should have disappear from cache
      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should throw and not delete user - if it exists but is not assigned to this app - app is for subtenant, user from different tenant", async () => {
      userId = "testLocalAdmin11";
      let oldFileServiceContent = cloneObject(fileServiceContent);

      await expect(exec()).rejects.toMatchObject({
        message: "Cannot delete user that is not assigned to the app!",
      });

      //Delete user MindSphere API should have been called
      expect(deleteUser).not.toHaveBeenCalled();
      expect(deleteFile).not.toHaveBeenCalled();

      let expectedCache = {
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalAdmin22.user.config.json"
          ],
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalAdmin22.user.config.json"
          ],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalUser22.user.config.json"
          ],
        testLocalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalUser22.user.config.json"
          ],
      };

      //User should have disappear from cache
      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should delete user from storage - if user is stored in storage, not in cache", async () => {
      delete fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
        "testGlobalAdmin22.user.config.json"
      ];
      let oldFileServiceContent = cloneObject(fileServiceContent);

      await exec();

      //Delete user MindSphere API should have been called
      expect(deleteUser).toHaveBeenCalledTimes(1);
      expect(deleteUser.mock.calls[0]).toEqual([
        "testTenant2",
        "testLocalAdmin22",
      ]);

      //Delete file should have been called
      expect(deleteFile).toHaveBeenCalledTimes(1);
      expect(deleteFile.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testLocalAdmin22.user.config.json",
      ]);

      let expectedCache = {
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalAdmin22.user.config.json"
          ],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalUser22.user.config.json"
          ],
        testLocalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalUser22.user.config.json"
          ],
      };

      //User should not appear in cache
      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should throw and not delete user from storage or from MindSphere - if deleting user throws", async () => {
      deleteUserThrows = true;

      let oldFileServiceContent = cloneObject(fileServiceContent);

      await expect(exec()).rejects.toMatchObject({
        message: "Test delete user error",
      });

      //Delete file should not have been called
      expect(deleteFile).not.toHaveBeenCalled();

      let expectedCache = {
        testGlobalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalAdmin22.user.config.json"
          ],
        testGlobalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testGlobalUser22.user.config.json"
          ],
        testLocalAdmin22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalAdmin22.user.config.json"
          ],
        testLocalUser22:
          oldFileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
            "testLocalUser22.user.config.json"
          ],
      };

      //User should not have changed
      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });

    it("should throw and not delete user from storage or from MindSphere - if app is not initialized", async () => {
      initApp = false;

      await expect(exec()).rejects.toMatchObject({
        message: "Application not initialized!",
      });

      //Delete user should not have been called
      expect(deleteUser).not.toHaveBeenCalled();

      //Delete file should not have been called
      expect(deleteFile).not.toHaveBeenCalled();

      let expectedCache = {};

      //User should not have changed
      expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
        expectedCache
      );
    });
  });

  describe("updateUser", () => {
    let mindSphereApp: MindSphereApp;
    let storageTenant: string;
    let appId: string;
    let assetId: string;
    let appTenant: string;
    let subtenantId: string | null;
    let initApp: boolean;
    let userPayload: UserStorageData;
    let addUserToGroupThrows: boolean;
    let removeUserFromGroupThrows: boolean;
    let setFileContentThrows: boolean;
    let userId: string;

    beforeEach(async () => {
      storageTenant = "hostTenant";
      appId = "ten-testTenant2-sub-subtenant2";
      assetId = "ten-testTenant2-sub-subtenant2";
      appTenant = "testTenant2";
      subtenantId = "subtenant2";
      initApp = true;
      userPayload = {
        config: {
          fakePlant1: { fakeUserConfig: "newUserPlant1Config" },
          fakePlant2: { fakeUserConfig: "newUserPlant2Config" },
        },
        data: {
          fakePlant1: { fakeUserData: "newUserPlant1Data" },
          fakePlant2: { fakeUserData: "newUserPlant2Data" },
        },
        permissions: {
          role: UserRole.LocalUser,
          plants: {
            fakePlant1: PlantPermissions.User,
            fakePlant2: PlantPermissions.Admin,
          },
        },
        userName: "newUserUserName",
      };
      addUserToGroupThrows = false;
      removeUserFromGroupThrows = false;
      setFileContentThrows = false;
      userId = "testLocalAdmin22";
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

      if (addUserToGroupThrows)
        MindSphereUserGroupService.getInstance().addUserToGroup = jest.fn(
          async () => {
            throw new Error("add user to group test error");
          }
        );

      if (removeUserFromGroupThrows)
        MindSphereUserGroupService.getInstance().removeUserFromGroup = jest.fn(
          async () => {
            throw new Error("remove user from group test error");
          }
        );

      if (setFileContentThrows)
        MindSphereFileService.getInstance().setFileContent = jest.fn(
          async () => {
            throw new Error("set file content test error");
          }
        );

      return mindSphereApp.updateUser(userId, userPayload);
    };

    it("should update user in storage and in MindSphere user service and return his updated payload", async () => {
      let result = await exec();

      //Only user groups should be changed in MindSphere
      let expectedMsData = {
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
        groups: [
          {
            display: "localUserGroupDisplayName",
            type: "DIRECT",
            value: "localUserGroup",
          },
          {
            display: "subtenantUserGroupDisplayName",
            type: "DIRECT",
            value: "subtenantUserGroup",
          },
        ],
        externalId: "testLocalAdmin22ExternalId",
        id: "testLocalAdmin22",
        subtenants: [
          {
            id: "subtenant2",
          },
        ],
      };
      expect(result.msData).toEqual(expectedMsData);

      //Whole user payload should be set
      let expectedStorageData = userPayload;
      expect(result.storageData).toEqual(expectedStorageData);

      //Set file should have been called
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testLocalAdmin22.user.config.json",
        userPayload,
      ]);

      //Update user should not have been called - only switching user groups
      expect(updateUser).not.toHaveBeenCalled();

      //Remove user from group should be called
      expect(removeUserFromGroup).toHaveBeenCalledTimes(1);
      expect(removeUserFromGroup.mock.calls[0]).toEqual([
        "testTenant2",
        "localAdminGroup",
        "testLocalAdmin22",
      ]);

      //Add user to group should be called
      expect(addUserToGroup).toHaveBeenCalledTimes(1);
      expect(addUserToGroup.mock.calls[0]).toEqual([
        "testTenant2",
        "localUserGroup",
        "testLocalAdmin22",
      ]);

      //Checking storage
      expect(
        (mindSphereApp as any)._userStorage._cacheData["testLocalAdmin22"]
      ).toEqual(userPayload);
    });

    it("should update user groups - if user does not have subtenantUser role - app is subtenant", async () => {
      userGroupServiceContent.testTenant2.subtenantUserGroup.members = userGroupServiceContent.testTenant2.subtenantUserGroup.members.filter(
        (member) => member.value !== userId
      );

      let result = await exec();

      //Only user groups should be changed in MindSphere
      let expectedMsData = {
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
        groups: [
          {
            display: "localUserGroupDisplayName",
            type: "DIRECT",
            value: "localUserGroup",
          },
          {
            display: "subtenantUserGroupDisplayName",
            type: "DIRECT",
            value: "subtenantUserGroup",
          },
        ],
        externalId: "testLocalAdmin22ExternalId",
        id: "testLocalAdmin22",
        subtenants: [
          {
            id: "subtenant2",
          },
        ],
      };
      expect(result.msData).toEqual(expectedMsData);

      //Whole user payload should be set
      let expectedStorageData = userPayload;
      expect(result.storageData).toEqual(expectedStorageData);

      //Set file should have been called
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testLocalAdmin22.user.config.json",
        userPayload,
      ]);

      //Update user should not have been called - only switching user groups
      expect(updateUser).not.toHaveBeenCalled();

      //Remove user from group should be called
      expect(removeUserFromGroup).toHaveBeenCalledTimes(1);
      expect(removeUserFromGroup.mock.calls[0]).toEqual([
        "testTenant2",
        "localAdminGroup",
        "testLocalAdmin22",
      ]);

      //Add user to group should be called
      expect(addUserToGroup).toHaveBeenCalledTimes(2);
      expect(addUserToGroup.mock.calls).toContainEqual([
        "testTenant2",
        "localUserGroup",
        "testLocalAdmin22",
      ]);
      expect(addUserToGroup.mock.calls).toContainEqual([
        "testTenant2",
        "subtenantUserGroup",
        "testLocalAdmin22",
      ]);

      //Checking storage
      expect(
        (mindSphereApp as any)._userStorage._cacheData["testLocalAdmin22"]
      ).toEqual(userPayload);
    });

    it("should update user groups - if user does not have tenantUser role - app is tenant", async () => {
      appId = "ten-testTenant2";
      assetId = "ten-testTenant2";
      appTenant = "testTenant2";
      subtenantId = null;
      userId = "testLocalAdmin21";

      userGroupServiceContent.testTenant2.standardUserGroup.members = userGroupServiceContent.testTenant2.standardUserGroup.members.filter(
        (member) => member.value !== userId
      );

      let result = await exec();

      //Only user groups should be changed in MindSphere
      let expectedMsData = {
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
        groups: [
          {
            display: "localUserGroupDisplayName",
            type: "DIRECT",
            value: "localUserGroup",
          },
          {
            display: "standardUserGroupDisplayName",
            type: "DIRECT",
            value: "standardUserGroup",
          },
        ],
        externalId: "testLocalAdmin21ExternalId",
        id: "testLocalAdmin21",
      };
      expect(result.msData).toEqual(expectedMsData);

      //Whole user payload should be set
      let expectedStorageData = userPayload;
      expect(result.storageData).toEqual(expectedStorageData);

      //Set file should have been called
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2",
        "testLocalAdmin21.user.config.json",
        userPayload,
      ]);

      //Update user should not have been called - only switching user groups
      expect(updateUser).not.toHaveBeenCalled();

      //Remove user from group should be called
      expect(removeUserFromGroup).toHaveBeenCalledTimes(1);
      expect(removeUserFromGroup.mock.calls[0]).toEqual([
        "testTenant2",
        "localAdminGroup",
        "testLocalAdmin21",
      ]);

      //Add user to group should be called
      expect(addUserToGroup).toHaveBeenCalledTimes(2);
      expect(addUserToGroup.mock.calls).toContainEqual([
        "testTenant2",
        "localUserGroup",
        "testLocalAdmin21",
      ]);
      expect(addUserToGroup.mock.calls).toContainEqual([
        "testTenant2",
        "standardUserGroup",
        "testLocalAdmin21",
      ]);

      //Checking storage
      expect(
        (mindSphereApp as any)._userStorage._cacheData["testLocalAdmin21"]
      ).toEqual(userPayload);
    });

    it("should update user groups - not remove unneccessary groups if groups are different then permissions or standard user groups", async () => {
      //Adding 3 fake groups to user testLocalAdmin22
      userGroupServiceContent.testTenant2["fakeGroup1"] = {
        description: "fakeGroupDescription1",
        displayName: "fakeGroupDisplayName1",
        members: [
          {
            type: "DIRECT",
            value: "testLocalAdmin22",
          },
        ],
        id: "fakeGroup1",
      };
      userGroupServiceContent.testTenant2["fakeGroup2"] = {
        description: "fakeGroupDescription2",
        displayName: "fakeGroupDisplayName2",
        members: [
          {
            type: "DIRECT",
            value: "testLocalAdmin22",
          },
        ],
        id: "fakeGroup2",
      };
      userGroupServiceContent.testTenant2["fakeGroup3"] = {
        description: "fakeGroupDescription3",
        displayName: "fakeGroupDisplayName3",
        members: [
          {
            type: "DIRECT",
            value: "testLocalAdmin22",
          },
        ],
        id: "fakeGroup3",
      };

      let result = await exec();

      //Only user groups should be changed in MindSphere
      let expectedMsData = {
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
        groups: [
          {
            display: "localUserGroupDisplayName",
            type: "DIRECT",
            value: "localUserGroup",
          },
          {
            display: "subtenantUserGroupDisplayName",
            type: "DIRECT",
            value: "subtenantUserGroup",
          },
          {
            display: "fakeGroupDisplayName1",
            type: "DIRECT",
            value: "fakeGroup1",
          },
          {
            display: "fakeGroupDisplayName2",
            type: "DIRECT",
            value: "fakeGroup2",
          },
          {
            display: "fakeGroupDisplayName3",
            type: "DIRECT",
            value: "fakeGroup3",
          },
        ],
        externalId: "testLocalAdmin22ExternalId",
        id: "testLocalAdmin22",
        subtenants: [
          {
            id: "subtenant2",
          },
        ],
      };
      expect(result.msData).toEqual(expectedMsData);

      //Whole user payload should be set
      let expectedStorageData = userPayload;
      expect(result.storageData).toEqual(expectedStorageData);

      //Set file should have been called
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testLocalAdmin22.user.config.json",
        userPayload,
      ]);

      //Update user should not have been called - only switching user groups
      expect(updateUser).not.toHaveBeenCalled();

      //Remove user from group should be called
      expect(removeUserFromGroup).toHaveBeenCalledTimes(1);
      expect(removeUserFromGroup.mock.calls[0]).toEqual([
        "testTenant2",
        "localAdminGroup",
        "testLocalAdmin22",
      ]);

      //Add user to group should be called
      expect(addUserToGroup).toHaveBeenCalledTimes(1);
      expect(addUserToGroup.mock.calls[0]).toEqual([
        "testTenant2",
        "localUserGroup",
        "testLocalAdmin22",
      ]);

      //Checking storage
      expect(
        (mindSphereApp as any)._userStorage._cacheData["testLocalAdmin22"]
      ).toEqual(userPayload);
    });

    it("should update user groups - not remove unneccessary groups if additional tenant user group is added, app is subtenant", async () => {
      //Adding 3 fake groups to user testLocalAdmin22
      userGroupServiceContent.testTenant2["standardUserGroup"].members.push({
        type: "DIRECT",
        value: "testLocalAdmin22",
      });

      let result = await exec();

      //Only user groups should be changed in MindSphere
      let expectedMsData = {
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
        groups: [
          {
            display: "localUserGroupDisplayName",
            type: "DIRECT",
            value: "localUserGroup",
          },
          {
            display: "standardUserGroupDisplayName",
            type: "DIRECT",
            value: "standardUserGroup",
          },
          {
            display: "subtenantUserGroupDisplayName",
            type: "DIRECT",
            value: "subtenantUserGroup",
          },
        ],
        externalId: "testLocalAdmin22ExternalId",
        id: "testLocalAdmin22",
        subtenants: [
          {
            id: "subtenant2",
          },
        ],
      };
      expect(result.msData).toEqual(expectedMsData);

      //Whole user payload should be set
      let expectedStorageData = userPayload;
      expect(result.storageData).toEqual(expectedStorageData);

      //Set file should have been called
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testLocalAdmin22.user.config.json",
        userPayload,
      ]);

      //Update user should not have been called - only switching user groups
      expect(updateUser).not.toHaveBeenCalled();

      //Remove user from group should be called
      expect(removeUserFromGroup).toHaveBeenCalledTimes(1);
      expect(removeUserFromGroup.mock.calls[0]).toEqual([
        "testTenant2",
        "localAdminGroup",
        "testLocalAdmin22",
      ]);

      //Add user to group should be called
      expect(addUserToGroup).toHaveBeenCalledTimes(1);
      expect(addUserToGroup.mock.calls[0]).toEqual([
        "testTenant2",
        "localUserGroup",
        "testLocalAdmin22",
      ]);

      //Checking storage
      expect(
        (mindSphereApp as any)._userStorage._cacheData["testLocalAdmin22"]
      ).toEqual(userPayload);
    });

    it("should update user groups - not remove unneccessary groups if additional subtenant user group is added, app is tenant", async () => {
      appId = "ten-testTenant2";
      assetId = "ten-testTenant2";
      appTenant = "testTenant2";
      subtenantId = null;
      userId = "testLocalAdmin21";

      //Adding 3 fake groups to user testLocalAdmin22
      userGroupServiceContent.testTenant2["subtenantUserGroup"].members.push({
        type: "DIRECT",
        value: "testLocalAdmin21",
      });

      let result = await exec();

      //Only user groups should be changed in MindSphere
      let expectedMsData = {
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
        groups: [
          {
            display: "localUserGroupDisplayName",
            type: "DIRECT",
            value: "localUserGroup",
          },
          {
            display: "standardUserGroupDisplayName",
            type: "DIRECT",
            value: "standardUserGroup",
          },
          {
            display: "subtenantUserGroupDisplayName",
            type: "DIRECT",
            value: "subtenantUserGroup",
          },
        ],
        externalId: "testLocalAdmin21ExternalId",
        id: "testLocalAdmin21",
      };
      expect(result.msData).toEqual(expectedMsData);

      //Whole user payload should be set
      let expectedStorageData = userPayload;
      expect(result.storageData).toEqual(expectedStorageData);

      //Set file should have been called
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2",
        "testLocalAdmin21.user.config.json",
        userPayload,
      ]);

      //Update user should not have been called - only switching user groups
      expect(updateUser).not.toHaveBeenCalled();

      //Remove user from group should be called
      expect(removeUserFromGroup).toHaveBeenCalledTimes(1);
      expect(removeUserFromGroup.mock.calls[0]).toEqual([
        "testTenant2",
        "localAdminGroup",
        "testLocalAdmin21",
      ]);

      //Add user to group should be called
      expect(addUserToGroup).toHaveBeenCalledTimes(1);
      expect(addUserToGroup.mock.calls[0]).toEqual([
        "testTenant2",
        "localUserGroup",
        "testLocalAdmin21",
      ]);

      //Checking storage
      expect(
        (mindSphereApp as any)._userStorage._cacheData["testLocalAdmin21"]
      ).toEqual(userPayload);
    });

    it("should update user groups - remove globalAdmin role - if new role is different", async () => {
      userId = "testGlobalAdmin22";

      let result = await exec();

      //Only user groups should be changed in MindSphere
      let expectedMsData = {
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
        groups: [
          {
            display: "localUserGroupDisplayName",
            type: "DIRECT",
            value: "localUserGroup",
          },
          {
            display: "subtenantUserGroupDisplayName",
            type: "DIRECT",
            value: "subtenantUserGroup",
          },
        ],
        externalId: "testGlobalAdmin22ExternalId",
        id: "testGlobalAdmin22",
        subtenants: [
          {
            id: "subtenant2",
          },
        ],
      };
      expect(result.msData).toEqual(expectedMsData);

      //Whole user payload should be set
      let expectedStorageData = userPayload;
      expect(result.storageData).toEqual(expectedStorageData);

      //Set file should have been called
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testGlobalAdmin22.user.config.json",
        userPayload,
      ]);

      //Update user should not have been called - only switching user groups
      expect(updateUser).not.toHaveBeenCalled();

      //Remove user from group should be called
      expect(removeUserFromGroup).toHaveBeenCalledTimes(1);
      expect(removeUserFromGroup.mock.calls[0]).toEqual([
        "testTenant2",
        "globalAdminGroup",
        "testGlobalAdmin22",
      ]);

      //Add user to group should be called
      expect(addUserToGroup).toHaveBeenCalledTimes(1);
      expect(addUserToGroup.mock.calls[0]).toEqual([
        "testTenant2",
        "localUserGroup",
        "testGlobalAdmin22",
      ]);

      //Checking storage
      expect(
        (mindSphereApp as any)._userStorage._cacheData["testGlobalAdmin22"]
      ).toEqual(userPayload);
    });

    it("should update user groups - remove localAdmin role - if new role is different", async () => {
      userId = "testLocalAdmin22";

      let result = await exec();

      //Only user groups should be changed in MindSphere
      let expectedMsData = {
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
        groups: [
          {
            display: "localUserGroupDisplayName",
            type: "DIRECT",
            value: "localUserGroup",
          },
          {
            display: "subtenantUserGroupDisplayName",
            type: "DIRECT",
            value: "subtenantUserGroup",
          },
        ],
        externalId: "testLocalAdmin22ExternalId",
        id: "testLocalAdmin22",
        subtenants: [
          {
            id: "subtenant2",
          },
        ],
      };
      expect(result.msData).toEqual(expectedMsData);

      //Whole user payload should be set
      let expectedStorageData = userPayload;
      expect(result.storageData).toEqual(expectedStorageData);

      //Set file should have been called
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testLocalAdmin22.user.config.json",
        userPayload,
      ]);

      //Update user should not have been called - only switching user groups
      expect(updateUser).not.toHaveBeenCalled();

      //Remove user from group should be called
      expect(removeUserFromGroup).toHaveBeenCalledTimes(1);
      expect(removeUserFromGroup.mock.calls[0]).toEqual([
        "testTenant2",
        "localAdminGroup",
        "testLocalAdmin22",
      ]);

      //Add user to group should be called
      expect(addUserToGroup).toHaveBeenCalledTimes(1);
      expect(addUserToGroup.mock.calls[0]).toEqual([
        "testTenant2",
        "localUserGroup",
        "testLocalAdmin22",
      ]);

      //Checking storage
      expect(
        (mindSphereApp as any)._userStorage._cacheData["testLocalAdmin22"]
      ).toEqual(userPayload);
    });

    it("should update user groups - remove globalUser role - if new role is different", async () => {
      userId = "testGlobalUser22";

      let result = await exec();

      //Only user groups should be changed in MindSphere
      let expectedMsData = {
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
        groups: [
          {
            display: "localUserGroupDisplayName",
            type: "DIRECT",
            value: "localUserGroup",
          },
          {
            display: "subtenantUserGroupDisplayName",
            type: "DIRECT",
            value: "subtenantUserGroup",
          },
        ],
        externalId: "testGlobalUser22ExternalId",
        id: "testGlobalUser22",
        subtenants: [
          {
            id: "subtenant2",
          },
        ],
      };
      expect(result.msData).toEqual(expectedMsData);

      //Whole user payload should be set
      let expectedStorageData = userPayload;
      expect(result.storageData).toEqual(expectedStorageData);

      //Set file should have been called
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testGlobalUser22.user.config.json",
        userPayload,
      ]);

      //Update user should not have been called - only switching user groups
      expect(updateUser).not.toHaveBeenCalled();

      //Remove user from group should be called
      expect(removeUserFromGroup).toHaveBeenCalledTimes(1);
      expect(removeUserFromGroup.mock.calls[0]).toEqual([
        "testTenant2",
        "globalUserGroup",
        "testGlobalUser22",
      ]);

      //Add user to group should be called
      expect(addUserToGroup).toHaveBeenCalledTimes(1);
      expect(addUserToGroup.mock.calls[0]).toEqual([
        "testTenant2",
        "localUserGroup",
        "testGlobalUser22",
      ]);

      //Checking storage
      expect(
        (mindSphereApp as any)._userStorage._cacheData["testGlobalUser22"]
      ).toEqual(userPayload);
    });

    it("should update user groups - remove localUser role - if new role is different", async () => {
      userId = "testLocalUser22";
      userPayload.permissions.role = UserRole.LocalAdmin;

      let result = await exec();

      //Only user groups should be changed in MindSphere
      let expectedMsData = {
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
        groups: [
          {
            display: "localAdminGroupDisplayName",
            type: "DIRECT",
            value: "localAdminGroup",
          },
          {
            display: "subtenantUserGroupDisplayName",
            type: "DIRECT",
            value: "subtenantUserGroup",
          },
        ],
        externalId: "testLocalUser22ExternalId",
        id: "testLocalUser22",
        subtenants: [
          {
            id: "subtenant2",
          },
        ],
      };
      expect(result.msData).toEqual(expectedMsData);

      //Whole user payload should be set
      let expectedStorageData = userPayload;
      expect(result.storageData).toEqual(expectedStorageData);

      //Set file should have been called
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testLocalUser22.user.config.json",
        userPayload,
      ]);

      //Update user should not have been called - only switching user groups
      expect(updateUser).not.toHaveBeenCalled();

      //Remove user from group should be called
      expect(removeUserFromGroup).toHaveBeenCalledTimes(1);
      expect(removeUserFromGroup.mock.calls[0]).toEqual([
        "testTenant2",
        "localUserGroup",
        "testLocalUser22",
      ]);

      //Add user to group should be called
      expect(addUserToGroup).toHaveBeenCalledTimes(1);
      expect(addUserToGroup.mock.calls[0]).toEqual([
        "testTenant2",
        "localAdminGroup",
        "testLocalUser22",
      ]);

      //Checking storage
      expect(
        (mindSphereApp as any)._userStorage._cacheData["testLocalUser22"]
      ).toEqual(userPayload);
    });

    it("should update user groups - set globalUser role - if old role was different", async () => {
      userId = "testGlobalAdmin22";
      userPayload.permissions.role = UserRole.GlobalUser;

      let result = await exec();

      //Only user groups should be changed in MindSphere
      let expectedMsData = {
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
        groups: [
          {
            display: "globalUserGroupDisplayName",
            type: "DIRECT",
            value: "globalUserGroup",
          },
          {
            display: "subtenantUserGroupDisplayName",
            type: "DIRECT",
            value: "subtenantUserGroup",
          },
        ],
        externalId: "testGlobalAdmin22ExternalId",
        id: "testGlobalAdmin22",
        subtenants: [
          {
            id: "subtenant2",
          },
        ],
      };
      expect(result.msData).toEqual(expectedMsData);

      //Whole user payload should be set
      let expectedStorageData = userPayload;
      expect(result.storageData).toEqual(expectedStorageData);

      //Set file should have been called
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testGlobalAdmin22.user.config.json",
        userPayload,
      ]);

      //Update user should not have been called - only switching user groups
      expect(updateUser).not.toHaveBeenCalled();

      //Remove user from group should be called
      expect(removeUserFromGroup).toHaveBeenCalledTimes(1);
      expect(removeUserFromGroup.mock.calls[0]).toEqual([
        "testTenant2",
        "globalAdminGroup",
        "testGlobalAdmin22",
      ]);

      //Add user to group should be called
      expect(addUserToGroup).toHaveBeenCalledTimes(1);
      expect(addUserToGroup.mock.calls[0]).toEqual([
        "testTenant2",
        "globalUserGroup",
        "testGlobalAdmin22",
      ]);

      //Checking storage
      expect(
        (mindSphereApp as any)._userStorage._cacheData["testGlobalAdmin22"]
      ).toEqual(userPayload);
    });

    it("should update user groups - set globalAdmin role - if old role was different", async () => {
      userId = "testLocalAdmin22";
      userPayload.permissions.role = UserRole.GlobalAdmin;

      let result = await exec();

      //Only user groups should be changed in MindSphere
      let expectedMsData = {
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
        groups: [
          {
            display: "globalAdminGroupDisplayName",
            type: "DIRECT",
            value: "globalAdminGroup",
          },
          {
            display: "subtenantUserGroupDisplayName",
            type: "DIRECT",
            value: "subtenantUserGroup",
          },
        ],
        externalId: "testLocalAdmin22ExternalId",
        id: "testLocalAdmin22",
        subtenants: [
          {
            id: "subtenant2",
          },
        ],
      };
      expect(result.msData).toEqual(expectedMsData);

      //Whole user payload should be set
      let expectedStorageData = userPayload;
      expect(result.storageData).toEqual(expectedStorageData);

      //Set file should have been called
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testLocalAdmin22.user.config.json",
        userPayload,
      ]);

      //Update user should not have been called - only switching user groups
      expect(updateUser).not.toHaveBeenCalled();

      //Remove user from group should be called
      expect(removeUserFromGroup).toHaveBeenCalledTimes(1);
      expect(removeUserFromGroup.mock.calls[0]).toEqual([
        "testTenant2",
        "localAdminGroup",
        "testLocalAdmin22",
      ]);

      //Add user to group should be called
      expect(addUserToGroup).toHaveBeenCalledTimes(1);
      expect(addUserToGroup.mock.calls[0]).toEqual([
        "testTenant2",
        "globalAdminGroup",
        "testLocalAdmin22",
      ]);

      //Checking storage
      expect(
        (mindSphereApp as any)._userStorage._cacheData["testLocalAdmin22"]
      ).toEqual(userPayload);
    });

    it("should update user groups - set localUser role - if old role is different", async () => {
      userId = "testGlobalUser22";
      userPayload.permissions.role = UserRole.LocalUser;

      let result = await exec();

      //Only user groups should be changed in MindSphere
      let expectedMsData = {
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
        groups: [
          {
            display: "localUserGroupDisplayName",
            type: "DIRECT",
            value: "localUserGroup",
          },
          {
            display: "subtenantUserGroupDisplayName",
            type: "DIRECT",
            value: "subtenantUserGroup",
          },
        ],
        externalId: "testGlobalUser22ExternalId",
        id: "testGlobalUser22",
        subtenants: [
          {
            id: "subtenant2",
          },
        ],
      };
      expect(result.msData).toEqual(expectedMsData);

      //Whole user payload should be set
      let expectedStorageData = userPayload;
      expect(result.storageData).toEqual(expectedStorageData);

      //Set file should have been called
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testGlobalUser22.user.config.json",
        userPayload,
      ]);

      //Update user should not have been called - only switching user groups
      expect(updateUser).not.toHaveBeenCalled();

      //Remove user from group should be called
      expect(removeUserFromGroup).toHaveBeenCalledTimes(1);
      expect(removeUserFromGroup.mock.calls[0]).toEqual([
        "testTenant2",
        "globalUserGroup",
        "testGlobalUser22",
      ]);

      //Add user to group should be called
      expect(addUserToGroup).toHaveBeenCalledTimes(1);
      expect(addUserToGroup.mock.calls[0]).toEqual([
        "testTenant2",
        "localUserGroup",
        "testGlobalUser22",
      ]);

      //Checking storage
      expect(
        (mindSphereApp as any)._userStorage._cacheData["testGlobalUser22"]
      ).toEqual(userPayload);
    });

    it("should update user groups - set localAdmin role - if old role is different", async () => {
      userId = "testLocalUser22";
      userPayload.permissions.role = UserRole.LocalAdmin;

      let result = await exec();

      //Only user groups should be changed in MindSphere
      let expectedMsData = {
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
        groups: [
          {
            display: "localAdminGroupDisplayName",
            type: "DIRECT",
            value: "localAdminGroup",
          },
          {
            display: "subtenantUserGroupDisplayName",
            type: "DIRECT",
            value: "subtenantUserGroup",
          },
        ],
        externalId: "testLocalUser22ExternalId",
        id: "testLocalUser22",
        subtenants: [
          {
            id: "subtenant2",
          },
        ],
      };
      expect(result.msData).toEqual(expectedMsData);

      //Whole user payload should be set
      let expectedStorageData = userPayload;
      expect(result.storageData).toEqual(expectedStorageData);

      //Set file should have been called
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testLocalUser22.user.config.json",
        userPayload,
      ]);

      //Update user should not have been called - only switching user groups
      expect(updateUser).not.toHaveBeenCalled();

      //Remove user from group should be called
      expect(removeUserFromGroup).toHaveBeenCalledTimes(1);
      expect(removeUserFromGroup.mock.calls[0]).toEqual([
        "testTenant2",
        "localUserGroup",
        "testLocalUser22",
      ]);

      //Add user to group should be called
      expect(addUserToGroup).toHaveBeenCalledTimes(1);
      expect(addUserToGroup.mock.calls[0]).toEqual([
        "testTenant2",
        "localAdminGroup",
        "testLocalUser22",
      ]);

      //Checking storage
      expect(
        (mindSphereApp as any)._userStorage._cacheData["testLocalUser22"]
      ).toEqual(userPayload);
    });

    it("should not update user groups - if user groups are already valid", async () => {
      userId = "testLocalAdmin22";
      userPayload.permissions.role = UserRole.LocalAdmin;

      let result = await exec();

      //Only user groups should be changed in MindSphere
      let expectedMsData = {
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
        groups: [
          {
            display: "localAdminGroupDisplayName",
            type: "DIRECT",
            value: "localAdminGroup",
          },
          {
            display: "subtenantUserGroupDisplayName",
            type: "DIRECT",
            value: "subtenantUserGroup",
          },
        ],
        externalId: "testLocalAdmin22ExternalId",
        id: "testLocalAdmin22",
        subtenants: [
          {
            id: "subtenant2",
          },
        ],
      };
      expect(result.msData).toEqual(expectedMsData);

      //Whole user payload should be set
      let expectedStorageData = userPayload;
      expect(result.storageData).toEqual(expectedStorageData);

      //Set file should have been called
      expect(setFileContent).toHaveBeenCalledTimes(1);
      expect(setFileContent.mock.calls[0]).toEqual([
        "hostTenant",
        "ten-testTenant2-sub-subtenant2",
        "testLocalAdmin22.user.config.json",
        userPayload,
      ]);

      //Update user should not have been called - only switching user groups
      expect(updateUser).not.toHaveBeenCalled();

      //Remove user from group should be called
      expect(removeUserFromGroup).not.toHaveBeenCalled();

      //Add user to group should be called
      expect(addUserToGroup).not.toHaveBeenCalled();
      expect(removeUserFromGroup).not.toHaveBeenCalled();

      //Checking storage
      expect(
        (mindSphereApp as any)._userStorage._cacheData["testLocalAdmin22"]
      ).toEqual(userPayload);
    });

    it("should throw and not update user in storage - if add user to group throws", async () => {
      addUserToGroupThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "add user to group test error",
      });

      //Set file should not have been called
      expect(setFileContent).not.toHaveBeenCalled();

      //Update user should not have been called - only switching user groups
      expect(updateUser).not.toHaveBeenCalled();

      //Remove user from group should not have been called
      expect(removeUserFromGroup).not.toHaveBeenCalled();

      //Checking storage
      expect(
        (mindSphereApp as any)._userStorage._cacheData["testLocalAdmin22"]
      ).toEqual(
        fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
          "testLocalAdmin22.user.config.json"
        ]
      );
    });

    it("should throw and not update user in storage - if remove user from group throws", async () => {
      removeUserFromGroupThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "remove user from group test error",
      });

      //Set file should not have been called
      expect(setFileContent).not.toHaveBeenCalled();

      //Update user should not have been called - only switching user groups
      expect(updateUser).not.toHaveBeenCalled();

      //Checking storage
      expect(
        (mindSphereApp as any)._userStorage._cacheData["testLocalAdmin22"]
      ).toEqual(
        fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
          "testLocalAdmin22.user.config.json"
        ]
      );
    });

    it("should throw - if set file content throws", async () => {
      setFileContentThrows = true;

      await expect(exec()).rejects.toMatchObject({
        message: "set file content test error",
      });

      //Checking storage - it should not have changed
      expect(
        (mindSphereApp as any)._userStorage._cacheData["testLocalAdmin22"]
      ).toEqual(
        fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
          "testLocalAdmin22.user.config.json"
        ]
      );
    });

    it("should throw, and call any MindSphere API - if user is not assigned to the app - user of tenant, app of subtenant", async () => {
      userId = "testLocalAdmin21";

      await expect(exec()).rejects.toMatchObject({
        message: "Cannot edit user that is not assigned to the app!",
      });

      //Remove user from group should not have been called
      expect(removeUserFromGroup).not.toHaveBeenCalled();

      //Add user to group should not have been called
      expect(addUserToGroup).not.toHaveBeenCalled();

      //Set file should not have been called
      expect(setFileContent).not.toHaveBeenCalled();

      //Update user should not have been called - only switching user groups
      expect(updateUser).not.toHaveBeenCalled();
    });

    it("should throw, and call any MindSphere API - if user is not assigned to the app - user of subtenant, app of tenant", async () => {
      appId = "ten-testTenant2";
      assetId = "ten-testTenant2";
      appTenant = "testTenant2";
      subtenantId = null;
      userId = "testLocalAdmin22";

      await expect(exec()).rejects.toMatchObject({
        message: "Cannot edit user that is not assigned to the app!",
      });

      //Remove user from group should not have been called
      expect(removeUserFromGroup).not.toHaveBeenCalled();

      //Add user to group should not have been called
      expect(addUserToGroup).not.toHaveBeenCalled();

      //Set file should not have been called
      expect(setFileContent).not.toHaveBeenCalled();

      //Update user should not have been called - only switching user groups
      expect(updateUser).not.toHaveBeenCalled();
    });

    it("should throw, and call any MindSphere API - if app is not initialized", async () => {
      initApp = false;

      await expect(exec()).rejects.toMatchObject({
        message: "Application not initialized!",
      });

      //Remove user from group should not have been called
      expect(removeUserFromGroup).not.toHaveBeenCalled();

      //Add user to group should not have been called
      expect(addUserToGroup).not.toHaveBeenCalled();

      //Set file should not have been called
      expect(setFileContent).not.toHaveBeenCalled();

      //Update user should not have been called - only switching user groups
      expect(updateUser).not.toHaveBeenCalled();

      //Checking storage - it should not have changed
      expect((mindSphereApp as any)._userStorage._cacheData).toEqual({});
    });
  });

  describe("getMaxNumberOfUsers", () => {
    let mindSphereApp: MindSphereApp;
    let storageTenant: string;
    let appId: string;
    let assetId: string;
    let appTenant: string;
    let subtenantId: string | null;
    let initApp: boolean;

    beforeEach(async () => {
      storageTenant = "hostTenant";
      appId = "ten-testTenant2-sub-subtenant2";
      assetId = "ten-testTenant2-sub-subtenant2";
      appTenant = "testTenant2";
      subtenantId = "subtenant2";
      initApp = true;
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

      return mindSphereApp.getMaxNumberOfUsers();
    };

    it("should return maximum number of users stored in app data storage", async () => {
      let result = await exec();

      expect(result).toEqual(5);
    });

    it("should return null if max number of users is null (no limit)", async () => {
      fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
        "main.app.config.json"
      ].maxNumberOfUsers = null;

      let result = await exec();

      expect(result).toEqual(null);
    });

    it("should throw if max number of users is not defined", async () => {
      fileServiceContent["hostTenant"]["ten-testTenant2-sub-subtenant2"][
        "main.app.config.json"
      ].maxNumberOfUsers = undefined;

      await expect(exec()).rejects.toMatchObject({
        message: "No application data found or max number of users not found!",
      });
    });

    it("should throw if app is not initialized", async () => {
      initApp = false;

      await expect(exec()).rejects.toMatchObject({
        message: "Application not initialized!",
      });
    });
  });

  //#endregion ===== USER MANAGEMENT =====
});

import request from "supertest";
import CustomService from "../../../../classes/CustomService/CustomService";
import { MindSphereFileService } from "../../../../classes/MindSphereService/MindSphereFileService";
import {
  getFileContent,
  MockedFileServiceContent,
  mockMsFileService,
  setFileContent,
  setFileServiceContent,
} from "../../../utilities/mockMsFileService";
import logger from "../../../../logger/logger";
import { MindSphereDataStorage } from "../../../../classes/DataStorage/MindSphereDataStorage";
import {
  invokePrivateMethod,
  setPrivateProperty,
  testPrivateProperty,
} from "../../../utilities/utilities";
import {
  cloneObject,
  readDirAsync,
  readFileAsync,
} from "../../../../utilities/utilities";
import { MindSphereTimeSeriesService } from "../../../../classes/MindSphereService/MindSphereTimeSeriesService";
import {
  MockedTimeSeriesServiceContent,
  mockMsTimeSeriesService,
} from "../../../utilities/mockTimeSeriesService";
import LoadmonitoringService, {
  EnergyPoint,
  LoadmonitoringConfig,
} from "../../../../classes/CustomService/LoadmonitoringService";
import CustomServiceManager, {
  CustomServiceType,
} from "../../../../classes/CustomService/CustomServiceManager";
import webpush from "web-push";
import nodemailer from "nodemailer";
import MailSender from "../../../../classes/MailSender/MailSender";
import NotificationManager from "../../../../classes/NotificationManager/NotificationManager";
import {
  MockedUserGroupServiceContent,
  MockedUserServiceContent,
  mockMsUserGroupService,
  mockMsUserService,
} from "../../../utilities/mockMsUserService";
import {
  PlantPermissions,
  UserRole,
} from "../../../../classes/MindSphereApp/MindSphereApp";
import {
  MockedAssetServiceContent,
  mockMsAssetService,
} from "../../../utilities/mockMsAssetService";
import { MindSphereUserService } from "../../../../classes/MindSphereService/MindSphereUserService";
import { MindSphereUserGroupService } from "../../../../classes/MindSphereService/MindSphereUserGroupService";
import { MindSphereAssetService } from "../../../../classes/MindSphereService/MindSphereAssetService";
import { MindSphereAppsManager } from "../../../../classes/MindSphereApp/MindSphereAppsManager";
import { MindSphereUserJWTData } from "../../../../middleware/tokenData/fetchTokenData";
import jwt from "jsonwebtoken";
import appStart from "../../../../startup/app";
import { Server } from "http";
import { MindSphereTokenManager } from "../../../../classes/MindSphereService/MindSphereToken/MindSphereTokenManager";
import {
  clearMindSphereTokenManagerInstanceMock,
  mockMindSphereTokenManager,
} from "../../../utilities/mockMindSphereTokenManager";
import MockDate from "mockdate";

const getAppIdFromUserPaylad = (userPayload: MindSphereUserJWTData) => {
  return userPayload.subtenant != null
    ? `ten-${userPayload.ten}-sub-${userPayload.subtenant}`
    : `ten-${userPayload.ten}`;
};

describe("service route", () => {
  let fileServiceContent: MockedFileServiceContent;
  let timeseriesServiceContent: MockedTimeSeriesServiceContent;
  let userServiceContent: MockedUserServiceContent;
  let userGroupServiceContent: MockedUserGroupServiceContent;
  let assetServiceContent: MockedAssetServiceContent;

  let logErrorMockFunc: jest.Mock;
  let server: Server;
  let tickId: number;

  beforeEach(async () => {
    //Clear MindSphere token manager
    clearMindSphereTokenManagerInstanceMock();

    //Clearing MindSphereServices
    (MindSphereFileService as any)._instance = null;
    (MindSphereTimeSeriesService as any)._instance = null;
    (MindSphereUserService as any)._instance = null;
    (MindSphereUserGroupService as any)._instance = null;
    (MindSphereAssetService as any)._instance = null;

    //Clearing all services
    (CustomServiceManager as any)._instance = null;

    //Clearing sending mails and notification
    (MailSender as any)._instance = null;
    (NotificationManager as any)._instance = null;

    //Clearing app manager
    (MindSphereAppsManager as any)._instance = null;

    //Reseting throwing by webpush and nodemailer
    (webpush as any).__setThrowOnNotification(null);
    (nodemailer as any).__setThrowOnEmail(null);

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
            userName: "test_global_user_11@user.name",
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
            userName: "test_local_admin_11@user.name",
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
            userName: "test_local_user_11@user.name",
            permissions: {
              role: UserRole.LocalUser,
              permissions: {
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
            userName: "test_global_user_32@user.name",
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
            userName: "test_local_admin_32@user.name",
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
            userName: "test_local_user_32@user.name",
            permissions: {
              role: UserRole.LocalUser,
              permissions: {
                testPlant5: PlantPermissions.User,
                testPlant6: PlantPermissions.User,
              },
            },
          },
        },
        testServiceContainerAssetId: {
          "testLoadmonitoringServiceId1.service.config.json": {
            sampleTime: 100,
            serviceType: CustomServiceType.LoadmonitoringService,
            id: "testLoadmonitoringServiceId1",
            appId: "ten-testTenant2-sub-subtenant2",
            plantId: "testPlant5",
            enabled: true,
            tenant: "testTenant2",
            assetIds: [
              {
                assetId: "assetId21",
                aspectId: "aspect211",
                variableName: "variable2111",
                multiplier: 0.001,
              },
              {
                assetId: "assetId22",
                aspectId: "aspect221",
                variableName: "variable2211",
                multiplier: 0.002,
              },
              {
                assetId: "assetId23",
                aspectId: "aspect231",
                variableName: "variable2311",
                multiplier: 0.003,
              },
            ],
            powerLosses: 123,
            alertLimit: 500,
            warningLimit: 600,
            mailingList: [
              {
                email: "testEmail11@test.mail.com",
                language: "en",
              },
              {
                email: "testEmail12@test.mail.com",
                language: "pl",
              },
              {
                email: "testEmail13@test.mail.com",
                language: "en",
              },
            ],
            interval: 600,
          },
          "testLoadmonitoringServiceId2.service.config.json": {
            sampleTime: 100,
            serviceType: CustomServiceType.LoadmonitoringService,
            id: "testLoadmonitoringServiceId2",
            appId: "ten-testTenant2-sub-subtenant2",
            plantId: "testPlant5",
            enabled: true,
            tenant: "testTenant2",
            assetIds: [
              {
                assetId: "assetId21",
                aspectId: "aspect212",
                variableName: "variable2121",
                multiplier: 0.001,
              },
              {
                assetId: "assetId22",
                aspectId: "aspect222",
                variableName: "variable2221",
                multiplier: 0.002,
              },
              {
                assetId: "assetId23",
                aspectId: "aspect232",
                variableName: "variable2321",
                multiplier: 0.003,
              },
            ],
            powerLosses: 123,
            alertLimit: 500,
            warningLimit: 600,
            mailingList: [
              {
                email: "testEmail11@test.mail.com",
                language: "en",
              },
              {
                email: "testEmail12@test.mail.com",
                language: "pl",
              },
              {
                email: "testEmail13@test.mail.com",
                language: "en",
              },
            ],
            interval: 600,
          },
        },
        notificationsAssetId: {
          "testLoadmonitoringServiceId1.sub.json": [
            {
              language: "pl",
              subscriptionData: {
                endpoint: "testEndpoint11",
                keys: {
                  p256dh: "testKey1",
                  auth: "testAuth1",
                },
              },
            },
            {
              language: "en",
              subscriptionData: {
                endpoint: "testEndpoint12",
                keys: {
                  p256dh: "testKey2",
                  auth: "testAuth2",
                },
              },
            },
            {
              language: "pl",
              subscriptionData: {
                endpoint: "testEndpoint13",
                keys: {
                  p256dh: "testKey3",
                  auth: "testAuth3",
                },
              },
            },
          ],
          "testLoadmonitoringServiceId2.sub.json": [
            {
              language: "pl",
              subscriptionData: {
                endpoint: "testEndpoint21",
                keys: {
                  p256dh: "testKey1",
                  auth: "testAuth1",
                },
              },
            },
            {
              language: "en",
              subscriptionData: {
                endpoint: "testEndpoint22",
                keys: {
                  p256dh: "testKey2",
                  auth: "testAuth2",
                },
              },
            },
            {
              language: "pl",
              subscriptionData: {
                endpoint: "testEndpoint23",
                keys: {
                  p256dh: "testKey3",
                  auth: "testAuth3",
                },
              },
            },
          ],
        },
      },
    };

    tickId = 1618474020000; //2021-04-15T07:07:00.000Z
    //1618471800000 -> 2021-04-15T07:30:00.000Z
    //1618471860000 -> 2021-04-15T07:31:00.000Z
    //1618471920000 -> 2021-04-15T07:32:00.000Z
    //1618471980000 -> 2021-04-15T07:33:00.000Z
    //1618472040000 -> 2021-04-15T07:34:00.000Z
    //1618472100000 -> 2021-04-15T07:35:00.000Z
    //1618472160000 -> 2021-04-15T07:36:00.000Z
    //1618472220000 -> 2021-04-15T07:37:00.000Z
    //1618472280000 -> 2021-04-15T07:38:00.000Z
    //1618472340000 -> 2021-04-15T07:39:00.000Z
    //1618472400000 -> 2021-04-15T07:40:00.000Z
    //1618472460000 -> 2021-04-15T07:41:00.000Z
    //1618472520000 -> 2021-04-15T07:42:00.000Z
    //1618472580000 -> 2021-04-15T07:43:00.000Z
    //1618472640000 -> 2021-04-15T07:44:00.000Z
    //1618472700000 -> 2021-04-15T07:45:00.000Z
    //1618472760000 -> 2021-04-15T07:46:00.000Z
    //1618472820000 -> 2021-04-15T07:47:00.000Z
    //1618472880000 -> 2021-04-15T07:48:00.000Z
    //1618472940000 -> 2021-04-15T07:49:00.000Z
    //1618473000000 -> 2021-04-15T07:50:00.000Z
    //1618473060000 -> 2021-04-15T07:51:00.000Z
    //1618473120000 -> 2021-04-15T07:52:00.000Z
    //1618473180000 -> 2021-04-15T07:53:00.000Z
    //1618473240000 -> 2021-04-15T07:54:00.000Z
    //1618473300000 -> 2021-04-15T07:55:00.000Z
    //1618473360000 -> 2021-04-15T07:56:00.000Z
    //1618473420000 -> 2021-04-15T07:57:00.000Z
    //1618473480000 -> 2021-04-15T07:58:00.000Z
    //1618473540000 -> 2021-04-15T07:59:00.000Z
    //1618473600000 -> 2021-04-15T08:00:00.000Z
    //1618473660000 -> 2021-04-15T08:01:00.000Z
    //1618473720000 -> 2021-04-15T08:02:00.000Z
    //1618473780000 -> 2021-04-15T08:03:00.000Z
    //1618473840000 -> 2021-04-15T08:04:00.000Z
    //1618473900000 -> 2021-04-15T08:05:00.000Z
    //1618473960000 -> 2021-04-15T08:06:00.000Z
    //1618474020000 -> 2021-04-15T08:07:00.000Z
    //1618474080000 -> 2021-04-15T08:08:00.000Z
    //1618474140000 -> 2021-04-15T08:09:00.000Z
    //1618474200000 -> 2021-04-15T08:10:00.000Z
    //1618474260000 -> 2021-04-15T08:11:00.000Z
    //1618474320000 -> 2021-04-15T08:12:00.000Z
    //1618474380000 -> 2021-04-15T08:13:00.000Z
    //1618474440000 -> 2021-04-15T08:14:00.000Z
    //1618474500000 -> 2021-04-15T08:15:00.000Z
    timeseriesServiceContent = {
      testTenant1: {
        asset11: {
          aspect111: {
            variable1111: {
              "1618471800000": { value: 1111000 },
              "1618471860000": { value: 1111001 },
              "1618471920000": { value: 1111002 },
              "1618471980000": { value: 1111003 },
              "1618472040000": { value: 1111004 },
              "1618472100000": { value: 1111005 },
              "1618472160000": { value: 1111006 },
              "1618472220000": { value: 1111007 },
              "1618472280000": { value: 1111008 },
              "1618472340000": { value: 1111009 },
              "1618472400000": { value: 1111010 },
              "1618472460000": { value: 1111011 },
              "1618472520000": { value: 1111012 },
              "1618472580000": { value: 1111013 },
              "1618472640000": { value: 1111014 },
              "1618472700000": { value: 1111015 },
              "1618472760000": { value: 1111016 },
              "1618472820000": { value: 1111017 },
              "1618472880000": { value: 1111018 },
              "1618472940000": { value: 1111019 },
              "1618473000000": { value: 1111020 },
              "1618473060000": { value: 1111021 },
              "1618473120000": { value: 1111022 },
              "1618473180000": { value: 1111023 },
              "1618473240000": { value: 1111024 },
              "1618473300000": { value: 1111025 },
              "1618473360000": { value: 1111026 },
              "1618473420000": { value: 1111027 },
              "1618473480000": { value: 1111028 },
              "1618473540000": { value: 1111029 },
              "1618473600000": { value: 1111030 },
              "1618473660000": { value: 1111031 },
              "1618473720000": { value: 1111032 },
              "1618473780000": { value: 1111033 },
              "1618473840000": { value: 1111034 },
              "1618473900000": { value: 1111035 },
              "1618473960000": { value: 1111036 },
              "1618474020000": { value: 1111037 },
              "1618474080000": { value: 1111038 },
              "1618474140000": { value: 1111039 },
              "1618474200000": { value: 1111040 },
              "1618474260000": { value: 1111041 },
              "1618474320000": { value: 1111042 },
              "1618474380000": { value: 1111043 },
              "1618474440000": { value: 1111044 },
              "1618474500000": { value: 1111045 },
            },
            variable1112: {
              "1618471800000": { value: 1112000 },
              "1618471860000": { value: 1112001 },
              "1618471920000": { value: 1112002 },
              "1618471980000": { value: 1112003 },
              "1618472040000": { value: 1112004 },
              "1618472100000": { value: 1112005 },
              "1618472160000": { value: 1112006 },
              "1618472220000": { value: 1112007 },
              "1618472280000": { value: 1112008 },
              "1618472340000": { value: 1112009 },
              "1618472400000": { value: 1112010 },
              "1618472460000": { value: 1112011 },
              "1618472520000": { value: 1112012 },
              "1618472580000": { value: 1112013 },
              "1618472640000": { value: 1112014 },
              "1618472700000": { value: 1112015 },
              "1618472760000": { value: 1112016 },
              "1618472820000": { value: 1112017 },
              "1618472880000": { value: 1112018 },
              "1618472940000": { value: 1112019 },
              "1618473000000": { value: 1112020 },
              "1618473060000": { value: 1112021 },
              "1618473120000": { value: 1112022 },
              "1618473180000": { value: 1112023 },
              "1618473240000": { value: 1112024 },
              "1618473300000": { value: 1112025 },
              "1618473360000": { value: 1112026 },
              "1618473420000": { value: 1112027 },
              "1618473480000": { value: 1112028 },
              "1618473540000": { value: 1112029 },
              "1618473600000": { value: 1112030 },
              "1618473660000": { value: 1112031 },
              "1618473720000": { value: 1112032 },
              "1618473780000": { value: 1112033 },
              "1618473840000": { value: 1112034 },
              "1618473900000": { value: 1112035 },
              "1618473960000": { value: 1112036 },
              "1618474020000": { value: 1112037 },
              "1618474080000": { value: 1112038 },
              "1618474140000": { value: 1112039 },
              "1618474200000": { value: 1112040 },
              "1618474260000": { value: 1112041 },
              "1618474320000": { value: 1112042 },
              "1618474380000": { value: 1112043 },
              "1618474440000": { value: 1112044 },
              "1618474500000": { value: 1112045 },
            },
            variable1113: {
              "1618471800000": { value: 1113000 },
              "1618471860000": { value: 1113001 },
              "1618471920000": { value: 1113002 },
              "1618471980000": { value: 1113003 },
              "1618472040000": { value: 1113004 },
              "1618472100000": { value: 1113005 },
              "1618472160000": { value: 1113006 },
              "1618472220000": { value: 1113007 },
              "1618472280000": { value: 1113008 },
              "1618472340000": { value: 1113009 },
              "1618472400000": { value: 1113010 },
              "1618472460000": { value: 1113011 },
              "1618472520000": { value: 1113012 },
              "1618472580000": { value: 1113013 },
              "1618472640000": { value: 1113014 },
              "1618472700000": { value: 1113015 },
              "1618472760000": { value: 1113016 },
              "1618472820000": { value: 1113017 },
              "1618472880000": { value: 1113018 },
              "1618472940000": { value: 1113019 },
              "1618473000000": { value: 1113020 },
              "1618473060000": { value: 1113021 },
              "1618473120000": { value: 1113022 },
              "1618473180000": { value: 1113023 },
              "1618473240000": { value: 1113024 },
              "1618473300000": { value: 1113025 },
              "1618473360000": { value: 1113026 },
              "1618473420000": { value: 1113027 },
              "1618473480000": { value: 1113028 },
              "1618473540000": { value: 1113029 },
              "1618473600000": { value: 1113030 },
              "1618473660000": { value: 1113031 },
              "1618473720000": { value: 1113032 },
              "1618473780000": { value: 1113033 },
              "1618473840000": { value: 1113034 },
              "1618473900000": { value: 1113035 },
              "1618473960000": { value: 1113036 },
              "1618474020000": { value: 1113037 },
              "1618474080000": { value: 1113038 },
              "1618474140000": { value: 1113039 },
              "1618474200000": { value: 1113040 },
              "1618474260000": { value: 1113041 },
              "1618474320000": { value: 1113042 },
              "1618474380000": { value: 1113043 },
              "1618474440000": { value: 1113044 },
              "1618474500000": { value: 1113045 },
            },
          },
          aspect112: {
            variable1121: {
              "1618471800000": { value: 1121000 },
              "1618471860000": { value: 1121001 },
              "1618471920000": { value: 1121002 },
              "1618471980000": { value: 1121003 },
              "1618472040000": { value: 1121004 },
              "1618472100000": { value: 1121005 },
              "1618472160000": { value: 1121006 },
              "1618472220000": { value: 1121007 },
              "1618472280000": { value: 1121008 },
              "1618472340000": { value: 1121009 },
              "1618472400000": { value: 1121010 },
              "1618472460000": { value: 1121011 },
              "1618472520000": { value: 1121012 },
              "1618472580000": { value: 1121013 },
              "1618472640000": { value: 1121014 },
              "1618472700000": { value: 1121015 },
              "1618472760000": { value: 1121016 },
              "1618472820000": { value: 1121017 },
              "1618472880000": { value: 1121018 },
              "1618472940000": { value: 1121019 },
              "1618473000000": { value: 1121020 },
              "1618473060000": { value: 1121021 },
              "1618473120000": { value: 1121022 },
              "1618473180000": { value: 1121023 },
              "1618473240000": { value: 1121024 },
              "1618473300000": { value: 1121025 },
              "1618473360000": { value: 1121026 },
              "1618473420000": { value: 1121027 },
              "1618473480000": { value: 1121028 },
              "1618473540000": { value: 1121029 },
              "1618473600000": { value: 1121030 },
              "1618473660000": { value: 1121031 },
              "1618473720000": { value: 1121032 },
              "1618473780000": { value: 1121033 },
              "1618473840000": { value: 1121034 },
              "1618473900000": { value: 1121035 },
              "1618473960000": { value: 1121036 },
              "1618474020000": { value: 1121037 },
              "1618474080000": { value: 1121038 },
              "1618474140000": { value: 1121039 },
              "1618474200000": { value: 1121040 },
              "1618474260000": { value: 1121041 },
              "1618474320000": { value: 1121042 },
              "1618474380000": { value: 1121043 },
              "1618474440000": { value: 1121044 },
              "1618474500000": { value: 1121045 },
            },
            variable1122: {
              "1618471800000": { value: 1122000 },
              "1618471860000": { value: 1122001 },
              "1618471920000": { value: 1122002 },
              "1618471980000": { value: 1122003 },
              "1618472040000": { value: 1122004 },
              "1618472100000": { value: 1122005 },
              "1618472160000": { value: 1122006 },
              "1618472220000": { value: 1122007 },
              "1618472280000": { value: 1122008 },
              "1618472340000": { value: 1122009 },
              "1618472400000": { value: 1122010 },
              "1618472460000": { value: 1122011 },
              "1618472520000": { value: 1122012 },
              "1618472580000": { value: 1122013 },
              "1618472640000": { value: 1122014 },
              "1618472700000": { value: 1122015 },
              "1618472760000": { value: 1122016 },
              "1618472820000": { value: 1122017 },
              "1618472880000": { value: 1122018 },
              "1618472940000": { value: 1122019 },
              "1618473000000": { value: 1122020 },
              "1618473060000": { value: 1122021 },
              "1618473120000": { value: 1122022 },
              "1618473180000": { value: 1122023 },
              "1618473240000": { value: 1122024 },
              "1618473300000": { value: 1122025 },
              "1618473360000": { value: 1122026 },
              "1618473420000": { value: 1122027 },
              "1618473480000": { value: 1122028 },
              "1618473540000": { value: 1122029 },
              "1618473600000": { value: 1122030 },
              "1618473660000": { value: 1122031 },
              "1618473720000": { value: 1122032 },
              "1618473780000": { value: 1122033 },
              "1618473840000": { value: 1122034 },
              "1618473900000": { value: 1122035 },
              "1618473960000": { value: 1122036 },
              "1618474020000": { value: 1122037 },
              "1618474080000": { value: 1122038 },
              "1618474140000": { value: 1122039 },
              "1618474200000": { value: 1122040 },
              "1618474260000": { value: 1122041 },
              "1618474320000": { value: 1122042 },
              "1618474380000": { value: 1122043 },
              "1618474440000": { value: 1122044 },
              "1618474500000": { value: 1122045 },
            },
            variable1123: {
              "1618471800000": { value: 1123000 },
              "1618471860000": { value: 1123001 },
              "1618471920000": { value: 1123002 },
              "1618471980000": { value: 1123003 },
              "1618472040000": { value: 1123004 },
              "1618472100000": { value: 1123005 },
              "1618472160000": { value: 1123006 },
              "1618472220000": { value: 1123007 },
              "1618472280000": { value: 1123008 },
              "1618472340000": { value: 1123009 },
              "1618472400000": { value: 1123010 },
              "1618472460000": { value: 1123011 },
              "1618472520000": { value: 1123012 },
              "1618472580000": { value: 1123013 },
              "1618472640000": { value: 1123014 },
              "1618472700000": { value: 1123015 },
              "1618472760000": { value: 1123016 },
              "1618472820000": { value: 1123017 },
              "1618472880000": { value: 1123018 },
              "1618472940000": { value: 1123019 },
              "1618473000000": { value: 1123020 },
              "1618473060000": { value: 1123021 },
              "1618473120000": { value: 1123022 },
              "1618473180000": { value: 1123023 },
              "1618473240000": { value: 1123024 },
              "1618473300000": { value: 1123025 },
              "1618473360000": { value: 1123026 },
              "1618473420000": { value: 1123027 },
              "1618473480000": { value: 1123028 },
              "1618473540000": { value: 1123029 },
              "1618473600000": { value: 1123030 },
              "1618473660000": { value: 1123031 },
              "1618473720000": { value: 1123032 },
              "1618473780000": { value: 1123033 },
              "1618473840000": { value: 1123034 },
              "1618473900000": { value: 1123035 },
              "1618473960000": { value: 1123036 },
              "1618474020000": { value: 1123037 },
              "1618474080000": { value: 1123038 },
              "1618474140000": { value: 1123039 },
              "1618474200000": { value: 1123040 },
              "1618474260000": { value: 1123041 },
              "1618474320000": { value: 1123042 },
              "1618474380000": { value: 1123043 },
              "1618474440000": { value: 1123044 },
              "1618474500000": { value: 1123045 },
            },
          },
          aspect113: {
            variable1131: {
              "1618471800000": { value: 1131000 },
              "1618471860000": { value: 1131001 },
              "1618471920000": { value: 1131002 },
              "1618471980000": { value: 1131003 },
              "1618472040000": { value: 1131004 },
              "1618472100000": { value: 1131005 },
              "1618472160000": { value: 1131006 },
              "1618472220000": { value: 1131007 },
              "1618472280000": { value: 1131008 },
              "1618472340000": { value: 1131009 },
              "1618472400000": { value: 1131010 },
              "1618472460000": { value: 1131011 },
              "1618472520000": { value: 1131012 },
              "1618472580000": { value: 1131013 },
              "1618472640000": { value: 1131014 },
              "1618472700000": { value: 1131015 },
              "1618472760000": { value: 1131016 },
              "1618472820000": { value: 1131017 },
              "1618472880000": { value: 1131018 },
              "1618472940000": { value: 1131019 },
              "1618473000000": { value: 1131020 },
              "1618473060000": { value: 1131021 },
              "1618473120000": { value: 1131022 },
              "1618473180000": { value: 1131023 },
              "1618473240000": { value: 1131024 },
              "1618473300000": { value: 1131025 },
              "1618473360000": { value: 1131026 },
              "1618473420000": { value: 1131027 },
              "1618473480000": { value: 1131028 },
              "1618473540000": { value: 1131029 },
              "1618473600000": { value: 1131030 },
              "1618473660000": { value: 1131031 },
              "1618473720000": { value: 1131032 },
              "1618473780000": { value: 1131033 },
              "1618473840000": { value: 1131034 },
              "1618473900000": { value: 1131035 },
              "1618473960000": { value: 1131036 },
              "1618474020000": { value: 1131037 },
              "1618474080000": { value: 1131038 },
              "1618474140000": { value: 1131039 },
              "1618474200000": { value: 1131040 },
              "1618474260000": { value: 1131041 },
              "1618474320000": { value: 1131042 },
              "1618474380000": { value: 1131043 },
              "1618474440000": { value: 1131044 },
              "1618474500000": { value: 1131045 },
            },
            variable1132: {
              "1618471800000": { value: 1132000 },
              "1618471860000": { value: 1132001 },
              "1618471920000": { value: 1132002 },
              "1618471980000": { value: 1132003 },
              "1618472040000": { value: 1132004 },
              "1618472100000": { value: 1132005 },
              "1618472160000": { value: 1132006 },
              "1618472220000": { value: 1132007 },
              "1618472280000": { value: 1132008 },
              "1618472340000": { value: 1132009 },
              "1618472400000": { value: 1132010 },
              "1618472460000": { value: 1132011 },
              "1618472520000": { value: 1132012 },
              "1618472580000": { value: 1132013 },
              "1618472640000": { value: 1132014 },
              "1618472700000": { value: 1132015 },
              "1618472760000": { value: 1132016 },
              "1618472820000": { value: 1132017 },
              "1618472880000": { value: 1132018 },
              "1618472940000": { value: 1132019 },
              "1618473000000": { value: 1132020 },
              "1618473060000": { value: 1132021 },
              "1618473120000": { value: 1132022 },
              "1618473180000": { value: 1132023 },
              "1618473240000": { value: 1132024 },
              "1618473300000": { value: 1132025 },
              "1618473360000": { value: 1132026 },
              "1618473420000": { value: 1132027 },
              "1618473480000": { value: 1132028 },
              "1618473540000": { value: 1132029 },
              "1618473600000": { value: 1132030 },
              "1618473660000": { value: 1132031 },
              "1618473720000": { value: 1132032 },
              "1618473780000": { value: 1132033 },
              "1618473840000": { value: 1132034 },
              "1618473900000": { value: 1132035 },
              "1618473960000": { value: 1132036 },
              "1618474020000": { value: 1132037 },
              "1618474080000": { value: 1132038 },
              "1618474140000": { value: 1132039 },
              "1618474200000": { value: 1132040 },
              "1618474260000": { value: 1132041 },
              "1618474320000": { value: 1132042 },
              "1618474380000": { value: 1132043 },
              "1618474440000": { value: 1132044 },
              "1618474500000": { value: 1132045 },
            },
            variable1133: {
              "1618471800000": { value: 1133000 },
              "1618471860000": { value: 1133001 },
              "1618471920000": { value: 1133002 },
              "1618471980000": { value: 1133003 },
              "1618472040000": { value: 1133004 },
              "1618472100000": { value: 1133005 },
              "1618472160000": { value: 1133006 },
              "1618472220000": { value: 1133007 },
              "1618472280000": { value: 1133008 },
              "1618472340000": { value: 1133009 },
              "1618472400000": { value: 1133010 },
              "1618472460000": { value: 1133011 },
              "1618472520000": { value: 1133012 },
              "1618472580000": { value: 1133013 },
              "1618472640000": { value: 1133014 },
              "1618472700000": { value: 1133015 },
              "1618472760000": { value: 1133016 },
              "1618472820000": { value: 1133017 },
              "1618472880000": { value: 1133018 },
              "1618472940000": { value: 1133019 },
              "1618473000000": { value: 1133020 },
              "1618473060000": { value: 1133021 },
              "1618473120000": { value: 1133022 },
              "1618473180000": { value: 1133023 },
              "1618473240000": { value: 1133024 },
              "1618473300000": { value: 1133025 },
              "1618473360000": { value: 1133026 },
              "1618473420000": { value: 1133027 },
              "1618473480000": { value: 1133028 },
              "1618473540000": { value: 1133029 },
              "1618473600000": { value: 1133030 },
              "1618473660000": { value: 1133031 },
              "1618473720000": { value: 1133032 },
              "1618473780000": { value: 1133033 },
              "1618473840000": { value: 1133034 },
              "1618473900000": { value: 1133035 },
              "1618473960000": { value: 1133036 },
              "1618474020000": { value: 1133037 },
              "1618474080000": { value: 1133038 },
              "1618474140000": { value: 1133039 },
              "1618474200000": { value: 1133040 },
              "1618474260000": { value: 1133041 },
              "1618474320000": { value: 1133042 },
              "1618474380000": { value: 1133043 },
              "1618474440000": { value: 1133044 },
              "1618474500000": { value: 1133045 },
            },
          },
        },
        asset12: {
          aspect121: {
            variable1211: {
              "1618471800000": { value: 1211000 },
              "1618471860000": { value: 1211001 },
              "1618471920000": { value: 1211002 },
              "1618471980000": { value: 1211003 },
              "1618472040000": { value: 1211004 },
              "1618472100000": { value: 1211005 },
              "1618472160000": { value: 1211006 },
              "1618472220000": { value: 1211007 },
              "1618472280000": { value: 1211008 },
              "1618472340000": { value: 1211009 },
              "1618472400000": { value: 1211010 },
              "1618472460000": { value: 1211011 },
              "1618472520000": { value: 1211012 },
              "1618472580000": { value: 1211013 },
              "1618472640000": { value: 1211014 },
              "1618472700000": { value: 1211015 },
              "1618472760000": { value: 1211016 },
              "1618472820000": { value: 1211017 },
              "1618472880000": { value: 1211018 },
              "1618472940000": { value: 1211019 },
              "1618473000000": { value: 1211020 },
              "1618473060000": { value: 1211021 },
              "1618473120000": { value: 1211022 },
              "1618473180000": { value: 1211023 },
              "1618473240000": { value: 1211024 },
              "1618473300000": { value: 1211025 },
              "1618473360000": { value: 1211026 },
              "1618473420000": { value: 1211027 },
              "1618473480000": { value: 1211028 },
              "1618473540000": { value: 1211029 },
              "1618473600000": { value: 1211030 },
              "1618473660000": { value: 1211031 },
              "1618473720000": { value: 1211032 },
              "1618473780000": { value: 1211033 },
              "1618473840000": { value: 1211034 },
              "1618473900000": { value: 1211035 },
              "1618473960000": { value: 1211036 },
              "1618474020000": { value: 1211037 },
              "1618474080000": { value: 1211038 },
              "1618474140000": { value: 1211039 },
              "1618474200000": { value: 1211040 },
              "1618474260000": { value: 1211041 },
              "1618474320000": { value: 1211042 },
              "1618474380000": { value: 1211043 },
              "1618474440000": { value: 1211044 },
              "1618474500000": { value: 1211045 },
            },
            variable1212: {
              "1618471800000": { value: 1212000 },
              "1618471860000": { value: 1212001 },
              "1618471920000": { value: 1212002 },
              "1618471980000": { value: 1212003 },
              "1618472040000": { value: 1212004 },
              "1618472100000": { value: 1212005 },
              "1618472160000": { value: 1212006 },
              "1618472220000": { value: 1212007 },
              "1618472280000": { value: 1212008 },
              "1618472340000": { value: 1212009 },
              "1618472400000": { value: 1212010 },
              "1618472460000": { value: 1212011 },
              "1618472520000": { value: 1212012 },
              "1618472580000": { value: 1212013 },
              "1618472640000": { value: 1212014 },
              "1618472700000": { value: 1212015 },
              "1618472760000": { value: 1212016 },
              "1618472820000": { value: 1212017 },
              "1618472880000": { value: 1212018 },
              "1618472940000": { value: 1212019 },
              "1618473000000": { value: 1212020 },
              "1618473060000": { value: 1212021 },
              "1618473120000": { value: 1212022 },
              "1618473180000": { value: 1212023 },
              "1618473240000": { value: 1212024 },
              "1618473300000": { value: 1212025 },
              "1618473360000": { value: 1212026 },
              "1618473420000": { value: 1212027 },
              "1618473480000": { value: 1212028 },
              "1618473540000": { value: 1212029 },
              "1618473600000": { value: 1212030 },
              "1618473660000": { value: 1212031 },
              "1618473720000": { value: 1212032 },
              "1618473780000": { value: 1212033 },
              "1618473840000": { value: 1212034 },
              "1618473900000": { value: 1212035 },
              "1618473960000": { value: 1212036 },
              "1618474020000": { value: 1212037 },
              "1618474080000": { value: 1212038 },
              "1618474140000": { value: 1212039 },
              "1618474200000": { value: 1212040 },
              "1618474260000": { value: 1212041 },
              "1618474320000": { value: 1212042 },
              "1618474380000": { value: 1212043 },
              "1618474440000": { value: 1212044 },
              "1618474500000": { value: 1212045 },
            },
            variable1213: {
              "1618471800000": { value: 1213000 },
              "1618471860000": { value: 1213001 },
              "1618471920000": { value: 1213002 },
              "1618471980000": { value: 1213003 },
              "1618472040000": { value: 1213004 },
              "1618472100000": { value: 1213005 },
              "1618472160000": { value: 1213006 },
              "1618472220000": { value: 1213007 },
              "1618472280000": { value: 1213008 },
              "1618472340000": { value: 1213009 },
              "1618472400000": { value: 1213010 },
              "1618472460000": { value: 1213011 },
              "1618472520000": { value: 1213012 },
              "1618472580000": { value: 1213013 },
              "1618472640000": { value: 1213014 },
              "1618472700000": { value: 1213015 },
              "1618472760000": { value: 1213016 },
              "1618472820000": { value: 1213017 },
              "1618472880000": { value: 1213018 },
              "1618472940000": { value: 1213019 },
              "1618473000000": { value: 1213020 },
              "1618473060000": { value: 1213021 },
              "1618473120000": { value: 1213022 },
              "1618473180000": { value: 1213023 },
              "1618473240000": { value: 1213024 },
              "1618473300000": { value: 1213025 },
              "1618473360000": { value: 1213026 },
              "1618473420000": { value: 1213027 },
              "1618473480000": { value: 1213028 },
              "1618473540000": { value: 1213029 },
              "1618473600000": { value: 1213030 },
              "1618473660000": { value: 1213031 },
              "1618473720000": { value: 1213032 },
              "1618473780000": { value: 1213033 },
              "1618473840000": { value: 1213034 },
              "1618473900000": { value: 1213035 },
              "1618473960000": { value: 1213036 },
              "1618474020000": { value: 1213037 },
              "1618474080000": { value: 1213038 },
              "1618474140000": { value: 1213039 },
              "1618474200000": { value: 1213040 },
              "1618474260000": { value: 1213041 },
              "1618474320000": { value: 1213042 },
              "1618474380000": { value: 1213043 },
              "1618474440000": { value: 1213044 },
              "1618474500000": { value: 1213045 },
            },
          },
          aspect122: {
            variable1221: {
              "1618471800000": { value: 1221000 },
              "1618471860000": { value: 1221001 },
              "1618471920000": { value: 1221002 },
              "1618471980000": { value: 1221003 },
              "1618472040000": { value: 1221004 },
              "1618472100000": { value: 1221005 },
              "1618472160000": { value: 1221006 },
              "1618472220000": { value: 1221007 },
              "1618472280000": { value: 1221008 },
              "1618472340000": { value: 1221009 },
              "1618472400000": { value: 1221010 },
              "1618472460000": { value: 1221011 },
              "1618472520000": { value: 1221012 },
              "1618472580000": { value: 1221013 },
              "1618472640000": { value: 1221014 },
              "1618472700000": { value: 1221015 },
              "1618472760000": { value: 1221016 },
              "1618472820000": { value: 1221017 },
              "1618472880000": { value: 1221018 },
              "1618472940000": { value: 1221019 },
              "1618473000000": { value: 1221020 },
              "1618473060000": { value: 1221021 },
              "1618473120000": { value: 1221022 },
              "1618473180000": { value: 1221023 },
              "1618473240000": { value: 1221024 },
              "1618473300000": { value: 1221025 },
              "1618473360000": { value: 1221026 },
              "1618473420000": { value: 1221027 },
              "1618473480000": { value: 1221028 },
              "1618473540000": { value: 1221029 },
              "1618473600000": { value: 1221030 },
              "1618473660000": { value: 1221031 },
              "1618473720000": { value: 1221032 },
              "1618473780000": { value: 1221033 },
              "1618473840000": { value: 1221034 },
              "1618473900000": { value: 1221035 },
              "1618473960000": { value: 1221036 },
              "1618474020000": { value: 1221037 },
              "1618474080000": { value: 1221038 },
              "1618474140000": { value: 1221039 },
              "1618474200000": { value: 1221040 },
              "1618474260000": { value: 1221041 },
              "1618474320000": { value: 1221042 },
              "1618474380000": { value: 1221043 },
              "1618474440000": { value: 1221044 },
              "1618474500000": { value: 1221045 },
            },
            variable1222: {
              "1618471800000": { value: 1222000 },
              "1618471860000": { value: 1222001 },
              "1618471920000": { value: 1222002 },
              "1618471980000": { value: 1222003 },
              "1618472040000": { value: 1222004 },
              "1618472100000": { value: 1222005 },
              "1618472160000": { value: 1222006 },
              "1618472220000": { value: 1222007 },
              "1618472280000": { value: 1222008 },
              "1618472340000": { value: 1222009 },
              "1618472400000": { value: 1222010 },
              "1618472460000": { value: 1222011 },
              "1618472520000": { value: 1222012 },
              "1618472580000": { value: 1222013 },
              "1618472640000": { value: 1222014 },
              "1618472700000": { value: 1222015 },
              "1618472760000": { value: 1222016 },
              "1618472820000": { value: 1222017 },
              "1618472880000": { value: 1222018 },
              "1618472940000": { value: 1222019 },
              "1618473000000": { value: 1222020 },
              "1618473060000": { value: 1222021 },
              "1618473120000": { value: 1222022 },
              "1618473180000": { value: 1222023 },
              "1618473240000": { value: 1222024 },
              "1618473300000": { value: 1222025 },
              "1618473360000": { value: 1222026 },
              "1618473420000": { value: 1222027 },
              "1618473480000": { value: 1222028 },
              "1618473540000": { value: 1222029 },
              "1618473600000": { value: 1222030 },
              "1618473660000": { value: 1222031 },
              "1618473720000": { value: 1222032 },
              "1618473780000": { value: 1222033 },
              "1618473840000": { value: 1222034 },
              "1618473900000": { value: 1222035 },
              "1618473960000": { value: 1222036 },
              "1618474020000": { value: 1222037 },
              "1618474080000": { value: 1222038 },
              "1618474140000": { value: 1222039 },
              "1618474200000": { value: 1222040 },
              "1618474260000": { value: 1222041 },
              "1618474320000": { value: 1222042 },
              "1618474380000": { value: 1222043 },
              "1618474440000": { value: 1222044 },
              "1618474500000": { value: 1222045 },
            },
            variable1223: {
              "1618471800000": { value: 1223000 },
              "1618471860000": { value: 1223001 },
              "1618471920000": { value: 1223002 },
              "1618471980000": { value: 1223003 },
              "1618472040000": { value: 1223004 },
              "1618472100000": { value: 1223005 },
              "1618472160000": { value: 1223006 },
              "1618472220000": { value: 1223007 },
              "1618472280000": { value: 1223008 },
              "1618472340000": { value: 1223009 },
              "1618472400000": { value: 1223010 },
              "1618472460000": { value: 1223011 },
              "1618472520000": { value: 1223012 },
              "1618472580000": { value: 1223013 },
              "1618472640000": { value: 1223014 },
              "1618472700000": { value: 1223015 },
              "1618472760000": { value: 1223016 },
              "1618472820000": { value: 1223017 },
              "1618472880000": { value: 1223018 },
              "1618472940000": { value: 1223019 },
              "1618473000000": { value: 1223020 },
              "1618473060000": { value: 1223021 },
              "1618473120000": { value: 1223022 },
              "1618473180000": { value: 1223023 },
              "1618473240000": { value: 1223024 },
              "1618473300000": { value: 1223025 },
              "1618473360000": { value: 1223026 },
              "1618473420000": { value: 1223027 },
              "1618473480000": { value: 1223028 },
              "1618473540000": { value: 1223029 },
              "1618473600000": { value: 1223030 },
              "1618473660000": { value: 1223031 },
              "1618473720000": { value: 1223032 },
              "1618473780000": { value: 1223033 },
              "1618473840000": { value: 1223034 },
              "1618473900000": { value: 1223035 },
              "1618473960000": { value: 1223036 },
              "1618474020000": { value: 1223037 },
              "1618474080000": { value: 1223038 },
              "1618474140000": { value: 1223039 },
              "1618474200000": { value: 1223040 },
              "1618474260000": { value: 1223041 },
              "1618474320000": { value: 1223042 },
              "1618474380000": { value: 1223043 },
              "1618474440000": { value: 1223044 },
              "1618474500000": { value: 1223045 },
            },
          },
          aspect123: {
            variable1231: {
              "1618471800000": { value: 1231000 },
              "1618471860000": { value: 1231001 },
              "1618471920000": { value: 1231002 },
              "1618471980000": { value: 1231003 },
              "1618472040000": { value: 1231004 },
              "1618472100000": { value: 1231005 },
              "1618472160000": { value: 1231006 },
              "1618472220000": { value: 1231007 },
              "1618472280000": { value: 1231008 },
              "1618472340000": { value: 1231009 },
              "1618472400000": { value: 1231010 },
              "1618472460000": { value: 1231011 },
              "1618472520000": { value: 1231012 },
              "1618472580000": { value: 1231013 },
              "1618472640000": { value: 1231014 },
              "1618472700000": { value: 1231015 },
              "1618472760000": { value: 1231016 },
              "1618472820000": { value: 1231017 },
              "1618472880000": { value: 1231018 },
              "1618472940000": { value: 1231019 },
              "1618473000000": { value: 1231020 },
              "1618473060000": { value: 1231021 },
              "1618473120000": { value: 1231022 },
              "1618473180000": { value: 1231023 },
              "1618473240000": { value: 1231024 },
              "1618473300000": { value: 1231025 },
              "1618473360000": { value: 1231026 },
              "1618473420000": { value: 1231027 },
              "1618473480000": { value: 1231028 },
              "1618473540000": { value: 1231029 },
              "1618473600000": { value: 1231030 },
              "1618473660000": { value: 1231031 },
              "1618473720000": { value: 1231032 },
              "1618473780000": { value: 1231033 },
              "1618473840000": { value: 1231034 },
              "1618473900000": { value: 1231035 },
              "1618473960000": { value: 1231036 },
              "1618474020000": { value: 1231037 },
              "1618474080000": { value: 1231038 },
              "1618474140000": { value: 1231039 },
              "1618474200000": { value: 1231040 },
              "1618474260000": { value: 1231041 },
              "1618474320000": { value: 1231042 },
              "1618474380000": { value: 1231043 },
              "1618474440000": { value: 1231044 },
              "1618474500000": { value: 1231045 },
            },
            variable1232: {
              "1618471800000": { value: 1232000 },
              "1618471860000": { value: 1232001 },
              "1618471920000": { value: 1232002 },
              "1618471980000": { value: 1232003 },
              "1618472040000": { value: 1232004 },
              "1618472100000": { value: 1232005 },
              "1618472160000": { value: 1232006 },
              "1618472220000": { value: 1232007 },
              "1618472280000": { value: 1232008 },
              "1618472340000": { value: 1232009 },
              "1618472400000": { value: 1232010 },
              "1618472460000": { value: 1232011 },
              "1618472520000": { value: 1232012 },
              "1618472580000": { value: 1232013 },
              "1618472640000": { value: 1232014 },
              "1618472700000": { value: 1232015 },
              "1618472760000": { value: 1232016 },
              "1618472820000": { value: 1232017 },
              "1618472880000": { value: 1232018 },
              "1618472940000": { value: 1232019 },
              "1618473000000": { value: 1232020 },
              "1618473060000": { value: 1232021 },
              "1618473120000": { value: 1232022 },
              "1618473180000": { value: 1232023 },
              "1618473240000": { value: 1232024 },
              "1618473300000": { value: 1232025 },
              "1618473360000": { value: 1232026 },
              "1618473420000": { value: 1232027 },
              "1618473480000": { value: 1232028 },
              "1618473540000": { value: 1232029 },
              "1618473600000": { value: 1232030 },
              "1618473660000": { value: 1232031 },
              "1618473720000": { value: 1232032 },
              "1618473780000": { value: 1232033 },
              "1618473840000": { value: 1232034 },
              "1618473900000": { value: 1232035 },
              "1618473960000": { value: 1232036 },
              "1618474020000": { value: 1232037 },
              "1618474080000": { value: 1232038 },
              "1618474140000": { value: 1232039 },
              "1618474200000": { value: 1232040 },
              "1618474260000": { value: 1232041 },
              "1618474320000": { value: 1232042 },
              "1618474380000": { value: 1232043 },
              "1618474440000": { value: 1232044 },
              "1618474500000": { value: 1232045 },
            },
            variable1233: {
              "1618471800000": { value: 1233000 },
              "1618471860000": { value: 1233001 },
              "1618471920000": { value: 1233002 },
              "1618471980000": { value: 1233003 },
              "1618472040000": { value: 1233004 },
              "1618472100000": { value: 1233005 },
              "1618472160000": { value: 1233006 },
              "1618472220000": { value: 1233007 },
              "1618472280000": { value: 1233008 },
              "1618472340000": { value: 1233009 },
              "1618472400000": { value: 1233010 },
              "1618472460000": { value: 1233011 },
              "1618472520000": { value: 1233012 },
              "1618472580000": { value: 1233013 },
              "1618472640000": { value: 1233014 },
              "1618472700000": { value: 1233015 },
              "1618472760000": { value: 1233016 },
              "1618472820000": { value: 1233017 },
              "1618472880000": { value: 1233018 },
              "1618472940000": { value: 1233019 },
              "1618473000000": { value: 1233020 },
              "1618473060000": { value: 1233021 },
              "1618473120000": { value: 1233022 },
              "1618473180000": { value: 1233023 },
              "1618473240000": { value: 1233024 },
              "1618473300000": { value: 1233025 },
              "1618473360000": { value: 1233026 },
              "1618473420000": { value: 1233027 },
              "1618473480000": { value: 1233028 },
              "1618473540000": { value: 1233029 },
              "1618473600000": { value: 1233030 },
              "1618473660000": { value: 1233031 },
              "1618473720000": { value: 1233032 },
              "1618473780000": { value: 1233033 },
              "1618473840000": { value: 1233034 },
              "1618473900000": { value: 1233035 },
              "1618473960000": { value: 1233036 },
              "1618474020000": { value: 1233037 },
              "1618474080000": { value: 1233038 },
              "1618474140000": { value: 1233039 },
              "1618474200000": { value: 1233040 },
              "1618474260000": { value: 1233041 },
              "1618474320000": { value: 1233042 },
              "1618474380000": { value: 1233043 },
              "1618474440000": { value: 1233044 },
              "1618474500000": { value: 1233045 },
            },
          },
        },
        asset13: {
          aspect131: {
            variable1311: {
              "1618471800000": { value: 1311000 },
              "1618471860000": { value: 1311001 },
              "1618471920000": { value: 1311002 },
              "1618471980000": { value: 1311003 },
              "1618472040000": { value: 1311004 },
              "1618472100000": { value: 1311005 },
              "1618472160000": { value: 1311006 },
              "1618472220000": { value: 1311007 },
              "1618472280000": { value: 1311008 },
              "1618472340000": { value: 1311009 },
              "1618472400000": { value: 1311010 },
              "1618472460000": { value: 1311011 },
              "1618472520000": { value: 1311012 },
              "1618472580000": { value: 1311013 },
              "1618472640000": { value: 1311014 },
              "1618472700000": { value: 1311015 },
              "1618472760000": { value: 1311016 },
              "1618472820000": { value: 1311017 },
              "1618472880000": { value: 1311018 },
              "1618472940000": { value: 1311019 },
              "1618473000000": { value: 1311020 },
              "1618473060000": { value: 1311021 },
              "1618473120000": { value: 1311022 },
              "1618473180000": { value: 1311023 },
              "1618473240000": { value: 1311024 },
              "1618473300000": { value: 1311025 },
              "1618473360000": { value: 1311026 },
              "1618473420000": { value: 1311027 },
              "1618473480000": { value: 1311028 },
              "1618473540000": { value: 1311029 },
              "1618473600000": { value: 1311030 },
              "1618473660000": { value: 1311031 },
              "1618473720000": { value: 1311032 },
              "1618473780000": { value: 1311033 },
              "1618473840000": { value: 1311034 },
              "1618473900000": { value: 1311035 },
              "1618473960000": { value: 1311036 },
              "1618474020000": { value: 1311037 },
              "1618474080000": { value: 1311038 },
              "1618474140000": { value: 1311039 },
              "1618474200000": { value: 1311040 },
              "1618474260000": { value: 1311041 },
              "1618474320000": { value: 1311042 },
              "1618474380000": { value: 1311043 },
              "1618474440000": { value: 1311044 },
              "1618474500000": { value: 1311045 },
            },
            variable1312: {
              "1618471800000": { value: 1312000 },
              "1618471860000": { value: 1312001 },
              "1618471920000": { value: 1312002 },
              "1618471980000": { value: 1312003 },
              "1618472040000": { value: 1312004 },
              "1618472100000": { value: 1312005 },
              "1618472160000": { value: 1312006 },
              "1618472220000": { value: 1312007 },
              "1618472280000": { value: 1312008 },
              "1618472340000": { value: 1312009 },
              "1618472400000": { value: 1312010 },
              "1618472460000": { value: 1312011 },
              "1618472520000": { value: 1312012 },
              "1618472580000": { value: 1312013 },
              "1618472640000": { value: 1312014 },
              "1618472700000": { value: 1312015 },
              "1618472760000": { value: 1312016 },
              "1618472820000": { value: 1312017 },
              "1618472880000": { value: 1312018 },
              "1618472940000": { value: 1312019 },
              "1618473000000": { value: 1312020 },
              "1618473060000": { value: 1312021 },
              "1618473120000": { value: 1312022 },
              "1618473180000": { value: 1312023 },
              "1618473240000": { value: 1312024 },
              "1618473300000": { value: 1312025 },
              "1618473360000": { value: 1312026 },
              "1618473420000": { value: 1312027 },
              "1618473480000": { value: 1312028 },
              "1618473540000": { value: 1312029 },
              "1618473600000": { value: 1312030 },
              "1618473660000": { value: 1312031 },
              "1618473720000": { value: 1312032 },
              "1618473780000": { value: 1312033 },
              "1618473840000": { value: 1312034 },
              "1618473900000": { value: 1312035 },
              "1618473960000": { value: 1312036 },
              "1618474020000": { value: 1312037 },
              "1618474080000": { value: 1312038 },
              "1618474140000": { value: 1312039 },
              "1618474200000": { value: 1312040 },
              "1618474260000": { value: 1312041 },
              "1618474320000": { value: 1312042 },
              "1618474380000": { value: 1312043 },
              "1618474440000": { value: 1312044 },
              "1618474500000": { value: 1312045 },
            },
            variable1313: {
              "1618471800000": { value: 1313000 },
              "1618471860000": { value: 1313001 },
              "1618471920000": { value: 1313002 },
              "1618471980000": { value: 1313003 },
              "1618472040000": { value: 1313004 },
              "1618472100000": { value: 1313005 },
              "1618472160000": { value: 1313006 },
              "1618472220000": { value: 1313007 },
              "1618472280000": { value: 1313008 },
              "1618472340000": { value: 1313009 },
              "1618472400000": { value: 1313010 },
              "1618472460000": { value: 1313011 },
              "1618472520000": { value: 1313012 },
              "1618472580000": { value: 1313013 },
              "1618472640000": { value: 1313014 },
              "1618472700000": { value: 1313015 },
              "1618472760000": { value: 1313016 },
              "1618472820000": { value: 1313017 },
              "1618472880000": { value: 1313018 },
              "1618472940000": { value: 1313019 },
              "1618473000000": { value: 1313020 },
              "1618473060000": { value: 1313021 },
              "1618473120000": { value: 1313022 },
              "1618473180000": { value: 1313023 },
              "1618473240000": { value: 1313024 },
              "1618473300000": { value: 1313025 },
              "1618473360000": { value: 1313026 },
              "1618473420000": { value: 1313027 },
              "1618473480000": { value: 1313028 },
              "1618473540000": { value: 1313029 },
              "1618473600000": { value: 1313030 },
              "1618473660000": { value: 1313031 },
              "1618473720000": { value: 1313032 },
              "1618473780000": { value: 1313033 },
              "1618473840000": { value: 1313034 },
              "1618473900000": { value: 1313035 },
              "1618473960000": { value: 1313036 },
              "1618474020000": { value: 1313037 },
              "1618474080000": { value: 1313038 },
              "1618474140000": { value: 1313039 },
              "1618474200000": { value: 1313040 },
              "1618474260000": { value: 1313041 },
              "1618474320000": { value: 1313042 },
              "1618474380000": { value: 1313043 },
              "1618474440000": { value: 1313044 },
              "1618474500000": { value: 1313045 },
            },
          },
          aspect132: {
            variable1321: {
              "1618471800000": { value: 1321000 },
              "1618471860000": { value: 1321001 },
              "1618471920000": { value: 1321002 },
              "1618471980000": { value: 1321003 },
              "1618472040000": { value: 1321004 },
              "1618472100000": { value: 1321005 },
              "1618472160000": { value: 1321006 },
              "1618472220000": { value: 1321007 },
              "1618472280000": { value: 1321008 },
              "1618472340000": { value: 1321009 },
              "1618472400000": { value: 1321010 },
              "1618472460000": { value: 1321011 },
              "1618472520000": { value: 1321012 },
              "1618472580000": { value: 1321013 },
              "1618472640000": { value: 1321014 },
              "1618472700000": { value: 1321015 },
              "1618472760000": { value: 1321016 },
              "1618472820000": { value: 1321017 },
              "1618472880000": { value: 1321018 },
              "1618472940000": { value: 1321019 },
              "1618473000000": { value: 1321020 },
              "1618473060000": { value: 1321021 },
              "1618473120000": { value: 1321022 },
              "1618473180000": { value: 1321023 },
              "1618473240000": { value: 1321024 },
              "1618473300000": { value: 1321025 },
              "1618473360000": { value: 1321026 },
              "1618473420000": { value: 1321027 },
              "1618473480000": { value: 1321028 },
              "1618473540000": { value: 1321029 },
              "1618473600000": { value: 1321030 },
              "1618473660000": { value: 1321031 },
              "1618473720000": { value: 1321032 },
              "1618473780000": { value: 1321033 },
              "1618473840000": { value: 1321034 },
              "1618473900000": { value: 1321035 },
              "1618473960000": { value: 1321036 },
              "1618474020000": { value: 1321037 },
              "1618474080000": { value: 1321038 },
              "1618474140000": { value: 1321039 },
              "1618474200000": { value: 1321040 },
              "1618474260000": { value: 1321041 },
              "1618474320000": { value: 1321042 },
              "1618474380000": { value: 1321043 },
              "1618474440000": { value: 1321044 },
              "1618474500000": { value: 1321045 },
            },
            variable1322: {
              "1618471800000": { value: 1322000 },
              "1618471860000": { value: 1322001 },
              "1618471920000": { value: 1322002 },
              "1618471980000": { value: 1322003 },
              "1618472040000": { value: 1322004 },
              "1618472100000": { value: 1322005 },
              "1618472160000": { value: 1322006 },
              "1618472220000": { value: 1322007 },
              "1618472280000": { value: 1322008 },
              "1618472340000": { value: 1322009 },
              "1618472400000": { value: 1322010 },
              "1618472460000": { value: 1322011 },
              "1618472520000": { value: 1322012 },
              "1618472580000": { value: 1322013 },
              "1618472640000": { value: 1322014 },
              "1618472700000": { value: 1322015 },
              "1618472760000": { value: 1322016 },
              "1618472820000": { value: 1322017 },
              "1618472880000": { value: 1322018 },
              "1618472940000": { value: 1322019 },
              "1618473000000": { value: 1322020 },
              "1618473060000": { value: 1322021 },
              "1618473120000": { value: 1322022 },
              "1618473180000": { value: 1322023 },
              "1618473240000": { value: 1322024 },
              "1618473300000": { value: 1322025 },
              "1618473360000": { value: 1322026 },
              "1618473420000": { value: 1322027 },
              "1618473480000": { value: 1322028 },
              "1618473540000": { value: 1322029 },
              "1618473600000": { value: 1322030 },
              "1618473660000": { value: 1322031 },
              "1618473720000": { value: 1322032 },
              "1618473780000": { value: 1322033 },
              "1618473840000": { value: 1322034 },
              "1618473900000": { value: 1322035 },
              "1618473960000": { value: 1322036 },
              "1618474020000": { value: 1322037 },
              "1618474080000": { value: 1322038 },
              "1618474140000": { value: 1322039 },
              "1618474200000": { value: 1322040 },
              "1618474260000": { value: 1322041 },
              "1618474320000": { value: 1322042 },
              "1618474380000": { value: 1322043 },
              "1618474440000": { value: 1322044 },
              "1618474500000": { value: 1322045 },
            },
            variable1323: {
              "1618471800000": { value: 1323000 },
              "1618471860000": { value: 1323001 },
              "1618471920000": { value: 1323002 },
              "1618471980000": { value: 1323003 },
              "1618472040000": { value: 1323004 },
              "1618472100000": { value: 1323005 },
              "1618472160000": { value: 1323006 },
              "1618472220000": { value: 1323007 },
              "1618472280000": { value: 1323008 },
              "1618472340000": { value: 1323009 },
              "1618472400000": { value: 1323010 },
              "1618472460000": { value: 1323011 },
              "1618472520000": { value: 1323012 },
              "1618472580000": { value: 1323013 },
              "1618472640000": { value: 1323014 },
              "1618472700000": { value: 1323015 },
              "1618472760000": { value: 1323016 },
              "1618472820000": { value: 1323017 },
              "1618472880000": { value: 1323018 },
              "1618472940000": { value: 1323019 },
              "1618473000000": { value: 1323020 },
              "1618473060000": { value: 1323021 },
              "1618473120000": { value: 1323022 },
              "1618473180000": { value: 1323023 },
              "1618473240000": { value: 1323024 },
              "1618473300000": { value: 1323025 },
              "1618473360000": { value: 1323026 },
              "1618473420000": { value: 1323027 },
              "1618473480000": { value: 1323028 },
              "1618473540000": { value: 1323029 },
              "1618473600000": { value: 1323030 },
              "1618473660000": { value: 1323031 },
              "1618473720000": { value: 1323032 },
              "1618473780000": { value: 1323033 },
              "1618473840000": { value: 1323034 },
              "1618473900000": { value: 1323035 },
              "1618473960000": { value: 1323036 },
              "1618474020000": { value: 1323037 },
              "1618474080000": { value: 1323038 },
              "1618474140000": { value: 1323039 },
              "1618474200000": { value: 1323040 },
              "1618474260000": { value: 1323041 },
              "1618474320000": { value: 1323042 },
              "1618474380000": { value: 1323043 },
              "1618474440000": { value: 1323044 },
              "1618474500000": { value: 1323045 },
            },
          },
          aspect133: {
            variable1331: {
              "1618471800000": { value: 1331000 },
              "1618471860000": { value: 1331001 },
              "1618471920000": { value: 1331002 },
              "1618471980000": { value: 1331003 },
              "1618472040000": { value: 1331004 },
              "1618472100000": { value: 1331005 },
              "1618472160000": { value: 1331006 },
              "1618472220000": { value: 1331007 },
              "1618472280000": { value: 1331008 },
              "1618472340000": { value: 1331009 },
              "1618472400000": { value: 1331010 },
              "1618472460000": { value: 1331011 },
              "1618472520000": { value: 1331012 },
              "1618472580000": { value: 1331013 },
              "1618472640000": { value: 1331014 },
              "1618472700000": { value: 1331015 },
              "1618472760000": { value: 1331016 },
              "1618472820000": { value: 1331017 },
              "1618472880000": { value: 1331018 },
              "1618472940000": { value: 1331019 },
              "1618473000000": { value: 1331020 },
              "1618473060000": { value: 1331021 },
              "1618473120000": { value: 1331022 },
              "1618473180000": { value: 1331023 },
              "1618473240000": { value: 1331024 },
              "1618473300000": { value: 1331025 },
              "1618473360000": { value: 1331026 },
              "1618473420000": { value: 1331027 },
              "1618473480000": { value: 1331028 },
              "1618473540000": { value: 1331029 },
              "1618473600000": { value: 1331030 },
              "1618473660000": { value: 1331031 },
              "1618473720000": { value: 1331032 },
              "1618473780000": { value: 1331033 },
              "1618473840000": { value: 1331034 },
              "1618473900000": { value: 1331035 },
              "1618473960000": { value: 1331036 },
              "1618474020000": { value: 1331037 },
              "1618474080000": { value: 1331038 },
              "1618474140000": { value: 1331039 },
              "1618474200000": { value: 1331040 },
              "1618474260000": { value: 1331041 },
              "1618474320000": { value: 1331042 },
              "1618474380000": { value: 1331043 },
              "1618474440000": { value: 1331044 },
              "1618474500000": { value: 1331045 },
            },
            variable1332: {
              "1618471800000": { value: 1332000 },
              "1618471860000": { value: 1332001 },
              "1618471920000": { value: 1332002 },
              "1618471980000": { value: 1332003 },
              "1618472040000": { value: 1332004 },
              "1618472100000": { value: 1332005 },
              "1618472160000": { value: 1332006 },
              "1618472220000": { value: 1332007 },
              "1618472280000": { value: 1332008 },
              "1618472340000": { value: 1332009 },
              "1618472400000": { value: 1332010 },
              "1618472460000": { value: 1332011 },
              "1618472520000": { value: 1332012 },
              "1618472580000": { value: 1332013 },
              "1618472640000": { value: 1332014 },
              "1618472700000": { value: 1332015 },
              "1618472760000": { value: 1332016 },
              "1618472820000": { value: 1332017 },
              "1618472880000": { value: 1332018 },
              "1618472940000": { value: 1332019 },
              "1618473000000": { value: 1332020 },
              "1618473060000": { value: 1332021 },
              "1618473120000": { value: 1332022 },
              "1618473180000": { value: 1332023 },
              "1618473240000": { value: 1332024 },
              "1618473300000": { value: 1332025 },
              "1618473360000": { value: 1332026 },
              "1618473420000": { value: 1332027 },
              "1618473480000": { value: 1332028 },
              "1618473540000": { value: 1332029 },
              "1618473600000": { value: 1332030 },
              "1618473660000": { value: 1332031 },
              "1618473720000": { value: 1332032 },
              "1618473780000": { value: 1332033 },
              "1618473840000": { value: 1332034 },
              "1618473900000": { value: 1332035 },
              "1618473960000": { value: 1332036 },
              "1618474020000": { value: 1332037 },
              "1618474080000": { value: 1332038 },
              "1618474140000": { value: 1332039 },
              "1618474200000": { value: 1332040 },
              "1618474260000": { value: 1332041 },
              "1618474320000": { value: 1332042 },
              "1618474380000": { value: 1332043 },
              "1618474440000": { value: 1332044 },
              "1618474500000": { value: 1332045 },
            },
            variable1333: {
              "1618471800000": { value: 1333000 },
              "1618471860000": { value: 1333001 },
              "1618471920000": { value: 1333002 },
              "1618471980000": { value: 1333003 },
              "1618472040000": { value: 1333004 },
              "1618472100000": { value: 1333005 },
              "1618472160000": { value: 1333006 },
              "1618472220000": { value: 1333007 },
              "1618472280000": { value: 1333008 },
              "1618472340000": { value: 1333009 },
              "1618472400000": { value: 1333010 },
              "1618472460000": { value: 1333011 },
              "1618472520000": { value: 1333012 },
              "1618472580000": { value: 1333013 },
              "1618472640000": { value: 1333014 },
              "1618472700000": { value: 1333015 },
              "1618472760000": { value: 1333016 },
              "1618472820000": { value: 1333017 },
              "1618472880000": { value: 1333018 },
              "1618472940000": { value: 1333019 },
              "1618473000000": { value: 1333020 },
              "1618473060000": { value: 1333021 },
              "1618473120000": { value: 1333022 },
              "1618473180000": { value: 1333023 },
              "1618473240000": { value: 1333024 },
              "1618473300000": { value: 1333025 },
              "1618473360000": { value: 1333026 },
              "1618473420000": { value: 1333027 },
              "1618473480000": { value: 1333028 },
              "1618473540000": { value: 1333029 },
              "1618473600000": { value: 1333030 },
              "1618473660000": { value: 1333031 },
              "1618473720000": { value: 1333032 },
              "1618473780000": { value: 1333033 },
              "1618473840000": { value: 1333034 },
              "1618473900000": { value: 1333035 },
              "1618473960000": { value: 1333036 },
              "1618474020000": { value: 1333037 },
              "1618474080000": { value: 1333038 },
              "1618474140000": { value: 1333039 },
              "1618474200000": { value: 1333040 },
              "1618474260000": { value: 1333041 },
              "1618474320000": { value: 1333042 },
              "1618474380000": { value: 1333043 },
              "1618474440000": { value: 1333044 },
              "1618474500000": { value: 1333045 },
            },
          },
        },
      },
      testTenant2: {
        asset21: {
          aspect211: {
            variable2111: {
              "1618471800000": { value: 2111000 },
              "1618471860000": { value: 2111001 },
              "1618471920000": { value: 2111002 },
              "1618471980000": { value: 2111003 },
              "1618472040000": { value: 2111004 },
              "1618472100000": { value: 2111005 },
              "1618472160000": { value: 2111006 },
              "1618472220000": { value: 2111007 },
              "1618472280000": { value: 2111008 },
              "1618472340000": { value: 2111009 },
              "1618472400000": { value: 2111010 },
              "1618472460000": { value: 2111011 },
              "1618472520000": { value: 2111012 },
              "1618472580000": { value: 2111013 },
              "1618472640000": { value: 2111014 },
              "1618472700000": { value: 2111015 },
              "1618472760000": { value: 2111016 },
              "1618472820000": { value: 2111017 },
              "1618472880000": { value: 2111018 },
              "1618472940000": { value: 2111019 },
              "1618473000000": { value: 2111020 },
              "1618473060000": { value: 2111021 },
              "1618473120000": { value: 2111022 },
              "1618473180000": { value: 2111023 },
              "1618473240000": { value: 2111024 },
              "1618473300000": { value: 2111025 },
              "1618473360000": { value: 2111026 },
              "1618473420000": { value: 2111027 },
              "1618473480000": { value: 2111028 },
              "1618473540000": { value: 2111029 },
              "1618473600000": { value: 2111030 },
              "1618473660000": { value: 2111031 },
              "1618473720000": { value: 2111032 },
              "1618473780000": { value: 2111033 },
              "1618473840000": { value: 2111034 },
              "1618473900000": { value: 2111035 },
              "1618473960000": { value: 2111036 },
              "1618474020000": { value: 2111037 },
              "1618474080000": { value: 2111038 },
              "1618474140000": { value: 2111039 },
              "1618474200000": { value: 2111040 },
              "1618474260000": { value: 2111041 },
              "1618474320000": { value: 2111042 },
              "1618474380000": { value: 2111043 },
              "1618474440000": { value: 2111044 },
              "1618474500000": { value: 2111045 },
            },
            variable2112: {
              "1618471800000": { value: 2112000 },
              "1618471860000": { value: 2112001 },
              "1618471920000": { value: 2112002 },
              "1618471980000": { value: 2112003 },
              "1618472040000": { value: 2112004 },
              "1618472100000": { value: 2112005 },
              "1618472160000": { value: 2112006 },
              "1618472220000": { value: 2112007 },
              "1618472280000": { value: 2112008 },
              "1618472340000": { value: 2112009 },
              "1618472400000": { value: 2112010 },
              "1618472460000": { value: 2112011 },
              "1618472520000": { value: 2112012 },
              "1618472580000": { value: 2112013 },
              "1618472640000": { value: 2112014 },
              "1618472700000": { value: 2112015 },
              "1618472760000": { value: 2112016 },
              "1618472820000": { value: 2112017 },
              "1618472880000": { value: 2112018 },
              "1618472940000": { value: 2112019 },
              "1618473000000": { value: 2112020 },
              "1618473060000": { value: 2112021 },
              "1618473120000": { value: 2112022 },
              "1618473180000": { value: 2112023 },
              "1618473240000": { value: 2112024 },
              "1618473300000": { value: 2112025 },
              "1618473360000": { value: 2112026 },
              "1618473420000": { value: 2112027 },
              "1618473480000": { value: 2112028 },
              "1618473540000": { value: 2112029 },
              "1618473600000": { value: 2112030 },
              "1618473660000": { value: 2112031 },
              "1618473720000": { value: 2112032 },
              "1618473780000": { value: 2112033 },
              "1618473840000": { value: 2112034 },
              "1618473900000": { value: 2112035 },
              "1618473960000": { value: 2112036 },
              "1618474020000": { value: 2112037 },
              "1618474080000": { value: 2112038 },
              "1618474140000": { value: 2112039 },
              "1618474200000": { value: 2112040 },
              "1618474260000": { value: 2112041 },
              "1618474320000": { value: 2112042 },
              "1618474380000": { value: 2112043 },
              "1618474440000": { value: 2112044 },
              "1618474500000": { value: 2112045 },
            },
            variable2113: {
              "1618471800000": { value: 2113000 },
              "1618471860000": { value: 2113001 },
              "1618471920000": { value: 2113002 },
              "1618471980000": { value: 2113003 },
              "1618472040000": { value: 2113004 },
              "1618472100000": { value: 2113005 },
              "1618472160000": { value: 2113006 },
              "1618472220000": { value: 2113007 },
              "1618472280000": { value: 2113008 },
              "1618472340000": { value: 2113009 },
              "1618472400000": { value: 2113010 },
              "1618472460000": { value: 2113011 },
              "1618472520000": { value: 2113012 },
              "1618472580000": { value: 2113013 },
              "1618472640000": { value: 2113014 },
              "1618472700000": { value: 2113015 },
              "1618472760000": { value: 2113016 },
              "1618472820000": { value: 2113017 },
              "1618472880000": { value: 2113018 },
              "1618472940000": { value: 2113019 },
              "1618473000000": { value: 2113020 },
              "1618473060000": { value: 2113021 },
              "1618473120000": { value: 2113022 },
              "1618473180000": { value: 2113023 },
              "1618473240000": { value: 2113024 },
              "1618473300000": { value: 2113025 },
              "1618473360000": { value: 2113026 },
              "1618473420000": { value: 2113027 },
              "1618473480000": { value: 2113028 },
              "1618473540000": { value: 2113029 },
              "1618473600000": { value: 2113030 },
              "1618473660000": { value: 2113031 },
              "1618473720000": { value: 2113032 },
              "1618473780000": { value: 2113033 },
              "1618473840000": { value: 2113034 },
              "1618473900000": { value: 2113035 },
              "1618473960000": { value: 2113036 },
              "1618474020000": { value: 2113037 },
              "1618474080000": { value: 2113038 },
              "1618474140000": { value: 2113039 },
              "1618474200000": { value: 2113040 },
              "1618474260000": { value: 2113041 },
              "1618474320000": { value: 2113042 },
              "1618474380000": { value: 2113043 },
              "1618474440000": { value: 2113044 },
              "1618474500000": { value: 2113045 },
            },
          },
          aspect212: {
            variable2121: {
              "1618471800000": { value: 2121000 },
              "1618471860000": { value: 2121001 },
              "1618471920000": { value: 2121002 },
              "1618471980000": { value: 2121003 },
              "1618472040000": { value: 2121004 },
              "1618472100000": { value: 2121005 },
              "1618472160000": { value: 2121006 },
              "1618472220000": { value: 2121007 },
              "1618472280000": { value: 2121008 },
              "1618472340000": { value: 2121009 },
              "1618472400000": { value: 2121010 },
              "1618472460000": { value: 2121011 },
              "1618472520000": { value: 2121012 },
              "1618472580000": { value: 2121013 },
              "1618472640000": { value: 2121014 },
              "1618472700000": { value: 2121015 },
              "1618472760000": { value: 2121016 },
              "1618472820000": { value: 2121017 },
              "1618472880000": { value: 2121018 },
              "1618472940000": { value: 2121019 },
              "1618473000000": { value: 2121020 },
              "1618473060000": { value: 2121021 },
              "1618473120000": { value: 2121022 },
              "1618473180000": { value: 2121023 },
              "1618473240000": { value: 2121024 },
              "1618473300000": { value: 2121025 },
              "1618473360000": { value: 2121026 },
              "1618473420000": { value: 2121027 },
              "1618473480000": { value: 2121028 },
              "1618473540000": { value: 2121029 },
              "1618473600000": { value: 2121030 },
              "1618473660000": { value: 2121031 },
              "1618473720000": { value: 2121032 },
              "1618473780000": { value: 2121033 },
              "1618473840000": { value: 2121034 },
              "1618473900000": { value: 2121035 },
              "1618473960000": { value: 2121036 },
              "1618474020000": { value: 2121037 },
              "1618474080000": { value: 2121038 },
              "1618474140000": { value: 2121039 },
              "1618474200000": { value: 2121040 },
              "1618474260000": { value: 2121041 },
              "1618474320000": { value: 2121042 },
              "1618474380000": { value: 2121043 },
              "1618474440000": { value: 2121044 },
              "1618474500000": { value: 2121045 },
            },
            variable2122: {
              "1618471800000": { value: 2122000 },
              "1618471860000": { value: 2122001 },
              "1618471920000": { value: 2122002 },
              "1618471980000": { value: 2122003 },
              "1618472040000": { value: 2122004 },
              "1618472100000": { value: 2122005 },
              "1618472160000": { value: 2122006 },
              "1618472220000": { value: 2122007 },
              "1618472280000": { value: 2122008 },
              "1618472340000": { value: 2122009 },
              "1618472400000": { value: 2122010 },
              "1618472460000": { value: 2122011 },
              "1618472520000": { value: 2122012 },
              "1618472580000": { value: 2122013 },
              "1618472640000": { value: 2122014 },
              "1618472700000": { value: 2122015 },
              "1618472760000": { value: 2122016 },
              "1618472820000": { value: 2122017 },
              "1618472880000": { value: 2122018 },
              "1618472940000": { value: 2122019 },
              "1618473000000": { value: 2122020 },
              "1618473060000": { value: 2122021 },
              "1618473120000": { value: 2122022 },
              "1618473180000": { value: 2122023 },
              "1618473240000": { value: 2122024 },
              "1618473300000": { value: 2122025 },
              "1618473360000": { value: 2122026 },
              "1618473420000": { value: 2122027 },
              "1618473480000": { value: 2122028 },
              "1618473540000": { value: 2122029 },
              "1618473600000": { value: 2122030 },
              "1618473660000": { value: 2122031 },
              "1618473720000": { value: 2122032 },
              "1618473780000": { value: 2122033 },
              "1618473840000": { value: 2122034 },
              "1618473900000": { value: 2122035 },
              "1618473960000": { value: 2122036 },
              "1618474020000": { value: 2122037 },
              "1618474080000": { value: 2122038 },
              "1618474140000": { value: 2122039 },
              "1618474200000": { value: 2122040 },
              "1618474260000": { value: 2122041 },
              "1618474320000": { value: 2122042 },
              "1618474380000": { value: 2122043 },
              "1618474440000": { value: 2122044 },
              "1618474500000": { value: 2122045 },
            },
            variable2123: {
              "1618471800000": { value: 2123000 },
              "1618471860000": { value: 2123001 },
              "1618471920000": { value: 2123002 },
              "1618471980000": { value: 2123003 },
              "1618472040000": { value: 2123004 },
              "1618472100000": { value: 2123005 },
              "1618472160000": { value: 2123006 },
              "1618472220000": { value: 2123007 },
              "1618472280000": { value: 2123008 },
              "1618472340000": { value: 2123009 },
              "1618472400000": { value: 2123010 },
              "1618472460000": { value: 2123011 },
              "1618472520000": { value: 2123012 },
              "1618472580000": { value: 2123013 },
              "1618472640000": { value: 2123014 },
              "1618472700000": { value: 2123015 },
              "1618472760000": { value: 2123016 },
              "1618472820000": { value: 2123017 },
              "1618472880000": { value: 2123018 },
              "1618472940000": { value: 2123019 },
              "1618473000000": { value: 2123020 },
              "1618473060000": { value: 2123021 },
              "1618473120000": { value: 2123022 },
              "1618473180000": { value: 2123023 },
              "1618473240000": { value: 2123024 },
              "1618473300000": { value: 2123025 },
              "1618473360000": { value: 2123026 },
              "1618473420000": { value: 2123027 },
              "1618473480000": { value: 2123028 },
              "1618473540000": { value: 2123029 },
              "1618473600000": { value: 2123030 },
              "1618473660000": { value: 2123031 },
              "1618473720000": { value: 2123032 },
              "1618473780000": { value: 2123033 },
              "1618473840000": { value: 2123034 },
              "1618473900000": { value: 2123035 },
              "1618473960000": { value: 2123036 },
              "1618474020000": { value: 2123037 },
              "1618474080000": { value: 2123038 },
              "1618474140000": { value: 2123039 },
              "1618474200000": { value: 2123040 },
              "1618474260000": { value: 2123041 },
              "1618474320000": { value: 2123042 },
              "1618474380000": { value: 2123043 },
              "1618474440000": { value: 2123044 },
              "1618474500000": { value: 2123045 },
            },
          },
          aspect213: {
            variable2131: {
              "1618471800000": { value: 2131000 },
              "1618471860000": { value: 2131001 },
              "1618471920000": { value: 2131002 },
              "1618471980000": { value: 2131003 },
              "1618472040000": { value: 2131004 },
              "1618472100000": { value: 2131005 },
              "1618472160000": { value: 2131006 },
              "1618472220000": { value: 2131007 },
              "1618472280000": { value: 2131008 },
              "1618472340000": { value: 2131009 },
              "1618472400000": { value: 2131010 },
              "1618472460000": { value: 2131011 },
              "1618472520000": { value: 2131012 },
              "1618472580000": { value: 2131013 },
              "1618472640000": { value: 2131014 },
              "1618472700000": { value: 2131015 },
              "1618472760000": { value: 2131016 },
              "1618472820000": { value: 2131017 },
              "1618472880000": { value: 2131018 },
              "1618472940000": { value: 2131019 },
              "1618473000000": { value: 2131020 },
              "1618473060000": { value: 2131021 },
              "1618473120000": { value: 2131022 },
              "1618473180000": { value: 2131023 },
              "1618473240000": { value: 2131024 },
              "1618473300000": { value: 2131025 },
              "1618473360000": { value: 2131026 },
              "1618473420000": { value: 2131027 },
              "1618473480000": { value: 2131028 },
              "1618473540000": { value: 2131029 },
              "1618473600000": { value: 2131030 },
              "1618473660000": { value: 2131031 },
              "1618473720000": { value: 2131032 },
              "1618473780000": { value: 2131033 },
              "1618473840000": { value: 2131034 },
              "1618473900000": { value: 2131035 },
              "1618473960000": { value: 2131036 },
              "1618474020000": { value: 2131037 },
              "1618474080000": { value: 2131038 },
              "1618474140000": { value: 2131039 },
              "1618474200000": { value: 2131040 },
              "1618474260000": { value: 2131041 },
              "1618474320000": { value: 2131042 },
              "1618474380000": { value: 2131043 },
              "1618474440000": { value: 2131044 },
              "1618474500000": { value: 2131045 },
            },
            variable2132: {
              "1618471800000": { value: 2132000 },
              "1618471860000": { value: 2132001 },
              "1618471920000": { value: 2132002 },
              "1618471980000": { value: 2132003 },
              "1618472040000": { value: 2132004 },
              "1618472100000": { value: 2132005 },
              "1618472160000": { value: 2132006 },
              "1618472220000": { value: 2132007 },
              "1618472280000": { value: 2132008 },
              "1618472340000": { value: 2132009 },
              "1618472400000": { value: 2132010 },
              "1618472460000": { value: 2132011 },
              "1618472520000": { value: 2132012 },
              "1618472580000": { value: 2132013 },
              "1618472640000": { value: 2132014 },
              "1618472700000": { value: 2132015 },
              "1618472760000": { value: 2132016 },
              "1618472820000": { value: 2132017 },
              "1618472880000": { value: 2132018 },
              "1618472940000": { value: 2132019 },
              "1618473000000": { value: 2132020 },
              "1618473060000": { value: 2132021 },
              "1618473120000": { value: 2132022 },
              "1618473180000": { value: 2132023 },
              "1618473240000": { value: 2132024 },
              "1618473300000": { value: 2132025 },
              "1618473360000": { value: 2132026 },
              "1618473420000": { value: 2132027 },
              "1618473480000": { value: 2132028 },
              "1618473540000": { value: 2132029 },
              "1618473600000": { value: 2132030 },
              "1618473660000": { value: 2132031 },
              "1618473720000": { value: 2132032 },
              "1618473780000": { value: 2132033 },
              "1618473840000": { value: 2132034 },
              "1618473900000": { value: 2132035 },
              "1618473960000": { value: 2132036 },
              "1618474020000": { value: 2132037 },
              "1618474080000": { value: 2132038 },
              "1618474140000": { value: 2132039 },
              "1618474200000": { value: 2132040 },
              "1618474260000": { value: 2132041 },
              "1618474320000": { value: 2132042 },
              "1618474380000": { value: 2132043 },
              "1618474440000": { value: 2132044 },
              "1618474500000": { value: 2132045 },
            },
            variable2133: {
              "1618471800000": { value: 2133000 },
              "1618471860000": { value: 2133001 },
              "1618471920000": { value: 2133002 },
              "1618471980000": { value: 2133003 },
              "1618472040000": { value: 2133004 },
              "1618472100000": { value: 2133005 },
              "1618472160000": { value: 2133006 },
              "1618472220000": { value: 2133007 },
              "1618472280000": { value: 2133008 },
              "1618472340000": { value: 2133009 },
              "1618472400000": { value: 2133010 },
              "1618472460000": { value: 2133011 },
              "1618472520000": { value: 2133012 },
              "1618472580000": { value: 2133013 },
              "1618472640000": { value: 2133014 },
              "1618472700000": { value: 2133015 },
              "1618472760000": { value: 2133016 },
              "1618472820000": { value: 2133017 },
              "1618472880000": { value: 2133018 },
              "1618472940000": { value: 2133019 },
              "1618473000000": { value: 2133020 },
              "1618473060000": { value: 2133021 },
              "1618473120000": { value: 2133022 },
              "1618473180000": { value: 2133023 },
              "1618473240000": { value: 2133024 },
              "1618473300000": { value: 2133025 },
              "1618473360000": { value: 2133026 },
              "1618473420000": { value: 2133027 },
              "1618473480000": { value: 2133028 },
              "1618473540000": { value: 2133029 },
              "1618473600000": { value: 2133030 },
              "1618473660000": { value: 2133031 },
              "1618473720000": { value: 2133032 },
              "1618473780000": { value: 2133033 },
              "1618473840000": { value: 2133034 },
              "1618473900000": { value: 2133035 },
              "1618473960000": { value: 2133036 },
              "1618474020000": { value: 2133037 },
              "1618474080000": { value: 2133038 },
              "1618474140000": { value: 2133039 },
              "1618474200000": { value: 2133040 },
              "1618474260000": { value: 2133041 },
              "1618474320000": { value: 2133042 },
              "1618474380000": { value: 2133043 },
              "1618474440000": { value: 2133044 },
              "1618474500000": { value: 2133045 },
            },
          },
        },
        asset22: {
          aspect221: {
            variable2211: {
              "1618471800000": { value: 2211000 },
              "1618471860000": { value: 2211001 },
              "1618471920000": { value: 2211002 },
              "1618471980000": { value: 2211003 },
              "1618472040000": { value: 2211004 },
              "1618472100000": { value: 2211005 },
              "1618472160000": { value: 2211006 },
              "1618472220000": { value: 2211007 },
              "1618472280000": { value: 2211008 },
              "1618472340000": { value: 2211009 },
              "1618472400000": { value: 2211010 },
              "1618472460000": { value: 2211011 },
              "1618472520000": { value: 2211012 },
              "1618472580000": { value: 2211013 },
              "1618472640000": { value: 2211014 },
              "1618472700000": { value: 2211015 },
              "1618472760000": { value: 2211016 },
              "1618472820000": { value: 2211017 },
              "1618472880000": { value: 2211018 },
              "1618472940000": { value: 2211019 },
              "1618473000000": { value: 2211020 },
              "1618473060000": { value: 2211021 },
              "1618473120000": { value: 2211022 },
              "1618473180000": { value: 2211023 },
              "1618473240000": { value: 2211024 },
              "1618473300000": { value: 2211025 },
              "1618473360000": { value: 2211026 },
              "1618473420000": { value: 2211027 },
              "1618473480000": { value: 2211028 },
              "1618473540000": { value: 2211029 },
              "1618473600000": { value: 2211030 },
              "1618473660000": { value: 2211031 },
              "1618473720000": { value: 2211032 },
              "1618473780000": { value: 2211033 },
              "1618473840000": { value: 2211034 },
              "1618473900000": { value: 2211035 },
              "1618473960000": { value: 2211036 },
              "1618474020000": { value: 2211037 },
              "1618474080000": { value: 2211038 },
              "1618474140000": { value: 2211039 },
              "1618474200000": { value: 2211040 },
              "1618474260000": { value: 2211041 },
              "1618474320000": { value: 2211042 },
              "1618474380000": { value: 2211043 },
              "1618474440000": { value: 2211044 },
              "1618474500000": { value: 2211045 },
            },
            variable2212: {
              "1618471800000": { value: 2212000 },
              "1618471860000": { value: 2212001 },
              "1618471920000": { value: 2212002 },
              "1618471980000": { value: 2212003 },
              "1618472040000": { value: 2212004 },
              "1618472100000": { value: 2212005 },
              "1618472160000": { value: 2212006 },
              "1618472220000": { value: 2212007 },
              "1618472280000": { value: 2212008 },
              "1618472340000": { value: 2212009 },
              "1618472400000": { value: 2212010 },
              "1618472460000": { value: 2212011 },
              "1618472520000": { value: 2212012 },
              "1618472580000": { value: 2212013 },
              "1618472640000": { value: 2212014 },
              "1618472700000": { value: 2212015 },
              "1618472760000": { value: 2212016 },
              "1618472820000": { value: 2212017 },
              "1618472880000": { value: 2212018 },
              "1618472940000": { value: 2212019 },
              "1618473000000": { value: 2212020 },
              "1618473060000": { value: 2212021 },
              "1618473120000": { value: 2212022 },
              "1618473180000": { value: 2212023 },
              "1618473240000": { value: 2212024 },
              "1618473300000": { value: 2212025 },
              "1618473360000": { value: 2212026 },
              "1618473420000": { value: 2212027 },
              "1618473480000": { value: 2212028 },
              "1618473540000": { value: 2212029 },
              "1618473600000": { value: 2212030 },
              "1618473660000": { value: 2212031 },
              "1618473720000": { value: 2212032 },
              "1618473780000": { value: 2212033 },
              "1618473840000": { value: 2212034 },
              "1618473900000": { value: 2212035 },
              "1618473960000": { value: 2212036 },
              "1618474020000": { value: 2212037 },
              "1618474080000": { value: 2212038 },
              "1618474140000": { value: 2212039 },
              "1618474200000": { value: 2212040 },
              "1618474260000": { value: 2212041 },
              "1618474320000": { value: 2212042 },
              "1618474380000": { value: 2212043 },
              "1618474440000": { value: 2212044 },
              "1618474500000": { value: 2212045 },
            },
            variable2213: {
              "1618471800000": { value: 2213000 },
              "1618471860000": { value: 2213001 },
              "1618471920000": { value: 2213002 },
              "1618471980000": { value: 2213003 },
              "1618472040000": { value: 2213004 },
              "1618472100000": { value: 2213005 },
              "1618472160000": { value: 2213006 },
              "1618472220000": { value: 2213007 },
              "1618472280000": { value: 2213008 },
              "1618472340000": { value: 2213009 },
              "1618472400000": { value: 2213010 },
              "1618472460000": { value: 2213011 },
              "1618472520000": { value: 2213012 },
              "1618472580000": { value: 2213013 },
              "1618472640000": { value: 2213014 },
              "1618472700000": { value: 2213015 },
              "1618472760000": { value: 2213016 },
              "1618472820000": { value: 2213017 },
              "1618472880000": { value: 2213018 },
              "1618472940000": { value: 2213019 },
              "1618473000000": { value: 2213020 },
              "1618473060000": { value: 2213021 },
              "1618473120000": { value: 2213022 },
              "1618473180000": { value: 2213023 },
              "1618473240000": { value: 2213024 },
              "1618473300000": { value: 2213025 },
              "1618473360000": { value: 2213026 },
              "1618473420000": { value: 2213027 },
              "1618473480000": { value: 2213028 },
              "1618473540000": { value: 2213029 },
              "1618473600000": { value: 2213030 },
              "1618473660000": { value: 2213031 },
              "1618473720000": { value: 2213032 },
              "1618473780000": { value: 2213033 },
              "1618473840000": { value: 2213034 },
              "1618473900000": { value: 2213035 },
              "1618473960000": { value: 2213036 },
              "1618474020000": { value: 2213037 },
              "1618474080000": { value: 2213038 },
              "1618474140000": { value: 2213039 },
              "1618474200000": { value: 2213040 },
              "1618474260000": { value: 2213041 },
              "1618474320000": { value: 2213042 },
              "1618474380000": { value: 2213043 },
              "1618474440000": { value: 2213044 },
              "1618474500000": { value: 2213045 },
            },
          },
          aspect222: {
            variable2221: {
              "1618471800000": { value: 2221000 },
              "1618471860000": { value: 2221001 },
              "1618471920000": { value: 2221002 },
              "1618471980000": { value: 2221003 },
              "1618472040000": { value: 2221004 },
              "1618472100000": { value: 2221005 },
              "1618472160000": { value: 2221006 },
              "1618472220000": { value: 2221007 },
              "1618472280000": { value: 2221008 },
              "1618472340000": { value: 2221009 },
              "1618472400000": { value: 2221010 },
              "1618472460000": { value: 2221011 },
              "1618472520000": { value: 2221012 },
              "1618472580000": { value: 2221013 },
              "1618472640000": { value: 2221014 },
              "1618472700000": { value: 2221015 },
              "1618472760000": { value: 2221016 },
              "1618472820000": { value: 2221017 },
              "1618472880000": { value: 2221018 },
              "1618472940000": { value: 2221019 },
              "1618473000000": { value: 2221020 },
              "1618473060000": { value: 2221021 },
              "1618473120000": { value: 2221022 },
              "1618473180000": { value: 2221023 },
              "1618473240000": { value: 2221024 },
              "1618473300000": { value: 2221025 },
              "1618473360000": { value: 2221026 },
              "1618473420000": { value: 2221027 },
              "1618473480000": { value: 2221028 },
              "1618473540000": { value: 2221029 },
              "1618473600000": { value: 2221030 },
              "1618473660000": { value: 2221031 },
              "1618473720000": { value: 2221032 },
              "1618473780000": { value: 2221033 },
              "1618473840000": { value: 2221034 },
              "1618473900000": { value: 2221035 },
              "1618473960000": { value: 2221036 },
              "1618474020000": { value: 2221037 },
              "1618474080000": { value: 2221038 },
              "1618474140000": { value: 2221039 },
              "1618474200000": { value: 2221040 },
              "1618474260000": { value: 2221041 },
              "1618474320000": { value: 2221042 },
              "1618474380000": { value: 2221043 },
              "1618474440000": { value: 2221044 },
              "1618474500000": { value: 2221045 },
            },
            variable2222: {
              "1618471800000": { value: 2222000 },
              "1618471860000": { value: 2222001 },
              "1618471920000": { value: 2222002 },
              "1618471980000": { value: 2222003 },
              "1618472040000": { value: 2222004 },
              "1618472100000": { value: 2222005 },
              "1618472160000": { value: 2222006 },
              "1618472220000": { value: 2222007 },
              "1618472280000": { value: 2222008 },
              "1618472340000": { value: 2222009 },
              "1618472400000": { value: 2222010 },
              "1618472460000": { value: 2222011 },
              "1618472520000": { value: 2222012 },
              "1618472580000": { value: 2222013 },
              "1618472640000": { value: 2222014 },
              "1618472700000": { value: 2222015 },
              "1618472760000": { value: 2222016 },
              "1618472820000": { value: 2222017 },
              "1618472880000": { value: 2222018 },
              "1618472940000": { value: 2222019 },
              "1618473000000": { value: 2222020 },
              "1618473060000": { value: 2222021 },
              "1618473120000": { value: 2222022 },
              "1618473180000": { value: 2222023 },
              "1618473240000": { value: 2222024 },
              "1618473300000": { value: 2222025 },
              "1618473360000": { value: 2222026 },
              "1618473420000": { value: 2222027 },
              "1618473480000": { value: 2222028 },
              "1618473540000": { value: 2222029 },
              "1618473600000": { value: 2222030 },
              "1618473660000": { value: 2222031 },
              "1618473720000": { value: 2222032 },
              "1618473780000": { value: 2222033 },
              "1618473840000": { value: 2222034 },
              "1618473900000": { value: 2222035 },
              "1618473960000": { value: 2222036 },
              "1618474020000": { value: 2222037 },
              "1618474080000": { value: 2222038 },
              "1618474140000": { value: 2222039 },
              "1618474200000": { value: 2222040 },
              "1618474260000": { value: 2222041 },
              "1618474320000": { value: 2222042 },
              "1618474380000": { value: 2222043 },
              "1618474440000": { value: 2222044 },
              "1618474500000": { value: 2222045 },
            },
            variable2223: {
              "1618471800000": { value: 2223000 },
              "1618471860000": { value: 2223001 },
              "1618471920000": { value: 2223002 },
              "1618471980000": { value: 2223003 },
              "1618472040000": { value: 2223004 },
              "1618472100000": { value: 2223005 },
              "1618472160000": { value: 2223006 },
              "1618472220000": { value: 2223007 },
              "1618472280000": { value: 2223008 },
              "1618472340000": { value: 2223009 },
              "1618472400000": { value: 2223010 },
              "1618472460000": { value: 2223011 },
              "1618472520000": { value: 2223012 },
              "1618472580000": { value: 2223013 },
              "1618472640000": { value: 2223014 },
              "1618472700000": { value: 2223015 },
              "1618472760000": { value: 2223016 },
              "1618472820000": { value: 2223017 },
              "1618472880000": { value: 2223018 },
              "1618472940000": { value: 2223019 },
              "1618473000000": { value: 2223020 },
              "1618473060000": { value: 2223021 },
              "1618473120000": { value: 2223022 },
              "1618473180000": { value: 2223023 },
              "1618473240000": { value: 2223024 },
              "1618473300000": { value: 2223025 },
              "1618473360000": { value: 2223026 },
              "1618473420000": { value: 2223027 },
              "1618473480000": { value: 2223028 },
              "1618473540000": { value: 2223029 },
              "1618473600000": { value: 2223030 },
              "1618473660000": { value: 2223031 },
              "1618473720000": { value: 2223032 },
              "1618473780000": { value: 2223033 },
              "1618473840000": { value: 2223034 },
              "1618473900000": { value: 2223035 },
              "1618473960000": { value: 2223036 },
              "1618474020000": { value: 2223037 },
              "1618474080000": { value: 2223038 },
              "1618474140000": { value: 2223039 },
              "1618474200000": { value: 2223040 },
              "1618474260000": { value: 2223041 },
              "1618474320000": { value: 2223042 },
              "1618474380000": { value: 2223043 },
              "1618474440000": { value: 2223044 },
              "1618474500000": { value: 2223045 },
            },
          },
          aspect223: {
            variable2231: {
              "1618471800000": { value: 2231000 },
              "1618471860000": { value: 2231001 },
              "1618471920000": { value: 2231002 },
              "1618471980000": { value: 2231003 },
              "1618472040000": { value: 2231004 },
              "1618472100000": { value: 2231005 },
              "1618472160000": { value: 2231006 },
              "1618472220000": { value: 2231007 },
              "1618472280000": { value: 2231008 },
              "1618472340000": { value: 2231009 },
              "1618472400000": { value: 2231010 },
              "1618472460000": { value: 2231011 },
              "1618472520000": { value: 2231012 },
              "1618472580000": { value: 2231013 },
              "1618472640000": { value: 2231014 },
              "1618472700000": { value: 2231015 },
              "1618472760000": { value: 2231016 },
              "1618472820000": { value: 2231017 },
              "1618472880000": { value: 2231018 },
              "1618472940000": { value: 2231019 },
              "1618473000000": { value: 2231020 },
              "1618473060000": { value: 2231021 },
              "1618473120000": { value: 2231022 },
              "1618473180000": { value: 2231023 },
              "1618473240000": { value: 2231024 },
              "1618473300000": { value: 2231025 },
              "1618473360000": { value: 2231026 },
              "1618473420000": { value: 2231027 },
              "1618473480000": { value: 2231028 },
              "1618473540000": { value: 2231029 },
              "1618473600000": { value: 2231030 },
              "1618473660000": { value: 2231031 },
              "1618473720000": { value: 2231032 },
              "1618473780000": { value: 2231033 },
              "1618473840000": { value: 2231034 },
              "1618473900000": { value: 2231035 },
              "1618473960000": { value: 2231036 },
              "1618474020000": { value: 2231037 },
              "1618474080000": { value: 2231038 },
              "1618474140000": { value: 2231039 },
              "1618474200000": { value: 2231040 },
              "1618474260000": { value: 2231041 },
              "1618474320000": { value: 2231042 },
              "1618474380000": { value: 2231043 },
              "1618474440000": { value: 2231044 },
              "1618474500000": { value: 2231045 },
            },
            variable2232: {
              "1618471800000": { value: 2232000 },
              "1618471860000": { value: 2232001 },
              "1618471920000": { value: 2232002 },
              "1618471980000": { value: 2232003 },
              "1618472040000": { value: 2232004 },
              "1618472100000": { value: 2232005 },
              "1618472160000": { value: 2232006 },
              "1618472220000": { value: 2232007 },
              "1618472280000": { value: 2232008 },
              "1618472340000": { value: 2232009 },
              "1618472400000": { value: 2232010 },
              "1618472460000": { value: 2232011 },
              "1618472520000": { value: 2232012 },
              "1618472580000": { value: 2232013 },
              "1618472640000": { value: 2232014 },
              "1618472700000": { value: 2232015 },
              "1618472760000": { value: 2232016 },
              "1618472820000": { value: 2232017 },
              "1618472880000": { value: 2232018 },
              "1618472940000": { value: 2232019 },
              "1618473000000": { value: 2232020 },
              "1618473060000": { value: 2232021 },
              "1618473120000": { value: 2232022 },
              "1618473180000": { value: 2232023 },
              "1618473240000": { value: 2232024 },
              "1618473300000": { value: 2232025 },
              "1618473360000": { value: 2232026 },
              "1618473420000": { value: 2232027 },
              "1618473480000": { value: 2232028 },
              "1618473540000": { value: 2232029 },
              "1618473600000": { value: 2232030 },
              "1618473660000": { value: 2232031 },
              "1618473720000": { value: 2232032 },
              "1618473780000": { value: 2232033 },
              "1618473840000": { value: 2232034 },
              "1618473900000": { value: 2232035 },
              "1618473960000": { value: 2232036 },
              "1618474020000": { value: 2232037 },
              "1618474080000": { value: 2232038 },
              "1618474140000": { value: 2232039 },
              "1618474200000": { value: 2232040 },
              "1618474260000": { value: 2232041 },
              "1618474320000": { value: 2232042 },
              "1618474380000": { value: 2232043 },
              "1618474440000": { value: 2232044 },
              "1618474500000": { value: 2232045 },
            },
            variable2233: {
              "1618471800000": { value: 2233000 },
              "1618471860000": { value: 2233001 },
              "1618471920000": { value: 2233002 },
              "1618471980000": { value: 2233003 },
              "1618472040000": { value: 2233004 },
              "1618472100000": { value: 2233005 },
              "1618472160000": { value: 2233006 },
              "1618472220000": { value: 2233007 },
              "1618472280000": { value: 2233008 },
              "1618472340000": { value: 2233009 },
              "1618472400000": { value: 2233010 },
              "1618472460000": { value: 2233011 },
              "1618472520000": { value: 2233012 },
              "1618472580000": { value: 2233013 },
              "1618472640000": { value: 2233014 },
              "1618472700000": { value: 2233015 },
              "1618472760000": { value: 2233016 },
              "1618472820000": { value: 2233017 },
              "1618472880000": { value: 2233018 },
              "1618472940000": { value: 2233019 },
              "1618473000000": { value: 2233020 },
              "1618473060000": { value: 2233021 },
              "1618473120000": { value: 2233022 },
              "1618473180000": { value: 2233023 },
              "1618473240000": { value: 2233024 },
              "1618473300000": { value: 2233025 },
              "1618473360000": { value: 2233026 },
              "1618473420000": { value: 2233027 },
              "1618473480000": { value: 2233028 },
              "1618473540000": { value: 2233029 },
              "1618473600000": { value: 2233030 },
              "1618473660000": { value: 2233031 },
              "1618473720000": { value: 2233032 },
              "1618473780000": { value: 2233033 },
              "1618473840000": { value: 2233034 },
              "1618473900000": { value: 2233035 },
              "1618473960000": { value: 2233036 },
              "1618474020000": { value: 2233037 },
              "1618474080000": { value: 2233038 },
              "1618474140000": { value: 2233039 },
              "1618474200000": { value: 2233040 },
              "1618474260000": { value: 2233041 },
              "1618474320000": { value: 2233042 },
              "1618474380000": { value: 2233043 },
              "1618474440000": { value: 2233044 },
              "1618474500000": { value: 2233045 },
            },
          },
        },
        asset23: {
          aspect231: {
            variable2311: {
              "1618471800000": { value: 2311000 },
              "1618471860000": { value: 2311001 },
              "1618471920000": { value: 2311002 },
              "1618471980000": { value: 2311003 },
              "1618472040000": { value: 2311004 },
              "1618472100000": { value: 2311005 },
              "1618472160000": { value: 2311006 },
              "1618472220000": { value: 2311007 },
              "1618472280000": { value: 2311008 },
              "1618472340000": { value: 2311009 },
              "1618472400000": { value: 2311010 },
              "1618472460000": { value: 2311011 },
              "1618472520000": { value: 2311012 },
              "1618472580000": { value: 2311013 },
              "1618472640000": { value: 2311014 },
              "1618472700000": { value: 2311015 },
              "1618472760000": { value: 2311016 },
              "1618472820000": { value: 2311017 },
              "1618472880000": { value: 2311018 },
              "1618472940000": { value: 2311019 },
              "1618473000000": { value: 2311020 },
              "1618473060000": { value: 2311021 },
              "1618473120000": { value: 2311022 },
              "1618473180000": { value: 2311023 },
              "1618473240000": { value: 2311024 },
              "1618473300000": { value: 2311025 },
              "1618473360000": { value: 2311026 },
              "1618473420000": { value: 2311027 },
              "1618473480000": { value: 2311028 },
              "1618473540000": { value: 2311029 },
              "1618473600000": { value: 2311030 },
              "1618473660000": { value: 2311031 },
              "1618473720000": { value: 2311032 },
              "1618473780000": { value: 2311033 },
              "1618473840000": { value: 2311034 },
              "1618473900000": { value: 2311035 },
              "1618473960000": { value: 2311036 },
              "1618474020000": { value: 2311037 },
              "1618474080000": { value: 2311038 },
              "1618474140000": { value: 2311039 },
              "1618474200000": { value: 2311040 },
              "1618474260000": { value: 2311041 },
              "1618474320000": { value: 2311042 },
              "1618474380000": { value: 2311043 },
              "1618474440000": { value: 2311044 },
              "1618474500000": { value: 2311045 },
            },
            variable2312: {
              "1618471800000": { value: 2312000 },
              "1618471860000": { value: 2312001 },
              "1618471920000": { value: 2312002 },
              "1618471980000": { value: 2312003 },
              "1618472040000": { value: 2312004 },
              "1618472100000": { value: 2312005 },
              "1618472160000": { value: 2312006 },
              "1618472220000": { value: 2312007 },
              "1618472280000": { value: 2312008 },
              "1618472340000": { value: 2312009 },
              "1618472400000": { value: 2312010 },
              "1618472460000": { value: 2312011 },
              "1618472520000": { value: 2312012 },
              "1618472580000": { value: 2312013 },
              "1618472640000": { value: 2312014 },
              "1618472700000": { value: 2312015 },
              "1618472760000": { value: 2312016 },
              "1618472820000": { value: 2312017 },
              "1618472880000": { value: 2312018 },
              "1618472940000": { value: 2312019 },
              "1618473000000": { value: 2312020 },
              "1618473060000": { value: 2312021 },
              "1618473120000": { value: 2312022 },
              "1618473180000": { value: 2312023 },
              "1618473240000": { value: 2312024 },
              "1618473300000": { value: 2312025 },
              "1618473360000": { value: 2312026 },
              "1618473420000": { value: 2312027 },
              "1618473480000": { value: 2312028 },
              "1618473540000": { value: 2312029 },
              "1618473600000": { value: 2312030 },
              "1618473660000": { value: 2312031 },
              "1618473720000": { value: 2312032 },
              "1618473780000": { value: 2312033 },
              "1618473840000": { value: 2312034 },
              "1618473900000": { value: 2312035 },
              "1618473960000": { value: 2312036 },
              "1618474020000": { value: 2312037 },
              "1618474080000": { value: 2312038 },
              "1618474140000": { value: 2312039 },
              "1618474200000": { value: 2312040 },
              "1618474260000": { value: 2312041 },
              "1618474320000": { value: 2312042 },
              "1618474380000": { value: 2312043 },
              "1618474440000": { value: 2312044 },
              "1618474500000": { value: 2312045 },
            },
            variable2313: {
              "1618471800000": { value: 2313000 },
              "1618471860000": { value: 2313001 },
              "1618471920000": { value: 2313002 },
              "1618471980000": { value: 2313003 },
              "1618472040000": { value: 2313004 },
              "1618472100000": { value: 2313005 },
              "1618472160000": { value: 2313006 },
              "1618472220000": { value: 2313007 },
              "1618472280000": { value: 2313008 },
              "1618472340000": { value: 2313009 },
              "1618472400000": { value: 2313010 },
              "1618472460000": { value: 2313011 },
              "1618472520000": { value: 2313012 },
              "1618472580000": { value: 2313013 },
              "1618472640000": { value: 2313014 },
              "1618472700000": { value: 2313015 },
              "1618472760000": { value: 2313016 },
              "1618472820000": { value: 2313017 },
              "1618472880000": { value: 2313018 },
              "1618472940000": { value: 2313019 },
              "1618473000000": { value: 2313020 },
              "1618473060000": { value: 2313021 },
              "1618473120000": { value: 2313022 },
              "1618473180000": { value: 2313023 },
              "1618473240000": { value: 2313024 },
              "1618473300000": { value: 2313025 },
              "1618473360000": { value: 2313026 },
              "1618473420000": { value: 2313027 },
              "1618473480000": { value: 2313028 },
              "1618473540000": { value: 2313029 },
              "1618473600000": { value: 2313030 },
              "1618473660000": { value: 2313031 },
              "1618473720000": { value: 2313032 },
              "1618473780000": { value: 2313033 },
              "1618473840000": { value: 2313034 },
              "1618473900000": { value: 2313035 },
              "1618473960000": { value: 2313036 },
              "1618474020000": { value: 2313037 },
              "1618474080000": { value: 2313038 },
              "1618474140000": { value: 2313039 },
              "1618474200000": { value: 2313040 },
              "1618474260000": { value: 2313041 },
              "1618474320000": { value: 2313042 },
              "1618474380000": { value: 2313043 },
              "1618474440000": { value: 2313044 },
              "1618474500000": { value: 2313045 },
            },
          },
          aspect232: {
            variable2321: {
              "1618471800000": { value: 2321000 },
              "1618471860000": { value: 2321001 },
              "1618471920000": { value: 2321002 },
              "1618471980000": { value: 2321003 },
              "1618472040000": { value: 2321004 },
              "1618472100000": { value: 2321005 },
              "1618472160000": { value: 2321006 },
              "1618472220000": { value: 2321007 },
              "1618472280000": { value: 2321008 },
              "1618472340000": { value: 2321009 },
              "1618472400000": { value: 2321010 },
              "1618472460000": { value: 2321011 },
              "1618472520000": { value: 2321012 },
              "1618472580000": { value: 2321013 },
              "1618472640000": { value: 2321014 },
              "1618472700000": { value: 2321015 },
              "1618472760000": { value: 2321016 },
              "1618472820000": { value: 2321017 },
              "1618472880000": { value: 2321018 },
              "1618472940000": { value: 2321019 },
              "1618473000000": { value: 2321020 },
              "1618473060000": { value: 2321021 },
              "1618473120000": { value: 2321022 },
              "1618473180000": { value: 2321023 },
              "1618473240000": { value: 2321024 },
              "1618473300000": { value: 2321025 },
              "1618473360000": { value: 2321026 },
              "1618473420000": { value: 2321027 },
              "1618473480000": { value: 2321028 },
              "1618473540000": { value: 2321029 },
              "1618473600000": { value: 2321030 },
              "1618473660000": { value: 2321031 },
              "1618473720000": { value: 2321032 },
              "1618473780000": { value: 2321033 },
              "1618473840000": { value: 2321034 },
              "1618473900000": { value: 2321035 },
              "1618473960000": { value: 2321036 },
              "1618474020000": { value: 2321037 },
              "1618474080000": { value: 2321038 },
              "1618474140000": { value: 2321039 },
              "1618474200000": { value: 2321040 },
              "1618474260000": { value: 2321041 },
              "1618474320000": { value: 2321042 },
              "1618474380000": { value: 2321043 },
              "1618474440000": { value: 2321044 },
              "1618474500000": { value: 2321045 },
            },
            variable2322: {
              "1618471800000": { value: 2322000 },
              "1618471860000": { value: 2322001 },
              "1618471920000": { value: 2322002 },
              "1618471980000": { value: 2322003 },
              "1618472040000": { value: 2322004 },
              "1618472100000": { value: 2322005 },
              "1618472160000": { value: 2322006 },
              "1618472220000": { value: 2322007 },
              "1618472280000": { value: 2322008 },
              "1618472340000": { value: 2322009 },
              "1618472400000": { value: 2322010 },
              "1618472460000": { value: 2322011 },
              "1618472520000": { value: 2322012 },
              "1618472580000": { value: 2322013 },
              "1618472640000": { value: 2322014 },
              "1618472700000": { value: 2322015 },
              "1618472760000": { value: 2322016 },
              "1618472820000": { value: 2322017 },
              "1618472880000": { value: 2322018 },
              "1618472940000": { value: 2322019 },
              "1618473000000": { value: 2322020 },
              "1618473060000": { value: 2322021 },
              "1618473120000": { value: 2322022 },
              "1618473180000": { value: 2322023 },
              "1618473240000": { value: 2322024 },
              "1618473300000": { value: 2322025 },
              "1618473360000": { value: 2322026 },
              "1618473420000": { value: 2322027 },
              "1618473480000": { value: 2322028 },
              "1618473540000": { value: 2322029 },
              "1618473600000": { value: 2322030 },
              "1618473660000": { value: 2322031 },
              "1618473720000": { value: 2322032 },
              "1618473780000": { value: 2322033 },
              "1618473840000": { value: 2322034 },
              "1618473900000": { value: 2322035 },
              "1618473960000": { value: 2322036 },
              "1618474020000": { value: 2322037 },
              "1618474080000": { value: 2322038 },
              "1618474140000": { value: 2322039 },
              "1618474200000": { value: 2322040 },
              "1618474260000": { value: 2322041 },
              "1618474320000": { value: 2322042 },
              "1618474380000": { value: 2322043 },
              "1618474440000": { value: 2322044 },
              "1618474500000": { value: 2322045 },
            },
            variable2323: {
              "1618471800000": { value: 2323000 },
              "1618471860000": { value: 2323001 },
              "1618471920000": { value: 2323002 },
              "1618471980000": { value: 2323003 },
              "1618472040000": { value: 2323004 },
              "1618472100000": { value: 2323005 },
              "1618472160000": { value: 2323006 },
              "1618472220000": { value: 2323007 },
              "1618472280000": { value: 2323008 },
              "1618472340000": { value: 2323009 },
              "1618472400000": { value: 2323010 },
              "1618472460000": { value: 2323011 },
              "1618472520000": { value: 2323012 },
              "1618472580000": { value: 2323013 },
              "1618472640000": { value: 2323014 },
              "1618472700000": { value: 2323015 },
              "1618472760000": { value: 2323016 },
              "1618472820000": { value: 2323017 },
              "1618472880000": { value: 2323018 },
              "1618472940000": { value: 2323019 },
              "1618473000000": { value: 2323020 },
              "1618473060000": { value: 2323021 },
              "1618473120000": { value: 2323022 },
              "1618473180000": { value: 2323023 },
              "1618473240000": { value: 2323024 },
              "1618473300000": { value: 2323025 },
              "1618473360000": { value: 2323026 },
              "1618473420000": { value: 2323027 },
              "1618473480000": { value: 2323028 },
              "1618473540000": { value: 2323029 },
              "1618473600000": { value: 2323030 },
              "1618473660000": { value: 2323031 },
              "1618473720000": { value: 2323032 },
              "1618473780000": { value: 2323033 },
              "1618473840000": { value: 2323034 },
              "1618473900000": { value: 2323035 },
              "1618473960000": { value: 2323036 },
              "1618474020000": { value: 2323037 },
              "1618474080000": { value: 2323038 },
              "1618474140000": { value: 2323039 },
              "1618474200000": { value: 2323040 },
              "1618474260000": { value: 2323041 },
              "1618474320000": { value: 2323042 },
              "1618474380000": { value: 2323043 },
              "1618474440000": { value: 2323044 },
              "1618474500000": { value: 2323045 },
            },
          },
          aspect233: {
            variable2331: {
              "1618471800000": { value: 2331000 },
              "1618471860000": { value: 2331001 },
              "1618471920000": { value: 2331002 },
              "1618471980000": { value: 2331003 },
              "1618472040000": { value: 2331004 },
              "1618472100000": { value: 2331005 },
              "1618472160000": { value: 2331006 },
              "1618472220000": { value: 2331007 },
              "1618472280000": { value: 2331008 },
              "1618472340000": { value: 2331009 },
              "1618472400000": { value: 2331010 },
              "1618472460000": { value: 2331011 },
              "1618472520000": { value: 2331012 },
              "1618472580000": { value: 2331013 },
              "1618472640000": { value: 2331014 },
              "1618472700000": { value: 2331015 },
              "1618472760000": { value: 2331016 },
              "1618472820000": { value: 2331017 },
              "1618472880000": { value: 2331018 },
              "1618472940000": { value: 2331019 },
              "1618473000000": { value: 2331020 },
              "1618473060000": { value: 2331021 },
              "1618473120000": { value: 2331022 },
              "1618473180000": { value: 2331023 },
              "1618473240000": { value: 2331024 },
              "1618473300000": { value: 2331025 },
              "1618473360000": { value: 2331026 },
              "1618473420000": { value: 2331027 },
              "1618473480000": { value: 2331028 },
              "1618473540000": { value: 2331029 },
              "1618473600000": { value: 2331030 },
              "1618473660000": { value: 2331031 },
              "1618473720000": { value: 2331032 },
              "1618473780000": { value: 2331033 },
              "1618473840000": { value: 2331034 },
              "1618473900000": { value: 2331035 },
              "1618473960000": { value: 2331036 },
              "1618474020000": { value: 2331037 },
              "1618474080000": { value: 2331038 },
              "1618474140000": { value: 2331039 },
              "1618474200000": { value: 2331040 },
              "1618474260000": { value: 2331041 },
              "1618474320000": { value: 2331042 },
              "1618474380000": { value: 2331043 },
              "1618474440000": { value: 2331044 },
              "1618474500000": { value: 2331045 },
            },
            variable2332: {
              "1618471800000": { value: 2332000 },
              "1618471860000": { value: 2332001 },
              "1618471920000": { value: 2332002 },
              "1618471980000": { value: 2332003 },
              "1618472040000": { value: 2332004 },
              "1618472100000": { value: 2332005 },
              "1618472160000": { value: 2332006 },
              "1618472220000": { value: 2332007 },
              "1618472280000": { value: 2332008 },
              "1618472340000": { value: 2332009 },
              "1618472400000": { value: 2332010 },
              "1618472460000": { value: 2332011 },
              "1618472520000": { value: 2332012 },
              "1618472580000": { value: 2332013 },
              "1618472640000": { value: 2332014 },
              "1618472700000": { value: 2332015 },
              "1618472760000": { value: 2332016 },
              "1618472820000": { value: 2332017 },
              "1618472880000": { value: 2332018 },
              "1618472940000": { value: 2332019 },
              "1618473000000": { value: 2332020 },
              "1618473060000": { value: 2332021 },
              "1618473120000": { value: 2332022 },
              "1618473180000": { value: 2332023 },
              "1618473240000": { value: 2332024 },
              "1618473300000": { value: 2332025 },
              "1618473360000": { value: 2332026 },
              "1618473420000": { value: 2332027 },
              "1618473480000": { value: 2332028 },
              "1618473540000": { value: 2332029 },
              "1618473600000": { value: 2332030 },
              "1618473660000": { value: 2332031 },
              "1618473720000": { value: 2332032 },
              "1618473780000": { value: 2332033 },
              "1618473840000": { value: 2332034 },
              "1618473900000": { value: 2332035 },
              "1618473960000": { value: 2332036 },
              "1618474020000": { value: 2332037 },
              "1618474080000": { value: 2332038 },
              "1618474140000": { value: 2332039 },
              "1618474200000": { value: 2332040 },
              "1618474260000": { value: 2332041 },
              "1618474320000": { value: 2332042 },
              "1618474380000": { value: 2332043 },
              "1618474440000": { value: 2332044 },
              "1618474500000": { value: 2332045 },
            },
            variable2333: {
              "1618471800000": { value: 2333000 },
              "1618471860000": { value: 2333001 },
              "1618471920000": { value: 2333002 },
              "1618471980000": { value: 2333003 },
              "1618472040000": { value: 2333004 },
              "1618472100000": { value: 2333005 },
              "1618472160000": { value: 2333006 },
              "1618472220000": { value: 2333007 },
              "1618472280000": { value: 2333008 },
              "1618472340000": { value: 2333009 },
              "1618472400000": { value: 2333010 },
              "1618472460000": { value: 2333011 },
              "1618472520000": { value: 2333012 },
              "1618472580000": { value: 2333013 },
              "1618472640000": { value: 2333014 },
              "1618472700000": { value: 2333015 },
              "1618472760000": { value: 2333016 },
              "1618472820000": { value: 2333017 },
              "1618472880000": { value: 2333018 },
              "1618472940000": { value: 2333019 },
              "1618473000000": { value: 2333020 },
              "1618473060000": { value: 2333021 },
              "1618473120000": { value: 2333022 },
              "1618473180000": { value: 2333023 },
              "1618473240000": { value: 2333024 },
              "1618473300000": { value: 2333025 },
              "1618473360000": { value: 2333026 },
              "1618473420000": { value: 2333027 },
              "1618473480000": { value: 2333028 },
              "1618473540000": { value: 2333029 },
              "1618473600000": { value: 2333030 },
              "1618473660000": { value: 2333031 },
              "1618473720000": { value: 2333032 },
              "1618473780000": { value: 2333033 },
              "1618473840000": { value: 2333034 },
              "1618473900000": { value: 2333035 },
              "1618473960000": { value: 2333036 },
              "1618474020000": { value: 2333037 },
              "1618474080000": { value: 2333038 },
              "1618474140000": { value: 2333039 },
              "1618474200000": { value: 2333040 },
              "1618474260000": { value: 2333041 },
              "1618474320000": { value: 2333042 },
              "1618474380000": { value: 2333043 },
              "1618474440000": { value: 2333044 },
              "1618474500000": { value: 2333045 },
            },
          },
        },
      },
      testTenant3: {
        asset31: {
          aspect311: {
            variable3111: {
              "1618471800000": { value: 3111000 },
              "1618471860000": { value: 3111001 },
              "1618471920000": { value: 3111002 },
              "1618471980000": { value: 3111003 },
              "1618472040000": { value: 3111004 },
              "1618472100000": { value: 3111005 },
              "1618472160000": { value: 3111006 },
              "1618472220000": { value: 3111007 },
              "1618472280000": { value: 3111008 },
              "1618472340000": { value: 3111009 },
              "1618472400000": { value: 3111010 },
              "1618472460000": { value: 3111011 },
              "1618472520000": { value: 3111012 },
              "1618472580000": { value: 3111013 },
              "1618472640000": { value: 3111014 },
              "1618472700000": { value: 3111015 },
              "1618472760000": { value: 3111016 },
              "1618472820000": { value: 3111017 },
              "1618472880000": { value: 3111018 },
              "1618472940000": { value: 3111019 },
              "1618473000000": { value: 3111020 },
              "1618473060000": { value: 3111021 },
              "1618473120000": { value: 3111022 },
              "1618473180000": { value: 3111023 },
              "1618473240000": { value: 3111024 },
              "1618473300000": { value: 3111025 },
              "1618473360000": { value: 3111026 },
              "1618473420000": { value: 3111027 },
              "1618473480000": { value: 3111028 },
              "1618473540000": { value: 3111029 },
              "1618473600000": { value: 3111030 },
              "1618473660000": { value: 3111031 },
              "1618473720000": { value: 3111032 },
              "1618473780000": { value: 3111033 },
              "1618473840000": { value: 3111034 },
              "1618473900000": { value: 3111035 },
              "1618473960000": { value: 3111036 },
              "1618474020000": { value: 3111037 },
              "1618474080000": { value: 3111038 },
              "1618474140000": { value: 3111039 },
              "1618474200000": { value: 3111040 },
              "1618474260000": { value: 3111041 },
              "1618474320000": { value: 3111042 },
              "1618474380000": { value: 3111043 },
              "1618474440000": { value: 3111044 },
              "1618474500000": { value: 3111045 },
            },
            variable3112: {
              "1618471800000": { value: 3112000 },
              "1618471860000": { value: 3112001 },
              "1618471920000": { value: 3112002 },
              "1618471980000": { value: 3112003 },
              "1618472040000": { value: 3112004 },
              "1618472100000": { value: 3112005 },
              "1618472160000": { value: 3112006 },
              "1618472220000": { value: 3112007 },
              "1618472280000": { value: 3112008 },
              "1618472340000": { value: 3112009 },
              "1618472400000": { value: 3112010 },
              "1618472460000": { value: 3112011 },
              "1618472520000": { value: 3112012 },
              "1618472580000": { value: 3112013 },
              "1618472640000": { value: 3112014 },
              "1618472700000": { value: 3112015 },
              "1618472760000": { value: 3112016 },
              "1618472820000": { value: 3112017 },
              "1618472880000": { value: 3112018 },
              "1618472940000": { value: 3112019 },
              "1618473000000": { value: 3112020 },
              "1618473060000": { value: 3112021 },
              "1618473120000": { value: 3112022 },
              "1618473180000": { value: 3112023 },
              "1618473240000": { value: 3112024 },
              "1618473300000": { value: 3112025 },
              "1618473360000": { value: 3112026 },
              "1618473420000": { value: 3112027 },
              "1618473480000": { value: 3112028 },
              "1618473540000": { value: 3112029 },
              "1618473600000": { value: 3112030 },
              "1618473660000": { value: 3112031 },
              "1618473720000": { value: 3112032 },
              "1618473780000": { value: 3112033 },
              "1618473840000": { value: 3112034 },
              "1618473900000": { value: 3112035 },
              "1618473960000": { value: 3112036 },
              "1618474020000": { value: 3112037 },
              "1618474080000": { value: 3112038 },
              "1618474140000": { value: 3112039 },
              "1618474200000": { value: 3112040 },
              "1618474260000": { value: 3112041 },
              "1618474320000": { value: 3112042 },
              "1618474380000": { value: 3112043 },
              "1618474440000": { value: 3112044 },
              "1618474500000": { value: 3112045 },
            },
            variable3113: {
              "1618471800000": { value: 3113000 },
              "1618471860000": { value: 3113001 },
              "1618471920000": { value: 3113002 },
              "1618471980000": { value: 3113003 },
              "1618472040000": { value: 3113004 },
              "1618472100000": { value: 3113005 },
              "1618472160000": { value: 3113006 },
              "1618472220000": { value: 3113007 },
              "1618472280000": { value: 3113008 },
              "1618472340000": { value: 3113009 },
              "1618472400000": { value: 3113010 },
              "1618472460000": { value: 3113011 },
              "1618472520000": { value: 3113012 },
              "1618472580000": { value: 3113013 },
              "1618472640000": { value: 3113014 },
              "1618472700000": { value: 3113015 },
              "1618472760000": { value: 3113016 },
              "1618472820000": { value: 3113017 },
              "1618472880000": { value: 3113018 },
              "1618472940000": { value: 3113019 },
              "1618473000000": { value: 3113020 },
              "1618473060000": { value: 3113021 },
              "1618473120000": { value: 3113022 },
              "1618473180000": { value: 3113023 },
              "1618473240000": { value: 3113024 },
              "1618473300000": { value: 3113025 },
              "1618473360000": { value: 3113026 },
              "1618473420000": { value: 3113027 },
              "1618473480000": { value: 3113028 },
              "1618473540000": { value: 3113029 },
              "1618473600000": { value: 3113030 },
              "1618473660000": { value: 3113031 },
              "1618473720000": { value: 3113032 },
              "1618473780000": { value: 3113033 },
              "1618473840000": { value: 3113034 },
              "1618473900000": { value: 3113035 },
              "1618473960000": { value: 3113036 },
              "1618474020000": { value: 3113037 },
              "1618474080000": { value: 3113038 },
              "1618474140000": { value: 3113039 },
              "1618474200000": { value: 3113040 },
              "1618474260000": { value: 3113041 },
              "1618474320000": { value: 3113042 },
              "1618474380000": { value: 3113043 },
              "1618474440000": { value: 3113044 },
              "1618474500000": { value: 3113045 },
            },
          },
          aspect312: {
            variable3121: {
              "1618471800000": { value: 3121000 },
              "1618471860000": { value: 3121001 },
              "1618471920000": { value: 3121002 },
              "1618471980000": { value: 3121003 },
              "1618472040000": { value: 3121004 },
              "1618472100000": { value: 3121005 },
              "1618472160000": { value: 3121006 },
              "1618472220000": { value: 3121007 },
              "1618472280000": { value: 3121008 },
              "1618472340000": { value: 3121009 },
              "1618472400000": { value: 3121010 },
              "1618472460000": { value: 3121011 },
              "1618472520000": { value: 3121012 },
              "1618472580000": { value: 3121013 },
              "1618472640000": { value: 3121014 },
              "1618472700000": { value: 3121015 },
              "1618472760000": { value: 3121016 },
              "1618472820000": { value: 3121017 },
              "1618472880000": { value: 3121018 },
              "1618472940000": { value: 3121019 },
              "1618473000000": { value: 3121020 },
              "1618473060000": { value: 3121021 },
              "1618473120000": { value: 3121022 },
              "1618473180000": { value: 3121023 },
              "1618473240000": { value: 3121024 },
              "1618473300000": { value: 3121025 },
              "1618473360000": { value: 3121026 },
              "1618473420000": { value: 3121027 },
              "1618473480000": { value: 3121028 },
              "1618473540000": { value: 3121029 },
              "1618473600000": { value: 3121030 },
              "1618473660000": { value: 3121031 },
              "1618473720000": { value: 3121032 },
              "1618473780000": { value: 3121033 },
              "1618473840000": { value: 3121034 },
              "1618473900000": { value: 3121035 },
              "1618473960000": { value: 3121036 },
              "1618474020000": { value: 3121037 },
              "1618474080000": { value: 3121038 },
              "1618474140000": { value: 3121039 },
              "1618474200000": { value: 3121040 },
              "1618474260000": { value: 3121041 },
              "1618474320000": { value: 3121042 },
              "1618474380000": { value: 3121043 },
              "1618474440000": { value: 3121044 },
              "1618474500000": { value: 3121045 },
            },
            variable3122: {
              "1618471800000": { value: 3122000 },
              "1618471860000": { value: 3122001 },
              "1618471920000": { value: 3122002 },
              "1618471980000": { value: 3122003 },
              "1618472040000": { value: 3122004 },
              "1618472100000": { value: 3122005 },
              "1618472160000": { value: 3122006 },
              "1618472220000": { value: 3122007 },
              "1618472280000": { value: 3122008 },
              "1618472340000": { value: 3122009 },
              "1618472400000": { value: 3122010 },
              "1618472460000": { value: 3122011 },
              "1618472520000": { value: 3122012 },
              "1618472580000": { value: 3122013 },
              "1618472640000": { value: 3122014 },
              "1618472700000": { value: 3122015 },
              "1618472760000": { value: 3122016 },
              "1618472820000": { value: 3122017 },
              "1618472880000": { value: 3122018 },
              "1618472940000": { value: 3122019 },
              "1618473000000": { value: 3122020 },
              "1618473060000": { value: 3122021 },
              "1618473120000": { value: 3122022 },
              "1618473180000": { value: 3122023 },
              "1618473240000": { value: 3122024 },
              "1618473300000": { value: 3122025 },
              "1618473360000": { value: 3122026 },
              "1618473420000": { value: 3122027 },
              "1618473480000": { value: 3122028 },
              "1618473540000": { value: 3122029 },
              "1618473600000": { value: 3122030 },
              "1618473660000": { value: 3122031 },
              "1618473720000": { value: 3122032 },
              "1618473780000": { value: 3122033 },
              "1618473840000": { value: 3122034 },
              "1618473900000": { value: 3122035 },
              "1618473960000": { value: 3122036 },
              "1618474020000": { value: 3122037 },
              "1618474080000": { value: 3122038 },
              "1618474140000": { value: 3122039 },
              "1618474200000": { value: 3122040 },
              "1618474260000": { value: 3122041 },
              "1618474320000": { value: 3122042 },
              "1618474380000": { value: 3122043 },
              "1618474440000": { value: 3122044 },
              "1618474500000": { value: 3122045 },
            },
            variable3123: {
              "1618471800000": { value: 3123000 },
              "1618471860000": { value: 3123001 },
              "1618471920000": { value: 3123002 },
              "1618471980000": { value: 3123003 },
              "1618472040000": { value: 3123004 },
              "1618472100000": { value: 3123005 },
              "1618472160000": { value: 3123006 },
              "1618472220000": { value: 3123007 },
              "1618472280000": { value: 3123008 },
              "1618472340000": { value: 3123009 },
              "1618472400000": { value: 3123010 },
              "1618472460000": { value: 3123011 },
              "1618472520000": { value: 3123012 },
              "1618472580000": { value: 3123013 },
              "1618472640000": { value: 3123014 },
              "1618472700000": { value: 3123015 },
              "1618472760000": { value: 3123016 },
              "1618472820000": { value: 3123017 },
              "1618472880000": { value: 3123018 },
              "1618472940000": { value: 3123019 },
              "1618473000000": { value: 3123020 },
              "1618473060000": { value: 3123021 },
              "1618473120000": { value: 3123022 },
              "1618473180000": { value: 3123023 },
              "1618473240000": { value: 3123024 },
              "1618473300000": { value: 3123025 },
              "1618473360000": { value: 3123026 },
              "1618473420000": { value: 3123027 },
              "1618473480000": { value: 3123028 },
              "1618473540000": { value: 3123029 },
              "1618473600000": { value: 3123030 },
              "1618473660000": { value: 3123031 },
              "1618473720000": { value: 3123032 },
              "1618473780000": { value: 3123033 },
              "1618473840000": { value: 3123034 },
              "1618473900000": { value: 3123035 },
              "1618473960000": { value: 3123036 },
              "1618474020000": { value: 3123037 },
              "1618474080000": { value: 3123038 },
              "1618474140000": { value: 3123039 },
              "1618474200000": { value: 3123040 },
              "1618474260000": { value: 3123041 },
              "1618474320000": { value: 3123042 },
              "1618474380000": { value: 3123043 },
              "1618474440000": { value: 3123044 },
              "1618474500000": { value: 3123045 },
            },
          },
          aspect313: {
            variable3131: {
              "1618471800000": { value: 3131000 },
              "1618471860000": { value: 3131001 },
              "1618471920000": { value: 3131002 },
              "1618471980000": { value: 3131003 },
              "1618472040000": { value: 3131004 },
              "1618472100000": { value: 3131005 },
              "1618472160000": { value: 3131006 },
              "1618472220000": { value: 3131007 },
              "1618472280000": { value: 3131008 },
              "1618472340000": { value: 3131009 },
              "1618472400000": { value: 3131010 },
              "1618472460000": { value: 3131011 },
              "1618472520000": { value: 3131012 },
              "1618472580000": { value: 3131013 },
              "1618472640000": { value: 3131014 },
              "1618472700000": { value: 3131015 },
              "1618472760000": { value: 3131016 },
              "1618472820000": { value: 3131017 },
              "1618472880000": { value: 3131018 },
              "1618472940000": { value: 3131019 },
              "1618473000000": { value: 3131020 },
              "1618473060000": { value: 3131021 },
              "1618473120000": { value: 3131022 },
              "1618473180000": { value: 3131023 },
              "1618473240000": { value: 3131024 },
              "1618473300000": { value: 3131025 },
              "1618473360000": { value: 3131026 },
              "1618473420000": { value: 3131027 },
              "1618473480000": { value: 3131028 },
              "1618473540000": { value: 3131029 },
              "1618473600000": { value: 3131030 },
              "1618473660000": { value: 3131031 },
              "1618473720000": { value: 3131032 },
              "1618473780000": { value: 3131033 },
              "1618473840000": { value: 3131034 },
              "1618473900000": { value: 3131035 },
              "1618473960000": { value: 3131036 },
              "1618474020000": { value: 3131037 },
              "1618474080000": { value: 3131038 },
              "1618474140000": { value: 3131039 },
              "1618474200000": { value: 3131040 },
              "1618474260000": { value: 3131041 },
              "1618474320000": { value: 3131042 },
              "1618474380000": { value: 3131043 },
              "1618474440000": { value: 3131044 },
              "1618474500000": { value: 3131045 },
            },
            variable3132: {
              "1618471800000": { value: 3132000 },
              "1618471860000": { value: 3132001 },
              "1618471920000": { value: 3132002 },
              "1618471980000": { value: 3132003 },
              "1618472040000": { value: 3132004 },
              "1618472100000": { value: 3132005 },
              "1618472160000": { value: 3132006 },
              "1618472220000": { value: 3132007 },
              "1618472280000": { value: 3132008 },
              "1618472340000": { value: 3132009 },
              "1618472400000": { value: 3132010 },
              "1618472460000": { value: 3132011 },
              "1618472520000": { value: 3132012 },
              "1618472580000": { value: 3132013 },
              "1618472640000": { value: 3132014 },
              "1618472700000": { value: 3132015 },
              "1618472760000": { value: 3132016 },
              "1618472820000": { value: 3132017 },
              "1618472880000": { value: 3132018 },
              "1618472940000": { value: 3132019 },
              "1618473000000": { value: 3132020 },
              "1618473060000": { value: 3132021 },
              "1618473120000": { value: 3132022 },
              "1618473180000": { value: 3132023 },
              "1618473240000": { value: 3132024 },
              "1618473300000": { value: 3132025 },
              "1618473360000": { value: 3132026 },
              "1618473420000": { value: 3132027 },
              "1618473480000": { value: 3132028 },
              "1618473540000": { value: 3132029 },
              "1618473600000": { value: 3132030 },
              "1618473660000": { value: 3132031 },
              "1618473720000": { value: 3132032 },
              "1618473780000": { value: 3132033 },
              "1618473840000": { value: 3132034 },
              "1618473900000": { value: 3132035 },
              "1618473960000": { value: 3132036 },
              "1618474020000": { value: 3132037 },
              "1618474080000": { value: 3132038 },
              "1618474140000": { value: 3132039 },
              "1618474200000": { value: 3132040 },
              "1618474260000": { value: 3132041 },
              "1618474320000": { value: 3132042 },
              "1618474380000": { value: 3132043 },
              "1618474440000": { value: 3132044 },
              "1618474500000": { value: 3132045 },
            },
            variable3133: {
              "1618471800000": { value: 3133000 },
              "1618471860000": { value: 3133001 },
              "1618471920000": { value: 3133002 },
              "1618471980000": { value: 3133003 },
              "1618472040000": { value: 3133004 },
              "1618472100000": { value: 3133005 },
              "1618472160000": { value: 3133006 },
              "1618472220000": { value: 3133007 },
              "1618472280000": { value: 3133008 },
              "1618472340000": { value: 3133009 },
              "1618472400000": { value: 3133010 },
              "1618472460000": { value: 3133011 },
              "1618472520000": { value: 3133012 },
              "1618472580000": { value: 3133013 },
              "1618472640000": { value: 3133014 },
              "1618472700000": { value: 3133015 },
              "1618472760000": { value: 3133016 },
              "1618472820000": { value: 3133017 },
              "1618472880000": { value: 3133018 },
              "1618472940000": { value: 3133019 },
              "1618473000000": { value: 3133020 },
              "1618473060000": { value: 3133021 },
              "1618473120000": { value: 3133022 },
              "1618473180000": { value: 3133023 },
              "1618473240000": { value: 3133024 },
              "1618473300000": { value: 3133025 },
              "1618473360000": { value: 3133026 },
              "1618473420000": { value: 3133027 },
              "1618473480000": { value: 3133028 },
              "1618473540000": { value: 3133029 },
              "1618473600000": { value: 3133030 },
              "1618473660000": { value: 3133031 },
              "1618473720000": { value: 3133032 },
              "1618473780000": { value: 3133033 },
              "1618473840000": { value: 3133034 },
              "1618473900000": { value: 3133035 },
              "1618473960000": { value: 3133036 },
              "1618474020000": { value: 3133037 },
              "1618474080000": { value: 3133038 },
              "1618474140000": { value: 3133039 },
              "1618474200000": { value: 3133040 },
              "1618474260000": { value: 3133041 },
              "1618474320000": { value: 3133042 },
              "1618474380000": { value: 3133043 },
              "1618474440000": { value: 3133044 },
              "1618474500000": { value: 3133045 },
            },
          },
        },
        asset32: {
          aspect321: {
            variable3211: {
              "1618471800000": { value: 3211000 },
              "1618471860000": { value: 3211001 },
              "1618471920000": { value: 3211002 },
              "1618471980000": { value: 3211003 },
              "1618472040000": { value: 3211004 },
              "1618472100000": { value: 3211005 },
              "1618472160000": { value: 3211006 },
              "1618472220000": { value: 3211007 },
              "1618472280000": { value: 3211008 },
              "1618472340000": { value: 3211009 },
              "1618472400000": { value: 3211010 },
              "1618472460000": { value: 3211011 },
              "1618472520000": { value: 3211012 },
              "1618472580000": { value: 3211013 },
              "1618472640000": { value: 3211014 },
              "1618472700000": { value: 3211015 },
              "1618472760000": { value: 3211016 },
              "1618472820000": { value: 3211017 },
              "1618472880000": { value: 3211018 },
              "1618472940000": { value: 3211019 },
              "1618473000000": { value: 3211020 },
              "1618473060000": { value: 3211021 },
              "1618473120000": { value: 3211022 },
              "1618473180000": { value: 3211023 },
              "1618473240000": { value: 3211024 },
              "1618473300000": { value: 3211025 },
              "1618473360000": { value: 3211026 },
              "1618473420000": { value: 3211027 },
              "1618473480000": { value: 3211028 },
              "1618473540000": { value: 3211029 },
              "1618473600000": { value: 3211030 },
              "1618473660000": { value: 3211031 },
              "1618473720000": { value: 3211032 },
              "1618473780000": { value: 3211033 },
              "1618473840000": { value: 3211034 },
              "1618473900000": { value: 3211035 },
              "1618473960000": { value: 3211036 },
              "1618474020000": { value: 3211037 },
              "1618474080000": { value: 3211038 },
              "1618474140000": { value: 3211039 },
              "1618474200000": { value: 3211040 },
              "1618474260000": { value: 3211041 },
              "1618474320000": { value: 3211042 },
              "1618474380000": { value: 3211043 },
              "1618474440000": { value: 3211044 },
              "1618474500000": { value: 3211045 },
            },
            variable3212: {
              "1618471800000": { value: 3212000 },
              "1618471860000": { value: 3212001 },
              "1618471920000": { value: 3212002 },
              "1618471980000": { value: 3212003 },
              "1618472040000": { value: 3212004 },
              "1618472100000": { value: 3212005 },
              "1618472160000": { value: 3212006 },
              "1618472220000": { value: 3212007 },
              "1618472280000": { value: 3212008 },
              "1618472340000": { value: 3212009 },
              "1618472400000": { value: 3212010 },
              "1618472460000": { value: 3212011 },
              "1618472520000": { value: 3212012 },
              "1618472580000": { value: 3212013 },
              "1618472640000": { value: 3212014 },
              "1618472700000": { value: 3212015 },
              "1618472760000": { value: 3212016 },
              "1618472820000": { value: 3212017 },
              "1618472880000": { value: 3212018 },
              "1618472940000": { value: 3212019 },
              "1618473000000": { value: 3212020 },
              "1618473060000": { value: 3212021 },
              "1618473120000": { value: 3212022 },
              "1618473180000": { value: 3212023 },
              "1618473240000": { value: 3212024 },
              "1618473300000": { value: 3212025 },
              "1618473360000": { value: 3212026 },
              "1618473420000": { value: 3212027 },
              "1618473480000": { value: 3212028 },
              "1618473540000": { value: 3212029 },
              "1618473600000": { value: 3212030 },
              "1618473660000": { value: 3212031 },
              "1618473720000": { value: 3212032 },
              "1618473780000": { value: 3212033 },
              "1618473840000": { value: 3212034 },
              "1618473900000": { value: 3212035 },
              "1618473960000": { value: 3212036 },
              "1618474020000": { value: 3212037 },
              "1618474080000": { value: 3212038 },
              "1618474140000": { value: 3212039 },
              "1618474200000": { value: 3212040 },
              "1618474260000": { value: 3212041 },
              "1618474320000": { value: 3212042 },
              "1618474380000": { value: 3212043 },
              "1618474440000": { value: 3212044 },
              "1618474500000": { value: 3212045 },
            },
            variable3213: {
              "1618471800000": { value: 3213000 },
              "1618471860000": { value: 3213001 },
              "1618471920000": { value: 3213002 },
              "1618471980000": { value: 3213003 },
              "1618472040000": { value: 3213004 },
              "1618472100000": { value: 3213005 },
              "1618472160000": { value: 3213006 },
              "1618472220000": { value: 3213007 },
              "1618472280000": { value: 3213008 },
              "1618472340000": { value: 3213009 },
              "1618472400000": { value: 3213010 },
              "1618472460000": { value: 3213011 },
              "1618472520000": { value: 3213012 },
              "1618472580000": { value: 3213013 },
              "1618472640000": { value: 3213014 },
              "1618472700000": { value: 3213015 },
              "1618472760000": { value: 3213016 },
              "1618472820000": { value: 3213017 },
              "1618472880000": { value: 3213018 },
              "1618472940000": { value: 3213019 },
              "1618473000000": { value: 3213020 },
              "1618473060000": { value: 3213021 },
              "1618473120000": { value: 3213022 },
              "1618473180000": { value: 3213023 },
              "1618473240000": { value: 3213024 },
              "1618473300000": { value: 3213025 },
              "1618473360000": { value: 3213026 },
              "1618473420000": { value: 3213027 },
              "1618473480000": { value: 3213028 },
              "1618473540000": { value: 3213029 },
              "1618473600000": { value: 3213030 },
              "1618473660000": { value: 3213031 },
              "1618473720000": { value: 3213032 },
              "1618473780000": { value: 3213033 },
              "1618473840000": { value: 3213034 },
              "1618473900000": { value: 3213035 },
              "1618473960000": { value: 3213036 },
              "1618474020000": { value: 3213037 },
              "1618474080000": { value: 3213038 },
              "1618474140000": { value: 3213039 },
              "1618474200000": { value: 3213040 },
              "1618474260000": { value: 3213041 },
              "1618474320000": { value: 3213042 },
              "1618474380000": { value: 3213043 },
              "1618474440000": { value: 3213044 },
              "1618474500000": { value: 3213045 },
            },
          },
          aspect322: {
            variable3221: {
              "1618471800000": { value: 3221000 },
              "1618471860000": { value: 3221001 },
              "1618471920000": { value: 3221002 },
              "1618471980000": { value: 3221003 },
              "1618472040000": { value: 3221004 },
              "1618472100000": { value: 3221005 },
              "1618472160000": { value: 3221006 },
              "1618472220000": { value: 3221007 },
              "1618472280000": { value: 3221008 },
              "1618472340000": { value: 3221009 },
              "1618472400000": { value: 3221010 },
              "1618472460000": { value: 3221011 },
              "1618472520000": { value: 3221012 },
              "1618472580000": { value: 3221013 },
              "1618472640000": { value: 3221014 },
              "1618472700000": { value: 3221015 },
              "1618472760000": { value: 3221016 },
              "1618472820000": { value: 3221017 },
              "1618472880000": { value: 3221018 },
              "1618472940000": { value: 3221019 },
              "1618473000000": { value: 3221020 },
              "1618473060000": { value: 3221021 },
              "1618473120000": { value: 3221022 },
              "1618473180000": { value: 3221023 },
              "1618473240000": { value: 3221024 },
              "1618473300000": { value: 3221025 },
              "1618473360000": { value: 3221026 },
              "1618473420000": { value: 3221027 },
              "1618473480000": { value: 3221028 },
              "1618473540000": { value: 3221029 },
              "1618473600000": { value: 3221030 },
              "1618473660000": { value: 3221031 },
              "1618473720000": { value: 3221032 },
              "1618473780000": { value: 3221033 },
              "1618473840000": { value: 3221034 },
              "1618473900000": { value: 3221035 },
              "1618473960000": { value: 3221036 },
              "1618474020000": { value: 3221037 },
              "1618474080000": { value: 3221038 },
              "1618474140000": { value: 3221039 },
              "1618474200000": { value: 3221040 },
              "1618474260000": { value: 3221041 },
              "1618474320000": { value: 3221042 },
              "1618474380000": { value: 3221043 },
              "1618474440000": { value: 3221044 },
              "1618474500000": { value: 3221045 },
            },
            variable3222: {
              "1618471800000": { value: 3222000 },
              "1618471860000": { value: 3222001 },
              "1618471920000": { value: 3222002 },
              "1618471980000": { value: 3222003 },
              "1618472040000": { value: 3222004 },
              "1618472100000": { value: 3222005 },
              "1618472160000": { value: 3222006 },
              "1618472220000": { value: 3222007 },
              "1618472280000": { value: 3222008 },
              "1618472340000": { value: 3222009 },
              "1618472400000": { value: 3222010 },
              "1618472460000": { value: 3222011 },
              "1618472520000": { value: 3222012 },
              "1618472580000": { value: 3222013 },
              "1618472640000": { value: 3222014 },
              "1618472700000": { value: 3222015 },
              "1618472760000": { value: 3222016 },
              "1618472820000": { value: 3222017 },
              "1618472880000": { value: 3222018 },
              "1618472940000": { value: 3222019 },
              "1618473000000": { value: 3222020 },
              "1618473060000": { value: 3222021 },
              "1618473120000": { value: 3222022 },
              "1618473180000": { value: 3222023 },
              "1618473240000": { value: 3222024 },
              "1618473300000": { value: 3222025 },
              "1618473360000": { value: 3222026 },
              "1618473420000": { value: 3222027 },
              "1618473480000": { value: 3222028 },
              "1618473540000": { value: 3222029 },
              "1618473600000": { value: 3222030 },
              "1618473660000": { value: 3222031 },
              "1618473720000": { value: 3222032 },
              "1618473780000": { value: 3222033 },
              "1618473840000": { value: 3222034 },
              "1618473900000": { value: 3222035 },
              "1618473960000": { value: 3222036 },
              "1618474020000": { value: 3222037 },
              "1618474080000": { value: 3222038 },
              "1618474140000": { value: 3222039 },
              "1618474200000": { value: 3222040 },
              "1618474260000": { value: 3222041 },
              "1618474320000": { value: 3222042 },
              "1618474380000": { value: 3222043 },
              "1618474440000": { value: 3222044 },
              "1618474500000": { value: 3222045 },
            },
            variable3223: {
              "1618471800000": { value: 3223000 },
              "1618471860000": { value: 3223001 },
              "1618471920000": { value: 3223002 },
              "1618471980000": { value: 3223003 },
              "1618472040000": { value: 3223004 },
              "1618472100000": { value: 3223005 },
              "1618472160000": { value: 3223006 },
              "1618472220000": { value: 3223007 },
              "1618472280000": { value: 3223008 },
              "1618472340000": { value: 3223009 },
              "1618472400000": { value: 3223010 },
              "1618472460000": { value: 3223011 },
              "1618472520000": { value: 3223012 },
              "1618472580000": { value: 3223013 },
              "1618472640000": { value: 3223014 },
              "1618472700000": { value: 3223015 },
              "1618472760000": { value: 3223016 },
              "1618472820000": { value: 3223017 },
              "1618472880000": { value: 3223018 },
              "1618472940000": { value: 3223019 },
              "1618473000000": { value: 3223020 },
              "1618473060000": { value: 3223021 },
              "1618473120000": { value: 3223022 },
              "1618473180000": { value: 3223023 },
              "1618473240000": { value: 3223024 },
              "1618473300000": { value: 3223025 },
              "1618473360000": { value: 3223026 },
              "1618473420000": { value: 3223027 },
              "1618473480000": { value: 3223028 },
              "1618473540000": { value: 3223029 },
              "1618473600000": { value: 3223030 },
              "1618473660000": { value: 3223031 },
              "1618473720000": { value: 3223032 },
              "1618473780000": { value: 3223033 },
              "1618473840000": { value: 3223034 },
              "1618473900000": { value: 3223035 },
              "1618473960000": { value: 3223036 },
              "1618474020000": { value: 3223037 },
              "1618474080000": { value: 3223038 },
              "1618474140000": { value: 3223039 },
              "1618474200000": { value: 3223040 },
              "1618474260000": { value: 3223041 },
              "1618474320000": { value: 3223042 },
              "1618474380000": { value: 3223043 },
              "1618474440000": { value: 3223044 },
              "1618474500000": { value: 3223045 },
            },
          },
          aspect323: {
            variable3231: {
              "1618471800000": { value: 3231000 },
              "1618471860000": { value: 3231001 },
              "1618471920000": { value: 3231002 },
              "1618471980000": { value: 3231003 },
              "1618472040000": { value: 3231004 },
              "1618472100000": { value: 3231005 },
              "1618472160000": { value: 3231006 },
              "1618472220000": { value: 3231007 },
              "1618472280000": { value: 3231008 },
              "1618472340000": { value: 3231009 },
              "1618472400000": { value: 3231010 },
              "1618472460000": { value: 3231011 },
              "1618472520000": { value: 3231012 },
              "1618472580000": { value: 3231013 },
              "1618472640000": { value: 3231014 },
              "1618472700000": { value: 3231015 },
              "1618472760000": { value: 3231016 },
              "1618472820000": { value: 3231017 },
              "1618472880000": { value: 3231018 },
              "1618472940000": { value: 3231019 },
              "1618473000000": { value: 3231020 },
              "1618473060000": { value: 3231021 },
              "1618473120000": { value: 3231022 },
              "1618473180000": { value: 3231023 },
              "1618473240000": { value: 3231024 },
              "1618473300000": { value: 3231025 },
              "1618473360000": { value: 3231026 },
              "1618473420000": { value: 3231027 },
              "1618473480000": { value: 3231028 },
              "1618473540000": { value: 3231029 },
              "1618473600000": { value: 3231030 },
              "1618473660000": { value: 3231031 },
              "1618473720000": { value: 3231032 },
              "1618473780000": { value: 3231033 },
              "1618473840000": { value: 3231034 },
              "1618473900000": { value: 3231035 },
              "1618473960000": { value: 3231036 },
              "1618474020000": { value: 3231037 },
              "1618474080000": { value: 3231038 },
              "1618474140000": { value: 3231039 },
              "1618474200000": { value: 3231040 },
              "1618474260000": { value: 3231041 },
              "1618474320000": { value: 3231042 },
              "1618474380000": { value: 3231043 },
              "1618474440000": { value: 3231044 },
              "1618474500000": { value: 3231045 },
            },
            variable3232: {
              "1618471800000": { value: 3232000 },
              "1618471860000": { value: 3232001 },
              "1618471920000": { value: 3232002 },
              "1618471980000": { value: 3232003 },
              "1618472040000": { value: 3232004 },
              "1618472100000": { value: 3232005 },
              "1618472160000": { value: 3232006 },
              "1618472220000": { value: 3232007 },
              "1618472280000": { value: 3232008 },
              "1618472340000": { value: 3232009 },
              "1618472400000": { value: 3232010 },
              "1618472460000": { value: 3232011 },
              "1618472520000": { value: 3232012 },
              "1618472580000": { value: 3232013 },
              "1618472640000": { value: 3232014 },
              "1618472700000": { value: 3232015 },
              "1618472760000": { value: 3232016 },
              "1618472820000": { value: 3232017 },
              "1618472880000": { value: 3232018 },
              "1618472940000": { value: 3232019 },
              "1618473000000": { value: 3232020 },
              "1618473060000": { value: 3232021 },
              "1618473120000": { value: 3232022 },
              "1618473180000": { value: 3232023 },
              "1618473240000": { value: 3232024 },
              "1618473300000": { value: 3232025 },
              "1618473360000": { value: 3232026 },
              "1618473420000": { value: 3232027 },
              "1618473480000": { value: 3232028 },
              "1618473540000": { value: 3232029 },
              "1618473600000": { value: 3232030 },
              "1618473660000": { value: 3232031 },
              "1618473720000": { value: 3232032 },
              "1618473780000": { value: 3232033 },
              "1618473840000": { value: 3232034 },
              "1618473900000": { value: 3232035 },
              "1618473960000": { value: 3232036 },
              "1618474020000": { value: 3232037 },
              "1618474080000": { value: 3232038 },
              "1618474140000": { value: 3232039 },
              "1618474200000": { value: 3232040 },
              "1618474260000": { value: 3232041 },
              "1618474320000": { value: 3232042 },
              "1618474380000": { value: 3232043 },
              "1618474440000": { value: 3232044 },
              "1618474500000": { value: 3232045 },
            },
            variable3233: {
              "1618471800000": { value: 3233000 },
              "1618471860000": { value: 3233001 },
              "1618471920000": { value: 3233002 },
              "1618471980000": { value: 3233003 },
              "1618472040000": { value: 3233004 },
              "1618472100000": { value: 3233005 },
              "1618472160000": { value: 3233006 },
              "1618472220000": { value: 3233007 },
              "1618472280000": { value: 3233008 },
              "1618472340000": { value: 3233009 },
              "1618472400000": { value: 3233010 },
              "1618472460000": { value: 3233011 },
              "1618472520000": { value: 3233012 },
              "1618472580000": { value: 3233013 },
              "1618472640000": { value: 3233014 },
              "1618472700000": { value: 3233015 },
              "1618472760000": { value: 3233016 },
              "1618472820000": { value: 3233017 },
              "1618472880000": { value: 3233018 },
              "1618472940000": { value: 3233019 },
              "1618473000000": { value: 3233020 },
              "1618473060000": { value: 3233021 },
              "1618473120000": { value: 3233022 },
              "1618473180000": { value: 3233023 },
              "1618473240000": { value: 3233024 },
              "1618473300000": { value: 3233025 },
              "1618473360000": { value: 3233026 },
              "1618473420000": { value: 3233027 },
              "1618473480000": { value: 3233028 },
              "1618473540000": { value: 3233029 },
              "1618473600000": { value: 3233030 },
              "1618473660000": { value: 3233031 },
              "1618473720000": { value: 3233032 },
              "1618473780000": { value: 3233033 },
              "1618473840000": { value: 3233034 },
              "1618473900000": { value: 3233035 },
              "1618473960000": { value: 3233036 },
              "1618474020000": { value: 3233037 },
              "1618474080000": { value: 3233038 },
              "1618474140000": { value: 3233039 },
              "1618474200000": { value: 3233040 },
              "1618474260000": { value: 3233041 },
              "1618474320000": { value: 3233042 },
              "1618474380000": { value: 3233043 },
              "1618474440000": { value: 3233044 },
              "1618474500000": { value: 3233045 },
            },
          },
        },
        asset33: {
          aspect331: {
            variable3311: {
              "1618471800000": { value: 3311000 },
              "1618471860000": { value: 3311001 },
              "1618471920000": { value: 3311002 },
              "1618471980000": { value: 3311003 },
              "1618472040000": { value: 3311004 },
              "1618472100000": { value: 3311005 },
              "1618472160000": { value: 3311006 },
              "1618472220000": { value: 3311007 },
              "1618472280000": { value: 3311008 },
              "1618472340000": { value: 3311009 },
              "1618472400000": { value: 3311010 },
              "1618472460000": { value: 3311011 },
              "1618472520000": { value: 3311012 },
              "1618472580000": { value: 3311013 },
              "1618472640000": { value: 3311014 },
              "1618472700000": { value: 3311015 },
              "1618472760000": { value: 3311016 },
              "1618472820000": { value: 3311017 },
              "1618472880000": { value: 3311018 },
              "1618472940000": { value: 3311019 },
              "1618473000000": { value: 3311020 },
              "1618473060000": { value: 3311021 },
              "1618473120000": { value: 3311022 },
              "1618473180000": { value: 3311023 },
              "1618473240000": { value: 3311024 },
              "1618473300000": { value: 3311025 },
              "1618473360000": { value: 3311026 },
              "1618473420000": { value: 3311027 },
              "1618473480000": { value: 3311028 },
              "1618473540000": { value: 3311029 },
              "1618473600000": { value: 3311030 },
              "1618473660000": { value: 3311031 },
              "1618473720000": { value: 3311032 },
              "1618473780000": { value: 3311033 },
              "1618473840000": { value: 3311034 },
              "1618473900000": { value: 3311035 },
              "1618473960000": { value: 3311036 },
              "1618474020000": { value: 3311037 },
              "1618474080000": { value: 3311038 },
              "1618474140000": { value: 3311039 },
              "1618474200000": { value: 3311040 },
              "1618474260000": { value: 3311041 },
              "1618474320000": { value: 3311042 },
              "1618474380000": { value: 3311043 },
              "1618474440000": { value: 3311044 },
              "1618474500000": { value: 3311045 },
            },
            variable3312: {
              "1618471800000": { value: 3312000 },
              "1618471860000": { value: 3312001 },
              "1618471920000": { value: 3312002 },
              "1618471980000": { value: 3312003 },
              "1618472040000": { value: 3312004 },
              "1618472100000": { value: 3312005 },
              "1618472160000": { value: 3312006 },
              "1618472220000": { value: 3312007 },
              "1618472280000": { value: 3312008 },
              "1618472340000": { value: 3312009 },
              "1618472400000": { value: 3312010 },
              "1618472460000": { value: 3312011 },
              "1618472520000": { value: 3312012 },
              "1618472580000": { value: 3312013 },
              "1618472640000": { value: 3312014 },
              "1618472700000": { value: 3312015 },
              "1618472760000": { value: 3312016 },
              "1618472820000": { value: 3312017 },
              "1618472880000": { value: 3312018 },
              "1618472940000": { value: 3312019 },
              "1618473000000": { value: 3312020 },
              "1618473060000": { value: 3312021 },
              "1618473120000": { value: 3312022 },
              "1618473180000": { value: 3312023 },
              "1618473240000": { value: 3312024 },
              "1618473300000": { value: 3312025 },
              "1618473360000": { value: 3312026 },
              "1618473420000": { value: 3312027 },
              "1618473480000": { value: 3312028 },
              "1618473540000": { value: 3312029 },
              "1618473600000": { value: 3312030 },
              "1618473660000": { value: 3312031 },
              "1618473720000": { value: 3312032 },
              "1618473780000": { value: 3312033 },
              "1618473840000": { value: 3312034 },
              "1618473900000": { value: 3312035 },
              "1618473960000": { value: 3312036 },
              "1618474020000": { value: 3312037 },
              "1618474080000": { value: 3312038 },
              "1618474140000": { value: 3312039 },
              "1618474200000": { value: 3312040 },
              "1618474260000": { value: 3312041 },
              "1618474320000": { value: 3312042 },
              "1618474380000": { value: 3312043 },
              "1618474440000": { value: 3312044 },
              "1618474500000": { value: 3312045 },
            },
            variable3313: {
              "1618471800000": { value: 3313000 },
              "1618471860000": { value: 3313001 },
              "1618471920000": { value: 3313002 },
              "1618471980000": { value: 3313003 },
              "1618472040000": { value: 3313004 },
              "1618472100000": { value: 3313005 },
              "1618472160000": { value: 3313006 },
              "1618472220000": { value: 3313007 },
              "1618472280000": { value: 3313008 },
              "1618472340000": { value: 3313009 },
              "1618472400000": { value: 3313010 },
              "1618472460000": { value: 3313011 },
              "1618472520000": { value: 3313012 },
              "1618472580000": { value: 3313013 },
              "1618472640000": { value: 3313014 },
              "1618472700000": { value: 3313015 },
              "1618472760000": { value: 3313016 },
              "1618472820000": { value: 3313017 },
              "1618472880000": { value: 3313018 },
              "1618472940000": { value: 3313019 },
              "1618473000000": { value: 3313020 },
              "1618473060000": { value: 3313021 },
              "1618473120000": { value: 3313022 },
              "1618473180000": { value: 3313023 },
              "1618473240000": { value: 3313024 },
              "1618473300000": { value: 3313025 },
              "1618473360000": { value: 3313026 },
              "1618473420000": { value: 3313027 },
              "1618473480000": { value: 3313028 },
              "1618473540000": { value: 3313029 },
              "1618473600000": { value: 3313030 },
              "1618473660000": { value: 3313031 },
              "1618473720000": { value: 3313032 },
              "1618473780000": { value: 3313033 },
              "1618473840000": { value: 3313034 },
              "1618473900000": { value: 3313035 },
              "1618473960000": { value: 3313036 },
              "1618474020000": { value: 3313037 },
              "1618474080000": { value: 3313038 },
              "1618474140000": { value: 3313039 },
              "1618474200000": { value: 3313040 },
              "1618474260000": { value: 3313041 },
              "1618474320000": { value: 3313042 },
              "1618474380000": { value: 3313043 },
              "1618474440000": { value: 3313044 },
              "1618474500000": { value: 3313045 },
            },
          },
          aspect332: {
            variable3321: {
              "1618471800000": { value: 3321000 },
              "1618471860000": { value: 3321001 },
              "1618471920000": { value: 3321002 },
              "1618471980000": { value: 3321003 },
              "1618472040000": { value: 3321004 },
              "1618472100000": { value: 3321005 },
              "1618472160000": { value: 3321006 },
              "1618472220000": { value: 3321007 },
              "1618472280000": { value: 3321008 },
              "1618472340000": { value: 3321009 },
              "1618472400000": { value: 3321010 },
              "1618472460000": { value: 3321011 },
              "1618472520000": { value: 3321012 },
              "1618472580000": { value: 3321013 },
              "1618472640000": { value: 3321014 },
              "1618472700000": { value: 3321015 },
              "1618472760000": { value: 3321016 },
              "1618472820000": { value: 3321017 },
              "1618472880000": { value: 3321018 },
              "1618472940000": { value: 3321019 },
              "1618473000000": { value: 3321020 },
              "1618473060000": { value: 3321021 },
              "1618473120000": { value: 3321022 },
              "1618473180000": { value: 3321023 },
              "1618473240000": { value: 3321024 },
              "1618473300000": { value: 3321025 },
              "1618473360000": { value: 3321026 },
              "1618473420000": { value: 3321027 },
              "1618473480000": { value: 3321028 },
              "1618473540000": { value: 3321029 },
              "1618473600000": { value: 3321030 },
              "1618473660000": { value: 3321031 },
              "1618473720000": { value: 3321032 },
              "1618473780000": { value: 3321033 },
              "1618473840000": { value: 3321034 },
              "1618473900000": { value: 3321035 },
              "1618473960000": { value: 3321036 },
              "1618474020000": { value: 3321037 },
              "1618474080000": { value: 3321038 },
              "1618474140000": { value: 3321039 },
              "1618474200000": { value: 3321040 },
              "1618474260000": { value: 3321041 },
              "1618474320000": { value: 3321042 },
              "1618474380000": { value: 3321043 },
              "1618474440000": { value: 3321044 },
              "1618474500000": { value: 3321045 },
            },
            variable3322: {
              "1618471800000": { value: 3322000 },
              "1618471860000": { value: 3322001 },
              "1618471920000": { value: 3322002 },
              "1618471980000": { value: 3322003 },
              "1618472040000": { value: 3322004 },
              "1618472100000": { value: 3322005 },
              "1618472160000": { value: 3322006 },
              "1618472220000": { value: 3322007 },
              "1618472280000": { value: 3322008 },
              "1618472340000": { value: 3322009 },
              "1618472400000": { value: 3322010 },
              "1618472460000": { value: 3322011 },
              "1618472520000": { value: 3322012 },
              "1618472580000": { value: 3322013 },
              "1618472640000": { value: 3322014 },
              "1618472700000": { value: 3322015 },
              "1618472760000": { value: 3322016 },
              "1618472820000": { value: 3322017 },
              "1618472880000": { value: 3322018 },
              "1618472940000": { value: 3322019 },
              "1618473000000": { value: 3322020 },
              "1618473060000": { value: 3322021 },
              "1618473120000": { value: 3322022 },
              "1618473180000": { value: 3322023 },
              "1618473240000": { value: 3322024 },
              "1618473300000": { value: 3322025 },
              "1618473360000": { value: 3322026 },
              "1618473420000": { value: 3322027 },
              "1618473480000": { value: 3322028 },
              "1618473540000": { value: 3322029 },
              "1618473600000": { value: 3322030 },
              "1618473660000": { value: 3322031 },
              "1618473720000": { value: 3322032 },
              "1618473780000": { value: 3322033 },
              "1618473840000": { value: 3322034 },
              "1618473900000": { value: 3322035 },
              "1618473960000": { value: 3322036 },
              "1618474020000": { value: 3322037 },
              "1618474080000": { value: 3322038 },
              "1618474140000": { value: 3322039 },
              "1618474200000": { value: 3322040 },
              "1618474260000": { value: 3322041 },
              "1618474320000": { value: 3322042 },
              "1618474380000": { value: 3322043 },
              "1618474440000": { value: 3322044 },
              "1618474500000": { value: 3322045 },
            },
            variable3323: {
              "1618471800000": { value: 3323000 },
              "1618471860000": { value: 3323001 },
              "1618471920000": { value: 3323002 },
              "1618471980000": { value: 3323003 },
              "1618472040000": { value: 3323004 },
              "1618472100000": { value: 3323005 },
              "1618472160000": { value: 3323006 },
              "1618472220000": { value: 3323007 },
              "1618472280000": { value: 3323008 },
              "1618472340000": { value: 3323009 },
              "1618472400000": { value: 3323010 },
              "1618472460000": { value: 3323011 },
              "1618472520000": { value: 3323012 },
              "1618472580000": { value: 3323013 },
              "1618472640000": { value: 3323014 },
              "1618472700000": { value: 3323015 },
              "1618472760000": { value: 3323016 },
              "1618472820000": { value: 3323017 },
              "1618472880000": { value: 3323018 },
              "1618472940000": { value: 3323019 },
              "1618473000000": { value: 3323020 },
              "1618473060000": { value: 3323021 },
              "1618473120000": { value: 3323022 },
              "1618473180000": { value: 3323023 },
              "1618473240000": { value: 3323024 },
              "1618473300000": { value: 3323025 },
              "1618473360000": { value: 3323026 },
              "1618473420000": { value: 3323027 },
              "1618473480000": { value: 3323028 },
              "1618473540000": { value: 3323029 },
              "1618473600000": { value: 3323030 },
              "1618473660000": { value: 3323031 },
              "1618473720000": { value: 3323032 },
              "1618473780000": { value: 3323033 },
              "1618473840000": { value: 3323034 },
              "1618473900000": { value: 3323035 },
              "1618473960000": { value: 3323036 },
              "1618474020000": { value: 3323037 },
              "1618474080000": { value: 3323038 },
              "1618474140000": { value: 3323039 },
              "1618474200000": { value: 3323040 },
              "1618474260000": { value: 3323041 },
              "1618474320000": { value: 3323042 },
              "1618474380000": { value: 3323043 },
              "1618474440000": { value: 3323044 },
              "1618474500000": { value: 3323045 },
            },
          },
          aspect333: {
            variable3331: {
              "1618471800000": { value: 3331000 },
              "1618471860000": { value: 3331001 },
              "1618471920000": { value: 3331002 },
              "1618471980000": { value: 3331003 },
              "1618472040000": { value: 3331004 },
              "1618472100000": { value: 3331005 },
              "1618472160000": { value: 3331006 },
              "1618472220000": { value: 3331007 },
              "1618472280000": { value: 3331008 },
              "1618472340000": { value: 3331009 },
              "1618472400000": { value: 3331010 },
              "1618472460000": { value: 3331011 },
              "1618472520000": { value: 3331012 },
              "1618472580000": { value: 3331013 },
              "1618472640000": { value: 3331014 },
              "1618472700000": { value: 3331015 },
              "1618472760000": { value: 3331016 },
              "1618472820000": { value: 3331017 },
              "1618472880000": { value: 3331018 },
              "1618472940000": { value: 3331019 },
              "1618473000000": { value: 3331020 },
              "1618473060000": { value: 3331021 },
              "1618473120000": { value: 3331022 },
              "1618473180000": { value: 3331023 },
              "1618473240000": { value: 3331024 },
              "1618473300000": { value: 3331025 },
              "1618473360000": { value: 3331026 },
              "1618473420000": { value: 3331027 },
              "1618473480000": { value: 3331028 },
              "1618473540000": { value: 3331029 },
              "1618473600000": { value: 3331030 },
              "1618473660000": { value: 3331031 },
              "1618473720000": { value: 3331032 },
              "1618473780000": { value: 3331033 },
              "1618473840000": { value: 3331034 },
              "1618473900000": { value: 3331035 },
              "1618473960000": { value: 3331036 },
              "1618474020000": { value: 3331037 },
              "1618474080000": { value: 3331038 },
              "1618474140000": { value: 3331039 },
              "1618474200000": { value: 3331040 },
              "1618474260000": { value: 3331041 },
              "1618474320000": { value: 3331042 },
              "1618474380000": { value: 3331043 },
              "1618474440000": { value: 3331044 },
              "1618474500000": { value: 3331045 },
            },
            variable3332: {
              "1618471800000": { value: 3332000 },
              "1618471860000": { value: 3332001 },
              "1618471920000": { value: 3332002 },
              "1618471980000": { value: 3332003 },
              "1618472040000": { value: 3332004 },
              "1618472100000": { value: 3332005 },
              "1618472160000": { value: 3332006 },
              "1618472220000": { value: 3332007 },
              "1618472280000": { value: 3332008 },
              "1618472340000": { value: 3332009 },
              "1618472400000": { value: 3332010 },
              "1618472460000": { value: 3332011 },
              "1618472520000": { value: 3332012 },
              "1618472580000": { value: 3332013 },
              "1618472640000": { value: 3332014 },
              "1618472700000": { value: 3332015 },
              "1618472760000": { value: 3332016 },
              "1618472820000": { value: 3332017 },
              "1618472880000": { value: 3332018 },
              "1618472940000": { value: 3332019 },
              "1618473000000": { value: 3332020 },
              "1618473060000": { value: 3332021 },
              "1618473120000": { value: 3332022 },
              "1618473180000": { value: 3332023 },
              "1618473240000": { value: 3332024 },
              "1618473300000": { value: 3332025 },
              "1618473360000": { value: 3332026 },
              "1618473420000": { value: 3332027 },
              "1618473480000": { value: 3332028 },
              "1618473540000": { value: 3332029 },
              "1618473600000": { value: 3332030 },
              "1618473660000": { value: 3332031 },
              "1618473720000": { value: 3332032 },
              "1618473780000": { value: 3332033 },
              "1618473840000": { value: 3332034 },
              "1618473900000": { value: 3332035 },
              "1618473960000": { value: 3332036 },
              "1618474020000": { value: 3332037 },
              "1618474080000": { value: 3332038 },
              "1618474140000": { value: 3332039 },
              "1618474200000": { value: 3332040 },
              "1618474260000": { value: 3332041 },
              "1618474320000": { value: 3332042 },
              "1618474380000": { value: 3332043 },
              "1618474440000": { value: 3332044 },
              "1618474500000": { value: 3332045 },
            },
            variable3333: {
              "1618471800000": { value: 3333000 },
              "1618471860000": { value: 3333001 },
              "1618471920000": { value: 3333002 },
              "1618471980000": { value: 3333003 },
              "1618472040000": { value: 3333004 },
              "1618472100000": { value: 3333005 },
              "1618472160000": { value: 3333006 },
              "1618472220000": { value: 3333007 },
              "1618472280000": { value: 3333008 },
              "1618472340000": { value: 3333009 },
              "1618472400000": { value: 3333010 },
              "1618472460000": { value: 3333011 },
              "1618472520000": { value: 3333012 },
              "1618472580000": { value: 3333013 },
              "1618472640000": { value: 3333014 },
              "1618472700000": { value: 3333015 },
              "1618472760000": { value: 3333016 },
              "1618472820000": { value: 3333017 },
              "1618472880000": { value: 3333018 },
              "1618472940000": { value: 3333019 },
              "1618473000000": { value: 3333020 },
              "1618473060000": { value: 3333021 },
              "1618473120000": { value: 3333022 },
              "1618473180000": { value: 3333023 },
              "1618473240000": { value: 3333024 },
              "1618473300000": { value: 3333025 },
              "1618473360000": { value: 3333026 },
              "1618473420000": { value: 3333027 },
              "1618473480000": { value: 3333028 },
              "1618473540000": { value: 3333029 },
              "1618473600000": { value: 3333030 },
              "1618473660000": { value: 3333031 },
              "1618473720000": { value: 3333032 },
              "1618473780000": { value: 3333033 },
              "1618473840000": { value: 3333034 },
              "1618473900000": { value: 3333035 },
              "1618473960000": { value: 3333036 },
              "1618474020000": { value: 3333037 },
              "1618474080000": { value: 3333038 },
              "1618474140000": { value: 3333039 },
              "1618474200000": { value: 3333040 },
              "1618474260000": { value: 3333041 },
              "1618474320000": { value: 3333042 },
              "1618474380000": { value: 3333043 },
              "1618474440000": { value: 3333044 },
              "1618474500000": { value: 3333045 },
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
    //Clear MindSphere token manager
    clearMindSphereTokenManagerInstanceMock();

    //Clearing MindSphereServices
    (MindSphereFileService as any)._instance = null;
    (MindSphereTimeSeriesService as any)._instance = null;
    (MindSphereUserService as any)._instance = null;
    (MindSphereUserGroupService as any)._instance = null;
    (MindSphereAssetService as any)._instance = null;

    //Clearing sending mails and notification
    (MailSender as any)._instance = null;
    (NotificationManager as any)._instance = null;

    //Clearing app manager
    (MindSphereAppsManager as any)._instance = null;

    //Clearing all services
    (CustomServiceManager as any)._instance = null;

    //Reseting throwing by webpush and nodemailer
    (webpush as any).__setThrowOnNotification(null);
    (nodemailer as any).__setThrowOnEmail(null);

    //stopping the server if exists
    if (server != null) await server.close();

    jest.clearAllMocks();
  });

  const beforeExec = async () => {
    //Setting current date
    MockDate.set(tickId);

    await mockMindSphereTokenManager();
    await mockMsFileService(fileServiceContent);
    await mockMsTimeSeriesService(timeseriesServiceContent);
    await mockMsUserGroupService(userGroupServiceContent);
    await mockMsUserService(userServiceContent);
    await mockMsAssetService(assetServiceContent);

    //Starting the app
    server = await appStart(__dirname);
  };

  describe("GET /me/:plantId", () => {
    //Inputs
    let requestHeaders: any;
    let userPayload: MindSphereUserJWTData;
    let plantId: string;

    //Ouputs
    let expectedValidCall: boolean;
    let expectedResponseCode: number;
    let expectedErrorText: string | null;
    let expectedResponsePayload: any;

    beforeEach(() => {
      //Inputs
      plantId = "testPlant5";
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

      //Outputs
      expectedValidCall = true;
      expectedResponseCode = 200;
      expectedErrorText = null;
      expectedResponsePayload = [
        {
          config:
            fileServiceContent["hostTenant"]["testServiceContainerAssetId"][
              "testLoadmonitoringServiceId1.service.config.json"
            ],
          data: {
            alertActive: false,
            alertPoints: [],
            historicalPoints: [],
            initTickId: 1618474020,
            initialized: true,
            lastRefreshTickId: null,
            predictedEnergy: 0,
            predictedPoints: [],
            predictedPower: 0,
            warningActive: false,
            warningPoints: [],
          },
        },
        {
          config:
            fileServiceContent["hostTenant"]["testServiceContainerAssetId"][
              "testLoadmonitoringServiceId2.service.config.json"
            ],
          data: {
            alertActive: false,
            alertPoints: [],
            historicalPoints: [],
            initTickId: 1618474020,
            initialized: true,
            lastRefreshTickId: null,
            predictedEnergy: 0,
            predictedPoints: [],
            predictedPower: 0,
            warningActive: false,
            warningPoints: [],
          },
        },
      ];
    });

    let exec = async () => {
      await beforeExec();

      return request(server)
        .get(`/customApi/service/me/${plantId}`)
        .set(requestHeaders)
        .send();
    };

    let testServicesGet = async () => {
      let result = await exec();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(expectedResponseCode);

      if (expectedValidCall) {
        let expectedPayload = expectedResponsePayload;

        expect(result.body).toEqual(expectedPayload);
      } else {
        expect(result.text).toEqual(expectedErrorText);
      }

      //#endregion ===== CHECKING RESPONSE =====
    };

    it("should return 200 and payload of all services for given tenant and plant", async () => {
      await testServicesGet();
    });

    it("should return 200 and payload of one service - if only one service exists for given plantId", async () => {
      //Inputs
      fileServiceContent["hostTenant"]["testServiceContainerAssetId"][
        "testLoadmonitoringServiceId2.service.config.json"
      ].plantId = "testPlant6";

      //Outputs
      expectedResponsePayload = [expectedResponsePayload[0]];

      await testServicesGet();
    });

    it("should return 200 and payload with empty array - if there are no services for given plantId", async () => {
      plantId = "testPlant6";

      //Outputs
      expectedResponsePayload = [];

      await testServicesGet();
    });

    it("should return 200 and payload with empty array - if there are no services for given app - tenant app calls API, subtenant has services", async () => {
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
      plantId = "testPlant2";

      //Outputs
      expectedResponsePayload = [];

      await testServicesGet();
    });

    it("should return 200 and payload with empty array - if there are no services for given app - subtenant app calls API, tenant has services", async () => {
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

      //Inputs
      fileServiceContent["hostTenant"]["testServiceContainerAssetId"][
        "testLoadmonitoringServiceId1.service.config.json"
      ].appId = "ten-testTenant2";
      fileServiceContent["hostTenant"]["testServiceContainerAssetId"][
        "testLoadmonitoringServiceId2.service.config.json"
      ].appId = "ten-testTenant2";

      //Outputs
      expectedResponsePayload = [];

      await testServicesGet();
    });

    it("should return 200 and payload with empty array - if there are no services for given app -  subtenant app calls API, other subtenant has services", async () => {
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

      //Inputs
      (fileServiceContent["hostTenant"]["testServiceContainerAssetId"][
        "testLoadmonitoringServiceId1.service.config.json"
      ].appId = "ten-testTenant1-sub-subtenant1"),
        (fileServiceContent["hostTenant"]["testServiceContainerAssetId"][
          "testLoadmonitoringServiceId2.service.config.json"
        ].appId = "ten-testTenant1-sub-subtenant1");

      //Outputs
      expectedResponsePayload = [];

      await testServicesGet();
    });

    it("should return 200 but not fetch other services - if services have not been fetched before", async () => {
      let oldServices =
        fileServiceContent["hostTenant"]["testServiceContainerAssetId"];
      fileServiceContent["hostTenant"]["testServiceContainerAssetId"] = [];

      await beforeExec();

      fileServiceContent["hostTenant"][
        "testServiceContainerAssetId"
      ] = oldServices;
      setFileServiceContent(fileServiceContent);

      let result = await request(server)
        .get(`/customApi/service/me/${plantId}`)
        .set(requestHeaders)
        .send();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(200);

      expect(result.body).toEqual([]);

      //#endregion ===== CHECKING RESPONSE =====

      //#region ===== CHECKING API CALLS =====

      //48 x user and app data + 2 x subscription
      expect(getFileContent).toHaveBeenCalledTimes(50);

      //#endregion ===== CHECKING API CALLS =====
    });

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should return 404 - if there is no plant of given id", async () => {
      plantId = "fakePlant";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant does not exist!";

      await testServicesGet();
    });

    it("should return 404 - if there is no plant's data for given plantId but it exists in user's permissions", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${plantId}.plant.config.json`
      ];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant does not exist!";

      await testServicesGet();
    });

    it("should return 404 - if user is a local user without local access to given plant", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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
      expectedErrorText = "Plant does not exist!";

      await testServicesGet();
    });

    it("should return 404 - if user is a local admin without local access to given plant", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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
      expectedErrorText = "Plant does not exist!";

      await testServicesGet();
    });

    it("should return 200 - if user is a global user without local access to given plant", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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

      await testServicesGet();
    });

    it("should return 200 - if user is a global admin without local access to given plant", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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

      await testServicesGet();
    });

    it("should return 200 - if user is a local user with user access to the plant", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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

      await testServicesGet();
    });

    it("should return 200 - if user is a local admin with user access to the plant", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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

      await testServicesGet();
    });

    it("should return 200 - if user is a global user with user access to the plant", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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

      await testServicesGet();
    });

    it("should return 200 - if user is a global admin with user access to the plant", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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

      await testServicesGet();
    });

    it("should return 200 - if user is a local admin with admin access to the plant", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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

      await testServicesGet();
    });

    it("should return 200 - if user is a global admin with admin access to the plant", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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

      await testServicesGet();
    });

    it("should return 404 - if user is a local user with invalid user role", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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
      expectedErrorText = "Plant does not exist!";

      await testServicesGet();
    });

    it("should return 404 - if user is a local admin with invalid user role", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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
      expectedErrorText = "Plant does not exist!";

      await testServicesGet();
    });

    it("should return 200 - if user is a global user with invalid user role", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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

      await testServicesGet();
    });

    it("should return 200 - if user is a global admin with invalid user role", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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

      await testServicesGet();
    });

    it("should return 403 and not get services - if user's jwt payload does not have tenant assigned", async () => {
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

      await testServicesGet();
    });

    it("should return 403 and not get services - if there is no application of given id", async () => {
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

      await testServicesGet();
    });

    it("should return 403 and not get services - if user has no access to given app", async () => {
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

      await testServicesGet();
    });

    it("should return 403 and not get services - if there is no application data for given app", async () => {
      delete fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["main.app.config.json"];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Main application settings not found for the user!";

      await testServicesGet();
    });

    it("should return 403 and not get services - if user has invalid role", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

      //Adding user to file service for the app
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.role = 99;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global user or admin or local user or admin!";

      await testServicesGet();
    });

    it("should return 403 and not get services - if user has invalid scope", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["fakeScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22@user.name",
      };

      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Forbidden access. No scope found to access the app!";

      await testServicesGet();
    });

    it("should return 403 and not get services - if user has valid scope, doest not exist in user service but exists in file service", async () => {
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

      await testServicesGet();
    });

    it("should return 403 and not get services - if user has valid scope, exists in user service but does not exist in file service", async () => {
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

      await testServicesGet();
    });

    it("should return 401 - if authorization token is invalid - no bearer prefix", async () => {
      requestHeaders["authorization"] = jwt.sign(userPayload, "testPrivateKey");

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";

      await testServicesGet();
    });

    it("should return 401 - if authorization token is invalid - invalid token", async () => {
      requestHeaders["authorization"] =
        "Bearer thisIsTheFakeValueOfTheJWTToken";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";

      await testServicesGet();
    });

    it("should return 401 - if authorization token is invalid - no token provided", async () => {
      delete requestHeaders["authorization"];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";

      await testServicesGet();
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========
  });

  describe("GET /me/:plantId/:serviceId", () => {
    //Inputs
    let requestHeaders: any;
    let userPayload: MindSphereUserJWTData;
    let plantId: string;
    let serviceId: string;

    //Ouputs
    let expectedValidCall: boolean;
    let expectedResponseCode: number;
    let expectedErrorText: string | null;
    let expectedResponsePayload: any;

    beforeEach(() => {
      //Inputs
      plantId = "testPlant5";
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
      serviceId = "testLoadmonitoringServiceId2";

      //Outputs
      expectedValidCall = true;
      expectedResponseCode = 200;
      expectedErrorText = null;
      expectedResponsePayload = {
        config:
          fileServiceContent["hostTenant"]["testServiceContainerAssetId"][
            "testLoadmonitoringServiceId2.service.config.json"
          ],
        data: {
          alertActive: false,
          alertPoints: [],
          historicalPoints: [],
          initTickId: 1618474020,
          initialized: true,
          lastRefreshTickId: null,
          predictedEnergy: 0,
          predictedPoints: [],
          predictedPower: 0,
          warningActive: false,
          warningPoints: [],
        },
      };
    });

    let exec = async () => {
      await beforeExec();

      return request(server)
        .get(`/customApi/service/me/${plantId}/${serviceId}`)
        .set(requestHeaders)
        .send();
    };

    let testServiceGet = async () => {
      let result = await exec();

      //#region ===== CHECKING RESPONSE =====

      expect(result.status).toEqual(expectedResponseCode);

      if (expectedValidCall) {
        let expectedPayload = expectedResponsePayload;

        expect(result.body).toEqual(expectedPayload);
      } else {
        expect(result.text).toEqual(expectedErrorText);
      }

      //#endregion ===== CHECKING RESPONSE =====
    };

    it("should return 200 and payload of given service", async () => {
      await testServiceGet();
    });

    it("should return 404 - if there is no service of given id", async () => {
      //Inputs
      delete fileServiceContent["hostTenant"]["testServiceContainerAssetId"][
        "testLoadmonitoringServiceId2.service.config.json"
      ];

      //Outputs
      expectedResponseCode = 404;
      expectedValidCall = false;
      expectedErrorText = "Service not found!";

      await testServiceGet();
    });

    it("should return 404 - if there is no plant of given id", async () => {
      //Inputs
      plantId = "fakePlant";

      //Outputs
      expectedResponseCode = 404;
      expectedValidCall = false;
      expectedErrorText = "Plant does not exist!";

      await testServiceGet();
    });

    it("should return 404 - if tenant tries to access subtenant's service with plantId of subtenant", async () => {
      //Inputs
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
      expectedResponseCode = 404;
      expectedValidCall = false;
      expectedErrorText = "Plant does not exist!";

      await testServiceGet();
    });

    it("should return 404 - if tenant tries to access subtenant's service with plantId of tenant", async () => {
      //Inputs
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
      plantId = "testPlant2";

      //Outputs
      expectedResponseCode = 404;
      expectedValidCall = false;
      expectedErrorText = "Service not found!";

      await testServiceGet();
    });

    it("should return 404 - if subtenant tries to access tenant's service with plantId of subtenant", async () => {
      //Inputs
      fileServiceContent["hostTenant"]["testServiceContainerAssetId"][
        "testLoadmonitoringServiceId1.service.config.json"
      ].appId = "ten-testTenant2";
      fileServiceContent["hostTenant"]["testServiceContainerAssetId"][
        "testLoadmonitoringServiceId2.service.config.json"
      ].appId = "ten-testTenant2";

      //Outputs
      expectedResponseCode = 404;
      expectedValidCall = false;
      expectedErrorText = "Service not found!";

      await testServiceGet();
    });

    it("should return 404 - if subtenant tries to access tenant's service with plantId of tenant", async () => {
      //Inputs
      fileServiceContent["hostTenant"]["testServiceContainerAssetId"][
        "testLoadmonitoringServiceId1.service.config.json"
      ].appId = "ten-testTenant2";
      fileServiceContent["hostTenant"]["testServiceContainerAssetId"][
        "testLoadmonitoringServiceId2.service.config.json"
      ].appId = "ten-testTenant2";
      plantId = "testPlant2";

      //Outputs
      expectedResponseCode = 404;
      expectedValidCall = false;
      expectedErrorText = "Plant does not exist!";

      await testServiceGet();
    });

    it("should return 404  and not fetch the service - if service exists only in MindSphere", async () => {
      let oldServices = cloneObject(
        fileServiceContent["hostTenant"]["testServiceContainerAssetId"]
      );

      delete fileServiceContent["hostTenant"]["testServiceContainerAssetId"][
        "testLoadmonitoringServiceId2.service.config.json"
      ];

      await beforeExec();

      fileServiceContent["hostTenant"][
        "testServiceContainerAssetId"
      ] = oldServices;

      let result = await request(server)
        .get(`/customApi/service/me/${plantId}/${serviceId}`)
        .set(requestHeaders)
        .send();

      expect(result.status).toEqual(404);

      expect(result.text).toEqual("Service not found!");

      //48 - app and user data, 2 x - subscriptions, 1 x service
      expect(getFileContent).toHaveBeenCalledTimes(51);
    });

    //#region ========== AUTHORIZATION AND AUTHENTICATION ==========

    it("should return 404 - if there is no plant of given id", async () => {
      plantId = "fakePlant";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant does not exist!";

      await testServiceGet();
    });

    it("should return 404 - if there is no plant's data for given plantId but it exists in user's permissions", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

      delete fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `${plantId}.plant.config.json`
      ];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 404;
      expectedErrorText = "Plant does not exist!";

      await testServiceGet();
    });

    it("should return 404 - if user is a local user without local access to given plant", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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
      expectedErrorText = "Plant does not exist!";

      await testServiceGet();
    });

    it("should return 404 - if user is a local admin without local access to given plant", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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
      expectedErrorText = "Plant does not exist!";

      await testServiceGet();
    });

    it("should return 200 - if user is a global user without local access to given plant", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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

      await testServiceGet();
    });

    it("should return 200 - if user is a global admin without local access to given plant", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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

      await testServiceGet();
    });

    it("should return 200 - if user is a local user with user access to the plant", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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

      await testServiceGet();
    });

    it("should return 200 - if user is a local admin with user access to the plant", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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

      await testServiceGet();
    });

    it("should return 200 - if user is a global user with user access to the plant", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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

      await testServiceGet();
    });

    it("should return 200 - if user is a global admin with user access to the plant", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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

      await testServiceGet();
    });

    it("should return 200 - if user is a local admin with admin access to the plant", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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

      await testServiceGet();
    });

    it("should return 200 - if user is a global admin with admin access to the plant", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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

      await testServiceGet();
    });

    it("should return 404 - if user is a local user with invalid user role", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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
      expectedErrorText = "Plant does not exist!";

      await testServiceGet();
    });

    it("should return 404 - if user is a local admin with invalid user role", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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
      expectedErrorText = "Plant does not exist!";

      await testServiceGet();
    });

    it("should return 200 - if user is a global user with invalid user role", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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

      await testServiceGet();
    });

    it("should return 200 - if user is a global admin with invalid user role", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

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

      await testServiceGet();
    });

    it("should return 403 and not get services - if user's jwt payload does not have tenant assigned", async () => {
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

      await testServiceGet();
    });

    it("should return 403 and not get services - if there is no application of given id", async () => {
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

      await testServiceGet();
    });

    it("should return 403 and not get services - if user has no access to given app", async () => {
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

      await testServiceGet();
    });

    it("should return 403 and not get services - if there is no application data for given app", async () => {
      delete fileServiceContent["hostTenant"][
        "ten-testTenant2-sub-subtenant2-asset-id"
      ]["main.app.config.json"];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. Main application settings not found for the user!";

      await testServiceGet();
    });

    it("should return 403 and not get services - if user has invalid role", async () => {
      let appId = getAppIdFromUserPaylad(userPayload);

      //Adding user to file service for the app
      fileServiceContent["hostTenant"][`${appId}-asset-id`][
        `testGlobalAdmin22.user.config.json`
      ].permissions.role = 99;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText =
        "Access denied. User must be a global user or admin or local user or admin!";

      await testServiceGet();
    });

    it("should return 403 and not get services - if user has invalid scope", async () => {
      userPayload = {
        client_id: "testGlobalAdminClientId",
        email: "testGlobalAdminEmail",
        scope: ["fakeScope"],
        ten: "testTenant2",
        user_name: "test_global_admin_22@user.name",
      };

      requestHeaders["authorization"] = `Bearer ${jwt.sign(
        userPayload,
        "testPrivateKey"
      )}`;

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 403;
      expectedErrorText = "Forbidden access. No scope found to access the app!";

      await testServiceGet();
    });

    it("should return 403 and not get services - if user has valid scope, doest not exist in user service but exists in file service", async () => {
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

      await testServiceGet();
    });

    it("should return 403 and not get services - if user has valid scope, exists in user service but does not exist in file service", async () => {
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

      await testServiceGet();
    });

    it("should return 401 - if authorization token is invalid - no bearer prefix", async () => {
      requestHeaders["authorization"] = jwt.sign(userPayload, "testPrivateKey");

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";

      await testServiceGet();
    });

    it("should return 401 - if authorization token is invalid - invalid token", async () => {
      requestHeaders["authorization"] =
        "Bearer thisIsTheFakeValueOfTheJWTToken";

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";

      await testServiceGet();
    });

    it("should return 401 - if authorization token is invalid - no token provided", async () => {
      delete requestHeaders["authorization"];

      //Outputs
      expectedValidCall = false;
      expectedResponseCode = 401;
      expectedErrorText =
        "Access denied. No token provided to fetch the user or token is invalid!";

      await testServiceGet();
    });

    //#endregion ========== AUTHORIZATION AND AUTHENTICATION ==========
  });
});

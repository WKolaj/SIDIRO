import { MindSphereTokenManager } from "../../../../classes/MindSphereService/MindSphereToken/MindSphereTokenManager";
import axios from "axios";
import MockDate from "mockdate";
import {
  setPrivateProperty,
  testPrivateProperty,
} from "../../../testUtilities";
import { encodeBase64 } from "../../../../utilities/utilities";
import {
  MindSphereUserService,
  MindSphereUserData,
} from "../../../../classes/MindSphereService/MindSphereUserService";

let mockedAxios = axios as any;

describe("MindSphereUserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    //Reseting static class
    (MindSphereTokenManager as any)._instances = {};
    (MindSphereUserService as any)._instance = null;

    //Reseting axios
    mockedAxios.__reset();
  });

  afterEach(() => {
    jest.clearAllMocks();

    //Reseting static class
    (MindSphereTokenManager as any)._instances = {};
    (MindSphereUserService as any)._instance = null;

    //Reseting axios
    mockedAxios.__reset();
  });

  describe("getInstance", () => {
    let exec = () => {
      return MindSphereUserService.getInstance();
    };

    it("should return valid instance of MindSphereUserService", () => {
      let result = exec();

      expect(result).not.toEqual(null);
      expect(result instanceof MindSphereUserService).toEqual(true);
    });

    it("should return the same instance of MindSphereAssetService if called several times", () => {
      let result1 = exec();
      let result2 = exec();
      let result3 = exec();

      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
      expect(result3).toEqual(result1);
    });

    it("should properly set main url of MindSphere timeseries API", () => {
      let result = exec();

      testPrivateProperty(
        result,
        "_url",
        `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`
      );
    });

    it("should set max number of get users per one api call to 100", () => {
      let result = exec();

      testPrivateProperty(result, "_maxNumberOfUserPerOneCall", 100);
    });
  });

  describe("getAllUsers", () => {
    let tenantName: string;
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereUserService: MindSphereUserService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let maxNumberOfUsersPerOneCall: number;
    let subtenantId: string | null;
    let userId: string | null;
    let userName: string | null;

    beforeEach(() => {
      maxNumberOfUsersPerOneCall = 3;

      mockedReturnDataCollection = [
        {
          resources: [
            {
              id: "testUser1Id",
              userName: "testUserName1",
              name: {
                familyName: "testUserFamilyName1",
                givenName: "testUserGivenName1",
              },
              emails: [
                { value: "testUserName1@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup1",
                  display: "mdsp_usergroup:testUserGroup1",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser2Id",
              userName: "testUserName2",
              name: {
                familyName: "testUserFamilyName2",
                givenName: "testUserGivenName2",
              },
              emails: [
                { value: "testUserName2@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup1",
                  display: "mdsp_usergroup:testUserGroup1",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser3Id",
              userName: "testUserName3",
              name: {
                familyName: "testUserFamilyName3",
                givenName: "testUserGivenName3",
              },
              emails: [
                { value: "testUserName3@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup3",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
          ],
          startIndex: 1,
          itemsPerPage: 3,
          totalResults: 8,
        },
        {
          resources: [
            {
              id: "testUser4Id",
              userName: "testUserName4",
              name: {
                familyName: "testUserFamilyName4",
                givenName: "testUserGivenName4",
              },
              emails: [
                { value: "testUserName4@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup3",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser5Id",
              userName: "testUserName5",
              name: {
                familyName: "testUserFamilyName5",
                givenName: "testUserGivenName5",
              },
              emails: [
                { value: "testUserName5@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup3",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup4",
                  display: "mdsp_usergroup:testUserGroup4",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser6Id",
              userName: "testUserName6",
              name: {
                familyName: "testUserFamilyName6",
                givenName: "testUserGivenName6",
              },
              emails: [
                { value: "testUserName6@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup4",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup4",
                  display: "mdsp_usergroup:testUserGroup5",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
          ],
          startIndex: 4,
          itemsPerPage: 3,
          totalResults: 8,
        },
        {
          resources: [
            {
              id: "testUser7Id",
              userName: "testUserName7",
              name: {
                familyName: "testUserFamilyName7",
                givenName: "testUserGivenName7",
              },
              emails: [
                { value: "testUserName7@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup4",
                  display: "mdsp_usergroup:testUserGroup4",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup5",
                  display: "mdsp_usergroup:testUserGroup5",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser8Id",
              userName: "testUserName8",
              name: {
                familyName: "testUserFamilyName8",
                givenName: "testUserGivenName8",
              },
              emails: [
                { value: "testUserName8@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup4",
                  display: "mdsp_usergroup:testUserGroup4",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup5",
                  display: "mdsp_usergroup:testUserGroup5",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
          ],
          startIndex: 7,
          itemsPerPage: 3,
          totalResults: 8,
        },
      ];
      mockedReturnStatusCollection = [200, 200, 200];
      mockedReturnHeadersCollection = [{}, {}, {}];
      mockedAuthToken = "testAuthToken1234";
      mockedAuthTokenElapsedTime = 1612184400000;
      mockedNow = 1612098060000;
      tenantName = "testTenantName";
      subtenantId = null;
      userId = null;
      userName = null;
    });

    let exec = async () => {
      //Mocking Token Manager
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance(
        tenantName
      ) as any;
      mockedMindSphereTokenManager._token = mockedAuthToken;
      mockedMindSphereTokenManager._tokenExpireUnixDate = mockedAuthTokenElapsedTime;

      //Getting instance of service
      mindSphereUserService = MindSphereUserService.getInstance();

      setPrivateProperty(
        mindSphereUserService,
        "_maxNumberOfUserPerOneCall",
        maxNumberOfUsersPerOneCall
      );

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereUserService.getAllUsers(
        tenantName,
        subtenantId,
        userId,
        userName
      );
    };

    it("should MindSphere Get Users Indexable API and return all users", async () => {
      let result = await exec();

      let expectedPayload = [
        {
          id: "testUser1Id",
          userName: "testUserName1",
          name: {
            familyName: "testUserFamilyName1",
            givenName: "testUserGivenName1",
          },
          emails: [{ value: "testUserName1@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser2Id",
          userName: "testUserName2",
          name: {
            familyName: "testUserFamilyName2",
            givenName: "testUserGivenName2",
          },
          emails: [{ value: "testUserName2@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser3Id",
          userName: "testUserName3",
          name: {
            familyName: "testUserFamilyName3",
            givenName: "testUserGivenName3",
          },
          emails: [{ value: "testUserName3@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser4Id",
          userName: "testUserName4",
          name: {
            familyName: "testUserFamilyName4",
            givenName: "testUserGivenName4",
          },
          emails: [{ value: "testUserName4@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser5Id",
          userName: "testUserName5",
          name: {
            familyName: "testUserFamilyName5",
            givenName: "testUserGivenName5",
          },
          emails: [{ value: "testUserName5@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser6Id",
          userName: "testUserName6",
          name: {
            familyName: "testUserFamilyName6",
            givenName: "testUserGivenName6",
          },
          emails: [{ value: "testUserName6@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser7Id",
          userName: "testUserName7",
          name: {
            familyName: "testUserFamilyName7",
            givenName: "testUserGivenName7",
          },
          emails: [{ value: "testUserName7@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup5",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser8Id",
          userName: "testUserName8",
          name: {
            familyName: "testUserFamilyName8",
            givenName: "testUserGivenName8",
          },
          emails: [{ value: "testUserName8@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup5",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
      ];

      expect(result).toEqual(expectedPayload);

      //Call three times - for every user indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 1,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 4,
        },
      });

      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 7,
        },
      });
    });

    it("should MindSphere Get Users Indexable API and return all users - if number of users is the same as maximum users per call ", async () => {
      maxNumberOfUsersPerOneCall = 8;

      mockedReturnDataCollection = [
        {
          resources: [
            {
              id: "testUser1Id",
              userName: "testUserName1",
              name: {
                familyName: "testUserFamilyName1",
                givenName: "testUserGivenName1",
              },
              emails: [
                { value: "testUserName1@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup1",
                  display: "mdsp_usergroup:testUserGroup1",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser2Id",
              userName: "testUserName2",
              name: {
                familyName: "testUserFamilyName2",
                givenName: "testUserGivenName2",
              },
              emails: [
                { value: "testUserName2@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup1",
                  display: "mdsp_usergroup:testUserGroup1",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser3Id",
              userName: "testUserName3",
              name: {
                familyName: "testUserFamilyName3",
                givenName: "testUserGivenName3",
              },
              emails: [
                { value: "testUserName3@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup3",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser4Id",
              userName: "testUserName4",
              name: {
                familyName: "testUserFamilyName4",
                givenName: "testUserGivenName4",
              },
              emails: [
                { value: "testUserName4@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup3",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser5Id",
              userName: "testUserName5",
              name: {
                familyName: "testUserFamilyName5",
                givenName: "testUserGivenName5",
              },
              emails: [
                { value: "testUserName5@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup3",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup4",
                  display: "mdsp_usergroup:testUserGroup4",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser6Id",
              userName: "testUserName6",
              name: {
                familyName: "testUserFamilyName6",
                givenName: "testUserGivenName6",
              },
              emails: [
                { value: "testUserName6@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup4",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup4",
                  display: "mdsp_usergroup:testUserGroup5",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser7Id",
              userName: "testUserName7",
              name: {
                familyName: "testUserFamilyName7",
                givenName: "testUserGivenName7",
              },
              emails: [
                { value: "testUserName7@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup4",
                  display: "mdsp_usergroup:testUserGroup4",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup5",
                  display: "mdsp_usergroup:testUserGroup5",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser8Id",
              userName: "testUserName8",
              name: {
                familyName: "testUserFamilyName8",
                givenName: "testUserGivenName8",
              },
              emails: [
                { value: "testUserName8@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup4",
                  display: "mdsp_usergroup:testUserGroup4",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup5",
                  display: "mdsp_usergroup:testUserGroup5",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
          ],
          startIndex: 1,
          itemsPerPage: 8,
          totalResults: 8,
        },
      ];
      mockedReturnStatusCollection = [200];
      mockedReturnHeadersCollection = [{}];

      let result = await exec();

      let expectedPayload = [
        {
          id: "testUser1Id",
          userName: "testUserName1",
          name: {
            familyName: "testUserFamilyName1",
            givenName: "testUserGivenName1",
          },
          emails: [{ value: "testUserName1@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser2Id",
          userName: "testUserName2",
          name: {
            familyName: "testUserFamilyName2",
            givenName: "testUserGivenName2",
          },
          emails: [{ value: "testUserName2@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser3Id",
          userName: "testUserName3",
          name: {
            familyName: "testUserFamilyName3",
            givenName: "testUserGivenName3",
          },
          emails: [{ value: "testUserName3@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser4Id",
          userName: "testUserName4",
          name: {
            familyName: "testUserFamilyName4",
            givenName: "testUserGivenName4",
          },
          emails: [{ value: "testUserName4@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser5Id",
          userName: "testUserName5",
          name: {
            familyName: "testUserFamilyName5",
            givenName: "testUserGivenName5",
          },
          emails: [{ value: "testUserName5@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser6Id",
          userName: "testUserName6",
          name: {
            familyName: "testUserFamilyName6",
            givenName: "testUserGivenName6",
          },
          emails: [{ value: "testUserName6@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser7Id",
          userName: "testUserName7",
          name: {
            familyName: "testUserFamilyName7",
            givenName: "testUserGivenName7",
          },
          emails: [{ value: "testUserName7@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup5",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser8Id",
          userName: "testUserName8",
          name: {
            familyName: "testUserFamilyName8",
            givenName: "testUserGivenName8",
          },
          emails: [{ value: "testUserName8@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup5",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
      ];

      expect(result).toEqual(expectedPayload);

      //Call three times - for every user indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 8,
          sortBy: "id",
          startIndex: 1,
        },
      });
    });

    it("should MindSphere Get Users Indexable API and return all users - if number of users is exactly multiplicity of maximum users per call", async () => {
      maxNumberOfUsersPerOneCall = 3;
      mockedReturnDataCollection = [
        {
          resources: [
            {
              id: "testUser1Id",
              userName: "testUserName1",
              name: {
                familyName: "testUserFamilyName1",
                givenName: "testUserGivenName1",
              },
              emails: [
                { value: "testUserName1@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup1",
                  display: "mdsp_usergroup:testUserGroup1",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser2Id",
              userName: "testUserName2",
              name: {
                familyName: "testUserFamilyName2",
                givenName: "testUserGivenName2",
              },
              emails: [
                { value: "testUserName2@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup1",
                  display: "mdsp_usergroup:testUserGroup1",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser3Id",
              userName: "testUserName3",
              name: {
                familyName: "testUserFamilyName3",
                givenName: "testUserGivenName3",
              },
              emails: [
                { value: "testUserName3@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup3",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
          ],
          startIndex: 1,
          itemsPerPage: 3,
          totalResults: 9,
        },
        {
          resources: [
            {
              id: "testUser4Id",
              userName: "testUserName4",
              name: {
                familyName: "testUserFamilyName4",
                givenName: "testUserGivenName4",
              },
              emails: [
                { value: "testUserName4@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup3",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser5Id",
              userName: "testUserName5",
              name: {
                familyName: "testUserFamilyName5",
                givenName: "testUserGivenName5",
              },
              emails: [
                { value: "testUserName5@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup3",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup4",
                  display: "mdsp_usergroup:testUserGroup4",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser6Id",
              userName: "testUserName6",
              name: {
                familyName: "testUserFamilyName6",
                givenName: "testUserGivenName6",
              },
              emails: [
                { value: "testUserName6@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup4",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup4",
                  display: "mdsp_usergroup:testUserGroup5",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
          ],
          startIndex: 4,
          itemsPerPage: 3,
          totalResults: 9,
        },
        {
          resources: [
            {
              id: "testUser7Id",
              userName: "testUserName7",
              name: {
                familyName: "testUserFamilyName7",
                givenName: "testUserGivenName7",
              },
              emails: [
                { value: "testUserName7@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup4",
                  display: "mdsp_usergroup:testUserGroup4",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup5",
                  display: "mdsp_usergroup:testUserGroup5",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser8Id",
              userName: "testUserName8",
              name: {
                familyName: "testUserFamilyName8",
                givenName: "testUserGivenName8",
              },
              emails: [
                { value: "testUserName8@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup4",
                  display: "mdsp_usergroup:testUserGroup4",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup5",
                  display: "mdsp_usergroup:testUserGroup5",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser9Id",
              userName: "testUserName9",
              name: {
                familyName: "testUserFamilyName9",
                givenName: "testUserGivenName9",
              },
              emails: [
                { value: "testUserName9@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup5",
                  display: "mdsp_usergroup:testUserGroup4",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup6",
                  display: "mdsp_usergroup:testUserGroup5",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
          ],
          startIndex: 7,
          itemsPerPage: 3,
          totalResults: 9,
        },
      ];
      let result = await exec();

      let expectedPayload = [
        {
          id: "testUser1Id",
          userName: "testUserName1",
          name: {
            familyName: "testUserFamilyName1",
            givenName: "testUserGivenName1",
          },
          emails: [{ value: "testUserName1@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser2Id",
          userName: "testUserName2",
          name: {
            familyName: "testUserFamilyName2",
            givenName: "testUserGivenName2",
          },
          emails: [{ value: "testUserName2@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser3Id",
          userName: "testUserName3",
          name: {
            familyName: "testUserFamilyName3",
            givenName: "testUserGivenName3",
          },
          emails: [{ value: "testUserName3@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser4Id",
          userName: "testUserName4",
          name: {
            familyName: "testUserFamilyName4",
            givenName: "testUserGivenName4",
          },
          emails: [{ value: "testUserName4@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser5Id",
          userName: "testUserName5",
          name: {
            familyName: "testUserFamilyName5",
            givenName: "testUserGivenName5",
          },
          emails: [{ value: "testUserName5@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser6Id",
          userName: "testUserName6",
          name: {
            familyName: "testUserFamilyName6",
            givenName: "testUserGivenName6",
          },
          emails: [{ value: "testUserName6@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser7Id",
          userName: "testUserName7",
          name: {
            familyName: "testUserFamilyName7",
            givenName: "testUserGivenName7",
          },
          emails: [{ value: "testUserName7@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup5",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser8Id",
          userName: "testUserName8",
          name: {
            familyName: "testUserFamilyName8",
            givenName: "testUserGivenName8",
          },
          emails: [{ value: "testUserName8@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup5",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser9Id",
          userName: "testUserName9",
          name: {
            familyName: "testUserFamilyName9",
            givenName: "testUserGivenName9",
          },
          emails: [{ value: "testUserName9@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup5",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup6",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
      ];

      expect(result).toEqual(expectedPayload);

      //Call three times - for every user indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 1,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 4,
        },
      });

      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 7,
        },
      });
    });

    it("should MindSphere Get Users Indexable API and return empty array - if there are no users", async () => {
      maxNumberOfUsersPerOneCall = 3;
      mockedReturnDataCollection = [
        {
          resources: [],
          startIndex: 1,
          itemsPerPage: 3,
          totalResults: 0,
        },
      ];
      let result = await exec();

      let expectedPayload: any[] = [];

      expect(result).toEqual(expectedPayload);

      //Call three times - for every user indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 1,
        },
      });
    });

    it("should MindSphere Get Users Indexable API and return empty array - if returned response is null", async () => {
      maxNumberOfUsersPerOneCall = 3;
      mockedReturnDataCollection = [null];
      let result = await exec();

      let expectedPayload: any[] = [];

      expect(result).toEqual(expectedPayload);

      //Call three times - for every user indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 1,
        },
      });
    });

    it("should MindSphere Get Users Indexable API and return empty array - if returned response is empty", async () => {
      maxNumberOfUsersPerOneCall = 3;
      mockedReturnDataCollection = [{}];
      let result = await exec();

      let expectedPayload: any[] = [];

      expect(result).toEqual(expectedPayload);

      //Call three times - for every user indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 1,
        },
      });
    });

    it("should MindSphere Get Users Indexable API and return empty array - if returned response with no start index", async () => {
      maxNumberOfUsersPerOneCall = 3;
      mockedReturnDataCollection = [
        {
          resources: [
            {
              id: "testUser1Id",
              userName: "testUserName1",
              name: {
                familyName: "testUserFamilyName1",
                givenName: "testUserGivenName1",
              },
              emails: [
                { value: "testUserName1@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup1",
                  display: "mdsp_usergroup:testUserGroup1",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser2Id",
              userName: "testUserName2",
              name: {
                familyName: "testUserFamilyName2",
                givenName: "testUserGivenName2",
              },
              emails: [
                { value: "testUserName2@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup1",
                  display: "mdsp_usergroup:testUserGroup1",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser3Id",
              userName: "testUserName3",
              name: {
                familyName: "testUserFamilyName3",
                givenName: "testUserGivenName3",
              },
              emails: [
                { value: "testUserName3@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup3",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
          ],
          itemsPerPage: 3,
          totalResults: 8,
        },
      ];
      let result = await exec();

      let expectedPayload = [
        {
          id: "testUser1Id",
          userName: "testUserName1",
          name: {
            familyName: "testUserFamilyName1",
            givenName: "testUserGivenName1",
          },
          emails: [{ value: "testUserName1@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser2Id",
          userName: "testUserName2",
          name: {
            familyName: "testUserFamilyName2",
            givenName: "testUserGivenName2",
          },
          emails: [{ value: "testUserName2@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser3Id",
          userName: "testUserName3",
          name: {
            familyName: "testUserFamilyName3",
            givenName: "testUserGivenName3",
          },
          emails: [{ value: "testUserName3@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
      ];

      expect(result).toEqual(expectedPayload);

      //Call three times - for every user indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 1,
        },
      });
    });

    it("should MindSphere Get Users Indexable API and return empty array - if returned response with no items per page", async () => {
      maxNumberOfUsersPerOneCall = 3;
      mockedReturnDataCollection = [
        {
          resources: [
            {
              id: "testUser1Id",
              userName: "testUserName1",
              name: {
                familyName: "testUserFamilyName1",
                givenName: "testUserGivenName1",
              },
              emails: [
                { value: "testUserName1@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup1",
                  display: "mdsp_usergroup:testUserGroup1",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser2Id",
              userName: "testUserName2",
              name: {
                familyName: "testUserFamilyName2",
                givenName: "testUserGivenName2",
              },
              emails: [
                { value: "testUserName2@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup1",
                  display: "mdsp_usergroup:testUserGroup1",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser3Id",
              userName: "testUserName3",
              name: {
                familyName: "testUserFamilyName3",
                givenName: "testUserGivenName3",
              },
              emails: [
                { value: "testUserName3@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup3",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
          ],
          startIndex: 1,
          totalResults: 8,
        },
      ];
      let result = await exec();

      let expectedPayload = [
        {
          id: "testUser1Id",
          userName: "testUserName1",
          name: {
            familyName: "testUserFamilyName1",
            givenName: "testUserGivenName1",
          },
          emails: [{ value: "testUserName1@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser2Id",
          userName: "testUserName2",
          name: {
            familyName: "testUserFamilyName2",
            givenName: "testUserGivenName2",
          },
          emails: [{ value: "testUserName2@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser3Id",
          userName: "testUserName3",
          name: {
            familyName: "testUserFamilyName3",
            givenName: "testUserGivenName3",
          },
          emails: [{ value: "testUserName3@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
      ];

      expect(result).toEqual(expectedPayload);

      //Call three times - for every user indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 1,
        },
      });
    });

    it("should MindSphere Get Users Indexable API and return empty array - if returned response with no total results", async () => {
      maxNumberOfUsersPerOneCall = 3;
      mockedReturnDataCollection = [
        {
          resources: [
            {
              id: "testUser1Id",
              userName: "testUserName1",
              name: {
                familyName: "testUserFamilyName1",
                givenName: "testUserGivenName1",
              },
              emails: [
                { value: "testUserName1@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup1",
                  display: "mdsp_usergroup:testUserGroup1",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser2Id",
              userName: "testUserName2",
              name: {
                familyName: "testUserFamilyName2",
                givenName: "testUserGivenName2",
              },
              emails: [
                { value: "testUserName2@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup1",
                  display: "mdsp_usergroup:testUserGroup1",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser3Id",
              userName: "testUserName3",
              name: {
                familyName: "testUserFamilyName3",
                givenName: "testUserGivenName3",
              },
              emails: [
                { value: "testUserName3@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup3",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
          ],
          startIndex: 1,
          itemsPerPage: 3,
        },
      ];
      let result = await exec();

      let expectedPayload = [
        {
          id: "testUser1Id",
          userName: "testUserName1",
          name: {
            familyName: "testUserFamilyName1",
            givenName: "testUserGivenName1",
          },
          emails: [{ value: "testUserName1@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser2Id",
          userName: "testUserName2",
          name: {
            familyName: "testUserFamilyName2",
            givenName: "testUserGivenName2",
          },
          emails: [{ value: "testUserName2@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser3Id",
          userName: "testUserName3",
          name: {
            familyName: "testUserFamilyName3",
            givenName: "testUserGivenName3",
          },
          emails: [{ value: "testUserName3@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
      ];

      expect(result).toEqual(expectedPayload);

      //Call three times - for every user indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 1,
        },
      });
    });

    it("should MindSphere Get Users Indexable API and return all users - if second response returns null", async () => {
      mockedReturnDataCollection = [
        {
          resources: [
            {
              id: "testUser1Id",
              userName: "testUserName1",
              name: {
                familyName: "testUserFamilyName1",
                givenName: "testUserGivenName1",
              },
              emails: [
                { value: "testUserName1@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup1",
                  display: "mdsp_usergroup:testUserGroup1",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser2Id",
              userName: "testUserName2",
              name: {
                familyName: "testUserFamilyName2",
                givenName: "testUserGivenName2",
              },
              emails: [
                { value: "testUserName2@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup1",
                  display: "mdsp_usergroup:testUserGroup1",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser3Id",
              userName: "testUserName3",
              name: {
                familyName: "testUserFamilyName3",
                givenName: "testUserGivenName3",
              },
              emails: [
                { value: "testUserName3@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup3",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
          ],
          startIndex: 1,
          itemsPerPage: 3,
          totalResults: 8,
        },
        null,
        null,
      ];

      mockedReturnStatusCollection = [200, 200, 200];
      mockedReturnHeadersCollection = [{}, {}, {}];

      let result = await exec();

      let expectedPayload = [
        {
          id: "testUser1Id",
          userName: "testUserName1",
          name: {
            familyName: "testUserFamilyName1",
            givenName: "testUserGivenName1",
          },
          emails: [{ value: "testUserName1@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser2Id",
          userName: "testUserName2",
          name: {
            familyName: "testUserFamilyName2",
            givenName: "testUserGivenName2",
          },
          emails: [{ value: "testUserName2@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser3Id",
          userName: "testUserName3",
          name: {
            familyName: "testUserFamilyName3",
            givenName: "testUserGivenName3",
          },
          emails: [{ value: "testUserName3@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
      ];

      expect(result).toEqual(expectedPayload);

      //Call three times - for every user indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 1,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 4,
        },
      });
    });

    it("should MindSphere Get Users Indexable API and return all users - if second response returns empty object", async () => {
      mockedReturnDataCollection = [
        {
          resources: [
            {
              id: "testUser1Id",
              userName: "testUserName1",
              name: {
                familyName: "testUserFamilyName1",
                givenName: "testUserGivenName1",
              },
              emails: [
                { value: "testUserName1@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup1",
                  display: "mdsp_usergroup:testUserGroup1",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser2Id",
              userName: "testUserName2",
              name: {
                familyName: "testUserFamilyName2",
                givenName: "testUserGivenName2",
              },
              emails: [
                { value: "testUserName2@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup1",
                  display: "mdsp_usergroup:testUserGroup1",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser3Id",
              userName: "testUserName3",
              name: {
                familyName: "testUserFamilyName3",
                givenName: "testUserGivenName3",
              },
              emails: [
                { value: "testUserName3@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup3",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
          ],
          startIndex: 1,
          itemsPerPage: 3,
          totalResults: 8,
        },
        {},
        {},
      ];

      mockedReturnStatusCollection = [200, 200, 200];
      mockedReturnHeadersCollection = [{}, {}, {}];

      let result = await exec();

      let expectedPayload = [
        {
          id: "testUser1Id",
          userName: "testUserName1",
          name: {
            familyName: "testUserFamilyName1",
            givenName: "testUserGivenName1",
          },
          emails: [{ value: "testUserName1@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser2Id",
          userName: "testUserName2",
          name: {
            familyName: "testUserFamilyName2",
            givenName: "testUserGivenName2",
          },
          emails: [{ value: "testUserName2@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser3Id",
          userName: "testUserName3",
          name: {
            familyName: "testUserFamilyName3",
            givenName: "testUserGivenName3",
          },
          emails: [{ value: "testUserName3@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
      ];

      expect(result).toEqual(expectedPayload);

      //Call three times - for every user indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 1,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 4,
        },
      });
    });

    it("should MindSphere Get Users Indexable API and return all users - if second response returns response with no start index", async () => {
      mockedReturnDataCollection = [
        {
          resources: [
            {
              id: "testUser1Id",
              userName: "testUserName1",
              name: {
                familyName: "testUserFamilyName1",
                givenName: "testUserGivenName1",
              },
              emails: [
                { value: "testUserName1@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup1",
                  display: "mdsp_usergroup:testUserGroup1",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser2Id",
              userName: "testUserName2",
              name: {
                familyName: "testUserFamilyName2",
                givenName: "testUserGivenName2",
              },
              emails: [
                { value: "testUserName2@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup1",
                  display: "mdsp_usergroup:testUserGroup1",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser3Id",
              userName: "testUserName3",
              name: {
                familyName: "testUserFamilyName3",
                givenName: "testUserGivenName3",
              },
              emails: [
                { value: "testUserName3@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup3",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
          ],
          startIndex: 1,
          itemsPerPage: 3,
          totalResults: 8,
        },
        {
          resources: [
            {
              id: "testUser4Id",
              userName: "testUserName4",
              name: {
                familyName: "testUserFamilyName4",
                givenName: "testUserGivenName4",
              },
              emails: [
                { value: "testUserName4@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup3",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser5Id",
              userName: "testUserName5",
              name: {
                familyName: "testUserFamilyName5",
                givenName: "testUserGivenName5",
              },
              emails: [
                { value: "testUserName5@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup3",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup4",
                  display: "mdsp_usergroup:testUserGroup4",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser6Id",
              userName: "testUserName6",
              name: {
                familyName: "testUserFamilyName6",
                givenName: "testUserGivenName6",
              },
              emails: [
                { value: "testUserName6@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup4",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup4",
                  display: "mdsp_usergroup:testUserGroup5",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
          ],
          itemsPerPage: 3,
          totalResults: 8,
        },
        {},
      ];

      mockedReturnStatusCollection = [200, 200, 200];
      mockedReturnHeadersCollection = [{}, {}, {}];

      let result = await exec();

      let expectedPayload = [
        {
          id: "testUser1Id",
          userName: "testUserName1",
          name: {
            familyName: "testUserFamilyName1",
            givenName: "testUserGivenName1",
          },
          emails: [{ value: "testUserName1@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser2Id",
          userName: "testUserName2",
          name: {
            familyName: "testUserFamilyName2",
            givenName: "testUserGivenName2",
          },
          emails: [{ value: "testUserName2@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser3Id",
          userName: "testUserName3",
          name: {
            familyName: "testUserFamilyName3",
            givenName: "testUserGivenName3",
          },
          emails: [{ value: "testUserName3@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser4Id",
          userName: "testUserName4",
          name: {
            familyName: "testUserFamilyName4",
            givenName: "testUserGivenName4",
          },
          emails: [{ value: "testUserName4@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser5Id",
          userName: "testUserName5",
          name: {
            familyName: "testUserFamilyName5",
            givenName: "testUserGivenName5",
          },
          emails: [{ value: "testUserName5@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser6Id",
          userName: "testUserName6",
          name: {
            familyName: "testUserFamilyName6",
            givenName: "testUserGivenName6",
          },
          emails: [{ value: "testUserName6@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
      ];

      expect(result).toEqual(expectedPayload);

      //Call three times - for every user indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 1,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 4,
        },
      });
    });

    it("should MindSphere Get Users Indexable API and return all users - if second response returns response with no items per page", async () => {
      mockedReturnDataCollection = [
        {
          resources: [
            {
              id: "testUser1Id",
              userName: "testUserName1",
              name: {
                familyName: "testUserFamilyName1",
                givenName: "testUserGivenName1",
              },
              emails: [
                { value: "testUserName1@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup1",
                  display: "mdsp_usergroup:testUserGroup1",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser2Id",
              userName: "testUserName2",
              name: {
                familyName: "testUserFamilyName2",
                givenName: "testUserGivenName2",
              },
              emails: [
                { value: "testUserName2@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup1",
                  display: "mdsp_usergroup:testUserGroup1",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser3Id",
              userName: "testUserName3",
              name: {
                familyName: "testUserFamilyName3",
                givenName: "testUserGivenName3",
              },
              emails: [
                { value: "testUserName3@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup3",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
          ],
          startIndex: 1,
          itemsPerPage: 3,
          totalResults: 8,
        },
        {
          resources: [
            {
              id: "testUser4Id",
              userName: "testUserName4",
              name: {
                familyName: "testUserFamilyName4",
                givenName: "testUserGivenName4",
              },
              emails: [
                { value: "testUserName4@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup3",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser5Id",
              userName: "testUserName5",
              name: {
                familyName: "testUserFamilyName5",
                givenName: "testUserGivenName5",
              },
              emails: [
                { value: "testUserName5@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup3",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup4",
                  display: "mdsp_usergroup:testUserGroup4",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser6Id",
              userName: "testUserName6",
              name: {
                familyName: "testUserFamilyName6",
                givenName: "testUserGivenName6",
              },
              emails: [
                { value: "testUserName6@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup4",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup4",
                  display: "mdsp_usergroup:testUserGroup5",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
          ],
          startIndex: 4,
          totalResults: 8,
        },
        {},
      ];

      mockedReturnStatusCollection = [200, 200, 200];
      mockedReturnHeadersCollection = [{}, {}, {}];

      let result = await exec();

      let expectedPayload = [
        {
          id: "testUser1Id",
          userName: "testUserName1",
          name: {
            familyName: "testUserFamilyName1",
            givenName: "testUserGivenName1",
          },
          emails: [{ value: "testUserName1@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser2Id",
          userName: "testUserName2",
          name: {
            familyName: "testUserFamilyName2",
            givenName: "testUserGivenName2",
          },
          emails: [{ value: "testUserName2@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser3Id",
          userName: "testUserName3",
          name: {
            familyName: "testUserFamilyName3",
            givenName: "testUserGivenName3",
          },
          emails: [{ value: "testUserName3@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser4Id",
          userName: "testUserName4",
          name: {
            familyName: "testUserFamilyName4",
            givenName: "testUserGivenName4",
          },
          emails: [{ value: "testUserName4@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser5Id",
          userName: "testUserName5",
          name: {
            familyName: "testUserFamilyName5",
            givenName: "testUserGivenName5",
          },
          emails: [{ value: "testUserName5@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser6Id",
          userName: "testUserName6",
          name: {
            familyName: "testUserFamilyName6",
            givenName: "testUserGivenName6",
          },
          emails: [{ value: "testUserName6@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
      ];

      expect(result).toEqual(expectedPayload);

      //Call three times - for every user indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 1,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 4,
        },
      });
    });

    it("should MindSphere Get Users Indexable API and return all users - if second response returns response with no total results", async () => {
      mockedReturnDataCollection = [
        {
          resources: [
            {
              id: "testUser1Id",
              userName: "testUserName1",
              name: {
                familyName: "testUserFamilyName1",
                givenName: "testUserGivenName1",
              },
              emails: [
                { value: "testUserName1@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup1",
                  display: "mdsp_usergroup:testUserGroup1",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser2Id",
              userName: "testUserName2",
              name: {
                familyName: "testUserFamilyName2",
                givenName: "testUserGivenName2",
              },
              emails: [
                { value: "testUserName2@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup1",
                  display: "mdsp_usergroup:testUserGroup1",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser3Id",
              userName: "testUserName3",
              name: {
                familyName: "testUserFamilyName3",
                givenName: "testUserGivenName3",
              },
              emails: [
                { value: "testUserName3@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup3",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
          ],
          startIndex: 1,
          itemsPerPage: 3,
          totalResults: 8,
        },
        {
          resources: [
            {
              id: "testUser4Id",
              userName: "testUserName4",
              name: {
                familyName: "testUserFamilyName4",
                givenName: "testUserGivenName4",
              },
              emails: [
                { value: "testUserName4@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup3",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser5Id",
              userName: "testUserName5",
              name: {
                familyName: "testUserFamilyName5",
                givenName: "testUserGivenName5",
              },
              emails: [
                { value: "testUserName5@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup3",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup4",
                  display: "mdsp_usergroup:testUserGroup4",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser6Id",
              userName: "testUserName6",
              name: {
                familyName: "testUserFamilyName6",
                givenName: "testUserGivenName6",
              },
              emails: [
                { value: "testUserName6@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup4",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup4",
                  display: "mdsp_usergroup:testUserGroup5",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
          ],
          startIndex: 4,
          itemsPerPage: 3,
        },
        {},
      ];

      mockedReturnStatusCollection = [200, 200, 200];
      mockedReturnHeadersCollection = [{}, {}, {}];

      let result = await exec();

      let expectedPayload = [
        {
          id: "testUser1Id",
          userName: "testUserName1",
          name: {
            familyName: "testUserFamilyName1",
            givenName: "testUserGivenName1",
          },
          emails: [{ value: "testUserName1@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser2Id",
          userName: "testUserName2",
          name: {
            familyName: "testUserFamilyName2",
            givenName: "testUserGivenName2",
          },
          emails: [{ value: "testUserName2@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser3Id",
          userName: "testUserName3",
          name: {
            familyName: "testUserFamilyName3",
            givenName: "testUserGivenName3",
          },
          emails: [{ value: "testUserName3@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser4Id",
          userName: "testUserName4",
          name: {
            familyName: "testUserFamilyName4",
            givenName: "testUserGivenName4",
          },
          emails: [{ value: "testUserName4@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser5Id",
          userName: "testUserName5",
          name: {
            familyName: "testUserFamilyName5",
            givenName: "testUserGivenName5",
          },
          emails: [{ value: "testUserName5@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser6Id",
          userName: "testUserName6",
          name: {
            familyName: "testUserFamilyName6",
            givenName: "testUserGivenName6",
          },
          emails: [{ value: "testUserName6@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
      ];

      expect(result).toEqual(expectedPayload);

      //Call three times - for every user indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 1,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 4,
        },
      });
    });

    it("should MindSphere Get Users Indexable API and valid users collection - if returned users collection contains nulls", async () => {
      mockedReturnDataCollection = [
        {
          resources: [
            {
              id: "testUser1Id",
              userName: "testUserName1",
              name: {
                familyName: "testUserFamilyName1",
                givenName: "testUserGivenName1",
              },
              emails: [
                { value: "testUserName1@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup1",
                  display: "mdsp_usergroup:testUserGroup1",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            {
              id: "testUser2Id",
              userName: "testUserName2",
              name: {
                familyName: "testUserFamilyName2",
                givenName: "testUserGivenName2",
              },
              emails: [
                { value: "testUserName2@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup1",
                  display: "mdsp_usergroup:testUserGroup1",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            null,
          ],
          startIndex: 1,
          itemsPerPage: 3,
          totalResults: 8,
        },
        {
          resources: [
            {
              id: "testUser4Id",
              userName: "testUserName4",
              name: {
                familyName: "testUserFamilyName4",
                givenName: "testUserGivenName4",
              },
              emails: [
                { value: "testUserName4@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup2",
                  display: "mdsp_usergroup:testUserGroup2",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup3",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
            null,
            {
              id: "testUser6Id",
              userName: "testUserName6",
              name: {
                familyName: "testUserFamilyName6",
                givenName: "testUserGivenName6",
              },
              emails: [
                { value: "testUserName6@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup3",
                  display: "mdsp_usergroup:testUserGroup4",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup4",
                  display: "mdsp_usergroup:testUserGroup5",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
          ],
          startIndex: 4,
          itemsPerPage: 3,
          totalResults: 8,
        },
        {
          resources: [
            null,
            {
              id: "testUser8Id",
              userName: "testUserName8",
              name: {
                familyName: "testUserFamilyName8",
                givenName: "testUserGivenName8",
              },
              emails: [
                { value: "testUserName8@testEmail.com", primary: false },
              ],
              groups: [
                {
                  value: "testUserGroup4",
                  display: "mdsp_usergroup:testUserGroup4",
                  type: "DIRECT",
                },
                {
                  value: "testUserGroup5",
                  display: "mdsp_usergroup:testUserGroup5",
                  type: "DIRECT",
                },
              ],
              active: true,
              zoneId: "sidivp",
            },
          ],
          startIndex: 7,
          itemsPerPage: 3,
          totalResults: 8,
        },
      ];
      let result = await exec();

      let expectedPayload = [
        {
          id: "testUser1Id",
          userName: "testUserName1",
          name: {
            familyName: "testUserFamilyName1",
            givenName: "testUserGivenName1",
          },
          emails: [{ value: "testUserName1@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser2Id",
          userName: "testUserName2",
          name: {
            familyName: "testUserFamilyName2",
            givenName: "testUserGivenName2",
          },
          emails: [{ value: "testUserName2@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },

        {
          id: "testUser4Id",
          userName: "testUserName4",
          name: {
            familyName: "testUserFamilyName4",
            givenName: "testUserGivenName4",
          },
          emails: [{ value: "testUserName4@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },

        {
          id: "testUser6Id",
          userName: "testUserName6",
          name: {
            familyName: "testUserFamilyName6",
            givenName: "testUserGivenName6",
          },
          emails: [{ value: "testUserName6@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser8Id",
          userName: "testUserName8",
          name: {
            familyName: "testUserFamilyName8",
            givenName: "testUserGivenName8",
          },
          emails: [{ value: "testUserName8@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup5",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
      ];
      expect(result).toEqual(expectedPayload);

      //Call three times - for every user indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 1,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 4,
        },
      });

      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 7,
        },
      });
    });

    it("should call MindSphere Get Users Indexable API with subtenant name filter - if subtenant name filer exists", async () => {
      subtenantId = "testSubtenantName";

      let result = await exec();

      let expectedPayload = [
        {
          id: "testUser1Id",
          userName: "testUserName1",
          name: {
            familyName: "testUserFamilyName1",
            givenName: "testUserGivenName1",
          },
          emails: [{ value: "testUserName1@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser2Id",
          userName: "testUserName2",
          name: {
            familyName: "testUserFamilyName2",
            givenName: "testUserGivenName2",
          },
          emails: [{ value: "testUserName2@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser3Id",
          userName: "testUserName3",
          name: {
            familyName: "testUserFamilyName3",
            givenName: "testUserGivenName3",
          },
          emails: [{ value: "testUserName3@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser4Id",
          userName: "testUserName4",
          name: {
            familyName: "testUserFamilyName4",
            givenName: "testUserGivenName4",
          },
          emails: [{ value: "testUserName4@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser5Id",
          userName: "testUserName5",
          name: {
            familyName: "testUserFamilyName5",
            givenName: "testUserGivenName5",
          },
          emails: [{ value: "testUserName5@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser6Id",
          userName: "testUserName6",
          name: {
            familyName: "testUserFamilyName6",
            givenName: "testUserGivenName6",
          },
          emails: [{ value: "testUserName6@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser7Id",
          userName: "testUserName7",
          name: {
            familyName: "testUserFamilyName7",
            givenName: "testUserGivenName7",
          },
          emails: [{ value: "testUserName7@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup5",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser8Id",
          userName: "testUserName8",
          name: {
            familyName: "testUserFamilyName8",
            givenName: "testUserGivenName8",
          },
          emails: [{ value: "testUserName8@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup5",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
      ];

      expect(result).toEqual(expectedPayload);

      //Call three times - for every user indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          subtenant: "testSubtenantName",
          count: 3,
          sortBy: "id",
          startIndex: 1,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          subtenant: "testSubtenantName",
          count: 3,
          sortBy: "id",
          startIndex: 4,
        },
      });

      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          subtenant: "testSubtenantName",
          count: 3,
          sortBy: "id",
          startIndex: 7,
        },
      });
    });

    it("should call MindSphere Get Users Indexable API with subtenant name filter - if user id filer exists", async () => {
      userId = "testUserId";

      let result = await exec();

      let expectedPayload = [
        {
          id: "testUser1Id",
          userName: "testUserName1",
          name: {
            familyName: "testUserFamilyName1",
            givenName: "testUserGivenName1",
          },
          emails: [{ value: "testUserName1@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser2Id",
          userName: "testUserName2",
          name: {
            familyName: "testUserFamilyName2",
            givenName: "testUserGivenName2",
          },
          emails: [{ value: "testUserName2@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser3Id",
          userName: "testUserName3",
          name: {
            familyName: "testUserFamilyName3",
            givenName: "testUserGivenName3",
          },
          emails: [{ value: "testUserName3@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser4Id",
          userName: "testUserName4",
          name: {
            familyName: "testUserFamilyName4",
            givenName: "testUserGivenName4",
          },
          emails: [{ value: "testUserName4@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser5Id",
          userName: "testUserName5",
          name: {
            familyName: "testUserFamilyName5",
            givenName: "testUserGivenName5",
          },
          emails: [{ value: "testUserName5@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser6Id",
          userName: "testUserName6",
          name: {
            familyName: "testUserFamilyName6",
            givenName: "testUserGivenName6",
          },
          emails: [{ value: "testUserName6@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser7Id",
          userName: "testUserName7",
          name: {
            familyName: "testUserFamilyName7",
            givenName: "testUserGivenName7",
          },
          emails: [{ value: "testUserName7@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup5",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser8Id",
          userName: "testUserName8",
          name: {
            familyName: "testUserFamilyName8",
            givenName: "testUserGivenName8",
          },
          emails: [{ value: "testUserName8@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup5",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
      ];

      expect(result).toEqual(expectedPayload);

      //Call three times - for every user indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `id eq "testUserId"`,
          count: 3,
          sortBy: "id",
          startIndex: 1,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `id eq "testUserId"`,
          count: 3,
          sortBy: "id",
          startIndex: 4,
        },
      });

      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `id eq "testUserId"`,
          count: 3,
          sortBy: "id",
          startIndex: 7,
        },
      });
    });

    it("should call MindSphere Get Users Indexable API with subtenant name filter - if user name filer exists", async () => {
      userName = "testUserName";

      let result = await exec();

      let expectedPayload = [
        {
          id: "testUser1Id",
          userName: "testUserName1",
          name: {
            familyName: "testUserFamilyName1",
            givenName: "testUserGivenName1",
          },
          emails: [{ value: "testUserName1@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser2Id",
          userName: "testUserName2",
          name: {
            familyName: "testUserFamilyName2",
            givenName: "testUserGivenName2",
          },
          emails: [{ value: "testUserName2@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser3Id",
          userName: "testUserName3",
          name: {
            familyName: "testUserFamilyName3",
            givenName: "testUserGivenName3",
          },
          emails: [{ value: "testUserName3@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser4Id",
          userName: "testUserName4",
          name: {
            familyName: "testUserFamilyName4",
            givenName: "testUserGivenName4",
          },
          emails: [{ value: "testUserName4@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser5Id",
          userName: "testUserName5",
          name: {
            familyName: "testUserFamilyName5",
            givenName: "testUserGivenName5",
          },
          emails: [{ value: "testUserName5@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser6Id",
          userName: "testUserName6",
          name: {
            familyName: "testUserFamilyName6",
            givenName: "testUserGivenName6",
          },
          emails: [{ value: "testUserName6@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser7Id",
          userName: "testUserName7",
          name: {
            familyName: "testUserFamilyName7",
            givenName: "testUserGivenName7",
          },
          emails: [{ value: "testUserName7@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup5",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser8Id",
          userName: "testUserName8",
          name: {
            familyName: "testUserFamilyName8",
            givenName: "testUserGivenName8",
          },
          emails: [{ value: "testUserName8@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup5",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
      ];

      expect(result).toEqual(expectedPayload);

      //Call three times - for every user indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `username eq "testUserName"`,
          count: 3,
          sortBy: "id",
          startIndex: 1,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `username eq "testUserName"`,
          count: 3,
          sortBy: "id",
          startIndex: 4,
        },
      });

      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `username eq "testUserName"`,
          count: 3,
          sortBy: "id",
          startIndex: 7,
        },
      });
    });

    it("should call MindSphere Get Users Indexable API with subtenant name filter - if all filters exists", async () => {
      subtenantId = "testSubtenantId";
      userName = "testUserName";
      userId = "testUserId";

      let result = await exec();

      let expectedPayload = [
        {
          id: "testUser1Id",
          userName: "testUserName1",
          name: {
            familyName: "testUserFamilyName1",
            givenName: "testUserGivenName1",
          },
          emails: [{ value: "testUserName1@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser2Id",
          userName: "testUserName2",
          name: {
            familyName: "testUserFamilyName2",
            givenName: "testUserGivenName2",
          },
          emails: [{ value: "testUserName2@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser3Id",
          userName: "testUserName3",
          name: {
            familyName: "testUserFamilyName3",
            givenName: "testUserGivenName3",
          },
          emails: [{ value: "testUserName3@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser4Id",
          userName: "testUserName4",
          name: {
            familyName: "testUserFamilyName4",
            givenName: "testUserGivenName4",
          },
          emails: [{ value: "testUserName4@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser5Id",
          userName: "testUserName5",
          name: {
            familyName: "testUserFamilyName5",
            givenName: "testUserGivenName5",
          },
          emails: [{ value: "testUserName5@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser6Id",
          userName: "testUserName6",
          name: {
            familyName: "testUserFamilyName6",
            givenName: "testUserGivenName6",
          },
          emails: [{ value: "testUserName6@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser7Id",
          userName: "testUserName7",
          name: {
            familyName: "testUserFamilyName7",
            givenName: "testUserGivenName7",
          },
          emails: [{ value: "testUserName7@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup5",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser8Id",
          userName: "testUserName8",
          name: {
            familyName: "testUserFamilyName8",
            givenName: "testUserGivenName8",
          },
          emails: [{ value: "testUserName8@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup5",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
      ];

      expect(result).toEqual(expectedPayload);

      //Call three times - for every user indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `id eq "testUserId" and username eq "testUserName"`,
          subtenant: "testSubtenantId",
          count: 3,
          sortBy: "id",
          startIndex: 1,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `id eq "testUserId" and username eq "testUserName"`,
          subtenant: "testSubtenantId",
          count: 3,
          sortBy: "id",
          startIndex: 4,
        },
      });

      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `id eq "testUserId" and username eq "testUserName"`,
          subtenant: "testSubtenantId",
          count: 3,
          sortBy: "id",
          startIndex: 7,
        },
      });
    });

    it("should fetch token first - if token has not been fetched before and then get all users using new token", async () => {
      mockedAuthToken = null;
      mockedAuthTokenElapsedTime = null;

      //Setting token to return first time
      //token timestamp - "2021-01-31T12:58:00.000Z" - 1612097880000
      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //expires in "2021-01-31T13:31:18.766Z" 1612097880000 + 2000*1000-1234 = 1612099878766
      mockedNow = 1612098000000;
      //First axios call - fetch token, second get data
      mockedReturnDataCollection = [
        {
          access_token: "testAccessToken2",
          timestamp: 1612097880000,
          expires_in: 2000,
        },
        ...mockedReturnDataCollection,
      ];

      mockedReturnStatusCollection = [200, ...mockedReturnStatusCollection];
      mockedReturnHeadersCollection = [{}, ...mockedReturnHeadersCollection];

      let result = await exec();

      let expectedPayload = [
        {
          id: "testUser1Id",
          userName: "testUserName1",
          name: {
            familyName: "testUserFamilyName1",
            givenName: "testUserGivenName1",
          },
          emails: [{ value: "testUserName1@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser2Id",
          userName: "testUserName2",
          name: {
            familyName: "testUserFamilyName2",
            givenName: "testUserGivenName2",
          },
          emails: [{ value: "testUserName2@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser3Id",
          userName: "testUserName3",
          name: {
            familyName: "testUserFamilyName3",
            givenName: "testUserGivenName3",
          },
          emails: [{ value: "testUserName3@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser4Id",
          userName: "testUserName4",
          name: {
            familyName: "testUserFamilyName4",
            givenName: "testUserGivenName4",
          },
          emails: [{ value: "testUserName4@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser5Id",
          userName: "testUserName5",
          name: {
            familyName: "testUserFamilyName5",
            givenName: "testUserGivenName5",
          },
          emails: [{ value: "testUserName5@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser6Id",
          userName: "testUserName6",
          name: {
            familyName: "testUserFamilyName6",
            givenName: "testUserGivenName6",
          },
          emails: [{ value: "testUserName6@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser7Id",
          userName: "testUserName7",
          name: {
            familyName: "testUserFamilyName7",
            givenName: "testUserGivenName7",
          },
          emails: [{ value: "testUserName7@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup5",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser8Id",
          userName: "testUserName8",
          name: {
            familyName: "testUserFamilyName8",
            givenName: "testUserGivenName8",
          },
          emails: [{ value: "testUserName8@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup5",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
      ];

      expect(result).toEqual(expectedPayload);

      //Call four times - for fetching token and for every user indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(4);

      //First call - fetch token
      let base64Key = encodeBase64(`testClientId:testClientSecret`);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testTenantName",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic ${base64Key}`,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 1,
        },
      });

      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 4,
        },
      });

      expect(mockedAxios.request.mock.calls[3][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 7,
        },
      });
    });

    it("should fetch token first - if token has expired and then get all users using new token", async () => {
      mockedAuthTokenElapsedTime = null;

      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //token elapsed time - "2021-01-31T12:58:00.000Z" 1612097880000
      mockedNow = 1612098000000;
      mockedAuthTokenElapsedTime = 1612097880000;

      //Setting new token to return first time
      //token timestamp - "2021-01-31T12:58:00.000Z" - 1612097880000
      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //expires in "2021-01-31T13:31:18.766Z" 1612097880000 + 2000*1000-1234 = 1612099878766

      //First axios call - fetch token, second get data
      mockedReturnDataCollection = [
        {
          access_token: "testAccessToken2",
          timestamp: 1612097880000,
          expires_in: 2000,
        },
        ...mockedReturnDataCollection,
      ];

      mockedReturnStatusCollection = [200, ...mockedReturnStatusCollection];
      mockedReturnHeadersCollection = [{}, ...mockedReturnHeadersCollection];

      let result = await exec();

      let expectedPayload = [
        {
          id: "testUser1Id",
          userName: "testUserName1",
          name: {
            familyName: "testUserFamilyName1",
            givenName: "testUserGivenName1",
          },
          emails: [{ value: "testUserName1@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser2Id",
          userName: "testUserName2",
          name: {
            familyName: "testUserFamilyName2",
            givenName: "testUserGivenName2",
          },
          emails: [{ value: "testUserName2@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser3Id",
          userName: "testUserName3",
          name: {
            familyName: "testUserFamilyName3",
            givenName: "testUserGivenName3",
          },
          emails: [{ value: "testUserName3@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser4Id",
          userName: "testUserName4",
          name: {
            familyName: "testUserFamilyName4",
            givenName: "testUserGivenName4",
          },
          emails: [{ value: "testUserName4@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser5Id",
          userName: "testUserName5",
          name: {
            familyName: "testUserFamilyName5",
            givenName: "testUserGivenName5",
          },
          emails: [{ value: "testUserName5@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser6Id",
          userName: "testUserName6",
          name: {
            familyName: "testUserFamilyName6",
            givenName: "testUserGivenName6",
          },
          emails: [{ value: "testUserName6@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser7Id",
          userName: "testUserName7",
          name: {
            familyName: "testUserFamilyName7",
            givenName: "testUserGivenName7",
          },
          emails: [{ value: "testUserName7@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup5",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
        {
          id: "testUser8Id",
          userName: "testUserName8",
          name: {
            familyName: "testUserFamilyName8",
            givenName: "testUserGivenName8",
          },
          emails: [{ value: "testUserName8@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup4",
              display: "mdsp_usergroup:testUserGroup4",
              type: "DIRECT",
            },
            {
              value: "testUserGroup5",
              display: "mdsp_usergroup:testUserGroup5",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
      ];

      expect(result).toEqual(expectedPayload);

      //Call four times - for fetching token and for every user indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(4);

      //First call - fetch token
      let base64Key = encodeBase64(`testClientId:testClientSecret`);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testTenantName",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic ${base64Key}`,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 1,
        },
      });

      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 4,
        },
      });

      expect(mockedAxios.request.mock.calls[3][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 7,
        },
      });
    });

    it("should reject - if first call rejects", async () => {
      mockedAxios.__setMockError(new Error("test api call error"));

      await expect(exec()).rejects.toMatchObject({
        message: "test api call error",
      });
    });

    it("should reject - if first api call return code different than 2xx", async () => {
      mockedReturnStatusCollection = [400];

      await expect(exec()).rejects.toMatchObject({
        message: `Server responded with status code: 400`,
      });
    });

    it("should reject - if second call rejects", async () => {
      mockedAxios.__setMockError("testError", 2);

      await expect(exec()).rejects.toEqual("testError");
    });

    it("should reject - if second call returns code different than 2xx", async () => {
      mockedReturnStatusCollection = [200, 400, 200];

      await expect(exec()).rejects.toMatchObject({
        message: "Server responded with status code: 400",
      });
    });

    it("should reject - if fetching token rejects", async () => {
      mockedAuthToken = null;
      mockedAuthTokenElapsedTime = null;

      mockedAxios.__setMockError(new Error("test api call error"));

      await expect(exec()).rejects.toMatchObject({
        message: "test api call error",
      });

      //request called only once - while fetching token
      expect(axios.request).toHaveBeenCalledTimes(1);
    });
  });

  describe("checkIfUserExists", () => {
    let tenantName: string;
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereUserService: MindSphereUserService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let userId: string | null;
    let userName: string | null;

    beforeEach(() => {
      mockedReturnDataCollection = [
        {
          resources: ["fakeUser1", "fakeUser2", "fakeUser3"],
          startIndex: 1,
          itemsPerPage: 3,
          totalResults: 3,
        },
      ];
      mockedReturnStatusCollection = [200];
      mockedReturnHeadersCollection = [{}];
      mockedAuthToken = "testAuthToken1234";
      mockedAuthTokenElapsedTime = 1612184400000;
      mockedNow = 1612098060000;
      tenantName = "testTenantName";
      userId = "testUserId";
      userName = null;
    });

    let exec = async () => {
      //Mocking Token Manager
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance(
        tenantName
      ) as any;
      mockedMindSphereTokenManager._token = mockedAuthToken;
      mockedMindSphereTokenManager._tokenExpireUnixDate = mockedAuthTokenElapsedTime;

      //Getting instance of service
      mindSphereUserService = MindSphereUserService.getInstance();

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereUserService.checkIfUserExists(
        tenantName,
        userId,
        userName
      );
    };

    it("should MindSphere Get Users Indexable API and return true - if get users returns non-empty array - filtering by user id", async () => {
      let result = await exec();

      expect(result).toEqual(true);

      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `id eq "testUserId"`,
          count: 100,
          sortBy: "id",
          startIndex: 1,
        },
      });
    });

    it("should MindSphere Get Users Indexable API and return false - if get users returns empty array - filtering by user id", async () => {
      mockedReturnDataCollection = [
        {
          resources: [],
          startIndex: 1,
          itemsPerPage: 3,
          totalResults: 0,
        },
      ];
      let result = await exec();

      expect(result).toEqual(false);

      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `id eq "testUserId"`,
          count: 100,
          sortBy: "id",
          startIndex: 1,
        },
      });
    });

    it("should MindSphere Get Users Indexable API and return true - if get users returns non-empty array - filtering by user name", async () => {
      userId = null;
      userName = "testUserName";

      let result = await exec();

      expect(result).toEqual(true);

      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `username eq "testUserName"`,
          count: 100,
          sortBy: "id",
          startIndex: 1,
        },
      });
    });

    it("should MindSphere Get Users Indexable API and return false - if get users returns empty array - filtering by user name", async () => {
      userId = null;
      userName = "testUserName";

      mockedReturnDataCollection = [
        {
          resources: [],
          startIndex: 1,
          itemsPerPage: 3,
          totalResults: 0,
        },
      ];

      let result = await exec();

      expect(result).toEqual(false);

      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `username eq "testUserName"`,
          count: 100,
          sortBy: "id",
          startIndex: 1,
        },
      });
    });

    it("should MindSphere Get Users Indexable API and return true - if get users returns non-empty array - filtering by user name and user id", async () => {
      userId = "testUserId";
      userName = "testUserName";

      let result = await exec();

      expect(result).toEqual(true);

      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `id eq "testUserId" and username eq "testUserName"`,
          count: 100,
          sortBy: "id",
          startIndex: 1,
        },
      });
    });

    it("should MindSphere Get Users Indexable API and return false - if get users returns empty array - filtering by user name and user id", async () => {
      userId = "testUserId";
      userName = "testUserName";

      mockedReturnDataCollection = [
        {
          resources: [],
          startIndex: 1,
          itemsPerPage: 3,
          totalResults: 0,
        },
      ];

      let result = await exec();

      expect(result).toEqual(false);

      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `id eq "testUserId" and username eq "testUserName"`,
          count: 100,
          sortBy: "id",
          startIndex: 1,
        },
      });
    });

    it("should reject and not call MindSphere API - if both user name and user id is null", async () => {
      userId = null;
      userName = null;

      await expect(exec()).rejects.toMatchObject({
        message: "Both userId and userName not specified",
      });

      expect(mockedAxios.request).not.toHaveBeenCalled();
    });

    it("should fetch token first - if token has not been fetched before and then get all users using new token", async () => {
      mockedAuthToken = null;
      mockedAuthTokenElapsedTime = null;

      //Setting token to return first time
      //token timestamp - "2021-01-31T12:58:00.000Z" - 1612097880000
      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //expires in "2021-01-31T13:31:18.766Z" 1612097880000 + 2000*1000-1234 = 1612099878766
      mockedNow = 1612098000000;
      //First axios call - fetch token, second get data
      mockedReturnDataCollection = [
        {
          access_token: "testAccessToken2",
          timestamp: 1612097880000,
          expires_in: 2000,
        },
        ...mockedReturnDataCollection,
      ];

      mockedReturnStatusCollection = [200, ...mockedReturnStatusCollection];
      mockedReturnHeadersCollection = [{}, ...mockedReturnHeadersCollection];

      let result = await exec();

      expect(result).toEqual(true);

      //Call four times - for fetching token and for every user indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      //First call - fetch token
      let base64Key = encodeBase64(`testClientId:testClientSecret`);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testTenantName",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic ${base64Key}`,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `id eq "testUserId"`,
          count: 100,
          sortBy: "id",
          startIndex: 1,
        },
      });
    });

    it("should fetch token first - if token has expired and then get all users using new token", async () => {
      mockedAuthTokenElapsedTime = null;

      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //token elapsed time - "2021-01-31T12:58:00.000Z" 1612097880000
      mockedNow = 1612098000000;
      mockedAuthTokenElapsedTime = 1612097880000;

      //Setting new token to return first time
      //token timestamp - "2021-01-31T12:58:00.000Z" - 1612097880000
      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //expires in "2021-01-31T13:31:18.766Z" 1612097880000 + 2000*1000-1234 = 1612099878766

      //First axios call - fetch token, second get data
      mockedReturnDataCollection = [
        {
          access_token: "testAccessToken2",
          timestamp: 1612097880000,
          expires_in: 2000,
        },
        ...mockedReturnDataCollection,
      ];

      mockedReturnStatusCollection = [200, ...mockedReturnStatusCollection];
      mockedReturnHeadersCollection = [{}, ...mockedReturnHeadersCollection];

      let result = await exec();

      expect(result).toEqual(true);

      //Call four times - for fetching token and for every user indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      //First call - fetch token
      let base64Key = encodeBase64(`testClientId:testClientSecret`);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testTenantName",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic ${base64Key}`,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `id eq "testUserId"`,
          count: 100,
          sortBy: "id",
          startIndex: 1,
        },
      });
    });

    it("should reject - if call rejects", async () => {
      mockedAxios.__setMockError(new Error("test api call error"));

      await expect(exec()).rejects.toMatchObject({
        message: "test api call error",
      });
    });

    it("should reject - if fetching token rejects", async () => {
      mockedAuthToken = null;
      mockedAuthTokenElapsedTime = null;

      mockedAxios.__setMockError(new Error("test api call error"));

      await expect(exec()).rejects.toMatchObject({
        message: "test api call error",
      });

      //request called only once - while fetching token
      expect(axios.request).toHaveBeenCalledTimes(1);
    });
  });

  describe("getUser", () => {
    let tenantName: string;
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereUserService: MindSphereUserService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let userId: string;

    beforeEach(() => {
      mockedReturnDataCollection = [
        {
          id: "testUser1Id",
          userName: "testUserName1",
          name: {
            familyName: "testUserFamilyName1",
            givenName: "testUserGivenName1",
          },
          emails: [{ value: "testUserName1@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
      ];
      mockedReturnStatusCollection = [200];
      mockedReturnHeadersCollection = [{}];
      mockedAuthToken = "testAuthToken1234";
      mockedAuthTokenElapsedTime = 1612184400000;
      mockedNow = 1612098060000;
      tenantName = "testTenantName";
      userId = "testUserId";
    });

    let exec = async () => {
      //Mocking Token Manager
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance(
        tenantName
      ) as any;
      mockedMindSphereTokenManager._token = mockedAuthToken;
      mockedMindSphereTokenManager._tokenExpireUnixDate = mockedAuthTokenElapsedTime;

      //Getting instance of service
      mindSphereUserService = MindSphereUserService.getInstance();

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereUserService.getUser(tenantName, userId);
    };

    it("should call MindSphere Get User API and return return his payload", async () => {
      let result = await exec();

      let expectedPayload = {
        id: "testUser1Id",
        userName: "testUserName1",
        name: {
          familyName: "testUserFamilyName1",
          givenName: "testUserGivenName1",
        },
        emails: [{ value: "testUserName1@testEmail.com", primary: false }],
        groups: [
          {
            value: "testUserGroup1",
            display: "mdsp_usergroup:testUserGroup1",
            type: "DIRECT",
          },
          {
            value: "testUserGroup2",
            display: "mdsp_usergroup:testUserGroup2",
            type: "DIRECT",
          },
          {
            value: "testUserGroup3",
            display: "mdsp_usergroup:testUserGroup3",
            type: "DIRECT",
          },
        ],
        active: true,
        zoneId: "sidivp",
      };

      expect(result).toEqual(expectedPayload);

      //Call one time - to get all users
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users/testUserId`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    });

    it("should fetch token first - if token has not been fetched before and then get all users using new token", async () => {
      mockedAuthToken = null;
      mockedAuthTokenElapsedTime = null;

      //Setting token to return first time
      //token timestamp - "2021-01-31T12:58:00.000Z" - 1612097880000
      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //expires in "2021-01-31T13:31:18.766Z" 1612097880000 + 2000*1000-1234 = 1612099878766
      mockedNow = 1612098000000;
      //First axios call - fetch token, second get data
      mockedReturnDataCollection = [
        {
          access_token: "testAccessToken2",
          timestamp: 1612097880000,
          expires_in: 2000,
        },
        ...mockedReturnDataCollection,
      ];

      mockedReturnStatusCollection = [200, ...mockedReturnStatusCollection];
      mockedReturnHeadersCollection = [{}, ...mockedReturnHeadersCollection];

      let result = await exec();

      let expectedPayload = {
        id: "testUser1Id",
        userName: "testUserName1",
        name: {
          familyName: "testUserFamilyName1",
          givenName: "testUserGivenName1",
        },
        emails: [{ value: "testUserName1@testEmail.com", primary: false }],
        groups: [
          {
            value: "testUserGroup1",
            display: "mdsp_usergroup:testUserGroup1",
            type: "DIRECT",
          },
          {
            value: "testUserGroup2",
            display: "mdsp_usergroup:testUserGroup2",
            type: "DIRECT",
          },
          {
            value: "testUserGroup3",
            display: "mdsp_usergroup:testUserGroup3",
            type: "DIRECT",
          },
        ],
        active: true,
        zoneId: "sidivp",
      };

      expect(result).toEqual(expectedPayload);

      //Call four times - for fetching token and getting user
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      //First call - fetch token
      let base64Key = encodeBase64(`testClientId:testClientSecret`);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testTenantName",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic ${base64Key}`,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users/testUserId`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    });

    it("should fetch token first - if token has expired and then get all users using new token", async () => {
      mockedAuthTokenElapsedTime = null;

      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //token elapsed time - "2021-01-31T12:58:00.000Z" 1612097880000
      mockedNow = 1612098000000;
      mockedAuthTokenElapsedTime = 1612097880000;

      //Setting new token to return first time
      //token timestamp - "2021-01-31T12:58:00.000Z" - 1612097880000
      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //expires in "2021-01-31T13:31:18.766Z" 1612097880000 + 2000*1000-1234 = 1612099878766

      //First axios call - fetch token, second get data
      mockedReturnDataCollection = [
        {
          access_token: "testAccessToken2",
          timestamp: 1612097880000,
          expires_in: 2000,
        },
        ...mockedReturnDataCollection,
      ];

      mockedReturnStatusCollection = [200, ...mockedReturnStatusCollection];
      mockedReturnHeadersCollection = [{}, ...mockedReturnHeadersCollection];

      let result = await exec();

      let expectedPayload = {
        id: "testUser1Id",
        userName: "testUserName1",
        name: {
          familyName: "testUserFamilyName1",
          givenName: "testUserGivenName1",
        },
        emails: [{ value: "testUserName1@testEmail.com", primary: false }],
        groups: [
          {
            value: "testUserGroup1",
            display: "mdsp_usergroup:testUserGroup1",
            type: "DIRECT",
          },
          {
            value: "testUserGroup2",
            display: "mdsp_usergroup:testUserGroup2",
            type: "DIRECT",
          },
          {
            value: "testUserGroup3",
            display: "mdsp_usergroup:testUserGroup3",
            type: "DIRECT",
          },
        ],
        active: true,
        zoneId: "sidivp",
      };

      expect(result).toEqual(expectedPayload);

      //Call four times - for fetching token and getting user
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      //First call - fetch token
      let base64Key = encodeBase64(`testClientId:testClientSecret`);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testTenantName",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic ${base64Key}`,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users/testUserId`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    });

    it("should reject - if call rejects", async () => {
      mockedAxios.__setMockError(new Error("test api call error"));

      await expect(exec()).rejects.toMatchObject({
        message: "test api call error",
      });
    });

    it("should reject - if fetching token rejects", async () => {
      mockedAuthToken = null;
      mockedAuthTokenElapsedTime = null;

      mockedAxios.__setMockError(new Error("test api call error"));

      await expect(exec()).rejects.toMatchObject({
        message: "test api call error",
      });

      //request called only once - while fetching token
      expect(axios.request).toHaveBeenCalledTimes(1);
    });
  });

  describe("createUser", () => {
    let tenantName: string;
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereUserService: MindSphereUserService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let userPayload: MindSphereUserData;

    beforeEach(() => {
      mockedReturnDataCollection = [
        {
          id: "testUser1Id",
          userName: "testUserName1",
          name: {
            familyName: "testUserFamilyName1",
            givenName: "testUserGivenName1",
          },
          emails: [{ value: "testUserName1@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
      ];
      mockedReturnStatusCollection = [200];
      mockedReturnHeadersCollection = [{}];
      mockedAuthToken = "testAuthToken1234";
      mockedAuthTokenElapsedTime = 1612184400000;
      mockedNow = 1612098060000;
      tenantName = "testTenantName";
      userPayload = {
        id: "testUser1Id",
        userName: "testUserName1",
        name: {
          familyName: "testUserFamilyName1",
          givenName: "testUserGivenName1",
        },
        emails: [{ value: "testUserName1@testEmail.com" }],
        groups: [
          {
            value: "testUserGroup1",
            display: "mdsp_usergroup:testUserGroup1",
            type: "DIRECT",
          },
        ],
        active: true,
      };
    });

    let exec = async () => {
      //Mocking Token Manager
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance(
        tenantName
      ) as any;
      mockedMindSphereTokenManager._token = mockedAuthToken;
      mockedMindSphereTokenManager._tokenExpireUnixDate = mockedAuthTokenElapsedTime;

      //Getting instance of service
      mindSphereUserService = MindSphereUserService.getInstance();

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereUserService.createUser(tenantName, userPayload);
    };

    it("should call MindSphere Post User API and return return his payload", async () => {
      let result = await exec();

      //expected payload should be equal to payload returned by axios
      let expectedPayload = {
        id: "testUser1Id",
        userName: "testUserName1",
        name: {
          familyName: "testUserFamilyName1",
          givenName: "testUserGivenName1",
        },
        emails: [{ value: "testUserName1@testEmail.com", primary: false }],
        groups: [
          {
            value: "testUserGroup1",
            display: "mdsp_usergroup:testUserGroup1",
            type: "DIRECT",
          },
          {
            value: "testUserGroup2",
            display: "mdsp_usergroup:testUserGroup2",
            type: "DIRECT",
          },
          {
            value: "testUserGroup3",
            display: "mdsp_usergroup:testUserGroup3",
            type: "DIRECT",
          },
        ],
        active: true,
        zoneId: "sidivp",
      };

      expect(result).toEqual(expectedPayload);

      //Call one time - to get all users
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "POST",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: {
          id: "testUser1Id",
          userName: "testUserName1",
          name: {
            familyName: "testUserFamilyName1",
            givenName: "testUserGivenName1",
          },
          emails: [{ value: "testUserName1@testEmail.com" }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
          ],
          active: true,
        },
      });
    });

    it("should fetch token first - if token has not been fetched before and then get all users using new token", async () => {
      mockedAuthToken = null;
      mockedAuthTokenElapsedTime = null;

      //Setting token to return first time
      //token timestamp - "2021-01-31T12:58:00.000Z" - 1612097880000
      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //expires in "2021-01-31T13:31:18.766Z" 1612097880000 + 2000*1000-1234 = 1612099878766
      mockedNow = 1612098000000;
      //First axios call - fetch token, second get data
      mockedReturnDataCollection = [
        {
          access_token: "testAccessToken2",
          timestamp: 1612097880000,
          expires_in: 2000,
        },
        ...mockedReturnDataCollection,
      ];

      mockedReturnStatusCollection = [200, ...mockedReturnStatusCollection];
      mockedReturnHeadersCollection = [{}, ...mockedReturnHeadersCollection];

      let result = await exec();

      //expected payload should be equal to payload returned by axios
      let expectedPayload = {
        id: "testUser1Id",
        userName: "testUserName1",
        name: {
          familyName: "testUserFamilyName1",
          givenName: "testUserGivenName1",
        },
        emails: [{ value: "testUserName1@testEmail.com", primary: false }],
        groups: [
          {
            value: "testUserGroup1",
            display: "mdsp_usergroup:testUserGroup1",
            type: "DIRECT",
          },
          {
            value: "testUserGroup2",
            display: "mdsp_usergroup:testUserGroup2",
            type: "DIRECT",
          },
          {
            value: "testUserGroup3",
            display: "mdsp_usergroup:testUserGroup3",
            type: "DIRECT",
          },
        ],
        active: true,
        zoneId: "sidivp",
      };

      expect(result).toEqual(expectedPayload);

      //Call four times - for fetching token and getting user
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      //First call - fetch token
      let base64Key = encodeBase64(`testClientId:testClientSecret`);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testTenantName",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic ${base64Key}`,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "POST",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: {
          id: "testUser1Id",
          userName: "testUserName1",
          name: {
            familyName: "testUserFamilyName1",
            givenName: "testUserGivenName1",
          },
          emails: [{ value: "testUserName1@testEmail.com" }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
          ],
          active: true,
        },
      });
    });

    it("should fetch token first - if token has expired and then get all users using new token", async () => {
      mockedAuthTokenElapsedTime = null;

      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //token elapsed time - "2021-01-31T12:58:00.000Z" 1612097880000
      mockedNow = 1612098000000;
      mockedAuthTokenElapsedTime = 1612097880000;

      //Setting new token to return first time
      //token timestamp - "2021-01-31T12:58:00.000Z" - 1612097880000
      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //expires in "2021-01-31T13:31:18.766Z" 1612097880000 + 2000*1000-1234 = 1612099878766

      //First axios call - fetch token, second get data
      mockedReturnDataCollection = [
        {
          access_token: "testAccessToken2",
          timestamp: 1612097880000,
          expires_in: 2000,
        },
        ...mockedReturnDataCollection,
      ];

      mockedReturnStatusCollection = [200, ...mockedReturnStatusCollection];
      mockedReturnHeadersCollection = [{}, ...mockedReturnHeadersCollection];
      let result = await exec();

      //expected payload should be equal to payload returned by axios
      let expectedPayload = {
        id: "testUser1Id",
        userName: "testUserName1",
        name: {
          familyName: "testUserFamilyName1",
          givenName: "testUserGivenName1",
        },
        emails: [{ value: "testUserName1@testEmail.com", primary: false }],
        groups: [
          {
            value: "testUserGroup1",
            display: "mdsp_usergroup:testUserGroup1",
            type: "DIRECT",
          },
          {
            value: "testUserGroup2",
            display: "mdsp_usergroup:testUserGroup2",
            type: "DIRECT",
          },
          {
            value: "testUserGroup3",
            display: "mdsp_usergroup:testUserGroup3",
            type: "DIRECT",
          },
        ],
        active: true,
        zoneId: "sidivp",
      };

      expect(result).toEqual(expectedPayload);

      //Call four times - for fetching token and getting user
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      //First call - fetch token
      let base64Key = encodeBase64(`testClientId:testClientSecret`);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testTenantName",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic ${base64Key}`,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "POST",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: {
          id: "testUser1Id",
          userName: "testUserName1",
          name: {
            familyName: "testUserFamilyName1",
            givenName: "testUserGivenName1",
          },
          emails: [{ value: "testUserName1@testEmail.com" }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
          ],
          active: true,
        },
      });
    });

    it("should reject - if call rejects", async () => {
      mockedAxios.__setMockError(new Error("test api call error"));

      await expect(exec()).rejects.toMatchObject({
        message: "test api call error",
      });
    });

    it("should reject - if fetching token rejects", async () => {
      mockedAuthToken = null;
      mockedAuthTokenElapsedTime = null;

      mockedAxios.__setMockError(new Error("test api call error"));

      await expect(exec()).rejects.toMatchObject({
        message: "test api call error",
      });

      //request called only once - while fetching token
      expect(axios.request).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateUser", () => {
    let tenantName: string;
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereUserService: MindSphereUserService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let userId: string;
    let userPayload: MindSphereUserData;

    beforeEach(() => {
      mockedReturnDataCollection = [
        {
          id: "testUser1Id",
          userName: "testUserName1",
          name: {
            familyName: "testUserFamilyName1",
            givenName: "testUserGivenName1",
          },
          emails: [{ value: "testUserName1@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
      ];
      mockedReturnStatusCollection = [200];
      mockedReturnHeadersCollection = [{}];
      mockedAuthToken = "testAuthToken1234";
      mockedAuthTokenElapsedTime = 1612184400000;
      mockedNow = 1612098060000;
      tenantName = "testTenantName";
      userId = "testUserId";
      userPayload = {
        id: "testUserUpdated1Id",
        userName: "testUserUpdatedName1",
        name: {
          familyName: "testUserUpdatedFamilyName1",
          givenName: "testUserUpdatedGivenName1",
        },
        emails: [{ value: "testUserUpdatedName1@testEmail.com" }],
        groups: [
          {
            value: "testUserUpdatedGroup1",
            display: "mdsp_usergroup:testUserUpdatedGroup1",
            type: "DIRECT",
          },
        ],
        active: true,
      };
    });

    let exec = async () => {
      //Mocking Token Manager
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance(
        tenantName
      ) as any;
      mockedMindSphereTokenManager._token = mockedAuthToken;
      mockedMindSphereTokenManager._tokenExpireUnixDate = mockedAuthTokenElapsedTime;

      //Getting instance of service
      mindSphereUserService = MindSphereUserService.getInstance();

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereUserService.updateUser(tenantName, userId, userPayload);
    };

    it("should call MindSphere Put User API and return return his payload", async () => {
      let result = await exec();

      //expected payload should be equal to payload returned by axios
      let expectedPayload = {
        id: "testUser1Id",
        userName: "testUserName1",
        name: {
          familyName: "testUserFamilyName1",
          givenName: "testUserGivenName1",
        },
        emails: [{ value: "testUserName1@testEmail.com", primary: false }],
        groups: [
          {
            value: "testUserGroup1",
            display: "mdsp_usergroup:testUserGroup1",
            type: "DIRECT",
          },
          {
            value: "testUserGroup2",
            display: "mdsp_usergroup:testUserGroup2",
            type: "DIRECT",
          },
          {
            value: "testUserGroup3",
            display: "mdsp_usergroup:testUserGroup3",
            type: "DIRECT",
          },
        ],
        active: true,
        zoneId: "sidivp",
      };

      expect(result).toEqual(expectedPayload);

      //Call one time - to get all users
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "PUT",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users/testUserId`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: {
          id: "testUserUpdated1Id",
          userName: "testUserUpdatedName1",
          name: {
            familyName: "testUserUpdatedFamilyName1",
            givenName: "testUserUpdatedGivenName1",
          },
          emails: [{ value: "testUserUpdatedName1@testEmail.com" }],
          groups: [
            {
              value: "testUserUpdatedGroup1",
              display: "mdsp_usergroup:testUserUpdatedGroup1",
              type: "DIRECT",
            },
          ],
          active: true,
        },
      });
    });

    it("should fetch token first - if token has not been fetched before and then get all users using new token", async () => {
      mockedAuthToken = null;
      mockedAuthTokenElapsedTime = null;

      //Setting token to return first time
      //token timestamp - "2021-01-31T12:58:00.000Z" - 1612097880000
      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //expires in "2021-01-31T13:31:18.766Z" 1612097880000 + 2000*1000-1234 = 1612099878766
      mockedNow = 1612098000000;
      //First axios call - fetch token, second get data
      mockedReturnDataCollection = [
        {
          access_token: "testAccessToken2",
          timestamp: 1612097880000,
          expires_in: 2000,
        },
        ...mockedReturnDataCollection,
      ];

      mockedReturnStatusCollection = [200, ...mockedReturnStatusCollection];
      mockedReturnHeadersCollection = [{}, ...mockedReturnHeadersCollection];

      let result = await exec();

      //expected payload should be equal to payload returned by axios
      let expectedPayload = {
        id: "testUser1Id",
        userName: "testUserName1",
        name: {
          familyName: "testUserFamilyName1",
          givenName: "testUserGivenName1",
        },
        emails: [{ value: "testUserName1@testEmail.com", primary: false }],
        groups: [
          {
            value: "testUserGroup1",
            display: "mdsp_usergroup:testUserGroup1",
            type: "DIRECT",
          },
          {
            value: "testUserGroup2",
            display: "mdsp_usergroup:testUserGroup2",
            type: "DIRECT",
          },
          {
            value: "testUserGroup3",
            display: "mdsp_usergroup:testUserGroup3",
            type: "DIRECT",
          },
        ],
        active: true,
        zoneId: "sidivp",
      };

      expect(result).toEqual(expectedPayload);

      //Call four times - for fetching token and getting user
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      //First call - fetch token
      let base64Key = encodeBase64(`testClientId:testClientSecret`);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testTenantName",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic ${base64Key}`,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "PUT",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users/testUserId`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: {
          id: "testUserUpdated1Id",
          userName: "testUserUpdatedName1",
          name: {
            familyName: "testUserUpdatedFamilyName1",
            givenName: "testUserUpdatedGivenName1",
          },
          emails: [{ value: "testUserUpdatedName1@testEmail.com" }],
          groups: [
            {
              value: "testUserUpdatedGroup1",
              display: "mdsp_usergroup:testUserUpdatedGroup1",
              type: "DIRECT",
            },
          ],
          active: true,
        },
      });
    });

    it("should fetch token first - if token has expired and then get all users using new token", async () => {
      mockedAuthTokenElapsedTime = null;

      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //token elapsed time - "2021-01-31T12:58:00.000Z" 1612097880000
      mockedNow = 1612098000000;
      mockedAuthTokenElapsedTime = 1612097880000;

      //Setting new token to return first time
      //token timestamp - "2021-01-31T12:58:00.000Z" - 1612097880000
      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //expires in "2021-01-31T13:31:18.766Z" 1612097880000 + 2000*1000-1234 = 1612099878766

      //First axios call - fetch token, second get data
      mockedReturnDataCollection = [
        {
          access_token: "testAccessToken2",
          timestamp: 1612097880000,
          expires_in: 2000,
        },
        ...mockedReturnDataCollection,
      ];

      mockedReturnStatusCollection = [200, ...mockedReturnStatusCollection];
      mockedReturnHeadersCollection = [{}, ...mockedReturnHeadersCollection];
      let result = await exec();

      //expected payload should be equal to payload returned by axios
      let expectedPayload = {
        id: "testUser1Id",
        userName: "testUserName1",
        name: {
          familyName: "testUserFamilyName1",
          givenName: "testUserGivenName1",
        },
        emails: [{ value: "testUserName1@testEmail.com", primary: false }],
        groups: [
          {
            value: "testUserGroup1",
            display: "mdsp_usergroup:testUserGroup1",
            type: "DIRECT",
          },
          {
            value: "testUserGroup2",
            display: "mdsp_usergroup:testUserGroup2",
            type: "DIRECT",
          },
          {
            value: "testUserGroup3",
            display: "mdsp_usergroup:testUserGroup3",
            type: "DIRECT",
          },
        ],
        active: true,
        zoneId: "sidivp",
      };

      expect(result).toEqual(expectedPayload);

      //Call four times - for fetching token and getting user
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      //First call - fetch token
      let base64Key = encodeBase64(`testClientId:testClientSecret`);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testTenantName",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic ${base64Key}`,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "PUT",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users/testUserId`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: {
          id: "testUserUpdated1Id",
          userName: "testUserUpdatedName1",
          name: {
            familyName: "testUserUpdatedFamilyName1",
            givenName: "testUserUpdatedGivenName1",
          },
          emails: [{ value: "testUserUpdatedName1@testEmail.com" }],
          groups: [
            {
              value: "testUserUpdatedGroup1",
              display: "mdsp_usergroup:testUserUpdatedGroup1",
              type: "DIRECT",
            },
          ],
          active: true,
        },
      });
    });

    it("should reject - if call rejects", async () => {
      mockedAxios.__setMockError(new Error("test api call error"));

      await expect(exec()).rejects.toMatchObject({
        message: "test api call error",
      });
    });

    it("should reject - if fetching token rejects", async () => {
      mockedAuthToken = null;
      mockedAuthTokenElapsedTime = null;

      mockedAxios.__setMockError(new Error("test api call error"));

      await expect(exec()).rejects.toMatchObject({
        message: "test api call error",
      });

      //request called only once - while fetching token
      expect(axios.request).toHaveBeenCalledTimes(1);
    });
  });

  describe("deleteUser", () => {
    let tenantName: string;
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereUserService: MindSphereUserService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let userId: string;

    beforeEach(() => {
      mockedReturnDataCollection = [
        {
          id: "testUser1Id",
          userName: "testUserName1",
          name: {
            familyName: "testUserFamilyName1",
            givenName: "testUserGivenName1",
          },
          emails: [{ value: "testUserName1@testEmail.com", primary: false }],
          groups: [
            {
              value: "testUserGroup1",
              display: "mdsp_usergroup:testUserGroup1",
              type: "DIRECT",
            },
            {
              value: "testUserGroup2",
              display: "mdsp_usergroup:testUserGroup2",
              type: "DIRECT",
            },
            {
              value: "testUserGroup3",
              display: "mdsp_usergroup:testUserGroup3",
              type: "DIRECT",
            },
          ],
          active: true,
          zoneId: "sidivp",
        },
      ];
      mockedReturnStatusCollection = [200];
      mockedReturnHeadersCollection = [{}];
      mockedAuthToken = "testAuthToken1234";
      mockedAuthTokenElapsedTime = 1612184400000;
      mockedNow = 1612098060000;
      tenantName = "testTenantName";
      userId = "testUserId";
    });

    let exec = async () => {
      //Mocking Token Manager
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance(
        tenantName
      ) as any;
      mockedMindSphereTokenManager._token = mockedAuthToken;
      mockedMindSphereTokenManager._tokenExpireUnixDate = mockedAuthTokenElapsedTime;

      //Getting instance of service
      mindSphereUserService = MindSphereUserService.getInstance();

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereUserService.deleteUser(tenantName, userId);
    };

    it("should call MindSphere Delete User API", async () => {
      await exec();

      //Call one time - to get all users
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "DELETE",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users/testUserId`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    });

    it("should fetch token first - if token has not been fetched before and then get all users using new token", async () => {
      mockedAuthToken = null;
      mockedAuthTokenElapsedTime = null;

      //Setting token to return first time
      //token timestamp - "2021-01-31T12:58:00.000Z" - 1612097880000
      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //expires in "2021-01-31T13:31:18.766Z" 1612097880000 + 2000*1000-1234 = 1612099878766
      mockedNow = 1612098000000;
      //First axios call - fetch token, second get data
      mockedReturnDataCollection = [
        {
          access_token: "testAccessToken2",
          timestamp: 1612097880000,
          expires_in: 2000,
        },
        ...mockedReturnDataCollection,
      ];

      mockedReturnStatusCollection = [200, ...mockedReturnStatusCollection];
      mockedReturnHeadersCollection = [{}, ...mockedReturnHeadersCollection];

      await exec();

      //Call four times - for fetching token and getting user
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      //First call - fetch token
      let base64Key = encodeBase64(`testClientId:testClientSecret`);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testTenantName",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic ${base64Key}`,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "DELETE",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users/testUserId`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    });

    it("should fetch token first - if token has expired and then get all users using new token", async () => {
      mockedAuthTokenElapsedTime = null;

      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //token elapsed time - "2021-01-31T12:58:00.000Z" 1612097880000
      mockedNow = 1612098000000;
      mockedAuthTokenElapsedTime = 1612097880000;

      //Setting new token to return first time
      //token timestamp - "2021-01-31T12:58:00.000Z" - 1612097880000
      //now - "2021-01-31T13:00:00.000Z" - 1612098000000
      //expires in "2021-01-31T13:31:18.766Z" 1612097880000 + 2000*1000-1234 = 1612099878766

      //First axios call - fetch token, second get data
      mockedReturnDataCollection = [
        {
          access_token: "testAccessToken2",
          timestamp: 1612097880000,
          expires_in: 2000,
        },
        ...mockedReturnDataCollection,
      ];

      mockedReturnStatusCollection = [200, ...mockedReturnStatusCollection];
      mockedReturnHeadersCollection = [{}, ...mockedReturnHeadersCollection];

      await exec();

      //Call four times - for fetching token and getting user
      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      //First call - fetch token
      let base64Key = encodeBase64(`testClientId:testClientSecret`);
      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        url: `https://gateway.eu1.mindsphere.io/api/technicaltokenmanager/v3/oauth/token`,
        method: "POST",
        data: {
          appName: "testAppName",
          appVersion: "testAppVersion",
          hostTenant: "testHostTenant",
          userTenant: "testTenantName",
        },
        headers: {
          "Content-Type": "application/json",
          "X-SPACE-AUTH-KEY": `Basic ${base64Key}`,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "DELETE",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users/testUserId`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    });

    it("should reject - if call rejects", async () => {
      mockedAxios.__setMockError(new Error("test api call error"));

      await expect(exec()).rejects.toMatchObject({
        message: "test api call error",
      });
    });

    it("should reject - if fetching token rejects", async () => {
      mockedAuthToken = null;
      mockedAuthTokenElapsedTime = null;

      mockedAxios.__setMockError(new Error("test api call error"));

      await expect(exec()).rejects.toMatchObject({
        message: "test api call error",
      });

      //request called only once - while fetching token
      expect(axios.request).toHaveBeenCalledTimes(1);
    });
  });
});

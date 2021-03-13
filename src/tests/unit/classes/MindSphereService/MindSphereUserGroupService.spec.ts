import { MindSphereTokenManager } from "../../../../classes/MindSphereService/MindSphereToken/MindSphereTokenManager";
import axios from "axios";
import MockDate from "mockdate";
import {
  setPrivateProperty,
  testPrivateProperty,
} from "../../../utilities/utilities";
import { encodeBase64 } from "../../../../utilities/utilities";
import {
  MindSphereUserGroupData,
  MindSphereUserGroupService,
} from "../../../../classes/MindSphereService/MindSphereUserGroupService";

let mockedAxios = axios as any;

describe("MindSphereUserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    //Reseting static class
    (MindSphereTokenManager as any)._instances = {};
    (MindSphereUserGroupService as any)._instance = null;

    //Reseting axios
    mockedAxios.__reset();
  });

  afterEach(() => {
    jest.clearAllMocks();

    //Reseting static class
    (MindSphereTokenManager as any)._instances = {};
    (MindSphereUserGroupService as any)._instance = null;

    //Reseting axios
    mockedAxios.__reset();
  });

  describe("getInstance", () => {
    let exec = () => {
      return MindSphereUserGroupService.getInstance();
    };

    it("should return valid instance of MindSphereUserGroupService", () => {
      let result = exec();

      expect(result).not.toEqual(null);
      expect(result instanceof MindSphereUserGroupService).toEqual(true);
    });

    it("should return the same instance of MindSphereUserGroupService if called several times", () => {
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
        `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`
      );
    });

    it("should properly set max number of user groups per one call", () => {
      let result = exec();

      testPrivateProperty(result, "_maxNumberOfUserGroupsPerOneCall", 100);
    });
  });

  describe("getAllUserGroups", () => {
    let tenantName: string;
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereUserGroupService: MindSphereUserGroupService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let maxNumberOfUserGroupsPerOneCall: number;
    let userGroupId: string | null;
    let userGroupName: string | null;

    beforeEach(() => {
      maxNumberOfUserGroupsPerOneCall = 3;

      mockedReturnDataCollection = [
        {
          resources: [
            {
              id: "testUserGroup1Id",
              displayName: "testUserGroup1DisplayName",
              description: "testUserGroup1Description",
              members: [
                {
                  type: "USER",
                  value: "testUser1",
                },
                {
                  type: "USER",
                  value: "testUser2",
                },
              ],
            },
            {
              id: "testUserGroup2Id",
              displayName: "testUserGroup2DisplayName",
              description: "testUserGroup2Description",
              members: [
                {
                  type: "USER",
                  value: "testUser3",
                },
                {
                  type: "USER",
                  value: "testUser4",
                },
              ],
            },
            {
              id: "testUserGroup3Id",
              displayName: "testUserGroup3DisplayName",
              description: "testUserGroup3Description",
              members: [
                {
                  type: "USER",
                  value: "testUser5",
                },
                {
                  type: "USER",
                  value: "testUser6",
                },
              ],
            },
          ],
          startIndex: 1,
          itemsPerPage: 3,
          totalResults: 8,
        },
        {
          resources: [
            {
              id: "testUserGroup4Id",
              displayName: "testUserGroup4DisplayName",
              description: "testUserGroup4Description",
              members: [
                {
                  type: "USER",
                  value: "testUser7",
                },
                {
                  type: "USER",
                  value: "testUser8",
                },
              ],
            },
            {
              id: "testUserGroup5Id",
              displayName: "testUserGroup5DisplayName",
              description: "testUserGroup5Description",
              members: [
                {
                  type: "USER",
                  value: "testUser9",
                },
                {
                  type: "USER",
                  value: "testUser10",
                },
              ],
            },
            {
              id: "testUserGroup6Id",
              displayName: "testUserGroup6DisplayName",
              description: "testUserGroup6Description",
              members: [
                {
                  type: "USER",
                  value: "testUser11",
                },
                {
                  type: "USER",
                  value: "testUser12",
                },
              ],
            },
          ],
          startIndex: 4,
          itemsPerPage: 3,
          totalResults: 8,
        },
        {
          resources: [
            {
              id: "testUserGroup7Id",
              displayName: "testUserGroup7DisplayName",
              description: "testUserGroup7Description",
              members: [
                {
                  type: "USER",
                  value: "testUser13",
                },
                {
                  type: "USER",
                  value: "testUser14",
                },
              ],
            },
            {
              id: "testUserGroup8Id",
              displayName: "testUserGroup8DisplayName",
              description: "testUserGroup8Description",
              members: [
                {
                  type: "USER",
                  value: "testUser15",
                },
                {
                  type: "USER",
                  value: "testUser16",
                },
              ],
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
      userGroupId = null;
      userGroupName = null;
    });

    let exec = async () => {
      //Mocking Token Manager
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance(
        tenantName
      ) as any;
      mockedMindSphereTokenManager._token = mockedAuthToken;
      mockedMindSphereTokenManager._tokenExpireUnixDate = mockedAuthTokenElapsedTime;

      //Getting instance of service
      mindSphereUserGroupService = MindSphereUserGroupService.getInstance();

      setPrivateProperty(
        mindSphereUserGroupService,
        "_maxNumberOfUserGroupsPerOneCall",
        maxNumberOfUserGroupsPerOneCall
      );

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereUserGroupService.getAllUserGroups(
        tenantName,
        userGroupId,
        userGroupName
      );
    };

    it("should MindSphere Get Users Indexable API and return all users - if there are no filters applied", async () => {
      let result = await exec();

      let expectedPayload = [
        {
          id: "testUserGroup1Id",
          displayName: "testUserGroup1DisplayName",
          description: "testUserGroup1Description",
          members: [
            {
              type: "USER",
              value: "testUser1",
            },
            {
              type: "USER",
              value: "testUser2",
            },
          ],
        },
        {
          id: "testUserGroup2Id",
          displayName: "testUserGroup2DisplayName",
          description: "testUserGroup2Description",
          members: [
            {
              type: "USER",
              value: "testUser3",
            },
            {
              type: "USER",
              value: "testUser4",
            },
          ],
        },
        {
          id: "testUserGroup3Id",
          displayName: "testUserGroup3DisplayName",
          description: "testUserGroup3Description",
          members: [
            {
              type: "USER",
              value: "testUser5",
            },
            {
              type: "USER",
              value: "testUser6",
            },
          ],
        },
        {
          id: "testUserGroup4Id",
          displayName: "testUserGroup4DisplayName",
          description: "testUserGroup4Description",
          members: [
            {
              type: "USER",
              value: "testUser7",
            },
            {
              type: "USER",
              value: "testUser8",
            },
          ],
        },
        {
          id: "testUserGroup5Id",
          displayName: "testUserGroup5DisplayName",
          description: "testUserGroup5Description",
          members: [
            {
              type: "USER",
              value: "testUser9",
            },
            {
              type: "USER",
              value: "testUser10",
            },
          ],
        },
        {
          id: "testUserGroup6Id",
          displayName: "testUserGroup6DisplayName",
          description: "testUserGroup6Description",
          members: [
            {
              type: "USER",
              value: "testUser11",
            },
            {
              type: "USER",
              value: "testUser12",
            },
          ],
        },

        {
          id: "testUserGroup7Id",
          displayName: "testUserGroup7DisplayName",
          description: "testUserGroup7Description",
          members: [
            {
              type: "USER",
              value: "testUser13",
            },
            {
              type: "USER",
              value: "testUser14",
            },
          ],
        },
        {
          id: "testUserGroup8Id",
          displayName: "testUserGroup8DisplayName",
          description: "testUserGroup8Description",
          members: [
            {
              type: "USER",
              value: "testUser15",
            },
            {
              type: "USER",
              value: "testUser16",
            },
          ],
        },
      ];

      expect(result).toEqual(expectedPayload);

      //Call three times - for every user group indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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

    it("should MindSphere Get Users Indexable API and return all users - if there is only a groupId filter", async () => {
      userGroupId = "testGroupId";

      let result = await exec();

      let expectedPayload = [
        {
          id: "testUserGroup1Id",
          displayName: "testUserGroup1DisplayName",
          description: "testUserGroup1Description",
          members: [
            {
              type: "USER",
              value: "testUser1",
            },
            {
              type: "USER",
              value: "testUser2",
            },
          ],
        },
        {
          id: "testUserGroup2Id",
          displayName: "testUserGroup2DisplayName",
          description: "testUserGroup2Description",
          members: [
            {
              type: "USER",
              value: "testUser3",
            },
            {
              type: "USER",
              value: "testUser4",
            },
          ],
        },
        {
          id: "testUserGroup3Id",
          displayName: "testUserGroup3DisplayName",
          description: "testUserGroup3Description",
          members: [
            {
              type: "USER",
              value: "testUser5",
            },
            {
              type: "USER",
              value: "testUser6",
            },
          ],
        },
        {
          id: "testUserGroup4Id",
          displayName: "testUserGroup4DisplayName",
          description: "testUserGroup4Description",
          members: [
            {
              type: "USER",
              value: "testUser7",
            },
            {
              type: "USER",
              value: "testUser8",
            },
          ],
        },
        {
          id: "testUserGroup5Id",
          displayName: "testUserGroup5DisplayName",
          description: "testUserGroup5Description",
          members: [
            {
              type: "USER",
              value: "testUser9",
            },
            {
              type: "USER",
              value: "testUser10",
            },
          ],
        },
        {
          id: "testUserGroup6Id",
          displayName: "testUserGroup6DisplayName",
          description: "testUserGroup6Description",
          members: [
            {
              type: "USER",
              value: "testUser11",
            },
            {
              type: "USER",
              value: "testUser12",
            },
          ],
        },

        {
          id: "testUserGroup7Id",
          displayName: "testUserGroup7DisplayName",
          description: "testUserGroup7Description",
          members: [
            {
              type: "USER",
              value: "testUser13",
            },
            {
              type: "USER",
              value: "testUser14",
            },
          ],
        },
        {
          id: "testUserGroup8Id",
          displayName: "testUserGroup8DisplayName",
          description: "testUserGroup8Description",
          members: [
            {
              type: "USER",
              value: "testUser15",
            },
            {
              type: "USER",
              value: "testUser16",
            },
          ],
        },
      ];

      expect(result).toEqual(expectedPayload);

      //Call three times - for every user group indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 1,
          filter: `id eq "testGroupId"`,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 4,
          filter: `id eq "testGroupId"`,
        },
      });

      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 7,
          filter: `id eq "testGroupId"`,
        },
      });
    });

    it("should MindSphere Get Users Indexable API and return all users - if there is only a groupName filter", async () => {
      userGroupName = "testGroupName";

      let result = await exec();

      let expectedPayload = [
        {
          id: "testUserGroup1Id",
          displayName: "testUserGroup1DisplayName",
          description: "testUserGroup1Description",
          members: [
            {
              type: "USER",
              value: "testUser1",
            },
            {
              type: "USER",
              value: "testUser2",
            },
          ],
        },
        {
          id: "testUserGroup2Id",
          displayName: "testUserGroup2DisplayName",
          description: "testUserGroup2Description",
          members: [
            {
              type: "USER",
              value: "testUser3",
            },
            {
              type: "USER",
              value: "testUser4",
            },
          ],
        },
        {
          id: "testUserGroup3Id",
          displayName: "testUserGroup3DisplayName",
          description: "testUserGroup3Description",
          members: [
            {
              type: "USER",
              value: "testUser5",
            },
            {
              type: "USER",
              value: "testUser6",
            },
          ],
        },
        {
          id: "testUserGroup4Id",
          displayName: "testUserGroup4DisplayName",
          description: "testUserGroup4Description",
          members: [
            {
              type: "USER",
              value: "testUser7",
            },
            {
              type: "USER",
              value: "testUser8",
            },
          ],
        },
        {
          id: "testUserGroup5Id",
          displayName: "testUserGroup5DisplayName",
          description: "testUserGroup5Description",
          members: [
            {
              type: "USER",
              value: "testUser9",
            },
            {
              type: "USER",
              value: "testUser10",
            },
          ],
        },
        {
          id: "testUserGroup6Id",
          displayName: "testUserGroup6DisplayName",
          description: "testUserGroup6Description",
          members: [
            {
              type: "USER",
              value: "testUser11",
            },
            {
              type: "USER",
              value: "testUser12",
            },
          ],
        },

        {
          id: "testUserGroup7Id",
          displayName: "testUserGroup7DisplayName",
          description: "testUserGroup7Description",
          members: [
            {
              type: "USER",
              value: "testUser13",
            },
            {
              type: "USER",
              value: "testUser14",
            },
          ],
        },
        {
          id: "testUserGroup8Id",
          displayName: "testUserGroup8DisplayName",
          description: "testUserGroup8Description",
          members: [
            {
              type: "USER",
              value: "testUser15",
            },
            {
              type: "USER",
              value: "testUser16",
            },
          ],
        },
      ];

      expect(result).toEqual(expectedPayload);

      //Call three times - for every user group indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 1,
          filter: `displayname eq "testGroupName"`,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 4,
          filter: `displayname eq "testGroupName"`,
        },
      });

      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 7,
          filter: `displayname eq "testGroupName"`,
        },
      });
    });

    it("should MindSphere Get Users Indexable API and return all users - if there are both filter applied groupId and groupName", async () => {
      userGroupId = "testGroupId";
      userGroupName = "testGroupName";

      let result = await exec();

      let expectedPayload = [
        {
          id: "testUserGroup1Id",
          displayName: "testUserGroup1DisplayName",
          description: "testUserGroup1Description",
          members: [
            {
              type: "USER",
              value: "testUser1",
            },
            {
              type: "USER",
              value: "testUser2",
            },
          ],
        },
        {
          id: "testUserGroup2Id",
          displayName: "testUserGroup2DisplayName",
          description: "testUserGroup2Description",
          members: [
            {
              type: "USER",
              value: "testUser3",
            },
            {
              type: "USER",
              value: "testUser4",
            },
          ],
        },
        {
          id: "testUserGroup3Id",
          displayName: "testUserGroup3DisplayName",
          description: "testUserGroup3Description",
          members: [
            {
              type: "USER",
              value: "testUser5",
            },
            {
              type: "USER",
              value: "testUser6",
            },
          ],
        },
        {
          id: "testUserGroup4Id",
          displayName: "testUserGroup4DisplayName",
          description: "testUserGroup4Description",
          members: [
            {
              type: "USER",
              value: "testUser7",
            },
            {
              type: "USER",
              value: "testUser8",
            },
          ],
        },
        {
          id: "testUserGroup5Id",
          displayName: "testUserGroup5DisplayName",
          description: "testUserGroup5Description",
          members: [
            {
              type: "USER",
              value: "testUser9",
            },
            {
              type: "USER",
              value: "testUser10",
            },
          ],
        },
        {
          id: "testUserGroup6Id",
          displayName: "testUserGroup6DisplayName",
          description: "testUserGroup6Description",
          members: [
            {
              type: "USER",
              value: "testUser11",
            },
            {
              type: "USER",
              value: "testUser12",
            },
          ],
        },

        {
          id: "testUserGroup7Id",
          displayName: "testUserGroup7DisplayName",
          description: "testUserGroup7Description",
          members: [
            {
              type: "USER",
              value: "testUser13",
            },
            {
              type: "USER",
              value: "testUser14",
            },
          ],
        },
        {
          id: "testUserGroup8Id",
          displayName: "testUserGroup8DisplayName",
          description: "testUserGroup8Description",
          members: [
            {
              type: "USER",
              value: "testUser15",
            },
            {
              type: "USER",
              value: "testUser16",
            },
          ],
        },
      ];

      expect(result).toEqual(expectedPayload);

      //Call three times - for every user group indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 1,
          filter: `id eq "testGroupId" and displayname eq "testGroupName"`,
        },
      });

      expect(mockedAxios.request.mock.calls[1][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 4,
          filter: `id eq "testGroupId" and displayname eq "testGroupName"`,
        },
      });

      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 3,
          sortBy: "id",
          startIndex: 7,
          filter: `id eq "testGroupId" and displayname eq "testGroupName"`,
        },
      });
    });

    it("should MindSphere Get Users Indexable API and return all users - if number of users is exactly max number of users per one call", async () => {
      maxNumberOfUserGroupsPerOneCall = 8;

      mockedReturnDataCollection = [
        {
          resources: [
            {
              id: "testUserGroup1Id",
              displayName: "testUserGroup1DisplayName",
              description: "testUserGroup1Description",
              members: [
                {
                  type: "USER",
                  value: "testUser1",
                },
                {
                  type: "USER",
                  value: "testUser2",
                },
              ],
            },
            {
              id: "testUserGroup2Id",
              displayName: "testUserGroup2DisplayName",
              description: "testUserGroup2Description",
              members: [
                {
                  type: "USER",
                  value: "testUser3",
                },
                {
                  type: "USER",
                  value: "testUser4",
                },
              ],
            },
            {
              id: "testUserGroup3Id",
              displayName: "testUserGroup3DisplayName",
              description: "testUserGroup3Description",
              members: [
                {
                  type: "USER",
                  value: "testUser5",
                },
                {
                  type: "USER",
                  value: "testUser6",
                },
              ],
            },
            {
              id: "testUserGroup4Id",
              displayName: "testUserGroup4DisplayName",
              description: "testUserGroup4Description",
              members: [
                {
                  type: "USER",
                  value: "testUser7",
                },
                {
                  type: "USER",
                  value: "testUser8",
                },
              ],
            },
            {
              id: "testUserGroup5Id",
              displayName: "testUserGroup5DisplayName",
              description: "testUserGroup5Description",
              members: [
                {
                  type: "USER",
                  value: "testUser9",
                },
                {
                  type: "USER",
                  value: "testUser10",
                },
              ],
            },
            {
              id: "testUserGroup6Id",
              displayName: "testUserGroup6DisplayName",
              description: "testUserGroup6Description",
              members: [
                {
                  type: "USER",
                  value: "testUser11",
                },
                {
                  type: "USER",
                  value: "testUser12",
                },
              ],
            },
            {
              id: "testUserGroup7Id",
              displayName: "testUserGroup7DisplayName",
              description: "testUserGroup7Description",
              members: [
                {
                  type: "USER",
                  value: "testUser13",
                },
                {
                  type: "USER",
                  value: "testUser14",
                },
              ],
            },
            {
              id: "testUserGroup8Id",
              displayName: "testUserGroup8DisplayName",
              description: "testUserGroup8Description",
              members: [
                {
                  type: "USER",
                  value: "testUser15",
                },
                {
                  type: "USER",
                  value: "testUser16",
                },
              ],
            },
          ],
          startIndex: 1,
          itemsPerPage: 8,
          totalResults: 8,
        },
      ];
      let result = await exec();

      let expectedPayload = [
        {
          id: "testUserGroup1Id",
          displayName: "testUserGroup1DisplayName",
          description: "testUserGroup1Description",
          members: [
            {
              type: "USER",
              value: "testUser1",
            },
            {
              type: "USER",
              value: "testUser2",
            },
          ],
        },
        {
          id: "testUserGroup2Id",
          displayName: "testUserGroup2DisplayName",
          description: "testUserGroup2Description",
          members: [
            {
              type: "USER",
              value: "testUser3",
            },
            {
              type: "USER",
              value: "testUser4",
            },
          ],
        },
        {
          id: "testUserGroup3Id",
          displayName: "testUserGroup3DisplayName",
          description: "testUserGroup3Description",
          members: [
            {
              type: "USER",
              value: "testUser5",
            },
            {
              type: "USER",
              value: "testUser6",
            },
          ],
        },
        {
          id: "testUserGroup4Id",
          displayName: "testUserGroup4DisplayName",
          description: "testUserGroup4Description",
          members: [
            {
              type: "USER",
              value: "testUser7",
            },
            {
              type: "USER",
              value: "testUser8",
            },
          ],
        },
        {
          id: "testUserGroup5Id",
          displayName: "testUserGroup5DisplayName",
          description: "testUserGroup5Description",
          members: [
            {
              type: "USER",
              value: "testUser9",
            },
            {
              type: "USER",
              value: "testUser10",
            },
          ],
        },
        {
          id: "testUserGroup6Id",
          displayName: "testUserGroup6DisplayName",
          description: "testUserGroup6Description",
          members: [
            {
              type: "USER",
              value: "testUser11",
            },
            {
              type: "USER",
              value: "testUser12",
            },
          ],
        },

        {
          id: "testUserGroup7Id",
          displayName: "testUserGroup7DisplayName",
          description: "testUserGroup7Description",
          members: [
            {
              type: "USER",
              value: "testUser13",
            },
            {
              type: "USER",
              value: "testUser14",
            },
          ],
        },
        {
          id: "testUserGroup8Id",
          displayName: "testUserGroup8DisplayName",
          description: "testUserGroup8Description",
          members: [
            {
              type: "USER",
              value: "testUser15",
            },
            {
              type: "USER",
              value: "testUser16",
            },
          ],
        },
      ];

      expect(result).toEqual(expectedPayload);

      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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

    it("should MindSphere Get Users Indexable API and return all users - if number of users is smaller then max number of users per one call", async () => {
      maxNumberOfUserGroupsPerOneCall = 10;

      mockedReturnDataCollection = [
        {
          resources: [
            {
              id: "testUserGroup1Id",
              displayName: "testUserGroup1DisplayName",
              description: "testUserGroup1Description",
              members: [
                {
                  type: "USER",
                  value: "testUser1",
                },
                {
                  type: "USER",
                  value: "testUser2",
                },
              ],
            },
            {
              id: "testUserGroup2Id",
              displayName: "testUserGroup2DisplayName",
              description: "testUserGroup2Description",
              members: [
                {
                  type: "USER",
                  value: "testUser3",
                },
                {
                  type: "USER",
                  value: "testUser4",
                },
              ],
            },
            {
              id: "testUserGroup3Id",
              displayName: "testUserGroup3DisplayName",
              description: "testUserGroup3Description",
              members: [
                {
                  type: "USER",
                  value: "testUser5",
                },
                {
                  type: "USER",
                  value: "testUser6",
                },
              ],
            },
            {
              id: "testUserGroup4Id",
              displayName: "testUserGroup4DisplayName",
              description: "testUserGroup4Description",
              members: [
                {
                  type: "USER",
                  value: "testUser7",
                },
                {
                  type: "USER",
                  value: "testUser8",
                },
              ],
            },
            {
              id: "testUserGroup5Id",
              displayName: "testUserGroup5DisplayName",
              description: "testUserGroup5Description",
              members: [
                {
                  type: "USER",
                  value: "testUser9",
                },
                {
                  type: "USER",
                  value: "testUser10",
                },
              ],
            },
            {
              id: "testUserGroup6Id",
              displayName: "testUserGroup6DisplayName",
              description: "testUserGroup6Description",
              members: [
                {
                  type: "USER",
                  value: "testUser11",
                },
                {
                  type: "USER",
                  value: "testUser12",
                },
              ],
            },
            {
              id: "testUserGroup7Id",
              displayName: "testUserGroup7DisplayName",
              description: "testUserGroup7Description",
              members: [
                {
                  type: "USER",
                  value: "testUser13",
                },
                {
                  type: "USER",
                  value: "testUser14",
                },
              ],
            },
            {
              id: "testUserGroup8Id",
              displayName: "testUserGroup8DisplayName",
              description: "testUserGroup8Description",
              members: [
                {
                  type: "USER",
                  value: "testUser15",
                },
                {
                  type: "USER",
                  value: "testUser16",
                },
              ],
            },
          ],
          startIndex: 1,
          itemsPerPage: 10,
          totalResults: 8,
        },
      ];
      let result = await exec();

      let expectedPayload = [
        {
          id: "testUserGroup1Id",
          displayName: "testUserGroup1DisplayName",
          description: "testUserGroup1Description",
          members: [
            {
              type: "USER",
              value: "testUser1",
            },
            {
              type: "USER",
              value: "testUser2",
            },
          ],
        },
        {
          id: "testUserGroup2Id",
          displayName: "testUserGroup2DisplayName",
          description: "testUserGroup2Description",
          members: [
            {
              type: "USER",
              value: "testUser3",
            },
            {
              type: "USER",
              value: "testUser4",
            },
          ],
        },
        {
          id: "testUserGroup3Id",
          displayName: "testUserGroup3DisplayName",
          description: "testUserGroup3Description",
          members: [
            {
              type: "USER",
              value: "testUser5",
            },
            {
              type: "USER",
              value: "testUser6",
            },
          ],
        },
        {
          id: "testUserGroup4Id",
          displayName: "testUserGroup4DisplayName",
          description: "testUserGroup4Description",
          members: [
            {
              type: "USER",
              value: "testUser7",
            },
            {
              type: "USER",
              value: "testUser8",
            },
          ],
        },
        {
          id: "testUserGroup5Id",
          displayName: "testUserGroup5DisplayName",
          description: "testUserGroup5Description",
          members: [
            {
              type: "USER",
              value: "testUser9",
            },
            {
              type: "USER",
              value: "testUser10",
            },
          ],
        },
        {
          id: "testUserGroup6Id",
          displayName: "testUserGroup6DisplayName",
          description: "testUserGroup6Description",
          members: [
            {
              type: "USER",
              value: "testUser11",
            },
            {
              type: "USER",
              value: "testUser12",
            },
          ],
        },

        {
          id: "testUserGroup7Id",
          displayName: "testUserGroup7DisplayName",
          description: "testUserGroup7Description",
          members: [
            {
              type: "USER",
              value: "testUser13",
            },
            {
              type: "USER",
              value: "testUser14",
            },
          ],
        },
        {
          id: "testUserGroup8Id",
          displayName: "testUserGroup8DisplayName",
          description: "testUserGroup8Description",
          members: [
            {
              type: "USER",
              value: "testUser15",
            },
            {
              type: "USER",
              value: "testUser16",
            },
          ],
        },
      ];

      expect(result).toEqual(expectedPayload);

      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          count: 10,
          sortBy: "id",
          startIndex: 1,
        },
      });
    });

    it("should MindSphere Get Users Indexable API and return all users - if number of users is exactly a multiplication of max number of users per one call", async () => {
      maxNumberOfUserGroupsPerOneCall = 3;

      mockedReturnDataCollection = [
        {
          resources: [
            {
              id: "testUserGroup1Id",
              displayName: "testUserGroup1DisplayName",
              description: "testUserGroup1Description",
              members: [
                {
                  type: "USER",
                  value: "testUser1",
                },
                {
                  type: "USER",
                  value: "testUser2",
                },
              ],
            },
            {
              id: "testUserGroup2Id",
              displayName: "testUserGroup2DisplayName",
              description: "testUserGroup2Description",
              members: [
                {
                  type: "USER",
                  value: "testUser3",
                },
                {
                  type: "USER",
                  value: "testUser4",
                },
              ],
            },
            {
              id: "testUserGroup3Id",
              displayName: "testUserGroup3DisplayName",
              description: "testUserGroup3Description",
              members: [
                {
                  type: "USER",
                  value: "testUser5",
                },
                {
                  type: "USER",
                  value: "testUser6",
                },
              ],
            },
          ],
          startIndex: 1,
          itemsPerPage: 3,
          totalResults: 9,
        },
        {
          resources: [
            {
              id: "testUserGroup4Id",
              displayName: "testUserGroup4DisplayName",
              description: "testUserGroup4Description",
              members: [
                {
                  type: "USER",
                  value: "testUser7",
                },
                {
                  type: "USER",
                  value: "testUser8",
                },
              ],
            },
            {
              id: "testUserGroup5Id",
              displayName: "testUserGroup5DisplayName",
              description: "testUserGroup5Description",
              members: [
                {
                  type: "USER",
                  value: "testUser9",
                },
                {
                  type: "USER",
                  value: "testUser10",
                },
              ],
            },
            {
              id: "testUserGroup6Id",
              displayName: "testUserGroup6DisplayName",
              description: "testUserGroup6Description",
              members: [
                {
                  type: "USER",
                  value: "testUser11",
                },
                {
                  type: "USER",
                  value: "testUser12",
                },
              ],
            },
          ],
          startIndex: 4,
          itemsPerPage: 3,
          totalResults: 9,
        },
        {
          resources: [
            {
              id: "testUserGroup7Id",
              displayName: "testUserGroup7DisplayName",
              description: "testUserGroup7Description",
              members: [
                {
                  type: "USER",
                  value: "testUser13",
                },
                {
                  type: "USER",
                  value: "testUser14",
                },
              ],
            },
            {
              id: "testUserGroup8Id",
              displayName: "testUserGroup8DisplayName",
              description: "testUserGroup8Description",
              members: [
                {
                  type: "USER",
                  value: "testUser15",
                },
                {
                  type: "USER",
                  value: "testUser16",
                },
              ],
            },
            {
              id: "testUserGroup9Id",
              displayName: "testUserGroup9DisplayName",
              description: "testUserGroup9Description",
              members: [
                {
                  type: "USER",
                  value: "testUser17",
                },
                {
                  type: "USER",
                  value: "testUser18",
                },
              ],
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
          id: "testUserGroup1Id",
          displayName: "testUserGroup1DisplayName",
          description: "testUserGroup1Description",
          members: [
            {
              type: "USER",
              value: "testUser1",
            },
            {
              type: "USER",
              value: "testUser2",
            },
          ],
        },
        {
          id: "testUserGroup2Id",
          displayName: "testUserGroup2DisplayName",
          description: "testUserGroup2Description",
          members: [
            {
              type: "USER",
              value: "testUser3",
            },
            {
              type: "USER",
              value: "testUser4",
            },
          ],
        },
        {
          id: "testUserGroup3Id",
          displayName: "testUserGroup3DisplayName",
          description: "testUserGroup3Description",
          members: [
            {
              type: "USER",
              value: "testUser5",
            },
            {
              type: "USER",
              value: "testUser6",
            },
          ],
        },
        {
          id: "testUserGroup4Id",
          displayName: "testUserGroup4DisplayName",
          description: "testUserGroup4Description",
          members: [
            {
              type: "USER",
              value: "testUser7",
            },
            {
              type: "USER",
              value: "testUser8",
            },
          ],
        },
        {
          id: "testUserGroup5Id",
          displayName: "testUserGroup5DisplayName",
          description: "testUserGroup5Description",
          members: [
            {
              type: "USER",
              value: "testUser9",
            },
            {
              type: "USER",
              value: "testUser10",
            },
          ],
        },
        {
          id: "testUserGroup6Id",
          displayName: "testUserGroup6DisplayName",
          description: "testUserGroup6Description",
          members: [
            {
              type: "USER",
              value: "testUser11",
            },
            {
              type: "USER",
              value: "testUser12",
            },
          ],
        },
        {
          id: "testUserGroup7Id",
          displayName: "testUserGroup7DisplayName",
          description: "testUserGroup7Description",
          members: [
            {
              type: "USER",
              value: "testUser13",
            },
            {
              type: "USER",
              value: "testUser14",
            },
          ],
        },
        {
          id: "testUserGroup8Id",
          displayName: "testUserGroup8DisplayName",
          description: "testUserGroup8Description",
          members: [
            {
              type: "USER",
              value: "testUser15",
            },
            {
              type: "USER",
              value: "testUser16",
            },
          ],
        },
        {
          id: "testUserGroup9Id",
          displayName: "testUserGroup9DisplayName",
          description: "testUserGroup9Description",
          members: [
            {
              type: "USER",
              value: "testUser17",
            },
            {
              type: "USER",
              value: "testUser18",
            },
          ],
        },
      ];

      expect(result).toEqual(expectedPayload);

      expect(mockedAxios.request).toHaveBeenCalledTimes(3);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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

    it("should MindSphere Get Users Indexable API and return empty array - if request returns empty array", async () => {
      maxNumberOfUserGroupsPerOneCall = 3;

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

      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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

    it("should MindSphere Get Users Indexable API and return empty array - if first request is null", async () => {
      maxNumberOfUserGroupsPerOneCall = 3;

      mockedReturnDataCollection = [null];
      let result = await exec();

      let expectedPayload: any[] = [];

      expect(result).toEqual(expectedPayload);

      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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

    it("should MindSphere Get Users Indexable API and return empty array - if first request returns response without resources", async () => {
      maxNumberOfUserGroupsPerOneCall = 3;

      mockedReturnDataCollection = [
        {
          startIndex: 1,
          itemsPerPage: 3,
          totalResults: 0,
        },
      ];
      let result = await exec();

      let expectedPayload: any[] = [];

      expect(result).toEqual(expectedPayload);

      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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

    it("should MindSphere Get Users Indexable API and return empty array - if first request returns response without startIndex", async () => {
      maxNumberOfUserGroupsPerOneCall = 3;

      mockedReturnDataCollection = [
        {
          resources: [
            {
              id: "testUserGroup1Id",
              displayName: "testUserGroup1DisplayName",
              description: "testUserGroup1Description",
              members: [
                {
                  type: "USER",
                  value: "testUser1",
                },
                {
                  type: "USER",
                  value: "testUser2",
                },
              ],
            },
            {
              id: "testUserGroup2Id",
              displayName: "testUserGroup2DisplayName",
              description: "testUserGroup2Description",
              members: [
                {
                  type: "USER",
                  value: "testUser3",
                },
                {
                  type: "USER",
                  value: "testUser4",
                },
              ],
            },
            {
              id: "testUserGroup3Id",
              displayName: "testUserGroup3DisplayName",
              description: "testUserGroup3Description",
              members: [
                {
                  type: "USER",
                  value: "testUser5",
                },
                {
                  type: "USER",
                  value: "testUser6",
                },
              ],
            },
          ],
          itemsPerPage: 3,
          totalResults: 0,
        },
      ];
      let result = await exec();

      let expectedPayload = [
        {
          id: "testUserGroup1Id",
          displayName: "testUserGroup1DisplayName",
          description: "testUserGroup1Description",
          members: [
            {
              type: "USER",
              value: "testUser1",
            },
            {
              type: "USER",
              value: "testUser2",
            },
          ],
        },
        {
          id: "testUserGroup2Id",
          displayName: "testUserGroup2DisplayName",
          description: "testUserGroup2Description",
          members: [
            {
              type: "USER",
              value: "testUser3",
            },
            {
              type: "USER",
              value: "testUser4",
            },
          ],
        },
        {
          id: "testUserGroup3Id",
          displayName: "testUserGroup3DisplayName",
          description: "testUserGroup3Description",
          members: [
            {
              type: "USER",
              value: "testUser5",
            },
            {
              type: "USER",
              value: "testUser6",
            },
          ],
        },
      ];

      expect(result).toEqual(expectedPayload);

      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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

    it("should MindSphere Get Users Indexable API and return empty array - if first request returns response without itemsPerPage", async () => {
      maxNumberOfUserGroupsPerOneCall = 3;

      mockedReturnDataCollection = [
        {
          resources: [
            {
              id: "testUserGroup1Id",
              displayName: "testUserGroup1DisplayName",
              description: "testUserGroup1Description",
              members: [
                {
                  type: "USER",
                  value: "testUser1",
                },
                {
                  type: "USER",
                  value: "testUser2",
                },
              ],
            },
            {
              id: "testUserGroup2Id",
              displayName: "testUserGroup2DisplayName",
              description: "testUserGroup2Description",
              members: [
                {
                  type: "USER",
                  value: "testUser3",
                },
                {
                  type: "USER",
                  value: "testUser4",
                },
              ],
            },
            {
              id: "testUserGroup3Id",
              displayName: "testUserGroup3DisplayName",
              description: "testUserGroup3Description",
              members: [
                {
                  type: "USER",
                  value: "testUser5",
                },
                {
                  type: "USER",
                  value: "testUser6",
                },
              ],
            },
          ],
          startIndex: 1,
          totalResults: 0,
        },
      ];
      let result = await exec();

      let expectedPayload = [
        {
          id: "testUserGroup1Id",
          displayName: "testUserGroup1DisplayName",
          description: "testUserGroup1Description",
          members: [
            {
              type: "USER",
              value: "testUser1",
            },
            {
              type: "USER",
              value: "testUser2",
            },
          ],
        },
        {
          id: "testUserGroup2Id",
          displayName: "testUserGroup2DisplayName",
          description: "testUserGroup2Description",
          members: [
            {
              type: "USER",
              value: "testUser3",
            },
            {
              type: "USER",
              value: "testUser4",
            },
          ],
        },
        {
          id: "testUserGroup3Id",
          displayName: "testUserGroup3DisplayName",
          description: "testUserGroup3Description",
          members: [
            {
              type: "USER",
              value: "testUser5",
            },
            {
              type: "USER",
              value: "testUser6",
            },
          ],
        },
      ];

      expect(result).toEqual(expectedPayload);

      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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

    it("should MindSphere Get Users Indexable API and return empty array - if first request returns response without totalResults", async () => {
      maxNumberOfUserGroupsPerOneCall = 3;

      mockedReturnDataCollection = [
        {
          resources: [
            {
              id: "testUserGroup1Id",
              displayName: "testUserGroup1DisplayName",
              description: "testUserGroup1Description",
              members: [
                {
                  type: "USER",
                  value: "testUser1",
                },
                {
                  type: "USER",
                  value: "testUser2",
                },
              ],
            },
            {
              id: "testUserGroup2Id",
              displayName: "testUserGroup2DisplayName",
              description: "testUserGroup2Description",
              members: [
                {
                  type: "USER",
                  value: "testUser3",
                },
                {
                  type: "USER",
                  value: "testUser4",
                },
              ],
            },
            {
              id: "testUserGroup3Id",
              displayName: "testUserGroup3DisplayName",
              description: "testUserGroup3Description",
              members: [
                {
                  type: "USER",
                  value: "testUser5",
                },
                {
                  type: "USER",
                  value: "testUser6",
                },
              ],
            },
          ],
          startIndex: 1,
          itemsPerPage: 3,
        },
      ];
      let result = await exec();

      let expectedPayload = [
        {
          id: "testUserGroup1Id",
          displayName: "testUserGroup1DisplayName",
          description: "testUserGroup1Description",
          members: [
            {
              type: "USER",
              value: "testUser1",
            },
            {
              type: "USER",
              value: "testUser2",
            },
          ],
        },
        {
          id: "testUserGroup2Id",
          displayName: "testUserGroup2DisplayName",
          description: "testUserGroup2Description",
          members: [
            {
              type: "USER",
              value: "testUser3",
            },
            {
              type: "USER",
              value: "testUser4",
            },
          ],
        },
        {
          id: "testUserGroup3Id",
          displayName: "testUserGroup3DisplayName",
          description: "testUserGroup3Description",
          members: [
            {
              type: "USER",
              value: "testUser5",
            },
            {
              type: "USER",
              value: "testUser6",
            },
          ],
        },
      ];

      expect(result).toEqual(expectedPayload);

      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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

    it("should MindSphere Get Users Indexable API and return empty array - if second request is null", async () => {
      maxNumberOfUserGroupsPerOneCall = 3;

      mockedReturnDataCollection = [
        {
          resources: [
            {
              id: "testUserGroup1Id",
              displayName: "testUserGroup1DisplayName",
              description: "testUserGroup1Description",
              members: [
                {
                  type: "USER",
                  value: "testUser1",
                },
                {
                  type: "USER",
                  value: "testUser2",
                },
              ],
            },
            {
              id: "testUserGroup2Id",
              displayName: "testUserGroup2DisplayName",
              description: "testUserGroup2Description",
              members: [
                {
                  type: "USER",
                  value: "testUser3",
                },
                {
                  type: "USER",
                  value: "testUser4",
                },
              ],
            },
            {
              id: "testUserGroup3Id",
              displayName: "testUserGroup3DisplayName",
              description: "testUserGroup3Description",
              members: [
                {
                  type: "USER",
                  value: "testUser5",
                },
                {
                  type: "USER",
                  value: "testUser6",
                },
              ],
            },
          ],
          startIndex: 1,
          itemsPerPage: 3,
          totalResults: 8,
        },
        null,
      ];

      let result = await exec();

      let expectedPayload = [
        {
          id: "testUserGroup1Id",
          displayName: "testUserGroup1DisplayName",
          description: "testUserGroup1Description",
          members: [
            {
              type: "USER",
              value: "testUser1",
            },
            {
              type: "USER",
              value: "testUser2",
            },
          ],
        },
        {
          id: "testUserGroup2Id",
          displayName: "testUserGroup2DisplayName",
          description: "testUserGroup2Description",
          members: [
            {
              type: "USER",
              value: "testUser3",
            },
            {
              type: "USER",
              value: "testUser4",
            },
          ],
        },
        {
          id: "testUserGroup3Id",
          displayName: "testUserGroup3DisplayName",
          description: "testUserGroup3Description",
          members: [
            {
              type: "USER",
              value: "testUser5",
            },
            {
              type: "USER",
              value: "testUser6",
            },
          ],
        },
      ];

      expect(result).toEqual(expectedPayload);

      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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

    it("should MindSphere Get Users Indexable API and return empty array - if second request returns response without resources", async () => {
      maxNumberOfUserGroupsPerOneCall = 3;

      mockedReturnDataCollection = [
        {
          resources: [
            {
              id: "testUserGroup1Id",
              displayName: "testUserGroup1DisplayName",
              description: "testUserGroup1Description",
              members: [
                {
                  type: "USER",
                  value: "testUser1",
                },
                {
                  type: "USER",
                  value: "testUser2",
                },
              ],
            },
            {
              id: "testUserGroup2Id",
              displayName: "testUserGroup2DisplayName",
              description: "testUserGroup2Description",
              members: [
                {
                  type: "USER",
                  value: "testUser3",
                },
                {
                  type: "USER",
                  value: "testUser4",
                },
              ],
            },
            {
              id: "testUserGroup3Id",
              displayName: "testUserGroup3DisplayName",
              description: "testUserGroup3Description",
              members: [
                {
                  type: "USER",
                  value: "testUser5",
                },
                {
                  type: "USER",
                  value: "testUser6",
                },
              ],
            },
          ],
          startIndex: 1,
          itemsPerPage: 3,
          totalResults: 8,
        },
        {
          startIndex: 4,
          itemsPerPage: 3,
          totalResults: 8,
        },
        {
          resources: [
            {
              id: "testUserGroup7Id",
              displayName: "testUserGroup7DisplayName",
              description: "testUserGroup7Description",
              members: [
                {
                  type: "USER",
                  value: "testUser13",
                },
                {
                  type: "USER",
                  value: "testUser14",
                },
              ],
            },
            {
              id: "testUserGroup8Id",
              displayName: "testUserGroup8DisplayName",
              description: "testUserGroup8Description",
              members: [
                {
                  type: "USER",
                  value: "testUser15",
                },
                {
                  type: "USER",
                  value: "testUser16",
                },
              ],
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
          id: "testUserGroup1Id",
          displayName: "testUserGroup1DisplayName",
          description: "testUserGroup1Description",
          members: [
            {
              type: "USER",
              value: "testUser1",
            },
            {
              type: "USER",
              value: "testUser2",
            },
          ],
        },
        {
          id: "testUserGroup2Id",
          displayName: "testUserGroup2DisplayName",
          description: "testUserGroup2Description",
          members: [
            {
              type: "USER",
              value: "testUser3",
            },
            {
              type: "USER",
              value: "testUser4",
            },
          ],
        },
        {
          id: "testUserGroup3Id",
          displayName: "testUserGroup3DisplayName",
          description: "testUserGroup3Description",
          members: [
            {
              type: "USER",
              value: "testUser5",
            },
            {
              type: "USER",
              value: "testUser6",
            },
          ],
        },
        {
          id: "testUserGroup7Id",
          displayName: "testUserGroup7DisplayName",
          description: "testUserGroup7Description",
          members: [
            {
              type: "USER",
              value: "testUser13",
            },
            {
              type: "USER",
              value: "testUser14",
            },
          ],
        },
        {
          id: "testUserGroup8Id",
          displayName: "testUserGroup8DisplayName",
          description: "testUserGroup8Description",
          members: [
            {
              type: "USER",
              value: "testUser15",
            },
            {
              type: "USER",
              value: "testUser16",
            },
          ],
        },
      ];

      expect(result).toEqual(expectedPayload);

      expect(mockedAxios.request).toHaveBeenCalledTimes(3);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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

      //Called three times - empty array should not have been taken into account, but should not block method from getting values from further requests
      expect(mockedAxios.request.mock.calls[2][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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

    it("should MindSphere Get Users Indexable API and return empty array - if second request returns response without startIndex", async () => {
      maxNumberOfUserGroupsPerOneCall = 3;

      mockedReturnDataCollection = [
        {
          resources: [
            {
              id: "testUserGroup1Id",
              displayName: "testUserGroup1DisplayName",
              description: "testUserGroup1Description",
              members: [
                {
                  type: "USER",
                  value: "testUser1",
                },
                {
                  type: "USER",
                  value: "testUser2",
                },
              ],
            },
            {
              id: "testUserGroup2Id",
              displayName: "testUserGroup2DisplayName",
              description: "testUserGroup2Description",
              members: [
                {
                  type: "USER",
                  value: "testUser3",
                },
                {
                  type: "USER",
                  value: "testUser4",
                },
              ],
            },
            {
              id: "testUserGroup3Id",
              displayName: "testUserGroup3DisplayName",
              description: "testUserGroup3Description",
              members: [
                {
                  type: "USER",
                  value: "testUser5",
                },
                {
                  type: "USER",
                  value: "testUser6",
                },
              ],
            },
          ],
          startIndex: 1,
          itemsPerPage: 3,
          totalResults: 8,
        },
        {
          resources: [
            {
              id: "testUserGroup4Id",
              displayName: "testUserGroup4DisplayName",
              description: "testUserGroup4Description",
              members: [
                {
                  type: "USER",
                  value: "testUser7",
                },
                {
                  type: "USER",
                  value: "testUser8",
                },
              ],
            },
            {
              id: "testUserGroup5Id",
              displayName: "testUserGroup5DisplayName",
              description: "testUserGroup5Description",
              members: [
                {
                  type: "USER",
                  value: "testUser9",
                },
                {
                  type: "USER",
                  value: "testUser10",
                },
              ],
            },
            {
              id: "testUserGroup6Id",
              displayName: "testUserGroup6DisplayName",
              description: "testUserGroup6Description",
              members: [
                {
                  type: "USER",
                  value: "testUser11",
                },
                {
                  type: "USER",
                  value: "testUser12",
                },
              ],
            },
          ],
          itemsPerPage: 3,
          totalResults: 8,
        },
      ];
      let result = await exec();

      let expectedPayload = [
        {
          id: "testUserGroup1Id",
          displayName: "testUserGroup1DisplayName",
          description: "testUserGroup1Description",
          members: [
            {
              type: "USER",
              value: "testUser1",
            },
            {
              type: "USER",
              value: "testUser2",
            },
          ],
        },
        {
          id: "testUserGroup2Id",
          displayName: "testUserGroup2DisplayName",
          description: "testUserGroup2Description",
          members: [
            {
              type: "USER",
              value: "testUser3",
            },
            {
              type: "USER",
              value: "testUser4",
            },
          ],
        },
        {
          id: "testUserGroup3Id",
          displayName: "testUserGroup3DisplayName",
          description: "testUserGroup3Description",
          members: [
            {
              type: "USER",
              value: "testUser5",
            },
            {
              type: "USER",
              value: "testUser6",
            },
          ],
        },
        {
          id: "testUserGroup4Id",
          displayName: "testUserGroup4DisplayName",
          description: "testUserGroup4Description",
          members: [
            {
              type: "USER",
              value: "testUser7",
            },
            {
              type: "USER",
              value: "testUser8",
            },
          ],
        },
        {
          id: "testUserGroup5Id",
          displayName: "testUserGroup5DisplayName",
          description: "testUserGroup5Description",
          members: [
            {
              type: "USER",
              value: "testUser9",
            },
            {
              type: "USER",
              value: "testUser10",
            },
          ],
        },
        {
          id: "testUserGroup6Id",
          displayName: "testUserGroup6DisplayName",
          description: "testUserGroup6Description",
          members: [
            {
              type: "USER",
              value: "testUser11",
            },
            {
              type: "USER",
              value: "testUser12",
            },
          ],
        },
      ];

      expect(result).toEqual(expectedPayload);

      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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

    it("should MindSphere Get Users Indexable API and return empty array - if second request returns response without itemsPerPage", async () => {
      maxNumberOfUserGroupsPerOneCall = 3;

      mockedReturnDataCollection = [
        {
          resources: [
            {
              id: "testUserGroup1Id",
              displayName: "testUserGroup1DisplayName",
              description: "testUserGroup1Description",
              members: [
                {
                  type: "USER",
                  value: "testUser1",
                },
                {
                  type: "USER",
                  value: "testUser2",
                },
              ],
            },
            {
              id: "testUserGroup2Id",
              displayName: "testUserGroup2DisplayName",
              description: "testUserGroup2Description",
              members: [
                {
                  type: "USER",
                  value: "testUser3",
                },
                {
                  type: "USER",
                  value: "testUser4",
                },
              ],
            },
            {
              id: "testUserGroup3Id",
              displayName: "testUserGroup3DisplayName",
              description: "testUserGroup3Description",
              members: [
                {
                  type: "USER",
                  value: "testUser5",
                },
                {
                  type: "USER",
                  value: "testUser6",
                },
              ],
            },
          ],
          startIndex: 1,
          itemsPerPage: 3,
          totalResults: 8,
        },
        {
          resources: [
            {
              id: "testUserGroup4Id",
              displayName: "testUserGroup4DisplayName",
              description: "testUserGroup4Description",
              members: [
                {
                  type: "USER",
                  value: "testUser7",
                },
                {
                  type: "USER",
                  value: "testUser8",
                },
              ],
            },
            {
              id: "testUserGroup5Id",
              displayName: "testUserGroup5DisplayName",
              description: "testUserGroup5Description",
              members: [
                {
                  type: "USER",
                  value: "testUser9",
                },
                {
                  type: "USER",
                  value: "testUser10",
                },
              ],
            },
            {
              id: "testUserGroup6Id",
              displayName: "testUserGroup6DisplayName",
              description: "testUserGroup6Description",
              members: [
                {
                  type: "USER",
                  value: "testUser11",
                },
                {
                  type: "USER",
                  value: "testUser12",
                },
              ],
            },
          ],
          startIndex: 4,
          totalResults: 8,
        },
      ];

      let result = await exec();

      let expectedPayload = [
        {
          id: "testUserGroup1Id",
          displayName: "testUserGroup1DisplayName",
          description: "testUserGroup1Description",
          members: [
            {
              type: "USER",
              value: "testUser1",
            },
            {
              type: "USER",
              value: "testUser2",
            },
          ],
        },
        {
          id: "testUserGroup2Id",
          displayName: "testUserGroup2DisplayName",
          description: "testUserGroup2Description",
          members: [
            {
              type: "USER",
              value: "testUser3",
            },
            {
              type: "USER",
              value: "testUser4",
            },
          ],
        },
        {
          id: "testUserGroup3Id",
          displayName: "testUserGroup3DisplayName",
          description: "testUserGroup3Description",
          members: [
            {
              type: "USER",
              value: "testUser5",
            },
            {
              type: "USER",
              value: "testUser6",
            },
          ],
        },
        {
          id: "testUserGroup4Id",
          displayName: "testUserGroup4DisplayName",
          description: "testUserGroup4Description",
          members: [
            {
              type: "USER",
              value: "testUser7",
            },
            {
              type: "USER",
              value: "testUser8",
            },
          ],
        },
        {
          id: "testUserGroup5Id",
          displayName: "testUserGroup5DisplayName",
          description: "testUserGroup5Description",
          members: [
            {
              type: "USER",
              value: "testUser9",
            },
            {
              type: "USER",
              value: "testUser10",
            },
          ],
        },
        {
          id: "testUserGroup6Id",
          displayName: "testUserGroup6DisplayName",
          description: "testUserGroup6Description",
          members: [
            {
              type: "USER",
              value: "testUser11",
            },
            {
              type: "USER",
              value: "testUser12",
            },
          ],
        },
      ];

      expect(result).toEqual(expectedPayload);

      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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

    it("should MindSphere Get Users Indexable API and return empty array - if second request returns response without totalResults", async () => {
      maxNumberOfUserGroupsPerOneCall = 3;

      mockedReturnDataCollection = [
        {
          resources: [
            {
              id: "testUserGroup1Id",
              displayName: "testUserGroup1DisplayName",
              description: "testUserGroup1Description",
              members: [
                {
                  type: "USER",
                  value: "testUser1",
                },
                {
                  type: "USER",
                  value: "testUser2",
                },
              ],
            },
            {
              id: "testUserGroup2Id",
              displayName: "testUserGroup2DisplayName",
              description: "testUserGroup2Description",
              members: [
                {
                  type: "USER",
                  value: "testUser3",
                },
                {
                  type: "USER",
                  value: "testUser4",
                },
              ],
            },
            {
              id: "testUserGroup3Id",
              displayName: "testUserGroup3DisplayName",
              description: "testUserGroup3Description",
              members: [
                {
                  type: "USER",
                  value: "testUser5",
                },
                {
                  type: "USER",
                  value: "testUser6",
                },
              ],
            },
          ],
          startIndex: 1,
          itemsPerPage: 3,
          totalResults: 8,
        },
        {
          resources: [
            {
              id: "testUserGroup4Id",
              displayName: "testUserGroup4DisplayName",
              description: "testUserGroup4Description",
              members: [
                {
                  type: "USER",
                  value: "testUser7",
                },
                {
                  type: "USER",
                  value: "testUser8",
                },
              ],
            },
            {
              id: "testUserGroup5Id",
              displayName: "testUserGroup5DisplayName",
              description: "testUserGroup5Description",
              members: [
                {
                  type: "USER",
                  value: "testUser9",
                },
                {
                  type: "USER",
                  value: "testUser10",
                },
              ],
            },
            {
              id: "testUserGroup6Id",
              displayName: "testUserGroup6DisplayName",
              description: "testUserGroup6Description",
              members: [
                {
                  type: "USER",
                  value: "testUser11",
                },
                {
                  type: "USER",
                  value: "testUser12",
                },
              ],
            },
          ],
          startIndex: 4,
          itemsPerPage: 3,
        },
      ];

      let result = await exec();

      let expectedPayload = [
        {
          id: "testUserGroup1Id",
          displayName: "testUserGroup1DisplayName",
          description: "testUserGroup1Description",
          members: [
            {
              type: "USER",
              value: "testUser1",
            },
            {
              type: "USER",
              value: "testUser2",
            },
          ],
        },
        {
          id: "testUserGroup2Id",
          displayName: "testUserGroup2DisplayName",
          description: "testUserGroup2Description",
          members: [
            {
              type: "USER",
              value: "testUser3",
            },
            {
              type: "USER",
              value: "testUser4",
            },
          ],
        },
        {
          id: "testUserGroup3Id",
          displayName: "testUserGroup3DisplayName",
          description: "testUserGroup3Description",
          members: [
            {
              type: "USER",
              value: "testUser5",
            },
            {
              type: "USER",
              value: "testUser6",
            },
          ],
        },
        {
          id: "testUserGroup4Id",
          displayName: "testUserGroup4DisplayName",
          description: "testUserGroup4Description",
          members: [
            {
              type: "USER",
              value: "testUser7",
            },
            {
              type: "USER",
              value: "testUser8",
            },
          ],
        },
        {
          id: "testUserGroup5Id",
          displayName: "testUserGroup5DisplayName",
          description: "testUserGroup5Description",
          members: [
            {
              type: "USER",
              value: "testUser9",
            },
            {
              type: "USER",
              value: "testUser10",
            },
          ],
        },
        {
          id: "testUserGroup6Id",
          displayName: "testUserGroup6DisplayName",
          description: "testUserGroup6Description",
          members: [
            {
              type: "USER",
              value: "testUser11",
            },
            {
              type: "USER",
              value: "testUser12",
            },
          ],
        },
      ];

      expect(result).toEqual(expectedPayload);

      expect(mockedAxios.request).toHaveBeenCalledTimes(2);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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

    it("should MindSphere Get Users Indexable API and return empty array - if requests contains null data", async () => {
      maxNumberOfUserGroupsPerOneCall = 3;

      mockedReturnDataCollection = [
        {
          resources: [
            {
              id: "testUserGroup1Id",
              displayName: "testUserGroup1DisplayName",
              description: "testUserGroup1Description",
              members: [
                {
                  type: "USER",
                  value: "testUser1",
                },
                {
                  type: "USER",
                  value: "testUser2",
                },
              ],
            },
            {
              id: "testUserGroup2Id",
              displayName: "testUserGroup2DisplayName",
              description: "testUserGroup2Description",
              members: [
                {
                  type: "USER",
                  value: "testUser3",
                },
                {
                  type: "USER",
                  value: "testUser4",
                },
              ],
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
              id: "testUserGroup4Id",
              displayName: "testUserGroup4DisplayName",
              description: "testUserGroup4Description",
              members: [
                {
                  type: "USER",
                  value: "testUser7",
                },
                {
                  type: "USER",
                  value: "testUser8",
                },
              ],
            },
            null,
            {
              id: "testUserGroup6Id",
              displayName: "testUserGroup6DisplayName",
              description: "testUserGroup6Description",
              members: [
                {
                  type: "USER",
                  value: "testUser11",
                },
                {
                  type: "USER",
                  value: "testUser12",
                },
              ],
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
              id: "testUserGroup8Id",
              displayName: "testUserGroup8DisplayName",
              description: "testUserGroup8Description",
              members: [
                {
                  type: "USER",
                  value: "testUser15",
                },
                {
                  type: "USER",
                  value: "testUser16",
                },
              ],
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
          id: "testUserGroup1Id",
          displayName: "testUserGroup1DisplayName",
          description: "testUserGroup1Description",
          members: [
            {
              type: "USER",
              value: "testUser1",
            },
            {
              type: "USER",
              value: "testUser2",
            },
          ],
        },
        {
          id: "testUserGroup2Id",
          displayName: "testUserGroup2DisplayName",
          description: "testUserGroup2Description",
          members: [
            {
              type: "USER",
              value: "testUser3",
            },
            {
              type: "USER",
              value: "testUser4",
            },
          ],
        },
        {
          id: "testUserGroup4Id",
          displayName: "testUserGroup4DisplayName",
          description: "testUserGroup4Description",
          members: [
            {
              type: "USER",
              value: "testUser7",
            },
            {
              type: "USER",
              value: "testUser8",
            },
          ],
        },
        {
          id: "testUserGroup6Id",
          displayName: "testUserGroup6DisplayName",
          description: "testUserGroup6Description",
          members: [
            {
              type: "USER",
              value: "testUser11",
            },
            {
              type: "USER",
              value: "testUser12",
            },
          ],
        },
        {
          id: "testUserGroup8Id",
          displayName: "testUserGroup8DisplayName",
          description: "testUserGroup8Description",
          members: [
            {
              type: "USER",
              value: "testUser15",
            },
            {
              type: "USER",
              value: "testUser16",
            },
          ],
        },
      ];

      expect(result).toEqual(expectedPayload);

      expect(mockedAxios.request).toHaveBeenCalledTimes(3);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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

    it("should MindSphere Get Users Indexable API and return all users", async () => {
      let result = await exec();

      let expectedPayload = [
        {
          id: "testUserGroup1Id",
          displayName: "testUserGroup1DisplayName",
          description: "testUserGroup1Description",
          members: [
            {
              type: "USER",
              value: "testUser1",
            },
            {
              type: "USER",
              value: "testUser2",
            },
          ],
        },
        {
          id: "testUserGroup2Id",
          displayName: "testUserGroup2DisplayName",
          description: "testUserGroup2Description",
          members: [
            {
              type: "USER",
              value: "testUser3",
            },
            {
              type: "USER",
              value: "testUser4",
            },
          ],
        },
        {
          id: "testUserGroup3Id",
          displayName: "testUserGroup3DisplayName",
          description: "testUserGroup3Description",
          members: [
            {
              type: "USER",
              value: "testUser5",
            },
            {
              type: "USER",
              value: "testUser6",
            },
          ],
        },
        {
          id: "testUserGroup4Id",
          displayName: "testUserGroup4DisplayName",
          description: "testUserGroup4Description",
          members: [
            {
              type: "USER",
              value: "testUser7",
            },
            {
              type: "USER",
              value: "testUser8",
            },
          ],
        },
        {
          id: "testUserGroup5Id",
          displayName: "testUserGroup5DisplayName",
          description: "testUserGroup5Description",
          members: [
            {
              type: "USER",
              value: "testUser9",
            },
            {
              type: "USER",
              value: "testUser10",
            },
          ],
        },
        {
          id: "testUserGroup6Id",
          displayName: "testUserGroup6DisplayName",
          description: "testUserGroup6Description",
          members: [
            {
              type: "USER",
              value: "testUser11",
            },
            {
              type: "USER",
              value: "testUser12",
            },
          ],
        },

        {
          id: "testUserGroup7Id",
          displayName: "testUserGroup7DisplayName",
          description: "testUserGroup7Description",
          members: [
            {
              type: "USER",
              value: "testUser13",
            },
            {
              type: "USER",
              value: "testUser14",
            },
          ],
        },
        {
          id: "testUserGroup8Id",
          displayName: "testUserGroup8DisplayName",
          description: "testUserGroup8Description",
          members: [
            {
              type: "USER",
              value: "testUser15",
            },
            {
              type: "USER",
              value: "testUser16",
            },
          ],
        },
      ];

      expect(result).toEqual(expectedPayload);

      //Call three times - for every user group indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(3);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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
          id: "testUserGroup1Id",
          displayName: "testUserGroup1DisplayName",
          description: "testUserGroup1Description",
          members: [
            {
              type: "USER",
              value: "testUser1",
            },
            {
              type: "USER",
              value: "testUser2",
            },
          ],
        },
        {
          id: "testUserGroup2Id",
          displayName: "testUserGroup2DisplayName",
          description: "testUserGroup2Description",
          members: [
            {
              type: "USER",
              value: "testUser3",
            },
            {
              type: "USER",
              value: "testUser4",
            },
          ],
        },
        {
          id: "testUserGroup3Id",
          displayName: "testUserGroup3DisplayName",
          description: "testUserGroup3Description",
          members: [
            {
              type: "USER",
              value: "testUser5",
            },
            {
              type: "USER",
              value: "testUser6",
            },
          ],
        },
        {
          id: "testUserGroup4Id",
          displayName: "testUserGroup4DisplayName",
          description: "testUserGroup4Description",
          members: [
            {
              type: "USER",
              value: "testUser7",
            },
            {
              type: "USER",
              value: "testUser8",
            },
          ],
        },
        {
          id: "testUserGroup5Id",
          displayName: "testUserGroup5DisplayName",
          description: "testUserGroup5Description",
          members: [
            {
              type: "USER",
              value: "testUser9",
            },
            {
              type: "USER",
              value: "testUser10",
            },
          ],
        },
        {
          id: "testUserGroup6Id",
          displayName: "testUserGroup6DisplayName",
          description: "testUserGroup6Description",
          members: [
            {
              type: "USER",
              value: "testUser11",
            },
            {
              type: "USER",
              value: "testUser12",
            },
          ],
        },

        {
          id: "testUserGroup7Id",
          displayName: "testUserGroup7DisplayName",
          description: "testUserGroup7Description",
          members: [
            {
              type: "USER",
              value: "testUser13",
            },
            {
              type: "USER",
              value: "testUser14",
            },
          ],
        },
        {
          id: "testUserGroup8Id",
          displayName: "testUserGroup8DisplayName",
          description: "testUserGroup8Description",
          members: [
            {
              type: "USER",
              value: "testUser15",
            },
            {
              type: "USER",
              value: "testUser16",
            },
          ],
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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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
          id: "testUserGroup1Id",
          displayName: "testUserGroup1DisplayName",
          description: "testUserGroup1Description",
          members: [
            {
              type: "USER",
              value: "testUser1",
            },
            {
              type: "USER",
              value: "testUser2",
            },
          ],
        },
        {
          id: "testUserGroup2Id",
          displayName: "testUserGroup2DisplayName",
          description: "testUserGroup2Description",
          members: [
            {
              type: "USER",
              value: "testUser3",
            },
            {
              type: "USER",
              value: "testUser4",
            },
          ],
        },
        {
          id: "testUserGroup3Id",
          displayName: "testUserGroup3DisplayName",
          description: "testUserGroup3Description",
          members: [
            {
              type: "USER",
              value: "testUser5",
            },
            {
              type: "USER",
              value: "testUser6",
            },
          ],
        },
        {
          id: "testUserGroup4Id",
          displayName: "testUserGroup4DisplayName",
          description: "testUserGroup4Description",
          members: [
            {
              type: "USER",
              value: "testUser7",
            },
            {
              type: "USER",
              value: "testUser8",
            },
          ],
        },
        {
          id: "testUserGroup5Id",
          displayName: "testUserGroup5DisplayName",
          description: "testUserGroup5Description",
          members: [
            {
              type: "USER",
              value: "testUser9",
            },
            {
              type: "USER",
              value: "testUser10",
            },
          ],
        },
        {
          id: "testUserGroup6Id",
          displayName: "testUserGroup6DisplayName",
          description: "testUserGroup6Description",
          members: [
            {
              type: "USER",
              value: "testUser11",
            },
            {
              type: "USER",
              value: "testUser12",
            },
          ],
        },

        {
          id: "testUserGroup7Id",
          displayName: "testUserGroup7DisplayName",
          description: "testUserGroup7Description",
          members: [
            {
              type: "USER",
              value: "testUser13",
            },
            {
              type: "USER",
              value: "testUser14",
            },
          ],
        },
        {
          id: "testUserGroup8Id",
          displayName: "testUserGroup8DisplayName",
          description: "testUserGroup8Description",
          members: [
            {
              type: "USER",
              value: "testUser15",
            },
            {
              type: "USER",
              value: "testUser16",
            },
          ],
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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
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

  describe("checkIfUserGroupExists", () => {
    let tenantName: string;
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereUserGroupService: MindSphereUserGroupService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let userGroupId: string | null;
    let userGroupName: string | null;

    beforeEach(() => {
      mockedReturnDataCollection = [
        {
          resources: [
            {
              id: "testUserGroup1Id",
              displayName: "testUserGroup1DisplayName",
              description: "testUserGroup1Description",
              members: [
                {
                  type: "USER",
                  value: "testUser1",
                },
                {
                  type: "USER",
                  value: "testUser2",
                },
              ],
            },
          ],
          startIndex: 1,
          itemsPerPage: 3,
          totalResults: 1,
        },
      ];
      mockedReturnStatusCollection = [200, 200, 200];
      mockedReturnHeadersCollection = [{}, {}, {}];
      mockedAuthToken = "testAuthToken1234";
      mockedAuthTokenElapsedTime = 1612184400000;
      mockedNow = 1612098060000;
      tenantName = "testTenantName";
      userGroupId = "testUserGroupId";
      userGroupName = null;
    });

    let exec = async () => {
      //Mocking Token Manager
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance(
        tenantName
      ) as any;
      mockedMindSphereTokenManager._token = mockedAuthToken;
      mockedMindSphereTokenManager._tokenExpireUnixDate = mockedAuthTokenElapsedTime;

      //Getting instance of service
      mindSphereUserGroupService = MindSphereUserGroupService.getInstance();

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereUserGroupService.checkIfUserGroupExists(
        tenantName,
        userGroupId,
        userGroupName
      );
    };

    it("should MindSphere Get User Groups Indexable API and return true - if at least one user is returned - only user id filter is applied", async () => {
      let result = await exec();

      expect(result).toEqual(true);

      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `id eq "testUserGroupId"`,
          count: 100,
          sortBy: "id",
          startIndex: 1,
        },
      });
    });

    it("should MindSphere Get User Groups Indexable API and return false - if no user is returned - only user id filter is applied", async () => {
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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `id eq "testUserGroupId"`,
          count: 100,
          sortBy: "id",
          startIndex: 1,
        },
      });
    });

    it("should MindSphere Get User Groups Indexable API and return true - if at least one user is returned - only user name filter is applied", async () => {
      userGroupId = null;
      userGroupName = "testUserGroupName";

      let result = await exec();

      expect(result).toEqual(true);

      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `displayname eq "testUserGroupName"`,
          count: 100,
          sortBy: "id",
          startIndex: 1,
        },
      });
    });

    it("should MindSphere Get User Groups Indexable API and return false - if no user is returned - only user name filter is applied", async () => {
      userGroupId = null;
      userGroupName = "testUserGroupName";

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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `displayname eq "testUserGroupName"`,
          count: 100,
          sortBy: "id",
          startIndex: 1,
        },
      });
    });

    it("should MindSphere Get User Groups Indexable API and return true - if at least one user is returned - both filters are applied", async () => {
      userGroupId = "testUserGroupId";
      userGroupName = "testUserGroupName";

      let result = await exec();

      expect(result).toEqual(true);

      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `id eq "testUserGroupId" and displayname eq "testUserGroupName"`,
          count: 100,
          sortBy: "id",
          startIndex: 1,
        },
      });
    });

    it("should MindSphere Get User Groups Indexable API and return false - if no user is returned - both filters are applied", async () => {
      userGroupId = "testUserGroupId";
      userGroupName = "testUserGroupName";

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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `id eq "testUserGroupId" and displayname eq "testUserGroupName"`,
          count: 100,
          sortBy: "id",
          startIndex: 1,
        },
      });
    });

    it("should throw and not call MindSphere User Group API - if there are no filters", async () => {
      userGroupId = null;
      userGroupName = null;

      await expect(exec()).rejects.toMatchObject({
        message: "Both userGroupId and userGroupName not specified",
      });

      expect(mockedAxios.request).not.toHaveBeenCalled();
    });

    it("should fetch token first - if token has not been fetched before and then get all user groups using new token", async () => {
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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `id eq "testUserGroupId"`,
          count: 100,
          sortBy: "id",
          startIndex: 1,
        },
      });
    });

    it("should fetch token first - if token has expired and then get all user groups using new token", async () => {
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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params: {
          filter: `id eq "testUserGroupId"`,
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

  describe("getUserGroup", () => {
    let tenantName: string;
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereUserGroupService: MindSphereUserGroupService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let groupId: string;

    beforeEach(() => {
      mockedReturnDataCollection = [
        {
          id: "testUserGroup1Id",
          displayName: "testUserGroup1DisplayName",
          description: "testUserGroup1Description",
          members: [
            {
              type: "USER",
              value: "testUser1",
            },
            {
              type: "USER",
              value: "testUser2",
            },
          ],
        },
      ];
      mockedReturnStatusCollection = [200, 200, 200];
      mockedReturnHeadersCollection = [{}, {}, {}];
      mockedAuthToken = "testAuthToken1234";
      mockedAuthTokenElapsedTime = 1612184400000;
      mockedNow = 1612098060000;
      tenantName = "testTenantName";
      groupId = "testGroupId";
    });

    let exec = async () => {
      //Mocking Token Manager
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance(
        tenantName
      ) as any;
      mockedMindSphereTokenManager._token = mockedAuthToken;
      mockedMindSphereTokenManager._tokenExpireUnixDate = mockedAuthTokenElapsedTime;

      //Getting instance of service
      mindSphereUserGroupService = MindSphereUserGroupService.getInstance();

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereUserGroupService.getUserGroup(tenantName, groupId);
    };

    it("should Call MindSphere Get User Group API and return user group", async () => {
      let result = await exec();

      let expectedPayload = {
        id: "testUserGroup1Id",
        displayName: "testUserGroup1DisplayName",
        description: "testUserGroup1Description",
        members: [
          {
            type: "USER",
            value: "testUser1",
          },
          {
            type: "USER",
            value: "testUser2",
          },
        ],
      };

      expect(result).toEqual(expectedPayload);

      //Call three times - for every user group indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testGroupId`,
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
        id: "testUserGroup1Id",
        displayName: "testUserGroup1DisplayName",
        description: "testUserGroup1Description",
        members: [
          {
            type: "USER",
            value: "testUser1",
          },
          {
            type: "USER",
            value: "testUser2",
          },
        ],
      };

      expect(result).toEqual(expectedPayload);

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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testGroupId`,
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
        id: "testUserGroup1Id",
        displayName: "testUserGroup1DisplayName",
        description: "testUserGroup1Description",
        members: [
          {
            type: "USER",
            value: "testUser1",
          },
          {
            type: "USER",
            value: "testUser2",
          },
        ],
      };

      expect(result).toEqual(expectedPayload);

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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testGroupId`,
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

  describe("createUserGroup", () => {
    let tenantName: string;
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereUserGroupService: MindSphereUserGroupService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let userGroupPayload: MindSphereUserGroupData;

    beforeEach(() => {
      mockedReturnDataCollection = [
        {
          id: "testUserGroup1Id",
          displayName: "testUserGroup1DisplayName",
          description: "testUserGroup1Description",
          members: [
            {
              type: "USER",
              value: "testUser1",
            },
            {
              type: "USER",
              value: "testUser2",
            },
          ],
        },
      ];
      mockedReturnStatusCollection = [200, 200, 200];
      mockedReturnHeadersCollection = [{}, {}, {}];
      mockedAuthToken = "testAuthToken1234";
      mockedAuthTokenElapsedTime = 1612184400000;
      mockedNow = 1612098060000;
      tenantName = "testTenantName";
      userGroupPayload = {
        id: "testUserGroup2Id",
        displayName: "testUserGroup2DisplayName",
        description: "testUserGroup2Description",
        members: [
          {
            type: "USER",
            value: "testUser3",
          },
          {
            type: "USER",
            value: "testUser4",
          },
        ],
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
      mindSphereUserGroupService = MindSphereUserGroupService.getInstance();

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereUserGroupService.createUserGroup(
        tenantName,
        userGroupPayload
      );
    };

    it("should Call MindSphere Post User Group API and return created user group", async () => {
      let result = await exec();

      let expectedPayload = {
        id: "testUserGroup1Id",
        displayName: "testUserGroup1DisplayName",
        description: "testUserGroup1Description",
        members: [
          {
            type: "USER",
            value: "testUser1",
          },
          {
            type: "USER",
            value: "testUser2",
          },
        ],
      };

      expect(result).toEqual(expectedPayload);

      //Call three times - for every user group indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "POST",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: {
          id: "testUserGroup2Id",
          displayName: "testUserGroup2DisplayName",
          description: "testUserGroup2Description",
          members: [
            {
              type: "USER",
              value: "testUser3",
            },
            {
              type: "USER",
              value: "testUser4",
            },
          ],
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
        id: "testUserGroup1Id",
        displayName: "testUserGroup1DisplayName",
        description: "testUserGroup1Description",
        members: [
          {
            type: "USER",
            value: "testUser1",
          },
          {
            type: "USER",
            value: "testUser2",
          },
        ],
      };

      expect(result).toEqual(expectedPayload);

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
        method: "POST",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: {
          id: "testUserGroup2Id",
          displayName: "testUserGroup2DisplayName",
          description: "testUserGroup2Description",
          members: [
            {
              type: "USER",
              value: "testUser3",
            },
            {
              type: "USER",
              value: "testUser4",
            },
          ],
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
        id: "testUserGroup1Id",
        displayName: "testUserGroup1DisplayName",
        description: "testUserGroup1Description",
        members: [
          {
            type: "USER",
            value: "testUser1",
          },
          {
            type: "USER",
            value: "testUser2",
          },
        ],
      };

      expect(result).toEqual(expectedPayload);

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
        method: "POST",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: {
          id: "testUserGroup2Id",
          displayName: "testUserGroup2DisplayName",
          description: "testUserGroup2Description",
          members: [
            {
              type: "USER",
              value: "testUser3",
            },
            {
              type: "USER",
              value: "testUser4",
            },
          ],
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

  describe("updateUserGroup", () => {
    let tenantName: string;
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereUserGroupService: MindSphereUserGroupService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let userGroupId: string;
    let userGroupPayload: MindSphereUserGroupData;

    beforeEach(() => {
      userGroupId = "testUserGroupId";
      mockedReturnDataCollection = [
        {
          id: "testUserGroup1Id",
          displayName: "testUserGroup1DisplayName",
          description: "testUserGroup1Description",
          members: [
            {
              type: "USER",
              value: "testUser1",
            },
            {
              type: "USER",
              value: "testUser2",
            },
          ],
        },
      ];
      mockedReturnStatusCollection = [200, 200, 200];
      mockedReturnHeadersCollection = [{}, {}, {}];
      mockedAuthToken = "testAuthToken1234";
      mockedAuthTokenElapsedTime = 1612184400000;
      mockedNow = 1612098060000;
      tenantName = "testTenantName";
      userGroupPayload = {
        id: "testUserGroup2Id",
        displayName: "testUserGroup2DisplayName",
        description: "testUserGroup2Description",
        members: [
          {
            type: "USER",
            value: "testUser3",
          },
          {
            type: "USER",
            value: "testUser4",
          },
        ],
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
      mindSphereUserGroupService = MindSphereUserGroupService.getInstance();

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereUserGroupService.updateUserGroup(
        tenantName,
        userGroupId,
        userGroupPayload
      );
    };

    it("should Call MindSphere Put User Group API and return created user group", async () => {
      let result = await exec();

      let expectedPayload = {
        id: "testUserGroup1Id",
        displayName: "testUserGroup1DisplayName",
        description: "testUserGroup1Description",
        members: [
          {
            type: "USER",
            value: "testUser1",
          },
          {
            type: "USER",
            value: "testUser2",
          },
        ],
      };

      expect(result).toEqual(expectedPayload);

      //Call three times - for every user group indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "PUT",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testUserGroupId`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: {
          id: "testUserGroup2Id",
          displayName: "testUserGroup2DisplayName",
          description: "testUserGroup2Description",
          members: [
            {
              type: "USER",
              value: "testUser3",
            },
            {
              type: "USER",
              value: "testUser4",
            },
          ],
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
        id: "testUserGroup1Id",
        displayName: "testUserGroup1DisplayName",
        description: "testUserGroup1Description",
        members: [
          {
            type: "USER",
            value: "testUser1",
          },
          {
            type: "USER",
            value: "testUser2",
          },
        ],
      };

      expect(result).toEqual(expectedPayload);

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
        method: "PUT",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testUserGroupId`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: {
          id: "testUserGroup2Id",
          displayName: "testUserGroup2DisplayName",
          description: "testUserGroup2Description",
          members: [
            {
              type: "USER",
              value: "testUser3",
            },
            {
              type: "USER",
              value: "testUser4",
            },
          ],
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
        id: "testUserGroup1Id",
        displayName: "testUserGroup1DisplayName",
        description: "testUserGroup1Description",
        members: [
          {
            type: "USER",
            value: "testUser1",
          },
          {
            type: "USER",
            value: "testUser2",
          },
        ],
      };

      expect(result).toEqual(expectedPayload);

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
        method: "PUT",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testUserGroupId`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: {
          id: "testUserGroup2Id",
          displayName: "testUserGroup2DisplayName",
          description: "testUserGroup2Description",
          members: [
            {
              type: "USER",
              value: "testUser3",
            },
            {
              type: "USER",
              value: "testUser4",
            },
          ],
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

  describe("deleteUserGroup", () => {
    let tenantName: string;
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereUserGroupService: MindSphereUserGroupService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let userGroupId: string;

    beforeEach(() => {
      userGroupId = "testUserGroupId";
      mockedReturnDataCollection = [
        {
          id: "testUserGroup1Id",
          displayName: "testUserGroup1DisplayName",
          description: "testUserGroup1Description",
          members: [
            {
              type: "USER",
              value: "testUser1",
            },
            {
              type: "USER",
              value: "testUser2",
            },
          ],
        },
      ];
      mockedReturnStatusCollection = [200, 200, 200];
      mockedReturnHeadersCollection = [{}, {}, {}];
      mockedAuthToken = "testAuthToken1234";
      mockedAuthTokenElapsedTime = 1612184400000;
      mockedNow = 1612098060000;
      tenantName = "testTenantName";
    });

    let exec = async () => {
      //Mocking Token Manager
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance(
        tenantName
      ) as any;
      mockedMindSphereTokenManager._token = mockedAuthToken;
      mockedMindSphereTokenManager._tokenExpireUnixDate = mockedAuthTokenElapsedTime;

      //Getting instance of service
      mindSphereUserGroupService = MindSphereUserGroupService.getInstance();

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereUserGroupService.deleteUserGroup(
        tenantName,
        userGroupId
      );
    };

    it("should Call MindSphere Delete User Group API and return created user group", async () => {
      await exec();

      //Call three times - for every user group indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "DELETE",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testUserGroupId`,
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
        method: "DELETE",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testUserGroupId`,
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
        method: "DELETE",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testUserGroupId`,
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

  describe("getGroupMembers", () => {
    let tenantName: string;
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereUserGroupService: MindSphereUserGroupService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let userGroupId: string;

    beforeEach(() => {
      userGroupId = "testUserGroupId";
      mockedReturnDataCollection = [["fakeUser1", "fakeUser2", "fakeUser3"]];
      mockedReturnStatusCollection = [200];
      mockedReturnHeadersCollection = [{}];
      mockedAuthToken = "testAuthToken1234";
      mockedAuthTokenElapsedTime = 1612184400000;
      mockedNow = 1612098060000;
      tenantName = "testTenantName";
    });

    let exec = async () => {
      //Mocking Token Manager
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance(
        tenantName
      ) as any;
      mockedMindSphereTokenManager._token = mockedAuthToken;
      mockedMindSphereTokenManager._tokenExpireUnixDate = mockedAuthTokenElapsedTime;

      //Getting instance of service
      mindSphereUserGroupService = MindSphereUserGroupService.getInstance();

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereUserGroupService.getGroupMembers(
        tenantName,
        userGroupId
      );
    };

    it("should Call MindSphere API and return users of given group", async () => {
      let result = await exec();

      let expectedResult = ["fakeUser1", "fakeUser2", "fakeUser3"];

      expect(result).toEqual(expectedResult);

      //Call three times - for every user group indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testUserGroupId/members`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    });

    it("should Call MindSphere API and return empty array - if call returns empty array", async () => {
      mockedReturnDataCollection = [[]];

      let result = await exec();

      let expectedResult: any[] = [];

      expect(result).toEqual(expectedResult);

      //Call three times - for every user group indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testUserGroupId/members`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    });

    it("should Call MindSphere API and return empty array - if call returns null", async () => {
      mockedReturnDataCollection = [null];

      let result = await exec();

      let expectedResult: any[] = [];

      expect(result).toEqual(expectedResult);

      //Call three times - for every user group indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testUserGroupId/members`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    });

    it("should Call MindSphere API and return empty array - if call returns response that is not an array", async () => {
      mockedReturnDataCollection = [
        {
          fakeResponse: 1234,
        },
      ];

      let result = await exec();

      let expectedResult: any[] = [];

      expect(result).toEqual(expectedResult);

      //Call three times - for every user group indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testUserGroupId/members`,
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

      let expectedResult = ["fakeUser1", "fakeUser2", "fakeUser3"];

      expect(result).toEqual(expectedResult);

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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testUserGroupId/members`,
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

      let expectedResult = ["fakeUser1", "fakeUser2", "fakeUser3"];

      expect(result).toEqual(expectedResult);

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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testUserGroupId/members`,
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

  describe("checkIfUserIsAssignedToGroup", () => {
    let tenantName: string;
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereUserGroupService: MindSphereUserGroupService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let userGroupId: string;
    let userId: string;

    beforeEach(() => {
      userGroupId = "testUserGroupId";
      userId = "testUserId2";
      mockedReturnDataCollection = [
        [
          {
            type: "USER",
            value: "testUserId1",
          },
          {
            type: "USER",
            value: "testUserId2",
          },
          {
            type: "USER",
            value: "testUserId3",
          },
        ],
      ];
      mockedReturnStatusCollection = [200];
      mockedReturnHeadersCollection = [{}];
      mockedAuthToken = "testAuthToken1234";
      mockedAuthTokenElapsedTime = 1612184400000;
      mockedNow = 1612098060000;
      tenantName = "testTenantName";
    });

    let exec = async () => {
      //Mocking Token Manager
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance(
        tenantName
      ) as any;
      mockedMindSphereTokenManager._token = mockedAuthToken;
      mockedMindSphereTokenManager._tokenExpireUnixDate = mockedAuthTokenElapsedTime;

      //Getting instance of service
      mindSphereUserGroupService = MindSphereUserGroupService.getInstance();

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereUserGroupService.checkIfUserIsAssignedToGroup(
        tenantName,
        userGroupId,
        userId
      );
    };

    it("should Call MindSphere API and return true if user of given id exists in response", async () => {
      let result = await exec();

      expect(result).toEqual(true);

      //Call three times - for every user group indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testUserGroupId/members`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    });

    it("should Call MindSphere API and return false if user of given id does not exist in response", async () => {
      mockedReturnDataCollection = [
        [
          {
            type: "USER",
            value: "testUserId4",
          },
          {
            type: "USER",
            value: "testUserId5",
          },
          {
            type: "USER",
            value: "testUserId6",
          },
        ],
      ];

      let result = await exec();

      expect(result).toEqual(false);

      //Call three times - for every user group indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testUserGroupId/members`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    });

    it("should Call MindSphere API and return false if return response does not have value in payload", async () => {
      mockedReturnDataCollection = [
        [
          {
            type: "USER",
          },
          {
            type: "USER",
          },
          {
            type: "USER",
          },
        ],
      ];

      let result = await exec();

      expect(result).toEqual(false);

      //Call three times - for every user group indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testUserGroupId/members`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    });

    it("should Call MindSphere API and return false - if call returns empty array", async () => {
      mockedReturnDataCollection = [[]];

      let result = await exec();

      expect(result).toEqual(false);

      //Call three times - for every user group indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testUserGroupId/members`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    });

    it("should Call MindSphere API and return empty array - if call returns null", async () => {
      mockedReturnDataCollection = [null];

      let result = await exec();

      expect(result).toEqual(false);

      //Call three times - for every user group indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testUserGroupId/members`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    });

    it("should Call MindSphere API and return empty array - if call returns response that is not an array", async () => {
      mockedReturnDataCollection = [
        {
          fakeResponse: 1234,
        },
      ];

      let result = await exec();

      expect(result).toEqual(false);

      //Call three times - for every user group indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "GET",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testUserGroupId/members`,
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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testUserGroupId/members`,
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
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testUserGroupId/members`,
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

  describe("addUserToGroup", () => {
    let tenantName: string;
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereUserGroupService: MindSphereUserGroupService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let userGroupId: string;
    let userId: string;

    beforeEach(() => {
      userGroupId = "testUserGroupId";
      userId = "testUserId2";
      mockedReturnDataCollection = [{}];
      mockedReturnStatusCollection = [200];
      mockedReturnHeadersCollection = [{}];
      mockedAuthToken = "testAuthToken1234";
      mockedAuthTokenElapsedTime = 1612184400000;
      mockedNow = 1612098060000;
      tenantName = "testTenantName";
    });

    let exec = async () => {
      //Mocking Token Manager
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance(
        tenantName
      ) as any;
      mockedMindSphereTokenManager._token = mockedAuthToken;
      mockedMindSphereTokenManager._tokenExpireUnixDate = mockedAuthTokenElapsedTime;

      //Getting instance of service
      mindSphereUserGroupService = MindSphereUserGroupService.getInstance();

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereUserGroupService.addUserToGroup(
        tenantName,
        userGroupId,
        userId
      );
    };

    it("should Call MindSphere group members POST API", async () => {
      let result = await exec();

      //Call three times - for every user group indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "POST",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testUserGroupId/members`,
        headers: {
          Authorization: `Bearer ${mockedAuthToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: {
          type: "USER",
          value: "testUserId2",
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
        method: "POST",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testUserGroupId/members`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: {
          type: "USER",
          value: "testUserId2",
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
        method: "POST",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testUserGroupId/members`,
        headers: {
          Authorization: `Bearer testAccessToken2`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: {
          type: "USER",
          value: "testUserId2",
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

  describe("removeUserFromGroup", () => {
    let tenantName: string;
    let mockedMindSphereTokenManager: any;
    let mockedReturnDataCollection: any[];
    let mockedReturnStatusCollection: number[];
    let mockedReturnHeadersCollection: any[];
    let mindSphereUserGroupService: MindSphereUserGroupService;
    let mockedAuthToken: string | null;
    let mockedAuthTokenElapsedTime: number | null;
    let mockedNow: number;
    let userGroupId: string;
    let userId: string;

    beforeEach(() => {
      userGroupId = "testUserGroupId";
      userId = "testUserId";
      mockedReturnDataCollection = [{}];
      mockedReturnStatusCollection = [200];
      mockedReturnHeadersCollection = [{}];
      mockedAuthToken = "testAuthToken1234";
      mockedAuthTokenElapsedTime = 1612184400000;
      mockedNow = 1612098060000;
      tenantName = "testTenantName";
    });

    let exec = async () => {
      //Mocking Token Manager
      mockedMindSphereTokenManager = MindSphereTokenManager.getInstance(
        tenantName
      ) as any;
      mockedMindSphereTokenManager._token = mockedAuthToken;
      mockedMindSphereTokenManager._tokenExpireUnixDate = mockedAuthTokenElapsedTime;

      //Getting instance of service
      mindSphereUserGroupService = MindSphereUserGroupService.getInstance();

      //Mocking axios
      mockedAxios.__setMockResponseDataCollection(
        mockedReturnDataCollection,
        mockedReturnStatusCollection,
        mockedReturnHeadersCollection
      );

      MockDate.set(mockedNow);

      return mindSphereUserGroupService.removeUserFromGroup(
        tenantName,
        userGroupId,
        userId
      );
    };

    it("should Call MindSphere group members DELETE API", async () => {
      let result = await exec();

      //Call three times - for every user group indexable request
      expect(mockedAxios.request).toHaveBeenCalledTimes(1);

      expect(mockedAxios.request.mock.calls[0][0]).toEqual({
        method: "DELETE",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testUserGroupId/members/testUserId`,
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
        method: "DELETE",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testUserGroupId/members/testUserId`,
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
        method: "DELETE",
        url: `https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Groups/testUserGroupId/members/testUserId`,
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

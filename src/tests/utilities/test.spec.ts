import { MindSphereFileService } from "../../classes/MindSphereService/MindSphereFileService";
import { mockMsUserGroupService } from "./mockMsUserGroupService";
import { MockedUserGroupServiceContent } from "./mockMsUserGroupService";
import {
  MockedUserServiceContent,
  mockMsUserService,
} from "./mockMsUserService";
import { MindSphereUserGroupService } from "../../classes/MindSphereService/MindSphereUserGroupService";
import { MindSphereUserService } from "../../classes/MindSphereService/MindSphereUserService";

describe("test", () => {
  beforeEach(() => {
    //Reseting static class
    (MindSphereFileService as any)._instance = null;
  });

  afterEach(() => {
    //Reseting static class
    (MindSphereFileService as any)._instance = null;
  });

  describe("usergroupservice", () => {
    let userServiceContent: MockedUserServiceContent;

    beforeEach(() => {
      userServiceContent = {
        testTenant1: {
          testUser1: {
            active: true,
            name: {
              familyName: "testUser1FamilyName",
              givenName: "testUser1GivenName",
            },
            userName: "testUser1UserName",
            emails: [
              {
                value: "testUser1@email.com",
              },
            ],
            groups: [
              {
                display: "testGroup1",
                type: "USER",
                value: "testGroup1",
              },
              {
                display: "testGroup2",
                type: "USER",
                value: "testGroup2",
              },
            ],
            id: "testUser1",
            subtenants: [
              {
                id: "testSubtenant1",
              },
              {
                id: "testSubtenant2",
              },
            ],
          },
          testUser2: {
            active: true,
            name: {
              familyName: "testUser2FamilyName",
              givenName: "testUser2GivenName",
            },
            userName: "testUser2UserName",
            emails: [
              {
                value: "testUser2@email.com",
              },
            ],
            groups: [
              {
                display: "testGroup2",
                type: "USER",
                value: "testGroup2",
              },
              {
                display: "testGroup3",
                type: "USER",
                value: "testGroup3",
              },
            ],
            id: "testUser2",
            subtenants: [
              {
                id: "testSubtenant2",
              },
              {
                id: "testSubtenant3",
              },
            ],
          },
          testUser3: {
            active: true,
            name: {
              familyName: "testUser3FamilyName",
              givenName: "testUser3GivenName",
            },
            userName: "testUser3UserName",
            emails: [
              {
                value: "testUser3@email.com",
              },
            ],
            groups: [
              {
                display: "testGroup3",
                type: "USER",
                value: "testGroup3",
              },
              {
                display: "testGroup4",
                type: "USER",
                value: "testGroup4",
              },
            ],
            id: "testUser3",
          },
        },

        testTenant2: {
          testUser4: {
            active: true,
            name: {
              familyName: "testUser4FamilyName",
              givenName: "testUser4GivenName",
            },
            userName: "testUser4UserName",
            emails: [
              {
                value: "testUser4@email.com",
              },
            ],
            groups: [
              {
                display: "testGroup1",
                type: "USER",
                value: "testGroup1",
              },
              {
                display: "testGroup2",
                type: "USER",
                value: "testGroup2",
              },
            ],
            id: "testUser4",
            subtenants: [
              {
                id: "testSubtenant1",
              },
              {
                id: "testSubtenant2",
              },
            ],
          },
          testUser5: {
            active: true,
            name: {
              familyName: "testUser5FamilyName",
              givenName: "testUser5GivenName",
            },
            userName: "testUser5UserName",
            emails: [
              {
                value: "testUser5@email.com",
              },
            ],
            groups: [
              {
                display: "testGroup2",
                type: "USER",
                value: "testGroup2",
              },
              {
                display: "testGroup3",
                type: "USER",
                value: "testGroup3",
              },
            ],
            id: "testUser5",
            subtenants: [
              {
                id: "testSubtenant2",
              },
              {
                id: "testSubtenant3",
              },
            ],
          },
          testUser6: {
            active: true,
            name: {
              familyName: "testUser6FamilyName",
              givenName: "testUser6GivenName",
            },
            userName: "testUser6UserName",
            emails: [
              {
                value: "testUser6@email.com",
              },
            ],
            groups: [
              {
                display: "testGroup3",
                type: "USER",
                value: "testGroup3",
              },
              {
                display: "testGroup4",
                type: "USER",
                value: "testGroup4",
              },
            ],
            id: "testUser6",
          },
        },
      };
    });

    let exec = async () => {
      mockMsUserService(userServiceContent);
    };

    it("should work", async () => {
      exec();

      let user = await MindSphereUserService.getInstance().deleteUser(
        "testTenant2",
        "testUser5"
      );

      console.log(user);

      let groups = await MindSphereUserService.getInstance().getAllUsers(
        "testTenant2"
      );

      console.log(groups);
    });
  });
});

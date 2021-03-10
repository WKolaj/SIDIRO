import { config } from "node-config-ts";
import {
  MindSphereApp,
  PlantPermissions,
  UserRole,
  UserStorageData,
} from "../../../../classes/MindSphereApp/MindSphereApp";
import { MindSphereUserService } from "../../../../classes/MindSphereService/MindSphereUserService";
import { MindSphereUserJWTData } from "../../../../middleware/tokenData/fetchTokenData";

type mockFunctionResult = {
  results: any[];
  errors: any[];
};

const createMockResultFunction = function(
  results: mockFunctionResult
): jest.Mock {
  let invokeCount = 0;
  return jest.fn(async () => {
    let prevInvokeCount = invokeCount;
    invokeCount++;

    if (results.errors[prevInvokeCount] != null)
      throw new Error(results.errors[prevInvokeCount]);

    if (results.results[prevInvokeCount] == null)
      throw new Error("No response available");

    return results.results[prevInvokeCount];
  });
};

describe("MindSphereApp", () => {
  let mindSphereUserService: MindSphereUserService;
  let mockedGetAllUsersResults: mockFunctionResult;
  let mockedGetAllUsersFunction: jest.Mock;

  beforeEach(() => {
    //Clearing MindSphereServices
    (MindSphereUserService as any)._instance = null;

    //Mocking MindSphereFileService
    mockedGetAllUsersResults = {
      results: [],
      errors: [],
    };

    mindSphereUserService = MindSphereUserService.getInstance();

    mockedGetAllUsersFunction = createMockResultFunction(
      mockedGetAllUsersResults
    );

    mindSphereUserService.getAllUsers = mockedGetAllUsersFunction;
  });

  afterEach(() => {
    //Clearing MindSphereServices
    (MindSphereUserService as any)._instance = null;
  });

  //#region ===== AUTHORIZATION & AUTHENTICATION =====

  describe("getSuperAdminUserIds", () => {
    let superAdminUserIdEnvVar: string;

    beforeEach(() => {
      superAdminUserIdEnvVar = "testUserId1 testUserId2 testUserId3";
    });

    let exec = () => {
      config.userPermissions.superAdminUserIds = superAdminUserIdEnvVar;
      return MindSphereApp.getSuperAdminUserIds();
    };

    it("should return collection of super admin users id - if there are several ids", () => {
      let result = exec();

      expect(result).toEqual(["testUserId1", "testUserId2", "testUserId3"]);
    });

    it("should return collection of super admin users id - if there is only one super admin id", () => {
      superAdminUserIdEnvVar = "testUserId";
      let result = exec();

      expect(result).toEqual(["testUserId"]);
    });

    it("should return empty array if there is no super admin id", () => {
      superAdminUserIdEnvVar = "";
      let result = exec();

      expect(result).toEqual([]);
    });
  });

  describe("isSuperAdmin", () => {
    let superAdminUserIdEnvVar: string;
    let hostTenantEnvVar: string;
    let userData: MindSphereUserJWTData;

    beforeEach(() => {
      mockedGetAllUsersResults.results = [[{ id: "testUserId2" }]];

      superAdminUserIdEnvVar = "testUserId1 testUserId2 testUserId3";
      hostTenantEnvVar = "testTenant";
      userData = {
        client_id: "testClientId",
        email: "testEmail",
        scope: [],
        ten: "testTenant",
        subtenant: "testSubtenant",
        user_name: "testUserName",
      };
    });

    let exec = () => {
      config.userPermissions.superAdminUserIds = superAdminUserIdEnvVar;
      config.appCredentials.hostTenant = hostTenantEnvVar;
      return MindSphereApp.isSuperAdmin(userData);
    };

    it("should call mindSphere get all users method - to check if user of given email exists for tenant and subtenant and return true if user exists and its id is inside superAdminIds env", async () => {
      let result = await exec();

      expect(result).toEqual(true);

      expect(mockedGetAllUsersFunction).toHaveBeenCalledTimes(1);
      expect(mockedGetAllUsersFunction.mock.calls[0]).toEqual([
        "testTenant",
        "testSubtenant",
        null,
        "testemail",
      ]);
    });

    it("should call mindSphere get all users method - to check if user of given email exists for tenant and subtenant and return true if user exists and its id is inside superAdminIds env - if there is no subtenant for user", async () => {
      delete userData.subtenant;

      let result = await exec();

      expect(result).toEqual(true);

      expect(mockedGetAllUsersFunction).toHaveBeenCalledTimes(1);
      expect(mockedGetAllUsersFunction.mock.calls[0]).toEqual([
        "testTenant",
        null,
        null,
        "testemail",
      ]);
    });

    it("should call mindSphere get all users method - to check if user of given email exists for tenant and subtenant and return false if there is no user returned by this API CALL", async () => {
      mockedGetAllUsersResults.results = [[]];

      let result = await exec();

      expect(result).toEqual(false);

      expect(mockedGetAllUsersFunction).toHaveBeenCalledTimes(1);
      expect(mockedGetAllUsersFunction.mock.calls[0]).toEqual([
        "testTenant",
        "testSubtenant",
        null,
        "testemail",
      ]);
    });

    it("should call mindSphere get all users method - to check if user of given email exists for tenant and subtenant and return false if user returned by API call has no id given", async () => {
      mockedGetAllUsersResults.results = [[{ fakeContent: "abcd1234" }]];

      let result = await exec();

      expect(result).toEqual(false);

      expect(mockedGetAllUsersFunction).toHaveBeenCalledTimes(1);
      expect(mockedGetAllUsersFunction.mock.calls[0]).toEqual([
        "testTenant",
        "testSubtenant",
        null,
        "testemail",
      ]);
    });

    it("should call mindSphere get all users method - to check if user of given email exists for tenant and subtenant and return false if user is from different tenant then host tenant", async () => {
      userData.ten = "fakeTenant";

      let result = await exec();

      expect(result).toEqual(false);

      expect(mockedGetAllUsersFunction).not.toHaveBeenCalled();
    });

    it("should call mindSphere get all users method - to check if user of given email exists for tenant and subtenant and return false if user id is not present in superAdminIds in env", async () => {
      mockedGetAllUsersResults.results = [[{ id: "fakeUserId" }]];

      let result = await exec();

      expect(result).toEqual(false);

      expect(mockedGetAllUsersFunction).toHaveBeenCalledTimes(1);
      expect(mockedGetAllUsersFunction.mock.calls[0]).toEqual([
        "testTenant",
        "testSubtenant",
        null,
        "testemail",
      ]);
    });

    it("should call mindSphere get all users method - to check if user of given email exists for tenant and subtenant and return false if there is not superAdminIds in env", async () => {
      superAdminUserIdEnvVar = "";

      let result = await exec();

      expect(result).toEqual(false);

      expect(mockedGetAllUsersFunction).toHaveBeenCalledTimes(1);
      expect(mockedGetAllUsersFunction.mock.calls[0]).toEqual([
        "testTenant",
        "testSubtenant",
        null,
        "testemail",
      ]);
    });

    it("should call mindSphere get all users method - to check if user of given email exists for tenant and subtenant and there is only one user in superAdminIds", async () => {
      superAdminUserIdEnvVar = "testUserId2";

      let result = await exec();

      expect(result).toEqual(true);

      expect(mockedGetAllUsersFunction).toHaveBeenCalledTimes(1);
      expect(mockedGetAllUsersFunction.mock.calls[0]).toEqual([
        "testTenant",
        "testSubtenant",
        null,
        "testemail",
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

    let exec = () => {
      config.userPermissions.globalAdminScope = globalAdminScopeEnvVar;
      return MindSphereApp.hasGlobalAdminScope(userData);
    };

    it("should return true if users scope includes global admin scope", () => {
      let result = exec();

      expect(result).toEqual(true);
    });

    it("should return false if users scope does not include global admin scope", () => {
      userData.scope = ["testScope1", "testScope2", "testScope3"];

      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if users scope is an empty array", () => {
      userData.scope = [];

      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if users scope is null", () => {
      (userData as any).scope = null;

      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if users scope is undefined", () => {
      (userData as any).scope = undefined;

      let result = exec();

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

    let exec = () => {
      config.userPermissions.globalAdminScope = globalAdminScopeEnvVar;
      return MindSphereApp.hasGlobalUserScope(userData);
    };

    it("should return true if users scope includes global user scope", () => {
      let result = exec();

      expect(result).toEqual(true);
    });

    it("should return false if users scope does not include global user scope", () => {
      userData.scope = ["testScope1", "testScope2", "testScope3"];

      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if users scope is an empty array", () => {
      userData.scope = [];

      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if users scope is null", () => {
      (userData as any).scope = null;

      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if users scope is undefined", () => {
      (userData as any).scope = undefined;

      let result = exec();

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

    let exec = () => {
      config.userPermissions.globalAdminScope = globalAdminScopeEnvVar;
      return MindSphereApp.hasLocalAdminScope(userData);
    };

    it("should return true if users scope includes local admin scope", () => {
      let result = exec();

      expect(result).toEqual(true);
    });

    it("should return false if users scope does not include local admin scope", () => {
      userData.scope = ["testScope1", "testScope2", "testScope3"];

      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if users scope is an empty array", () => {
      userData.scope = [];

      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if users scope is null", () => {
      (userData as any).scope = null;

      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if users scope is undefined", () => {
      (userData as any).scope = undefined;

      let result = exec();

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

    let exec = () => {
      config.userPermissions.globalAdminScope = globalAdminScopeEnvVar;
      return MindSphereApp.hasLocalUserScope(userData);
    };

    it("should return true if users scope includes local user scope", () => {
      let result = exec();

      expect(result).toEqual(true);
    });

    it("should return false if users scope does not include local user scope", () => {
      userData.scope = ["testScope1", "testScope2", "testScope3"];

      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if users scope is an empty array", () => {
      userData.scope = [];

      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if users scope is null", () => {
      (userData as any).scope = null;

      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if users scope is undefined", () => {
      (userData as any).scope = undefined;

      let result = exec();

      expect(result).toEqual(false);
    });
  });

  describe("hasGlobalAdminRole", () => {
    let userData: UserStorageData;

    beforeEach(() => {
      userData = {
        config: {},
        data: {},
        email: "testUserEmail",
        permissions: {
          plants: {},
          role: UserRole.GlobalAdmin,
        },
      };
    });

    let exec = () => {
      return MindSphereApp.hasGlobalAdminRole(userData);
    };

    it("should return true if user has global admin role", () => {
      let result = exec();

      expect(result).toEqual(true);
    });

    it("should return false if user has different role", () => {
      userData.permissions.role = UserRole.GlobalUser;
      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if user invalid role = 5", () => {
      userData.permissions.role = 5;
      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if user invalid role = null", () => {
      (userData.permissions as any).role = null;
      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if user invalid role = undefined", () => {
      (userData.permissions as any).role = undefined;
      let result = exec();

      expect(result).toEqual(false);
    });
  });

  describe("hasGlobalUserRole", () => {
    let userData: UserStorageData;

    beforeEach(() => {
      userData = {
        config: {},
        data: {},
        email: "testUserEmail",
        permissions: {
          plants: {},
          role: UserRole.GlobalUser,
        },
      };
    });

    let exec = () => {
      return MindSphereApp.hasGlobalUserRole(userData);
    };

    it("should return true if user has global user role", () => {
      let result = exec();

      expect(result).toEqual(true);
    });

    it("should return false if user has different role", () => {
      userData.permissions.role = UserRole.GlobalAdmin;
      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if user invalid role = 5", () => {
      userData.permissions.role = 5;
      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if user invalid role = null", () => {
      (userData.permissions as any).role = null;
      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if user invalid role = undefined", () => {
      (userData.permissions as any).role = undefined;
      let result = exec();

      expect(result).toEqual(false);
    });
  });

  describe("hasLocalAdminRole", () => {
    let userData: UserStorageData;

    beforeEach(() => {
      userData = {
        config: {},
        data: {},
        email: "testUserEmail",
        permissions: {
          plants: {},
          role: UserRole.LocalAdmin,
        },
      };
    });

    let exec = () => {
      return MindSphereApp.hasLocalAdminRole(userData);
    };

    it("should return true if user has local admin role", () => {
      let result = exec();

      expect(result).toEqual(true);
    });

    it("should return false if user has different role", () => {
      userData.permissions.role = UserRole.GlobalAdmin;
      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if user invalid role = 5", () => {
      userData.permissions.role = 5;
      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if user invalid role = null", () => {
      (userData.permissions as any).role = null;
      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if user invalid role = undefined", () => {
      (userData.permissions as any).role = undefined;
      let result = exec();

      expect(result).toEqual(false);
    });
  });

  describe("hasLocalUserRole", () => {
    let userData: UserStorageData;

    beforeEach(() => {
      userData = {
        config: {},
        data: {},
        email: "testUserEmail",
        permissions: {
          plants: {},
          role: UserRole.LocalUser,
        },
      };
    });

    let exec = () => {
      return MindSphereApp.hasLocalUserRole(userData);
    };

    it("should return true if user has local user role", () => {
      let result = exec();

      expect(result).toEqual(true);
    });

    it("should return false if user has different role", () => {
      userData.permissions.role = UserRole.GlobalAdmin;
      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if user invalid role = 5", () => {
      userData.permissions.role = 5;
      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if user invalid role = null", () => {
      (userData.permissions as any).role = null;
      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if user invalid role = undefined", () => {
      (userData.permissions as any).role = undefined;
      let result = exec();

      expect(result).toEqual(false);
    });
  });

  describe("isLocalAdminOfPlant", () => {
    let plantId: string;
    let userData: UserStorageData;

    beforeEach(() => {
      plantId = "testPlant2";

      userData = {
        config: {},
        data: {},
        email: "testUserEmail",
        permissions: {
          plants: {
            testPlant1: PlantPermissions.User,
            testPlant2: PlantPermissions.Admin,
            testPlant3: PlantPermissions.User,
          },
          role: UserRole.LocalAdmin,
        },
      };
    });

    let exec = () => {
      return MindSphereApp.isLocalAdminOfPlant(plantId, userData);
    };

    it("should return true if user has local admin permissions to given plant", () => {
      let result = exec();

      expect(result).toEqual(true);
    });

    it("should return false if user has local user permissions to given plant", () => {
      userData.permissions.plants.testPlant2 = PlantPermissions.User;
      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if user invalid local permissions = 5", () => {
      userData.permissions.plants.testPlant2 = 5;
      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if user invalid local permissions = null", () => {
      (userData.permissions.plants as any).testPlant2 = null;
      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if user invalid local permissions = undefined", () => {
      (userData.permissions.plants as any).testPlant2 = undefined;
      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if user has no access to any plant", () => {
      userData.permissions.plants = {};
      let result = exec();

      expect(result).toEqual(false);
    });
  });

  describe("isLocalUserOfPlant", () => {
    let plantId: string;
    let userData: UserStorageData;

    beforeEach(() => {
      plantId = "testPlant2";

      userData = {
        config: {},
        data: {},
        email: "testUserEmail",
        permissions: {
          plants: {
            testPlant1: PlantPermissions.Admin,
            testPlant2: PlantPermissions.User,
            testPlant3: PlantPermissions.Admin,
          },
          role: UserRole.LocalAdmin,
        },
      };
    });

    let exec = () => {
      return MindSphereApp.isLocalUserOfPlant(plantId, userData);
    };

    it("should return true if user has local user permissions to given plant", () => {
      let result = exec();

      expect(result).toEqual(true);
    });

    it("should return false if user has local admin permissions to given plant", () => {
      userData.permissions.plants.testPlant2 = PlantPermissions.Admin;
      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if user invalid local permissions = 5", () => {
      userData.permissions.plants.testPlant2 = 5;
      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if user invalid local permissions = null", () => {
      (userData.permissions.plants as any).testPlant2 = null;
      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if user invalid local permissions = undefined", () => {
      (userData.permissions.plants as any).testPlant2 = undefined;
      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if user has no access to any plant", () => {
      userData.permissions.plants = {};
      let result = exec();

      expect(result).toEqual(false);
    });
  });

  describe("hasLocalAccessToPlant", () => {
    let plantId: string;
    let userData: UserStorageData;

    beforeEach(() => {
      plantId = "testPlant2";

      userData = {
        config: {},
        data: {},
        email: "testUserEmail",
        permissions: {
          plants: {
            testPlant1: PlantPermissions.Admin,
            testPlant2: PlantPermissions.Admin,
            testPlant3: PlantPermissions.Admin,
          },
          role: UserRole.LocalAdmin,
        },
      };
    });

    let exec = () => {
      return MindSphereApp.hasLocalAccessToPlant(plantId, userData);
    };

    it("should return true if user has local user permissions to given plant", () => {
      let result = exec();

      expect(result).toEqual(true);
    });

    it("should return true if user has local user permissions to given plant", () => {
      userData.permissions.plants.testPlant2 = PlantPermissions.User;
      let result = exec();

      expect(result).toEqual(true);
    });

    it("should return false if user invalid local permissions = 5", () => {
      userData.permissions.plants.testPlant2 = 5;
      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if user invalid local permissions = null", () => {
      (userData.permissions.plants as any).testPlant2 = null;
      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if user invalid local permissions = undefined", () => {
      (userData.permissions.plants as any).testPlant2 = undefined;
      let result = exec();

      expect(result).toEqual(false);
    });

    it("should return false if user has no access to any plant", () => {
      userData.permissions.plants = {};
      let result = exec();

      expect(result).toEqual(false);
    });
  });

  //#endregion ===== AUTHORIZATION & AUTHENTICATION =====
});

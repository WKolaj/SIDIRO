import { config } from "node-config-ts";
import {
  MindSphereApp,
  PlantPermissions,
  UserRole,
  UserStorageData,
  AppStorageData,
  PlanStorageData,
} from "../../../../classes/MindSphereApp/MindSphereApp";
import { MindSphereFileService } from "../../../../classes/MindSphereService/MindSphereFileService";
import {
  MindSphereUserGroupData,
  MindSphereUserGroupService,
} from "../../../../classes/MindSphereService/MindSphereUserGroupService";
import { MindSphereUserService } from "../../../../classes/MindSphereService/MindSphereUserService";
import { MindSphereUserJWTData } from "../../../../middleware/tokenData/fetchTokenData";
import {
  setPrivateProperty,
  testPrivateProperty,
} from "../../../utilities/utilities";

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
  // //#region ===== USER SERVICE ======
  // let mindSphereUserService: MindSphereUserService;
  // let mockedGetAllUsersResults: mockFunctionResult;
  // let mockedGetAllUsersFunction: jest.Mock;
  // //#endregion ===== USER SERVICE ======
  // //#region ===== USER GROUP SERVICE ======
  // let mindSphereUserGroupService: MindSphereUserGroupService;
  // let mockedGetAllUserGroupsResults: mockFunctionResult;
  // let mockedGetAllUserGroupsFunction: jest.Mock;
  // //#endregion ===== USER GROUP SERVICE ======
  // //#region ===== FILE SERVICE ======
  // let mindSphereFileService: MindSphereFileService;
  // let mockedGetAllFileNamesResults: mockFunctionResult;
  // let mockedGetAllFileNamesFunction: jest.Mock;
  // let mockedGetFileResults: mockFunctionResult;
  // let mockedGetFileFunction: jest.Mock;
  // let mockedSetFileResults: mockFunctionResult;
  // let mockedSetFileFunction: jest.Mock;
  // let mockedCheckFileResults: mockFunctionResult;
  // let mockedCheckFileFunction: jest.Mock;
  // let mockedDeleteFileResults: mockFunctionResult;
  // let mockedDeleteFileFunction: jest.Mock;
  // //#endregion ===== FILE SERVICE ======
  // beforeEach(() => {
  //   //Clearing MindSphereServices
  //   (MindSphereUserService as any)._instance = null;
  //   //#region ===== USER SERVICE ======
  //   mockedGetAllUsersResults = {
  //     results: [],
  //     errors: [],
  //   };
  //   mindSphereUserService = MindSphereUserService.getInstance();
  //   mockedGetAllUsersFunction = createMockResultFunction(
  //     mockedGetAllUsersResults
  //   );
  //   mindSphereUserService.getAllUsers = mockedGetAllUsersFunction;
  //   //#endregion ===== USER SERVICE ======
  //   //#region ===== USER GROUP SERVICE ======
  //   mockedGetAllUserGroupsResults = {
  //     errors: [],
  //     results: [],
  //   };
  //   mindSphereUserGroupService = MindSphereUserGroupService.getInstance();
  //   mockedGetAllUserGroupsFunction = createMockResultFunction(
  //     mockedGetAllUserGroupsResults
  //   );
  //   mindSphereUserGroupService.getAllUserGroups = mockedGetAllUserGroupsFunction;
  //   //#endregion ===== USER GROUP SERVICE ======
  //   //#region ===== FILE SERVICE ======
  //   mockedGetAllFileNamesResults = {
  //     errors: [],
  //     results: [],
  //   };
  //   mockedGetFileResults = {
  //     errors: [],
  //     results: [],
  //   };
  //   mockedSetFileResults = {
  //     errors: [],
  //     results: [],
  //   };
  //   mockedCheckFileResults = {
  //     errors: [],
  //     results: [],
  //   };
  //   mockedDeleteFileResults = {
  //     errors: [],
  //     results: [],
  //   };
  //   mindSphereFileService = MindSphereFileService.getInstance();
  //   mockedGetAllFileNamesFunction = createMockResultFunction(
  //     mockedGetAllUserGroupsResults
  //   );
  //   mindSphereFileService.getAllFileNamesFromAsset = mockedGetAllFileNamesFunction;
  //   mockedGetFileFunction = createMockResultFunction(mockedGetFileResults);
  //   mindSphereFileService.getFileContent = mockedGetFileFunction;
  //   mockedSetFileFunction = createMockResultFunction(mockedSetFileResults);
  //   mindSphereFileService.setFileContent = mockedSetFileFunction;
  //   mockedCheckFileFunction = createMockResultFunction(mockedCheckFileResults);
  //   mindSphereFileService.checkIfFileExists = mockedCheckFileFunction;
  //   mockedDeleteFileFunction = createMockResultFunction(
  //     mockedDeleteFileResults
  //   );
  //   mindSphereFileService.deleteFile = mockedDeleteFileFunction;
  //   //#endregion ===== FILE SERVICE ======
  // });
  // afterEach(() => {
  //   //Clearing MindSphereServices
  //   (MindSphereUserService as any)._instance = null;
  // });
  // //#region ===== AUTHORIZATION & AUTHENTICATION =====
  // describe("getSuperAdminUserIds", () => {
  //   let superAdminUserIdEnvVar: string;
  //   beforeEach(() => {
  //     superAdminUserIdEnvVar = "testUserId1 testUserId2 testUserId3";
  //   });
  //   let exec = () => {
  //     config.userPermissions.superAdminUserIds = superAdminUserIdEnvVar;
  //     return MindSphereApp.getSuperAdminUserIds();
  //   };
  //   it("should return collection of super admin users id - if there are several ids", () => {
  //     let result = exec();
  //     expect(result).toEqual(["testUserId1", "testUserId2", "testUserId3"]);
  //   });
  //   it("should return collection of super admin users id - if there is only one super admin id", () => {
  //     superAdminUserIdEnvVar = "testUserId";
  //     let result = exec();
  //     expect(result).toEqual(["testUserId"]);
  //   });
  //   it("should return empty array if there is no super admin id", () => {
  //     superAdminUserIdEnvVar = "";
  //     let result = exec();
  //     expect(result).toEqual([]);
  //   });
  // });
  // describe("isSuperAdmin", () => {
  //   let superAdminUserIdEnvVar: string;
  //   let hostTenantEnvVar: string;
  //   let userData: MindSphereUserJWTData;
  //   beforeEach(() => {
  //     mockedGetAllUsersResults.results = [[{ id: "testUserId2" }]];
  //     superAdminUserIdEnvVar = "testUserId1 testUserId2 testUserId3";
  //     hostTenantEnvVar = "testTenant";
  //     userData = {
  //       client_id: "testClientId",
  //       email: "testEmail",
  //       scope: [],
  //       ten: "testTenant",
  //       subtenant: "testSubtenant",
  //       user_name: "testUserName",
  //     };
  //   });
  //   let exec = () => {
  //     config.userPermissions.superAdminUserIds = superAdminUserIdEnvVar;
  //     config.appCredentials.hostTenant = hostTenantEnvVar;
  //     return MindSphereApp.isSuperAdmin(userData);
  //   };
  //   it("should call mindSphere get all users method - to check if user of given email exists for tenant and subtenant and return true if user exists and its id is inside superAdminIds env", async () => {
  //     let result = await exec();
  //     expect(result).toEqual(true);
  //     expect(mockedGetAllUsersFunction).toHaveBeenCalledTimes(1);
  //     expect(mockedGetAllUsersFunction.mock.calls[0]).toEqual([
  //       "testTenant",
  //       "testSubtenant",
  //       null,
  //       "testemail",
  //     ]);
  //   });
  //   it("should call mindSphere get all users method - to check if user of given email exists for tenant and subtenant and return true if user exists and its id is inside superAdminIds env - if there is no subtenant for user", async () => {
  //     delete userData.subtenant;
  //     let result = await exec();
  //     expect(result).toEqual(true);
  //     expect(mockedGetAllUsersFunction).toHaveBeenCalledTimes(1);
  //     expect(mockedGetAllUsersFunction.mock.calls[0]).toEqual([
  //       "testTenant",
  //       null,
  //       null,
  //       "testemail",
  //     ]);
  //   });
  //   it("should call mindSphere get all users method - to check if user of given email exists for tenant and subtenant and return false if there is no user returned by this API CALL", async () => {
  //     mockedGetAllUsersResults.results = [[]];
  //     let result = await exec();
  //     expect(result).toEqual(false);
  //     expect(mockedGetAllUsersFunction).toHaveBeenCalledTimes(1);
  //     expect(mockedGetAllUsersFunction.mock.calls[0]).toEqual([
  //       "testTenant",
  //       "testSubtenant",
  //       null,
  //       "testemail",
  //     ]);
  //   });
  //   it("should call mindSphere get all users method - to check if user of given email exists for tenant and subtenant and return false if user returned by API call has no id given", async () => {
  //     mockedGetAllUsersResults.results = [[{ fakeContent: "abcd1234" }]];
  //     let result = await exec();
  //     expect(result).toEqual(false);
  //     expect(mockedGetAllUsersFunction).toHaveBeenCalledTimes(1);
  //     expect(mockedGetAllUsersFunction.mock.calls[0]).toEqual([
  //       "testTenant",
  //       "testSubtenant",
  //       null,
  //       "testemail",
  //     ]);
  //   });
  //   it("should call mindSphere get all users method - to check if user of given email exists for tenant and subtenant and return false if user is from different tenant then host tenant", async () => {
  //     userData.ten = "fakeTenant";
  //     let result = await exec();
  //     expect(result).toEqual(false);
  //     expect(mockedGetAllUsersFunction).not.toHaveBeenCalled();
  //   });
  //   it("should call mindSphere get all users method - to check if user of given email exists for tenant and subtenant and return false if user id is not present in superAdminIds in env", async () => {
  //     mockedGetAllUsersResults.results = [[{ id: "fakeUserId" }]];
  //     let result = await exec();
  //     expect(result).toEqual(false);
  //     expect(mockedGetAllUsersFunction).toHaveBeenCalledTimes(1);
  //     expect(mockedGetAllUsersFunction.mock.calls[0]).toEqual([
  //       "testTenant",
  //       "testSubtenant",
  //       null,
  //       "testemail",
  //     ]);
  //   });
  //   it("should call mindSphere get all users method - to check if user of given email exists for tenant and subtenant and return false if there is not superAdminIds in env", async () => {
  //     superAdminUserIdEnvVar = "";
  //     let result = await exec();
  //     expect(result).toEqual(false);
  //     expect(mockedGetAllUsersFunction).toHaveBeenCalledTimes(1);
  //     expect(mockedGetAllUsersFunction.mock.calls[0]).toEqual([
  //       "testTenant",
  //       "testSubtenant",
  //       null,
  //       "testemail",
  //     ]);
  //   });
  //   it("should call mindSphere get all users method - to check if user of given email exists for tenant and subtenant and there is only one user in superAdminIds", async () => {
  //     superAdminUserIdEnvVar = "testUserId2";
  //     let result = await exec();
  //     expect(result).toEqual(true);
  //     expect(mockedGetAllUsersFunction).toHaveBeenCalledTimes(1);
  //     expect(mockedGetAllUsersFunction.mock.calls[0]).toEqual([
  //       "testTenant",
  //       "testSubtenant",
  //       null,
  //       "testemail",
  //     ]);
  //   });
  // });
  // describe("hasGlobalAdminScope", () => {
  //   let globalAdminScopeEnvVar: string;
  //   let userData: MindSphereUserJWTData;
  //   beforeEach(() => {
  //     globalAdminScopeEnvVar = "testGlobalAdminScope";
  //     userData = {
  //       client_id: "testClientId",
  //       email: "testEmail",
  //       scope: ["testScope1", "testGlobalAdminScope", "testScope3"],
  //       ten: "testTenant",
  //       subtenant: "testSubtenant",
  //       user_name: "testUserName",
  //     };
  //   });
  //   let exec = () => {
  //     config.userPermissions.globalAdminScope = globalAdminScopeEnvVar;
  //     return MindSphereApp.hasGlobalAdminScope(userData);
  //   };
  //   it("should return true if users scope includes global admin scope", () => {
  //     let result = exec();
  //     expect(result).toEqual(true);
  //   });
  //   it("should return false if users scope does not include global admin scope", () => {
  //     userData.scope = ["testScope1", "testScope2", "testScope3"];
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if users scope is an empty array", () => {
  //     userData.scope = [];
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if users scope is null", () => {
  //     (userData as any).scope = null;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if users scope is undefined", () => {
  //     (userData as any).scope = undefined;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  // });
  // describe("hasGlobalUserScope", () => {
  //   let globalAdminScopeEnvVar: string;
  //   let userData: MindSphereUserJWTData;
  //   beforeEach(() => {
  //     globalAdminScopeEnvVar = "testGlobalUserScope";
  //     userData = {
  //       client_id: "testClientId",
  //       email: "testEmail",
  //       scope: ["testScope1", "testGlobalUserScope", "testScope3"],
  //       ten: "testTenant",
  //       subtenant: "testSubtenant",
  //       user_name: "testUserName",
  //     };
  //   });
  //   let exec = () => {
  //     config.userPermissions.globalAdminScope = globalAdminScopeEnvVar;
  //     return MindSphereApp.hasGlobalUserScope(userData);
  //   };
  //   it("should return true if users scope includes global user scope", () => {
  //     let result = exec();
  //     expect(result).toEqual(true);
  //   });
  //   it("should return false if users scope does not include global user scope", () => {
  //     userData.scope = ["testScope1", "testScope2", "testScope3"];
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if users scope is an empty array", () => {
  //     userData.scope = [];
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if users scope is null", () => {
  //     (userData as any).scope = null;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if users scope is undefined", () => {
  //     (userData as any).scope = undefined;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  // });
  // describe("hasLocalAdminScope", () => {
  //   let globalAdminScopeEnvVar: string;
  //   let userData: MindSphereUserJWTData;
  //   beforeEach(() => {
  //     globalAdminScopeEnvVar = "testLocalAdminScope";
  //     userData = {
  //       client_id: "testClientId",
  //       email: "testEmail",
  //       scope: ["testScope1", "testLocalAdminScope", "testScope3"],
  //       ten: "testTenant",
  //       subtenant: "testSubtenant",
  //       user_name: "testUserName",
  //     };
  //   });
  //   let exec = () => {
  //     config.userPermissions.globalAdminScope = globalAdminScopeEnvVar;
  //     return MindSphereApp.hasLocalAdminScope(userData);
  //   };
  //   it("should return true if users scope includes local admin scope", () => {
  //     let result = exec();
  //     expect(result).toEqual(true);
  //   });
  //   it("should return false if users scope does not include local admin scope", () => {
  //     userData.scope = ["testScope1", "testScope2", "testScope3"];
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if users scope is an empty array", () => {
  //     userData.scope = [];
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if users scope is null", () => {
  //     (userData as any).scope = null;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if users scope is undefined", () => {
  //     (userData as any).scope = undefined;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  // });
  // describe("hasLocalUserScope", () => {
  //   let globalAdminScopeEnvVar: string;
  //   let userData: MindSphereUserJWTData;
  //   beforeEach(() => {
  //     globalAdminScopeEnvVar = "testLocalUserScope";
  //     userData = {
  //       client_id: "testClientId",
  //       email: "testEmail",
  //       scope: ["testScope1", "testLocalUserScope", "testScope3"],
  //       ten: "testTenant",
  //       subtenant: "testSubtenant",
  //       user_name: "testUserName",
  //     };
  //   });
  //   let exec = () => {
  //     config.userPermissions.globalAdminScope = globalAdminScopeEnvVar;
  //     return MindSphereApp.hasLocalUserScope(userData);
  //   };
  //   it("should return true if users scope includes local user scope", () => {
  //     let result = exec();
  //     expect(result).toEqual(true);
  //   });
  //   it("should return false if users scope does not include local user scope", () => {
  //     userData.scope = ["testScope1", "testScope2", "testScope3"];
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if users scope is an empty array", () => {
  //     userData.scope = [];
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if users scope is null", () => {
  //     (userData as any).scope = null;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if users scope is undefined", () => {
  //     (userData as any).scope = undefined;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  // });
  // describe("hasGlobalAdminRole", () => {
  //   let userData: UserStorageData;
  //   beforeEach(() => {
  //     userData = {
  //       config: {},
  //       data: {},
  //       email: "testUserEmail",
  //       permissions: {
  //         plants: {},
  //         role: UserRole.GlobalAdmin,
  //       },
  //     };
  //   });
  //   let exec = () => {
  //     return MindSphereApp.hasGlobalAdminRole(userData);
  //   };
  //   it("should return true if user has global admin role", () => {
  //     let result = exec();
  //     expect(result).toEqual(true);
  //   });
  //   it("should return false if user has different role", () => {
  //     userData.permissions.role = UserRole.GlobalUser;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if user invalid role = 5", () => {
  //     userData.permissions.role = 5;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if user invalid role = null", () => {
  //     (userData.permissions as any).role = null;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if user invalid role = undefined", () => {
  //     (userData.permissions as any).role = undefined;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  // });
  // describe("hasGlobalUserRole", () => {
  //   let userData: UserStorageData;
  //   beforeEach(() => {
  //     userData = {
  //       config: {},
  //       data: {},
  //       email: "testUserEmail",
  //       permissions: {
  //         plants: {},
  //         role: UserRole.GlobalUser,
  //       },
  //     };
  //   });
  //   let exec = () => {
  //     return MindSphereApp.hasGlobalUserRole(userData);
  //   };
  //   it("should return true if user has global user role", () => {
  //     let result = exec();
  //     expect(result).toEqual(true);
  //   });
  //   it("should return false if user has different role", () => {
  //     userData.permissions.role = UserRole.GlobalAdmin;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if user invalid role = 5", () => {
  //     userData.permissions.role = 5;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if user invalid role = null", () => {
  //     (userData.permissions as any).role = null;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if user invalid role = undefined", () => {
  //     (userData.permissions as any).role = undefined;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  // });
  // describe("hasLocalAdminRole", () => {
  //   let userData: UserStorageData;
  //   beforeEach(() => {
  //     userData = {
  //       config: {},
  //       data: {},
  //       email: "testUserEmail",
  //       permissions: {
  //         plants: {},
  //         role: UserRole.LocalAdmin,
  //       },
  //     };
  //   });
  //   let exec = () => {
  //     return MindSphereApp.hasLocalAdminRole(userData);
  //   };
  //   it("should return true if user has local admin role", () => {
  //     let result = exec();
  //     expect(result).toEqual(true);
  //   });
  //   it("should return false if user has different role", () => {
  //     userData.permissions.role = UserRole.GlobalAdmin;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if user invalid role = 5", () => {
  //     userData.permissions.role = 5;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if user invalid role = null", () => {
  //     (userData.permissions as any).role = null;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if user invalid role = undefined", () => {
  //     (userData.permissions as any).role = undefined;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  // });
  // describe("hasLocalUserRole", () => {
  //   let userData: UserStorageData;
  //   beforeEach(() => {
  //     userData = {
  //       config: {},
  //       data: {},
  //       email: "testUserEmail",
  //       permissions: {
  //         plants: {},
  //         role: UserRole.LocalUser,
  //       },
  //     };
  //   });
  //   let exec = () => {
  //     return MindSphereApp.hasLocalUserRole(userData);
  //   };
  //   it("should return true if user has local user role", () => {
  //     let result = exec();
  //     expect(result).toEqual(true);
  //   });
  //   it("should return false if user has different role", () => {
  //     userData.permissions.role = UserRole.GlobalAdmin;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if user invalid role = 5", () => {
  //     userData.permissions.role = 5;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if user invalid role = null", () => {
  //     (userData.permissions as any).role = null;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if user invalid role = undefined", () => {
  //     (userData.permissions as any).role = undefined;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  // });
  // describe("isLocalAdminOfPlant", () => {
  //   let plantId: string;
  //   let userData: UserStorageData;
  //   beforeEach(() => {
  //     plantId = "testfakePlant2";
  //     userData = {
  //       config: {},
  //       data: {},
  //       email: "testUserEmail",
  //       permissions: {
  //         plants: {
  //           testfakePlant1: PlantPermissions.User,
  //           testfakePlant2: PlantPermissions.Admin,
  //           testfakePlant3: PlantPermissions.User,
  //         },
  //         role: UserRole.LocalAdmin,
  //       },
  //     };
  //   });
  //   let exec = () => {
  //     return MindSphereApp.isLocalAdminOfPlant(plantId, userData);
  //   };
  //   it("should return true if user has local admin permissions to given plant", () => {
  //     let result = exec();
  //     expect(result).toEqual(true);
  //   });
  //   it("should return false if user has local user permissions to given plant", () => {
  //     userData.permissions.plants.testfakePlant2 = PlantPermissions.User;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if user invalid local permissions = 5", () => {
  //     userData.permissions.plants.testfakePlant2 = 5;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if user invalid local permissions = null", () => {
  //     (userData.permissions.plants as any).testfakePlant2 = null;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if user invalid local permissions = undefined", () => {
  //     (userData.permissions.plants as any).testfakePlant2 = undefined;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if user has no access to any plant", () => {
  //     userData.permissions.plants = {};
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  // });
  // describe("isLocalUserOfPlant", () => {
  //   let plantId: string;
  //   let userData: UserStorageData;
  //   beforeEach(() => {
  //     plantId = "testfakePlant2";
  //     userData = {
  //       config: {},
  //       data: {},
  //       email: "testUserEmail",
  //       permissions: {
  //         plants: {
  //           testfakePlant1: PlantPermissions.Admin,
  //           testfakePlant2: PlantPermissions.User,
  //           testfakePlant3: PlantPermissions.Admin,
  //         },
  //         role: UserRole.LocalAdmin,
  //       },
  //     };
  //   });
  //   let exec = () => {
  //     return MindSphereApp.isLocalUserOfPlant(plantId, userData);
  //   };
  //   it("should return true if user has local user permissions to given plant", () => {
  //     let result = exec();
  //     expect(result).toEqual(true);
  //   });
  //   it("should return false if user has local admin permissions to given plant", () => {
  //     userData.permissions.plants.testfakePlant2 = PlantPermissions.Admin;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if user invalid local permissions = 5", () => {
  //     userData.permissions.plants.testfakePlant2 = 5;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if user invalid local permissions = null", () => {
  //     (userData.permissions.plants as any).testfakePlant2 = null;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if user invalid local permissions = undefined", () => {
  //     (userData.permissions.plants as any).testfakePlant2 = undefined;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if user has no access to any plant", () => {
  //     userData.permissions.plants = {};
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  // });
  // describe("hasLocalAccessToPlant", () => {
  //   let plantId: string;
  //   let userData: UserStorageData;
  //   beforeEach(() => {
  //     plantId = "testfakePlant2";
  //     userData = {
  //       config: {},
  //       data: {},
  //       email: "testUserEmail",
  //       permissions: {
  //         plants: {
  //           testfakePlant1: PlantPermissions.Admin,
  //           testfakePlant2: PlantPermissions.Admin,
  //           testfakePlant3: PlantPermissions.Admin,
  //         },
  //         role: UserRole.LocalAdmin,
  //       },
  //     };
  //   });
  //   let exec = () => {
  //     return MindSphereApp.hasLocalAccessToPlant(plantId, userData);
  //   };
  //   it("should return true if user has local user permissions to given plant", () => {
  //     let result = exec();
  //     expect(result).toEqual(true);
  //   });
  //   it("should return true if user has local user permissions to given plant", () => {
  //     userData.permissions.plants.testfakePlant2 = PlantPermissions.User;
  //     let result = exec();
  //     expect(result).toEqual(true);
  //   });
  //   it("should return false if user invalid local permissions = 5", () => {
  //     userData.permissions.plants.testfakePlant2 = 5;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if user invalid local permissions = null", () => {
  //     (userData.permissions.plants as any).testfakePlant2 = null;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if user invalid local permissions = undefined", () => {
  //     (userData.permissions.plants as any).testfakePlant2 = undefined;
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  //   it("should return false if user has no access to any plant", () => {
  //     userData.permissions.plants = {};
  //     let result = exec();
  //     expect(result).toEqual(false);
  //   });
  // });
  // describe("getUserRoleBasedOnUserGroup", () => {
  //   let mindSphereApp: MindSphereApp;
  //   let initialized: boolean;
  //   let globalAdminGroup: MindSphereUserGroupData;
  //   let globalUserGroup: MindSphereUserGroupData;
  //   let localAdminGroup: MindSphereUserGroupData;
  //   let localUserGroup: MindSphereUserGroupData;
  //   let userGroupData: MindSphereUserGroupData;
  //   beforeEach(() => {
  //     initialized = true;
  //     globalAdminGroup = {
  //       description: "testGlobalAdminDescription",
  //       displayName: "testGlobalAdminDisplayName",
  //       members: [],
  //       id: "testGlobalAdminId",
  //     };
  //     globalUserGroup = {
  //       description: "testGlobalUserDescription",
  //       displayName: "testGlobalUserDisplayName",
  //       members: [],
  //       id: "testGlobalUserId",
  //     };
  //     localAdminGroup = {
  //       description: "testLocalAdminDescription",
  //       displayName: "testLocalAdminDisplayName",
  //       members: [],
  //       id: "testLocalAdminId",
  //     };
  //     localUserGroup = {
  //       description: "testLocalUserDescription",
  //       displayName: "testLocalUserDisplayName",
  //       members: [],
  //       id: "testLocalUserId",
  //     };
  //     userGroupData = {
  //       description: "testGlobalAdminDescription",
  //       displayName: "testGlobalAdminDisplayName",
  //       members: [],
  //       id: "testGlobalAdminId",
  //     };
  //   });
  //   let exec = () => {
  //     mindSphereApp = new MindSphereApp(
  //       "testStorageTenant",
  //       "testAppId",
  //       "testAssetId",
  //       "testTenant",
  //       "testSubtenantId"
  //     );
  //     setPrivateProperty(mindSphereApp, "_globalAdminGroup", globalAdminGroup);
  //     setPrivateProperty(mindSphereApp, "_globalUserGroup", globalUserGroup);
  //     setPrivateProperty(mindSphereApp, "_localAdminGroup", localAdminGroup);
  //     setPrivateProperty(mindSphereApp, "_localUserGroup", localUserGroup);
  //     setPrivateProperty(mindSphereApp, "_initialized", initialized);
  //     return mindSphereApp.getUserRoleBasedOnUserGroup(userGroupData);
  //   };
  //   it("should return GlobalAdmin if userGroupData has GlobalAdmin display name", () => {
  //     userGroupData = {
  //       description: "testGlobalAdminDescription",
  //       displayName: "testGlobalAdminDisplayName",
  //       members: [],
  //       id: "testGlobalAdminId",
  //     };
  //     let result = exec();
  //     expect(result).toEqual(UserRole.GlobalAdmin);
  //   });
  //   it("should return GlobalUser if userGroupData has GlobalUser display name", () => {
  //     userGroupData = {
  //       description: "testGlobalUserDescription",
  //       displayName: "testGlobalUserDisplayName",
  //       members: [],
  //       id: "testGlobalUserId",
  //     };
  //     let result = exec();
  //     expect(result).toEqual(UserRole.GlobalUser);
  //   });
  //   it("should return LocalAdmin if userGroupData has LocalAdmin display name", () => {
  //     userGroupData = {
  //       description: "testLocalAdminDescription",
  //       displayName: "testLocalAdminDisplayName",
  //       members: [],
  //       id: "testLocalAdminId",
  //     };
  //     let result = exec();
  //     expect(result).toEqual(UserRole.LocalAdmin);
  //   });
  //   it("should return LocalUser if userGroupData has LocalUser display name", () => {
  //     userGroupData = {
  //       description: "testLocalUserDescription",
  //       displayName: "testLocalUserDisplayName",
  //       members: [],
  //       id: "testLocalUserId",
  //     };
  //     let result = exec();
  //     expect(result).toEqual(UserRole.LocalUser);
  //   });
  //   it("should throw if id of group is not recognized", () => {
  //     userGroupData = {
  //       description: "testFakeUserDescription",
  //       displayName: "testFakeUserDisplayName",
  //       members: [],
  //       id: "testFakeUserId",
  //     };
  //     expect(exec).toThrow(
  //       `Permissions testFakeUserDisplayName not recognized!`
  //     );
  //   });
  //   it("should throw if app is not initialized", () => {
  //     initialized = false;
  //     expect(exec).toThrow(`Application not initialized!`);
  //   });
  // });
  // describe("getUserGroupBasedOnUserRole", () => {
  //   let mindSphereApp: MindSphereApp;
  //   let initialized: boolean;
  //   let globalAdminGroup: MindSphereUserGroupData;
  //   let globalUserGroup: MindSphereUserGroupData;
  //   let localAdminGroup: MindSphereUserGroupData;
  //   let localUserGroup: MindSphereUserGroupData;
  //   let userRole: UserRole;
  //   beforeEach(() => {
  //     initialized = true;
  //     globalAdminGroup = {
  //       description: "testGlobalAdminDescription",
  //       displayName: "testGlobalAdminDisplayName",
  //       members: [],
  //       id: "testGlobalAdminId",
  //     };
  //     globalUserGroup = {
  //       description: "testGlobalUserDescription",
  //       displayName: "testGlobalUserDisplayName",
  //       members: [],
  //       id: "testGlobalUserId",
  //     };
  //     localAdminGroup = {
  //       description: "testLocalAdminDescription",
  //       displayName: "testLocalAdminDisplayName",
  //       members: [],
  //       id: "testLocalAdminId",
  //     };
  //     localUserGroup = {
  //       description: "testLocalUserDescription",
  //       displayName: "testLocalUserDisplayName",
  //       members: [],
  //       id: "testLocalUserId",
  //     };
  //     userRole = UserRole.GlobalAdmin;
  //   });
  //   let exec = () => {
  //     mindSphereApp = new MindSphereApp(
  //       "testStorageTenant",
  //       "testAppId",
  //       "testAssetId",
  //       "testTenant",
  //       "testSubtenantId"
  //     );
  //     setPrivateProperty(mindSphereApp, "_globalAdminGroup", globalAdminGroup);
  //     setPrivateProperty(mindSphereApp, "_globalUserGroup", globalUserGroup);
  //     setPrivateProperty(mindSphereApp, "_localAdminGroup", localAdminGroup);
  //     setPrivateProperty(mindSphereApp, "_localUserGroup", localUserGroup);
  //     setPrivateProperty(mindSphereApp, "_initialized", initialized);
  //     return mindSphereApp.getUserGroupBasedOnUserRole(userRole);
  //   };
  //   it("should return GlobalAdmin user group if role is GlobalAdmin", () => {
  //     userRole = UserRole.GlobalAdmin;
  //     let result = exec();
  //     expect(result).toEqual(globalAdminGroup);
  //   });
  //   it("should return GlobalUser user group if role is GlobalUser", () => {
  //     userRole = UserRole.GlobalUser;
  //     let result = exec();
  //     expect(result).toEqual(globalUserGroup);
  //   });
  //   it("should return LocalAdmin user group if role is LocalAdmin", () => {
  //     userRole = UserRole.LocalAdmin;
  //     let result = exec();
  //     expect(result).toEqual(localAdminGroup);
  //   });
  //   it("should return LocalUser user group if role is LocalUser", () => {
  //     userRole = UserRole.LocalUser;
  //     let result = exec();
  //     expect(result).toEqual(localUserGroup);
  //   });
  //   it("should throw if role is not recognized", () => {
  //     userRole = 5;
  //     expect(exec).toThrow(`Role 5 not recognized!`);
  //   });
  //   it("should throw if app is not initialized", () => {
  //     initialized = false;
  //     expect(exec).toThrow(`Application not initialized!`);
  //   });
  // });
  // //#endregion ===== AUTHORIZATION & AUTHENTICATION =====
  // //#region ===== CONTRUCTOR & INITIALIZATION =====
  // describe("constructor", () => {
  //   let mindSphereApp: MindSphereApp;
  //   let storageTenant: string;
  //   let appId: string;
  //   let assetId: string;
  //   let appTenant: string;
  //   let subtenantId: string | null = null;
  //   beforeEach(() => {
  //     storageTenant = "testStorageTenant";
  //     appId = "testAppId";
  //     assetId = "testAssetId";
  //     appTenant = "testAppTenant";
  //     subtenantId = "testSubtenantId";
  //   });
  //   let exec = () => {
  //     return new MindSphereApp(
  //       storageTenant,
  //       appId,
  //       assetId,
  //       appTenant,
  //       subtenantId
  //     );
  //   };
  //   it("should create new MindSphereApp and set its properties, together with initialization flag (to false)", () => {
  //     let result = exec();
  //     expect(result).toBeDefined();
  //     expect(result.AssetId).toEqual(assetId);
  //     expect(result.AppId).toEqual(appId);
  //     expect(result.TenantName).toEqual(appTenant);
  //     expect(result.SubtenantId).toEqual(subtenantId);
  //     expect(result.StorageTenant).toEqual(storageTenant);
  //     testPrivateProperty(result, "_initialized", false);
  //   });
  //   it("should create new MindSphereApp and set its user groups to null", () => {
  //     let result = exec();
  //     expect(result.GlobalAdminGroup).toEqual(null);
  //     expect(result.GlobalUserGroup).toEqual(null);
  //     expect(result.LocalUserGroup).toEqual(null);
  //     expect(result.LocalAdminGroup).toEqual(null);
  //     expect(result.StandardUserGroup).toEqual(null);
  //     expect(result.SubtenantUserGroup).toEqual(null);
  //   });
  //   it("should create storages and set its content to empty object", () => {
  //     let result = exec();
  //     let anyResult = result as any;
  //     expect(anyResult._appStorage).toBeDefined();
  //     expect(anyResult._appStorage._cacheData).toEqual({});
  //     expect(anyResult._userStorage).toBeDefined();
  //     expect(anyResult._userStorage._cacheData).toEqual({});
  //     expect(anyResult._appStorage).toBeDefined();
  //     expect(anyResult._appStorage._cacheData).toEqual({});
  //   });
  // });
  // describe("init", () => {
  //   let mindSphereApp: MindSphereApp;
  //   let assetFilesStorageContent: {
  //     [filePath: string]: AppStorageData | UserStorageData | PlanStorageData;
  //   };
  //   let storageTenant: string;
  //   let appId: string;
  //   let assetId: string;
  //   let appTenant: string;
  //   let subtenantId: string | null = null;
  //   beforeEach(async () => {
  //     assetFilesStorageContent = {
  //       "main.app.config.json": {
  //         config: {
  //           fakeAppConfig: "testFakeAppConfig",
  //         },
  //         data: {
  //           fakeAppData: "testFakeAppData",
  //         },
  //       },
  //       "fakeUser1ID.user.config.json": {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser1ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser1ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser1ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser1DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser1DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser1DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.Admin,
  //             fakePlant2: PlantPermissions.Admin,
  //             fakePlant3: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser1Email",
  //       },
  //       "fakeUser2ID.user.config.json": {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser2ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser2ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser2ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser2DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser2DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser2DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalUser,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser2Email",
  //       },
  //       "fakeUser3ID.user.config.json": {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser3ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser3ConfigPlant2" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser3DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser3DataPlant2" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser3Email",
  //       },
  //       "fakeUser4ID.user.config.json": {
  //         config: {
  //           fakePlant2: { fakeUserConfig: "fakeUser4ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser4ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant2: { fakeUserData: "fakeUser4DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser4DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalUser,
  //           plants: {
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser4Email",
  //       },
  //       "fakePlant1.plant.config.json": {
  //         config: {
  //           plantConfig: "fakePlant1Config",
  //         },
  //         data: {
  //           plantData: "fakePlant1Data",
  //         },
  //       },
  //       "fakePlant2.plant.config.json": {
  //         config: {
  //           plantConfig: "fakePlant2Config",
  //         },
  //         data: {
  //           plantData: "fakePlant2Data",
  //         },
  //       },
  //       "fakePlant3.plant.config.json": {
  //         config: {
  //           plantConfig: "fakePlant3Config",
  //         },
  //         data: {
  //           plantData: "fakePlant3Data",
  //         },
  //       },
  //     };
  //     mockedGetAllFileNamesFunction = jest.fn(
  //       async (tenant: string, asset: string, extension: string) => {
  //         let dataToReturn = Object.keys(assetFilesStorageContent);
  //         return dataToReturn.filter((filePath) =>
  //           filePath.includes(extension)
  //         );
  //       }
  //     );
  //     mindSphereFileService.getAllFileNamesFromAsset = mockedGetAllFileNamesFunction;
  //     mockedGetFileFunction = jest.fn(
  //       async (tenant: string, asset: string, filePath: string) => {
  //         let dataToReturn = assetFilesStorageContent[filePath];
  //         if (dataToReturn == null) throw new Error("File not found");
  //         return dataToReturn;
  //       }
  //     );
  //     mindSphereFileService.getFileContent = mockedGetFileFunction;
  //     mockedCheckFileFunction = jest.fn(
  //       async (tenant: string, asset: string, filePath: string) => {
  //         return assetFilesStorageContent[filePath] != null;
  //       }
  //     );
  //     mindSphereFileService.checkIfFileExists = mockedCheckFileFunction;
  //     mockedGetAllUserGroupsResults.results = [
  //       [
  //         {
  //           description: "testGlobalAdminDescription",
  //           displayName: "testGlobalAdminGroup",
  //           members: [],
  //           id: "testGlobalAdminId",
  //         },
  //         {
  //           description: "testGlobalUserDescription",
  //           displayName: "testGlobalUserGroup",
  //           members: [],
  //           id: "testGlobalUserId",
  //         },
  //         {
  //           description: "testLocalAdminDescription",
  //           displayName: "testLocalAdminGroup",
  //           members: [],
  //           id: "testLocalAdminId",
  //         },
  //         {
  //           description: "testLocalUserDescription",
  //           displayName: "testLocalUserGroup",
  //           members: [],
  //           id: "testLocalUserId",
  //         },
  //         {
  //           description: "testStandardUserDescription",
  //           displayName: "testMsStandardUserGroup",
  //           members: [],
  //           id: "testStandardUserId",
  //         },
  //         {
  //           description: "testSubtenantUserDescription",
  //           displayName: "testMsSubtenantUserGroup",
  //           members: [],
  //           id: "testSubtenantUserId",
  //         },
  //       ],
  //     ];
  //     storageTenant = "testStorageTenant";
  //     appId = "testAppId";
  //     assetId = "testAssetId";
  //     appTenant = "testAppTenant";
  //     subtenantId = "testSubtenantId";
  //   });
  //   let exec = async () => {
  //     mindSphereApp = new MindSphereApp(
  //       storageTenant,
  //       appId,
  //       assetId,
  //       appTenant,
  //       subtenantId
  //     );
  //     return mindSphereApp.init();
  //   };
  //   it("should get and assign all user groups to the app", async () => {
  //     await exec();
  //     expect(mockedGetAllUserGroupsFunction).toHaveBeenCalledTimes(1);
  //     expect(mockedGetAllUserGroupsFunction.mock.calls[0]).toEqual([
  //       "testAppTenant",
  //     ]);
  //     expect(mindSphereApp.StandardUserGroup).toEqual({
  //       description: "testStandardUserDescription",
  //       displayName: "testMsStandardUserGroup",
  //       members: [],
  //       id: "testStandardUserId",
  //     });
  //     expect(mindSphereApp.SubtenantUserGroup).toEqual({
  //       description: "testSubtenantUserDescription",
  //       displayName: "testMsSubtenantUserGroup",
  //       members: [],
  //       id: "testSubtenantUserId",
  //     });
  //     expect(mindSphereApp.GlobalAdminGroup).toEqual({
  //       description: "testGlobalAdminDescription",
  //       displayName: "testGlobalAdminGroup",
  //       members: [],
  //       id: "testGlobalAdminId",
  //     });
  //     expect(mindSphereApp.GlobalUserGroup).toEqual({
  //       description: "testGlobalUserDescription",
  //       displayName: "testGlobalUserGroup",
  //       members: [],
  //       id: "testGlobalUserId",
  //     });
  //     expect(mindSphereApp.LocalAdminGroup).toEqual({
  //       description: "testLocalAdminDescription",
  //       displayName: "testLocalAdminGroup",
  //       members: [],
  //       id: "testLocalAdminId",
  //     });
  //     expect(mindSphereApp.LocalUserGroup).toEqual({
  //       description: "testLocalUserDescription",
  //       displayName: "testLocalUserGroup",
  //       members: [],
  //       id: "testLocalUserId",
  //     });
  //   });
  //   it("should call getFilesAll files and then getFile for every returned filename - for every storage and fetch all data in storages", async () => {
  //     await exec();
  //     //Checking calls for getting file names for every storage
  //     expect(mockedGetAllFileNamesFunction).toHaveBeenCalledTimes(3);
  //     expect(mockedGetAllFileNamesFunction.mock.calls).toContainEqual([
  //       "testStorageTenant",
  //       "testAssetId",
  //       "app.config.json",
  //     ]);
  //     expect(mockedGetAllFileNamesFunction.mock.calls).toContainEqual([
  //       "testStorageTenant",
  //       "testAssetId",
  //       "plant.config.json",
  //     ]);
  //     expect(mockedGetAllFileNamesFunction.mock.calls).toContainEqual([
  //       "testStorageTenant",
  //       "testAssetId",
  //       "user.config.json",
  //     ]);
  //     //Checking calls for getting files - called 1 x app, 4 x user, 3 x plant = 8 calls
  //     expect(mockedGetFileFunction).toHaveBeenCalledTimes(8);
  //     expect(mockedGetFileFunction.mock.calls).toContainEqual([
  //       "testStorageTenant",
  //       "testAssetId",
  //       "main.app.config.json",
  //     ]);
  //     expect(mockedGetFileFunction.mock.calls).toContainEqual([
  //       "testStorageTenant",
  //       "testAssetId",
  //       "fakeUser1ID.user.config.json",
  //     ]);
  //     expect(mockedGetFileFunction.mock.calls).toContainEqual([
  //       "testStorageTenant",
  //       "testAssetId",
  //       "fakeUser2ID.user.config.json",
  //     ]);
  //     expect(mockedGetFileFunction.mock.calls).toContainEqual([
  //       "testStorageTenant",
  //       "testAssetId",
  //       "fakeUser3ID.user.config.json",
  //     ]);
  //     expect(mockedGetFileFunction.mock.calls).toContainEqual([
  //       "testStorageTenant",
  //       "testAssetId",
  //       "fakeUser4ID.user.config.json",
  //     ]);
  //     expect(mockedGetFileFunction.mock.calls).toContainEqual([
  //       "testStorageTenant",
  //       "testAssetId",
  //       "fakePlant1.plant.config.json",
  //     ]);
  //     expect(mockedGetFileFunction.mock.calls).toContainEqual([
  //       "testStorageTenant",
  //       "testAssetId",
  //       "fakePlant2.plant.config.json",
  //     ]);
  //     expect(mockedGetFileFunction.mock.calls).toContainEqual([
  //       "testStorageTenant",
  //       "testAssetId",
  //       "fakePlant3.plant.config.json",
  //     ]);
  //     //Checking cache content of storages
  //     expect((mindSphereApp as any)._appStorage._cacheData).toEqual({
  //       main: {
  //         config: {
  //           fakeAppConfig: "testFakeAppConfig",
  //         },
  //         data: {
  //           fakeAppData: "testFakeAppData",
  //         },
  //       },
  //     });
  //     expect((mindSphereApp as any)._userStorage._cacheData).toEqual({
  //       fakeUser1ID: {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser1ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser1ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser1ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser1DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser1DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser1DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.Admin,
  //             fakePlant2: PlantPermissions.Admin,
  //             fakePlant3: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser1Email",
  //       },
  //       fakeUser2ID: {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser2ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser2ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser2ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser2DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser2DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser2DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalUser,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser2Email",
  //       },
  //       fakeUser3ID: {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser3ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser3ConfigPlant2" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser3DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser3DataPlant2" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser3Email",
  //       },
  //       fakeUser4ID: {
  //         config: {
  //           fakePlant2: { fakeUserConfig: "fakeUser4ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser4ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant2: { fakeUserData: "fakeUser4DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser4DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalUser,
  //           plants: {
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser4Email",
  //       },
  //     });
  //     expect((mindSphereApp as any)._plantStorage._cacheData).toEqual({
  //       fakePlant1: {
  //         config: {
  //           plantConfig: "fakePlant1Config",
  //         },
  //         data: {
  //           plantData: "fakePlant1Data",
  //         },
  //       },
  //       fakePlant2: {
  //         config: {
  //           plantConfig: "fakePlant2Config",
  //         },
  //         data: {
  //           plantData: "fakePlant2Data",
  //         },
  //       },
  //       fakePlant3: {
  //         config: {
  //           plantConfig: "fakePlant3Config",
  //         },
  //         data: {
  //           plantData: "fakePlant3Data",
  //         },
  //       },
  //     });
  //   });
  //   it("should set _initialized flag to true", async () => {
  //     await exec();
  //     testPrivateProperty(mindSphereApp, "_initialized", true);
  //   });
  //   it("should throw and not initialize app - if there is no user in returned user group", async () => {
  //     //Removing standard mindsphere user
  //     mockedGetAllUserGroupsResults.results[0] = mockedGetAllUserGroupsResults.results[0].filter(
  //       (group: any) => group.displayName !== "testGlobalAdminGroup"
  //     );
  //     await expect(exec()).rejects.toMatchObject({
  //       message: `User group testGlobalAdminGroup not found!`,
  //     });
  //     //Getting user should be called normally
  //     expect(mockedGetAllUserGroupsFunction).toHaveBeenCalledTimes(1);
  //     expect(mockedGetAllUserGroupsFunction.mock.calls[0]).toEqual([
  //       "testAppTenant",
  //     ]);
  //     //Storage fetch data should not have been called
  //     expect(mockedGetAllFileNamesFunction).not.toHaveBeenCalled();
  //     expect(mockedGetFileFunction).not.toHaveBeenCalled();
  //     //user groups should not have been set
  //     expect(mindSphereApp.StandardUserGroup).toEqual(null);
  //     expect(mindSphereApp.SubtenantUserGroup).toEqual(null);
  //     expect(mindSphereApp.GlobalAdminGroup).toEqual(null);
  //     expect(mindSphereApp.GlobalUserGroup).toEqual(null);
  //     expect(mindSphereApp.LocalAdminGroup).toEqual(null);
  //     expect(mindSphereApp.LocalUserGroup).toEqual(null);
  //     //Storage cache should not have been set
  //     expect((mindSphereApp as any)._appStorage._cacheData).toEqual({});
  //     expect((mindSphereApp as any)._userStorage._cacheData).toEqual({});
  //     expect((mindSphereApp as any)._plantStorage._cacheData).toEqual({});
  //     //Intialized flag should not have been set
  //     testPrivateProperty(mindSphereApp, "_initialized", false);
  //   });
  //   it("should throw and not initialize app - if there is no user in returned user group", async () => {
  //     //Removing standard mindsphere user
  //     mockedGetAllUserGroupsResults.results[0] = mockedGetAllUserGroupsResults.results[0].filter(
  //       (group: any) => group.displayName !== "testGlobalAdminGroup"
  //     );
  //     await expect(exec()).rejects.toMatchObject({
  //       message: `User group testGlobalAdminGroup not found!`,
  //     });
  //     //Getting user should be called normally
  //     expect(mockedGetAllUserGroupsFunction).toHaveBeenCalledTimes(1);
  //     expect(mockedGetAllUserGroupsFunction.mock.calls[0]).toEqual([
  //       "testAppTenant",
  //     ]);
  //     //Storage fetch data should not have been called
  //     expect(mockedGetAllFileNamesFunction).not.toHaveBeenCalled();
  //     expect(mockedGetFileFunction).not.toHaveBeenCalled();
  //     //Intialized flag should not have been set
  //     testPrivateProperty(mindSphereApp, "_initialized", false);
  //   });
  //   it("should throw and not initialize app - if calling get all user groups throws", async () => {
  //     mockedGetAllUserGroupsResults.errors = ["user group get all test error"];
  //     await expect(exec()).rejects.toMatchObject({
  //       message: "user group get all test error",
  //     });
  //     //Getting user should be called normally
  //     expect(mockedGetAllUserGroupsFunction).toHaveBeenCalledTimes(1);
  //     expect(mockedGetAllUserGroupsFunction.mock.calls[0]).toEqual([
  //       "testAppTenant",
  //     ]);
  //     //Storage fetch data should not have been called
  //     expect(mockedGetAllFileNamesFunction).not.toHaveBeenCalled();
  //     expect(mockedGetFileFunction).not.toHaveBeenCalled();
  //     //Intialized flag should not have been set
  //     testPrivateProperty(mindSphereApp, "_initialized", false);
  //   });
  //   it("should throw and not initialize app - if calling get all file names throws", async () => {
  //     mockedGetAllFileNamesFunction = jest.fn(() => {
  //       throw new Error("Get all file names error");
  //     });
  //     mindSphereFileService.getAllFileNamesFromAsset = mockedGetAllFileNamesFunction;
  //     await expect(exec()).rejects.toMatchObject({
  //       message: "Get all file names error",
  //     });
  //     //Getting user should be called normally
  //     expect(mockedGetAllUserGroupsFunction).toHaveBeenCalledTimes(1);
  //     expect(mockedGetAllUserGroupsFunction.mock.calls[0]).toEqual([
  //       "testAppTenant",
  //     ]);
  //     //Storage fetch data should have been called normally
  //     expect(mockedGetAllFileNamesFunction).toHaveBeenCalledTimes(3);
  //     //Fetch seperate files data should not have been called
  //     expect(mockedGetFileFunction).not.toHaveBeenCalled();
  //     //Intialized flag should not have been set
  //     testPrivateProperty(mindSphereApp, "_initialized", false);
  //   });
  //   it("should throw and not initialize app - if calling get file throws", async () => {
  //     mockedGetFileFunction = jest.fn(() => {
  //       throw new Error("Get file names error");
  //     });
  //     mindSphereFileService.getFileContent = mockedGetFileFunction;
  //     await expect(exec()).rejects.toMatchObject({
  //       message: "Get file names error",
  //     });
  //     //Getting user should be called normally
  //     expect(mockedGetAllUserGroupsFunction).toHaveBeenCalledTimes(1);
  //     expect(mockedGetAllUserGroupsFunction.mock.calls[0]).toEqual([
  //       "testAppTenant",
  //     ]);
  //     //Storage fetch data should have been called normally
  //     expect(mockedGetAllFileNamesFunction).toHaveBeenCalledTimes(3);
  //     //Storage fetch data should have been called normally
  //     expect(mockedGetFileFunction).toHaveBeenCalledTimes(8);
  //     //Intialized flag should not have been set
  //     testPrivateProperty(mindSphereApp, "_initialized", false);
  //   });
  //   it("should throw and not initialize app - if calling check file throws", async () => {
  //     mockedCheckFileFunction = jest.fn(() => {
  //       throw new Error("Get all file names error");
  //     });
  //     mindSphereFileService.checkIfFileExists = mockedCheckFileFunction;
  //     await expect(exec()).rejects.toMatchObject({
  //       message: "Get all file names error",
  //     });
  //     //Getting user should be called normally
  //     expect(mockedGetAllUserGroupsFunction).toHaveBeenCalledTimes(1);
  //     expect(mockedGetAllUserGroupsFunction.mock.calls[0]).toEqual([
  //       "testAppTenant",
  //     ]);
  //     //Storage fetch data should have been called normally
  //     expect(mockedGetAllFileNamesFunction).toHaveBeenCalledTimes(3);
  //     //Storage fetch data should not have been called
  //     expect(mockedGetFileFunction).not.toHaveBeenCalled();
  //     //Intialized flag should not have been set
  //     testPrivateProperty(mindSphereApp, "_initialized", false);
  //   });
  // });
  // //#endregion ===== CONTRUCTOR & INITIALIZATION =====
  // //#region ===== APP STORAGE DATA =====
  // describe("fetchAppData", () => {
  //   let mindSphereApp: MindSphereApp;
  //   let assetFilesStorageContent: {
  //     [filePath: string]: AppStorageData | UserStorageData | PlanStorageData;
  //   };
  //   let storageTenant: string;
  //   let appId: string;
  //   let assetId: string;
  //   let appTenant: string;
  //   let subtenantId: string | null;
  //   let initApp: boolean;
  //   let checkFileReturnsNull: boolean;
  //   let throwWhileGettingFileContent: boolean;
  //   let newAppData: AppStorageData | null;
  //   beforeEach(async () => {
  //     assetFilesStorageContent = {
  //       "main.app.config.json": {
  //         config: {
  //           fakeAppConfig: "testFakeAppConfig",
  //         },
  //         data: {
  //           fakeAppData: "testFakeAppData",
  //         },
  //       },
  //       "fakeUser1ID.user.config.json": {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser1ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser1ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser1ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser1DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser1DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser1DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.Admin,
  //             fakePlant2: PlantPermissions.Admin,
  //             fakePlant3: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser1Email",
  //       },
  //       "fakeUser2ID.user.config.json": {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser2ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser2ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser2ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser2DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser2DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser2DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalUser,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser2Email",
  //       },
  //       "fakeUser3ID.user.config.json": {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser3ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser3ConfigPlant2" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser3DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser3DataPlant2" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser3Email",
  //       },
  //       "fakeUser4ID.user.config.json": {
  //         config: {
  //           fakePlant2: { fakeUserConfig: "fakeUser4ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser4ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant2: { fakeUserData: "fakeUser4DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser4DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalUser,
  //           plants: {
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser4Email",
  //       },
  //       "fakePlant1.plant.config.json": {
  //         config: {
  //           plantConfig: "fakePlant1Config",
  //         },
  //         data: {
  //           plantData: "fakePlant1Data",
  //         },
  //       },
  //       "fakePlant2.plant.config.json": {
  //         config: {
  //           plantConfig: "fakePlant2Config",
  //         },
  //         data: {
  //           plantData: "fakePlant2Data",
  //         },
  //       },
  //       "fakePlant3.plant.config.json": {
  //         config: {
  //           plantConfig: "fakePlant3Config",
  //         },
  //         data: {
  //           plantData: "fakePlant3Data",
  //         },
  //       },
  //     };
  //     mockedGetAllFileNamesFunction = jest.fn(
  //       async (tenant: string, asset: string, extension: string) => {
  //         let dataToReturn = Object.keys(assetFilesStorageContent);
  //         return dataToReturn.filter((filePath) =>
  //           filePath.includes(extension)
  //         );
  //       }
  //     );
  //     mindSphereFileService.getAllFileNamesFromAsset = mockedGetAllFileNamesFunction;
  //     mockedGetFileFunction = jest.fn(
  //       async (tenant: string, asset: string, filePath: string) => {
  //         let dataToReturn = assetFilesStorageContent[filePath];
  //         if (dataToReturn == null) throw new Error("File not found");
  //         return dataToReturn;
  //       }
  //     );
  //     mindSphereFileService.getFileContent = mockedGetFileFunction;
  //     mockedCheckFileFunction = jest.fn(
  //       async (tenant: string, asset: string, filePath: string) => {
  //         return assetFilesStorageContent[filePath] != null;
  //       }
  //     );
  //     mindSphereFileService.checkIfFileExists = mockedCheckFileFunction;
  //     mockedGetAllUserGroupsResults.results = [
  //       [
  //         {
  //           description: "testGlobalAdminDescription",
  //           displayName: "testGlobalAdminGroup",
  //           members: [],
  //           id: "testGlobalAdminId",
  //         },
  //         {
  //           description: "testGlobalUserDescription",
  //           displayName: "testGlobalUserGroup",
  //           members: [],
  //           id: "testGlobalUserId",
  //         },
  //         {
  //           description: "testLocalAdminDescription",
  //           displayName: "testLocalAdminGroup",
  //           members: [],
  //           id: "testLocalAdminId",
  //         },
  //         {
  //           description: "testLocalUserDescription",
  //           displayName: "testLocalUserGroup",
  //           members: [],
  //           id: "testLocalUserId",
  //         },
  //         {
  //           description: "testStandardUserDescription",
  //           displayName: "testMsStandardUserGroup",
  //           members: [],
  //           id: "testStandardUserId",
  //         },
  //         {
  //           description: "testSubtenantUserDescription",
  //           displayName: "testMsSubtenantUserGroup",
  //           members: [],
  //           id: "testSubtenantUserId",
  //         },
  //       ],
  //     ];
  //     storageTenant = "testStorageTenant";
  //     appId = "testAppId";
  //     assetId = "testAssetId";
  //     appTenant = "testAppTenant";
  //     subtenantId = "testSubtenantId";
  //     initApp = true;
  //     throwWhileGettingFileContent = false;
  //     checkFileReturnsNull = false;
  //     newAppData = {
  //       config: { newAppConfig: "newAppConfigValue" },
  //       data: { newAppData: "newAppDataValue" },
  //     };
  //   });
  //   let exec = async () => {
  //     mindSphereApp = new MindSphereApp(
  //       storageTenant,
  //       appId,
  //       assetId,
  //       appTenant,
  //       subtenantId
  //     );
  //     if (initApp) await mindSphereApp.init();
  //     if (newAppData)
  //       assetFilesStorageContent["main.app.config.json"] = newAppData;
  //     if (throwWhileGettingFileContent)
  //       mindSphereFileService.getFileContent = jest.fn(async () => {
  //         throw new Error("Test get file content error");
  //       });
  //     if (checkFileReturnsNull)
  //       mindSphereFileService.checkIfFileExists = jest.fn(async () => {
  //         return null;
  //       });
  //     return mindSphereApp.fetchAppData();
  //   };
  //   it("should fetch new data from main app file to app storage", async () => {
  //     await exec();
  //     //8 times during initialization, 9th time during fetching
  //     expect(mockedGetFileFunction).toHaveBeenCalledTimes(9);
  //     expect(mockedGetFileFunction.mock.calls[8]).toEqual([
  //       "testStorageTenant",
  //       "testAssetId",
  //       "main.app.config.json",
  //     ]);
  //     //Cache data of storage should be fetched
  //     expect((mindSphereApp as any)._appStorage._cacheData["main"]).toEqual(
  //       newAppData
  //     );
  //   });
  //   it("should throw and not fetch new data from main app file to app storage and clear storage from main app content - if get file method throws", async () => {
  //     throwWhileGettingFileContent = true;
  //     await expect(exec()).rejects.toMatchObject({
  //       message: "Test get file content error",
  //     });
  //     //Cache data of storage should not have been refetched
  //     expect(
  //       (mindSphereApp as any)._appStorage._cacheData["main"]
  //     ).not.toBeDefined();
  //     //Main config should be accessible to fetch when trying to get and fetch data later
  //     mindSphereFileService.getFileContent = mockedGetFileFunction;
  //     let data = await mindSphereApp.getAppData();
  //     expect(data).toEqual(newAppData);
  //     //Data should have been fetched
  //     expect((mindSphereApp as any)._appStorage._cacheData["main"]).toEqual(
  //       newAppData
  //     );
  //   });
  //   it("should not throw but not fetch new data from main app file to app storage and clear storage from main app content - if check file returns null - no main file available", async () => {
  //     checkFileReturnsNull = true;
  //     await exec();
  //     //Cache data of storage should not have been refetched
  //     expect(
  //       (mindSphereApp as any)._appStorage._cacheData["main"]
  //     ).not.toBeDefined();
  //     //Main config should be accessible to fetch when trying to get and fetch data later
  //     mindSphereFileService.checkIfFileExists = mockedCheckFileFunction;
  //     let data = await mindSphereApp.getAppData();
  //     expect(data).toEqual(newAppData);
  //     //Data should have been fetched
  //     expect((mindSphereApp as any)._appStorage._cacheData["main"]).toEqual(
  //       newAppData
  //     );
  //   });
  //   it("should throw and not fetch new data if app is not initialized", async () => {
  //     initApp = false;
  //     await expect(exec()).rejects.toMatchObject({
  //       message: `Application not initialized!`,
  //     });
  //     expect(mockedGetFileFunction).not.toHaveBeenCalled();
  //     //Cache data of storage should be fetched
  //     expect((mindSphereApp as any)._appStorage._cacheData).toEqual({});
  //   });
  // });
  // describe("getAppData", () => {
  //   let mindSphereApp: MindSphereApp;
  //   let assetFilesStorageContent: {
  //     [filePath: string]: AppStorageData | UserStorageData | PlanStorageData;
  //   };
  //   let storageTenant: string;
  //   let appId: string;
  //   let assetId: string;
  //   let appTenant: string;
  //   let subtenantId: string | null;
  //   let initApp: boolean;
  //   let newAppData: AppStorageData | null;
  //   let mainAppDataExistsInCache: boolean;
  //   beforeEach(async () => {
  //     assetFilesStorageContent = {
  //       "main.app.config.json": {
  //         config: {
  //           fakeAppConfig: "testFakeAppConfig",
  //         },
  //         data: {
  //           fakeAppData: "testFakeAppData",
  //         },
  //       },
  //       "fakeUser1ID.user.config.json": {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser1ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser1ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser1ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser1DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser1DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser1DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.Admin,
  //             fakePlant2: PlantPermissions.Admin,
  //             fakePlant3: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser1Email",
  //       },
  //       "fakeUser2ID.user.config.json": {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser2ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser2ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser2ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser2DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser2DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser2DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalUser,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser2Email",
  //       },
  //       "fakeUser3ID.user.config.json": {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser3ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser3ConfigPlant2" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser3DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser3DataPlant2" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser3Email",
  //       },
  //       "fakeUser4ID.user.config.json": {
  //         config: {
  //           fakePlant2: { fakeUserConfig: "fakeUser4ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser4ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant2: { fakeUserData: "fakeUser4DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser4DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalUser,
  //           plants: {
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser4Email",
  //       },
  //       "fakePlant1.plant.config.json": {
  //         config: {
  //           plantConfig: "fakePlant1Config",
  //         },
  //         data: {
  //           plantData: "fakePlant1Data",
  //         },
  //       },
  //       "fakePlant2.plant.config.json": {
  //         config: {
  //           plantConfig: "fakePlant2Config",
  //         },
  //         data: {
  //           plantData: "fakePlant2Data",
  //         },
  //       },
  //       "fakePlant3.plant.config.json": {
  //         config: {
  //           plantConfig: "fakePlant3Config",
  //         },
  //         data: {
  //           plantData: "fakePlant3Data",
  //         },
  //       },
  //     };
  //     mockedGetAllFileNamesFunction = jest.fn(
  //       async (tenant: string, asset: string, extension: string) => {
  //         let dataToReturn = Object.keys(assetFilesStorageContent);
  //         return dataToReturn.filter((filePath) =>
  //           filePath.includes(extension)
  //         );
  //       }
  //     );
  //     mindSphereFileService.getAllFileNamesFromAsset = mockedGetAllFileNamesFunction;
  //     mockedGetFileFunction = jest.fn(
  //       async (tenant: string, asset: string, filePath: string) => {
  //         let dataToReturn = assetFilesStorageContent[filePath];
  //         if (dataToReturn == null) throw new Error("File not found");
  //         return dataToReturn;
  //       }
  //     );
  //     mindSphereFileService.getFileContent = mockedGetFileFunction;
  //     mockedCheckFileFunction = jest.fn(
  //       async (tenant: string, asset: string, filePath: string) => {
  //         return assetFilesStorageContent[filePath] != null;
  //       }
  //     );
  //     mindSphereFileService.checkIfFileExists = mockedCheckFileFunction;
  //     mockedGetAllUserGroupsResults.results = [
  //       [
  //         {
  //           description: "testGlobalAdminDescription",
  //           displayName: "testGlobalAdminGroup",
  //           members: [],
  //           id: "testGlobalAdminId",
  //         },
  //         {
  //           description: "testGlobalUserDescription",
  //           displayName: "testGlobalUserGroup",
  //           members: [],
  //           id: "testGlobalUserId",
  //         },
  //         {
  //           description: "testLocalAdminDescription",
  //           displayName: "testLocalAdminGroup",
  //           members: [],
  //           id: "testLocalAdminId",
  //         },
  //         {
  //           description: "testLocalUserDescription",
  //           displayName: "testLocalUserGroup",
  //           members: [],
  //           id: "testLocalUserId",
  //         },
  //         {
  //           description: "testStandardUserDescription",
  //           displayName: "testMsStandardUserGroup",
  //           members: [],
  //           id: "testStandardUserId",
  //         },
  //         {
  //           description: "testSubtenantUserDescription",
  //           displayName: "testMsSubtenantUserGroup",
  //           members: [],
  //           id: "testSubtenantUserId",
  //         },
  //       ],
  //     ];
  //     storageTenant = "testStorageTenant";
  //     appId = "testAppId";
  //     assetId = "testAssetId";
  //     appTenant = "testAppTenant";
  //     subtenantId = "testSubtenantId";
  //     initApp = true;
  //     mainAppDataExistsInCache = true;
  //     newAppData = {
  //       config: { newAppConfig: "newAppConfigValue" },
  //       data: { newAppData: "newAppDataValue" },
  //     };
  //   });
  //   let exec = async () => {
  //     mindSphereApp = new MindSphereApp(
  //       storageTenant,
  //       appId,
  //       assetId,
  //       appTenant,
  //       subtenantId
  //     );
  //     if (initApp) await mindSphereApp.init();
  //     if (newAppData)
  //       assetFilesStorageContent["main.app.config.json"] = newAppData;
  //     if (!mainAppDataExistsInCache)
  //       delete (mindSphereApp as any)._appStorage._cacheData["main"];
  //     return mindSphereApp.getAppData();
  //   };
  //   it("should not fetch new data from main app file but return app data from cache", async () => {
  //     let result = await exec();
  //     expect(result).toEqual({
  //       config: {
  //         fakeAppConfig: "testFakeAppConfig",
  //       },
  //       data: {
  //         fakeAppData: "testFakeAppData",
  //       },
  //     });
  //     //8 times during initialization, 9th time during fetching was not called
  //     expect(mockedGetFileFunction).toHaveBeenCalledTimes(8);
  //     expect(mockedCheckFileFunction).toHaveBeenCalledTimes(8);
  //     //Cache data should not be changed
  //     expect((mindSphereApp as any)._appStorage._cacheData["main"]).toEqual({
  //       config: {
  //         fakeAppConfig: "testFakeAppConfig",
  //       },
  //       data: {
  //         fakeAppData: "testFakeAppData",
  //       },
  //     });
  //   });
  //   it("should fetch new data from main app file and return app data from cache - if main app key does not exist in app data cache", async () => {
  //     mainAppDataExistsInCache = false;
  //     let result = await exec();
  //     expect(result).toEqual(newAppData);
  //     //8 times during initialization, 9th time during fetching
  //     expect(mockedGetFileFunction).toHaveBeenCalledTimes(9);
  //     expect(mockedCheckFileFunction).toHaveBeenCalledTimes(9);
  //     //Cache data should not be changed
  //     expect((mindSphereApp as any)._appStorage._cacheData["main"]).toEqual(
  //       newAppData
  //     );
  //   });
  //   it("should throw and not fetch new data if app is not initialized", async () => {
  //     initApp = false;
  //     await expect(exec()).rejects.toMatchObject({
  //       message: `Application not initialized!`,
  //     });
  //     //Cache data of storage should be fetched
  //     expect((mindSphereApp as any)._appStorage._cacheData).toEqual({});
  //   });
  // });
  // describe("setAppData", () => {
  //   let mindSphereApp: MindSphereApp;
  //   let assetFilesStorageContent: {
  //     [filePath: string]: AppStorageData | UserStorageData | PlanStorageData;
  //   };
  //   let storageTenant: string;
  //   let appId: string;
  //   let assetId: string;
  //   let appTenant: string;
  //   let subtenantId: string | null;
  //   let initApp: boolean;
  //   let newAppData: AppStorageData;
  //   beforeEach(async () => {
  //     assetFilesStorageContent = {
  //       "main.app.config.json": {
  //         config: {
  //           fakeAppConfig: "testFakeAppConfig",
  //         },
  //         data: {
  //           fakeAppData: "testFakeAppData",
  //         },
  //       },
  //       "fakeUser1ID.user.config.json": {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser1ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser1ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser1ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser1DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser1DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser1DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.Admin,
  //             fakePlant2: PlantPermissions.Admin,
  //             fakePlant3: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser1Email",
  //       },
  //       "fakeUser2ID.user.config.json": {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser2ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser2ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser2ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser2DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser2DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser2DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalUser,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser2Email",
  //       },
  //       "fakeUser3ID.user.config.json": {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser3ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser3ConfigPlant2" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser3DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser3DataPlant2" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser3Email",
  //       },
  //       "fakeUser4ID.user.config.json": {
  //         config: {
  //           fakePlant2: { fakeUserConfig: "fakeUser4ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser4ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant2: { fakeUserData: "fakeUser4DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser4DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalUser,
  //           plants: {
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser4Email",
  //       },
  //       "fakePlant1.plant.config.json": {
  //         config: {
  //           plantConfig: "fakePlant1Config",
  //         },
  //         data: {
  //           plantData: "fakePlant1Data",
  //         },
  //       },
  //       "fakePlant2.plant.config.json": {
  //         config: {
  //           plantConfig: "fakePlant2Config",
  //         },
  //         data: {
  //           plantData: "fakePlant2Data",
  //         },
  //       },
  //       "fakePlant3.plant.config.json": {
  //         config: {
  //           plantConfig: "fakePlant3Config",
  //         },
  //         data: {
  //           plantData: "fakePlant3Data",
  //         },
  //       },
  //     };
  //     mockedGetAllFileNamesFunction = jest.fn(
  //       async (tenant: string, asset: string, extension: string) => {
  //         let dataToReturn = Object.keys(assetFilesStorageContent);
  //         return dataToReturn.filter((filePath) =>
  //           filePath.includes(extension)
  //         );
  //       }
  //     );
  //     mindSphereFileService.getAllFileNamesFromAsset = mockedGetAllFileNamesFunction;
  //     mockedGetFileFunction = jest.fn(
  //       async (tenant: string, asset: string, filePath: string) => {
  //         let dataToReturn = assetFilesStorageContent[filePath];
  //         if (dataToReturn == null) throw new Error("File not found");
  //         return dataToReturn;
  //       }
  //     );
  //     mindSphereFileService.getFileContent = mockedGetFileFunction;
  //     mockedSetFileFunction = jest.fn(
  //       async (
  //         tenant: string,
  //         asset: string,
  //         filePath: string,
  //         fileContent: any
  //       ) => {
  //         assetFilesStorageContent[filePath] = fileContent;
  //       }
  //     );
  //     mindSphereFileService.setFileContent = mockedSetFileFunction;
  //     mockedCheckFileFunction = jest.fn(
  //       async (tenant: string, asset: string, filePath: string) => {
  //         return assetFilesStorageContent[filePath] != null;
  //       }
  //     );
  //     mindSphereFileService.checkIfFileExists = mockedCheckFileFunction;
  //     mockedGetAllUserGroupsResults.results = [
  //       [
  //         {
  //           description: "testGlobalAdminDescription",
  //           displayName: "testGlobalAdminGroup",
  //           members: [],
  //           id: "testGlobalAdminId",
  //         },
  //         {
  //           description: "testGlobalUserDescription",
  //           displayName: "testGlobalUserGroup",
  //           members: [],
  //           id: "testGlobalUserId",
  //         },
  //         {
  //           description: "testLocalAdminDescription",
  //           displayName: "testLocalAdminGroup",
  //           members: [],
  //           id: "testLocalAdminId",
  //         },
  //         {
  //           description: "testLocalUserDescription",
  //           displayName: "testLocalUserGroup",
  //           members: [],
  //           id: "testLocalUserId",
  //         },
  //         {
  //           description: "testStandardUserDescription",
  //           displayName: "testMsStandardUserGroup",
  //           members: [],
  //           id: "testStandardUserId",
  //         },
  //         {
  //           description: "testSubtenantUserDescription",
  //           displayName: "testMsSubtenantUserGroup",
  //           members: [],
  //           id: "testSubtenantUserId",
  //         },
  //       ],
  //     ];
  //     storageTenant = "testStorageTenant";
  //     appId = "testAppId";
  //     assetId = "testAssetId";
  //     appTenant = "testAppTenant";
  //     subtenantId = "testSubtenantId";
  //     initApp = true;
  //     newAppData = {
  //       config: { newAppConfig: "newAppConfigValue" },
  //       data: { newAppData: "newAppDataValue" },
  //     };
  //   });
  //   let exec = async () => {
  //     mindSphereApp = new MindSphereApp(
  //       storageTenant,
  //       appId,
  //       assetId,
  //       appTenant,
  //       subtenantId
  //     );
  //     if (initApp) await mindSphereApp.init();
  //     return mindSphereApp.setAppData(newAppData);
  //   };
  //   it("should set data in both FileService and in cache", async () => {
  //     await exec();
  //     //Set file should be called in order to set new app data
  //     expect(mockedSetFileFunction).toHaveBeenCalledTimes(1);
  //     expect(mockedSetFileFunction.mock.calls[0]).toEqual([
  //       "testStorageTenant",
  //       "testAssetId",
  //       "main.app.config.json",
  //       newAppData,
  //     ]);
  //     //Cache data should be changed to new version
  //     expect((mindSphereApp as any)._appStorage._cacheData["main"]).toEqual(
  //       newAppData
  //     );
  //     //New data should be accessible via getAppData
  //     let appData = await mindSphereApp.getAppData();
  //     expect(appData).toEqual(newAppData);
  //   });
  //   it("should not set new data in cache and throw - if set file throws", async () => {
  //     mockedSetFileFunction = jest.fn(async () => {
  //       throw new Error("test set file error");
  //     });
  //     mindSphereFileService.setFileContent = mockedSetFileFunction;
  //     await expect(exec()).rejects.toMatchObject({
  //       message: "test set file error",
  //     });
  //     let oldAppData = {
  //       config: {
  //         fakeAppConfig: "testFakeAppConfig",
  //       },
  //       data: {
  //         fakeAppData: "testFakeAppData",
  //       },
  //     };
  //     //Cache data should not have been changed
  //     expect((mindSphereApp as any)._appStorage._cacheData["main"]).toEqual(
  //       oldAppData
  //     );
  //     //Old data should be accessible via getAppData
  //     let appData = await mindSphereApp.getAppData();
  //     expect(appData).toEqual(oldAppData);
  //   });
  //   it("should throw and not set new data if app is not initialized", async () => {
  //     initApp = false;
  //     await expect(exec()).rejects.toMatchObject({
  //       message: `Application not initialized!`,
  //     });
  //     //SetFile should not have been called
  //     expect(mockedSetFileFunction).not.toHaveBeenCalled();
  //     //Cache data should not have been changed - app not initialized so it is empty
  //     expect((mindSphereApp as any)._appStorage._cacheData).toEqual({});
  //   });
  // });
  // describe("removeAppData", () => {
  //   let mindSphereApp: MindSphereApp;
  //   let assetFilesStorageContent: {
  //     [filePath: string]: AppStorageData | UserStorageData | PlanStorageData;
  //   };
  //   let storageTenant: string;
  //   let appId: string;
  //   let assetId: string;
  //   let appTenant: string;
  //   let subtenantId: string | null;
  //   let initApp: boolean;
  //   beforeEach(async () => {
  //     assetFilesStorageContent = {
  //       "main.app.config.json": {
  //         config: {
  //           fakeAppConfig: "testFakeAppConfig",
  //         },
  //         data: {
  //           fakeAppData: "testFakeAppData",
  //         },
  //       },
  //       "fakeUser1ID.user.config.json": {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser1ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser1ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser1ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser1DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser1DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser1DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.Admin,
  //             fakePlant2: PlantPermissions.Admin,
  //             fakePlant3: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser1Email",
  //       },
  //       "fakeUser2ID.user.config.json": {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser2ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser2ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser2ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser2DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser2DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser2DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalUser,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser2Email",
  //       },
  //       "fakeUser3ID.user.config.json": {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser3ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser3ConfigPlant2" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser3DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser3DataPlant2" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser3Email",
  //       },
  //       "fakeUser4ID.user.config.json": {
  //         config: {
  //           fakePlant2: { fakeUserConfig: "fakeUser4ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser4ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant2: { fakeUserData: "fakeUser4DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser4DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalUser,
  //           plants: {
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser4Email",
  //       },
  //       "fakePlant1.plant.config.json": {
  //         config: {
  //           plantConfig: "fakePlant1Config",
  //         },
  //         data: {
  //           plantData: "fakePlant1Data",
  //         },
  //       },
  //       "fakePlant2.plant.config.json": {
  //         config: {
  //           plantConfig: "fakePlant2Config",
  //         },
  //         data: {
  //           plantData: "fakePlant2Data",
  //         },
  //       },
  //       "fakePlant3.plant.config.json": {
  //         config: {
  //           plantConfig: "fakePlant3Config",
  //         },
  //         data: {
  //           plantData: "fakePlant3Data",
  //         },
  //       },
  //     };
  //     mockedGetAllFileNamesFunction = jest.fn(
  //       async (tenant: string, asset: string, extension: string) => {
  //         let dataToReturn = Object.keys(assetFilesStorageContent);
  //         return dataToReturn.filter((filePath) =>
  //           filePath.includes(extension)
  //         );
  //       }
  //     );
  //     mindSphereFileService.getAllFileNamesFromAsset = mockedGetAllFileNamesFunction;
  //     mockedGetFileFunction = jest.fn(
  //       async (tenant: string, asset: string, filePath: string) => {
  //         let dataToReturn = assetFilesStorageContent[filePath];
  //         if (dataToReturn == null) throw new Error("File not found");
  //         return dataToReturn;
  //       }
  //     );
  //     mindSphereFileService.getFileContent = mockedGetFileFunction;
  //     mockedSetFileFunction = jest.fn(
  //       async (
  //         tenant: string,
  //         asset: string,
  //         filePath: string,
  //         fileContent: any
  //       ) => {
  //         assetFilesStorageContent[filePath] = fileContent;
  //       }
  //     );
  //     mindSphereFileService.setFileContent = mockedSetFileFunction;
  //     mockedCheckFileFunction = jest.fn(
  //       async (tenant: string, asset: string, filePath: string) => {
  //         return assetFilesStorageContent[filePath] != null;
  //       }
  //     );
  //     mindSphereFileService.checkIfFileExists = mockedCheckFileFunction;
  //     mockedDeleteFileFunction = jest.fn(
  //       async (
  //         tenant: string,
  //         asset: string,
  //         filePath: string,
  //         fileContent: any
  //       ) => {
  //         if (assetFilesStorageContent[filePath] == null)
  //           throw new Error("File not found!");
  //         delete assetFilesStorageContent[filePath];
  //       }
  //     );
  //     mindSphereFileService.deleteFile = mockedDeleteFileFunction;
  //     mockedGetAllUserGroupsResults.results = [
  //       [
  //         {
  //           description: "testGlobalAdminDescription",
  //           displayName: "testGlobalAdminGroup",
  //           members: [],
  //           id: "testGlobalAdminId",
  //         },
  //         {
  //           description: "testGlobalUserDescription",
  //           displayName: "testGlobalUserGroup",
  //           members: [],
  //           id: "testGlobalUserId",
  //         },
  //         {
  //           description: "testLocalAdminDescription",
  //           displayName: "testLocalAdminGroup",
  //           members: [],
  //           id: "testLocalAdminId",
  //         },
  //         {
  //           description: "testLocalUserDescription",
  //           displayName: "testLocalUserGroup",
  //           members: [],
  //           id: "testLocalUserId",
  //         },
  //         {
  //           description: "testStandardUserDescription",
  //           displayName: "testMsStandardUserGroup",
  //           members: [],
  //           id: "testStandardUserId",
  //         },
  //         {
  //           description: "testSubtenantUserDescription",
  //           displayName: "testMsSubtenantUserGroup",
  //           members: [],
  //           id: "testSubtenantUserId",
  //         },
  //       ],
  //     ];
  //     storageTenant = "testStorageTenant";
  //     appId = "testAppId";
  //     assetId = "testAssetId";
  //     appTenant = "testAppTenant";
  //     subtenantId = "testSubtenantId";
  //     initApp = true;
  //   });
  //   let exec = async () => {
  //     mindSphereApp = new MindSphereApp(
  //       storageTenant,
  //       appId,
  //       assetId,
  //       appTenant,
  //       subtenantId
  //     );
  //     if (initApp) await mindSphereApp.init();
  //     return mindSphereApp.removeAppData();
  //   };
  //   it("should delete app data from cache and from storage", async () => {
  //     await exec();
  //     //Set file should be called in order to set new app data
  //     expect(mockedDeleteFileFunction).toHaveBeenCalledTimes(1);
  //     expect(mockedDeleteFileFunction.mock.calls[0]).toEqual([
  //       "testStorageTenant",
  //       "testAssetId",
  //       "main.app.config.json",
  //     ]);
  //     //Cache data should be deleted
  //     expect(
  //       (mindSphereApp as any)._appStorage._cacheData["main"]
  //     ).not.toBeDefined();
  //   });
  //   it("should throw and not delete app data from cache - if delete file throws", async () => {
  //     mindSphereFileService.deleteFile = jest.fn(async () => {
  //       throw new Error("Test delete error");
  //     });
  //     await expect(exec()).rejects.toMatchObject({
  //       message: `Test delete error`,
  //     });
  //     let oldAppData = {
  //       config: {
  //         fakeAppConfig: "testFakeAppConfig",
  //       },
  //       data: {
  //         fakeAppData: "testFakeAppData",
  //       },
  //     };
  //     //Cache data should not have be deleted
  //     expect((mindSphereApp as any)._appStorage._cacheData["main"]).toEqual(
  //       oldAppData
  //     );
  //     //Data should be accessible via get
  //     let appData = await mindSphereApp.getAppData();
  //     expect(appData).toEqual(oldAppData);
  //   });
  //   it("should throw and not delete app data if app is not initialized", async () => {
  //     initApp = false;
  //     await expect(exec()).rejects.toMatchObject({
  //       message: `Application not initialized!`,
  //     });
  //     //SetFile should not have been called
  //     expect(mockedDeleteFileFunction).not.toHaveBeenCalled();
  //     //Cache data should not have been changed - app not initialized so it is empty
  //     expect((mindSphereApp as any)._appStorage._cacheData).toEqual({});
  //   });
  // });
  // //#endregion ===== APP STORAGE DATA =====
  // //#region ===== USER STORAGE DATA =====
  // describe("fetchUserData", () => {
  //   let mindSphereApp: MindSphereApp;
  //   let assetFilesStorageContent: {
  //     [filePath: string]: AppStorageData | UserStorageData | PlanStorageData;
  //   };
  //   let storageTenant: string;
  //   let appId: string;
  //   let assetId: string;
  //   let appTenant: string;
  //   let subtenantId: string | null;
  //   let initApp: boolean;
  //   let checkFileReturnsNull: boolean;
  //   let throwWhileGettingFileContent: boolean;
  //   let newUserData: {
  //     [userId: string]: UserStorageData;
  //   };
  //   beforeEach(async () => {
  //     assetFilesStorageContent = {
  //       "main.app.config.json": {
  //         config: {
  //           fakeAppConfig: "testFakeAppConfig",
  //         },
  //         data: {
  //           fakeAppData: "testFakeAppData",
  //         },
  //       },
  //       "fakeUser1ID.user.config.json": {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser1ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser1ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser1ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser1DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser1DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser1DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.Admin,
  //             fakePlant2: PlantPermissions.Admin,
  //             fakePlant3: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser1Email",
  //       },
  //       "fakeUser2ID.user.config.json": {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser2ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser2ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser2ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser2DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser2DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser2DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalUser,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser2Email",
  //       },
  //       "fakeUser3ID.user.config.json": {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser3ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser3ConfigPlant2" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser3DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser3DataPlant2" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser3Email",
  //       },
  //       "fakeUser4ID.user.config.json": {
  //         config: {
  //           fakePlant2: { fakeUserConfig: "fakeUser4ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser4ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant2: { fakeUserData: "fakeUser4DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser4DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalUser,
  //           plants: {
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser4Email",
  //       },
  //       "fakePlant1.plant.config.json": {
  //         config: {
  //           plantConfig: "fakePlant1Config",
  //         },
  //         data: {
  //           plantData: "fakePlant1Data",
  //         },
  //       },
  //       "fakePlant2.plant.config.json": {
  //         config: {
  //           plantConfig: "fakePlant2Config",
  //         },
  //         data: {
  //           plantData: "fakePlant2Data",
  //         },
  //       },
  //       "fakePlant3.plant.config.json": {
  //         config: {
  //           plantConfig: "fakePlant3Config",
  //         },
  //         data: {
  //           plantData: "fakePlant3Data",
  //         },
  //       },
  //     };
  //     mockedGetAllFileNamesFunction = jest.fn(
  //       async (tenant: string, asset: string, extension: string) => {
  //         let dataToReturn = Object.keys(assetFilesStorageContent);
  //         return dataToReturn.filter((filePath) =>
  //           filePath.includes(extension)
  //         );
  //       }
  //     );
  //     mindSphereFileService.getAllFileNamesFromAsset = mockedGetAllFileNamesFunction;
  //     mockedGetFileFunction = jest.fn(
  //       async (tenant: string, asset: string, filePath: string) => {
  //         let dataToReturn = assetFilesStorageContent[filePath];
  //         if (dataToReturn == null) throw new Error("File not found");
  //         return dataToReturn;
  //       }
  //     );
  //     mindSphereFileService.getFileContent = mockedGetFileFunction;
  //     mockedCheckFileFunction = jest.fn(
  //       async (tenant: string, asset: string, filePath: string) => {
  //         return assetFilesStorageContent[filePath] != null;
  //       }
  //     );
  //     mindSphereFileService.checkIfFileExists = mockedCheckFileFunction;
  //     mockedGetAllUserGroupsResults.results = [
  //       [
  //         {
  //           description: "testGlobalAdminDescription",
  //           displayName: "testGlobalAdminGroup",
  //           members: [],
  //           id: "testGlobalAdminId",
  //         },
  //         {
  //           description: "testGlobalUserDescription",
  //           displayName: "testGlobalUserGroup",
  //           members: [],
  //           id: "testGlobalUserId",
  //         },
  //         {
  //           description: "testLocalAdminDescription",
  //           displayName: "testLocalAdminGroup",
  //           members: [],
  //           id: "testLocalAdminId",
  //         },
  //         {
  //           description: "testLocalUserDescription",
  //           displayName: "testLocalUserGroup",
  //           members: [],
  //           id: "testLocalUserId",
  //         },
  //         {
  //           description: "testStandardUserDescription",
  //           displayName: "testMsStandardUserGroup",
  //           members: [],
  //           id: "testStandardUserId",
  //         },
  //         {
  //           description: "testSubtenantUserDescription",
  //           displayName: "testMsSubtenantUserGroup",
  //           members: [],
  //           id: "testSubtenantUserId",
  //         },
  //       ],
  //     ];
  //     storageTenant = "testStorageTenant";
  //     appId = "testAppId";
  //     assetId = "testAssetId";
  //     appTenant = "testAppTenant";
  //     subtenantId = "testSubtenantId";
  //     initApp = true;
  //     throwWhileGettingFileContent = false;
  //     checkFileReturnsNull = false;
  //     newUserData = {
  //       "fakeUser3ID.user.config.json": {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "editedFakeUser3ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "editedFakeUser3ConfigPlant2" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "editedFakeUser3DataPlant1" },
  //           fakePlant2: { fakeUserData: "editedFakeUser3DataPlant2" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "editedFakeUser3Email",
  //       },
  //       "fakeUser4ID.user.config.json": {
  //         config: {
  //           fakePlant2: { fakeUserConfig: "fakeUser4ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser4ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant2: { fakeUserData: "fakeUser4DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser4DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalUser,
  //           plants: {
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser4Email",
  //       },
  //       "fakeUser5ID.user.config.json": {
  //         config: {
  //           fakePlant2: { fakeUserConfig: "fakeUser5ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser5ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant2: { fakeUserData: "fakeUser5DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser5DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalUser,
  //           plants: {
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser5Email",
  //       },
  //       "fakeUser6ID.user.config.json": {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "editedFakeUser6ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "editedFakeUser6ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "editedFakeUser6ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "editedFakeUser6DataPlant1" },
  //           fakePlant2: { fakeUserData: "editedFakeUser6DataPlant2" },
  //           fakePlant3: { fakeUserData: "editedFakeUser6DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalUser,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "editedFakeUser6Email",
  //       },
  //     };
  //   });
  //   let exec = async () => {
  //     mindSphereApp = new MindSphereApp(
  //       storageTenant,
  //       appId,
  //       assetId,
  //       appTenant,
  //       subtenantId
  //     );
  //     if (initApp) await mindSphereApp.init();
  //     //Changing users storage content
  //     delete assetFilesStorageContent["fakeUser1ID.user.config.json"];
  //     delete assetFilesStorageContent["fakeUser2ID.user.config.json"];
  //     delete assetFilesStorageContent["fakeUser3ID.user.config.json"];
  //     delete assetFilesStorageContent["fakeUser4ID.user.config.json"];
  //     assetFilesStorageContent = {
  //       ...assetFilesStorageContent,
  //       ...newUserData,
  //     };
  //     if (throwWhileGettingFileContent)
  //       mindSphereFileService.getFileContent = jest.fn(async () => {
  //         throw new Error("Test get file content error");
  //       });
  //     if (checkFileReturnsNull)
  //       mindSphereFileService.checkIfFileExists = jest.fn(async () => {
  //         return null;
  //       });
  //     return mindSphereApp.fetchUserData();
  //   };
  //   it("should fetch new data from users files to app storage", async () => {
  //     await exec();
  //     //3 time during initialization, 1 times during new fetching
  //     expect(mockedGetAllFileNamesFunction).toHaveBeenCalledTimes(4);
  //     expect(mockedGetAllFileNamesFunction.mock.calls[3]).toEqual([
  //       "testStorageTenant",
  //       "testAssetId",
  //       "user.config.json",
  //     ]);
  //     //8 times during initialization, 4 times during new fetching (fetching only new users and )
  //     expect(mockedGetFileFunction).toHaveBeenCalledTimes(12);
  //     let laterMockCalls = [
  //       mockedGetFileFunction.mock.calls[8],
  //       mockedGetFileFunction.mock.calls[9],
  //       mockedGetFileFunction.mock.calls[10],
  //       mockedGetFileFunction.mock.calls[11],
  //     ];
  //     expect(laterMockCalls).toContainEqual([
  //       "testStorageTenant",
  //       "testAssetId",
  //       "fakeUser3ID.user.config.json",
  //     ]);
  //     expect(laterMockCalls).toContainEqual([
  //       "testStorageTenant",
  //       "testAssetId",
  //       "fakeUser4ID.user.config.json",
  //     ]);
  //     expect(laterMockCalls).toContainEqual([
  //       "testStorageTenant",
  //       "testAssetId",
  //       "fakeUser5ID.user.config.json",
  //     ]);
  //     expect(laterMockCalls).toContainEqual([
  //       "testStorageTenant",
  //       "testAssetId",
  //       "fakeUser6ID.user.config.json",
  //     ]);
  //     //Cache data of storage should be fetched
  //     let expectedCache = {
  //       fakeUser3ID: {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "editedFakeUser3ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "editedFakeUser3ConfigPlant2" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "editedFakeUser3DataPlant1" },
  //           fakePlant2: { fakeUserData: "editedFakeUser3DataPlant2" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "editedFakeUser3Email",
  //       },
  //       fakeUser4ID: {
  //         config: {
  //           fakePlant2: { fakeUserConfig: "fakeUser4ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser4ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant2: { fakeUserData: "fakeUser4DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser4DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalUser,
  //           plants: {
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser4Email",
  //       },
  //       fakeUser5ID: {
  //         config: {
  //           fakePlant2: { fakeUserConfig: "fakeUser5ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser5ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant2: { fakeUserData: "fakeUser5DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser5DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalUser,
  //           plants: {
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser5Email",
  //       },
  //       fakeUser6ID: {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "editedFakeUser6ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "editedFakeUser6ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "editedFakeUser6ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "editedFakeUser6DataPlant1" },
  //           fakePlant2: { fakeUserData: "editedFakeUser6DataPlant2" },
  //           fakePlant3: { fakeUserData: "editedFakeUser6DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalUser,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "editedFakeUser6Email",
  //       },
  //     };
  //     expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
  //       expectedCache
  //     );
  //   });
  //   it("should throw and not fetch any data - return empty cache - if getFuke throws during getting new data", async () => {
  //     throwWhileGettingFileContent = true;
  //     await expect(exec()).rejects.toMatchObject({
  //       message: "Test get file content error",
  //     });
  //     expect((mindSphereApp as any)._userStorage._cacheData).toEqual({});
  //   });
  //   it("should not throw but clear all cache data - if checkFile returns null", async () => {
  //     checkFileReturnsNull = true;
  //     await exec();
  //     //8 times during initialization, 0 after - due to check file equal to null
  //     expect(mockedGetFileFunction).toHaveBeenCalledTimes(8);
  //     expect((mindSphereApp as any)._userStorage._cacheData).toEqual({});
  //   });
  //   it("should throw and not fetch new data if app is not initialized", async () => {
  //     initApp = false;
  //     await expect(exec()).rejects.toMatchObject({
  //       message: `Application not initialized!`,
  //     });
  //     expect(mockedGetFileFunction).not.toHaveBeenCalled();
  //     //Cache data of storage should be fetched
  //     expect((mindSphereApp as any)._userStorage._cacheData).toEqual({});
  //   });
  // });
  // describe("getUserData", () => {
  //   let mindSphereApp: MindSphereApp;
  //   let assetFilesStorageContent: {
  //     [filePath: string]: AppStorageData | UserStorageData | PlanStorageData;
  //   };
  //   let storageTenant: string;
  //   let appId: string;
  //   let assetId: string;
  //   let appTenant: string;
  //   let subtenantId: string | null;
  //   let initApp: boolean;
  //   let newUserData: {
  //     [userId: string]: UserStorageData;
  //   };
  //   let userId: string;
  //   beforeEach(async () => {
  //     assetFilesStorageContent = {
  //       "main.app.config.json": {
  //         config: {
  //           fakeAppConfig: "testFakeAppConfig",
  //         },
  //         data: {
  //           fakeAppData: "testFakeAppData",
  //         },
  //       },
  //       "fakeUser1ID.user.config.json": {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser1ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser1ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser1ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser1DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser1DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser1DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.Admin,
  //             fakePlant2: PlantPermissions.Admin,
  //             fakePlant3: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser1Email",
  //       },
  //       "fakeUser2ID.user.config.json": {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser2ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser2ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser2ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser2DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser2DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser2DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalUser,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser2Email",
  //       },
  //       "fakeUser3ID.user.config.json": {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser3ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser3ConfigPlant2" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser3DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser3DataPlant2" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser3Email",
  //       },
  //       "fakeUser4ID.user.config.json": {
  //         config: {
  //           fakePlant2: { fakeUserConfig: "fakeUser4ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser4ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant2: { fakeUserData: "fakeUser4DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser4DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalUser,
  //           plants: {
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser4Email",
  //       },
  //       "fakePlant1.plant.config.json": {
  //         config: {
  //           plantConfig: "fakePlant1Config",
  //         },
  //         data: {
  //           plantData: "fakePlant1Data",
  //         },
  //       },
  //       "fakePlant2.plant.config.json": {
  //         config: {
  //           plantConfig: "fakePlant2Config",
  //         },
  //         data: {
  //           plantData: "fakePlant2Data",
  //         },
  //       },
  //       "fakePlant3.plant.config.json": {
  //         config: {
  //           plantConfig: "fakePlant3Config",
  //         },
  //         data: {
  //           plantData: "fakePlant3Data",
  //         },
  //       },
  //     };
  //     mockedGetAllFileNamesFunction = jest.fn(
  //       async (tenant: string, asset: string, extension: string) => {
  //         let dataToReturn = Object.keys(assetFilesStorageContent);
  //         return dataToReturn.filter((filePath) =>
  //           filePath.includes(extension)
  //         );
  //       }
  //     );
  //     mindSphereFileService.getAllFileNamesFromAsset = mockedGetAllFileNamesFunction;
  //     mockedGetFileFunction = jest.fn(
  //       async (tenant: string, asset: string, filePath: string) => {
  //         let dataToReturn = assetFilesStorageContent[filePath];
  //         if (dataToReturn == null) throw new Error("File not found");
  //         return dataToReturn;
  //       }
  //     );
  //     mindSphereFileService.getFileContent = mockedGetFileFunction;
  //     mockedCheckFileFunction = jest.fn(
  //       async (tenant: string, asset: string, filePath: string) => {
  //         return assetFilesStorageContent[filePath] != null;
  //       }
  //     );
  //     mindSphereFileService.checkIfFileExists = mockedCheckFileFunction;
  //     mockedGetAllUserGroupsResults.results = [
  //       [
  //         {
  //           description: "testGlobalAdminDescription",
  //           displayName: "testGlobalAdminGroup",
  //           members: [],
  //           id: "testGlobalAdminId",
  //         },
  //         {
  //           description: "testGlobalUserDescription",
  //           displayName: "testGlobalUserGroup",
  //           members: [],
  //           id: "testGlobalUserId",
  //         },
  //         {
  //           description: "testLocalAdminDescription",
  //           displayName: "testLocalAdminGroup",
  //           members: [],
  //           id: "testLocalAdminId",
  //         },
  //         {
  //           description: "testLocalUserDescription",
  //           displayName: "testLocalUserGroup",
  //           members: [],
  //           id: "testLocalUserId",
  //         },
  //         {
  //           description: "testStandardUserDescription",
  //           displayName: "testMsStandardUserGroup",
  //           members: [],
  //           id: "testStandardUserId",
  //         },
  //         {
  //           description: "testSubtenantUserDescription",
  //           displayName: "testMsSubtenantUserGroup",
  //           members: [],
  //           id: "testSubtenantUserId",
  //         },
  //       ],
  //     ];
  //     storageTenant = "testStorageTenant";
  //     appId = "testAppId";
  //     assetId = "testAssetId";
  //     appTenant = "testAppTenant";
  //     subtenantId = "testSubtenantId";
  //     initApp = true;
  //     newUserData = {
  //       "fakeUser3ID.user.config.json": {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "editedFakeUser3ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "editedFakeUser3ConfigPlant2" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "editedFakeUser3DataPlant1" },
  //           fakePlant2: { fakeUserData: "editedFakeUser3DataPlant2" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "editedFakeUser3Email",
  //       },
  //       "fakeUser4ID.user.config.json": {
  //         config: {
  //           fakePlant2: { fakeUserConfig: "fakeUser4ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser4ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant2: { fakeUserData: "fakeUser4DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser4DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalUser,
  //           plants: {
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser4Email",
  //       },
  //       "fakeUser5ID.user.config.json": {
  //         config: {
  //           fakePlant2: { fakeUserConfig: "fakeUser5ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser5ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant2: { fakeUserData: "fakeUser5DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser5DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalUser,
  //           plants: {
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser5Email",
  //       },
  //       "fakeUser6ID.user.config.json": {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "editedFakeUser6ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "editedFakeUser6ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "editedFakeUser6ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "editedFakeUser6DataPlant1" },
  //           fakePlant2: { fakeUserData: "editedFakeUser6DataPlant2" },
  //           fakePlant3: { fakeUserData: "editedFakeUser6DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalUser,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "editedFakeUser6Email",
  //       },
  //     };
  //     userId = "fakeUser3ID";
  //   });
  //   let exec = async () => {
  //     mindSphereApp = new MindSphereApp(
  //       storageTenant,
  //       appId,
  //       assetId,
  //       appTenant,
  //       subtenantId
  //     );
  //     if (initApp) await mindSphereApp.init();
  //     //Changing users storage content
  //     delete assetFilesStorageContent["fakeUser1ID.user.config.json"];
  //     delete assetFilesStorageContent["fakeUser2ID.user.config.json"];
  //     delete assetFilesStorageContent["fakeUser3ID.user.config.json"];
  //     delete assetFilesStorageContent["fakeUser4ID.user.config.json"];
  //     assetFilesStorageContent = {
  //       ...assetFilesStorageContent,
  //       ...newUserData,
  //     };
  //     return mindSphereApp.getUserData(userId);
  //   };
  //   it("should return new user from cache - if user of given id exists in cache", async () => {
  //     let result = await exec();
  //     let expectedResult = {
  //       config: {
  //         fakePlant1: { fakeUserConfig: "fakeUser3ConfigPlant1" },
  //         fakePlant2: { fakeUserConfig: "fakeUser3ConfigPlant2" },
  //       },
  //       data: {
  //         fakePlant1: { fakeUserData: "fakeUser3DataPlant1" },
  //         fakePlant2: { fakeUserData: "fakeUser3DataPlant2" },
  //       },
  //       permissions: {
  //         role: UserRole.LocalAdmin,
  //         plants: {
  //           fakePlant1: PlantPermissions.User,
  //           fakePlant2: PlantPermissions.Admin,
  //         },
  //       },
  //       email: "fakeUser3Email",
  //     };
  //     expect(result).toEqual(expectedResult);
  //     //8 times during initialization, 0 after
  //     expect(mockedGetFileFunction).toHaveBeenCalledTimes(8);
  //     //Cache should stay without changes
  //     let expectedCache = {
  //       fakeUser1ID: {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser1ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser1ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser1ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser1DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser1DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser1DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.Admin,
  //             fakePlant2: PlantPermissions.Admin,
  //             fakePlant3: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser1Email",
  //       },
  //       fakeUser2ID: {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser2ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser2ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser2ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser2DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser2DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser2DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalUser,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser2Email",
  //       },
  //       fakeUser3ID: {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser3ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser3ConfigPlant2" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser3DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser3DataPlant2" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser3Email",
  //       },
  //       fakeUser4ID: {
  //         config: {
  //           fakePlant2: { fakeUserConfig: "fakeUser4ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser4ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant2: { fakeUserData: "fakeUser4DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser4DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalUser,
  //           plants: {
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser4Email",
  //       },
  //     };
  //     expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
  //       expectedCache
  //     );
  //   });
  //   it("should fetch and return new user from cache - if user of given id doesnt exist in cache", async () => {
  //     userId = "fakeUser5ID";
  //     let result = await exec();
  //     let expectedResult = {
  //       config: {
  //         fakePlant2: { fakeUserConfig: "fakeUser5ConfigPlant2" },
  //         fakePlant3: { fakeUserConfig: "fakeUser5ConfigPlant3" },
  //       },
  //       data: {
  //         fakePlant2: { fakeUserData: "fakeUser5DataPlant2" },
  //         fakePlant3: { fakeUserData: "fakeUser5DataPlant3" },
  //       },
  //       permissions: {
  //         role: UserRole.LocalUser,
  //         plants: {
  //           fakePlant2: PlantPermissions.User,
  //           fakePlant3: PlantPermissions.User,
  //         },
  //       },
  //       email: "fakeUser5Email",
  //     };
  //     expect(result).toEqual(expectedResult);
  //     //8 times during initialization, 1 after
  //     expect(mockedGetFileFunction).toHaveBeenCalledTimes(9);
  //     expect(mockedGetFileFunction.mock.calls[8]).toEqual([
  //       "testStorageTenant",
  //       "testAssetId",
  //       "fakeUser5ID.user.config.json",
  //     ]);
  //     //Cache should have changed
  //     let expectedCache = {
  //       fakeUser1ID: {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser1ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser1ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser1ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser1DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser1DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser1DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.Admin,
  //             fakePlant2: PlantPermissions.Admin,
  //             fakePlant3: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser1Email",
  //       },
  //       fakeUser2ID: {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser2ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser2ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser2ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser2DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser2DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser2DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalUser,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser2Email",
  //       },
  //       fakeUser3ID: {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser3ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser3ConfigPlant2" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser3DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser3DataPlant2" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser3Email",
  //       },
  //       fakeUser4ID: {
  //         config: {
  //           fakePlant2: { fakeUserConfig: "fakeUser4ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser4ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant2: { fakeUserData: "fakeUser4DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser4DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalUser,
  //           plants: {
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser4Email",
  //       },
  //       fakeUser5ID: {
  //         config: {
  //           fakePlant2: { fakeUserConfig: "fakeUser5ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser5ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant2: { fakeUserData: "fakeUser5DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser5DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalUser,
  //           plants: {
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser5Email",
  //       },
  //     };
  //     expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
  //       expectedCache
  //     );
  //   });
  //   it("should throw and not fetch new user from cache - if user does not exists in storage and get file throws", async () => {
  //     userId = "fakeUser10ID";
  //     await expect(exec()).rejects.toMatchObject({
  //       message: "File not found",
  //     });
  //     //8 times during initialization, 1 after
  //     expect(mockedGetFileFunction).toHaveBeenCalledTimes(9);
  //     expect(mockedGetFileFunction.mock.calls[8]).toEqual([
  //       "testStorageTenant",
  //       "testAssetId",
  //       "fakeUser10ID.user.config.json",
  //     ]);
  //     //Cache should stay without changes
  //     let expectedCache = {
  //       fakeUser1ID: {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser1ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser1ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser1ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser1DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser1DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser1DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.Admin,
  //             fakePlant2: PlantPermissions.Admin,
  //             fakePlant3: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser1Email",
  //       },
  //       fakeUser2ID: {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser2ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser2ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser2ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser2DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser2DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser2DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalUser,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser2Email",
  //       },
  //       fakeUser3ID: {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser3ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser3ConfigPlant2" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser3DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser3DataPlant2" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser3Email",
  //       },
  //       fakeUser4ID: {
  //         config: {
  //           fakePlant2: { fakeUserConfig: "fakeUser4ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser4ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant2: { fakeUserData: "fakeUser4DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser4DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalUser,
  //           plants: {
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser4Email",
  //       },
  //     };
  //     expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
  //       expectedCache
  //     );
  //   });
  //   it("should throw and not fetch new user if app is not initialized", async () => {
  //     initApp = false;
  //     await expect(exec()).rejects.toMatchObject({
  //       message: `Application not initialized!`,
  //     });
  //     expect(mockedGetFileFunction).not.toHaveBeenCalled();
  //     //Cache data of storage should be fetched
  //     expect((mindSphereApp as any)._userStorage._cacheData).toEqual({});
  //   });
  // });
  // describe("setUserData", () => {
  //   let mindSphereApp: MindSphereApp;
  //   let assetFilesStorageContent: {
  //     [filePath: string]: AppStorageData | UserStorageData | PlanStorageData;
  //   };
  //   let storageTenant: string;
  //   let appId: string;
  //   let assetId: string;
  //   let appTenant: string;
  //   let subtenantId: string | null;
  //   let initApp: boolean;
  //   let userId: string;
  //   let newUserData: UserStorageData;
  //   beforeEach(async () => {
  //     assetFilesStorageContent = {
  //       "main.app.config.json": {
  //         config: {
  //           fakeAppConfig: "testFakeAppConfig",
  //         },
  //         data: {
  //           fakeAppData: "testFakeAppData",
  //         },
  //       },
  //       "fakeUser1ID.user.config.json": {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser1ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser1ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser1ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser1DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser1DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser1DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.Admin,
  //             fakePlant2: PlantPermissions.Admin,
  //             fakePlant3: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser1Email",
  //       },
  //       "fakeUser2ID.user.config.json": {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser2ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser2ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser2ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser2DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser2DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser2DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalUser,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser2Email",
  //       },
  //       "fakeUser3ID.user.config.json": {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser3ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser3ConfigPlant2" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser3DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser3DataPlant2" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser3Email",
  //       },
  //       "fakeUser4ID.user.config.json": {
  //         config: {
  //           fakePlant2: { fakeUserConfig: "fakeUser4ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser4ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant2: { fakeUserData: "fakeUser4DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser4DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalUser,
  //           plants: {
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser4Email",
  //       },
  //       "fakePlant1.plant.config.json": {
  //         config: {
  //           plantConfig: "fakePlant1Config",
  //         },
  //         data: {
  //           plantData: "fakePlant1Data",
  //         },
  //       },
  //       "fakePlant2.plant.config.json": {
  //         config: {
  //           plantConfig: "fakePlant2Config",
  //         },
  //         data: {
  //           plantData: "fakePlant2Data",
  //         },
  //       },
  //       "fakePlant3.plant.config.json": {
  //         config: {
  //           plantConfig: "fakePlant3Config",
  //         },
  //         data: {
  //           plantData: "fakePlant3Data",
  //         },
  //       },
  //     };
  //     mockedGetAllFileNamesFunction = jest.fn(
  //       async (tenant: string, asset: string, extension: string) => {
  //         let dataToReturn = Object.keys(assetFilesStorageContent);
  //         return dataToReturn.filter((filePath) =>
  //           filePath.includes(extension)
  //         );
  //       }
  //     );
  //     mindSphereFileService.getAllFileNamesFromAsset = mockedGetAllFileNamesFunction;
  //     mockedGetFileFunction = jest.fn(
  //       async (tenant: string, asset: string, filePath: string) => {
  //         let dataToReturn = assetFilesStorageContent[filePath];
  //         if (dataToReturn == null) throw new Error("File not found");
  //         return dataToReturn;
  //       }
  //     );
  //     mindSphereFileService.getFileContent = mockedGetFileFunction;
  //     mockedCheckFileFunction = jest.fn(
  //       async (tenant: string, asset: string, filePath: string) => {
  //         return assetFilesStorageContent[filePath] != null;
  //       }
  //     );
  //     mindSphereFileService.checkIfFileExists = mockedCheckFileFunction;
  //     mockedSetFileFunction = jest.fn(
  //       async (
  //         tenant: string,
  //         asset: string,
  //         filePath: string,
  //         fileContent: any
  //       ) => {
  //         assetFilesStorageContent[filePath] = fileContent;
  //       }
  //     );
  //     mindSphereFileService.setFileContent = mockedSetFileFunction;
  //     mockedGetAllUserGroupsResults.results = [
  //       [
  //         {
  //           description: "testGlobalAdminDescription",
  //           displayName: "testGlobalAdminGroup",
  //           members: [],
  //           id: "testGlobalAdminId",
  //         },
  //         {
  //           description: "testGlobalUserDescription",
  //           displayName: "testGlobalUserGroup",
  //           members: [],
  //           id: "testGlobalUserId",
  //         },
  //         {
  //           description: "testLocalAdminDescription",
  //           displayName: "testLocalAdminGroup",
  //           members: [],
  //           id: "testLocalAdminId",
  //         },
  //         {
  //           description: "testLocalUserDescription",
  //           displayName: "testLocalUserGroup",
  //           members: [],
  //           id: "testLocalUserId",
  //         },
  //         {
  //           description: "testStandardUserDescription",
  //           displayName: "testMsStandardUserGroup",
  //           members: [],
  //           id: "testStandardUserId",
  //         },
  //         {
  //           description: "testSubtenantUserDescription",
  //           displayName: "testMsSubtenantUserGroup",
  //           members: [],
  //           id: "testSubtenantUserId",
  //         },
  //       ],
  //     ];
  //     storageTenant = "testStorageTenant";
  //     appId = "testAppId";
  //     assetId = "testAssetId";
  //     appTenant = "testAppTenant";
  //     subtenantId = "testSubtenantId";
  //     initApp = true;
  //     userId = "fakeUser5ID";
  //     newUserData = {
  //       config: {
  //         fakePlant2: { fakeUserConfig: "fakeUser5ConfigPlant2" },
  //         fakePlant3: { fakeUserConfig: "fakeUser5ConfigPlant3" },
  //       },
  //       data: {
  //         fakePlant2: { fakeUserData: "fakeUser5DataPlant2" },
  //         fakePlant3: { fakeUserData: "fakeUser5DataPlant3" },
  //       },
  //       permissions: {
  //         role: UserRole.LocalUser,
  //         plants: {
  //           fakePlant2: PlantPermissions.User,
  //           fakePlant3: PlantPermissions.User,
  //         },
  //       },
  //       email: "fakeUser5Email",
  //     };
  //   });
  //   let exec = async () => {
  //     mindSphereApp = new MindSphereApp(
  //       storageTenant,
  //       appId,
  //       assetId,
  //       appTenant,
  //       subtenantId
  //     );
  //     if (initApp) await mindSphereApp.init();
  //     return mindSphereApp.setUserData(userId, newUserData);
  //   };
  //   it("should set new user data in cache and in storage - if there is no user of given id", async () => {
  //     await exec();
  //     //8 times during initialization, 0 after
  //     expect(mockedSetFileFunction).toHaveBeenCalledTimes(1);
  //     expect(mockedSetFileFunction.mock.calls[0]).toEqual([
  //       "testStorageTenant",
  //       "testAssetId",
  //       "fakeUser5ID.user.config.json",
  //       newUserData,
  //     ]);
  //     //Cache should have changed
  //     let expectedCache = {
  //       fakeUser1ID: {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser1ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser1ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser1ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser1DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser1DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser1DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.Admin,
  //             fakePlant2: PlantPermissions.Admin,
  //             fakePlant3: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser1Email",
  //       },
  //       fakeUser2ID: {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser2ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser2ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser2ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser2DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser2DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser2DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalUser,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser2Email",
  //       },
  //       fakeUser3ID: {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser3ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser3ConfigPlant2" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser3DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser3DataPlant2" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser3Email",
  //       },
  //       fakeUser4ID: {
  //         config: {
  //           fakePlant2: { fakeUserConfig: "fakeUser4ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser4ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant2: { fakeUserData: "fakeUser4DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser4DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalUser,
  //           plants: {
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser4Email",
  //       },
  //       [userId]: newUserData,
  //     };
  //     expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
  //       expectedCache
  //     );
  //     //User should be accessible via getUser
  //     let userData = await mindSphereApp.getUserData(userId);
  //     expect(userData).toEqual(newUserData);
  //   });
  //   it("should set new user data in cache and in storage - if user of given id already exists", async () => {
  //     userId = "fakeUser3ID";
  //     await exec();
  //     //8 times during initialization, 0 after
  //     expect(mockedSetFileFunction).toHaveBeenCalledTimes(1);
  //     expect(mockedSetFileFunction.mock.calls[0]).toEqual([
  //       "testStorageTenant",
  //       "testAssetId",
  //       "fakeUser3ID.user.config.json",
  //       newUserData,
  //     ]);
  //     //Cache should have changed
  //     let expectedCache = {
  //       fakeUser1ID: {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser1ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser1ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser1ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser1DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser1DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser1DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.Admin,
  //             fakePlant2: PlantPermissions.Admin,
  //             fakePlant3: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser1Email",
  //       },
  //       fakeUser2ID: {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser2ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser2ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser2ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser2DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser2DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser2DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalUser,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser2Email",
  //       },
  //       fakeUser3ID: newUserData,
  //       fakeUser4ID: {
  //         config: {
  //           fakePlant2: { fakeUserConfig: "fakeUser4ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser4ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant2: { fakeUserData: "fakeUser4DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser4DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalUser,
  //           plants: {
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser4Email",
  //       },
  //     };
  //     expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
  //       expectedCache
  //     );
  //     //User should be accessible via getUser
  //     let userData = await mindSphereApp.getUserData(userId);
  //     expect(userData).toEqual(newUserData);
  //   });
  //   it("should not set new user data in cache and throw - if set file throws, user does not exists in cache", async () => {
  //     mockedSetFileFunction = jest.fn(async () => {
  //       throw new Error("test set file error");
  //     });
  //     mindSphereFileService.setFileContent = mockedSetFileFunction;
  //     await expect(exec()).rejects.toMatchObject({
  //       message: "test set file error",
  //     });
  //     //8 times during initialization, 0 after
  //     expect(mockedSetFileFunction).toHaveBeenCalledTimes(1);
  //     expect(mockedSetFileFunction.mock.calls[0]).toEqual([
  //       "testStorageTenant",
  //       "testAssetId",
  //       "fakeUser5ID.user.config.json",
  //       newUserData,
  //     ]);
  //     //Cache should not have changed
  //     let expectedCache = {
  //       fakeUser1ID: {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser1ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser1ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser1ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser1DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser1DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser1DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.Admin,
  //             fakePlant2: PlantPermissions.Admin,
  //             fakePlant3: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser1Email",
  //       },
  //       fakeUser2ID: {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser2ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser2ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser2ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser2DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser2DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser2DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalUser,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser2Email",
  //       },
  //       fakeUser3ID: {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser3ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser3ConfigPlant2" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser3DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser3DataPlant2" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser3Email",
  //       },
  //       fakeUser4ID: {
  //         config: {
  //           fakePlant2: { fakeUserConfig: "fakeUser4ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser4ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant2: { fakeUserData: "fakeUser4DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser4DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalUser,
  //           plants: {
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser4Email",
  //       },
  //     };
  //     expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
  //       expectedCache
  //     );
  //   });
  //   it("should not set new user data in cache and throw - if set file throws, user exists in cache", async () => {
  //     mockedSetFileFunction = jest.fn(async () => {
  //       throw new Error("test set file error");
  //     });
  //     mindSphereFileService.setFileContent = mockedSetFileFunction;
  //     userId = "fakeUser3ID";
  //     await expect(exec()).rejects.toMatchObject({
  //       message: "test set file error",
  //     });
  //     //8 times during initialization, 0 after
  //     expect(mockedSetFileFunction).toHaveBeenCalledTimes(1);
  //     expect(mockedSetFileFunction.mock.calls[0]).toEqual([
  //       "testStorageTenant",
  //       "testAssetId",
  //       "fakeUser3ID.user.config.json",
  //       newUserData,
  //     ]);
  //     //Cache should not have changed
  //     let expectedCache = {
  //       fakeUser1ID: {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser1ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser1ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser1ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser1DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser1DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser1DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.Admin,
  //             fakePlant2: PlantPermissions.Admin,
  //             fakePlant3: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser1Email",
  //       },
  //       fakeUser2ID: {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser2ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser2ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser2ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser2DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser2DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser2DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.GlobalUser,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser2Email",
  //       },
  //       fakeUser3ID: {
  //         config: {
  //           fakePlant1: { fakeUserConfig: "fakeUser3ConfigPlant1" },
  //           fakePlant2: { fakeUserConfig: "fakeUser3ConfigPlant2" },
  //         },
  //         data: {
  //           fakePlant1: { fakeUserData: "fakeUser3DataPlant1" },
  //           fakePlant2: { fakeUserData: "fakeUser3DataPlant2" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalAdmin,
  //           plants: {
  //             fakePlant1: PlantPermissions.User,
  //             fakePlant2: PlantPermissions.Admin,
  //           },
  //         },
  //         email: "fakeUser3Email",
  //       },
  //       fakeUser4ID: {
  //         config: {
  //           fakePlant2: { fakeUserConfig: "fakeUser4ConfigPlant2" },
  //           fakePlant3: { fakeUserConfig: "fakeUser4ConfigPlant3" },
  //         },
  //         data: {
  //           fakePlant2: { fakeUserData: "fakeUser4DataPlant2" },
  //           fakePlant3: { fakeUserData: "fakeUser4DataPlant3" },
  //         },
  //         permissions: {
  //           role: UserRole.LocalUser,
  //           plants: {
  //             fakePlant2: PlantPermissions.User,
  //             fakePlant3: PlantPermissions.User,
  //           },
  //         },
  //         email: "fakeUser4Email",
  //       },
  //     };
  //     expect((mindSphereApp as any)._userStorage._cacheData).toEqual(
  //       expectedCache
  //     );
  //   });
  //   it("should throw and not set new user if app is not initialized", async () => {
  //     initApp = false;
  //     await expect(exec()).rejects.toMatchObject({
  //       message: `Application not initialized!`,
  //     });
  //     //SetFile should not have been called
  //     expect(mockedSetFileFunction).not.toHaveBeenCalled();
  //     //Cache data should not have been changed - app not initialized so it is empty
  //     expect((mindSphereApp as any)._userStorage._cacheData).toEqual({});
  //   });
  // });
  // //#endregion ===== USER STORAGE DATA =====
});

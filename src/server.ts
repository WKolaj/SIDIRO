// import appStart from "./startup/app";

// export default appStart(__dirname);

import { MindSphereUserService } from "./classes/MindSphereService/MindSphereUserService";
import { MindSphereUserGroupService } from "./classes/MindSphereService/MindSphereUserGroupService";

let userService = MindSphereUserService.getInstance();

let userGroupsService = MindSphereUserGroupService.getInstance();

let exec = async () => {
  // let allGroups = await userGroupsService.getAllUserGroups(
  //   "sidivp",
  //   "3d7f5661-c5f8-4545-a042-9a90ab79e02d",
  //   "mdsp:sidiop:sidiro.globaladmin"
  // );

  await userGroupsService.deleteUserGroup(
    "sidivp",
    "0c84b271-b9dd-4676-b499-74b7e02ba67c"
  );
};

exec();

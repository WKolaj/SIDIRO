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

  let userIsAssingedToGroup = await userGroupsService.removeUserFromGroup(
    "sidivp",
    "53a1993b-daa3-4e41-9cc8-ea3e7107ac05",
    "bf02447c-8bf6-4aa0-be95-ea2a9cb4acc3"
  );

  console.log(userIsAssingedToGroup);
};

exec();

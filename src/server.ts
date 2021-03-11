// import appStart from "./startup/app";

// export default appStart(__dirname);

import { MindSphereUserService } from "./classes/MindSphereService/MindSphereUserService";
import { MindSphereUserGroupService } from "./classes/MindSphereService/MindSphereUserGroupService";
import { MindSphereAssetService } from "./classes/MindSphereService/MindSphereAssetService";
import { writeFileAsync } from "./utilities/utilities";

let userService = MindSphereUserService.getInstance();

let userGroupsService = MindSphereUserGroupService.getInstance();

let exec = async () => {
  // let allGroups = await userGroupsService.getAllUserGroups(
  //   "sidivp",
  //   "3d7f5661-c5f8-4545-a042-9a90ab79e02d",
  //   "mdsp:sidiop:sidiro.globaladmin"
  // );

  let allAssets = await MindSphereAssetService.getInstance().getAssets(
    "sidivp"
  );

  await writeFileAsync(
    "test.json",
    JSON.stringify(allAssets.map((asset) => asset.name))
  );
};

exec();

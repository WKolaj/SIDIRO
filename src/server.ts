// import appStart from "./startup/app";
import { MindSphereAppsManager } from "./classes/MindSphereApp/MindSphereAppsManager";
import { MindSphereAssetService } from "./classes/MindSphereService/MindSphereAssetService";
import { MindSphereFileService } from "./classes/MindSphereService/MindSphereFileService";
import { MindSphereTimeSeriesService } from "./classes/MindSphereService/MindSphereTimeSeriesService";
import { MindSphereUserGroupService } from "./classes/MindSphereService/MindSphereUserGroupService";
import { MindSphereUserService } from "./classes/MindSphereService/MindSphereUserService";

// module.exports = appStart(__dirname);

let exec = async () => {
  console.log(
    (
      await MindSphereUserService.getInstance().getUser(
        "sidivp",
        "c7e0bb61-ce13-4b14-aeef-522a1c4fd95b"
      )
    ).groups
  );
  console.log(
    await MindSphereUserGroupService.getInstance().removeUserFromGroup(
      "sidivp",
      "5a2a774f-6f75-4f52-af42-cecc41f8f28e",
      "c7e0bb61-ce13-4b14-aeef-522a1c4fd95b"
    )
  );
  console.log(
    (
      await MindSphereUserService.getInstance().getUser(
        "sidivp",
        "c7e0bb61-ce13-4b14-aeef-522a1c4fd95b"
      )
    ).groups
  );
};

exec();

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
    await MindSphereUserService.getInstance().checkIfUserExists(
      "sidivp",
      null,
      null
    )
  );
};

exec();

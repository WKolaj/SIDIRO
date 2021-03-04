import express from "express";
import {
  AppStorageData,
  PlanStorageData,
  UserStorageData,
} from "../../classes/MindSphereApp/MindSphereApp";
import fetchTokenData from "../../middleware/tokenData/fetchTokenData";
import fetchUserAndAppData, {
  AppDataRequest,
} from "../../middleware/appData/fetchUserAndAppData";
import isUserOrAdmin from "../../middleware/authorization/isUserOrAdmin";
import { MindSphereAppUsersManager } from "../../classes/MindSphereApp/MindSphereAppUsersManager";

const router = express.Router();

const normalizeConfigPlantPayload = function(
  appId: string,
  plantId: string,
  plantsData: PlanStorageData
) {
  return {
    ...plantsData,
    appId: appId,
    plantId: plantId,
  };
};

const normalizeConfigTotalPayload = function(
  appId: string,
  appData: AppStorageData,
  userId: string,
  userData: UserStorageData,
  plantsData: {
    [plantId: string]: PlanStorageData;
  }
) {
  let payloadToReturn: any = {
    appData: {
      ...appData,
      appId: appId,
    },
    plantsData: {},
    userData: {
      ...userData,
      appId: appId,
      userId: userId,
    },
  };

  for (let plantId of Object.keys(plantsData)) {
    payloadToReturn.plantsData[plantId] = normalizeConfigPlantPayload(
      appId,
      plantId,
      plantsData[plantId]
    );
  }

  return payloadToReturn;
};

//#region ========== ME ROUTES ==========

router.get(
  "/me",
  fetchTokenData,
  fetchUserAndAppData,
  isUserOrAdmin,
  async function(req: express.Request, res: express.Response) {
    let appDataReq = req as AppDataRequest;

    let plantPayload: {
      [plantId: string]: PlanStorageData;
    } = {};

    //#region ========== GENERETING PLANTS PAYLOAD ==========

    let allPlants = await appDataReq.appInstance!.getAllPlants();

    for (let plantId of Object.keys(allPlants)) {
      let plantData = allPlants[plantId];

      //Adding plant to plant payload to return only if user is a global admin or global user or has local access to plant
      if (
        MindSphereAppUsersManager.hasGlobalAdminRole(appDataReq.userData!) ||
        MindSphereAppUsersManager.hasGlobalUserRole(appDataReq.userData!) ||
        MindSphereAppUsersManager.hasLocalAccessToPlant(
          plantId,
          appDataReq.userData!
        )
      )
        plantPayload[plantId] = plantData;
    }

    //#endregion ========== GENERETING PLANTS PAYLOAD ==========

    return res
      .status(200)
      .send(
        normalizeConfigTotalPayload(
          appDataReq.appId!,
          appDataReq.appData!,
          appDataReq.userId!,
          appDataReq.userData!,
          plantPayload
        )
      );
  }
);

//#endregion ========== ME ROUTES ==========

export default router;

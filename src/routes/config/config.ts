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
import checkPlantIdParamUserOrAdmin from "../../middleware/checkParams/checkPlantIdParamUserOrAdmin";
import { MindSphereAppUsersManager } from "../../classes/MindSphereApp/MindSphereAppUsersManager";

const router = express.Router();

const normalizeConfigPlantPayload = function(
  appId: string,
  plantsData: PlanStorageData
) {
  return {
    ...plantsData,
    appId: appId,
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
      plantsData[plantId]
    );
  }

  return payloadToReturn;
};

router.get(
  "/",
  fetchTokenData,
  fetchUserAndAppData,
  isUserOrAdmin,
  async function(req: express.Request, res: express.Response) {
    let appDataReq = req as AppDataRequest;

    let plantPayload: {
      [plantId: string]: PlanStorageData;
    } = {};

    //#region ========== GENERETING PLANTS PAYLOAD ==========

    for (let plantId of Object.keys(appDataReq.userData!.permissions.plants)) {
      let plantData = await appDataReq.appInstance!.getPlantData(plantId);
      if (plantData != null) plantPayload[plantId] = plantData;
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

export default router;

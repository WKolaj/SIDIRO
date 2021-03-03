import express from "express";
import { AppStorageData } from "../../classes/MindSphereApp/MindSphereApp";
import fetchTokenData from "../../middleware/tokenData/fetchTokenData";
import fetchUserAndAppData, {
  AppDataRequest,
} from "../../middleware/appData/fetchUserAndAppData";
import { applyJSONParsingToRoute } from "../../utilities/utilities";
import isUserOrAdmin from "../../middleware/authorization/isUserOrAdmin";
import isGlobalAdmin from "../../middleware/authorization/isGlobalAdmin";
import { joiValidator } from "../../middleware/validation/joiValidate";
import { validateApp } from "../../models/App/App/App";

const router = express.Router();

export interface AppPayload extends AppStorageData {
  appId: string;
}

const normalizeAppPayload = function(
  appId: string,
  appPayload: AppStorageData
): AppPayload {
  return {
    ...appPayload,
    appId: appId,
  };
};

//Applying json error validation for these routes
applyJSONParsingToRoute(router);

router.get(
  "/",
  fetchTokenData,
  fetchUserAndAppData,
  isUserOrAdmin,
  async function(req: express.Request, res: express.Response) {
    let appDataReq = req as AppDataRequest;

    return res
      .status(200)
      .send(normalizeAppPayload(appDataReq.appId!, appDataReq.appData!));
  }
);

router.put(
  "/",
  fetchTokenData,
  fetchUserAndAppData,
  isGlobalAdmin,
  joiValidator(validateApp),
  async function(req: express.Request, res: express.Response) {
    let appDataReq = req as AppDataRequest<any, any, AppPayload>;

    //#region ========== CHECKING IF THERE IS ATTEMPT TO CHANGE APP ID ==========

    if (appDataReq.appId !== appDataReq.body.appId)
      return res.status(400).send("App id cannot be changed!");

    //#region ========== CHECKING IF THERE IS ATTEMPT TO CHANGE APP ID ==========

    //#region ========== UPDATING APP DATA ==========

    let payloadToUpdate: AppStorageData = {
      data: appDataReq.body.data,
      config: appDataReq.body.config,
    };

    await appDataReq.appInstance!.setAppData(payloadToUpdate);

    //#endregion ========== UPDATING PLANT DATA ==========

    return res
      .status(200)
      .send(normalizeAppPayload(appDataReq.appId!, payloadToUpdate));
  }
);

export default router;

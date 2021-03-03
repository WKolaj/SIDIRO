import { ParamsDictionary, Query } from "express-serve-static-core";
import express from "express";
import { MindSphereAppsManager } from "../../classes/MindSphereApp/MindSphereAppsManager";
import {
  MindSphereApp,
  AppStorageData,
  UserStorageData,
} from "../../classes/MindSphereApp/MindSphereApp";
import { TokenRequest } from "../tokenData/fetchTokenData";

/**
 * @description Type representing data of user after decoding the token
 */
export interface AppDataRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query,
  Locals extends Record<string, any> = Record<string, any>
> extends TokenRequest<P, ResBody, ReqBody, ReqQuery, Locals> {
  appInstance?: MindSphereApp;
  appData?: AppStorageData;
  userData?: UserStorageData;
  userId?: string;
  appId?: string;
}

export const getAppIdFromRequest = function(
  req: AppDataRequest
): string | null {
  if (req.userTokenData == null) return null;
  return MindSphereAppsManager.generateAppId(
    req.userTokenData.ten,
    req.userTokenData.subtenant
  );
};

export default async function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let appRequest = req as AppDataRequest;

  //#region ========= GETTING APP ID ========

  let appId = getAppIdFromRequest(appRequest);

  //Checking there is app id created from user's tenant and subtenant
  if (appId == null)
    return res
      .status(403)
      .send(
        "Access denied. Invalid application id generated from user payload!"
      );

  appRequest.appId = appId;

  //#endregion ========= GETTING APP ID ========

  //#region ========= GETTING APP INSTANCE ========

  //Checking if app exists
  let appExists = await MindSphereAppsManager.getInstance().checkIfAppExists(
    appId
  );
  if (!appExists)
    return res
      .status(403)
      .send("Access denied. Application of given id not found for the user!");

  let appInstance = await MindSphereAppsManager.getInstance().getApp(appId);

  appRequest.appInstance = appInstance;

  //#endregion ========= GETTING APP INSTANCE ========

  //#region ========= GETTING APP DATA ========

  //Checking if app data exists
  let appData = await appInstance.getAppData();

  if (!appData)
    return res
      .status(403)
      .send("Access denied. Main application settings not found for the user!");

  appRequest.appData = appData;

  //#endregion ========= GETTING APP DATA ========

  //#region ========= GETTING USER ID ========

  let userId = await appInstance.UsersManager.getUserIdIfExists(
    appRequest.userTokenData.email
  );

  //Checking if user exists for given app
  if (userId == null)
    return res
      .status(403)
      .send("Access denied. User id not found for given application!");

  appRequest.userId = userId;

  //#endregion ========= GETTING USER ID ========

  //#region ========= GETTING USER DATA ========

  let userData = await appInstance.getUserData(userId);

  //Checking if user exists for given app
  if (userData == null)
    return res
      .status(403)
      .send("Access denied. User does not exist for given app id!");

  appRequest.userData = userData;

  //#endregion ========= GETTING USER DATA ========

  next();
}

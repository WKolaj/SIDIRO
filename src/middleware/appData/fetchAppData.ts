import { ParamsDictionary, Query } from "express-serve-static-core";
import express from "express";
import { MindSphereAppsManager } from "../../classes/MindSphereApp/MindSphereAppsManager";
import { MindSphereApp } from "../../classes/MindSphereApp/MindSphereApp";
import { UserTokenRequest } from "../userToken/fetchUserTokenData";

/**
 * @description Type representing data of user after decoding the token
 */
export interface AppDataRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query,
  Locals extends Record<string, any> = Record<string, any>
> extends UserTokenRequest<P, ResBody, ReqBody, ReqQuery, Locals> {
  appData?: MindSphereApp;
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
  let appId = getAppIdFromRequest(appRequest);

  //Checking there is app id created from user's tenant and subtenant
  if (appId == null)
    return res
      .status(403)
      .send(
        "Access denied. Invalid application id generated from user payload!"
      );

  //Checking if app exists
  let appExists = await MindSphereAppsManager.getInstance().checkIfAppExists(
    appId
  );
  if (!appExists)
    return res
      .status(403)
      .send("Access denied. Application of given id not found for the user!");

  let appData = await MindSphereAppsManager.getInstance().getApp(appId);

  appRequest.appData = appData;

  next();
}

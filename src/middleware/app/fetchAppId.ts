import jwt from "jsonwebtoken";
import { ParamsDictionary, Query } from "express-serve-static-core";
import express, { Request } from "express";
import { MindSphereAppsManager } from "../../classes/MindSphereApp/MindSphereAppsManager";
import { UserRequest } from "../user/fetchUser";

/**
 * @description Type representing data of user after decoding the token
 */
export interface AppRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query,
  Locals extends Record<string, any> = Record<string, any>
> extends UserRequest<P, ResBody, ReqBody, ReqQuery, Locals> {
  appId?: string;
}

export const getAppIdFromRequest = function(req: AppRequest): string | null {
  if (req.user == null) return null;
  return MindSphereAppsManager.generateAppId(req.user.ten, req.user.subtenant);
};

export default async function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let appRequest = req as AppRequest;
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

  appRequest.appId = appId;

  next();
}

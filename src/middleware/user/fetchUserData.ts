import jwt from "jsonwebtoken";
import { ParamsDictionary, Query } from "express-serve-static-core";
import express, { Request } from "express";
import { MindSphereAppsManager } from "../../classes/MindSphereApp/MindSphereAppsManager";
import { AppRequest } from "../app/fetchAppId";
import {
  MindSphereApp,
  UserStorageData,
} from "../../classes/MindSphereApp/MindSphereApp";

/**
 * @description Type representing user data
 */
export interface UserDataRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query,
  Locals extends Record<string, any> = Record<string, any>
> extends AppRequest<P, ResBody, ReqBody, ReqQuery, Locals> {
  userData?: UserStorageData;
}

export default async function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let appRequest = req as UserDataRequest;

  let app = await MindSphereAppsManager.getInstance().getApp(appRequest.appId!);

  let userData = await app.getUserData(appRequest.user.user_id);

  //Checking if user exists for given app
  if (userData == null)
    return res
      .status(403)
      .send("Access denied. User does not exist for given app id!");

  appRequest.userData = userData;

  next();
}

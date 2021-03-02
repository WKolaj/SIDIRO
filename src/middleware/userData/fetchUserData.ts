import { ParamsDictionary, Query } from "express-serve-static-core";
import express from "express";
import { MindSphereAppsManager } from "../../classes/MindSphereApp/MindSphereAppsManager";
import { UserStorageData } from "../../classes/MindSphereApp/MindSphereApp";
import { AppDataRequest } from "../appData/fetchAppData";

/**
 * @description Type representing user data
 */
export interface UserDataRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query,
  Locals extends Record<string, any> = Record<string, any>
> extends AppDataRequest<P, ResBody, ReqBody, ReqQuery, Locals> {
  userData?: UserStorageData;
  userId?: string;
}

export default async function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let userDataRequest = req as UserDataRequest;

  let userId = await userDataRequest.appData!.UsersManager.getUserIdIfExists(
    userDataRequest.userData!.email
  );

  //Checking if user exists for given app
  if (userId == null)
    return res
      .status(403)
      .send("Access denied. User does not exist for given app id!");

  let userData = await userDataRequest.appData!.getUserData(userId);

  //Checking if user exists for given app
  if (userData == null)
    return res
      .status(403)
      .send("Access denied. User does not exist for given app id!");

  userDataRequest.userData = userData;
  userDataRequest.userId = userId;

  next();
}

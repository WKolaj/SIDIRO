import jwt from "jsonwebtoken";
import { ParamsDictionary, Query } from "express-serve-static-core";
import express, { Request } from "express";
import { MindSphereAppsManager } from "../classes/MindSphereApp/MindSphereAppsManager";
import { UserRequest } from "./fetchUser";

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

const getAppIdFromRequest = function(req: AppRequest): string | null {
  if (req.user == null) return null;
  return MindSphereAppsManager.generateAppId(req.user.ten, req.user.subtenant);
};

export default function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let appRequest = req as AppRequest;
  let appId = getAppIdFromRequest(appRequest);

  //Checking if user was fetched
  if (appId == null)
    return res
      .status(401)
      .send(
        "Access denied. No user provided to fetch the application for user!"
      );

  appRequest.appId = appId;

  next();
}

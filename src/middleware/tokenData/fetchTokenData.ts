import jwt from "jsonwebtoken";
import { ParamsDictionary, Query } from "express-serve-static-core";
import express, { Request } from "express";
import { MindSphereApp } from "../../classes/MindSphereApp/MindSphereApp";

/**
 * @description Type representing data of user after decoding the token
 */
export type MindSphereUserJWTData = {
  client_id: string;
  user_name: string;
  email: string;
  ten: string;
  scope: string[];
  subtenant?: string;
};

/**
 * @description Type representing data of user after decoding the token
 */
export interface TokenRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query,
  Locals extends Record<string, any> = Record<string, any>
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  userTokenData: MindSphereUserJWTData;
}

const decodeUserFromRequest = function(
  req: Request
): MindSphereUserJWTData | null {
  const authorizationHeader = req.get("authorization");

  if (authorizationHeader == null || !authorizationHeader.includes("Bearer "))
    return null;

  let token = authorizationHeader.replace("Bearer ", "");

  if (token == null) return null;

  let decodedToken = jwt.decode(token, {
    complete: true,
    json: true,
  });

  if (decodedToken == null || decodedToken.payload == null) return null;

  let userToReturn = decodedToken.payload as MindSphereUserJWTData;

  return userToReturn;
};

export default async function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let userData = decodeUserFromRequest(req);

  //Checking if user was fetched
  if (userData == null)
    return res
      .status(401)
      .send(
        "Access denied. No token provided to fetch the user or token is invalid!"
      );

  //Checking if user has role to access the app
  let hasAccess = await MindSphereApp.hasAccessToApplication(userData);
  if (!hasAccess)
    return res
      .status(403)
      .send("Forbidden access. No scope found to access the app!");

  let userRequest = req as TokenRequest;
  userRequest.userTokenData = userData;

  next();
}

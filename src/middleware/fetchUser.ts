import jwt from "jsonwebtoken";
import { ParamsDictionary, Query } from "express-serve-static-core";
import express, { Request } from "express";

/**
 * @description Type representing data of user after decoding the token
 */
export type MindSphereUserData = {
  jti: string;
  sub: string;
  scope: string[];
  client_id: string;
  cid: string;
  azp: string;
  grant_type: string;
  user_id: string;
  origin: string;
  user_name: string;
  email: string;
  auth_time: number;
  rev_sig: string;
  iat: number;
  exp: number;
  iss: string;
  zid: string;
  aud: string[];
  ten: string;
  schemas: string[];
  cat: string;
  subtenant?: string;
};

/**
 * @description Type representing data of user after decoding the token
 */
export interface UserRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query,
  Locals extends Record<string, any> = Record<string, any>
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  user: MindSphereUserData;
}

const decodeUserFromRequest = function(
  req: Request
): MindSphereUserData | null {
  const authorizationHeader = req.get("authorization");

  if (authorizationHeader == null) return null;

  let token = authorizationHeader.replace("Bearer ", "");

  if (token == null) return null;

  let decodedToken = jwt.decode(token, {
    complete: true,
    json: true,
  });

  if (decodedToken == null || decodedToken.payload == null) return null;

  let userToReturn = decodedToken.payload as MindSphereUserData;

  return userToReturn;
};

export default function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let userData = decodeUserFromRequest(req);

  //Checking if user was fetched
  if (userData == null)
    return res
      .status(401)
      .send("Access denied. No token provided to fetch the user!");

  let userRequest = req as UserRequest;
  userRequest.user = userData;

  next();
}

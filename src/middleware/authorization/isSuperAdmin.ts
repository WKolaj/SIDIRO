import express from "express";
import { MindSphereAppUsersManager } from "../../classes/MindSphereApp/MindSphereAppUsersManager";
import { UserTokenRequest } from "../userToken/fetchUserTokenData";

export default async function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let userDataRequest = req as UserTokenRequest;

  let mindSphereScopeValid = MindSphereAppUsersManager.isSuperAdmin(
    userDataRequest.userTokenData
  );

  if (!mindSphereScopeValid)
    return res.status(403).send("Access denied. User must be a super admin!");

  next();
}

import express from "express";
import { MindSphereAppUsersManager } from "../../classes/MindSphereApp/MindSphereAppUsersManager";
import { AppDataRequest } from "../appData/fetchUserAndAppData";

export default async function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let userDataRequest = req as AppDataRequest;

  let mindSphereScopeValid = MindSphereAppUsersManager.hasGlobalAdminScope(
    userDataRequest.userTokenData
  );

  let userPermissionsValid = MindSphereAppUsersManager.hasGlobalAdminRole(
    userDataRequest.userData!
  );

  if (!mindSphereScopeValid || !userPermissionsValid)
    return res.status(403).send("Access denied. User must be a global admin!");

  next();
}
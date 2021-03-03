import express from "express";
import { MindSphereAppUsersManager } from "../../classes/MindSphereApp/MindSphereAppUsersManager";
import { AppDataRequest } from "../appData/fetchUserAndAppData";

export default async function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let userDataRequest = req as AppDataRequest;

  let mindSphereScopeValid =
    MindSphereAppUsersManager.hasGlobalAdminScope(
      userDataRequest.userTokenData
    ) ||
    MindSphereAppUsersManager.hasGlobalUserScope(userDataRequest.userTokenData);

  let userPermissionsValid =
    MindSphereAppUsersManager.hasGlobalAdminRole(userDataRequest.userData!) ||
    MindSphereAppUsersManager.hasGlobalUserRole(userDataRequest.userData!);

  if (!mindSphereScopeValid || !userPermissionsValid)
    return res
      .status(403)
      .send("Access denied. User must be a global user or global admin!");

  next();
}

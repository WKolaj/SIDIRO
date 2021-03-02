import express from "express";
import { MindSphereAppUsersManager } from "../../classes/MindSphereApp/MindSphereAppUsersManager";
import { UserDataRequest } from "../userData/fetchUserData";

export default async function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let userDataRequest = req as UserDataRequest;

  let mindSphereScopeValid =
    MindSphereAppUsersManager.hasGlobalAdminScope(
      userDataRequest.userTokenData
    ) ||
    MindSphereAppUsersManager.hasLocalAdminScope(userDataRequest.userTokenData);

  let userPermissionsValid =
    MindSphereAppUsersManager.hasGlobalAdminRole(userDataRequest.userData!) ||
    MindSphereAppUsersManager.hasLocalAdminRole(userDataRequest.userData!);

  if (!mindSphereScopeValid || !userPermissionsValid)
    return res
      .status(403)
      .send("Access denied. User must be a global admin or local admin!");

  next();
}

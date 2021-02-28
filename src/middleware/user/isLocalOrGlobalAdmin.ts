import express, { Request } from "express";
import { config } from "node-config-ts";
import { UserRole } from "../../classes/MindSphereApp/MindSphereApp";
import { UserDataRequest } from "./fetchUserData";
import { MindSphereAppUsersManager } from "../../classes/MindSphereApp/MindSphereAppUsersManager";

export default async function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let userDataRequest = req as UserDataRequest;

  let mindSphereScopeValid =
    MindSphereAppUsersManager.hasGlobalAdminScope(userDataRequest.user) ||
    MindSphereAppUsersManager.hasLocalAdminScope(userDataRequest.user);

  let userPermissionsValid =
    MindSphereAppUsersManager.hasGlobalAdminRole(userDataRequest.userData!) ||
    MindSphereAppUsersManager.hasLocalAdminRole(userDataRequest.userData!);

  if (!mindSphereScopeValid || !userPermissionsValid)
    return res
      .status(403)
      .send("Access denied. User must be a global admin or local admin!");

  next();
}

import express, { Request } from "express";
import { config } from "node-config-ts";
import { UserRole } from "../../classes/MindSphereApp/MindSphereApp";
import { UserDataRequest } from "./fetchUserData";

export default async function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let userDataRequest = req as UserDataRequest;

  let mindSphereScopeValid =
    userDataRequest.user.scope.includes(
      config.userPermissions.globalUserRole
    ) ||
    userDataRequest.user.scope.includes(config.userPermissions.localUserRole);

  let userPermissionsValid =
    userDataRequest.userData?.permissions.role === UserRole.GlobalUser ||
    userDataRequest.userData?.permissions.role === UserRole.LocalUser;

  if (!mindSphereScopeValid || !userPermissionsValid)
    return res
      .status(403)
      .send("Access denied. User must be a global user or local user!");

  next();
}

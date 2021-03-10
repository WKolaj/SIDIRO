import express from "express";
import { MindSphereApp } from "../../classes/MindSphereApp/MindSphereApp";
import { AppDataRequest } from "../appData/fetchUserAndAppData";

export default async function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let userDataRequest = req as AppDataRequest;

  let mindSphereScopeValid =
    MindSphereApp.hasGlobalAdminScope(userDataRequest.userTokenData) ||
    MindSphereApp.hasGlobalUserScope(userDataRequest.userTokenData);

  let userPermissionsValid =
    MindSphereApp.hasGlobalAdminRole(userDataRequest.userData!) ||
    MindSphereApp.hasGlobalUserRole(userDataRequest.userData!);

  if (!mindSphereScopeValid || !userPermissionsValid)
    return res
      .status(403)
      .send("Access denied. User must be a global user or global admin!");

  next();
}

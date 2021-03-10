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
    MindSphereApp.hasLocalAdminScope(userDataRequest.userTokenData);

  let userPermissionsValid =
    MindSphereApp.hasGlobalAdminRole(userDataRequest.userData!) ||
    MindSphereApp.hasLocalAdminRole(userDataRequest.userData!);

  if (!mindSphereScopeValid || !userPermissionsValid)
    return res
      .status(403)
      .send("Access denied. User must be a global admin or local admin!");

  next();
}

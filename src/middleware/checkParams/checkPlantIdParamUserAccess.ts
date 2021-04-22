import express from "express";
import { MindSphereApp } from "../../classes/MindSphereApp/MindSphereApp";
import { AppDataRequest } from "../appData/fetchUserAndAppData";

export default async function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let appDataRequest = req as AppDataRequest<{
    plantId: string;
    appId: string;
  }>;

  //#region ========== CHECKING IF USER HAS ACCESS TO PLANT - BY GLOBAL ADMIN/USER OR BY LOCAL PERMISSIONS ==========

  let hasGlobalPermissions =
    MindSphereApp.hasGlobalAdminRole(appDataRequest.userData!) ||
    MindSphereApp.hasGlobalUserRole(appDataRequest.userData!);

  let hasLocalPermissions =
    MindSphereApp.isLocalAdminOfPlant(
      req.params.plantId,
      appDataRequest.userData!
    ) ||
    MindSphereApp.isLocalUserOfPlant(
      req.params.plantId,
      appDataRequest.userData!
    );

  if (!hasGlobalPermissions && !hasLocalPermissions)
    return res.status(404).send("Plant does not exist!");

  //#endregion ========== CHECKING IF USER HAS ACCESS TO PLANT - BY GLOBAL ADMIN OR BY LOCAL PERMISSIONS ==========

  next();
}

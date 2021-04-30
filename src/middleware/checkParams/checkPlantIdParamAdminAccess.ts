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

  //#region ========== CHECKING IF ADMIN HAS ACCESS TO PLANT - BY GLOBAL ADMIN/USER OR BY LOCAL PERMISSIONS ==========

  let hasGlobalPermissions = MindSphereApp.hasGlobalAdminRole(
    appDataRequest.userData!
  );

  let hasLocalPermissions = MindSphereApp.isLocalAdminOfPlant(
    req.params.plantId,
    appDataRequest.userData!
  );

  if (!hasGlobalPermissions && !hasLocalPermissions)
    return res.status(404).send("Plant does not exist!");

  //#endregion ========== CHECKING IF ADMIN HAS ACCESS TO PLANT - BY GLOBAL ADMIN OR BY LOCAL PERMISSIONS ==========

  //Checking id plant exists
  let plantData = await appDataRequest.appInstance!.getPlantData(
    req.params.plantId
  );

  if (plantData == null) return res.status(404).send("Plant does not exist!");

  next();
}

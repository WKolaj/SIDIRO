import express from "express";
import { PlantPermissions } from "../../classes/MindSphereApp/MindSphereApp";
import { MindSphereAppUsersManager } from "../../classes/MindSphereApp/MindSphereAppUsersManager";
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

  //Checking if user is admin for plant
  if (
    !MindSphereAppUsersManager.isAdminOfPlant(
      appDataRequest.params.plantId,
      appDataRequest.userData!
    )
  )
    return res
      .status(403)
      .send("Access denied. User has no admin permissions to given plant!");

  next();
}

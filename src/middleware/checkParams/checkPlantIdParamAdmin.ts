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

  //Checking if user is admin for plant
  if (
    !MindSphereApp.isLocalAdminOfPlant(
      appDataRequest.params.plantId,
      appDataRequest.userData!
    )
  )
    return res
      .status(403)
      .send("Access denied. User has no admin permissions to given plant!");

  next();
}

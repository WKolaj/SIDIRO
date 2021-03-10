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

  //Checking if user is admin or user for plant
  if (
    !MindSphereApp.hasLocalAccessToPlant(
      appDataRequest.params.plantId,
      appDataRequest.userData!
    )
  )
    return res
      .status(403)
      .send("Access denied. User has no permissions to given plant!");

  next();
}

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

  //Checking if app exists for the user of the plant
  if (
    appDataRequest.userData?.permissions.plants[
      appDataRequest.params.plantId
    ] == null
  )
    return res.status(404).send("Plant of given id not found!");

  //Checking if user is admin or user for plant - also returning 404 in order not to show the difference between not having access to the app and trying to access app that does not exist
  if (
    !MindSphereApp.hasLocalAccessToPlant(
      appDataRequest.params.plantId,
      appDataRequest.userData!
    )
  )
    return res.status(404).send("Plant of given id not found!");

  next();
}

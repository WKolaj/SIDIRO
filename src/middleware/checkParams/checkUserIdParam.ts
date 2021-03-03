import express from "express";
import { AppDataRequest } from "../appData/fetchUserAndAppData";
import { MindSphereAppsManager } from "../../classes/MindSphereApp/MindSphereAppsManager";

export default async function(
  req: express.Request<{ appId: string; userId: string }>,
  res: express.Response,
  next: express.NextFunction
) {
  let appDataRequest = req as AppDataRequest<{ appId: string; userId: string }>;

  let userApp = await MindSphereAppsManager.getInstance().getApp(
    appDataRequest.params.appId
  );

  //Checking if user is assigned to the app
  let userIsAssigned = await userApp.UsersManager.isUserAssignedToApp(
    appDataRequest.params.userId
  );

  if (!userIsAssigned)
    return res
      .status(403)
      .send(
        `Access denied. User ${appDataRequest.params.userId} is not assigned to the app!`
      );

  //Checking if user is created in MindSphere
  let userExists = await userApp.UsersManager.checkIfUserIsCreatedInMindSphere(
    appDataRequest.params.userId
  );

  if (!userExists)
    return res
      .status(404)
      .send(`User ${appDataRequest.params.userId} not found in given tenant!`);

  next();
}

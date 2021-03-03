import express from "express";
import { MindSphereAppUsersManager } from "../../classes/MindSphereApp/MindSphereAppUsersManager";
import { TokenRequest } from "../tokenData/fetchTokenData";

export default async function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let userDataRequest = req as TokenRequest;

  if (userDataRequest.userTokenData.subtenant != null)
    return res.status(403).send("Subtenant users cannot access this route!");

  next();
}

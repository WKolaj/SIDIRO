import express from "express";
import { MindSphereApp } from "../../classes/MindSphereApp/MindSphereApp";
import { TokenRequest } from "../tokenData/fetchTokenData";

export default async function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let userDataRequest = req as TokenRequest;

  let mindSphereScopeValid = MindSphereApp.isSuperAdmin(
    userDataRequest.userTokenData
  );

  if (!mindSphereScopeValid)
    return res.status(403).send("Access denied. User must be a super admin!");

  next();
}

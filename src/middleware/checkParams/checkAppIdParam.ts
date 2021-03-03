import express, { Request } from "express";
import { AppDataRequest } from "../appData/fetchUserAndAppData";

export default async function(
  req: express.Request<{ appId: string }>,
  res: express.Response,
  next: express.NextFunction
) {
  let appDataRequest = req as AppDataRequest<{ appId: string }>;

  //Checking if app id from params and from user credentails are the same
  if (
    appDataRequest.appId == null ||
    appDataRequest.appId !== appDataRequest.params.appId
  )
    return res
      .status(403)
      .send("Access denied. No access to given application!");

  next();
}

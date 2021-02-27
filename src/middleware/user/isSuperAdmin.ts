import express, { Request } from "express";
import { config } from "node-config-ts";
import { UserRequest } from "./fetchUser";

export default async function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let userDataRequest = req as UserRequest;

  let mindSphereScopeValid = userDataRequest.user.scope.includes(
    config.userPermissions.superAdminRole
  );

  if (!mindSphereScopeValid)
    return res.status(403).send("Access denied. User must be a super admin!");

  next();
}

import express from "express";
import fetchUser, { UserRequest } from "../middleware/fetchUser";
const router = express.Router();

export type ReturnedUser = {
  scope: string[];
  client_id: string;
  user_id: string;
  user_name: string;
  email: string;
  ten: string;
  subtenant?: string;
};

router.get("/me", fetchUser, function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let userRequest = req as UserRequest;
  let userToReturn: ReturnedUser = {
    client_id: userRequest.user.client_id,
    email: userRequest.user.email,
    scope: userRequest.user.scope,
    ten: userRequest.user.ten,
    user_id: userRequest.user.user_id,
    user_name: userRequest.user.user_name,
  };

  if (userRequest.user.subtenant != null)
    userToReturn.subtenant = userRequest.user.subtenant;

  return res.status(200).send(userToReturn);
});

export default router;

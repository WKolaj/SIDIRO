import express from "express";
import fetchUserTokenData, {
  UserTokenRequest,
} from "../middleware/userToken/fetchUserTokenData";
const router = express.Router();

export type ReturnedUser = {
  scope: string[];
  client_id: string;
  user_name: string;
  email: string;
  ten: string;
  subtenant?: string;
};

router.get("/me", fetchUserTokenData, function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let userRequest = req as UserTokenRequest;
  let userToReturn: ReturnedUser = {
    client_id: userRequest.userTokenData.client_id,
    email: userRequest.userTokenData.email,
    scope: userRequest.userTokenData.scope,
    ten: userRequest.userTokenData.ten,
    user_name: userRequest.userTokenData.user_name,
  };

  if (userRequest.userTokenData.subtenant != null)
    userToReturn.subtenant = userRequest.userTokenData.subtenant;

  return res.status(200).send(userToReturn);
});

export default router;

import express from "express";
import fetchTokenData, {
  TokenRequest,
} from "../middleware/tokenData/fetchTokenData";
import { applyJSONParsingToRoute } from "../utilities/utilities";
const router = express.Router();

export type ReturnedUser = {
  scope: string[];
  client_id: string;
  user_name: string;
  email: string;
  ten: string;
  subtenant?: string;
};

//Applying json error validation for these routes
applyJSONParsingToRoute(router);

router.get("/me", fetchTokenData, function(
  req: express.Request,
  res: express.Response
) {
  let userRequest = req as TokenRequest;
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

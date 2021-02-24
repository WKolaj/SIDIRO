import express from "express";
import fetchAppId, { AppRequest } from "../middleware/fetchAppId";
import fetchUser, { UserRequest } from "../middleware/fetchUser";
const router = express.Router();

router.get("/me", fetchUser, fetchAppId, function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let appRequest = req as AppRequest;

  return res.status(200).send({ app_id: appRequest.appId });
});

export default router;

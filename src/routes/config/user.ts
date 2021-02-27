import express from "express";
import checkAppIdParam from "../../middleware/app/checkAppIdParam";
import fetchAppId, { AppRequest } from "../../middleware/app/fetchAppId";
import fetchUser from "../../middleware/user/fetchUser";
import fetchUserData, {
  UserDataRequest,
} from "../../middleware/user/fetchUserData";
import isGlobalAdmin from "../../middleware/user/isGlobalAdmin";
import { MindSphereAppsManager } from "../../classes/MindSphereApp/MindSphereAppsManager";
import { UserStorageData } from "../../classes/MindSphereApp/MindSphereApp";
import { joiValidator } from "../../middleware/validation/joiValidate";
import { validateUserCreate } from "../../models/App/User/User";
import {
  MindSphereUserData,
  MindSphereUserService,
} from "../../classes/MindSphereService/MindSphereUserService";
import { MindSphereAssetService } from "../../classes/MindSphereService/MindSphereAssetService";
import { config } from "node-config-ts";

const router = express.Router();

export interface UserPayload extends UserStorageData {
  userId: string;
}

const normalizeUserPayload = function(
  userId: string,
  userPayload: UserStorageData
): UserPayload {
  return {
    ...userPayload,
    userId: userId,
  };
};

const normalizeUsersPayload = function(userPayload: {
  [userId: string]: UserStorageData;
}): { [userId: string]: UserPayload } {
  let payloadToReturn: { [userId: string]: UserPayload } = {};

  for (let userId of Object.keys(userPayload)) {
    payloadToReturn[userId] = { ...userPayload[userId], userId: userId };
  }

  return payloadToReturn;
};

router.get("/me", fetchUser, fetchAppId, fetchUserData, async function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let appDataRequest = req as UserDataRequest;

  return res
    .status(200)
    .send(
      normalizeUserPayload(
        appDataRequest.user.user_id,
        appDataRequest.userData!
      )
    );
});

router.get(
  "/global/:appId",
  fetchUser,
  fetchAppId,
  checkAppIdParam,
  fetchUserData,
  isGlobalAdmin,
  async function(
    req: express.Request<{ appId: string }>,
    res: express.Response,
    next: express.NextFunction
  ) {
    let appToGetTheUser = await MindSphereAppsManager.getInstance().getApp(
      req.params.appId
    );

    let usersOfGivenApp = await appToGetTheUser.getAllUsers();

    return res.status(200).send(normalizeUsersPayload(usersOfGivenApp));
  }
);

router.get(
  "/global/:appId/:userId",
  fetchUser,
  fetchAppId,
  checkAppIdParam,
  fetchUserData,
  isGlobalAdmin,
  async function(
    req: express.Request<{ appId: string; userId: string }>,
    res: express.Response,
    next: express.NextFunction
  ) {
    let appToGetTheUser = await MindSphereAppsManager.getInstance().getApp(
      req.params.appId
    );

    let usersOfGivenApp = await appToGetTheUser.getUserData(req.params.userId);

    if (usersOfGivenApp == null) return res.status(404).send("User not found!");

    return res
      .status(200)
      .send(normalizeUserPayload(req.params.userId, usersOfGivenApp));
  }
);

router.post(
  "/global/:appId",
  fetchUser,
  fetchAppId,
  checkAppIdParam,
  fetchUserData,
  isGlobalAdmin,
  joiValidator(validateUserCreate),
  async function(
    req: express.Request<{ appId: string }, any, UserStorageData>,
    res: express.Response,
    next: express.NextFunction
  ) {
    let userRequest = req as UserDataRequest<
      { appId: string },
      any,
      UserStorageData
    >;

    //Id of user to operate on files
    let userId: string | null = null;
    let usersWithTheSameName = await MindSphereUserService.getInstance().getAllUsers(
      userRequest.user.ten,
      null,
      null,
      userRequest.body.email
    );

    if (usersWithTheSameName.length < 1) {
      console.log("creating user...");
      //User does not exist - create the user
      let userCreatePayload: MindSphereUserData = {
        active: true,
        name: {},
        userName: userRequest.body.email,
      };

      if (userRequest.user.subtenant != null) {
        userCreatePayload.subtenants = [
          {
            id: userRequest.user.subtenant,
          },
        ];
      }

      let createdUser = await MindSphereUserService.getInstance().createUser(
        userRequest.user.ten,
        userCreatePayload
      );

      userId = createdUser.id!;
    } else {
      console.log(`user already created!`);
      //User already exists - just get his id
      userId = usersWithTheSameName[0].id!;
    }

    console.log(userId);

    let appToCreateTheUser = await MindSphereAppsManager.getInstance().getApp(
      userRequest.params.appId
    );

    await appToCreateTheUser.setUserData(userId, userRequest.body);

    return res.status(200).send(normalizeUserPayload(userId, userRequest.body));
  }
);

export default router;

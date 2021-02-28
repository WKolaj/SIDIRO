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
import { validateUser } from "../../models/App/User/User";
import checkUserIdParam from "../../middleware/user/checkUserIdParam";

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
  checkUserIdParam,
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

    let userOfTheApp = await appToGetTheUser.getUserData(req.params.userId);

    return res
      .status(200)
      .send(normalizeUserPayload(req.params.userId, userOfTheApp!));
  }
);

router.post(
  "/global/:appId",
  fetchUser,
  fetchAppId,
  checkAppIdParam,
  fetchUserData,
  isGlobalAdmin,
  joiValidator(validateUser),
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

    let appToCreateTheUser = await MindSphereAppsManager.getInstance().getApp(
      userRequest.params.appId
    );

    //Checking if user of given email exists and return if it already exists
    let userExists = await appToCreateTheUser.UsersManager.checkIfUserIsCreatedInMindSphere(
      null,
      userRequest.body.email
    );

    if (userExists)
      return res
        .status(400)
        .send(`User of email: ${userRequest.body.email} - already exists!`);

    //Creating user in mindsphere and in storage
    let createdUser = await appToCreateTheUser.UsersManager.createUser(
      userRequest.body
    );

    //Returning created user
    return res
      .status(200)
      .send(normalizeUserPayload(createdUser.msData.id!, userRequest.body));
  }
);

router.delete(
  "/global/:appId/:userId",
  fetchUser,
  fetchAppId,
  checkAppIdParam,
  checkUserIdParam,
  fetchUserData,
  isGlobalAdmin,
  async function(
    req: express.Request<{ appId: string; userId: string }>,
    res: express.Response,
    next: express.NextFunction
  ) {
    let userRequest = req as UserDataRequest<{ appId: string; userId: string }>;

    let appToDeleteTheUser = await MindSphereAppsManager.getInstance().getApp(
      userRequest.params.appId
    );

    let userToDeleteStorageData = await appToDeleteTheUser.getUserData(
      userRequest.params.userId
    );

    if (userToDeleteStorageData == null)
      return res
        .status(404)
        .send(`User of id: ${userRequest.params.userId} does not exist!`);

    //Deleting user
    await appToDeleteTheUser.UsersManager.deleteUser(userRequest.params.userId);

    //Returning created user
    return res
      .status(200)
      .send(
        normalizeUserPayload(userRequest.params.userId, userToDeleteStorageData)
      );
  }
);

router.put(
  "/global/:appId/:userId",
  fetchUser,
  fetchAppId,
  checkAppIdParam,
  checkUserIdParam,
  fetchUserData,
  isGlobalAdmin,
  joiValidator(validateUser),
  async function(
    req: express.Request<
      { appId: string; userId: string },
      any,
      UserStorageData
    >,
    res: express.Response,
    next: express.NextFunction
  ) {
    let userRequest = req as UserDataRequest<
      { appId: string; userId: string },
      any,
      UserStorageData
    >;

    let appToUpdateTheUser = await MindSphereAppsManager.getInstance().getApp(
      userRequest.params.appId
    );

    let userToUpdateStorageData = await appToUpdateTheUser.getUserData(
      userRequest.params.userId
    );

    if (userToUpdateStorageData == null)
      return res
        .status(404)
        .send(`User of id: ${userRequest.params.userId} does not exist!`);

    let updatedUser = await appToUpdateTheUser.UsersManager.updateUser(
      userRequest.params.userId,
      req.body
    );

    //Returning created user
    return res
      .status(200)
      .send(
        normalizeUserPayload(userRequest.params.userId, updatedUser.storageData)
      );
  }
);

export default router;

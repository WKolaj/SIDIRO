import express from "express";
import checkAppIdParam from "../../middleware/checkParams/checkAppIdParam";
import fetchAppId from "../../middleware/appData/fetchAppData";
import fetchUserData, {
  UserDataRequest,
} from "../../middleware/userData/fetchUserData";
import isGlobalAdmin from "../../middleware/authorization/isGlobalAdmin";
import { MindSphereAppsManager } from "../../classes/MindSphereApp/MindSphereAppsManager";
import { UserStorageData } from "../../classes/MindSphereApp/MindSphereApp";
import { joiValidator } from "../../middleware/validation/joiValidate";
import { validateUser } from "../../models/App/User/User";
import checkUserIdParam from "../../middleware/checkParams/checkUserIdParam";
import fetchUserTokenData from "../../middleware/userToken/fetchUserTokenData";
import fetchAppData from "../../middleware/appData/fetchAppData";

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

router.get(
  "/me",
  fetchUserTokenData,
  fetchAppData,
  fetchUserData,
  async function(req: express.Request, res: express.Response) {
    let appDataRequest = req as UserDataRequest;

    return res
      .status(200)
      .send(
        normalizeUserPayload(appDataRequest.userId!, appDataRequest.userData!)
      );
  }
);

router.get(
  "/global/:appId",
  fetchUserTokenData,
  fetchAppData,
  checkAppIdParam,
  fetchUserData,
  isGlobalAdmin,
  async function(
    req: express.Request<{ appId: string }>,
    res: express.Response
  ) {
    let userDataReq = req as UserDataRequest<{ appId: string }>;

    let usersOfGivenApp = await userDataReq.appData!.getAllUsers();

    return res.status(200).send(normalizeUsersPayload(usersOfGivenApp));
  }
);

router.get(
  "/global/:appId/:userId",
  fetchUserTokenData,
  fetchAppData,
  checkAppIdParam,
  fetchUserData,
  isGlobalAdmin,
  async function(
    req: express.Request<{ appId: string; userId: string }>,
    res: express.Response
  ) {
    let userDataReq = req as UserDataRequest<{ appId: string; userId: string }>;

    let userToReturn = await userDataReq.appData!.getUserData(
      req.params.userId
    );

    if (userToReturn == null) return res.status(404).send("User not found!");

    return res
      .status(200)
      .send(normalizeUserPayload(req.params.userId, userToReturn!));
  }
);

router.post(
  "/global/:appId",
  fetchUserTokenData,
  fetchAppData,
  checkAppIdParam,
  fetchUserData,
  isGlobalAdmin,
  joiValidator(validateUser),
  async function(
    req: express.Request<{ appId: string }, any, UserStorageData>,
    res: express.Response
  ) {
    let userRequest = req as UserDataRequest<
      { appId: string },
      any,
      UserStorageData
    >;

    //Checking if user of given email exists and return if it already exists
    let userExists = await userRequest.appData!.UsersManager.checkIfUserIsCreatedInMindSphere(
      null,
      userRequest.body.email
    );

    if (userExists)
      return res
        .status(400)
        .send(`User of email: ${userRequest.body.email} - already exists!`);

    //Creating user in mindsphere and in storage
    let createdUser = await userRequest.appData!.UsersManager.createUser(
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
  fetchUserTokenData,
  fetchAppData,
  checkAppIdParam,
  fetchUserData,
  isGlobalAdmin,
  async function(
    req: express.Request<{ appId: string; userId: string }>,
    res: express.Response,
    next: express.NextFunction
  ) {
    let userRequest = req as UserDataRequest<{ appId: string; userId: string }>;

    let userToDeleteStorageData = await userRequest.appData!.getUserData(
      userRequest.params.userId
    );

    if (userToDeleteStorageData == null)
      return res
        .status(404)
        .send(`User of id: ${userRequest.params.userId} does not exist!`);

    //Deleting user
    await userRequest.appData!.UsersManager.deleteUser(
      userRequest.params.userId
    );

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
  fetchUserTokenData,
  fetchAppData,
  checkAppIdParam,
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

    let userToUpdateStorageData = await userRequest.appData!.getUserData(
      userRequest.params.userId
    );

    if (userToUpdateStorageData == null)
      return res
        .status(404)
        .send(`User of id: ${userRequest.params.userId} does not exist!`);

    let updatedUser = await userRequest.appData!.UsersManager.updateUser(
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

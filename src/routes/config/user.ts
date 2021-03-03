import express from "express";
import checkAppIdParam from "../../middleware/checkParams/checkAppIdParam";
import isGlobalAdmin from "../../middleware/authorization/isGlobalAdmin";
import { UserStorageData } from "../../classes/MindSphereApp/MindSphereApp";
import { joiValidator } from "../../middleware/validation/joiValidate";
import { validateUser } from "../../models/App/User/User";
import fetchTokenData from "../../middleware/tokenData/fetchTokenData";
import fetchUserAndAppData, {
  AppDataRequest,
} from "../../middleware/appData/fetchUserAndAppData";
import isNotSubtenant from "../../middleware/authorization/isNotSubtenant";

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

router.get("/me", fetchTokenData, fetchUserAndAppData, async function(
  req: express.Request,
  res: express.Response
) {
  let appDataRequest = req as AppDataRequest;

  return res
    .status(200)
    .send(
      normalizeUserPayload(appDataRequest.userId!, appDataRequest.userData!)
    );
});

router.get(
  "/global/:appId",
  fetchTokenData,
  fetchUserAndAppData,
  checkAppIdParam,
  isGlobalAdmin,
  async function(
    req: express.Request<{ appId: string }>,
    res: express.Response
  ) {
    let userDataReq = req as AppDataRequest<{ appId: string }>;

    let usersOfGivenApp = await userDataReq.appInstance!.getAllUsers();

    return res.status(200).send(normalizeUsersPayload(usersOfGivenApp));
  }
);

router.get(
  "/global/:appId/:userId",
  fetchTokenData,
  fetchUserAndAppData,
  checkAppIdParam,
  isGlobalAdmin,
  async function(
    req: express.Request<{ appId: string; userId: string }>,
    res: express.Response
  ) {
    let userDataReq = req as AppDataRequest<{ appId: string; userId: string }>;

    let userToReturn = await userDataReq.appInstance!.getUserData(
      req.params.userId
    );

    if (userToReturn == null) return res.status(404).send("User not found!");

    return res
      .status(200)
      .send(normalizeUserPayload(req.params.userId, userToReturn!));
  }
);

//Subtenants cannot access this route - they cannot create new users
router.post(
  "/global/:appId",
  fetchTokenData,
  fetchUserAndAppData,
  checkAppIdParam,
  isGlobalAdmin,
  isNotSubtenant,
  joiValidator(validateUser),
  async function(
    req: express.Request<{ appId: string }, any, UserStorageData>,
    res: express.Response
  ) {
    let userRequest = req as AppDataRequest<
      { appId: string },
      any,
      UserStorageData
    >;

    //Checking if user of given email exists and return if it already exists
    let userExists = await userRequest.appInstance!.UsersManager.checkIfUserIsCreatedInMindSphere(
      null,
      userRequest.body.email
    );

    if (userExists)
      return res
        .status(400)
        .send(`User of email: ${userRequest.body.email} - already exists!`);

    //Creating user in mindsphere and in storage
    let createdUser = await userRequest.appInstance!.UsersManager.createUser(
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
  fetchTokenData,
  fetchUserAndAppData,
  checkAppIdParam,
  isGlobalAdmin,
  async function(
    req: express.Request<{ appId: string; userId: string }>,
    res: express.Response
  ) {
    let userRequest = req as AppDataRequest<{ appId: string; userId: string }>;

    let userToDeleteStorageData = await userRequest.appInstance!.getUserData(
      userRequest.params.userId
    );

    if (userToDeleteStorageData == null)
      return res
        .status(404)
        .send(`User of id: ${userRequest.params.userId} does not exist!`);

    //Deleting user
    await userRequest.appInstance!.UsersManager.deleteUser(
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
  fetchTokenData,
  fetchUserAndAppData,
  checkAppIdParam,
  isGlobalAdmin,
  joiValidator(validateUser),
  async function(
    req: express.Request<
      { appId: string; userId: string },
      any,
      UserStorageData
    >,
    res: express.Response
  ) {
    let userRequest = req as AppDataRequest<
      { appId: string; userId: string },
      any,
      UserStorageData
    >;

    let userToUpdateStorageData = await userRequest.appInstance!.getUserData(
      userRequest.params.userId
    );

    if (userToUpdateStorageData == null)
      return res
        .status(404)
        .send(`User of id: ${userRequest.params.userId} does not exist!`);

    let updatedUser = await userRequest.appInstance!.UsersManager.updateUser(
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

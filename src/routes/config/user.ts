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
import checkPlantIdParamUserOrAdmin from "../../middleware/checkParams/checkPlantIdParamUserOrAdmin";
import isLocalOrGlobalAdmin from "../../middleware/authorization/isLocalOrGlobalAdmin";
import checkPlantIdParamAdmin from "../../middleware/checkParams/checkPlantIdParamAdmin";
import { applyJSONParsingToRoute } from "../../utilities/utilities";
import { MindSphereAppUsersManager } from "../../classes/MindSphereApp/MindSphereAppUsersManager";
import isGlobalUserOrAdmin from "../../middleware/authorization/isGlobalUserOrAdmin";

const router = express.Router();

export interface UserPayload extends UserStorageData {
  userId: string;
  appId: string;
}

const normalizeGlobalUserPayload = function(
  appId: string,
  userId: string,
  userPayload: UserStorageData
): UserPayload {
  return {
    ...userPayload,
    userId: userId,
    appId: appId,
  };
};

const normalizeGlobalUsersPayload = function(
  appId: string,
  usersPayload: {
    [userId: string]: UserStorageData;
  }
): { [userId: string]: UserPayload } {
  let payloadToReturn: { [userId: string]: UserPayload } = {};

  for (let userId of Object.keys(usersPayload)) {
    payloadToReturn[userId] = normalizeGlobalUserPayload(
      appId,
      userId,
      usersPayload[userId]
    );
  }

  return payloadToReturn;
};

const normalizeLocalUserPayload = function(
  appId: string,
  userId: string,
  plantId: string,
  userPayload: UserStorageData
): UserPayload {
  //Returning only permissions for given plant - leaving the rest
  return {
    ...userPayload,
    data: {
      [plantId]: userPayload.data[plantId],
    },
    config: {
      [plantId]: userPayload.config[plantId],
    },
    permissions: {
      ...userPayload.permissions,
      plants: {
        [plantId]: userPayload.permissions.plants[plantId],
      },
    },
    userId: userId,
    appId: appId,
  };
};

const normalizeLocalUsersPayload = function(
  appId: string,
  plantId: string,
  usersPayload: {
    [userId: string]: UserStorageData;
  }
): { [userId: string]: UserPayload } {
  //Returning only permissions for given plant - leaving the rest
  let payloadToReturn: { [userId: string]: UserPayload } = {};

  for (let userId of Object.keys(usersPayload)) {
    payloadToReturn[userId] = normalizeLocalUserPayload(
      appId,
      userId,
      plantId,
      usersPayload[userId]
    );
  }

  return payloadToReturn;
};

const isValidLocalPayload = function(
  plantId: string,
  userPayload: UserStorageData
): boolean {
  //Checking if only one plant exists and it is exactly given plant id

  //permissions:
  if (
    Object.keys(userPayload.permissions.plants).length !== 1 ||
    userPayload.permissions.plants[plantId] == null
  )
    return false;

  //data:
  if (
    Object.keys(userPayload.data).length !== 1 ||
    userPayload.data[plantId] == null
  )
    return false;

  //config:
  if (
    Object.keys(userPayload.config).length !== 1 ||
    userPayload.config[plantId] == null
  )
    return false;

  //If permissions, data and config are ok, payload is ok
  return true;
};

//Applying json error validation for these routes
applyJSONParsingToRoute(router);

//#region ========== ME ROUTES ==========

router.get("/me", fetchTokenData, fetchUserAndAppData, async function(
  req: express.Request,
  res: express.Response
) {
  let appDataRequest = req as AppDataRequest;

  return res
    .status(200)
    .send(
      normalizeGlobalUserPayload(
        appDataRequest.appId!,
        appDataRequest.userId!,
        appDataRequest.userData!
      )
    );
});

//#endregion ========== ME ROUTES ==========

//#region ========== GLOBAL ROUTES ==========

router.get(
  "/global/:appId",
  fetchTokenData,
  fetchUserAndAppData,
  checkAppIdParam,
  isGlobalUserOrAdmin,
  async function(
    req: express.Request<{ appId: string }>,
    res: express.Response
  ) {
    let userDataReq = req as AppDataRequest<{ appId: string }>;

    let usersOfGivenApp = await userDataReq.appInstance!.getAllUsers();

    return res
      .status(200)
      .send(
        normalizeGlobalUsersPayload(userDataReq.params.appId, usersOfGivenApp)
      );
  }
);

router.get(
  "/global/:appId/:userId",
  fetchTokenData,
  fetchUserAndAppData,
  checkAppIdParam,
  isGlobalUserOrAdmin,
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
      .send(
        normalizeGlobalUserPayload(
          userDataReq.params.appId,
          req.params.userId,
          userToReturn!
        )
      );
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
      .send(
        normalizeGlobalUserPayload(
          userRequest.params.appId,
          createdUser.msData.id!,
          userRequest.body
        )
      );
  }
);

//Subtenants cannot access this route - they cannot delete users
router.delete(
  "/global/:appId/:userId",
  fetchTokenData,
  fetchUserAndAppData,
  checkAppIdParam,
  isGlobalAdmin,
  isNotSubtenant,
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
        normalizeGlobalUserPayload(
          userRequest.params.appId,
          userRequest.params.userId,
          userToDeleteStorageData
        )
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

    if (req.body.email !== userToUpdateStorageData.email)
      return res.status(400).send(`Users email cannot be modified!`);

    let updatedUser = await userRequest.appInstance!.UsersManager.updateUser(
      userRequest.params.userId,
      req.body
    );

    //Returning created user
    return res
      .status(200)
      .send(
        normalizeGlobalUserPayload(
          userRequest.params.appId,
          userRequest.params.userId,
          updatedUser.storageData
        )
      );
  }
);

//#endregion ========== GLOBAL ROUTES ==========

//#region ========== LOCAL ROUTES ==========

router.get(
  "/local/:appId/:plantId",
  fetchTokenData,
  fetchUserAndAppData,
  checkAppIdParam,
  isLocalOrGlobalAdmin,
  checkPlantIdParamAdmin,
  async function(
    req: express.Request<{ appId: string; plantId: string }>,
    res: express.Response
  ) {
    let userDataReq = req as AppDataRequest<{ appId: string; plantId: string }>;

    //#region ========== GETTING ALL USERS ==========

    //Getting all users
    let usersOfGivenApp = await userDataReq.appInstance!.getAllUsers();

    //#endregion ========== GETTING ALL USERS ==========

    //#region ========== FILTERING USERS ==========

    //Filtering users - getting only users where there are permissions to given plant
    let usersPayloadToReturn: { [userId: string]: UserStorageData } = {};

    for (let userId of Object.keys(usersOfGivenApp)) {
      let userPayload = usersOfGivenApp[userId];
      if (userPayload.permissions.plants[req.params.plantId] != null)
        usersPayloadToReturn[userId] = userPayload;
    }

    //#endregion ========== FILTERING USERS ==========

    return res
      .status(200)
      .send(
        normalizeLocalUsersPayload(
          userDataReq.params.appId,
          userDataReq.params.plantId,
          usersPayloadToReturn
        )
      );
  }
);

router.get(
  "/local/:appId/:plantId/:userId",
  fetchTokenData,
  fetchUserAndAppData,
  checkAppIdParam,
  isLocalOrGlobalAdmin,
  checkPlantIdParamUserOrAdmin,
  async function(
    req: express.Request<{ appId: string; userId: string; plantId: string }>,
    res: express.Response
  ) {
    let userDataReq = req as AppDataRequest<{
      appId: string;
      plantId: string;
      userId: string;
    }>;

    //#region ========== GETTING RETURNED USER DATA ==========

    //Getting the user
    let userPayload = await userDataReq.appInstance!.getUserData(
      userDataReq.params.userId
    );

    //#endregion ========== GETTING RETURNED USER DATA ==========

    //#region ========== CHECKING IF RETURNED USER EXISTS AND HAS ACCESS TO PLANT ==========

    //Checking if user exists and have access to given plant
    if (
      userPayload == null ||
      !MindSphereAppUsersManager.hasAccessToPlant(
        req.params.plantId,
        userPayload
      )
    )
      return res.status(404).send("User not found!");

    //#endregion ========== CHECKING IF RETURNED USER EXISTS AND HAS ACCESS TO PLANT ==========

    return res
      .status(200)
      .send(
        normalizeLocalUserPayload(
          userDataReq.params.appId,
          req.params.userId,
          req.params.plantId,
          userPayload
        )
      );
  }
);

//Subtenants cannot access this route - they cannot create new users
router.post(
  "/local/:appId/:plantId",
  fetchTokenData,
  fetchUserAndAppData,
  checkAppIdParam,
  isLocalOrGlobalAdmin,
  checkPlantIdParamAdmin,
  isNotSubtenant,
  joiValidator(validateUser),
  async function(
    req: express.Request<{ appId: string; plantId: string }>,
    res: express.Response
  ) {
    let userRequest = req as AppDataRequest<
      { appId: string; plantId: string },
      any,
      UserStorageData
    >;

    //#region =========== CHECKING IF USER PAYLOAD IS VALID LOCAL PAYLOAD (with only one plant's data) ===========

    if (!isValidLocalPayload(req.params.plantId, req.body))
      return res
        .status(400)
        .send(`Cannot create user with access to different plants locally!`);

    //#endregion =========== CHECKING IF USER PAYLOAD IS VALID LOCAL PAYLOAD (with only one plant data) ===========

    //#region =========== CHECKING IF CREATED USER IS LOCAL NOT GLOBAL ===========

    if (
      MindSphereAppUsersManager.hasGlobalAdminRole(req.body) ||
      MindSphereAppUsersManager.hasGlobalUserRole(req.body)
    )
      return res
        .status(400)
        .send(`Cannot create user with global access locally!`);

    //#endregion =========== CHECKING IF CREATED USER IS LOCAL NOT GLOBAL ===========

    //#region =========== CHECKING IF CREATED USER ALREADY EXISTS IN MINDSPHERE ===========

    //Checking if user of given email exists and return if it already exists
    let userExists = await userRequest.appInstance!.UsersManager.checkIfUserIsCreatedInMindSphere(
      null,
      userRequest.body.email
    );

    if (userExists)
      return res
        .status(400)
        .send(`User of email: ${userRequest.body.email} - already exists!`);

    //#endregion =========== CHECKING IF CREATED USER ALREADY EXISTS IN MINDSPHERE ===========

    //#region =========== CREATING USER ===========

    //Creating user in mindsphere and in storage
    let createdUser = await userRequest.appInstance!.UsersManager.createUser(
      userRequest.body
    );

    //#endregion =========== CREATING USER ===========

    //Returning created user
    return res
      .status(200)
      .send(
        normalizeLocalUserPayload(
          userRequest.params.appId,
          createdUser.msData.id!,
          req.params.appId,
          createdUser.storageData
        )
      );
  }
);

//Subtenants cannot access this route - they cannot delete users
router.delete(
  "/local/:appId/:plantId/:userId",
  fetchTokenData,
  fetchUserAndAppData,
  checkAppIdParam,
  isLocalOrGlobalAdmin,
  checkPlantIdParamAdmin,
  isNotSubtenant,
  async function(
    req: express.Request<{ appId: string; userId: string; plantId: string }>,
    res: express.Response
  ) {
    let userRequest = req as AppDataRequest<{
      appId: string;
      userId: string;
      plantId: string;
    }>;

    //#region ========== CHECKING IF USER EXISTS AND HAS ACCESS TO PLANT ==========

    //Getting the user
    let userToDeleteStorageData = await userRequest.appInstance!.getUserData(
      userRequest.params.userId
    );

    //Returning 404 if user not found or it is not assigned to given app
    if (
      userToDeleteStorageData == null ||
      !MindSphereAppUsersManager.hasAccessToPlant(
        req.params.plantId,
        userToDeleteStorageData
      )
    )
      return res.status(404).send(`User not found!`);

    //#endregion ========== CHECKING IF USER EXISTS AND HAS ACCESS TO PLANT ==========

    //#region ========== CHECKING IF USER IS NOT A GLOBAL USER ==========

    //Checking if user to delete has global permissions
    if (
      MindSphereAppUsersManager.hasGlobalAdminRole(userToDeleteStorageData) ||
      MindSphereAppUsersManager.hasGlobalUserRole(userToDeleteStorageData)
    )
      return res
        .status(400)
        .send(`Cannot delete global admin or global user locally!`);

    //#endregion ========== CHECKING IF USER IS NOT A GLOBAL USER ==========

    //#region ========== DELETING USER OR UPDATING HIM - REMOVING PLANT ID ==========

    //If user exists for more than one plant - don't delete him, just update him and remove actual plant id from his payload
    if (Object.keys(userToDeleteStorageData.permissions.plants).length > 1) {
      //Creating payload without access to plant
      let payloadToEdit: UserStorageData = {
        ...userToDeleteStorageData,
      };
      delete payloadToEdit.config[req.params.plantId];
      delete payloadToEdit.data[req.params.plantId];
      delete payloadToEdit.permissions.plants[req.params.plantId];

      await userRequest.appInstance!.UsersManager.updateUser(
        userRequest.params.userId,
        payloadToEdit
      );
    }
    //If user exists only for this plant - delete him
    else {
      await userRequest.appInstance!.UsersManager.deleteUser(
        userRequest.params.userId
      );
    }

    //#endregion ========== DELETING USER OR UPDATING HIM - REMOVING PLANT ID ==========

    //Returning created user
    return res
      .status(200)
      .send(
        normalizeGlobalUserPayload(
          userRequest.params.appId,
          userRequest.params.userId,
          userToDeleteStorageData
        )
      );
  }
);

router.put(
  "/local/:appId/:plantId/:userId",
  fetchTokenData,
  fetchUserAndAppData,
  checkAppIdParam,
  isLocalOrGlobalAdmin,
  checkPlantIdParamAdmin,
  joiValidator(validateUser),
  async function(
    req: express.Request<
      { appId: string; userId: string; plantId: string },
      any,
      UserStorageData
    >,
    res: express.Response
  ) {
    let userRequest = req as AppDataRequest<
      { appId: string; userId: string; plantId: string },
      any,
      UserStorageData
    >;

    //#region ========== CHECKING IF USER TO EDIT EXISTS AND HAS ACCESS TO PLANT ==========

    let userToEditStorageData = await userRequest.appInstance!.getUserData(
      userRequest.params.userId
    );

    //Returning 404 if user not found or it is not assigned to given app
    if (
      userToEditStorageData == null ||
      !MindSphereAppUsersManager.hasAccessToPlant(
        req.params.plantId,
        userToEditStorageData
      )
    )
      return res.status(404).send(`User not found!`);

    //#endregion ========== CHECKING IF USER TO EDIT EXISTS AND HAS ACCESS TO PLANT ==========

    //#region ========== CHECKING IF USER TO EDIT IS A GLOBAL USER OR ADMIN ==========

    //Checking if user to edit has global permissions
    if (
      MindSphereAppUsersManager.hasGlobalAdminRole(userToEditStorageData) ||
      MindSphereAppUsersManager.hasGlobalUserRole(userToEditStorageData)
    )
      return res
        .status(400)
        .send(`Cannot edit global admin or global user locally!`);

    //#endregion ========== CHECKING IF USER TO EDIT IS A GLOBAL USER OR ADMIN ==========

    //#region =========== CHECKING IF USER EDIT PAYLOAD IS VALID LOCAL PAYLOAD (with only one plant's data) ===========

    if (!isValidLocalPayload(req.params.plantId, req.body))
      return res
        .status(400)
        .send(`Cannot grant users's permission to different plant locally!`);

    //#endregion =========== CHECKING IF USER EDIT PAYLOAD IS VALID LOCAL PAYLOAD (with only one plant's data) ===========

    //#region =========== CHECKING IF THERE IS AN ATTEMPT TO EDIT ROLE OR EMAIL ===========

    if (req.body.email !== userToEditStorageData.email)
      return res.status(400).send(`Users email cannot be deleted!`);

    if (req.body.permissions.role !== userToEditStorageData.permissions.role)
      return res.status(400).send(`Users global role cannot be edited localy!`);

    //#endregion =========== CHECKING IF THERE IS AN ATTEMPT TO EDIT ROLE OR EMAIL ===========

    //#region =========== GENERETING PAYLOAD TO UPDATE - EDITING ONLY VALUES ASSOCIATED WITH THIS PLANT ===========

    let userEditPayload: UserStorageData = { ...userToEditStorageData };
    userEditPayload.config[req.params.plantId] =
      req.body.config[req.params.plantId];
    userEditPayload.data[req.params.plantId] =
      req.body.data[req.params.plantId];
    userEditPayload.permissions.plants[req.params.plantId] =
      req.body.permissions.plants[req.params.plantId];

    //#endregion =========== GENERETING PAYLOAD TO UPDATE - EDITING ONLY VALUES ASSOCIATED WITH THIS PLANT ===========

    //#region =========== EDITING USER ===========

    let editedUser = await userRequest.appInstance!.UsersManager.updateUser(
      req.params.userId,
      userEditPayload
    );

    //#endregion =========== EDITING USER ===========

    //Returning edited user
    return res
      .status(200)
      .send(
        normalizeLocalUserPayload(
          userRequest.params.appId,
          editedUser.msData.id!,
          req.params.appId,
          editedUser.storageData
        )
      );
  }
);

//#endregion ========== LOCAL ROUTES ==========

export default router;

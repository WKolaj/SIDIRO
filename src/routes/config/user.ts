import express from "express";
import checkAppIdParam from "../../middleware/checkParams/checkAppIdParam";
import isGlobalAdmin from "../../middleware/authorization/isGlobalAdmin";
import {
  MindSphereApp,
  UserStorageData,
} from "../../classes/MindSphereApp/MindSphereApp";
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
import {
  applyJSONParsingToRoute,
  areObjectsIdentical,
  cloneObject,
  containsTheSameElements,
} from "../../utilities/utilities";
import isGlobalUserOrAdmin from "../../middleware/authorization/isGlobalUserOrAdmin";
import isUserOrAdmin from "../../middleware/authorization/isUserOrAdmin";

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

router.put(
  "/me",
  fetchTokenData,
  fetchUserAndAppData,
  isUserOrAdmin,
  joiValidator(validateUser),
  async function(
    req: express.Request<any, any, UserStorageData>,
    res: express.Response
  ) {
    let appDataRequest = req as AppDataRequest<any, any, UserStorageData>;

    //#region  ========== CHECKING IF THERE IS ATTEMPT TO EDIT PERMISSIONS OR USER NAME ==========

    //Checking user name
    if (appDataRequest.body.userName !== appDataRequest.userData!.userName)
      return res.status(400).send(`Users name cannot be modified!`);

    //Checking permissions - role
    if (
      appDataRequest.body.permissions.role !==
      appDataRequest.userData!.permissions.role
    )
      return res.status(400).send(`Users role cannot be modified!`);

    //Checking permissions - plants
    if (
      !areObjectsIdentical(
        appDataRequest.body.permissions.plants,
        appDataRequest.userData!.permissions.plants
      )
    )
      return res
        .status(400)
        .send(`Users plant permissions cannot be modified!`);

    //Users config and data do not have to be checked for plant keys - plant keys vs. plant permissions were checked by Joi, and plant permissions cannot be modified

    //#endregion  ========== CHECKING IF THERE IS ATTEMPT TO EDIT PERMISSIONS OR USER NAME ==========

    //#region  ========== UPDATING USERS STORAGE DATA ==========

    let userPayloadToUpdate = { ...appDataRequest.userData! };
    userPayloadToUpdate.data = appDataRequest.body.data;
    userPayloadToUpdate.config = appDataRequest.body.config;

    await appDataRequest.appInstance!.setUserData(
      appDataRequest.userId!,
      userPayloadToUpdate
    );

    //#endregion  ========== UPDATING USERS STORAGE DATA ==========

    return res
      .status(200)
      .send(
        normalizeGlobalUserPayload(
          appDataRequest.appId!,
          appDataRequest.userId!,
          userPayloadToUpdate
        )
      );
  }
);

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

    //#region  ========== GETTING ALL USERS OF GIVEN APP ==========

    let usersOfGivenApp = await userDataReq.appInstance!.getAllUsersData();

    //#endregion  ========== GETTING ALL USERS OF GIVEN APP ==========

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

    //#region  ========== GETTING USER'S DATA AND CHECKING IF IT EXISTS ==========

    let userToReturn = await userDataReq.appInstance!.getUserData(
      req.params.userId
    );

    if (userToReturn == null) return res.status(404).send("User not found!");

    //#endregion  ========== GETTING USER'S DATA AND CHECKING IF IT EXISTS ==========

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

router.post(
  "/global/:appId",
  fetchTokenData,
  fetchUserAndAppData,
  checkAppIdParam,
  isGlobalAdmin,
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

    //#region  ========== CHECKING IF USER OF GIVEN USER NAME ALREADY EXISTS ==========

    //Checking if user of given user name exists and return if it already exists
    let userExists = await userRequest.appInstance!.userExistsInTenant(
      userRequest.body.userName
    );

    if (userExists)
      return res
        .status(400)
        .send(
          `User of user name: ${userRequest.body.userName} - already exists!`
        );

    //#endregion  ========== CHECKING IF USER OF GIVEN USER NAME ALREADY EXISTS ==========

    //#region  ========== CHECKING IF MAX NUMBER OF USERS WILL EXCEED LIMIT ==========

    let numberOfUsers = Object.keys(
      await userRequest.appInstance!.getAllUsersData()
    ).length;
    let maxNumberOfUsers = await userRequest.appInstance!.getMaxNumberOfUsers();

    //if max number of users is set to null - there is no user limitation
    if (maxNumberOfUsers != null && numberOfUsers + 1 > maxNumberOfUsers)
      return res
        .status(400)
        .send(`Max number of users: ${maxNumberOfUsers} reached`);

    //#endregion  ========== CHECKING IF MAX NUMBER OF USERS WILL EXCEED LIMIT ==========

    //#region  ========== CREATING NEW USER ==========

    //Creating user in mindsphere and in storage
    let createdUser = await userRequest.appInstance!.createUser(
      userRequest.body
    );

    //#endregion  ========== CREATING NEW USER ==========

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

    //#region  ========== CHECKING IF USER EXISTS ==========

    let userToDeleteStorageData = await userRequest.appInstance!.getUserData(
      userRequest.params.userId
    );

    if (userToDeleteStorageData == null)
      return res
        .status(404)
        .send(`User of id: ${userRequest.params.userId} does not exist!`);

    //Checking if user exists in tenant
    let userExistsInTenant = await userRequest.appInstance!.userExistsInTenant(
      userToDeleteStorageData.userName
    );

    if (!userExistsInTenant)
      return res
        .status(404)
        .send(
          `User of name: ${userToDeleteStorageData.userName} does not exist in tenant!`
        );

    //#endregion  ========== CHECKING IF USER EXISTS ==========

    //#region  ========== DELETING USER ==========

    //Deleting user
    await userRequest.appInstance!.deleteUser(userRequest.params.userId);

    //#endregion  ========== DELETING USER ==========

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

    //#region  ========== CHECKING IF USER EXISTS ==========

    let userToUpdateStorageData = await userRequest.appInstance!.getUserData(
      userRequest.params.userId
    );

    if (userToUpdateStorageData == null)
      return res
        .status(404)
        .send(`User of id: ${userRequest.params.userId} does not exist!`);

    let userExistsInTenant = await userRequest.appInstance!.userExistsInTenant(
      userToUpdateStorageData.userName
    );

    if (!userExistsInTenant)
      return res
        .status(404)
        .send(
          `User of name: ${userToUpdateStorageData.userName} does not exist in tenant!`
        );

    //#endregion  ========== CHECKING IF USER EXISTS ==========

    //#region  ========== CHECKING IF THERE IS AN ATTEMPT TO CHANGE USER'S NAME ==========

    if (req.body.userName !== userToUpdateStorageData.userName)
      return res.status(400).send(`Users name cannot be modified!`);

    //#endregion  ========== CHECKING IF THERE IS AN ATTEMPT TO CHANGE USER'S NAME ==========

    //#region  ========== UPDATING USER ==========

    let updatedUser = await userRequest.appInstance!.updateUser(
      userRequest.params.userId,
      req.body
    );

    //#endregion  ========== UPDATING USER ==========

    //Returning updated user
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
    let usersOfGivenApp = await userDataReq.appInstance!.getAllUsersData();

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
  checkPlantIdParamAdmin,
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
      !MindSphereApp.hasLocalAccessToPlant(req.params.plantId, userPayload)
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

router.post(
  "/local/:appId/:plantId",
  fetchTokenData,
  fetchUserAndAppData,
  checkAppIdParam,
  isLocalOrGlobalAdmin,
  checkPlantIdParamAdmin,
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
      MindSphereApp.hasGlobalAdminRole(req.body) ||
      MindSphereApp.hasGlobalUserRole(req.body)
    )
      return res
        .status(400)
        .send(`Cannot create user with global access locally!`);

    //#endregion =========== CHECKING IF CREATED USER IS LOCAL NOT GLOBAL ===========

    //#region =========== CHECKING IF CREATED USER ALREADY EXISTS IN MINDSPHERE ===========

    //Checking if user of given name exists and return if it already exists
    let userExists = await userRequest.appInstance!.userExistsInTenant(
      userRequest.body.userName
    );

    if (userExists)
      return res
        .status(400)
        .send(`User of name: ${userRequest.body.userName} - already exists!`);

    //#endregion =========== CHECKING IF CREATED USER ALREADY EXISTS IN MINDSPHERE ===========

    //#region  ========== CHECKING IF MAX NUMBER OF USERS WILL EXCEED LIMIT ==========

    let numberOfUsers = Object.keys(
      await userRequest.appInstance!.getAllUsersData()
    ).length;
    let maxNumberOfUsers = await userRequest.appInstance!.getMaxNumberOfUsers();

    //if max number of users is set to null - there is no user limitation
    if (maxNumberOfUsers != null && numberOfUsers + 1 > maxNumberOfUsers)
      return res
        .status(400)
        .send(`Max number of users: ${maxNumberOfUsers} reached`);

    //#endregion  ========== CHECKING IF MAX NUMBER OF USERS WILL EXCEED LIMIT ==========

    //#region =========== CREATING USER ===========

    //Creating user in mindsphere and in storage
    let createdUser = await userRequest.appInstance!.createUser(
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
          req.params.plantId,
          createdUser.storageData
        )
      );
  }
);

router.delete(
  "/local/:appId/:plantId/:userId",
  fetchTokenData,
  fetchUserAndAppData,
  checkAppIdParam,
  isLocalOrGlobalAdmin,
  checkPlantIdParamAdmin,
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
      !MindSphereApp.hasLocalAccessToPlant(
        req.params.plantId,
        userToDeleteStorageData
      )
    )
      return res.status(404).send(`User not found!`);

    //Checking if user exists in tenant
    let userExistsInTenant = await userRequest.appInstance!.userExistsInTenant(
      userToDeleteStorageData.userName
    );

    if (!userExistsInTenant)
      return res
        .status(404)
        .send(
          `User of name: ${userToDeleteStorageData.userName} does not exist in tenant!`
        );

    //#endregion ========== CHECKING IF USER EXISTS AND HAS ACCESS TO PLANT ==========

    //#region ========== CHECKING IF USER IS NOT A GLOBAL USER ==========

    //Checking if user to delete has global permissions
    if (
      MindSphereApp.hasGlobalAdminRole(userToDeleteStorageData) ||
      MindSphereApp.hasGlobalUserRole(userToDeleteStorageData)
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

      await userRequest.appInstance!.updateUser(
        userRequest.params.userId,
        payloadToEdit
      );
    }
    //If user exists only for this plant - delete him
    else {
      await userRequest.appInstance!.deleteUser(userRequest.params.userId);
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
      !MindSphereApp.hasLocalAccessToPlant(
        req.params.plantId,
        userToEditStorageData
      )
    )
      return res.status(404).send(`User not found!`);

    //Checking if user exists in tenant
    let userExistsInTenant = await userRequest.appInstance!.userExistsInTenant(
      userToEditStorageData.userName
    );

    if (!userExistsInTenant)
      return res
        .status(404)
        .send(
          `User of name: ${userToEditStorageData.userName} does not exist in tenant!`
        );

    //#endregion ========== CHECKING IF USER TO EDIT EXISTS AND HAS ACCESS TO PLANT ==========

    //#region ========== CHECKING IF USER TO EDIT IS A GLOBAL USER OR ADMIN ==========

    //Checking if user to edit has global permissions
    if (
      MindSphereApp.hasGlobalAdminRole(userToEditStorageData) ||
      MindSphereApp.hasGlobalUserRole(userToEditStorageData)
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

    //#region =========== CHECKING IF THERE IS AN ATTEMPT TO EDIT ROLE, NAME OR PLANT PERMISSIONS ===========

    if (req.body.userName !== userToEditStorageData.userName)
      return res.status(400).send(`Users userName cannot be edited!`);

    if (req.body.permissions.role !== userToEditStorageData.permissions.role)
      return res.status(400).send(`Users global role cannot be edited localy!`);

    //LOCAL PLANT PERMISSIONS CHANGE SHOULD BE FORBIDDEN - IN ORDER TO PREVENT LOCAL ADMIN'S TO PROMOTE THEIRSELFES TO ADMINS FOR PLANT'S WHERE THEY HAVE ONLY USER ACCESS SET BY GLOBAL ADMINS
    if (
      req.body.permissions.plants[req.params.plantId] !==
      userToEditStorageData.permissions.plants[req.params.plantId]
    )
      return res.status(400).send(`Plant permissions cannot be edited localy!`);

    //#endregion =========== CHECKING IF THERE IS AN ATTEMPT TO EDIT ROLE OR NAME ===========

    //#region =========== GENERETING PAYLOAD TO UPDATE - EDITING ONLY VALUES ASSOCIATED WITH THIS PLANT ===========

    //Cloning object - allowing for a longer calculation, due to the fact that update user data is really rare
    let userEditPayload: UserStorageData = cloneObject(userToEditStorageData);

    userEditPayload.config[req.params.plantId] =
      req.body.config[req.params.plantId];
    userEditPayload.data[req.params.plantId] =
      req.body.data[req.params.plantId];
    userEditPayload.permissions.plants[req.params.plantId] =
      req.body.permissions.plants[req.params.plantId];

    //#endregion =========== GENERETING PAYLOAD TO UPDATE - EDITING ONLY VALUES ASSOCIATED WITH THIS PLANT ===========

    //#region =========== EDITING USER ===========

    let editedUser = await userRequest.appInstance!.updateUser(
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
          req.params.plantId,
          editedUser.storageData
        )
      );
  }
);

//#endregion ========== LOCAL ROUTES ==========

export default router;

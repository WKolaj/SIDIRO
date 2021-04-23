import express from "express";
import {
  AppStorageData,
  MindSphereApp,
} from "../../classes/MindSphereApp/MindSphereApp";
import fetchTokenData from "../../middleware/tokenData/fetchTokenData";
import fetchUserAndAppData, {
  AppDataRequest,
} from "../../middleware/appData/fetchUserAndAppData";
import { applyJSONParsingToRoute } from "../../utilities/utilities";
import isUserOrAdmin from "../../middleware/authorization/isUserOrAdmin";
import isGlobalAdmin from "../../middleware/authorization/isGlobalAdmin";
import { joiValidator } from "../../middleware/validation/joiValidate";
import { validateApp } from "../../models/App/App/App";
import CustomServiceManager, {
  CustomServiceConfig,
  CustomServiceData,
} from "../../classes/CustomService/CustomServiceManager";
import CustomService from "../../classes/CustomService/CustomService";
import checkAndFetchServiceId, {
  CustomServiceRequest,
} from "../../middleware/service/fetchService";
import checkPlantIdParamLocalUserAccess from "../../middleware/checkParams/checkPlantIdParamLocalUserAccess";
import { validateCustomService } from "../../models/CustomService/CustomService";
import isLocalOrGlobalAdmin from "../../middleware/authorization/isLocalOrGlobalAdmin";
import checkPlantIdParamAdminAccess from "../../middleware/checkParams/checkPlantIdParamAdminAccess";
import checkPlantIdParamUserAccess from "../../middleware/checkParams/checkPlantIdParamUserAccess";
import NotificationManager, {
  SubscriberPayload,
} from "../../classes/NotificationManager/NotificationManager";
import webpush from "web-push";
import { validateSubscription } from "../../models/Subscription/Subscription";

const router = express.Router();

//Applying json error validation for these routes
applyJSONParsingToRoute(router);

//#region ========== ME ROUTES ==========

router.get(
  "/me/:plantId/:serviceId",
  fetchTokenData,
  fetchUserAndAppData,
  isUserOrAdmin,
  checkPlantIdParamUserAccess,
  checkAndFetchServiceId,
  joiValidator(validateSubscription),
  async function(
    req: express.Request<{ plantId: string }>,
    res: express.Response
  ) {
    let customServiceReq = req as CustomServiceRequest<
      { plantId: string; serviceId: string },
      boolean,
      SubscriberPayload
    >;

    let isSubscribed = await NotificationManager.getInstance().checkIfSubscriberExists(
      customServiceReq.serviceInstance.ID,
      customServiceReq.body.subscriptionData,
      customServiceReq.userId!
    );

    return res.status(200).send(isSubscribed);
  }
);

router.post(
  "/me/:plantId/:serviceId",
  fetchTokenData,
  fetchUserAndAppData,
  isUserOrAdmin,
  checkPlantIdParamUserAccess,
  checkAndFetchServiceId,
  joiValidator(validateSubscription),
  async function(
    req: express.Request<{ plantId: string }>,
    res: express.Response
  ) {
    let customServiceReq = req as CustomServiceRequest<
      { plantId: string; serviceId: string },
      boolean,
      SubscriberPayload
    >;

    //Checking if userId in body and from decodedToken are the same
    if (customServiceReq.body.userId !== customServiceReq.userId!)
      return res
        .status(400)
        .send(`"userId" has to be the same as user who access the app`);

    let isSubscribed = await NotificationManager.getInstance().checkIfSubscriberExists(
      customServiceReq.serviceInstance.ID,
      customServiceReq.body.subscriptionData,
      customServiceReq.userId!
    );

    if (isSubscribed) return res.status(400).send("User already subscribed!");

    await NotificationManager.getInstance().addSubscriber(
      customServiceReq.serviceInstance.ID,
      customServiceReq.body
    );

    return res.status(200).send("Subscription added succesfully!");
  }
);

router.delete(
  "/me/:plantId/:serviceId",
  fetchTokenData,
  fetchUserAndAppData,
  isUserOrAdmin,
  checkPlantIdParamUserAccess,
  checkAndFetchServiceId,
  joiValidator(validateSubscription),
  async function(
    req: express.Request<{ plantId: string }>,
    res: express.Response
  ) {
    let customServiceReq = req as CustomServiceRequest<
      { plantId: string; serviceId: string },
      boolean,
      SubscriberPayload
    >;

    let isSubscribed = await NotificationManager.getInstance().checkIfSubscriberExists(
      customServiceReq.serviceInstance.ID,
      customServiceReq.body.subscriptionData,
      customServiceReq.userId!
    );

    if (!isSubscribed) return res.status(400).send("Subscriber does not exist");

    await NotificationManager.getInstance().removeSubscriber(
      customServiceReq.serviceInstance.ID,
      customServiceReq.body.subscriptionData,
      customServiceReq.userId!
    );

    return res.status(200).send("Subscription deleted succesfully!");
  }
);

//#endregion ========== ME ROUTES ==========

export default router;

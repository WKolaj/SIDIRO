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

const router = express.Router();

export interface ServicePayload {
  data: CustomServiceData;
  config: CustomServiceConfig;
}

const normalizeServicesPayload = async function(
  services: CustomService<any, any>[]
): Promise<ServicePayload[]> {
  let servicesToReturn: ServicePayload[] = [];

  for (let service of services) {
    let payload = await normalizeServicePayload(service);
    servicesToReturn.push(payload);
  }

  return servicesToReturn;
};

const normalizeServicePayload = async function(
  service: CustomService<any, any>
): Promise<ServicePayload> {
  let data = await service.getData();
  let config = await service.getConfig();

  return {
    data,
    config,
  };
};

//Applying json error validation for these routes
applyJSONParsingToRoute(router);

//#region ========== ME ROUTES ==========

router.get(
  "/me/:plantId",
  fetchTokenData,
  fetchUserAndAppData,
  isUserOrAdmin,
  checkPlantIdParamUserAccess,
  async function(
    req: express.Request<{ plantId: string }>,
    res: express.Response
  ) {
    let appDataReq = req as AppDataRequest<
      { plantId: string },
      any,
      ServicePayload
    >;

    //#region ========== GETTING SERVICES TO RETURN ==========

    let services = await CustomServiceManager.getInstance().getAllServices(
      null,
      appDataReq.appId!,
      req.params.plantId
    );

    //#endregion ========== GETTING SERVICES TO RETURN ==========

    let payloadToReturn = await normalizeServicesPayload(services);

    return res.status(200).send(payloadToReturn);
  }
);

router.get(
  "/me/:plantId/:serviceId",
  fetchTokenData,
  fetchUserAndAppData,
  isUserOrAdmin,
  checkPlantIdParamUserAccess,
  checkAndFetchServiceId,
  async function(
    req: express.Request<{ plantId: string; serviceId: string }>,
    res: express.Response
  ) {
    let customServiceReq = req as CustomServiceRequest<
      { plantId: string; serviceId: string },
      any,
      ServicePayload
    >;

    //Proper access to service was insured by checkAndFetchServiceId middleware

    let payloadToReturn = await normalizeServicePayload(
      customServiceReq.serviceInstance!
    );

    return res.status(200).send(payloadToReturn);
  }
);

router.put(
  "/me/:plantId/:serviceId",
  fetchTokenData,
  fetchUserAndAppData,
  isLocalOrGlobalAdmin,
  checkAndFetchServiceId,
  checkPlantIdParamAdminAccess,
  joiValidator(validateCustomService),
  async function(
    req: express.Request<{ plantId: string; serviceId: string }>,
    res: express.Response
  ) {
    let customServiceReq = req as CustomServiceRequest<
      { plantId: string; serviceId: string },
      ServicePayload,
      CustomServiceConfig
    >;

    //#region ========== ADVANCED CHECKING IF SERVICE PAYLOAD IS VALID ==========

    let validationResult = customServiceReq.serviceInstance!.validateNewConfig(
      customServiceReq.body
    );
    if (validationResult) return res.status(400).send(validationResult);

    //#endregion ========== CHECKING IF SERVICE PAYLOAD IS VALID ==========

    //#region ========== SETTING NEW CONFIG ==========

    await customServiceReq.serviceInstance.setConfig(req.body);

    //#endregion ========== SETTING NEW CONFIG ==========

    let payloadToReturn = await normalizeServicePayload(
      customServiceReq.serviceInstance!
    );

    return res.status(200).send(payloadToReturn);
  }
);

router.post(
  "/me/:plantId",
  fetchTokenData,
  fetchUserAndAppData,
  isLocalOrGlobalAdmin,
  checkPlantIdParamAdminAccess,
  joiValidator(validateCustomService),
  async function(
    req: express.Request<{ plantId: string; serviceId: string }>,
    res: express.Response
  ) {
    let customServiceReq = req as CustomServiceRequest<
      { plantId: string; serviceId: string },
      ServicePayload,
      CustomServiceConfig
    >;

    //#region ========== CHECKING ID, AppID and PlantID ==========

    if (customServiceReq.body.id != null)
      return res
        .status(400)
        .send(`id cannot be specified when creating the service`);

    if (customServiceReq.body.appId !== customServiceReq.appId)
      return res.status(400).send(`cannot create service for different app!`);

    if (customServiceReq.body.plantId !== customServiceReq.params.plantId)
      return res.status(400).send(`cannot create service for different plant!`);

    //#endregion ========== CHECKING ID, AppID and PlantID ==========

    let id = await CustomServiceManager.getInstance().createService(
      customServiceReq.body
    );

    let payloadToReturn = {
      ...req.body,
      id: id,
    };

    return res.status(200).send(payloadToReturn);
  }
);

router.delete(
  "/me/:plantId/:serviceId",
  fetchTokenData,
  fetchUserAndAppData,
  isLocalOrGlobalAdmin,
  checkAndFetchServiceId,
  checkPlantIdParamAdminAccess,
  async function(
    req: express.Request<{ plantId: string; serviceId: string }>,
    res: express.Response
  ) {
    let customServiceReq = req as CustomServiceRequest<
      { plantId: string; serviceId: string },
      ServicePayload,
      CustomServiceConfig
    >;

    //#region ========== CREATING PAYLOAD TO RETURN ==========

    let payloadToReturn = await normalizeServicePayload(
      customServiceReq.serviceInstance!
    );

    //#endregion ========== CREATING PAYLOAD TO RETURN ==========

    //#region ========== REMOVING SERVICE MANAGER ==========

    await CustomServiceManager.getInstance().removeService(
      customServiceReq.serviceInstance.ID
    );

    //#endregion ========== REMOVING SERVICE MANAGER ==========

    return res.status(200).send(payloadToReturn);
  }
);

//#endregion ========== ME ROUTES ==========

export default router;

import express from "express";
import checkAppIdParam from "../../middleware/checkParams/checkAppIdParam";
import {
  MindSphereApp,
  PlantStorageData,
} from "../../classes/MindSphereApp/MindSphereApp";
import fetchTokenData from "../../middleware/tokenData/fetchTokenData";
import fetchUserAndAppData, {
  AppDataRequest,
} from "../../middleware/appData/fetchUserAndAppData";
import { applyJSONParsingToRoute } from "../../utilities/utilities";
import isUserOrAdmin from "../../middleware/authorization/isUserOrAdmin";
import checkPlantIdParamUserOrAdmin from "../../middleware/checkParams/checkPlantIdParamLocalUserAccess";
import isGlobalAdmin from "../../middleware/authorization/isGlobalAdmin";
import { joiValidator } from "../../middleware/validation/joiValidate";
import { validatePlant } from "../../models/App/Plant/Plant";
import isLocalOrGlobalAdmin from "../../middleware/authorization/isLocalOrGlobalAdmin";
import checkPlantIdParamAdmin from "../../middleware/checkParams/checkPlantIdParamLocalAdminAccess";
import isGlobalUserOrAdmin from "../../middleware/authorization/isGlobalUserOrAdmin";
import checkPlantIdParamUserAccess from "../../middleware/checkParams/checkPlantIdParamUserAccess";
import checkPlantIdParamAdminAccess from "../../middleware/checkParams/checkPlantIdParamAdminAccess";

const router = express.Router();

export interface PlantPayload extends PlantStorageData {
  plantId: string;
  appId: string;
}

const normalizePlantPayload = function(
  appId: string,
  plantId: string,
  plantPayload: PlantStorageData
): PlantPayload {
  return {
    ...plantPayload,
    plantId: plantId,
    appId: appId,
  };
};

const normalizePlantsPayload = function(
  appId: string,
  plantsPayload: { [plantId: string]: PlantStorageData }
): { [plantId: string]: PlantPayload } {
  let payloadToReturn: { [plantId: string]: PlantPayload } = {};

  for (let plantId of Object.keys(plantsPayload)) {
    payloadToReturn[plantId] = normalizePlantPayload(
      appId,
      plantId,
      plantsPayload[plantId]
    );
  }

  return payloadToReturn;
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
      PlantPayload
    >;

    //#region ========== GETTING PLANT DATA AND CHECKING IF IT EXISTS ==========

    let plantData = await appDataReq.appInstance!.getPlantData(
      req.params.plantId
    );

    if (plantData == null) return res.status(404).send("Plant does not exist!");

    //#endregion ========== GETTING PLANT DATA AND CHECKING IF IT EXISTS ==========

    return res
      .status(200)
      .send(
        normalizePlantPayload(
          appDataReq.appId!,
          appDataReq.params.plantId,
          plantData
        )
      );
  }
);

router.put(
  "/me/:plantId",
  fetchTokenData,
  fetchUserAndAppData,
  isLocalOrGlobalAdmin,
  checkPlantIdParamAdminAccess,
  joiValidator(validatePlant),
  async function(
    req: express.Request<{ plantId: string }>,
    res: express.Response
  ) {
    let appDataReq = req as AppDataRequest<
      { plantId: string },
      any,
      PlantPayload
    >;

    //#region ========== CHECKING IF THERE IS AN ATTEMPT TO CHANGE PLANT ID ==========

    if (req.params.plantId !== appDataReq.body.plantId)
      return res.status(400).send("Plant id cannot be changed!");

    //#endregion ========== CHECKING IF THERE IS AN ATTEMPT TO CHANGE PLANT ID ==========

    //#region ========== UPDATING PLANT DATA ==========

    let payloadToUpdate: PlantStorageData = {
      data: appDataReq.body.data,
      config: appDataReq.body.config,
    };

    await appDataReq.appInstance!.setPlantData(
      req.params.plantId,
      payloadToUpdate
    );

    //#endregion ========== UPDATING PLANT DATA ==========

    return res
      .status(200)
      .send(
        normalizePlantPayload(
          appDataReq.appId!,
          appDataReq.params.plantId,
          payloadToUpdate
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
    req: express.Request<{ appId: string; plantId: string }>,
    res: express.Response
  ) {
    let appDataReq = req as AppDataRequest<{ appId: string; plantId: string }>;

    //#region ========== GETTING ALL PLANTS DATA ==========

    let allPlants = await appDataReq.appInstance!.getAllPlantsData();

    return res
      .status(200)
      .send(normalizePlantsPayload(req.params.appId, allPlants));
  }
);

router.get(
  "/global/:appId/:plantId",
  fetchTokenData,
  fetchUserAndAppData,
  checkAppIdParam,
  isGlobalUserOrAdmin,
  async function(
    req: express.Request<{ appId: string; plantId: string }>,
    res: express.Response
  ) {
    let appDataReq = req as AppDataRequest<{ appId: string; plantId: string }>;

    //#region ========== GETTING PLANT DATA AND CHECKING IF IT EXISTS ==========

    let plantData = await appDataReq.appInstance!.getPlantData(
      req.params.plantId
    );

    if (plantData == null) return res.status(404).send("Plant data not found!");

    //#endregion ========== GETTING PLANT DATA AND CHECKING IF IT EXISTS ==========

    return res
      .status(200)
      .send(
        normalizePlantPayload(req.params.appId, req.params.plantId, plantData)
      );
  }
);

router.post(
  "/global/:appId",
  fetchTokenData,
  fetchUserAndAppData,
  checkAppIdParam,
  isGlobalAdmin,
  joiValidator(validatePlant),
  async function(
    req: express.Request<{ appId: string }>,
    res: express.Response
  ) {
    let appDataReq = req as AppDataRequest<
      { appId: string },
      any,
      PlantPayload
    >;

    //#region ========== CHECKING IF PLANT OF GIVEN ID ALREADY EXISTS ==========

    let plantData = await appDataReq.appInstance!.getPlantData(
      appDataReq.body.plantId
    );

    if (plantData != null)
      return res.status(400).send("Plant of given id already exists!");

    //#endregion ========== CHECKING IF PLANT OF GIVEN ID ALREADY EXISTS==========

    //#region ========== CREATING PLANT ==========

    let payloadToCreate: PlantStorageData = {
      data: appDataReq.body.data,
      config: appDataReq.body.config,
    };

    await appDataReq.appInstance!.setPlantData(
      appDataReq.body.plantId,
      payloadToCreate
    );

    //#endregion ========== CREATING PLANT ==========

    return res
      .status(200)
      .send(
        normalizePlantPayload(
          req.params.appId,
          appDataReq.body.plantId,
          payloadToCreate
        )
      );
  }
);

router.delete(
  "/global/:appId/:plantId",
  fetchTokenData,
  fetchUserAndAppData,
  checkAppIdParam,
  isGlobalAdmin,
  async function(
    req: express.Request<{ appId: string; plantId: string }>,
    res: express.Response
  ) {
    let appDataReq = req as AppDataRequest<{ appId: string; plantId: string }>;

    //#region ========== GETTING PLANT DATA AND CHECKING IF IT EXISTS ==========

    let plantData = await appDataReq.appInstance!.getPlantData(
      req.params.plantId
    );

    if (plantData == null) return res.status(404).send("Plant data not found!");

    //#endregion ========== GETTING PLANT DATA AND CHECKING IF IT EXISTS ==========

    //#region ========== DELETING PLANT DATA ==========

    await appDataReq.appInstance!.removePlantData(req.params.plantId);

    //#endregion ========== DELETING PLANT DATA ==========

    return res
      .status(200)
      .send(
        normalizePlantPayload(req.params.appId, req.params.plantId, plantData)
      );
  }
);

router.put(
  "/global/:appId/:plantId",
  fetchTokenData,
  fetchUserAndAppData,
  checkAppIdParam,
  isGlobalAdmin,
  joiValidator(validatePlant),
  async function(
    req: express.Request<{ appId: string; plantId: string }>,
    res: express.Response
  ) {
    let appDataReq = req as AppDataRequest<
      { appId: string; plantId: string },
      any,
      PlantPayload
    >;

    //#region ========== CHECKING IF THERE IS AN ATTEMPT TO CHANGE PLANT ID ==========

    if (req.params.plantId !== appDataReq.body.plantId)
      return res.status(400).send("Plant id cannot be changed!");

    //#endregion ========== CHECKING IF THERE IS AN ATTEMPT TO CHANGE PLANT ID ==========

    //#region ========== GETTING PLANT DATA AND CHECKING IF IT EXISTS ==========

    let plantData = await appDataReq.appInstance!.getPlantData(
      req.params.plantId
    );

    if (plantData == null) return res.status(404).send("Plant data not found!");

    //#endregion ========== GETTING PLANT DATA AND CHECKING IF IT EXISTS ==========

    //#region ========== UPDATING PLANT DATA ==========

    let payloadToUpdate: PlantStorageData = {
      data: appDataReq.body.data,
      config: appDataReq.body.config,
    };

    await appDataReq.appInstance!.setPlantData(
      req.params.plantId,
      payloadToUpdate
    );

    //#endregion ========== UPDATING PLANT DATA ==========

    return res
      .status(200)
      .send(
        normalizePlantPayload(
          req.params.appId,
          req.params.plantId,
          payloadToUpdate
        )
      );
  }
);

//#endregion ========== GLOBAL ROUTES ==========

//#region ========== LOCAL ROUTES ==========

router.get(
  "/local/:appId",
  fetchTokenData,
  fetchUserAndAppData,
  checkAppIdParam,
  isUserOrAdmin,
  async function(
    req: express.Request<{ appId: string; plantId: string }>,
    res: express.Response
  ) {
    let appDataReq = req as AppDataRequest<{ appId: string; plantId: string }>;

    //#region ========== GETTING ALL PLANTS DATA ==========

    let allPlants = await appDataReq.appInstance!.getAllPlantsData();

    //#endregion ========== GETTING ALL PLANTS DATA ==========

    //#region ========== FILTERING PLANTS DATA - ONLY PLANTS ACCESSIBLE FOR CURRENT USER ==========

    let plantsToReturn: { [plantId: string]: PlantStorageData } = {};

    for (let plantId of Object.keys(allPlants)) {
      let plantData = allPlants[plantId];

      if (MindSphereApp.hasLocalAccessToPlant(plantId, appDataReq.userData!))
        plantsToReturn[plantId] = plantData;
    }

    //#endregion ========== FILTERING PLANTS DATA - ONLY PLANTS ACCESSIBLE FOR CURRENT USER ==========

    return res
      .status(200)
      .send(normalizePlantsPayload(req.params.appId, plantsToReturn));
  }
);

router.get(
  "/local/:appId/:plantId",
  fetchTokenData,
  fetchUserAndAppData,
  checkAppIdParam,
  isUserOrAdmin,
  checkPlantIdParamUserOrAdmin,
  async function(
    req: express.Request<{ appId: string; plantId: string }>,
    res: express.Response
  ) {
    let appDataReq = req as AppDataRequest<{ appId: string; plantId: string }>;

    //#region ========== GETTING PLANT DATA AND CHECKING IF IT EXISTS ==========

    let plantData = await appDataReq.appInstance!.getPlantData(
      req.params.plantId
    );

    if (plantData == null) return res.status(404).send("Plant data not found!");

    //#endregion ========== GETTING PLANT DATA AND CHECKING IF IT EXISTS ==========

    return res
      .status(200)
      .send(
        normalizePlantPayload(req.params.appId, req.params.plantId, plantData)
      );
  }
);

router.put(
  "/local/:appId/:plantId",
  fetchTokenData,
  fetchUserAndAppData,
  checkAppIdParam,
  isLocalOrGlobalAdmin,
  checkPlantIdParamAdmin,
  joiValidator(validatePlant),
  async function(
    req: express.Request<{ appId: string; plantId: string }>,
    res: express.Response
  ) {
    let appDataReq = req as AppDataRequest<
      { appId: string; plantId: string },
      any,
      PlantPayload
    >;

    //#region ========== GETTING PLANT DATA AND CHECKING IF IT EXISTS ==========

    let plantData = await appDataReq.appInstance!.getPlantData(
      req.params.plantId
    );

    if (plantData == null) return res.status(404).send("Plant data not found!");

    //#endregion ========== GETTING PLANT DATA AND CHECKING IF IT EXISTS ==========

    //#region ========== CHECKING IF THERE IS AN ATTEMPT TO CHANGE PLANT ID ==========

    if (req.params.plantId !== appDataReq.body.plantId)
      return res.status(400).send("Plant id cannot be changed!");

    //#endregion ========== CHECKING IF THERE IS AN ATTEMPT TO CHANGE PLANT ID ==========

    //#region ========== UPDATING PLANT DATA ==========

    let payloadToUpdate: PlantStorageData = {
      data: appDataReq.body.data,
      config: appDataReq.body.config,
    };

    await appDataReq.appInstance!.setPlantData(
      req.params.plantId,
      payloadToUpdate
    );

    //#endregion ========== UPDATING PLANT DATA ==========

    return res
      .status(200)
      .send(
        normalizePlantPayload(
          req.params.appId,
          req.params.plantId,
          payloadToUpdate
        )
      );
  }
);

//#endregion ========== LOCAL ROUTES ==========

export default router;

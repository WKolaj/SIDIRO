import express, { Request } from "express";
import { AppDataRequest } from "../appData/fetchUserAndAppData";
import { ParamsDictionary } from "express-serve-static-core";
import { Query } from "express-serve-static-core";
import CustomService from "../../classes/CustomService/CustomService";
import CustomServiceManager, {
  CustomServiceConfig,
  CustomServiceData,
} from "../../classes/CustomService/CustomServiceManager";
import { MindSphereApp } from "../../classes/MindSphereApp/MindSphereApp";

/**
 * @description Type representing data of user after decoding the token
 */
export interface CustomServiceRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query,
  Locals extends Record<string, any> = Record<string, any>
> extends AppDataRequest<P, ResBody, ReqBody, ReqQuery, Locals> {
  serviceInstance: CustomService<CustomServiceConfig, CustomServiceData>;
}

export default async function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let customServiceRequest = req as CustomServiceRequest<{
    serviceId: string;
    plantId: string;
  }>;

  //#region ========== CHECKING PARAMS IF NULL OR UNDEFINED ==========

  if (customServiceRequest.params.serviceId == null)
    return res.status(400).send("Invalid request. No serviceId given!");

  //#endregion ========== CHECKING PARAMS IF NULL OR UNDEFINED ==========

  //#region ========== CHECKING IF SERVICE EXISTS ==========

  let serviceExists = await CustomServiceManager.getInstance().serviceExists(
    customServiceRequest.params.serviceId,
    null,
    customServiceRequest.appId,
    customServiceRequest.params.plantId
  );

  if (!serviceExists) return res.status(404).send("Service not found!");

  //#endregion ========== CHECKING IF SERVICE EXISTS ==========

  //#region ========== GETTING SERVICE ==========

  let service = await CustomServiceManager.getInstance().getService(
    req.params.serviceId
  );

  //#endregion ========== GETTING SERVICE ==========

  //#region ========== CHECKING SERVICE'S PLANT ID AND APP ID ==========

  //Checking is not neccessary - due to checking if service of given plantId and appId check above (assuming that serviceId is unique)
  //Nevertheless - Double-Check access below
  if (
    service.PlantID !== customServiceRequest.params.plantId ||
    service.AppID !== customServiceRequest.appId
  )
    if (!serviceExists) return res.status(404).send("Service not found!");

  //#endregion ========== CHECKING SERVICE'S PLANT ID AND APP ID ==========

  //Assing service if it is valid
  customServiceRequest.serviceInstance = service;

  next();
}

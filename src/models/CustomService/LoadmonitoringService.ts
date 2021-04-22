import Joi from "joi";

export const assetDataSchemaContent = {
  assetId: Joi.string().required(),
  aspectId: Joi.string().required(),
  variableName: Joi.string().required(),
  multiplier: Joi.number().required(),
};

export const assetDataJoiSchema = Joi.object(assetDataSchemaContent);

export const mailDataSchemaContent = {
  email: Joi.string()
    .email()
    .required(),
  language: Joi.string()
    .valid("pl", "en")
    .required(),
};

export const mailDataJoiSchema = Joi.object(mailDataSchemaContent);

export const schemaContent = {
  id: Joi.string().optional(),
  appId: Joi.string().required(),
  plantId: Joi.string().required(),
  sampleTime: Joi.number()
    .min(1)
    .required(),
  serviceType: Joi.string()
    .valid("LoadmonitoringService")
    .required(),
  enabled: Joi.boolean().required(),
  tenant: Joi.string()
    .min(1)
    .required(),
  assetIds: Joi.array()
    .items(assetDataJoiSchema)
    .required(),
  powerLosses: Joi.number().required(),
  alertLimit: Joi.number().required(),
  warningLimit: Joi.number().required(),
  mailingList: Joi.array()
    .items(mailDataJoiSchema)
    .required(),
  interval: Joi.number()
    .min(2)
    .required(),
};

export const joiSchema = Joi.object(schemaContent);

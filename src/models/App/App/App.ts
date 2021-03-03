import Joi from "joi";

export const schemaContent = {
  data: Joi.object()
    .pattern(/.*/, Joi.any())
    .required(),
  config: Joi.object()
    .pattern(/.*/, Joi.any())
    .required(),
  appId: Joi.string()
    .min(1)
    .required(),
};

export const joiSchema = Joi.object(schemaContent);

/**
 * @description method for validating app payload
 * @param payload Payload to validate
 */
export function validateApp(payload: any) {
  return joiSchema.validate(payload);
}

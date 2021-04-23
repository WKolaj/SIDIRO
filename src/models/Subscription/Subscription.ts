import Joi, { string } from "joi";

export const subscriptionSchemaContent = {
  endpoint: Joi.string().required(),
  keys: Joi.object({
    p256dh: Joi.string().required(),
    auth: Joi.string().required(),
  }).required(),
  expirationTime: Joi.allow(null).optional(),
};

export const subscriptionJoiSchema = Joi.object(subscriptionSchemaContent);

export const schemaContent = {
  language: Joi.string()
    .valid("pl", "en")
    .required(),
  subscriptionData: subscriptionJoiSchema,
  userId: Joi.string().required(),
};

export const joiSchema = Joi.object(schemaContent);

/**
 * @description method for validating plant payload
 * @param payload Subscription to validate
 */
export function validateSubscription(payload: any) {
  return joiSchema.validate(payload);
}

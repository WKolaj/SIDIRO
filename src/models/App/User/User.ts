import Joi from "joi";
import {
  PlantPermissions,
  UserRole,
} from "../../../classes/MindSphereApp/MindSphereApp";

export const createSchemaContent = {
  email: Joi.string()
    .email()
    .required(),
  data: Joi.object()
    .default({})
    .optional(),
  config: Joi.object()
    .default({})
    .optional(),
  permissions: Joi.object({
    role: Joi.valid(...Object.values(UserRole)).required(),
    plants: Joi.object().pattern(/.*/, Object.values(PlantPermissions)),
  }),
};

export const joiCreateSchema = Joi.object(createSchemaContent);

/**
 * @description method for validating user payload to create
 * @param payload Payload to validate
 */
export function validateUserCreate(payload: any) {
  return joiCreateSchema.validate(payload);
}

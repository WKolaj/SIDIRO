import Joi from "joi";
import {
  PlantPermissions,
  UserStorageData,
} from "../../../classes/MindSphereApp/MindSphereApp";
import { MindSphereAppUsersManager } from "../../../classes/MindSphereApp/MindSphereAppUsersManager";

/**
 * @description Method for check wether plant permissions are valid vs. role of the user
 * @param userStoragePayload user storage data to check
 */
function checkUserPlantPermissions(userStoragePayload: UserStorageData) {
  //Checking if user should be a local or a global admin
  let shouldBeAdmin =
    Object.values(userStoragePayload.permissions.plants).filter(
      (role) => role === PlantPermissions.Admin
    ).length > 0;

  //If user should not be an admin - no point to check permissions
  if (!shouldBeAdmin) return true;

  //If user should be an admin - check permissions
  return (
    MindSphereAppUsersManager.hasGlobalAdminRole(userStoragePayload) ||
    MindSphereAppUsersManager.hasLocalAdminRole(userStoragePayload)
  );
}

export const schemaContent = {
  email: Joi.string()
    .email()
    .required(),
  data: Joi.object().required(),
  config: Joi.object().required(),
  permissions: Joi.object({
    role: Joi.valid(0, 1, 2, 3).required(),
    plants: Joi.object()
      .pattern(/.*/, Joi.number().valid(0, 1))
      .required(),
  }),
};

export const joiSchema = Joi.object(schemaContent);

/**
 * @description method for validating user payload
 * @param payload Payload to validate
 */
export function validateUser(payload: any) {
  //Validating payload
  const validationResult = joiSchema.validate(payload);
  if (validationResult.error != null) return validationResult;

  //Validating users permissions
  let plantPermissionsOk = checkUserPlantPermissions(payload);
  if (!plantPermissionsOk)
    return {
      error: {
        details: [
          {
            message:
              "Users role should be a local or global admin, if they have administrative permissions for a plant!",
          },
        ],
      },
    };

  return {};
}

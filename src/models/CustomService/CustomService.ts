import { CustomServiceType } from "../../classes/CustomService/CustomServiceManager";
import { joiSchema as loadmonitoringServiceJoiSchema } from "./LoadmonitoringService";

function getJoiSchemaBasedOnType(serviceType: CustomServiceType) {
  switch (serviceType) {
    case CustomServiceType.LoadmonitoringService: {
      return loadmonitoringServiceJoiSchema;
    }
    default:
      return null;
  }
}

/**
 * @description method for validating plant payload
 * @param payload Payload to validate
 */
export function validateCustomService(
  payload: any
): { error?: { details: { message: string }[] } } {
  if (payload.serviceType == null)
    return {
      error: {
        details: [
          {
            message: "serviceType is required",
          },
        ],
      },
    };

  let joiValidator = getJoiSchemaBasedOnType(payload.serviceType);
  if (joiValidator == null)
    return {
      error: {
        details: [
          {
            message: "serviceType is invalid",
          },
        ],
      },
    };

  return joiValidator.validate(payload);
}

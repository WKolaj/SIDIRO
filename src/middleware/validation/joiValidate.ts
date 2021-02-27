import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export type JoiValidatior = (objectToValidate: any) => Joi.ValidationResult;

/**
 * @description Method for validating request body - sending 400 to client if there was an error
 * @param {Object} validator Method that return {error:errortext} in case there was an rror during validation, or empty object otherwise
 */
export const joiValidator = function(validator: JoiValidatior) {
  return (req: Request, res: Response, next: NextFunction) => {
    //Validating body with validator method
    const { error } = validator(req.body);

    //Sending error to customer if exists - joi will store it inside error.details[0].message
    if (error) return res.status(400).send(error.details[0].message);

    //Calling next middleware if there was no error
    next();
  };
};

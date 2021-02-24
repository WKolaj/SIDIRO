import { Request, Response, NextFunction } from "express";
import logger from "../logger/logger";

export default function(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(err.message, err);
  return res.status(500).send("Ups.. Something fails..");
}

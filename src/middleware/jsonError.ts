import { NextFunction, Request, Response } from "express";

export default function(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err) {
    return res.status(400).send("Invalid request content");
  }

  next();
}

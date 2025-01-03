import { NextFunction, Request, Response } from "express";
import logger from "../config/logger.js";

function errorHandler(
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction,
) {
  logger.error(err, "Api");
  res.internalError();
  next();
}

export default errorHandler;

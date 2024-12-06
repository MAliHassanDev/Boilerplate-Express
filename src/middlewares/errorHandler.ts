import { NextFunction,Request,Response } from "express";
import logger from "../config/logger.js";
import apiResponse from "../utils/apiResponse.js";

function errorHandler(
  err: Error,
  _:Request,
  res: Response,
  next: NextFunction
) {
  logger.error(err, "Api");
  apiResponse.internalError(res);
  next();
}


export default errorHandler;

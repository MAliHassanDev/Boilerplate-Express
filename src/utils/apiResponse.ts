import { Response } from "express";
import {
  API_RESPONSE_MESSAGES,
  ApiResponseCode,
  BadRequestErrorCode,
  CreatedSuccessCode,
  InternalServerErrorCode,
  NotFoundErrorCode,
  OkSuccessCode,
  UnAuthorizedErrorCode,
} from "./apiResponseMessages.js";

type ResponseStatus = "success" | "fail" | "error";

type ResponseData = Record<string, unknown>;

export interface ResponseBody {
  status: ResponseStatus;
  code: ApiResponseCode;
  message: string;
  data: ResponseData | null;
}

class ApiResponse {
  public ok(
    res: Response,
    data: ResponseData,
    code: OkSuccessCode = "ok",
    message: string = API_RESPONSE_MESSAGES.ok[code],
  ) {
    const responseBody: ResponseBody = {
      status: "success",
      code: "OK",
      message,
      data,
    };
    res.status(200).json(responseBody);
  }

  public redirect(res: Response, path: string) {
    res.redirect(path);
  }

  public unAuthorized(
    res: Response,
    code: UnAuthorizedErrorCode = "unAuthorized",
    message: string = API_RESPONSE_MESSAGES.unAuthorized[code],
  ) {
    const responseBody: ResponseBody = {
      status: "fail",
      message,
      code: "UNAUTHORIZED",
      data: null,
    };
    res.status(401).json(responseBody);
  }

  public notFound(
    res: Response,
    code: NotFoundErrorCode = "notFound",
    message: string = API_RESPONSE_MESSAGES.notFound[code],
  ) {
    const responseBody: ResponseBody = {
      status: "fail",
      code: "NOT_FOUND",
      message,
      data: null,
    };
    res.status(404).json(responseBody);
  }

  public created(
    res: Response,
    data: ResponseData,
    code: CreatedSuccessCode = "created",
    message: string = API_RESPONSE_MESSAGES.created[code],
  ) {
    const responseBody: ResponseBody = {
      status: "success",
      code: "CREATED",
      message,
      data,
    };
    res.status(201).json(responseBody);
  }

  public badRequest(
    res: Response,
    code: BadRequestErrorCode = "badRequest",
    message: string = API_RESPONSE_MESSAGES.badRequest[code],
  ) {
    const responseBody: ResponseBody = {
      status: "fail",
      code: "BAD_REQUEST",
      message,
      data: null,
    };
    res.status(400).json(responseBody);
  }

  public internalError(
    res: Response,
    code: InternalServerErrorCode = "internalError",
    message: string = API_RESPONSE_MESSAGES.internalServerError[code],
  ) {
    const responseBody: ResponseBody = {
      status: "error",
      code: "INTERNAL_SERVER_ERROR",
      message,
      data: null,
    };
    res.status(500).json(responseBody);
  }
}

export default new ApiResponse();

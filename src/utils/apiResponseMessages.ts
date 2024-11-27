import * as string_decoder from "node:string_decoder";

export type CreatedSuccessCode = "created";

export type OkSuccessCode = "ok";

export type UnAuthorizedErrorCode =
  "unAuthorized"
  | "expired"
  | "lockedDomainExpired"
  | "required"
  | "authError";

export type MovedPermanentlyErrorCode = "movedPermanently"

export type BadRequestErrorCode =
  "badRequest"
  | "invalid"
  | "invalidHeader"
  | "invalidParameter"
  | "invalidQuery"
  | "parseError"
  | "required";

export type NotFoundErrorCode =
  "notFound"
  | "unSupportedProtocol"

export type ForbiddenErrorCode = "forbidden" | "rateLimitExceeded";

export type ConflictErrorCode = "conflict" | "duplicate";

export type GoneErrorCode = "deleted";

export type InternalServerErrorCode = "internalError";


export type ApiResponseCode =
  "UNAUTHORIZED"
  | "NOT_FOUND"
  | "BAD_REQUEST"
  | "MOVED_PERMANENTLY"
  | "OK"
  | "CREATED"
  | "INTERNAL_SERVER_ERROR";

interface ApiResponseMessages {
  created: Record<CreatedSuccessCode, string>
  ok: Record<OkSuccessCode, string>
  unAuthorized: Record<UnAuthorizedErrorCode, string>;
  movePermanently: Record<MovedPermanentlyErrorCode, string>
  badRequest: Record<BadRequestErrorCode, string>
  notFound: Record<NotFoundErrorCode, string>
  forbidden: Record<ForbiddenErrorCode, string>
  conflict: Record<ConflictErrorCode, string>
  internalServerError: Record<InternalServerErrorCode, string>
  gone: Record<GoneErrorCode, string>
}

export const API_RESPONSE_MESSAGES: ApiResponseMessages = {
  created: {
    created: "The request has been fulfilled and has resulted in one or more new resources being created."
  },
  ok: {
    ok: "The request was processed successfully."
  },
  unAuthorized: {
    unAuthorized: "The user is not authorized to make the request.",
    expired: "Session Expired. Check the value of the Authorization HTTP request header.",
    lockedDomainExpired: "The request failed because a previously valid locked domain has expired.",
    required: "The user must be logged in to make this API request. Check the value of the Authorization HTTP request header.",
    authError: "The authorization credentials provided for the request are invalid. Check the value of the Authorization HTTP request header."
  },
  movePermanently: {
    movedPermanently: "This request and future requests for the same operation have to be sent to the URL specified in the Location header of this response instead of to the URL to which this request was sent.",
  },
  badRequest: {
    badRequest: "The request is invalid or improperly formed.",
    invalid: "\tThe request failed because it contained an invalid value. The value could be a parameter value, a header value, or a property value.",
    invalidParameter: "The request failed because it contained an invalid parameter",
    invalidHeader: "The request failed because it contained an invalid header.",
    invalidQuery: "The request failed because of invalid query parameter. Check Api documentation for query parameter combinations.",
    parseError: "The API server cannot parse the request body.",
    required: "The API request is missing required information. The required information could be a parameter or resource property."
  },
  notFound: {
    notFound: "The  resource associated with the request could not be found.",
    unSupportedProtocol: "The protocol used in the request is not supported."
  },
  forbidden: {
    forbidden: "The requested operation is forbidden and cannot be completed.",
    rateLimitExceeded: "Too many requests have been sent within a given time span.",
  },
  conflict: {
    duplicate: "The requested operation failed because it tried to create a resource that already exists.",
    conflict: "The request cannot be completed because the requested operation would conflict with an existing item."
  },
  gone: {
    deleted: "The request failed because the resource associated with the request has been deleted",
  },
  internalServerError: {
    internalError: "The request failed due to an internal error."
  }
}
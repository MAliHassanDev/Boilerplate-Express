/* eslint-disable @typescript-eslint/unbound-method */
import apiResponse from "../../../src/utils/apiResponse.js";
import { Response } from "express";
import { describe, expect, beforeEach, test, vi } from "vitest";
describe("ApiResponse", () => {
  let res: Response;

  beforeEach(() => {
    res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as unknown as Response;

    vi.clearAllMocks();
  });

  test("Should send 200 with data for 'Ok call", () => {
    const data = { name: "ali" };
    apiResponse.ok(res, data);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "success",
        code: "OK",
        data,
      }),
    );
  });

  test("Should send 404 on 'Not Found' call", () => {
    apiResponse.notFound(res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: "NOT_FOUND",
      }),
    );
  });
});

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import mongoose, { Mongoose } from "mongoose";
import { type Express } from "express";
import Database from "../../src/database/connection.js";
import { vi } from "vitest";

class Mock {
  public database() {
    return {
      connect: vi.fn((uri: string, options?: mongoose.ConnectOptions) => {
        if (!options) return;
      }),
      disconnect: vi.fn(),
    } as unknown as Database;
  }

  public express() {
    return {
      listen: vi.fn((port?: number, host?: string, callback?: () => void) => {
        if (callback) {
          setTimeout(callback);
        }
        return {
          close: vi.fn((callback?: () => void) => {}),
        };
      }),
    } as unknown as Express;
  }

  public mongoose() {
    return {
      connect: vi
        .fn(async (uri: string, options?: mongoose.ConnectOptions) =>
          Promise.resolve(),
        )
        .mockResolvedValue(),
      connection: {
        close: vi.fn(async () => {}).mockResolvedValue(),
      },
    } as unknown as Mongoose;
  }
}

export default new Mock();

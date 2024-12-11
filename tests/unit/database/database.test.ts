/* eslint-disable @typescript-eslint/unbound-method */
import { vi, beforeAll,beforeEach, describe, expect, test } from "vitest";
import Database from "../../../src/database/connection.js";
import { DatabaseConfig } from "../../../src/config/config.js";
import mock from "../../mocks/mock.js";
import { Mongoose } from "mongoose";

describe("Database", () => {
  let database: Database;
  let mongooseMock: Mongoose;
  let databaseConfig: DatabaseConfig;

  beforeAll(() => {
    databaseConfig = {
      connectionString: "mockConnectionString",
      name: "mock name",
    };
    mongooseMock = mock.mongoose();
    database = Database.getInstance(databaseConfig, mongooseMock);
  });
  beforeEach(() => {
    vi.clearAllMocks();
  })
  test("Should connect to mongodb with given uri", async () => {
    await database.connect();
    expect(mongooseMock.connect).toHaveBeenCalled();
    expect(vi.mocked(mongooseMock.connect).mock.calls[0]).toContain(
      databaseConfig.connectionString
    );
  });

  test("Should handle error if mongodb connection fails", async () => {
    const error = new Error("Database Connection Failed");
    vi.mocked(mongooseMock.connect).mockRejectedValue(error);
    await expect(database.connect()).rejects.toThrow("Database Connection Failed");
  });

  test("Should close mongodb connection", async () => {
    await database.disconnect();
    expect(mongooseMock.connection.close).toHaveBeenCalled();
  })

  test("Should handle error on unsuccessful disconnection", async () => {
    const error = new Error("Failed to close Database Connection");
    vi.mocked(mongooseMock.connection.close).mockRejectedValue(error);
    await expect(database.disconnect()).rejects.toThrow("Failed to close Database Connection");
  })
});

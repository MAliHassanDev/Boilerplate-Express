/* eslint-disable @typescript-eslint/unbound-method */
import Server from "../../src/server.js";
import mock from "../mocks/mock.js";
import { type Express } from "express";
import Database from "../../src/database/connection.js";
import { describe, expect, beforeEach, test, vi } from "vitest";
import { ServerConfig } from "../../src/config/config.js";

describe("Server", () => {
  let server: Server;
  let app: Express;
  let database: Database;
  let serverConfig: ServerConfig;
  beforeEach(() => {
    serverConfig = {
      port: 3000,
      host: "localhost",
    };
    database = mock.database();
    app = mock.express();
    server = new Server(serverConfig, app, database);
    vi.clearAllMocks();
  });
  test("Should connect to database", async () => {
    await server.start();
    expect(database.connect).toHaveBeenCalled();
  });

  test("Should start listening at given port", async () => {
    await server.start();
    expect(app.listen).toHaveBeenCalled();
    expect(vi.mocked(app.listen).mock.calls[0]).toContain(serverConfig.port);
  });

  test("Should close database connection on shutdown call", async () => {
    await server.shutdown();
    expect(database.disconnect).toHaveBeenCalled();
  });

  test("Should stop listening on shutdown call", async () => {
    const httpServer = await server.start();
    await server.shutdown();
    expect(httpServer.close).toHaveBeenCalled();
  });
 });

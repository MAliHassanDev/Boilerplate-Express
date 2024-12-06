import Database from "./database/connection.js";
import app from "./app/app.js";
import config, { ServerConfig } from "./config/config.js";
import logger from "./config/logger.js";
import http from "http";
import { Express } from "express";
export type NodeEnv = "DEV" | "TEST" | "PROD";

class Server {
  private serverInstance: http.Server | null = null;

  public constructor(
    private readonly serverConfig: ServerConfig,
    private readonly app: Express,
    private readonly database?: Database
  ) {}

  public async start() {
    if (this.database) {
      await this.database.connect();
      logger.info("Connected to database ✔");
    }
    this.serverInstance = await this.getServerInstance();
    const { host, port } = this.serverConfig;
    logger.info(`Server listening at http://${host}:${port}`);
  }

  public async shutdown() {
    logger.info("Gracefully shutting down...");

    if (this.database) {
      logger.info("Disconnecting from Database...");
      await this.database.disconnect();
    }

    if (this.serverInstance) {
      logger.info("Closing the server...");
      this.serverInstance.close(() => {
        logger.info("Exiting...");
        process.exit(1);
      });
    }
  }

  private getServerInstance(): Promise<http.Server> {
    return new Promise((res, _) => {
      const server = this.app.listen(
        this.serverConfig.port,
        this.serverConfig.host,
        () => {
          res(server);
        }
      );
    });
  }
}

(async () => {
  let server: Server | null = null;

  try {
    const serverConfig = config.getServerConfig();
    const database = Database.getInstance();
    const env = config.getNodeEnv();

    logger.info(`[------------------ ENV: ${env} ------------------]`);

    server = new Server(serverConfig, app, database);

    await server.start();
  } catch (error: unknown) {
    logger.error(error);
    if (server) await server.shutdown();
  }

  process.on("uncaughtException", async (error: Error) => {
    logger.error(error,"Uncaught");
    if (server) await server.shutdown();
  });

  process.on("SIGINT", async (signal: NodeJS.Signals) => {
    logger.info(`Received ${signal} signal.`)
    if (server) await server.shutdown();
  });

  process.on("SIGTERM", async (signal:NodeJS.Signals) => {
    logger.info(`Received ${signal} signal.`)
    if (server) await server.shutdown();
  })

  process.on("unhandledRejection", async (reason:string,promise:Promise<unknown>) => {
    logger.error(`Unhandled Promise: ${promise}. Reason: ${reason}`);
    if (server) await server.shutdown();
  })
})().catch(logger.error);

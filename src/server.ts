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
    return this.serverInstance;
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
        process.exit();
      });
    }
  }

  private getServerInstance(): Promise<http.Server> {
    return new Promise((res) => {
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

async function main (){
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

  process.on("uncaughtException", (error: Error) => {
    logger.error(error, "Uncaught");
    if (server) server.shutdown().catch(logger.error);
  });

  process.on("SIGINT", (signal: NodeJS.Signals) => {
    logger.info(`Received ${signal} signal.`);
    if (server) server.shutdown().catch(logger.error);
  });

  process.on("SIGTERM", (signal: NodeJS.Signals) => {
    logger.info(`Received ${signal} signal.`);
    if (server) server.shutdown().catch(logger.error);
  });

  process.on("unhandledRejection", (reason: string) => {
    logger.error(`Unhandled Promise: ${reason}.`);
    if (server) server.shutdown().catch(logger.error);
  });
};

main().catch(logger.error);

export default Server;

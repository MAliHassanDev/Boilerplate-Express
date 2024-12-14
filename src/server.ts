import Database from "./database/connection.js";
import { ServerConfig } from "./config/config.js";
import logger from "./config/logger.js";
import http from "http";
import { Express } from "express";

class Server {
  private serverInstance: http.Server | null = null;

  public constructor(
    private readonly serverConfig: ServerConfig,
    private readonly app: Express,
    private readonly database?: Database,
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
    return new Promise(res => {
      const server = this.app.listen(
        this.serverConfig.port,
        this.serverConfig.host,
        () => {
          res(server);
        },
      );
    });
  }
}

export default Server;

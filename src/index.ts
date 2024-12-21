import app from "./app/app.js";
import config from "./config/config.js";
import logger from "./config/logger.js";
import Database from "./database/connection.js";
import Server from "./server.js";

async function main() {
  let server: Server | null = null;

  try {
    const serverConfig = config.get("server");
    const database = Database.getInstance();
    const { env } = config.get("node");

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
}

main().catch(logger.error);

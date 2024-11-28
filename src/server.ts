import Database from "./database/connection.js";
import app from "./app/app.js";
import config from "./config/config.js";
import logger from "./config/logger.js";


Database.connect().then(() => {
  const {port, host} = config.getServerConfig();
  const env = config.getNodeEnv();
  logger.info(`[------------------ ENV: ${env} ------------------]`);
  logger.info("Connected to database ✔");
  app.listen(port, host, () => {
    logger.info(`Server listening at http://${host}:${port}`);
  })
}).catch((err: unknown) => {
  logger.error(err);
});


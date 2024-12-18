import logger from "./logger.js";
import dotenv from "dotenv";
import { join } from "path";

export type NodeEnv = "development" | "test" | "production";

dotenv.config({
  path: join(import.meta.dirname, "..", "..", ".env"),
});

type Env = string | number;

export interface ServerConfig {
  port: number;
  host: string;
}

export interface DatabaseConfig {
  connectionString: string;
  name: string;
}

interface Configs {
  serverConfig?: ServerConfig;
  databaseConfig?: DatabaseConfig;
}

class Config {
  private readonly configs: Configs = {};
  private readonly env: NodeEnv;
  private static instance: Config;

  private constructor() {
    this.env = this.getEnv<NodeEnv>("NODE_ENV", "development", [
      "development",
      "test",
      "production",
    ]);
  }

  private initializeServerConfig() {
    if (!this.configs.serverConfig) {
      this.configs.serverConfig = {
        port: this.getEnv("PORT", 3000),
        host: this.getEnv("HOST", "127.0.0.1"),
      };
    }
  }

  private initializeDatabaseConfig() {
    if (!this.configs.databaseConfig) {
      this.configs.databaseConfig = {
        name: this.getEnv("DATABASE_NAME", "myDb"),
        connectionString: this.getEnv(
          "DATABASE_URI",
          "mongodb://localhost:27017",
        ),
      };
    }
  }

  private getEnv<T extends Env>(
    name: string,
    defaultValue: T,
    expectedValues?: Array<Env>,
  ): T {
    const value =
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      process.env[`${name}_${(this.env ?? "development").toUpperCase()}`] ??
      process.env[name];

    if (!value) {
      logger.warn(
        `Env '${name}' not defined. Using default value '${defaultValue}'`,
        "Config",
      );
      return defaultValue;
    }

    if (expectedValues) {
      const isValueInExpected = expectedValues.some(
        expectedValue => expectedValue === value,
      );

      if (!isValueInExpected) {
        logger.warn(
          `Value of Env '${name}=${value}' is different from the expected value '${expectedValues.toString()}'.Using Default value '${defaultValue}'`,
          "Config",
        );
        return defaultValue;
      }
    }

    return typeof defaultValue === "number"
      ? (parseInt(value, 10) as T)
      : (value as T);
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  private getConfig<T extends Configs[keyof Configs]>(name: keyof Configs): T {
    const config = this.configs[name];
    if (!config)
      throw new Error(`Following config is not initialized: ${name}`);
    return config as T;
  }

  public static getInstance(): Config {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  public getServerConfig(): ServerConfig {
    this.initializeServerConfig();
    return this.getConfig("serverConfig");
  }

  public getDatabaseConfig(): DatabaseConfig {
    this.initializeDatabaseConfig();
    return this.getConfig("databaseConfig");
  }

  public getNodeEnv() {
    return this.env;
  }
}

export default Config.getInstance();

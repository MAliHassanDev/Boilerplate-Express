import logger from "./logger.js";
import dotenv from "dotenv";
import { join } from "path";

dotenv.config({
  path: join(import.meta.dirname, "..", "..", ".env"),
});

type NodeEnv = "DEV" | "TEST" | "PROD";

type Env = string | number;

interface ServerConfig {
  port: number;
  host: string;
}


interface DatabaseConfig {
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
    this.env = this.getEnv<string>("NODE_ENV", "DEV", [
      "DEV",
      "PROD",
      "TEST",
    ]).toUpperCase() as NodeEnv;
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
          "mongodb://localhost:27017"
        ),
      };
    }
  }

  private getEnv<T extends Env>(
    name: string,
    defaultValue: T,
    expectedValues?: Array<Env>
  ):T {
    const value = process.env[`${name}_${this.env}`] || process.env[name];
    if (!value) {
      logger.warn(
        `Env '${name}' not defined. Using default value '${defaultValue}'`,
        "Config"
      );
      return defaultValue;
    }
    if (expectedValues) {
      const isValueInExpected = expectedValues.some(
        (expectedValue) => expectedValue === value
      );
      if (!isValueInExpected)
        throw new Error(
          `Value of Env '${name}' is different from the expected value '${expectedValues}'`
        );
    }
    return typeof defaultValue === "number" ? parseInt(value,10) as T: value as T;
  }

  private getConfig<T extends Configs[keyof Configs]>(name: keyof Configs): T {
    const config = this.configs[name];
    if (!config)
      throw new Error(`Following config is not initialized: ${name}`);
    return config as T;
  }

  public static getInstance(): Config {
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

type NodeEnv = "DEV" | "TEST" | "PROD";

interface ServerConfig {
  port: number;
  host: string;
}

interface Configs {
  serverConfig?: ServerConfig;
}

class Config {
  private configs: Configs;
  private readonly env: NodeEnv;
  private static instance: Config;

  private constructor() {
    this.configs = {};
    this.env = this.getEnv("NODE_ENV", "DEV").toUpperCase() as NodeEnv;
  }

  private initializeServerConfig() {
    if (!this.configs.serverConfig) {
      this.configs.serverConfig = {
        port: this.getIntEnv("PORT", 3000),
        host: this.getEnv("HOST", "127.0.0.1"),
      };
    }
  }

  private getIntEnv(name: string, defaultValue: number) {
    const value = process.env[`${name}_${this.env}`] || process.env[name];
    return value ? parseInt(value, 10) : defaultValue;
  }

  private getEnv(name: string, defaultValue: string) {
    const value = process.env[`${name}_${this.env}`] || process.env[name];
    return value || defaultValue;
  }

  private getConfig(name: keyof Configs) {
    const config = this.configs[name];
    if (!config)
      throw new Error(`Following config is not initialized: ${name}`);
    return config;
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

  public getNodeEnv() {
    return this.env;
  }
}

export default Config.getInstance();

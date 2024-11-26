import config from "@/config/config.js";

type Level = {
  error: 0;
  warn: 1;
  info: 2;
  debug: 3;
};

class Logger {
  private readonly levels: Level = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  };

  private readonly levelColorCodes: Record<keyof Level, number> = {
    error: 31,
    warn: 38,
    info: 32,
    debug: 34,
  };
  constructor(private readonly level: keyof Level) {}

  private log(level: keyof Level, message: string, data: unknown[]) {
    const currentLevelIndex = this.levels[level];
    const setLevelIndex = this.levels[this.level];

    if (
      config.getNodeEnv() !== "PROD" &&
      currentLevelIndex <= setLevelIndex
    ) {
      const customMessage = `${this.getTimeStamp()} \x1B[${
        this.levelColorCodes[level]
      }m${level}\x1B[0m: ${message}`;
      console.log(customMessage, ...data);
    }
  }

  private getTimeStamp() {
    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();
    const currDate = date.getDate();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${currDate}-${month}-${year} ${
      hour > 12 ? hour - 12 : hour
    }:${minutes}:${seconds}`;
  }

  info(message: string, ...data: unknown[]) {
    this.log("info", message, data);
  }

  error(message: string, ...data: unknown[]) {
    this.log("error", message, data);
  }

  warn(message: string, ...data: unknown[]) {
    this.log("warn", message, data);
  }

  debug(message: string, ...data: unknown[]) {
    this.log("debug", message, data);
  }
}

export default new Logger("info");

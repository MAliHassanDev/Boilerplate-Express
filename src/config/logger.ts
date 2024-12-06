type Level = {
  error: 0;
  warn: 1;
  info: 2;
  debug: 3;
};

type Context = string | null;

interface LoggerOptions {
  level: keyof Level;
  errorStack?: boolean;
}

class Logger {
  private readonly levels: Level = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  };

  private readonly levelColorCodes: Record<keyof Level, number> = {
    error: 31,
    warn: 93,
    info: 32,
    debug: 35,
  };

  private readonly level: keyof Level;

  private readonly errorStack: boolean;

  constructor(options: LoggerOptions) {
    this.level = options.level;
    this.errorStack = options.errorStack || false;
  }

  private log(level: keyof Level, message: unknown, context: Context) {
    const currentLevelIndex = this.levels[level];
    const setLevelIndex = this.levels[this.level];

    const shouldLog =
      process.env.NODE_ENV !== "PROD" && currentLevelIndex <= setLevelIndex;

    if (!shouldLog) return;

    const colorCode = this.levelColorCodes[level];
    const isError = message instanceof Error && this.errorStack;

    const logHeader = `${this.getTimeStamp()} \x1B[${colorCode};1;1m${level}:\x1B[0m`;
    const logContext = context ? ` [${context}]` : "";
    const logMessage = isError ? message.stack : message 

    console.log(`${logHeader}${logContext} ${logMessage}`);
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

  info(message: string, context: Context = null) {
    this.log("info", message, context);
  }

  error(message: unknown, context: Context = null) {
    this.log("error", message, context);
  }

  warn(message: string, context: Context = null) {
    this.log("warn", message, context);
  }

  debug(message: string, context: Context = null) {
    this.log("debug", message, context);
  }
}

export default new Logger({level: "info", errorStack: true});


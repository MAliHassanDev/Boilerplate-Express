import mongoose, { Mongoose } from "mongoose";
import config, { DatabaseConfig } from "../config/config.js";

class Database {
  private static instance: Database;
  private readonly name: string;
  private readonly connectionString: string;
  private readonly mongoose: Mongoose;

  private constructor(databaseConfig: DatabaseConfig, mongoose: Mongoose) {
    this.name = databaseConfig.name;
    this.connectionString = databaseConfig.connectionString;
    this.mongoose = mongoose;
  }

  public static getInstance(
    dbConfig?: DatabaseConfig,
    mongooseInstance?: Mongoose
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!Database.instance) {
      const databaseConfig = config.getDatabaseConfig();
      Database.instance = new Database(
        dbConfig ?? databaseConfig,
        mongooseInstance ?? mongoose
      );
    }
    return Database.instance;
  }

  public connect = async () => {
    try {
     await this.mongoose.connect(this.connectionString, {
        dbName: this.name,
      });
    } catch (err: unknown) {
      throw new Error("Database Connection Failed", { cause: err });
    }
  };

  public async disconnect() {
    try {
      await this.mongoose.connection.close();
    } catch (err: unknown) {
      throw new Error("Failed to close Database Connection", { cause: err });
    }
  }
}

export default Database;

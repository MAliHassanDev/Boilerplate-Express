import mongoose from "mongoose";
import config, { DatabaseConfig } from "../config/config.js";

class Database {
  private static instance: Database;
  private name: string;
  private connectionString: string;

  private constructor(databaseConfig:DatabaseConfig) {
    this.name = databaseConfig.name;
    this.connectionString = databaseConfig.connectionString
  }

  public static getInstance() {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!Database.instance) {
      const database = config.getDatabaseConfig();
      Database.instance = new Database(database);
    }
    return Database.instance;
  }

  public async connect() {
    await mongoose.connect(this.connectionString, {
      dbName: this.name,
    });
  }

  public async disconnect() {
    await mongoose.connection.close();
  }
}

export default Database;

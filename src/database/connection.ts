import mongoose from "mongoose";
import config from "../config/config.js";

class Database {
  private static instance: Database;
  private name: string;
  private connectionString: string;

  public constructor() {
    const { name, connectionString } = config.getDatabaseConfig();
    (this.name = name), (this.connectionString = connectionString);
  }

  public static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
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

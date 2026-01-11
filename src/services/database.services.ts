import mongoose from "mongoose";
import "dotenv/config";
import envConfig, { ENV_CONFIG } from "@/constants/config.js";

class DatabaseService {
  private readonly uri: string;

  constructor() {
    this.uri = envConfig.MONGO_URI;
  }

  async connect() {
    try {
      if (!this.uri) {
        throw new Error("MONGO_URI is not defined in .env file");
      }

      if (mongoose.connection.readyState === 1) {
        console.log("MongoDB is already connected.");
        return;
      }

      // Tắt autoIndex ở production tăng hiệu năng
      if (envConfig.NODE_ENV === ENV_CONFIG.PRODUCTION) {
        mongoose.set("autoIndex", false);
        mongoose.set("debug", false);
      } else {
        mongoose.set("autoIndex", true);
        mongoose.set("debug", true);
      }

      await mongoose.connect(this.uri);
      console.log(
        `MongoDB Connected successfully! (Mode: ${envConfig.NODE_ENV})`,
      );
    } catch (error) {
      console.error("MongoDB connection error:", error);
      process.exit(1);
    }
  }
}

// Tạo instance (Singleton Pattern đơn giản)
const databaseService = new DatabaseService();
export default databaseService;

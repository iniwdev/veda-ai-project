import mongoose from "mongoose";
import { env } from "./env.js";

let isConnected = false;

export async function connectDatabase(): Promise<void> {
  if (isConnected) return;

  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    isConnected = true;
    console.info("✅ MongoDB connected");

    mongoose.connection.on("error", (err: Error) => {
      console.error("MongoDB connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Attempting to reconnect...");
      isConnected = false;
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  console.info("MongoDB disconnected gracefully");
}

import mongoose from "mongoose";

const DB_URL = process.env.DB_URL as string;

if (!DB_URL) {
  throw new Error("❌ DB_URL is not defined");
}

// Global cache (VERY IMPORTANT)
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(DB_URL, {
      bufferCommands: false,
      maxPoolSize: 5, // serverless-friendly
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ MongoDB connected");
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
};

export default connectDB;

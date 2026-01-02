import mongoose from "mongoose";
const DB_URL = process.env.DB_URL;
if (!DB_URL) {
    throw new Error("❌ DB_URL is not defined");
}
// Global cache (VERY IMPORTANT)
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = {
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
        console.info("✅ MongoDB connected");
        return cached.conn;
    }
    catch (error) {
        cached.promise = null;
        console.error("❌ MongoDB connection failed:", error);
        throw error;
    }
};
export default connectDB;
//# sourceMappingURL=db.js.map
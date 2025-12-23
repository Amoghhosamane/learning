import mongoose from "mongoose";

interface MongooseCache {
  conn: any;
  promise: any;
}

let cached = (global as any).mongoose as MongooseCache;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    throw new Error("❌ MONGO_URI is not defined. Add it in Vercel project env vars or .env.local");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    console.log("🔌 Connecting to MongoDB:", MONGO_URI);
    cached.promise = mongoose.connect(MONGO_URI).then((mongooseInstance) => {
      console.log("✅ Connected to MongoDB DB:", mongooseInstance.connection.name);
      return mongooseInstance;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

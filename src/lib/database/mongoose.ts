import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // Ensuring globalThis has mongoose cache
  var mongooseCache: MongooseConnection | undefined;
}

const cached: MongooseConnection = global.mongooseCache || {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

export const connectToDatabase = async (): Promise<Mongoose> => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URL) throw new Error("Missing MONGODB_URL");

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: "soumify2",
      bufferCommands: false,
    });

  cached.conn = await cached.promise;
  return cached.conn;
};

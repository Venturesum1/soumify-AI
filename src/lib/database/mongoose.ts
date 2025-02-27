import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Extend globalThis to include mongoose
declare global {
  var mongoose: MongooseConnection | undefined;
}

// Use a properly typed global cache
let cached: MongooseConnection = global.mongoose ?? { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URL) throw new Error('Missing MONGODB_URL');

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: 'soumify2',
      bufferCommands: false,
    });

  cached.conn = await cached.promise;
  global.mongoose = cached; // Assign to global

  return cached.conn;
};

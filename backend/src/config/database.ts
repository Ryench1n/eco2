import mongoose from 'mongoose';
import { config } from './env.js';

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(config.mongodb.uri, {
      dbName: config.mongodb.dbName,
    });
    console.log(' MongoDB connected:', config.mongodb.uri);
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    throw err;
  }
}

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const state = mongoose.connection.readyState;
    return state === 1; 
  } catch {
    return false;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}

export default mongoose;

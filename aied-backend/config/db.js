import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB() {
  try {
    await mongoose.connect(env.mongoUri);
    console.log('[db] connected');
  } catch (err) {
    console.error('[db] connection failed:', err.message);
    process.exit(1);
  }
}

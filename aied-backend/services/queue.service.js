import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { env } from '../config/env.js';

export const connection = env.redisUrl ? new IORedis(env.redisUrl, { maxRetriesPerRequest: null }) : null;
export const videoQueue = connection ? new Queue('video', { connection }) : null;

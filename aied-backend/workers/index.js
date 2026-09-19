// BullMQ worker: runs slow jobs (embedding, narration) off the request path.
import { Worker } from 'bullmq';
import { connectDB } from '../config/db.js';
import { connection } from '../services/queue.service.js';
import Video from '../models/Video.js';
import { indexTranscript } from '../services/rag.service.js';

if (!connection) { console.error('[worker] REDIS_URL is not set'); process.exit(1); }
await connectDB();

new Worker('video', async (job) => {
  if (job.name === 'index') {
    const video = await Video.findById(job.data.videoId);
    const n = await indexTranscript(video._id, video.transcript);
    console.log(`[worker] indexed ${n} chunks for ${video.title}`);
  }
}, { connection, concurrency: 2 });

console.log('[worker] listening on queue "video"');

import TranscriptChunk from '../models/TranscriptChunk.js';
import { embed } from './gemini.service.js';

/** Groups transcript segments into ~500-char chunks, embeds and stores them. */
export async function indexTranscript(videoId, segments) {
  const chunks = [];
  let buf = { start: segments[0]?.start ?? 0, text: '' };
  for (const s of segments) {
    if (buf.text.length + s.text.length > 500) { chunks.push(buf); buf = { start: s.start, text: '' }; }
    buf.text += (buf.text ? ' ' : '') + s.text;
  }
  if (buf.text) chunks.push(buf);

  const vectors = await embed(chunks.map((c) => c.text));
  await TranscriptChunk.deleteMany({ video_id: videoId });
  await TranscriptChunk.insertMany(chunks.map((c, i) => ({ ...c, video_id: videoId, embedding: vectors[i] })));
  return chunks.length;
}

/** Atlas Vector Search: nearest transcript chunks to the question. */
export async function retrieve(videoId, question, k = 4) {
  const [queryVector] = await embed([question], 'RETRIEVAL_QUERY');
  return TranscriptChunk.aggregate([
    {
      $vectorSearch: {
        index: 'transcript_vector_index',
        path: 'embedding',
        queryVector,
        numCandidates: 100,
        limit: k,
        filter: { video_id: videoId },
      },
    },
    { $project: { _id: 0, start: 1, text: 1, score: { $meta: 'vectorSearchScore' } } },
  ]);
}

export const RELEVANCE_THRESHOLD = 0.72;

export function buildGroundedPrompt(chunks, question, langName) {
  const context = chunks.map((c) => `[${Math.floor(c.start / 60)}:${String(Math.floor(c.start % 60)).padStart(2, '0')}] ${c.text}`).join('\n');
  return `Lecture excerpts:\n${context}\n\nStudent question: ${question}\n\n`
    + `Answer in ${langName}. Use only the excerpts; cite timestamps like [4:12]. `
    + 'For numericals or derivations, go step by step.';
}

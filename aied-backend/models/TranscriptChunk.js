import mongoose from 'mongoose';

// Stored separately so Atlas Vector Search can index `embedding`.
// Atlas index definition: { "fields": [{ "type": "vector", "path": "embedding",
//   "numDimensions": 768, "similarity": "cosine" }, { "type": "filter", "path": "video_id" }] }
const chunkSchema = new mongoose.Schema({
  video_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', index: true },
  start: Number,
  text: String,
  embedding: [Number],
});

export default mongoose.model('TranscriptChunk', chunkSchema);

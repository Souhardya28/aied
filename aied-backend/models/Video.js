import mongoose from 'mongoose';

const segmentSchema = new mongoose.Schema({ start: Number, text: String }, { _id: false });

const videoSchema = new mongoose.Schema({
  youtube_url: { type: String, required: true, index: true },
  title: String,
  transcript: [segmentSchema],
  translations: { type: Map, of: [segmentSchema], default: {} },   // lang -> segments
  audio: { type: Map, of: String, default: {} },                  // lang -> storage URL
  topic_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Syllabus' },
  status: { type: String, enum: ['queued', 'processing', 'ready', 'failed'], default: 'queued' },
}, { timestamps: true });

export default mongoose.model('Video', videoSchema);

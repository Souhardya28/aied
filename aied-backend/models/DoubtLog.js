import mongoose from 'mongoose';

const doubtSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  video_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', index: true },
  question: String,
  answer: String,
  grounded: Boolean,
  sources: [{ start: Number, text: String }],
}, { timestamps: true });

export default mongoose.model('DoubtLog', doubtSchema);

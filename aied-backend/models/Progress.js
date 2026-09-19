import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  topic_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Syllabus' },
  status: { type: String, enum: ['not_started', 'in_progress', 'done'], default: 'not_started' },
  time_spent: { type: Number, default: 0 }, // minutes
  last_score: Number,
}, { timestamps: true });

progressSchema.index({ user_id: 1, topic_id: 1 }, { unique: true });
export default mongoose.model('Progress', progressSchema);

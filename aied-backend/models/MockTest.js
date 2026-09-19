import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ['mcq', 'short', 'long'] },
  prompt: String,
  options: [String],
  answer: String,
  explanation: String,
  topic: String,
  difficulty: Number,
}, { _id: false });

const mockTestSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  subject: String,
  topics: [String],
  questions: [questionSchema],
  responses: [String],
  score: Number,
  feedback: [mongoose.Schema.Types.Mixed],
}, { timestamps: true });

export default mongoose.model('MockTest', mockTestSchema);

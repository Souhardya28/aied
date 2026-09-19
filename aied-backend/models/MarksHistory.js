import mongoose from 'mongoose';

const marksSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  subject: String,
  exam: String,
  marks: Number,
  max_marks: { type: Number, default: 100 },
}, { timestamps: true });

export default mongoose.model('MarksHistory', marksSchema);

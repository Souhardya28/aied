import mongoose from 'mongoose';

const pyqSchema = new mongoose.Schema({
  subject: String,
  topic: String,
  chapter: String,
  frequency: Number,
  weightage: Number,        // percent of total marks
  years: [Number],
}, { timestamps: true });

export default mongoose.model('PYQAnalysis', pyqSchema);

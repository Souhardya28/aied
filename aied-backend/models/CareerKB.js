import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema({
  path: String,
  streams: [String],
  exams: [String],
  colleges: [String],
  skills: [String],
  summary: String,
});

export default mongoose.model('CareerKB', careerSchema);

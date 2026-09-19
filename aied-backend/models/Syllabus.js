import mongoose from 'mongoose';

const syllabusSchema = new mongoose.Schema({
  board: String,
  class: String,
  subject: String,
  chapter: String,
  topic: String,
});

export default mongoose.model('Syllabus', syllabusSchema);

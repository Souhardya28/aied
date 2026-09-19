import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  class: { type: String, default: '12' },
  stream: { type: String, default: 'Science' },
  board: { type: String, default: 'CBSE' },
  language_pref: { type: String, default: 'as' },
  interests: [String],
}, { timestamps: true });

export default mongoose.model('User', userSchema);

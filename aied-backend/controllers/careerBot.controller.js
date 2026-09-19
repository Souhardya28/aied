import CareerKB from '../models/CareerKB.js';
import User from '../models/User.js';
import MarksHistory from '../models/MarksHistory.js';
import { generate } from '../services/gemini.service.js';

export async function buildCareerContext(userId) {
  const [user, marks, kb] = await Promise.all([
    User.findById(userId).lean(),
    MarksHistory.find({ user_id: userId }).lean(),
    CareerKB.find({}).lean(),
  ]);
  const perf = marks.map((m) => `${m.subject}: ${m.marks}/${m.max_marks}`).join(', ') || 'no marks yet';
  const kbText = kb.map((k) => `- ${k.path} (streams: ${k.streams.join('/')}; exams: ${k.exams.join(', ')}; colleges: ${k.colleges.join(', ')})`).join('\n');
  return 'You are a career counsellor for Indian students. Be specific: name exams, timelines and colleges from the knowledge base. '
    + 'Link advice to what the student should study next.\n'
    + `Student: class ${user?.class}, ${user?.stream} stream, interests: ${(user?.interests || []).join(', ') || 'unknown'}. Performance: ${perf}.\n`
    + `Knowledge base:\n${kbText}`;
}

export async function chat(req, res) {
  const system = await buildCareerContext(req.user.id);
  const transcript = (req.body.messages || []).map((m) => `${m.role}: ${m.text}`).join('\n');
  const reply = await generate(transcript, { system });
  res.json({ reply });
}

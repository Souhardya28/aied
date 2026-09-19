import PYQAnalysis from '../models/PYQAnalysis.js';
import MarksHistory from '../models/MarksHistory.js';
import { analysePaper, rankFocusAreas } from '../services/pyq.service.js';

export async function uploadPaper(req, res) {
  if (!req.file) return res.status(400).json({ error: 'Attach a PDF or photo of the question paper.' });
  const { subject, year } = req.body;
  const rows = await analysePaper(req.file.buffer, req.file.mimetype, subject);
  const total = rows.reduce((a, r) => a + r.marks, 0) || 1;
  for (const r of rows) {
    await PYQAnalysis.findOneAndUpdate(
      { subject, topic: r.topic },
      { $set: { chapter: r.chapter }, $inc: { frequency: r.questions, weightage: (r.marks / total) * 100 }, $addToSet: { years: Number(year) } },
      { upsert: true },
    );
  }
  res.json({ subject, year, topics: rows });
}

export async function addMarks(req, res) {
  const entry = await MarksHistory.create({ ...req.body, user_id: req.user.id });
  res.status(201).json(entry);
}

export async function studyPlan(req, res) {
  const [weightage, marks] = await Promise.all([
    PYQAnalysis.find({}).lean(),
    MarksHistory.find({ user_id: req.user.id }).lean(),
  ]);
  // weightage is summed per upload — normalise by number of years seen
  const norm = weightage.map((w) => ({ ...w, weightage: w.weightage / Math.max(1, w.years.length) }));
  res.json(rankFocusAreas(norm, marks));
}

export async function trends(req, res) {
  res.json(await PYQAnalysis.find({ subject: req.params.subject }).sort({ weightage: -1 }).lean());
}

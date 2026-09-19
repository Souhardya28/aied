import Syllabus from '../models/Syllabus.js';
import Progress from '../models/Progress.js';

/** Subject → chapter → topic tree with this student's status on each topic. */
export async function tree(req, res) {
  const { board = 'CBSE', class: cls = '12' } = req.query;
  const [topics, progress] = await Promise.all([
    Syllabus.find({ board, class: cls }).lean(),
    Progress.find({ user_id: req.user.id }).lean(),
  ]);
  const status = Object.fromEntries(progress.map((p) => [p.topic_id.toString(), p]));
  const out = {};
  for (const t of topics) {
    out[t.subject] ??= {};
    out[t.subject][t.chapter] ??= [];
    const p = status[t._id.toString()];
    out[t.subject][t.chapter].push({ id: t._id, topic: t.topic, status: p?.status || 'not_started', time_spent: p?.time_spent || 0 });
  }
  res.json(out);
}

export async function updateProgress(req, res) {
  const { topicId, status, minutes = 0, score } = req.body;
  const p = await Progress.findOneAndUpdate(
    { user_id: req.user.id, topic_id: topicId },
    { $set: { status, ...(score !== undefined && { last_score: score }) }, $inc: { time_spent: minutes } },
    { upsert: true, new: true },
  );
  res.json(p);
}

/** Aggregated numbers for the dashboard. */
export async function dashboard(req, res) {
  const topics = await Syllabus.find({}).lean();
  const progress = await Progress.find({ user_id: req.user.id }).lean();
  const byId = Object.fromEntries(progress.map((p) => [p.topic_id.toString(), p]));
  const subjects = {};
  for (const t of topics) {
    const s = (subjects[t.subject] ??= { subject: t.subject, total: 0, done: 0, minutes: 0, weak: [] });
    const p = byId[t._id.toString()];
    s.total += 1;
    if (p?.status === 'done') s.done += 1;
    s.minutes += p?.time_spent || 0;
    if (p?.last_score !== undefined && p.last_score < 50) s.weak.push(t.topic);
  }
  res.json(Object.values(subjects));
}

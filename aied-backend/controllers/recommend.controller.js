import Syllabus from '../models/Syllabus.js';
import Progress from '../models/Progress.js';
import Video from '../models/Video.js';

/** Suggests lectures for topics the student has not finished yet. */
export async function nextVideos(req, res) {
  const done = await Progress.find({ user_id: req.user.id, status: 'done' }).distinct('topic_id');
  const gaps = await Syllabus.find({ _id: { $nin: done } }).limit(5).lean();
  const cached = await Video.find({ topic_id: { $in: gaps.map((g) => g._id) } }).lean();
  res.json(gaps.map((g) => {
    const v = cached.find((c) => c.topic_id?.equals(g._id));
    return {
      topic: g.topic,
      subject: g.subject,
      chapter: g.chapter,
      video: v ? { id: v._id, title: v.title, url: v.youtube_url }
        : { search: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${g.topic} ${g.subject} class ${g.class} lecture`)}` },
    };
  }));
}

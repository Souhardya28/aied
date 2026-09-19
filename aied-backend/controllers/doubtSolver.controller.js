import mongoose from 'mongoose';
import DoubtLog from '../models/DoubtLog.js';
import { generate } from '../services/gemini.service.js';
import { retrieve, buildGroundedPrompt, RELEVANCE_THRESHOLD } from '../services/rag.service.js';
import { LANGUAGES } from '../utils/languages.js';

const SYSTEM = 'You are AIEd, a patient tutor for Indian school students. Explain simply, step by step.';

/** Shared by REST and Socket.io paths. Returns prompt + whether it is grounded. */
export async function prepareDoubt(videoId, question, lang) {
  const chunks = await retrieve(new mongoose.Types.ObjectId(videoId), question);
  const relevant = chunks.filter((c) => c.score >= RELEVANCE_THRESHOLD);
  const langName = LANGUAGES[lang]?.name || 'English';
  if (relevant.length) return { grounded: true, sources: relevant, prompt: buildGroundedPrompt(relevant, question, langName) };
  return {
    grounded: false,
    sources: [],
    prompt: `The lecture does not cover this. Answer from general subject knowledge in ${langName}.\n\nQuestion: ${question}`,
  };
}

export async function ask(req, res) {
  const { videoId, question, lang } = req.body;
  const { grounded, sources, prompt } = await prepareDoubt(videoId, question, lang);
  const answer = await generate(prompt, { system: SYSTEM });
  await DoubtLog.create({ user_id: req.user.id, video_id: videoId, question, answer, grounded, sources });
  res.json({ answer, grounded, sources });
}

export async function history(req, res) {
  const logs = await DoubtLog.find({ user_id: req.user.id, video_id: req.params.videoId }).sort({ createdAt: 1 });
  res.json(logs);
}

export async function clearHistory(req, res) {
  await DoubtLog.deleteMany({ user_id: req.user.id, video_id: req.params.videoId });
  res.status(204).end();
}

export { SYSTEM as DOUBT_SYSTEM };

import MockTest from '../models/MockTest.js';
import { generateJSON, Type } from '../services/gemini.service.js';

const questionSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      type: { type: Type.STRING, enum: ['mcq', 'short', 'long'] },
      prompt: { type: Type.STRING },
      options: { type: Type.ARRAY, items: { type: Type.STRING } },
      answer: { type: Type.STRING },
      explanation: { type: Type.STRING },
      topic: { type: Type.STRING },
      difficulty: { type: Type.INTEGER },
    },
    required: ['type', 'prompt', 'answer', 'explanation', 'topic', 'difficulty'],
  },
};

const gradeSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: { correct: { type: Type.BOOLEAN }, marks: { type: Type.NUMBER }, feedback: { type: Type.STRING } },
    required: ['correct', 'marks', 'feedback'],
  },
};

/** Adaptive difficulty: average of the last 3 test scores decides the level (1–5). */
async function nextDifficulty(userId, subject) {
  const recent = await MockTest.find({ user_id: userId, subject, score: { $ne: null } }).sort({ createdAt: -1 }).limit(3);
  if (!recent.length) return 2;
  const avg = recent.reduce((a, t) => a + t.score, 0) / recent.length;
  return avg > 80 ? 4 : avg > 60 ? 3 : avg > 40 ? 2 : 1;
}

export async function create(req, res) {
  const { subject, topics, count = 5, mix = 'mcq' } = req.body;
  const difficulty = await nextDifficulty(req.user.id, subject);
  const questions = await generateJSON(
    `Write ${count} ${subject} exam questions on: ${topics.join(', ')}. Difficulty ${difficulty}/5, CBSE board pattern. `
    + `Format mix: ${mix}. MCQs have 4 options and "answer" is the exact correct option text.`,
    questionSchema,
  );
  const test = await MockTest.create({ user_id: req.user.id, subject, topics, questions });
  // Answers stay on the server until submission.
  res.json({ id: test._id, difficulty, questions: questions.map(({ answer, explanation, ...q }) => q) });
}

export async function submit(req, res) {
  const test = await MockTest.findOne({ _id: req.params.id, user_id: req.user.id });
  const { responses } = req.body;
  const graded = await generateJSON(
    'Grade each response. MCQ: exact match. Short/long: award partial marks (0-1) and explain the gap.\n'
    + JSON.stringify(test.questions.map((q, i) => ({ q: q.prompt, expected: q.answer, given: responses[i] ?? '' }))),
    gradeSchema,
  );
  const score = Math.round((graded.reduce((a, g) => a + g.marks, 0) / graded.length) * 100);
  Object.assign(test, { responses, feedback: graded, score });
  await test.save();
  res.json({
    score,
    results: test.questions.map((q, i) => ({ ...q.toObject(), given: responses[i], ...graded[i] })),
  });
}

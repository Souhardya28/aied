import { generateJSON, Type } from './gemini.service.js';

const schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      chapter: { type: Type.STRING },
      topic: { type: Type.STRING },
      questions: { type: Type.INTEGER },
      marks: { type: Type.NUMBER },
    },
    required: ['chapter', 'topic', 'questions', 'marks'],
  },
};

/** Gemini document understanding: reads a scanned paper directly (no OCR step). */
export async function analysePaper(buffer, mimeType, subject) {
  return generateJSON(
    [
      { inlineData: { data: buffer.toString('base64'), mimeType } },
      { text: `This is a ${subject} previous-year question paper. For each question, tag its chapter and topic. `
        + 'Aggregate by topic: number of questions and total marks.' },
    ],
    schema,
  );
}

/** Merges topic weightage with the student's marks into a ranked focus list. */
export function rankFocusAreas(weightage, marks) {
  const bySubject = Object.fromEntries(marks.map((m) => [m.subject, m.marks / (m.max_marks || 100)]));
  return weightage
    .map((w) => {
      const gap = 1 - (bySubject[w.subject] ?? 0.6);
      return { ...w, gap, impact: +(w.weightage * (0.4 + gap)).toFixed(2) };
    })
    .sort((a, b) => b.impact - a.impact);
}

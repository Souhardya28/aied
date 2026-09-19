import { generateJSON, Type } from './gemini.service.js';
import { LANGUAGES } from '../utils/languages.js';

const schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: { start: { type: Type.NUMBER }, text: { type: Type.STRING } },
    required: ['start', 'text'],
  },
};

export async function translateSegments(segments, lang) {
  const target = LANGUAGES[lang];
  if (!target) throw Object.assign(new Error(`Unsupported language: ${lang}`), { status: 400 });
  if (lang === 'en') return segments;
  return generateJSON(
    `Translate each segment into ${target.name} (${target.native} script) for a school student. `
    + 'Keep scientific terms, formulas and units accurate; add the English term in brackets the first time a technical word appears. '
    + 'Keep every `start` value unchanged and the same number of segments.\n\n'
    + JSON.stringify(segments),
    schema,
  );
}

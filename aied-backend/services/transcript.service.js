import { generateJSON, Type } from './gemini.service.js';

const schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    topic: { type: Type.STRING },
    segments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: { start: { type: Type.NUMBER }, text: { type: Type.STRING } },
        required: ['start', 'text'],
      },
    },
  },
  required: ['title', 'segments'],
};

/** Gemini video understanding: pass the YouTube URL directly, get timestamped transcript. */
export async function extractTranscript(youtubeUrl) {
  return generateJSON(
    [
      { fileData: { fileUri: youtubeUrl } },
      { text: 'Transcribe this lecture verbatim. Split into segments of 1-3 sentences. '
        + '`start` is the segment start time in seconds. Also return the lecture title and its main syllabus topic.' },
    ],
    schema,
  );
}

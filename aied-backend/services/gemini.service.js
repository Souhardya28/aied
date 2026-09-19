// Every Gemini call in the app goes through this one module.
import { GoogleGenAI, Type } from '@google/genai';
import { env } from '../config/env.js';

const ai = new GoogleGenAI({ apiKey: env.geminiKey });
export { Type };

/** Plain text generation. `parts` can mix text and fileData (YouTube URL / uploaded doc). */
export async function generate(parts, { system, model = env.geminiModel } = {}) {
  const res = await ai.models.generateContent({
    model,
    contents: [{ role: 'user', parts: Array.isArray(parts) ? parts : [{ text: parts }] }],
    config: system ? { systemInstruction: system } : undefined,
  });
  return res.text;
}

/** JSON mode — Gemini returns data that matches `schema`. */
export async function generateJSON(parts, schema, { system } = {}) {
  const res = await ai.models.generateContent({
    model: env.geminiModel,
    contents: [{ role: 'user', parts: Array.isArray(parts) ? parts : [{ text: parts }] }],
    config: { systemInstruction: system, responseMimeType: 'application/json', responseSchema: schema },
  });
  return JSON.parse(res.text);
}

/** Streams a chat reply chunk by chunk (used by Socket.io). */
export async function* streamChat(history, { system } = {}) {
  const stream = await ai.models.generateContentStream({
    model: env.geminiModel,
    contents: history,
    config: { systemInstruction: system },
  });
  for await (const chunk of stream) if (chunk.text) yield chunk.text;
}

/** Embeds an array of strings; returns an array of vectors. */
export async function embed(texts, taskType = 'RETRIEVAL_DOCUMENT') {
  const res = await ai.models.embedContent({
    model: env.embedModel,
    contents: texts,
    config: { taskType, outputDimensionality: 768 },
  });
  return res.embeddings.map((e) => e.values);
}

/** Gemini native TTS. Returns raw 24kHz 16-bit mono PCM as a Buffer. */
export async function speak(text, voiceName = 'Kore') {
  const res = await ai.models.generateContent({
    model: env.ttsModel,
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
    },
  });
  const b64 = res.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!b64) throw new Error('Gemini TTS returned no audio');
  return Buffer.from(b64, 'base64');
}

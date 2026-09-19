import { speak } from './gemini.service.js';
import { env } from '../config/env.js';
import { LANGUAGES } from '../utils/languages.js';

/** Wraps raw PCM (24kHz, 16-bit, mono) in a WAV header so browsers can play it. */
function pcmToWav(pcm, sampleRate = 24000) {
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

async function bhashiniTTS(text, lang) {
  if (!env.bhashiniKey || !env.bhashiniUrl) {
    throw Object.assign(new Error(`Narration for ${LANGUAGES[lang].name} needs the Bhashini fallback. Add BHASHINI_API_KEY.`), { status: 501 });
  }
  const res = await fetch(env.bhashiniUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: env.bhashiniKey },
    body: JSON.stringify({ text, language: lang, gender: 'female' }),
  });
  if (!res.ok) throw new Error(`Bhashini TTS failed (${res.status})`);
  const { audio } = await res.json(); // base64 wav
  return Buffer.from(audio, 'base64');
}

/** Returns a WAV Buffer for the given text/language, choosing Gemini or Bhashini. */
export async function narrate(text, lang) {
  if (LANGUAGES[lang]?.geminiTts) return pcmToWav(await speak(text));
  return bhashiniTTS(text, lang);
}

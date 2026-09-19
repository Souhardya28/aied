import Video from '../models/Video.js';
import { extractTranscript } from '../services/transcript.service.js';
import { translateSegments } from '../services/translation.service.js';
import { narrate } from '../services/tts.service.js';
import { indexTranscript } from '../services/rag.service.js';
import { videoQueue } from '../services/queue.service.js';
import { isYouTubeUrl } from '../middleware/validate.js';

/** POST /api/transcript — extract (cached) + translate into `lang`. */
export async function extract(req, res) {
  const { url, lang = 'en' } = req.body;
  if (!isYouTubeUrl(url)) return res.status(400).json({ error: 'Paste a full YouTube link, like https://youtu.be/…' });

  let video = await Video.findOne({ youtube_url: url });
  if (!video) {
    const { title, segments } = await extractTranscript(url);
    video = await Video.create({ youtube_url: url, title, transcript: segments, status: 'ready' });
    // Embedding is slow — hand it to the worker when Redis is available.
    if (videoQueue) await videoQueue.add('index', { videoId: video._id.toString() });
    else await indexTranscript(video._id, segments);
  }

  if (lang !== 'en' && !video.translations.get(lang)) {
    video.translations.set(lang, await translateSegments(video.transcript, lang));
    await video.save();
  }

  res.json({
    id: video._id,
    title: video.title,
    url: video.youtube_url,
    transcript: video.transcript,
    translated: lang === 'en' ? video.transcript : video.translations.get(lang),
    lang,
  });
}

/** GET /api/transcript/:id/audio?lang=as — narrated WAV. */
export async function audio(req, res) {
  const video = await Video.findById(req.params.id);
  const segs = video?.translations.get(req.query.lang);
  if (!segs) return res.status(404).json({ error: 'Translate the lecture before playing narration.' });
  const wav = await narrate(segs.map((s) => s.text).join(' '), req.query.lang);
  res.set('Content-Type', 'audio/wav').send(wav);
}

/** GET /api/transcript/:id/download?lang=as — plain-text transcript for offline revision. */
export async function download(req, res) {
  const video = await Video.findById(req.params.id);
  const segs = req.query.lang && req.query.lang !== 'en' ? video.translations.get(req.query.lang) : video.transcript;
  const fmt = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
  res.set('Content-Disposition', `attachment; filename="${video.title}.txt"`);
  res.type('text/plain').send(segs.map((s) => `[${fmt(s.start)}] ${s.text}`).join('\n'));
}

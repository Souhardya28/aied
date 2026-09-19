# AIEd — learn in your own language

Paste a YouTube lecture → transcript in Assamese / Bengali / Hindi / more → narration → a doubt solver grounded
in the lecture → syllabus dashboard → AI mock tests → past-paper analysis → career guide.

Stack: **MERN + Google Gemini API** (video understanding, translation, TTS, embeddings, chat, JSON mode, document understanding).

```
aied/
├── aied-web/        React + Vite + Tailwind + Recharts + Zustand  ← hackathon demo
├── aied-backend/    Express + Socket.io + Mongoose + BullMQ + Gemini
├── aied-app/        React Native (Expo) shell, same screen structure
├── data/            syllabus, career knowledge base, sample PYQ data
├── docker-compose.yml   api + worker + MongoDB + Redis
└── .github/workflows/ci.yml
```

## Run the demo in 30 seconds (no backend, no API key)

```bash
cd aied-web
npm install
npm run dev          # http://localhost:5173
```

The header shows **Demo data**. Every feature works on built-in sample data (Faraday's law lecture,
translations in অসমীয়া / বাংলা / हिन्दी, dashboard, mock tests, PYQ ranking, career bot).

## Run with the real backend

```bash
cp aied-backend/.env.example aied-backend/.env   # add GEMINI_API_KEY
docker compose up -d                              # mongo, redis, api, worker
cd aied-backend && npm install && npm run seed    # syllabus + career KB
cd ../aied-web && npm run dev
```

Sign-in: `POST /api/auth/register` then store the token (`useAppStore.getState().setToken(token)`).
When the API is reachable and a token is set, the header switches to **Live**.

### Atlas Vector Search
Create a vector index named `transcript_vector_index` on the `transcriptchunks` collection:
```json
{ "fields": [
  { "type": "vector", "path": "embedding", "numDimensions": 768, "similarity": "cosine" },
  { "type": "filter", "path": "video_id" } ] }
```

### Narration languages
Gemini-TTS handles most languages. Assamese is routed to the Bhashini fallback in
`services/tts.service.js` — set `BHASHINI_API_KEY` and `BHASHINI_TTS_URL`.

## API

| Method | Path | What it does |
|---|---|---|
| POST | /api/transcript | Extract (Gemini video) + translate. Body `{url, lang}` |
| GET | /api/transcript/:id/audio?lang= | Narrated WAV |
| GET | /api/transcript/:id/download?lang= | Plain-text transcript |
| POST | /api/doubt | RAG answer. Streaming version over Socket.io `doubt:ask` |
| GET/DELETE | /api/doubt/:videoId/history | Doubt history (students can delete) |
| POST | /api/career | Career bot. Streaming: `career:ask` |
| GET | /api/syllabus, /api/syllabus/dashboard | Syllabus tree, dashboard numbers |
| POST | /api/syllabus/progress | Update topic status / time |
| POST | /api/mocktest, /api/mocktest/:id/submit | Generate (adaptive) and grade |
| POST | /api/analytics/pyq (multipart `paper`) | Read a question paper |
| POST | /api/analytics/marks, GET /api/analytics/plan | Marks + ranked study plan |
| GET | /api/recommend | Next videos for uncovered topics |

## Demo script
1. Home → paste link or "try a sample" → pick অসমীয়া → press play: the highlighted line follows the video.
2. Ask "How did we get 200 volts?" → grounded answer with a *Jump to 1:22* chip.
3. Progress → syllabus %, weak topics, watch-next cards.
4. Mock test → Physics → submit → explanations.
5. Past papers → "Electromagnetic Induction carries 22% of marks…" → drag the marks slider.
6. Career → "I like computers — is engineering right for me?"

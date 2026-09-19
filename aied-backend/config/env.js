import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT || 5000),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/aied',
  redisUrl: process.env.REDIS_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  geminiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  ttsModel: process.env.GEMINI_TTS_MODEL || 'gemini-2.5-flash-preview-tts',
  embedModel: process.env.GEMINI_EMBED_MODEL || 'gemini-embedding-001',
  bhashiniKey: process.env.BHASHINI_API_KEY || '',
  bhashiniUrl: process.env.BHASHINI_TTS_URL || '',
};

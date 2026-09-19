import rateLimit from 'express-rate-limit';

// Gemini calls cost money — cap each client per minute.
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many AI requests. Wait a minute and try again.' },
});

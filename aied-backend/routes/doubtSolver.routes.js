import { Router } from 'express';
import { asyncHandler as h } from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { requireFields } from '../middleware/validate.js';
import * as c from '../controllers/doubtSolver.controller.js';

const r = Router();
r.use(requireAuth);
r.post('/', requireFields('videoId', 'question'), h(c.ask));   // RAG chat (non-streaming)
r.get('/:videoId/history', h(c.history));
r.delete('/:videoId/history', h(c.clearHistory));
export default r;

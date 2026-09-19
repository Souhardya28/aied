import { Router } from 'express';
import { asyncHandler as h } from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import * as c from '../controllers/syllabus.controller.js';

const r = Router();
r.use(requireAuth);
r.get('/', h(c.tree));
r.get('/dashboard', h(c.dashboard));
r.post('/progress', h(c.updateProgress));
export default r;

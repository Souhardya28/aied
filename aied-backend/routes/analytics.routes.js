import { Router } from 'express';
import multer from 'multer';
import { asyncHandler as h } from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import * as c from '../controllers/analytics.controller.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });
const r = Router();
r.use(requireAuth);
r.post('/pyq', upload.single('paper'), h(c.uploadPaper));
r.post('/marks', h(c.addMarks));
r.get('/plan', h(c.studyPlan));
r.get('/trends/:subject', h(c.trends));
export default r;

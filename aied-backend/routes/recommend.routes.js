import { Router } from 'express';
import { asyncHandler as h } from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import * as c from '../controllers/recommend.controller.js';

const r = Router();
r.get('/', requireAuth, h(c.nextVideos));
export default r;

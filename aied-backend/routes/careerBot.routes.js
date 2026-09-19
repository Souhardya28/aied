import { Router } from 'express';
import { asyncHandler as h } from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import * as c from '../controllers/careerBot.controller.js';

const r = Router();
r.post('/', requireAuth, h(c.chat));
export default r;

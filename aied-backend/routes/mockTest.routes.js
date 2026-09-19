import { Router } from 'express';
import { asyncHandler as h } from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { requireFields } from '../middleware/validate.js';
import * as c from '../controllers/mockTest.controller.js';

const r = Router();
r.use(requireAuth);
r.post('/', requireFields('subject', 'topics'), h(c.create));
r.post('/:id/submit', requireFields('responses'), h(c.submit));
export default r;

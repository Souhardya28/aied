import { Router } from 'express';
import { asyncHandler as h } from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { requireFields } from '../middleware/validate.js';
import * as c from '../controllers/transcript.controller.js';

const r = Router();
r.use(requireAuth);
r.post('/', requireFields('url'), h(c.extract));          // extract + translate
r.get('/:id/audio', h(c.audio));                            // narration
r.get('/:id/download', h(c.download));                      // offline transcript
export default r;

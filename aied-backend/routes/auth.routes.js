import { Router } from 'express';
import { asyncHandler as h } from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { requireFields } from '../middleware/validate.js';
import * as c from '../controllers/auth.controller.js';

const r = Router();
r.post('/register', requireFields('name', 'email', 'password'), h(c.register));
r.post('/login', requireFields('email', 'password'), h(c.login));
r.get('/me', requireAuth, h(c.me));
r.patch('/me', requireAuth, h(c.updateProfile));
export default r;

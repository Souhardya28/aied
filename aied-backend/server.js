import http from 'node:http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { Server } from 'socket.io';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { aiLimiter } from './middleware/rateLimit.js';
import { errorHandler, notFound } from './middleware/error.js';
import authRoutes from './routes/auth.routes.js';
import transcriptRoutes from './routes/transcript.routes.js';
import doubtRoutes from './routes/doubtSolver.routes.js';
import careerRoutes from './routes/careerBot.routes.js';
import syllabusRoutes from './routes/syllabus.routes.js';
import mockTestRoutes from './routes/mockTest.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import recommendRoutes from './routes/recommend.routes.js';
import { registerChatSockets } from './controllers/socket.controller.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'aied-backend' }));
app.use('/api/auth', authRoutes);
app.use('/api/transcript', aiLimiter, transcriptRoutes);
app.use('/api/doubt', aiLimiter, doubtRoutes);
app.use('/api/career', aiLimiter, careerRoutes);
app.use('/api/syllabus', syllabusRoutes);
app.use('/api/mocktest', aiLimiter, mockTestRoutes);
app.use('/api/analytics', aiLimiter, analyticsRoutes);
app.use('/api/recommend', recommendRoutes);
app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: env.clientOrigin } });
registerChatSockets(io);

await connectDB();
server.listen(env.port, () => console.log(`[api] listening on :${env.port}`));

import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { streamChat } from '../services/gemini.service.js';
import { prepareDoubt, DOUBT_SYSTEM } from './doubtSolver.controller.js';
import { buildCareerContext } from './careerBot.controller.js';
import DoubtLog from '../models/DoubtLog.js';

/** Streams doubt-solver and career-bot replies token by token. */
export function registerChatSockets(io) {
  io.use((socket, next) => {
    try { socket.user = jwt.verify(socket.handshake.auth?.token, env.jwtSecret); next(); }
    catch { next(new Error('unauthorized')); }
  });

  io.on('connection', (socket) => {
    socket.on('doubt:ask', async ({ videoId, question, lang }) => {
      try {
        const { grounded, sources, prompt } = await prepareDoubt(videoId, question, lang);
        socket.emit('doubt:meta', { grounded, sources });
        let answer = '';
        for await (const t of streamChat([{ role: 'user', parts: [{ text: prompt }] }], { system: DOUBT_SYSTEM })) {
          answer += t;
          socket.emit('doubt:token', t);
        }
        socket.emit('doubt:done');
        await DoubtLog.create({ user_id: socket.user.id, video_id: videoId, question, answer, grounded, sources });
      } catch (e) { socket.emit('chat:error', e.message); }
    });

    socket.on('career:ask', async ({ messages }) => {
      try {
        const system = await buildCareerContext(socket.user.id);
        const history = messages.map((m) => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }));
        for await (const t of streamChat(history, { system })) socket.emit('career:token', t);
        socket.emit('career:done');
      } catch (e) { socket.emit('chat:error', e.message); }
    });
  });
}

import { io } from 'socket.io-client';
import { apiBase } from './api.js';
import { useAppStore } from '../store/useAppStore.js';

let socket;
export function getSocket() {
  if (!socket) socket = io(apiBase || undefined, { auth: { token: useAppStore.getState().token } });
  return socket;
}

/** Streams a reply via Socket.io. `event` is 'doubt' or 'career'. Resolves with the full text. */
export function streamAsk(event, payload, { onMeta, onToken }) {
  const s = getSocket();
  return new Promise((resolve, reject) => {
    let text = '';
    const off = () => {
      ['meta', 'token', 'done'].forEach((k) => s.off(`${event}:${k}`));
      s.off('chat:error');
    };
    s.on(`${event}:meta`, (m) => onMeta?.(m));
    s.on(`${event}:token`, (t) => { text += t; onToken?.(text); });
    s.on(`${event}:done`, () => { off(); resolve(text); });
    s.on('chat:error', (e) => { off(); reject(new Error(e)); });
    s.emit(`${event}:ask`, payload);
  });
}

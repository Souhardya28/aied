import { useAppStore } from '../store/useAppStore.js';

const BASE = import.meta.env.VITE_API_URL || '';
const FORCE_DEMO = import.meta.env.VITE_DEMO === 'true';

let backendUp = null; // cached health check

export async function isBackendUp() {
  if (FORCE_DEMO) return false;
  if (backendUp !== null) return backendUp;
  try {
    const r = await fetch(`${BASE}/api/health`, { signal: AbortSignal.timeout(1500) });
    backendUp = r.ok && (await r.json()).ok === true;
  } catch { backendUp = false; }
  return backendUp;
}

/** True when the app should use the real API (backend up + signed in). */
export async function liveMode() {
  return (await isBackendUp()) && !!useAppStore.getState().token;
}

export async function api(path, { method = 'GET', body, form } = {}) {
  const token = useAppStore.getState().token;
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers: { ...(token && { Authorization: `Bearer ${token}` }), ...(!form && body && { 'Content-Type': 'application/json' }) },
    body: form || (body && JSON.stringify(body)),
  });
  if (res.status === 204) return null;
  const data = res.headers.get('content-type')?.includes('json') ? await res.json() : await res.blob();
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data;
}

export const apiBase = BASE;

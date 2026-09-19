import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Storage that never throws (private mode, sandboxed iframes, quota errors).
const safeStorage = {
  getItem: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  setItem: (k, v) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
  removeItem: (k) => { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};

export const useAppStore = create(persist((set, get) => ({
  token: null,
  theme: 'system',     // 'light' | 'dark' | 'system'
  profile: { name: 'Samudra', class: '12', stream: 'Science (PCM)', board: 'CBSE', lang: 'as', physics: 68, maths: 58 },
  onboarded: false,
  lecture: null,
  doubts: {},          // lectureId -> [{ role, text, grounded, sources }]
  testHistory: [],     // [{ subject, score, at }]
  completed: [],       // lecture ids marked complete
  streak: 6,
  toasts: [],

  setToken: (token) => set({ token }),
  setTheme: (theme) => set({ theme }),
  setLang: (lang) => set((s) => ({ profile: { ...s.profile, lang } })),
  setProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),
  setOnboarded: (onboarded) => set({ onboarded }),
  setLecture: (lecture) => set({ lecture }),
  pushDoubt: (lectureId, msg) =>
    set((s) => ({ doubts: { ...s.doubts, [lectureId]: [...(s.doubts[lectureId] || []), msg] } })),
  patchLastDoubt: (lectureId, patch) =>
    set((s) => {
      const list = [...(s.doubts[lectureId] || [])];
      list[list.length - 1] = { ...list[list.length - 1], ...patch };
      return { doubts: { ...s.doubts, [lectureId]: list } };
    }),
  clearDoubts: (lectureId) => set((s) => ({ doubts: { ...s.doubts, [lectureId]: [] } })),
  addTestResult: (r) => set((s) => ({ testHistory: [...s.testHistory, { ...r, at: Date.now() }].slice(-20) })),
  markComplete: (id) => set((s) => ({ completed: s.completed.includes(id) ? s.completed : [...s.completed, id] })),

  toast: (text, tone = 'default') => {
    const id = Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [...s.toasts, { id, text, tone }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3200);
  },
  allDoubts: () => get().doubts,
}), {
  name: 'aied',
  storage: createJSONStorage(() => safeStorage),
  // Only durable things are saved; the lecture and toasts are session-only.
  partialize: ({ token, theme, profile, onboarded, doubts, testHistory, completed, streak }) =>
    ({ token, theme, profile, onboarded, doubts, testHistory, completed, streak }),
}));

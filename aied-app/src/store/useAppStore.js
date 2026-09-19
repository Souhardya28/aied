import { create } from 'zustand';
export const useAppStore = create((set) => ({
  token: null,
  lang: 'as',
  setToken: (token) => set({ token }),
  setLang: (lang) => set({ lang }),
}));

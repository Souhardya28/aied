import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore.js';

const media = () => window.matchMedia?.('(prefers-color-scheme: dark)');

/** Resolves 'system' to light/dark and writes data-theme on <html>. */
export function useResolvedTheme() {
  const theme = useAppStore((s) => s.theme);
  const [systemDark, setSystemDark] = useState(() => !!media()?.matches);

  useEffect(() => {
    const m = media();
    if (!m) return;
    const on = (e) => setSystemDark(e.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);

  const resolved = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;
  useEffect(() => { document.documentElement.dataset.theme = resolved; }, [resolved]);
  return resolved;
}

/** Hex colours for Recharts (SVG attributes can't read CSS variables). */
export function useChartColors() {
  const dark = useResolvedTheme() === 'dark';
  return dark
    ? { ink: '#EAEBF5', muted: '#969AB8', line: '#2C2F4A', track: '#1D1F35', indigo: '#A099FF', marigold: '#F6C058', leaf: '#5EC492', tooltipBg: '#16182A' }
    : { ink: '#1A1D3A', muted: '#6A6F8C', line: '#E3E5EE', track: '#F5F6FA', indigo: '#4338CA', marigold: '#F4B63F', leaf: '#2F7D5B', tooltipBg: '#FFFFFF' };
}

export const tooltipStyle = (c) => ({
  contentStyle: { background: c.tooltipBg, border: `1px solid ${c.line}`, borderRadius: 12, color: c.ink, fontSize: 13 },
  itemStyle: { color: c.ink },
  labelStyle: { color: c.muted },
});

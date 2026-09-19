import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, PlayCircle, Languages, Trash2, Moon, Sun } from 'lucide-react';
import { NAV } from '../navigation/links.js';
import { LANGUAGES } from '../services/languages.js';
import { useAppStore } from '../store/useAppStore.js';
import { ThemeSegment } from './ThemeToggle.jsx';

/** ⌘K / Ctrl+K — jump anywhere, switch language or theme. */
export default function CommandPalette({ open, onClose }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const input = useRef(null);
  const navigate = useNavigate();
  const setLang = useAppStore((s) => s.setLang);
  const setTheme = useAppStore((s) => s.setTheme);
  const toast = useAppStore((s) => s.toast);

  const items = useMemo(() => [
    { label: 'Home', hint: 'Go to', icon: Home, run: () => navigate('/') },
    { label: 'Open sample lecture', hint: 'Watch', icon: PlayCircle, run: () => navigate('/watch?sample=1') },
    ...NAV.map((n) => ({ label: n.label, hint: 'Go to', icon: n.icon, run: () => navigate(n.to) })),
    ...LANGUAGES.map((l) => ({ label: `Learn in ${l.name}`, hint: l.native, icon: Languages, run: () => { setLang(l.code); toast(`Learning language: ${l.name}`); } })),
    { label: 'Dark theme', hint: 'Theme', icon: Moon, run: () => setTheme('dark') },
    { label: 'Light theme', hint: 'Theme', icon: Sun, run: () => setTheme('light') },
    { label: 'Delete all saved data', hint: 'Privacy', icon: Trash2, run: () => { localStorage.removeItem('aied'); location.reload(); } },
  ], [navigate, setLang, setTheme, toast]);

  const filtered = items.filter((i) => `${i.label} ${i.hint}`.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => { if (open) { setQ(''); setSel(0); setTimeout(() => input.current?.focus(), 10); } }, [open]);
  useEffect(() => setSel(0), [q]);
  if (!open) return null;

  const run = (i) => { i?.run(); onClose(); };
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(filtered.length - 1, s + 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
    if (e.key === 'Enter') run(filtered[sel]);
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] bg-stage/50 backdrop-blur-sm animate-fade grid place-items-start justify-center pt-[12vh] px-4" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Command menu" onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-lg panel shadow-float overflow-hidden animate-pop">
        <div className="flex items-center gap-3 px-4 border-b border-line">
          <Search size={18} className="text-muted" />
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey}
            placeholder="Go to a page, change language…" aria-label="Search commands"
            className="flex-1 bg-transparent py-4 focus:outline-none" />
          <kbd>Esc</kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto p-1.5" role="listbox">
          {filtered.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">Nothing matches “{q}”.</li>}
          {filtered.map((i, n) => (
            <li key={i.label}>
              <button role="option" aria-selected={n === sel} onMouseEnter={() => setSel(n)} onClick={() => run(i)}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left ${n === sel ? 'bg-indigo-soft text-indigo' : ''}`}>
                <i.icon size={16} className="shrink-0" />
                <span className="flex-1 font-medium">{i.label}</span>
                <span className="text-xs text-muted">{i.hint}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="border-t border-line px-4 py-3 flex items-center justify-between gap-3">
          <ThemeSegment />
          <span className="hidden sm:flex items-center gap-1 text-xs text-muted"><kbd>↑</kbd><kbd>↓</kbd> move <kbd>↵</kbd> open</span>
        </div>
      </div>
    </div>
  );
}

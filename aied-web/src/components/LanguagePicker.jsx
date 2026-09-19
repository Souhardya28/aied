import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Languages } from 'lucide-react';
import { LANGUAGES, langByCode } from '../services/languages.js';
import { useAppStore } from '../store/useAppStore.js';

export default function LanguagePicker({ compact = false }) {
  const lang = useAppStore((s) => s.profile.lang);
  const setLang = useAppStore((s) => s.setLang);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = langByCode(lang);

  useEffect(() => {
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} aria-haspopup="listbox" aria-expanded={open}
        className={`btn-outline ${compact ? '!px-3 !py-1.5' : ''}`}>
        <Languages size={16} className="text-indigo" />
        <span>{current.native}</span>
        <ChevronDown size={14} className="text-muted" />
      </button>
      {open && (
        <ul role="listbox" aria-label="Learning language"
          className="absolute right-0 mt-2 w-56 panel p-1.5 shadow-[0_12px_40px_-12px_rgba(26,29,58,.25)] z-50 animate-rise">
          {LANGUAGES.map((l) => (
            <li key={l.code}>
              <button role="option" aria-selected={l.code === lang}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-paper ${l.code === lang ? 'text-indigo' : ''}`}>
                <span><span className="font-semibold">{l.native}</span> <span className="text-muted text-sm">{l.name !== l.native && l.name}</span></span>
                {l.code === lang && <Check size={16} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

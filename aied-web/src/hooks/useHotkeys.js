import { useEffect } from 'react';

const typing = (el) => el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);

/** map: { 'k': fn, 'mod+k': fn, ' ': fn, 'ArrowLeft': fn }. Ignores keys while typing unless `mod+`. */
export function useHotkeys(map, deps = []) {
  useEffect(() => {
    const on = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      const key = (mod ? 'mod+' : '') + (e.key.length === 1 ? e.key.toLowerCase() : e.key);
      const fn = map[key];
      if (!fn || (!mod && typing(document.activeElement))) return;
      e.preventDefault();
      fn(e);
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}

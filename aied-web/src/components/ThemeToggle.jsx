import { Moon, Sun, Monitor } from 'lucide-react';
import { useAppStore } from '../store/useAppStore.js';
import { useResolvedTheme } from '../hooks/useTheme.js';

/** Circular reveal from the click point using the View Transitions API; falls back to an instant swap. */
export function revealTheme(e, apply) {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (!document.startViewTransition || reduce) return apply();
  const x = e?.clientX ?? innerWidth - 40, y = e?.clientY ?? 32;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const t = document.startViewTransition(() => {
    apply();
    // Apply synchronously so the "new" snapshot has the new theme
    const pref = useAppStore.getState().theme;
    const dark = pref === 'dark' || (pref === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  });
  t.ready.then(() => document.documentElement.animate(
    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
    { duration: 650, easing: 'cubic-bezier(.2,.7,.2,1)', pseudoElement: '::view-transition-new(root)' },
  ));
}

const ORDER = ['light', 'dark', 'system'];
const META = { light: [Sun, 'Light'], dark: [Moon, 'Dark'], system: [Monitor, 'Match device'] };

/** Cycles light → dark → system. */
export default function ThemeToggle() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  useResolvedTheme();
  const [Icon, label] = META[theme];
  const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
  return (
    <button onClick={(e) => revealTheme(e, () => setTheme(next))} className="btn-outline !p-2.5" title={`Theme: ${label}. Switch to ${META[next][1].toLowerCase()}`}
      aria-label={`Theme: ${label}. Switch to ${META[next][1]}`}>
      <Icon size={16} key={theme} className="animate-pop" />
    </button>
  );
}

/** Segmented control version, used in the command palette. */
export function ThemeSegment() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  return (
    <div className="seg" role="radiogroup" aria-label="Theme">
      {ORDER.map((t) => {
        const [Icon, label] = META[t];
        return (
          <button key={t} role="radio" aria-checked={theme === t} onClick={(e) => revealTheme(e, () => setTheme(t))} className="flex items-center gap-1.5">
            <Icon size={14} /> {label}
          </button>
        );
      })}
    </div>
  );
}

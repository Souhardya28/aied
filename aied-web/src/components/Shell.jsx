import { NavLink, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Search, Home } from 'lucide-react';
import { NAV } from '../navigation/links.js';
import LanguagePicker from './LanguagePicker.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import CommandPalette from './CommandPalette.jsx';
import Toasts from './Toasts.jsx';
import { useLiveMode } from '../hooks/useLiveMode.js';
import { useHotkeys } from '../hooks/useHotkeys.js';
import { useResolvedTheme } from '../hooks/useTheme.js';
import { useGlobalSpotlight } from '../hooks/useFx.js';

const isMac = typeof navigator !== 'undefined' && /Mac|iP/.test(navigator.platform);

export default function Shell({ children }) {
  const [palette, setPalette] = useState(false);
  const { pathname } = useLocation();
  const live = useLiveMode();
  useResolvedTheme();
  useGlobalSpotlight();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  useHotkeys({ 'mod+k': () => setPalette((p) => !p), '/': () => setPalette(true) }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-paper/80 backdrop-blur-md border-b border-line">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="AIEd home">
            <span className="grid place-items-center h-8 w-8 rounded-lg bg-brand text-white font-display font-extrabold text-sm relative overflow-hidden">
              <span className="absolute inset-x-1 bottom-1.5 h-2 rounded-sm bg-[#F4B63F]" />
              <span className="relative">অ</span>
            </span>
            <span className="font-display font-extrabold text-lg">AIEd</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
            {NAV.map(({ to, label }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) => `px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${isActive ? 'bg-ink text-oninv' : 'text-muted hover:text-ink'}`}>
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <span title={live ? 'Connected to the AIEd API' : 'Running on built-in sample data'}
              className={`chip hidden md:inline-flex ${live ? 'bg-leaf/10 text-leaf' : 'bg-marigold-soft text-ink'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${live ? 'bg-leaf' : 'bg-marigold'}`} />
              {live ? 'Live' : 'Demo data'}
            </span>
            <button onClick={() => setPalette(true)} className="btn-outline !px-3 !py-2 text-muted" aria-label="Open command menu">
              <Search size={15} />
              <span className="hidden sm:inline-flex items-center gap-1"><kbd>{isMac ? '⌘' : 'Ctrl'}</kbd><kbd>K</kbd></span>
            </button>
            <LanguagePicker compact />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 pb-20 lg:pb-0" key={pathname}>
        <div className="animate-fade">{children}</div>
      </main>

      <footer className="border-t border-line hidden lg:block">
        <div className="mx-auto max-w-6xl px-5 py-6 text-sm text-muted flex flex-wrap gap-x-6 gap-y-2 justify-between">
          <span>AIEd — hackathon MVP. Built with MERN and the Gemini API.</span>
          <span>Your doubts and marks stay on your device in demo mode. Delete them from the command menu.</span>
        </div>
      </footer>

      {/* Bottom tab bar on phones and tablets */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/90 backdrop-blur-md border-t border-line pb-[env(safe-area-inset-bottom)]" aria-label="Tabs">
        <div className="grid grid-cols-7">
          <NavLink to="/" end className={({ isActive }) => `flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold ${isActive ? 'text-indigo' : 'text-muted'}`}>
            <Home size={20} /> Home
          </NavLink>
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold ${isActive ? 'text-indigo' : 'text-muted'}`}>
              <Icon size={20} /> {label.split(' ')[0]}
            </NavLink>
          ))}
        </div>
      </nav>

      <CommandPalette open={palette} onClose={() => setPalette(false)} />
      <Toasts />
    </div>
  );
}

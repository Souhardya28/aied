import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore.js';

const ICON = { default: Info, success: CheckCircle2, warn: AlertTriangle };

export default function Toasts() {
  const toasts = useAppStore((s) => s.toasts);
  return (
    <div className="fixed z-[60] bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none" aria-live="polite">
      {toasts.map((t) => {
        const Icon = ICON[t.tone] || Info;
        return (
          <div key={t.id} className="animate-rise flex items-center gap-2.5 rounded-full bg-ink text-oninv pl-3.5 pr-5 py-2.5 text-sm font-medium shadow-float">
            <Icon size={16} className={t.tone === 'success' ? 'text-leaf' : t.tone === 'warn' ? 'text-marigold' : ''} />
            {t.text}
          </div>
        );
      })}
    </div>
  );
}

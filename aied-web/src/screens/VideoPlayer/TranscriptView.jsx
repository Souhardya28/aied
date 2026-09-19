import { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';

const fmt = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

/** Timestamped transcript, original and translated side by side, synced to playback. */
export default function TranscriptView({ original, translated, langLabel, time, onSeek, showOriginal, pingAt }) {
  const [q, setQ] = useState('');
  const activeRef = useRef(null);
  const boxRef = useRef(null);

  const active = useMemo(() => {
    let idx = 0;
    original.forEach((s, i) => { if (time >= s.start) idx = i; });
    return idx;
  }, [original, time]);

  // Keep the active line in view, without scrolling the whole page
  useEffect(() => {
    const box = boxRef.current, el = activeRef.current;
    if (!box || !el || q) return;
    const top = el.offsetTop - box.offsetTop - box.clientHeight / 3;
    box.scrollTo({ top, behavior: 'smooth' });
  }, [active, q]);

  // How far through the active line we are (0–100), for the karaoke highlighter
  const seg = original[active];
  const end = original[active + 1]?.start ?? seg.start + 10;
  const progress = Math.max(4, Math.min(100, ((time - seg.start) / (end - seg.start)) * 100));

  const needle = q.trim().toLowerCase();
  const rows = original.map((s, i) => ({ i, s, tr: translated?.[i] }))
    .filter(({ s, tr }) => !needle || s.text.toLowerCase().includes(needle) || tr?.text.toLowerCase().includes(needle));

  return (
    <div className="panel flex flex-col min-h-0">
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <Search size={16} className="text-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the transcript"
          aria-label="Search the transcript" className="flex-1 bg-transparent text-sm focus:outline-none" />
        {needle && <span className="text-xs text-muted">{rows.length} found</span>}
      </div>
      {showOriginal && (
        <div className="hidden md:grid grid-cols-[3.5rem_1fr_1fr] gap-4 px-4 pt-3 text-xs font-semibold text-muted">
          <span /><span>{langLabel}</span><span>Original</span>
        </div>
      )}
      <div ref={boxRef} className="overflow-y-auto max-h-[26rem] px-2 py-2">
        {rows.length === 0 && <p className="p-4 text-sm text-muted">No lines match “{q}”. Try a shorter word.</p>}
        {rows.map(({ i, s, tr }) => {
          const on = i === active;
          return (
            <button key={i} ref={on ? activeRef : null} onClick={() => onSeek(s.start)}
              data-ping={pingAt?.start === s.start ? pingAt.n : undefined}
              className={`${pingAt?.start === s.start ? 'ping' : ''} w-full text-left grid gap-x-4 gap-y-1 rounded-xl px-2 py-2.5 transition-colors ${showOriginal ? 'md:grid-cols-[3.5rem_1fr_1fr]' : 'grid-cols-[3.5rem_1fr]'} ${on ? 'bg-marigold-soft/60' : 'hover:bg-paper'}`}>
              <span className={`text-xs tabular-nums pt-1 ${on ? 'text-ink font-semibold' : 'text-muted'}`}>{fmt(s.start)}</span>
              <span className="text-[16px] leading-relaxed">
                <span className={on ? 'karaoke' : ''} style={on ? { '--p': `${progress}%` } : undefined}>{tr?.text ?? s.text}</span>
              </span>
              {showOriginal && <span className="text-sm text-muted leading-relaxed col-start-2 md:col-start-auto">{s.text}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

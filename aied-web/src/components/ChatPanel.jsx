import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, SendHorizontal, BookOpenCheck, Globe2, Copy, Check } from 'lucide-react';
import { useVoiceInput } from '../hooks/useSpeech.js';

const fmt = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

/** Chat UI shared by the doubt solver and career bot. */
function CopyButton({ text }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard?.writeText(text); setOk(true); setTimeout(() => setOk(false), 1500); }}
      className="chip text-muted hover:text-ink hover:bg-paper" aria-label="Copy answer">
      {ok ? <Check size={13} /> : <Copy size={13} />} {ok ? 'Copied' : 'Copy'}
    </button>
  );
}

export default function ChatPanel({ messages, onSend, busy, placeholder, speechLang, suggestions = [], onSourceClick, empty, className = '' }) {
  const [text, setText] = useState('');
  const endRef = useRef(null);
  const voice = useVoiceInput(speechLang, (t) => setText((p) => (p ? `${p} ${t}` : t)));

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, [messages]);

  const send = (q = text) => {
    if (!q.trim() || busy) return;
    onSend(q.trim());
    setText('');
  };

  return (
    <div className={`flex flex-col min-h-0 ${className}`}>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4" aria-live="polite">
        {messages.length === 0 && (
          <div className="py-6">
            {empty}
            {suggestions.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => send(s)} className="chip border border-line bg-surface hover:border-indigo hover:text-indigo text-sm !py-1.5 text-left">{s}</button>
                ))}
              </div>
            )}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'flex justify-end' : ''}>
            {m.role === 'user' ? (
              <p className="max-w-[85%] rounded-2xl rounded-br-md bg-brand text-white px-4 py-2.5 text-[15px]">{m.text}</p>
            ) : (
              <div className="max-w-[95%] animate-rise">
                {m.grounded !== undefined && (
                  <span className={`chip mb-2 ${m.grounded ? 'bg-leaf/10 text-leaf' : 'bg-marigold-soft text-ink'}`}>
                    {m.grounded ? <BookOpenCheck size={13} /> : <Globe2 size={13} />}
                    {m.grounded ? 'From this lecture' : 'General knowledge — not in this lecture'}
                  </span>
                )}
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{m.text || <span className="shimmer font-medium">Searching the lecture…</span>}</p>
                {(m.sources?.length > 0 || (m.text && !busy)) && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.text && !busy && <CopyButton text={m.text} />}
                    {(m.sources || []).map((s) => (
                      <button key={s.start} onClick={() => onSourceClick?.(s.start)}
                        className="chip bg-indigo-soft text-indigo hover:bg-brand hover:text-white" title={s.text}>
                        Jump to {fmt(s.start)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="border-t border-line p-3 flex items-end gap-2">
        {voice.supported && (
          <button type="button" onClick={voice.listening ? voice.stop : voice.start}
            className={`btn !p-3 ${voice.listening ? 'bg-chili text-white' : 'btn-outline'}`}
            aria-label={voice.listening ? 'Stop voice input' : 'Ask by voice'}>
            {voice.listening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
        )}
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={1}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={voice.listening ? 'Listening…' : placeholder}
          className="field resize-none !py-2.5 h-[46px] max-h-32 leading-snug" aria-label={placeholder} />
        <button type="submit" disabled={!text.trim() || busy} className="btn-primary !p-3" aria-label="Send">
          <SendHorizontal size={18} />
        </button>
      </form>
    </div>
  );
}

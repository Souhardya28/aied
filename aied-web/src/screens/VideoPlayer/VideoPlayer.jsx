import { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Download, Headphones, Pause, Play, CheckCircle2, Columns2, Loader2, Info, Keyboard, RotateCcw } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore.js';
import { useHotkeys } from '../../hooks/useHotkeys.js';
import { usePlayer, youtubeId } from '../../hooks/usePlayer.js';
import { useNarration } from '../../hooks/useSpeech.js';
import { SAMPLE_LECTURE } from '../../services/mock.js';
import { api, liveMode } from '../../services/api.js';
import { langByCode } from '../../services/languages.js';
import LanguagePicker from '../../components/LanguagePicker.jsx';
import TranscriptView from './TranscriptView.jsx';
import LectureDoubts from '../DoubtSolver/LectureDoubts.jsx';
import { confettiFrom } from '../../utils/confetti.js';

export default function VideoPlayer() {
  const [params, setParams] = useSearchParams();
  const url = params.get('url');
  const sample = params.get('sample');
  const lang = useAppStore((s) => s.profile.lang);
  const lecture = useAppStore((s) => s.lecture);
  const setLecture = useAppStore((s) => s.setLecture);
  const [state, setState] = useState({ loading: false, error: '', note: '' });
  const [translated, setTranslated] = useState(null);
  const [showOriginal, setShowOriginal] = useState(true);
  const completed = useAppStore((s) => s.completed);
  const markComplete = useAppStore((s) => s.markComplete);
  const toast = useAppStore((s) => s.toast);
  const [showKeys, setShowKeys] = useState(false);
  const [pingAt, setPingAt] = useState(null);
  const completeBtn = useRef(null);
  const [input, setInput] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);
  const mountRef = useRef(null);
  const narration = useNarration();
  const L = langByCode(lang);

  // Load / extract the lecture
  useEffect(() => {
    if (!url && !sample) return;
    let cancel = false;
    (async () => {
      setState({ loading: true, error: '', note: '' });
      try {
        if (url && (await liveMode())) {
          const data = await api('/transcript', { method: 'POST', body: { url, lang } });
          if (!cancel) setLecture({ ...data, translations: { [lang]: data.translated }, duration: data.transcript.at(-1)?.start + 10 });
        } else {
          await new Promise((r) => setTimeout(r, 600));
          if (cancel) return;
          if (url && !youtubeId(url)) throw new Error("That doesn't look like a YouTube link. It should start with youtube.com or youtu.be.");
          setLecture({ ...SAMPLE_LECTURE, url: url || null });
          setState({ loading: false, error: '', note: url ? 'Transcript extraction needs the AIEd API. Showing the sample transcript so you can try every feature.' : '' });
          return;
        }
        if (!cancel) setState({ loading: false, error: '', note: '' });
      } catch (e) {
        if (!cancel) setState({ loading: false, error: e.message, note: '' });
      }
    })();
    return () => { cancel = true; };
  }, [url, sample]); // eslint-disable-line react-hooks/exhaustive-deps

  // Translation for the chosen language
  useEffect(() => {
    if (!lecture) return;
    setAudioUrl(null);
    if (lang === 'en') return setTranslated(lecture.transcript);
    if (lecture.translations?.[lang]) return setTranslated(lecture.translations[lang]);
    (async () => {
      if (await liveMode() && lecture.url) {
        setTranslated(null);
        const data = await api('/transcript', { method: 'POST', body: { url: lecture.url, lang } });
        setLecture({ ...lecture, translations: { ...lecture.translations, [lang]: data.translated } });
      } else {
        setTranslated(lecture.transcript);
        setState((s) => ({ ...s, note: `Sample translations cover Assamese, Bengali and Hindi. ${L.name} needs the AIEd API — showing English for now.` }));
      }
    })();
  }, [lecture, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  const vid = youtubeId(lecture?.url || '');
  const player = usePlayer({ videoId: vid, duration: lecture?.duration || 100, mountRef });

  const done = lecture ? completed.includes(lecture.id) : false;
  const [captions, setCaptions] = useState(true);
  // Live caption: the translated line being spoken right now
  const caption = (() => {
    if (!translated) return null;
    let c = null;
    translated.forEach((s) => { if (player.time >= s.start) c = s; });
    return c;
  })();

  useHotkeys({
    ' ': player.toggle, k: player.toggle,
    j: () => player.nudge(-10), l: () => player.nudge(10),
    ArrowLeft: () => player.nudge(-5), ArrowRight: () => player.nudge(5),
    '?': () => setShowKeys((v) => !v),
  }, [player.toggle, player.nudge]);

  const listen = async () => {
    if (narration.speaking) return narration.stop();
    if (audioUrl) return audioRef.current?.play();
    if (await liveMode() && lecture.id && !lecture.id.startsWith('demo')) {
      const blob = await api(`/transcript/${lecture.id}/audio?lang=${lang}`);
      const u = URL.createObjectURL(blob);
      setAudioUrl(u);
      setTimeout(() => audioRef.current?.play(), 50);
    } else {
      const from = translated.findIndex((s, i) => player.time < (translated[i + 1]?.start ?? Infinity));
      narration.speak(translated.slice(Math.max(0, from)).map((s) => s.text).join(' '), L.speech);
    }
  };

  const download = () => {
    const f = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
    const body = `${lecture.title}\n${L.name}\n\n` + translated.map((s, i) => `[${f(s.start)}] ${s.text}\n        ${lecture.transcript[i].text}`).join('\n\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([body], { type: 'text/plain;charset=utf-8' }));
    a.download = `${lecture.title.replace(/[^\w]+/g, '-')}-${lang}.txt`;
    a.click();
    toast('Transcript downloaded', 'success');
  };

  // Jumping from a doubt's source chip seeks and pulses that transcript line
  const jumpFromDoubt = (t) => { player.seek(t); setPingAt({ start: t, n: Date.now() }); };

  const markDone = async () => {
    confettiFrom(completeBtn.current);
    markComplete(lecture.id);
    toast('Lecture marked complete. Syllabus updated.', 'success');
    if (await liveMode()) api('/syllabus/progress', { method: 'POST', body: { topicId: lecture.topic_id, status: 'done', minutes: Math.round(player.time / 60) } }).catch(() => {});
  };

  // Empty state: ask for a link
  if (!url && !sample) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20">
        <h1 className="text-4xl font-extrabold">Open a lecture</h1>
        <p className="mt-2 text-muted text-[17px]">Paste a YouTube link. You'll get the transcript in {L.native}, narration, and a doubt solver that knows what was taught.</p>
        <form onSubmit={(e) => { e.preventDefault(); input.trim() && setParams({ url: input.trim() }); }} className="mt-8 flex flex-col sm:flex-row gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} className="field" placeholder="https://youtu.be/…" aria-label="YouTube lecture link" />
          <button className="btn-primary !py-3">Open lecture</button>
        </form>
        <button onClick={() => setParams({ sample: '1' })} className="mt-4 text-sm font-semibold text-indigo hover:underline underline-offset-4">Use the sample lecture instead</button>
      </div>
    );
  }

  if (state.loading || !lecture) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-24 flex flex-col items-center text-center">
        <Loader2 className="animate-spin text-indigo" size={28} />
        <p className="mt-4 font-semibold">Reading the lecture</p>
        <p className="text-muted text-sm">Pulling the transcript and translating it into {L.name}.</p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24">
        <h1 className="text-2xl font-bold">Couldn't open that lecture</h1>
        <p className="mt-2 text-muted">{state.error}</p>
        <div className="mt-6 flex gap-2">
          <button className="btn-primary" onClick={() => setParams({})}>Paste another link</button>
          <button className="btn-outline" onClick={() => setParams({ sample: '1' })}>Try the sample</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="min-w-0 space-y-4">
        <div className="aspect-video rounded-xl2 overflow-hidden bg-stage relative shadow-float">
          {/* Subtitles in the student's language, over either player */}
          {captions && caption && (player.playing || player.time > 0) && (
            <div className="absolute inset-x-0 bottom-20 sm:bottom-24 z-10 flex justify-center px-6 pointer-events-none">
              <p key={caption.start} className="animate-rise max-w-2xl text-center text-[15px] sm:text-lg font-medium leading-snug text-white bg-black/55 backdrop-blur-sm rounded-xl px-4 py-2">
                {caption.text}
              </p>
            </div>
          )}
          {vid ? <div ref={mountRef} className="w-full h-full" /> : (
            <>
            <div aria-hidden className={`absolute inset-0 overflow-hidden transition-opacity duration-700 ${player.playing ? 'opacity-100' : 'opacity-40'}`}>
              <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-[#4338CA]/50 blur-3xl animate-[drift_14s_ease-in-out_infinite] motion-reduce:animate-none" />
              <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-[#F4B63F]/25 blur-3xl animate-[drift_18s_ease-in-out_infinite_reverse] motion-reduce:animate-none" />
              <svg className="absolute inset-x-0 bottom-0 w-full h-24 opacity-30" viewBox="0 0 800 100" preserveAspectRatio="none">
                <path d="M0 60 Q 100 20 200 60 T 400 60 T 600 60 T 800 60" fill="none" stroke="#F4B63F" strokeWidth="2"
                  className={player.playing ? 'animate-[wave_2.4s_linear_infinite] motion-reduce:animate-none' : ''} />
              </svg>
            </div>
            <div className="absolute inset-0 z-[5] flex flex-col justify-between p-6 sm:p-8 text-white">
              <span className="chip bg-white/10 self-start">Sample lecture</span>
              <div>
                <p className="font-display text-2xl sm:text-4xl font-extrabold leading-tight max-w-md">e = −N dφ/dt</p>
                <p className="mt-2 text-white/70 text-sm">{lecture.title}</p>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={player.playing ? player.pause : player.play}
                  className="grid place-items-center h-12 w-12 rounded-full bg-[#F4B63F] text-[#1A1D3A] hover:scale-105 transition-transform" aria-label={player.playing ? 'Pause' : 'Play'}>
                  {player.playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                </button>
                <input type="range" min={0} max={lecture.duration} step={0.5} value={player.time}
                  onChange={(e) => player.seek(+e.target.value)} aria-label="Seek"
                  className="flex-1 accent-[#F4B63F] h-1 cursor-pointer" />
                <span className="text-xs tabular-nums text-white/70">{Math.floor(player.time)}s / {lecture.duration}s</span>
                <button onClick={() => setCaptions((c) => !c)} aria-pressed={captions}
                  className={`chip border ${captions ? 'border-white/60 text-white' : 'border-white/20 text-white/50'}`}>CC</button>
              </div>
            </div>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-bold mr-auto w-full sm:w-auto">{lecture.title}</h1>
          <LanguagePicker />
          <button className="btn-outline" onClick={listen} disabled={!translated}>
            {narration.speaking ? <span className="eq text-indigo" aria-hidden><i /><i /><i /><i /></span> : <Headphones size={16} />}
            {narration.speaking ? 'Stop' : 'Listen'}
          </button>
          <div className="seg" role="radiogroup" aria-label="Playback speed">
            {[0.75, 1, 1.25, 1.5].map((r) => (
              <button key={r} role="radio" aria-checked={player.rate === r} onClick={() => player.setRate(r)} className="!px-2.5 !py-1 tabular-nums">{r}×</button>
            ))}
          </div>
          <button className="btn-outline !px-3" onClick={() => setShowOriginal(!showOriginal)} aria-pressed={showOriginal} title="Show original alongside">
            <Columns2 size={16} /> <span className="sr-only">Show original alongside</span>
          </button>
          <button className="btn-outline !px-3" onClick={download} disabled={!translated} title="Download transcript">
            <Download size={16} /> <span className="sr-only">Download transcript</span>
          </button>
          <button className="btn-outline !px-3 hidden sm:inline-flex" onClick={() => setShowKeys((v) => !v)} aria-expanded={showKeys} title="Keyboard shortcuts">
            <Keyboard size={16} /> <span className="sr-only">Keyboard shortcuts</span>
          </button>
        </div>
        {showKeys && (
          <div className="panel p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm animate-pop">
            <span className="flex items-center gap-2"><kbd>Space</kbd> Play / pause</span>
            <span className="flex items-center gap-2"><kbd>←</kbd><kbd>→</kbd> 5 seconds</span>
            <span className="flex items-center gap-2"><kbd>J</kbd><kbd>L</kbd> 10 seconds</span>
            <span className="flex items-center gap-2"><kbd>Ctrl</kbd><kbd>K</kbd> Command menu</span>
          </div>
        )}
        {audioUrl && <audio ref={audioRef} src={audioUrl} controls className="w-full" />}

        {state.note && (
          <p className="flex gap-2 text-sm rounded-xl bg-marigold-soft px-4 py-3"><Info size={16} className="shrink-0 mt-0.5" /> {state.note}</p>
        )}

        {translated ? (
          <TranscriptView original={lecture.transcript} translated={translated} langLabel={L.native}
            time={player.time} onSeek={player.seek} showOriginal={showOriginal} pingAt={pingAt} />
        ) : (
          <div className="panel p-8 text-center text-muted"><Loader2 className="animate-spin inline mr-2" size={16} /> Translating into {L.name}…</div>
        )}

        <div className="flex flex-wrap items-center gap-3 panel px-5 py-4">
          {done ? (
            <>
              <CheckCircle2 className="text-leaf" size={20} />
              <p className="text-sm"><b>Marked complete.</b> Faraday's law is ticked off in your syllabus.</p>
              <button onClick={() => player.seek(0)} className="btn-ghost !px-3 ml-auto"><RotateCcw size={15} /> Rewatch</button>
              <Link to="/test?subject=Physics" className="btn-primary">Test yourself on it</Link>
            </>
          ) : (
            <>
              <p className="text-sm text-muted">Finished watching? Mark it and your syllabus updates.</p>
              <button ref={completeBtn} onClick={markDone} className="btn-outline ml-auto"><CheckCircle2 size={16} /> Mark lecture complete</button>
            </>
          )}
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <LectureDoubts lecture={lecture} segments={translated || lecture.transcript} onSeek={jumpFromDoubt} />
      </aside>
    </div>
  );
}

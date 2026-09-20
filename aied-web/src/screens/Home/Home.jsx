import { useEffect, useRef, useState } from 'react';
import Tilt from '../../components/Tilt.jsx';
import { useReveal } from '../../hooks/useFx.js';
import { LANGUAGES } from '../../services/languages.js';
import { Link, useNavigate } from 'react-router-dom';
import { Link2, Play, MessageCircleQuestion, ClipboardCheck, BookOpenCheck } from 'lucide-react';
import { NAV } from '../../navigation/links.js';
import { SAMPLE_LECTURE } from '../../services/mock.js';
import { useAppStore } from '../../store/useAppStore.js';
import { langByCode } from '../../services/languages.js';

const STEPS = [
  ['Paste a lecture link', 'Any YouTube class. AIEd pulls the full transcript with timestamps.'],
  ['Read or listen in your language', 'Assamese, Bengali, Hindi and more — scientific terms kept exact.'],
  ['Ask what you didn\'t get', 'Answers come from the lecture itself, with the moment it was taught.'],
  ['See what\'s left', 'Your syllabus fills in as you watch. Gaps come with a next video.'],
  ['Test the weak spots', 'Mock tests built from your syllabus, graded with explanations.'],
];

const TOOL_COPY = {
  '/watch': 'Transcript, translation and narration beside the video.',
  '/doubts': 'Every doubt you\'ve asked, grouped by lecture.',
  '/dashboard': 'Syllabus done, time spent, weak topics.',
  '/test': 'Adaptive questions, instant grading.',
  '/pyq': 'Which chapters carry the marks, ranked against your scores.',
  '/career': 'Streams, exams and colleges that fit your marks.',
};

const PREVIEW_LANGS = ['as', 'bn', 'hi'];

/** A miniature of the Watch screen that plays itself. */
function LivePreview() {
  const [line, setLine] = useState(0);
  const [li, setLi] = useState(0);
  const globalLang = useAppStore((s) => s.profile.lang);
  
  useEffect(() => {
    const id = setInterval(() => {
      setLine((n) => {
        if (n === 3) setLi((x) => (x + 1) % PREVIEW_LANGS.length);
        return (n + 1) % 4;
      });
    }, 1900);
    return () => clearInterval(id);
  }, []);
  
  // Use global language if it's one of the preview ones, otherwise cycle
  const code = PREVIEW_LANGS.includes(globalLang) ? globalLang : PREVIEW_LANGS[li];
  const segs = SAMPLE_LECTURE.translations[code].slice(3, 7);
  const L = langByCode(code);

  return (
    <div className="panel shadow-float overflow-hidden" aria-hidden>
      <div className="bg-stage text-white px-5 py-5 flex items-end justify-between h-36 relative">
        <div>
          <p className="text-[11px] text-white/50">Class 12 Physics</p>
          <p className="font-display text-3xl font-extrabold">e = −N dφ/dt</p>
        </div>
        <span className="chip bg-[#F4B63F] text-[#1A1D3A] font-semibold">{L.native}</span>
        <div className="absolute bottom-0 left-0 h-1 bg-[#F4B63F] transition-[width] duration-[1900ms] ease-linear" style={{ width: `${((line + 1) / 4) * 100}%` }} />
      </div>
      <ul className="p-3 space-y-1">
        {segs.map((s, i) => (
          <li key={`${code}-${i}`} className={`grid grid-cols-[2.6rem_1fr] gap-2 rounded-xl px-2 py-2 text-[15px] leading-relaxed transition-colors ${i === line ? 'bg-marigold-soft/70' : ''}`}>
            <span className="text-xs text-muted tabular-nums pt-1">{Math.floor(s.start / 60)}:{String(s.start % 60).padStart(2, '0')}</span>
            <span className={i === line ? '' : 'text-muted'}>
              <span className={i === line ? 'highlight box-decoration-clone' : ''}>{s.text}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="border-t border-line px-4 py-3 flex items-center gap-2 text-sm">
        <span className="chip bg-leaf/10 text-leaf"><BookOpenCheck size={13} /> {L.fromLecture}</span>
        <span className="text-muted truncate">“Why the minus sign?” → Lenz's law, 1:01</span>
      </div>
    </div>
  );
}

const HEADLINE = 'Every lecture, in the language you think in.';

/** Native-script language names scrolling past, endlessly. */
function Marquee() {
  const names = [...LANGUAGES, { native: 'ગુજરાતી' }, { native: 'ଓଡ଼ିଆ' }, { native: 'ਪੰਜਾਬੀ' }, { native: 'ಕನ್ನಡ' }, { native: 'മലയാളം' }];
  const row = names.map((l, i) => <span key={i} className="px-6 font-display text-2xl sm:text-3xl font-bold text-muted/40 whitespace-nowrap">{l.native}</span>);
  return (
    <div className="relative overflow-hidden py-6 border-y border-line [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]" aria-hidden>
      <div className="flex w-max animate-[marquee_38s_linear_infinite] motion-reduce:animate-none">{row}{row}</div>
    </div>
  );
}

export default function Home() {
  const [url, setUrl] = useState('');
  const heroRef = useRef(null);
  const stepsRef = useReveal();
  const toolsRef = useReveal();
  const onHeroMove = (e) => {
    const r = heroRef.current.getBoundingClientRect();
    heroRef.current.style.setProperty('--hx', `${((e.clientX - r.left) / r.width) * 100}%`);
    heroRef.current.style.setProperty('--hy', `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  const navigate = useNavigate();
  const { doubts, testHistory, completed } = useAppStore();
  const doubtCount = Object.values(doubts).reduce((a, m) => a + m.filter((x) => x.role === 'user').length, 0);
  const lastTest = testHistory.at(-1);
  const returning = doubtCount || testHistory.length || completed.length;

  const go = (e) => {
    e.preventDefault();
    navigate(url.trim() ? `/watch?url=${encodeURIComponent(url.trim())}` : '/watch?sample=1');
  };

  return (
    <>
      <section ref={heroRef} onPointerMove={onHeroMove} className="relative overflow-hidden">
        <div className="absolute inset-0 aurora pointer-events-none" />
        <div className="absolute inset-0 dotgrid [mask-image:radial-gradient(ellipse_at_70%_30%,black,transparent_70%)] pointer-events-none" />
        <div className="relative mx-auto max-w-6xl px-5 pt-14 sm:pt-20 pb-16 grid gap-12 lg:grid-cols-[1.15fr_1fr] items-center">
          <div>
            <h1 className="text-[2.6rem] leading-[1.02] sm:text-6xl xl:text-7xl font-extrabold" aria-label={HEADLINE}>
              {HEADLINE.split(' ').map((w, i) => (
                <span key={i} aria-hidden className="word-in mr-[0.22em]" style={{ animationDelay: `${i * 70}ms` }}>{w}</span>
              ))}
            </h1>
            <p className="mt-5 text-lg text-muted max-w-xl animate-rise [animation-delay:500ms]">
              Paste a YouTube class. Read it or hear it in অসমীয়া, বাংলা, हिन्दी and more, ask doubts about exactly what was taught, and see which chapters matter for your exam.
            </p>

            <form onSubmit={go} className="mt-8 max-w-xl panel !rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-float animate-rise [animation-delay:600ms]">
              <label className="flex items-center gap-3 flex-1 px-3">
                <Link2 size={18} className="text-muted shrink-0" />
                <span className="sr-only">YouTube lecture link</span>
                <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste a YouTube lecture link"
                  className="w-full bg-transparent py-3 text-[16px] focus:outline-none placeholder:text-muted/70" />
              </label>
              <button className="btn-primary glow-btn !py-3 !px-6">Open lecture</button>
            </form>
            <button onClick={() => navigate('/watch?sample=1')} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo hover:underline underline-offset-4">
              <Play size={14} fill="currentColor" /> Or try a sample: Faraday's law, Class 12 Physics
            </button>
          </div>
          <div className="animate-rise [animation-delay:700ms]"><Tilt><LivePreview /></Tilt></div>
        </div>
      </section>

      <Marquee />

      {returning ? (
        <section className="mx-auto max-w-6xl px-5 pt-10">
          <div className="panel p-5 flex flex-wrap items-center gap-x-8 gap-y-3">
            <p className="font-semibold mr-auto">Welcome back. Pick up where you left off.</p>
            <Link to="/doubts" className="flex items-center gap-2 text-sm"><MessageCircleQuestion size={16} className="text-indigo" /> {doubtCount} doubt{doubtCount === 1 ? '' : 's'} saved</Link>
            {lastTest && <Link to="/test" className="flex items-center gap-2 text-sm"><ClipboardCheck size={16} className="text-indigo" /> Last test: {lastTest.subject}, {lastTest.score}%</Link>}
            <Link to="/watch?sample=1" className="btn-primary !py-2">Resume lecture</Link>
          </div>
        </section>
      ) : null}

      <section className="border-y border-line bg-surface mt-12">
        <div ref={stepsRef} className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold max-w-xl">From one link to an exam plan</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 relative">
            <div className="hidden lg:block absolute top-6 left-0 right-0 h-px bg-line" aria-hidden />
            <div className="hidden lg:block absolute top-6 left-0 right-0 h-0.5 -mt-px bg-gradient-to-r from-indigo via-marigold to-leaf draw-line" aria-hidden />
            {STEPS.map(([t, d], n) => (
              <li key={t} className="relative reveal" style={{ transitionDelay: `${n * 110}ms` }}>
                <span className="relative grid place-items-center h-12 w-12 rounded-full border border-line bg-surface font-display text-xl font-extrabold text-indigo">{n + 1}</span>
                <h3 className="mt-4 font-semibold text-lg leading-snug">{t}</h3>
                <p className="mt-1.5 text-muted text-[15px] leading-relaxed">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section ref={toolsRef} className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold reveal">Your study tools</h2>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {NAV.map(({ to, label, icon: Icon }, n) => (
            <Link key={to} to={to} style={{ transitionDelay: `${n * 60}ms` }} className="reveal spot group flex items-center gap-5 py-5 hover:bg-surface px-3 -mx-3 rounded-xl transition-colors">
              <span className="grid place-items-center h-11 w-11 rounded-xl bg-indigo-soft text-indigo shrink-0 group-hover:bg-brand group-hover:text-white transition-colors"><Icon size={20} /></span>
              <span className="font-display text-xl font-bold w-40 shrink-0">{label}</span>
              <span className="text-muted hidden sm:block">{TOOL_COPY[to]}</span>
              <span className="ml-auto text-sm font-semibold text-indigo translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 transition-all">Open</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

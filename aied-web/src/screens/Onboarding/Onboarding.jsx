import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BookOpen, GraduationCap, Globe2, Check, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore.js';
import { LANGUAGES } from '../../services/languages.js';

const STEPS = [
  { id: 'welcome', title: 'Welcome to AIEd', icon: GraduationCap },
  { id: 'profile', title: 'Tell us about you', icon: User },
  { id: 'language', title: 'Pick your language', icon: Globe2 },
];

const STREAMS = ['Science (PCM)', 'Science (PCB)', 'Commerce', 'Arts / Humanities'];
const BOARDS = ['CBSE', 'ICSE', 'State Board'];
const CLASSES = ['11', '12'];

export default function Onboarding({ onDone }) {
  const setProfile = useAppStore((s) => s.setProfile);
  const existingProfile = useAppStore((s) => s.profile);
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: existingProfile.name === 'Samudra' ? '' : existingProfile.name,
    class: existingProfile.class,
    stream: existingProfile.stream,
    board: existingProfile.board,
    physics: existingProfile.physics,
    maths: existingProfile.maths,
    lang: existingProfile.lang,
  });

  const patch = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const canAdvance = () => {
    if (step === 0) return true;
    if (step === 1) return form.name.trim().length > 0;
    return true;
  };

  const advance = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setProfile({ ...form, name: form.name.trim() || 'Student' });
      onDone();
    }
  };

  const skip = () => {
    setProfile({ name: 'Student', ...form });
    onDone();
  };

  return (
    /* Full-screen overlay */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper/90 backdrop-blur-md p-4">
      <div className="w-full max-w-md">

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <span
              key={s.id}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-brand' : i < step ? 'w-2 bg-leaf' : 'w-2 bg-line'
              }`}
            />
          ))}
        </div>

        <div className="panel p-8 animate-pop">
          {/* Step icon + title */}
          <div className="flex flex-col items-center text-center mb-8">
            {(() => {
              const S = STEPS[step];
              return (
                <>
                  <span className="grid place-items-center h-16 w-16 rounded-2xl bg-indigo-soft text-indigo mb-4">
                    <S.icon size={30} strokeWidth={1.5} />
                  </span>
                  <h1 className="font-display text-2xl font-extrabold">{S.title}</h1>
                </>
              );
            })()}
          </div>

          {/* ─── Step 0: Welcome ─── */}
          {step === 0 && (
            <div className="space-y-4 text-center">
              <p className="text-muted leading-relaxed">
                AIEd turns any YouTube class into a lecture you can read, translate, ask questions about, and test yourself on — all in your language.
              </p>
              <div className="mt-6 grid gap-3 text-left">
                {[
                  ['📺', 'Paste a YouTube link', 'Transcript extracted in seconds.'],
                  ['🌐', 'Read in your language', 'Assamese, Bengali, Hindi and more.'],
                  ['🧪', 'Test your weak spots', 'Adaptive mock tests from your syllabus.'],
                ].map(([em, t, d]) => (
                  <div key={t} className="flex items-start gap-3 rounded-xl bg-surface p-3 border border-line">
                    <span className="text-xl shrink-0">{em}</span>
                    <div>
                      <p className="font-semibold text-sm">{t}</p>
                      <p className="text-muted text-[13px]">{d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── Step 1: Profile ─── */}
          {step === 1 && (
            <div className="space-y-5">
              <label className="block">
                <span className="text-sm font-semibold text-muted">Your name</span>
                <input
                  autoFocus
                  value={form.name}
                  onChange={(e) => patch('name', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && canAdvance() && advance()}
                  placeholder="e.g. Priya"
                  className="field mt-2"
                />
              </label>

              <div>
                <span className="text-sm font-semibold text-muted">Class</span>
                <div className="mt-2 flex gap-2">
                  {CLASSES.map((c) => (
                    <button key={c} onClick={() => patch('class', c)}
                      aria-pressed={form.class === c}
                      className={`btn flex-1 ${form.class === c ? 'bg-ink text-oninv' : 'btn-outline'}`}>
                      Class {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-sm font-semibold text-muted">Stream</span>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {STREAMS.map((s) => (
                    <button key={s} onClick={() => patch('stream', s)}
                      aria-pressed={form.stream === s}
                      className={`btn text-left text-[13px] leading-snug ${form.stream === s ? 'bg-ink text-oninv' : 'btn-outline'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-sm font-semibold text-muted">Board</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {BOARDS.map((b) => (
                    <button key={b} onClick={() => patch('board', b)}
                      aria-pressed={form.board === b}
                      className={`btn ${form.board === b ? 'bg-ink text-oninv' : 'btn-outline'}`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── Step 2: Language ─── */}
          {step === 2 && (
            <div>
              <p className="text-muted text-sm text-center mb-5">
                Transcripts will be translated into this language by default. You can change it any time.
              </p>
              <div className="grid gap-2">
                {LANGUAGES.map((l) => {
                  const active = form.lang === l.code;
                  return (
                    <button key={l.code} onClick={() => patch('lang', l.code)}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
                        active ? 'border-indigo bg-indigo-soft' : 'border-line hover:border-ink'
                      }`}>
                      <span>
                        <span className="font-semibold">{l.native}</span>
                        <span className="text-muted text-sm ml-2">{l.name}</span>
                      </span>
                      {active && <Check size={16} className="text-indigo shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex items-center justify-between gap-3">
            <button onClick={skip} className="text-sm text-muted hover:text-ink transition-colors">
              Skip setup
            </button>
            <button
              onClick={advance}
              disabled={!canAdvance()}
              className="btn-primary glow-btn !px-7"
            >
              {step < STEPS.length - 1 ? (
                <><span>Continue</span><ChevronRight size={16} /></>
              ) : (
                <><Check size={16} /><span>Let's go</span></>
              )}
            </button>
          </div>
        </div>

        {/* Branding */}
        <p className="text-center text-xs text-muted mt-6">
          AIEd — your data stays on this device in demo mode.
        </p>
      </div>
    </div>
  );
}

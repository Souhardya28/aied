import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Globe2, BookOpen, BarChart2, Save, Check, ArrowLeft } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore.js';
import { LANGUAGES } from '../../services/languages.js';
import PageHeader from '../../components/PageHeader.jsx';

const STREAMS = ['Science (PCM)', 'Science (PCB)', 'Commerce', 'Arts / Humanities'];
const BOARDS = ['CBSE', 'ICSE', 'State Board', 'Other'];
const CLASSES = ['9', '10', '11', '12'];

export default function Settings() {
  const profile = useAppStore((s) => s.profile);
  const setProfile = useAppStore((s) => s.setProfile);
  const toast = useAppStore((s) => s.toast);
  const navigate = useNavigate();

  const [form, setForm] = useState({ ...profile });
  const [saved, setSaved] = useState(false);

  const patch = (k, v) => { setSaved(false); setForm((f) => ({ ...f, [k]: v })); };

  const save = () => {
    setProfile({ ...form, name: form.name.trim() || 'Student' });
    setSaved(true);
    toast('Profile saved', 'success');
    setTimeout(() => setSaved(false), 2000);
  };

  const isDirty = JSON.stringify(form) !== JSON.stringify(profile);

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <PageHeader title="Settings" lead="Your profile and preferences. Changes take effect immediately.">
        <button onClick={() => navigate(-1)} className="btn-ghost">
          <ArrowLeft size={16} /> Back
        </button>
      </PageHeader>

      <div className="space-y-6">

        {/* ─── Personal ─── */}
        <section className="panel p-6">
          <h2 className="flex items-center gap-2 font-bold text-base mb-5">
            <User size={17} className="text-indigo" /> Personal
          </h2>
          <div className="space-y-5">
            <label className="block">
              <span className="text-sm font-semibold text-muted">Name</span>
              <input value={form.name} onChange={(e) => patch('name', e.target.value)}
                placeholder="Your first name" className="field mt-2" />
            </label>

            <div>
              <span className="text-sm font-semibold text-muted">Class</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {CLASSES.map((c) => (
                  <button key={c} onClick={() => patch('class', c)} aria-pressed={form.class === c}
                    className={`btn ${form.class === c ? 'bg-ink text-oninv' : 'btn-outline'}`}>
                    Class {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-sm font-semibold text-muted">Stream</span>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {STREAMS.map((s) => (
                  <button key={s} onClick={() => patch('stream', s)} aria-pressed={form.stream === s}
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
                  <button key={b} onClick={() => patch('board', b)} aria-pressed={form.board === b}
                    className={`btn ${form.board === b ? 'bg-ink text-oninv' : 'btn-outline'}`}>
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Subject marks ─── */}
        <section className="panel p-6">
          <h2 className="flex items-center gap-2 font-bold text-base mb-5">
            <BarChart2 size={17} className="text-indigo" /> Last exam marks
          </h2>
          <p className="text-sm text-muted mb-5">
            Used to rank chapters in Past Papers and set mock-test difficulty.
          </p>
          <div className="space-y-5">
            {[
              { key: 'physics', label: 'Physics' },
              { key: 'maths', label: 'Mathematics' },
            ].map(({ key, label }) => (
              <label key={key} className="block">
                <span className="flex justify-between text-sm">
                  <span className="font-semibold text-muted">{label}</span>
                  <b className="tabular-nums">{form[key]}%</b>
                </span>
                <input type="range" min={0} max={100} value={form[key]}
                  onChange={(e) => patch(key, +e.target.value)}
                  className="w-full mt-2 accent-indigo" />
              </label>
            ))}
          </div>
        </section>

        {/* ─── Language ─── */}
        <section className="panel p-6">
          <h2 className="flex items-center gap-2 font-bold text-base mb-5">
            <Globe2 size={17} className="text-indigo" /> Preferred language
          </h2>
          <p className="text-sm text-muted mb-4">
            Lecture transcripts are translated into this language by default.
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
        </section>

        {/* ─── Save ─── */}
        <div className="flex justify-end gap-3">
          <button onClick={() => { setForm({ ...profile }); setSaved(false); }}
            disabled={!isDirty} className="btn-outline">
            Reset
          </button>
          <button onClick={save} disabled={!isDirty}
            className={`btn-primary glow-btn !px-8 ${saved ? '!bg-leaf' : ''} transition-colors`}>
            {saved ? <><Check size={16} /> Saved</> : <><Save size={16} /> Save changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}

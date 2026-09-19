import { useMemo, useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { FileUp, Loader2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader.jsx';
import Meter from '../../components/Meter.jsx';
import { DEMO_PYQ } from '../../services/mock.js';
import { api, liveMode } from '../../services/api.js';
import { useChartColors, tooltipStyle } from '../../hooks/useTheme.js';

const DEFAULT_LABELS = { EMI: 'Electromagnetic Induction', Optics: 'Ray Optics', Electrostatics: 'Electrostatics' };

export default function PYQAnalysis() {
  const [subject, setSubject] = useState('Physics');
  const [marks, setMarks] = useState({ Physics: 62, Chemistry: 71 });
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');
  const fileRef = useRef(null);
  const c = useChartColors();
  const data = DEMO_PYQ[subject];
  const labels = data.labels || DEFAULT_LABELS;

  // Rank chapters by exam impact: weightage × how far below 100% the student is
  const ranked = useMemo(() => {
    const overall = marks[subject] / 100;
    return data.chapters
      .map((c) => {
        const gap = 1 - (c.yourScore / 100) * 0.7 - overall * 0.3;
        return { ...c, impact: +(c.weightage * gap).toFixed(1) };
      })
      .sort((a, b) => b.impact - a.impact);
  }, [data, marks, subject]);
  const top = ranked[0];

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setMsg('');
    try {
      if (await liveMode()) {
        const form = new FormData();
        form.append('paper', file); form.append('subject', subject); form.append('year', new Date().getFullYear() - 1);
        const r = await api('/analytics/pyq', { method: 'POST', form });
        setMsg(`Read ${r.topics.length} topics from ${file.name}. Weightage updated.`);
      } else {
        await new Promise((r) => setTimeout(r, 1200));
        setMsg(`${file.name} received. Reading scanned papers needs the AIEd API — the chart below uses 5 years of sample CBSE papers.`);
      }
    } catch (err) { setMsg(`Couldn't read that paper: ${err.message}`); }
    finally { setUploading(false); e.target.value = ''; }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <PageHeader title="Past papers" lead="Which chapters carry the marks, ranked against how you're actually doing.">
        <div className="flex gap-2">
          {Object.keys(DEMO_PYQ).map((s) => (
            <button key={s} onClick={() => setSubject(s)} aria-pressed={subject === s}
              className={`btn ${subject === s ? 'bg-ink text-oninv' : 'btn-outline'}`}>{s}</button>
          ))}
        </div>
      </PageHeader>

      <div className="rounded-xl2 bg-brand text-white p-7 sm:p-10 relative overflow-hidden">
        <p className="text-white/70 text-sm">Spend more time here</p>
        <p className="mt-2 font-display text-2xl sm:text-4xl font-extrabold leading-tight max-w-3xl">
          {top.chapter} carries {top.weightage}% of {subject} marks over 5 years. You're scoring {top.yourScore}% on it.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <section className="panel p-6">
          <h2 className="text-xl font-bold">Your study order</h2>
          <p className="text-sm text-muted">Ranked by expected marks you'd gain.</p>
          <ol className="mt-5 space-y-4">
            {ranked.map((c, i) => (
              <li key={c.chapter} className="grid grid-cols-[1.5rem_1fr] gap-3">
                <span className="font-display font-extrabold text-lg text-muted">{i + 1}</span>
                <div>
                  <div className="flex flex-wrap justify-between gap-x-4">
                    <span className="font-semibold">{c.chapter}</span>
                    <span className="text-sm text-muted">{c.weightage}% of marks · {c.frequency} questions · you: {c.yourScore}%</span>
                  </div>
                  <div className="mt-2"><Meter value={c.impact} max={ranked[0].impact} tone={i < 2 ? 'marigold' : 'indigo'} label={`${c.chapter} priority`} /></div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <aside className="space-y-6">
          <section className="panel p-6">
            <h2 className="font-bold text-lg">Your last exam marks</h2>
            {Object.keys(marks).map((s) => (
              <label key={s} className="mt-4 block">
                <span className="flex justify-between text-sm"><span>{s}</span><b className="tabular-nums">{marks[s]}%</b></span>
                <input type="range" min={0} max={100} value={marks[s]} onChange={(e) => setMarks({ ...marks, [s]: +e.target.value })}
                  className="w-full mt-2 accent-indigo" />
              </label>
            ))}
            <p className="text-xs text-muted mt-3">Move a slider — the order updates.</p>
          </section>
          <section className="panel p-6">
            <h2 className="font-bold text-lg">Add a question paper</h2>
            <p className="text-sm text-muted mt-1">PDF or a phone photo. AI tags every question by topic.</p>
            <input ref={fileRef} type="file" accept="application/pdf,image/*" className="hidden" onChange={upload} />
            <button onClick={() => fileRef.current.click()} disabled={uploading} className="btn-outline w-full mt-4">
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <FileUp size={16} />} {uploading ? 'Reading paper' : 'Upload paper'}
            </button>
            {msg && <p className="text-sm mt-3 rounded-lg bg-paper px-3 py-2">{msg}</p>}
          </section>
        </aside>
      </div>

      <section className="panel p-6 mt-6">
        <h2 className="text-xl font-bold">How weightage moved, 2020–2024</h2>
        <p className="text-sm text-muted">% of total marks per chapter, by year.</p>
        <div className="h-72 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.trend} margin={{ right: 16 }}>
              <CartesianGrid stroke={c.line} vertical={false} />
              <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: c.muted }} />
              <YAxis unit="%" tickLine={false} axisLine={false} width={40} tick={{ fill: c.muted }} />
              <Tooltip {...tooltipStyle(c)} formatter={(v, k) => [`${v}%`, labels[k]]} />
              <Legend formatter={(k) => labels[k]} />
              <Line type="monotone" dataKey="EMI" stroke={c.indigo} strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Optics" stroke={c.marigold} strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Electrostatics" stroke={c.leaf} strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

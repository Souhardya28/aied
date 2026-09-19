import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChevronDown, Flame, PlayCircle, Printer, AlertTriangle } from 'lucide-react';
import PageHeader from '../../components/PageHeader.jsx';
import Meter from '../../components/Meter.jsx';
import Ring from '../../components/Ring.jsx';
import CountUp from '../../components/CountUp.jsx';
import { useReveal } from '../../hooks/useFx.js';
import { useAppStore } from '../../store/useAppStore.js';
import { DEMO_DASHBOARD, DEMO_RECS, DEMO_SYLLABUS, DEMO_WEEK } from '../../services/mock.js';
import { api, liveMode } from '../../services/api.js';
import { useChartColors, tooltipStyle } from '../../hooks/useTheme.js';
import ScoreCard from '../../components/ScoreCard.jsx';

const STATUS = {
  done: { label: 'Done', cls: 'bg-leaf border-leaf' },
  in_progress: { label: 'In progress', cls: 'bg-marigold border-marigold' },
  not_started: { label: 'Not started', cls: 'bg-surface border-line' },
};
const NEXT = { not_started: 'in_progress', in_progress: 'done', done: 'not_started' };

export default function Dashboard() {
  const streak = useAppStore((s) => s.streak);
  const name = useAppStore((s) => s.profile.name);
  const [subjects, setSubjects] = useState(DEMO_DASHBOARD);
  const [recs, setRecs] = useState(DEMO_RECS);
  const [syllabus, setSyllabus] = useState(DEMO_SYLLABUS);
  const [openSubject, setOpenSubject] = useState('Physics');
  const c = useChartColors();
  const tt = tooltipStyle(c);
  const revealRef = useReveal();
  const testHistory = useAppStore((s) => s.testHistory);

  useEffect(() => {
    (async () => {
      if (!(await liveMode())) return;
      const [d, r] = await Promise.all([api('/syllabus/dashboard'), api('/recommend')]);
      setSubjects(d);
      setRecs(r.map((x) => ({ ...x, reason: 'Not covered yet' })));
    })().catch(() => {});
  }, []);

  // Recompute subject totals when the student ticks topics in the checklist
  const live = useMemo(() => subjects.map((s) => {
    const chapters = syllabus[s.subject];
    if (!chapters) return s;
    const all = Object.values(chapters).flat();
    return { ...s, total: all.length, done: all.filter(([, st]) => st === 'done').length };
  }), [subjects, syllabus]);

  const total = live.reduce((a, s) => a + s.total, 0);
  const done = live.reduce((a, s) => a + s.done, 0);
  const weekMinutes = DEMO_WEEK.reduce((a, d) => a + d.minutes, 0);
  const weak = live.flatMap((s) => s.weak.map((w) => ({ topic: w, subject: s.subject })));

  const toggle = (subject, chapter, idx) => setSyllabus((prev) => {
    const copy = structuredClone(prev);
    const row = copy[subject][chapter][idx];
    row[1] = NEXT[row[1]];
    return copy;
  });

  return (
    <div ref={revealRef} className="mx-auto max-w-6xl px-5 py-12">
      <PageHeader title={`${name}'s progress`} lead="Class 12 · CBSE. Updates as you finish lectures and tests.">
        <button onClick={() => window.print()} className="btn-outline no-print"><Printer size={16} /> Export report</button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="panel p-6">
          <div className="flex items-center gap-5">
            <Ring value={Math.round((done / total) * 100)} size={104}>
              <span className="font-display text-2xl font-extrabold"><CountUp to={Math.round((done / total) * 100)} />%</span>
            </Ring>
            <div>
              <p className="text-sm text-muted">Syllabus covered</p>
              <p className="font-display text-xl font-bold mt-1">{done} of {total}</p>
              <p className="text-sm text-muted">topics done</p>
            </div>
          </div>
        </div>
        <div className="panel p-6">
          <p className="text-sm text-muted">Studied this week</p>
          <p className="font-display text-5xl font-extrabold mt-1"><CountUp to={weekMinutes / 60} decimals={1} /><span className="text-2xl"> h</span></p>
          <div className="h-12 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEMO_WEEK}><Bar dataKey="minutes" radius={[3, 3, 0, 0]} fill={c.indigo} /><Tooltip {...tt} cursor={false} formatter={(v) => [`${v} min`, '']} labelFormatter={(_, p) => p?.[0]?.payload.day} /></BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel p-6 bg-brand text-white border-brand">
          <p className="text-sm text-white/70">Streak</p>
          <p className="font-display text-5xl font-extrabold mt-1 flex items-center gap-2"><CountUp to={streak} ms={700} /><Flame className="text-[#F4B63F] animate-[flicker_1.6s_ease-in-out_infinite] motion-reduce:animate-none origin-bottom" size={34} fill="currentColor" /></p>
          <p className="text-sm text-white/70 mt-1">days in a row. Watch one lecture today to keep it.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <section className="panel p-6">
          <h2 className="text-xl font-bold">By subject</h2>
          <div className="h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={live.map((s) => ({ ...s, pct: Math.round((s.done / s.total) * 100) }))} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis type="category" dataKey="subject" width={96} tickLine={false} axisLine={false} tick={{ fill: c.ink, fontSize: 14 }} />
                <Tooltip {...tt} cursor={{ fill: c.track }} formatter={(v) => [`${v}% done`, '']} />
                <Bar dataKey="pct" radius={[0, 6, 6, 0]} barSize={22} background={{ fill: c.track, radius: 6 }}>
                  {live.map((s) => <Cell key={s.subject} fill={s.done / s.total < 0.5 ? c.marigold : c.indigo} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-muted">Yellow bars are under half done.</p>
        </section>

        <section className="panel p-6">
          <h2 className="text-xl font-bold flex items-center gap-2"><AlertTriangle size={18} className="text-chili" /> Weak topics</h2>
          <p className="text-sm text-muted mt-1">Scored under 50% in a test.</p>
          <ul className="mt-4 space-y-2">
            {weak.map((w) => (
              <li key={w.topic} className="flex items-center justify-between gap-3">
                <span><b className="font-semibold">{w.topic}</b> <span className="text-sm text-muted">{w.subject}</span></span>
                <Link to={`/test?subject=${w.subject}`} className="text-sm font-semibold text-indigo shrink-0">Practise</Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {testHistory.length > 0 && (
        <section className="panel p-6 mt-6">
          <h2 className="text-xl font-bold">Recent mock tests</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {testHistory.slice(-4).reverse().map((t) => (
              <li key={t.at}>
                <ScoreCard subject={t.subject} score={t.score} at={t.at} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6">
        <h2 className="text-xl font-bold">Watch next</h2>
        <p className="text-sm text-muted">Picked from topics you haven't covered yet.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {recs.map((r) => (
            <Link key={r.topic} style={{ transitionDelay: `${recs.indexOf(r) * 90}ms` }} to={r.video?.url ? `/watch?url=${encodeURIComponent(r.video.url)}` : '/watch?sample=1'} className="panel reveal p-5 hover:-translate-y-1 group">
              <PlayCircle className="text-indigo" size={22} />
              <p className="mt-3 font-semibold text-lg leading-snug">{r.topic}</p>
              <p className="text-sm text-muted">{r.chapter}</p>
              <p className="mt-3 text-xs chip bg-paper">{r.reason}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold">Syllabus checklist</h2>
        <p className="text-sm text-muted">Tap a topic to change its status.</p>
        <div className="mt-4 space-y-3">
          {Object.entries(syllabus).map(([subject, chapters]) => {
            const s = live.find((x) => x.subject === subject);
            const open = openSubject === subject;
            return (
              <div key={subject} className="panel">
                <button onClick={() => setOpenSubject(open ? null : subject)} aria-expanded={open}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left">
                  <span className="font-semibold w-28">{subject}</span>
                  <span className="flex-1"><Meter value={s?.done || 0} max={s?.total || 1} label={`${subject} progress`} /></span>
                  <span className="text-sm text-muted tabular-nums w-12 text-right">{s?.done}/{s?.total}</span>
                  <ChevronDown size={18} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && (
                  <div className="border-t border-line px-5 py-4 grid gap-5 md:grid-cols-2">
                    {Object.entries(chapters).map(([chapter, topics]) => (
                      <div key={chapter}>
                        <p className="font-semibold text-sm">{chapter}</p>
                        <ul className="mt-2 space-y-1">
                          {topics.map(([t, st], i) => (
                            <li key={t}>
                              <button onClick={() => toggle(subject, chapter, i)} className="flex items-center gap-3 w-full text-left rounded-lg px-2 py-1.5 hover:bg-paper">
                                <span className={`h-3.5 w-3.5 rounded-full border-2 ${STATUS[st].cls}`} aria-hidden />
                                <span className={`text-[15px] ${st === 'done' ? 'text-muted line-through decoration-line' : ''}`}>{t}</span>
                                <span className="sr-only">{STATUS[st].label}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, X, Loader2, RotateCcw, Timer } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore.js';
import { useHotkeys } from '../../hooks/useHotkeys.js';
import { confetti } from '../../utils/confetti.js';
import CountUp from '../../components/CountUp.jsx';
import Ring from '../../components/Ring.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { demoTest } from '../../services/mock.js';
import { api, liveMode } from '../../services/api.js';

const SUBJECTS = ['Physics', 'Chemistry', 'Mathematics'];
const TOPICS = {
  Physics: ["Faraday's law", "Lenz's law", 'Magnetic flux'],
  Chemistry: ["Raoult's law", 'Chemical Kinetics', 'Nernst equation'],
  Mathematics: ["Bayes' theorem", 'Definite integrals', 'Matrices'],
};

/** Demo grader: exact match for MCQs, keyword overlap for written answers. */
function gradeLocally(questions, responses) {
  const results = questions.map((q, i) => {
    const given = responses[i] || '';
    if (q.type === 'mcq') {
      const correct = given === q.answer;
      return { ...q, given, correct, marks: correct ? 1 : 0, feedback: q.explanation };
    }
    const keys = q.answer.toLowerCase().split(/\W+/).filter((w) => w.length > 4);
    const hit = keys.filter((k) => given.toLowerCase().includes(k)).length / (keys.length || 1);
    const marks = Math.min(1, +(hit * 1.6).toFixed(2));
    return { ...q, given, correct: marks >= 0.6, marks, feedback: `${marks >= 0.6 ? 'Good.' : 'Partly there.'} A full answer: ${q.answer}` };
  });
  return { score: Math.round((results.reduce((a, r) => a + r.marks, 0) / results.length) * 100), results };
}

export default function MockTest() {
  const [params] = useSearchParams();
  const [subject, setSubject] = useState(params.get('subject') && SUBJECTS.includes(params.get('subject')) ? params.get('subject') : 'Physics');
  const [phase, setPhase] = useState('setup'); // setup | loading | test | grading | result
  const [test, setTest] = useState(null);
  const [idx, setIdx] = useState(0);
  const [responses, setResponses] = useState([]);
  const [result, setResult] = useState(null);
  const [secs, setSecs] = useState(0);
  const addTestResult = useAppStore((s) => s.addTestResult);
  const toast = useAppStore((s) => s.toast);

  // Test clock
  useEffect(() => {
    if (phase !== 'test') return;
    const id = setInterval(() => setSecs((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  const start = async () => {
    setPhase('loading');
    setIdx(0); setResponses([]); setResult(null); setSecs(0);
    try {
      if (await liveMode()) {
        const t = await api('/mocktest', { method: 'POST', body: { subject, topics: TOPICS[subject], count: 5, mix: 'mostly mcq, one short answer' } });
        setTest(t);
      } else {
        await new Promise((r) => setTimeout(r, 700));
        setTest({ id: 'demo', difficulty: 2, questions: demoTest(subject) });
      }
      setPhase('test');
    } catch { setPhase('setup'); }
  };

  const submit = async () => {
    const unanswered = test.questions.filter((_, i) => !responses[i]).length;
    if (unanswered && !window.confirm(`${unanswered} question${unanswered > 1 ? 's are' : ' is'} unanswered. Submit anyway?`)) return;
    setPhase('grading');
    if (test.id !== 'demo' && (await liveMode())) {
      setResult(await api(`/mocktest/${test.id}/submit`, { method: 'POST', body: { responses } }));
    } else {
      await new Promise((r) => setTimeout(r, 600));
      setResult(gradeLocally(test.questions, responses));
    }
    setPhase('result');
  };

  useEffect(() => {
    if (phase === 'result' && result) {
      addTestResult({ subject, score: result.score });
      if (result.score >= 80) setTimeout(() => confetti({ y: innerHeight * 0.3, count: 140 }), 350);
      toast(`Score saved: ${result.score}%`, result.score >= 50 ? 'success' : 'warn');
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const q0 = test?.questions?.[idx];
  useHotkeys(phase === 'test' ? {
    1: () => q0?.options && answer(q0.options[0]), 2: () => q0?.options && answer(q0.options[1]),
    3: () => q0?.options && answer(q0.options[2]), 4: () => q0?.options && answer(q0.options[3]),
    ArrowRight: () => setIdx((i) => Math.min(test.questions.length - 1, i + 1)),
    ArrowLeft: () => setIdx((i) => Math.max(0, i - 1)),
  } : {}, [phase, idx, test]);

  const answer = (v) => setResponses((r) => { const c = [...r]; c[idx] = v; return c; });

  if (phase === 'setup' || phase === 'loading') {
    return (
      <div className="mx-auto max-w-2xl px-5 py-12">
        <PageHeader title="Mock test" lead="Five questions from your syllabus, matched to your level. Graded instantly with explanations." />
        <div className="panel p-6">
          <p className="font-semibold">Subject</p>
          <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Subject">
            {SUBJECTS.map((s) => (
              <button key={s} role="radio" aria-checked={subject === s} onClick={() => setSubject(s)}
                className={`btn ${subject === s ? 'bg-ink text-oninv' : 'btn-outline'}`}>{s}</button>
            ))}
          </div>
          <p className="font-semibold mt-6">Topics</p>
          <p className="text-muted text-[15px] mt-1">{TOPICS[subject].join(', ')}</p>
          <p className="text-sm text-muted mt-4">Difficulty adjusts to your last three test scores.</p>
          <button onClick={start} disabled={phase === 'loading'} className="btn-primary mt-6 w-full !py-3">
            {phase === 'loading' ? <><Loader2 size={16} className="animate-spin" /> Writing your questions</> : 'Start test'}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    return (
      <div className="mx-auto max-w-3xl px-5 py-12">
        <div className="panel p-8 flex flex-wrap items-center gap-6">
          <Ring value={result.score} size={132} stroke={11}>
            <span className="font-display text-4xl font-extrabold"><CountUp to={result.score} />%</span>
          </Ring>
          <div className="flex-1 min-w-[12rem]">
            <p className="font-semibold text-lg">{result.score >= 80 ? 'Strong work.' : result.score >= 50 ? 'Getting there.' : 'This topic needs another pass.'}</p>
            <p className="text-muted text-sm mt-1">Finished in {Math.floor(secs / 60)}m {secs % 60}s. Saved to your dashboard.</p>
          </div>
          <button onClick={start} className="btn-outline"><RotateCcw size={16} /> New test</button>
        </div>
        <ol className="mt-6 space-y-4">
          {result.results.map((r, i) => (
            <li key={i} className="panel p-5 animate-rise" style={{ animationDelay: `${300 + i * 90}ms` }}>
              <div className="flex gap-3">
                <span className={`grid place-items-center h-7 w-7 rounded-full shrink-0 ${r.correct ? 'bg-leaf/10 text-leaf' : 'bg-chili/10 text-chili'}`}>
                  {r.correct ? <Check size={16} /> : <X size={16} />}
                </span>
                <div className="min-w-0">
                  <p className="font-medium">{r.prompt}</p>
                  <p className="text-sm mt-2"><span className="text-muted">Your answer:</span> {r.given || <i className="text-muted">skipped</i>}</p>
                  {!r.correct && r.type === 'mcq' && <p className="text-sm"><span className="text-muted">Correct:</span> <b>{r.answer}</b></p>}
                  <p className="text-sm mt-2 rounded-lg bg-paper px-3 py-2">{r.feedback || r.explanation}</p>
                  {!r.correct && <Link to="/watch?sample=1" className="inline-block mt-2 text-sm font-semibold text-indigo">Rewatch: {r.topic}</Link>}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  const q = test.questions[idx];
  const last = idx === test.questions.length - 1;
  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <div className="flex items-center justify-between text-sm text-muted mb-3">
        <span>{subject} · Question {idx + 1} of {test.questions.length}</span>
        <span className="flex items-center gap-3">
          <span className="chip bg-indigo-soft text-indigo">{q.topic}</span>
          <span className="flex items-center gap-1 tabular-nums"><Timer size={14} /> {Math.floor(secs / 60)}:{String(secs % 60).padStart(2, '0')}</span>
        </span>
      </div>
      <div className="flex gap-1.5" role="tablist" aria-label="Questions">
        {test.questions.map((_, n) => (
          <button key={n} role="tab" aria-selected={n === idx} aria-label={`Question ${n + 1}${responses[n] ? ', answered' : ''}`} onClick={() => setIdx(n)}
            className={`h-2 flex-1 rounded-full transition-colors ${n === idx ? 'bg-indigo' : responses[n] ? 'bg-indigo/40' : 'bg-line'}`} />
        ))}
      </div>
      <div className="panel p-6 sm:p-8 mt-6 animate-rise" key={idx}>
        <p className="text-xl font-semibold leading-snug">{q.prompt}</p>
        {q.type === 'mcq' ? (
          <div className="mt-6 grid gap-2" role="radiogroup">
            {q.options.map((o, n) => {
              const on = responses[idx] === o;
              return (
                <button key={o} role="radio" aria-checked={on} onClick={() => answer(o)}
                  className={`flex items-center gap-4 rounded-xl border px-4 py-3.5 text-left transition-colors ${on ? 'border-indigo bg-indigo-soft' : 'border-line hover:border-ink'}`}>
                  <span className={`grid place-items-center h-7 w-7 rounded-full text-sm font-semibold ${on ? 'bg-brand text-white' : 'bg-paper'}`}>{'ABCD'[n]}</span>
                  <span>{o}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <textarea value={responses[idx] || ''} onChange={(e) => answer(e.target.value)} rows={5}
            className="field mt-6" placeholder="Write your answer in 2–3 sentences" aria-label="Your answer" />
        )}
      </div>
      <p className="hidden sm:block mt-3 text-xs text-muted text-center">Press <kbd>1</kbd>–<kbd>4</kbd> to choose, <kbd>←</kbd><kbd>→</kbd> to move between questions.</p>
      <div className="mt-6 flex justify-between">
        <button onClick={() => setIdx(idx - 1)} disabled={idx === 0} className="btn-ghost">Previous</button>
        {last ? (
          <button onClick={submit} disabled={phase === 'grading'} className="btn-primary">
            {phase === 'grading' ? <><Loader2 size={16} className="animate-spin" /> Grading</> : 'Submit test'}
          </button>
        ) : (
          <button onClick={() => setIdx(idx + 1)} className="btn-primary">Next question</button>
        )}
      </div>
    </div>
  );
}

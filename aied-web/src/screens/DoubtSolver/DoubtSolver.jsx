import { Link } from 'react-router-dom';
import { BookOpenCheck, Globe2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader.jsx';
import { useAppStore } from '../../store/useAppStore.js';
import { SAMPLE_LECTURE } from '../../services/mock.js';

/** Doubt history across lectures, for revision. */
export default function DoubtSolver() {
  const doubts = useAppStore((s) => s.doubts);
  const lecture = useAppStore((s) => s.lecture);
  const clear = useAppStore((s) => s.clearDoubts);
  const groups = Object.entries(doubts).filter(([, m]) => m.length);

  const pairs = (msgs) => msgs.reduce((acc, m, i) => (m.role === 'user' ? [...acc, [m, msgs[i + 1]]] : acc), []);
  const title = (id) => (lecture?.id === id ? lecture.title : id === SAMPLE_LECTURE.id ? SAMPLE_LECTURE.title : 'Lecture');

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <PageHeader title="Your doubts" lead="Everything you've asked, grouped by lecture. Reread these before a test." />
      {groups.length === 0 ? (
        <div className="panel p-10 text-center">
          <p className="font-semibold">No doubts yet</p>
          <p className="text-muted text-sm mt-1">Open a lecture and ask about anything you didn't follow.</p>
          <Link to="/watch?sample=1" className="btn-primary mt-5">Open the sample lecture</Link>
        </div>
      ) : groups.map(([id, msgs]) => (
        <section key={id} className="mb-10">
          <div className="flex items-baseline justify-between gap-3 mb-3">
            <h2 className="text-lg font-bold">{title(id)}</h2>
            <button onClick={() => clear(id)} className="text-sm text-muted hover:text-chili">Delete</button>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {pairs(msgs).map(([q, a], i) => (
              <details key={i} className="group py-4">
                <summary className="cursor-pointer list-none flex items-start gap-3 font-medium">
                  {a?.grounded ? <BookOpenCheck size={17} className="text-leaf mt-0.5 shrink-0" /> : <Globe2 size={17} className="text-marigold mt-0.5 shrink-0" />}
                  <span className="flex-1">{q.text}</span>
                  <span className="text-muted text-sm group-open:hidden">Show</span>
                </summary>
                <p className="mt-3 ml-8 whitespace-pre-wrap text-[15px] leading-relaxed text-ink/90">{a?.text}</p>
              </details>
            ))}
          </div>
          <Link to="/watch?sample=1" className="inline-block mt-3 text-sm font-semibold text-indigo">Back to lecture</Link>
        </section>
      ))}
    </div>
  );
}

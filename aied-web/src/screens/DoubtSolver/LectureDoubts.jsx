import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import ChatPanel from '../../components/ChatPanel.jsx';
import { useAppStore } from '../../store/useAppStore.js';
import { demoDoubtAnswer } from '../../services/mock.js';
import { liveMode } from '../../services/api.js';
import { streamAsk } from '../../services/socket.js';
import { langByCode } from '../../services/languages.js';

/** Doubt solver attached to one lecture — RAG over its transcript. */
export default function LectureDoubts({ lecture, segments, onSeek }) {
  const lang = useAppStore((s) => s.profile.lang);
  const messages = useAppStore((s) => s.doubts[lecture.id] || []);
  const push = useAppStore((s) => s.pushDoubt);
  const patch = useAppStore((s) => s.patchLastDoubt);
  const clear = useAppStore((s) => s.clearDoubts);
  const [busy, setBusy] = useState(false);

  const ask = async (question) => {
    push(lecture.id, { role: 'user', text: question, at: Date.now() });
    push(lecture.id, { role: 'ai', text: '' });
    setBusy(true);
    try {
      if (await liveMode() && !lecture.id.startsWith('demo')) {
        await streamAsk('doubt', { videoId: lecture.id, question, lang }, {
          onMeta: (m) => patch(lecture.id, m),
          onToken: (text) => patch(lecture.id, { text }),
        });
      } else {
        const res = demoDoubtAnswer(question, segments);
        patch(lecture.id, { grounded: res.grounded, sources: res.sources });
        // Simulated streaming so the demo feels like the real thing
        for (let i = 0; i <= res.answer.length; i += 6) {
          await new Promise((r) => setTimeout(r, 12));
          patch(lecture.id, { text: res.answer.slice(0, i) });
        }
        patch(lecture.id, { text: res.answer });
      }
    } catch (e) {
      patch(lecture.id, { text: `Couldn't get an answer: ${e.message}` });
    } finally { setBusy(false); }
  };

  return (
    <div className="panel flex flex-col h-[34rem] lg:h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between px-5 py-4 border-b border-line">
        <div>
          <h2 className="font-bold text-lg">Ask a doubt</h2>
          <p className="text-xs text-muted">Answers cite the moment in the lecture.</p>
        </div>
        {messages.length > 0 && (
          <button onClick={() => clear(lecture.id)} className="btn-ghost !p-2" aria-label="Delete doubt history for this lecture" title="Delete history">
            <Trash2 size={16} />
          </button>
        )}
      </div>
      <ChatPanel className="flex-1" messages={messages} onSend={ask} busy={busy}
        placeholder="Ask a doubt…" speechLang={langByCode(lang).speech} onSourceClick={onSeek}
        suggestions={['Why is there a minus sign?', 'How did we get 200 volts?', 'What is magnetic flux?']}
        empty={<p className="text-sm text-muted">Stuck on something? Ask in any language. If the lecture doesn't cover it, the answer is labelled as general knowledge.</p>} />
    </div>
  );
}

import { useState } from 'react';
import ChatPanel from '../../components/ChatPanel.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { useAppStore } from '../../store/useAppStore.js';
import { demoCareerReply } from '../../services/mock.js';
import { liveMode } from '../../services/api.js';
import { streamAsk } from '../../services/socket.js';
import { langByCode } from '../../services/languages.js';

export default function CareerChatbot() {
  const profile = useAppStore((s) => s.profile);
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);

  const setLast = (text) => setMessages((m) => [...m.slice(0, -1), { role: 'ai', text }]);

  const send = async (text) => {
    const next = [...messages, { role: 'user', text }];
    setMessages([...next, { role: 'ai', text: '' }]);
    setBusy(true);
    try {
      if (await liveMode()) {
        await streamAsk('career', { messages: next }, { onToken: setLast });
      } else {
        const reply = demoCareerReply(text, profile);
        for (let i = 0; i <= reply.length; i += 7) {
          await new Promise((r) => setTimeout(r, 12));
          setLast(reply.slice(0, i));
        }
        setLast(reply);
      }
    } catch (e) { setLast(`Couldn't reach the counsellor: ${e.message}`); }
    finally { setBusy(false); }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 grid gap-8 lg:grid-cols-[18rem_1fr]">
      <aside>
        <PageHeader title="Career guide" lead="Advice based on your stream and your actual marks — not a generic list." />
        <dl className="panel p-5 text-sm space-y-3">
          <div className="flex justify-between"><dt className="text-muted">Class</dt><dd className="font-semibold">{profile.class}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Stream</dt><dd className="font-semibold">{profile.stream}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Board</dt><dd className="font-semibold">{profile.board}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Physics</dt><dd className="font-semibold">{profile.physics}%</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Maths</dt><dd className="font-semibold">{profile.maths}%</dd></div>
        </dl>
        <p className="text-xs text-muted mt-3">The guide reads these from your dashboard.</p>
      </aside>
      <div className="panel flex flex-col h-[36rem] lg:h-[calc(100vh-10rem)]">
        <ChatPanel className="flex-1" messages={messages} onSend={send} busy={busy}
          placeholder="Ask about streams, exams or colleges" speechLang={langByCode(profile.lang).speech}
          suggestions={['I like computers — is engineering right for me?', 'What do I need to become a doctor?', 'I want to do research in physics']}
          empty={<><h2 className="text-2xl font-bold">What do you want to do after class 12?</h2><p className="text-muted mt-1">Not sure yet is a fine answer. Start with what you enjoy.</p></>} />
      </div>
    </div>
  );
}

import Screen from '../../components/Screen';

// Mobile shell — mirrors aied-web/src/screens/Home. Wire to services/api.js (same endpoints as web).
export default function Home() {
  return <Screen title="Every lecture, in the language you think in." lead="Paste a YouTube link to begin." />;
}

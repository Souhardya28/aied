import Screen from '../../components/Screen';

// Mobile shell — mirrors aied-web/src/screens/DoubtSolver. Wire to services/api.js (same endpoints as web).
export default function DoubtSolver() {
  return <Screen title="Your doubts" lead="Everything you have asked, grouped by lecture." />;
}

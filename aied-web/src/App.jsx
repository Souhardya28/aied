import AppRoutes from './navigation/AppRoutes.jsx';
import Shell from './components/Shell.jsx';
import Onboarding from './screens/Onboarding/Onboarding.jsx';
import { useAppStore } from './store/useAppStore.js';

export default function App() {
  const onboarded = useAppStore((s) => s.onboarded);
  const setOnboarded = useAppStore((s) => s.setOnboarded);

  return (
    <Shell>
      {!onboarded && <Onboarding onDone={() => setOnboarded(true)} />}
      <AppRoutes />
    </Shell>
  );
}

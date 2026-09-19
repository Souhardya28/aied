import { useEffect, useState } from 'react';
import { liveMode } from '../services/api.js';

export function useLiveMode() {
  const [live, setLive] = useState(false);
  useEffect(() => { liveMode().then(setLive); }, []);
  return live;
}

import { useEffect, useRef, useState, useCallback } from 'react';

export const youtubeId = (url = '') =>
  url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/)?.[1] || null;

let apiPromise;
function loadYT() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  apiPromise ??= new Promise((res) => {
    window.onYouTubeIframeAPIReady = () => res(window.YT);
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
  });
  return apiPromise;
}

/**
 * One interface for both a real YouTube player and a simulated clock
 * (used by the offline sample lecture). Exposes time, playing, play/pause/seek.
 */
export function usePlayer({ videoId, duration = 100, mountRef }) {
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [rate, setRateState] = useState(1);
  const yt = useRef(null);
  const sim = useRef({ t: 0, last: 0 });

  useEffect(() => {
    if (!videoId || !mountRef.current) return;
    let alive = true;
    loadYT().then((YT) => {
      if (!alive) return;
      yt.current = new YT.Player(mountRef.current, {
        videoId,
        playerVars: { rel: 0, modestbranding: 1 },
        events: { onStateChange: (e) => setPlaying(e.data === 1) },
      });
    });
    return () => { alive = false; yt.current?.destroy?.(); yt.current = null; };
  }, [videoId, mountRef]);

  // Poll the clock
  useEffect(() => {
    const id = setInterval(() => {
      if (videoId) {
        const t = yt.current?.getCurrentTime?.();
        if (typeof t === 'number') setTime(t);
      } else if (playing) {
        const now = performance.now();
        sim.current.t = Math.min(duration, sim.current.t + ((now - sim.current.last) / 1000) * rate);
        sim.current.last = now;
        setTime(sim.current.t);
        if (sim.current.t >= duration) setPlaying(false);
      }
    }, 250);
    return () => clearInterval(id);
  }, [videoId, playing, duration, rate]);

  const play = useCallback(() => {
    if (videoId) return yt.current?.playVideo?.();
    if (sim.current.t >= duration) sim.current.t = 0;
    sim.current.last = performance.now();
    setPlaying(true);
  }, [videoId, duration]);
  const pause = useCallback(() => (videoId ? yt.current?.pauseVideo?.() : setPlaying(false)), [videoId]);
  const seek = useCallback((t) => {
    if (videoId) { yt.current?.seekTo?.(t, true); yt.current?.playVideo?.(); }
    else { sim.current.t = t; sim.current.last = performance.now(); setTime(t); setPlaying(true); }
  }, [videoId]);

  const setRate = useCallback((r) => { setRateState(r); yt.current?.setPlaybackRate?.(r); }, []);
  const toggle = useCallback(() => (playing ? pause() : play()), [playing, play, pause]);
  const nudge = useCallback((d) => seek(Math.max(0, Math.min(duration, (videoId ? yt.current?.getCurrentTime?.() ?? 0 : sim.current.t) + d))), [seek, duration, videoId]);

  return { time, playing, play, pause, seek, toggle, nudge, rate, setRate };
}

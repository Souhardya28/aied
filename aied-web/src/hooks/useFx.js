import { useEffect, useRef, useState } from 'react';

export const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Writes the pointer position into --mx / --my on any `.spot` element under the cursor. */
export function useGlobalSpotlight() {
  useEffect(() => {
    const on = (e) => {
      const el = e.target.closest?.('.spot');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    window.addEventListener('pointermove', on, { passive: true });
    return () => window.removeEventListener('pointermove', on);
  }, []);
}

/** Adds `is-in` to every `.reveal` child of the ref once it scrolls into view. */
export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = [root, ...root.querySelectorAll('.reveal')];
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { threshold: 0.15 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}

/** Animates from 0 to `to` with ease-out. */
export function useCountUp(to, ms = 1100) {
  const [v, setV] = useState(reducedMotion() ? to : 0);
  useEffect(() => {
    if (reducedMotion()) return setV(to);
    let raf; const t0 = performance.now(); const from = 0;
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / ms);
      setV(from + (to - from) * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, ms]);
  return v;
}

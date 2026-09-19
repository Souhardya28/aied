import { useRef } from 'react';
import { reducedMotion } from '../hooks/useFx.js';

/** Gentle 3D tilt toward the cursor, with a moving glare. */
export default function Tilt({ children, max = 7, className = '' }) {
  const ref = useRef(null);
  const move = (e) => {
    if (reducedMotion() || e.pointerType === 'touch') return;
    const el = ref.current, r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${x * max}deg) rotateX(${-y * max}deg)`;
    el.style.setProperty('--gx', `${(x + 0.5) * 100}%`);
    el.style.setProperty('--gy', `${(y + 0.5) * 100}%`);
  };
  const leave = () => { ref.current.style.transform = ''; };
  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave}
      className={`relative transition-transform duration-300 ease-out will-change-transform [transform-style:preserve-3d] ${className}`}>
      {children}
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-xl2 opacity-60 mix-blend-soft-light"
        style={{ background: 'radial-gradient(500px circle at var(--gx,50%) var(--gy,0%), rgba(255,255,255,.35), transparent 40%)' }} />
    </div>
  );
}

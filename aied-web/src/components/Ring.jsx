import { useEffect, useState } from 'react';

/** Progress ring that draws itself on mount. */
export default function Ring({ value, size = 96, stroke = 9, children }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const [p, setP] = useState(0);
  useEffect(() => { const id = requestAnimationFrame(() => setP(value)); return () => cancelAnimationFrame(id); }, [value]);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(var(--indigo))" />
            <stop offset="100%" stopColor="rgb(var(--marigold))" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(var(--line))" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#ringGrad)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - p / 100)} style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(.2,.7,.2,1)' }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

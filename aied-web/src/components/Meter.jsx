/** Horizontal progress bar with an accessible label. */
export default function Meter({ value, max = 100, tone = 'indigo', label }) {
  const pct = Math.round((value / max) * 100);
  const color = { indigo: 'bg-indigo', marigold: 'bg-marigold', leaf: 'bg-leaf', chili: 'bg-chili' }[tone];
  return (
    <div role="meter" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label} className="h-2 rounded-full bg-paper overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-[width] duration-700`} style={{ width: `${pct}%` }} />
    </div>
  );
}

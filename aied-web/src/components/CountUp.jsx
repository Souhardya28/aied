import { useCountUp } from '../hooks/useFx.js';

export default function CountUp({ to, decimals = 0, ms }) {
  const v = useCountUp(to, ms);
  return <span className="tabular-nums">{v.toFixed(decimals)}</span>;
}

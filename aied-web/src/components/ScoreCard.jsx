/**
 * ScoreCard — compact card showing one mock-test result.
 *
 * Props:
 *  subject  — string (e.g. "Physics")
 *  score    — number 0–100
 *  at       — Unix timestamp (ms) or Date string (optional)
 *  onClick  — optional click handler (makes the card interactive)
 *  className — extra classes (optional)
 */
import CountUp from './CountUp.jsx';

function scoreColor(score) {
  if (score >= 80) return 'text-leaf';
  if (score >= 50) return '';
  return 'text-chili';
}

function scoreBadge(score) {
  if (score >= 80) return 'bg-leaf/10 text-leaf';
  if (score >= 50) return 'bg-indigo-soft text-indigo';
  return 'bg-chili/10 text-chili';
}

function scoreLabel(score) {
  if (score >= 80) return 'Strong';
  if (score >= 50) return 'Getting there';
  return 'Needs work';
}

export default function ScoreCard({ subject, score, at, onClick, className = '' }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      className={`panel p-4 text-left w-full ${onClick ? 'hover:-translate-y-0.5 transition-transform cursor-pointer' : ''} ${className}`}
    >
      <p className="text-sm text-muted font-medium">{subject}</p>
      <p className={`font-display text-3xl font-extrabold mt-1 ${scoreColor(score)}`}>
        <CountUp to={score} ms={600} />%
      </p>
      <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
        <span className={`chip text-[11px] ${scoreBadge(score)}`}>{scoreLabel(score)}</span>
        {at && (
          <span className="text-xs text-muted tabular-nums">
            {new Date(at).toLocaleDateString(undefined, {
              day: 'numeric', month: 'short',
              hour: '2-digit', minute: '2-digit',
            })}
          </span>
        )}
      </div>
    </Tag>
  );
}

/**
 * Skeleton — pulse-animated loading placeholders.
 *
 * Exports:
 *   SkeletonLine  — a single text-height shimmer bar
 *   SkeletonBlock — a rectangular shimmer area (use for images/charts)
 *   SkeletonCard  — pre-composed panel with a few lines (drop-in for content cards)
 *   default       — SkeletonCard (convenience)
 */

const base = 'rounded-lg bg-line animate-pulse';

/** A single shimmer line. width defaults to "100%". */
export function SkeletonLine({ width = '100%', className = '' }) {
  return (
    <span
      role="presentation"
      className={`${base} block h-4 ${className}`}
      style={{ width }}
    />
  );
}

/** A rectangular shimmer block (images, charts, avatars). */
export function SkeletonBlock({ height = 120, className = '' }) {
  return (
    <span
      role="presentation"
      className={`${base} block w-full ${className}`}
      style={{ height }}
    />
  );
}

/**
 * SkeletonCard — a panel shell with three shimmer lines.
 * Use as a drop-in placeholder for any content card.
 */
export function SkeletonCard({ lines = 3, className = '' }) {
  return (
    <div className={`panel p-6 space-y-3 ${className}`} aria-busy="true" aria-label="Loading…">
      <SkeletonLine width="60%" className="h-5" />
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <SkeletonLine key={i} width={i === lines - 2 ? '80%' : '100%'} />
      ))}
    </div>
  );
}

/** Convenience default export. */
export default SkeletonCard;

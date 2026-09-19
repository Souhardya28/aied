import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 py-20">
      {/* Large decorative 404 */}
      <div className="relative select-none mb-8" aria-hidden>
        <p className="font-display text-[9rem] sm:text-[12rem] font-extrabold leading-none text-line">
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="grid place-items-center h-20 w-20 rounded-2xl bg-indigo-soft text-indigo">
            <Compass size={38} strokeWidth={1.5} />
          </span>
        </div>
      </div>

      <h1 className="font-display text-2xl sm:text-3xl font-extrabold mt-2">
        This page doesn't exist
      </h1>
      <p className="mt-3 text-muted text-[15px] max-w-sm leading-relaxed">
        The link might be wrong, or the page may have been moved. Head back home and pick up where you left off.
      </p>

      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link to="/" className="btn-primary glow-btn !px-8">
          <Home size={16} /> Go home
        </Link>
        <Link to="/watch?sample=1" className="btn-outline">
          Try the sample lecture
        </Link>
      </div>

      {/* Decorative dots grid */}
      <div className="absolute inset-0 dotgrid [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)] pointer-events-none -z-10" aria-hidden />
    </div>
  );
}

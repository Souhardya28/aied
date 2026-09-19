/**
 * EmptyState — a reusable slot for zero-data views.
 *
 * Props:
 *  icon       — a Lucide icon component (or any ReactNode)
 *  title      — primary heading text
 *  description — supporting text (optional)
 *  action     — { label, onClick } or { label, to } for a CTA button (optional)
 *  className  — extra wrapper classes (optional)
 */
import { Link } from 'react-router-dom';

export default function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center px-6 py-16 ${className}`}>
      {Icon && (
        <span className="grid place-items-center h-16 w-16 rounded-2xl bg-indigo-soft text-indigo mb-5 animate-pop">
          <Icon size={28} strokeWidth={1.5} />
        </span>
      )}
      <p className="font-display text-xl font-bold">{title}</p>
      {description && (
        <p className="mt-2 text-muted text-[15px] max-w-xs leading-relaxed">{description}</p>
      )}
      {action && (
        <div className="mt-6">
          {'to' in action ? (
            <Link to={action.to} className="btn-primary">{action.label}</Link>
          ) : (
            <button onClick={action.onClick} className="btn-primary">{action.label}</button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Modal — accessible dialog built on the native <dialog> element.
 *
 * Props:
 *  open        — boolean; controls visibility
 *  onClose     — called when backdrop or ✕ is clicked, or Escape is pressed
 *  title       — dialog heading (string)
 *  children    — dialog body content
 *  footer      — action buttons row (ReactNode, optional)
 *  size        — 'sm' | 'md' (default 'md')
 *  dangerous   — if true, tints the confirm area red (for destructive confirmations)
 */
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, footer, size = 'md', dangerous = false }) {
  const ref = useRef(null);

  // Drive the native <dialog> open/close from the `open` prop
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  // Sync native `cancel` event (Escape key) back to the consumer
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleCancel = (e) => { e.preventDefault(); onClose?.(); };
    el.addEventListener('cancel', handleCancel);
    return () => el.removeEventListener('cancel', handleCancel);
  }, [onClose]);

  // Close on backdrop click (click outside the inner panel)
  const handleBackdropClick = (e) => {
    if (e.target === ref.current) onClose?.();
  };

  const widthCls = size === 'sm' ? 'max-w-sm' : 'max-w-lg';

  return (
    <dialog
      ref={ref}
      onClick={handleBackdropClick}
      className={[
        // Reset native dialog styles
        'fixed inset-0 z-50 m-auto p-0 border-0 bg-transparent',
        // Backdrop
        'backdrop:bg-ink/40 backdrop:backdrop-blur-sm',
        // Sizing
        `w-[calc(100%-2rem)] ${widthCls}`,
        // Animation when opening
        'open:animate-pop',
      ].join(' ')}
    >
      {/* Inner panel */}
      <div className={`panel flex flex-col overflow-hidden ${dangerous ? 'border-chili/30' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-line">
          <h2 className={`font-display text-lg font-bold ${dangerous ? 'text-chili' : ''}`}>{title}</h2>
          <button
            onClick={onClose}
            className="btn-ghost !p-2 -mr-1 text-muted"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 text-[15px] leading-relaxed text-ink/90">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-line flex justify-end gap-3 flex-wrap">
            {footer}
          </div>
        )}
      </div>
    </dialog>
  );
}

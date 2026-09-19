import { reducedMotion } from '../hooks/useFx.js';

const COLORS = ['#4338CA', '#F4B63F', '#2F7D5B', '#A099FF', '#F6C058'];

/** Tiny dependency-free confetti burst from a point (defaults to screen centre). */
export function confetti({ x = innerWidth / 2, y = innerHeight / 2, count = 90 } = {}) {
  if (reducedMotion()) return;
  const cv = document.createElement('canvas');
  cv.width = innerWidth; cv.height = innerHeight;
  Object.assign(cv.style, { position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 80 });
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d');
  const bits = Array.from({ length: count }, () => {
    const a = Math.random() * Math.PI * 2, s = 5 + Math.random() * 9;
    return { x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 6, r: Math.random() * 6.3, vr: (Math.random() - 0.5) * 0.4,
      w: 6 + Math.random() * 6, h: 3 + Math.random() * 4, c: COLORS[(Math.random() * COLORS.length) | 0], life: 1 };
  });
  let raf;
  const tick = () => {
    ctx.clearRect(0, 0, cv.width, cv.height);
    let alive = 0;
    for (const b of bits) {
      b.vy += 0.32; b.vx *= 0.985; b.x += b.vx; b.y += b.vy; b.r += b.vr; b.life -= 0.009;
      if (b.life <= 0 || b.y > cv.height + 20) continue;
      alive++;
      ctx.save(); ctx.globalAlpha = Math.min(1, b.life * 1.6); ctx.translate(b.x, b.y); ctx.rotate(b.r);
      ctx.fillStyle = b.c; ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h * Math.cos(b.r * 2)); ctx.restore();
    }
    if (alive) raf = requestAnimationFrame(tick); else cv.remove();
  };
  raf = requestAnimationFrame(tick);
  setTimeout(() => { cancelAnimationFrame(raf); cv.remove(); }, 5000);
}

export const confettiFrom = (el) => {
  const r = el?.getBoundingClientRect?.();
  confetti(r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : {});
};

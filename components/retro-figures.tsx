/**
 * Neon-pink '80s silhouettes that cruise along the hero's horizon grid —
 * BMX kid, boombox, cassette, arcade joystick, roller skate, Walkman.
 * The row is rendered twice for a seamless marquee loop (see .figure-marquee
 * in globals.css); motion stops under prefers-reduced-motion.
 */

function Bmx() {
  return (
    <svg viewBox="0 0 64 44" className="h-10 w-auto" aria-hidden fill="currentColor">
      {/* wheels */}
      <circle cx="13" cy="34" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="49" cy="34" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
      {/* frame */}
      <path d="M13 34 L27 20 L42 20 L49 34 M27 20 L31 34 L13 34" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      {/* handlebar + seat */}
      <path d="M42 20 L44 12 L48 10 M27 20 L23 14 L19 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* rider */}
      <circle cx="33" cy="6" r="3.5" />
      <path d="M33 10 L31 18 L38 16 M31 14 L26 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function Boombox() {
  return (
    <svg viewBox="0 0 64 40" className="h-9 w-auto" aria-hidden fill="currentColor">
      <rect x="2" y="10" width="60" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M20 10 L24 2 L44 2" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="15" cy="23" r="7" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="49" cy="23" r="7" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="15" cy="23" r="2" />
      <circle cx="49" cy="23" r="2" />
      <rect x="27" y="16" width="10" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="27" y="26" width="10" height="4" rx="1" />
    </svg>
  );
}

function Cassette() {
  return (
    <svg viewBox="0 0 56 36" className="h-8 w-auto" aria-hidden fill="currentColor">
      <rect x="2" y="2" width="52" height="32" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <rect x="12" y="9" width="32" height="10" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="19" cy="14" r="2.5" />
      <circle cx="37" cy="14" r="2.5" />
      <path d="M14 34 L18 24 L38 24 L42 34" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function Joystick() {
  return (
    <svg viewBox="0 0 48 44" className="h-9 w-auto" aria-hidden fill="currentColor">
      <rect x="4" y="28" width="40" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M22 28 L22 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="22" cy="8" r="5" />
      <circle cx="36" cy="34" r="3" />
    </svg>
  );
}

function RollerSkate() {
  return (
    <svg viewBox="0 0 52 44" className="h-9 w-auto" aria-hidden fill="currentColor">
      <path d="M8 4 L8 24 Q8 30 14 30 L42 30 Q46 30 46 26 L46 22 Q34 20 28 12 L26 4 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M8 12 L24 12" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="37" r="5" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="38" cy="37" r="5" fill="none" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

function Walkman() {
  return (
    <svg viewBox="0 0 40 46" className="h-9 w-auto" aria-hidden fill="currentColor">
      <rect x="4" y="10" width="32" height="34" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <rect x="10" y="18" width="20" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="15" cy="24" r="2" />
      <circle cx="25" cy="24" r="2" />
      <path d="M10 36 L30 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* headphones */}
      <path d="M12 10 Q12 2 20 2 Q28 2 28 10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

const figures = [Bmx, Boombox, Cassette, Joystick, RollerSkate, Walkman];

function FigureRow() {
  return (
    <div className="flex shrink-0 items-end gap-16 pr-16 sm:gap-24 sm:pr-24">
      {figures.map((Figure, i) => (
        <Figure key={i} />
      ))}
    </div>
  );
}

export function RetroFigures() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-6 overflow-hidden"
      aria-hidden
    >
      <div className="figure-marquee text-accent opacity-70 [filter:drop-shadow(0_0_8px_oklch(0.68_0.22_340/0.8))]">
        <FigureRow />
        <FigureRow />
      </div>
    </div>
  );
}

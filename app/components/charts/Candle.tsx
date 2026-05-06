type CandleType = 'bullish' | 'bearish' | 'pin-bull' | 'pin-bear' | 'doji';

interface CandleProps {
  type?: CandleType;
  label?: string;
  caption?: string;
  className?: string;
}

const SHAPES: Record<
  CandleType,
  { fill: string; stroke: string; wick: string; uw: [number, number]; body: [number, number]; lw: [number, number] }
> = {
  bullish: {
    fill: '#10b981', stroke: '#059669', wick: '#059669',
    uw: [10, 42], body: [42, 132], lw: [132, 158],
  },
  bearish: {
    fill: '#ef4444', stroke: '#dc2626', wick: '#b91c1c',
    uw: [10, 42], body: [42, 132], lw: [132, 158],
  },
  'pin-bull': {
    fill: '#10b981', stroke: '#059669', wick: '#059669',
    uw: [10, 30], body: [30, 58], lw: [58, 158],
  },
  'pin-bear': {
    fill: '#ef4444', stroke: '#dc2626', wick: '#b91c1c',
    uw: [10, 108], body: [108, 138], lw: [138, 158],
  },
  doji: {
    fill: '#71717a', stroke: '#52525b', wick: '#71717a',
    uw: [10, 82], body: [82, 88], lw: [88, 158],
  },
};

export function Candle({ type = 'bullish', label, caption, className = '' }: CandleProps) {
  const s = SHAPES[type];
  const bodyH = Math.max(s.body[1] - s.body[0], 4);

  return (
    <div className={`flex flex-col items-center gap-1.5 ${className}`}>
      {label && (
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</p>
      )}
      <svg width="60" height="168" viewBox="0 0 60 168" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Upper wick */}
        <line
          x1="30" y1={s.uw[0]} x2="30" y2={s.uw[1]}
          stroke={s.wick} strokeWidth="1.5" strokeLinecap="round"
        />
        {/* Body */}
        <rect
          x="13" y={s.body[0]} width="34" height={bodyH}
          fill={s.fill} stroke={s.stroke} strokeWidth="1" rx="2"
        />
        {/* Lower wick */}
        <line
          x1="30" y1={s.lw[0]} x2="30" y2={s.lw[1]}
          stroke={s.wick} strokeWidth="1.5" strokeLinecap="round"
        />
      </svg>
      {caption && (
        <p className="text-[11px] text-zinc-500 text-center leading-snug max-w-[88px]">{caption}</p>
      )}
    </div>
  );
}

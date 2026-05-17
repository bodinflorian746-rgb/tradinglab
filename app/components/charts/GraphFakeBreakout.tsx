interface MiniCandleProps {
  cx: number;
  bodyTop: number;
  bodyBot: number;
  wickTop: number;
  wickBot: number;
  bullish: boolean;
}

function MiniCandle({ cx, bodyTop, bodyBot, wickTop, wickBot, bullish }: MiniCandleProps) {
  return (
    <g>
      <line
        x1={cx} y1={wickTop} x2={cx} y2={wickBot}
        stroke="#3f3f46" strokeWidth="1.5" strokeLinecap="round"
      />
      <rect
        x={cx - 6} y={bodyTop} width="12"
        height={Math.max(bodyBot - bodyTop, 3)}
        fill={bullish ? '#10b981' : '#ef4444'}
        stroke={bullish ? '#059669' : '#dc2626'}
        strokeWidth="0.8" rx="1.5"
      />
    </g>
  );
}

interface GraphFakeBreakoutProps {
  className?: string;
}

export function GraphFakeBreakout({ className = '' }: GraphFakeBreakoutProps) {
  const rY = 62;

  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg
        width="100%"
        viewBox="0 0 270 158"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Resistance zone: subtle fill above */}
        <rect x="0" y="0" width="270" height={rY + 2} fill="#ef444408" />

        {/* Fake wick zone highlight — the "fake" part above resistance */}
        <rect x="104" y="26" width="12" height={rY - 26} fill="#b91c1c22" rx="2" />

        {/* Resistance line */}
        <line
          x1="0" y1={rY} x2="270" y2={rY}
          stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.8"
        />

        {/* Candle 1 — bullish approach */}
        <MiniCandle cx={28} bodyTop={90} bodyBot={110} wickTop={83} wickBot={118} bullish />
        {/* Candle 2 — bullish approach, closer to resistance */}
        <MiniCandle cx={66} bodyTop={72} bodyBot={93} wickTop={65} wickBot={100} bullish />
        {/* Candle 3 — FAKE BREAKOUT: wick above resistance, bearish body below */}
        <MiniCandle cx={110} bodyTop={68} bodyBot={90} wickTop={26} wickBot={97} bullish={false} />
        {/* Candle 4 — bearish reversal */}
        <MiniCandle cx={150} bodyTop={90} bodyBot={120} wickTop={84} wickBot={126} bullish={false} />
        {/* Candle 5 — bearish drop */}
        <MiniCandle cx={190} bodyTop={118} bodyBot={142} wickTop={113} wickBot={148} bullish={false} />

        {/* Dot marking the wick peak (fake) */}
        <circle cx="110" cy="26" r="3" fill="#b91c1c" opacity="0.95" />

        {/* Annotation: wick above resistance */}
        <line x1="113" y1="24" x2="138" y2="14" stroke="#f87171" strokeWidth="1" opacity="0.5" strokeDasharray="2 2" />
        <text x="141" y="18" fontSize="9" fill="#f87171" opacity="0.9">mèche ↑</text>

        {/* Dot marking the close (below resistance) */}
        <circle cx="116" cy="68" r="2.5" fill="#ef4444" opacity="0.9" />
        {/* Annotation: close below resistance */}
        <line x1="118" y1="68" x2="138" y2="80" stroke="#ef4444" strokeWidth="1" opacity="0.45" strokeDasharray="2 2" />
        <text x="141" y="84" fontSize="9" fill="#ef4444" opacity="0.8">clôture ↓</text>

        {/* Resistance label avec halo */}
        <rect x="182" y={rY - 19} width="87" height="14" rx="3" fill="#09090b" />
        <text x="188" y={rY - 8} fontSize="9" fill="#ef4444" opacity="0.75">Résistance</text>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400 opacity-90" />
          <span className="text-[10px] text-zinc-500">Mèche au-dessus de la résistance</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="text-[10px] text-zinc-500">Clôture sous la résistance = piège</span>
        </div>
      </div>
    </div>
  );
}

interface OrderBlockDiagramProps {
  className?: string;
}

type CandleData = {
  cx: number;
  wickTop: number;
  bodyTop: number;
  bodyBot: number;
  wickBot: number;
  bull: boolean;
  wide?: boolean;
};

function MiniCandle({ cx, wickTop, bodyTop, bodyBot, wickBot, bull, wide }: CandleData) {
  const hw = wide ? 10 : 7;
  return (
    <g>
      <line x1={cx} y1={wickTop} x2={cx} y2={wickBot}
        stroke={bull ? "#059669" : "#dc2626"} strokeWidth="1.5" strokeLinecap="round" />
      <rect x={cx - hw} y={bodyTop} width={hw * 2}
        height={Math.max(bodyBot - bodyTop, 3)}
        fill={bull ? "#10b981" : "#ef4444"}
        stroke={bull ? "#059669" : "#dc2626"}
        strokeWidth="0.8" rx="1.5" />
    </g>
  );
}

export function OrderBlockDiagram({ className = "" }: OrderBlockDiagramProps) {
  // ── BULLISH OB (left, x=4–128) ────────────────────────────────
  // 2 bearish descent candles → last bearish (OB) → 2 big bullish impulse → return to OB
  const bullCandles: CandleData[] = [
    // Descent phase (small bearish)
    { cx: 20, wickTop: 46, bodyTop: 50,  bodyBot: 62,  wickBot: 66,  bull: false },
    { cx: 36, wickTop: 58, bodyTop: 62,  bodyBot: 74,  wickBot: 78,  bull: false },
    // *** BULLISH ORDER BLOCK — last bearish before impulse ***
    { cx: 54, wickTop: 68, bodyTop: 72,  bodyBot: 92,  wickBot: 96,  bull: false, wide: true },
    // Bullish impulse
    { cx: 74, wickTop: 42, bodyTop: 46,  bodyBot: 90,  wickBot: 94,  bull: true  },
    { cx: 90, wickTop: 26, bodyTop: 30,  bodyBot: 66,  wickBot: 70,  bull: true  },
    // Return candle to OB (retracement into OB zone y=72–92)
    { cx: 112, wickTop: 28, bodyTop: 32, bodyBot: 82,  wickBot: 88,  bull: false },
  ];
  const bullOB = bullCandles[2]; // the OB candle

  // ── BEARISH OB (right, x=140–264) ────────────────────────────
  // 2 bullish ascent candles → last bullish (OB) → 2 big bearish impulse → return to OB
  const bearCandles: CandleData[] = [
    // Ascent phase (small bullish)
    { cx: 154, wickTop: 98,  bodyTop: 102, bodyBot: 114, wickBot: 118, bull: true  },
    { cx: 170, wickTop: 80,  bodyTop: 84,  bodyBot: 98,  wickBot: 102, bull: true  },
    // *** BEARISH ORDER BLOCK — last bullish before impulse ***
    { cx: 188, wickTop: 62,  bodyTop: 66,  bodyBot: 82,  wickBot: 86,  bull: true,  wide: true },
    // Bearish impulse
    { cx: 206, wickTop: 64,  bodyTop: 68,  bodyBot: 108, wickBot: 112, bull: false },
    { cx: 222, wickTop: 88,  bodyTop: 92,  bodyBot: 126, wickBot: 130, bull: false },
    // Return candle to OB (retracement into OB zone y=66–82)
    { cx: 246, wickTop: 60,  bodyTop: 64,  bodyBot: 80,  wickBot: 84,  bull: true  },
  ];
  const bearOB = bearCandles[2]; // the OB candle

  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg
        width="100%"
        viewBox="0 0 268 152"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>{`@media (max-width: 640px) { .chart-detail-labels { display: none; } }`}</style>

        {/* Panel divider */}
        <line x1="134" y1="8" x2="134" y2="144" stroke="#27272a" strokeWidth="1" />

        {/* ── BULLISH OB ── */}

        {/* OB zone highlight (emerald) */}
        <rect
          x={bullOB.cx - 12} y={bullOB.bodyTop}
          width="24" height={bullOB.bodyBot - bullOB.bodyTop}
          fill="#10b98118" stroke="#10b98150" strokeWidth="1.2" rx="2"
        />

        {/* OB zone extension rect (shows zone extends to the right) */}
        <rect
          x={bullOB.cx + 12} y={bullOB.bodyTop}
          width="62" height={bullOB.bodyBot - bullOB.bodyTop}
          fill="#10b98108" stroke="#10b98128" strokeWidth="0.8" rx="0"
        />

        {/* Candles */}
        {bullCandles.map((c, i) => <MiniCandle key={i} {...c} />)}

        {/* Badges textuels bullish OB — masqués sur mobile */}
        <g className="chart-detail-labels">
          <rect x="6" y="7" width="60" height="14" rx="3"
            fill="#10b98118" stroke="#10b98140" strokeWidth="0.8" />
          <text x="36" y="17" fontSize="7.5" fill="#10b981" textAnchor="middle" fontWeight="700">Bullish OB</text>

          <line x1="54" y1="21" x2="54" y2={bullOB.bodyTop - 4}
            stroke="#10b981" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />

          <rect x="96" y="16" width="36" height="11" rx="2"
            fill="#09090b" fillOpacity="0.9" />
          <text x="114" y="24" fontSize="6.5" fill="#10b981" textAnchor="middle" fontWeight="600">rejet ↑</text>
        </g>

        {/* ── BEARISH OB ── */}

        {/* OB zone highlight (red) */}
        <rect
          x={bearOB.cx - 12} y={bearOB.bodyTop}
          width="24" height={bearOB.bodyBot - bearOB.bodyTop}
          fill="#ef444418" stroke="#ef444450" strokeWidth="1.2" rx="2"
        />

        {/* OB zone extension rect */}
        <rect
          x={bearOB.cx + 12} y={bearOB.bodyTop}
          width="62" height={bearOB.bodyBot - bearOB.bodyTop}
          fill="#ef444408" stroke="#ef444428" strokeWidth="0.8" rx="0"
        />

        {/* Candles */}
        {bearCandles.map((c, i) => <MiniCandle key={i} {...c} />)}

        {/* Badges textuels bearish OB — masqués sur mobile */}
        <g className="chart-detail-labels">
          <rect x="140" y="7" width="60" height="14" rx="3"
            fill="#ef444418" stroke="#ef444440" strokeWidth="0.8" />
          <text x="170" y="17" fontSize="7.5" fill="#ef4444" textAnchor="middle" fontWeight="700">Bearish OB</text>

          <line x1="188" y1="21" x2="188" y2={bearOB.bodyTop - 4}
            stroke="#ef4444" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />

          <rect x="230" y="44" width="36" height="11" rx="2"
            fill="#09090b" fillOpacity="0.9" />
          <text x="248" y="52" fontSize="6.5" fill="#ef4444" textAnchor="middle" fontWeight="600">rejet ↓</text>
        </g>
      </svg>

      {/* Mobile : 2 cartes Order Block */}
      <div className="sm:hidden px-4 py-3 border-t border-zinc-800/60 space-y-2.5">
        <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-2.5 space-y-1.5">
          <p className="text-[13px] font-bold text-emerald-400">Bullish OB (gauche)</p>
          <p className="text-[12px] text-zinc-300 leading-snug">
            <span className="font-bold text-emerald-400">Dernière bougie baissière</span> avant une impulsion haussière forte. Le prix revient
            tester cette zone (<span className="font-semibold">rejet ↑</span>) puis repart à la hausse.
          </p>
        </div>
        <div className="rounded-lg border border-red-500/25 bg-red-500/5 p-2.5 space-y-1.5">
          <p className="text-[13px] font-bold text-red-400">Bearish OB (droite)</p>
          <p className="text-[12px] text-zinc-300 leading-snug">
            <span className="font-bold text-red-400">Dernière bougie haussière</span> avant une impulsion baissière forte. Le prix revient
            tester cette zone (<span className="font-semibold">rejet ↓</span>) puis chute.
          </p>
        </div>
      </div>

      {/* Desktop legend (inchangée) */}
      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">Bullish OB — dernière baissière avant hausse impulsive</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-[10px] text-zinc-500">Bearish OB — dernière haussière avant baisse impulsive</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm border border-zinc-600 bg-zinc-800" />
          <span className="text-[10px] text-zinc-500">Zone OB = zone d'ordres institutionnels</span>
        </div>
      </div>
    </div>
  );
}

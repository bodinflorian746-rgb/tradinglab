interface PrecisionEntryDiagramProps {
  className?: string;
  locale?: "fr" | "es";
}

type CD = {
  cx: number;
  wickTop: number;
  bodyTop: number;
  bodyBot: number;
  wickBot: number;
  bull: boolean;
  wide?: boolean;
};

function Candle({ cx, wickTop, bodyTop, bodyBot, wickBot, bull, wide }: CD) {
  const hw = wide ? 10 : 7;
  return (
    <g>
      <line
        x1={cx}
        y1={wickTop}
        x2={cx}
        y2={wickBot}
        stroke={bull ? "#059669" : "#dc2626"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect
        x={cx - hw}
        y={bodyTop}
        width={hw * 2}
        height={Math.max(bodyBot - bodyTop, 3)}
        fill={bull ? "#10b981" : "#ef4444"}
        stroke={bull ? "#059669" : "#dc2626"}
        strokeWidth="0.8"
        rx="1.5"
      />
    </g>
  );
}

const CANDLES: CD[] = [
  { cx: 20,  wickTop: 30,  bodyTop: 36,  bodyBot: 70,  wickBot: 78,  bull: true  },
  { cx: 50,  wickTop: 22,  bodyTop: 28,  bodyBot: 56,  wickBot: 62,  bull: true  },
  { cx: 80,  wickTop: 18,  bodyTop: 22,  bodyBot: 42,  wickBot: 48,  bull: true  },
  { cx: 110, wickTop: 14,  bodyTop: 18,  bodyBot: 38,  wickBot: 46,  bull: false },
  { cx: 140, wickTop: 32,  bodyTop: 38,  bodyBot: 70,  wickBot: 76,  bull: false },
  { cx: 170, wickTop: 58,  bodyTop: 64,  bodyBot: 100, wickBot: 108, bull: false },
  { cx: 200, wickTop: 92,  bodyTop: 98,  bodyBot: 132, wickBot: 142, bull: false },
  { cx: 230, wickTop: 128, bodyTop: 134, bodyBot: 162, wickBot: 172, bull: false },
  { cx: 262, wickTop: 152, bodyTop: 158, bodyBot: 184, wickBot: 192, bull: false, wide: true },
  { cx: 295, wickTop: 162, bodyTop: 168, bodyBot: 184, wickBot: 192, bull: true,  wide: true },
];

export function PrecisionEntryDiagram({ className = "", locale = "fr" }: PrecisionEntryDiagramProps) {
  const isEs = locale === "es";
  const L = {
    supportHoriz:  isEs ? "Soporte horizontal" : "Support horizontal",
    support:       isEs ? "Soporte" : "Support",
    preciseEntry:  isEs ? "ENTRADA PRECISA" : "ENTRÉE PRÉCISE",
    confluences:   isEs ? "4 confluencias ✓" : "4 confluences ✓",
    mobTitle:      isEs ? "Entrada de precisión — 4 confluencias ✓" : "Entrée de précision — 4 confluences ✓",
    mob1desc:      isEs ? "· zona Fibonacci óptima" : "· zone Fibonacci optimale",
    mob2desc:      isEs ? "· zona de órdenes institucionales" : "· zone d'ordres institutionnels",
    mob3desc:      isEs ? "· Fair Value Gap (zona de desequilibrio)" : "· Fair Value Gap (zone de déséquilibre)",
    mob4title:     isEs ? "4 · Soporte horizontal" : "4 · Support horizontal",
    mob4desc:      isEs ? "· nivel histórico respetado" : "· niveau historique respecté",
    mobFooter:     isEs ? "→ En la intersección de las 4 zonas:" : "→ À l'intersection des 4 zones :",
    mobFooterEnd:  isEs ? "en señal de rechazo alcista" : "sur signal de rejet haussier",
    legendOte:     isEs ? "Zona OTE (61.8–78.6%)" : "Zone OTE (61.8–78.6%)",
    legendOb:      isEs ? "Order Block (OB)" : "Order Block (OB)",
    legendFvg:     isEs ? "Fair Value Gap (FVG)" : "Fair Value Gap (FVG)",
    legendSignal:  isEs ? "Señal de rechazo — entrada de precisión" : "Signal de rejet — entrée de précision",
  };
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg
        width="100%"
        viewBox="0 0 500 210"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>{`@media (max-width: 640px) { .chart-detail-labels { display: none; } }`}</style>

        {/* 4 zones de confluence empilées (toujours visibles) */}
        <rect x={10} y={128} width={310} height={14} fill="#60a5fa18" stroke="#60a5fa55" strokeWidth="0.8" strokeDasharray="4 2" rx="2" />
        <rect x={10} y={148} width={310} height={14} fill="#10b98118" stroke="#10b98155" strokeWidth="0.8" rx="2" />
        <rect x={10} y={168} width={310} height={10} fill="#f59e0b18" stroke="#f59e0b55" strokeWidth="0.8" rx="2" />
        <line x1={10} y1={190} x2={320} y2={190} stroke="#10b981" strokeWidth="1.2" strokeDasharray="5 3" />

        {/* Candles au-dessus des zones */}
        {CANDLES.map((c, i) => <Candle key={i} {...c} />)}

        {/* Swing High marker — toujours visible */}
        <circle cx={110} cy={14} r="3" fill="#71717a" opacity="0.8" />

        {/* Tous les badges textuels — masqués sur mobile */}
        <g className="chart-detail-labels">
          <text x={16} y={138} fontSize="7.5" fill="#60a5fa" fontWeight="700">OTE 61.8–78.6%</text>
          <text x={16} y={158} fontSize="7.5" fill="#10b981" fontWeight="700">Order Block</text>
          <text x={16} y={176} fontSize="7" fill="#f59e0b" fontWeight="700">FVG</text>
          <text x={16} y={186} fontSize="7" fill="#10b981" fontWeight="600">{L.supportHoriz}</text>

          <rect x={330} y={127} width={48} height={14} rx="2" fill="#09090b" />
          <text x={354} y={138} fontSize="7.5" fill="#60a5fa" textAnchor="middle" fontWeight="700">OTE</text>

          <rect x={330} y={147} width={48} height={14} rx="2" fill="#09090b" />
          <text x={354} y={158} fontSize="7.5" fill="#10b981" textAnchor="middle" fontWeight="700">OB</text>

          <rect x={330} y={165} width={48} height={14} rx="2" fill="#09090b" />
          <text x={354} y={176} fontSize="7.5" fill="#f59e0b" textAnchor="middle" fontWeight="700">FVG</text>

          <rect x={330} y={182} width={48} height={14} rx="2" fill="#09090b" />
          <text x={354} y={193} fontSize="7" fill="#10b981" textAnchor="middle" fontWeight="700">{L.support}</text>

          <rect x={235} y={86} width={72} height={13} rx="2" fill="#10b98118" stroke="#10b98155" strokeWidth="0.7" />
          <text x={271} y={96} fontSize="7.5" fill="#10b981" textAnchor="middle" fontWeight="700">{L.preciseEntry}</text>
          <line x1={271} y1={99} x2={290} y2={158} stroke="#10b981" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />

          <rect x={388} y={8} width={104} height={14} rx="3" fill="#10b98118" stroke="#10b98155" strokeWidth="0.7" />
          <text x={440} y={18} fontSize="7.5" fill="#10b981" textAnchor="middle" fontWeight="700">{L.confluences}</text>

          <text x={140} y={17} fontSize="6.5" fill="#71717a" fontWeight="600">Swing High</text>
        </g>
      </svg>

      {/* Mobile : 4 confluences détaillées en cartes + signal */}
      <div className="sm:hidden px-4 py-3 border-t border-zinc-800/60 space-y-2">
        <p className="text-[13px] font-bold text-emerald-400">{L.mobTitle}</p>
        <ul className="space-y-1.5 text-[13px] leading-snug">
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-3 h-3 rounded-sm bg-blue-500/30 border border-blue-400 mt-0.5" />
            <span className="text-white">
              <span className="font-bold text-blue-400">1 · OTE (61.8–78.6%)</span>
              <span className="text-zinc-300"> {L.mob1desc}</span>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-3 h-3 rounded-sm bg-emerald-500/30 border border-emerald-500 mt-0.5" />
            <span className="text-white">
              <span className="font-bold text-emerald-400">2 · Order Block</span>
              <span className="text-zinc-300"> {L.mob2desc}</span>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-3 h-3 rounded-sm bg-amber-500/30 border border-amber-500 mt-0.5" />
            <span className="text-white">
              <span className="font-bold text-amber-400">3 · FVG</span>
              <span className="text-zinc-300"> {L.mob3desc}</span>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-3 h-0.5 border-t border-dashed border-emerald-500 mt-2.5" />
            <span className="text-white">
              <span className="font-bold text-emerald-400">{L.mob4title}</span>
              <span className="text-zinc-300"> {L.mob4desc}</span>
            </span>
          </li>
          <li className="flex items-start gap-2 pt-1 border-t border-zinc-800/50">
            <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1" />
            <span className="text-zinc-300">{L.mobFooter} <span className="font-bold text-emerald-400">{L.preciseEntry}</span> {L.mobFooterEnd}</span>
          </li>
        </ul>
      </div>

      {/* Desktop legend (inchangée) */}
      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-blue-400/40" />
          <span className="text-[10px] text-zinc-500">{L.legendOte}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-emerald-500/40" />
          <span className="text-[10px] text-zinc-500">{L.legendOb}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500/40" />
          <span className="text-[10px] text-zinc-500">{L.legendFvg}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">{L.legendSignal}</span>
        </div>
      </div>
    </div>
  );
}

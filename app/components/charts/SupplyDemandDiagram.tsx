interface SupplyDemandDiagramProps {
  className?: string;
}

export function SupplyDemandDiagram({ className = "" }: SupplyDemandDiagramProps) {
  const p = (pts: number[][]) =>
    pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");

  // Left panel — Demand: slow descent into zone → explosive rise
  const demandDescentPts = [[8, 30], [20, 44], [32, 60], [46, 76], [58, 92]];
  const demandRisePts    = [[58, 92], [74, 70], [92, 46], [110, 20], [122, 12]];

  // Right panel — Supply: slow rise into zone → explosive drop
  const supplyRisePts = [[144, 126], [156, 112], [168, 96], [182, 80], [196, 62]];
  const supplyDropPts = [[196, 62], [210, 82], [224, 106], [240, 128], [254, 138]];

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

        {/* ── DEMAND (left) ── */}
        <rect x="10" y="86" width="116" height="24" rx="2" fill="#10b98110" stroke="#10b98140" strokeWidth="1" />
        <path d={p(demandDescentPts)} stroke="#52525b" strokeWidth="1.5" strokeLinejoin="round" />
        <path d={p(demandRisePts)} stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="8" cy="30" r="2.5" fill="#52525b" />
        <circle cx="58" cy="92" r="4" fill="#10b981" opacity="0.85" />

        {/* ── SUPPLY (right) ── */}
        <rect x="144" y="46" width="116" height="24" rx="2" fill="#ef444410" stroke="#ef444440" strokeWidth="1" />
        <path d={p(supplyRisePts)} stroke="#52525b" strokeWidth="1.5" strokeLinejoin="round" />
        <path d={p(supplyDropPts)} stroke="#ef4444" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="144" cy="126" r="2.5" fill="#52525b" />
        <circle cx="196" cy="62" r="4" fill="#ef4444" opacity="0.85" />

        {/* Labels textuels — masqués sur mobile */}
        <g className="chart-detail-labels">
          <rect x="68" y="89" width="56" height="13" rx="3" fill="#10b98118" stroke="#10b98138" strokeWidth="0.8" />
          <text x="96" y="99" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="700">Zone Demand</text>
          <text x="88" y="16" fontSize="8.5" fill="#10b981" textAnchor="middle" opacity="0.65">impulsif ↑</text>

          <rect x="148" y="9" width="60" height="13" rx="3" fill="#09090b" fillOpacity="1" />
          <rect x="148" y="9" width="60" height="13" rx="3" fill="#ef444418" stroke="#ef444438" strokeWidth="0.8" />
          <text x="178" y="19" fontSize="8" fill="#ef4444" textAnchor="middle" fontWeight="700">Zone Supply</text>
          <text x="196" y="38" fontSize="8.5" fill="#ef4444" textAnchor="middle" opacity="0.65">impulsif ↓</text>
        </g>
      </svg>

      {/* Mobile : key card */}
      <div className="sm:hidden px-4 py-3 border-t border-zinc-800/60 space-y-2.5">
        <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-2.5">
          <p className="text-[13px] font-bold text-emerald-400">Zone Demand (gauche)</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-0.5">Prix descend lentement vers la zone, puis repart de façon <span className="font-semibold text-emerald-400">impulsive ↑</span></p>
        </div>
        <div className="rounded-lg border border-red-500/25 bg-red-500/5 p-2.5">
          <p className="text-[13px] font-bold text-red-400">Zone Supply (droite)</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-0.5">Prix monte lentement vers la zone, puis chute de façon <span className="font-semibold text-red-400">impulsive ↓</span></p>
        </div>
      </div>

      {/* Desktop legend (inchangée) */}
      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">Demand — départ impulsif haussier</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-[10px] text-zinc-500">Supply — départ impulsif baissier</span>
        </div>
      </div>
    </div>
  );
}

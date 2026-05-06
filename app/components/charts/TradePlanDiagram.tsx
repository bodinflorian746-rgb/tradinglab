interface TradePlanDiagramProps {
  className?: string;
}

export function TradePlanDiagram({ className = "" }: TradePlanDiagramProps) {
  // Price descends to creux at (110, 108), then rises
  const descent = "M10,38 L46,58 L78,82 L110,108";
  const rise    = "M110,108 L148,82 L188,52 L230,28 L258,16";

  const entryY = 108;
  const tpY    = 80;   // 28px above entry
  const slY    = 122;  // 14px below entry — R/R 1:2

  const zoneX = 110;
  const zoneW = 148; // to x=258

  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg
        width="100%"
        viewBox="0 0 268 152"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="tp-arr" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <path d="M 0 0 L 6 2 L 0 4 Z" fill="#10b981" />
          </marker>
          <marker id="sl-arr" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <path d="M 0 0 L 6 2 L 0 4 Z" fill="#ef4444" />
          </marker>
        </defs>

        {/* TP zone */}
        <rect x={zoneX} y={tpY} width={zoneW} height={entryY - tpY}
          fill="#10b98108" />

        {/* SL zone */}
        <rect x={zoneX} y={entryY} width={zoneW} height={slY - entryY}
          fill="#ef444408" />

        {/* TP line */}
        <line x1="88" y1={tpY} x2="258" y2={tpY}
          stroke="#10b981" strokeWidth="1.2" strokeDasharray="5 3" opacity="0.7" />

        {/* SL line */}
        <line x1="88" y1={slY} x2="258" y2={slY}
          stroke="#ef4444" strokeWidth="1.2" strokeDasharray="5 3" opacity="0.7" />

        {/* Entry level (short) */}
        <line x1="88" y1={entryY} x2={zoneX} y2={entryY}
          stroke="#71717a" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

        {/* Price path */}
        <path d={descent} stroke="#71717a" strokeWidth="1.8" strokeLinejoin="round" />
        <path d={rise}    stroke="#71717a" strokeWidth="1.8" strokeLinejoin="round" />

        {/* Entry dot */}
        <circle cx="110" cy={entryY} r="4.5" fill="#10b981" opacity="0.9" />

        {/* Arrow ENTRY→TP */}
        <line x1="120" y1={entryY - 2} x2="120" y2={tpY + 8}
          stroke="#10b981" strokeWidth="1.1" opacity="0.6" markerEnd="url(#tp-arr)" />

        {/* Arrow ENTRY→SL */}
        <line x1="132" y1={entryY + 2} x2="132" y2={slY - 8}
          stroke="#ef4444" strokeWidth="1.1" opacity="0.6" markerEnd="url(#sl-arr)" />

        {/* R/R badge — top right, above price path */}
        <rect x="182" y="8" width="78" height="16" rx="4"
          fill="#10b98118" stroke="#10b98140" strokeWidth="0.8" />
        <text x="221" y="19" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="700">R/R = 1:2 ✓</text>

        {/* ENTRÉE badge — top left */}
        <rect x="8" y="8" width="48" height="14" rx="3"
          fill="#10b98118" stroke="#10b98140" strokeWidth="0.8" />
        <text x="32" y="18" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="700">ENTRÉE</text>

        {/* TP badge — right of TP line */}
        <rect x="196" y={tpY - 8} width="58" height="13" rx="3"
          fill="#10b98114" stroke="#10b98138" strokeWidth="0.8" />
        <text x="225" y={tpY + 1} fontSize="7.5" fill="#10b981" textAnchor="middle" fontWeight="700">Take Profit</text>

        {/* SL badge — right of SL line */}
        <rect x="208" y={slY - 1} width="46" height="13" rx="3"
          fill="#ef444414" stroke="#ef444438" strokeWidth="0.8" />
        <text x="231" y={slY + 9} fontSize="7.5" fill="#ef4444" textAnchor="middle" fontWeight="700">Stop Loss</text>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">Entrée / Take Profit</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-[10px] text-zinc-500">Stop Loss</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-zinc-500" />
          <span className="text-[10px] text-zinc-500">Prix</span>
        </div>
      </div>
    </div>
  );
}

interface LiquidityPoolsDiagramProps {
  className?: string;
}

export function LiquidityPoolsDiagram({ className = "" }: LiquidityPoolsDiagramProps) {
  const BSL_Y = 24;   // buy-side liquidity line — red
  const SSL_Y = 128;  // sell-side liquidity line — emerald
  const EQH_Y = 34;   // equal highs level
  const EQL_Y = 118;  // equal lows level

  // Price path: two equal highs, two equal lows, stop hunt below SSL, then rally breaking BSL
  const pricePath =
    "M10,78 L34,34 L58,80 L82,35 L106,80 L128,118 L148,76 L164,118 L172,138 L192,104 L214,68 L236,34 L254,18 L262,24";

  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg
        width="100%"
        viewBox="0 0 268 152"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* SSL zone tint */}
        <rect x="0" y={SSL_Y - 2} width="268" height="6" fill="#10b98108" />
        {/* BSL zone tint */}
        <rect x="0" y={BSL_Y - 2} width="268" height="6" fill="#ef444408" />

        {/* SSL line */}
        <line x1="10" y1={SSL_Y} x2="258" y2={SSL_Y}
          stroke="#10b981" strokeWidth="1.3" strokeDasharray="5 3" opacity="0.7" />

        {/* BSL line */}
        <line x1="10" y1={BSL_Y} x2="258" y2={BSL_Y}
          stroke="#ef4444" strokeWidth="1.3" strokeDasharray="5 3" opacity="0.7" />

        {/* Price path */}
        <path d={pricePath} stroke="#71717a" strokeWidth="1.8" strokeLinejoin="round" />

        {/* Equal Highs dots (red) */}
        <circle cx="34" cy={EQH_Y} r="3" fill="#ef4444" opacity="0.85" />
        <circle cx="82" cy="35" r="3" fill="#ef4444" opacity="0.85" />
        {/* Horizontal alignment markers between EQH */}
        <line x1="34" y1={EQH_Y} x2="82" y2={EQH_Y}
          stroke="#ef4444" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.3" />

        {/* Equal Lows dots (emerald) */}
        <circle cx="128" cy={EQL_Y} r="3" fill="#10b981" opacity="0.85" />
        <circle cx="164" cy={EQL_Y} r="3" fill="#10b981" opacity="0.85" />
        {/* Horizontal alignment markers between EQL */}
        <line x1="128" y1={EQL_Y} x2="164" y2={EQL_Y}
          stroke="#10b981" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.3" />

        {/* Stop hunt spike circle */}
        <circle cx="172" cy="138" r="3.5" fill="#ef4444" opacity="0.9" />

        {/* BSL break circle */}
        <circle cx="254" cy="18" r="3.5" fill="#ef4444" opacity="0.9" />

        {/* BSL badge — top left, above price path */}
        <rect x="6" y="7" width="112" height="13" rx="3"
          fill="#ef444414" stroke="#ef444438" strokeWidth="0.8" />
        <text x="62" y="17" fontSize="7.5" fill="#ef4444" textAnchor="middle" fontWeight="700">
          Buy-side liquidity (BSL)
        </text>

        {/* SSL badge — bottom left, below price path */}
        <rect x="6" y="131" width="114" height="13" rx="3"
          fill="#10b98114" stroke="#10b98138" strokeWidth="0.8" />
        <text x="63" y="141" fontSize="7.5" fill="#10b981" textAnchor="middle" fontWeight="700">
          Sell-side liquidity (SSL)
        </text>

        {/* EQH label — between the two peaks, with opaque bg */}
        <rect x="44" y="22" width="28" height="10" rx="2"
          fill="#09090b" fillOpacity="0.85" />
        <text x="58" y="30" fontSize="7" fill="#ef4444" textAnchor="middle" fontWeight="600">EQH</text>

        {/* EQL label — between the two troughs, with opaque bg */}
        <rect x="126" y="107" width="28" height="10" rx="2"
          fill="#09090b" fillOpacity="0.85" />
        <text x="140" y="115" fontSize="7" fill="#10b981" textAnchor="middle" fontWeight="600">EQL</text>

        {/* Stop hunt annotation */}
        <rect x="178" y="133" width="48" height="11" rx="2"
          fill="#09090b" fillOpacity="0.9" />
        <text x="202" y="141" fontSize="6.5" fill="#71717a" textAnchor="middle" opacity="0.9">
          stop hunt
        </text>

        {/* BSL break annotation */}
        <rect x="188" y="7" width="68" height="13" rx="3"
          fill="#ef444418" stroke="#ef444438" strokeWidth="0.8" />
        <text x="222" y="17" fontSize="7.5" fill="#ef4444" textAnchor="middle" fontWeight="700">
          BSL pris ↑
        </text>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-[10px] text-zinc-500">Buy-side liquidity — stops au-dessus des EQH</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">Sell-side liquidity — stops sous les EQL</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-zinc-500" />
          <span className="text-[10px] text-zinc-500">Stop hunt = chasse de liquidité</span>
        </div>
      </div>
    </div>
  );
}

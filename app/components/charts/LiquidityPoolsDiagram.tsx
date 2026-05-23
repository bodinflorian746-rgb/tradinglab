interface LiquidityPoolsDiagramProps {
  className?: string;
  locale?: "fr" | "es";
}

export function LiquidityPoolsDiagram({ className = "", locale = "fr" }: LiquidityPoolsDiagramProps) {
  const t = locale === "es"
    ? {
        bslLabel: "Buy-side liquidity (BSL)",
        sslLabel: "Sell-side liquidity (SSL)",
        stopHunt: "stop hunt",
        bslTaken: "BSL tomada ↑",
        bslMobileDesc: " · stops de compra por encima de máximos iguales (EQH)",
        sslMobileDesc: " · stops de venta bajo mínimos iguales (EQL)",
        stopHuntMobileDesc: " · el precio baja a cazar los stops bajo el EQL antes de subir",
        bslTakenMobileDesc: " · luego ruptura de máximos para tomar la liquidez opuesta",
        leg1: "Buy-side liquidity — stops por encima de los EQH",
        leg2: "Sell-side liquidity — stops bajo los EQL",
        leg3: "Stop hunt = caza de liquidez",
      }
    : {
        bslLabel: "Buy-side liquidity (BSL)",
        sslLabel: "Sell-side liquidity (SSL)",
        stopHunt: "stop hunt",
        bslTaken: "BSL pris ↑",
        bslMobileDesc: " · stops d’achat au-dessus des sommets égaux (EQH)",
        sslMobileDesc: " · stops de vente sous les creux égaux (EQL)",
        stopHuntMobileDesc: " · le prix descend chasser les stops sous l’EQL avant de repartir",
        bslTakenMobileDesc: " · puis cassure des sommets pour prendre la liquidité opposée",
        leg1: "Buy-side liquidity — stops au-dessus des EQH",
        leg2: "Sell-side liquidity — stops sous les EQL",
        leg3: "Stop hunt = chasse de liquidité",
      };
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
        <style>{`@media (max-width: 640px) { .chart-detail-labels { display: none; } }`}</style>

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

        {/* Badges textuels — masqués sur mobile */}
        <g className="chart-detail-labels">
          <rect x="6" y="7" width="112" height="13" rx="3"
            fill="#ef444414" stroke="#ef444438" strokeWidth="0.8" />
          <text x="62" y="17" fontSize="7.5" fill="#ef4444" textAnchor="middle" fontWeight="700">
            {t.bslLabel}
          </text>

          <rect x="6" y="131" width="114" height="13" rx="3"
            fill="#10b98114" stroke="#10b98138" strokeWidth="0.8" />
          <text x="63" y="141" fontSize="7.5" fill="#10b981" textAnchor="middle" fontWeight="700">
            {t.sslLabel}
          </text>

          <rect x="44" y="22" width="28" height="10" rx="2"
            fill="#09090b" fillOpacity="0.85" />
          <text x="58" y="30" fontSize="7" fill="#ef4444" textAnchor="middle" fontWeight="600">EQH</text>

          <rect x="126" y="107" width="28" height="10" rx="2"
            fill="#09090b" fillOpacity="0.85" />
          <text x="140" y="115" fontSize="7" fill="#10b981" textAnchor="middle" fontWeight="600">EQL</text>

          <rect x="178" y="133" width="48" height="11" rx="2"
            fill="#09090b" fillOpacity="0.9" />
          <text x="202" y="141" fontSize="6.5" fill="#71717a" textAnchor="middle" opacity="0.9">
            {t.stopHunt}
          </text>

          <rect x="188" y="7" width="68" height="13" rx="3"
            fill="#ef444418" stroke="#ef444438" strokeWidth="0.8" />
          <text x="222" y="17" fontSize="7.5" fill="#ef4444" textAnchor="middle" fontWeight="700">
            {t.bslTaken}
          </text>
        </g>
      </svg>

      {/* Mobile : key card */}
      <div className="sm:hidden px-4 py-3 border-t border-zinc-800/60 space-y-2">
        <ul className="space-y-1.5 text-[13px] leading-snug">
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-3 h-1 rounded-sm bg-red-400 mt-2" />
            <span className="text-white">
              <span className="font-bold text-red-400">BSL (Buy-Side Liquidity)</span>
              <span className="text-zinc-300">{t.bslMobileDesc}</span>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-3 h-1 rounded-sm bg-emerald-400 mt-2" />
            <span className="text-white">
              <span className="font-bold text-emerald-400">SSL (Sell-Side Liquidity)</span>
              <span className="text-zinc-300">{t.sslMobileDesc}</span>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-red-500 mt-1" />
            <span className="text-white">
              <span className="font-bold text-red-400">Stop hunt</span>
              <span className="text-zinc-300">{t.stopHuntMobileDesc}</span>
            </span>
          </li>
          <li className="flex items-start gap-2 pt-1 border-t border-zinc-800/50">
            <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-red-500 mt-1" />
            <span className="text-white">
              <span className="font-bold text-red-400">{t.bslTaken}</span>
              <span className="text-zinc-300">{t.bslTakenMobileDesc}</span>
            </span>
          </li>
        </ul>
      </div>

      {/* Desktop legend (inchangée) */}
      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-[10px] text-zinc-500">{t.leg1}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">{t.leg2}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-zinc-500" />
          <span className="text-[10px] text-zinc-500">{t.leg3}</span>
        </div>
      </div>
    </div>
  );
}

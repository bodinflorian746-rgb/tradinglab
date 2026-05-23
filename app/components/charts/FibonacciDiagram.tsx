interface FibonacciDiagramProps {
  className?: string;
  locale?: "fr" | "es";
}

export function FibonacciDiagram({ className = "", locale = "fr" }: FibonacciDiagramProps) {
  const T = locale === "es"
    ? {
        swingLow: "Swing Low",
        swingHigh: "Swing High",
        impulsif: "impulsivo ↑",
        mobTitle: "Retracement Fibonacci sobre la impulsión ↑",
        mobOte: "Zona OTE (61.8% – 78.6%)",
        mobOteDesc: " · zona privilegiada para entrar en el sentido de la tendencia",
        mobRebond: "Rebote del precio en la zona OTE → reanudación de la impulsión",
        legendImpulsif: "Movimiento impulsivo",
        legendOte: "Zona OTE (61.8–78.6%)",
        legendRetracement: "Retracement",
      }
    : {
        swingLow: "Swing Low",
        swingHigh: "Swing High",
        impulsif: "impulsif ↑",
        mobTitle: "Retracement Fibonacci sur l'impulsion ↑",
        mobOte: "Zone OTE (61.8% – 78.6%)",
        mobOteDesc: " · zone privilégiée pour entrer dans le sens de la tendance",
        mobRebond: "Rebond du prix dans la zone OTE → reprise de l'impulsion",
        legendImpulsif: "Mouvement impulsif",
        legendOte: "Zone OTE (61.8–78.6%)",
        legendRetracement: "Retracement",
      };
  // Swing low at (10,136), swing high at (102,16) — range 120px
  const swingLowY  = 136;
  const swingHighY = 16;
  const range      = swingLowY - swingHighY; // 120

  const levels = [
    { pct: 23.6, label: "23.6%", color: "#52525b", dash: "4 3", width: 0.9 },
    { pct: 38.2, label: "38.2%", color: "#71717a", dash: "5 3", width: 1.0 },
    { pct: 50.0, label: "50.0%", color: "#a1a1aa", dash: "5 3", width: 1.1 },
    { pct: 61.8, label: "61.8%", color: "#60a5fa", dash: "6 3", width: 1.3 },
    { pct: 78.6, label: "78.6%", color: "#60a5fa", dash: "6 3", width: 1.3 },
  ];

  // y for each level (fib measures retracement from swing high down)
  const levelY = (pct: number) => swingHighY + (pct / 100) * range;

  const oteTopY = levelY(61.8);  // 90.16 ≈ 90
  const oteBotY = levelY(78.6);  // 110.32 ≈ 110

  // Impulse path: swing low → swing high (left panel, x=10–102)
  const impulsePath = "M10,136 L30,114 L55,88 L78,56 L102,16";

  // Retracement path: from swing high rightward, dips into OTE zone then bounces
  // [102,16]→[128,40]→[148,62]→[164,78]→[178,90]→[188,100]→[196,107]→[208,94]→[224,76]→[248,52]
  const retracePath = "M102,16 L124,40 L146,62 L162,76 L176,90 L186,100 L196,108 L208,96 L226,76 L248,52";

  // Lines span right of swing high (x=106 to x=258)
  const lineX1 = 106;
  const lineX2 = 258;

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

        {/* Divider between impulse and retracement */}
        <line x1="104" y1="8" x2="104" y2="144" stroke="#27272a" strokeWidth="0.8" />

        {/* OTE zone (61.8–78.6%) */}
        <rect x={lineX1} y={oteTopY} width={lineX2 - lineX1} height={oteBotY - oteTopY}
          fill="#60a5fa0c" stroke="#60a5fa30" strokeWidth="0.8" rx="1" />

        {/* OTE badge — masqué sur mobile */}
        <g className="chart-detail-labels">
          <rect x="108" y={oteTopY + 2} width="24" height="12" rx="2"
            fill="#60a5fa18" stroke="#60a5fa40" strokeWidth="0.6" />
          <text x="120" y={oteTopY + 11} fontSize="7" fill="#60a5fa" textAnchor="middle" fontWeight="700">OTE</text>
        </g>

        {/* Fibonacci level lines */}
        {levels.map((lvl) => {
          const y = levelY(lvl.pct);
          return (
            <line
              key={lvl.pct}
              x1={lineX1} y1={y} x2={lineX2} y2={y}
              stroke={lvl.color} strokeWidth={lvl.width}
              strokeDasharray={lvl.dash} opacity="0.75"
            />
          );
        })}

        {/* Level labels — masqués sur mobile (5 labels 6.5px sont illisibles) */}
        <g className="chart-detail-labels">
          {levels.map((lvl) => {
            const y = levelY(lvl.pct);
            return (
              <g key={lvl.pct}>
                <rect x="229" y={y - 16} width="30" height="18" rx="2"
                  fill="#09090b" fillOpacity="0.85" />
                <text x="255" y={y - 2} fontSize="6.5"
                  fill={lvl.color} textAnchor="end" fontWeight="600" opacity="0.9">
                  {lvl.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* Impulse path (left of divider) */}
        <path d={impulsePath} stroke="#10b981" strokeWidth="2" strokeLinejoin="round" />

        {/* Retracement path (right of divider) */}
        <path d={retracePath} stroke="#71717a" strokeWidth="1.6" strokeLinejoin="round" />

        {/* Swing dots — toujours visibles */}
        <circle cx="10" cy={swingLowY} r="3.5" fill="#71717a" opacity="0.8" />
        <circle cx="102" cy={swingHighY} r="3.5" fill="#71717a" opacity="0.8" />
        <circle cx="196" cy="108" r="4" fill="#10b981" opacity="0.85" />

        {/* Labels textuels — masqués sur mobile */}
        <g className="chart-detail-labels">
          <text x="28" y={swingLowY - 10} fontSize="7" fill="#71717a" fontWeight="600">{T.swingLow}</text>
          <text x="120" y={swingHighY + 14} fontSize="6.5" fill="#71717a" fontWeight="600" opacity="0.8">{T.swingHigh}</text>
          <text x="56" y="44" fontSize="7.5" fill="#10b981" textAnchor="middle" opacity="0.6" fontWeight="600">{T.impulsif}</text>
        </g>
      </svg>

      {/* Mobile : key card avec les niveaux Fibonacci */}
      <div className="sm:hidden px-4 py-3 border-t border-zinc-800/60 space-y-2">
        <p className="text-[13px] font-bold text-blue-400">{T.mobTitle}</p>
        <div className="grid grid-cols-5 gap-1 text-center">
          {levels.map((lvl) => (
            <div key={lvl.pct} className={`rounded-md border p-1.5 ${
              lvl.pct === 61.8 || lvl.pct === 78.6
                ? "border-blue-400/40 bg-blue-500/10"
                : "border-zinc-700 bg-zinc-900/40"
            }`}>
              <p className="text-[11px] font-bold font-mono leading-tight" style={{ color: lvl.color }}>
                {lvl.label}
              </p>
            </div>
          ))}
        </div>
        <ul className="space-y-1.5 text-[13px] leading-snug pt-1">
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-2.5 h-2.5 rounded-sm bg-blue-500/30 border border-blue-400 mt-1" />
            <span className="text-white">
              <span className="font-bold text-blue-400">{T.mobOte}</span>
              <span className="text-zinc-300">{T.mobOteDesc}</span>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1" />
            <span className="text-zinc-300">{T.mobRebond}</span>
          </li>
        </ul>
      </div>

      {/* Desktop legend (inchangée) */}
      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">{T.legendImpulsif}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-[10px] text-zinc-500">{T.legendOte}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-zinc-500" />
          <span className="text-[10px] text-zinc-500">{T.legendRetracement}</span>
        </div>
      </div>
    </div>
  );
}

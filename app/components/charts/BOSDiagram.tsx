interface BOSDiagramProps {
  trend?: "bullish" | "bearish";
  className?: string;
}

export function BOSDiagram({
  trend = "bullish",
  className = "",
}: BOSDiagramProps) {
  const isBull = trend === "bullish";
  const accent = isBull ? "#10b981" : "#ef4444";
  const accentFill = isBull ? "#10b98112" : "#ef444412";
  const accentStroke = isBull ? "#10b98135" : "#ef444435";

  // Bullish BOS: price breaks above the last HH
  const bullPts: [number, number][] = [
    [14, 130],  // départ
    [50, 113],  // HL1
    [90, 70],   // HH1 — niveau BOS
    [134, 95],  // HL2
    [180, 50],  // cassure BOS
    [248, 38],  // continuation
  ];

  // Bearish BOS: price breaks below the last LL
  const bearPts: [number, number][] = [
    [14, 28],   // départ
    [50, 45],   // LH1
    [90, 88],   // LL1 — niveau BOS
    [134, 65],  // LH2
    [180, 108], // cassure BOS
    [248, 120], // continuation
  ];

  const pts = isBull ? bullPts : bearPts;

  // y du niveau BOS (point index 2) et du point de cassure (index 4)
  const bosY = pts[2][1];
  const [bosBreakX, bosBreakY] = pts[4];

  const setupPath = pts.slice(0, 5).map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const contPath = `M${pts[4][0]},${pts[4][1]} L${pts[5][0]},${pts[5][1]}`;

  // Zone rect entre le niveau BOS et le point de cassure
  const zoneX = pts[2][0];
  const zoneWidth = bosBreakX - zoneX;
  const zoneTop = isBull ? bosBreakY : bosY;
  const zoneHeight = isBull ? bosY - bosBreakY : bosBreakY - bosY;

  // Badge "HH"/"LL" au niveau BOS (point 2)
  const [bosPtX, bosPtY] = pts[2];
  const bosPtAbove = isBull; // HH → au-dessus; LL → en dessous
  const bosBadgeY = bosPtAbove ? bosPtY - 18 : bosPtY + 8;

  // Badge "BOS ↑"/"BOS ↓" au point de cassure (point 4)
  const bosLabelAbove = isBull; // flèche haussière → badge au-dessus de la cassure
  const bosLabelY = bosLabelAbove ? bosBreakY - 20 : bosBreakY + 10;

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

        {/* Zone de réaction au niveau BOS */}
        <rect
          x={zoneX} y={zoneTop}
          width={zoneWidth} height={zoneHeight}
          fill={accentFill}
        />

        {/* Ligne pointillée au niveau BOS */}
        <line
          x1={pts[2][0]} y1={bosY}
          x2={248} y2={bosY}
          stroke={accent} strokeWidth="1.2"
          strokeDasharray="5 3"
          opacity="0.6"
        />

        {/* Chemin du prix (setup + continuation) */}
        <path d={setupPath} stroke={accent} strokeWidth="2" strokeLinejoin="round" />
        <path d={contPath} stroke={accent} strokeWidth="2" strokeLinejoin="round" />

        {/* Point de départ */}
        <circle cx={pts[0][0]} cy={pts[0][1]} r="2.5" fill="#52525b" />

        {/* Points intermédiaires */}
        {[1, 3].map((idx) => (
          <circle key={idx} cx={pts[idx][0]} cy={pts[idx][1]} r="2.5" fill={accent} opacity="0.45" />
        ))}

        {/* Cercles toujours visibles (mobile inclus) */}
        <circle cx={bosPtX} cy={bosPtY} r="3.5" fill={accent} opacity="0.9" />
        <circle cx={bosBreakX} cy={bosBreakY} r="4" fill={accent} opacity="0.9" />

        {/* Badges textuels — masqués sur mobile */}
        <g className="chart-detail-labels">
          {/* Badge HH / LL au point BOS */}
          <rect
            x={bosPtX - 10} y={bosBadgeY} width="20" height="13"
            rx="3"
            fill={accentFill} stroke={accentStroke} strokeWidth="0.8"
          />
          <text x={bosPtX} y={bosBadgeY + 9} fontSize="8" fill={accent} textAnchor="middle" fontWeight="700">
            {isBull ? "HH" : "LL"}
          </text>

          {/* Badge BOS au point de cassure */}
          <rect
            x={bosBreakX - 18} y={bosLabelY} width="36" height="14"
            rx="3"
            fill={accent} opacity="0.18"
            stroke={accentStroke} strokeWidth="0.8"
          />
          <rect
            x={bosBreakX - 18} y={bosLabelY} width="36" height="14"
            rx="3"
            fill="none"
            stroke={accentStroke} strokeWidth="0.8"
          />
          <text x={bosBreakX} y={bosLabelY + 10} fontSize="8.5" fill={accent} textAnchor="middle" fontWeight="800">
            {isBull ? "BOS ↑" : "BOS ↓"}
          </text>
        </g>

        {/* Flèche directionnelle */}
        <text
          x="252" y={isBull ? 22 : 144}
          fontSize="14" fill={accent} opacity="0.35"
          textAnchor="middle"
        >
          {isBull ? "↗" : "↘"}
        </text>
      </svg>

      {/* Mobile : key card */}
      <div className="sm:hidden px-4 py-3 border-t border-zinc-800/60 space-y-2">
        <p className="text-[12px] font-bold uppercase tracking-wide" style={{ color: accent }}>
          BOS — {isBull ? "Break of Structure haussier" : "Break of Structure baissier"}
        </p>
        <ul className="space-y-1.5 text-[13px] leading-snug">
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-2 h-2 rounded-full mt-1.5" style={{ background: accent }} />
            <span className="text-white">
              <span className="font-bold" style={{ color: accent }}>{isBull ? "HH" : "LL"}</span>
              <span className="text-zinc-300"> · dernier {isBull ? "sommet structurel" : "creux structurel"} avant la cassure</span>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-2 h-2 rounded-full mt-1.5" style={{ background: accent }} />
            <span className="text-white">
              <span className="font-bold" style={{ color: accent }}>{isBull ? "BOS ↑" : "BOS ↓"}</span>
              <span className="text-zinc-300"> · le prix casse ce niveau → confirmation de tendance</span>
            </span>
          </li>
        </ul>
      </div>

      {/* Desktop legend (inchangée) */}
      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: accent }} />
          <span className="text-[10px] text-zinc-500">
            {isBull ? "HH = dernier Higher High (niveau BOS)" : "LL = dernier Lower Low (niveau BOS)"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="18" height="6" viewBox="0 0 18 6">
            <line x1="0" y1="3" x2="18" y2="3" stroke={accent} strokeWidth="1.5" strokeDasharray="4 2.5" opacity="0.7" />
          </svg>
          <span className="text-[10px] text-zinc-500">Break of Structure — confirmation de tendance</span>
        </div>
      </div>
    </div>
  );
}

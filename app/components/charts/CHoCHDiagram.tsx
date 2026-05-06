interface CHoCHDiagramProps {
  trend?: "bullish" | "bearish";
  className?: string;
}

export function CHoCHDiagram({
  trend = "bullish",
  className = "",
}: CHoCHDiagramProps) {
  const isBull = trend === "bullish";

  // trendColor = couleur de la tendance initiale; chochColor = couleur du retournement
  const trendColor = isBull ? "#10b981" : "#ef4444";
  const chochColor = isBull ? "#ef4444" : "#10b981";
  const trendFill = isBull ? "#10b98112" : "#ef444412";
  const trendStroke = isBull ? "#10b98135" : "#ef444435";
  const chochFill = isBull ? "#ef444412" : "#10b98112";
  const chochStroke = isBull ? "#ef444435" : "#10b98135";

  // Bullish trend qui se retourne : setup haussier → HL cassé (CHoCH)
  const bullPts: [number, number][] = [
    [14, 130],  // départ
    [52, 112],  // HL1
    [90, 72],   // HH1
    [132, 96],  // HL2 — niveau CHoCH (ce HL sera cassé)
    [174, 52],  // HH2
    [210, 80],  // HL3 (dernier creux avant la cassure)
    [242, 116], // cassure CHoCH — casse sous HL2
  ];

  // Bearish trend qui se retourne : setup baissier → LH cassé (CHoCH)
  const bearPts: [number, number][] = [
    [14, 28],   // départ
    [52, 48],   // LH1
    [90, 88],   // LL1
    [132, 65],  // LH2 — niveau CHoCH (ce LH sera cassé)
    [174, 108], // LL2
    [212, 82],  // LH3 (dernier sommet avant la cassure)
    [242, 48],  // cassure CHoCH — casse au-dessus de LH2
  ];

  const pts = isBull ? bullPts : bearPts;

  // Chemin setup (tendance initiale) — points 0→5
  const setupPath = pts.slice(0, 6).map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  // Chemin de retournement (CHoCH) — points 5→6, couleur opposée
  const breakPath = `M${pts[5][0]},${pts[5][1]} L${pts[6][0]},${pts[6][1]}`;

  // Niveau CHoCH : index 3 (HL2 pour bull, LH2 pour bear)
  const [chochPtX, chochPtY] = pts[3];
  const [breakX, breakY] = pts[6];

  // Ligne pointillée au niveau CHoCH
  const chochY = chochPtY;

  // Badge du niveau (HL2 / LH2) — au-dessus si c'est un creux haussier, en dessous si sommet baissier
  const levelBadgeAbove = !isBull; // HL2 (bull) = creux → badge en dessous; LH2 (bear) = sommet → badge au-dessus
  const levelBadgeY = levelBadgeAbove ? chochPtY - 18 : chochPtY + 8;

  // Badge CHoCH au point de cassure — au-dessus si chute (bull retournement ↓), en dessous si hausse (bear retournement ↑)
  const chochBadgeAbove = !isBull;
  const chochBadgeY = chochBadgeAbove ? breakY - 20 : breakY + 10;

  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg
        width="100%"
        viewBox="0 0 268 152"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Zone entre le niveau CHoCH et le point de cassure */}
        {(() => {
          const zoneX = chochPtX;
          const zoneW = breakX - chochPtX;
          const zoneTop = isBull ? breakY : chochY;
          const zoneH = isBull ? chochY - breakY : breakY - chochY;
          return (
            <rect
              x={zoneX} y={zoneTop}
              width={zoneW} height={zoneH}
              fill={chochFill}
            />
          );
        })()}

        {/* Ligne pointillée au niveau CHoCH */}
        <line
          x1={chochPtX} y1={chochY}
          x2={248} y2={chochY}
          stroke={chochColor} strokeWidth="1.2"
          strokeDasharray="5 3"
          opacity="0.6"
        />

        {/* Chemin setup (tendance initiale) */}
        <path d={setupPath} stroke={trendColor} strokeWidth="2" strokeLinejoin="round" />

        {/* Chemin CHoCH (retournement) */}
        <path d={breakPath} stroke={chochColor} strokeWidth="2.5" strokeLinejoin="round" />

        {/* Point de départ */}
        <circle cx={pts[0][0]} cy={pts[0][1]} r="2.5" fill="#52525b" />

        {/* Points intermédiaires du setup */}
        {[1, 2, 4, 5].map((idx) => (
          <circle key={idx} cx={pts[idx][0]} cy={pts[idx][1]} r="2.5" fill={trendColor} opacity="0.4" />
        ))}

        {/* Badge du niveau CHoCH (HL2 ou LH2) */}
        <circle cx={chochPtX} cy={chochPtY} r="3.5" fill={chochColor} opacity="0.9" />
        <rect
          x={chochPtX - 13} y={levelBadgeY} width="26" height="13"
          rx="3"
          fill={chochFill} stroke={chochStroke} strokeWidth="0.8"
        />
        <text x={chochPtX} y={levelBadgeY + 9} fontSize="8" fill={chochColor} textAnchor="middle" fontWeight="700">
          {isBull ? "HL2" : "LH2"}
        </text>

        {/* Badge CHoCH au point de cassure */}
        <circle cx={breakX} cy={breakY} r="4" fill={chochColor} opacity="0.9" />
        <rect
          x={breakX - 23} y={chochBadgeY} width="46" height="14"
          rx="3"
          fill={chochColor} opacity="0.18"
          stroke={chochStroke} strokeWidth="0.8"
        />
        <rect
          x={breakX - 23} y={chochBadgeY} width="46" height="14"
          rx="3"
          fill="none"
          stroke={chochStroke} strokeWidth="0.8"
        />
        <text x={breakX} y={chochBadgeY + 10} fontSize="8.5" fill={chochColor} textAnchor="middle" fontWeight="800">
          {isBull ? "CHoCH ↓" : "CHoCH ↑"}
        </text>
      </svg>

      {/* Légende */}
      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: trendColor }} />
          <span className="text-[10px] text-zinc-500">
            {isBull ? "Structure haussière (HH/HL)" : "Structure baissière (LH/LL)"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: chochColor }} />
          <span className="text-[10px] text-zinc-500">CHoCH — 1er signal de retournement</span>
        </div>
      </div>
    </div>
  );
}

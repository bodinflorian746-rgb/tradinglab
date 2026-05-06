// Diagramme : Structure de marché (HH/HL ou LH/LL)
// Affiche la séquence de sommets et creux qui définit une tendance

interface MarketStructureDiagramProps {
  trend?: "bullish" | "bearish";
  className?: string;
}

export function MarketStructureDiagram({
  trend = "bullish",
  className = "",
}: MarketStructureDiagramProps) {
  const isBull = trend === "bullish";
  const accent = isBull ? "#10b981" : "#ef4444";
  const accentFill = isBull ? "#10b98112" : "#ef444412";
  const accentStroke = isBull ? "#10b98135" : "#ef444435";

  // Coordonnées de la structure haussière : HL → HH → HL → HH → HL
  const bullPts: [number, number][] = [
    [14, 130], // départ
    [55, 114], // HL1
    [95, 70],  // HH1
    [142, 92], // HL2
    [190, 42], // HH2
    [240, 66], // HL3
  ];

  // Coordonnées de la structure baissière : LH → LL → LH → LL → LH
  const bearPts: [number, number][] = [
    [14, 32],   // départ
    [55, 52],   // LH1
    [95, 92],   // LL1
    [142, 72],  // LH2
    [190, 118], // LL2
    [240, 96],  // LH3
  ];

  const pts = isBull ? bullPts : bearPts;
  const path = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");

  // Labels des points clés : indique si le badge est au-dessus ou en dessous du point
  const bullLabels: { i: number; text: string; above: boolean }[] = [
    { i: 1, text: "HL1", above: false }, // creux → badge en dessous
    { i: 2, text: "HH1", above: true },  // sommet → badge au-dessus
    { i: 3, text: "HL2", above: false },
    { i: 4, text: "HH2", above: true },
    { i: 5, text: "HL3", above: false },
  ];

  const bearLabels: { i: number; text: string; above: boolean }[] = [
    { i: 1, text: "LH1", above: true },  // sommet baissier → badge au-dessus
    { i: 2, text: "LL1", above: false }, // creux → badge en dessous
    { i: 3, text: "LH2", above: true },
    { i: 4, text: "LL2", above: false },
    { i: 5, text: "LH3", above: true },
  ];

  const labels = isBull ? bullLabels : bearLabels;

  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg
        width="100%"
        viewBox="0 0 268 152"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ligne de prix */}
        <path d={path} stroke={accent} strokeWidth="2" strokeLinejoin="round" />

        {/* Point de départ (neutre) */}
        <circle cx={pts[0][0]} cy={pts[0][1]} r="2.5" fill="#52525b" />

        {/* Badges sur chaque sommet et creux clé */}
        {labels.map(({ i, text, above }) => {
          const [x, y] = pts[i];
          // above=true → badge au-dessus du point (y plus faible en SVG = plus haut à l'écran)
          const by = above ? y - 18 : y + 8;
          return (
            <g key={text}>
              <circle cx={x} cy={y} r="3.5" fill={accent} opacity="0.9" />
              <rect
                x={x - 13} y={by} width="26" height="13"
                rx="3"
                fill={accentFill} stroke={accentStroke} strokeWidth="0.8"
              />
              <text
                x={x} y={by + 9}
                fontSize="8" fill={accent} textAnchor="middle" fontWeight="700"
              >
                {text}
              </text>
            </g>
          );
        })}

        {/* Flèche directionnelle en coin pour indiquer la tendance */}
        <text
          x="252" y={isBull ? 22 : 144}
          fontSize="14" fill={accent} opacity="0.35"
          textAnchor="middle"
        >
          {isBull ? "↗" : "↘"}
        </text>
      </svg>

      {/* Légende */}
      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: accent }} />
          <span className="text-[10px] text-zinc-500">
            {isBull ? "HH = Higher High (sommet plus haut)" : "LH = Lower High (sommet plus bas)"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: accent }} />
          <span className="text-[10px] text-zinc-500">
            {isBull ? "HL = Higher Low (creux plus haut)" : "LL = Lower Low (creux plus bas)"}
          </span>
        </div>
      </div>
    </div>
  );
}

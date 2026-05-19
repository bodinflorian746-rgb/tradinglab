// Diagramme : essoufflement du régime risk-off (Leçon 3 Macro Trading)
// XAU/USD H4 — forte tendance bullish initiale depuis 4 590 $, puis sommets de moins en moins
// agressifs sous 4 740 $, corrections de plus en plus profondes, impulsions qui faiblissent.

interface RiskoffExhaustionDiagramProps {
  className?: string;
}

type CandleSpec = {
  cx: number;
  wickTop: number;
  bodyY: number;
  bodyH: number;
  wickBottom: number;
  type: "bull" | "bear";
};

// Continuité prix. 4 740 $ résistance ≈ y=50, 4 735 $ sommets ≈ y=55, 4 590 $ ≈ y=230.
// 14 bougies, espacement régulier ~44 px de x=50 à x=620.
const CANDLES: CandleSpec[] = [
  // Continuité prix : open de chaque bougie = close de la précédente.
  // Bull : open = bodyY+bodyH (bas), close = bodyY (haut). Bear : open = bodyY (haut), close = bodyY+bodyH (bas).

  // Phase 1 — forte tendance bullish initiale (4 bougies vertes)
  { cx:  50, wickTop: 215, bodyY: 220, bodyH: 30, wickBottom: 255, type: "bull" }, // open 250 close 220
  { cx:  94, wickTop: 180, bodyY: 185, bodyH: 35, wickBottom: 222, type: "bull" }, // open 220 close 185
  { cx: 138, wickTop: 135, bodyY: 140, bodyH: 45, wickBottom: 188, type: "bull" }, // open 185 close 140
  { cx: 182, wickTop:  95, bodyY: 100, bodyH: 40, wickBottom: 142, type: "bull" }, // open 140 close 100

  // 1er sommet — mèche à wickTop=55
  { cx: 226, wickTop:  55, bodyY:  70, bodyH: 30, wickBottom: 105, type: "bull" }, // open 100 close 70

  // 1re correction H4
  { cx: 270, wickTop:  68, bodyY:  70, bodyH: 40, wickBottom: 115, type: "bear" }, // open 70 close 110
  { cx: 314, wickTop: 108, bodyY: 110, bodyH: 30, wickBottom: 145, type: "bear" }, // open 110 close 140

  // Rebond + 2e sommet (wickTop=62, plus faible que 55)
  { cx: 358, wickTop: 100, bodyY: 105, bodyH: 35, wickBottom: 145, type: "bull" }, // open 140 close 105
  { cx: 402, wickTop:  62, bodyY:  80, bodyH: 25, wickBottom: 110, type: "bull" }, // open 105 close 80

  // 2e correction plus profonde
  { cx: 446, wickTop:  76, bodyY:  80, bodyH: 50, wickBottom: 138, type: "bear" }, // open 80 close 130
  { cx: 490, wickTop: 126, bodyY: 130, bodyH: 35, wickBottom: 170, type: "bear" }, // open 130 close 165

  // Rebond + 3e sommet (wickTop=75, encore plus faible)
  { cx: 534, wickTop: 130, bodyY: 135, bodyH: 30, wickBottom: 172, type: "bull" }, // open 165 close 135
  { cx: 578, wickTop:  75, bodyY: 110, bodyH: 25, wickBottom: 140, type: "bull" }, // open 135 close 110

  // Début de cassure baissière
  { cx: 620, wickTop: 105, bodyY: 110, bodyH: 40, wickBottom: 155, type: "bear" }, // open 110 close 150
];

const BODY_W = 12;

export function RiskoffExhaustionDiagram({ className = "" }: RiskoffExhaustionDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">XAU/USD · H4</text>

        {/* Ligne de résistance 4 740 $ */}
        <line x1="40" y1="50" x2="660" y2="50" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="5 3" strokeOpacity="0.8" />
        <rect x="592" y="38" width="62" height="13" rx="3" fill="#09090b" />
        <text x="623" y="48" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">4 740 $</text>

        {/* Bougies */}
        {CANDLES.map(({ cx, wickTop, bodyY, bodyH, wickBottom, type }, i) => {
          const bodyFill = type === "bull" ? "#10b981" : "#ef4444";
          const wickStroke = type === "bull" ? "#059669" : "#b91c1c";
          return (
            <g key={i}>
              <line x1={cx} y1={wickTop} x2={cx} y2={wickBottom} stroke={wickStroke} strokeWidth="1.4" strokeLinecap="round" />
              <rect x={cx - BODY_W / 2} y={bodyY} width={BODY_W} height={bodyH} fill={bodyFill} stroke={wickStroke} strokeWidth="1" rx="1" />
            </g>
          );
        })}

        {/* Label "4 590 $" — départ */}
        <rect x="6" y="252" width="58" height="13" rx="3" fill="#09090b" />
        <text x="35" y="262" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">4 590 $</text>

        {/* Annotation amber */}
        <rect x="170" y="290" width="360" height="22" rx="11" fill="#09090b" />
        <rect x="170" y="290" width="360" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="304" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          Le régime perd progressivement en force
        </text>
      </svg>

      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">Tendance bullish forte au départ</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">Sommets plus faibles + corrections plus profondes = essoufflement</span>
        </div>
      </div>
    </div>
  );
}

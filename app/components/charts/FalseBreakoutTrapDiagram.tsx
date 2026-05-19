// Diagramme : piège de fausse cassure (Leçon 1 ICT)
// XAU/USD M15 — cassure visible au-dessus d'une résistance, marqueur d'entrées breakout, puis
// réintégration sous la ligne et continuation baissière franche.

interface FalseBreakoutTrapDiagramProps {
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

const CANDLES: CandleSpec[] = [
  // Approche haussière
  { cx:  80, wickTop: 195, bodyY: 200, bodyH: 30, wickBottom: 235, type: "bull" },
  { cx: 130, wickTop: 155, bodyY: 160, bodyH: 40, wickBottom: 205, type: "bull" },
  { cx: 180, wickTop: 115, bodyY: 120, bodyH: 40, wickBottom: 165, type: "bull" },
  // Cassure 1 — le corps traverse au-dessus de y=80
  { cx: 230, wickTop:  60, bodyY:  65, bodyH: 35, wickBottom: 110, type: "bull" },
  // Cassure 2 — sommet à y≈45 (label "4 695 $")
  { cx: 280, wickTop:  45, bodyY:  55, bodyH: 22, wickBottom:  82, type: "bull" },
  // Réintégration — bougie baissière qui repasse sous la ligne
  { cx: 330, wickTop:  58, bodyY:  62, bodyH: 42, wickBottom: 110, type: "bear" },
  // Continuation baissière
  { cx: 380, wickTop: 102, bodyY: 105, bodyH: 42, wickBottom: 152, type: "bear" },
  { cx: 430, wickTop: 144, bodyY: 148, bodyH: 38, wickBottom: 192, type: "bear" },
  { cx: 480, wickTop: 182, bodyY: 186, bodyH: 32, wickBottom: 222, type: "bear" },
  { cx: 530, wickTop: 214, bodyY: 218, bodyH: 22, wickBottom: 245, type: "bear" },
  { cx: 580, wickTop: 235, bodyY: 240, bodyH: 8,  wickBottom: 252, type: "bear" },
];

const BODY_W = 12;

export function FalseBreakoutTrapDiagram({ className = "" }: FalseBreakoutTrapDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">XAU/USD · M15</text>

        {/* Ligne résistance */}
        <line x1="60" y1="80" x2="620" y2="80" stroke="#ef4444" strokeWidth="1.3" strokeDasharray="5 3" strokeOpacity="0.85" />
        <rect x="486" y="68" width="124" height="13" rx="3" fill="#09090b" />
        <text x="548" y="78" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">Résistance 4 680 $</text>

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

        {/* Label "4 695 $" au sommet de la cassure */}
        <rect x="208" y="30" width="64" height="13" rx="3" fill="#09090b" />
        <text x="240" y="40" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">4 695 $</text>
        <line x1="272" y1="42" x2="280" y2="45" stroke="#71717a" strokeWidth="0.9" strokeOpacity="0.7" />

        {/* Marqueur "entrées breakout" — petit cercle zinc-500 + label */}
        <circle cx="280" cy="78" r="4" fill="#71717a" stroke="#09090b" strokeWidth="1.2" />
        <rect x="296" y="71" width="96" height="13" rx="3" fill="#09090b" />
        <text x="344" y="81" fill="#a1a1aa" fontSize="9" fontWeight="600" textAnchor="middle">Entrées breakout</text>

        {/* Label "4 650 $" en bas */}
        <rect x="540" y="258" width="64" height="13" rx="3" fill="#09090b" />
        <text x="572" y="268" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">4 650 $</text>

        {/* Annotation */}
        <rect x="170" y="284" width="360" height="22" rx="11" fill="#09090b" />
        <rect x="170" y="284" width="360" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="298" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          Cassure visible ≠ continuation réelle
        </text>
      </svg>

      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">Cassure non tenue au-dessus de la résistance</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">Réintégration sous le niveau = piège</span>
        </div>
      </div>
    </div>
  );
}

// Diagramme : réaction après sweep (Leçon 1 ICT)
// EUR/USD M15 — sweep d'une résistance, réintégration immédiate, bougie baissière impulsive,
// puis déplacement agressif vers le bas.

interface PostSweepReactionDiagramProps {
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
  // Approche
  { cx:  80, wickTop: 195, bodyY: 200, bodyH: 28, wickBottom: 232, type: "bull" },
  { cx: 130, wickTop: 158, bodyY: 162, bodyH: 38, wickBottom: 205, type: "bull" },
  { cx: 180, wickTop: 108, bodyY: 112, bodyH: 48, wickBottom: 162, type: "bull" },
  { cx: 230, wickTop:  70, bodyY:  78, bodyH: 38, wickBottom: 118, type: "bull" },
  // Sweep — mèche au-dessus de la ligne y=70, corps qui referme sous la ligne
  { cx: 280, wickTop:  45, bodyY:  74, bodyH: 28, wickBottom: 108, type: "bear" },
  // Réintégration franche sous la ligne
  { cx: 330, wickTop:  78, bodyY:  82, bodyH: 42, wickBottom: 130, type: "bear" },
  // BOUGIE IMPULSIVE BAISSIÈRE — corps très grand
  { cx: 380, wickTop: 122, bodyY: 125, bodyH: 78, wickBottom: 208, type: "bear" },
  // Continuation agressive
  { cx: 430, wickTop: 202, bodyY: 205, bodyH: 28, wickBottom: 238, type: "bear" },
  { cx: 480, wickTop: 230, bodyY: 233, bodyH: 16, wickBottom: 252, type: "bear" },
  { cx: 530, wickTop: 245, bodyY: 248, bodyH: 12, wickBottom: 262, type: "bear" },
  { cx: 580, wickTop: 252, bodyY: 255, bodyH: 8,  wickBottom: 264, type: "bear" },
];

const BODY_W = 12;

export function PostSweepReactionDiagram({ className = "" }: PostSweepReactionDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">EUR/USD · M15</text>

        {/* Ligne résistance */}
        <line x1="60" y1="70" x2="620" y2="70" stroke="#ef4444" strokeWidth="1.3" strokeDasharray="5 3" strokeOpacity="0.85" />
        <rect x="554" y="58" width="58" height="13" rx="3" fill="#09090b" />
        <text x="583" y="68" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">1.1780</text>

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

        {/* Pastille pointant la bougie impulsive */}
        <line x1="394" y1="160" x2="430" y2="148" stroke="#f59e0b" strokeWidth="0.9" strokeOpacity="0.7" />
        <rect x="430" y="138" width="118" height="14" rx="3" fill="#09090b" />
        <text x="489" y="148" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">Bougie impulsive</text>

        {/* Label "1.1735" en bas */}
        <rect x="544" y="264" width="58" height="13" rx="3" fill="#09090b" />
        <text x="573" y="274" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">1.1735</text>

        {/* Annotation */}
        <rect x="170" y="290" width="360" height="22" rx="11" fill="#09090b" />
        <rect x="170" y="290" width="360" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="304" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          La réaction compte plus que la cassure
        </text>
      </svg>

      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">Sweep + réintégration sous la résistance</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">Bougie impulsive = vrai signal d&apos;entrée</span>
        </div>
      </div>
    </div>
  );
}

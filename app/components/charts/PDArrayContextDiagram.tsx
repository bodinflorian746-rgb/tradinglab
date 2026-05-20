// Diagramme : contexte d'un PD Array (Leçon 2 ICT)
// EUR/USD H1 — sweep d'une résistance, impulsion baissière qui crée un FVG,
// puis retour du prix dans le FVG et rejet.

interface PDArrayContextDiagramProps {
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
  { cx:  70, wickTop: 190, bodyY: 195, bodyH: 30, wickBottom: 230, type: "bull" },
  { cx: 115, wickTop: 155, bodyY: 160, bodyH: 38, wickBottom: 202, type: "bull" },
  { cx: 160, wickTop:  72, bodyY:  78, bodyH: 52, wickBottom: 138, type: "bull" },
  // Au contact de la résistance
  { cx: 205, wickTop:  60, bodyY:  68, bodyH: 30, wickBottom: 102, type: "bull" },
  // SWEEP — mèche qui dépasse, corps qui referme sous la ligne
  { cx: 250, wickTop:  42, bodyY:  62, bodyH: 24, wickBottom:  92, type: "bear" },
  // IMPULSE BEARISH — grand corps qui crée le FVG
  { cx: 295, wickTop:  82, bodyY:  86, bodyH: 90, wickBottom: 182, type: "bear" },
  // Continuation
  { cx: 340, wickTop: 172, bodyY: 176, bodyH: 36, wickBottom: 220, type: "bear" },
  { cx: 385, wickTop: 215, bodyY: 218, bodyH: 24, wickBottom: 248, type: "bear" },
  // Retour haussier vers le FVG
  { cx: 430, wickTop: 198, bodyY: 200, bodyH: 42, wickBottom: 248, type: "bull" },
  { cx: 475, wickTop: 158, bodyY: 162, bodyH: 38, wickBottom: 205, type: "bull" },
  // Entrée dans la zone FVG
  { cx: 520, wickTop: 105, bodyY: 110, bodyH: 50, wickBottom: 165, type: "bull" },
  // Rejet — bear depuis le FVG
  { cx: 565, wickTop: 102, bodyY: 108, bodyH: 60, wickBottom: 175, type: "bear" },
];

const BODY_W = 12;

export function PDArrayContextDiagram({ className = "" }: PDArrayContextDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg className="responsive-svg-text" width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">

        <style>{`
          @media (max-width: 640px) {
            .responsive-svg-text text { font-size: 1.5em; }
            .responsive-svg-text .svg-halo {
              transform: scale(1.6);
              transform-origin: center;
              transform-box: fill-box;
            }
            .responsive-svg-text .svg-annot { x: 20px; width: 660px; height: 36px; }
          }
        `}</style>

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">EUR/USD · H1</text>

        {/* Ligne résistance / equal highs */}
        <line x1="40" y1="60" x2="620" y2="60" stroke="#ef4444" strokeWidth="1.3" strokeDasharray="5 3" strokeOpacity="0.85" />
        <rect className="svg-halo" x="430" y="48" width="190" height="13" rx="3" fill="#09090b" />
        <text x="525" y="58" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">Equal highs / résistance 1.1780</text>

        {/* Bande FVG — y=85 à y=115 */}
        <rect x="40" y="85" width="600" height="30" fill="#ef444418" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.7" />

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

        {/* Label Sweep */}
        <line x1="252" y1="44" x2="278" y2="40" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.7" />
        <rect className="svg-halo" x="278" y="30" width="86" height="14" rx="3" fill="#09090b" />
        <text x="321" y="40" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">Sweep 1.1792</text>

        {/* Label FVG (dans la bande à droite) */}
        <rect className="svg-halo" x="492" y="92" width="128" height="14" rx="3" fill="#09090b" />
        <text x="556" y="102" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">FVG 1.1758-1.1770</text>

        {/* Annotation */}
        <rect className="svg-annot" x="170" y="284" width="360" height="22" rx="11" fill="#09090b" />
        <rect className="svg-annot" x="170" y="284" width="360" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="298" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          Le prix revient dans la zone créée par l&apos;impulsion
        </text>
      </svg>

      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">FVG créé par l&apos;impulsion baissière</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">Retour dans la zone puis rejet = PD Array actif</span>
        </div>
      </div>
    </div>
  );
}

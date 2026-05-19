// Diagramme : expansion à l'ouverture NY (Leçon 3 ICT)
// XAU/USD M15 — pré-market lent autour de 4 640 $, puis impulsion explosive haussière à
// l'ouverture NY (sommet 4 668 $ avec mèche de sweep), puis rejet violent vers 4 610 $.

interface NYOpenExpansionDiagramProps {
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
  // PHASE 1 — pré-market lent, autour de y=160 (4 640 $)
  { cx:  70, wickTop: 156, bodyY: 160, bodyH:  8, wickBottom: 172, type: "bull" },
  { cx: 100, wickTop: 162, bodyY: 168, bodyH:  6, wickBottom: 178, type: "bear" },
  { cx: 130, wickTop: 158, bodyY: 162, bodyH:  8, wickBottom: 174, type: "bull" },
  { cx: 160, wickTop: 160, bodyY: 162, bodyH:  6, wickBottom: 172, type: "bear" },
  { cx: 190, wickTop: 158, bodyY: 162, bodyH:  6, wickBottom: 172, type: "bull" },
  { cx: 220, wickTop: 160, bodyY: 164, bodyH:  8, wickBottom: 178, type: "bear" },
  { cx: 250, wickTop: 158, bodyY: 162, bodyH:  6, wickBottom: 170, type: "bull" },

  // PHASE 2 — bougie explosive haussière + sweep
  { cx: 295, wickTop:  78, bodyY:  85, bodyH: 75, wickBottom: 165, type: "bull" }, // grosse impulsion verte (open 160, close 85)
  { cx: 335, wickTop:  50, bodyY:  62, bodyH: 22, wickBottom:  92, type: "bull" }, // mèche de sweep à y=50, sommet final 4 668 $

  // PHASE 3 — rejet violent bearish vers 4 610 $
  { cx: 380, wickTop:  60, bodyY:  62, bodyH: 70, wickBottom: 138, type: "bear" }, // gros rejet rouge
  { cx: 420, wickTop: 130, bodyY: 132, bodyH: 50, wickBottom: 188, type: "bear" },
  { cx: 460, wickTop: 180, bodyY: 182, bodyH: 40, wickBottom: 228, type: "bear" },
  { cx: 500, wickTop: 220, bodyY: 222, bodyH: 28, wickBottom: 255, type: "bear" },
  { cx: 540, wickTop: 248, bodyY: 250, bodyH: 14, wickBottom: 268, type: "bear" },
  { cx: 580, wickTop: 262, bodyY: 264, bodyH:  8, wickBottom: 274, type: "bear" },
];

const BODY_W = 14;

export function NYOpenExpansionDiagram({ className = "" }: NYOpenExpansionDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">XAU/USD · M15</text>

        {/* Repère vertical "NY Open" entre phase 1 et phase 2 */}
        <line x1="272" y1="50" x2="272" y2="278" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.5" />
        <rect x="232" y="50" width="78" height="14" rx="3" fill="#09090b" />
        <text x="271" y="60" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">NY Open</text>

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

        {/* Label "4 640 $" sur la zone pré-market */}
        <rect x="158" y="138" width="62" height="13" rx="3" fill="#09090b" />
        <text x="189" y="148" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">4 640 $</text>

        {/* Label "4 668 $" au sommet du sweep */}
        <line x1="338" y1="48" x2="365" y2="40" stroke="#f59e0b" strokeWidth="0.9" strokeOpacity="0.7" />
        <rect x="365" y="30" width="62" height="14" rx="3" fill="#09090b" />
        <text x="396" y="40" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">4 668 $</text>

        {/* Label "4 610 $" en bas du rejet */}
        <rect x="600" y="268" width="62" height="13" rx="3" fill="#09090b" />
        <text x="631" y="278" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">4 610 $</text>

        {/* Annotation */}
        <rect x="170" y="290" width="360" height="22" rx="11" fill="#09090b" />
        <rect x="170" y="290" width="360" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="304" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          Le volume transforme le marché
        </text>
      </svg>

      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-zinc-500" />
          <span className="text-[10px] text-zinc-500">Pré-market = bougies plates, faible volume</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">NY Open = impulsion explosive puis sweep et rejet</span>
        </div>
      </div>
    </div>
  );
}

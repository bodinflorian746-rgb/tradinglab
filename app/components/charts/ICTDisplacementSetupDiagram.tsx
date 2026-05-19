// Diagramme : displacement crée le FVG puis retour dans le FVG (Leçon 5 ICT)
// EUR/USD H1 — sweep 1.1792, displacement bearish vers 1.1748, FVG entre 1.1768 et 1.1780,
// retour du prix dans la bande FVG, puis rejet bearish.

interface ICTDisplacementSetupDiagramProps {
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

// Continuité : open = close de la précédente. Résistance y=55, FVG y=78-110.
const CANDLES: CandleSpec[] = [
  // Approche sous la résistance
  { cx:  60, wickTop:  88, bodyY:  92, bodyH: 22, wickBottom: 122, type: "bull" }, // open 114 close 92
  { cx:  95, wickTop:  68, bodyY:  72, bodyH: 22, wickBottom: 100, type: "bull" }, // open 92  close 72
  { cx: 130, wickTop:  56, bodyY:  72, bodyH: 12, wickBottom:  92, type: "bear" }, // open 72  close 84 (touche résistance)
  // SWEEP — mèche au-dessus, corps referme sous
  { cx: 165, wickTop:  36, bodyY:  72, bodyH: 16, wickBottom:  98, type: "bear" }, // open 72  close 88
  // DISPLACEMENT bearish — grandes bougies qui créent le FVG (78-110)
  { cx: 200, wickTop:  86, bodyY:  88, bodyH: 60, wickBottom: 158, type: "bear" }, // open 88  close 148
  { cx: 235, wickTop: 145, bodyY: 148, bodyH: 50, wickBottom: 205, type: "bear" }, // open 148 close 198
  { cx: 270, wickTop: 196, bodyY: 198, bodyH: 38, wickBottom: 242, type: "bear" }, // open 198 close 236
  { cx: 305, wickTop: 234, bodyY: 236, bodyH: 22, wickBottom: 262, type: "bear" }, // open 236 close 258 (bas)
  // Retour haussier
  { cx: 340, wickTop: 220, bodyY: 225, bodyH: 33, wickBottom: 262, type: "bull" }, // open 258 close 225
  { cx: 375, wickTop: 180, bodyY: 185, bodyH: 40, wickBottom: 230, type: "bull" }, // open 225 close 185
  { cx: 410, wickTop: 138, bodyY: 142, bodyH: 43, wickBottom: 190, type: "bull" }, // open 185 close 142
  // Entrée dans la bande FVG (78-110)
  { cx: 445, wickTop:  98, bodyY: 100, bodyH: 42, wickBottom: 146, type: "bull" }, // open 142 close 100 (dans FVG)
  { cx: 480, wickTop:  78, bodyY:  82, bodyH: 18, wickBottom: 105, type: "bull" }, // open 100 close 82 (dans FVG)
  // REJET bearish depuis le FVG
  { cx: 515, wickTop:  80, bodyY:  82, bodyH: 60, wickBottom: 148, type: "bear" }, // open 82  close 142
  { cx: 550, wickTop: 140, bodyY: 142, bodyH: 50, wickBottom: 198, type: "bear" }, // open 142 close 192
  { cx: 585, wickTop: 190, bodyY: 192, bodyH: 32, wickBottom: 230, type: "bear" }, // open 192 close 224
  { cx: 620, wickTop: 222, bodyY: 224, bodyH: 22, wickBottom: 250, type: "bear" }, // open 224 close 246
];

const BODY_W = 12;

export function ICTDisplacementSetupDiagram({ className = "" }: ICTDisplacementSetupDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">EUR/USD · H1</text>

        {/* Ligne de résistance y=55 */}
        <line x1="40" y1="55" x2="660" y2="55" stroke="#ef4444" strokeWidth="1.3" strokeDasharray="5 3" strokeOpacity="0.85" />

        {/* Bande FVG — y=78 à y=110 */}
        <rect x="190" y="78" width="460" height="32" fill="#ef444418" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.75" />

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

        {/* Label "1.1780" (résistance) à gauche */}
        <rect x="6" y="48" width="50" height="13" rx="3" fill="#09090b" />
        <text x="31" y="58" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">1.1780</text>

        {/* Label "1.1768" (bord bas FVG) à gauche */}
        <rect x="6" y="104" width="50" height="13" rx="3" fill="#09090b" />
        <text x="31" y="114" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">1.1768</text>

        {/* Label Sweep 1.1792 */}
        <line x1="167" y1="38" x2="200" y2="28" stroke="#f59e0b" strokeWidth="0.9" strokeOpacity="0.7" />
        <rect x="200" y="18" width="62" height="14" rx="3" fill="#09090b" />
        <text x="231" y="28" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">1.1792</text>

        {/* Label "1.1748" en bas, au creux du displacement */}
        <rect x="318" y="266" width="56" height="13" rx="3" fill="#09090b" />
        <text x="346" y="276" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">1.1748</text>

        {/* Annotation */}
        <rect x="170" y="290" width="360" height="22" rx="11" fill="#09090b" />
        <rect x="170" y="290" width="360" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="304" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          Le déplacement construit la zone d&apos;exécution
        </text>
      </svg>

      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">Displacement bearish crée le FVG dans la chute</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">Retour dans le FVG puis rejet bearish</span>
        </div>
      </div>
    </div>
  );
}

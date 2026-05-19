// Diagramme : timing + setup (Leçon 5 ICT)
// XAU/USD — timeline 2 segments Asia / London Open, range Asia (4 642-4 655),
// sweep au-dessus du range puis displacement bearish avec FVG dans la chute.

interface ICTTimingDiagramProps {
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

// Continuité : open = close de la précédente.
// Range Asia y=120-150. Bande FVG y=170-200.
const CANDLES: CandleSpec[] = [
  // Range Asia — bougies serrées entre y=120 et y=150 (continuité dans la zone)
  { cx:  70, wickTop: 122, bodyY: 125, bodyH: 18, wickBottom: 152, type: "bull" }, // open 143 close 125
  { cx: 100, wickTop: 122, bodyY: 125, bodyH: 18, wickBottom: 152, type: "bear" }, // open 125 close 143
  { cx: 130, wickTop: 130, bodyY: 134, bodyH: 12, wickBottom: 152, type: "bull" }, // open 146 close 134
  { cx: 160, wickTop: 132, bodyY: 134, bodyH: 14, wickBottom: 152, type: "bear" }, // open 134 close 148
  { cx: 190, wickTop: 124, bodyY: 128, bodyH: 20, wickBottom: 152, type: "bull" }, // open 148 close 128
  { cx: 220, wickTop: 126, bodyY: 128, bodyH: 18, wickBottom: 152, type: "bear" }, // open 128 close 146
  { cx: 250, wickTop: 130, bodyY: 134, bodyH: 12, wickBottom: 150, type: "bull" }, // open 146 close 134

  // SWEEP — bougie qui dépasse au-dessus du range (mèche à y=98), corps referme sous le sommet du range
  { cx: 290, wickTop:  98, bodyY: 132, bodyH: 16, wickBottom: 152, type: "bear" }, // open 134 close 148

  // DISPLACEMENT bearish — grandes bougies rouges sous le range
  { cx: 325, wickTop: 146, bodyY: 148, bodyH: 50, wickBottom: 205, type: "bear" }, // open 148 close 198
  { cx: 360, wickTop: 196, bodyY: 198, bodyH: 42, wickBottom: 245, type: "bear" }, // open 198 close 240
  { cx: 395, wickTop: 238, bodyY: 240, bodyH: 28, wickBottom: 270, type: "bear" }, // open 240 close 268
  { cx: 430, wickTop: 266, bodyY: 268, bodyH: 12, wickBottom: 282, type: "bear" }, // open 268 close 280
  { cx: 465, wickTop: 278, bodyY: 280, bodyH:  8, wickBottom: 290, type: "bear" }, // open 280 close 288
];

const BODY_W = 12;

export function ICTTimingDiagram({ className = "" }: ICTTimingDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">XAU/USD · M15</text>

        {/* Timeline horizontale en haut */}
        {/* Segment Asia — fin, calme */}
        <line x1="70" y1="60" x2="265" y2="60" stroke="#52525b" strokeWidth="2" strokeLinecap="round" />
        <rect x="125" y="44" width="84" height="14" rx="3" fill="#09090b" />
        <text x="167" y="54" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">Range Asia</text>

        {/* Segment London — épais, accent */}
        <line x1="285" y1="60" x2="490" y2="60" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
        <rect x="332" y="44" width="110" height="14" rx="3" fill="#09090b" />
        <text x="387" y="54" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">London Open</text>

        {/* Séparateur vertical */}
        <line x1="275" y1="68" x2="275" y2="290" stroke="#27272a" strokeWidth="1" strokeDasharray="2 4" />

        {/* Rectangle Range Asia — y=120 à y=150 */}
        <rect x="55" y="120" width="220" height="30" fill="#27272a40" stroke="#71717a" strokeWidth="1.2" strokeDasharray="5 3" strokeOpacity="0.9" />

        {/* Labels du range — à GAUCHE pour ne pas chevaucher */}
        <rect x="6" y="113" width="50" height="13" rx="3" fill="#09090b" />
        <text x="31" y="123" fill="#a1a1aa" fontSize="9" fontWeight="600" textAnchor="middle">4 655 $</text>
        <rect x="6" y="144" width="50" height="13" rx="3" fill="#09090b" />
        <text x="31" y="154" fill="#a1a1aa" fontSize="9" fontWeight="600" textAnchor="middle">4 642 $</text>

        {/* Bande FVG dans la chute — y=170 à y=200 */}
        <rect x="310" y="170" width="345" height="30" fill="#ef444418" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.6" />
        <rect x="610" y="178" width="42" height="13" rx="3" fill="#09090b" />
        <text x="631" y="188" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">FVG</text>

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

        {/* Label Sweep au-dessus de la mèche */}
        <line x1="292" y1="96" x2="320" y2="84" stroke="#f59e0b" strokeWidth="0.9" strokeOpacity="0.7" />
        <rect x="320" y="74" width="56" height="14" rx="3" fill="#09090b" />
        <text x="348" y="84" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">Sweep</text>

        {/* Annotation */}
        <rect x="170" y="290" width="360" height="22" rx="11" fill="#09090b" />
        <rect x="170" y="290" width="360" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="304" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          Le timing active le mouvement
        </text>
      </svg>

      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-zinc-500" />
          <span className="text-[10px] text-zinc-500">Range Asia = poche de liquidité visible</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">Sweep et displacement en London Open</span>
        </div>
      </div>
    </div>
  );
}

// Diagramme : réaction headline NFP (Leçon 2 Macro Trading)
// XAU/USD M15 — prix stable 4 640 $, grande bougie NFP bearish jusqu'à 4 575 $ cassant
// le support, stabilisation 4 580-4 585 $, puis retour progressif vers 4 625 $.

interface NFPHeadlineReactionDiagramProps {
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
// 4 640 $ ≈ y=70, 4 625 $ ≈ y=100, support 4 600 $ ≈ y=150, 4 585 $ ≈ y=180, 4 575 $ ≈ y=200.
const CANDLES: CandleSpec[] = [
  // Pré-NFP — stable autour de y=70-82
  { cx:  50, wickTop:  64, bodyY:  70, bodyH: 18, wickBottom:  92, type: "bull" }, // close 70
  { cx:  88, wickTop:  64, bodyY:  70, bodyH: 12, wickBottom:  88, type: "bear" }, // open 70 close 82
  { cx: 126, wickTop:  64, bodyY:  68, bodyH: 14, wickBottom:  88, type: "bull" }, // open 82 close 68
  { cx: 164, wickTop:  64, bodyY:  68, bodyH: 10, wickBottom:  86, type: "bear" }, // open 68 close 78

  // GRANDE bougie NFP bearish — chute massive 78 → 200
  { cx: 208, wickTop:  72, bodyY:  78, bodyH: 122, wickBottom: 210, type: "bear" }, // open 78 close 200

  // Stabilisation autour de y=180-200 (4 580-4 585 $)
  { cx: 250, wickTop: 178, bodyY: 185, bodyH: 15, wickBottom: 208, type: "bull" }, // open 200 close 185
  { cx: 285, wickTop: 180, bodyY: 185, bodyH: 10, wickBottom: 205, type: "bear" }, // open 185 close 195
  { cx: 320, wickTop: 178, bodyY: 182, bodyH: 13, wickBottom: 205, type: "bull" }, // open 195 close 182
  { cx: 355, wickTop: 178, bodyY: 182, bodyH: 11, wickBottom: 205, type: "bear" }, // open 182 close 193

  // Retour progressif vers y=100 (4 625 $)
  { cx: 395, wickTop: 166, bodyY: 170, bodyH: 23, wickBottom: 200, type: "bull" }, // open 193 close 170
  { cx: 435, wickTop: 142, bodyY: 145, bodyH: 25, wickBottom: 178, type: "bull" }, // open 170 close 145
  { cx: 475, wickTop: 142, bodyY: 145, bodyH:  7, wickBottom: 160, type: "bear" }, // open 145 close 152
  { cx: 515, wickTop: 120, bodyY: 125, bodyH: 27, wickBottom: 160, type: "bull" }, // open 152 close 125
  { cx: 555, wickTop: 100, bodyY: 105, bodyH: 20, wickBottom: 132, type: "bull" }, // open 125 close 105 (~4 625)
];

const BODY_W = 12;

export function NFPHeadlineReactionDiagram({ className = "" }: NFPHeadlineReactionDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">XAU/USD · M15</text>

        {/* Ligne de support 4 600 $ — cassée par la grande bougie NFP */}
        <line x1="40" y1="150" x2="660" y2="150" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="5 3" strokeOpacity="0.8" />
        <rect x="556" y="138" width="92" height="13" rx="3" fill="#09090b" />
        <text x="602" y="148" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">Support 4 600 $</text>

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

        {/* Label "4 640 $ — avant NFP" */}
        <rect x="6" y="54" width="142" height="13" rx="3" fill="#09090b" />
        <text x="77" y="64" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">4 640 $ — avant NFP</text>

        {/* Label "4 575 $" au creux */}
        <rect x="156" y="214" width="58" height="13" rx="3" fill="#09090b" />
        <text x="185" y="224" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">4 575 $</text>

        {/* Label "4 625 $" au sommet du retour */}
        <rect x="524" y="86" width="58" height="13" rx="3" fill="#09090b" />
        <text x="553" y="96" fill="#10b981" fontSize="9" fontWeight="700" textAnchor="middle">4 625 $</text>

        {/* Annotation "Réaction headline" — à GAUCHE de la grande bougie */}
        <rect x="64" y="110" width="120" height="14" rx="3" fill="#09090b" />
        <rect x="64" y="110" width="120" height="14" rx="3" fill="#f59e0b18" stroke="#f59e0b" strokeWidth="0.9" />
        <text x="124" y="120" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">Réaction headline</text>
        <line x1="184" y1="117" x2="202" y2="117" stroke="#f59e0b" strokeWidth="0.9" strokeOpacity="0.7" />

        {/* Annotation "Réévaluation du marché" — au-dessus de la remontée */}
        <rect x="394" y="36" width="148" height="14" rx="3" fill="#09090b" />
        <rect x="394" y="36" width="148" height="14" rx="3" fill="#f59e0b18" stroke="#f59e0b" strokeWidth="0.9" />
        <text x="468" y="46" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">Réévaluation du marché</text>
        <line x1="468" y1="50" x2="468" y2="100" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity="0.6" />
      </svg>

      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">Réaction headline excessive, casse du support</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">Réévaluation du marché après stabilisation</span>
        </div>
      </div>
    </div>
  );
}

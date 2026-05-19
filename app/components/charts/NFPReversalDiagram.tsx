// Diagramme : retournement complet NFP (Leçon 2 Macro Trading)
// XAU/USD M15 — chute NFP 4 640 → 4 575 $, base 4 580-4 585 $, cassure bullish > 4 620 $,
// accélération vers 4 665 $ (au-dessus du niveau pré-NFP).

interface NFPReversalDiagramProps {
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

// Continuité prix. 4 665 $ ≈ y=30, 4 640 $ (pré-NFP) ≈ y=80, 4 620 $ ≈ y=120,
// 4 585 $ ≈ y=180, 4 575 $ ≈ y=200.
const CANDLES: CandleSpec[] = [
  // Pré-NFP autour de y=80
  { cx:  50, wickTop:  74, bodyY:  78, bodyH: 12, wickBottom:  96, type: "bull" }, // close 78
  { cx:  85, wickTop:  74, bodyY:  78, bodyH: 10, wickBottom:  92, type: "bear" }, // open 78 close 88

  // Panique initiale — chute bearish vers y=200
  { cx: 120, wickTop:  82, bodyY:  88, bodyH: 52, wickBottom: 148, type: "bear" }, // open 88 close 140
  { cx: 155, wickTop: 136, bodyY: 140, bodyH: 40, wickBottom: 190, type: "bear" }, // open 140 close 180
  { cx: 190, wickTop: 176, bodyY: 180, bodyH: 20, wickBottom: 210, type: "bear" }, // open 180 close 200 (low ~4 575)

  // Base / réévaluation autour de y=180-200
  { cx: 225, wickTop: 180, bodyY: 185, bodyH: 15, wickBottom: 212, type: "bull" }, // open 200 close 185
  { cx: 260, wickTop: 180, bodyY: 185, bodyH: 10, wickBottom: 208, type: "bear" }, // open 185 close 195
  { cx: 295, wickTop: 178, bodyY: 182, bodyH: 13, wickBottom: 208, type: "bull" }, // open 195 close 182

  // Cassure bullish — accélération vers y=30 (4 665 $)
  { cx: 330, wickTop: 140, bodyY: 145, bodyH: 37, wickBottom: 188, type: "bull" }, // open 182 close 145
  { cx: 365, wickTop: 105, bodyY: 110, bodyH: 35, wickBottom: 148, type: "bull" }, // open 145 close 110 — casse 4 620
  { cx: 400, wickTop:  65, bodyY:  70, bodyH: 40, wickBottom: 115, type: "bull" }, // open 110 close 70 — casse pré-NFP 4 640
  { cx: 435, wickTop:  40, bodyY:  45, bodyH: 25, wickBottom:  75, type: "bull" }, // open 70 close 45
  { cx: 470, wickTop:  28, bodyY:  32, bodyH: 13, wickBottom:  55, type: "bull" }, // open 45 close 32 — sommet ~4 665
  { cx: 505, wickTop:  28, bodyY:  32, bodyH:  6, wickBottom:  48, type: "bear" }, // open 32 close 38 (petite pause)
  { cx: 540, wickTop:  30, bodyY:  35, bodyH:  3, wickBottom:  50, type: "bull" }, // open 38 close 35
];

const BODY_W = 12;

export function NFPReversalDiagram({ className = "" }: NFPReversalDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">XAU/USD · M15</text>

        {/* Ligne pré-NFP 4 640 $ — visuellement le repère que le retournement dépasse */}
        <line x1="40" y1="80" x2="660" y2="80" stroke="#71717a" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.65" />
        <rect x="6" y="62" width="92" height="13" rx="3" fill="#09090b" />
        <text x="52" y="72" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">4 640 $ pré-NFP</text>

        {/* Base de stabilisation autour de y=180-200 */}
        <rect x="208" y="180" width="100" height="35" fill="#27272a40" stroke="#71717a" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.85" />

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

        {/* Label "4 575 $" — creux */}
        <rect x="158" y="218" width="58" height="13" rx="3" fill="#09090b" />
        <text x="187" y="228" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">4 575 $</text>

        {/* Label "4 665 $" — sommet du retournement */}
        <rect x="442" y="14" width="58" height="13" rx="3" fill="#09090b" />
        <text x="471" y="24" fill="#10b981" fontSize="9" fontWeight="700" textAnchor="middle">4 665 $</text>

        {/* Annotation "Panique initiale" — sur la chute */}
        <rect x="110" y="108" width="110" height="14" rx="3" fill="#09090b" />
        <text x="165" y="118" fill="#71717a" fontSize="9" fontWeight="700" textAnchor="middle">Panique initiale</text>

        {/* Annotation "Réévaluation" — au-dessus de la base */}
        <rect x="220" y="158" width="80" height="14" rx="3" fill="#09090b" />
        <text x="260" y="168" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">Réévaluation</text>

        {/* Annotation "Renversement" — sur la phase haussière */}
        <rect x="376" y="194" width="100" height="14" rx="3" fill="#09090b" />
        <rect x="376" y="194" width="100" height="14" rx="3" fill="#f59e0b18" stroke="#f59e0b" strokeWidth="0.9" />
        <text x="426" y="204" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">Renversement</text>
      </svg>

      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">Chute initiale puis base de stabilisation</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">Cassure et retournement complet au-dessus du pré-NFP</span>
        </div>
      </div>
    </div>
  );
}

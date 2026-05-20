// Diagramme : la liquidité prépare le mouvement (Leçon 5 ICT)
// EUR/USD H1 — equal highs à 1.1780, sweep à 1.1792, réintégration sous le niveau,
// début d'impulsion bearish.

interface ICTLiquidityPrepDiagramProps {
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
const CANDLES: CandleSpec[] = [
  // Approche haussière vers la résistance y=60
  { cx:  70, wickTop: 195, bodyY: 200, bodyH: 30, wickBottom: 235, type: "bull" }, // open 230 close 200
  { cx: 115, wickTop: 158, bodyY: 162, bodyH: 38, wickBottom: 205, type: "bull" }, // open 200 close 162
  { cx: 160, wickTop:  98, bodyY: 102, bodyH: 60, wickBottom: 165, type: "bull" }, // open 162 close 102
  { cx: 205, wickTop:  60, bodyY:  72, bodyH: 30, wickBottom: 105, type: "bull" }, // open 102 close 72 (mèche au niveau)
  // 1er equal high
  { cx: 250, wickTop:  60, bodyY:  72, bodyH: 28, wickBottom: 105, type: "bear" }, // open 72 close 100
  { cx: 295, wickTop:  62, bodyY:  72, bodyH: 28, wickBottom: 105, type: "bull" }, // open 100 close 72 (2e EH)
  // SWEEP — mèche à y=40 au-dessus de la résistance, corps referme sous (label 1.1792)
  { cx: 340, wickTop:  40, bodyY:  72, bodyH: 20, wickBottom: 105, type: "bear" }, // open 72 close 92 (réintégration)
  // Réintégration franche sous la résistance
  { cx: 385, wickTop:  90, bodyY:  92, bodyH: 35, wickBottom: 135, type: "bear" }, // open 92 close 127
  // Début d'impulsion bearish
  { cx: 430, wickTop: 125, bodyY: 127, bodyH: 45, wickBottom: 180, type: "bear" }, // open 127 close 172
  { cx: 475, wickTop: 170, bodyY: 172, bodyH: 38, wickBottom: 220, type: "bear" }, // open 172 close 210
  { cx: 520, wickTop: 208, bodyY: 210, bodyH: 28, wickBottom: 248, type: "bear" }, // open 210 close 238
  { cx: 565, wickTop: 236, bodyY: 238, bodyH: 18, wickBottom: 262, type: "bear" }, // open 238 close 256
];

const BODY_W = 12;

export function ICTLiquidityPrepDiagram({ className = "" }: ICTLiquidityPrepDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">EUR/USD · H1</text>

        {/* Ligne equal highs */}
        <line x1="40" y1="60" x2="660" y2="60" stroke="#ef4444" strokeWidth="1.3" strokeDasharray="5 3" strokeOpacity="0.85" />
        <rect x="486" y="48" width="148" height="13" rx="3" fill="#09090b" />
        <text x="560" y="58" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">Equal highs 1.1780</text>

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

        {/* Label Sweep 1.1792 */}
        <line x1="342" y1="40" x2="372" y2="28" stroke="#f59e0b" strokeWidth="0.9" strokeOpacity="0.7" />
        <rect x="372" y="18" width="92" height="14" rx="3" fill="#09090b" />
        <text x="418" y="28" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">Sweep 1.1792</text>

        {/* Annotation */}
        <rect x="170" y="290" width="360" height="22" rx="11" fill="#09090b" />
        <rect x="170" y="290" width="360" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="304" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          La liquidité prépare le déplacement
        </text>
      </svg>

      {/* MOBILE : ICT liquidity prep ─────────────────── */}
      <div className="sm:hidden p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">ICT liquidity prep · EUR/USD H1</p>
        <ul className="space-y-2 text-[13px]">
          <li className="flex items-start gap-2.5">
            <span className="shrink-0 w-5 h-5 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-[11px] font-bold text-red-400 mt-0.5">1</span>
            <span className="text-zinc-300"><span className="font-bold text-red-400">Equal highs</span> = liquidité visible des stops d'achat.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="shrink-0 w-5 h-5 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center text-[11px] font-bold text-amber-400 mt-0.5">2</span>
            <span className="text-zinc-300"><span className="font-bold text-amber-400">Sweep + réintégration</span> = manipulation institutionnelle.</span>
          </li>
        </ul>
      </div>

      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">Equal highs = liquidité visible</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">Sweep puis réintégration = manipulation</span>
        </div>
      </div>
    </div>
  );
}

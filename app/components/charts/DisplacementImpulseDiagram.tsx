// Diagramme : displacement bearish après sweep (Leçon 4 ICT)
// EUR/USD M15 — bougies bloquées sous résistance 1.1780, sweep à 1.1792, puis displacement bearish
// continu (grandes bougies rouges) avec 2 bandes FVG laissées dans la chute, jusqu'à 1.1748.

interface DisplacementImpulseDiagramProps {
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
  // Approche bloquée sous la résistance (y=60)
  { cx:  70, wickTop:  85, bodyY:  88, bodyH: 18, wickBottom: 115, type: "bull" },
  { cx: 105, wickTop:  72, bodyY:  78, bodyH: 12, wickBottom:  98, type: "bull" },
  { cx: 140, wickTop:  68, bodyY:  72, bodyH: 14, wickBottom:  92, type: "bear" },
  { cx: 175, wickTop:  68, bodyY:  72, bodyH: 12, wickBottom:  90, type: "bull" },
  { cx: 210, wickTop:  65, bodyY:  68, bodyH: 14, wickBottom:  88, type: "bear" },

  // SWEEP — mèche au-dessus de y=60, corps referme sous (label 1.1792)
  { cx: 250, wickTop:  38, bodyY:  62, bodyH: 14, wickBottom:  90, type: "bear" },

  // DISPLACEMENT bearish — grandes bougies rouges, continuité prix
  { cx: 290, wickTop:  72, bodyY:  76, bodyH: 50, wickBottom: 132, type: "bear" }, // open 76 close 126
  { cx: 330, wickTop: 124, bodyY: 126, bodyH: 48, wickBottom: 180, type: "bear" }, // open 126 close 174
  { cx: 370, wickTop: 172, bodyY: 174, bodyH: 42, wickBottom: 222, type: "bear" }, // open 174 close 216
  { cx: 410, wickTop: 214, bodyY: 216, bodyH: 28, wickBottom: 250, type: "bear" }, // open 216 close 244
  { cx: 450, wickTop: 242, bodyY: 244, bodyH: 18, wickBottom: 268, type: "bear" }, // open 244 close 262
];

const BODY_W = 14;

export function DisplacementImpulseDiagram({ className = "" }: DisplacementImpulseDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">EUR/USD · M15</text>

        {/* Ligne de résistance */}
        <line x1="40" y1="60" x2="660" y2="60" stroke="#ef4444" strokeWidth="1.3" strokeDasharray="5 3" strokeOpacity="0.85" />
        <rect x="600" y="48" width="52" height="13" rx="3" fill="#09090b" />
        <text x="626" y="58" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">1.1780</text>

        {/* Bande FVG 1 — entre c6 (sweep) et c8, créée par c7 displacement (y=92 à y=118) */}
        <rect x="270" y="92" width="380" height="26" fill="#ef444418" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.65" />

        {/* Bande FVG 2 — créée par c8 displacement (y=140 à y=164) */}
        <rect x="310" y="140" width="340" height="24" fill="#ef444418" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.55" />

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
        <line x1="252" y1="40" x2="285" y2="30" stroke="#f59e0b" strokeWidth="0.9" strokeOpacity="0.7" />
        <rect x="285" y="20" width="90" height="14" rx="3" fill="#09090b" />
        <text x="330" y="30" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">Sweep 1.1792</text>

        {/* Label "FVG" sur les bandes */}
        <rect x="608" y="98" width="40" height="14" rx="3" fill="#09090b" />
        <text x="628" y="108" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">FVG</text>
        <rect x="608" y="146" width="40" height="14" rx="3" fill="#09090b" />
        <text x="628" y="156" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">FVG</text>

        {/* Label "1.1748" en bas */}
        <rect x="470" y="258" width="56" height="13" rx="3" fill="#09090b" />
        <text x="498" y="268" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">1.1748</text>

        {/* Annotation */}
        <rect x="170" y="290" width="360" height="22" rx="11" fill="#09090b" />
        <rect x="170" y="290" width="360" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="304" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          Le marché accélère sans respiration
        </text>
      </svg>

      {/* MOBILE : displacement impulsion ─────────────────── */}
      <div className="sm:hidden p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">Displacement impulsion · EUR/USD M15</p>

        {/* Mini-SVG : sweep amber (mèche) puis impulsion violente bullish */}
        <svg viewBox="0 0 280 100" className="w-full h-auto" aria-label="Displacement impulsion" fill="none">
          {/* Niveau de référence (high pré-sweep) */}
          <line x1="10" y1="45" x2="270" y2="45" stroke="#71717a" strokeWidth="0.8" strokeDasharray="3 3" />
          {/* Bougies d'approche neutres */}
          {[30, 50].map((x, i) => (
            <g key={x}>
              <line x1={x} y1="42" x2={x} y2="62" stroke={i === 0 ? "#dc2626" : "#059669"} strokeWidth="1" strokeLinecap="round" />
              <rect x={x - 3.5} y="48" width="7" height="12" fill={i === 0 ? "#ef4444" : "#10b981"} stroke={i === 0 ? "#dc2626" : "#059669"} strokeWidth="0.5" rx="0.6" />
            </g>
          ))}
          {/* Sweep : bougie avec longue mèche au-dessus du niveau */}
          <line x1="80" y1="25" x2="80" y2="62" stroke="#dc2626" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="76" y="52" width="8" height="10" fill="#ef4444" stroke="#dc2626" strokeWidth="0.6" rx="0.8" />
          <rect x="55" y="6" width="50" height="12" rx="2" fill="#f59e0b15" stroke="#f59e0b55" strokeWidth="0.7" />
          <text x="80" y="14" fontSize="9" fill="#f59e0b" textAnchor="middle" fontWeight="700">Sweep</text>
          {/* Impulsion : grandes bougies bullish post-sweep */}
          {[120, 145, 170, 195, 220, 245].map((x, i) => {
            const y = 55 - i * 5;
            return (
              <g key={x}>
                <line x1={x} y1={y - 4} x2={x} y2={y + 16} stroke="#059669" strokeWidth="1.2" strokeLinecap="round" />
                <rect x={x - 5} y={y} width="10" height="14" fill="#10b981" stroke="#059669" strokeWidth="0.7" rx="0.8" />
              </g>
            );
          })}
          <rect x="160" y="78" width="80" height="13" rx="2" fill="#10b98115" stroke="#10b98155" strokeWidth="0.7" />
          <text x="200" y="87" fontSize="9" fill="#10b981" textAnchor="middle" fontWeight="700">IMPULSION ↑</text>
        </svg>

        <div className="rounded-lg border border-amber-400/40 bg-amber-400/8 p-3">
          <p className="text-[13px] font-bold text-amber-400">Sweep initial</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">Manipulation pour chasser la liquidité.</p>
        </div>
        <div className="rounded-lg border-2 border-red-500 bg-red-500/8 p-3">
          <p className="text-[13px] font-bold text-red-400">Displacement bearish continu</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">Grandes bougies baissières d'affilée laissent des <span className="font-bold text-blue-400">FVG</span> = zones d'exécution futures.</p>
        </div>
      </div>

      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">Sweep puis displacement bearish continu</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">FVG laissés par les grandes bougies de la chute</span>
        </div>
      </div>
    </div>
  );
}

// Diagramme : alignement régime macro vs signal local (Leçon 4 Macro Trading)
// XAU/USD H4 — tendance bullish dominante vers 4 740 $, signal bearish M15 contre-tendance qui
// échoue, le marché continue de monter au-dessus.

interface MacroFilterRegimeDiagramProps {
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

// Niveaux successifs (y) : 260 → 230 → 240 → 210 → 180 → 160 → 168 → 145 → 120 → 130 → 100 → 75 → 55
// Bullish dominante avec quelques petits replis (les bears restent dans le contexte).
const CANDLES: CandleSpec[] = [
  { cx:  50, wickTop: 226, bodyY: 230, bodyH: 30, wickBottom: 270, type: "bull" }, // open 260 close 230
  { cx:  98, wickTop: 226, bodyY: 230, bodyH: 10, wickBottom: 245, type: "bear" }, // open 230 close 240 — petit repli
  { cx: 146, wickTop: 206, bodyY: 210, bodyH: 30, wickBottom: 245, type: "bull" }, // open 240 close 210
  { cx: 194, wickTop: 176, bodyY: 180, bodyH: 30, wickBottom: 215, type: "bull" }, // open 210 close 180
  { cx: 242, wickTop: 156, bodyY: 160, bodyH: 20, wickBottom: 188, type: "bull" }, // open 180 close 160
  { cx: 290, wickTop: 156, bodyY: 160, bodyH:  8, wickBottom: 175, type: "bear" }, // open 160 close 168 — petit repli
  { cx: 338, wickTop: 141, bodyY: 145, bodyH: 23, wickBottom: 175, type: "bull" }, // open 168 close 145
  { cx: 386, wickTop: 116, bodyY: 120, bodyH: 25, wickBottom: 150, type: "bull" }, // open 145 close 120
  { cx: 434, wickTop: 116, bodyY: 120, bodyH: 10, wickBottom: 138, type: "bear" }, // open 120 close 130 — petit repli
  { cx: 482, wickTop:  96, bodyY: 100, bodyH: 30, wickBottom: 138, type: "bull" }, // open 130 close 100
  { cx: 530, wickTop:  71, bodyY:  75, bodyH: 25, wickBottom: 108, type: "bull" }, // open 100 close 75
  { cx: 578, wickTop:  51, bodyY:  55, bodyH: 20, wickBottom:  82, type: "bull" }, // open 75 close 55 (~4 740)
];

const BODY_W = 14;

export function MacroFilterRegimeDiagram({ className = "" }: MacroFilterRegimeDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">XAU/USD · H4</text>

        {/* Ligne objectif 4 740 $ */}
        <line x1="40" y1="50" x2="660" y2="50" stroke="#10b981" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.55" />
        <rect x="6" y="42" width="62" height="13" rx="3" fill="#09090b" />
        <text x="37" y="52" fill="#10b981" fontSize="9" fontWeight="700" textAnchor="middle">4 740 $</text>

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

        {/* Marqueur "Signal bearish M15" sur la zone du 2e repli (autour de cx=290) */}
        <g>
          <line x1="290" y1="170" x2="290" y2="200" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
          <path d="M 285 192 L 290 200 L 295 192" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* Étiquette "Signal bearish M15" — collée à la pointe de la flèche, à droite */}
        <line x1="295" y1="200" x2="306" y2="195" stroke="#ef4444" strokeWidth="0.9" strokeOpacity="0.6" />
        <rect x="306" y="188" width="130" height="14" rx="3" fill="#09090b" />
        <rect x="306" y="188" width="130" height="14" rx="3" fill="#ef444418" stroke="#ef4444" strokeWidth="0.9" />
        <text x="371" y="198" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">Signal bearish M15</text>

        {/* Étiquette "Trade contre le régime dominant" — décalée en bas à gauche, dans la zone vide */}
        <rect x="70" y="250" width="210" height="14" rx="3" fill="#09090b" />
        <rect x="70" y="250" width="210" height="14" rx="3" fill="#ef444418" stroke="#ef4444" strokeWidth="0.9" />
        <text x="175" y="260" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">Trade contre le régime dominant</text>

        {/* Annotation amber */}
        <rect x="170" y="284" width="380" height="22" rx="11" fill="#09090b" />
        <rect x="170" y="284" width="380" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="360" y="298" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          Le contexte macro prime sur le signal local
        </text>
      </svg>

      {/* MOBILE : filtre macro régime ────────────────────── */}
      <div className="sm:hidden p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">Filtre macro régime · XAU/USD H4</p>
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
          <p className="text-[13px] font-bold text-emerald-400">Régime dominant bullish</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">La tendance macro continue — trades long privilégiés.</p>
        </div>
        <div className="rounded-lg border-2 border-red-500 bg-red-500/10 p-3">
          <p className="text-[13px] font-bold text-red-400">⚠ Signal bearish local = contre-régime</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">Trader contre le régime macro = à éviter, peu importe le setup local.</p>
        </div>
      </div>

      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">Régime dominant bullish — la tendance continue</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">Signal bearish local = trade à contre-sens du régime</span>
        </div>
      </div>
    </div>
  );
}

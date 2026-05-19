// Diagramme : une zone qui raconte une histoire (Leçon 3 multi-timeframe)
// EUR/USD H1 — 4 bougies haussières qui montent vers la bande FVG, puis 3 bougies baissières
// à mèches hautes qui matérialisent le rejet contre la zone.

interface ZoneHistoireDiagramProps {
  className?: string;
}

// Géométrie imposée : bande FVG y=58→98, 7 bougies cx=110→560 (espacement 75px), corps width 16px.
type CandleSpec = {
  cx: number;
  wickTop: number;
  wickBottom: number;
  bodyY: number;
  bodyH: number;
  type: "bull" | "bear";
};

const CANDLES: CandleSpec[] = [
  // 4 bougies haussières — progression vers la bande
  { cx: 110, wickTop: 240, wickBottom: 278, bodyY: 244, bodyH: 30, type: "bull" },
  { cx: 185, wickTop: 210, wickBottom: 250, bodyY: 214, bodyH: 32, type: "bull" },
  { cx: 260, wickTop: 180, wickBottom: 218, bodyY: 184, bodyH: 30, type: "bull" },
  { cx: 335, wickTop: 150, wickBottom: 192, bodyY: 154, bodyH: 34, type: "bull" },
  // 3 bougies baissières — mèches hautes pénètrent dans la bande FVG (y=58-98), corps sous la bande
  { cx: 410, wickTop: 78, wickBottom: 130, bodyY: 100, bodyH: 26, type: "bear" },
  { cx: 485, wickTop: 80, wickBottom: 134, bodyY: 104, bodyH: 26, type: "bear" },
  { cx: 560, wickTop: 82, wickBottom: 138, bodyY: 108, bodyH: 26, type: "bear" },
];

const BODY_W = 16;

export function ZoneHistoireDiagram({ className = "" }: ZoneHistoireDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">

        {/* Badge timeframe */}
        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">EUR/USD · H1</text>

        {/* Bande FVG bearish — bord haut y=58, bord bas y=98, x=60→640 */}
        <rect x="60" y="58" width="580" height="40" fill="#ef444418" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.7" />

        {/* Label "1.1760 — ancien support cassé" au-dessus de la bande */}
        <rect x="60" y="42" width="216" height="13" rx="3" fill="#09090b" />
        <text x="168" y="52" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">1.1760 — ancien support cassé</text>

        {/* Label "1.1750" à gauche, au niveau du bord bas */}
        <rect x="4" y="94" width="52" height="13" rx="3" fill="#09090b" />
        <text x="30" y="104" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">1.1750</text>

        {/* Label "FVG bearish" dans la bande, à droite */}
        <rect x="520" y="73" width="80" height="13" rx="3" fill="#09090b" />
        <text x="560" y="83" fill="#f59e0b" fontSize="9" fontWeight="600" textAnchor="middle">FVG bearish</text>

        {/* 7 bougies — aucune ligne reliante */}
        {CANDLES.map(({ cx, wickTop, wickBottom, bodyY, bodyH, type }, i) => {
          const bodyFill = type === "bull" ? "#10b981" : "#ef4444";
          const wickStroke = type === "bull" ? "#059669" : "#b91c1c";
          return (
            <g key={i}>
              <line x1={cx} y1={wickTop} x2={cx} y2={wickBottom} stroke={wickStroke} strokeWidth="1.4" strokeLinecap="round" />
              <rect x={cx - BODY_W / 2} y={bodyY} width={BODY_W} height={bodyH} fill={bodyFill} stroke={wickStroke} strokeWidth="1" rx="1" />
            </g>
          );
        })}

        {/* Annotation */}
        <rect x="190" y="260" width="320" height="22" rx="11" fill="#09090b" />
        <rect x="190" y="260" width="320" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="274" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          La zone concentre plusieurs raisons de réaction
        </text>
      </svg>

      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">Ancien support cassé = résistance</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500/40 border border-red-500" />
          <span className="text-[10px] text-zinc-500">FVG bearish non mitigé</span>
        </div>
      </div>
    </div>
  );
}

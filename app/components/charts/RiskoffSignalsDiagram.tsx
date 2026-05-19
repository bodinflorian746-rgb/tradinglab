// Diagramme : signaux concordants risk-off (Leçon 3 Macro Trading)
// 4 mini-vignettes (Indices / VIX / Dollar / XAU) en haut, graphique Daily XAU/USD haussier en bas.

interface RiskoffSignalsDiagramProps {
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

// Bougies Daily XAU/USD — tendance haussière de y=263 (~4 585) à y=117 (~4 705).
// Niveaux de prix successifs (open/close enchaînés) :
// 263 → 240 → 215 → 225 → 200 → 180 → 188 → 170 → 150 → 158 → 138 → 128 → 117
// Couleur déduite du mouvement : close < open en y (prix monte) → bull vert ;
// close > open en y (prix baisse) → bear rouge.
// 12 bougies espacées régulièrement (50 px) de x=70 à x=620.
const CANDLES: CandleSpec[] = [
  { cx:  70, wickTop: 236, bodyY: 240, bodyH: 23, wickBottom: 270, type: "bull" }, // open 263 close 240
  { cx: 120, wickTop: 211, bodyY: 215, bodyH: 25, wickBottom: 245, type: "bull" }, // open 240 close 215
  { cx: 170, wickTop: 211, bodyY: 215, bodyH: 10, wickBottom: 232, type: "bear" }, // open 215 close 225 — petit repli
  { cx: 220, wickTop: 196, bodyY: 200, bodyH: 25, wickBottom: 232, type: "bull" }, // open 225 close 200
  { cx: 270, wickTop: 176, bodyY: 180, bodyH: 20, wickBottom: 205, type: "bull" }, // open 200 close 180
  { cx: 320, wickTop: 176, bodyY: 180, bodyH:  8, wickBottom: 195, type: "bear" }, // open 180 close 188 — petit repli
  { cx: 370, wickTop: 166, bodyY: 170, bodyH: 18, wickBottom: 195, type: "bull" }, // open 188 close 170
  { cx: 420, wickTop: 146, bodyY: 150, bodyH: 20, wickBottom: 175, type: "bull" }, // open 170 close 150
  { cx: 470, wickTop: 146, bodyY: 150, bodyH:  8, wickBottom: 165, type: "bear" }, // open 150 close 158 — petit repli
  { cx: 520, wickTop: 134, bodyY: 138, bodyH: 20, wickBottom: 165, type: "bull" }, // open 158 close 138
  { cx: 570, wickTop: 124, bodyY: 128, bodyH: 10, wickBottom: 143, type: "bull" }, // open 138 close 128
  { cx: 620, wickTop: 113, bodyY: 117, bodyH: 11, wickBottom: 132, type: "bull" }, // open 128 close 117 (~4 705)
];

const BODY_W = 16;

// Petits pictogrammes-signaux (flèches simplifiées)
function ArrowDown({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x + 40} y2={y + 24} stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d={`M ${x + 32} ${y + 16} L ${x + 40} ${y + 24} L ${x + 32} ${y + 20}`} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function ArrowUp({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g>
      <line x1={x} y1={y + 24} x2={x + 40} y2={y} stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d={`M ${x + 32} ${y + 8} L ${x + 40} ${y} L ${x + 36} ${y + 8}`} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

export function RiskoffSignalsDiagram({ className = "" }: RiskoffSignalsDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">

        {/* 4 vignettes-signaux en haut */}
        <rect x="36" y="22" width="140" height="56" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
        <ArrowDown x={68} y={32} color="#ef4444" />
        <rect x="52" y="60" width="108" height="13" rx="3" fill="#09090b" />
        <text x="106" y="70" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">Indices actions</text>

        <rect x="190" y="22" width="140" height="56" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
        <ArrowUp x={222} y={32} color="#10b981" />
        <rect x="206" y="60" width="108" height="13" rx="3" fill="#09090b" />
        <text x="260" y="70" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">Volatilité (VIX)</text>

        <rect x="344" y="22" width="140" height="56" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
        <ArrowUp x={376} y={32} color="#10b981" />
        <rect x="360" y="60" width="108" height="13" rx="3" fill="#09090b" />
        <text x="414" y="70" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">Dollar</text>

        <rect x="498" y="22" width="140" height="56" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
        <ArrowUp x={530} y={32} color="#10b981" />
        <rect x="514" y="60" width="108" height="13" rx="3" fill="#09090b" />
        <text x="568" y="70" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">XAU/USD</text>

        {/* Séparateur entre vignettes et graphique */}
        <line x1="40" y1="82" x2="660" y2="82" stroke="#27272a" strokeWidth="1" strokeDasharray="2 4" />

        {/* Badge graphique — juste sous les vignettes */}
        <rect x="20" y="86" width="126" height="18" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="83" y="99" fill="#a1a1aa" fontSize="10" fontWeight="700" textAnchor="middle">XAU/USD · Daily</text>

        {/* Bougies XAU/USD */}
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

        {/* Label "4 585 $" — départ gauche, sous le wickBottom de c1 (y=270) */}
        <rect x="4" y="258" width="54" height="13" rx="3" fill="#09090b" />
        <text x="31" y="268" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">4 585 $</text>

        {/* Label "4 705 $" — au sommet final, à droite de c12 (cx=620, body x=612-628) */}
        <rect x="636" y="110" width="58" height="14" rx="3" fill="#09090b" />
        <text x="665" y="120" fill="#10b981" fontSize="9" fontWeight="700" textAnchor="middle">4 705 $</text>

        {/* Annotation */}
        <rect x="170" y="290" width="360" height="22" rx="11" fill="#09090b" />
        <rect x="170" y="290" width="360" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="304" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          Le régime se confirme par plusieurs marchés
        </text>
      </svg>

      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">4 signaux concordants = régime risk-off confirmé</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">L&apos;or monte avec le régime</span>
        </div>
      </div>
    </div>
  );
}

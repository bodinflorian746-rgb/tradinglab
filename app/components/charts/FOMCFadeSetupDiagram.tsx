// Diagramme : setup Fade FOMC (Leçon 1 Macro Trading)
// XAU/USD M15 — impulsion bearish 4 660 → 4 590, zone de stabilisation autour de 4 595,
// entrée long 4 600 $, SL 4 578 $, target 4 638 $.

interface FOMCFadeSetupDiagramProps {
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
// 4 660 $ ≈ y=60, 4 638 $ target ≈ y=110, 4 600 $ entry ≈ y=180, 4 590 $ low ≈ y=200, 4 578 $ SL ≈ y=225.
const CANDLES: CandleSpec[] = [
  // Pré-FOMC autour de y=60
  { cx:  50, wickTop:  52, bodyY:  58, bodyH: 10, wickBottom:  72, type: "bull" }, // close 58
  { cx:  80, wickTop:  54, bodyY:  58, bodyH:  8, wickBottom:  70, type: "bear" }, // open 58 close 66

  // Impulsion bearish — 3 bougies en chute vers y=200
  { cx: 115, wickTop:  60, bodyY:  66, bodyH: 59, wickBottom: 130, type: "bear" }, // open 66 close 125
  { cx: 150, wickTop: 120, bodyY: 125, bodyH: 50, wickBottom: 185, type: "bear" }, // open 125 close 175
  { cx: 185, wickTop: 170, bodyY: 175, bodyH: 25, wickBottom: 210, type: "bear" }, // open 175 close 200

  // Stabilisation autour de y=190 — bougies serrées
  { cx: 225, wickTop: 183, bodyY: 188, bodyH: 12, wickBottom: 205, type: "bull" }, // open 200 close 188
  { cx: 260, wickTop: 184, bodyY: 188, bodyH:  7, wickBottom: 200, type: "bear" }, // open 188 close 195
  { cx: 295, wickTop: 182, bodyY: 185, bodyH: 10, wickBottom: 200, type: "bull" }, // open 195 close 185
  { cx: 330, wickTop: 183, bodyY: 185, bodyH:  7, wickBottom: 198, type: "bear" }, // open 185 close 192

  // Fade — retour haussier vers la target y=110
  { cx: 365, wickTop: 168, bodyY: 170, bodyH: 22, wickBottom: 196, type: "bull" }, // open 192 close 170
  { cx: 400, wickTop: 143, bodyY: 145, bodyH: 25, wickBottom: 175, type: "bull" }, // open 170 close 145
  { cx: 435, wickTop: 143, bodyY: 145, bodyH: 10, wickBottom: 162, type: "bear" }, // open 145 close 155
  { cx: 470, wickTop: 128, bodyY: 130, bodyH: 25, wickBottom: 160, type: "bull" }, // open 155 close 130
  { cx: 505, wickTop: 113, bodyY: 115, bodyH: 15, wickBottom: 138, type: "bull" }, // open 130 close 115
  { cx: 540, wickTop: 113, bodyY: 115, bodyH:  5, wickBottom: 128, type: "bear" }, // open 115 close 120 (cible atteinte ~4 638)
];

const BODY_W = 12;

export function FOMCFadeSetupDiagram({ className = "" }: FOMCFadeSetupDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">XAU/USD · M15</text>

        {/* Ligne Target 4 638 $ (verte/gold horizontale) */}
        <line x1="40" y1="110" x2="660" y2="110" stroke="#10b981" strokeWidth="1.2" strokeDasharray="5 3" strokeOpacity="0.8" />
        <rect x="546" y="98" width="110" height="13" rx="3" fill="#09090b" />
        <text x="601" y="108" fill="#10b981" fontSize="9" fontWeight="700" textAnchor="middle">Target 4 638 $</text>

        {/* Ligne Entrée long 4 600 $ (bleue) */}
        <line x1="40" y1="180" x2="660" y2="180" stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="4 2" strokeOpacity="0.85" />
        <rect x="540" y="168" width="118" height="13" rx="3" fill="#09090b" />
        <text x="599" y="178" fill="#60a5fa" fontSize="9" fontWeight="700" textAnchor="middle">Entrée long 4 600 $</text>

        {/* Ligne SL 4 578 $ (rouge pointillée) */}
        <line x1="40" y1="225" x2="660" y2="225" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="5 3" strokeOpacity="0.85" />
        <rect x="558" y="228" width="98" height="13" rx="3" fill="#09090b" />
        <text x="607" y="238" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">SL 4 578 $</text>

        {/* Zone de stabilisation — rectangle léger autour de y=185-200, x=210-345 */}
        <rect x="210" y="183" width="135" height="22" fill="#27272a40" stroke="#71717a" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.85" />

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

        {/* Annotation "Excès" — pointe la chute / creux */}
        <rect x="138" y="246" width="58" height="13" rx="3" fill="#09090b" />
        <text x="167" y="256" fill="#71717a" fontSize="9" fontWeight="700" textAnchor="middle">Excès</text>

        {/* Annotation "Stabilisation" — au-dessus du rectangle */}
        <rect x="220" y="164" width="116" height="13" rx="3" fill="#09090b" />
        <text x="278" y="174" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">Stabilisation</text>

        {/* Annotation "Fade" — au-dessus du retour haussier */}
        <rect x="404" y="74" width="58" height="13" rx="3" fill="#09090b" />
        <rect x="404" y="74" width="58" height="13" rx="3" fill="#f59e0b18" stroke="#f59e0b" strokeWidth="0.9" />
        <text x="433" y="84" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">Fade</text>
      </svg>

      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-zinc-500" />
          <span className="text-[10px] text-zinc-500">Excès puis stabilisation = condition du fade</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-blue-400" />
          <span className="text-[10px] text-zinc-500">Fade vers un retour partiel, pas un retournement complet</span>
        </div>
      </div>
    </div>
  );
}

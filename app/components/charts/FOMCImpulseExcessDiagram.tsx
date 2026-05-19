// Diagramme : impulsion FOMC excessive (Leçon 1 Macro Trading)
// XAU/USD M15 — prix stable autour de 4 660 $, grande bougie FOMC bearish jusqu'à 4 590 $
// qui casse un support, puis retour progressif vers 4 638 $ (retour de balancier).

interface FOMCImpulseExcessDiagramProps {
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
// 4 660 $ ≈ y=80, 4 638 $ ≈ y=128, support 4 620 $ ≈ y=170, 4 590 $ ≈ y=232.
const CANDLES: CandleSpec[] = [
  // Pré-FOMC — bougies serrées autour de y=80
  { cx:  60, wickTop:  72, bodyY:  76, bodyH: 14, wickBottom:  94, type: "bull" }, // close 76
  { cx:  92, wickTop:  72, bodyY:  76, bodyH: 12, wickBottom:  93, type: "bear" }, // open 76 close 88
  { cx: 124, wickTop:  72, bodyY:  78, bodyH: 10, wickBottom:  94, type: "bull" }, // open 88 close 78
  { cx: 156, wickTop:  74, bodyY:  78, bodyH: 14, wickBottom:  96, type: "bear" }, // open 78 close 92

  // GRANDE bougie FOMC bearish — chute massive de 92 à 232 (4 660 → 4 590)
  { cx: 200, wickTop:  85, bodyY:  92, bodyH: 140, wickBottom: 242, type: "bear" }, // open 92 close 232

  // Retour de balancier — bougies majoritairement haussières remontant vers y=128 (4 638)
  { cx: 242, wickTop: 205, bodyY: 210, bodyH: 22, wickBottom: 240, type: "bull" }, // open 232 close 210
  { cx: 274, wickTop: 205, bodyY: 210, bodyH: 10, wickBottom: 228, type: "bear" }, // open 210 close 220
  { cx: 306, wickTop: 190, bodyY: 195, bodyH: 25, wickBottom: 228, type: "bull" }, // open 220 close 195
  { cx: 338, wickTop: 165, bodyY: 170, bodyH: 25, wickBottom: 200, type: "bull" }, // open 195 close 170
  { cx: 370, wickTop: 167, bodyY: 170, bodyH: 15, wickBottom: 192, type: "bear" }, // open 170 close 185
  { cx: 402, wickTop: 155, bodyY: 160, bodyH: 25, wickBottom: 192, type: "bull" }, // open 185 close 160
  { cx: 434, wickTop: 136, bodyY: 140, bodyH: 20, wickBottom: 168, type: "bull" }, // open 160 close 140
  { cx: 466, wickTop: 138, bodyY: 140, bodyH:  8, wickBottom: 156, type: "bear" }, // open 140 close 148
  { cx: 498, wickTop: 124, bodyY: 128, bodyH: 20, wickBottom: 152, type: "bull" }, // open 148 close 128 (~4 638)
  { cx: 530, wickTop: 124, bodyY: 128, bodyH:  4, wickBottom: 138, type: "bear" }, // open 128 close 132
];

const BODY_W = 12;

export function FOMCImpulseExcessDiagram({ className = "" }: FOMCImpulseExcessDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">XAU/USD · M15</text>

        {/* Ligne de support 4 620 $ (cassée par la grande bougie FOMC) */}
        <line x1="40" y1="170" x2="660" y2="170" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="5 3" strokeOpacity="0.8" />
        <rect x="556" y="158" width="92" height="13" rx="3" fill="#09090b" />
        <text x="602" y="168" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">Support 4 620 $</text>

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

        {/* Label "4 660 $ — avant FOMC" en haut à gauche */}
        <rect x="6" y="62" width="148" height="13" rx="3" fill="#09090b" />
        <text x="80" y="72" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">4 660 $ — avant FOMC</text>

        {/* Label "4 590 $" au creux de l'impulsion */}
        <rect x="146" y="246" width="56" height="13" rx="3" fill="#09090b" />
        <text x="174" y="256" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">4 590 $</text>

        {/* Label "4 638 $" au sommet du retour */}
        <rect x="466" y="114" width="56" height="13" rx="3" fill="#09090b" />
        <text x="494" y="124" fill="#10b981" fontSize="9" fontWeight="700" textAnchor="middle">4 638 $</text>

        {/* Annotation "Impulsion émotionnelle" — à GAUCHE de la grande bougie FOMC */}
        <rect x="58" y="120" width="130" height="14" rx="3" fill="#09090b" />
        <rect x="58" y="120" width="130" height="14" rx="3" fill="#f59e0b18" stroke="#f59e0b" strokeWidth="0.9" />
        <text x="123" y="130" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">Impulsion émotionnelle</text>
        <line x1="188" y1="127" x2="194" y2="127" stroke="#f59e0b" strokeWidth="0.9" strokeOpacity="0.7" />

        {/* Annotation "Retour de balancier" — pointe la remontée */}
        <rect x="396" y="36" width="124" height="14" rx="3" fill="#09090b" />
        <rect x="396" y="36" width="124" height="14" rx="3" fill="#f59e0b18" stroke="#f59e0b" strokeWidth="0.9" />
        <text x="458" y="46" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">Retour de balancier</text>
        <line x1="458" y1="50" x2="458" y2="120" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="3 2" strokeOpacity="0.6" />
      </svg>

      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">Impulsion FOMC excessive, casse du support</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">Retour de balancier après l&apos;excès</span>
        </div>
      </div>
    </div>
  );
}

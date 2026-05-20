// Diagramme : essoufflement d'une impulsion FOMC (Leçon 1 Macro Trading)
// XAU/USD M15 — impulsion bullish 4 640 → 4 705 $, puis 3-4 bougies à longues mèches hautes
// qui n'arrivent pas à dépasser 4 705 $, puis correction vers 4 670 $.

interface FOMCExhaustionDiagramProps {
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
// 4 705 $ ≈ y=50 (résistance), 4 670 $ ≈ y=120, 4 640 $ ≈ y=180.
const CANDLES: CandleSpec[] = [
  // Pré-impulsion — bougies plates autour de y=180-190
  { cx:  50, wickTop: 176, bodyY: 180, bodyH: 14, wickBottom: 200, type: "bull" }, // close 180
  { cx:  85, wickTop: 178, bodyY: 180, bodyH: 10, wickBottom: 198, type: "bear" }, // open 180 close 190

  // Impulsion bullish — 4 grandes bougies vertes 190 → 60
  { cx: 120, wickTop: 155, bodyY: 160, bodyH: 30, wickBottom: 195, type: "bull" }, // open 190 close 160
  { cx: 155, wickTop: 120, bodyY: 125, bodyH: 35, wickBottom: 165, type: "bull" }, // open 160 close 125
  { cx: 190, wickTop:  85, bodyY:  90, bodyH: 35, wickBottom: 132, type: "bull" }, // open 125 close 90
  { cx: 225, wickTop:  50, bodyY:  60, bodyH: 30, wickBottom:  98, type: "bull" }, // open 90 close 60 (mèche touche 4 705)

  // Sommet — 3 bougies à longues mèches hautes (résistance 4 705 = y=50)
  { cx: 265, wickTop:  50, bodyY:  60, bodyH: 10, wickBottom:  82, type: "bear" }, // open 60 close 70
  { cx: 300, wickTop:  50, bodyY:  62, bodyH:  8, wickBottom:  82, type: "bull" }, // open 70 close 62
  { cx: 335, wickTop:  50, bodyY:  62, bodyH: 16, wickBottom:  88, type: "bear" }, // open 62 close 78

  // Correction bearish vers y=125 (4 670 $)
  { cx: 375, wickTop:  74, bodyY:  78, bodyH: 18, wickBottom: 105, type: "bear" }, // open 78 close 96
  { cx: 415, wickTop:  92, bodyY:  96, bodyH: 14, wickBottom: 118, type: "bear" }, // open 96 close 110
  { cx: 455, wickTop:  98, bodyY: 102, bodyH:  8, wickBottom: 118, type: "bull" }, // open 110 close 102 (petit reverse)
  { cx: 495, wickTop: 100, bodyY: 102, bodyH: 15, wickBottom: 125, type: "bear" }, // open 102 close 117
  { cx: 535, wickTop: 115, bodyY: 117, bodyH:  8, wickBottom: 132, type: "bear" }, // open 117 close 125
  { cx: 575, wickTop: 118, bodyY: 122, bodyH:  6, wickBottom: 135, type: "bull" }, // open 125 close 122
];

const BODY_W = 12;

export function FOMCExhaustionDiagram({ className = "" }: FOMCExhaustionDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">XAU/USD · M15</text>

        {/* Ligne de résistance 4 705 $ (sommet répété) */}
        <line x1="40" y1="50" x2="660" y2="50" stroke="#ef4444" strokeWidth="1.3" strokeDasharray="5 3" strokeOpacity="0.85" />
        <rect x="600" y="38" width="58" height="13" rx="3" fill="#09090b" />
        <text x="629" y="48" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">4 705 $</text>

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

        {/* Label "4 640 $" au départ de l'impulsion */}
        <rect x="18" y="200" width="58" height="13" rx="3" fill="#09090b" />
        <text x="47" y="210" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">4 640 $</text>

        {/* Label "4 670 $" à la fin de la correction */}
        <rect x="550" y="130" width="58" height="13" rx="3" fill="#09090b" />
        <text x="579" y="140" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">4 670 $</text>

        {/* Annotation amber */}
        <rect x="170" y="290" width="360" height="22" rx="11" fill="#09090b" />
        <rect x="170" y="290" width="360" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="304" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          L&apos;impulsion ralentit avant le retour
        </text>
      </svg>

      {/* MOBILE : FOMC exhaustion ──────────────────────── */}
      <div className="sm:hidden p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">FOMC essoufflement · XAU/USD M15</p>
        <div className="rounded-lg border border-amber-400/40 bg-amber-400/8 p-3">
          <p className="text-[13px] font-bold text-amber-400">Mèches de rejet répétées au sommet</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">Plusieurs bougies montrent un refus à monter plus haut.</p>
        </div>
        <div className="rounded-lg border border-red-500/40 bg-red-500/8 p-3">
          <p className="text-[13px] font-bold text-red-400">Perte d'accélération = essoufflement</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">L'impulsion FOMC s'essouffle → conditions pour un fade bearish.</p>
        </div>
      </div>

      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">Mèches de rejet répétées au sommet</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">Perte d&apos;accélération = essoufflement</span>
        </div>
      </div>
    </div>
  );
}

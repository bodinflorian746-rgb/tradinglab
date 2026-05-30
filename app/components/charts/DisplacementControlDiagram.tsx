// Diagramme : contraste consolidation vs displacement (Leçon 4 ICT)
// XAU/USD — à gauche consolidation lente autour de 4 650 $, à droite displacement bearish violent
// (sweep à 4 668 $ puis chute jusqu'à 4 608 $).

interface DisplacementControlDiagramProps {
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
  // PHASE 1 — consolidation lente autour de y=160 (4 650 $)
  { cx:  60, wickTop: 156, bodyY: 160, bodyH:  8, wickBottom: 172, type: "bull" },
  { cx:  90, wickTop: 162, bodyY: 168, bodyH:  6, wickBottom: 178, type: "bear" },
  { cx: 120, wickTop: 158, bodyY: 162, bodyH:  8, wickBottom: 174, type: "bull" },
  { cx: 150, wickTop: 158, bodyY: 162, bodyH:  6, wickBottom: 172, type: "bear" },
  { cx: 180, wickTop: 156, bodyY: 160, bodyH:  6, wickBottom: 170, type: "bull" },
  { cx: 210, wickTop: 158, bodyY: 162, bodyH:  8, wickBottom: 175, type: "bear" },
  { cx: 240, wickTop: 154, bodyY: 158, bodyH:  6, wickBottom: 168, type: "bull" },
  { cx: 270, wickTop: 156, bodyY: 158, bodyH:  8, wickBottom: 172, type: "bear" },

  // SWEEP — mèche qui dépasse vers y=82, sommet 4 668 $
  { cx: 310, wickTop:  82, bodyY: 100, bodyH: 60, wickBottom: 168, type: "bull" }, // bougie haussière qui sweep

  // DISPLACEMENT bearish — grandes bougies rouges, continuité prix (close de la précédente = open de la suivante)
  { cx: 350, wickTop:  98, bodyY: 100, bodyH: 50, wickBottom: 158, type: "bear" }, // open 100 close 150
  { cx: 390, wickTop: 148, bodyY: 150, bodyH: 45, wickBottom: 202, type: "bear" }, // open 150 close 195
  { cx: 430, wickTop: 192, bodyY: 195, bodyH: 35, wickBottom: 238, type: "bear" }, // open 195 close 230
  { cx: 470, wickTop: 228, bodyY: 230, bodyH: 22, wickBottom: 258, type: "bear" }, // open 230 close 252
  { cx: 510, wickTop: 250, bodyY: 252, bodyH: 12, wickBottom: 268, type: "bear" }, // open 252 close 264
  { cx: 550, wickTop: 261, bodyY: 264, bodyH:  8, wickBottom: 275, type: "bear" }, // open 264 close 272
];

const BODY_W = 14;

export function DisplacementControlDiagram({ className = "" }: DisplacementControlDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">XAU/USD · M15</text>

        {/* Séparateur léger entre les 2 phases */}
        <line x1="290" y1="50" x2="290" y2="278" stroke="#27272a" strokeWidth="1" strokeDasharray="2 4" />

        {/* Étiquette phase 1 */}
        <rect x="78" y="50" width="124" height="14" rx="3" fill="#09090b" />
        <text x="140" y="60" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">Consolidation lente</text>

        {/* Étiquette phase 2 — décalée en haut à droite, hors de la zone du label "4 668 $" */}
        <rect x="460" y="22" width="124" height="14" rx="3" fill="#09090b" />
        <rect x="460" y="22" width="124" height="14" rx="3" fill="#f59e0b18" stroke="#f59e0b" strokeWidth="0.9" />
        <text x="522" y="32" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">Displacement bearish</text>

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

        {/* Label "4 650 $" sur la zone de consolidation */}
        <rect x="42" y="186" width="62" height="13" rx="3" fill="#09090b" />
        <text x="73" y="196" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">4 650 $</text>

        {/* Label "4 668 $" au sommet du sweep */}
        <line x1="312" y1="80" x2="345" y2="68" stroke="#f59e0b" strokeWidth="0.9" strokeOpacity="0.7" />
        <rect x="345" y="58" width="62" height="14" rx="3" fill="#09090b" />
        <text x="376" y="68" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">4 668 $</text>

        {/* Label "4 608 $" en bas */}
        <rect x="570" y="266" width="62" height="13" rx="3" fill="#09090b" />
        <text x="601" y="276" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">4 608 $</text>

        {/* Annotation */}
        <rect x="170" y="290" width="360" height="22" rx="11" fill="#09090b" />
        <rect x="170" y="290" width="360" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="304" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          Le marché passe d&apos;équilibré à agressif
        </text>
      </svg>

      {/* MOBILE : displacement control ─────────────────── */}
      <div className="sm:hidden p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">Displacement = prise de contrôle · XAU/USD M15</p>

        {/* Mini-SVG : bougies courtes (équilibre) suivies d'une grosse bougie (displacement) */}
        <svg viewBox="0 0 280 100" className="w-full h-auto" aria-label="Displacement contrôle" fill="none">
          {/* Petites bougies — équilibre */}
          {[20, 40, 60, 80, 100, 120].map((x, i) => {
            const bull = i % 2 === 0;
            const y = 45 + (i % 3) * 4;
            return (
              <g key={x}>
                <line x1={x} y1={y - 5} x2={x} y2={y + 18} stroke={bull ? "#059669" : "#dc2626"} strokeWidth="1" strokeLinecap="round" />
                <rect x={x - 4} y={y} width="8" height="13" fill={bull ? "#10b981" : "#ef4444"} stroke={bull ? "#059669" : "#dc2626"} strokeWidth="0.6" rx="0.8" />
              </g>
            );
          })}
          <text x="70" y="92" fontSize="9" fill="#a1a1aa" textAnchor="middle">Équilibre</text>
          {/* Séparateur */}
          <line x1="150" y1="20" x2="150" y2="80" stroke="#3f3f46" strokeWidth="0.8" strokeDasharray="2 2" />
          {/* Displacement : grande bougie bullish puissante */}
          <line x1="190" y1="15" x2="190" y2="80" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" />
          <rect x="180" y="22" width="20" height="55" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1.5" />
          <rect x="160" y="2" width="80" height="13" rx="2" fill="#10b98115" stroke="#10b98155" strokeWidth="0.7" />
          <text x="200" y="11" fontSize="9" fill="#10b981" textAnchor="middle" fontWeight="700">DISPLACEMENT</text>
          <text x="200" y="92" fontSize="9" fill="#10b981" textAnchor="middle">Prise de contrôle ↑</text>
        </svg>

        <div className="rounded-lg border border-zinc-600 bg-zinc-800/40 p-3">
          <p className="text-[13px] font-bold text-zinc-300">Phase lente — équilibre</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">Bougies courtes, aucune prise de contrôle visible.</p>
        </div>
        <div className="rounded-lg border-2 border-red-500 bg-red-500/8 p-3">
          <p className="text-[13px] font-bold text-red-400">Displacement — déséquilibre franc</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">Grandes bougies directionnelles = institutions prennent le contrôle, suivre la direction.</p>
        </div>
      </div>

      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-zinc-500" />
          <span className="text-[10px] text-zinc-500">Phase lente = équilibre, aucune prise de contrôle</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">Displacement = prise de contrôle, déséquilibre</span>
        </div>
      </div>
    </div>
  );
}

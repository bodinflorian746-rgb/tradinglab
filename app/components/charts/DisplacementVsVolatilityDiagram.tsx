// Diagramme : volatilité ≠ displacement (Leçon 4 ICT)
// EUR/USD — à gauche une grande bougie verte isolée immédiatement rejetée sans suite ;
// à droite un vrai displacement (sweep + suite de grandes bougies baissières + cassures).

interface DisplacementVsVolatilityDiagramProps {
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
  // PARTIE GAUCHE — volatilité sans suite
  // Pré-bougie : bougies plates
  { cx:  50, wickTop: 165, bodyY: 168, bodyH:  8, wickBottom: 180, type: "bear" },
  { cx:  80, wickTop: 168, bodyY: 170, bodyH:  6, wickBottom: 180, type: "bull" },
  { cx: 110, wickTop: 166, bodyY: 168, bodyH:  8, wickBottom: 180, type: "bear" },
  // GRANDE bougie verte isolée
  { cx: 145, wickTop:  88, bodyY:  95, bodyH: 75, wickBottom: 178, type: "bull" }, // grosse bougie volatile
  // Rejet immédiat — le prix revient d'où il vient
  { cx: 180, wickTop:  92, bodyY:  95, bodyH: 70, wickBottom: 175, type: "bear" }, // gros corps bear referme
  // Latéralisation post-rejet — pas de continuité, le prix reste plat
  { cx: 215, wickTop: 163, bodyY: 165, bodyH:  8, wickBottom: 178, type: "bull" },
  { cx: 245, wickTop: 165, bodyY: 168, bodyH:  6, wickBottom: 178, type: "bear" },
  { cx: 275, wickTop: 162, bodyY: 165, bodyH:  8, wickBottom: 178, type: "bull" },
  { cx: 305, wickTop: 165, bodyY: 168, bodyH:  6, wickBottom: 178, type: "bear" },

  // PARTIE DROITE — vrai displacement
  // Approche
  { cx: 360, wickTop: 155, bodyY: 160, bodyH: 15, wickBottom: 180, type: "bull" },
  { cx: 390, wickTop: 130, bodyY: 135, bodyH: 25, wickBottom: 165, type: "bull" },
  // SWEEP — mèche au-dessus, corps referme sous
  { cx: 420, wickTop:  90, bodyY: 122, bodyH: 14, wickBottom: 150, type: "bear" },
  // Cassure et displacement bearish — grandes bougies, continuité prix (cassent les creux)
  { cx: 455, wickTop: 134, bodyY: 136, bodyH: 50, wickBottom: 192, type: "bear" }, // open 136 close 186 (casse les creux gauche)
  { cx: 490, wickTop: 184, bodyY: 186, bodyH: 42, wickBottom: 232, type: "bear" }, // open 186 close 228
  { cx: 525, wickTop: 226, bodyY: 228, bodyH: 30, wickBottom: 262, type: "bear" }, // open 228 close 258
  { cx: 560, wickTop: 256, bodyY: 258, bodyH: 18, wickBottom: 280, type: "bear" }, // open 258 close 276
  { cx: 595, wickTop: 274, bodyY: 276, bodyH: 10, wickBottom: 290, type: "bear" }, // open 276 close 286
];

const BODY_W = 12;

export function DisplacementVsVolatilityDiagram({ className = "" }: DisplacementVsVolatilityDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">EUR/USD · M15</text>

        {/* Séparateur entre les 2 parties */}
        <line x1="335" y1="50" x2="335" y2="295" stroke="#27272a" strokeWidth="1" strokeDasharray="2 4" />

        {/* Étiquette gauche */}
        <rect x="78" y="50" width="134" height="14" rx="3" fill="#09090b" />
        <text x="145" y="60" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle">Volatilité sans suite</text>

        {/* Étiquette droite */}
        <rect x="408" y="50" width="124" height="14" rx="3" fill="#09090b" />
        <rect x="408" y="50" width="124" height="14" rx="3" fill="#f59e0b18" stroke="#f59e0b" strokeWidth="0.9" />
        <text x="470" y="60" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">Vrai displacement</text>

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

        {/* Petite étiquette "Rejet" pour la partie gauche */}
        <rect x="182" y="92" width="56" height="13" rx="3" fill="#09090b" />
        <text x="210" y="102" fill="#71717a" fontSize="9" fontWeight="700" textAnchor="middle">Rejet</text>

        {/* Étiquette "Continuité" pour la partie droite */}
        <rect x="500" y="200" width="80" height="13" rx="3" fill="#09090b" />
        <text x="540" y="210" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">Continuité</text>
      </svg>

      <div className="px-4 pt-1">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1 inline-block">
          <span className="text-[10px] text-amber-400 font-bold">Volatilité ≠ displacement</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 px-4 py-2.5 mt-2 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-zinc-500" />
          <span className="text-[10px] text-zinc-500">Grande bougie isolée + rejet = pas de continuité</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">Displacement = cassure de structure + continuation</span>
        </div>
      </div>
    </div>
  );
}

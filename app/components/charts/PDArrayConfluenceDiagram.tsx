// Diagramme : confluence de PD Arrays (Leçon 2 ICT)
// EUR/USD H1 — une seule zone de confluence (1.1780), 3 étiquettes réparties le long de la bande
// (support cassé à gauche, FVG bearish au centre, sweep récent à droite avec mèche), puis rejet bearish.

interface PDArrayConfluenceDiagramProps {
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
  // Approche
  { cx:  70, wickTop: 215, bodyY: 220, bodyH: 18, wickBottom: 238, type: "bull" },
  { cx: 115, wickTop: 145, bodyY: 150, bodyH: 45, wickBottom: 200, type: "bull" },
  { cx: 160, wickTop: 100, bodyY: 105, bodyH: 45, wickBottom: 152, type: "bull" },
  { cx: 205, wickTop:  67, bodyY:  72, bodyH: 33, wickBottom: 110, type: "bull" },
  // Entrée dans la zone
  { cx: 250, wickTop:  55, bodyY:  58, bodyH: 18, wickBottom:  82, type: "bull" },
  { cx: 295, wickTop:  52, bodyY:  55, bodyH: 12, wickBottom:  74, type: "bull" },
  // Petit reverse dans la zone
  { cx: 340, wickTop:  58, bodyY:  62, bodyH: 22, wickBottom:  85, type: "bear" },
  { cx: 385, wickTop:  60, bodyY:  62, bodyH: 16, wickBottom:  82, type: "bull" },
  // SWEEP — mèche qui dépasse le bord haut de la bande
  { cx: 430, wickTop:  42, bodyY:  62, bodyH: 22, wickBottom:  88, type: "bull" },
  // REJET bearish franc
  { cx: 475, wickTop:  75, bodyY:  82, bodyH: 70, wickBottom: 158, type: "bear" },
  { cx: 520, wickTop: 152, bodyY: 155, bodyH: 50, wickBottom: 210, type: "bear" },
  { cx: 565, wickTop: 205, bodyY: 210, bodyH: 38, wickBottom: 252, type: "bear" },
];

const BODY_W = 12;

export function PDArrayConfluenceDiagram({ className = "" }: PDArrayConfluenceDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">

        <style>{`
          @media (max-width: 640px) {
            .chart-detail-labels { display: none; }
          }
          @media (min-width: 641px) {
            .chart-mobile-markers { display: none; }
          }
        `}</style>

        {/* Badge instrument — toujours visible */}
        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">EUR/USD · H1</text>

        {/* Zone confluente — toujours visible (zone graphique) */}
        <rect x="40" y="55" width="600" height="40" fill="#ef444422" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="5 3" strokeOpacity="0.85" />

        {/* Bougies — toujours visibles */}
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

        {/* Labels détaillés — masqués sur mobile, remplacés par les bullets HTML en dessous */}
        <g className="chart-detail-labels">

          {/* Label "1.1780" à gauche, dans la bande */}
          <rect x="44" y="68" width="56" height="14" rx="3" fill="#09090b" />
          <text x="72" y="78" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">1.1780</text>

          {/* Étiquette "Ancien support cassé" — posée sur le bord haut de la bande, à gauche, sous le badge titre */}
          <rect x="58" y="44" width="130" height="14" rx="3" fill="#09090b" />
          <rect x="58" y="44" width="130" height="14" rx="3" fill="#f59e0b18" stroke="#f59e0b" strokeWidth="0.9" />
          <text x="123" y="54" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">Ancien support cassé</text>

          {/* Étiquette "FVG bearish" — juste sous la bande, au centre, dans un espace libre sans corps de bougie */}
          <line x1="320" y1="100" x2="320" y2="95" stroke="#f59e0b" strokeWidth="0.9" strokeOpacity="0.7" />
          <rect x="270" y="100" width="100" height="14" rx="3" fill="#09090b" />
          <rect x="270" y="100" width="100" height="14" rx="3" fill="#f59e0b18" stroke="#f59e0b" strokeWidth="0.9" />
          <text x="320" y="110" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">FVG bearish</text>

          {/* Étiquette "Sweep récent" — au-dessus de la bande, reliée à la mèche du sweep (cx=430, wickTop=42) */}
          <line x1="430" y1="36" x2="430" y2="42" stroke="#f59e0b" strokeWidth="0.9" strokeOpacity="0.8" />
          <rect x="380" y="22" width="100" height="14" rx="3" fill="#09090b" />
          <rect x="380" y="22" width="100" height="14" rx="3" fill="#f59e0b18" stroke="#f59e0b" strokeWidth="0.9" />
          <text x="430" y="32" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">Sweep récent</text>

          {/* Annotation */}
          <rect x="170" y="294" width="360" height="22" rx="11" fill="#09090b" />
          <rect x="170" y="294" width="360" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
          <text x="350" y="308" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
            Plusieurs éléments racontent la même histoire
          </text>

        </g>

        {/* Repères mobile — placement pédagogique : à côté de la cible, jamais sur bougie / badge / mèche-clé */}
        <g className="chart-mobile-markers">
          {/* ① Zone confluente — dans le coin GAUCHE de la bande (zone large, marqué dans un coin) */}
          <circle cx="60" cy="70" r="16" fill="#18181b" fillOpacity="0.92" stroke="#fbbf24" strokeWidth="1.5" />
          <text x="60" y="70" fill="#fbbf24" fontSize="16" fontWeight="700" textAnchor="middle" dominantBaseline="central">1</text>

          {/* ② Sweep récent — décalé à DROITE de la mèche de sweep (cx=430) pour ne pas la couvrir */}
          <circle cx="460" cy="24" r="16" fill="#18181b" fillOpacity="0.92" stroke="#fbbf24" strokeWidth="1.5" />
          <text x="460" y="24" fill="#fbbf24" fontSize="16" fontWeight="700" textAnchor="middle" dominantBaseline="central">2</text>

          {/* ③ Rejet bearish — à DROITE de c10 (cx=475) qui démarre la chute, dans espace vide */}
          <circle cx="510" cy="110" r="16" fill="#18181b" fillOpacity="0.92" stroke="#fbbf24" strokeWidth="1.5" />
          <text x="510" y="110" fill="#fbbf24" fontSize="16" fontWeight="700" textAnchor="middle" dominantBaseline="central">3</text>

          {/* ④ Continuation bearish — à DROITE de la dernière bougie (c12 cx=565), dans espace libre */}
          <circle cx="620" cy="230" r="16" fill="#18181b" fillOpacity="0.92" stroke="#fbbf24" strokeWidth="1.5" />
          <text x="620" y="230" fill="#fbbf24" fontSize="16" fontWeight="700" textAnchor="middle" dominantBaseline="central">4</text>
        </g>
      </svg>

      {/* Mobile : explications en bullets numérotés (rappel des repères ①②③④ dans le chart) */}
      <ul className="sm:hidden px-4 py-3 space-y-2 border-t border-zinc-800/50 text-[13px] leading-snug">
        <li className="flex items-start gap-2.5">
          <span className="text-amber-400 font-bold shrink-0 tabular-nums">①</span>
          <span className="text-white">Zone confluente à <span className="font-semibold">1.1780</span> (support cassé + FVG + sweep)</span>
        </li>
        <li className="flex items-start gap-2.5">
          <span className="text-amber-400 font-bold shrink-0 tabular-nums">②</span>
          <span className="text-white">Sweep récent au-dessus de la zone (mèche dépasse)</span>
        </li>
        <li className="flex items-start gap-2.5">
          <span className="text-amber-400 font-bold shrink-0 tabular-nums">③</span>
          <span className="text-white">Rejet bearish franc dès le retour dans la zone</span>
        </li>
        <li className="flex items-start gap-2.5">
          <span className="text-amber-400 font-bold shrink-0 tabular-nums">④</span>
          <span className="text-zinc-300">Continuation bearish vers les niveaux inférieurs</span>
        </li>
      </ul>

      {/* Desktop : légende couleur condensée */}
      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">Confluence (support cassé + FVG + sweep) = zone forte</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">Rejet bearish franc dès le retour dans la zone</span>
        </div>
      </div>
    </div>
  );
}

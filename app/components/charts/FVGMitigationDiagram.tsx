// Diagramme : mitigation d'un FVG avant continuation (Leçon 2 ICT)
// XAU/USD H1 — séquence en 3 phases : impulsion bearish à grands corps (gauche),
// retour haussier dans le FVG (centre), rejet bearish et continuation (droite).

interface FVGMitigationDiagramProps {
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
  // 15 bougies, espacement régulier ~39 px de x=70 à x=620.
  // Continuité prix : l'ouverture de chaque bougie = la clôture de la précédente.
  // Bear : open = bodyY (haut), close = bodyY+bodyH (bas). Bull : open = bodyY+bodyH (bas), close = bodyY (haut).

  // PHASE 1 — impulsion bearish (5 rouges). Clôtures successives : 100 → 148 → 195 → 235 → 260.
  { cx:  70, wickTop:  45, bodyY:  50, bodyH: 50, wickBottom: 105, type: "bear" }, // open 50, close 100, sommet y=45
  { cx: 109, wickTop:  96, bodyY: 100, bodyH: 48, wickBottom: 152, type: "bear" }, // open 100, close 148
  { cx: 149, wickTop: 145, bodyY: 148, bodyH: 47, wickBottom: 200, type: "bear" }, // open 148, close 195
  { cx: 188, wickTop: 192, bodyY: 195, bodyH: 40, wickBottom: 240, type: "bear" }, // open 195, close 235 (sous la bande)
  { cx: 227, wickTop: 232, bodyY: 235, bodyH: 25, wickBottom: 265, type: "bear" }, // open 235, close 260 (bas du mouvement)

  // PHASE 2 — retour dans le FVG (5 vertes). Clôtures successives : 200 → 148 → 138 → 128 → 122.
  { cx: 266, wickTop: 195, bodyY: 200, bodyH: 60, wickBottom: 265, type: "bull" }, // open 260, close 200
  { cx: 306, wickTop: 143, bodyY: 148, bodyH: 52, wickBottom: 205, type: "bull" }, // open 200, close 148 (touche bord bas de la bande)
  { cx: 345, wickTop: 134, bodyY: 138, bodyH: 10, wickBottom: 152, type: "bull" }, // corps DANS la bande (138-148)
  { cx: 384, wickTop: 124, bodyY: 128, bodyH: 10, wickBottom: 142, type: "bull" }, // corps DANS la bande (128-138)
  { cx: 424, wickTop: 118, bodyY: 122, bodyH:  6, wickBottom: 132, type: "bull" }, // corps DANS la bande (122-128), atteint bord haut

  // PHASE 3 — rejet et continuation bearish (5 rouges). Clôtures successives : 180 → 220 → 240 → 253 → 263.
  { cx: 463, wickTop: 118, bodyY: 122, bodyH: 58, wickBottom: 185, type: "bear" }, // open 122 (bord haut bande), close 180 — gros rejet
  { cx: 502, wickTop: 178, bodyY: 180, bodyH: 40, wickBottom: 225, type: "bear" }, // open 180, close 220
  { cx: 541, wickTop: 218, bodyY: 220, bodyH: 20, wickBottom: 245, type: "bear" }, // open 220, close 240
  { cx: 581, wickTop: 238, bodyY: 240, bodyH: 13, wickBottom: 258, type: "bear" }, // open 240, close 253
  { cx: 620, wickTop: 250, bodyY: 253, bodyH: 10, wickBottom: 268, type: "bear" }, // open 253, close 263, sommet y=250 label "4 610 $"
];

const BODY_W = 14;

export function FVGMitigationDiagram({ className = "" }: FVGMitigationDiagramProps) {
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
        <text x="79" y="33" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">XAU/USD · H1</text>

        {/* Bande FVG — toujours visible (zone graphique) */}
        <rect x="70" y="120" width="550" height="30" fill="#ef444418" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.75" />

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

          {/* Label "4 690 $" — décalé à droite du badge titre, dans un espace libre au-dessus des bougies */}
          <rect x="146" y="30" width="58" height="14" rx="3" fill="#09090b" />
          <text x="175" y="40" fill="#ffffff" fontSize="9" fontWeight="700" textAnchor="middle">4 690 $</text>

          {/* Labels FVG (bord haut et bord bas, à droite) */}
          <rect x="625" y="113" width="58" height="14" rx="3" fill="#09090b" />
          <text x="654" y="123" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">4 665 $</text>
          <rect x="625" y="143" width="58" height="14" rx="3" fill="#09090b" />
          <text x="654" y="153" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">4 655 $</text>

          {/* Label "4 610 $" en bas (dernière bougie) */}
          <rect x="625" y="263" width="58" height="14" rx="3" fill="#09090b" />
          <text x="654" y="273" fill="#ffffff" fontSize="9" fontWeight="700" textAnchor="middle">4 610 $</text>

          {/* Annotation */}
          <rect x="170" y="284" width="360" height="22" rx="11" fill="#09090b" />
          <rect x="170" y="284" width="360" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
          <text x="350" y="298" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
            Mitigation avant continuation
          </text>

        </g>

        {/* Repères mobile — placement pédagogique : à côté de la cible, jamais sur bougie / badge / mèche-clé */}
        <g className="chart-mobile-markers">
          {/* ① Impulsion bearish depuis le haut — décalé à GAUCHE de c1 (cx=70), sous le badge */}
          <circle cx="30" cy="80" r="16" fill="#18181b" fillOpacity="0.92" stroke="#fbbf24" strokeWidth="1.5" />
          <text x="30" y="80" fill="#fbbf24" fontSize="16" fontWeight="700" textAnchor="middle" dominantBaseline="central">1</text>

          {/* ② FVG band — dans le coin droit de la bande (zone large, marqué dans un coin) */}
          <circle cx="605" cy="135" r="16" fill="#18181b" fillOpacity="0.92" stroke="#fbbf24" strokeWidth="1.5" />
          <text x="605" y="135" fill="#fbbf24" fontSize="16" fontWeight="700" textAnchor="middle" dominantBaseline="central">2</text>

          {/* ③ Retour dans le FVG — AU-DESSUS des bougies du retour (c5-c8) dans espace vide */}
          <circle cx="300" cy="100" r="16" fill="#18181b" fillOpacity="0.92" stroke="#fbbf24" strokeWidth="1.5" />
          <text x="300" y="100" fill="#fbbf24" fontSize="16" fontWeight="700" textAnchor="middle" dominantBaseline="central">3</text>

          {/* ④ Continuation bearish — à GAUCHE de la dernière bougie (c15 cx=620), pas dessus */}
          <circle cx="560" cy="270" r="16" fill="#18181b" fillOpacity="0.92" stroke="#fbbf24" strokeWidth="1.5" />
          <text x="560" y="270" fill="#fbbf24" fontSize="16" fontWeight="700" textAnchor="middle" dominantBaseline="central">4</text>
        </g>
      </svg>

      {/* Mobile : explications en bullets numérotés (rappel des repères ①②③④ dans le chart) */}
      <ul className="sm:hidden px-4 py-3 space-y-2 border-t border-zinc-800/50 text-[13px] leading-snug">
        <li className="flex items-start gap-2.5">
          <span className="text-amber-400 font-bold shrink-0 tabular-nums">①</span>
          <span className="text-white">Impulsion bearish depuis <span className="font-semibold">4 690 $</span></span>
        </li>
        <li className="flex items-start gap-2.5">
          <span className="text-amber-400 font-bold shrink-0 tabular-nums">②</span>
          <span className="text-white">FVG laissé entre <span className="font-semibold">4 655 et 4 665 $</span></span>
        </li>
        <li className="flex items-start gap-2.5">
          <span className="text-amber-400 font-bold shrink-0 tabular-nums">③</span>
          <span className="text-white">Retour dans le FVG (mitigation)</span>
        </li>
        <li className="flex items-start gap-2.5">
          <span className="text-amber-400 font-bold shrink-0 tabular-nums">④</span>
          <span className="text-zinc-300">Continuation bearish jusqu&apos;à <span className="font-semibold">4 610 $</span></span>
        </li>
      </ul>

      {/* Desktop : légende couleur condensée */}
      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">Impulsion bearish qui laisse un FVG</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">Retour dans le FVG puis continuation = mitigation</span>
        </div>
      </div>
    </div>
  );
}

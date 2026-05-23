interface ConfluenceDiagramProps {
  className?: string;
  locale?: "fr" | "es";
}

export function ConfluenceDiagram({ className = "", locale = "fr" }: ConfluenceDiagramProps) {
  const isEs = locale === "es";
  const L = {
    supportSR:        isEs ? "Soporte S/R" : "Support S/R",
    zoneDemand:       isEs ? "Zona Demand" : "Zone Demand",
    confluences:      isEs ? "3 confluencias ✓" : "3 confluences ✓",
    mobTitle:         isEs ? "3 confluencias en la Zona Demand ✓" : "3 confluences sur la Zone Demand ✓",
    fibDesc:          isEs ? "· nivel de retroceso clave" : "· niveau de retracement clé",
    supportHist:      isEs ? "Soporte histórico" : "Support historique",
    supportHistDesc:  isEs ? "· zona ya respetada por el precio" : "· zone déjà respectée par le prix",
    psychoLevel:      isEs ? "Nivel psicológico" : "Niveau psychologique",
    psychoDesc:       isEs ? "· precio redondo (1.1800)" : "· prix rond (1.1800)",
    rebound:          isEs ? "→ rebote en la intersección de los 3 niveles" : "→ rebond à l'intersection des 3 niveaux",
    legendDemand:     isEs ? "Zona Demand" : "Zone Demand",
    legendSupportH:   isEs ? "Soporte histórico" : "Support historique",
  };
  // Zone Demand — creux de la courbe, centre du diagramme
  const zoneX = 106, zoneY = 102, zoneW = 60, zoneH = 26;
  const zoneCX = zoneX + zoneW / 2; // 136

  // Courbe de prix : descend vers la zone, rebondit vers le haut droit
  const pricePts = [
    [8, 82], [35, 90], [60, 100], [86, 108],
    [106, 112], [136, 118], [166, 110],
    [200, 90], [238, 64], [258, 50],
  ];
  const pricePath = pricePts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");

  // Niveaux des 3 lignes de confluence (Y séparés de ~15px)
  const fibY = 50;     // Fibonacci 61.8% — blue-400
  const supportY = 65; // Support S/R — zinc-500
  const psychoY = 80;  // Niveau psychologique — zinc-600

  // Les lignes s'arrêtent avant la zone (zone.x = 106)
  const lineEndX = 97;

  // Points d'arrivée des flèches sur le bord gauche de la zone
  // Vérifiés non-croisants avec la courbe (prix à x=106 est y=112)
  const fibArr    = { x: 106, y: 104 };
  const supportArr = { x: 106, y: 108 };
  const psychoArr  = { x: 106, y: 111 };

  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg
        width="100%"
        viewBox="0 0 268 152"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>{`@media (max-width: 640px) { .chart-detail-labels { display: none; } }`}</style>
        <defs>
          <marker id="cd-arr-blue" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <path d="M 0 0 L 6 2 L 0 4 Z" fill="#60a5fa" />
          </marker>
          <marker id="cd-arr-zinc" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <path d="M 0 0 L 6 2 L 0 4 Z" fill="#71717a" />
          </marker>
          <marker id="cd-arr-zinc-dark" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <path d="M 0 0 L 6 2 L 0 4 Z" fill="#52525b" />
          </marker>
        </defs>

        {/* Zone Demand */}
        <rect
          x={zoneX} y={zoneY} width={zoneW} height={zoneH} rx="3"
          fill="#10b98112" stroke="#10b98148" strokeWidth="1.2" strokeDasharray="4 3"
        />

        {/* Lignes de confluence — décalées verticalement, côté gauche */}

        {/* Fibonacci 61.8% — blue-400 */}
        <line
          x1="10" y1={fibY} x2={lineEndX} y2={fibY}
          stroke="#60a5fa" strokeWidth="1.3" strokeDasharray="5 3" opacity="0.8"
        />
        {/* Support S/R — zinc-500 */}
        <line
          x1="10" y1={supportY} x2={lineEndX} y2={supportY}
          stroke="#71717a" strokeWidth="1.3" strokeDasharray="6 3" opacity="0.7"
        />
        {/* Niveau psychologique — zinc-600 */}
        <line
          x1="10" y1={psychoY} x2={lineEndX} y2={psychoY}
          stroke="#52525b" strokeWidth="1" strokeDasharray="2 4" opacity="0.75"
        />

        {/* Flèches de convergence vers la Zone Demand */}
        <line
          x1={lineEndX} y1={fibY} x2={fibArr.x} y2={fibArr.y}
          stroke="#60a5fa" strokeWidth="1.2" opacity="0.75"
          markerEnd="url(#cd-arr-blue)"
        />
        <line
          x1={lineEndX} y1={supportY} x2={supportArr.x} y2={supportArr.y}
          stroke="#71717a" strokeWidth="1.2" opacity="0.7"
          markerEnd="url(#cd-arr-zinc)"
        />
        <line
          x1={lineEndX} y1={psychoY} x2={psychoArr.x} y2={psychoArr.y}
          stroke="#52525b" strokeWidth="1" opacity="0.65"
          markerEnd="url(#cd-arr-zinc-dark)"
        />

        {/* Courbe de prix */}
        <path d={pricePath} stroke="#71717a" strokeWidth="1.8" strokeLinejoin="round" />

        {/* Point de rebond au creux */}
        <circle cx={zoneCX} cy="118" r="4.5" fill="#10b981" opacity="0.9" />

        {/* ── Badges — masqués sur mobile ── */}
        <g className="chart-detail-labels">
          <rect x="8" y="16" width="70" height="13" rx="3" fill="#60a5fa18" stroke="#60a5fa40" strokeWidth="0.8" />
          <text x="43" y="26" fontSize="8" fill="#60a5fa" textAnchor="middle" fontWeight="700">Fibonacci 61.8%</text>

          <rect x="8" y="33" width="56" height="13" rx="3" fill="#71717a14" stroke="#71717a38" strokeWidth="0.8" />
          <text x="36" y="43" fontSize="8" fill="#71717a" textAnchor="middle" fontWeight="700">{L.supportSR}</text>

          <rect x="104" y="130" width="64" height="13" rx="3" fill="#10b98118" stroke="#10b98138" strokeWidth="0.8" />
          <text x={zoneCX} y="140" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="700">{L.zoneDemand}</text>

          <rect x="186" y="8" width="76" height="16" rx="4" fill="#10b98118" stroke="#10b98140" strokeWidth="0.8" />
          <text x="224" y="19" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="700">{L.confluences}</text>

          <rect x="95" y="66" width="38" height="14" fill="#09090b" rx="3" />
          <text x="99" y="77" fontSize="7.5" fill="#52525b" fontWeight="600">1.1800</text>
        </g>
      </svg>

      {/* Mobile : key card avec les 3 confluences */}
      <div className="sm:hidden px-4 py-3 border-t border-zinc-800/60 space-y-2">
        <p className="text-[13px] font-bold text-emerald-400">{L.mobTitle}</p>
        <ul className="space-y-1.5 text-[13px] leading-snug">
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-3 h-1 rounded-sm bg-blue-400 mt-2" />
            <span className="text-white">
              <span className="font-bold text-blue-400">Fibonacci 61.8%</span>
              <span className="text-zinc-300"> {L.fibDesc}</span>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-3 h-1 rounded-sm bg-zinc-500 mt-2" />
            <span className="text-white">
              <span className="font-bold text-zinc-300">{L.supportHist}</span>
              <span className="text-zinc-300"> {L.supportHistDesc}</span>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-3 h-0.5 border-t border-dashed border-zinc-600 mt-2.5" />
            <span className="text-white">
              <span className="font-bold text-zinc-300">{L.psychoLevel}</span>
              <span className="text-zinc-300"> {L.psychoDesc}</span>
            </span>
          </li>
          <li className="flex items-start gap-2 pt-1 border-t border-zinc-800/50">
            <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1" />
            <span className="text-zinc-300">{L.rebound}</span>
          </li>
        </ul>
      </div>

      {/* Desktop legend (inchangée) */}
      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">{L.legendDemand}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-[10px] text-zinc-500">Fibonacci 61.8%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-zinc-500" />
          <span className="text-[10px] text-zinc-500">{L.legendSupportH}</span>
        </div>
      </div>
    </div>
  );
}

// Diagramme : biais directionnel HTF
// Le HTF (H4) donne le verdict directionnel — ventes prioritaires.

interface HTFBiasDiagramProps {
  className?: string;
}

export function HTFBiasDiagram({ className = "" }: HTFBiasDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg
        width="100%"
        viewBox="0 0 700 320"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Badge timeframe */}
        <rect x="20" y="20" width="80" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="60" y="35" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">H4</text>

        {/* Zone graphique principale (gauche) */}
        {/* Résistance 1.1780 */}
        <line x1="40" y1="80" x2="450" y2="80" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" />
        <rect x="40" y="66" width="80" height="13" rx="3" fill="#09090b" />
        <text x="80" y="76" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">1.1780 — R</text>

        {/* Path baissier LH/LL */}
        <path
          d="M40,100 L90,82 L140,150 L195,115 L250,200 L300,165 L355,235 L410,210 L445,225"
          stroke="#ef4444" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round"
        />

        {/* Markers LH/LL */}
        <circle cx="90" cy="82" r="4" fill="#ef4444" />
        <rect x="76" y="44" width="28" height="13" rx="3" fill="#09090b" />
        <text x="90" y="54" fill="#ef4444" fontSize="8" fontWeight="700" textAnchor="middle">LH1</text>

        <circle cx="195" cy="115" r="4" fill="#ef4444" />
        <rect x="181" y="95" width="28" height="13" rx="3" fill="#09090b" />
        <text x="195" y="105" fill="#ef4444" fontSize="8" fontWeight="700" textAnchor="middle">LH2</text>

        <circle cx="300" cy="165" r="4" fill="#ef4444" />
        <rect x="286" y="145" width="28" height="13" rx="3" fill="#09090b" />
        <text x="300" y="155" fill="#ef4444" fontSize="8" fontWeight="700" textAnchor="middle">LH3</text>

        <circle cx="140" cy="150" r="4" fill="#ef4444" />
        <rect x="126" y="157" width="28" height="13" rx="3" fill="#09090b" />
        <text x="140" y="167" fill="#ef4444" fontSize="8" fontWeight="700" textAnchor="middle">LL1</text>

        <circle cx="250" cy="200" r="4" fill="#ef4444" />
        <rect x="236" y="207" width="28" height="13" rx="3" fill="#09090b" />
        <text x="250" y="217" fill="#ef4444" fontSize="8" fontWeight="700" textAnchor="middle">LL2</text>

        <circle cx="355" cy="235" r="4" fill="#ef4444" />
        <rect x="341" y="242" width="28" height="13" rx="3" fill="#09090b" />
        <text x="355" y="252" fill="#ef4444" fontSize="8" fontWeight="700" textAnchor="middle">LL3</text>

        {/* Prix actuel 1.1725 — label placé À GAUCHE du marker pour éviter la verdict box */}
        <line x1="40" y1="225" x2="450" y2="225" stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="2 2" strokeOpacity="0.7" />
        <circle cx="445" cy="225" r="5" fill="#60a5fa" />
        <rect x="355" y="222" width="78" height="13" rx="3" fill="#09090b" />
        <text x="394" y="232" fill="#60a5fa" fontSize="9" fontWeight="600" textAnchor="middle">Prix 1.1725</text>

        {/* Flèche directionnelle */}
        <text x="425" y="275" fill="#ef4444" fontSize="22" opacity="0.4" textAnchor="middle">↘</text>

        {/* ═══ Encart verdict (droite) ═══ */}
        <rect x="490" y="50" width="190" height="200" rx="10" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />

        {/* Titre verdict */}
        <text x="585" y="76" fill="#a1a1aa" fontSize="9" fontWeight="700" textAnchor="middle" letterSpacing="2">
          VERDICT HTF
        </text>
        <line x1="510" y1="86" x2="660" y2="86" stroke="#3f3f46" strokeWidth="1" />

        {/* Item 1 — Biais */}
        <rect x="510" y="100" width="150" height="34" rx="6" fill="#ef444415" stroke="#ef4444" strokeWidth="1" />
        <text x="585" y="116" fill="#a1a1aa" fontSize="8" textAnchor="middle">Biais</text>
        <text x="585" y="129" fill="#ef4444" fontSize="13" fontWeight="700" textAnchor="middle">BAISSIER</text>

        {/* Item 2 — Priorité */}
        <text x="520" y="158" fill="#10b981" fontSize="11" fontWeight="700">✓</text>
        <text x="535" y="158" fill="#a1a1aa" fontSize="10" fontWeight="600">Ventes prioritaires</text>

        {/* Item 3 — Contre-contexte */}
        <text x="520" y="183" fill="#ef4444" fontSize="11" fontWeight="700">✗</text>
        <text x="535" y="183" fill="#a1a1aa" fontSize="10" fontWeight="600">Achats = contre</text>
        <text x="535" y="197" fill="#71717a" fontSize="9">contexte</text>

        {/* Note bas */}
        <text x="585" y="232" fill="#71717a" fontSize="9" textAnchor="middle">Toute analyse LTF</text>
        <text x="585" y="244" fill="#71717a" fontSize="9" textAnchor="middle">part de ce verdict</text>

        {/* Caption */}
        <text x="350" y="305" fill="#a1a1aa" fontSize="10" textAnchor="middle">
          Structure HTF en LH/LL → ventes seulement
        </text>
      </svg>

      {/* Légende */}
      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">Structure H4 LH/LL = biais baissier</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-blue-400" />
          <span className="text-[10px] text-zinc-500">Prix actuel sous la résistance HTF</span>
        </div>
      </div>
    </div>
  );
}

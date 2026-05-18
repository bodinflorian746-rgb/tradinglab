// Diagramme : zone d'intérêt intermédiaire (H1)
// Le timeframe intermédiaire localise la zone où agir, héritée du HTF.

interface IntermediateZoneDiagramProps {
  className?: string;
}

export function IntermediateZoneDiagram({ className = "" }: IntermediateZoneDiagramProps) {
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
        <text x="60" y="35" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">H1</text>

        {/* Mini-encart HTF (haut droite) */}
        <rect x="540" y="20" width="140" height="46" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
        <text x="610" y="36" fill="#71717a" fontSize="8" fontWeight="700" textAnchor="middle" letterSpacing="1.5">HTF (H4)</text>
        {/* Mini path baissier */}
        <path d="M555,52 L575,46 L595,57 L612,50 L630,60 L650,55 L668,62"
          stroke="#ef4444" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
        <text x="610" y="62" fill="#ef4444" fontSize="8" fontWeight="600" textAnchor="middle" opacity="0">·</text>

        {/* ═══ Zone de résistance (bande horizontale) entre 1.1765 et 1.1780 ═══ */}
        <rect x="40" y="95" width="490" height="32" fill="#ef444418" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.7" />

        {/* Labels niveaux haut/bas de la zone */}
        <rect x="40" y="83" width="56" height="13" rx="3" fill="#09090b" />
        <text x="68" y="93" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">1.1780</text>

        <rect x="40" y="129" width="56" height="13" rx="3" fill="#09090b" />
        <text x="68" y="139" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">1.1765</text>

        {/* Path qui remonte dans la zone */}
        <path
          d="M40,230 L80,215 L120,235 L165,200 L210,210 L255,180 L305,160 L355,150 L405,130 L455,115 L500,108"
          stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round"
        />

        {/* Point d'entrée du prix dans la zone */}
        <circle cx="455" cy="115" r="5" fill="#60a5fa" />
        <line x1="455" y1="125" x2="455" y2="160" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.6" />
        <rect x="412" y="160" width="86" height="14" rx="3" fill="#09090b" />
        <text x="455" y="170" fill="#60a5fa" fontSize="9" fontWeight="600" textAnchor="middle">Prix entre dans la zone</text>

        {/* Annotation principale */}
        <rect x="280" y="220" width="260" height="20" rx="10" fill="#09090b" />
        <rect x="280" y="220" width="260" height="20" rx="10" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="410" y="233" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          Zone d&apos;intérêt — préparée depuis le HTF
        </text>

        {/* Trait pointillé reliant l'encart HTF à la zone */}
        <line x1="540" y1="66" x2="500" y2="95" stroke="#71717a" strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.5" />

        {/* Caption bas */}
        <text x="350" y="290" fill="#a1a1aa" fontSize="10" textAnchor="middle">
          Le H1 localise précisément la zone — il ne décide pas du biais
        </text>
      </svg>

      {/* Légende */}
      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500/40 border border-red-500" />
          <span className="text-[10px] text-zinc-500">Zone de résistance H1 1.1765 → 1.1780</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">Zone héritée du contexte HTF</span>
        </div>
      </div>
    </div>
  );
}

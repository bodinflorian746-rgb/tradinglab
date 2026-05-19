// Diagramme : le Daily donne la direction (Leçon 5 multi-timeframe)
// EUR/USD Daily — structure baissière en LH/LL : impulsions baissières fortes vs corrections faibles.

interface DailyContextDiagramProps {
  className?: string;
}

export function DailyContextDiagram({ className = "" }: DailyContextDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">

        <rect x="20" y="18" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="33" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">EUR/USD · Daily</text>

        {/* Résistance 1.1760 */}
        <line x1="40" y1="55" x2="660" y2="55" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" />
        <rect x="40" y="42" width="56" height="12" rx="3" fill="#09090b" />
        <text x="68" y="51" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">1.1760</text>

        {/* Tracé en zigzag — corrections haussières fines (zinc) / impulsions baissières épaisses (red) */}
        {/* Le tracé démarre directement à LH1, au contact de la résistance */}
        {/* Impulsion 1 — chute raide vers LL1 */}
        <line x1="110" y1="55" x2="170" y2="165" stroke="#ef4444" strokeWidth="3" />
        {/* Correction vers LH2 */}
        <line x1="170" y1="165" x2="290" y2="85" stroke="#71717a" strokeWidth="1.5" />
        {/* Impulsion 2 — chute raide vers LL2 */}
        <line x1="290" y1="85" x2="350" y2="220" stroke="#ef4444" strokeWidth="3" />
        {/* Correction vers LH3 */}
        <line x1="350" y1="220" x2="470" y2="125" stroke="#71717a" strokeWidth="1.5" />
        {/* Impulsion 3 — chute raide vers LL3 */}
        <line x1="470" y1="125" x2="530" y2="275" stroke="#ef4444" strokeWidth="3" />
        {/* Extension bearish */}
        <line x1="530" y1="275" x2="640" y2="295" stroke="#ef4444" strokeWidth="3" />

        {/* Markers LH décroissants */}
        <circle cx="110" cy="55" r="4" fill="#ef4444" />
        <rect x="96" y="32" width="28" height="13" rx="3" fill="#09090b" />
        <text x="110" y="42" fill="#ef4444" fontSize="8" fontWeight="700" textAnchor="middle">LH1</text>

        <circle cx="290" cy="85" r="4" fill="#ef4444" />
        <rect x="276" y="62" width="28" height="13" rx="3" fill="#09090b" />
        <text x="290" y="72" fill="#ef4444" fontSize="8" fontWeight="700" textAnchor="middle">LH2</text>

        <circle cx="470" cy="125" r="4" fill="#ef4444" />
        <rect x="456" y="102" width="28" height="13" rx="3" fill="#09090b" />
        <text x="470" y="112" fill="#ef4444" fontSize="8" fontWeight="700" textAnchor="middle">LH3</text>

        {/* Flèche bearish */}
        <text x="630" y="290" fill="#ef4444" fontSize="20" opacity="0.5" textAnchor="middle">↘</text>

        {/* Annotation */}
        <rect x="190" y="296" width="320" height="20" rx="10" fill="#09090b" />
        <rect x="190" y="296" width="320" height="20" rx="10" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="309" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          Le Daily définit le contexte général
        </text>
      </svg>

      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">Impulsions baissières fortes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-zinc-500" />
          <span className="text-[10px] text-zinc-500">Corrections haussières faibles = direction vendeuse</span>
        </div>
      </div>
    </div>
  );
}

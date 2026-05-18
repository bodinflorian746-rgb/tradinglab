// Diagramme : piège du timeframe unique
// Le même marché, lu sur 2 timeframes, raconte 2 choses opposées.

interface SingleTimeframeTrapDiagramProps {
  className?: string;
}

export function SingleTimeframeTrapDiagram({ className = "" }: SingleTimeframeTrapDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg
        width="100%"
        viewBox="0 0 800 320"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Séparateur central */}
        <line x1="400" y1="20" x2="400" y2="290" stroke="#3f3f46" strokeWidth="1" strokeDasharray="4 3" />

        {/* ═══ MOITIÉ GAUCHE — DAILY baissier ═══ */}
        <rect x="20" y="20" width="120" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="80" y="35" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">DAILY</text>

        {/* Résistance Daily */}
        <line x1="40" y1="70" x2="380" y2="70" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" strokeOpacity="0.7" />
        <rect x="40" y="56" width="86" height="13" rx="3" fill="#09090b" />
        <text x="83" y="66" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">Résistance Daily</text>

        {/* Path baissier LH/LL */}
        <path
          d="M40,90 L90,75 L140,140 L190,110 L240,180 L290,150 L340,230"
          stroke="#ef4444" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round"
        />

        {/* Markers LH/LL */}
        <circle cx="90" cy="75" r="4" fill="#ef4444" />
        <rect x="76" y="55" width="28" height="13" rx="3" fill="#09090b" />
        <text x="90" y="65" fill="#ef4444" fontSize="8" fontWeight="700" textAnchor="middle">LH1</text>

        <circle cx="190" cy="110" r="4" fill="#ef4444" />
        <rect x="176" y="92" width="28" height="13" rx="3" fill="#09090b" />
        <text x="190" y="102" fill="#ef4444" fontSize="8" fontWeight="700" textAnchor="middle">LH2</text>

        <circle cx="140" cy="140" r="4" fill="#ef4444" />
        <rect x="126" y="147" width="28" height="13" rx="3" fill="#09090b" />
        <text x="140" y="157" fill="#ef4444" fontSize="8" fontWeight="700" textAnchor="middle">LL1</text>

        <circle cx="240" cy="180" r="4" fill="#ef4444" />
        <rect x="226" y="187" width="28" height="13" rx="3" fill="#09090b" />
        <text x="240" y="197" fill="#ef4444" fontSize="8" fontWeight="700" textAnchor="middle">LL2</text>

        {/* Flèche tendance */}
        <text x="365" y="260" fill="#ef4444" fontSize="20" opacity="0.5" textAnchor="middle">↘</text>
        <text x="200" y="285" fill="#a1a1aa" fontSize="10" textAnchor="middle">Tendance baissière nette</text>

        {/* ═══ MOITIÉ DROITE — M15 breakout local haussier ═══ */}
        <rect x="660" y="20" width="120" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="720" y="35" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">M15</text>

        {/* Mini-niveau cassé */}
        <line x1="440" y1="160" x2="780" y2="160" stroke="#71717a" strokeWidth="1.2" strokeDasharray="3 2" />
        <rect x="440" y="147" width="100" height="13" rx="3" fill="#09090b" />
        <text x="490" y="157" fill="#71717a" fontSize="9" fontWeight="600" textAnchor="middle">Niveau M15 local</text>

        {/* Bougies — 5 bougies, dont 3 vertes qui cassent le niveau */}
        {/* B1 rouge */}
        <line x1="470" y1="170" x2="470" y2="210" stroke="#b91c1c" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="462" y="180" width="16" height="22" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />
        {/* B2 rouge */}
        <line x1="510" y1="175" x2="510" y2="215" stroke="#b91c1c" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="502" y="185" width="16" height="20" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />
        {/* B3 verte */}
        <line x1="550" y1="155" x2="550" y2="195" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="542" y="165" width="16" height="22" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />
        {/* B4 verte qui casse */}
        <line x1="590" y1="125" x2="590" y2="170" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="582" y="135" width="16" height="28" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />
        {/* B5 verte continuation */}
        <line x1="630" y1="105" x2="630" y2="150" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="622" y="115" width="16" height="28" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />
        {/* B6 verte */}
        <line x1="670" y1="90" x2="670" y2="140" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="662" y="100" width="16" height="32" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

        {/* Flèche montée locale */}
        <text x="715" y="115" fill="#10b981" fontSize="20" opacity="0.6" textAnchor="middle">↗</text>

        {/* Annotation locale — "tentation" */}
        <rect x="540" y="68" width="180" height="14" rx="3" fill="#09090b" />
        <text x="630" y="78" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">Breakout local haussier</text>

        {/* ═══ Annotation traversante : Signal contre tendance ═══ */}
        <rect x="200" y="300" width="400" height="18" rx="9" fill="#09090b" />
        <rect x="200" y="300" width="400" height="18" rx="9" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="400" y="313" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          Signal acheteur local — CONTRE la tendance Daily
        </text>
      </svg>

      {/* Légende */}
      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">HTF Daily = tendance baissière</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">LTF M15 = signal trompeur isolé</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">Lire un seul TF = piège</span>
        </div>
      </div>
    </div>
  );
}

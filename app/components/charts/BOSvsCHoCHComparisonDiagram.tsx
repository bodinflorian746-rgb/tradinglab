export default function BOSvsCHoCHComparisonDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 400"
      className={`w-full h-auto ${className}`}
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        BOS vs CHoCH — même structure, sens de cassure opposé
      </text>

      <line x1="400" y1="40" x2="400" y2="370" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ PANEL GAUCHE — BOS continuation ═══ */}
      <rect x="60" y="50" width="280" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="200" y="65" fill="#10b981" fontSize="11" fontWeight="700" textAnchor="middle">BOS — Continuation</text>

      <line x1="50" y1="150" x2="380" y2="150" stroke="#10b981" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
      <rect x="52" y="134" width="78" height="12" rx="2" fill="#09090b" />
      <text x="55" y="143" fill="#10b981" fontSize="9" fontWeight="600">HH2 1.1820</text>

      <path d="M50,280 L100,230 L140,250 L180,200 L220,220 L260,150 L300,130 L340,90" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <circle cx="100" cy="230" r="4" fill="#10b981" />
      <rect x="103" y="240" width="60" height="11" rx="2" fill="#09090b" />
      <text x="105" y="248" fill="#10b981" fontSize="8">HL 1.1720</text>
      <circle cx="180" cy="200" r="4" fill="#10b981" />
      <rect x="183" y="210" width="64" height="11" rx="2" fill="#09090b" />
      <text x="185" y="218" fill="#10b981" fontSize="8">HL2 1.1750</text>
      <circle cx="260" cy="150" r="5" fill="#10b981" />
      <line x1="310" y1="80" x2="310" y2="160" stroke="#059669" strokeWidth="1.5" />
      <rect x="304" y="80" width="12" height="60" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      <rect x="80" y="320" width="240" height="20" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="0.8" />
      <text x="200" y="334" fill="#d4d4d8" fontSize="9" textAnchor="middle">Cassure dans le sens de la tendance</text>

      {/* ═══ PANEL DROIT — CHoCH retournement ═══ */}
      <rect x="460" y="50" width="280" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="600" y="65" fill="#ef4444" fontSize="11" fontWeight="700" textAnchor="middle">CHoCH — Retournement</text>

      <line x1="450" y1="220" x2="780" y2="220" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
      <rect x="452" y="204" width="78" height="12" rx="2" fill="#09090b" />
      <text x="455" y="213" fill="#ef4444" fontSize="9" fontWeight="600">HL2 1.1750</text>

      <path d="M450,280 L500,230 L540,250 L580,200 L620,220 L660,290 L700,310" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <circle cx="500" cy="230" r="4" fill="#10b981" />
      <rect x="503" y="240" width="60" height="11" rx="2" fill="#09090b" />
      <text x="505" y="248" fill="#10b981" fontSize="8">HL 1.1720</text>
      <circle cx="580" cy="200" r="4" fill="#10b981" />
      <rect x="583" y="187" width="64" height="11" rx="2" fill="#09090b" />
      <text x="585" y="195" fill="#10b981" fontSize="8">HH 1.1780</text>
      <circle cx="620" cy="220" r="5" fill="#ef4444" />
      <line x1="660" y1="240" x2="660" y2="310" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="654" y="245" width="12" height="60" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      <rect x="480" y="320" width="240" height="20" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="0.8" />
      <text x="600" y="334" fill="#d4d4d8" fontSize="9" textAnchor="middle">Cassure contre le sens de la tendance</text>

      <text x="400" y="385" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        Même structure de départ. Sens de la cassure = sens du signal.
      </text>
    </svg>
  );
}

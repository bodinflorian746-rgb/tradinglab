export default function StopHuntDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 400"
      className={`w-full h-auto ${className}`}
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        Pourquoi le marché chasse les stops
      </text>

      <rect x="560" y="40" width="220" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="670" y="55" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">Stop hunt — mécanique du piège</text>

      {/* Zone stops cluster — opacité et stroke renforcés */}
      <rect x="50" y="120" width="700" height="60" fill="#ef444433" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3" />

      {/* Niveau résistance */}
      <line x1="50" y1="180" x2="750" y2="180" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" />

      {/* Path : approche par 4-5 bougies haussières */}
      <line x1="120" y1="280" x2="120" y2="335" stroke="#059669" strokeWidth="1.5" />
      <rect x="113" y="290" width="14" height="40" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      <line x1="160" y1="250" x2="160" y2="305" stroke="#059669" strokeWidth="1.5" />
      <rect x="153" y="260" width="14" height="40" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      <line x1="200" y1="220" x2="200" y2="270" stroke="#059669" strokeWidth="1.5" />
      <rect x="193" y="230" width="14" height="35" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      <line x1="240" y1="195" x2="240" y2="235" stroke="#059669" strokeWidth="1.5" />
      <rect x="233" y="200" width="14" height="30" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      {/* Bougie stop hunt : mèche pique dans zone stops, corps clôture sous résistance */}
      <line x1="290" y1="120" x2="290" y2="240" stroke="#b91c1c" strokeWidth="2" />
      <rect x="282" y="210" width="16" height="20" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" rx="1" />

      {/* Annotations sur la bougie stop hunt */}
      <line x1="298" y1="130" x2="370" y2="100" stroke="#f87171" strokeWidth="0.8" strokeDasharray="2 2" />
      <rect x="370" y="90" width="180" height="20" rx="4" fill="#ef444420" stroke="#ef4444" strokeWidth="0.8" />
      <text x="460" y="104" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">Mèche déclenche les stops</text>

      <line x1="298" y1="220" x2="370" y2="250" stroke="#71717a" strokeWidth="0.8" strokeDasharray="2 2" />
      <rect x="370" y="240" width="180" height="20" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="0.8" />
      <text x="460" y="254" fill="#d4d4d8" fontSize="9" textAnchor="middle">Corps clôture sous (4 690$)</text>

      {/* Continuation baissière : 3-4 bougies rouges */}
      <line x1="340" y1="225" x2="340" y2="270" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="333" y="235" width="14" height="30" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      <line x1="600" y1="250" x2="600" y2="305" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="593" y="260" width="14" height="40" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      <line x1="640" y1="280" x2="640" y2="335" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="633" y="290" width="14" height="40" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      <line x1="680" y1="310" x2="680" y2="365" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="673" y="320" width="14" height="40" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      {/* Labels avec halos opaques placés en fin de svg */}
      <rect x="51" y="102" width="116" height="14" fill="#09090b" rx="3" />
      <text x="55" y="113" fill="#ef4444" fontSize="10" fontWeight="600">Zone stops cluster</text>
      <rect x="196" y="102" width="93" height="14" fill="#09090b" rx="3" />
      <text x="200" y="113" fill="#ef4444" fontSize="9" fontStyle="italic">(4 720$ - 4 745$)</text>
      <rect x="51" y="189" width="110" height="14" fill="#09090b" rx="3" />
      <text x="55" y="200" fill="#ef4444" fontSize="9" fontWeight="600">Résistance 4 720$</text>

      <text x="400" y="385" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        Les institutions visent les zones de stops pour absorber la liquidité avant inversion
      </text>
    </svg>
  );
}

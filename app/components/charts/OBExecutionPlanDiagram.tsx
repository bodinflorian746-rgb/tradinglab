export default function OBExecutionPlanDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 400"
      className={`w-full h-auto ${className}`}
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        Plan d&apos;exécution OB bullish chiffré
      </text>

      <rect x="560" y="40" width="220" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="670" y="55" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">
        R/R 2,79 — setup exploitable
      </text>

      {/* Niveau TP */}
      <line x1="50" y1="85" x2="750" y2="85" stroke="#10b981" strokeWidth="1.2" strokeDasharray="5 3" />
      <rect x="52" y="71" width="80" height="12" rx="2" fill="#09090b" />
      <text x="55" y="80" fill="#10b981" fontSize="9" fontWeight="600">TP — 1.1858</text>

      {/* Niveau entrée (limite haute corps OB) */}
      <line x1="50" y1="170" x2="750" y2="170" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" />
      <rect x="52" y="156" width="98" height="12" rx="2" fill="#09090b" />
      <text x="55" y="165" fill="#10b981" fontSize="9" fontWeight="600">Entrée — 1.1780</text>

      {/* Niveau SL */}
      <line x1="50" y1="210" x2="750" y2="210" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="5 3" />
      <rect x="52" y="216" width="80" height="12" rx="2" fill="#09090b" />
      <text x="55" y="225" fill="#ef4444" fontSize="9" fontWeight="600">SL — 1.1752</text>

      {/* Order Block zone (rectangle emerald translucide) */}
      <rect x="280" y="170" width="240" height="40" fill="#10b98120" stroke="#10b981" strokeWidth="1" strokeDasharray="3 2" />
      <text x="400" y="195" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">Order Block 1.1752-1.1780</text>

      {/* Path prix : impulsion passée + retest OB */}
      <path d="M60,310 L100,260 L140,230 L180,200 L220,170 L260,150 L300,140 L340,160 L380,170 L420,180 L460,160 L500,130 L540,110 L580,90 L620,85" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      {/* Cercle d'entrée sur retest */}
      <circle cx="420" cy="180" r="6" fill="#10b981" />
      <circle cx="420" cy="180" r="11" fill="#10b981" opacity="0.3" />

      {/* Flèche bidirectionnelle entre SL et Entrée (Risque 28 pips) */}
      <line x1="650" y1="170" x2="650" y2="210" stroke="#ef4444" strokeWidth="1.2" />
      <path d="M645,178 L650,170 L655,178" stroke="#ef4444" strokeWidth="1.2" fill="none" />
      <path d="M645,202 L650,210 L655,202" stroke="#ef4444" strokeWidth="1.2" fill="none" />
      <rect x="665" y="180" width="80" height="20" rx="4" fill="#27272a" stroke="#ef4444" strokeWidth="0.8" />
      <text x="705" y="194" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">Risque 28 pips</text>

      {/* Flèche bidirectionnelle entre Entrée et TP (Gain 78 pips) */}
      <line x1="710" y1="85" x2="710" y2="170" stroke="#10b981" strokeWidth="1.2" />
      <path d="M705,93 L710,85 L715,93" stroke="#10b981" strokeWidth="1.2" fill="none" />
      <path d="M705,162 L710,170 L715,162" stroke="#10b981" strokeWidth="1.2" fill="none" />
      <rect x="725" y="120" width="65" height="20" rx="4" fill="#27272a" stroke="#10b981" strokeWidth="0.8" />
      <text x="757" y="134" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">Gain 78 pips</text>

      <text x="400" y="385" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        Entrée limite haute corps OB · SL au-delà mèche basse · TP projection structurelle
      </text>
    </svg>
  );
}

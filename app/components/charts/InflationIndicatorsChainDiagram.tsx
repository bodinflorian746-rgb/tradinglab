export const InflationIndicatorsChainDiagram = () => {
  return (
    <svg
      className="w-full h-auto"
      viewBox="0 0 800 450"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Layer 0 — Defs */}
      <defs>
        <marker id="arrow-inflation-chain" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
          <polygon points="0 0, 10 5, 0 10" fill="#71717a" />
        </marker>
      </defs>

      {/* Layer 1 — Fond global */}
      <rect width="800" height="450" fill="#18181b" rx="8" />
      <rect width="800" height="450" fill="none" stroke="#27272a" strokeWidth="1" rx="8" />

      {/* Layer 2 — Titre */}
      <text x="400" y="35" fill="white" fontSize="16" fontWeight="700" textAnchor="middle">
        La chaîne d&apos;inflation que les pros surveillent
      </text>
      <text x="400" y="55" fill="#a1a1aa" fontSize="11" fontStyle="italic" textAnchor="middle">
        Du producteur au consommateur — et ce que la Fed regarde vraiment
      </text>

      {/* Layer 4 — Bloc PPI */}
      <rect x="30" y="110" width="150" height="90" rx="8" fill="#27272a" stroke="#60a5fa" strokeWidth="2" />
      <text x="105" y="140" fill="#60a5fa" fontSize="22" fontWeight="800" textAnchor="middle">PPI</text>
      <text x="105" y="160" fill="#d4d4d8" fontSize="10" textAnchor="middle">Prix producteurs</text>
      <text x="105" y="180" fill="#a1a1aa" fontSize="9" fontStyle="italic" textAnchor="middle">J-12 jours</text>
      <text x="105" y="193" fill="#a1a1aa" fontSize="9" fontStyle="italic" textAnchor="middle">Signal précoce</text>

      {/* Layer 5 — Flèche PPI → CPI Headline */}
      <path d="M 180 155 L 300 155" stroke="#71717a" strokeWidth="2" markerEnd="url(#arrow-inflation-chain)" />
      <text x="240" y="170" fill="#a1a1aa" fontSize="10" fontStyle="italic" textAnchor="middle">annonce souvent</text>

      {/* Layer 6 — Bloc CPI Headline */}
      <rect x="300" y="80" width="170" height="100" rx="8" fill="#27272a" stroke="#fbbf24" strokeWidth="2" />
      <text x="385" y="110" fill="#fbbf24" fontSize="14" fontWeight="700" textAnchor="middle">CPI HEADLINE</text>
      <text x="385" y="130" fill="#d4d4d8" fontSize="10" textAnchor="middle">Prix consommateurs</text>
      <text x="385" y="150" fill="#a1a1aa" fontSize="9" fontStyle="italic" textAnchor="middle">Jour J — 14h30</text>
      <text x="385" y="163" fill="#a1a1aa" fontSize="9" fontStyle="italic" textAnchor="middle">Choc médiatisé</text>

      {/* Layer 7 — Ligne pointillée CPI Headline → Core CPI */}
      <line x1="385" y1="180" x2="385" y2="200" stroke="#3f3f46" strokeWidth="1.5" strokeDasharray="3 3" />

      {/* Bloc Core CPI */}
      <rect x="300" y="200" width="170" height="80" rx="8" fill="#27272a" stroke="#10b981" strokeWidth="2" />
      <text x="385" y="225" fill="#10b981" fontSize="14" fontWeight="700" textAnchor="middle">CORE CPI</text>
      <text x="385" y="245" fill="#d4d4d8" fontSize="10" textAnchor="middle">Tendance de fond</text>
      <text x="385" y="265" fill="#34d399" fontSize="9" fontStyle="italic" textAnchor="middle">Ce que les pros regardent</text>

      {/* Layer 8 — Flèche Core CPI → Core PCE */}
      <path d="M 470 240 Q 530 200 590 175" stroke="#71717a" strokeWidth="2" fill="none" markerEnd="url(#arrow-inflation-chain)" />
      <text x="535" y="205" fill="#a1a1aa" fontSize="10" fontStyle="italic" textAnchor="middle">interprété par</text>

      {/* Layer 9 — Bloc Core PCE */}
      <rect x="590" y="130" width="180" height="90" rx="8" fill="#27272a" stroke="#60a5fa" strokeWidth="2" strokeOpacity="0.7" />
      <text x="680" y="160" fill="#60a5fa" fontSize="14" fontWeight="700" textAnchor="middle">CORE PCE</text>
      <text x="680" y="180" fill="#d4d4d8" fontSize="10" textAnchor="middle">Indicateur préféré</text>
      <text x="680" y="193" fill="#d4d4d8" fontSize="10" textAnchor="middle">de la Fed</text>
      <text x="680" y="210" fill="#fbbf24" fontSize="9" fontStyle="italic" textAnchor="middle">★ Référence officielle</text>

      {/* Layer 10 — Encadré scénarios */}

      {/* Header centré */}
      <text x="400" y="305" fill="#fbbf24" fontSize="11" fontWeight="700" letterSpacing="0.05em" textAnchor="middle">
        RÉACTION MARCHÉ SELON LE CORE CPI
      </text>

      {/* Colonne gauche — Scénario haussier (red) */}
      <rect x="30" y="320" width="365" height="80" rx="6" fill="#09090b" fillOpacity="0.5" stroke="#f87171" strokeWidth="1.5" strokeOpacity="0.6" />
      <text x="212" y="345" fill="#f87171" fontSize="13" fontWeight="700" textAnchor="middle">Core CPI &gt; attentes</text>
      <text x="212" y="368" fill="#d4d4d8" fontSize="11" textAnchor="middle">↑ DXY (dollar fort)</text>
      <text x="212" y="386" fill="#a1a1aa" fontSize="11" textAnchor="middle">↓ EUR/USD, Or, Crypto</text>

      {/* Colonne droite — Scénario baissier (emerald) */}
      <rect x="405" y="320" width="365" height="80" rx="6" fill="#09090b" fillOpacity="0.5" stroke="#34d399" strokeWidth="1.5" strokeOpacity="0.6" />
      <text x="587" y="345" fill="#34d399" fontSize="13" fontWeight="700" textAnchor="middle">Core CPI &lt; attentes</text>
      <text x="587" y="368" fill="#d4d4d8" fontSize="11" textAnchor="middle">↓ DXY (dollar faible)</text>
      <text x="587" y="386" fill="#a1a1aa" fontSize="11" textAnchor="middle">↑ EUR/USD, Or, Indices</text>

      {/* Layer 11 — Pied de page */}
      <text x="400" y="430" fill="#34d399" fontSize="12" fontWeight="700" fontStyle="italic" textAnchor="middle">
        Le PPI prévient. Le CPI déclenche. Le Core confirme.
      </text>
    </svg>
  );
};

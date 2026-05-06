export const InflationChainDiagram = () => {
  return (
    <svg
      className="w-full h-auto"
      viewBox="0 0 800 450"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Layer 0 — Defs */}
      <defs>
        <marker id="arrow-inflation" markerWidth="8" markerHeight="10" refX="8" refY="5" orient="auto">
          <polygon points="0 0, 8 5, 0 10" fill="#71717a" />
        </marker>
      </defs>

      {/* Layer 1 — Fond */}
      <rect width="800" height="450" fill="#18181b" rx="8" />
      <rect width="800" height="450" fill="none" stroke="#27272a" strokeWidth="1" rx="8" />

      {/* Layer 2 — Titre */}
      <text x="400" y="40" fill="white" fontSize="16" fontWeight="700" textAnchor="middle">
        La chaîne qui contrôle TOUT le marché
      </text>
      <text x="400" y="62" fill="#a1a1aa" fontSize="12" fontStyle="italic" textAnchor="middle">
        Apprends-la par cœur — c&apos;est 80% de la macro
      </text>

      {/* Layer 3 — 4 boxes */}

      {/* Box 1 — INFLATION */}
      <rect x="55" y="160" width="150" height="110" rx="8" fill="#27272a" stroke="#ef4444" strokeWidth="2" />
      <text x="130" y="190" fill="#ef4444" fontSize="14" fontWeight="700" textAnchor="middle">INFLATION</text>
      <text x="130" y="230" fill="#f87171" fontSize="36" fontWeight="700" textAnchor="middle">↑</text>
      <text x="130" y="257" fill="#a1a1aa" fontSize="10" textAnchor="middle">Les prix montent</text>

      {/* Box 2 — TAUX */}
      <rect x="235" y="160" width="150" height="110" rx="8" fill="#27272a" stroke="#fbbf24" strokeWidth="2" />
      <text x="310" y="190" fill="#fbbf24" fontSize="14" fontWeight="700" textAnchor="middle">TAUX</text>
      <text x="310" y="230" fill="#fbbf24" fontSize="36" fontWeight="700" textAnchor="middle">%</text>
      <text x="310" y="250" fill="#a1a1aa" fontSize="10" textAnchor="middle">La banque centrale</text>
      <text x="310" y="263" fill="#a1a1aa" fontSize="10" textAnchor="middle">monte les taux</text>

      {/* Box 3 — DEVISE */}
      <rect x="415" y="160" width="150" height="110" rx="8" fill="#27272a" stroke="#60a5fa" strokeWidth="2" />
      <text x="490" y="190" fill="#60a5fa" fontSize="14" fontWeight="700" textAnchor="middle">DEVISE</text>
      <text x="490" y="230" fill="#60a5fa" fontSize="36" fontWeight="700" textAnchor="middle">$</text>
      <text x="490" y="250" fill="#a1a1aa" fontSize="10" textAnchor="middle">Devient plus</text>
      <text x="490" y="263" fill="#a1a1aa" fontSize="10" textAnchor="middle">attractive</text>

      {/* Box 4 — MARCHÉS */}
      <rect x="595" y="160" width="150" height="110" rx="8" fill="#27272a" stroke="#10b981" strokeWidth="2" />
      <text x="670" y="190" fill="#10b981" fontSize="14" fontWeight="700" textAnchor="middle">MARCHÉS</text>
      <text x="670" y="230" fill="#34d399" fontSize="28" fontWeight="700" textAnchor="middle">▲▼</text>
      <text x="670" y="250" fill="#a1a1aa" fontSize="10" textAnchor="middle">Forex / Indices</text>
      <text x="670" y="263" fill="#a1a1aa" fontSize="10" textAnchor="middle">Or / Crypto</text>

      {/* Layer 4 — Flèches */}
      <line x1="205" y1="215" x2="235" y2="215" stroke="#71717a" strokeWidth="3" markerEnd="url(#arrow-inflation)" />
      <line x1="385" y1="215" x2="415" y2="215" stroke="#71717a" strokeWidth="3" markerEnd="url(#arrow-inflation)" />
      <line x1="565" y1="215" x2="595" y2="215" stroke="#71717a" strokeWidth="3" markerEnd="url(#arrow-inflation)" />

      {/* Layer 5 — Annotations sous les flèches */}
      <text x="220" y="235" fill="#71717a" fontSize="10" fontStyle="italic" textAnchor="middle">force</text>
      <text x="400" y="235" fill="#71717a" fontSize="10" fontStyle="italic" textAnchor="middle">renforce</text>
      <text x="580" y="235" fill="#71717a" fontSize="10" fontStyle="italic" textAnchor="middle">impacte</text>

      {/* Layer 6 — Encadré exemple 2022-2023 */}
      <rect x="55" y="320" width="690" height="90" rx="6" fill="#09090b" fillOpacity="0.5" stroke="#3f3f46" strokeWidth="1" />

      <text x="400" y="340" fill="#fbbf24" fontSize="11" fontWeight="700" letterSpacing="0.05em" textAnchor="middle">
        EXEMPLE — La chaîne en action (2022-2023)
      </text>

      {/* Stat 1 — Inflation US */}
      <text x="130" y="363" fill="#a1a1aa" fontSize="10" textAnchor="middle">Inflation US</text>
      <text x="130" y="383" fill="#f87171" fontSize="14" fontWeight="700" textAnchor="middle">1.4% → 9.1%</text>

      {/* Stat 2 — Taux Fed */}
      <text x="310" y="363" fill="#a1a1aa" fontSize="10" textAnchor="middle">Taux Fed</text>
      <text x="310" y="383" fill="#fbbf24" fontSize="14" fontWeight="700" textAnchor="middle">0.25% → 5.5%</text>

      {/* Stat 3 — Dollar */}
      <text x="490" y="363" fill="#a1a1aa" fontSize="10" textAnchor="middle">Dollar (DXY)</text>
      <text x="490" y="383" fill="#60a5fa" fontSize="14" fontWeight="700" textAnchor="middle">+20%</text>

      {/* Stat 4 — Nasdaq */}
      <text x="670" y="363" fill="#a1a1aa" fontSize="10" textAnchor="middle">Nasdaq</text>
      <text x="670" y="383" fill="#f87171" fontSize="14" fontWeight="700" textAnchor="middle">-33%</text>

      {/* Ligne narrative */}
      <text x="400" y="400" fill="#a1a1aa" fontSize="11" fontStyle="italic" textAnchor="middle">
        Une seule cause macro a fait bouger TOUT le marché.
      </text>

      {/* Layer 7 — Pied de page */}
      <text x="400" y="435" fill="#34d399" fontSize="12" fontWeight="700" fontStyle="italic" textAnchor="middle">
        Suivre l&apos;inflation = comprendre 80% des mouvements macro
      </text>
    </svg>
  );
};

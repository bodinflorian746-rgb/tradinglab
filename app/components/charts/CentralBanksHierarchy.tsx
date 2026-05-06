export const CentralBanksHierarchy = () => {
  return (
    <svg
      className="w-full h-auto"
      viewBox="0 0 800 450"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id="arrowhead-cb" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#3f3f46" />
        </marker>
      </defs>

      {/* Layer 1 — Fond */}
      <rect width="800" height="450" fill="#18181b" rx="8" />
      <rect width="800" height="450" fill="none" stroke="#27272a" strokeWidth="1" rx="8" />

      {/* Layer 2 — Titre pédagogique */}
      <text x="400" y="40" fill="#a1a1aa" fontSize="14" fontStyle="italic" textAnchor="middle">
        Le marché est influencé par plusieurs banques — mais une domine.
      </text>

      {/* Layer 3 — Box FED (dominante, en haut centré) */}
      <rect x="300" y="80" width="200" height="110" rx="8" fill="#10b981" stroke="#34d399" strokeWidth="2" />
      <text x="400" y="122" fill="white" fontSize="28" fontWeight="800" textAnchor="middle">FED</text>
      <text x="400" y="145" fill="#09090b" fontSize="11" fontWeight="600" textAnchor="middle">Réserve fédérale</text>
      <text x="400" y="175" fill="#09090b" fontSize="20" fontWeight="800" textAnchor="middle">USD</text>

      {/* Layer 4 — 3 boxes secondaires */}

      {/* Box BCE */}
      <rect x="100" y="290" width="160" height="90" rx="6" fill="#27272a" stroke="#60a5fa" strokeWidth="2" />
      <text x="180" y="320" fill="#60a5fa" fontSize="20" fontWeight="700" textAnchor="middle">BCE</text>
      <text x="180" y="340" fill="#a1a1aa" fontSize="9" textAnchor="middle">Banque centrale européenne</text>
      <text x="180" y="365" fill="white" fontSize="16" fontWeight="700" textAnchor="middle">EUR</text>

      {/* Box BoE */}
      <rect x="320" y="290" width="160" height="90" rx="6" fill="#27272a" stroke="#fbbf24" strokeWidth="2" />
      <text x="400" y="320" fill="#fbbf24" fontSize="20" fontWeight="700" textAnchor="middle">BoE</text>
      <text x="400" y="340" fill="#a1a1aa" fontSize="9" textAnchor="middle">Bank of England</text>
      <text x="400" y="365" fill="white" fontSize="16" fontWeight="700" textAnchor="middle">GBP</text>

      {/* Box BoJ */}
      <rect x="540" y="290" width="160" height="90" rx="6" fill="#27272a" stroke="#a1a1aa" strokeWidth="2" strokeDasharray="4 4" />
      <text x="620" y="320" fill="#a1a1aa" fontSize="20" fontWeight="700" textAnchor="middle">BoJ</text>
      <text x="620" y="340" fill="#71717a" fontSize="9" textAnchor="middle">Banque du Japon</text>
      <text x="620" y="365" fill="white" fontSize="16" fontWeight="700" textAnchor="middle">JPY</text>

      {/* Layer 5 — Flèches d'influence (FED → BCE, BoE, BoJ) */}
      <path
        d="M 350 195 Q 280 240 185 285"
        stroke="#3f3f46"
        strokeWidth="2"
        markerEnd="url(#arrowhead-cb)"
      />
      <line
        x1="400" y1="195" x2="400" y2="285"
        stroke="#3f3f46"
        strokeWidth="2"
        markerEnd="url(#arrowhead-cb)"
      />
      <path
        d="M 450 195 Q 520 240 615 285"
        stroke="#3f3f46"
        strokeWidth="2"
        markerEnd="url(#arrowhead-cb)"
      />

      {/* Layer 6 — Annotations */}

      {/* Sous-titre FED */}
      <text x="400" y="212" fill="#34d399" fontSize="11" fontStyle="italic" fontWeight="600" textAnchor="middle">
        Le boss du jeu
      </text>

      {/* Pied de page */}
      <text x="400" y="425" fill="#a1a1aa" fontSize="12" fontStyle="italic" textAnchor="middle">
        Tous les actifs majeurs dépendent du dollar : forex, or, crypto, indices US.
      </text>
    </svg>
  );
};

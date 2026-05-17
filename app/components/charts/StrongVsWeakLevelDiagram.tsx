export default function StrongVsWeakLevelDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 400"
      className={`w-full h-auto ${className}`}
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        Reconnaître un niveau fort vs un niveau faible
      </text>

      <line x1="400" y1="40" x2="400" y2="370" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ PANEL GAUCHE — Niveau fort (4 touches) ═══ */}
      <rect x="60" y="50" width="280" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="200" y="65" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">✓ Niveau fort — 4 touches franches</text>

      {/* Niveau support fort emerald */}
      <line x1="50" y1="250" x2="380" y2="250" stroke="#10b981" strokeWidth="1.5" strokeDasharray="5 3" />
      <rect x="320" y="262" width="60" height="20" rx="4" fill="#10b98120" stroke="#10b981" strokeWidth="0.8" />
      <text x="350" y="276" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">4 600$</text>

      {/* Path qui rebondit 4 fois avec rejets nets */}
      <path d="M50,150 L90,250 L130,140 L170,250 L210,130 L250,250 L290,150 L330,250 L370,170" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      {/* 4 cercles emerald aux touches */}
      <circle cx="90" cy="250" r="5" fill="#10b981" />
      <circle cx="170" cy="250" r="5" fill="#10b981" />
      <circle cx="250" cy="250" r="5" fill="#10b981" />
      <circle cx="330" cy="250" r="5" fill="#10b981" />

      <text x="200" y="345" fill="#a1a1aa" fontSize="8" textAnchor="middle">Rebonds nets et amplitude soutenue</text>

      {/* ═══ PANEL DROIT — Niveau faible (2 touches) ═══ */}
      <rect x="460" y="50" width="280" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
      <text x="600" y="65" fill="#f59e0b" fontSize="10" fontWeight="600" textAnchor="middle">⚠ Niveau faible — 2 touches molles</text>

      {/* Niveau support faible amber */}
      <line x1="450" y1="270" x2="780" y2="270" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 3" />
      <rect x="720" y="282" width="60" height="20" rx="4" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="0.8" />
      <text x="750" y="296" fill="#f59e0b" fontSize="9" fontWeight="600" textAnchor="middle">4 540$</text>

      {/* Path qui touche 2 fois faiblement (peu d'amplitude après touche) */}
      <path d="M450,200 L500,270 L540,240 L590,260 L630,270 L680,250 L720,260 L770,240" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      {/* 2 cercles amber aux touches molles */}
      <circle cx="500" cy="270" r="4" fill="#f59e0b" />
      <circle cx="630" cy="270" r="4" fill="#f59e0b" />

      <text x="600" y="345" fill="#a1a1aa" fontSize="8" textAnchor="middle">Rebonds peu amples, hésitation</text>

      <text x="400" y="385" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        Plus de touches franches = niveau institutionnel défendu
      </text>
    </svg>
  );
}

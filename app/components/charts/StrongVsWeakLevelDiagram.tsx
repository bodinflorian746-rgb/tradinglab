export default function StrongVsWeakLevelDiagram({ className = "", locale = "fr" }: { className?: string; locale?: "fr" | "es" }) {
  const L = locale === "es"
    ? {
        title: "Reconocer un nivel fuerte vs un nivel débil",
        strong: "✓ Nivel fuerte — 4 toques francos",
        strongDesc: "Rebotes nítidos y amplitud sostenida",
        weak: "⚠ Nivel débil — 2 toques blandos",
        weakDesc: "Rebotes poco amplios, vacilación",
        footer: "Más toques francos = nivel institucional defendido",
        mobTitle: "Reconocer un nivel fuerte vs débil",
        mobStrong: "✓ Nivel fuerte — 4 toques francos",
        mobStrongDesc: "El precio rebota nítidamente en cada contacto, sin dudar.",
        mobWeak: "✗ Nivel débil — rebotes poco amplios",
        mobWeakDesc: "El precio toca pero duda, rebota débilmente, termina rompiéndose.",
        mobFooter: "Más toques francos = nivel institucional defendido",
      }
    : {
        title: "Reconnaître un niveau fort vs un niveau faible",
        strong: "✓ Niveau fort — 4 touches franches",
        strongDesc: "Rebonds nets et amplitude soutenue",
        weak: "⚠ Niveau faible — 2 touches molles",
        weakDesc: "Rebonds peu amples, hésitation",
        footer: "Plus de touches franches = niveau institutionnel défendu",
        mobTitle: "Reconnaître un niveau fort vs faible",
        mobStrong: "✓ Niveau fort — 4 touches franches",
        mobStrongDesc: "Le prix rebondit nettement à chaque contact, sans hésiter.",
        mobWeak: "✗ Niveau faible — rebonds peu amples",
        mobWeakDesc: "Le prix touche mais hésite, rebondit faiblement, finit par casser.",
        mobFooter: "Plus de touches franches = niveau institutionnel défendu",
      };
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 400"
      className="hidden sm:block w-full h-auto"
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        {L.title}
      </text>

      <line x1="400" y1="40" x2="400" y2="370" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ PANEL GAUCHE — Niveau fort (4 touches) ═══ */}
      <rect x="60" y="50" width="280" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="200" y="65" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">{L.strong}</text>

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

      <text x="200" y="345" fill="#a1a1aa" fontSize="8" textAnchor="middle">{L.strongDesc}</text>

      {/* ═══ PANEL DROIT — Niveau faible (2 touches) ═══ */}
      <rect x="460" y="50" width="280" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
      <text x="600" y="65" fill="#f59e0b" fontSize="10" fontWeight="600" textAnchor="middle">{L.weak}</text>

      {/* Niveau support faible amber */}
      <line x1="450" y1="270" x2="780" y2="270" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 3" />
      <rect x="720" y="282" width="60" height="20" rx="4" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="0.8" />
      <text x="750" y="296" fill="#f59e0b" fontSize="9" fontWeight="600" textAnchor="middle">4 540$</text>

      {/* Path qui touche 2 fois faiblement (peu d'amplitude après touche) */}
      <path d="M450,200 L500,270 L540,240 L590,260 L630,270 L680,250 L720,260 L770,240" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      {/* 2 cercles amber aux touches molles */}
      <circle cx="500" cy="270" r="4" fill="#f59e0b" />
      <circle cx="630" cy="270" r="4" fill="#f59e0b" />

      <text x="600" y="345" fill="#a1a1aa" fontSize="8" textAnchor="middle">{L.weakDesc}</text>

      <text x="400" y="385" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        {L.footer}
      </text>
    </svg>

    {/* MOBILE : niveau fort vs faible ─────────────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">{L.mobTitle}</p>
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
        <p className="text-[13px] font-bold text-emerald-400">{L.mobStrong}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mobStrongDesc}</p>
      </div>
      <div className="rounded-lg border border-red-500/40 bg-red-500/8 p-3">
        <p className="text-[13px] font-bold text-red-400">{L.mobWeak}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mobWeakDesc}</p>
      </div>
      <p className="text-[13px] text-emerald-400 font-bold text-center pt-2 border-t border-zinc-800 leading-snug">
        {L.mobFooter}
      </p>
    </div>
    </div>
  );
}

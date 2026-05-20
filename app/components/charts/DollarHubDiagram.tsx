export const DollarHubDiagram = () => {
  return (
    <div>
    <svg
      className="hidden sm:block w-full h-auto"
      viewBox="0 0 800 450"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Layer 1 — Fond */}
      <rect width="800" height="450" fill="#18181b" rx="8" />
      <rect width="800" height="450" fill="none" stroke="#27272a" strokeWidth="1" rx="8" />

      {/* Layer 2 — Titre */}
      <text x="400" y="35" fill="white" fontSize="16" fontWeight="700" textAnchor="middle">
        Le dollar au centre du système financier
      </text>
      <text x="400" y="55" fill="#a1a1aa" fontSize="12" fontStyle="italic" textAnchor="middle">
        5 marchés majeurs, 1 seule devise pivot
      </text>

      {/* Layer 3 — 5 rayons pointillés (PREMIER, sous le reste) */}

      {/* Centre → Forex (haut) */}
      <line x1="400" y1="235" x2="400" y2="160" stroke="#3f3f46" strokeWidth="2" strokeDasharray="4 4" />

      {/* Centre → Or (haut-droite) */}
      <line x1="400" y1="235" x2="530" y2="170" stroke="#3f3f46" strokeWidth="2" strokeDasharray="4 4" />

      {/* Centre → Crypto (bas-droite) */}
      <line x1="400" y1="235" x2="530" y2="305" stroke="#3f3f46" strokeWidth="2" strokeDasharray="4 4" />

      {/* Centre → Indices (bas-gauche) */}
      <line x1="400" y1="235" x2="270" y2="305" stroke="#3f3f46" strokeWidth="2" strokeDasharray="4 4" />

      {/* Centre → Matières premières (haut-gauche) */}
      <line x1="400" y1="235" x2="270" y2="170" stroke="#3f3f46" strokeWidth="2" strokeDasharray="4 4" />

      {/* Layer 4 — 5 satellites */}

      {/* Satellite 1 — FOREX (haut, centre x=400 y=130) */}
      <rect x="335" y="100" width="130" height="60" rx="6" fill="#27272a" stroke="#3f3f46" strokeWidth="1.5" />
      <text x="400" y="125" fill="#d4d4d8" fontSize="12" fontWeight="700" textAnchor="middle">FOREX</text>
      <text x="400" y="145" fill="#a1a1aa" fontSize="10" textAnchor="middle">EUR/USD, GBP/USD</text>

      {/* Satellite 2 — OR (haut-droite, centre x=595 y=170) */}
      <rect x="530" y="140" width="130" height="60" rx="6" fill="#27272a" stroke="#3f3f46" strokeWidth="1.5" />
      <text x="595" y="165" fill="#d4d4d8" fontSize="12" fontWeight="700" textAnchor="middle">OR</text>
      <text x="595" y="185" fill="#a1a1aa" fontSize="10" textAnchor="middle">XAU/USD</text>

      {/* Satellite 3 — CRYPTO (bas-droite, centre x=595 y=305) */}
      <rect x="530" y="275" width="130" height="60" rx="6" fill="#27272a" stroke="#3f3f46" strokeWidth="1.5" />
      <text x="595" y="300" fill="#d4d4d8" fontSize="12" fontWeight="700" textAnchor="middle">CRYPTO</text>
      <text x="595" y="320" fill="#a1a1aa" fontSize="10" textAnchor="middle">BTC/USD</text>

      {/* Satellite 4 — INDICES (bas-gauche, centre x=205 y=305) */}
      <rect x="140" y="275" width="130" height="60" rx="6" fill="#27272a" stroke="#3f3f46" strokeWidth="1.5" />
      <text x="205" y="300" fill="#d4d4d8" fontSize="12" fontWeight="700" textAnchor="middle">INDICES</text>
      <text x="205" y="320" fill="#a1a1aa" fontSize="10" textAnchor="middle">NASDAQ, S&amp;P500</text>

      {/* Satellite 5 — MATIÈRES PREMIÈRES (haut-gauche, centre x=205 y=170) */}
      <rect x="140" y="140" width="130" height="60" rx="6" fill="#27272a" stroke="#3f3f46" strokeWidth="1.5" />
      <text x="205" y="165" fill="#d4d4d8" fontSize="12" fontWeight="700" textAnchor="middle">MATIÈRES PREM.</text>
      <text x="205" y="185" fill="#a1a1aa" fontSize="10" textAnchor="middle">Pétrole, cuivre</text>

      {/* Layer 5 — Hub central (DXY/USD) */}
      <circle cx="400" cy="235" r="70" fill="#27272a" stroke="#60a5fa" strokeWidth="3" />
      <text x="400" y="212" fill="#a1a1aa" fontSize="10" fontStyle="italic" textAnchor="middle">Force du dollar</text>
      <text x="400" y="240" fill="#60a5fa" fontSize="32" fontWeight="800" textAnchor="middle">DXY</text>
      <text x="400" y="260" fill="#60a5fa" fontSize="14" fontWeight="600" textAnchor="middle">USD</text>

      {/* Layer 6 — Annotations effet DXY */}

      {/* Gauche — DXY ↑ */}
      <rect x="290" y="380" width="90" height="22" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="335" y="395" fill="#f87171" fontSize="11" fontWeight="700" textAnchor="middle">DXY ↑ = pression</text>

      {/* Droite — DXY ↓ */}
      <rect x="420" y="380" width="110" height="22" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="475" y="395" fill="#34d399" fontSize="11" fontWeight="700" textAnchor="middle">DXY ↓ = respiration</text>

      {/* Layer 7 — Pied de page */}
      <text x="400" y="430" fill="#34d399" fontSize="12" fontWeight="700" fontStyle="italic" textAnchor="middle">
        Le dollar est au centre. Quand il bouge, tout réagit.
      </text>
    </svg>

    {/* ── MOBILE : hub DXY + 5 satellites empilés ────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-4 space-y-3">
      <p className="text-[14px] font-bold text-white text-center leading-snug">
        Le dollar au centre du système financier
      </p>
      <p className="text-[12px] text-zinc-400 italic text-center -mt-1">
        5 marchés majeurs, 1 seule devise pivot
      </p>

      {/* Hub DXY */}
      <div className="rounded-2xl border-2 border-blue-400 bg-zinc-800 p-4 text-center">
        <p className="text-[11px] text-zinc-400 italic">Force du dollar</p>
        <p className="text-[36px] font-bold text-blue-400 leading-none mt-1">DXY</p>
        <p className="text-[14px] font-bold text-blue-400 mt-1">USD</p>
      </div>

      {/* 5 satellites en grille 2x2 + 1 */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { name: "FOREX", desc: "EUR/USD, GBP/USD" },
          { name: "OR", desc: "XAU/USD" },
          { name: "CRYPTO", desc: "BTC/USD" },
          { name: "INDICES", desc: "NASDAQ, S&P500" },
        ].map((sat) => (
          <div key={sat.name} className="rounded-lg border border-zinc-700 bg-zinc-800/60 p-2.5 text-center">
            <p className="text-[13px] font-bold text-zinc-200">{sat.name}</p>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-tight">{sat.desc}</p>
          </div>
        ))}
        <div className="col-span-2 rounded-lg border border-zinc-700 bg-zinc-800/60 p-2.5 text-center">
          <p className="text-[13px] font-bold text-zinc-200">MATIÈRES PREMIÈRES</p>
          <p className="text-[11px] text-zinc-400 mt-0.5">Pétrole, cuivre</p>
        </div>
      </div>

      {/* Effet DXY */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800">
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-2 text-center">
          <p className="text-[13px] font-bold text-red-400">DXY ↑</p>
          <p className="text-[12px] text-zinc-300 mt-0.5">= pression</p>
        </div>
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-2 text-center">
          <p className="text-[13px] font-bold text-emerald-400">DXY ↓</p>
          <p className="text-[12px] text-zinc-300 mt-0.5">= respiration</p>
        </div>
      </div>

      <p className="text-[13px] text-emerald-400 font-bold italic text-center leading-snug pt-2">
        Le dollar est au centre. Quand il bouge, tout réagit.
      </p>
    </div>
    </div>
  );
};

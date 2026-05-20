export default function TrendStrengthGradationDiagram({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 400"
      className="hidden sm:block w-full h-auto"
    >
      <text x="450" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        Qualifier la force d&apos;une tendance
      </text>

      <line x1="305" y1="40" x2="305" y2="370" stroke="#3f3f46" strokeWidth="1" />
      <line x1="605" y1="40" x2="605" y2="370" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ PANEL 1 — Tendance faible ═══ */}
      <rect x="35" y="50" width="230" height="22" rx="11" fill="#71717a30" stroke="#71717a" strokeWidth="1" />
      <text x="150" y="65" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">Faible — 50 pips</text>

      {/* Path montant TRÈS MOU — départ x=20 y=280, fin x=270 y=240, gain visuel 40 pixels */}
      <path d="M20,280 L80,270 L130,275 L180,260 L220,255 L270,240" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      {/* Pivots espacés et peu marqués */}
      <circle cx="80" cy="270" r="3" fill="#a1a1aa" />
      <circle cx="220" cy="255" r="3" fill="#a1a1aa" />

      <rect x="60" y="200" width="180" height="18" rx="4" fill="#27272a" stroke="#71717a" strokeWidth="0.8" />
      <text x="150" y="212" fill="#a1a1aa" fontSize="9" textAnchor="middle">Pente ~15° / 50 pips</text>

      <text x="150" y="335" fill="#71717a" fontSize="8" textAnchor="middle">Peu de pivots, pente molle</text>
      <text x="150" y="350" fill="#71717a" fontSize="8" textAnchor="middle">Peu exploitable</text>

      {/* ═══ PANEL 2 — Tendance modérée ═══ */}
      <rect x="335" y="50" width="230" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
      <text x="450" y="65" fill="#f59e0b" fontSize="11" fontWeight="700" textAnchor="middle">Modérée — 100 pips</text>

      {/* Path montant pente ~35° */}
      <path d="M325,290 L375,250 L420,265 L470,200 L520,220 L570,150 L590,160" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      <circle cx="375" cy="250" r="4" fill="#f59e0b" />
      <circle cx="470" cy="200" r="4" fill="#f59e0b" />
      <circle cx="570" cy="150" r="4" fill="#f59e0b" />

      <text x="450" y="335" fill="#f59e0b" fontSize="8" textAnchor="middle">Angle ~35° — pente modérée</text>
      <text x="450" y="350" fill="#f59e0b" fontSize="8" textAnchor="middle">Exploitable avec discipline</text>

      {/* ═══ PANEL 3 — Tendance forte ═══ */}
      <rect x="635" y="50" width="230" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="750" y="65" fill="#10b981" fontSize="11" fontWeight="700" textAnchor="middle">Forte — 200 pips</text>

      {/* Path montant pente ~55° */}
      <path d="M625,320 L680,250 L720,265 L770,170 L810,190 L860,90 L885,85" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      <circle cx="680" cy="250" r="4" fill="#10b981" />
      <circle cx="770" cy="170" r="4" fill="#10b981" />
      <circle cx="860" cy="90" r="5" fill="#10b981" />

      <text x="750" y="335" fill="#10b981" fontSize="8" textAnchor="middle">Angle ~55° — pente forte</text>
      <text x="750" y="350" fill="#10b981" fontSize="8" textAnchor="middle">Setup à privilégier</text>

      <text x="450" y="390" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        Plus l&apos;amplitude est grande, plus le R/R structurel devient favorable
      </text>
    </svg>

    {/* MOBILE : 3 forces de tendance ──────────────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">Qualifier la force d'une tendance</p>
      <div className="rounded-lg border border-zinc-600 bg-zinc-800/40 p-3">
        <p className="text-[13px] font-bold text-zinc-300">Faible — 50 pips · pente 15°</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">Amplitude réduite, R/R limité. Évite ou prends des tailles plus petites.</p>
      </div>
      <div className="rounded-lg border border-blue-400/40 bg-blue-500/8 p-3">
        <p className="text-[13px] font-bold text-blue-400">Modérée — 150 pips · pente 35°</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">Tendance tradable avec une bonne discipline.</p>
      </div>
      <div className="rounded-lg border-2 border-emerald-500 bg-emerald-500/8 p-3">
        <p className="text-[13px] font-bold text-emerald-400">Forte — 400+ pips · pente 55°</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">Setup à privilégier — R/R structurel maximal.</p>
      </div>
      <p className="text-[13px] text-emerald-400 font-bold text-center pt-2 border-t border-zinc-800 leading-snug">
        Plus l'amplitude est grande, plus le R/R est favorable.
      </p>
    </div>
    </div>
  );
}

export default function SLManagementProgressionDiagram({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 300"
      className="hidden sm:block w-full h-auto"
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        Gestion dynamique du SL en 4 étapes
      </text>

      <line x1="200" y1="40" x2="200" y2="270" stroke="#3f3f46" strokeWidth="1" />
      <line x1="400" y1="40" x2="400" y2="270" stroke="#3f3f46" strokeWidth="1" />
      <line x1="600" y1="40" x2="600" y2="270" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ PANEL 1 — SL initial ═══ */}
      <rect x="20" y="50" width="170" height="20" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="0.8" />
      <text x="105" y="64" fill="#d4d4d8" fontSize="10" fontWeight="600" textAnchor="middle">Étape 1 — SL initial</text>
      {/* Entrée */}
      <line x1="20" y1="150" x2="190" y2="150" stroke="#10b981" strokeWidth="1.2" strokeDasharray="3 2" />
      {/* SL */}
      <line x1="20" y1="210" x2="190" y2="210" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="5 3" />
      <path d="M30,180 L65,165 L100,170 L135,155 L170,145" stroke="#71717a" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      {/* Halos + labels déplacés après path pour rester au-dessus */}
      <rect x="21" y="134" width="99" height="14" fill="#09090b" rx="3" />
      <text x="25" y="145" fill="#10b981" fontSize="8" fontWeight="600">Entrée 1.1795</text>
      <rect x="21" y="194" width="113" height="14" fill="#09090b" rx="3" />
      <text x="25" y="205" fill="#ef4444" fontSize="8" fontWeight="600">SL 1.1835 (+40)</text>
      <rect x="55" y="230" width="100" height="18" rx="4" fill="#ef444420" stroke="#ef4444" strokeWidth="0.8" />
      <text x="105" y="243" fill="#ef4444" fontSize="8" fontWeight="600" textAnchor="middle">SL initial 1.1835</text>

      {/* ═══ PANEL 2 — Resserrement ═══ */}
      <rect x="220" y="50" width="170" height="20" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="0.8" />
      <text x="305" y="64" fill="#d4d4d8" fontSize="10" fontWeight="600" textAnchor="middle">Étape 2 — Resserrement</text>
      <line x1="220" y1="150" x2="390" y2="150" stroke="#10b981" strokeWidth="1.2" strokeDasharray="3 2" />
      <line x1="220" y1="180" x2="390" y2="180" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="5 3" />
      <path d="M230,200 L265,180 L300,170 L335,160 L370,155" stroke="#71717a" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      {/* Halos + labels déplacés après path */}
      <rect x="221" y="134" width="99" height="14" fill="#09090b" rx="3" />
      <text x="225" y="145" fill="#10b981" fontSize="8" fontWeight="600">Entrée 1.1795</text>
      <rect x="221" y="184" width="113" height="14" fill="#09090b" rx="3" />
      <text x="225" y="195" fill="#f59e0b" fontSize="8" fontWeight="600">SL 1.1815 (+20)</text>
      <rect x="255" y="230" width="100" height="18" rx="4" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="0.8" />
      <text x="305" y="243" fill="#f59e0b" fontSize="8" fontWeight="600" textAnchor="middle">SL resserré 1.1815</text>

      {/* ═══ PANEL 3 — Break-even ═══ */}
      <rect x="420" y="50" width="170" height="20" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="0.8" />
      <text x="505" y="64" fill="#d4d4d8" fontSize="10" fontWeight="600" textAnchor="middle">Étape 3 — Break-even</text>
      <line x1="420" y1="150" x2="590" y2="150" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" />
      <path d="M430,220 L465,195 L500,170 L535,155 L575,140" stroke="#71717a" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      {/* Halo + label déplacé après path */}
      <rect x="421" y="134" width="134" height="14" fill="#09090b" rx="3" />
      <text x="425" y="145" fill="#10b981" fontSize="8" fontWeight="600">SL = Entrée 1.1795</text>
      <rect x="455" y="230" width="100" height="18" rx="4" fill="#10b98120" stroke="#10b981" strokeWidth="0.8" />
      <text x="505" y="243" fill="#10b981" fontSize="8" fontWeight="600" textAnchor="middle">SL break-even</text>

      {/* ═══ PANEL 4 — Trailing ═══ */}
      <rect x="620" y="50" width="170" height="20" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="0.8" />
      <text x="705" y="64" fill="#d4d4d8" fontSize="10" fontWeight="600" textAnchor="middle">Étape 4 — Trailing</text>
      <line x1="620" y1="150" x2="790" y2="150" stroke="#71717a" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
      {/* SL trailing qui suit le prix avec écart */}
      <path d="M630,180 L665,160 L700,140 L735,120 L770,105" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 3" />
      <path d="M630,220 L665,200 L700,180 L735,160 L770,140" stroke="#71717a" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      {/* Halos + labels déplacés après les 2 paths pour rester au-dessus */}
      <rect x="621" y="134" width="99" height="14" fill="#09090b" rx="3" />
      <text x="625" y="145" fill="#71717a" fontSize="8">Entrée 1.1795</text>
      <rect x="694" y="89" width="85" height="14" fill="#09090b" rx="3" />
      <text x="775" y="100" fill="#10b981" fontSize="8" fontWeight="600" textAnchor="end">SL trailing</text>
      <rect x="655" y="230" width="100" height="18" rx="4" fill="#10b98120" stroke="#10b981" strokeWidth="0.8" />
      <text x="705" y="243" fill="#10b981" fontSize="8" fontWeight="600" textAnchor="middle">Suit le prix</text>
    </svg>

    {/* MOBILE : gestion SL en 4 étapes ───────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">Gestion dynamique du SL en 4 étapes</p>
      <div className="rounded-lg border border-zinc-600 bg-zinc-800/40 p-3">
        <p className="text-[13px] font-bold text-zinc-300">1 · SL initial — fixe</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">Place le SL au point structurel à l'entrée. Reste fixe tant que le prix n'a pas avancé.</p>
      </div>
      <div className="rounded-lg border border-amber-400/40 bg-amber-400/8 p-3">
        <p className="text-[13px] font-bold text-amber-400">2 · Break-even (+1R)</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">Dès que le prix avance d'1R, déplace le SL au prix d'entrée. Trade sans risque.</p>
      </div>
      <div className="rounded-lg border border-blue-400/40 bg-blue-500/8 p-3">
        <p className="text-[13px] font-bold text-blue-400">3 · SL sur structure intermédiaire</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">À chaque nouveau HH/HL formé, remonte le SL juste sous le dernier HL.</p>
      </div>
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
        <p className="text-[13px] font-bold text-emerald-400">4 · Trailing dynamique</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">SL suit le prix — laisse courir les gains. Sortie auto si retournement.</p>
      </div>
    </div>
    </div>
  );
}

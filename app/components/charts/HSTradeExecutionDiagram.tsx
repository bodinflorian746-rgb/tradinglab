export default function HSTradeExecutionDiagram({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 400"
      className="hidden sm:block w-full h-auto"
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        2 stratégies d&apos;entrée sur Head &amp; Shoulders
      </text>

      <line x1="400" y1="40" x2="400" y2="370" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ PANEL GAUCHE — Entrée à la cassure ═══ */}
      <rect x="60" y="50" width="280" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="200" y="65" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">Entrée à la cassure — R/R 2,5</text>

      {/* H&S classique */}
      <line x1="50" y1="140" x2="380" y2="140" stroke="#a1a1aa" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.5" />
      <rect x="315" y="127" width="38" height="11" rx="2" fill="#09090b" />
      <text x="350" y="135" fill="#a1a1aa" fontSize="8" textAnchor="end">Épaules</text>
      <line x1="50" y1="200" x2="380" y2="200" stroke="#a1a1aa" strokeWidth="1" strokeDasharray="4 3" />
      <rect x="52" y="205" width="98" height="12" rx="2" fill="#09090b" />
      <text x="55" y="214" fill="#a1a1aa" fontSize="9" fontWeight="600">Neckline 4 580$</text>
      <line x1="50" y1="140" x2="380" y2="140" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />

      <path d="M60,280 L100,200 L130,140 L170,200 L210,90 L260,200 L300,140 L340,250 L375,290" stroke="#71717a" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
      <circle cx="130" cy="140" r="3" fill="#ef4444" />
      <circle cx="210" cy="90" r="4" fill="#ef4444" />
      <circle cx="300" cy="140" r="3" fill="#ef4444" />

      {/* Niveau SL/TP */}
      <line x1="50" y1="140" x2="380" y2="140" stroke="#ef4444" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.6" />
      <rect x="335" y="127" width="48" height="11" rx="2" fill="#09090b" />
      <text x="380" y="135" fill="#ef4444" fontSize="8" textAnchor="end">SL 4 620$</text>
      <line x1="50" y1="320" x2="380" y2="320" stroke="#10b981" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.6" />
      <rect x="335" y="327" width="48" height="11" rx="2" fill="#09090b" />
      <text x="380" y="335" fill="#10b981" fontSize="8" textAnchor="end">TP 4 470$</text>

      {/* Cercle entrée à la cassure */}
      <circle cx="340" cy="205" r="6" fill="#ef4444" />
      <rect x="240" y="225" width="120" height="18" rx="4" fill="#ef444420" stroke="#ef4444" strokeWidth="0.8" />
      <text x="300" y="237" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">Entrée short 4 575$</text>

      {/* ═══ PANEL DROIT — Entrée au retest ═══ */}
      <rect x="460" y="50" width="280" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="600" y="65" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">Entrée au retest — R/R 4,4</text>

      <line x1="450" y1="140" x2="780" y2="140" stroke="#a1a1aa" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.5" />
      <rect x="715" y="127" width="38" height="11" rx="2" fill="#09090b" />
      <text x="750" y="135" fill="#a1a1aa" fontSize="8" textAnchor="end">Épaules</text>
      <line x1="450" y1="200" x2="780" y2="200" stroke="#a1a1aa" strokeWidth="1" strokeDasharray="4 3" />
      <rect x="452" y="205" width="98" height="12" rx="2" fill="#09090b" />
      <text x="455" y="214" fill="#a1a1aa" fontSize="9" fontWeight="600">Neckline 4 580$</text>

      {/* H&S + retest */}
      <path d="M460,280 L500,200 L530,140 L570,200 L610,90 L660,200 L700,140 L730,230 L745,250 L765,210 L778,200" stroke="#71717a" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
      <circle cx="530" cy="140" r="3" fill="#ef4444" />
      <circle cx="610" cy="90" r="4" fill="#ef4444" />
      <circle cx="700" cy="140" r="3" fill="#ef4444" />

      <line x1="450" y1="140" x2="780" y2="140" stroke="#ef4444" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.6" />
      <rect x="735" y="127" width="48" height="11" rx="2" fill="#09090b" />
      <text x="780" y="135" fill="#ef4444" fontSize="8" textAnchor="end">SL 4 620$</text>
      <line x1="450" y1="320" x2="780" y2="320" stroke="#10b981" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.6" />
      <rect x="735" y="327" width="48" height="11" rx="2" fill="#09090b" />
      <text x="780" y="335" fill="#10b981" fontSize="8" textAnchor="end">TP 4 470$</text>

      {/* Cercle entrée au retest (sur la neckline) */}
      <circle cx="775" cy="200" r="6" fill="#10b981" />
      <rect x="650" y="225" width="125" height="18" rx="4" fill="#10b98120" stroke="#10b981" strokeWidth="0.8" />
      <text x="712" y="237" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">Entrée short 4 580$</text>

      <text x="400" y="385" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        Cassure = exécution rapide. Retest = entrée tardive avec meilleur R/R.
      </text>
    </svg>

    {/* MOBILE : 2 stratégies entrée H&S ───────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">2 stratégies d'entrée H&S</p>
      <div className="rounded-lg border border-amber-400/40 bg-amber-400/8 p-3">
        <p className="text-[13px] font-bold text-amber-400">Entrée sur cassure</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">Exécution rapide dès que le prix casse la neckline. R/R moyen, mais entrée immédiate.</p>
      </div>
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
        <p className="text-[13px] font-bold text-emerald-400">Entrée sur retest</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">Attendre que le prix revienne tester la neckline cassée. Tardive mais <span className="font-bold">meilleur R/R</span> (entrée 4 580 $).</p>
      </div>
    </div>
    </div>
  );
}

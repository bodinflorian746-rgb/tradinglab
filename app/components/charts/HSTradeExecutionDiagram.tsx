export default function HSTradeExecutionDiagram({ className = "", locale = "fr" }: { className?: string; locale?: "fr" | "es" }) {
  const isEs = locale === "es";
  const L = {
    title:        isEs ? "2 estrategias de entrada en Head & Shoulders" : "2 stratégies d'entrée sur Head & Shoulders",
    breakoutBadge: isEs ? "Entrada en ruptura — R/R 2,5" : "Entrée à la cassure — R/R 2,5",
    retestBadge:   isEs ? "Entrada en retest — R/R 4,4" : "Entrée au retest — R/R 4,4",
    shoulders:    isEs ? "Hombros" : "Épaules",
    entryShort:   isEs ? "Entrada short" : "Entrée short",
    footer:       isEs ? "Ruptura = ejecución rápida. Retest = entrada tardía con mejor R/R." : "Cassure = exécution rapide. Retest = entrée tardive avec meilleur R/R.",
    mobileTitle:  isEs ? "2 estrategias de entrada H&S" : "2 stratégies d'entrée H&S",
    mobBreakoutT: isEs ? "Entrada en ruptura" : "Entrée sur cassure",
    mobBreakoutD: isEs ? "Ejecución rápida cuando el precio rompe la neckline. R/R medio, pero entrada inmediata." : "Exécution rapide dès que le prix casse la neckline. R/R moyen, mais entrée immédiate.",
    mobRetestT:   isEs ? "Entrada en retest" : "Entrée sur retest",
    mobRetestD:   isEs ? "Esperar a que el precio vuelva a testear la neckline rota. Tardía pero" : "Attendre que le prix revienne tester la neckline cassée. Tardive mais",
    mobRetestBold:isEs ? "mejor R/R" : "meilleur R/R",
    mobRetestEnd: isEs ? "(entrada 4 580 $)" : "(entrée 4 580 $)",
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

      {/* ═══ PANEL GAUCHE — Entrée à la cassure ═══ */}
      <rect x="60" y="50" width="280" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="200" y="65" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">{L.breakoutBadge}</text>

      {/* H&S classique */}
      <line x1="50" y1="140" x2="380" y2="140" stroke="#a1a1aa" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.5" />
      <rect x="315" y="127" width="38" height="11" rx="2" fill="#09090b" />
      <text x="350" y="135" fill="#a1a1aa" fontSize="8" textAnchor="end">{L.shoulders}</text>
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
      <text x="300" y="237" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">{L.entryShort} 4 575$</text>

      {/* ═══ PANEL DROIT — Entrée au retest ═══ */}
      <rect x="460" y="50" width="280" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="600" y="65" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">{L.retestBadge}</text>

      <line x1="450" y1="140" x2="780" y2="140" stroke="#a1a1aa" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.5" />
      <rect x="715" y="127" width="38" height="11" rx="2" fill="#09090b" />
      <text x="750" y="135" fill="#a1a1aa" fontSize="8" textAnchor="end">{L.shoulders}</text>
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
      <text x="712" y="237" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">{L.entryShort} 4 580$</text>

      <text x="400" y="385" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        {L.footer}
      </text>
    </svg>

    {/* MOBILE : 2 stratégies entrée H&S ───────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">{L.mobileTitle}</p>
      <div className="rounded-lg border border-amber-400/40 bg-amber-400/8 p-3">
        <p className="text-[13px] font-bold text-amber-400">{L.mobBreakoutT}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mobBreakoutD}</p>
      </div>
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
        <p className="text-[13px] font-bold text-emerald-400">{L.mobRetestT}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mobRetestD} <span className="font-bold">{L.mobRetestBold}</span> {L.mobRetestEnd}.</p>
      </div>
    </div>
    </div>
  );
}

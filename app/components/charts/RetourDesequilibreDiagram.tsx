// Diagramme : retour dans le déséquilibre (Leçon 3 multi-timeframe)
// XAU/USD H1 — impulsion bearish puis retour du prix dans le FVG, suivi d'un rejet.

interface RetourDesequilibreDiagramProps {
  className?: string;
  locale?: "fr" | "es";
}

export function RetourDesequilibreDiagram({ className = "", locale = "fr" }: RetourDesequilibreDiagramProps) {
  const isEs = locale === "es";
  const L = {
    fvgLabel:  isEs ? "FVG bearish" : "FVG bearish",
    rejection: isEs ? "Rechazo del FVG" : "Rejet du FVG",
    annot:     isEs ? "Regreso al desequilibrio antes de la continuación" : "Retour dans le déséquilibre avant continuation",
    mobTitle:  isEs ? "Regreso al desequilibrio HTF" : "Retour sur déséquilibre HTF",
    mob1:      isEs ? "El impulso HTF crea un desequilibrio (FVG)." : "Impulsion HTF crée un déséquilibre (FVG).",
    mob2:      isEs ? "FVG = zona no mitigada → el mercado regresará." : "FVG = zone non mitigée → le marché y reviendra.",
    mob3:      isEs ? "Regreso del precio → mitigation y luego reanudación en el sentido inicial." : "Retour du prix → mitigation puis reprise dans le sens initial.",
    legend1:   isEs ? "Impulso HTF — deja un desequilibrio" : "Impulsion HTF — laisse un déséquilibre",
    legend2:   isEs ? "FVG = zona no mitigada" : "FVG = zone non mitigée",
    legend3:   isEs ? "Regreso del precio → mitigation y reanudación" : "Retour du prix → mitigation puis reprise",
  };
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg width="100%" viewBox="0 0 700 320" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">

        <rect x="20" y="20" width="118" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="79" y="35" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">XAU/USD · H1</text>

        <line x1="40" y1="74" x2="200" y2="74" stroke="#71717a" strokeWidth="1.2" strokeDasharray="3 2" strokeOpacity="0.7" />
        <rect x="40" y="60" width="64" height="13" rx="3" fill="#09090b" />
        <text x="72" y="70" fill="#71717a" fontSize="9" fontWeight="600" textAnchor="middle">4 680 $</text>

        <rect x="40" y="118" width="620" height="34" fill="#ef444418" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.7" />
        <rect x="40" y="104" width="56" height="13" rx="3" fill="#09090b" />
        <text x="68" y="114" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">4 660 $</text>
        <rect x="40" y="153" width="56" height="13" rx="3" fill="#09090b" />
        <text x="68" y="163" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">4 648 $</text>

        <rect x="566" y="126" width="80" height="13" rx="3" fill="#09090b" />
        <text x="606" y="136" fill="#f59e0b" fontSize="9" fontWeight="600" textAnchor="middle">{L.fvgLabel}</text>

        <path d="M50,80 L120,200 L168,242" stroke="#ef4444" strokeWidth="2.4" fill="none" strokeLinejoin="round" strokeLinecap="round" />

        <path d="M168,242 L220,228 L268,210 L316,194 L364,176 L406,160 L444,144" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

        <path d="M444,144 L478,178 L516,222 L554,252 L596,272 L632,284" stroke="#ef4444" strokeWidth="2.4" fill="none" strokeLinejoin="round" strokeLinecap="round" />

        <circle cx="444" cy="144" r="5" fill="#ef4444" />
        <rect x="376" y="118" width="78" height="13" rx="3" fill="#09090b" />
        <text x="415" y="128" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">{L.rejection}</text>

        <text x="618" y="298" fill="#ef4444" fontSize="18" opacity="0.5" textAnchor="middle">↘</text>

        <rect x="190" y="298" width="320" height="20" rx="10" fill="#09090b" />
        <rect x="190" y="298" width="320" height="20" rx="10" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="350" y="311" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          {L.annot}
        </text>
      </svg>

      <div className="sm:hidden p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">{L.mobTitle}</p>
        <ul className="space-y-2 text-[13px]">
          <li className="flex items-start gap-2.5"><span className="shrink-0 w-5 h-5 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-[11px] font-bold text-red-400 mt-0.5">1</span><span className="text-zinc-300">{L.mob1}</span></li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 w-5 h-5 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center text-[11px] font-bold text-blue-400 mt-0.5">2</span><span className="text-zinc-300">{L.mob2}</span></li>
          <li className="flex items-start gap-2.5"><span className="shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-[11px] font-bold text-emerald-400 mt-0.5">3</span><span className="text-zinc-300">{L.mob3}</span></li>
        </ul>
      </div>

      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">{L.legend1}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500/40 border border-red-500" />
          <span className="text-[10px] text-zinc-500">{L.legend2}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-zinc-500" />
          <span className="text-[10px] text-zinc-500">{L.legend3}</span>
        </div>
      </div>
    </div>
  );
}

export default function DivergenceWithoutBreakoutDiagram({ className = "", locale = "fr" }: { className?: string; locale?: "fr" | "es" }) {
  const isEs = locale === "es";
  const L = {
    title:        isEs ? "Divergencia perfecta sin ruptura = trampa" : "Divergence parfaite sans cassure = piège",
    price:        isEs ? "Precio" : "Prix",
    rsi:          "RSI",
    creuxLabel:   isEs ? "Mínimo estructural nunca roto — 4 570$" : "Creux structurel jamais cassé — 4 570$",
    trapBadge:    isEs ? "TRAMPA clásica" : "PIÈGE classique",
    continuation: isEs ? "Continuación alcista" : "Continuation haussière",
    divInop:      isEs ? "Divergencia perfecta pero inoperante" : "Divergence parfaite mais inopérante",
    footer:       isEs ? "Una divergencia solo es válida SI la estructura rompe. Aquí, el mínimo en 4 570$ aguanta → sin short." : "Une divergence n'est valide QUE si la structure casse. Ici, le creux à 4 570$ tient → pas de short.",
    mobTitle:     isEs ? "Divergencia perfecta sin ruptura = trampa" : "Divergence parfaite sans cassure = piège",
    mob1:         isEs ? "Divergencia bajista perfecta: precio HH, RSI LH → setup short tentador." : "Divergence baissière parfaite : prix HH, RSI LH → setup short tentant.",
    mob2Pre:      isEs ? "El mínimo estructural en" : "Le creux structurel à",
    mob2Bold:     "4 570 $",
    mob2End:      isEs ? "nunca es roto en cierre." : "n'est jamais cassé en clôture.",
    mob3Pre:      isEs ? "Sin ruptura →" : "Sans cassure →",
    mob3Bold:     isEs ? "sin short" : "pas de short",
    mob3End:      isEs ? ". La divergencia sola no basta." : ". La divergence seule ne suffit pas.",
    mobFooter:    isEs ? "Una divergencia solo es válida SI la estructura rompe." : "Une divergence n'est valide QUE si la structure casse.",
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

      {/* Zone prix */}
      <text x="35" y="80" fill="#a1a1aa" fontSize="9" fontWeight="600">{L.price}</text>
      <line x1="40" y1="140" x2="780" y2="140" stroke="#a1a1aa" strokeWidth="0.8" strokeDasharray="4 3" />

      <path d="M50,150 L120,80 L180,140 L240,60 L300,140 L340,170 L380,150 L430,120 L490,90 L560,70 L630,50 L720,40" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      <circle cx="120" cy="80" r="4" fill="#ef4444" />
      <rect x="96" y="62" width="48" height="14" rx="3" fill="#09090b" />
      <text x="120" y="73" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">HH1 4 620$</text>
      <circle cx="240" cy="60" r="5" fill="#ef4444" />
      <rect x="216" y="42" width="48" height="14" rx="3" fill="#09090b" />
      <text x="240" y="53" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">HH2 4 640$</text>

      <rect x="43" y="129" width="240" height="14" rx="3" fill="#09090b" />
      <text x="47" y="139" fill="#a1a1aa" fontSize="9">{L.creuxLabel}</text>

      <rect x="560" y="40" width="220" height="22" rx="11" fill="#09090b" />
      <rect x="560" y="40" width="220" height="22" rx="11" fill="#ef444433" stroke="#ef4444" strokeWidth="1" />
      <text x="670" y="55" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">{L.trapBadge}</text>

      <rect x="480" y="105" width="200" height="18" rx="4" fill="#09090b" />
      <rect x="480" y="105" width="200" height="18" rx="4" fill="#ef444433" stroke="#ef4444" strokeWidth="0.8" />
      <text x="580" y="118" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">{L.continuation}</text>

      <line x1="40" y1="240" x2="780" y2="240" stroke="#3f3f46" strokeWidth="1" />

      <text x="35" y="260" fill="#a1a1aa" fontSize="9" fontWeight="600">{L.rsi}</text>
      <line x1="40" y1="270" x2="780" y2="270" stroke="#71717a" strokeWidth="0.5" strokeDasharray="2 2" />
      <line x1="40" y1="360" x2="780" y2="360" stroke="#71717a" strokeWidth="0.5" strokeDasharray="2 2" />
      <text x="45" y="268" fill="#71717a" fontSize="7">70</text>
      <text x="45" y="368" fill="#71717a" fontSize="7">30</text>

      <path d="M50,330 L120,275 L180,320 L240,295 L300,330" stroke="#60a5fa" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
      <circle cx="120" cy="275" r="4" fill="#ef4444" />
      <rect x="98" y="255" width="48" height="14" rx="3" fill="#09090b" />
      <text x="120" y="266" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">LH1 RSI 75</text>
      <circle cx="240" cy="295" r="4" fill="#ef4444" />
      <rect x="218" y="275" width="48" height="14" rx="3" fill="#09090b" />
      <text x="240" y="286" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">LH2 RSI 68</text>
      <line x1="120" y1="275" x2="240" y2="295" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3 3" />

      <rect x="350" y="290" width="240" height="20" rx="4" fill="#09090b" />
      <rect x="350" y="290" width="240" height="20" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="0.8" />
      <text x="470" y="304" fill="#a1a1aa" fontSize="9" textAnchor="middle">{L.divInop}</text>

      <text x="400" y="395" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        {L.footer}
      </text>
    </svg>

    {/* MOBILE : divergence sans cassure = piège ───────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
      <p className="text-[14px] font-bold text-red-400 text-center">{L.mobTitle}</p>
      <ul className="space-y-2 text-[13px]">
        <li className="flex items-start gap-2.5">
          <span className="shrink-0 w-5 h-5 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center text-[11px] font-bold text-amber-400 mt-0.5">1</span>
          <span className="text-zinc-300">{L.mob1}</span>
        </li>
        <li className="flex items-start gap-2.5">
          <span className="shrink-0 w-5 h-5 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-[11px] font-bold text-red-400 mt-0.5">2</span>
          <span className="text-zinc-300">{L.mob2Pre} <span className="font-bold">{L.mob2Bold}</span> {L.mob2End}</span>
        </li>
        <li className="flex items-start gap-2.5">
          <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-[11px] font-bold text-emerald-400 mt-0.5">3</span>
          <span className="text-zinc-300">{L.mob3Pre} <span className="font-bold">{L.mob3Bold}</span>{L.mob3End}</span>
        </li>
      </ul>
      <p className="text-[13px] text-zinc-400 italic text-center pt-2 border-t border-zinc-800 leading-snug">
        {L.mobFooter}
      </p>
    </div>
    </div>
  );
}

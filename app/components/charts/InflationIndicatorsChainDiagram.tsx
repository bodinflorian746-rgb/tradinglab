interface InflationIndicatorsChainDiagramProps {
  locale?: "fr" | "es";
}

export const InflationIndicatorsChainDiagram = ({ locale = "fr" }: InflationIndicatorsChainDiagramProps = {}) => {
  const isEs = locale === "es";
  const L = {
    title:        isEs ? "La cadena de inflación que los pros vigilan" : "La chaîne d'inflation que les pros surveillent",
    subtitle:     isEs ? "Del productor al consumidor — y lo que la Fed mira realmente" : "Du producteur au consommateur — et ce que la Fed regarde vraiment",
    ppiTitle:     isEs ? "Precios productores" : "Prix producteurs",
    ppiTime:      isEs ? "D-12 días" : "J-12 jours",
    ppiNote:      isEs ? "Señal temprana" : "Signal précoce",
    announces:    isEs ? "anuncia a menudo" : "annonce souvent",
    cpiPrices:    isEs ? "Precios consumidores" : "Prix consommateurs",
    cpiTime:      isEs ? "Día D — 14h30" : "Jour J — 14h30",
    cpiNote:      isEs ? "Choque mediatizado" : "Choc médiatisé",
    coreTrend:    isEs ? "Tendencia de fondo" : "Tendance de fond",
    coreNote:     isEs ? "Lo que los pros miran" : "Ce que les pros regardent",
    interpreted:  isEs ? "interpretado por" : "interprété par",
    pceFav:       isEs ? "Indicador preferido" : "Indicateur préféré",
    pceFed:       isEs ? "de la Fed" : "de la Fed",
    pceRef:       isEs ? "★ Referencia oficial" : "★ Référence officielle",
    reaction:     isEs ? "REACCIÓN DEL MERCADO SEGÚN EL CORE CPI" : "RÉACTION MARCHÉ SELON LE CORE CPI",
    above:        isEs ? "Core CPI > expectativas" : "Core CPI > attentes",
    below:        isEs ? "Core CPI < expectativas" : "Core CPI < attentes",
    dxyUp:        isEs ? "↑ DXY (dólar fuerte)" : "↑ DXY (dollar fort)",
    dxyDown:      isEs ? "↓ DXY (dólar débil)" : "↓ DXY (dollar faible)",
    pairsDown:    isEs ? "↓ EUR/USD, Oro, Crypto" : "↓ EUR/USD, Or, Crypto",
    pairsUp:      isEs ? "↑ EUR/USD, Oro, Índices" : "↑ EUR/USD, Or, Indices",
    footer:       isEs ? "El PPI avisa. El CPI dispara. El Core confirma." : "Le PPI prévient. Le CPI déclenche. Le Core confirme.",
  };
  const indicators = isEs
    ? [
        { name: "PPI", color: "#60a5fa", title: "Precios productores", time: "D-12 días", note: "Señal temprana" },
        { name: "CPI HEADLINE", color: "#fbbf24", title: "Precios consumidores", time: "Día D — 14h30", note: "Choque mediatizado" },
        { name: "CORE CPI", color: "#10b981", title: "Tendencia de fondo", time: "Mismo día", note: "★ Lo que los pros miran" },
        { name: "CORE PCE", color: "#60a5fa", title: "Indicador preferido de la Fed", time: "Fin de mes", note: "★ Referencia oficial" },
      ]
    : [
        { name: "PPI", color: "#60a5fa", title: "Prix producteurs", time: "J-12 jours", note: "Signal précoce" },
        { name: "CPI HEADLINE", color: "#fbbf24", title: "Prix consommateurs", time: "Jour J — 14h30", note: "Choc médiatisé" },
        { name: "CORE CPI", color: "#10b981", title: "Tendance de fond", time: "Même jour", note: "★ Ce que les pros regardent" },
        { name: "CORE PCE", color: "#60a5fa", title: "Indicateur préféré de la Fed", time: "Fin de mois", note: "★ Référence officielle" },
      ];
  return (
    <div>
    <svg
      className="hidden sm:block w-full h-auto"
      viewBox="0 0 800 450"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Layer 0 — Defs */}
      <defs>
        <marker id="arrow-inflation-chain" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
          <polygon points="0 0, 10 5, 0 10" fill="#71717a" />
        </marker>
      </defs>

      {/* Layer 1 — Fond global */}
      <rect width="800" height="450" fill="#18181b" rx="8" />
      <rect width="800" height="450" fill="none" stroke="#27272a" strokeWidth="1" rx="8" />

      {/* Layer 2 — Titre */}
      <text x="400" y="35" fill="white" fontSize="16" fontWeight="700" textAnchor="middle">
        {L.title}
      </text>
      <text x="400" y="55" fill="#a1a1aa" fontSize="11" fontStyle="italic" textAnchor="middle">
        {L.subtitle}
      </text>

      {/* Layer 4 — Bloc PPI */}
      <rect x="30" y="110" width="150" height="90" rx="8" fill="#27272a" stroke="#60a5fa" strokeWidth="2" />
      <text x="105" y="140" fill="#60a5fa" fontSize="22" fontWeight="800" textAnchor="middle">PPI</text>
      <text x="105" y="160" fill="#d4d4d8" fontSize="10" textAnchor="middle">{L.ppiTitle}</text>
      <text x="105" y="180" fill="#a1a1aa" fontSize="9" fontStyle="italic" textAnchor="middle">{L.ppiTime}</text>
      <text x="105" y="193" fill="#a1a1aa" fontSize="9" fontStyle="italic" textAnchor="middle">{L.ppiNote}</text>

      {/* Layer 5 — Flèche PPI → CPI Headline */}
      <path d="M 180 155 L 300 155" stroke="#71717a" strokeWidth="2" markerEnd="url(#arrow-inflation-chain)" />
      <text x="240" y="170" fill="#a1a1aa" fontSize="10" fontStyle="italic" textAnchor="middle">{L.announces}</text>

      {/* Layer 6 — Bloc CPI Headline */}
      <rect x="300" y="80" width="170" height="100" rx="8" fill="#27272a" stroke="#fbbf24" strokeWidth="2" />
      <text x="385" y="110" fill="#fbbf24" fontSize="14" fontWeight="700" textAnchor="middle">CPI HEADLINE</text>
      <text x="385" y="130" fill="#d4d4d8" fontSize="10" textAnchor="middle">{L.cpiPrices}</text>
      <text x="385" y="150" fill="#a1a1aa" fontSize="9" fontStyle="italic" textAnchor="middle">{L.cpiTime}</text>
      <text x="385" y="163" fill="#a1a1aa" fontSize="9" fontStyle="italic" textAnchor="middle">{L.cpiNote}</text>

      {/* Layer 7 — Ligne pointillée CPI Headline → Core CPI */}
      <line x1="385" y1="180" x2="385" y2="200" stroke="#3f3f46" strokeWidth="1.5" strokeDasharray="3 3" />

      {/* Bloc Core CPI */}
      <rect x="300" y="200" width="170" height="80" rx="8" fill="#27272a" stroke="#10b981" strokeWidth="2" />
      <text x="385" y="225" fill="#10b981" fontSize="14" fontWeight="700" textAnchor="middle">CORE CPI</text>
      <text x="385" y="245" fill="#d4d4d8" fontSize="10" textAnchor="middle">{L.coreTrend}</text>
      <text x="385" y="265" fill="#34d399" fontSize="9" fontStyle="italic" textAnchor="middle">{L.coreNote}</text>

      {/* Layer 8 — Flèche Core CPI → Core PCE */}
      <path d="M 470 240 Q 530 200 590 175" stroke="#71717a" strokeWidth="2" fill="none" markerEnd="url(#arrow-inflation-chain)" />
      <text x="535" y="205" fill="#a1a1aa" fontSize="10" fontStyle="italic" textAnchor="middle">{L.interpreted}</text>

      {/* Layer 9 — Bloc Core PCE */}
      <rect x="590" y="130" width="180" height="90" rx="8" fill="#27272a" stroke="#60a5fa" strokeWidth="2" strokeOpacity="0.7" />
      <text x="680" y="160" fill="#60a5fa" fontSize="14" fontWeight="700" textAnchor="middle">CORE PCE</text>
      <text x="680" y="180" fill="#d4d4d8" fontSize="10" textAnchor="middle">{L.pceFav}</text>
      <text x="680" y="193" fill="#d4d4d8" fontSize="10" textAnchor="middle">{L.pceFed}</text>
      <text x="680" y="210" fill="#fbbf24" fontSize="9" fontStyle="italic" textAnchor="middle">{L.pceRef}</text>

      {/* Layer 10 — Encadré scénarios */}

      {/* Header centré */}
      <text x="400" y="305" fill="#fbbf24" fontSize="11" fontWeight="700" letterSpacing="0.05em" textAnchor="middle">
        {L.reaction}
      </text>

      {/* Colonne gauche — Scénario haussier (red) */}
      <rect x="30" y="320" width="365" height="80" rx="6" fill="#09090b" fillOpacity="0.5" stroke="#f87171" strokeWidth="1.5" strokeOpacity="0.6" />
      <text x="212" y="345" fill="#f87171" fontSize="13" fontWeight="700" textAnchor="middle">{L.above}</text>
      <text x="212" y="368" fill="#d4d4d8" fontSize="11" textAnchor="middle">{L.dxyUp}</text>
      <text x="212" y="386" fill="#a1a1aa" fontSize="11" textAnchor="middle">{L.pairsDown}</text>

      {/* Colonne droite — Scénario baissier (emerald) */}
      <rect x="405" y="320" width="365" height="80" rx="6" fill="#09090b" fillOpacity="0.5" stroke="#34d399" strokeWidth="1.5" strokeOpacity="0.6" />
      <text x="587" y="345" fill="#34d399" fontSize="13" fontWeight="700" textAnchor="middle">{L.below}</text>
      <text x="587" y="368" fill="#d4d4d8" fontSize="11" textAnchor="middle">{L.dxyDown}</text>
      <text x="587" y="386" fill="#a1a1aa" fontSize="11" textAnchor="middle">{L.pairsUp}</text>

      {/* Layer 11 — Pied de page */}
      <text x="400" y="430" fill="#34d399" fontSize="12" fontWeight="700" fontStyle="italic" textAnchor="middle">
        {L.footer}
      </text>
    </svg>

    {/* ── MOBILE : 4 indicateurs empilés + 2 scénarios ──────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-4 space-y-3">
      <p className="text-[14px] font-bold text-white text-center leading-snug">
        {L.title}
      </p>
      <p className="text-[12px] text-zinc-400 italic text-center -mt-1">
        {L.subtitle}
      </p>

      {/* 4 indicateurs empilés */}
      <div className="space-y-2">
        {indicators.map((ind, i) => (
          <div key={ind.name}>
            <div className="rounded-lg border-2 p-2.5" style={{ borderColor: ind.color }}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[16px] font-bold" style={{ color: ind.color }}>{ind.name}</span>
                <span className="text-[11px] text-zinc-500 italic font-mono">{ind.time}</span>
              </div>
              <p className="text-[12px] text-zinc-300 leading-snug mt-0.5">{ind.title}</p>
              <p className="text-[12px] leading-snug mt-0.5 italic" style={{ color: ind.note.startsWith("★") ? "#fbbf24" : "#a1a1aa" }}>{ind.note}</p>
            </div>
            {i < 3 && <p className="text-center text-zinc-600 text-[12px] my-0.5">↓</p>}
          </div>
        ))}
      </div>

      {/* 2 scénarios */}
      <p className="text-[12px] font-bold text-amber-400 uppercase tracking-wider text-center pt-2 border-t border-zinc-800">
        {L.reaction}
      </p>
      <div className="space-y-2">
        <div className="rounded-lg border border-red-500/40 bg-red-500/5 p-2.5">
          <p className="text-[13px] font-bold text-red-400">{L.above}</p>
          <p className="text-[12px] text-zinc-300 mt-1 leading-snug">{L.dxyUp}</p>
          <p className="text-[12px] text-zinc-300 leading-snug">{L.pairsDown}</p>
        </div>
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-2.5">
          <p className="text-[13px] font-bold text-emerald-400">{L.below}</p>
          <p className="text-[12px] text-zinc-300 mt-1 leading-snug">{L.dxyDown}</p>
          <p className="text-[12px] text-zinc-300 leading-snug">{L.pairsUp}</p>
        </div>
      </div>

      <p className="text-[13px] text-emerald-400 font-bold italic text-center leading-snug pt-2 border-t border-zinc-800">
        {L.footer}
      </p>
    </div>
    </div>
  );
};

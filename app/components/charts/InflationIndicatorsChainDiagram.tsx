export const InflationIndicatorsChainDiagram = () => {
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
        La chaîne d&apos;inflation que les pros surveillent
      </text>
      <text x="400" y="55" fill="#a1a1aa" fontSize="11" fontStyle="italic" textAnchor="middle">
        Du producteur au consommateur — et ce que la Fed regarde vraiment
      </text>

      {/* Layer 4 — Bloc PPI */}
      <rect x="30" y="110" width="150" height="90" rx="8" fill="#27272a" stroke="#60a5fa" strokeWidth="2" />
      <text x="105" y="140" fill="#60a5fa" fontSize="22" fontWeight="800" textAnchor="middle">PPI</text>
      <text x="105" y="160" fill="#d4d4d8" fontSize="10" textAnchor="middle">Prix producteurs</text>
      <text x="105" y="180" fill="#a1a1aa" fontSize="9" fontStyle="italic" textAnchor="middle">J-12 jours</text>
      <text x="105" y="193" fill="#a1a1aa" fontSize="9" fontStyle="italic" textAnchor="middle">Signal précoce</text>

      {/* Layer 5 — Flèche PPI → CPI Headline */}
      <path d="M 180 155 L 300 155" stroke="#71717a" strokeWidth="2" markerEnd="url(#arrow-inflation-chain)" />
      <text x="240" y="170" fill="#a1a1aa" fontSize="10" fontStyle="italic" textAnchor="middle">annonce souvent</text>

      {/* Layer 6 — Bloc CPI Headline */}
      <rect x="300" y="80" width="170" height="100" rx="8" fill="#27272a" stroke="#fbbf24" strokeWidth="2" />
      <text x="385" y="110" fill="#fbbf24" fontSize="14" fontWeight="700" textAnchor="middle">CPI HEADLINE</text>
      <text x="385" y="130" fill="#d4d4d8" fontSize="10" textAnchor="middle">Prix consommateurs</text>
      <text x="385" y="150" fill="#a1a1aa" fontSize="9" fontStyle="italic" textAnchor="middle">Jour J — 14h30</text>
      <text x="385" y="163" fill="#a1a1aa" fontSize="9" fontStyle="italic" textAnchor="middle">Choc médiatisé</text>

      {/* Layer 7 — Ligne pointillée CPI Headline → Core CPI */}
      <line x1="385" y1="180" x2="385" y2="200" stroke="#3f3f46" strokeWidth="1.5" strokeDasharray="3 3" />

      {/* Bloc Core CPI */}
      <rect x="300" y="200" width="170" height="80" rx="8" fill="#27272a" stroke="#10b981" strokeWidth="2" />
      <text x="385" y="225" fill="#10b981" fontSize="14" fontWeight="700" textAnchor="middle">CORE CPI</text>
      <text x="385" y="245" fill="#d4d4d8" fontSize="10" textAnchor="middle">Tendance de fond</text>
      <text x="385" y="265" fill="#34d399" fontSize="9" fontStyle="italic" textAnchor="middle">Ce que les pros regardent</text>

      {/* Layer 8 — Flèche Core CPI → Core PCE */}
      <path d="M 470 240 Q 530 200 590 175" stroke="#71717a" strokeWidth="2" fill="none" markerEnd="url(#arrow-inflation-chain)" />
      <text x="535" y="205" fill="#a1a1aa" fontSize="10" fontStyle="italic" textAnchor="middle">interprété par</text>

      {/* Layer 9 — Bloc Core PCE */}
      <rect x="590" y="130" width="180" height="90" rx="8" fill="#27272a" stroke="#60a5fa" strokeWidth="2" strokeOpacity="0.7" />
      <text x="680" y="160" fill="#60a5fa" fontSize="14" fontWeight="700" textAnchor="middle">CORE PCE</text>
      <text x="680" y="180" fill="#d4d4d8" fontSize="10" textAnchor="middle">Indicateur préféré</text>
      <text x="680" y="193" fill="#d4d4d8" fontSize="10" textAnchor="middle">de la Fed</text>
      <text x="680" y="210" fill="#fbbf24" fontSize="9" fontStyle="italic" textAnchor="middle">★ Référence officielle</text>

      {/* Layer 10 — Encadré scénarios */}

      {/* Header centré */}
      <text x="400" y="305" fill="#fbbf24" fontSize="11" fontWeight="700" letterSpacing="0.05em" textAnchor="middle">
        RÉACTION MARCHÉ SELON LE CORE CPI
      </text>

      {/* Colonne gauche — Scénario haussier (red) */}
      <rect x="30" y="320" width="365" height="80" rx="6" fill="#09090b" fillOpacity="0.5" stroke="#f87171" strokeWidth="1.5" strokeOpacity="0.6" />
      <text x="212" y="345" fill="#f87171" fontSize="13" fontWeight="700" textAnchor="middle">Core CPI &gt; attentes</text>
      <text x="212" y="368" fill="#d4d4d8" fontSize="11" textAnchor="middle">↑ DXY (dollar fort)</text>
      <text x="212" y="386" fill="#a1a1aa" fontSize="11" textAnchor="middle">↓ EUR/USD, Or, Crypto</text>

      {/* Colonne droite — Scénario baissier (emerald) */}
      <rect x="405" y="320" width="365" height="80" rx="6" fill="#09090b" fillOpacity="0.5" stroke="#34d399" strokeWidth="1.5" strokeOpacity="0.6" />
      <text x="587" y="345" fill="#34d399" fontSize="13" fontWeight="700" textAnchor="middle">Core CPI &lt; attentes</text>
      <text x="587" y="368" fill="#d4d4d8" fontSize="11" textAnchor="middle">↓ DXY (dollar faible)</text>
      <text x="587" y="386" fill="#a1a1aa" fontSize="11" textAnchor="middle">↑ EUR/USD, Or, Indices</text>

      {/* Layer 11 — Pied de page */}
      <text x="400" y="430" fill="#34d399" fontSize="12" fontWeight="700" fontStyle="italic" textAnchor="middle">
        Le PPI prévient. Le CPI déclenche. Le Core confirme.
      </text>
    </svg>

    {/* ── MOBILE : 4 indicateurs empilés + 2 scénarios ──────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-4 space-y-3">
      <p className="text-[14px] font-bold text-white text-center leading-snug">
        La chaîne d'inflation que les pros surveillent
      </p>
      <p className="text-[12px] text-zinc-400 italic text-center -mt-1">
        Du producteur au consommateur — et ce que la Fed regarde vraiment
      </p>

      {/* 4 indicateurs empilés */}
      <div className="space-y-2">
        {[
          { name: "PPI", color: "#60a5fa", title: "Prix producteurs", time: "J-12 jours", note: "Signal précoce" },
          { name: "CPI HEADLINE", color: "#fbbf24", title: "Prix consommateurs", time: "Jour J — 14h30", note: "Choc médiatisé" },
          { name: "CORE CPI", color: "#10b981", title: "Tendance de fond", time: "Même jour", note: "★ Ce que les pros regardent" },
          { name: "CORE PCE", color: "#60a5fa", title: "Indicateur préféré de la Fed", time: "Fin de mois", note: "★ Référence officielle" },
        ].map((ind, i) => (
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
        Réaction marché selon le Core CPI
      </p>
      <div className="space-y-2">
        <div className="rounded-lg border border-red-500/40 bg-red-500/5 p-2.5">
          <p className="text-[13px] font-bold text-red-400">Core CPI &gt; attentes</p>
          <p className="text-[12px] text-zinc-300 mt-1 leading-snug">↑ DXY (dollar fort)</p>
          <p className="text-[12px] text-zinc-300 leading-snug">↓ EUR/USD, Or, Crypto</p>
        </div>
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-2.5">
          <p className="text-[13px] font-bold text-emerald-400">Core CPI &lt; attentes</p>
          <p className="text-[12px] text-zinc-300 mt-1 leading-snug">↓ DXY (dollar faible)</p>
          <p className="text-[12px] text-zinc-300 leading-snug">↑ EUR/USD, Or, Indices</p>
        </div>
      </div>

      <p className="text-[13px] text-emerald-400 font-bold italic text-center leading-snug pt-2 border-t border-zinc-800">
        Le PPI prévient. Le CPI déclenche. Le Core confirme.
      </p>
    </div>
    </div>
  );
};

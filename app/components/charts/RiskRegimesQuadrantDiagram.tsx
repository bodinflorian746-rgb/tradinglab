export default function RiskRegimesQuadrantDiagram({ locale = "fr" }: { locale?: "fr" | "es" } = {}) {
  const t = locale === "es"
    ? {
        title: "Los 4 regímenes de mercado",
        riskOnTitle: "Risk-on clásico",
        riskOnDesc1: "Crecimiento + liquidez,",
        riskOnDesc2: "el capital busca rendimiento",
        reflationTitle: "Reflation trade",
        reflationDesc1: "Crecimiento + inflación,",
        reflationDesc2: "rotación hacia activos reales",
        flightTitle: "Flight to quality",
        flightDesc1: "Miedo medido, reposicionamiento",
        flightDesc2: "defensivo sin pánico",
        riskOffTitle: "Risk-off pánico",
        riskOffDesc1: "Liquidación global,",
        riskOffDesc2: "búsqueda de cash y seguridad",
        infFaible: "Inflación baja",
        infElevee: "Inflación alta",
        croisForte: "Crecimiento alto",
        croisFaible: "Crecimiento bajo",
        legendArrows: "↑ alcista  •  ↓ bajista  •  ~ estable  •  * salvo tech long duration",
        mobileSubtitle: "Definidos por crecimiento × inflación",
        ctxRiskOn: "Crecimiento alto · Inflación baja",
        ctxReflation: "Crecimiento alto · Inflación alta",
        ctxFlight: "Crecimiento bajo · Inflación baja",
        ctxRiskOff: "Crecimiento bajo · Inflación alta",
      }
    : {
        title: "Les 4 régimes de marché",
        riskOnTitle: "Risk-on classique",
        riskOnDesc1: "Croissance + liquidité,",
        riskOnDesc2: "le capital cherche du rendement",
        reflationTitle: "Reflation trade",
        reflationDesc1: "Croissance + inflation,",
        reflationDesc2: "rotation vers actifs réels",
        flightTitle: "Flight to quality",
        flightDesc1: "Peur mesurée, repositionnement",
        flightDesc2: "défensif sans panique",
        riskOffTitle: "Risk-off panique",
        riskOffDesc1: "Liquidation globale,",
        riskOffDesc2: "recherche de cash et sécurité",
        infFaible: "Inflation faible",
        infElevee: "Inflation élevée",
        croisForte: "Croissance forte",
        croisFaible: "Croissance faible",
        legendArrows: "↑ haussier  •  ↓ baissier  •  ~ stable  •  * sauf tech longue duration",
        mobileSubtitle: "Définis par croissance × inflation",
        ctxRiskOn: "Croissance forte · Inflation faible",
        ctxReflation: "Croissance forte · Inflation élevée",
        ctxFlight: "Croissance faible · Inflation faible",
        ctxRiskOff: "Croissance faible · Inflation élevée",
      };
  return (
    <div>
    <svg
      className="hidden sm:block w-full h-auto"
      viewBox="0 0 720 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Titre ── */}
      <text x="360" y="30" fill="#fbbf24" fontSize="18" fontWeight="600" textAnchor="middle">
        {t.title}
      </text>

      {/* ── Axes ── */}
      <line x1="80" y1="270" x2="640" y2="270" stroke="#3f3f46" strokeWidth="1" />
      <line x1="360" y1="80" x2="360" y2="460" stroke="#3f3f46" strokeWidth="1" />

      {/* ── Quadrant TOP-LEFT — Risk-on classique (emerald-500) ── */}
      <rect x="85" y="95" width="265" height="160" rx="8" fill="transparent" stroke="#10b981" strokeWidth="1.5" />
      <text x="97" y="121" fill="#10b981" fontSize="14" fontWeight="600">{t.riskOnTitle}</text>
      <text x="97" y="139" fill="#d4d4d8" fontSize="11">DXY ↓  •  Yields ~  •  Or ~</text>
      <text x="97" y="154" fill="#d4d4d8" fontSize="11">Indices ↑  •  BTC ↑</text>
      <text x="97" y="228" fill="#71717a" fontSize="10" fontStyle="italic">{t.riskOnDesc1}</text>
      <text x="97" y="241" fill="#71717a" fontSize="10" fontStyle="italic">{t.riskOnDesc2}</text>

      {/* ── Quadrant TOP-RIGHT — Reflation trade (amber-400) ── */}
      <rect x="370" y="95" width="265" height="160" rx="8" fill="transparent" stroke="#fbbf24" strokeWidth="1.5" />
      <text x="382" y="121" fill="#fbbf24" fontSize="14" fontWeight="600">{t.reflationTitle}</text>
      <text x="382" y="139" fill="#d4d4d8" fontSize="11">DXY ~  •  Yields ↑  •  Or ↑</text>
      <text x="382" y="154" fill="#d4d4d8" fontSize="11">Indices ↑*  •  BTC ↑</text>
      <text x="382" y="228" fill="#71717a" fontSize="10" fontStyle="italic">{t.reflationDesc1}</text>
      <text x="382" y="241" fill="#71717a" fontSize="10" fontStyle="italic">{t.reflationDesc2}</text>

      {/* ── Quadrant BOTTOM-LEFT — Flight to quality (zinc-400) ── */}
      <rect x="85" y="285" width="265" height="160" rx="8" fill="transparent" stroke="#a1a1aa" strokeWidth="1.5" />
      <text x="97" y="311" fill="#a1a1aa" fontSize="14" fontWeight="600">{t.flightTitle}</text>
      <text x="97" y="329" fill="#d4d4d8" fontSize="11">DXY ↑  •  Yields ↓  •  Or ↑</text>
      <text x="97" y="344" fill="#d4d4d8" fontSize="11">Indices ↓  •  BTC ↓</text>
      <text x="97" y="418" fill="#71717a" fontSize="10" fontStyle="italic">{t.flightDesc1}</text>
      <text x="97" y="431" fill="#71717a" fontSize="10" fontStyle="italic">{t.flightDesc2}</text>

      {/* ── Quadrant BOTTOM-RIGHT — Risk-off panique (red-500) ── */}
      <rect x="370" y="285" width="265" height="160" rx="8" fill="transparent" stroke="#ef4444" strokeWidth="1.5" />
      <text x="382" y="311" fill="#ef4444" fontSize="14" fontWeight="600">{t.riskOffTitle}</text>
      <text x="382" y="329" fill="#d4d4d8" fontSize="11">DXY ↑↑  •  Yields ↓  •  Or ↑</text>
      <text x="382" y="344" fill="#d4d4d8" fontSize="11">Indices ↓↓  •  BTC ↓↓</text>
      <text x="382" y="418" fill="#71717a" fontSize="10" fontStyle="italic">{t.riskOffDesc1}</text>
      <text x="382" y="431" fill="#71717a" fontSize="10" fontStyle="italic">{t.riskOffDesc2}</text>

      {/* ── Labels d'axes avec pastilles opaques ── */}

      {/* Horizontal gauche — Inflation faible */}
      <rect x="84" y="281" width="116" height="18" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="90" y="295" fill="#a1a1aa" fontSize="12" fontWeight="500">{t.infFaible}</text>

      {/* Horizontal droite — Inflation élevée */}
      <rect x="520" y="281" width="116" height="18" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="630" y="295" fill="#a1a1aa" fontSize="12" fontWeight="500" textAnchor="end">{t.infElevee}</text>

      {/* Vertical haut — Croissance forte */}
      <rect x="364" y="75" width="118" height="18" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="370" y="88" fill="#a1a1aa" fontSize="12" fontWeight="500">{t.croisForte}</text>

      {/* Vertical bas — Croissance faible */}
      <rect x="364" y="457" width="124" height="18" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="370" y="470" fill="#a1a1aa" fontSize="12" fontWeight="500">{t.croisFaible}</text>

      {/* ── Légende ── */}
      <text x="360" y="500" fill="#71717a" fontSize="10" textAnchor="middle">
        {t.legendArrows}
      </text>
    </svg>

    {/* ── MOBILE : 4 régimes empilés ─────────────────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-4 space-y-3">
      <p className="text-[14px] font-bold text-amber-400 text-center leading-snug">
        {t.title}
      </p>
      <p className="text-[12px] text-zinc-400 italic text-center -mt-1">
        {t.mobileSubtitle}
      </p>

      {[
        {
          name: t.riskOnTitle,
          color: "#10b981",
          context: t.ctxRiskOn,
          assets: "DXY ↓  ·  Yields ~  ·  Or ~  ·  Indices ↑  ·  BTC ↑",
          desc: `${t.riskOnDesc1} ${t.riskOnDesc2}`,
        },
        {
          name: t.reflationTitle,
          color: "#fbbf24",
          context: t.ctxReflation,
          assets: "DXY ~  ·  Yields ↑  ·  Or ↑  ·  Indices ↑*  ·  BTC ↑",
          desc: `${t.reflationDesc1} ${t.reflationDesc2}`,
        },
        {
          name: t.flightTitle,
          color: "#a1a1aa",
          context: t.ctxFlight,
          assets: "DXY ↑  ·  Yields ↓  ·  Or ↑  ·  Indices ↓  ·  BTC ↓",
          desc: `${t.flightDesc1} ${t.flightDesc2}`,
        },
        {
          name: t.riskOffTitle,
          color: "#ef4444",
          context: t.ctxRiskOff,
          assets: "DXY ↑↑  ·  Yields ↓  ·  Or ↑  ·  Indices ↓↓  ·  BTC ↓↓",
          desc: `${t.riskOffDesc1} ${t.riskOffDesc2}`,
        },
      ].map((r) => (
        <div key={r.name} className="rounded-xl border-2 p-3" style={{ borderColor: r.color }}>
          <p className="text-[15px] font-bold leading-tight" style={{ color: r.color }}>{r.name}</p>
          <p className="text-[12px] text-zinc-400 italic mt-0.5 leading-snug">{r.context}</p>
          <p className="text-[12px] text-zinc-300 font-mono leading-snug mt-1.5">{r.assets}</p>
          <p className="text-[12px] text-zinc-400 italic leading-snug mt-1.5">{r.desc}</p>
        </div>
      ))}

      <p className="text-[11px] text-zinc-500 text-center leading-snug pt-2 border-t border-zinc-800">
        {t.legendArrows}
      </p>
    </div>
    </div>
  );
}

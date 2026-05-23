export const InflationChainDiagram = ({ locale = "fr" }: { locale?: "fr" | "es" } = {}) => {
  const t = locale === "es"
    ? {
        title: "La cadena que controla TODO el mercado",
        subtitle: "Apréndela de memoria — es el 80% de la macro",
        inflation: "INFLACIÓN",
        pricesUp: "Los precios suben",
        taux: "TASAS",
        banqueCent: "El banco central",
        monteTaux: "sube las tasas",
        devise: "MONEDA",
        devientAttract: "Se vuelve más",
        attractive: "atractiva",
        marches: "MERCADOS",
        forexIndices: "Forex / Índices",
        orCrypto: "Oro / Crypto",
        force: "fuerza",
        renforce: "refuerza",
        impacte: "impacta",
        exemple: "EJEMPLO — La cadena en acción (2022-2023)",
        inflationUS: "Inflación US",
        tauxFed: "Tasas Fed",
        dollarDxy: "Dólar (DXY)",
        nasdaq: "Nasdaq",
        narrative: "Una sola causa macro hizo mover TODO el mercado.",
        footer: "Seguir la inflación = comprender el 80% de los movimientos macro",
        mobileExemple: "Ejemplo — la cadena en acción (2022-2023)",
        // Mobile step descriptions
        step1Desc: "Los precios suben",
        step2Desc: "El banco central sube las tasas",
        step3Desc: "Se vuelve más atractiva",
        step4Desc: "Forex / Índices / Oro / Crypto",
        narrativeMobile: "Una sola causa macro hizo mover TODO el mercado.",
      }
    : {
        title: "La chaîne qui contrôle TOUT le marché",
        subtitle: "Apprends-la par cœur — c'est 80% de la macro",
        inflation: "INFLATION",
        pricesUp: "Les prix montent",
        taux: "TAUX",
        banqueCent: "La banque centrale",
        monteTaux: "monte les taux",
        devise: "DEVISE",
        devientAttract: "Devient plus",
        attractive: "attractive",
        marches: "MARCHÉS",
        forexIndices: "Forex / Indices",
        orCrypto: "Or / Crypto",
        force: "force",
        renforce: "renforce",
        impacte: "impacte",
        exemple: "EXEMPLE — La chaîne en action (2022-2023)",
        inflationUS: "Inflation US",
        tauxFed: "Taux Fed",
        dollarDxy: "Dollar (DXY)",
        nasdaq: "Nasdaq",
        narrative: "Une seule cause macro a fait bouger TOUT le marché.",
        footer: "Suivre l'inflation = comprendre 80% des mouvements macro",
        mobileExemple: "Exemple — la chaîne en action (2022-2023)",
        step1Desc: "Les prix montent",
        step2Desc: "La banque centrale monte les taux",
        step3Desc: "Devient plus attractive",
        step4Desc: "Forex / Indices / Or / Crypto",
        narrativeMobile: "Une seule cause macro a fait bouger TOUT le marché.",
      };
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
        <marker id="arrow-inflation" markerWidth="8" markerHeight="10" refX="8" refY="5" orient="auto">
          <polygon points="0 0, 8 5, 0 10" fill="#71717a" />
        </marker>
      </defs>

      {/* Layer 1 — Fond */}
      <rect width="800" height="450" fill="#18181b" rx="8" />
      <rect width="800" height="450" fill="none" stroke="#27272a" strokeWidth="1" rx="8" />

      {/* Layer 2 — Titre */}
      <text x="400" y="40" fill="white" fontSize="16" fontWeight="700" textAnchor="middle">
        {t.title}
      </text>
      <text x="400" y="62" fill="#a1a1aa" fontSize="12" fontStyle="italic" textAnchor="middle">
        {t.subtitle}
      </text>

      {/* Layer 3 — 4 boxes */}

      {/* Box 1 — INFLATION */}
      <rect x="55" y="160" width="150" height="110" rx="8" fill="#27272a" stroke="#ef4444" strokeWidth="2" />
      <text x="130" y="190" fill="#ef4444" fontSize="14" fontWeight="700" textAnchor="middle">{t.inflation}</text>
      <text x="130" y="230" fill="#f87171" fontSize="36" fontWeight="700" textAnchor="middle">↑</text>
      <text x="130" y="257" fill="#a1a1aa" fontSize="10" textAnchor="middle">{t.pricesUp}</text>

      {/* Box 2 — TAUX */}
      <rect x="235" y="160" width="150" height="110" rx="8" fill="#27272a" stroke="#fbbf24" strokeWidth="2" />
      <text x="310" y="190" fill="#fbbf24" fontSize="14" fontWeight="700" textAnchor="middle">{t.taux}</text>
      <text x="310" y="230" fill="#fbbf24" fontSize="36" fontWeight="700" textAnchor="middle">%</text>
      <text x="310" y="250" fill="#a1a1aa" fontSize="10" textAnchor="middle">{t.banqueCent}</text>
      <text x="310" y="263" fill="#a1a1aa" fontSize="10" textAnchor="middle">{t.monteTaux}</text>

      {/* Box 3 — DEVISE */}
      <rect x="415" y="160" width="150" height="110" rx="8" fill="#27272a" stroke="#60a5fa" strokeWidth="2" />
      <text x="490" y="190" fill="#60a5fa" fontSize="14" fontWeight="700" textAnchor="middle">{t.devise}</text>
      <text x="490" y="230" fill="#60a5fa" fontSize="36" fontWeight="700" textAnchor="middle">$</text>
      <text x="490" y="250" fill="#a1a1aa" fontSize="10" textAnchor="middle">{t.devientAttract}</text>
      <text x="490" y="263" fill="#a1a1aa" fontSize="10" textAnchor="middle">{t.attractive}</text>

      {/* Box 4 — MARCHÉS */}
      <rect x="595" y="160" width="150" height="110" rx="8" fill="#27272a" stroke="#10b981" strokeWidth="2" />
      <text x="670" y="190" fill="#10b981" fontSize="14" fontWeight="700" textAnchor="middle">{t.marches}</text>
      <text x="670" y="230" fill="#34d399" fontSize="28" fontWeight="700" textAnchor="middle">▲▼</text>
      <text x="670" y="250" fill="#a1a1aa" fontSize="10" textAnchor="middle">{t.forexIndices}</text>
      <text x="670" y="263" fill="#a1a1aa" fontSize="10" textAnchor="middle">{t.orCrypto}</text>

      {/* Layer 4 — Flèches */}
      <line x1="205" y1="215" x2="235" y2="215" stroke="#71717a" strokeWidth="3" markerEnd="url(#arrow-inflation)" />
      <line x1="385" y1="215" x2="415" y2="215" stroke="#71717a" strokeWidth="3" markerEnd="url(#arrow-inflation)" />
      <line x1="565" y1="215" x2="595" y2="215" stroke="#71717a" strokeWidth="3" markerEnd="url(#arrow-inflation)" />

      {/* Layer 5 — Annotations sous les flèches */}
      <text x="220" y="235" fill="#71717a" fontSize="10" fontStyle="italic" textAnchor="middle">{t.force}</text>
      <text x="400" y="235" fill="#71717a" fontSize="10" fontStyle="italic" textAnchor="middle">{t.renforce}</text>
      <text x="580" y="235" fill="#71717a" fontSize="10" fontStyle="italic" textAnchor="middle">{t.impacte}</text>

      {/* Layer 6 — Encadré exemple 2022-2023 */}
      <rect x="55" y="320" width="690" height="90" rx="6" fill="#09090b" fillOpacity="0.5" stroke="#3f3f46" strokeWidth="1" />

      <text x="400" y="340" fill="#fbbf24" fontSize="11" fontWeight="700" letterSpacing="0.05em" textAnchor="middle">
        {t.exemple}
      </text>

      {/* Stat 1 — Inflation US */}
      <text x="130" y="363" fill="#a1a1aa" fontSize="10" textAnchor="middle">{t.inflationUS}</text>
      <text x="130" y="383" fill="#f87171" fontSize="14" fontWeight="700" textAnchor="middle">1.4% → 9.1%</text>

      {/* Stat 2 — Taux Fed */}
      <text x="310" y="363" fill="#a1a1aa" fontSize="10" textAnchor="middle">{t.tauxFed}</text>
      <text x="310" y="383" fill="#fbbf24" fontSize="14" fontWeight="700" textAnchor="middle">0.25% → 5.5%</text>

      {/* Stat 3 — Dollar */}
      <text x="490" y="363" fill="#a1a1aa" fontSize="10" textAnchor="middle">{t.dollarDxy}</text>
      <text x="490" y="383" fill="#60a5fa" fontSize="14" fontWeight="700" textAnchor="middle">+20%</text>

      {/* Stat 4 — Nasdaq */}
      <text x="670" y="363" fill="#a1a1aa" fontSize="10" textAnchor="middle">{t.nasdaq}</text>
      <text x="670" y="383" fill="#f87171" fontSize="14" fontWeight="700" textAnchor="middle">-33%</text>

      {/* Ligne narrative */}
      <text x="400" y="400" fill="#a1a1aa" fontSize="11" fontStyle="italic" textAnchor="middle">
        {t.narrative}
      </text>

      {/* Layer 7 — Pied de page */}
      <text x="400" y="435" fill="#34d399" fontSize="12" fontWeight="700" fontStyle="italic" textAnchor="middle">
        {t.footer}
      </text>
    </svg>

    {/* ── MOBILE : chaîne d'inflation en 4 étapes ───────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-4 space-y-3">
      <p className="text-[14px] font-bold text-white text-center leading-snug">
        La chaîne qui contrôle TOUT le marché
      </p>
      <p className="text-[12px] text-zinc-400 italic text-center -mt-1">
        Apprends-la par cœur — c'est 80% de la macro
      </p>

      {/* 4 étapes empilées avec flèches */}
      {[
        { num: 1, label: "INFLATION", icon: "↑", desc: "Les prix montent", color: "#ef4444" },
        { num: 2, label: "TAUX", icon: "%", desc: "La banque centrale monte les taux", color: "#fbbf24" },
        { num: 3, label: "DEVISE", icon: "$", desc: "Devient plus attractive", color: "#60a5fa" },
        { num: 4, label: "MARCHÉS", icon: "▲▼", desc: "Forex / Indices / Or / Crypto", color: "#10b981" },
      ].map((step, i) => (
        <div key={step.num}>
          <div className="rounded-xl border-2 p-3" style={{ borderColor: step.color }}>
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-[24px] font-bold" style={{ background: `${step.color}25`, color: step.color }}>
                {step.icon}
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-bold" style={{ color: step.color }}>{step.label}</p>
                <p className="text-[13px] text-zinc-300 leading-snug mt-0.5">{step.desc}</p>
              </div>
            </div>
          </div>
          {i < 3 && <p className="text-center text-zinc-600 text-[14px] my-1">↓</p>}
        </div>
      ))}

      {/* Exemple chiffré */}
      <div className="rounded-xl border border-zinc-700 bg-zinc-800/40 p-3 space-y-2">
        <p className="text-[12px] font-bold text-amber-400 uppercase tracking-wider text-center">
          Exemple — la chaîne en action (2022-2023)
        </p>
        <div className="grid grid-cols-2 gap-2 text-[13px]">
          <div className="rounded-lg bg-zinc-900 p-2 text-center">
            <p className="text-[11px] text-zinc-400">Inflation US</p>
            <p className="text-[14px] font-bold font-mono text-red-400 mt-0.5">1.4% → 9.1%</p>
          </div>
          <div className="rounded-lg bg-zinc-900 p-2 text-center">
            <p className="text-[11px] text-zinc-400">Taux Fed</p>
            <p className="text-[14px] font-bold font-mono text-amber-400 mt-0.5">0.25% → 5.5%</p>
          </div>
          <div className="rounded-lg bg-zinc-900 p-2 text-center">
            <p className="text-[11px] text-zinc-400">Dollar (DXY)</p>
            <p className="text-[14px] font-bold font-mono text-blue-400 mt-0.5">+20%</p>
          </div>
          <div className="rounded-lg bg-zinc-900 p-2 text-center">
            <p className="text-[11px] text-zinc-400">Nasdaq</p>
            <p className="text-[14px] font-bold font-mono text-red-400 mt-0.5">−33%</p>
          </div>
        </div>
        <p className="text-[12px] text-zinc-400 italic text-center leading-snug">
          Une seule cause macro a fait bouger TOUT le marché.
        </p>
      </div>

      <p className="text-[13px] text-emerald-400 font-bold italic text-center leading-snug">
        Suivre l'inflation = comprendre 80% des mouvements macro
      </p>
    </div>
    </div>
  );
};

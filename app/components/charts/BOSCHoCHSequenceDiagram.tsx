export default function BOSCHoCHSequenceDiagram({ className = "", locale = "fr" }: { className?: string; locale?: "fr" | "es" }) {
  const t = locale === "es"
    ? {
        title: "Secuencia de reversión estructural en 3 etapas",
        etape1: "Etapa 1",
        etape2: "Etapa 2",
        etape3: "Etapa 3",
        bosCounterTrend: "BOS contra-tendencia",
        firstSignal: "Primera señal de reversión",
        newStructure: "Nueva estructura",
        noCHoCH: "Aún no hay CHoCH",
        chochConfirmed: "CHoCH confirmado",
        reversalValidated: "Reversión validada",
        bottomNote: "BOS contra-tendencia → Nueva estructura → CHoCH confirmado",
        mobileTitle: "Secuencia reversión en 3 etapas",
        m1Title: "Etapa 1 — BOS contra-tendencia",
        m1Body: "Primer signo de agotamiento: ruptura de estructura contra la tendencia mayor.",
        m2Title: "Etapa 2 — Nueva estructura",
        m2Body: "El precio construye una nueva estructura (LH/LL en sentido opuesto).",
        m3Title: "Etapa 3 — CHoCH confirmado",
        m3Body: "El CHoCH en la nueva dirección confirma la reversión definitiva.",
      }
    : {
        title: "Séquence de retournement structurel en 3 étapes",
        etape1: "Étape 1",
        etape2: "Étape 2",
        etape3: "Étape 3",
        bosCounterTrend: "BOS contre-tendance",
        firstSignal: "Premier signal de retournement",
        newStructure: "Nouvelle structure",
        noCHoCH: "Pas encore de CHoCH",
        chochConfirmed: "CHoCH confirmé",
        reversalValidated: "Retournement validé",
        bottomNote: "BOS contre-tendance → Nouvelle structure → CHoCH confirmé",
        mobileTitle: "Séquence retournement en 3 étapes",
        m1Title: "Étape 1 — BOS contre-tendance",
        m1Body: "Premier signe d'essoufflement : cassure de structure contre la tendance majeure.",
        m2Title: "Étape 2 — Nouvelle structure",
        m2Body: "Le prix construit une nouvelle structure (LH/LL dans le sens opposé).",
        m3Title: "Étape 3 — CHoCH confirmé",
        m3Body: "Le CHoCH dans la nouvelle direction confirme le retournement définitif.",
      };
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 400"
      className="hidden sm:block w-full h-auto"
    >
      <text x="450" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        {t.title}
      </text>

      <line x1="305" y1="40" x2="305" y2="370" stroke="#3f3f46" strokeWidth="1" />
      <line x1="605" y1="40" x2="605" y2="370" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ PANEL 1 — Étape 1 : BOS contre-tendance ═══ */}
      <text x="150" y="55" fill="#ef4444" fontSize="11" fontWeight="700" textAnchor="middle">{t.etape1}</text>
      <line x1="100" y1="90" x2="280" y2="90" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
      <path d="M20,80 L60,140 L100,90 L140,200 L180,160 L220,250" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <circle cx="100" cy="90" r="4" fill="#ef4444" />
      <rect x="68" y="70" width="64" height="12" rx="2" fill="#09090b" />
      <text x="100" y="80" fill="#ef4444" fontSize="9" textAnchor="middle">LH 1.1820</text>
      <circle cx="180" cy="160" r="4" fill="#ef4444" />
      <line x1="250" y1="60" x2="250" y2="180" stroke="#059669" strokeWidth="1.5" />
      <rect x="244" y="60" width="12" height="100" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />
      <rect x="35" y="305" width="230" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="150" y="320" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">{t.bosCounterTrend}</text>
      <rect x="55" y="335" width="190" height="20" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="0.8" />
      <text x="150" y="349" fill="#d4d4d8" fontSize="9" textAnchor="middle">{t.firstSignal}</text>

      {/* ═══ PANEL 2 — Étape 2 : Nouvelle structure ═══ */}
      <text x="455" y="55" fill="#10b981" fontSize="11" fontWeight="700" textAnchor="middle">{t.etape2}</text>
      <path d="M325,260 L370,200 L410,150 L450,210 L490,130 L530,180 L570,140" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <line x1="490" y1="130" x2="595" y2="130" stroke="#10b981" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
      <circle cx="490" cy="130" r="5" fill="#10b981" />
      <rect x="458" y="110" width="64" height="12" rx="2" fill="#09090b" />
      <text x="490" y="120" fill="#10b981" fontSize="9" textAnchor="middle">HH 1.1840</text>
      <circle cx="530" cy="180" r="5" fill="#10b981" />
      <rect x="553" y="174" width="64" height="12" rx="2" fill="#09090b" />
      <text x="555" y="184" fill="#10b981" fontSize="9">HL 1.1750</text>
      <rect x="335" y="305" width="230" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="450" y="320" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">{t.newStructure}</text>
      <rect x="355" y="335" width="190" height="20" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="0.8" />
      <text x="450" y="349" fill="#d4d4d8" fontSize="9" textAnchor="middle">{t.noCHoCH}</text>

      {/* ═══ PANEL 3 — Étape 3 : CHoCH confirmé ═══ */}
      <text x="755" y="55" fill="#10b981" fontSize="11" fontWeight="700" textAnchor="middle">{t.etape3}</text>
      <path d="M625,260 L660,200 L690,150 L720,210 L755,130 L780,180 L810,90" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <line x1="755" y1="130" x2="880" y2="130" stroke="#10b981" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
      <circle cx="755" cy="130" r="4" fill="#10b981" />
      <line x1="850" y1="60" x2="850" y2="170" stroke="#059669" strokeWidth="1.5" />
      <rect x="844" y="60" width="12" height="80" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />
      <rect x="635" y="305" width="230" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="750" y="320" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">{t.chochConfirmed}</text>
      <rect x="655" y="335" width="190" height="20" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="0.8" />
      <text x="750" y="349" fill="#d4d4d8" fontSize="9" textAnchor="middle">{t.reversalValidated}</text>

      <text x="450" y="390" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        {t.bottomNote}
      </text>
    </svg>

    {/* MOBILE : séquence retournement structurel ───────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">{t.mobileTitle}</p>
      <div className="rounded-lg border border-amber-400/40 bg-amber-400/8 p-3">
        <p className="text-[13px] font-bold text-amber-400">{t.m1Title}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{t.m1Body}</p>
      </div>
      <div className="rounded-lg border border-blue-400/40 bg-blue-500/8 p-3">
        <p className="text-[13px] font-bold text-blue-400">{t.m2Title}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{t.m2Body}</p>
      </div>
      <div className="rounded-lg border-2 border-red-500 bg-red-500/8 p-3">
        <p className="text-[13px] font-bold text-red-400">{t.m3Title}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{t.m3Body}</p>
      </div>
    </div>
    </div>
  );
}

export default function TrendIdentificationStepsDiagram({ className = "", locale = "fr" }: { className?: string; locale?: "fr" | "es" }) {
  const labels = locale === "es"
    ? {
        title: "Identificar una tendencia en 3 pasos",
        step1: "Paso 1 — Pivotes",
        step2: "Paso 2 — Escalera HH/HL",
        step3: "Paso 3 — Amplitud",
        step1Desc1: "HL 1.1680, HH 1.1760",
        step1Desc2: "HL 1.1720, HH 1.1820",
        step2Desc1: "Escalera HH/HL ascendente",
        step2Desc2: "2 HL + 2 HH alineados",
        amplitudeBadge: "Amplitud 140 pips",
        step3Desc1: "HH 1.1820 − HL 1.1680",
        step3Desc2: "≥ umbral mínimo 30 pips",
        process: "Proceso secuencial: pivotes → sucesión → amplitud",
        mobTitle: "Identificar una tendencia en 3 pasos",
        mobStep1: "Paso 1 — Pivotes",
        mobStep1Desc: "Identifica los pivotes HH/HL (alcista) o LH/LL (bajista).",
        mobStep2: "Paso 2 — Sucesión",
        mobStep2Desc: "Verifica que los pivotes se sucedan en el orden correcto (cada HH más alto que el anterior).",
        mobStep3: "Paso 3 — Amplitud",
        mobStep3DescPrefix: "Mide la diferencia entre pivotes: ",
        mobStep3DescBold: "≥ 30 pips mínimo",
        mobStep3DescSuffix: " para ser significativo.",
        mobProcess: "Proceso secuencial: pivotes → sucesión → amplitud",
      }
    : {
        title: "Identifier une tendance en 3 étapes",
        step1: "Étape 1 — Pivots",
        step2: "Étape 2 — Escalier HH/HL",
        step3: "Étape 3 — Amplitude",
        step1Desc1: "HL 1.1680, HH 1.1760",
        step1Desc2: "HL 1.1720, HH 1.1820",
        step2Desc1: "Escalier HH/HL ascendant",
        step2Desc2: "2 HL + 2 HH alignés",
        amplitudeBadge: "Amplitude 140 pips",
        step3Desc1: "HH 1.1820 − HL 1.1680",
        step3Desc2: "≥ seuil minimum 30 pips",
        process: "Process séquentiel : pivots → succession → amplitude",
        mobTitle: "Identifier une tendance en 3 étapes",
        mobStep1: "Étape 1 — Pivots",
        mobStep1Desc: "Identifier les pivots HH/HL (haussier) ou LH/LL (baissier).",
        mobStep2: "Étape 2 — Succession",
        mobStep2Desc: "Vérifier que les pivots se succèdent dans le bon ordre (chaque HH plus haut que le précédent).",
        mobStep3: "Étape 3 — Amplitude",
        mobStep3DescPrefix: "Mesurer l'écart entre pivots : ",
        mobStep3DescBold: "≥ 30 pips minimum",
        mobStep3DescSuffix: " pour être significatif.",
        mobProcess: "Process séquentiel : pivots → succession → amplitude",
      };
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 400"
      className="hidden sm:block w-full h-auto"
    >
      <text x="450" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        {labels.title}
      </text>

      <line x1="305" y1="40" x2="305" y2="370" stroke="#3f3f46" strokeWidth="1" />
      <line x1="605" y1="40" x2="605" y2="370" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ PANEL 1 — Étape 1 : Repérer pivots ═══ */}
      <rect x="35" y="50" width="230" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="150" y="65" fill="#10b981" fontSize="11" fontWeight="700" textAnchor="middle">{labels.step1}</text>

      <path d="M30,290 L70,230 L110,260 L150,180 L190,210 L230,120 L270,160" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      <circle cx="70" cy="230" r="4" fill="#10b981" />
      <text x="70" y="248" fill="#10b981" fontSize="8" textAnchor="middle">HL</text>
      <circle cx="150" cy="180" r="4" fill="#10b981" />
      <text x="150" y="170" fill="#10b981" fontSize="8" textAnchor="middle">HH</text>
      <circle cx="190" cy="210" r="4" fill="#10b981" />
      <text x="200" y="220" fill="#10b981" fontSize="8">HL</text>
      <circle cx="230" cy="120" r="4" fill="#10b981" />
      <text x="230" y="110" fill="#10b981" fontSize="8" textAnchor="middle">HH</text>

      <text x="150" y="345" fill="#a1a1aa" fontSize="8" textAnchor="middle">{labels.step1Desc1}</text>
      <text x="150" y="358" fill="#a1a1aa" fontSize="8" textAnchor="middle">{labels.step1Desc2}</text>

      {/* ═══ PANEL 2 — Étape 2 : Confirmer succession ═══ */}
      <rect x="335" y="50" width="230" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="450" y="65" fill="#10b981" fontSize="11" fontWeight="700" textAnchor="middle">{labels.step2}</text>

      <path d="M325,290 L365,230 L405,260 L445,180 L485,210 L525,120 L570,160" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      <circle cx="365" cy="230" r="4" fill="#10b981" />
      <circle cx="445" cy="180" r="4" fill="#10b981" />
      <circle cx="485" cy="210" r="4" fill="#10b981" />
      <circle cx="525" cy="120" r="4" fill="#10b981" />

      {/* Lignes pointillées reliant HL entre eux et HH entre eux */}
      <line x1="365" y1="230" x2="485" y2="210" stroke="#10b981" strokeWidth="1.2" strokeDasharray="4 3" />
      <line x1="445" y1="180" x2="525" y2="120" stroke="#10b981" strokeWidth="1.2" strokeDasharray="4 3" />

      <text x="450" y="345" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">{labels.step2Desc1}</text>
      <text x="450" y="358" fill="#a1a1aa" fontSize="8" textAnchor="middle">{labels.step2Desc2}</text>

      {/* ═══ PANEL 3 — Étape 3 : Valider amplitude ═══ */}
      <rect x="635" y="50" width="230" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="750" y="65" fill="#10b981" fontSize="11" fontWeight="700" textAnchor="middle">{labels.step3}</text>

      <path d="M625,290 L665,230 L705,260 L745,180 L785,210 L825,120 L870,160" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      <circle cx="665" cy="230" r="4" fill="#10b981" />
      <circle cx="745" cy="180" r="4" fill="#10b981" />
      <circle cx="785" cy="210" r="4" fill="#10b981" />
      <circle cx="825" cy="120" r="4" fill="#10b981" />

      {/* Escalier HH/HL conservé du Panel 2 — même progression */}
      <line x1="665" y1="230" x2="785" y2="210" stroke="#10b981" strokeWidth="1.2" strokeDasharray="4 3" />
      <line x1="745" y1="180" x2="825" y2="120" stroke="#10b981" strokeWidth="1.2" strokeDasharray="4 3" />

      {/* Grande flèche verticale bidirectionnelle entre HL le plus bas et HH le plus haut, à l'intérieur du panel */}
      <line x1="630" y1="120" x2="630" y2="230" stroke="#10b981" strokeWidth="2.5" />
      <path d="M623,130 L630,120 L637,130" stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
      <path d="M623,220 L630,230 L637,220" stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinejoin="round" />

      {/* Label Amplitude 140 pips à côté de la flèche */}
      <rect x="645" y="165" width="110" height="20" rx="4" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="700" y="179" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">{labels.amplitudeBadge}</text>

      <text x="750" y="345" fill="#a1a1aa" fontSize="8" textAnchor="middle">{labels.step3Desc1}</text>
      <text x="750" y="358" fill="#10b981" fontSize="8" fontWeight="600" textAnchor="middle">{labels.step3Desc2}</text>

      <text x="450" y="390" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        {labels.process}
      </text>
    </svg>

    {/* MOBILE : 3 étapes identification tendance ───────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">{labels.mobTitle}</p>
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
        <p className="text-[13px] font-bold text-emerald-400">{labels.mobStep1}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{labels.mobStep1Desc}</p>
      </div>
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
        <p className="text-[13px] font-bold text-emerald-400">{labels.mobStep2}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{labels.mobStep2Desc}</p>
      </div>
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
        <p className="text-[13px] font-bold text-emerald-400">{labels.mobStep3}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{labels.mobStep3DescPrefix}<span className="font-bold">{labels.mobStep3DescBold}</span>{labels.mobStep3DescSuffix}</p>
      </div>
      <p className="text-[13px] text-emerald-400 font-bold text-center pt-2 border-t border-zinc-800 leading-snug">
        {labels.mobProcess}
      </p>
    </div>
    </div>
  );
}

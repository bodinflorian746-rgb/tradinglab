export default function OBExecutionPlanDiagram({ className = "", locale = "fr" }: { className?: string; locale?: "fr" | "es" }) {
  const t = locale === "es"
    ? {
        title: "Plan de ejecución OB bullish con cifras",
        rrBadge: "R/R 2,79 — setup operable",
        tpLabel: "TP — 1.1858",
        entryLabel: "Entrada — 1.1780",
        slLabel: "SL — 1.1752",
        obZone: "Order Block 1.1752-1.1780",
        riskLabel: "Riesgo 28 pips",
        gainLabel: "Ganancia 78 pips",
        caption: "Entrada en parte alta del cuerpo OB · SL más allá de la mecha baja · TP proyección estructural",
        mobileTitle: "Plan de ejecución OB bullish",
        entryTitle: "Entrada",
        entryBodyPart1: "Orden limit en la ",
        entryBodyBold: "parte alta del cuerpo",
        entryBodyPart2: " del OB.",
        slTitle: "Stop Loss",
        slBodyPart1: "Más allá de la ",
        slBodyBold: "mecha baja",
        slBodyPart2: " del OB (margen 5-10 pips).",
        tpTitle: "Take Profit",
        tpBody: "Proyección estructural (HH previo o resistencia mayor).",
        mobileRR: "R/R 2,79 — setup operable",
      }
    : {
        title: "Plan d'exécution OB bullish chiffré",
        rrBadge: "R/R 2,79 — setup exploitable",
        tpLabel: "TP — 1.1858",
        entryLabel: "Entrée — 1.1780",
        slLabel: "SL — 1.1752",
        obZone: "Order Block 1.1752-1.1780",
        riskLabel: "Risque 28 pips",
        gainLabel: "Gain 78 pips",
        caption: "Entrée limite haute corps OB · SL au-delà mèche basse · TP projection structurelle",
        mobileTitle: "Plan d'exécution OB bullish",
        entryTitle: "Entrée",
        entryBodyPart1: "Ordre limite sur la ",
        entryBodyBold: "haute du corps",
        entryBodyPart2: " de l'OB.",
        slTitle: "Stop Loss",
        slBodyPart1: "Au-delà de la ",
        slBodyBold: "mèche basse",
        slBodyPart2: " de l'OB (marge 5-10 pips).",
        tpTitle: "Take Profit",
        tpBody: "Projection structurelle (HH précédent ou résistance majeure).",
        mobileRR: "R/R 2,79 — setup exploitable",
      };
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 400"
      className="hidden sm:block w-full h-auto"
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        {t.title}
      </text>

      <rect x="560" y="40" width="220" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="670" y="55" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">
        {t.rrBadge}
      </text>

      {/* Niveau TP */}
      <line x1="50" y1="85" x2="750" y2="85" stroke="#10b981" strokeWidth="1.2" strokeDasharray="5 3" />
      <rect x="52" y="71" width="80" height="12" rx="2" fill="#09090b" />
      <text x="55" y="80" fill="#10b981" fontSize="9" fontWeight="600">{t.tpLabel}</text>

      {/* Niveau entrée (limite haute corps OB) */}
      <line x1="50" y1="170" x2="750" y2="170" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" />
      <rect x="52" y="156" width="98" height="12" rx="2" fill="#09090b" />
      <text x="55" y="165" fill="#10b981" fontSize="9" fontWeight="600">{t.entryLabel}</text>

      {/* Niveau SL */}
      <line x1="50" y1="210" x2="750" y2="210" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="5 3" />
      <rect x="52" y="216" width="80" height="12" rx="2" fill="#09090b" />
      <text x="55" y="225" fill="#ef4444" fontSize="9" fontWeight="600">{t.slLabel}</text>

      {/* Order Block zone (rectangle emerald translucide) */}
      <rect x="280" y="170" width="240" height="40" fill="#10b98120" stroke="#10b981" strokeWidth="1" strokeDasharray="3 2" />
      <text x="400" y="195" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">{t.obZone}</text>

      {/* Path prix : impulsion passée + retest OB */}
      <path d="M60,310 L100,260 L140,230 L180,200 L220,170 L260,150 L300,140 L340,160 L380,170 L420,180 L460,160 L500,130 L540,110 L580,90 L620,85" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      {/* Cercle d'entrée sur retest */}
      <circle cx="420" cy="180" r="6" fill="#10b981" />
      <circle cx="420" cy="180" r="11" fill="#10b981" opacity="0.3" />

      {/* Flèche bidirectionnelle entre SL et Entrée (Risque 28 pips) */}
      <line x1="650" y1="170" x2="650" y2="210" stroke="#ef4444" strokeWidth="1.2" />
      <path d="M645,178 L650,170 L655,178" stroke="#ef4444" strokeWidth="1.2" fill="none" />
      <path d="M645,202 L650,210 L655,202" stroke="#ef4444" strokeWidth="1.2" fill="none" />
      <rect x="665" y="180" width="80" height="20" rx="4" fill="#27272a" stroke="#ef4444" strokeWidth="0.8" />
      <text x="705" y="194" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">{t.riskLabel}</text>

      {/* Flèche bidirectionnelle entre Entrée et TP (Gain 78 pips) */}
      <line x1="710" y1="85" x2="710" y2="170" stroke="#10b981" strokeWidth="1.2" />
      <path d="M705,93 L710,85 L715,93" stroke="#10b981" strokeWidth="1.2" fill="none" />
      <path d="M705,162 L710,170 L715,162" stroke="#10b981" strokeWidth="1.2" fill="none" />
      <rect x="725" y="120" width="65" height="20" rx="4" fill="#27272a" stroke="#10b981" strokeWidth="0.8" />
      <text x="757" y="134" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">{t.gainLabel}</text>

      <text x="400" y="385" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        {t.caption}
      </text>
    </svg>

    {/* MOBILE : plan d'exécution OB bullish ──────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
      <p className="text-[14px] font-bold text-emerald-400 text-center">{t.mobileTitle}</p>

      {/* Mini-SVG : plan d'exécution OB — zone + entrée + SL en dessous + TP au-dessus */}
      <svg viewBox="0 0 280 140" className="w-full h-auto" aria-label="Plan d'exécution OB" fill="none">
        {/* Zone OB rectangle */}
        <rect x="60" y="68" width="160" height="22" fill="#10b98115" stroke="#10b98155" strokeWidth="1" strokeDasharray="3 2" />
        <text x="140" y="62" fontSize="9" fill="#10b981" textAnchor="middle" fontWeight="700">Zone OB</text>
        {/* Niveau Entry (milieu OB) */}
        <line x1="60" y1="79" x2="220" y2="79" stroke="#10b981" strokeWidth="0.9" strokeDasharray="2 2" opacity="0.7" />
        {/* Trajectoire prix : approche, touche OB, rebond */}
        <path d="M10,40 L40,55 L70,72 L100,80 L130,75 L160,55 L195,35 L240,15 L270,8" stroke="#71717a" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" />
        {/* Entry point */}
        <circle cx="100" cy="80" r="3.5" fill="#10b981" />
        <rect x="78" y="84" width="32" height="11" rx="2" fill="#09090b" />
        <text x="94" y="92" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="700">Entry</text>
        {/* SL ligne sous zone OB */}
        <line x1="10" y1="115" x2="270" y2="115" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 2" opacity="0.8" />
        <rect x="10" y="119" width="22" height="11" rx="2" fill="#09090b" />
        <text x="21" y="127" fontSize="8" fill="#ef4444" textAnchor="middle" fontWeight="700">SL</text>
        {/* TP ligne haut */}
        <line x1="10" y1="14" x2="270" y2="14" stroke="#10b981" strokeWidth="1" strokeDasharray="3 2" opacity="0.8" />
        <rect x="248" y="2" width="22" height="11" rx="2" fill="#09090b" />
        <text x="259" y="10" fontSize="8" fill="#10b981" textAnchor="middle" fontWeight="700">TP</text>
      </svg>

      <div className="space-y-2">
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-2.5">
          <p className="text-[13px] font-bold text-emerald-400">{t.entryTitle}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-0.5">{t.entryBodyPart1}<span className="font-bold">{t.entryBodyBold}</span>{t.entryBodyPart2}</p>
        </div>
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-2.5">
          <p className="text-[13px] font-bold text-red-400">{t.slTitle}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-0.5">{t.slBodyPart1}<span className="font-bold">{t.slBodyBold}</span>{t.slBodyPart2}</p>
        </div>
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-2.5">
          <p className="text-[13px] font-bold text-emerald-400">{t.tpTitle}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-0.5">{t.tpBody}</p>
        </div>
      </div>
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/8 p-2.5 text-center">
        <p className="text-[14px] font-bold text-emerald-400">{t.mobileRR}</p>
      </div>
    </div>
    </div>
  );
}

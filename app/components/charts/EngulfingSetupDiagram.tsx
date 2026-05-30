export default function EngulfingSetupDiagram({ locale = "fr" }: { locale?: "fr" | "es" } = {}) {
  const t = locale === "es"
    ? {
        title: "Bullish engulfing en Fibo 0.618 — XAU/USD H4",
        tpResistance: "TP — Resistencia 4 720$",
        fiboLabel: "Fibo 0.618 — 4 600$",
        slLabel: "SL 4 590$",
        engulfBull: "Engulfing bullish",
        bodyEngulf: "El cuerpo envuelve la 1ª",
        entry: "Entrada 4 630$",
        legend: "Riesgo 40$ · Ganancia potencial 90$ · R/R 2,25",
        mobileTitle: "Bullish engulfing en Fibo 0.618 — XAU/USD H4",
        mobileTP: "Take Profit",
        mobileEntry: "Entrada",
        mobileSL: "Stop Loss",
        mobileRisk: "Riesgo 40 $",
        mobileGain: "Ganancia 90 $",
        mobileFooter: "Vela verde que envuelve por completo la roja anterior sobre el Fibo 0.618 = señal de entrada fuerte.",
      }
    : {
        title: "Bullish engulfing sur Fibo 0.618 — XAU/USD H4",
        tpResistance: "TP — Résistance 4 720$",
        fiboLabel: "Fibo 0.618 — 4 600$",
        slLabel: "SL 4 590$",
        engulfBull: "Engulfing bullish",
        bodyEngulf: "Le corps engloutit la 1ère",
        entry: "Entrée 4 630$",
        legend: "Risque 40$ · Gain potentiel 90$ · R/R 2,25",
        mobileTitle: "Bullish engulfing sur Fibo 0.618 — XAU/USD H4",
        mobileTP: "Take Profit",
        mobileEntry: "Entrée",
        mobileSL: "Stop Loss",
        mobileRisk: "Risque 40 $",
        mobileGain: "Gain 90 $",
        mobileFooter: "Bougie verte qui avale entièrement la rouge précédente sur le Fibo 0.618 = signal d'entrée fort.",
      };

  return (
    <div>
    <svg
      viewBox="0 0 720 440"
      width="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hidden sm:block"
    >
      {/* ── 1. Titre ── */}
      <text x="360" y="28" textAnchor="middle" fontSize="16" fontWeight="600" fill="#10b981">
        {t.title}
      </text>

      {/* ── 2. Axe vertical gauche ── */}
      <line x1="80" y1="65" x2="80" y2="375" stroke="#27272a" strokeWidth="1" />

      {/* Labels prix axe gauche — pastilles + texte */}

      {/* 4 720$ — niveau TP */}
      <rect x="22" y="69" width="56" height="14" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="72" y="80" textAnchor="end" fontSize="11" fill="#a1a1aa">4 720$</text>

      {/* 4 630$ — niveau entrée */}
      <rect x="22" y="149" width="56" height="14" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="72" y="160" textAnchor="end" fontSize="11" fill="#a1a1aa">4 630$</text>

      {/* 4 600$ — niveau Fibo 0.618 */}
      <rect x="22" y="189" width="56" height="14" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="72" y="200" textAnchor="end" fontSize="11" fill="#a1a1aa">4 600$</text>

      {/* 4 590$ — niveau SL */}
      <rect x="22" y="209" width="56" height="14" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="72" y="220" textAnchor="end" fontSize="11" fill="#a1a1aa">4 590$</text>

      {/* ── 3. Ligne TP (emerald-500) ── */}
      <line x1="120" y1="80" x2="680" y2="80" stroke="#10b981" strokeWidth="1.5" strokeDasharray="6 4" />
      <rect x="562" y="72" width="154" height="14" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="715" y="83" textAnchor="end" fontSize="11" fill="#10b981">{t.tpResistance}</text>

      {/* ── 4. Ligne Fibo 0.618 (zinc-400) ── */}
      <line x1="120" y1="200" x2="680" y2="200" stroke="#a1a1aa" strokeWidth="1.5" strokeDasharray="6 4" />
      <rect x="571" y="192" width="144" height="14" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="715" y="203" textAnchor="end" fontSize="11" fill="#a1a1aa">{t.fiboLabel}</text>

      {/* ── 5. Ligne SL (red-500) ── */}
      <line x1="120" y1="220" x2="680" y2="220" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6 4" />
      <rect x="649" y="212" width="68" height="14" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="715" y="223" textAnchor="end" fontSize="11" fill="#ef4444">{t.slLabel}</text>

      {/* ── 6. Bougies bearish de contexte — descente vers le Fibo ── */}

      {/* Bearish 1 */}
      <line x1="169" y1="110" x2="169" y2="170" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="160" y="130" width="18" height="35" rx="2" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />

      {/* Bearish 2 */}
      <line x1="214" y1="140" x2="214" y2="190" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="205" y="155" width="18" height="30" rx="2" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />

      {/* Bearish 3 */}
      <line x1="259" y1="160" x2="259" y2="200" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="250" y="175" width="18" height="20" rx="2" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />

      {/* ── 7. L'engulfing bullish (les 2 bougies clés) ── */}

      {/* Bougie A — bearish petite (la 1ère) */}
      <line x1="311" y1="185" x2="311" y2="178" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="311" y1="200" x2="311" y2="210" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="300" y="185" width="22" height="15" rx="2" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />

      {/* Bougie B — bullish englobante (la 2ème — corps dépasse A en haut ET en bas) */}
      <line x1="358" y1="170" x2="358" y2="163" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <line x1="358" y1="210" x2="358" y2="215" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <rect x="345" y="170" width="26" height="40" rx="2" fill="#10b981" stroke="#059669" strokeWidth="2" />

      {/* Annotation "Engulfing bullish" au-dessus des 2 bougies */}
      <rect x="278" y="144" width="114" height="14" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="335" y="155" textAnchor="middle" fontSize="11" fontWeight="600" fill="#10b981">{t.engulfBull}</text>

      {/* Annotation sous les 2 bougies */}
      <rect x="260" y="229" width="150" height="14" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="335" y="240" textAnchor="middle" fontSize="10" fontStyle="italic" fill="#71717a">{t.bodyEngulf}</text>

      {/* ── 8. Bougie de confirmation bullish ── */}
      <line x1="400" y1="130" x2="400" y2="170" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="391" y="130" width="18" height="40" rx="2" fill="#10b981" stroke="#059669" strokeWidth="1.5" />

      {/* ── 9. Bougie target bullish — vers le TP ── */}
      <line x1="445" y1="90" x2="445" y2="135" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="436" y="90" width="18" height="45" rx="2" fill="#10b981" stroke="#059669" strokeWidth="1.5" />

      {/* ── 10. Annotation Entrée ── */}
      {/* Flèche pointant vers la gauche (vers la zone d'entrée après confirmation) */}
      <line x1="492" y1="160" x2="415" y2="160" stroke="#10b981" strokeWidth="1.5" />
      <path
        d="M421 156 L415 160 L421 164"
        stroke="#10b981"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Pastille + texte */}
      <rect x="494" y="154" width="97" height="14" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="498" y="165" textAnchor="start" fontSize="11" fontWeight="600" fill="#10b981">{t.entry}</text>

      {/* ── 11. Légende bas ── */}
      <rect x="190" y="399" width="340" height="14" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="360" y="410" textAnchor="middle" fontSize="12" fontWeight="500" fill="#d4d4d8">
        {t.legend}
      </text>
    </svg>

    {/* MOBILE : setup Engulfing bullish sur Fibo 0.618 ──────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
      <p className="text-[14px] font-bold text-emerald-400 text-center leading-snug">
        {t.mobileTitle}
      </p>

      {/* Mini-SVG : 2 bougies — petite bearish puis grande bullish englobante (engulfing) */}
      <svg viewBox="0 0 200 140" className="w-full h-auto max-h-[180px]" aria-label="Engulfing setup" fill="none">
        {/* Niveau de référence */}
        <line x1="20" y1="100" x2="180" y2="100" stroke="#71717a" strokeWidth="0.7" strokeDasharray="3 3" />
        {/* Bougie 1 — petite bearish */}
        <line x1="65" y1="50" x2="65" y2="105" stroke="#dc2626" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="55" y="65" width="20" height="32" fill="#ef4444" stroke="#dc2626" strokeWidth="1" rx="1.5" />
        <text x="65" y="125" fontSize="9" fill="#a1a1aa" textAnchor="middle">1</text>
        {/* Bougie 2 — grande bullish englobante */}
        <line x1="125" y1="20" x2="125" y2="110" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" />
        <rect x="113" y="35" width="24" height="65" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1.5" />
        <text x="125" y="125" fontSize="9" fill="#10b981" textAnchor="middle" fontWeight="700">2 ↑</text>
        {/* Label engulfing */}
        <rect x="55" y="6" width="86" height="13" rx="2" fill="#10b98118" stroke="#10b98155" strokeWidth="0.6" />
        <text x="98" y="15" fontSize="9" fill="#10b981" textAnchor="middle" fontWeight="700">Engulfing ↑</text>
      </svg>

      <div className="space-y-2">
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-2.5 flex justify-between items-center">
          <span className="text-[12px] text-emerald-400/80 uppercase font-bold tracking-wider">{t.mobileTP}</span>
          <span className="text-[15px] font-mono font-bold text-emerald-400">4 720 $</span>
        </div>
        <div className="rounded-lg bg-zinc-800 border border-zinc-700 p-2.5 flex justify-between items-center">
          <span className="text-[12px] text-zinc-300 uppercase font-bold tracking-wider">{t.mobileEntry}</span>
          <span className="text-[15px] font-mono font-bold text-white">4 630 $</span>
        </div>
        <div className="rounded-lg bg-blue-500/10 border border-blue-400/30 p-2.5 flex justify-between items-center">
          <span className="text-[12px] text-blue-400 uppercase font-bold tracking-wider">Fibo 0.618</span>
          <span className="text-[14px] font-mono font-semibold text-blue-400">4 600 $</span>
        </div>
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-2.5 flex justify-between items-center">
          <span className="text-[12px] text-red-400/80 uppercase font-bold tracking-wider">{t.mobileSL}</span>
          <span className="text-[15px] font-mono font-bold text-red-400">4 590 $</span>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-700 bg-zinc-800/30 p-2.5 text-center space-y-1">
        <p className="text-[13px] text-zinc-300">
          <span className="text-red-400 font-bold">{t.mobileRisk}</span> · <span className="text-emerald-400 font-bold">{t.mobileGain}</span>
        </p>
        <p className="text-[15px] font-bold text-emerald-400">R/R = 2,25</p>
      </div>

      <p className="text-[12px] text-zinc-400 italic text-center leading-snug pt-2 border-t border-zinc-800">
        {t.mobileFooter}
      </p>
    </div>
    </div>
  );
}

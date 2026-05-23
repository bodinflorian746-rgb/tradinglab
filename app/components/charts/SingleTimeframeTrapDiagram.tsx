// Diagramme : piège du timeframe unique
// Le même marché, lu sur 2 timeframes, raconte 2 choses opposées.

interface SingleTimeframeTrapDiagramProps {
  className?: string;
  locale?: "fr" | "es";
}

export function SingleTimeframeTrapDiagram({ className = "", locale = "fr" }: SingleTimeframeTrapDiagramProps) {
  const t = locale === "es"
    ? {
        resistanceDaily: "Resistencia Daily",
        tendance: "Tendencia bajista nítida",
        niveauM15: "Nivel M15 local",
        breakoutLocal: "Breakout local alcista",
        annotation: "Señal compradora local — CONTRA la tendencia Daily",
        mobileTitle: "El mismo mercado, 2 timeframes opuestos",
        b1Title: "Daily — Tendencia bajista nítida ↘",
        b1Body: "En Daily, el precio forma una secuencia LH/LL clara bajo la resistencia.",
        b2Title: "M15 — Breakout local alcista ↗",
        b2Body: "En M15, el precio rompe un mini-nivel → tentación de comprar.",
        warning: "⚠ Señal local CONTRA la tendencia Daily = trampa",
        mobileFooter: "Leer un solo timeframe = ignorar la verdadera dirección.",
        leg1: "HTF Daily = tendencia bajista",
        leg2: "LTF M15 = señal engañosa aislada",
        leg3: "Leer un solo TF = trampa",
      }
    : {
        resistanceDaily: "Résistance Daily",
        tendance: "Tendance baissière nette",
        niveauM15: "Niveau M15 local",
        breakoutLocal: "Breakout local haussier",
        annotation: "Signal acheteur local — CONTRE la tendance Daily",
        mobileTitle: "Le même marché, 2 timeframes opposés",
        b1Title: "Daily — Tendance baissière nette ↘",
        b1Body: "Sur Daily, le prix forme une séquence LH/LL claire sous la résistance.",
        b2Title: "M15 — Breakout local haussier ↗",
        b2Body: "Sur M15, le prix casse un mini-niveau → tentation d'acheter.",
        warning: "⚠ Signal local CONTRE la tendance Daily = piège",
        mobileFooter: "Lire un seul timeframe = ignorer la vraie direction.",
        leg1: "HTF Daily = tendance baissière",
        leg2: "LTF M15 = signal trompeur isolé",
        leg3: "Lire un seul TF = piège",
      };
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg
        width="100%"
        viewBox="0 0 800 320"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        className="hidden sm:block"
      >
        {/* Séparateur central */}
        <line x1="400" y1="20" x2="400" y2="290" stroke="#3f3f46" strokeWidth="1" strokeDasharray="4 3" />

        {/* ═══ MOITIÉ GAUCHE — DAILY baissier ═══ */}
        <rect x="20" y="20" width="120" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="80" y="35" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">DAILY</text>

        {/* Résistance Daily */}
        <line x1="40" y1="70" x2="380" y2="70" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" strokeOpacity="0.7" />
        <rect x="40" y="56" width="86" height="13" rx="3" fill="#09090b" />
        <text x="83" y="66" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">{t.resistanceDaily}</text>

        {/* Path baissier LH/LL */}
        <path
          d="M40,90 L90,75 L140,140 L190,110 L240,180 L290,150 L340,230"
          stroke="#ef4444" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round"
        />

        {/* Markers LH/LL */}
        <circle cx="90" cy="75" r="4" fill="#ef4444" />
        <rect x="76" y="55" width="28" height="13" rx="3" fill="#09090b" />
        <text x="90" y="65" fill="#ef4444" fontSize="8" fontWeight="700" textAnchor="middle">LH1</text>

        <circle cx="190" cy="110" r="4" fill="#ef4444" />
        <rect x="176" y="92" width="28" height="13" rx="3" fill="#09090b" />
        <text x="190" y="102" fill="#ef4444" fontSize="8" fontWeight="700" textAnchor="middle">LH2</text>

        <circle cx="140" cy="140" r="4" fill="#ef4444" />
        <rect x="126" y="147" width="28" height="13" rx="3" fill="#09090b" />
        <text x="140" y="157" fill="#ef4444" fontSize="8" fontWeight="700" textAnchor="middle">LL1</text>

        <circle cx="240" cy="180" r="4" fill="#ef4444" />
        <rect x="226" y="187" width="28" height="13" rx="3" fill="#09090b" />
        <text x="240" y="197" fill="#ef4444" fontSize="8" fontWeight="700" textAnchor="middle">LL2</text>

        {/* Flèche tendance */}
        <text x="365" y="260" fill="#ef4444" fontSize="20" opacity="0.5" textAnchor="middle">↘</text>
        <text x="200" y="285" fill="#a1a1aa" fontSize="10" textAnchor="middle">{t.tendance}</text>

        {/* ═══ MOITIÉ DROITE — M15 breakout local haussier ═══ */}
        <rect x="660" y="20" width="120" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
        <text x="720" y="35" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">M15</text>

        {/* Mini-niveau cassé */}
        <line x1="440" y1="160" x2="780" y2="160" stroke="#71717a" strokeWidth="1.2" strokeDasharray="3 2" />
        <rect x="440" y="147" width="100" height="13" rx="3" fill="#09090b" />
        <text x="490" y="157" fill="#71717a" fontSize="9" fontWeight="600" textAnchor="middle">{t.niveauM15}</text>

        {/* Bougies — 5 bougies, dont 3 vertes qui cassent le niveau */}
        {/* B1 rouge */}
        <line x1="470" y1="170" x2="470" y2="210" stroke="#b91c1c" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="462" y="180" width="16" height="22" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />
        {/* B2 rouge */}
        <line x1="510" y1="175" x2="510" y2="215" stroke="#b91c1c" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="502" y="185" width="16" height="20" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />
        {/* B3 verte */}
        <line x1="550" y1="155" x2="550" y2="195" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="542" y="165" width="16" height="22" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />
        {/* B4 verte qui casse */}
        <line x1="590" y1="125" x2="590" y2="170" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="582" y="135" width="16" height="28" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />
        {/* B5 verte continuation */}
        <line x1="630" y1="105" x2="630" y2="150" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="622" y="115" width="16" height="28" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />
        {/* B6 verte */}
        <line x1="670" y1="90" x2="670" y2="140" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="662" y="100" width="16" height="32" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

        {/* Flèche montée locale */}
        <text x="715" y="115" fill="#10b981" fontSize="20" opacity="0.6" textAnchor="middle">↗</text>

        {/* Annotation locale — "tentation" */}
        <rect x="540" y="68" width="180" height="14" rx="3" fill="#09090b" />
        <text x="630" y="78" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">{t.breakoutLocal}</text>

        {/* ═══ Annotation traversante : Signal contre tendance ═══ */}
        <rect x="200" y="300" width="400" height="18" rx="9" fill="#09090b" />
        <rect x="200" y="300" width="400" height="18" rx="9" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
        <text x="400" y="313" fill="#f59e0b" fontSize="10" fontWeight="700" textAnchor="middle">
          {t.annotation}
        </text>
      </svg>

      {/* MOBILE : piège du timeframe unique ─────────────────── */}
      <div className="sm:hidden p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">{t.mobileTitle}</p>
        <div className="rounded-lg border border-red-500/40 bg-red-500/8 p-3">
          <p className="text-[13px] font-bold text-red-400">{t.b1Title}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{t.b1Body}</p>
        </div>
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
          <p className="text-[13px] font-bold text-emerald-400">{t.b2Title}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{t.b2Body}</p>
        </div>
        <div className="rounded-lg border-2 border-amber-400 bg-amber-400/10 p-3 text-center">
          <p className="text-[13px] font-bold text-amber-400">{t.warning}</p>
        </div>
        <p className="text-[12px] text-zinc-400 italic text-center pt-2 border-t border-zinc-800 leading-snug">
          {t.mobileFooter}
        </p>
      </div>

      {/* Légende */}
      <div className="hidden sm:flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <span className="text-[10px] text-zinc-500">{t.leg1}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">{t.leg2}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-amber-500" />
          <span className="text-[10px] text-zinc-500">{t.leg3}</span>
        </div>
      </div>
    </div>
  );
}

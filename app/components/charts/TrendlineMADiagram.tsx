export default function TrendlineMADiagram({ className = "", locale = "fr" }: { className?: string; locale?: "fr" | "es" }) {
  const labels = locale === "es"
    ? {
        badge: "Trendline + MM = zona defendida",
        trendline: "Trendline",
        confluence: "Confluencia",
        legende: "Trendline (esmeralda) · MM20 (azul) · MM50 (gris) · Punto de confluencia",
        mobTitle: "Trendline + MM = zona defendida",
        mobTrendline: "Trendline",
        mobTrendlineDesc: "recta que une los pivotes",
        mobMM20: "MM20",
        mobMM20Desc: "media móvil 20 períodos",
        mobMM50: "MM50",
        mobMM50Desc: "media móvil 50 períodos",
        mobConcl: "Cuando trendline + MM se cruzan en el mismo lugar = entrada pullback de alta probabilidad.",
      }
    : {
        badge: "Trendline + MM = zone défendue",
        trendline: "Trendline",
        confluence: "Confluence",
        legende: "Trendline (emerald) · MM20 (bleu) · MM50 (gris) · Point de confluence",
        mobTitle: "Trendline + MM = zone défendue",
        mobTrendline: "Trendline",
        mobTrendlineDesc: "droite reliant les pivots",
        mobMM20: "MM20",
        mobMM20Desc: "moyenne mobile 20 périodes",
        mobMM50: "MM50",
        mobMM50Desc: "moyenne mobile 50 périodes",
        mobConcl: "Quand trendline + MM se croisent au même endroit = entrée pullback haute probabilité.",
      };
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 300"
      className="hidden sm:block w-full h-auto"
    >
      {/* Badge top droit — Trendline + MM = zone défendue */}
      <rect x="410" y="20" width="170" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="495" y="35" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">
        {labels.badge}
      </text>

      {/* MM50 — zinc-400, trait lissé visiblement EN DESSOUS du chemin du prix avec lag marqué */}
      <path
        d="M20,265 L100,245 L200,215 L300,185 L400,160 L500,130 L580,110"
        stroke="#a1a1aa"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />

      {/* MM20 — blue-400, envelope haute visiblement AU-DESSUS du chemin du prix */}
      <path
        d="M20,210 L100,170 L200,140 L300,110 L400,75 L500,45 L580,15"
        stroke="#60a5fa"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />

      {/* Path du prix — zinc-500, structure HH/HL ascendante */}
      <path
        d="M20,240 L80,180 L120,210 L180,150 L220,180 L280,120 L320,150 L380,90 L420,130 L460,80 L520,50 L580,30"
        stroke="#71717a"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Trendline emerald — reliant les HL prolongée vers la droite */}
      <line x1="120" y1="210" x2="580" y2="85" stroke="#10b981" strokeWidth="1.5" />

      {/* Halo emerald au point de confluence HL4 */}
      <circle cx="420" cy="130" r="12" fill="#10b981" opacity="0.3" />

      {/* Cercles HL successifs */}
      <circle cx="120" cy="210" r="3" fill="#10b981" />
      <circle cx="220" cy="180" r="3" fill="#10b981" />
      <circle cx="320" cy="150" r="3" fill="#10b981" />
      <circle cx="420" cy="130" r="6" fill="#10b981" />

      {/* Labels lignes */}
      <text x="290" y="170" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">{labels.trendline}</text>
      <text x="580" y="40" fill="#60a5fa" fontSize="9" fontWeight="600" textAnchor="end">MM20</text>
      <text x="580" y="110" fill="#a1a1aa" fontSize="9" fontWeight="600" textAnchor="end">MM50</text>

      {/* Pastille Confluence pointant le gros cercle emerald HL4 */}
      <rect x="390" y="103" width="60" height="14" rx="4" fill="#27272a" stroke="#10b981" strokeWidth="0.8" />
      <text x="420" y="113" fill="#10b981" fontSize="8" fontWeight="600" textAnchor="middle">{labels.confluence}</text>
      <line x1="420" y1="117" x2="420" y2="124" stroke="#10b981" strokeWidth="0.8" />

      {/* Légende basse */}
      <text x="300" y="290" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        {labels.legende}
      </text>
    </svg>

    {/* MOBILE : trendline + MM = zone défendue ─────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-emerald-400 text-center">{labels.mobTitle}</p>
      <ul className="space-y-2 text-[13px]">
        <li className="flex items-center gap-2.5">
          <span className="shrink-0 w-4 h-0.5 bg-emerald-400 rounded" />
          <span className="text-zinc-300"><span className="font-bold text-emerald-400">{labels.mobTrendline}</span> · {labels.mobTrendlineDesc}</span>
        </li>
        <li className="flex items-center gap-2.5">
          <span className="shrink-0 w-4 h-0.5 bg-blue-400 rounded" />
          <span className="text-zinc-300"><span className="font-bold text-blue-400">{labels.mobMM20}</span> · {labels.mobMM20Desc}</span>
        </li>
        <li className="flex items-center gap-2.5">
          <span className="shrink-0 w-4 h-0.5 bg-zinc-500 rounded" />
          <span className="text-zinc-300"><span className="font-bold text-zinc-300">{labels.mobMM50}</span> · {labels.mobMM50Desc}</span>
        </li>
      </ul>
      <p className="text-[13px] text-emerald-400 font-bold text-center pt-2 border-t border-zinc-800 leading-snug">
        {labels.mobConcl}
      </p>
    </div>
    </div>
  );
}

export default function TrendlineMADiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 300"
      className={`w-full h-auto ${className}`}
    >
      {/* Badge top droit — Trendline + MM = zone défendue */}
      <rect x="410" y="20" width="170" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="495" y="35" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">
        Trendline + MM = zone défendue
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
      <text x="290" y="170" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">Trendline</text>
      <text x="580" y="40" fill="#60a5fa" fontSize="9" fontWeight="600" textAnchor="end">MM20</text>
      <text x="580" y="110" fill="#a1a1aa" fontSize="9" fontWeight="600" textAnchor="end">MM50</text>

      {/* Pastille Confluence pointant le gros cercle emerald HL4 */}
      <rect x="390" y="103" width="60" height="14" rx="4" fill="#27272a" stroke="#10b981" strokeWidth="0.8" />
      <text x="420" y="113" fill="#10b981" fontSize="8" fontWeight="600" textAnchor="middle">Confluence</text>
      <line x1="420" y1="117" x2="420" y2="124" stroke="#10b981" strokeWidth="0.8" />

      {/* Légende basse */}
      <text x="300" y="290" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        Trendline (emerald) · MM20 (bleu) · MM50 (gris) · Point de confluence
      </text>
    </svg>
  );
}

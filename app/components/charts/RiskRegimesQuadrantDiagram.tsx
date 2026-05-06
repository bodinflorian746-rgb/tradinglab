export default function RiskRegimesQuadrantDiagram() {
  return (
    <svg
      className="w-full h-auto"
      viewBox="0 0 720 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Titre ── */}
      <text x="360" y="30" fill="#fbbf24" fontSize="18" fontWeight="600" textAnchor="middle">
        Les 4 régimes de marché
      </text>

      {/* ── Axes ── */}
      <line x1="80" y1="270" x2="640" y2="270" stroke="#3f3f46" strokeWidth="1" />
      <line x1="360" y1="80" x2="360" y2="460" stroke="#3f3f46" strokeWidth="1" />

      {/* ── Quadrant TOP-LEFT — Risk-on classique (emerald-500) ── */}
      <rect x="85" y="95" width="265" height="160" rx="8" fill="transparent" stroke="#10b981" strokeWidth="1.5" />
      <text x="97" y="121" fill="#10b981" fontSize="14" fontWeight="600">Risk-on classique</text>
      <text x="97" y="139" fill="#d4d4d8" fontSize="11">DXY ↓  •  Yields ~  •  Or ~</text>
      <text x="97" y="154" fill="#d4d4d8" fontSize="11">Indices ↑  •  BTC ↑</text>
      <text x="97" y="228" fill="#71717a" fontSize="10" fontStyle="italic">Croissance + liquidité,</text>
      <text x="97" y="241" fill="#71717a" fontSize="10" fontStyle="italic">le capital cherche du rendement</text>

      {/* ── Quadrant TOP-RIGHT — Reflation trade (amber-400) ── */}
      <rect x="370" y="95" width="265" height="160" rx="8" fill="transparent" stroke="#fbbf24" strokeWidth="1.5" />
      <text x="382" y="121" fill="#fbbf24" fontSize="14" fontWeight="600">Reflation trade</text>
      <text x="382" y="139" fill="#d4d4d8" fontSize="11">DXY ~  •  Yields ↑  •  Or ↑</text>
      <text x="382" y="154" fill="#d4d4d8" fontSize="11">Indices ↑*  •  BTC ↑</text>
      <text x="382" y="228" fill="#71717a" fontSize="10" fontStyle="italic">Croissance + inflation,</text>
      <text x="382" y="241" fill="#71717a" fontSize="10" fontStyle="italic">rotation vers actifs réels</text>

      {/* ── Quadrant BOTTOM-LEFT — Flight to quality (zinc-400) ── */}
      <rect x="85" y="285" width="265" height="160" rx="8" fill="transparent" stroke="#a1a1aa" strokeWidth="1.5" />
      <text x="97" y="311" fill="#a1a1aa" fontSize="14" fontWeight="600">Flight to quality</text>
      <text x="97" y="329" fill="#d4d4d8" fontSize="11">DXY ↑  •  Yields ↓  •  Or ↑</text>
      <text x="97" y="344" fill="#d4d4d8" fontSize="11">Indices ↓  •  BTC ↓</text>
      <text x="97" y="418" fill="#71717a" fontSize="10" fontStyle="italic">Peur mesurée, repositionnement</text>
      <text x="97" y="431" fill="#71717a" fontSize="10" fontStyle="italic">défensif sans panique</text>

      {/* ── Quadrant BOTTOM-RIGHT — Risk-off panique (red-500) ── */}
      <rect x="370" y="285" width="265" height="160" rx="8" fill="transparent" stroke="#ef4444" strokeWidth="1.5" />
      <text x="382" y="311" fill="#ef4444" fontSize="14" fontWeight="600">Risk-off panique</text>
      <text x="382" y="329" fill="#d4d4d8" fontSize="11">DXY ↑↑  •  Yields ↓  •  Or ↑</text>
      <text x="382" y="344" fill="#d4d4d8" fontSize="11">Indices ↓↓  •  BTC ↓↓</text>
      <text x="382" y="418" fill="#71717a" fontSize="10" fontStyle="italic">Liquidation globale,</text>
      <text x="382" y="431" fill="#71717a" fontSize="10" fontStyle="italic">recherche de cash et sécurité</text>

      {/* ── Labels d'axes avec pastilles opaques ── */}

      {/* Horizontal gauche — Inflation faible */}
      <rect x="84" y="281" width="116" height="18" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="90" y="295" fill="#a1a1aa" fontSize="12" fontWeight="500">Inflation faible</text>

      {/* Horizontal droite — Inflation élevée */}
      <rect x="520" y="281" width="116" height="18" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="630" y="295" fill="#a1a1aa" fontSize="12" fontWeight="500" textAnchor="end">Inflation élevée</text>

      {/* Vertical haut — Croissance forte */}
      <rect x="364" y="75" width="118" height="18" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="370" y="88" fill="#a1a1aa" fontSize="12" fontWeight="500">Croissance forte</text>

      {/* Vertical bas — Croissance faible */}
      <rect x="364" y="457" width="124" height="18" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="370" y="470" fill="#a1a1aa" fontSize="12" fontWeight="500">Croissance faible</text>

      {/* ── Légende ── */}
      <text x="360" y="500" fill="#71717a" fontSize="10" textAnchor="middle">
        ↑ haussier  •  ↓ baissier  •  ~ stable  •  * sauf tech longue duration
      </text>
    </svg>
  );
}

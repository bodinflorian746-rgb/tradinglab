export default function SMCPhasesDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 400"
      className={`w-full h-auto ${className}`}
    >
      <text x="450" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        Les 3 phases du cycle de marché
      </text>

      <line x1="305" y1="40" x2="305" y2="370" stroke="#3f3f46" strokeWidth="1" />
      <line x1="605" y1="40" x2="605" y2="370" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ PANEL 1 — Accumulation ═══ */}
      <rect x="35" y="50" width="230" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="150" y="65" fill="#10b981" fontSize="11" fontWeight="700" textAnchor="middle">Accumulation</text>

      {/* Range bornes haut/bas */}
      <line x1="20" y1="240" x2="290" y2="240" stroke="#a1a1aa" strokeWidth="0.8" strokeDasharray="4 3" />
      <rect x="22" y="227" width="42" height="11" rx="2" fill="#09090b" />
      <text x="25" y="235" fill="#a1a1aa" fontSize="8">4 500$</text>
      <line x1="20" y1="300" x2="290" y2="300" stroke="#a1a1aa" strokeWidth="0.8" strokeDasharray="4 3" />
      <rect x="22" y="307" width="42" height="11" rx="2" fill="#09090b" />
      <text x="25" y="315" fill="#a1a1aa" fontSize="8">4 460$</text>

      {/* Oscillation compressée */}
      <path d="M30,270 L55,245 L80,290 L105,250 L130,295 L155,250 L180,290 L205,255 L230,285 L255,265 L280,275" stroke="#71717a" strokeWidth="1.8" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      <text x="150" y="345" fill="#a1a1aa" fontSize="8" textAnchor="middle">Range compressé 4 460-4 500$</text>
      <text x="150" y="360" fill="#a1a1aa" fontSize="8" textAnchor="middle">Volatilité faible, volume contenu</text>

      {/* ═══ PANEL 2 — Expansion ═══ */}
      <rect x="335" y="50" width="230" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="450" y="65" fill="#10b981" fontSize="11" fontWeight="700" textAnchor="middle">Expansion (markup)</text>

      {/* Impulsion ascendante HH/HL */}
      <path d="M325,300 L370,250 L400,270 L440,210 L470,230 L510,170 L540,190 L580,120 L600,80" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      <circle cx="370" cy="250" r="3" fill="#10b981" />
      <rect x="362" y="258" width="16" height="9" rx="2" fill="#09090b" />
      <text x="370" y="265" fill="#10b981" fontSize="7" textAnchor="middle">HL</text>
      <circle cx="440" cy="210" r="3" fill="#10b981" />
      <rect x="432" y="193" width="16" height="9" rx="2" fill="#09090b" />
      <text x="440" y="200" fill="#10b981" fontSize="7" textAnchor="middle">HH</text>
      <circle cx="470" cy="230" r="3" fill="#10b981" />
      <rect x="462" y="238" width="16" height="9" rx="2" fill="#09090b" />
      <text x="470" y="245" fill="#10b981" fontSize="7" textAnchor="middle">HL</text>
      <circle cx="510" cy="170" r="3" fill="#10b981" />
      <rect x="502" y="153" width="16" height="9" rx="2" fill="#09090b" />
      <text x="510" y="160" fill="#10b981" fontSize="7" textAnchor="middle">HH</text>
      <circle cx="540" cy="190" r="3" fill="#10b981" />
      <rect x="532" y="198" width="16" height="9" rx="2" fill="#09090b" />
      <text x="540" y="205" fill="#10b981" fontSize="7" textAnchor="middle">HL</text>
      <circle cx="580" cy="120" r="4" fill="#10b981" />
      <rect x="555" y="105" width="50" height="9" rx="2" fill="#09090b" />
      <text x="580" y="112" fill="#10b981" fontSize="7" textAnchor="middle">HH 4 720$</text>

      <text x="450" y="345" fill="#a1a1aa" fontSize="8" textAnchor="middle">Impulsion 4 500-4 720$</text>
      <text x="450" y="360" fill="#a1a1aa" fontSize="8" textAnchor="middle">Structure HH/HL claire</text>

      {/* ═══ PANEL 3 — Distribution ═══ */}
      <rect x="635" y="50" width="230" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
      <text x="750" y="65" fill="#f59e0b" fontSize="11" fontWeight="700" textAnchor="middle">Distribution</text>

      {/* Range en haut d'impulsion */}
      <line x1="620" y1="120" x2="890" y2="120" stroke="#a1a1aa" strokeWidth="0.8" strokeDasharray="4 3" />
      <rect x="622" y="107" width="42" height="11" rx="2" fill="#09090b" />
      <text x="625" y="115" fill="#a1a1aa" fontSize="8">4 720$</text>
      <line x1="620" y1="180" x2="890" y2="180" stroke="#a1a1aa" strokeWidth="0.8" strokeDasharray="4 3" />
      <rect x="622" y="187" width="42" height="11" rx="2" fill="#09090b" />
      <text x="625" y="195" fill="#a1a1aa" fontSize="8">4 680$</text>

      <path d="M630,150 L655,125 L680,175 L705,135 L730,170 L755,130 L780,175 L805,140 L830,170 L855,150 L880,160" stroke="#71717a" strokeWidth="1.8" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      <text x="750" y="345" fill="#a1a1aa" fontSize="8" textAnchor="middle">Range haut d&apos;impulsion 4 680-4 720$</text>
      <text x="750" y="360" fill="#a1a1aa" fontSize="8" textAnchor="middle">Institutions distribuent leurs positions</text>

      <text x="450" y="390" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        L&apos;expansion est la seule phase où les setups SMC se prennent dans le sens directionnel
      </text>
    </svg>
  );
}

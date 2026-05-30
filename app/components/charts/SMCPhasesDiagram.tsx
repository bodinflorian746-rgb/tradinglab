export default function SMCPhasesDiagram({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 400"
      className="hidden sm:block w-full h-auto"
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
      <text x="150" y="360" fill="#a1a1aa" fontSize="8" textAnchor="middle">Smart money construit ses positions, phase d&apos;observation</text>

      {/* ═══ PANEL 2 — Manipulation (faux breakout / sweep) ═══ */}
      <rect x="335" y="50" width="230" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
      <text x="450" y="65" fill="#f59e0b" fontSize="11" fontWeight="700" textAnchor="middle">Manipulation</text>

      {/* Range bornes (réutilisées du panel 1, pour montrer le sweep au-dessus du high) */}
      <line x1="320" y1="200" x2="590" y2="200" stroke="#a1a1aa" strokeWidth="0.8" strokeDasharray="4 3" />
      <rect x="322" y="187" width="60" height="11" rx="2" fill="#09090b" />
      <text x="325" y="195" fill="#a1a1aa" fontSize="8">Ex-high range</text>
      <line x1="320" y1="280" x2="590" y2="280" stroke="#a1a1aa" strokeWidth="0.8" strokeDasharray="4 3" />
      <rect x="322" y="287" width="60" height="11" rx="2" fill="#09090b" />
      <text x="325" y="295" fill="#a1a1aa" fontSize="8">Ex-low range</text>

      {/* Bougies dans le range avant breakout */}
      {/* Helper inline pour bougies du panel 2 */}
      <g>
        {/* Bougie 1 (bull) — dans range */}
        <line x1="345" y1="225" x2="345" y2="265" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="340" y="235" width="10" height="20" fill="#10b981" stroke="#059669" strokeWidth="0.8" rx="1.2" />
        {/* Bougie 2 (bear) */}
        <line x1="365" y1="230" x2="365" y2="272" stroke="#dc2626" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="360" y="240" width="10" height="22" fill="#ef4444" stroke="#dc2626" strokeWidth="0.8" rx="1.2" />
        {/* Bougie 3 (bull) */}
        <line x1="385" y1="220" x2="385" y2="262" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="380" y="232" width="10" height="22" fill="#10b981" stroke="#059669" strokeWidth="0.8" rx="1.2" />
        {/* Bougie 4 (bull) — approche du high */}
        <line x1="405" y1="210" x2="405" y2="240" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="400" y="215" width="10" height="20" fill="#10b981" stroke="#059669" strokeWidth="0.8" rx="1.2" />

        {/* Bougie 5 (BREAKOUT) — mèche perce au-dessus du high (sweep liquidité) */}
        <line x1="430" y1="160" x2="430" y2="218" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" />
        <rect x="424" y="195" width="12" height="22" fill="#10b981" stroke="#059669" strokeWidth="0.8" rx="1.2" />

        {/* Bougie 6 (RETOUR — bearish violent) */}
        <line x1="460" y1="195" x2="460" y2="262" stroke="#dc2626" strokeWidth="1.6" strokeLinecap="round" />
        <rect x="454" y="205" width="12" height="50" fill="#ef4444" stroke="#dc2626" strokeWidth="0.8" rx="1.2" />

        {/* Bougie 7 (bear continuation, prix re-rentré dans le range) */}
        <line x1="490" y1="245" x2="490" y2="285" stroke="#dc2626" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="484" y="250" width="12" height="28" fill="#ef4444" stroke="#dc2626" strokeWidth="0.8" rx="1.2" />

        {/* Bougie 8 (oscillation post-fakeout) */}
        <line x1="518" y1="255" x2="518" y2="285" stroke="#dc2626" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="512" y="260" width="10" height="20" fill="#ef4444" stroke="#dc2626" strokeWidth="0.8" rx="1.2" />

        {/* Bougie 9 */}
        <line x1="540" y1="250" x2="540" y2="280" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="535" y="255" width="10" height="20" fill="#10b981" stroke="#059669" strokeWidth="0.8" rx="1.2" />

        {/* Bougie 10 */}
        <line x1="560" y1="252" x2="560" y2="278" stroke="#dc2626" strokeWidth="1.4" strokeLinecap="round" />
        <rect x="555" y="258" width="10" height="18" fill="#ef4444" stroke="#dc2626" strokeWidth="0.8" rx="1.2" />
      </g>

      {/* Annotations panel 2 */}
      {/* "Sweep liquidité" sur la mèche du breakout */}
      <rect x="395" y="148" width="80" height="14" rx="3" fill="#f59e0b18" stroke="#f59e0b55" strokeWidth="0.7" />
      <text x="435" y="158" fill="#f59e0b" fontSize="8" textAnchor="middle" fontWeight="700">Sweep liquidité</text>
      <line x1="435" y1="162" x2="430" y2="178" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.7" />

      {/* "Faux breakout" — label entre les bougies 5 et 6 */}
      <rect x="430" y="320" width="80" height="14" rx="3" fill="#ef444418" stroke="#ef444455" strokeWidth="0.7" />
      <text x="470" y="330" fill="#ef4444" fontSize="8" textAnchor="middle" fontWeight="700">Faux breakout</text>
      <line x1="470" y1="320" x2="465" y2="265" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />

      <text x="450" y="350" fill="#a1a1aa" fontSize="8" textAnchor="middle">Sweep des stops retail au-dessus du range</text>
      <text x="450" y="362" fill="#a1a1aa" fontSize="8" textAnchor="middle">Piège tendu pour collecter la liquidité</text>

      {/* ═══ PANEL 3 — Expansion (markup/markdown) ═══ */}
      <rect x="635" y="50" width="230" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1.5" />
      <text x="750" y="65" fill="#10b981" fontSize="11" fontWeight="700" textAnchor="middle">Expansion</text>

      {/* Tag "Trader ici ✓" sur le panel 3 */}
      <rect x="775" y="78" width="80" height="14" rx="3" fill="#10b98118" stroke="#10b981" strokeWidth="0.8" />
      <text x="815" y="88" fill="#10b981" fontSize="8" textAnchor="middle" fontWeight="700">✓ Trader ici</text>

      {/* Impulsion ascendante HH/HL */}
      <path d="M625,300 L670,250 L700,270 L740,210 L770,230 L810,170 L840,190 L880,120 L895,80" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      <circle cx="670" cy="250" r="3" fill="#10b981" />
      <rect x="662" y="258" width="16" height="9" rx="2" fill="#09090b" />
      <text x="670" y="265" fill="#10b981" fontSize="7" textAnchor="middle">HL</text>
      <circle cx="740" cy="210" r="3" fill="#10b981" />
      <rect x="732" y="193" width="16" height="9" rx="2" fill="#09090b" />
      <text x="740" y="200" fill="#10b981" fontSize="7" textAnchor="middle">HH</text>
      <circle cx="770" cy="230" r="3" fill="#10b981" />
      <rect x="762" y="238" width="16" height="9" rx="2" fill="#09090b" />
      <text x="770" y="245" fill="#10b981" fontSize="7" textAnchor="middle">HL</text>
      <circle cx="810" cy="170" r="3" fill="#10b981" />
      <rect x="802" y="153" width="16" height="9" rx="2" fill="#09090b" />
      <text x="810" y="160" fill="#10b981" fontSize="7" textAnchor="middle">HH</text>
      <circle cx="840" cy="190" r="3" fill="#10b981" />
      <rect x="832" y="198" width="16" height="9" rx="2" fill="#09090b" />
      <text x="840" y="205" fill="#10b981" fontSize="7" textAnchor="middle">HL</text>
      <circle cx="880" cy="120" r="4" fill="#10b981" />
      <rect x="855" y="105" width="50" height="9" rx="2" fill="#09090b" />
      <text x="880" y="112" fill="#10b981" fontSize="7" textAnchor="middle">HH 4 720$</text>

      <text x="750" y="345" fill="#a1a1aa" fontSize="8" textAnchor="middle">Tendance directionnelle nette HH/HL</text>
      <text x="750" y="360" fill="#a1a1aa" fontSize="8" textAnchor="middle">Entrer dans le sens de l&apos;impulsion</text>

      <text x="450" y="390" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        L&apos;expansion (après manipulation) est la seule phase où les setups SMC se prennent dans le sens directionnel
      </text>
    </svg>

    {/* MOBILE : 3 phases du marché ───────────────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">Les 3 phases du cycle de marché</p>

      {/* Mini-SVG : visuel des 3 phases (oscillation range → spike fakeout → impulsion HH/HL) */}
      <svg viewBox="0 0 300 100" className="w-full h-auto" aria-label="3 phases du marché" fill="none">
        {/* séparateurs entre phases */}
        <line x1="100" y1="10" x2="100" y2="90" stroke="#3f3f46" strokeWidth="0.8" />
        <line x1="200" y1="10" x2="200" y2="90" stroke="#3f3f46" strokeWidth="0.8" />
        {/* Panel 1 — Accumulation (range oscillant zinc) */}
        <line x1="8" y1="40" x2="92" y2="40" stroke="#52525b" strokeWidth="0.8" strokeDasharray="3 3" />
        <line x1="8" y1="70" x2="92" y2="70" stroke="#52525b" strokeWidth="0.8" strokeDasharray="3 3" />
        <path d="M10,55 L25,42 L40,68 L55,45 L70,68 L85,50" stroke="#71717a" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {/* Panel 2 — Manipulation (spike au-dessus + retour amber) */}
        <line x1="108" y1="40" x2="192" y2="40" stroke="#52525b" strokeWidth="0.8" strokeDasharray="3 3" />
        <line x1="108" y1="70" x2="192" y2="70" stroke="#52525b" strokeWidth="0.8" strokeDasharray="3 3" />
        <path d="M110,55 L125,50 L140,55 L150,20 L160,55 L175,65 L190,60" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx="150" cy="20" r="3" fill="#f59e0b" />
        {/* Panel 3 — Expansion (impulsion HH/HL emerald) */}
        <path d="M210,80 L225,60 L235,68 L250,46 L265,52 L280,30 L292,18" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx="225" cy="60" r="2.5" fill="#10b981" />
        <circle cx="250" cy="46" r="2.5" fill="#10b981" />
        <circle cx="280" cy="30" r="2.5" fill="#10b981" />
        <circle cx="292" cy="18" r="3" fill="#10b981" />
      </svg>

      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
        <p className="text-[13px] font-bold text-emerald-400">1 · Accumulation</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">Range latéral, smart money construit ses positions. Pas de trade directionnel.</p>
      </div>
      <div className="rounded-lg border border-amber-400/40 bg-amber-400/8 p-3">
        <p className="text-[13px] font-bold text-amber-400">2 · Manipulation</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">Sweep des stops retail, faux breakout. Piège tendu pour collecter la liquidité.</p>
      </div>
      <div className="rounded-lg border-2 border-emerald-500 bg-emerald-500/8 p-3">
        <p className="text-[13px] font-bold text-emerald-400">3 · Expansion ✓ Trader ici</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">Tendance directionnelle nette HH/HL ou LL/LH. <span className="font-bold text-emerald-400">Seule phase</span> où prendre les setups SMC.</p>
      </div>
      <p className="text-[13px] text-zinc-400 italic text-center pt-2 border-t border-zinc-800 leading-snug">
        L&apos;expansion (après manipulation) = seule phase pour entrer dans le sens directionnel.
      </p>
    </div>
    </div>
  );
}

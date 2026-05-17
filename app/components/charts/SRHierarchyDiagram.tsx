export default function SRHierarchyDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 400"
      className={`w-full h-auto ${className}`}
    >
      <text x="450" y="25" fill="#d4d4d8" fontSize="14" fontWeight="600" textAnchor="middle">
        Hiérarchie d&apos;un niveau selon le timeframe
      </text>

      {/* Séparateurs verticaux */}
      <line x1="300" y1="50" x2="300" y2="380" stroke="#3f3f46" strokeWidth="1" />
      <line x1="605" y1="50" x2="605" y2="380" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══════ PANNEAU 1 — DAILY ═══════ */}
      <text x="145" y="70" fill="#d4d4d8" fontSize="14" fontWeight="600" textAnchor="middle">Daily</text>

      <line x1="20" y1="200" x2="270" y2="200" stroke="#10b981" strokeWidth="3" strokeDasharray="5 3" />

      <path d="M20,300 L60,200 L100,280 L140,200 L180,290 L220,200 L270,320" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      <circle cx="60" cy="200" r="6" fill="#10b981" />
      <circle cx="140" cy="200" r="6" fill="#10b981" />
      <circle cx="220" cy="200" r="6" fill="#10b981" />

      <rect x="40" y="345" width="210" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="145" y="360" fill="#10b981" fontSize="11" fontWeight="700" textAnchor="middle">★★★ Niveau majeur</text>

      <text x="145" y="385" fill="#d4d4d8" fontSize="9" textAnchor="middle">3 touches franches</text>

      {/* Halo label prix Panel 1 */}
      <rect x="216" y="184" width="60" height="14" rx="3" fill="#09090b" />
      <text x="270" y="195" fill="#10b981" fontSize="10" textAnchor="end">4 600$</text>

      {/* ═══════ PANNEAU 2 — H4 ═══════ */}
      <text x="450" y="70" fill="#d4d4d8" fontSize="14" fontWeight="600" textAnchor="middle">H4</text>

      <line x1="325" y1="200" x2="575" y2="200" stroke="#10b981" strokeWidth="2" strokeDasharray="5 3" />

      <path d="M325,290 L355,200 L380,260 L410,200 L435,270 L465,200 L490,250 L520,200 L550,280 L575,220" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      <circle cx="355" cy="200" r="5" fill="#10b981" />
      <circle cx="410" cy="200" r="5" fill="#10b981" />
      <circle cx="465" cy="200" r="5" fill="#10b981" />
      <circle cx="520" cy="200" r="5" fill="#10b981" />

      <rect x="345" y="345" width="210" height="22" rx="11" fill="#10b98115" stroke="#10b98180" strokeWidth="1" />
      <text x="450" y="360" fill="#10b981" fontSize="11" fontWeight="700" textAnchor="middle">★★ Niveau secondaire</text>

      <text x="450" y="385" fill="#d4d4d8" fontSize="9" textAnchor="middle">5 touches moyennes</text>

      {/* Halo label prix Panel 2 */}
      <rect x="521" y="184" width="60" height="14" rx="3" fill="#09090b" />
      <text x="575" y="195" fill="#10b981" fontSize="10" textAnchor="end">4 600$</text>

      {/* ═══════ PANNEAU 3 — M15 ═══════ */}
      <text x="755" y="70" fill="#d4d4d8" fontSize="14" fontWeight="600" textAnchor="middle">M15</text>

      <line x1="630" y1="200" x2="880" y2="200" stroke="#10b981" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />

      <path d="M630,240 L650,200 L670,230 L690,200 L710,180 L730,210 L750,200 L770,185 L790,215 L810,200 L830,205 L850,200 L880,210" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      <circle cx="650" cy="200" r="3" fill="#10b981" />
      <circle cx="690" cy="200" r="3" fill="#10b981" />
      <circle cx="750" cy="200" r="3" fill="#10b981" />
      <circle cx="810" cy="200" r="3" fill="#10b981" />
      <circle cx="850" cy="200" r="3" fill="#10b981" />

      <rect x="650" y="345" width="210" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
      <text x="755" y="360" fill="#f59e0b" fontSize="11" fontWeight="700" textAnchor="middle">★ Niveau marginal</text>

      <text x="755" y="385" fill="#d4d4d8" fontSize="9" textAnchor="middle">8 touches faibles, perforations fréquentes</text>

      {/* Halo label prix Panel 3 */}
      <rect x="826" y="184" width="60" height="14" rx="3" fill="#09090b" />
      <text x="880" y="195" fill="#a1a1aa" fontSize="10" textAnchor="end">4 600$</text>
    </svg>
  );
}

export default function HSNecklineSlopeDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 400"
      className={`w-full h-auto ${className}`}
    >
      <text x="450" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        Inclinaison de la neckline = ajustement du TP
      </text>

      <line x1="305" y1="40" x2="305" y2="370" stroke="#3f3f46" strokeWidth="1" />
      <line x1="605" y1="40" x2="605" y2="370" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ PANEL 1 — Neckline plate ═══ */}
      <rect x="20" y="50" width="270" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="155" y="65" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">Neckline plate</text>

      {/* H&S avec neckline horizontale */}
      <line x1="30" y1="220" x2="280" y2="220" stroke="#a1a1aa" strokeWidth="1.2" strokeDasharray="4 3" />
      <path d="M30,290 L60,220 L90,140 L130,220 L165,90 L200,220 L235,150 L270,290 L290,310" stroke="#71717a" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <circle cx="90" cy="140" r="3" fill="#ef4444" />
      <circle cx="165" cy="90" r="4" fill="#ef4444" />
      <circle cx="235" cy="150" r="3" fill="#ef4444" />

      {/* Projection TP standard */}
      <line x1="270" y1="220" x2="270" y2="320" stroke="#10b981" strokeWidth="1" strokeDasharray="3 2" />
      <line x1="20" y1="320" x2="290" y2="320" stroke="#10b981" strokeWidth="0.8" strokeDasharray="3 2" />
      <rect x="222" y="327" width="62" height="11" rx="2" fill="#09090b" />
      <text x="282" y="335" fill="#10b981" fontSize="8" textAnchor="end">TP standard</text>

      <text x="155" y="358" fill="#a1a1aa" fontSize="8" textAnchor="middle">Projection measured move pleine</text>

      {/* ═══ PANEL 2 — Neckline ascendante ═══ */}
      <rect x="320" y="50" width="270" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
      <text x="455" y="65" fill="#f59e0b" fontSize="10" fontWeight="600" textAnchor="middle">Neckline ascendante</text>

      {/* H&S avec neckline qui monte */}
      <line x1="330" y1="230" x2="580" y2="195" stroke="#a1a1aa" strokeWidth="1.2" strokeDasharray="4 3" />
      <path d="M330,290 L360,230 L390,140 L430,225 L465,90 L500,215 L535,150 L570,200 L580,195" stroke="#71717a" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <circle cx="390" cy="140" r="3" fill="#ef4444" />
      <circle cx="465" cy="90" r="4" fill="#ef4444" />
      <circle cx="535" cy="150" r="3" fill="#ef4444" />

      {/* Projection TP rallongée */}
      <line x1="580" y1="195" x2="580" y2="340" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" />
      <line x1="320" y1="340" x2="590" y2="340" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="3 2" />
      <rect x="525" y="325" width="62" height="11" rx="2" fill="#09090b" />
      <text x="585" y="333" fill="#f59e0b" fontSize="8" textAnchor="end">TP rallongé</text>

      <text x="455" y="358" fill="#a1a1aa" fontSize="8" textAnchor="middle">Projection prolongée vers le bas</text>

      {/* ═══ PANEL 3 — Neckline descendante ═══ */}
      <rect x="620" y="50" width="270" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
      <text x="755" y="65" fill="#f59e0b" fontSize="10" fontWeight="600" textAnchor="middle">Neckline descendante</text>

      {/* H&S avec neckline qui descend */}
      <line x1="630" y1="200" x2="880" y2="240" stroke="#a1a1aa" strokeWidth="1.2" strokeDasharray="4 3" />
      <path d="M630,290 L660,200 L690,140 L730,210 L765,90 L800,225 L835,150 L870,235 L880,240" stroke="#71717a" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <circle cx="690" cy="140" r="3" fill="#ef4444" />
      <circle cx="765" cy="90" r="4" fill="#ef4444" />
      <circle cx="835" cy="150" r="3" fill="#ef4444" />

      {/* Projection TP raccourcie */}
      <line x1="880" y1="240" x2="880" y2="295" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" />
      <line x1="620" y1="295" x2="890" y2="295" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="3 2" />
      <rect x="823" y="302" width="64" height="11" rx="2" fill="#09090b" />
      <text x="885" y="310" fill="#f59e0b" fontSize="8" textAnchor="end">TP raccourci</text>

      <text x="755" y="358" fill="#a1a1aa" fontSize="8" textAnchor="middle">Projection réduite vers le bas</text>

      <text x="450" y="390" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        XAU/USD H&amp;S ~4 620$ - 4 660$ — l&apos;inclinaison de la neckline ajuste le TP
      </text>
    </svg>
  );
}

export default function MitigationZoneEntryDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 400"
      className={`w-full h-auto ${className}`}
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        Trader la zone de mitigation après CHoCH
      </text>

      <rect x="560" y="40" width="220" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="670" y="55" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">
        Setup mitigation après CHoCH
      </text>

      {/* Niveau ex-HL → zone mitigation */}
      <line x1="50" y1="150" x2="780" y2="150" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="5 3" />
      <rect x="52" y="134" width="210" height="12" rx="2" fill="#09090b" />
      <text x="55" y="143" fill="#ef4444" fontSize="9" fontWeight="600">Ex-HL → Zone mitigation — 1.1720</text>

      {/* Structure baissière initiale post-CHoCH (LL/LH descendants) */}
      <path d="M50,80 L100,120 L150,100 L200,160 L250,140 L300,200 L350,180 L400,250" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="100" cy="120" r="3" fill="#ef4444" />
      <rect x="91" y="104" width="18" height="11" rx="2" fill="#09090b" />
      <text x="100" y="112" fill="#ef4444" fontSize="8" textAnchor="middle">LH</text>
      <circle cx="200" cy="160" r="3" fill="#ef4444" />
      <rect x="203" y="170" width="18" height="11" rx="2" fill="#09090b" />
      <text x="205" y="178" fill="#ef4444" fontSize="8">LL</text>
      <circle cx="250" cy="140" r="3" fill="#ef4444" />
      <circle cx="300" cy="200" r="3" fill="#ef4444" />

      {/* Path qui remonte retester le niveau ex-HL à 1.1720 */}
      <path d="M400,250 L440,210 L480,180 L520,160 L540,153" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" />

      {/* Pin bar de rejet au contact */}
      <line x1="555" y1="135" x2="555" y2="170" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" />
      <rect x="548" y="160" width="14" height="12" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" rx="1" />

      {/* Halo rouge à l'entrée */}
      <circle cx="555" cy="172" r="11" fill="#ef4444" opacity="0.3" />
      <circle cx="555" cy="172" r="6" fill="#ef4444" />

      {/* Pastille entrée short */}
      <line x1="566" y1="175" x2="640" y2="200" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="2 2" />
      <rect x="640" y="190" width="140" height="20" rx="4" fill="#ef444420" stroke="#ef4444" strokeWidth="0.8" />
      <text x="710" y="204" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">Entrée short — 1.1718</text>

      {/* Continuation baissière */}
      <line x1="590" y1="190" x2="590" y2="240" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="583" y="195" width="14" height="40" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      <line x1="625" y1="225" x2="625" y2="290" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="618" y="230" width="14" height="55" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      <line x1="660" y1="270" x2="660" y2="335" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="653" y="275" width="14" height="55" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      {/* Pastille pin bar de rejet */}
      <line x1="555" y1="125" x2="500" y2="95" stroke="#a1a1aa" strokeWidth="0.8" strokeDasharray="2 2" />
      <rect x="370" y="85" width="130" height="20" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="0.8" />
      <text x="435" y="99" fill="#d4d4d8" fontSize="9" textAnchor="middle">Pin bar de rejet</text>

      <text x="400" y="385" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        Après CHoCH, l&apos;ex-HL devient résistance. Entrée sur retest + signal de rejet.
      </text>
    </svg>
  );
}

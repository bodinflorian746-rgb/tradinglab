export default function FlipFailureDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 400"
      className={`w-full h-auto ${className}`}
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        Flip qui échoue — le niveau ne tient pas
      </text>

      <rect x="560" y="40" width="220" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="670" y="55" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">✗ Flip invalidé</text>

      {/* Niveau résistance — trait continu d'un bout à l'autre */}
      <line x1="20" y1="200" x2="780" y2="200" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" />

      {/* Path prix CONTINU : 2 rebonds dessous → cassure → mini-sommet → retour rapide → continuation baissière */}
      <path
        d="M30,300 L70,250 L100,210 L130,260 L170,215 L210,265 L250,220 L290,205 L310,170 L330,160 L350,140 L380,155 L420,200 L460,240 L500,280 L550,320 L620,350 L680,370"
        stroke="#71717a"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Bougie verte de cassure à x=310 */}
      <line x1="310" y1="155" x2="310" y2="220" stroke="#059669" strokeWidth="2" />
      <rect x="302" y="160" width="16" height="55" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="1.5" />

      {/* Bougie rouge qui recasse le niveau à x=430 */}
      <line x1="430" y1="200" x2="430" y2="255" stroke="#b91c1c" strokeWidth="2" />
      <rect x="422" y="210" width="16" height="40" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" rx="1.5" />

      {/* Mini-sommet annotation — déplacé y=128 → y=110 (séparation verticale 18px de "Cassure 1.1875") */}
      <rect x="283" y="99" width="134" height="14" fill="#09090b" rx="3" />
      <text x="350" y="110" fill="#71717a" fontSize="8" textAnchor="middle">Mini-sommet 1.1880</text>
      <line x1="350" y1="114" x2="350" y2="138" stroke="#71717a" strokeWidth="0.8" strokeDasharray="2 2" />

      {/* Annotation cassure — pastille remplacée par halo uniforme #09090b */}
      <rect x="242" y="116" width="106" height="14" fill="#09090b" rx="3" />
      <text x="295" y="127" fill="#d4d4d8" fontSize="9" textAnchor="middle">Cassure 1.1875</text>
      <line x1="295" y1="133" x2="310" y2="158" stroke="#3f3f46" strokeWidth="0.8" strokeDasharray="2 2" />

      {/* Annotation retour rapide — halo opaque inséré sous la pastille translucide */}
      <rect x="448" y="266" width="134" height="14" fill="#09090b" rx="3" />
      <rect x="450" y="265" width="130" height="18" rx="4" fill="#ef444420" stroke="#ef4444" strokeWidth="0.8" />
      <text x="515" y="277" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">Retour sous niveau</text>
      <line x1="450" y1="270" x2="432" y2="225" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="2 2" />

      {/* Continuation baissière — 3 bougies rouges */}
      <line x1="540" y1="305" x2="540" y2="345" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="533" y="312" width="14" height="30" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      <line x1="610" y1="335" x2="610" y2="370" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="603" y="342" width="14" height="28" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      <line x1="670" y1="355" x2="670" y2="385" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="663" y="360" width="14" height="25" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      {/* Halo + label "Résistance 1.1850" déplacé tout à la fin pour rester au-dessus du path et des bougies */}
      <rect x="21" y="183" width="127" height="14" fill="#09090b" rx="3" />
      <text x="25" y="194" fill="#ef4444" fontSize="9" fontWeight="600">Résistance 1.1850</text>

      <text x="400" y="395" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        Le retour rapide sous le niveau invalide le flip — sortie immédiate
      </text>
    </svg>
  );
}

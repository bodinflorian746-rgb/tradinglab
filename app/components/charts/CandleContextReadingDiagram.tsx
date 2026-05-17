export default function CandleContextReadingDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 400"
      className={`w-full h-auto ${className}`}
    >
      <text x="450" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        Une même bougie verte = 3 lectures différentes
      </text>

      <line x1="305" y1="40" x2="305" y2="370" stroke="#3f3f46" strokeWidth="1" />
      <line x1="605" y1="40" x2="605" y2="370" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ PANEL 1 — Sommet d'impulsion ═══ */}
      <rect x="20" y="50" width="270" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
      <text x="155" y="65" fill="#f59e0b" fontSize="10" fontWeight="600" textAnchor="middle">Retournement potentiel</text>

      {/* 5 bougies vertes ascendantes */}
      <line x1="40" y1="270" x2="40" y2="320" stroke="#059669" strokeWidth="1.5" />
      <rect x="33" y="275" width="14" height="40" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />
      <line x1="75" y1="240" x2="75" y2="290" stroke="#059669" strokeWidth="1.5" />
      <rect x="68" y="245" width="14" height="40" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />
      <line x1="110" y1="200" x2="110" y2="250" stroke="#059669" strokeWidth="1.5" />
      <rect x="103" y="205" width="14" height="40" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />
      <line x1="145" y1="160" x2="145" y2="210" stroke="#059669" strokeWidth="1.5" />
      <rect x="138" y="165" width="14" height="40" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />
      <line x1="180" y1="130" x2="180" y2="180" stroke="#059669" strokeWidth="1.5" />
      <rect x="173" y="135" width="14" height="40" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      {/* Bougie focus (encadrée) */}
      <text x="230" y="87" fill="#f59e0b" fontSize="8" fontWeight="600" textAnchor="middle">Même bougie</text>
      <rect x="210" y="95" width="40" height="60" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" rx="2" />
      <line x1="225" y1="100" x2="225" y2="150" stroke="#059669" strokeWidth="1.5" />
      <rect x="218" y="105" width="14" height="40" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      <text x="155" y="345" fill="#a1a1aa" fontSize="8" textAnchor="middle">Bougie verte au sommet =</text>
      <text x="155" y="358" fill="#a1a1aa" fontSize="8" textAnchor="middle">essoufflement</text>

      {/* ═══ PANEL 2 — Creux de chute ═══ */}
      <rect x="320" y="50" width="270" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="455" y="65" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">Continuation baissière probable</text>

      {/* 5 bougies rouges descendantes */}
      <line x1="335" y1="100" x2="335" y2="150" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="328" y="105" width="14" height="40" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />
      <line x1="370" y1="140" x2="370" y2="190" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="363" y="145" width="14" height="40" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />
      <line x1="405" y1="180" x2="405" y2="230" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="398" y="185" width="14" height="40" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />
      <line x1="440" y1="220" x2="440" y2="270" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="433" y="225" width="14" height="40" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />
      <line x1="475" y1="260" x2="475" y2="310" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="468" y="265" width="14" height="40" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      {/* Bougie focus (verte) */}
      <text x="525" y="237" fill="#f59e0b" fontSize="8" fontWeight="600" textAnchor="middle">Même bougie</text>
      <rect x="505" y="245" width="40" height="60" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" rx="2" />
      <line x1="520" y1="250" x2="520" y2="300" stroke="#059669" strokeWidth="1.5" />
      <rect x="513" y="255" width="14" height="40" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      <text x="455" y="345" fill="#a1a1aa" fontSize="8" textAnchor="middle">Bougie verte isolée en chute =</text>
      <text x="455" y="358" fill="#a1a1aa" fontSize="8" textAnchor="middle">bruit</text>

      {/* ═══ PANEL 3 — Range latéral ═══ */}
      <rect x="620" y="50" width="270" height="22" rx="11" fill="#27272a" stroke="#71717a" strokeWidth="1" />
      <text x="755" y="65" fill="#a1a1aa" fontSize="10" fontWeight="600" textAnchor="middle">Bruit — pas d&apos;info</text>

      {/* 4 bougies alternées */}
      <line x1="630" y1="180" x2="630" y2="240" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="623" y="190" width="14" height="40" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />
      <line x1="665" y1="170" x2="665" y2="220" stroke="#059669" strokeWidth="1.5" />
      <rect x="658" y="175" width="14" height="40" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />
      <line x1="700" y1="190" x2="700" y2="250" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="693" y="200" width="14" height="40" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />
      <line x1="735" y1="175" x2="735" y2="225" stroke="#059669" strokeWidth="1.5" />
      <rect x="728" y="180" width="14" height="40" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      {/* Bougie focus */}
      <text x="795" y="162" fill="#f59e0b" fontSize="8" fontWeight="600" textAnchor="middle">Même bougie</text>
      <rect x="775" y="170" width="40" height="60" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" rx="2" />
      <line x1="790" y1="175" x2="790" y2="225" stroke="#059669" strokeWidth="1.5" />
      <rect x="783" y="180" width="14" height="40" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      <text x="755" y="345" fill="#a1a1aa" fontSize="8" textAnchor="middle">Bougie verte dans le range =</text>
      <text x="755" y="358" fill="#a1a1aa" fontSize="8" textAnchor="middle">pas significative</text>

      <text x="450" y="390" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        Le contexte avant/après la bougie change tout
      </text>
    </svg>
  );
}

export default function DTBValidationGridDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 500"
      className={`w-full h-auto ${className}`}
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        Reconnaître un Double Top valide vs un piège
      </text>

      <line x1="400" y1="40" x2="400" y2="480" stroke="#3f3f46" strokeWidth="1" />
      <line x1="20" y1="260" x2="780" y2="260" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ Cellule 1 — VALIDE (haut gauche) ═══ */}
      <line x1="40" y1="100" x2="360" y2="100" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
      <line x1="40" y1="170" x2="360" y2="170" stroke="#a1a1aa" strokeWidth="0.8" strokeDasharray="4 3" />
      <path d="M50,230 L100,170 L150,100 L200,170 L250,100 L300,170 L350,230" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <circle cx="150" cy="100" r="4" fill="#ef4444" />
      <circle cx="250" cy="100" r="4" fill="#ef4444" />
      <line x1="320" y1="170" x2="320" y2="220" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="314" y="190" width="12" height="30" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />
      <rect x="80" y="50" width="240" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="200" y="65" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">✓ Valide — écart 0,2%, cassure nette</text>

      {/* ═══ Cellule 2 — INVALIDE écart (haut droite) ═══ */}
      <line x1="440" y1="100" x2="760" y2="100" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
      <line x1="440" y1="170" x2="760" y2="170" stroke="#a1a1aa" strokeWidth="0.8" strokeDasharray="4 3" />
      <path d="M450,230 L500,170 L550,100 L600,170 L650,135 L700,170 L750,230" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <circle cx="550" cy="100" r="4" fill="#ef4444" />
      <circle cx="650" cy="135" r="4" fill="#ef4444" />
      <line x1="555" y1="100" x2="645" y2="135" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="2 2" />
      <rect x="480" y="50" width="240" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="600" y="65" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">✗ Écart trop grand — 0,5%</text>

      {/* ═══ Cellule 3 — INVALIDE pas de tendance (bas gauche) ═══ */}
      <line x1="40" y1="320" x2="360" y2="320" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
      <line x1="40" y1="390" x2="360" y2="390" stroke="#a1a1aa" strokeWidth="0.8" strokeDasharray="4 3" />
      {/* Range latéral sans tendance préalable */}
      <path d="M50,360 L80,390 L110,330 L140,390 L170,320 L220,390 L270,320 L320,390 L350,360" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <circle cx="170" cy="320" r="4" fill="#ef4444" />
      <circle cx="270" cy="320" r="4" fill="#ef4444" />
      <rect x="80" y="280" width="240" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="200" y="295" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">✗ Pas de tendance préalable</text>
      <text x="200" y="460" fill="#71717a" fontSize="8" textAnchor="middle">Range latéral — pas un retournement</text>

      {/* ═══ Cellule 4 — INVALIDE mèche au lieu de clôture (bas droite) ═══ */}
      <line x1="440" y1="320" x2="760" y2="320" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
      <line x1="440" y1="390" x2="760" y2="390" stroke="#a1a1aa" strokeWidth="0.8" strokeDasharray="4 3" />
      <path d="M450,450 L500,390 L550,320 L600,390 L650,320 L700,395" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <circle cx="550" cy="320" r="4" fill="#ef4444" />
      <circle cx="650" cy="320" r="4" fill="#ef4444" />
      {/* Bougie avec mèche qui dépasse mais corps reste au-dessus de la neckline */}
      <line x1="720" y1="380" x2="720" y2="420" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="714" y="380" width="12" height="10" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />
      <line x1="730" y1="410" x2="755" y2="415" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="2 2" />
      <rect x="685" y="410" width="82" height="11" rx="2" fill="#09090b" />
      <text x="765" y="418" fill="#ef4444" fontSize="8" textAnchor="end">mèche seulement</text>
      <rect x="480" y="280" width="240" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="600" y="295" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">✗ Mèche, pas clôture</text>
    </svg>
  );
}

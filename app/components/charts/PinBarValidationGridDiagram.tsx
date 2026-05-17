export default function PinBarValidationGridDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 500"
      className={`w-full h-auto ${className}`}
    >
      <text x="400" y="30" fill="#d4d4d8" fontSize="14" fontWeight="600" textAnchor="middle">
        Reconnaître une pin bar valide en 5 secondes
      </text>

      {/* Séparateurs grille */}
      <line x1="410" y1="70" x2="410" y2="460" stroke="#3f3f46" strokeWidth="1" />
      <line x1="30" y1="290" x2="770" y2="290" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══════ CELLULE 1 — VALIDE (haut gauche) ═══════ */}
      <rect x="60" y="70" width="300" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="210" y="85" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">
        ✓ Valide — Pin bar de rejet net
      </text>

      {/* Pin bar : mèche basse longue 140px + petit corps 30px */}
      <line x1="210" y1="110" x2="210" y2="280" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <rect x="195" y="110" width="30" height="30" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="2" />

      <text x="290" y="200" fill="#d4d4d8" fontSize="9">Mèche : 140 px</text>
      <text x="290" y="220" fill="#d4d4d8" fontSize="9">Corps : 30 px</text>
      <text x="290" y="240" fill="#10b981" fontSize="10" fontWeight="600">Ratio : 4,7:1</text>

      {/* ═══════ CELLULE 2 — Mèche = Corps (haut droite) ═══════ */}
      <rect x="450" y="70" width="300" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="600" y="85" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">
        ✗ Mèche = Corps
      </text>

      <line x1="600" y1="160" x2="600" y2="280" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <rect x="585" y="160" width="30" height="60" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="2" />

      <text x="680" y="200" fill="#d4d4d8" fontSize="9">Mèche : 60 px</text>
      <text x="680" y="220" fill="#d4d4d8" fontSize="9">Corps : 60 px</text>
      <text x="680" y="240" fill="#ef4444" fontSize="10" fontWeight="600">Ratio : 1:1</text>

      {/* ═══════ CELLULE 3 — Corps écrase la mèche (bas gauche) ═══════ */}
      <rect x="60" y="310" width="300" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="210" y="325" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">
        ✗ Corps écrase la mèche
      </text>

      <line x1="210" y1="320" x2="210" y2="470" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <rect x="195" y="320" width="30" height="120" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="2" />

      <text x="290" y="400" fill="#d4d4d8" fontSize="9">Mèche : 30 px</text>
      <text x="290" y="420" fill="#d4d4d8" fontSize="9">Corps : 120 px</text>
      <text x="290" y="440" fill="#ef4444" fontSize="10" fontWeight="600">Ratio : 1:4</text>

      {/* ═══════ CELLULE 4 — Mèche négligeable (bas droite) ═══════ */}
      <rect x="450" y="310" width="300" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="600" y="325" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">
        ✗ Mèche négligeable
      </text>

      <line x1="600" y1="400" x2="600" y2="470" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <rect x="585" y="400" width="30" height="60" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="2" />

      <text x="680" y="400" fill="#d4d4d8" fontSize="9">Mèche : 10 px</text>
      <text x="680" y="420" fill="#d4d4d8" fontSize="9">Corps : 60 px</text>
      <text x="680" y="440" fill="#ef4444" fontSize="10" fontWeight="600">Ratio : 0,2:1</text>

      <text x="400" y="490" fill="#a1a1aa" fontSize="10" textAnchor="middle">
        Ratio mèche / corps ≥ 2:1 = pin bar valide
      </text>
    </svg>
  );
}

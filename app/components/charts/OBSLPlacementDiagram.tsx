export default function OBSLPlacementDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 400"
      className={`w-full h-auto ${className}`}
    >
      {/* Titre avec halo */}
      <rect x="290" y="5" width="320" height="18" rx="3" fill="#09090b" />
      <text x="450" y="18" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        3 placements de SL — un seul correct
      </text>

      <line x1="300" y1="40" x2="300" y2="370" stroke="#3f3f46" strokeWidth="1" />
      <line x1="605" y1="40" x2="605" y2="370" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ PANEL 1 — SL DANS LA ZONE (KO) ═══ */}
      <rect x="20" y="50" width="270" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="155" y="65" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">✗ SL dans la zone</text>

      {/* Order Block emerald translucide */}
      <rect x="30" y="200" width="230" height="40" fill="#10b98120" stroke="#10b981" strokeWidth="1" strokeDasharray="3 2" />

      {/* Niveau SL DANS l'OB */}
      <line x1="20" y1="220" x2="290" y2="220" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" />

      {/* Label SL avec halo */}
      <rect x="18" y="214" width="64" height="14" rx="3" fill="#09090b" />
      <text x="22" y="225" fill="#ef4444" fontSize="9" fontWeight="600">SL 1.1770</text>

      {/* Label OB avec halo */}
      <rect x="75" y="186" width="140" height="14" rx="3" fill="#09090b" />
      <text x="145" y="197" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">Order Block 1.1745-1.1780</text>

      {/* Path prix : descente → retraverse OB → mèche basse TRAVERSE le SL → rebond */}
      <path
        d="M40,120 L80,180 L120,210 L150,230 L180,200 L220,170"
        stroke="#71717a"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Bougie au point critique avec mèche qui traverse le SL */}
      <line x1="150" y1="195" x2="150" y2="245" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="143" y="205" width="14" height="20" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      {/* Pastille en bas avec halo */}
      <rect x="50" y="320" width="210" height="20" rx="4" fill="#09090b" />
      <rect x="50" y="320" width="210" height="20" rx="4" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="155" y="334" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">Wicks déclenchent le SL</text>
      <text x="155" y="358" fill="#a1a1aa" fontSize="8" textAnchor="middle">Stop hunt classique</text>

      {/* ═══ PANEL 2 — SL À LA LIMITE (Borderline) ═══ */}
      <rect x="320" y="50" width="270" height="22" rx="11" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
      <text x="455" y="65" fill="#f59e0b" fontSize="10" fontWeight="600" textAnchor="middle">⚠ SL à la limite</text>

      <rect x="335" y="200" width="230" height="40" fill="#10b98120" stroke="#10b981" strokeWidth="1" strokeDasharray="3 2" />

      {/* SL sur la limite basse exacte de l'OB */}
      <line x1="320" y1="240" x2="590" y2="240" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 3" />

      {/* Label SL avec halo amber */}
      <rect x="323" y="234" width="64" height="14" rx="3" fill="#09090b" />
      <text x="327" y="245" fill="#f59e0b" fontSize="9" fontWeight="600">SL 1.1745</text>

      {/* Label OB avec halo */}
      <rect x="380" y="186" width="140" height="14" rx="3" fill="#09090b" />
      <text x="450" y="197" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">Order Block 1.1745-1.1780</text>

      {/* Path prix : descente → touche limite basse → SL frôlé → rebond */}
      <path
        d="M345,120 L385,180 L425,210 L455,238 L485,220 L525,180"
        stroke="#71717a"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Bougie au contact de la limite basse */}
      <line x1="455" y1="218" x2="455" y2="245" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="448" y="225" width="14" height="15" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      <rect x="350" y="320" width="210" height="20" rx="4" fill="#09090b" />
      <rect x="350" y="320" width="210" height="20" rx="4" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="1" />
      <text x="455" y="334" fill="#f59e0b" fontSize="9" fontWeight="600" textAnchor="middle">Tolérance 0 pour wicks</text>
      <text x="455" y="358" fill="#a1a1aa" fontSize="8" textAnchor="middle">Risque de stop hunt</text>

      {/* ═══ PANEL 3 — SL AVEC MARGE (OK) ═══ */}
      <rect x="625" y="50" width="270" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="760" y="65" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">✓ SL avec marge</text>

      <rect x="640" y="200" width="230" height="40" fill="#10b98120" stroke="#10b981" strokeWidth="1" strokeDasharray="3 2" />

      {/* SL au-dessous de l'OB avec marge */}
      <line x1="625" y1="260" x2="895" y2="260" stroke="#10b981" strokeWidth="1.5" strokeDasharray="5 3" />

      {/* Label SL avec halo emerald */}
      <rect x="628" y="254" width="150" height="14" rx="3" fill="#09090b" />
      <text x="632" y="265" fill="#10b981" fontSize="9" fontWeight="600">SL 1.1738 (marge 7 pips)</text>

      {/* Label OB avec halo */}
      <rect x="685" y="186" width="140" height="14" rx="3" fill="#09090b" />
      <text x="755" y="197" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">Order Block 1.1745-1.1780</text>

      {/* Path prix : descente → rebondit sur limite basse SANS atteindre SL */}
      <path
        d="M650,120 L690,180 L730,210 L760,235 L790,215 L830,170"
        stroke="#71717a"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Bougie qui touche la limite basse mais reste au-dessus du SL */}
      <line x1="760" y1="215" x2="760" y2="245" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="753" y="222" width="14" height="18" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      <rect x="655" y="320" width="210" height="20" rx="4" fill="#09090b" />
      <rect x="655" y="320" width="210" height="20" rx="4" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="760" y="334" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">Absorbe les wicks secondaires</text>
      <text x="760" y="358" fill="#a1a1aa" fontSize="8" textAnchor="middle">Placement opérationnel</text>

      <text x="450" y="390" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        Marge de 5-10 pips au-delà de la mèche extrême absorbe les wicks de retest
      </text>
    </svg>
  );
}

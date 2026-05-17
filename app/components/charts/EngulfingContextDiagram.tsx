export default function EngulfingContextDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 400"
      className={`w-full h-auto ${className}`}
    >
      <text x="400" y="15" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        Engulfing — la confluence change tout
      </text>

      <line x1="400" y1="30" x2="400" y2="370" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ PANEL GAUCHE — Setup VALIDE avec confluence Fibo ═══ */}
      <rect x="40" y="40" width="320" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="200" y="55" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">
        ✓ Setup VALIDE — Confluence Fibo + Engulfing
      </text>

      {/* Niveau Fibo 0.618 emerald épais */}
      <line x1="20" y1="200" x2="380" y2="200" stroke="#10b981" strokeWidth="2" strokeDasharray="5 3" />

      {/* Impulsion haussière initiale */}
      <path d="M20,320 L80,180" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" />

      {/* Pullback retraçant jusqu'au niveau Fibo */}
      <path d="M80,180 L180,200" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" />

      {/* Paire d'engulfing au contact du Fibo */}
      {/* Bougie A — rouge */}
      <line x1="200" y1="170" x2="200" y2="220" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="190" y="180" width="20" height="30" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" rx="2" />
      {/* Bougie B — verte qui englobe */}
      <line x1="230" y1="160" x2="230" y2="225" stroke="#059669" strokeWidth="2" />
      <rect x="218" y="170" width="24" height="45" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="2" />

      {/* Pastille "Engulfing AU Fibo 0.618" */}
      <rect x="160" y="135" width="110" height="16" rx="4" fill="#27272a" stroke="#10b981" strokeWidth="0.8" />
      <text x="215" y="146" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">Engulfing AU Fibo 0.618</text>
      <line x1="215" y1="151" x2="215" y2="158" stroke="#10b981" strokeWidth="0.8" />

      {/* Rebond ascendant */}
      <path d="M245,170 L270,120 L310,90 L350,80" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      {/* ═══ PANEL DROIT — Setup INVALIDE hors niveau ═══ */}
      <rect x="440" y="40" width="320" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="600" y="55" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">
        ✗ Setup INVALIDE — Hors niveau structurel
      </text>

      {/* Aucun niveau visible — impulsion continue */}
      <path d="M440,320 L540,240 L600,180 L660,120 L780,80" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      {/* Paire d'engulfing identique noyée dans l'impulsion */}
      {/* Bougie A — rouge */}
      <line x1="580" y1="170" x2="580" y2="220" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="570" y="180" width="20" height="30" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" rx="2" />
      {/* Bougie B — verte */}
      <line x1="610" y1="160" x2="610" y2="225" stroke="#059669" strokeWidth="2" />
      <rect x="598" y="170" width="24" height="45" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="2" />

      {/* Pastille "Engulfing isolé en impulsion" */}
      <rect x="540" y="135" width="120" height="16" rx="4" fill="#27272a" stroke="#ef4444" strokeWidth="0.8" />
      <text x="600" y="146" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">Engulfing isolé en impulsion</text>
      <line x1="600" y1="151" x2="600" y2="158" stroke="#ef4444" strokeWidth="0.8" />

      {/* Label "Fibo 0.618" avec halo placé en fin de svg pour rester au-dessus des paths */}
      <rect x="16" y="184" width="78" height="14" fill="#09090b" rx="3" />
      <text x="20" y="195" fill="#10b981" fontSize="10" fontWeight="600">Fibo 0.618</text>

      <text x="400" y="390" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        Un engulfing isolé hors contexte structurel reste un signal hypothétique
      </text>
    </svg>
  );
}

export default function DivergenceWithoutBreakoutDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 400"
      className={`w-full h-auto ${className}`}
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        Divergence parfaite sans cassure = piège
      </text>

      {/* Zone prix */}
      <text x="35" y="80" fill="#a1a1aa" fontSize="9" fontWeight="600">Prix</text>
      {/* Ligne du creux structurel — placée au niveau y=140 (creux entre HH1 et HH2 du path prix) */}
      <line x1="40" y1="140" x2="780" y2="140" stroke="#a1a1aa" strokeWidth="0.8" strokeDasharray="4 3" />

      {/* Path prix HH/HH + continuation haussière (pas de cassure du creux) */}
      <path d="M50,150 L120,80 L180,140 L240,60 L300,140 L340,170 L380,150 L430,120 L490,90 L560,70 L630,50 L720,40" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      <circle cx="120" cy="80" r="4" fill="#ef4444" />
      <rect x="96" y="62" width="48" height="14" rx="3" fill="#09090b" />
      <text x="120" y="73" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">HH1 4 620$</text>
      <circle cx="240" cy="60" r="5" fill="#ef4444" />
      <rect x="216" y="42" width="48" height="14" rx="3" fill="#09090b" />
      <text x="240" y="53" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">HH2 4 640$</text>

      {/* Label "Creux structurel jamais cassé" déplacé APRÈS le path pour rester au-dessus */}
      <rect x="43" y="129" width="200" height="14" rx="3" fill="#09090b" />
      <text x="47" y="139" fill="#a1a1aa" fontSize="9">Creux structurel jamais cassé — 4 570$</text>

      {/* Pastille "PIÈGE classique" déplacée APRÈS le path pour masquer la portion du tracé qui la traverse */}
      <rect x="560" y="40" width="220" height="22" rx="11" fill="#09090b" />
      <rect x="560" y="40" width="220" height="22" rx="11" fill="#ef444433" stroke="#ef4444" strokeWidth="1" />
      <text x="670" y="55" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">PIÈGE classique</text>

      {/* Annotation continuation */}
      <rect x="480" y="105" width="200" height="18" rx="4" fill="#09090b" />
      <rect x="480" y="105" width="200" height="18" rx="4" fill="#ef444433" stroke="#ef4444" strokeWidth="0.8" />
      <text x="580" y="118" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">Continuation haussière</text>

      {/* Séparateur prix/RSI */}
      <line x1="40" y1="240" x2="780" y2="240" stroke="#3f3f46" strokeWidth="1" />

      {/* Zone RSI */}
      <text x="35" y="260" fill="#a1a1aa" fontSize="9" fontWeight="600">RSI</text>
      <line x1="40" y1="270" x2="780" y2="270" stroke="#71717a" strokeWidth="0.5" strokeDasharray="2 2" />
      <line x1="40" y1="360" x2="780" y2="360" stroke="#71717a" strokeWidth="0.5" strokeDasharray="2 2" />
      <text x="45" y="268" fill="#71717a" fontSize="7">70</text>
      <text x="45" y="368" fill="#71717a" fontSize="7">30</text>

      {/* RSI path : LH (75 → 68) */}
      <path d="M50,330 L120,275 L180,320 L240,295 L300,330" stroke="#60a5fa" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
      <circle cx="120" cy="275" r="4" fill="#ef4444" />
      <rect x="98" y="255" width="48" height="14" rx="3" fill="#09090b" />
      <text x="120" y="266" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">LH1 RSI 75</text>
      <circle cx="240" cy="295" r="4" fill="#ef4444" />
      <rect x="218" y="275" width="48" height="14" rx="3" fill="#09090b" />
      <text x="240" y="286" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">LH2 RSI 68</text>
      <line x1="120" y1="275" x2="240" y2="295" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3 3" />

      {/* Divergence visible mais piège */}
      <rect x="350" y="290" width="240" height="20" rx="4" fill="#09090b" />
      <rect x="350" y="290" width="240" height="20" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="0.8" />
      <text x="470" y="304" fill="#a1a1aa" fontSize="9" textAnchor="middle">Divergence parfaite mais inopérante</text>

      <text x="400" y="395" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        Une divergence n&apos;est valide QUE si la structure casse. Ici, le creux à 4 570$ tient → pas de short.
      </text>
    </svg>
  );
}

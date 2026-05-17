export default function FibPullbackChecklistDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 300"
      className={`w-full h-auto ${className}`}
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        Valider un pullback Fibo en 4 critères
      </text>

      <line x1="400" y1="40" x2="400" y2="270" stroke="#3f3f46" strokeWidth="1" />
      <line x1="20" y1="160" x2="780" y2="160" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ Cellule 1 — Impulsion claire ═══ */}
      <circle cx="80" cy="100" r="18" fill="#10b98120" stroke="#10b981" strokeWidth="1.5" />
      <text x="80" y="106" fill="#10b981" fontSize="14" fontWeight="700" textAnchor="middle">✓</text>
      <text x="135" y="85" fill="#d4d4d8" fontSize="11" fontWeight="600">Impulsion claire</text>
      <text x="135" y="103" fill="#a1a1aa" fontSize="9">Mouvement franc, displacement</text>
      <text x="135" y="116" fill="#a1a1aa" fontSize="9">supérieur à la moyenne</text>
      {/* Mini icône path montant */}
      <path d="M300,130 L320,115 L340,95 L360,80 L380,65" stroke="#10b981" strokeWidth="1.5" fill="none" strokeLinejoin="round" />

      {/* ═══ Cellule 2 — Retracement 30-60% ═══ */}
      <circle cx="460" cy="100" r="18" fill="#10b98120" stroke="#10b981" strokeWidth="1.5" />
      <text x="460" y="106" fill="#10b981" fontSize="14" fontWeight="700" textAnchor="middle">✓</text>
      <text x="515" y="85" fill="#d4d4d8" fontSize="11" fontWeight="600">Retracement 30-60%</text>
      <text x="515" y="103" fill="#a1a1aa" fontSize="9">Zone OTE Fibonacci</text>
      <text x="515" y="116" fill="#a1a1aa" fontSize="9">61.8% à 78.6%</text>
      {/* Mini Fibonacci avec OTE */}
      <line x1="700" y1="70" x2="775" y2="70" stroke="#a1a1aa" strokeWidth="0.6" strokeDasharray="2 2" />
      <line x1="700" y1="100" x2="775" y2="100" stroke="#a1a1aa" strokeWidth="0.6" strokeDasharray="2 2" />
      <rect x="700" y="110" width="75" height="20" fill="#60a5fa15" stroke="#60a5fa40" strokeWidth="0.6" />
      <text x="737" y="124" fill="#60a5fa" fontSize="8" textAnchor="middle">OTE</text>
      <line x1="700" y1="135" x2="775" y2="135" stroke="#a1a1aa" strokeWidth="0.6" strokeDasharray="2 2" />

      {/* ═══ Cellule 3 — Signal de rejet ═══ */}
      <circle cx="80" cy="220" r="18" fill="#10b98120" stroke="#10b981" strokeWidth="1.5" />
      <text x="80" y="226" fill="#10b981" fontSize="14" fontWeight="700" textAnchor="middle">✓</text>
      <text x="135" y="205" fill="#d4d4d8" fontSize="11" fontWeight="600">Signal de rejet</text>
      <text x="135" y="223" fill="#a1a1aa" fontSize="9">Pin bar, engulfing,</text>
      <text x="135" y="236" fill="#a1a1aa" fontSize="9">réaction immédiate</text>
      {/* Mini pin bar */}
      <line x1="335" y1="180" x2="335" y2="240" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <rect x="328" y="180" width="14" height="12" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="1" />

      {/* ═══ Cellule 4 — Biais TF supérieur ═══ */}
      <circle cx="460" cy="220" r="18" fill="#10b98120" stroke="#10b981" strokeWidth="1.5" />
      <text x="460" y="226" fill="#10b981" fontSize="14" fontWeight="700" textAnchor="middle">✓</text>
      <text x="515" y="205" fill="#d4d4d8" fontSize="11" fontWeight="600">Biais TF supérieur aligné</text>
      <text x="515" y="223" fill="#a1a1aa" fontSize="9">Daily ou H4 dans le sens</text>
      <text x="515" y="236" fill="#a1a1aa" fontSize="9">de l&apos;impulsion</text>
      {/* Flèche directionnelle */}
      <line x1="720" y1="235" x2="770" y2="195" stroke="#10b981" strokeWidth="2" />
      <path d="M762,194 L770,195 L765,202" stroke="#10b981" strokeWidth="2" fill="none" />

      <rect x="280" y="280" width="240" height="18" rx="4" fill="#10b98120" stroke="#10b981" strokeWidth="0.8" />
      <text x="400" y="293" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">4/4 = setup à privilégier</text>
    </svg>
  );
}

export default function FakeVsRealBreakoutComparisonDiagram({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 400"
      className="hidden sm:block w-full h-auto"
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        Vrai breakout vs Faux breakout
      </text>

      <line x1="400" y1="40" x2="400" y2="370" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ PANEL GAUCHE — VRAI breakout ═══ */}
      <rect x="60" y="50" width="280" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="200" y="65" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">✓ Vrai breakout</text>

      <line x1="50" y1="150" x2="380" y2="150" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" />

      {/* Bougies bullish d'approche */}
      <line x1="100" y1="220" x2="100" y2="280" stroke="#059669" strokeWidth="1.5" />
      <rect x="93" y="225" width="14" height="50" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      <line x1="140" y1="190" x2="140" y2="240" stroke="#059669" strokeWidth="1.5" />
      <rect x="133" y="195" width="14" height="40" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      {/* Grosse bougie de cassure verte qui clôture au-dessus */}
      <line x1="180" y1="100" x2="180" y2="180" stroke="#059669" strokeWidth="2" />
      <rect x="172" y="110" width="16" height="60" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="1.5" />

      {/* Continuation bullish */}
      <line x1="220" y1="80" x2="220" y2="130" stroke="#059669" strokeWidth="1.5" />
      <rect x="213" y="85" width="14" height="40" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      <line x1="260" y1="60" x2="260" y2="110" stroke="#059669" strokeWidth="1.5" />
      <rect x="253" y="65" width="14" height="40" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      <line x1="300" y1="50" x2="300" y2="90" stroke="#059669" strokeWidth="1.5" />
      <rect x="293" y="55" width="14" height="30" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      {/* Halo + label "Résistance 4 650$" déplacés après les bougies pour rester au-dessus */}
      <rect x="53" y="133" width="127" height="14" fill="#09090b" rx="3" />
      <text x="57" y="144" fill="#ef4444" fontSize="9" fontWeight="600">Résistance 4 650$</text>

      <rect x="80" y="310" width="240" height="20" rx="4" fill="#27272a" stroke="#10b981" strokeWidth="0.8" />
      <text x="200" y="324" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="middle">Clôture 4 680$ + follow-through</text>

      {/* ═══ PANEL DROIT — FAUX breakout ═══ */}
      <rect x="460" y="50" width="280" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="600" y="65" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">✗ Faux breakout</text>

      <line x1="450" y1="150" x2="780" y2="150" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" />

      {/* Bougies bullish d'approche */}
      <line x1="500" y1="220" x2="500" y2="280" stroke="#059669" strokeWidth="1.5" />
      <rect x="493" y="225" width="14" height="50" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      <line x1="540" y1="190" x2="540" y2="240" stroke="#059669" strokeWidth="1.5" />
      <rect x="533" y="195" width="14" height="40" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      {/* Bougie fake : mèche dépasse, corps clôture sous */}
      <line x1="580" y1="110" x2="580" y2="200" stroke="#b91c1c" strokeWidth="2" />
      <rect x="572" y="170" width="16" height="20" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" rx="1.5" />

      {/* Labels avec halos */}
      <rect x="583" y="97" width="92" height="14" fill="#09090b" rx="3" />
      <text x="587" y="108" fill="#ef4444" fontSize="8" fontWeight="600">mèche 4 685$</text>
      <rect x="593" y="184" width="106" height="14" fill="#09090b" rx="3" />
      <text x="597" y="195" fill="#ef4444" fontSize="8" fontWeight="600">clôture 4 620$</text>

      {/* Continuation baissière */}
      <line x1="620" y1="210" x2="620" y2="270" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="613" y="215" width="14" height="50" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      <line x1="660" y1="240" x2="660" y2="310" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="653" y="245" width="14" height="55" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      <line x1="700" y1="280" x2="700" y2="350" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="693" y="285" width="14" height="55" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      {/* Halo + label "Résistance 4 650$" panel droit, déplacés après les bougies */}
      <rect x="453" y="133" width="127" height="14" fill="#09090b" rx="3" />
      <text x="457" y="144" fill="#ef4444" fontSize="9" fontWeight="600">Résistance 4 650$</text>

      <rect x="480" y="310" width="240" height="20" rx="4" fill="#27272a" stroke="#ef4444" strokeWidth="0.8" />
      <text x="600" y="324" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">Mèche + clôture sous + reversal</text>

      <text x="400" y="385" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        Critère de distinction : clôture au-dessus du niveau + follow-through sur 3-5 bougies
      </text>
    </svg>

    {/* MOBILE : vrai vs faux breakout ─────────────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">Vrai breakout vs Faux breakout</p>
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
        <p className="text-[13px] font-bold text-emerald-400">✓ Vrai breakout</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">Cassure franche + clôture AU-DESSUS du niveau + 3-5 bougies de continuation (follow-through).</p>
      </div>
      <div className="rounded-lg border border-red-500/40 bg-red-500/8 p-3">
        <p className="text-[13px] font-bold text-red-400">✗ Faux breakout</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">Mèche dépasse mais <span className="font-bold">clôture sous</span> le niveau + reversal immédiat = piège.</p>
      </div>
      <p className="text-[13px] text-emerald-400 font-bold text-center pt-2 border-t border-zinc-800 leading-snug">
        Critère : clôture + follow-through 3-5 bougies.
      </p>
    </div>
    </div>
  );
}

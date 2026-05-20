export default function InvalidationTriggersGridDiagram({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 500"
      className="hidden sm:block w-full h-auto"
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        Checklist invalidation — 5 critères qui déclenchent la coupe
      </text>

      {/* Séparateurs grille 3x2 */}
      <line x1="270" y1="40" x2="270" y2="480" stroke="#3f3f46" strokeWidth="1" />
      <line x1="535" y1="40" x2="535" y2="480" stroke="#3f3f46" strokeWidth="1" />
      <line x1="20" y1="260" x2="780" y2="260" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ Critère 1 — Cassure rejetée (haut gauche) ═══ */}
      <rect x="50" y="55" width="170" height="20" rx="4" fill="#ef444420" stroke="#ef4444" strokeWidth="0.8" />
      <text x="135" y="69" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">Critère 1</text>
      <text x="135" y="93" fill="#d4d4d8" fontSize="10" fontWeight="600" textAnchor="middle">Cassure rejetée</text>
      {/* Mini-chart : prix qui casse puis revient */}
      <line x1="50" y1="160" x2="220" y2="160" stroke="#a1a1aa" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.5" />
      <path d="M55,200 L90,180 L130,150 L165,210 L200,225" stroke="#71717a" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <circle cx="130" cy="150" r="3" fill="#ef4444" />
      <text x="135" y="245" fill="#71717a" fontSize="8" textAnchor="middle">Prix re-clôture sous le niveau</text>

      {/* ═══ Critère 2 — Bougie de rejet violente (haut centre) ═══ */}
      <rect x="315" y="55" width="170" height="20" rx="4" fill="#ef444420" stroke="#ef4444" strokeWidth="0.8" />
      <text x="400" y="69" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">Critère 2</text>
      <text x="400" y="93" fill="#d4d4d8" fontSize="10" fontWeight="600" textAnchor="middle">Bougie de rejet violente</text>
      {/* 2 bougies rouges puis grosse bougie verte */}
      <line x1="350" y1="160" x2="350" y2="200" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="343" y="165" width="14" height="30" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />
      <line x1="390" y1="170" x2="390" y2="210" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="383" y="175" width="14" height="30" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />
      <line x1="440" y1="130" x2="440" y2="220" stroke="#059669" strokeWidth="2" />
      <rect x="430" y="140" width="20" height="70" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="2" />
      <text x="400" y="245" fill="#71717a" fontSize="8" textAnchor="middle">Verte englobe les rouges</text>

      {/* ═══ Critère 3 — Volume incohérent (haut droite) ═══ */}
      <rect x="580" y="55" width="170" height="20" rx="4" fill="#ef444420" stroke="#ef4444" strokeWidth="0.8" />
      <text x="665" y="69" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">Critère 3</text>
      <text x="665" y="93" fill="#d4d4d8" fontSize="10" fontWeight="600" textAnchor="middle">Volume incohérent</text>
      {/* Mini barres volume */}
      <line x1="580" y1="230" x2="755" y2="230" stroke="#71717a" strokeWidth="0.5" />
      <rect x="590" y="210" width="10" height="20" fill="#71717a" />
      <rect x="610" y="215" width="10" height="15" fill="#71717a" />
      <rect x="630" y="200" width="10" height="30" fill="#71717a" />
      <rect x="650" y="160" width="10" height="70" fill="#ef4444" />
      <rect x="670" y="180" width="10" height="50" fill="#71717a" />
      <rect x="690" y="190" width="10" height="40" fill="#71717a" />
      <rect x="610" y="147" width="110" height="11" rx="2" fill="#09090b" />
      <text x="665" y="155" fill="#ef4444" fontSize="8" textAnchor="middle">↑ Volume inattendu</text>

      {/* ═══ Critère 4 — News majeure (bas gauche) ═══ */}
      <rect x="50" y="275" width="170" height="20" rx="4" fill="#ef444420" stroke="#ef4444" strokeWidth="0.8" />
      <text x="135" y="289" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">Critère 4</text>
      <text x="135" y="313" fill="#d4d4d8" fontSize="10" fontWeight="600" textAnchor="middle">News majeure imminente</text>
      {/* Icône calendrier */}
      <rect x="100" y="340" width="70" height="60" fill="#27272a" stroke="#ef4444" strokeWidth="1.5" rx="4" />
      <line x1="100" y1="360" x2="170" y2="360" stroke="#ef4444" strokeWidth="1" />
      <text x="135" y="378" fill="#ef4444" fontSize="11" fontWeight="700" textAnchor="middle">⚠</text>
      <text x="135" y="395" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">NFP/FOMC</text>
      <text x="135" y="425" fill="#71717a" fontSize="8" textAnchor="middle">News dans les 30 minutes</text>

      {/* ═══ Critère 5 — Temps écoulé (bas centre) ═══ */}
      <rect x="315" y="275" width="170" height="20" rx="4" fill="#ef444420" stroke="#ef4444" strokeWidth="0.8" />
      <text x="400" y="289" fill="#ef4444" fontSize="9" fontWeight="600" textAnchor="middle">Critère 5</text>
      <text x="400" y="313" fill="#d4d4d8" fontSize="10" fontWeight="600" textAnchor="middle">Temps écoulé</text>
      {/* Icône horloge simple */}
      <circle cx="400" cy="380" r="32" fill="none" stroke="#ef4444" strokeWidth="2" />
      <line x1="400" y1="380" x2="400" y2="360" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
      <line x1="400" y1="380" x2="416" y2="390" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
      <text x="400" y="430" fill="#71717a" fontSize="8" textAnchor="middle">&gt; 5 bougies sans follow-through</text>

      {/* ═══ Cellule 6 — Synthèse (bas droite) ═══ */}
      <rect x="580" y="320" width="170" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="665" y="335" fill="#10b981" fontSize="11" fontWeight="700" textAnchor="middle">✓ Setup tient</text>
      <text x="665" y="370" fill="#d4d4d8" fontSize="10" textAnchor="middle">Aucun critère allumé</text>
      <text x="665" y="390" fill="#a1a1aa" fontSize="9" textAnchor="middle">= position conservée</text>
      <circle cx="665" cy="425" r="12" fill="#10b981" />
      <path d="M659,425 l4,4 l8,-8" stroke="#0a0a0a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>

    {/* MOBILE : 5 critères invalidation ─────────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">5 critères qui déclenchent la coupe</p>
      {[
        "Niveau clé cassé contre le sens du trade",
        "Clôture franche au-delà du niveau structurel",
        "Signal opposé (pin bar / engulfing) au mauvais endroit",
        "Volume anormal contre la direction du trade",
        "Time stop : pas de progression après X bougies",
      ].map((c, i) => (
        <div key={i} className="rounded-lg border border-red-500/30 bg-red-500/5 p-2.5">
          <div className="flex items-start gap-2.5">
            <span className="shrink-0 w-6 h-6 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-[12px] font-bold text-red-400">{i + 1}</span>
            <p className="text-[12px] text-zinc-300 leading-snug flex-1">{c}</p>
          </div>
        </div>
      ))}
      <p className="text-[13px] text-red-400 font-bold text-center pt-2 border-t border-zinc-800 leading-snug">
        N'importe lequel = couper immédiatement.
      </p>
    </div>
    </div>
  );
}

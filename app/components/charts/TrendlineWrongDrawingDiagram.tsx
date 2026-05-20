export default function TrendlineWrongDrawingDiagram({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 500"
      className="hidden sm:block w-full h-auto"
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        Tracer une trendline — 3 erreurs courantes
      </text>

      <line x1="400" y1="40" x2="400" y2="480" stroke="#3f3f46" strokeWidth="1" />
      <line x1="20" y1="260" x2="780" y2="260" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ Cellule 1 — BON tracé (haut gauche) ═══ */}
      <rect x="80" y="50" width="240" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="200" y="65" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">✓ Bon tracé — 3 HL alignés</text>

      <path d="M40,230 L80,160 L120,200 L160,140 L200,180 L240,100 L280,140 L320,80 L360,120" stroke="#71717a" strokeWidth="1.8" fill="none" strokeLinejoin="round" />

      <circle cx="80" cy="160" r="3" fill="#10b981" />
      <circle cx="160" cy="140" r="3" fill="#10b981" />
      <circle cx="240" cy="100" r="3" fill="#10b981" />

      {/* Trendline emerald reliant les 3 HL */}
      <line x1="80" y1="160" x2="340" y2="95" stroke="#10b981" strokeWidth="1.5" />

      {/* ═══ Cellule 2 — MAUVAIS 2 points isolés (haut droite) ═══ */}
      <rect x="480" y="50" width="240" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="600" y="65" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">✗ 2 points isolés</text>

      <path d="M440,230 L480,160 L520,200 L560,140 L600,180 L640,100 L680,140 L720,80 L760,120" stroke="#71717a" strokeWidth="1.8" fill="none" strokeLinejoin="round" />

      {/* HL retenus (2 points isolés) */}
      <circle cx="480" cy="225" r="3" fill="#ef4444" />
      <circle cx="760" cy="220" r="3" fill="#ef4444" />

      {/* HL ignorés en rouge sur les vrais pivots du path */}
      <circle cx="520" cy="200" r="3" fill="#ef4444" />
      <circle cx="600" cy="180" r="3" fill="#ef4444" />
      <circle cx="680" cy="140" r="3" fill="#ef4444" />

      {/* Trendline red forcée sur 2 points isolés (ignorant les autres HL) */}
      <line x1="480" y1="225" x2="760" y2="220" stroke="#ef4444" strokeWidth="2" />

      {/* Labels avec halos placés en fin de cellule 2 pour rester au-dessus du path et de la trendline */}
      <rect x="524" y="189" width="53" height="14" fill="#09090b" rx="3" />
      <text x="528" y="198" fill="#ef4444" fontSize="7" fontWeight="600">HL ignoré</text>
      <rect x="604" y="169" width="53" height="14" fill="#09090b" rx="3" />
      <text x="608" y="178" fill="#ef4444" fontSize="7" fontWeight="600">HL ignoré</text>
      <rect x="524" y="237" width="152" height="14" fill="#09090b" rx="3" />
      <text x="600" y="248" fill="#ef4444" fontSize="8" textAnchor="middle">3 HL ignorés sous le path</text>

      {/* ═══ Cellule 3 — MAUVAIS pente trop forte (bas gauche) ═══ */}
      <rect x="80" y="280" width="240" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="200" y="295" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">✗ Pente irréaliste</text>

      <path d="M40,450 L80,420 L120,440 L160,400 L200,420 L240,380 L280,400 L320,360 L360,380" stroke="#71717a" strokeWidth="1.8" fill="none" strokeLinejoin="round" />

      <circle cx="80" cy="420" r="3" fill="#10b981" />
      <circle cx="160" cy="400" r="3" fill="#10b981" />
      <circle cx="240" cy="380" r="3" fill="#10b981" />

      {/* Trendline red avec pente quasi-verticale (~70°) clairement irréaliste */}
      <line x1="80" y1="450" x2="160" y2="340" stroke="#ef4444" strokeWidth="2" />
      <text x="200" y="475" fill="#ef4444" fontSize="8" textAnchor="middle">Angle ~70° vs path à ~30°</text>

      {/* ═══ Cellule 4 — MAUVAIS cassure ignorée (bas droite) ═══ */}
      <rect x="480" y="280" width="240" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="600" y="295" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">✗ Cassure ignorée</text>

      <path d="M440,440 L480,400 L520,420 L560,380 L600,400 L640,360 L680,410 L720,450 L760,470" stroke="#71717a" strokeWidth="1.8" fill="none" strokeLinejoin="round" />

      <circle cx="480" cy="400" r="3" fill="#10b981" />
      <circle cx="560" cy="380" r="3" fill="#10b981" />
      <circle cx="640" cy="360" r="3" fill="#10b981" />

      {/* Trendline red qui continue malgré la cassure */}
      <line x1="480" y1="400" x2="760" y2="345" stroke="#ef4444" strokeWidth="1.5" />

      {/* Bougie rouge GROSSE qui casse clairement la trendline vers le bas */}
      <line x1="700" y1="360" x2="700" y2="455" stroke="#b91c1c" strokeWidth="2" />
      <rect x="690" y="375" width="20" height="65" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" rx="2" />

      {/* Pastille "Cassure ignorée" à côté de la bougie de cassure */}
      <line x1="712" y1="400" x2="745" y2="395" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="2 2" />
      <rect x="640" y="320" width="120" height="18" rx="4" fill="#ef444433" stroke="#ef4444" strokeWidth="1.2" />
      <text x="700" y="332" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">Cassure ignorée</text>

      <text x="600" y="475" fill="#ef4444" fontSize="8" textAnchor="middle">Trendline prolongée malgré la cassure</text>
    </svg>

    {/* MOBILE : tracé trendline correct vs erreurs ──────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">Tracer une trendline — bon vs erreurs</p>
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
        <p className="text-[13px] font-bold text-emerald-400">✓ Bon tracé — 3 HL alignés</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">Au minimum 3 pivots HL (ou LH) connectés sur la même droite.</p>
      </div>
      <div className="rounded-lg border border-red-500/40 bg-red-500/8 p-3">
        <p className="text-[13px] font-bold text-red-400">✗ 2 points isolés</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">2 pivots ne suffisent pas — toute droite passe par 2 points. Il faut au moins 3.</p>
      </div>
      <div className="rounded-lg border border-red-500/40 bg-red-500/8 p-3">
        <p className="text-[13px] font-bold text-red-400">✗ Trendline forcée sur des mèches</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">Relier des mèches isolées = tracé biaisé. Utiliser les corps de bougies.</p>
      </div>
      <div className="rounded-lg border border-red-500/40 bg-red-500/8 p-3">
        <p className="text-[13px] font-bold text-red-400">✗ Cassure ignorée</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">Une fois cassée, abandonner la trendline. Ne pas la prolonger.</p>
      </div>
    </div>
    </div>
  );
}

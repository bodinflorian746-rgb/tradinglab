export const ConsensusVsRealDiagram = () => {
  return (
    <div>
    <svg
      className="hidden sm:block w-full h-auto"
      viewBox="0 0 800 450"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Layer 1 — Fond global */}
      <rect width="800" height="450" fill="#18181b" rx="8" />
      <rect width="800" height="450" fill="none" stroke="#27272a" strokeWidth="1" rx="8" />

      {/* Layer 2 — Titre haut centré */}
      <text x="400" y="35" fill="white" fontSize="16" fontWeight="700" textAnchor="middle">
        Le marché réagit à la SURPRISE, pas au chiffre
      </text>

      {/* Layer 3 — Conteneurs des 3 colonnes */}

      {/* Colonne 1 — zinc */}
      <rect x="20" y="60" width="240" height="320" rx="6" fill="#09090b" fillOpacity="0.4" stroke="#71717a" strokeOpacity="0.5" strokeWidth="1" />

      {/* Colonne 2 — emerald */}
      <rect x="280" y="60" width="240" height="320" rx="6" fill="#09090b" fillOpacity="0.4" stroke="#10b981" strokeOpacity="0.5" strokeWidth="1" />

      {/* Colonne 3 — red */}
      <rect x="540" y="60" width="240" height="320" rx="6" fill="#09090b" fillOpacity="0.4" stroke="#ef4444" strokeOpacity="0.5" strokeWidth="1" />

      {/* Layer 4 — Headers de colonnes */}

      {/* Colonne 1 */}
      <text x="140" y="85" fill="#71717a" fontSize="13" fontWeight="700" textAnchor="middle" letterSpacing="0.05em">RÉEL = CONSENSUS</text>
      <text x="140" y="105" fill="#a1a1aa" fontSize="11" textAnchor="middle">NFP 200k attendus</text>
      <text x="140" y="120" fill="#a1a1aa" fontSize="11" textAnchor="middle">200k réels</text>

      {/* Colonne 2 */}
      <text x="400" y="85" fill="#34d399" fontSize="13" fontWeight="700" textAnchor="middle" letterSpacing="0.05em">RÉEL &gt; CONSENSUS</text>
      <text x="400" y="105" fill="#a1a1aa" fontSize="11" textAnchor="middle">NFP 350k réels</text>
      <text x="400" y="120" fill="#a1a1aa" fontSize="11" textAnchor="middle">200k attendus</text>

      {/* Colonne 3 */}
      <text x="660" y="85" fill="#f87171" fontSize="13" fontWeight="700" textAnchor="middle" letterSpacing="0.05em">RÉEL &lt; CONSENSUS</text>
      <text x="660" y="105" fill="#a1a1aa" fontSize="11" textAnchor="middle">NFP 100k réels</text>
      <text x="660" y="120" fill="#a1a1aa" fontSize="11" textAnchor="middle">200k attendus</text>

      {/* Layer 5 — Mini-charts de bougies */}

      {/* Colonne 1 — 5 bougies calmes alternées */}

      {/* Bougie 1 — x=80 — Bull */}
      <line x1="80" y1="205" x2="80" y2="235" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="72" y="210" width="16" height="20" fill="#10b981" rx="1.5" />

      {/* Bougie 2 — x=102 — Bear */}
      <line x1="102" y1="210" x2="102" y2="240" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="94" y="215" width="16" height="20" fill="#ef4444" rx="1.5" />

      {/* Bougie 3 — x=124 — Bull */}
      <line x1="124" y1="208" x2="124" y2="232" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="116" y="212" width="16" height="16" fill="#10b981" rx="1.5" />

      {/* Bougie 4 — x=146 — Bear */}
      <line x1="146" y1="215" x2="146" y2="235" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="138" y="218" width="16" height="14" fill="#ef4444" rx="1.5" />

      {/* Bougie 5 — x=168 — Bull */}
      <line x1="168" y1="210" x2="168" y2="235" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="160" y="215" width="16" height="15" fill="#10b981" rx="1.5" />

      {/* Colonne 2 — 2 bougies calmes + 1 énorme bull */}

      {/* Bougie 1 — x=320 — Bear calme */}
      <line x1="320" y1="210" x2="320" y2="235" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="312" y="215" width="16" height="15" fill="#ef4444" rx="1.5" />

      {/* Bougie 2 — x=342 — Bull calme */}
      <line x1="342" y1="208" x2="342" y2="230" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="334" y="210" width="16" height="15" fill="#10b981" rx="1.5" />

      {/* Bougie 3 — x=380 — ÉNORME bull */}
      <line x1="380" y1="120" x2="380" y2="225" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="372" y="130" width="16" height="90" fill="#10b981" rx="1.5" />

      {/* Colonne 3 — 2 bougies calmes + 1 énorme bear */}

      {/* Bougie 1 — x=580 — Bull calme */}
      <line x1="580" y1="210" x2="580" y2="235" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="572" y="215" width="16" height="15" fill="#10b981" rx="1.5" />

      {/* Bougie 2 — x=602 — Bear calme */}
      <line x1="602" y1="215" x2="602" y2="240" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="594" y="220" width="16" height="15" fill="#ef4444" rx="1.5" />

      {/* Bougie 3 — x=640 — ÉNORME bear */}
      <line x1="640" y1="210" x2="640" y2="315" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="632" y="215" width="16" height="90" fill="#ef4444" rx="1.5" />

      {/* Layer 6 — Verdicts en bas de chaque colonne */}

      {/* Colonne 1 */}
      <text x="140" y="350" fill="#a1a1aa" fontSize="11" fontWeight="600" textAnchor="middle">Pas de surprise</text>
      <text x="140" y="365" fill="#71717a" fontSize="10" textAnchor="middle">→ marché stable</text>

      {/* Colonne 2 */}
      <text x="400" y="350" fill="#34d399" fontSize="11" fontWeight="600" textAnchor="middle">Surprise positive</text>
      <text x="400" y="365" fill="#a1a1aa" fontSize="10" textAnchor="middle">→ spike haussier</text>

      {/* Colonne 3 */}
      <text x="660" y="350" fill="#f87171" fontSize="11" fontWeight="600" textAnchor="middle">Surprise négative</text>
      <text x="660" y="365" fill="#a1a1aa" fontSize="10" textAnchor="middle">→ spike baissier</text>

      {/* Layer 7 — Pied de page italique */}
      <text x="400" y="420" fill="#a1a1aa" fontSize="12" fontStyle="italic" textAnchor="middle">
        Plus l'écart entre prévision et réalité est grand, plus le mouvement est violent.
      </text>

      {/* Layer 8 — Annotations EN DERNIER (par-dessus les bougies) */}

      {/* Annotation "+80 pips / 30 sec" — colonne 2 bougie énorme */}
      <rect x="405" y="140" width="85" height="22" rx="3" fill="#09090b" fillOpacity="0.95" />
      <text x="410" y="155" textAnchor="start" fill="#34d399" fontSize="13" fontWeight="700">+80 pips</text>
      <text x="410" y="170" textAnchor="start" fill="#a1a1aa" fontSize="9">/ 30 sec</text>

      {/* Annotation "-80 pips / 30 sec" — colonne 3 bougie énorme */}
      <rect x="655" y="290" width="85" height="22" rx="3" fill="#09090b" fillOpacity="0.95" />
      <text x="660" y="305" textAnchor="start" fill="#f87171" fontSize="13" fontWeight="700">-80 pips</text>
      <text x="660" y="320" textAnchor="start" fill="#a1a1aa" fontSize="9">/ 30 sec</text>
    </svg>

    {/* ── MOBILE : 3 scénarios consensus empilés ─────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-4 space-y-3">
      <p className="text-[14px] font-bold text-white text-center leading-snug">
        Le marché réagit à la SURPRISE, pas au chiffre
      </p>

      {/* Scénario 1 — RÉEL = CONSENSUS */}
      <div className="rounded-xl border border-zinc-700 bg-zinc-800/40 p-3">
        <p className="text-[12px] text-zinc-400 font-bold uppercase tracking-wider">RÉEL = CONSENSUS</p>
        <p className="text-[13px] text-zinc-300 mt-1">NFP 200k attendus · 200k réels</p>
        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-zinc-700/60">
          <span className="text-[13px] text-zinc-300">Pas de surprise</span>
          <span className="text-[13px] text-zinc-400 font-semibold">→ marché stable</span>
        </div>
      </div>

      {/* Scénario 2 — RÉEL > CONSENSUS */}
      <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-3">
        <p className="text-[12px] text-emerald-400 font-bold uppercase tracking-wider">RÉEL &gt; CONSENSUS</p>
        <p className="text-[13px] text-zinc-300 mt-1">NFP 350k réels · 200k attendus</p>
        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-emerald-500/20">
          <span className="text-[13px] text-emerald-400 font-bold">Surprise positive</span>
          <span className="text-[13px] text-emerald-400 font-bold">+80 pips / 30 sec ↑</span>
        </div>
      </div>

      {/* Scénario 3 — RÉEL < CONSENSUS */}
      <div className="rounded-xl border border-red-500/40 bg-red-500/5 p-3">
        <p className="text-[12px] text-red-400 font-bold uppercase tracking-wider">RÉEL &lt; CONSENSUS</p>
        <p className="text-[13px] text-zinc-300 mt-1">NFP 100k réels · 200k attendus</p>
        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-red-500/20">
          <span className="text-[13px] text-red-400 font-bold">Surprise négative</span>
          <span className="text-[13px] text-red-400 font-bold">−80 pips / 30 sec ↓</span>
        </div>
      </div>

      <p className="text-[12px] text-zinc-400 italic text-center leading-snug pt-2 border-t border-zinc-800">
        Plus l'écart entre prévision et réalité est grand, plus le mouvement est violent.
      </p>
    </div>
    </div>
  );
};

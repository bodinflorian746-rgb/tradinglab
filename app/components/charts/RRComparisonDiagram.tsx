interface RRComparisonDiagramProps {
  className?: string;
}

// Échelle de prix verticale : 1€ = 3px (assure que rect rouge identique
// dans les 2 colonnes — 60px — et rect vert droit exactement 4x plus haut
// que rect vert gauche : 120px vs 30px).
// Entry partagée à y=250. TP / SL positionnés selon le RR de chaque colonne.

export default function RRComparisonDiagram({ className = "" }: RRComparisonDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest text-center py-3 border-b border-zinc-800/60">
        Comparaison Mauvais RR vs Bon RR — à risque égal (20€)
      </p>

      {/* ── DESKTOP ─────────────────────────────────────────────────── */}
      <div className="hidden sm:block">
        <svg
          width="100%"
          viewBox="0 0 700 480"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Comparaison visuelle Mauvais RR vs Bon RR"
        >
          {/* Séparateur vertical entre les 2 colonnes */}
          <line x1={350} y1={20} x2={350} y2={325} stroke="#27272a" strokeWidth="1" />

          {/* ════════════════════════════════════════════════════════════
              COLONNE GAUCHE — MAUVAIS RR (1:0,5)
              ════════════════════════════════════════════════════════════ */}

          {/* Titres */}
          <text x={180} y={32} fontSize="14" fill="#ffffff" fontWeight="700" textAnchor="middle">
            Mauvais RR — 1:0,5
          </text>
          <text x={180} y={54} fontSize="11" fill="#a1a1aa" textAnchor="middle">
            Tu risques 20€ pour gagner 10€
          </text>

          {/* Lignes horizontales (TP / ENTRÉE / SL) */}
          <line x1={90} y1={220} x2={270} y2={220} stroke="#3f3f46" strokeWidth="1" strokeDasharray="3 3" />
          <line x1={90} y1={250} x2={270} y2={250} stroke="#71717a" strokeWidth="1.5" />
          <line x1={90} y1={310} x2={270} y2={310} stroke="#3f3f46" strokeWidth="1" strokeDasharray="3 3" />

          {/* Rectangle vert — gain potentiel (10€ → 30px de haut) */}
          <rect x={110} y={220} width={140} height={30}
                fill="#10b981" fillOpacity="0.25" stroke="#10b981" strokeWidth="1" />

          {/* Rectangle rouge — zone de risque (20€ → 60px de haut) */}
          <rect x={110} y={250} width={140} height={60}
                fill="#ef4444" fillOpacity="0.25" stroke="#ef4444" strokeWidth="1" />

          {/* Labels à droite des lignes */}
          <text x={275} y={224} fontSize="10" fill="#34d399" fontWeight="600">TP +10€</text>
          <text x={275} y={254} fontSize="10" fill="#d4d4d8" fontWeight="600">ENTRÉE</text>
          <text x={275} y={314} fontSize="10" fill="#f87171" fontWeight="600">SL -20€</text>

          {/* Labels centraux dans les rectangles + pastilles opaques */}
          <rect x={158} y={227} width={44} height={14} rx="2" fill="#09090b" fillOpacity="0.85" />
          <text x={180} y={238} fontSize="11" fill="#34d399" fontWeight="700" textAnchor="middle">+10€</text>

          <rect x={158} y={272} width={44} height={14} rx="2" fill="#09090b" fillOpacity="0.85" />
          <text x={180} y={283} fontSize="11" fill="#f87171" fontWeight="700" textAnchor="middle">-20€</text>

          {/* ════════════════════════════════════════════════════════════
              COLONNE DROITE — BON RR (1:2)
              ════════════════════════════════════════════════════════════ */}

          {/* Titres */}
          <text x={520} y={32} fontSize="14" fill="#ffffff" fontWeight="700" textAnchor="middle">
            Bon RR — 1:2
          </text>
          <text x={520} y={54} fontSize="11" fill="#a1a1aa" textAnchor="middle">
            Tu risques 20€ pour gagner 40€
          </text>

          {/* Lignes horizontales (TP / ENTRÉE / SL) */}
          <line x1={430} y1={130} x2={610} y2={130} stroke="#3f3f46" strokeWidth="1" strokeDasharray="3 3" />
          <line x1={430} y1={250} x2={610} y2={250} stroke="#71717a" strokeWidth="1.5" />
          <line x1={430} y1={310} x2={610} y2={310} stroke="#3f3f46" strokeWidth="1" strokeDasharray="3 3" />

          {/* Rectangle vert — gain potentiel (40€ → 120px de haut, 4x le vert gauche) */}
          <rect x={450} y={130} width={140} height={120}
                fill="#10b981" fillOpacity="0.25" stroke="#10b981" strokeWidth="1" />

          {/* Rectangle rouge — zone de risque (20€ → 60px, identique au gauche) */}
          <rect x={450} y={250} width={140} height={60}
                fill="#ef4444" fillOpacity="0.25" stroke="#ef4444" strokeWidth="1" />

          {/* Labels à droite des lignes */}
          <text x={615} y={134} fontSize="10" fill="#34d399" fontWeight="600">TP +40€</text>
          <text x={615} y={254} fontSize="10" fill="#d4d4d8" fontWeight="600">ENTRÉE</text>
          <text x={615} y={314} fontSize="10" fill="#f87171" fontWeight="600">SL -20€</text>

          {/* Labels centraux dans les rectangles + pastilles opaques */}
          <rect x={498} y={182} width={44} height={14} rx="2" fill="#09090b" fillOpacity="0.85" />
          <text x={520} y={193} fontSize="11" fill="#34d399" fontWeight="700" textAnchor="middle">+40€</text>

          <rect x={498} y={272} width={44} height={14} rx="2" fill="#09090b" fillOpacity="0.85" />
          <text x={520} y={283} fontSize="11" fill="#f87171" fontWeight="700" textAnchor="middle">-20€</text>

          {/* ════════════════════════════════════════════════════════════
              BAS — Verdict comparatif (2 boîtes)
              ════════════════════════════════════════════════════════════ */}

          {/* Séparateur horizontal */}
          <line x1={20} y1={335} x2={680} y2={335} stroke="#27272a" strokeWidth="1" />

          {/* Boîte gauche — sous Mauvais RR */}
          <rect x={40} y={350} width={280} height={115} rx="6"
                fill="#18181b" stroke="#27272a" strokeWidth="1" />
          <text x={180} y={372} fontSize="10" fill="#a1a1aa" textAnchor="middle" fontWeight="600">
            Sur 10 trades avec 50% de winrate
          </text>
          <text x={60} y={400} fontSize="12" fill="#d4d4d8" fontFamily="ui-monospace, monospace">
            5 × +10€ = +50€
          </text>
          <text x={60} y={422} fontSize="12" fill="#d4d4d8" fontFamily="ui-monospace, monospace">
            5 × -20€ = -100€
          </text>
          <line x1={56} y1={434} x2={304} y2={434} stroke="#27272a" strokeWidth="1" />
          <text x={180} y={455} fontSize="13" fill="#f87171" fontWeight="700" textAnchor="middle">
            Résultat : -50€
          </text>

          {/* Boîte droite — sous Bon RR */}
          <rect x={380} y={350} width={280} height={115} rx="6"
                fill="#18181b" stroke="#27272a" strokeWidth="1" />
          <text x={520} y={372} fontSize="10" fill="#a1a1aa" textAnchor="middle" fontWeight="600">
            Sur 10 trades avec 50% de winrate
          </text>
          <text x={400} y={400} fontSize="12" fill="#d4d4d8" fontFamily="ui-monospace, monospace">
            5 × +40€ = +200€
          </text>
          <text x={400} y={422} fontSize="12" fill="#d4d4d8" fontFamily="ui-monospace, monospace">
            5 × -20€ = -100€
          </text>
          <line x1={396} y1={434} x2={644} y2={434} stroke="#27272a" strokeWidth="1" />
          <text x={520} y={455} fontSize="13" fill="#34d399" fontWeight="700" textAnchor="middle">
            Résultat : +100€
          </text>
        </svg>
      </div>

      {/* ── MOBILE (HTML reconstitué — ratios conservés) ────────────── */}
      <div className="sm:hidden p-4 space-y-3">
        {/* Mauvais RR */}
        <div className="rounded-xl border border-red-500/30 bg-zinc-900 p-4">
          <p className="text-[14px] font-bold text-white text-center">Mauvais RR — 1:0,5</p>
          <p className="text-[12px] text-zinc-400 text-center mb-3">Tu risques 20€ pour gagner 10€</p>

          {/* Mini-SVG ratio préservé (vert 30 / rouge 60) */}
          <svg viewBox="0 0 260 130" width="100%" fill="none" preserveAspectRatio="xMidYMid meet" aria-label="Mauvais RR ratio">
            <line x1={20} y1={25} x2={170} y2={25} stroke="#3f3f46" strokeWidth="1" strokeDasharray="3 3" />
            <line x1={20} y1={55} x2={170} y2={55} stroke="#71717a" strokeWidth="1.5" />
            <line x1={20} y1={115} x2={170} y2={115} stroke="#3f3f46" strokeWidth="1" strokeDasharray="3 3" />
            <rect x={45} y={25} width={100} height={30} fill="#10b981" fillOpacity="0.25" stroke="#10b981" strokeWidth="1" />
            <rect x={45} y={55} width={100} height={60} fill="#ef4444" fillOpacity="0.25" stroke="#ef4444" strokeWidth="1" />
            <text x={175} y={28} fontSize="9" fill="#34d399" fontWeight="600">TP +10€</text>
            <text x={175} y={58} fontSize="9" fill="#d4d4d8" fontWeight="600">ENTRÉE</text>
            <text x={175} y={118} fontSize="9" fill="#f87171" fontWeight="600">SL -20€</text>
            <rect x={75} y={33} width={40} height={12} rx="2" fill="#09090b" fillOpacity="0.85" />
            <text x={95} y={42} fontSize="10" fill="#34d399" fontWeight="700" textAnchor="middle">+10€</text>
            <rect x={75} y={78} width={40} height={12} rx="2" fill="#09090b" fillOpacity="0.85" />
            <text x={95} y={87} fontSize="10" fill="#f87171" fontWeight="700" textAnchor="middle">-20€</text>
          </svg>

          <div className="mt-3 pt-3 border-t border-zinc-800">
            <p className="text-[11px] text-zinc-400 text-center mb-2 font-semibold">Sur 10 trades avec 50% de winrate</p>
            <div className="space-y-1 text-[13px] font-mono">
              <p className="text-zinc-300">5 × +10€ = +50€</p>
              <p className="text-zinc-300">5 × -20€ = -100€</p>
            </div>
            <p className="text-[15px] font-bold text-red-400 text-center mt-3 pt-2 border-t border-zinc-800">
              Résultat : -50€
            </p>
          </div>
        </div>

        {/* Bon RR */}
        <div className="rounded-xl border border-emerald-500/30 bg-zinc-900 p-4">
          <p className="text-[14px] font-bold text-white text-center">Bon RR — 1:2</p>
          <p className="text-[12px] text-zinc-400 text-center mb-3">Tu risques 20€ pour gagner 40€</p>

          {/* Mini-SVG ratio préservé (vert 120 / rouge 60 — vert 4x le vert gauche) */}
          <svg viewBox="0 0 260 220" width="100%" fill="none" preserveAspectRatio="xMidYMid meet" aria-label="Bon RR ratio">
            <line x1={20} y1={25} x2={170} y2={25} stroke="#3f3f46" strokeWidth="1" strokeDasharray="3 3" />
            <line x1={20} y1={145} x2={170} y2={145} stroke="#71717a" strokeWidth="1.5" />
            <line x1={20} y1={205} x2={170} y2={205} stroke="#3f3f46" strokeWidth="1" strokeDasharray="3 3" />
            <rect x={45} y={25} width={100} height={120} fill="#10b981" fillOpacity="0.25" stroke="#10b981" strokeWidth="1" />
            <rect x={45} y={145} width={100} height={60} fill="#ef4444" fillOpacity="0.25" stroke="#ef4444" strokeWidth="1" />
            <text x={175} y={28} fontSize="9" fill="#34d399" fontWeight="600">TP +40€</text>
            <text x={175} y={148} fontSize="9" fill="#d4d4d8" fontWeight="600">ENTRÉE</text>
            <text x={175} y={208} fontSize="9" fill="#f87171" fontWeight="600">SL -20€</text>
            <rect x={75} y={78} width={40} height={12} rx="2" fill="#09090b" fillOpacity="0.85" />
            <text x={95} y={87} fontSize="10" fill="#34d399" fontWeight="700" textAnchor="middle">+40€</text>
            <rect x={75} y={168} width={40} height={12} rx="2" fill="#09090b" fillOpacity="0.85" />
            <text x={95} y={177} fontSize="10" fill="#f87171" fontWeight="700" textAnchor="middle">-20€</text>
          </svg>

          <div className="mt-3 pt-3 border-t border-zinc-800">
            <p className="text-[11px] text-zinc-400 text-center mb-2 font-semibold">Sur 10 trades avec 50% de winrate</p>
            <div className="space-y-1 text-[13px] font-mono">
              <p className="text-zinc-300">5 × +40€ = +200€</p>
              <p className="text-zinc-300">5 × -20€ = -100€</p>
            </div>
            <p className="text-[15px] font-bold text-emerald-400 text-center mt-3 pt-2 border-t border-zinc-800">
              Résultat : +100€
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

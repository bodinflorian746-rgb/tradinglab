export default function OBFreshnessDiagram({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1100 500"
      className="hidden sm:block w-full h-auto"
    >
      {/* ═══ DEFS — marker flèche rouge pointillée ═══ */}
      <defs>
        <marker id="arrowRed" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#ef4444" />
        </marker>
      </defs>

      {/* ═══ Titre haut ═══ */}
      <text x="550" y="30" fill="#ffffff" fontSize="18" fontWeight="700" textAnchor="middle">
        OB frais vs OB mitigé
      </text>

      {/* ═══ Cartes (bordures gauche et droite) ═══ */}
      <rect x="20" y="60" width="500" height="400" rx="12" stroke="#10b981" strokeWidth="1.5" fill="none" />
      <rect x="580" y="60" width="500" height="400" rx="12" stroke="#ef4444" strokeWidth="1.5" fill="none" />

      {/* ═══ Cercle VS central ═══ */}
      <circle cx="550" cy="260" r="22" fill="#27272a" stroke="#3f3f46" strokeWidth="1" />
      <text x="550" y="265" fill="#a1a1aa" fontSize="11" fontWeight="700" textAnchor="middle">VS</text>

      {/* ═══ Titres et sous-titres des cartes ═══ */}
      <text x="270" y="95" fill="#10b981" fontSize="16" fontWeight="700" textAnchor="middle">✓ OB frais — jamais retesté</text>
      <text x="270" y="115" fill="#10b981" fontSize="13" fontWeight="500" textAnchor="middle">Déséquilibre haussier confirmé</text>

      <text x="830" y="95" fill="#ef4444" fontSize="16" fontWeight="700" textAnchor="middle">✗ OB mitigé — déjà retraversé</text>
      <text x="830" y="115" fill="#ef4444" fontSize="13" fontWeight="500" textAnchor="middle">Déséquilibre haussier compromis</text>

      {/* ═══ PANNEAU GAUCHE ═══ */}

      {/* Rectangle OB gauche — encadre bougie 2 (x=140) avec marge */}
      <rect x="125" y="215" width="30" height="85" stroke="#10b981" fill="rgba(16,185,129,0.06)" strokeDasharray="4 3" strokeWidth="1.5" rx="2" />

      {/* Zone d'OB étendue — 2 lignes pointillées horizontales vers la droite */}
      <line x1="155" y1="235" x2="420" y2="235" stroke="#10b981" strokeDasharray="4 3" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="155" y1="285" x2="420" y2="285" stroke="#10b981" strokeDasharray="4 3" strokeWidth="1" strokeOpacity="0.5" />

      {/* 5 bougies — escalier ascendant */}
      {/* B1 bullish x=80 */}
      <line x1="80" y1="255" x2="80" y2="320" stroke="#059669" strokeWidth="1.5" />
      <rect x="69" y="270" width="22" height="40" fill="#10b981" stroke="#059669" strokeWidth="1" rx="2" />

      {/* B2 bearish OB x=140 */}
      <line x1="140" y1="220" x2="140" y2="295" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="129" y="235" width="22" height="50" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="2" />

      {/* B3 bullish FORTE impulsion x=200 */}
      <line x1="200" y1="170" x2="200" y2="300" stroke="#059669" strokeWidth="1.5" />
      <rect x="189" y="180" width="22" height="110" fill="#10b981" stroke="#059669" strokeWidth="1" rx="2" />

      {/* B4 bullish moyenne x=260 */}
      <line x1="260" y1="185" x2="260" y2="250" stroke="#059669" strokeWidth="1.5" />
      <rect x="249" y="200" width="22" height="40" fill="#10b981" stroke="#059669" strokeWidth="1" rx="2" />

      {/* B5 bullish moyenne-grande x=320 */}
      <line x1="320" y1="150" x2="320" y2="230" stroke="#059669" strokeWidth="1.5" />
      <rect x="309" y="160" width="22" height="60" fill="#10b981" stroke="#059669" strokeWidth="1" rx="2" />

      {/* ═══ PANNEAU DROIT ═══ */}

      {/* Rectangle OB droit — encadre bougie 2 droite (x=700) */}
      <rect x="685" y="215" width="30" height="85" stroke="#ef4444" fill="rgba(239,68,68,0.06)" strokeDasharray="4 3" strokeWidth="1.5" rx="2" />

      {/* Zone d'OB étendue droite — rect teinté horizontal */}
      <rect x="715" y="235" width="265" height="50" fill="rgba(239,68,68,0.10)" stroke="#ef4444" strokeDasharray="4 3" strokeWidth="1" strokeOpacity="0.6" />

      {/* 6 bougies — impulsion puis retour qui traverse l'OB */}
      {/* B1 bullish x=640 */}
      <line x1="640" y1="255" x2="640" y2="320" stroke="#059669" strokeWidth="1.5" />
      <rect x="629" y="270" width="22" height="40" fill="#10b981" stroke="#059669" strokeWidth="1" rx="2" />

      {/* B2 bearish OB x=700 */}
      <line x1="700" y1="220" x2="700" y2="295" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="689" y="235" width="22" height="50" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="2" />

      {/* B3 bullish FORTE impulsion x=760 */}
      <line x1="760" y1="170" x2="760" y2="300" stroke="#059669" strokeWidth="1.5" />
      <rect x="749" y="180" width="22" height="110" fill="#10b981" stroke="#059669" strokeWidth="1" rx="2" />

      {/* B4 bullish continuation x=820 */}
      <line x1="820" y1="185" x2="820" y2="250" stroke="#059669" strokeWidth="1.5" />
      <rect x="809" y="200" width="22" height="40" fill="#10b981" stroke="#059669" strokeWidth="1" rx="2" />

      {/* B5 BEARISH RETEST x=880 — MÈCHE BASSE LONGUE descend dans la zone d'OB (y=235-285) */}
      <line x1="880" y1="170" x2="880" y2="270" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="869" y="180" width="22" height="50" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="2" />

      {/* B6 bullish FORTE rebond x=940 */}
      <line x1="940" y1="150" x2="940" y2="270" stroke="#059669" strokeWidth="1.5" />
      <rect x="929" y="160" width="22" height="100" fill="#10b981" stroke="#059669" strokeWidth="1" rx="2" />

      {/* Flèche pointillée retest depuis l'extrémité de la mèche B5 vers la zone d'OB */}
      <line x1="880" y1="265" x2="880" y2="290" stroke="#ef4444" strokeDasharray="3 2" strokeWidth="1.5" markerEnd="url(#arrowRed)" />

      {/* ═══ Pastilles "OB créé" sous bougie 2 dans les 2 panneaux ═══ */}
      <rect x="115" y="310" width="50" height="18" rx="9" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="140" y="323" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">OB créé</text>

      <rect x="675" y="310" width="50" height="18" rx="9" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="700" y="323" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">OB créé</text>

      {/* Pastille "Retest" sous la flèche */}
      <rect x="855" y="310" width="50" height="18" rx="9" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="880" y="323" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">Retest</text>

      {/* ═══ Pastilles bottom (wrappers + titres + captions) ═══ */}
      {/* Pastille bottom gauche */}
      <rect x="50" y="380" width="440" height="60" rx="12" fill="#10b98110" stroke="#10b98140" strokeWidth="1" />
      <text x="270" y="405" fill="#10b981" fontSize="14" fontWeight="600" textAnchor="middle">3 bougies depuis formation</text>
      <text x="270" y="425" fill="#10b981" fontSize="12" textAnchor="middle">Aucun retour du prix dans la zone</text>

      {/* Pastille bottom droite */}
      <rect x="610" y="380" width="440" height="60" rx="12" fill="#ef444410" stroke="#ef444440" strokeWidth="1" />
      <text x="830" y="405" fill="#ef4444" fontSize="14" fontWeight="600" textAnchor="middle">Retest + rejet = OB consommé</text>
      <text x="830" y="425" fill="#ef4444" fontSize="12" textAnchor="middle">Ordres institutionnels déjà exécutés</text>

      {/* ═══ Caption central bas — pastille bleue avec icône info ═══ */}
      <rect x="300" y="475" width="500" height="22" rx="11" fill="rgba(96,165,250,0.10)" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.5" />
      <circle cx="320" cy="486" r="7" stroke="#60a5fa" strokeWidth="1.2" fill="none" />
      <text x="320" y="490" fill="#60a5fa" fontSize="9" fontWeight="700" textAnchor="middle">i</text>
      <text x="560" y="490" fill="#60a5fa" fontSize="11" textAnchor="middle">
        Un OB mitigé est consommé : ses ordres institutionnels ont déjà été déclenchés
      </text>

      {/* ═══ EN FIN — Halos opaques + labels "Zone d'OB ..." (à droite des zones, alignés end pour rester dans la carte) ═══ */}
      <rect x="305" y="249" width="80" height="14" fill="#09090b" rx="3" />
      <text x="380" y="260" fill="#10b981" fontSize="10" textAnchor="end">Zone d&apos;OB jamais retestée</text>

      <rect x="955" y="249" width="90" height="14" fill="#09090b" rx="3" />
      <text x="1040" y="260" fill="#ef4444" fontSize="10" textAnchor="end">Zone d&apos;OB déjà traversée</text>
    </svg>

    {/* MOBILE : OB frais vs mitigé ──────────────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">OB frais vs OB mitigé</p>
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
        <p className="text-[13px] font-bold text-emerald-400">✓ OB frais — jamais retesté</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">Déséquilibre haussier confirmé · zone d'OB encore intacte → entrée à haute probabilité.</p>
      </div>
      <div className="rounded-lg border border-red-500/40 bg-red-500/8 p-3">
        <p className="text-[13px] font-bold text-red-400">✗ OB mitigé — déjà retraversé</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">Zone d'OB déjà traversée par le prix → déséquilibre compromis, signal faible.</p>
      </div>
      <p className="text-[13px] text-emerald-400 font-bold text-center pt-2 border-t border-zinc-800 leading-snug">
        Un OB ne se trade que sur son <span className="font-bold">premier retest</span>.
      </p>
    </div>
    </div>
  );
}

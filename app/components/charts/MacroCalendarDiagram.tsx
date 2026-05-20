import { ChartScroller } from "../ChartScroller";

export const MacroCalendarDiagram = () => {
  return (
    <ChartScroller width="md">
    <svg
      className="w-full h-auto"
      viewBox="0 0 800 510"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Layer 1 — Fond */}
      <rect width="800" height="510" fill="#18181b" rx="8" />
      <rect width="800" height="510" fill="none" stroke="#27272a" strokeWidth="1" rx="8" />

      {/* Layer 2 — Titre */}
      <text x="400" y="30" fill="#ffffff" fontSize="16" fontWeight="600" textAnchor="middle">
        Une journée type sur le calendrier économique
      </text>

      {/* Layer 3 — Tableau calendrier */}

      {/* Headers */}
      <text x="80"  y="70" fill="#71717a" fontSize="11" fontWeight="600" textAnchor="middle">HEURE</text>
      <text x="170" y="70" fill="#71717a" fontSize="11" fontWeight="600" textAnchor="middle">DEVISE</text>
      <text x="400" y="70" fill="#71717a" fontSize="11" fontWeight="600" textAnchor="middle">ÉVÉNEMENT</text>
      <text x="680" y="70" fill="#71717a" fontSize="11" fontWeight="600" textAnchor="middle">IMPACT</text>

      {/* Ligne de séparation sous les headers */}
      <line x1="40" y1="82" x2="760" y2="82" stroke="#3f3f46" strokeWidth="1" />

      {/* Surlignage ligne 3 (CPI) */}
      <rect x="40" y="153" width="720" height="32" fill="#ef4444" fillOpacity="0.08" rx="2" />

      {/* Ligne 1 — y=105 — PMI Manufacturier */}
      <text x="80"  y="105" fill="#ffffff" fontSize="14" fontWeight="600" textAnchor="middle">08h00</text>
      <text x="170" y="105" fill="#60a5fa" fontSize="13" fontWeight="600" textAnchor="middle">EUR</text>
      <text x="400" y="105" fill="#d4d4d8" fontSize="13" textAnchor="middle">PMI Manufacturier</text>
      <circle cx="650" cy="105" r="5" fill="#fbbf24" />
      <circle cx="670" cy="105" r="5" fill="#fbbf24" />
      <circle cx="690" cy="105" r="5" fill="none" stroke="#3f3f46" strokeWidth="1" />

      {/* Ligne 2 — y=137 — Production industrielle */}
      <text x="80"  y="137" fill="#ffffff" fontSize="14" fontWeight="600" textAnchor="middle">10h00</text>
      <text x="170" y="137" fill="#60a5fa" fontSize="13" fontWeight="600" textAnchor="middle">GBP</text>
      <text x="400" y="137" fill="#d4d4d8" fontSize="13" textAnchor="middle">Production industrielle</text>
      <circle cx="650" cy="137" r="5" fill="#10b981" />
      <circle cx="670" cy="137" r="5" fill="none" stroke="#3f3f46" strokeWidth="1" />
      <circle cx="690" cy="137" r="5" fill="none" stroke="#3f3f46" strokeWidth="1" />

      {/* Ligne 3 — y=169 — CPI (surlignée) */}
      <text x="80"  y="169" fill="#ffffff" fontSize="14" fontWeight="600" textAnchor="middle">14h30</text>
      <text x="170" y="169" fill="#60a5fa" fontSize="13" fontWeight="600" textAnchor="middle">USD</text>
      <text x="400" y="169" fill="#d4d4d8" fontSize="13" textAnchor="middle">CPI inflation</text>
      <circle cx="650" cy="169" r="5" fill="#ef4444" />
      <circle cx="670" cy="169" r="5" fill="#ef4444" />
      <circle cx="690" cy="169" r="5" fill="#ef4444" />

      {/* Flèche descendante depuis ligne 3 vers le graphique */}
      <line x1="730" y1="180" x2="730" y2="275" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
      <polygon points="725,272 730,282 735,272" fill="#ef4444" />

      {/* Ligne 4 — y=201 — Discours Lagarde */}
      <text x="80"  y="201" fill="#ffffff" fontSize="14" fontWeight="600" textAnchor="middle">16h00</text>
      <text x="170" y="201" fill="#60a5fa" fontSize="13" fontWeight="600" textAnchor="middle">EUR</text>
      <text x="400" y="201" fill="#d4d4d8" fontSize="13" textAnchor="middle">Discours Lagarde</text>
      <circle cx="650" cy="201" r="5" fill="#ef4444" />
      <circle cx="670" cy="201" r="5" fill="#ef4444" />
      <circle cx="690" cy="201" r="5" fill="#ef4444" />

      {/* Ligne 5 — y=233 — Décision FOMC */}
      <text x="80"  y="233" fill="#ffffff" fontSize="14" fontWeight="600" textAnchor="middle">20h00</text>
      <text x="170" y="233" fill="#60a5fa" fontSize="13" fontWeight="600" textAnchor="middle">USD</text>
      <text x="400" y="233" fill="#d4d4d8" fontSize="13" textAnchor="middle">Décision FOMC</text>
      <circle cx="650" cy="233" r="5" fill="#ef4444" />
      <circle cx="670" cy="233" r="5" fill="#ef4444" />
      <circle cx="690" cy="233" r="5" fill="#ef4444" />

      {/* Lignes de séparation entre événements */}
      <line x1="40" y1="121" x2="760" y2="121" stroke="#27272a" strokeWidth="1" />
      <line x1="40" y1="153" x2="760" y2="153" stroke="#27272a" strokeWidth="1" />
      <line x1="40" y1="185" x2="760" y2="185" stroke="#27272a" strokeWidth="1" />
      <line x1="40" y1="217" x2="760" y2="217" stroke="#27272a" strokeWidth="1" />
      <line x1="40" y1="249" x2="760" y2="249" stroke="#27272a" strokeWidth="1" />

      {/* Layer 4 — Séparateur tableau / graphique */}
      <line x1="40" y1="270" x2="760" y2="270" stroke="#3f3f46" strokeWidth="1" strokeDasharray="4 4" />
      <text x="400" y="292" fill="#71717a" fontSize="11" fontWeight="600" textAnchor="middle">
        Réaction du marché EUR/USD
      </text>

      {/* Layer 5 — Mini graphique */}

      {/* Axe horizontal */}
      <line x1="80" y1="395" x2="720" y2="395" stroke="#3f3f46" strokeWidth="1" />

      {/* Marqueur vertical 14h30 CPI */}
      <line x1="240" y1="305" x2="240" y2="395" stroke="#ef4444" strokeWidth="2" strokeDasharray="5 3" />
      <rect x="210" y="305" width="60" height="18" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="240" y="318" fill="#ef4444" fontSize="11" fontWeight="700" textAnchor="middle">14h30 CPI</text>

      {/* Bougies avant 14h30 — 5 bougies calmes */}

      {/* Bougie 1 — x=100 — Bull */}
      <line x1="100" y1="340" x2="100" y2="370" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="90" y="345" width="20" height="20" fill="#10b981" stroke="#059669" strokeWidth="0.8" rx="1.5" />

      {/* Bougie 2 — x=127 — Bear */}
      <line x1="127" y1="345" x2="127" y2="375" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="117" y="350" width="20" height="20" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.8" rx="1.5" />

      {/* Bougie 3 — x=154 — Bull */}
      <line x1="154" y1="343" x2="154" y2="368" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="144" y="348" width="20" height="15" fill="#10b981" stroke="#059669" strokeWidth="0.8" rx="1.5" />

      {/* Bougie 4 — x=181 — Bear */}
      <line x1="181" y1="348" x2="181" y2="373" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="171" y="353" width="20" height="15" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.8" rx="1.5" />

      {/* Bougie 5 — x=208 — Bull */}
      <line x1="208" y1="345" x2="208" y2="370" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="198" y="350" width="20" height="15" fill="#10b981" stroke="#059669" strokeWidth="0.8" rx="1.5" />

      {/* Bougie 6 — x=265 — ÉNORME bear panic */}
      <line x1="265" y1="320" x2="265" y2="400" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="255" y="325" width="20" height="70" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.8" rx="1.5" />

      {/* Bougies après la chute — continuation baissière */}

      {/* Bougie 7 — x=292 — Bear */}
      <line x1="292" y1="375" x2="292" y2="400" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="282" y="380" width="20" height="15" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.8" rx="1.5" />

      {/* Bougie 8 — x=319 — Bear */}
      <line x1="319" y1="378" x2="319" y2="400" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="309" y="383" width="20" height="12" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.8" rx="1.5" />

      {/* Bougie 9 — x=346 — Bull (rebond léger) */}
      <line x1="346" y1="375" x2="346" y2="393" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="336" y="380" width="20" height="8" fill="#10b981" stroke="#059669" strokeWidth="0.8" rx="1.5" />

      {/* Bougie 10 — x=373 — Bear */}
      <line x1="373" y1="380" x2="373" y2="400" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="363" y="385" width="20" height="10" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.8" rx="1.5" />

      {/* Bougie 11 — x=400 — Bear */}
      <line x1="400" y1="383" x2="400" y2="400" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="390" y="388" width="20" height="7" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.8" rx="1.5" />

      {/* Layer 7 — Phrase synthèse */}
      <text x="400" y="435" fill="#a1a1aa" fontSize="12" fontStyle="italic" textAnchor="middle">
        Le calendrier te dit QUAND le marché va exploser. À toi de ne pas être au mauvais endroit au mauvais moment.
      </text>

      {/* Layer 8 — Actifs impactés par les news macro */}
      <line x1="40" y1="447" x2="760" y2="447" stroke="#3f3f46" strokeWidth="1" strokeDasharray="4 4" />

      <text x="400" y="463" fill="#fbbf24" fontSize="11" fontWeight="700" letterSpacing="0.05em" textAnchor="middle">
        ACTIFS IMPACTÉS PAR LES NEWS MACRO
      </text>

      {/* Colonne 1 — Forex */}
      <rect x="65" y="473" width="10" height="10" rx="2" fill="#60a5fa" />
      <text x="80" y="482" fill="#d4d4d8" fontSize="10" textAnchor="start">Forex (EUR/USD, GBP/USD)</text>

      {/* Colonne 2 — Or */}
      <rect x="268" y="473" width="10" height="10" rx="2" fill="#fbbf24" />
      <text x="283" y="482" fill="#d4d4d8" fontSize="10" textAnchor="start">Or (XAU/USD)</text>

      {/* Colonne 3 — Indices */}
      <rect x="428" y="473" width="10" height="10" rx="2" fill="#34d399" />
      <text x="443" y="482" fill="#d4d4d8" fontSize="10" textAnchor="start">Indices US (Nasdaq, S&amp;P)</text>

      {/* Colonne 4 — Crypto */}
      <rect x="617" y="473" width="10" height="10" rx="2" fill="#f87171" />
      <text x="632" y="482" fill="#d4d4d8" fontSize="10" textAnchor="start">Crypto (BTC/USD)</text>

      {/* Pied de page */}
      <text x="400" y="500" fill="#34d399" fontSize="11" fontStyle="italic" fontWeight="700" textAnchor="middle">
        Une news macro ne touche jamais qu&apos;un seul marché.
      </text>

      {/* Layer 6 — Annotation "-150 pips en 2 min" EN DERNIER (passe par-dessus les bougies) */}
      <rect x="290" y="345" width="110" height="22" rx="3" fill="#09090b" fillOpacity="0.95" />
      <text x="295" y="362" textAnchor="start" fill="#f87171" fontSize="14" fontWeight="700">-150 pips en 2 min</text>
    </svg>
    </ChartScroller>
  );
};

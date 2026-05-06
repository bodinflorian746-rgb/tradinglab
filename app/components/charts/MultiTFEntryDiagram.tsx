export default function MultiTFEntryDiagram() {
  return (
    <svg
      viewBox="0 0 720 440"
      width="100%"
      height="auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── ZONE 1 — Titre général ── */}
      <text x="360" y="22" textAnchor="middle" fontSize="14" fontWeight="600" fill="#10b981">
        Process complet — Tendance Daily → Niveau H4 → Entrée H1
      </text>
      <text x="360" y="40" textAnchor="middle" fontSize="11" fontWeight="500" fill="#a1a1aa">
        XAU/USD
      </text>

      {/* ══════════════════════════════════════════
          PANEL 1 — DAILY (gauche)
      ══════════════════════════════════════════ */}

      {/* Encadrement */}
      <rect x="20" y="70" width="220" height="280" fill="none" stroke="#27272a" strokeWidth="1" rx="6" />

      {/* Header */}
      <text x="130" y="88" textAnchor="middle" fontSize="12" fontWeight="700" fill="#10b981">DAILY</text>
      <text x="130" y="104" textAnchor="middle" fontSize="10" fill="#a1a1aa">Le contexte</text>

      {/* Bougie D1 — bullish */}
      <line x1="58" y1="270" x2="58" y2="300" stroke="#059669" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="50" y="275" width="16" height="22" rx="2" fill="#10b981" stroke="#059669" strokeWidth="1.2" />

      {/* Bougie D2 — bullish */}
      <line x1="93" y1="240" x2="93" y2="275" stroke="#059669" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="85" y="245" width="16" height="25" rx="2" fill="#10b981" stroke="#059669" strokeWidth="1.2" />

      {/* Bougie D3 — bullish */}
      <line x1="128" y1="205" x2="128" y2="245" stroke="#059669" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="120" y="210" width="16" height="30" rx="2" fill="#10b981" stroke="#059669" strokeWidth="1.2" />

      {/* Bougie D4 — bullish */}
      <line x1="163" y1="170" x2="163" y2="210" stroke="#059669" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="155" y="180" width="16" height="25" rx="2" fill="#10b981" stroke="#059669" strokeWidth="1.2" />

      {/* Bougie D5 — bearish correction */}
      <line x1="198" y1="175" x2="198" y2="215" stroke="#b91c1c" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="190" y="185" width="16" height="20" rx="2" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.2" />

      {/* Annotation tendance ↑ */}
      <rect x="70" y="128" width="120" height="16" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="130" y="140" textAnchor="middle" fontSize="10" fontWeight="600" fill="#10b981">Tendance haussière ↑</text>

      {/* Légende prix bas panel 1 */}
      <rect x="48" y="323" width="164" height="16" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="130" y="335" textAnchor="middle" fontSize="9" fontStyle="italic" fill="#71717a">Support 4 500$ → high 4 720$</text>

      {/* ══════════════════════════════════════════
          PANEL 2 — H4 (centre)
      ══════════════════════════════════════════ */}

      {/* Encadrement */}
      <rect x="250" y="70" width="220" height="280" fill="none" stroke="#27272a" strokeWidth="1" rx="6" />

      {/* Header */}
      <text x="360" y="88" textAnchor="middle" fontSize="12" fontWeight="700" fill="#10b981">H4</text>
      <text x="360" y="104" textAnchor="middle" fontSize="10" fill="#a1a1aa">Le niveau</text>

      {/* Annotation "Retracement vers Fibo" */}
      <rect x="297" y="118" width="126" height="16" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="360" y="130" textAnchor="middle" fontSize="10" fontWeight="500" fill="#a1a1aa">Retracement vers Fibo</text>

      {/* Ligne Fibo 0.618 */}
      <line x1="270" y1="235" x2="450" y2="235" stroke="#a1a1aa" strokeWidth="1.2" strokeDasharray="5 3" />

      {/* Label Fibo H4 */}
      <rect x="268" y="216" width="114" height="16" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="270" y="228" textAnchor="start" fontSize="9" fontStyle="italic" fill="#a1a1aa">Fibo 0.618 — 4 600$</text>

      {/* H4-1 bearish */}
      <line x1="292" y1="145" x2="292" y2="180" stroke="#b91c1c" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="285" y="150" width="14" height="25" rx="2" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.2" />

      {/* H4-2 bearish */}
      <line x1="322" y1="160" x2="322" y2="200" stroke="#b91c1c" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="315" y="170" width="14" height="25" rx="2" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.2" />

      {/* H4-3 bearish */}
      <line x1="352" y1="180" x2="352" y2="215" stroke="#b91c1c" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="345" y="190" width="14" height="20" rx="2" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.2" />

      {/* H4-4 bearish */}
      <line x1="382" y1="200" x2="382" y2="240" stroke="#b91c1c" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="375" y="210" width="14" height="25" rx="2" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.2" />

      {/* H4-5 bearish petite (sans mèche) */}
      <rect x="405" y="225" width="14" height="10" rx="2" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.2" />

      {/* H4-6 bullish engulfing miniature */}
      <line x1="433" y1="205" x2="433" y2="240" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="425" y="210" width="16" height="25" rx="2" fill="#10b981" stroke="#059669" strokeWidth="1.5" />

      {/* Légende H4 */}
      <rect x="288" y="323" width="144" height="16" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="360" y="335" textAnchor="middle" fontSize="9" fontStyle="italic" fill="#71717a">Zone à surveiller : 4 600$</text>

      {/* ══════════════════════════════════════════
          PANEL 3 — H1 (droite)
      ══════════════════════════════════════════ */}

      {/* Encadrement */}
      <rect x="480" y="70" width="220" height="280" fill="none" stroke="#27272a" strokeWidth="1" rx="6" />

      {/* Header */}
      <text x="590" y="88" textAnchor="middle" fontSize="12" fontWeight="700" fill="#10b981">H1</text>
      <text x="590" y="104" textAnchor="middle" fontSize="10" fill="#a1a1aa">Le déclencheur</text>

      {/* Ligne TP emerald */}
      <line x1="500" y1="140" x2="680" y2="140" stroke="#10b981" strokeWidth="1.2" strokeDasharray="5 3" />

      {/* Label TP */}
      <rect x="498" y="121" width="58" height="16" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="500" y="133" textAnchor="start" fontSize="9" fontWeight="600" fill="#10b981">TP 4 720$</text>

      {/* Ligne Fibo zinc */}
      <line x1="500" y1="235" x2="680" y2="235" stroke="#a1a1aa" strokeWidth="1.2" strokeDasharray="5 3" />

      {/* Label Fibo H1 */}
      <rect x="498" y="216" width="66" height="16" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="500" y="228" textAnchor="start" fontSize="9" fontStyle="italic" fill="#a1a1aa">Fibo 4 600$</text>

      {/* Ligne SL red */}
      <line x1="500" y1="290" x2="680" y2="290" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="5 3" />

      {/* Label SL */}
      <rect x="498" y="271" width="58" height="16" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="500" y="283" textAnchor="start" fontSize="9" fontWeight="600" fill="#ef4444">SL 4 590$</text>

      {/* H1-1 bearish */}
      <line x1="516" y1="170" x2="516" y2="205" stroke="#b91c1c" strokeWidth="1" strokeLinecap="round" />
      <rect x="510" y="175" width="12" height="25" rx="2" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />

      {/* H1-2 bearish */}
      <line x1="541" y1="190" x2="541" y2="220" stroke="#b91c1c" strokeWidth="1" strokeLinecap="round" />
      <rect x="535" y="200" width="12" height="20" rx="2" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />

      {/* H1-3 bearish */}
      <line x1="566" y1="210" x2="566" y2="240" stroke="#b91c1c" strokeWidth="1" strokeLinecap="round" />
      <rect x="560" y="215" width="12" height="20" rx="2" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />

      {/* Engulfing A — bearish petite (1ère) */}
      <line x1="592" y1="225" x2="592" y2="220" stroke="#b91c1c" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="592" y1="235" x2="592" y2="242" stroke="#b91c1c" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="585" y="225" width="14" height="10" rx="2" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.2" />

      {/* Engulfing B — bullish qui englobe (corps dépasse A en haut ET en bas) */}
      <line x1="623" y1="215" x2="623" y2="210" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="623" y1="240" x2="623" y2="245" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="615" y="215" width="16" height="25" rx="2" fill="#10b981" stroke="#059669" strokeWidth="1.5" />

      {/* Annotation Engulfing bullish */}
      <rect x="573" y="193" width="94" height="16" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="620" y="205" textAnchor="middle" fontSize="9" fontWeight="600" fill="#10b981">Engulfing bullish</text>

      {/* Bougie de confirmation */}
      <line x1="656" y1="180" x2="656" y2="215" stroke="#059669" strokeWidth="1" strokeLinecap="round" />
      <rect x="650" y="185" width="12" height="30" rx="2" fill="#10b981" stroke="#059669" strokeWidth="1" />

      {/* ══════════════════════════════════════════
          ZONE 3 — Flèches de liaison
      ══════════════════════════════════════════ */}

      {/* Flèche 1 : Daily → H4 */}
      <line x1="200" y1="370" x2="264" y2="370" stroke="#3f3f46" strokeWidth="1.5" />
      <polygon points="270,370 264,366 264,374" fill="#3f3f46" />

      {/* Flèche 2 : H4 → H1 */}
      <line x1="440" y1="370" x2="504" y2="370" stroke="#3f3f46" strokeWidth="1.5" />
      <polygon points="510,370 504,366 504,374" fill="#3f3f46" />

      {/* ══════════════════════════════════════════
          ZONE 4 — Légende en bas
      ══════════════════════════════════════════ */}
      <rect x="145" y="403" width="430" height="16" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="360" y="415" textAnchor="middle" fontSize="11" fontWeight="500" fill="#d4d4d8">
        Setup engulfing — Entrée 4 630$ · SL 4 590$ · TP 4 720$ · R/R 2,25
      </text>
    </svg>
  );
}

export default function PinBarSetupDiagram() {
  return (
    <div>
    <svg
      viewBox="0 0 720 440"
      width="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hidden sm:block"
    >
      {/* ── 1. Titre ── */}
      <text x="360" y="28" textAnchor="middle" fontSize="16" fontWeight="600" fill="#10b981">
        Pin bar bullish au support — XAU/USD H4
      </text>

      {/* ── 2. Axe vertical gauche ── */}
      <line x1="80" y1="65" x2="80" y2="375" stroke="#27272a" strokeWidth="1" />

      {/* Labels prix axe gauche — pastilles + texte */}

      {/* 4 650$ — niveau TP */}
      <rect x="22" y="69" width="56" height="14" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="72" y="80" textAnchor="end" fontSize="11" fill="#a1a1aa">4 650$</text>

      {/* 4 520$ — niveau entrée */}
      <rect x="22" y="169" width="56" height="14" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="72" y="180" textAnchor="end" fontSize="11" fill="#a1a1aa">4 520$</text>

      {/* 4 500$ — niveau support */}
      <rect x="22" y="199" width="56" height="14" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="72" y="210" textAnchor="end" fontSize="11" fill="#a1a1aa">4 500$</text>

      {/* 4 470$ — niveau SL */}
      <rect x="22" y="309" width="56" height="14" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="72" y="320" textAnchor="end" fontSize="11" fill="#a1a1aa">4 470$</text>

      {/* ── 4. Ligne TP (emerald-500) ── */}
      <line x1="120" y1="80" x2="680" y2="80" stroke="#10b981" strokeWidth="1.5" strokeDasharray="6 4" />
      <rect x="562" y="72" width="154" height="14" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="715" y="83" textAnchor="end" fontSize="11" fill="#10b981">TP — Résistance 4 650$</text>

      {/* ── 3. Ligne Support (zinc-400) ── */}
      <line x1="120" y1="210" x2="680" y2="210" stroke="#a1a1aa" strokeWidth="1.5" strokeDasharray="6 4" />
      <rect x="613" y="202" width="104" height="14" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="715" y="213" textAnchor="end" fontSize="11" fill="#a1a1aa">Support 4 500$</text>

      {/* ── 5. Ligne SL (red-500) ── */}
      <line x1="120" y1="320" x2="680" y2="320" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6 4" />
      <rect x="649" y="312" width="68" height="14" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="715" y="323" textAnchor="end" fontSize="11" fill="#ef4444">SL 4 470$</text>

      {/* ── 6. Bougies bearish de contexte — approche du support ── */}

      {/* Bearish 1 */}
      <line x1="169" y1="130" x2="169" y2="200" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="160" y="145" width="18" height="45" rx="2" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />

      {/* Bearish 2 */}
      <line x1="214" y1="160" x2="214" y2="215" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="205" y="170" width="18" height="40" rx="2" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />

      {/* Bearish 3 */}
      <line x1="259" y1="180" x2="259" y2="220" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="250" y="190" width="18" height="25" rx="2" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />

      {/* ── 7. Pin bar bullish (élément central) ── */}

      {/* Mèche basse longue — perce sous le support */}
      <line x1="331" y1="290" x2="331" y2="180" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      {/* Mèche haute courte */}
      <line x1="331" y1="180" x2="331" y2="170" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      {/* Corps petit bullish */}
      <rect x="320" y="170" width="22" height="15" rx="2" fill="#10b981" stroke="#059669" strokeWidth="1.5" />
      {/* Annotation "Pin bar" */}
      <rect x="299" y="149" width="64" height="14" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="331" y="160" textAnchor="middle" fontSize="11" fontWeight="600" fill="#10b981">Pin bar</text>

      {/* ── 8. Bougie de confirmation bullish ── */}
      <line x1="389" y1="140" x2="389" y2="180" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="380" y="140" width="18" height="40" rx="2" fill="#10b981" stroke="#059669" strokeWidth="1.5" />

      {/* ── 9. Bougie target bullish — vers le TP ── */}
      <line x1="434" y1="100" x2="434" y2="145" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="425" y="100" width="18" height="45" rx="2" fill="#10b981" stroke="#059669" strokeWidth="1.5" />

      {/* ── 10. Annotation Entrée ── */}
      {/* Flèche pointant vers la gauche (vers la pin bar) */}
      <line x1="456" y1="185" x2="406" y2="185" stroke="#10b981" strokeWidth="1.5" />
      <path
        d="M412 181 L406 185 L412 189"
        stroke="#10b981"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Pastille + texte */}
      <rect x="458" y="179" width="97" height="14" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="462" y="190" textAnchor="start" fontSize="11" fontWeight="600" fill="#10b981">Entrée 4 520$</text>

      {/* ── 11. Annotation mèche longue ── */}
      <rect x="224" y="299" width="214" height="14" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="331" y="310" textAnchor="middle" fontSize="10" fontStyle="italic" fill="#71717a">
        Mèche longue = rejet vendeurs
      </text>

      {/* ── 12. Légende bas ── */}
      <rect x="204" y="399" width="312" height="14" rx="3" fill="#09090b" fillOpacity="0.85" />
      <text x="360" y="410" textAnchor="middle" fontSize="12" fontWeight="500" fill="#d4d4d8">
        Risque 50$ · Gain potentiel 130$ · R/R 2,6
      </text>
    </svg>

    {/* MOBILE : setup Pin bar bullish au support — XAU/USD H4 ────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
      <p className="text-[14px] font-bold text-emerald-400 text-center leading-snug">
        Pin bar bullish au support — XAU/USD H4
      </p>

      <div className="space-y-2">
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-2.5 flex justify-between items-center">
          <span className="text-[12px] text-emerald-400/80 uppercase font-bold tracking-wider">Take Profit</span>
          <span className="text-[15px] font-mono font-bold text-emerald-400">4 650 $</span>
        </div>
        <div className="rounded-lg bg-zinc-800 border border-zinc-700 p-2.5 flex justify-between items-center">
          <span className="text-[12px] text-zinc-300 uppercase font-bold tracking-wider">Entrée</span>
          <span className="text-[15px] font-mono font-bold text-white">4 520 $</span>
        </div>
        <div className="rounded-lg bg-zinc-800/60 border border-zinc-700 p-2.5 flex justify-between items-center">
          <span className="text-[12px] text-zinc-400 uppercase font-bold tracking-wider">Support</span>
          <span className="text-[14px] font-mono font-semibold text-zinc-300">4 500 $</span>
        </div>
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-2.5 flex justify-between items-center">
          <span className="text-[12px] text-red-400/80 uppercase font-bold tracking-wider">Stop Loss</span>
          <span className="text-[15px] font-mono font-bold text-red-400">4 470 $</span>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-700 bg-zinc-800/30 p-2.5 text-center space-y-1">
        <p className="text-[13px] text-zinc-300">
          <span className="text-red-400 font-bold">Risque 50 $</span> · <span className="text-emerald-400 font-bold">Gain 130 $</span>
        </p>
        <p className="text-[15px] font-bold text-emerald-400">R/R = 2,6</p>
      </div>

      <p className="text-[12px] text-zinc-400 italic text-center leading-snug pt-2 border-t border-zinc-800">
        Mèche longue sous le support = rejet vendeurs → entrée sur retour au-dessus du support.
      </p>
    </div>
    </div>
  );
}

export default function BullishVsBearishEngulfingDiagram({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 400"
      className="hidden sm:block w-full h-auto"
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        Engulfing — toujours sur un niveau
      </text>

      <line x1="400" y1="40" x2="400" y2="370" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ PANEL GAUCHE — Bullish engulfing sur support ═══ */}
      <rect x="60" y="50" width="280" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="200" y="65" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">Bullish engulfing sur support</text>

      <line x1="50" y1="280" x2="380" y2="280" stroke="#10b981" strokeWidth="1.2" strokeDasharray="5 3" />
      <rect x="52" y="286" width="100" height="12" rx="2" fill="#09090b" />
      <text x="55" y="295" fill="#10b981" fontSize="9" fontWeight="600">Support 4 540$</text>

      {/* Bougies rouges descendantes */}
      <line x1="100" y1="160" x2="100" y2="220" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="93" y="170" width="14" height="40" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />
      <line x1="140" y1="190" x2="140" y2="250" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="133" y="200" width="14" height="45" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />
      <line x1="180" y1="225" x2="180" y2="280" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="173" y="240" width="14" height="35" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      {/* Bougie rouge petite + grosse bougie verte englobante au support */}
      <line x1="220" y1="265" x2="220" y2="290" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="213" y="270" width="14" height="15" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      <line x1="260" y1="180" x2="260" y2="295" stroke="#059669" strokeWidth="2" />
      <rect x="250" y="220" width="20" height="65" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="2" />

      {/* Rebond bougies vertes */}
      <line x1="300" y1="150" x2="300" y2="220" stroke="#059669" strokeWidth="1.5" />
      <rect x="293" y="155" width="14" height="55" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />
      <line x1="340" y1="110" x2="340" y2="170" stroke="#059669" strokeWidth="1.5" />
      <rect x="333" y="115" width="14" height="45" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      {/* ═══ PANEL DROIT — Bearish engulfing sur résistance ═══ */}
      <rect x="460" y="50" width="280" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="600" y="65" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">Bearish engulfing sur résistance</text>

      <line x1="450" y1="120" x2="780" y2="120" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="5 3" />
      <rect x="452" y="104" width="118" height="12" rx="2" fill="#09090b" />
      <text x="455" y="113" fill="#ef4444" fontSize="9" fontWeight="600">Résistance 4 700$</text>

      {/* Bougies vertes montantes */}
      <line x1="500" y1="180" x2="500" y2="240" stroke="#059669" strokeWidth="1.5" />
      <rect x="493" y="190" width="14" height="40" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />
      <line x1="540" y1="150" x2="540" y2="210" stroke="#059669" strokeWidth="1.5" />
      <rect x="533" y="155" width="14" height="45" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />
      <line x1="580" y1="120" x2="580" y2="175" stroke="#059669" strokeWidth="1.5" />
      <rect x="573" y="125" width="14" height="35" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      {/* Bougie verte petite + grosse rouge englobante à la résistance */}
      <line x1="620" y1="110" x2="620" y2="140" stroke="#059669" strokeWidth="1.5" />
      <rect x="613" y="115" width="14" height="20" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      <line x1="660" y1="105" x2="660" y2="220" stroke="#b91c1c" strokeWidth="2" />
      <rect x="650" y="125" width="20" height="80" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" rx="2" />

      {/* Chute bougies rouges */}
      <line x1="700" y1="200" x2="700" y2="270" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="693" y="210" width="14" height="55" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />
      <line x1="740" y1="240" x2="740" y2="310" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="733" y="250" width="14" height="55" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      <text x="400" y="385" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        Sans niveau structurel, l&apos;engulfing perd 70% de son taux de réussite
      </text>
    </svg>

    {/* MOBILE : Bullish vs Bearish engulfing ─────────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">Engulfing — toujours sur un niveau</p>
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
        <p className="text-[13px] font-bold text-emerald-400">Bullish engulfing AU SUPPORT</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">
          Après une chute, une grosse bougie verte avale la rouge précédente sur le <span className="font-bold text-emerald-400">support 4 540 $</span> → rebond probable.
        </p>
      </div>
      <div className="rounded-lg border border-red-500/40 bg-red-500/8 p-3">
        <p className="text-[13px] font-bold text-red-400">Bearish engulfing À LA RÉSISTANCE</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">
          Après une hausse, une grosse bougie rouge avale la verte précédente sur la <span className="font-bold text-red-400">résistance</span> → chute probable.
        </p>
      </div>
      <p className="text-[13px] text-amber-400 font-bold text-center pt-2 border-t border-zinc-800 leading-snug">
        ⚠ Sans niveau structurel, l'engulfing perd 70% de son taux de réussite
      </p>
    </div>
    </div>
  );
}

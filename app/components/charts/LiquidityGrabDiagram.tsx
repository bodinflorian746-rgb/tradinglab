export function LiquidityGrabDiagram({ className = "", locale = "fr" }: { className?: string; locale?: "fr" | "es" }) {
  const t = locale === "es"
    ? {
        title: "Liquidity grab — el sweep antes del verdadero movimiento",
        sweep: "Sweep",
        rejet: "Rechazo bajo el nivel",
        retournement: "Reversión",
        equalHighs: "Equal highs (BSL)",
        caption: "El sweep barre los stops antes del verdadero movimiento institucional",
        mobileTitle: "Liquidity grab — el sweep antes del verdadero movimiento",
        m1Part1: "Cluster de stops formado por encima de los ",
        m1Bold: "equal highs",
        m1Part2: " (liquidez visible).",
        m2Part1: "Una mecha penetra el nivel para ",
        m2Bold: "disparar los stops",
        m2Part2: " — sweep institucional.",
        m3Part1: "Una vez absorbida la liquidez, el precio ",
        m3Bold: "vuelve en sentido opuesto",
        m3Part2: ".",
        mobileFooter: "El sweep barre los stops antes del verdadero movimiento institucional.",
      }
    : {
        title: "Liquidity grab — le sweep avant le vrai mouvement",
        sweep: "Sweep",
        rejet: "Rejet sous le niveau",
        retournement: "Retournement",
        equalHighs: "Equal highs (BSL)",
        caption: "Le sweep balaie les stops avant le vrai mouvement institutionnel",
        mobileTitle: "Liquidity grab — le sweep avant le vrai mouvement",
        m1Part1: "Cluster de stops formé au-dessus des ",
        m1Bold: "equal highs",
        m1Part2: " (liquidité visible).",
        m2Part1: "Une mèche perce le niveau pour ",
        m2Bold: "déclencher les stops",
        m2Part2: " — sweep institutionnel.",
        m3Part1: "Une fois la liquidité absorbée, le prix ",
        m3Bold: "repart dans le sens opposé",
        m3Part2: ".",
        mobileFooter: "Le sweep balaie les stops avant le vrai mouvement institutionnel.",
      };
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 420"
      className="hidden sm:block w-full h-auto"
    >
      {/* Titre */}
      <text x="400" y="28" fill="#ffffff" fontSize="12" fontWeight="600" textAnchor="middle">
        {t.title}
      </text>

      {/* Zone liquidité — cluster de stops au-dessus des equal highs */}
      <rect x="180" y="125" width="160" height="25" fill="rgba(239,68,68,0.10)" stroke="#ef4444" strokeDasharray="3 2" strokeWidth="1" strokeOpacity="0.5" />

      {/* Ligne pointillée des equal highs */}
      <line x1="60" y1="150" x2="740" y2="150" stroke="#ef4444" strokeDasharray="5 3" strokeWidth="1.5" />

      {/* Path continuation grise (chute après retournement) */}
      <path d="M480,300 L520,330 L560,350" stroke="#71717a" strokeWidth="1.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      {/* ═══ 8 bougies (mèche puis corps pour chaque, corps plein entier 20px de large) ═══ */}

      {/* B1 bullish cx=110 — corps y=260-300, mèches y=250 / y=310 */}
      <line x1="110" y1="250" x2="110" y2="310" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="100" y="260" width="20" height="40" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      {/* B2 bullish cx=160 — corps y=200-260, mèches y=190 / y=270 */}
      <line x1="160" y1="190" x2="160" y2="270" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="150" y="200" width="20" height="60" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      {/* B3 bullish cx=210 — atteint le 1er equal high (mèche haute touche y=150), corps y=160-200, mèche basse y=210 */}
      <line x1="210" y1="150" x2="210" y2="210" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="200" y="160" width="20" height="40" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      {/* B4 bearish cx=260 — léger recul, corps y=170-210, mèches y=160 / y=220 */}
      <line x1="260" y1="160" x2="260" y2="220" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="250" y="170" width="20" height="40" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      {/* B5 bullish cx=310 — re-touche le 2e equal high (mèche haute y=150), corps y=165-210, mèche basse y=220 */}
      <line x1="310" y1="150" x2="310" y2="220" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="300" y="165" width="20" height="45" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      {/* B6 LE SWEEP bearish cx=360 — mèche haute PERCE jusqu'à y=110 (au-dessus de la ligne y=150), petit corps y=165-185 SOUS la ligne, mèche basse y=195 */}
      <line x1="360" y1="110" x2="360" y2="195" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="350" y="165" width="20" height="20" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      {/* B7 bearish cx=410 — retournement, corps y=185-240, mèches y=175 / y=250 */}
      <line x1="410" y1="175" x2="410" y2="250" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="400" y="185" width="20" height="55" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      {/* B8 bearish cx=460 — chute, corps y=240-300, mèches y=230 / y=310 */}
      <line x1="460" y1="230" x2="460" y2="310" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="450" y="240" width="20" height="60" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      {/* ═══ Pastilles + pointers ═══ */}

      {/* Pastille "Sweep" — déportée droite, trait vers mèche haute B6 (360, 110) */}
      <line x1="640" y1="120" x2="370" y2="110" stroke="#ef4444" strokeDasharray="3 2" strokeWidth="1" strokeOpacity="0.6" />
      <rect x="640" y="109" width="50" height="22" rx="10" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="665" y="124" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">{t.sweep}</text>

      {/* Pastille "Rejet sous le niveau" — déportée droite, trait vers corps B6 */}
      <line x1="640" y1="175" x2="370" y2="175" stroke="#ef4444" strokeDasharray="3 2" strokeWidth="1" strokeOpacity="0.6" />
      <rect x="640" y="164" width="130" height="22" rx="10" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="705" y="179" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">{t.rejet}</text>

      {/* Pastille "Retournement" — déportée droite, trait vers B7/B8 */}
      <line x1="640" y1="260" x2="435" y2="260" stroke="#ef4444" strokeDasharray="3 2" strokeWidth="1" strokeOpacity="0.6" />
      <rect x="640" y="249" width="90" height="22" rx="10" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="685" y="264" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">{t.retournement}</text>

      {/* ═══ EN FIN — Halo + label "Equal highs (BSL)" repositionné au-dessus de la zone teintée ═══ */}
      <rect x="200" y="103" width="120" height="14" rx="3" fill="#09090b" />
      <text x="260" y="113" fill="#ef4444" fontSize="10" textAnchor="middle">{t.equalHighs}</text>

      {/* Caption bas */}
      <text x="400" y="405" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        {t.caption}
      </text>
    </svg>

    {/* MOBILE : liquidity grab mécanique ──────────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
      <p className="text-[14px] font-bold text-red-400 text-center">{t.mobileTitle}</p>
      {/* Mini-SVG : equal highs + stops cluster + mèche sweep + retournement bearish */}
      <svg viewBox="0 0 280 130" className="w-full h-auto" aria-label="Liquidity grab" fill="none">
        {/* Ligne equal highs */}
        <line x1="15" y1="40" x2="265" y2="40" stroke="#ef4444" strokeWidth="0.9" strokeDasharray="3 2" />
        <text x="20" y="35" fontSize="8" fill="#ef4444" fontWeight="600">Equal highs</text>
        {/* Cluster de stops (triangles rouges) au-dessus */}
        <path d="M120,32 L125,24 L130,32 Z" fill="#ef4444" opacity="0.7" />
        <path d="M135,32 L140,24 L145,32 Z" fill="#ef4444" opacity="0.7" />
        <path d="M150,32 L155,24 L160,32 Z" fill="#ef4444" opacity="0.7" />
        {/* Path approche : 2 tops sur equal highs */}
        <path d="M15,90 L40,70 L65,40 L85,60 L110,40 L130,55"
          stroke="#71717a" strokeWidth="1.6" fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {/* La bougie sweep : mèche perce au-dessus, corps repasse sous */}
        <line x1="140" y1="15" x2="140" y2="60" stroke="#b91c1c" strokeWidth="1.2" />
        <rect x="135" y="45" width="10" height="15" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.6" rx="1" />
        {/* Flèche sweep amber pointant la mèche */}
        <line x1="180" y1="20" x2="148" y2="18" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
        <rect x="180" y="13" width="50" height="14" rx="3" fill="#f59e0b18" stroke="#f59e0b" strokeWidth="0.6" />
        <text x="205" y="22" fontSize="8" fill="#f59e0b" textAnchor="middle" fontWeight="700">Sweep</text>
        {/* Retournement bearish après sweep */}
        <path d="M145,60 L170,80 L195,100 L225,118 L260,125"
          stroke="#ef4444" strokeWidth="1.8" fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M255,120 L262,125 L257,128" stroke="#ef4444" strokeWidth="1.2" fill="none" />
      </svg>
      <ul className="space-y-2 text-[13px]">
        <li className="flex items-start gap-2.5">
          <span className="shrink-0 w-5 h-5 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center text-[11px] font-bold text-amber-400 mt-0.5">1</span>
          <span className="text-zinc-300">{t.m1Part1}<span className="font-bold text-red-400">{t.m1Bold}</span>{t.m1Part2}</span>
        </li>
        <li className="flex items-start gap-2.5">
          <span className="shrink-0 w-5 h-5 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-[11px] font-bold text-red-400 mt-0.5">2</span>
          <span className="text-zinc-300">{t.m2Part1}<span className="font-bold text-red-400">{t.m2Bold}</span>{t.m2Part2}</span>
        </li>
        <li className="flex items-start gap-2.5">
          <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-[11px] font-bold text-emerald-400 mt-0.5">3</span>
          <span className="text-zinc-300">{t.m3Part1}<span className="font-bold text-emerald-400">{t.m3Bold}</span>{t.m3Part2}</span>
        </li>
      </ul>
      <p className="text-[13px] text-zinc-400 italic text-center pt-2 border-t border-zinc-800 leading-snug">
        {t.mobileFooter}
      </p>
    </div>
    </div>
  );
}

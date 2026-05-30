export default function InvalidationDiagram({ className = "", locale = "fr" }: { className?: string; locale?: "fr" | "es" }) {
  const isEs = locale === "es";
  const L = {
    setupInvalid: isEs ? "Setup invalidado — cortar" : "Setup invalidé — couper",
    resistance:   isEs ? "Resistencia" : "Résistance",
    neckline:     "Neckline",
    slInit:       isEs ? "SL inicial" : "SL initial",
    peak1:        isEs ? "Pico 1" : "Sommet 1",
    peak2:        isEs ? "Pico 2" : "Sommet 2",
    entryShort:   isEs ? "Entrada short" : "Entrée short",
    patternInv:   isEs ? "Patrón invalidado" : "Pattern invalidé",
    violentRej:   isEs ? "Vela de rechazo violenta" : "Bougie de rejet violente",
    footer:       isEs ? "Double Top → ruptura neckline → re-ruptura por arriba = patrón fallido" : "Double Top → cassure neckline → re-cassure par le haut = pattern échoué",
    mobInvalid:   isEs ? "⚠ Setup invalidado — cortar" : "⚠ Setup invalidé — couper",
    mob1:         isEs ? "Double Top formado, ruptura de la neckline → short tomado." : "Double Top formé, cassure de la neckline → short pris.",
    mob2A:        isEs ? "El precio rebota y" : "Le prix remonte et",
    mob2Bold:     isEs ? "re-rompe la neckline por arriba" : "re-casse la neckline par le haut",
    mob2End:      isEs ? "→ patrón fallido." : "→ pattern échoué.",
    mob3:         isEs ? "Cortar de inmediato — sin esperar el SL." : "Couper immédiatement — sans attendre le SL.",
  };
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 300"
      className="hidden sm:block w-full h-auto"
    >
      {/* Badge top droit — Setup invalidé */}
      <rect x="410" y="15" width="170" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="495" y="30" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">
        {L.setupInvalid}
      </text>

      {/* Niveau résistance */}
      <line x1="10" y1="80" x2="590" y2="80" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="20" y="72" fill="#ef4444" fontSize="10" fontWeight="600">{L.resistance}</text>

      {/* Niveau neckline */}
      <line x1="10" y1="170" x2="590" y2="170" stroke="#a1a1aa" strokeWidth="1.5" strokeDasharray="3 3" />
      <text x="20" y="185" fill="#a1a1aa" fontSize="10" fontWeight="600">{L.neckline}</text>

      {/* SL initial — descendu de 12px pour s'aligner avec la ligne pointillée et se détacher de la pastille top */}
      <line x1="300" y1="55" x2="590" y2="55" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
      <rect x="536" y="50" width="56" height="14" rx="3" fill="#09090b" />
      <text x="586" y="61" fill="#ef4444" fontSize="8" fontWeight="600" textAnchor="end">{L.slInit}</text>

      {/* Path du prix — Double Top → cassure neckline → re-cassure violente */}
      <path
        d="M20,250 L80,120 L120,80 L180,170 L240,80 L300,190 L330,200 L360,170 L380,100 L440,70 L500,50 L580,40"
        stroke="#71717a"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Bougie rouge "Entrée short" — corps 16×36 centré sur la neckline y=170 (open 152, close 188), mèches ~14px (haute 138→152, basse 188→202) */}
      <line x1="300" y1="138" x2="300" y2="202" stroke="#b91c1c" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="292" y="152" width="16" height="36" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      {/* Bougie verte "Bougie de rejet violente" — corps 16×70 (y=100-170), mèches ~14px (haute 86→100, basse 170→184) */}
      <line x1="370" y1="86" x2="370" y2="184" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="362" y="100" width="16" height="70" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      {/* Halos décoratifs — déplacés aux extrémités des mèches pour ne plus déformer les corps */}
      <circle cx="300" cy="202" r="12" fill="#ef4444" opacity="0.3" />
      <circle cx="370" cy="86" r="12" fill="#10b981" opacity="0.3" />

      {/* Cercles clés — sommets 1/2 conservés, markers entrée short et rejet déplacés aux extrémités des mèches */}
      <circle cx="120" cy="80" r="4" fill="#ef4444" />
      <circle cx="240" cy="80" r="4" fill="#ef4444" />
      <circle cx="300" cy="202" r="6" fill="#ef4444" />
      <circle cx="370" cy="86" r="6" fill="#10b981" />

      {/* Pastille Sommet 1 */}
      <rect x="105" y="58" width="50" height="14" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="0.8" />
      <text x="130" y="68" fill="#d4d4d8" fontSize="8" textAnchor="middle">{L.peak1}</text>

      {/* Pastille Sommet 2 */}
      <rect x="225" y="58" width="50" height="14" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="0.8" />
      <text x="250" y="68" fill="#d4d4d8" fontSize="8" textAnchor="middle">{L.peak2}</text>

      {/* Pastille Entrée short */}
      <rect x="290" y="208" width="60" height="14" rx="4" fill="#ef444433" stroke="#ef4444" strokeWidth="0.8" />
      <text x="320" y="218" fill="#ef4444" fontSize="8" fontWeight="600" textAnchor="middle">{L.entryShort}</text>

      {/* Pastille Pattern invalidé — déplacée plus haut (y=105) pour espacer de "Bougie de rejet violente" (y=160) — gap 41px */}
      <rect x="420" y="105" width="90" height="14" rx="4" fill="#09090b" />
      <rect x="420" y="105" width="90" height="14" rx="4" fill="#10b98133" stroke="#10b981" strokeWidth="0.8" />
      <text x="465" y="115" fill="#10b981" fontSize="8" fontWeight="600" textAnchor="middle">{L.patternInv}</text>
      <line x1="420" y1="119" x2="385" y2="135" stroke="#10b981" strokeWidth="0.8" strokeDasharray="2 2" />

      {/* Pastille Bougie de rejet violente — repositionnée à droite avec halo */}
      <rect x="440" y="160" width="120" height="14" rx="4" fill="#09090b" />
      <rect x="440" y="160" width="120" height="14" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="0.8" />
      <text x="500" y="170" fill="#d4d4d8" fontSize="8" textAnchor="middle">{L.violentRej}</text>
      <line x1="440" y1="168" x2="380" y2="155" stroke="#71717a" strokeWidth="0.8" strokeDasharray="2 2" />

      {/* Légende basse */}
      <text x="300" y="290" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        {L.footer}
      </text>
    </svg>

    {/* MOBILE : setup invalidé ────────────────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
      {/* Mini-SVG : zone setup + entrée + SL franchi = invalidation */}
      <svg viewBox="0 0 280 120" className="w-full h-auto" aria-label="Setup invalidation" fill="none">
        {/* Neckline */}
        <line x1="15" y1="55" x2="265" y2="55" stroke="#a1a1aa" strokeWidth="0.8" strokeDasharray="3 3" />
        <text x="20" y="50" fontSize="8" fill="#a1a1aa" fontWeight="600">Neckline</text>
        {/* SL initial line */}
        <line x1="15" y1="28" x2="265" y2="28" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />
        <text x="262" y="24" fontSize="8" fill="#ef4444" fontWeight="600" textAnchor="end">SL</text>
        {/* Prix : Double Top → cassure neckline → re-cassure violente au-dessus du SL */}
        <path d="M15,90 L45,40 L75,55 L105,40 L135,75 L160,80 L185,55 L210,30 L240,15 L262,10"
          stroke="#71717a" strokeWidth="1.6" fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {/* Bougie de rejet violente */}
        <line x1="200" y1="20" x2="200" y2="62" stroke="#059669" strokeWidth="1" />
        <rect x="195" y="30" width="10" height="25" fill="#10b981" stroke="#059669" strokeWidth="0.6" rx="1" />
        {/* Croix rouge sur l'entrée short */}
        <circle cx="135" cy="75" r="3" fill="#ef4444" />
        {/* Badge "Setup invalidé" */}
        <rect x="80" y="98" width="120" height="15" rx="3" fill="#ef444418" stroke="#ef4444" strokeWidth="0.7" />
        <text x="140" y="108" fontSize="9" fill="#ef4444" textAnchor="middle" fontWeight="700">Pattern invalidé</text>
      </svg>
      <div className="rounded-xl border-2 border-red-500 bg-red-500/10 p-3 text-center">
        <p className="text-[14px] font-bold text-red-400">{L.mobInvalid}</p>
      </div>
      <ul className="space-y-2 text-[13px]">
        <li className="flex items-start gap-2.5">
          <span className="shrink-0 w-5 h-5 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center text-[11px] font-bold text-amber-400 mt-0.5">1</span>
          <span className="text-zinc-300">{L.mob1}</span>
        </li>
        <li className="flex items-start gap-2.5">
          <span className="shrink-0 w-5 h-5 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-[11px] font-bold text-red-400 mt-0.5">2</span>
          <span className="text-zinc-300">{L.mob2A} <span className="font-bold text-red-400">{L.mob2Bold}</span> {L.mob2End}</span>
        </li>
        <li className="flex items-start gap-2.5">
          <span className="shrink-0 w-5 h-5 rounded-full bg-zinc-700 border border-zinc-500 flex items-center justify-center text-[11px] font-bold text-zinc-300 mt-0.5">3</span>
          <span className="text-zinc-300">{L.mob3}</span>
        </li>
      </ul>
    </div>
    </div>
  );
}

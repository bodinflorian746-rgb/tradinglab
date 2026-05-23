export default function PinBarFailureDiagram({ className = "", locale = "fr" }: { className?: string; locale?: "fr" | "es" }) {
  const t = locale === "es"
    ? {
        title: "Pin bar válida pero setup invalidado",
        slBadge: "SL alcanzado — pin bar inválida",
        miniRebound: "Mini-rebote fallido",
        slHit: "SL alcanzado a 4 470$",
        tpLabel: "TP 4 650$",
        entryLabel: "Entrada 4 520$",
        supportLabel: "Soporte 4 500$",
        slLabel: "SL 4 470$",
        footer: "Incluso una pin bar válida puede fallar. El SL está ahí para eso.",
        mobileTitle: "Pin bar válida pero setup invalidado",
        step1Tag: "Paso 1",
        step1: "Pin bar bullish en el soporte 4 500 $",
        step2Tag: "Paso 2",
        step2: "Mini-rebote de 2-3 velas → luego fallo",
        step3Tag: "Paso 3",
        step3: "Ruptura bajista del soporte → SL alcanzado a 4 470 $",
        mobileFooter1: "Incluso una pin bar válida puede fallar. ",
        mobileFooter2: "El SL está ahí para eso.",
      }
    : {
        title: "Pin bar valide mais setup invalidé",
        slBadge: "SL touché — pin bar invalide",
        miniRebound: "Mini-rebond raté",
        slHit: "SL touché à 4 470$",
        tpLabel: "TP 4 650$",
        entryLabel: "Entrée 4 520$",
        supportLabel: "Support 4 500$",
        slLabel: "SL 4 470$",
        footer: "Même un pin bar valide peut échouer. Le SL est là pour ça.",
        mobileTitle: "Pin bar valide mais setup invalidé",
        step1Tag: "Étape 1",
        step1: "Pin bar bullish au support 4 500 $",
        step2Tag: "Étape 2",
        step2: "Mini-rebond de 2-3 bougies → puis échec",
        step3Tag: "Étape 3",
        step3: "Cassure baissière du support → SL touché à 4 470 $",
        mobileFooter1: "Même un pin bar valide peut échouer. ",
        mobileFooter2: "Le SL est là pour ça.",
      };

  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 400"
      className="hidden sm:block w-full h-auto"
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        {t.title}
      </text>

      <rect x="560" y="40" width="220" height="22" rx="11" fill="#ef444420" stroke="#ef4444" strokeWidth="1" />
      <text x="670" y="55" fill="#ef4444" fontSize="10" fontWeight="600" textAnchor="middle">{t.slBadge}</text>

      {/* Niveau TP */}
      <line x1="50" y1="130" x2="750" y2="130" stroke="#10b981" strokeWidth="1.2" strokeDasharray="5 3" />

      {/* Niveau entrée */}
      <line x1="50" y1="240" x2="750" y2="240" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" />

      {/* Niveau support */}
      <line x1="50" y1="250" x2="750" y2="250" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

      {/* Niveau SL — renforcé */}
      <line x1="50" y1="300" x2="750" y2="300" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 3" />

      {/* Bougies descendantes vers support */}
      <line x1="150" y1="170" x2="150" y2="230" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="143" y="180" width="14" height="45" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />
      <line x1="190" y1="200" x2="190" y2="250" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="183" y="210" width="14" height="40" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      {/* Pin bar bullish au support */}
      <line x1="230" y1="235" x2="230" y2="290" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <rect x="222" y="235" width="16" height="12" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="1" />
      <circle cx="230" cy="247" r="6" fill="#10b981" opacity="0.5" />

      {/* Rebond initial (3 bougies vertes) puis échec */}
      <line x1="270" y1="210" x2="270" y2="245" stroke="#059669" strokeWidth="1.5" />
      <rect x="263" y="215" width="14" height="30" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />
      <line x1="310" y1="195" x2="310" y2="230" stroke="#059669" strokeWidth="1.5" />
      <rect x="303" y="200" width="14" height="30" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      {/* Pastille Mini-rebond raté pointant le sommet du faux rebond */}
      <line x1="310" y1="190" x2="335" y2="155" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="2 2" />
      <rect x="280" y="138" width="110" height="18" rx="4" fill="#f59e0b20" stroke="#f59e0b" strokeWidth="0.8" />
      <text x="335" y="150" fill="#f59e0b" fontSize="9" fontWeight="600" textAnchor="middle">{t.miniRebound}</text>

      {/* Retour baissier qui casse le support et atteint le SL */}
      <line x1="350" y1="210" x2="350" y2="260" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="343" y="215" width="14" height="40" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />
      <line x1="390" y1="240" x2="390" y2="290" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="383" y="250" width="14" height="35" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />
      <line x1="430" y1="270" x2="430" y2="310" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="423" y="280" width="14" height="25" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      {/* Bougie qui perce le SL — corps clôture sous le niveau */}
      <line x1="470" y1="290" x2="470" y2="335" stroke="#b91c1c" strokeWidth="2" />
      <rect x="462" y="305" width="16" height="25" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" rx="1" />

      {/* Continuation baissière sous le SL */}
      <line x1="510" y1="320" x2="510" y2="355" stroke="#b91c1c" strokeWidth="1.5" />
      <rect x="503" y="325" width="14" height="28" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" rx="1" />

      {/* Pastille SL touché — annotation bold rouge */}
      <line x1="485" y1="312" x2="560" y2="295" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="2 2" />
      <rect x="560" y="285" width="180" height="22" rx="4" fill="#ef444433" stroke="#ef4444" strokeWidth="1.2" />
      <text x="650" y="300" fill="#ef4444" fontSize="10" fontWeight="700" textAnchor="middle">{t.slHit}</text>

      {/* Labels de niveaux avec halos opaques — placés en fin de svg pour rester au-dessus des paths/bougies */}
      <rect x="51" y="114" width="78" height="14" fill="#09090b" rx="3" />
      <text x="55" y="125" fill="#10b981" fontSize="9" fontWeight="600">{t.tpLabel}</text>
      <rect x="51" y="224" width="99" height="14" fill="#09090b" rx="3" />
      <text x="55" y="235" fill="#10b981" fontSize="9" fontWeight="600">{t.entryLabel}</text>
      <rect x="51" y="254" width="106" height="14" fill="#09090b" rx="3" />
      <text x="55" y="265" fill="#10b981" fontSize="9" fontWeight="600">{t.supportLabel}</text>
      <rect x="51" y="304" width="78" height="14" fill="#09090b" rx="3" />
      <text x="55" y="315" fill="#ef4444" fontSize="9" fontWeight="600">{t.slLabel}</text>

      <text x="400" y="385" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        {t.footer}
      </text>
    </svg>

    {/* MOBILE : échec de pin bar ────────────────────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
      <p className="text-[14px] font-bold text-red-400 text-center">{t.mobileTitle}</p>
      <div className="space-y-2">
        <div className="rounded-lg bg-emerald-500/8 border border-emerald-500/30 p-2.5 text-center">
          <p className="text-[11px] text-emerald-400 uppercase font-bold tracking-wider">{t.step1Tag}</p>
          <p className="text-[13px] text-white mt-1">{t.step1}</p>
        </div>
        <p className="text-center text-zinc-600 text-[14px]">↓</p>
        <div className="rounded-lg bg-amber-400/8 border border-amber-400/30 p-2.5 text-center">
          <p className="text-[11px] text-amber-400 uppercase font-bold tracking-wider">{t.step2Tag}</p>
          <p className="text-[13px] text-white mt-1">{t.step2}</p>
        </div>
        <p className="text-center text-zinc-600 text-[14px]">↓</p>
        <div className="rounded-lg bg-red-500/10 border-2 border-red-500/50 p-2.5 text-center">
          <p className="text-[11px] text-red-400 uppercase font-bold tracking-wider">{t.step3Tag}</p>
          <p className="text-[13px] text-white mt-1">{t.step3}</p>
        </div>
      </div>
      <p className="text-[13px] text-zinc-400 italic text-center pt-2 border-t border-zinc-800 leading-snug">
        {t.mobileFooter1}<span className="font-bold text-red-400">{t.mobileFooter2}</span>
      </p>
    </div>
    </div>
  );
}

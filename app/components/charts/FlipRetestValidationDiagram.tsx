export default function FlipRetestValidationDiagram({ className = "", locale = "fr" }: { className?: string; locale?: "fr" | "es" }) {
  const L = locale === "es"
    ? {
        title: "3 señales que validan un retest de flip",
        exResLabel: "Ex-resistencia → Support — 1.1850",
        mecheTraverse: "Mecha atraviesa + rechazo",
        pinBar: "Pin bar de rechazo",
        pinBarDesc: "Mecha larga bajo el nivel",
        engulfingDesc: "Vela verde envuelve la roja",
        engulfing: "Engulfing bullish",
        engulfingSub: "Verde envuelve la roja",
        noPenetration: "Sin perforación, rebote directo",
        reaction: "Reacción inmediata",
        reactionSub: "Sin penetración profunda",
        footer: "Sin señal de rechazo en el contacto, el flip no está validado",
        mobTitle: "3 señales que validan un retest de flip",
        mob1: "1 · Mecha atraviesa + rechazo",
        mob1Desc: "Mecha larga que toca el nivel y cierra del lado correcto → rechazo nítido.",
        mob2: "2 · Vela de señal (pin bar / engulfing)",
        mob2Desc: "Patrón de giro claro en el contacto del ex-nivel.",
        mob3: "3 · Sin penetración profunda",
        mob3Desc: "El precio no atraviesa en cierre → el nivel aguanta.",
        mobFooter: "Sin señal de rechazo en el contacto, el flip no está validado.",
      }
    : {
        title: "3 signaux qui valident un retest de flip",
        exResLabel: "Ex-résistance → Support — 1.1850",
        mecheTraverse: "Mèche traverse + rejet",
        pinBar: "Pin bar de rejet",
        pinBarDesc: "Mèche longue sous le niveau",
        engulfingDesc: "Bougie verte englobe la rouge",
        engulfing: "Engulfing bullish",
        engulfingSub: "Verte englobe la rouge",
        noPenetration: "Aucune perforation, rebond direct",
        reaction: "Réaction immédiate",
        reactionSub: "Pas de pénétration profonde",
        footer: "Sans signal de rejet au contact, le flip n'est pas validé",
        mobTitle: "3 signaux qui valident un retest de flip",
        mob1: "1 · Mèche traverse + rejet",
        mob1Desc: "Longue mèche qui touche le niveau et clôture du bon côté → rejet net.",
        mob2: "2 · Bougie de signal (pin bar / engulfing)",
        mob2Desc: "Pattern de retournement clair au contact de l'ex-niveau.",
        mob3: "3 · Pas de pénétration profonde",
        mob3Desc: "Le prix ne traverse pas en clôture → le niveau tient.",
        mobFooter: "Sans signal de rejet au contact, le flip n'est pas validé.",
      };
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 400"
      className="hidden sm:block w-full h-auto"
    >
      <text x="450" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        {L.title}
      </text>

      <line x1="305" y1="40" x2="305" y2="370" stroke="#3f3f46" strokeWidth="1" />
      <line x1="605" y1="40" x2="605" y2="370" stroke="#3f3f46" strokeWidth="1" />

      {/* ═══ PANEL 1 — Pin bar de rejet ═══ */}
      <line x1="20" y1="200" x2="290" y2="200" stroke="#10b981" strokeWidth="1.2" strokeDasharray="5 3" />

      {/* Path arrive du haut, descend vers le niveau */}
      <path d="M30,80 L80,130 L130,170 L175,195" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      {/* Pin bar BIEN VISIBLE : mèche basse longue, petit corps au-dessus du niveau */}
      <line x1="195" y1="180" x2="195" y2="260" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="183" y="180" width="24" height="15" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="2" />

      {/* Rebond ascendant */}
      <path d="M210,180 L235,140 L260,110 L290,80" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" />

      {/* Halo + label déplacés après tous les paths pour rester au-dessus */}
      <rect x="21" y="184" width="210" height="14" fill="#09090b" rx="3" />
      <text x="25" y="195" fill="#10b981" fontSize="9" fontWeight="600">{L.exResLabel}</text>

      {/* Annotation "Mèche traverse + rejet" */}
      <line x1="200" y1="225" x2="240" y2="280" stroke="#10b981" strokeWidth="0.8" strokeDasharray="2 2" />
      <rect x="155" y="280" width="135" height="16" rx="4" fill="#27272a" stroke="#10b981" strokeWidth="0.8" />
      <text x="222" y="291" fill="#10b981" fontSize="8" fontWeight="600" textAnchor="middle">{L.mecheTraverse}</text>

      <rect x="60" y="315" width="180" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="150" y="330" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">{L.pinBar}</text>
      <text x="150" y="355" fill="#a1a1aa" fontSize="8" textAnchor="middle">{L.pinBarDesc}</text>

      {/* ═══ PANEL 2 — Engulfing bullish ═══ */}
      <line x1="320" y1="200" x2="590" y2="200" stroke="#10b981" strokeWidth="1.2" strokeDasharray="5 3" />

      {/* Path arrive du haut */}
      <path d="M330,80 L380,130 L420,170 L450,195" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      {/* Engulfing : 2 bougies bien marquées au contact */}
      {/* Bougie rouge AVANT */}
      <line x1="470" y1="195" x2="470" y2="245" stroke="#b91c1c" strokeWidth="2" />
      <rect x="460" y="200" width="20" height="40" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" rx="2" />
      {/* Bougie verte APRÈS — englobe */}
      <line x1="500" y1="165" x2="500" y2="215" stroke="#059669" strokeWidth="2" />
      <rect x="490" y="170" width="20" height="40" fill="#10b981" stroke="#059669" strokeWidth="1.5" rx="2" />

      {/* Rebond ascendant */}
      <path d="M515,165 L540,130 L570,100 L590,80" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" />

      {/* Halo + label déplacés après tous les paths/bougies pour rester au-dessus */}
      <rect x="321" y="184" width="210" height="14" fill="#09090b" rx="3" />
      <text x="325" y="195" fill="#10b981" fontSize="9" fontWeight="600">{L.exResLabel}</text>

      {/* Annotation */}
      <line x1="495" y1="225" x2="525" y2="270" stroke="#10b981" strokeWidth="0.8" strokeDasharray="2 2" />
      <rect x="450" y="270" width="140" height="16" rx="4" fill="#27272a" stroke="#10b981" strokeWidth="0.8" />
      <text x="520" y="281" fill="#10b981" fontSize="8" fontWeight="600" textAnchor="middle">{L.engulfingDesc}</text>

      <rect x="360" y="315" width="180" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="450" y="330" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">{L.engulfing}</text>
      <text x="450" y="355" fill="#a1a1aa" fontSize="8" textAnchor="middle">{L.engulfingSub}</text>

      {/* ═══ PANEL 3 — Réaction immédiate ═══ */}
      <line x1="620" y1="200" x2="890" y2="200" stroke="#10b981" strokeWidth="1.2" strokeDasharray="5 3" />

      {/* Path arrive du haut, touche le niveau SANS PERFORER, rebondit net */}
      <path d="M630,80 L680,130 L720,170 L755,200 L770,195 L800,150 L840,100 L880,70" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      {/* 2-3 bougies vertes ascendantes immédiates */}
      <line x1="785" y1="160" x2="785" y2="200" stroke="#059669" strokeWidth="1.5" />
      <rect x="778" y="165" width="14" height="30" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />
      <line x1="820" y1="120" x2="820" y2="160" stroke="#059669" strokeWidth="1.5" />
      <rect x="813" y="125" width="14" height="30" fill="#10b981" stroke="#059669" strokeWidth="1" rx="1" />

      {/* Halo + label déplacés après tous les paths/bougies pour rester au-dessus */}
      <rect x="621" y="184" width="210" height="14" fill="#09090b" rx="3" />
      <text x="625" y="195" fill="#10b981" fontSize="9" fontWeight="600">{L.exResLabel}</text>

      {/* Annotation */}
      <line x1="760" y1="220" x2="790" y2="275" stroke="#10b981" strokeWidth="0.8" strokeDasharray="2 2" />
      <rect x="700" y="275" width="170" height="16" rx="4" fill="#27272a" stroke="#10b981" strokeWidth="0.8" />
      <text x="785" y="286" fill="#10b981" fontSize="8" fontWeight="600" textAnchor="middle">{L.noPenetration}</text>

      <rect x="660" y="315" width="180" height="22" rx="11" fill="#10b98120" stroke="#10b981" strokeWidth="1" />
      <text x="750" y="330" fill="#10b981" fontSize="10" fontWeight="600" textAnchor="middle">{L.reaction}</text>
      <text x="750" y="355" fill="#a1a1aa" fontSize="8" textAnchor="middle">{L.reactionSub}</text>

      <text x="450" y="390" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        {L.footer}
      </text>
    </svg>

    {/* MOBILE : 3 signaux retest flip ────────────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
      <p className="text-[14px] font-bold text-white text-center">{L.mobTitle}</p>
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
        <p className="text-[13px] font-bold text-emerald-400">{L.mob1}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mob1Desc}</p>
      </div>
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
        <p className="text-[13px] font-bold text-emerald-400">{L.mob2}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mob2Desc}</p>
      </div>
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
        <p className="text-[13px] font-bold text-emerald-400">{L.mob3}</p>
        <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.mob3Desc}</p>
      </div>
      <p className="text-[13px] text-amber-400 italic text-center pt-2 border-t border-zinc-800 leading-snug">
        {L.mobFooter}
      </p>
    </div>
    </div>
  );
}

export const TradingSessionsLiquidityDiagram = () => {
  return (
    <div>
    <svg
      className="hidden sm:block w-full h-auto"
      viewBox="0 0 800 450"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Layer 1 — Fond global */}
      <rect width="800" height="450" fill="#18181b" rx="8" />
      <rect width="800" height="450" fill="none" stroke="#27272a" strokeWidth="1" rx="8" />

      {/* Layer 2 — Titre */}
      <text x="400" y="35" fill="white" fontSize="16" fontWeight="700" textAnchor="middle">
        Une journée forex — où se concentre la liquidité
      </text>
      <text x="400" y="55" fill="#a1a1aa" fontSize="12" fontStyle="italic" textAnchor="middle">
        Toutes les heures ne se valent pas — heure de Paris
      </text>

      {/* Layer 3 — Zones sessions (Asie, Londres, NY) */}

      {/* Zone Asie : 00h(x=60) → 09h(x=315), width=255 */}
      <rect x="60" y="180" width="255" height="50" rx="4"
        fill="#60a5fa" fillOpacity="0.15"
        stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.4" />

      {/* Zone Londres : 08h(x=287) → 17h(x=542), width=255 */}
      <rect x="287" y="180" width="255" height="50" rx="4"
        fill="#34d399" fillOpacity="0.15"
        stroke="#34d399" strokeWidth="1" strokeOpacity="0.4" />

      {/* Zone New York : 14h(x=457) → 22h(x=683), width=226 */}
      <rect x="457" y="180" width="226" height="50" rx="4"
        fill="#fbbf24" fillOpacity="0.15"
        stroke="#fbbf24" strokeWidth="1" strokeOpacity="0.4" />

      {/* Layer 4 — Zone OVERLAP / KILLZONE : 14h(x=457) → 17h(x=542), width=85 */}
      <rect x="457" y="180" width="85" height="50" rx="4"
        fill="#ef4444" fillOpacity="0.25"
        stroke="#f87171" strokeWidth="1.5" strokeOpacity="0.7" />

      {/* Layer 5 — Labels de sessions */}
      <text x="187" y="170" fill="#60a5fa" fontSize="11" fontWeight="700"
        textAnchor="middle" letterSpacing="0.05em">
        ASIE
      </text>
      <text x="414" y="170" fill="#34d399" fontSize="11" fontWeight="700"
        textAnchor="middle" letterSpacing="0.05em">
        LONDRES
      </text>
      <text x="570" y="170" fill="#fbbf24" fontSize="11" fontWeight="700"
        textAnchor="middle" letterSpacing="0.05em">
        NEW YORK
      </text>

      {/* Layer 6 — Pastille KILLZONE */}
      <rect x="460" y="152" width="80" height="18" rx="3"
        fill="#09090b" fillOpacity="0.95" />
      <text x="500" y="165" fill="#f87171" fontSize="10" fontWeight="700"
        textAnchor="middle" letterSpacing="0.05em">
        KILLZONE
      </text>

      {/* Layer 7 — Courbe de liquidité */}
      {/*
        Points clés : (60,250) 03h(130,245) 06h(230,240) 08h(287,220)
        09h(315,200) 12h(400,175) 14h(457,130) 15h pic(485,105)
        16h pic(515,105) 17h(542,120) 20h(627,175) 22h(683,220) 24h(740,245)
      */}
      <path
        d="M 60,250
           C 90,248 110,246 130,245
           C 155,244 205,242 230,240
           C 250,235 275,228 287,220
           C 298,213 308,207 315,200
           C 340,188 380,182 400,175
           C 420,168 440,148 457,130
           C 468,118 476,105 485,105
           C 495,105 505,105 515,105
           C 525,110 532,114 542,120
           C 565,138 600,160 627,175
           C 648,188 665,208 683,220
           C 705,230 725,242 740,245"
        stroke="#34d399"
        strokeWidth="2.5"
        fill="none"
      />

      {/* Layer 8 — Légende verticale LIQUIDITÉ */}
      <text
        x="30"
        y="180"
        fill="#a1a1aa"
        fontSize="9"
        fontWeight="700"
        letterSpacing="0.1em"
        transform="rotate(-90 30 180)"
        textAnchor="middle"
      >
        LIQUIDITÉ
      </text>

      {/* Layer 9 — Graduations heures (toutes les 3h, 00h→24h) */}

      {/* 00h = x=60 */}
      <line x1="60" y1="230" x2="60" y2="237" stroke="#71717a" strokeWidth="1" />
      <text x="60" y="252" fill="#a1a1aa" fontSize="10" textAnchor="middle">00h</text>

      {/* 03h = x=145 */}
      <line x1="145" y1="230" x2="145" y2="237" stroke="#71717a" strokeWidth="1" />
      <text x="145" y="252" fill="#a1a1aa" fontSize="10" textAnchor="middle">03h</text>

      {/* 06h = x=230 */}
      <line x1="230" y1="230" x2="230" y2="237" stroke="#71717a" strokeWidth="1" />
      <text x="230" y="252" fill="#a1a1aa" fontSize="10" textAnchor="middle">06h</text>

      {/* 09h = x=315 */}
      <line x1="315" y1="230" x2="315" y2="237" stroke="#71717a" strokeWidth="1" />
      <text x="315" y="252" fill="#a1a1aa" fontSize="10" textAnchor="middle">09h</text>

      {/* 12h = x=400 */}
      <line x1="400" y1="230" x2="400" y2="237" stroke="#71717a" strokeWidth="1" />
      <text x="400" y="252" fill="#a1a1aa" fontSize="10" textAnchor="middle">12h</text>

      {/* 15h = x=485 */}
      <line x1="485" y1="230" x2="485" y2="237" stroke="#71717a" strokeWidth="1" />
      <text x="485" y="252" fill="#a1a1aa" fontSize="10" textAnchor="middle">15h</text>

      {/* 18h = x=570 */}
      <line x1="570" y1="230" x2="570" y2="237" stroke="#71717a" strokeWidth="1" />
      <text x="570" y="252" fill="#a1a1aa" fontSize="10" textAnchor="middle">18h</text>

      {/* 21h = x=655 */}
      <line x1="655" y1="230" x2="655" y2="237" stroke="#71717a" strokeWidth="1" />
      <text x="655" y="252" fill="#a1a1aa" fontSize="10" textAnchor="middle">21h</text>

      {/* 24h = x=740 */}
      <line x1="740" y1="230" x2="740" y2="237" stroke="#71717a" strokeWidth="1" />
      <text x="740" y="252" fill="#a1a1aa" fontSize="10" textAnchor="middle">24h</text>

      {/* Layer 10 — Repère vertical News US 14h30 (x=471) */}
      <line x1="471" y1="85" x2="471" y2="235"
        stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
      <rect x="445" y="70" width="70" height="18" rx="3"
        fill="#09090b" fillOpacity="0.95" />
      <text x="480" y="82" fill="#fbbf24" fontSize="9" fontWeight="700" textAnchor="middle">
        News US 14h30
      </text>

      {/* Layer 11 — Annotations en bas */}

      {/* Spreads larges — côté droit (22h-24h) */}
      <line x1="712" y1="275" x2="712" y2="235"
        stroke="#f87171" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.5" />
      <rect x="685" y="275" width="55" height="20" rx="3"
        fill="#09090b" fillOpacity="0.85" />
      <text x="712" y="288" fill="#f87171" fontSize="9" fontWeight="700" textAnchor="middle">
        Spreads larges
      </text>

      {/* Spreads larges — côté gauche (00h-06h) */}
      <rect x="80" y="275" width="120" height="20" rx="3"
        fill="#09090b" fillOpacity="0.85" />
      <text x="140" y="288" fill="#f87171" fontSize="9" fontWeight="700" textAnchor="middle">
        Spreads larges + fakeouts
      </text>

      {/* Vrais mouvements — sur l'overlap */}
      <rect x="440" y="275" width="120" height="20" rx="3"
        fill="#09090b" fillOpacity="0.85" />
      <text x="500" y="288" fill="#34d399" fontSize="9" fontWeight="700" textAnchor="middle">
        Vrais mouvements
      </text>

      {/* Layer 12 — Légende paires optimales */}
      <text x="400" y="345" fill="#fbbf24" fontSize="11" fontWeight="700"
        letterSpacing="0.05em" textAnchor="middle">
        PAIRES OPTIMALES PAR SESSION
      </text>

      {/* Colonne 1 — Asie */}
      <rect x="125" y="360" width="10" height="10" rx="2" fill="#60a5fa" />
      <text x="180" y="370" fill="#d4d4d8" fontSize="10" textAnchor="middle">
        Asie : USD/JPY, AUD/JPY, NZD/JPY
      </text>

      {/* Colonne 2 — Londres + Overlap */}
      <rect x="295" y="360" width="10" height="10" rx="2" fill="#34d399" />
      <text x="400" y="370" fill="#d4d4d8" fontSize="10" textAnchor="middle">
        Londres + Overlap : EUR/USD, GBP/USD, XAU/USD (or)
      </text>

      {/* Colonne 3 — NY */}
      <rect x="565" y="360" width="10" height="10" rx="2" fill="#fbbf24" />
      <text x="620" y="370" fill="#d4d4d8" fontSize="10" textAnchor="middle">
        NY : Nasdaq, S&amp;P500, BTC/USD, USD/CAD
      </text>

      {/* Layer 13 — Pied de page */}
      <text x="400" y="425" fill="#34d399" fontSize="12" fontWeight="700"
        fontStyle="italic" textAnchor="middle">
        Toutes les heures ne se valent pas. L&apos;overlap concentre la vraie liquidité.
      </text>
    </svg>

    {/* ── MOBILE : sessions empilées + paires ────────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-4 space-y-3">
      <p className="text-[14px] font-bold text-white text-center leading-snug">
        Une journée forex — où se concentre la liquidité
      </p>
      <p className="text-[12px] text-zinc-400 italic text-center -mt-1">
        Heure de Paris
      </p>

      {/* 3 sessions + overlap */}
      <div className="space-y-2">
        {[
          { name: "ASIE", range: "00h – 09h", color: "#60a5fa", desc: "Liquidité faible · spreads larges + fakeouts", pairs: "USD/JPY, AUD/JPY, NZD/JPY" },
          { name: "LONDRES", range: "08h – 17h", color: "#34d399", desc: "Vrai départ de la journée — bonne liquidité", pairs: "EUR/USD, GBP/USD, XAU/USD" },
          { name: "OVERLAP LONDRES + NY", range: "14h – 17h", color: "#ef4444", desc: "🔴 KILLZONE — vraie liquidité institutionnelle", pairs: null, killzone: true },
          { name: "NEW YORK", range: "14h – 22h", color: "#fbbf24", desc: "Pic d'activité — news US à 14h30", pairs: "Nasdaq, S&P500, BTC/USD, USD/CAD" },
        ].map((s) => (
          <div
            key={s.name}
            className={`rounded-lg border p-2.5 ${s.killzone ? "border-2" : ""}`}
            style={{ borderColor: s.color, background: `${s.color}10` }}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[14px] font-bold" style={{ color: s.color }}>{s.name}</span>
              <span className="text-[12px] font-mono font-semibold" style={{ color: s.color }}>{s.range}</span>
            </div>
            <p className="text-[12px] text-zinc-300 leading-snug mt-1">{s.desc}</p>
            {s.pairs && (
              <p className="text-[12px] text-zinc-400 leading-snug mt-1 font-mono">{s.pairs}</p>
            )}
          </div>
        ))}
      </div>

      <p className="text-[13px] text-emerald-400 font-bold italic text-center leading-snug pt-2 border-t border-zinc-800">
        L'overlap Londres + NY concentre la vraie liquidité.
      </p>
    </div>
    </div>
  );
};

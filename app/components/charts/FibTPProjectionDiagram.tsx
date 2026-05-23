export default function FibTPProjectionDiagram({ className = "", locale = "fr" }: { className?: string; locale?: "fr" | "es" }) {
  const labels = locale === "es"
    ? {
        title: "Salir en 2 partes: TP1 en 1.272, TP2 en 1.618",
        zero: "0%  — 4 540$",
        cinquante: "50% — 4 600$ (zona OTE)",
        cent: "100% — 4 660$",
        tp1: "TP1 — 1.272 — 4 692$  ",
        tp2: "TP2 — 1.618 — 4 734$  ",
        swingLow: "Swing low",
        swingHigh: "Swing high",
        rebond: "Rebote OTE",
        footer: "Estrategia 50/50: salir la mitad en TP1 (1.272), mantener la otra mitad para TP2 (1.618)",
        mobTitle: "Salir en 2 partes — Fibo extension",
        mobTp2: "TP2 — 1.618",
        mobTp1: "TP1 — 1.272",
        mobPos: "50% de la posición",
        mobStrategy: "Estrategia 50/50",
        mobStrategyDesc: " : asegura la mitad en TP1, deja la mitad correr hacia TP2.",
      }
    : {
        title: "Sortir en 2 fois : TP1 à 1.272, TP2 à 1.618",
        zero: "0%  — 4 540$",
        cinquante: "50% — 4 600$ (zone OTE)",
        cent: "100% — 4 660$",
        tp1: "TP1 — 1.272 — 4 692$  ",
        tp2: "TP2 — 1.618 — 4 734$  ",
        swingLow: "Swing low",
        swingHigh: "Swing high",
        rebond: "Rebond OTE",
        footer: "Stratégie 50/50 : sortir la moitié à TP1 (1.272), garder l'autre moitié pour TP2 (1.618)",
        mobTitle: "Sortir en 2 fois — Fibo extension",
        mobTp2: "TP2 — 1.618",
        mobTp1: "TP1 — 1.272",
        mobPos: "50% de la position",
        mobStrategy: "Stratégie 50/50",
        mobStrategyDesc: " : sécurise la moitié à TP1, laisse la moitié courir vers TP2.",
      };
  return (
    <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 400"
      className="hidden sm:block w-full h-auto"
    >
      <text x="400" y="22" fill="#d4d4d8" fontSize="13" fontWeight="600" textAnchor="middle">
        {labels.title}
      </text>

      {/* Fibonacci levels horizontaux — traversent tout le viewBox */}
      <line x1="30" y1="300" x2="770" y2="300" stroke="#a1a1aa" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.6" />
      <text x="35" y="295" fill="#a1a1aa" fontSize="9">{labels.zero}</text>

      <line x1="30" y1="200" x2="770" y2="200" stroke="#a1a1aa" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.6" />
      <text x="35" y="195" fill="#a1a1aa" fontSize="9">{labels.cinquante}</text>

      <line x1="30" y1="150" x2="770" y2="150" stroke="#a1a1aa" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.6" />
      <text x="35" y="145" fill="#a1a1aa" fontSize="9">{labels.cent}</text>

      {/* TP1 1.272 emerald — fond opaque derrière le badge pour masquer la ligne pointillée */}
      <line x1="30" y1="110" x2="770" y2="110" stroke="#10b981" strokeWidth="1.2" strokeDasharray="5 3" />
      <rect x="590" y="98" width="180" height="20" rx="4" fill="#09090b" />
      <rect x="590" y="98" width="180" height="20" rx="4" fill="#10b98140" stroke="#10b981" strokeWidth="0.8" />
      <text x="770" y="112" fill="#10b981" fontSize="9" fontWeight="600" textAnchor="end">{labels.tp1}</text>

      {/* TP2 1.618 emerald plus épaisse — fond opaque derrière le badge */}
      <line x1="30" y1="60" x2="770" y2="60" stroke="#10b981" strokeWidth="1.8" strokeDasharray="6 3" />
      <rect x="590" y="48" width="180" height="20" rx="4" fill="#09090b" />
      <rect x="590" y="48" width="180" height="20" rx="4" fill="#10b98140" stroke="#10b981" strokeWidth="1" />
      <text x="770" y="62" fill="#10b981" fontSize="9" fontWeight="700" textAnchor="end">{labels.tp2}</text>

      {/* Path impulse + retracement + rebond + extension — démarre à x=30, occupe toute la largeur */}
      <path d="M30,310 L90,260 L150,210 L210,150 L270,200 L330,235 L400,200 L470,150 L550,110 L640,80 L730,60" stroke="#71717a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

      {/* Pivot dots */}
      <circle cx="30" cy="310" r="4" fill="#71717a" />
      <text x="40" y="325" fill="#a1a1aa" fontSize="8">{labels.swingLow}</text>
      <circle cx="210" cy="150" r="4" fill="#71717a" />
      <text x="220" y="143" fill="#a1a1aa" fontSize="8">{labels.swingHigh}</text>
      <circle cx="330" cy="235" r="5" fill="#60a5fa" />
      <text x="345" y="245" fill="#60a5fa" fontSize="8">{labels.rebond}</text>

      {/* Pastille TP1 atteint */}
      <circle cx="550" cy="110" r="5" fill="#10b981" />
      <circle cx="730" cy="60" r="5" fill="#10b981" />

      <text x="400" y="385" fill="#a1a1aa" fontSize="9" textAnchor="middle">
        {labels.footer}
      </text>
    </svg>

    {/* MOBILE : projection TP Fibo ──────────────────────────── */}
    <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
      <p className="text-[14px] font-bold text-emerald-400 text-center">{labels.mobTitle}</p>
      <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 flex justify-between items-center">
        <div>
          <p className="text-[13px] font-bold text-emerald-400">{labels.mobTp2}</p>
          <p className="text-[11px] text-zinc-400">{labels.mobPos}</p>
        </div>
        <span className="text-[15px] font-mono font-bold text-emerald-400">4 734 $</span>
      </div>
      <div className="rounded-lg bg-emerald-500/8 border border-emerald-500/25 p-3 flex justify-between items-center">
        <div>
          <p className="text-[13px] font-bold text-emerald-400">{labels.mobTp1}</p>
          <p className="text-[11px] text-zinc-400">{labels.mobPos}</p>
        </div>
        <span className="text-[15px] font-mono font-bold text-emerald-400">4 692 $</span>
      </div>
      <p className="text-[13px] text-zinc-300 text-center leading-snug pt-2 border-t border-zinc-800">
        <span className="font-bold text-emerald-400">{labels.mobStrategy}</span>{labels.mobStrategyDesc}
      </p>
    </div>
    </div>
  );
}

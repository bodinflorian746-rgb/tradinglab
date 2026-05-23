interface PastilleProps {
  x: number;
  y: number;
  label: string;
  color: string;
  textColor?: string;
  arrow?: "up" | "down";
}

// Petite étiquette type "pill" centrée sur (x, y) — pattern visuel EdgeTrade.
function Pastille({ x, y, label, color, textColor, arrow }: PastilleProps) {
  const text = arrow === "up" ? `${label} ↑` : arrow === "down" ? `${label} ↓` : label;
  const width = text.length * 6.2 + 12;
  const height = 18;
  return (
    <g>
      <rect
        x={x - width / 2}
        y={y - height / 2}
        width={width}
        height={height}
        rx="3"
        fill="#09090b"
        fillOpacity="0.85"
        stroke={color}
        strokeWidth="1"
      />
      <text
        x={x}
        y={y + 4}
        fontSize="11"
        fontWeight="500"
        fill={textColor ?? color}
        textAnchor="middle"
      >
        {text}
      </text>
    </g>
  );
}

export default function HeadShouldersDiagram({ locale = "fr" }: { locale?: "fr" | "es" } = {}) {
  const L = locale === "es"
    ? {
        hsTitle: "Head & Shoulders — fin de tendencia alcista",
        ihsTitle: "H&S Invertido — fin de tendencia bajista",
        shoulders: "Hombros",
        shoulderL: "Hombro I",
        head: "Cabeza",
        shoulderR: "Hombro D",
        neckline: "Neckline",
        breakout: "Ruptura",
        mobileTitle: "Head & Shoulders — 2 variantes",
        classicTitle: "H&S clásico — Reversión BAJISTA",
        classicDesc1: "3 cimas: Hombro I → Cabeza (más alta) → Hombro D. Ruptura bajo la ",
        classicDesc2: " = señal short.",
        invTitle: "H&S invertido — Reversión ALCISTA",
        invDesc1: "3 mínimos: Hombro I → Cabeza (más bajo) → Hombro D. Ruptura sobre la ",
        invDesc2: " = señal long.",
        footer: "Patrón de reversión mayor, válido tras ruptura de la neckline.",
      }
    : {
        hsTitle: "Head & Shoulders — fin de tendance haussière",
        ihsTitle: "H&S Inversé — fin de tendance baissière",
        shoulders: "Épaules",
        shoulderL: "Épaule G",
        head: "Tête",
        shoulderR: "Épaule D",
        neckline: "Neckline",
        breakout: "Cassure",
        mobileTitle: "Head & Shoulders — 2 variantes",
        classicTitle: "H&S classique — Retournement BAISSIER",
        classicDesc1: "3 sommets : Épaule G → Tête (plus haut) → Épaule D. Cassure sous la ",
        classicDesc2: " = signal short.",
        invTitle: "H&S inversé — Retournement HAUSSIER",
        invDesc1: "3 creux : Épaule G → Tête (plus bas) → Épaule D. Cassure au-dessus de la ",
        invDesc2: " = signal long.",
        footer: "Pattern de retournement majeur, valide après cassure de la neckline.",
      };
  // ─── Head & Shoulders classique (bearish reversal) ─── x = 30 → 380
  const hsPts: [number, number][] = [
    [30, 295],   // début pré-tendance haussière
    [55, 235],   // ascension intermédiaire
    [80, 130],   // Épaule G
    [120, 185],  // creux 1 (neckline)
    [175, 75],   // Tête (plus haut)
    [235, 185],  // creux 2 (neckline)
    [290, 130],  // Épaule D
    [340, 245],  // cassure sous la neckline
    [380, 310],  // continuation baissière
  ];

  // ─── Head & Shoulders inversé (bullish reversal) ─── x = 435 → 780
  const ihsPts: [number, number][] = [
    [435, 110],  // début pré-tendance baissière
    [460, 170],  // descente intermédiaire
    [485, 275],  // Épaule G (inversée)
    [525, 220],  // sommet 1 (neckline)
    [580, 325],  // Tête (plus bas)
    [640, 220],  // sommet 2 (neckline)
    [695, 275],  // Épaule D (inversée)
    [745, 160],  // cassure au-dessus de la neckline
    [785, 95],   // continuation haussière
  ];

  const buildPath = (pts: [number, number][]) =>
    pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");

  // H&S : bullish (formation) jusqu'à l'Épaule D, puis bearish (cassure + continuation)
  const hsBullPath = buildPath(hsPts.slice(0, 7));
  const hsBearPath = buildPath(hsPts.slice(6));

  // H&S Inversé : bearish (formation) jusqu'à l'Épaule D, puis bullish (cassure + continuation)
  const ihsBearPath = buildPath(ihsPts.slice(0, 7));
  const ihsBullPath = buildPath(ihsPts.slice(6));

  return (
    <div>
      <svg
        width="100%"
        viewBox="0 0 800 400"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        className="hidden sm:block"
      >
        {/* ════════ HEAD & SHOULDERS (gauche) ════════ */}

        <text x="195" y="28" fontSize="13" fontWeight="600" fill="#d4d4d8" textAnchor="middle">
          {L.hsTitle}
        </text>

        {/* Ligne guide des 2 épaules (résistance des shoulders) */}
        <line x1="60" y1="130" x2="310" y2="130" stroke="#71717a" strokeWidth="1" strokeDasharray="4 4" />
        <text x="55" y="133" fontSize="11" fill="#a1a1aa" textAnchor="end">{L.shoulders}</text>

        {/* Neckline reliant les 2 creux */}
        <line x1="90" y1="185" x2="385" y2="185" stroke="#a1a1aa" strokeWidth="1" strokeDasharray="6 3" />

        {/* Chemin haussier — formation jusqu'à l'Épaule D */}
        <path d={hsBullPath} stroke="#10b981" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* Chemin baissier — cassure sous la neckline + continuation */}
        <path d={hsBearPath} stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* Points clés : 3 sommets + creux 2 + cassure */}
        <circle cx={hsPts[2][0]} cy={hsPts[2][1]} r="3.5" fill="#ef4444" />
        <circle cx={hsPts[4][0]} cy={hsPts[4][1]} r="3.5" fill="#ef4444" />
        <circle cx={hsPts[6][0]} cy={hsPts[6][1]} r="3.5" fill="#ef4444" />
        <circle cx={hsPts[5][0]} cy={hsPts[5][1]} r="3" fill="#a1a1aa" />
        <circle cx={hsPts[7][0]} cy={hsPts[7][1]} r="3.5" fill="#ef4444" />

        {/* Pastilles */}
        <Pastille x={80} y={110} label={L.shoulderL} color="#ef4444" />
        <Pastille x={175} y={55} label={L.head} color="#ef4444" />
        <Pastille x={290} y={110} label={L.shoulderR} color="#ef4444" />
        <Pastille x={235} y={208} label={L.neckline} color="#3f3f46" textColor="#a1a1aa" />
        <Pastille x={340} y={270} label={L.breakout} color="#ef4444" arrow="down" />

        {/* ════════ Séparateur vertical ════════ */}
        <line x1="405" y1="25" x2="405" y2="380" stroke="#27272a" strokeWidth="1" strokeDasharray="2 4" />

        {/* ════════ HEAD & SHOULDERS INVERSÉ (droite) ════════ */}

        <text x="600" y="28" fontSize="13" fontWeight="600" fill="#d4d4d8" textAnchor="middle">
          {L.ihsTitle}
        </text>

        {/* Ligne guide des 2 épaules (support des shoulders inversées) */}
        <line x1="465" y1="275" x2="715" y2="275" stroke="#71717a" strokeWidth="1" strokeDasharray="4 4" />
        <text x="460" y="278" fontSize="11" fill="#a1a1aa" textAnchor="end">{L.shoulders}</text>

        {/* Neckline reliant les 2 sommets */}
        <line x1="495" y1="220" x2="785" y2="220" stroke="#a1a1aa" strokeWidth="1" strokeDasharray="6 3" />

        {/* Chemin baissier — formation jusqu'à l'Épaule D */}
        <path d={ihsBearPath} stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* Chemin haussier — cassure au-dessus de la neckline + continuation */}
        <path d={ihsBullPath} stroke="#10b981" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* Points clés : 3 creux + sommet 2 + cassure */}
        <circle cx={ihsPts[2][0]} cy={ihsPts[2][1]} r="3.5" fill="#10b981" />
        <circle cx={ihsPts[4][0]} cy={ihsPts[4][1]} r="3.5" fill="#10b981" />
        <circle cx={ihsPts[6][0]} cy={ihsPts[6][1]} r="3.5" fill="#10b981" />
        <circle cx={ihsPts[5][0]} cy={ihsPts[5][1]} r="3" fill="#a1a1aa" />
        <circle cx={ihsPts[7][0]} cy={ihsPts[7][1]} r="3.5" fill="#10b981" />

        {/* Pastilles */}
        <Pastille x={485} y={295} label={L.shoulderL} color="#10b981" />
        <Pastille x={580} y={345} label={L.head} color="#10b981" />
        <Pastille x={695} y={295} label={L.shoulderR} color="#10b981" />
        <Pastille x={640} y={197} label={L.neckline} color="#3f3f46" textColor="#a1a1aa" />
        <Pastille x={745} y={135} label={L.breakout} color="#10b981" arrow="up" />
      </svg>

      {/* MOBILE : 2 patterns H&S empilés ───────────────────────── */}
      <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">{L.mobileTitle}</p>
        <div className="rounded-lg border border-red-500/40 bg-red-500/8 p-3">
          <p className="text-[13px] font-bold text-red-400">{L.classicTitle}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.classicDesc1}<span className="font-bold">neckline</span>{L.classicDesc2}</p>
        </div>
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
          <p className="text-[13px] font-bold text-emerald-400">{L.invTitle}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{L.invDesc1}<span className="font-bold">neckline</span>{L.invDesc2}</p>
        </div>
        <p className="text-[13px] text-emerald-400 font-bold text-center pt-2 border-t border-zinc-800 leading-snug">
          {L.footer}
        </p>
      </div>
    </div>
  );
}

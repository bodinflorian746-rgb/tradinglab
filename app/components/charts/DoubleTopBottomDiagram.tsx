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

export default function DoubleTopBottomDiagram({ locale = "fr" }: { locale?: "fr" | "es" } = {}) {
  const t = locale === "es"
    ? {
        dtTitle: "Double Top — fin de tendencia alcista",
        dbTitle: "Double Bottom — fin de tendencia bajista",
        resistance: "Resistencia",
        support: "Soporte",
        top1: "Top 1",
        top2: "Top 2",
        bottom1: "Bottom 1",
        bottom2: "Bottom 2",
        neckline: "Neckline",
        breakLabel: "Ruptura",
        mobileTitle: "Double Top / Double Bottom",
        mobileDTTitle: "Double Top — Inversión BAJISTA",
        mobileDTDesc: "2 cumbres casi iguales separadas por un valle (neckline). Ruptura debajo de la neckline = señal short.",
        mobileDBTitle: "Double Bottom — Inversión ALCISTA",
        mobileDBDesc: "2 valles casi iguales separados por una cumbre (neckline). Ruptura por encima de la neckline = señal long.",
        mobileFooter: "Patrón de inversión, validado por la ruptura de la neckline.",
      }
    : {
        dtTitle: "Double Top — fin de tendance haussière",
        dbTitle: "Double Bottom — fin de tendance baissière",
        resistance: "Résistance",
        support: "Support",
        top1: "Top 1",
        top2: "Top 2",
        bottom1: "Bottom 1",
        bottom2: "Bottom 2",
        neckline: "Neckline",
        breakLabel: "Cassure",
        mobileTitle: "Double Top / Double Bottom",
        mobileDTTitle: "Double Top — Retournement BAISSIER",
        mobileDTDesc: "2 sommets quasi égaux séparés par un creux (neckline). Cassure sous la neckline = signal short.",
        mobileDBTitle: "Double Bottom — Retournement HAUSSIER",
        mobileDBDesc: "2 creux quasi égaux séparés par un sommet (neckline). Cassure au-dessus de la neckline = signal long.",
        mobileFooter: "Pattern de retournement, validé par la cassure de la neckline.",
      };

  // ─── Double Top (bearish reversal) ─── x = 30 → 380
  const topPts: [number, number][] = [
    [30, 295],   // début tendance haussière
    [130, 90],   // Top 1
    [185, 185],  // creux intermédiaire (neckline)
    [240, 95],   // Top 2
    [310, 255],  // cassure de la neckline vers le bas
    [365, 320],  // continuation baissière
  ];

  // ─── Double Bottom (bullish reversal) ─── x = 435 → 780
  const botPts: [number, number][] = [
    [435, 105],  // début tendance baissière
    [535, 315],  // Bottom 1
    [590, 220],  // sommet intermédiaire (neckline)
    [645, 310],  // Bottom 2
    [715, 150],  // cassure de la neckline vers le haut
    [770, 80],   // continuation haussière
  ];

  // Construction des chemins
  const buildPath = (pts: [number, number][]) =>
    pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");

  const topBullPath = buildPath(topPts.slice(0, 4));
  const topBearPath = buildPath(topPts.slice(3));
  const botBearPath = buildPath(botPts.slice(0, 4));
  const botBullPath = buildPath(botPts.slice(3));

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
        {/* ════════ DOUBLE TOP (gauche) ════════ */}

        <text x="195" y="28" fontSize="13" fontWeight="600" fill="#d4d4d8" textAnchor="middle">
          {t.dtTitle}
        </text>

        {/* Résistance (les 2 sommets touchent ce niveau) */}
        <line x1="60" y1="90" x2="385" y2="90" stroke="#71717a" strokeWidth="1" strokeDasharray="4 4" />
        <text x="55" y="93" fontSize="11" fill="#a1a1aa" textAnchor="end">{t.resistance}</text>

        {/* Neckline (creux intermédiaire prolongé) */}
        <line x1="130" y1="185" x2="385" y2="185" stroke="#a1a1aa" strokeWidth="1" strokeDasharray="6 3" />

        {/* Chemin haussier jusqu'au Top 2 */}
        <path d={topBullPath} stroke="#10b981" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* Chemin baissier — cassure sous la neckline puis continuation */}
        <path d={topBearPath} stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* Points clés */}
        <circle cx={topPts[1][0]} cy={topPts[1][1]} r="3.5" fill="#ef4444" />
        <circle cx={topPts[3][0]} cy={topPts[3][1]} r="3.5" fill="#ef4444" />
        <circle cx={topPts[2][0]} cy={topPts[2][1]} r="3" fill="#a1a1aa" />
        <circle cx={topPts[4][0]} cy={topPts[4][1]} r="3.5" fill="#ef4444" />

        {/* Pastilles */}
        <Pastille x={130} y={70} label={t.top1} color="#ef4444" />
        <Pastille x={240} y={75} label={t.top2} color="#ef4444" />
        <Pastille x={185} y={207} label={t.neckline} color="#3f3f46" textColor="#a1a1aa" />
        <Pastille x={310} y={278} label={t.breakLabel} color="#ef4444" arrow="down" />

        {/* ════════ Séparateur vertical ════════ */}
        <line x1="405" y1="25" x2="405" y2="380" stroke="#27272a" strokeWidth="1" strokeDasharray="2 4" />

        {/* ════════ DOUBLE BOTTOM (droite) ════════ */}

        <text x="600" y="28" fontSize="13" fontWeight="600" fill="#d4d4d8" textAnchor="middle">
          {t.dbTitle}
        </text>

        {/* Support (les 2 creux touchent ce niveau) */}
        <line x1="465" y1="318" x2="785" y2="318" stroke="#71717a" strokeWidth="1" strokeDasharray="4 4" />
        <text x="460" y="321" fontSize="11" fill="#a1a1aa" textAnchor="end">{t.support}</text>

        {/* Neckline (sommet intermédiaire prolongé) */}
        <line x1="535" y1="220" x2="785" y2="220" stroke="#a1a1aa" strokeWidth="1" strokeDasharray="6 3" />

        {/* Chemin baissier jusqu'au Bottom 2 */}
        <path d={botBearPath} stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* Chemin haussier — cassure au-dessus de la neckline puis continuation */}
        <path d={botBullPath} stroke="#10b981" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* Points clés */}
        <circle cx={botPts[1][0]} cy={botPts[1][1]} r="3.5" fill="#10b981" />
        <circle cx={botPts[3][0]} cy={botPts[3][1]} r="3.5" fill="#10b981" />
        <circle cx={botPts[2][0]} cy={botPts[2][1]} r="3" fill="#a1a1aa" />
        <circle cx={botPts[4][0]} cy={botPts[4][1]} r="3.5" fill="#10b981" />

        {/* Pastilles */}
        <Pastille x={535} y={340} label={t.bottom1} color="#10b981" />
        <Pastille x={645} y={335} label={t.bottom2} color="#10b981" />
        <Pastille x={590} y={200} label={t.neckline} color="#3f3f46" textColor="#a1a1aa" />
        <Pastille x={715} y={130} label={t.breakLabel} color="#10b981" arrow="up" />
      </svg>

      {/* MOBILE : Double Top / Bottom ──────────────────────── */}
      <div className="sm:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
        <p className="text-[14px] font-bold text-white text-center">{t.mobileTitle}</p>
        <div className="rounded-lg border border-red-500/40 bg-red-500/8 p-3">
          <p className="text-[13px] font-bold text-red-400">{t.mobileDTTitle}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{t.mobileDTDesc}</p>
        </div>
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/8 p-3">
          <p className="text-[13px] font-bold text-emerald-400">{t.mobileDBTitle}</p>
          <p className="text-[12px] text-zinc-300 leading-snug mt-1">{t.mobileDBDesc}</p>
        </div>
        <p className="text-[13px] text-emerald-400 font-bold text-center pt-2 border-t border-zinc-800 leading-snug">
          {t.mobileFooter}
        </p>
      </div>
    </div>
  );
}

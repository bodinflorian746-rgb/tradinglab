interface TrendDiagramProps {
  className?: string;
}

export function TrendDiagram({ className = "" }: TrendDiagramProps) {
  const p = (pts: number[][]) =>
    pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");

  const sep1 = 89;
  const sep2 = 179;

  // Panel 1 — Bullish (HH/HL escalier montant, emerald)
  const bullPts = [[4, 114], [16, 92], [28, 102], [44, 76], [56, 86], [72, 56], [84, 64]];
  const bullHH = [[16, 92], [44, 76], [72, 56]];
  const bullHL = [[28, 102], [56, 86]];

  // Panel 2 — Range (oscillation entre deux niveaux, zinc)
  const rangeTop = 52;
  const rangeBot = 112;
  const rangePts = [
    [91, 82], [104, 52], [116, 82], [128, 112],
    [140, 82], [152, 52], [164, 82], [176, 112],
  ];

  // Panel 3 — Bearish (LH/LL escalier descendant, red)
  const bearPts = [[182, 50], [194, 82], [208, 66], [224, 100], [238, 84], [254, 118], [264, 114]];
  const bearLL = [[194, 82], [224, 100], [254, 118]];
  const bearLH = [[208, 66], [238, 84]];

  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg
        width="100%"
        viewBox="0 0 268 152"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Panel dividers */}
        <line x1={sep1} y1="8" x2={sep1} y2="126" stroke="#27272a" strokeWidth="1" />
        <line x1={sep2} y1="8" x2={sep2} y2="126" stroke="#27272a" strokeWidth="1" />

        {/* ── PANEL 1 : HAUSSIER ── */}
        <path d={p(bullPts)} stroke="#10b981" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="4" cy="114" r="2.5" fill="#52525b" />
        {bullHH.map(([x, y], i) => (
          <circle key={`bh${i}`} cx={x} cy={y} r="3.5" fill="#10b981" opacity="0.85" />
        ))}
        {bullHL.map(([x, y], i) => (
          <circle key={`bl${i}`} cx={x} cy={y} r="2.5" fill="#10b981" opacity="0.45" />
        ))}
        <text x="82" y="22" fontSize="13" fill="#10b981" opacity="0.3" textAnchor="middle">↗</text>

        {/* ── PANEL 2 : RANGE ── */}
        <rect
          x={sep1 + 1} y={rangeTop} width={sep2 - sep1 - 2} height={rangeBot - rangeTop}
          fill="#71717a06"
        />
        <line
          x1={sep1 + 2} y1={rangeTop} x2={sep2 - 2} y2={rangeTop}
          stroke="#52525b" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.55"
        />
        <line
          x1={sep1 + 2} y1={rangeBot} x2={sep2 - 2} y2={rangeBot}
          stroke="#52525b" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.55"
        />
        <path d={p(rangePts)} stroke="#71717a" strokeWidth="1.5" strokeLinejoin="round" />
        {rangePts.slice(1, -1).map(([x, y], i) => (
          <circle key={`r${i}`} cx={x} cy={y} r="2.5" fill="#71717a" opacity="0.5" />
        ))}

        {/* ── PANEL 3 : BAISSIER ── */}
        <path d={p(bearPts)} stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="182" cy="50" r="2.5" fill="#52525b" />
        {bearLL.map(([x, y], i) => (
          <circle key={`bd${i}`} cx={x} cy={y} r="3.5" fill="#ef4444" opacity="0.85" />
        ))}
        {bearLH.map(([x, y], i) => (
          <circle key={`bu${i}`} cx={x} cy={y} r="2.5" fill="#ef4444" opacity="0.45" />
        ))}
        <text x="258" y="22" fontSize="13" fill="#ef4444" opacity="0.3" textAnchor="middle">↘</text>

        {/* Bottom labels */}
        <text x="44" y="135" fontSize="9" fill="#10b981" textAnchor="middle" fontWeight="700">HAUSSIER</text>
        <text x="44" y="147" fontSize="8" fill="#71717a" textAnchor="middle">Achats uniquement</text>

        <text x="134" y="135" fontSize="9" fill="#71717a" textAnchor="middle" fontWeight="700">RANGE</text>
        <text x="134" y="147" fontSize="8" fill="#71717a" textAnchor="middle">Pas de trade</text>

        <text x="224" y="135" fontSize="9" fill="#ef4444" textAnchor="middle" fontWeight="700">BAISSIER</text>
        <text x="224" y="147" fontSize="8" fill="#71717a" textAnchor="middle">Ventes uniquement</text>
      </svg>
    </div>
  );
}

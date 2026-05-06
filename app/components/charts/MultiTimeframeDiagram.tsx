interface MultiTimeframeDiagramProps {
  className?: string;
}

export function MultiTimeframeDiagram({ className = "" }: MultiTimeframeDiagramProps) {
  const p = (pts: number[][]) =>
    pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");

  const sep1 = 89;
  const sep2 = 179;

  // Panel 1 — Daily: clear bullish trend (emerald)
  const dailyPts = [[4, 114], [16, 98], [28, 108], [42, 86], [56, 94], [68, 68], [80, 74]];
  const dailyHH = [[16, 98], [42, 86], [68, 68]];
  const dailyHL = [[28, 108], [56, 94]];

  // Panel 2 — H4: retracement within bullish, zone of interest
  const h4Pts = [[93, 48], [108, 62], [122, 74], [136, 86], [150, 92], [163, 84], [175, 78]];
  const h4ZoneX = 118, h4ZoneY = 80, h4ZoneW = 58, h4ZoneH = 18;

  // Panel 3 — M15: pin bar entry candles
  const m15ZoneY = 100;
  const candles = [
    { cx: 194, bt: 80, bb: 96, wt: 76, wb: 100, bull: false },
    { cx: 210, bt: 86, bb: 100, wt: 82, wb: 104, bull: false },
    { cx: 226, bt: 96, bb: 100, wt: 92, wb: 118, bull: true }, // pin bar
    { cx: 242, bt: 84, bb: 98, wt: 80, wb: 102, bull: true },
    { cx: 258, bt: 70, bb: 84, wt: 66, wb: 88, bull: true },
  ];

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
        <line x1={sep1} y1="8" x2={sep1} y2="140" stroke="#27272a" strokeWidth="1" />
        <line x1={sep2} y1="8" x2={sep2} y2="140" stroke="#27272a" strokeWidth="1" />

        {/* ── PANEL 1 : DAILY ── */}
        <text x="44" y="15" fontSize="8" fill="#52525b" textAnchor="middle" fontWeight="700" letterSpacing="1">DAILY</text>
        <text x="44" y="25" fontSize="7.5" fill="#10b981" textAnchor="middle">Biais ↗</text>
        <path d={p(dailyPts)} stroke="#10b981" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="4" cy="114" r="2.5" fill="#52525b" />
        {dailyHH.map(([x, y], i) => (
          <circle key={`dh${i}`} cx={x} cy={y} r="3.5" fill="#10b981" opacity="0.85" />
        ))}
        {dailyHL.map(([x, y], i) => (
          <circle key={`dl${i}`} cx={x} cy={y} r="2.5" fill="#10b981" opacity="0.4" />
        ))}
        {/* Zoom rectangle indicating H4 area */}
        <rect x="58" y="64" width="26" height="20" rx="2" stroke="#60a5fa" strokeWidth="1" fill="#60a5fa08" strokeDasharray="3 2" />

        {/* ── PANEL 2 : H4 ── */}
        <text x="134" y="15" fontSize="8" fill="#52525b" textAnchor="middle" fontWeight="700" letterSpacing="1">H4</text>
        <text x="134" y="25" fontSize="7.5" fill="#60a5fa" textAnchor="middle">Zone</text>
        {/* Zone of interest */}
        <rect x={h4ZoneX} y={h4ZoneY} width={h4ZoneW} height={h4ZoneH} rx="2" fill="#10b98110" stroke="#10b98140" strokeWidth="1" />
        <path d={p(h4Pts)} stroke="#10b981" strokeWidth="1.8" strokeLinejoin="round" opacity="0.8" />
        <circle cx="150" cy="92" r="3.5" fill="#10b981" opacity="0.85" />
        {/* Zoom rectangle indicating M15 area */}
        <rect x="142" y="80" width="32" height="18" rx="2" stroke="#60a5fa" strokeWidth="1" fill="#60a5fa08" strokeDasharray="3 2" />

        {/* ── PANEL 3 : M15 ── */}
        <text x="224" y="15" fontSize="8" fill="#52525b" textAnchor="middle" fontWeight="700" letterSpacing="1">M15</text>
        <text x="224" y="25" fontSize="7.5" fill="#60a5fa" textAnchor="middle">Signal</text>
        {/* Zone support line */}
        <line
          x1={sep2 + 2} y1={m15ZoneY} x2="266" y2={m15ZoneY}
          stroke="#10b981" strokeWidth="1" strokeDasharray="4 3" opacity="0.45"
        />
        {/* Mini candles */}
        {candles.map((c, i) => (
          <g key={i}>
            <line
              x1={c.cx} y1={c.wt} x2={c.cx} y2={c.wb}
              stroke="#3f3f46" strokeWidth="1.5" strokeLinecap="round"
            />
            <rect
              x={c.cx - 5} y={c.bt} width="10"
              height={Math.max(c.bb - c.bt, 2)}
              fill={c.bull ? "#10b981" : "#ef4444"}
              stroke={c.bull ? "#059669" : "#dc2626"}
              strokeWidth="0.7" rx="1"
            />
          </g>
        ))}
        {/* Pin bar badge */}
        <circle cx="226" cy="118" r="3" fill="#10b981" opacity="0.9" />
        <rect x="210" y="122" width="32" height="13" rx="3" fill="#10b98118" stroke="#10b98138" strokeWidth="0.8" />
        <text x="226" y="132" fontSize="7.5" fill="#10b981" textAnchor="middle" fontWeight="700">Pin bar ↑</text>

        {/* Connector hints between panels */}
        <line x1="84" y1="74" x2={sep1} y2="74" stroke="#60a5fa" strokeWidth="1" opacity="0.4" />
        <line x1={sep2} y1="90" x2="181" y2="90" stroke="#60a5fa" strokeWidth="1" opacity="0.4" />
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">Daily — biais directionnel</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-[10px] text-zinc-500">H4 — zone d'entrée</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: "#60a5fa" }} />
          <span className="text-[10px] text-zinc-500">M15 — signal de déclenchement</span>
        </div>
      </div>
    </div>
  );
}

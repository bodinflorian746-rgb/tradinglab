interface BacktestMetricsDiagramProps {
  className?: string;
}

// 16 waypoints for 100-trade equity curve
// zero at y=356, scale=7px per R
// cumR: 0→3→5→8→2→4→7→10→7→12→10→14→18→15→19→22
const EQ: [number, number][] = [
  [36,  356], [121, 335], [206, 321], [249, 300],
  [292, 342], [334, 328], [377, 307], [419, 286],
  [462, 307], [547, 272], [590, 286], [632, 258],
  [718, 230], [760, 251], [803, 223], [888, 202],
];

const eqPath = "M" + EQ.map(([x, y]) => `${x},${y}`).join(" L");

const HIST = [
  { r: "-2R", trades: 5,  win: false, cx: 506 },
  { r: "-1R", trades: 40, win: false, cx: 594 },
  { r: "+1R", trades: 25, win: true,  cx: 682 },
  { r: "+2R", trades: 20, win: true,  cx: 770 },
  { r: "+3R", trades: 10, win: true,  cx: 858 },
];
const HIST_BASE = 548;
const HIST_SCALE = 3;

export function BacktestMetricsDiagram({ className = "" }: BacktestMetricsDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      {/* ── DESKTOP (SVG 900×600, inchangé) ───────────────────────── */}
      <svg
        width="100%"
        viewBox="0 0 900 600"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        className="hidden sm:block"
      >
        {/* ── SECTION 1 — HERO METRICS ── */}

        {/* Card backgrounds */}
        <rect x={10}  y={10} width={286} height={120} rx="6" fill="#18181b" />
        <rect x={304} y={10} width={286} height={120} rx="6" fill="#18181b" />
        <rect x={598} y={10} width={290} height={120} rx="6" fill="#18181b" />

        {/* Card separators */}
        <line x1={300} y1={18} x2={300} y2={122} stroke="#27272a" strokeWidth="1" />
        <line x1={594} y1={18} x2={594} y2={122} stroke="#27272a" strokeWidth="1" />

        {/* Card 1 — Win Rate */}
        <text x={153} y={38}  fontSize="9"  fill="#52525b" textAnchor="middle" fontWeight="700" letterSpacing="1">WIN RATE</text>
        <text x={153} y={90}  fontSize="36" fill="#34d399" textAnchor="middle" fontWeight="700">55%</text>
        <text x={153} y={110} fontSize="9"  fill="#52525b" textAnchor="middle">55 / 100 trades gagnants</text>

        {/* Card 2 — Profit Factor */}
        <text x={447} y={38}  fontSize="9"  fill="#52525b" textAnchor="middle" fontWeight="700" letterSpacing="1">PROFIT FACTOR</text>
        <text x={447} y={90}  fontSize="36" fill="#34d399" textAnchor="middle" fontWeight="700">1.8</text>
        <text x={447} y={110} fontSize="9"  fill="#52525b" textAnchor="middle">ratio gains / pertes</text>

        {/* Card 3 — Max Drawdown */}
        <text x={743} y={38}  fontSize="9"  fill="#52525b" textAnchor="middle" fontWeight="700" letterSpacing="1">MAX DRAWDOWN</text>
        <text x={743} y={90}  fontSize="36" fill="#f87171" textAnchor="middle" fontWeight="700">-12%</text>
        <text x={743} y={110} fontSize="9"  fill="#52525b" textAnchor="middle">pic de perte consécutive</text>

        {/* ── SECTION 2 — EQUITY CURVE ── */}
        <line x1={10} y1={140} x2={888} y2={140} stroke="#27272a" strokeWidth="1" />

        <rect x={318} y={148} width={264} height={15} rx="3" fill="#09090b" fillOpacity="0.85" />
        <text x={450} y={159} fontSize="9" fill="#52525b" textAnchor="middle" fontWeight="600">
          Simulation sur 100 trades — Equity (en R)
        </text>

        {/* Y-axis gridlines */}
        {[{ r: "+5R", y: 321 }, { r: "+10R", y: 286 }, { r: "+15R", y: 251 }, { r: "+20R", y: 216 }].map(({ r, y }) => (
          <g key={r}>
            <line x1={36} y1={y} x2={888} y2={y} stroke="#27272a" strokeWidth="0.7" strokeDasharray="3 4" />
            <text x={32} y={y + 4} fontSize="8" fill="#3f3f46" textAnchor="end">{r}</text>
          </g>
        ))}

        {/* Zero baseline */}
        <line x1={36} y1={356} x2={888} y2={356} stroke="#3f3f46" strokeWidth="1" strokeDasharray="5 3" opacity="0.8" />
        <text x={32} y={360} fontSize="8" fill="#52525b" textAnchor="end">0R</text>

        {/* X-axis ticks */}
        {[{ n: "0",   x: 36  },
          { n: "25",  x: 249 },
          { n: "50",  x: 462 },
          { n: "75",  x: 675 },
          { n: "100", x: 888 }].map(({ n, x }) => (
          <g key={n}>
            <line x1={x} y1={356} x2={x} y2={363} stroke="#3f3f46" strokeWidth="0.8" />
            <text x={x} y={374} fontSize="8" fill="#52525b" textAnchor="middle">{n}</text>
          </g>
        ))}
        <text x={462} y={387} fontSize="8" fill="#3f3f46" textAnchor="middle">Trade #</text>

        {/* Equity fill */}
        <path d={`${eqPath} L888,356 L36,356 Z`} fill="#10b98108" />

        {/* Drawdown shading (T25→T30) */}
        <path d="M249,300 L292,342 L292,356 L249,300 Z" fill="#ef44440a" />

        {/* Main curve */}
        <path d={eqPath} stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {/* Drawdown segments in red */}
        <path d="M249,300 L292,342" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" opacity="0.7" />
        <path d="M419,286 L462,307" stroke="#ef4444" strokeWidth="1.5" strokeLinejoin="round" opacity="0.5" />
        <path d="M718,230 L760,251" stroke="#ef4444" strokeWidth="1.5" strokeLinejoin="round" opacity="0.5" />

        {/* Drawdown max annotation — trough at (292, 342) */}
        <circle cx={292} cy={342} r="5" fill="#ef4444" opacity="0.9" />
        <line x1={292} y1={347} x2={292} y2={354} stroke="#ef4444" strokeWidth="0.8" opacity="0.5" />
        <rect x={216} y={347} width={152} height={15} rx="3" fill="#09090b" fillOpacity="0.85" />
        <rect x={216} y={347} width={152} height={15} rx="3" fill="#ef444412" stroke="#ef444430" strokeWidth="0.7" />
        <text x={292} y={358} fontSize="8.5" fill="#ef4444" textAnchor="middle" fontWeight="700">Drawdown max -6R</text>

        {/* Equity final annotation — endpoint (888, 202) */}
        <circle cx={888} cy={202} r="5" fill="#10b981" opacity="0.9" />
        <rect x={752} y={184} width={130} height={15} rx="3" fill="#09090b" fillOpacity="0.85" />
        <rect x={752} y={184} width={130} height={15} rx="3" fill="#10b98112" stroke="#10b98130" strokeWidth="0.7" />
        <text x={817} y={195} fontSize="8.5" fill="#10b981" textAnchor="middle" fontWeight="700">Equity final +22R</text>

        {/* ── SECTION 3 — RÉPARTITION + HISTOGRAM ── */}
        <line x1={10} y1={395} x2={888} y2={395} stroke="#27272a" strokeWidth="1" />
        <line x1={445} y1={402} x2={445} y2={572} stroke="#27272a" strokeWidth="1" />

        {/* LEFT — Répartition bar */}
        <text x={221} y={413} fontSize="9" fill="#52525b" textAnchor="middle" fontWeight="700" letterSpacing="0.5">RÉPARTITION SUR 100 TRADES</text>

        {/* Bar segments */}
        <rect x={20} y={422} width={220} height={46} rx="4"
          fill="#10b98135" stroke="#10b98155" strokeWidth="1" />
        <rect x={240} y={422} width={180} height={46}
          style={{ borderRadius: "0 4px 4px 0" }}
          fill="#ef444435" stroke="#ef444455" strokeWidth="1" />

        <text x={130} y={450} fontSize="11" fill="#f4f4f5" textAnchor="middle" fontWeight="700">55 gagnants</text>
        <text x={330} y={450} fontSize="11" fill="#f4f4f5" textAnchor="middle" fontWeight="700">45 perdants</text>

        <text x={130} y={464} fontSize="8" fill="#10b98180" textAnchor="middle">55%</text>
        <text x={330} y={464} fontSize="8" fill="#ef444480" textAnchor="middle">45%</text>

        {/* Sub-metrics below bar */}
        <text x={221} y={490} fontSize="9" fill="#3f3f46" textAnchor="middle">
          Gain moy. gagn. : +1.4R  |  Perte moy. perd. : −1.0R
        </text>
        <text x={221} y={506} fontSize="9" fill="#3f3f46" textAnchor="middle">
          Trades testés : 100
        </text>

        {/* RIGHT — Histogram */}
        <text x={668} y={413} fontSize="9" fill="#52525b" textAnchor="middle" fontWeight="700" letterSpacing="0.5">DISTRIBUTION DES R</text>

        {/* Baseline */}
        <line x1={462} y1={HIST_BASE} x2={888} y2={HIST_BASE} stroke="#3f3f46" strokeWidth="1" />

        {HIST.map(({ r, trades, win, cx }) => {
          const barH = trades * HIST_SCALE;
          const barTop = HIST_BASE - barH;
          const halfW = 28;
          return (
            <g key={r}>
              <rect
                x={cx - halfW} y={barTop} width={halfW * 2} height={barH}
                rx="3"
                fill={win ? "#10b98128" : "#ef444428"}
                stroke={win ? "#10b98158" : "#ef444458"}
                strokeWidth="1"
              />
              <rect x={cx - 10} y={barTop - 14} width={20} height={12} rx="2"
                fill="#09090b" fillOpacity="0.85" />
              <text x={cx} y={barTop - 4} fontSize="8" fill={win ? "#34d399" : "#f87171"}
                textAnchor="middle" fontWeight="600">{trades}</text>
              <text x={cx} y={HIST_BASE + 14} fontSize="8.5" fill="#52525b"
                textAnchor="middle">{r}</text>
            </g>
          );
        })}

        {/* ── FOOTER — EXPECTANCY ── */}
        <line x1={10} y1={578} x2={888} y2={578} stroke="#1f1f23" strokeWidth="0.8" />
        <text x={450} y={592} fontSize="9" fill="#34d399" textAnchor="middle">
          Expectancy : +0.22R / trade — sur 1000 trades : +220R de gain attendu
        </text>
      </svg>

      {/* ── MOBILE (HTML reconstruit) ───────────────────────────── */}
      <div className="sm:hidden p-4 space-y-3">
        {/* Hero metrics — 3 cartes */}
        <div className="grid grid-cols-3 gap-1.5">
          <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-2 text-center">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wide font-bold">Win rate</p>
            <p className="text-[20px] font-bold text-emerald-400 mt-0.5 leading-tight">55%</p>
            <p className="text-[10px] text-zinc-600 mt-0.5">55/100</p>
          </div>
          <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-2 text-center">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wide font-bold">Profit F.</p>
            <p className="text-[20px] font-bold text-emerald-400 mt-0.5 leading-tight">1.8</p>
            <p className="text-[10px] text-zinc-600 mt-0.5">gains/pertes</p>
          </div>
          <div className="rounded-lg border border-red-500/25 bg-red-500/5 p-2 text-center">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wide font-bold">Drawdown</p>
            <p className="text-[20px] font-bold text-red-400 mt-0.5 leading-tight">−12%</p>
            <p className="text-[10px] text-zinc-600 mt-0.5">pic perte</p>
          </div>
        </div>

        {/* Equity curve mini-SVG */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide text-center mb-2">
            Equity sur 100 trades (en R)
          </p>
          <svg viewBox="0 0 320 130" width="100%" fill="none" aria-label="Equity curve 100 trades">
            {/* Baseline 0R */}
            <line x1={20} y1={118} x2={320} y2={118} stroke="#3f3f46" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
            <text x={6} y={122} fontSize="9" fill="#52525b">0</text>
            <text x={2} y={20} fontSize="9" fill="#52525b">+22R</text>
            {/* Rescale of EQ: x 36-888 → 20-320 (factor 0.352, offset +7.32) ; y 202-356 → 14-118 (factor 0.675, offset -122.4) */}
            <path
              d="M20,118 L50,104 L80,95 L91,81 L106,109 L121,100 L136,87 L150,73 L165,87 L195,64 L210,73 L225,55 L255,37 L270,51 L285,33 L320,18"
              stroke="#10b981" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"
            />
            {/* Drawdown segment T25-T30 (in red) */}
            <path d="M80,95 L91,81 L106,109" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" opacity="0.7" />
            {/* Markers */}
            <circle cx={106} cy={109} r="4" fill="#ef4444" />
            <circle cx={320} cy={18} r="4" fill="#10b981" />
          </svg>
          <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-red-400 font-semibold">Drawdown max −6R</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-emerald-400 font-semibold">Equity final +22R</span>
            </div>
          </div>
        </div>

        {/* Répartition gagnants / perdants */}
        <div>
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide mb-2 text-center">
            Répartition sur 100 trades
          </p>
          <div className="flex items-stretch h-8 rounded-md overflow-hidden border border-zinc-800">
            <div className="flex items-center justify-center bg-emerald-500/30 border-r border-emerald-500/50" style={{ width: "55%" }}>
              <span className="text-[12px] font-bold text-white">55 gagn.</span>
            </div>
            <div className="flex items-center justify-center bg-red-500/30" style={{ width: "45%" }}>
              <span className="text-[12px] font-bold text-white">45 perd.</span>
            </div>
          </div>
          <p className="text-[11px] text-zinc-500 text-center mt-1.5">
            Gain moy. <span className="text-emerald-400 font-semibold">+1.4R</span> · Perte moy. <span className="text-red-400 font-semibold">−1.0R</span>
          </p>
        </div>

        {/* Distribution des R — barres */}
        <div>
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide mb-2 text-center">
            Distribution des R
          </p>
          <div className="grid grid-cols-5 gap-1 items-end h-24">
            {HIST.map((h) => {
              const heightPct = (h.trades / 40) * 100;
              return (
                <div key={h.r} className="flex flex-col items-center justify-end h-full">
                  <span className={`text-[11px] font-bold ${h.win ? "text-emerald-400" : "text-red-400"}`}>{h.trades}</span>
                  <div
                    className={`w-full rounded-t ${h.win ? "bg-emerald-500/30 border-x border-t border-emerald-500/50" : "bg-red-500/30 border-x border-t border-red-500/50"}`}
                    style={{ height: `${heightPct}%`, minHeight: "4px" }}
                  />
                  <span className={`text-[10px] mt-1 font-mono ${h.win ? "text-emerald-400" : "text-red-400"}`}>{h.r}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expectancy footer */}
        <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-2.5 text-center">
          <p className="text-[12px] text-emerald-400 font-bold">
            Expectancy : +0.22R / trade
          </p>
          <p className="text-[11px] text-zinc-300 mt-0.5">
            Sur 1 000 trades : <span className="font-bold text-emerald-400">+220R</span> de gain attendu
          </p>
        </div>
      </div>
    </div>
  );
}

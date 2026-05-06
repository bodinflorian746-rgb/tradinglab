interface TradingJournalDiagramProps {
  className?: string;
}

type Trade = {
  date: string;
  setup: string;
  rr: string;
  result: string;
  win: boolean;
};

const TRADES: Trade[] = [
  { date: "12/04", setup: "OB Bullish",  rr: "1:2",   result: "+2R",   win: true  },
  { date: "13/04", setup: "OTE Long",    rr: "1:1.5", result: "+1.5R", win: true  },
  { date: "14/04", setup: "FVG Bullish", rr: "1:1.5", result: "+1.5R", win: true  },
  { date: "15/04", setup: "Range Break", rr: "1:1",   result: "-1R",   win: false },
  { date: "16/04", setup: "OTE Long",    rr: "1:2",   result: "-1R",   win: false },
  { date: "17/04", setup: "OB Bullish",  rr: "1:2",   result: "+1R",   win: true  },
  { date: "19/04", setup: "Range Break", rr: "1:2",   result: "-1R",   win: false },
  { date: "20/04", setup: "FVG Bearish", rr: "1:2",   result: "-1R",   win: false },
  { date: "21/04", setup: "OTE Long",    rr: "1:2",   result: "+1R",   win: true  },
  { date: "22/04", setup: "OB Bullish",  rr: "1:2.5", result: "+2.5R", win: true  },
];

// Equity: zero at y=340, scale=40px per R
// Cumulative R: 0 → 2 → 3.5 → 5 → 4 → 3 → 4 → 3 → 2 → 3 → 5.5
const EQ_PTS: [number, number][] = [
  [452, 340], [496, 260], [540, 200], [584, 140],
  [628, 180], [672, 220], [716, 180], [760, 220],
  [804, 260], [848, 220], [892, 120],
];

const eqPath = "M" + EQ_PTS.map(([x, y]) => `${x},${y}`).join(" L");

const COL = { date: 15, setup: 80, rr: 218, result: 292 };
const HDR_SEP = 66;
const ROW_Y0 = 86;
const ROW_DY = 28;

export function TradingJournalDiagram({ className = "" }: TradingJournalDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg
        width="100%"
        viewBox="0 0 900 490"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── LEFT PANEL — TABLE ── */}

        <rect x={15} y={12} width={90} height={17} rx="3"
          fill="#10b98114" stroke="#10b98130" strokeWidth="0.8" />
        <text x={60} y={24} fontSize="9" fill="#10b981"
          textAnchor="middle" fontWeight="700">Win Rate 60%</text>

        <rect x={115} y={12} width={72} height={17} rx="3"
          fill="#10b98114" stroke="#10b98130" strokeWidth="0.8" />
        <text x={151} y={24} fontSize="9" fill="#10b981"
          textAnchor="middle" fontWeight="700">+5.5R net</text>

        <rect x={10} y={38} width={425} height={28} fill="#18181b" />
        <text x={COL.date}   y={57} fontSize="10" fill="#52525b" fontWeight="700" letterSpacing="0.5">DATE</text>
        <text x={COL.setup}  y={57} fontSize="10" fill="#52525b" fontWeight="700" letterSpacing="0.5">SETUP</text>
        <text x={COL.rr}     y={57} fontSize="10" fill="#52525b" fontWeight="700" letterSpacing="0.5">R/R</text>
        <text x={COL.result} y={57} fontSize="10" fill="#52525b" fontWeight="700" letterSpacing="0.5">RÉSULTAT</text>
        <line x1={10} y1={HDR_SEP} x2={435} y2={HDR_SEP} stroke="#3f3f46" strokeWidth="1.2" />

        {TRADES.map((t, i) => {
          const y = ROW_Y0 + i * ROW_DY;
          const sepY = HDR_SEP + (i + 1) * ROW_DY;
          return (
            <g key={i}>
              <rect x={10} y={y - 19} width={425} height={27}
                fill={t.win ? "#10b9810a" : "#ef44440a"} />
              <line x1={10} y1={sepY} x2={435} y2={sepY}
                stroke="#1f1f23" strokeWidth="0.8" />
              <text x={COL.date}   y={y} fontSize="11" fill="#71717a">{t.date}</text>
              <text x={COL.setup}  y={y} fontSize="11" fill="#a1a1aa">{t.setup}</text>
              <text x={COL.rr}     y={y} fontSize="10" fill="#52525b">{t.rr}</text>
              <text x={COL.result} y={y} fontSize="11" fontWeight="600"
                fill={t.win ? "#34d399" : "#f87171"}>{t.result}</text>
            </g>
          );
        })}

        {/* ── DIVIDER ── */}
        <line x1={445} y1={8} x2={445} y2={382} stroke="#27272a" strokeWidth="1" />

        {/* ── RIGHT PANEL — EQUITY CURVE ── */}

        <rect x={588} y={12} width={190} height={16} rx="3"
          fill="#09090b" fillOpacity="0.85" />
        <text x={683} y={23} fontSize="8.5" fill="#52525b"
          textAnchor="middle" fontWeight="600">Equity — capital cumulé (en R)</text>

        {/* Zero baseline */}
        <line x1={452} y1={340} x2={892} y2={340}
          stroke="#3f3f46" strokeWidth="1" strokeDasharray="5 3" opacity="0.8" />
        <text x={449} y={344} fontSize="8" fill="#52525b" textAnchor="end">0R</text>

        {/* Grid lines */}
        {[{ label: "+2R", y: 260 }, { label: "+4R", y: 180 }].map(({ label, y }) => (
          <g key={label}>
            <line x1={452} y1={y} x2={892} y2={y}
              stroke="#27272a" strokeWidth="0.7" strokeDasharray="3 4" />
            <text x={449} y={y + 4} fontSize="8" fill="#3f3f46" textAnchor="end">{label}</text>
          </g>
        ))}

        {/* X-axis */}
        {EQ_PTS.slice(1).map(([x], i) => (
          <g key={i}>
            <line x1={x} y1={340} x2={x} y2={348} stroke="#3f3f46" strokeWidth="0.8" />
            <text x={x} y={360} fontSize="8" fill="#52525b" textAnchor="middle">{i + 1}</text>
          </g>
        ))}
        <text x={672} y={374} fontSize="8" fill="#3f3f46" textAnchor="middle">Trade #</text>

        {/* Equity fill */}
        <path d={`${eqPath} L892,340 L452,340 Z`} fill="#10b98108" />

        {/* Equity curve */}
        <path d={eqPath}
          stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {/* Dots */}
        {EQ_PTS.slice(1).map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3"
            fill="#10b981" opacity={y <= 200 ? "0.9" : "0.4"} />
        ))}

        {/* Best streak — T3 peak (584, 140) */}
        <circle cx={584} cy={140} r="5" fill="#10b981" opacity="0.9" />
        <line x1={584} y1={135} x2={584} y2={127}
          stroke="#10b981" strokeWidth="0.8" opacity="0.5" />
        <rect x={524} y={109} width={120} height={16} rx="3"
          fill="#09090b" fillOpacity="0.85" />
        <rect x={524} y={109} width={120} height={16} rx="3"
          fill="#10b98112" stroke="#10b98130" strokeWidth="0.7" />
        <text x={584} y={121} fontSize="8.5" fill="#10b981"
          textAnchor="middle" fontWeight="700">Best streak +5R</text>

        {/* Worst drawdown — T5 trough (672, 220) */}
        <circle cx={672} cy={220} r="5" fill="#ef4444" opacity="0.9" />
        <line x1={672} y1={225} x2={672} y2={233}
          stroke="#ef4444" strokeWidth="0.8" opacity="0.5" />
        <rect x={606} y={233} width={132} height={16} rx="3"
          fill="#09090b" fillOpacity="0.85" />
        <rect x={606} y={233} width={132} height={16} rx="3"
          fill="#ef444412" stroke="#ef444430" strokeWidth="0.7" />
        <text x={672} y={245} fontSize="8.5" fill="#ef4444"
          textAnchor="middle" fontWeight="700">Worst drawdown -2R</text>

        {/* ── INSIGHTS BAND ── */}
        <line x1={10} y1={386} x2={892} y2={386} stroke="#27272a" strokeWidth="1" />

        <rect x={10}  y={394} width={280} height={80} rx="4"
          fill="#10b9810a" stroke="#10b98120" strokeWidth="0.8" />
        <text x={22} y={414} fontSize="8.5" fill="#34d399" fontWeight="700">✓  Setup le plus rentable</text>
        <text x={22} y={432} fontSize="10"  fill="#a1a1aa">OB Bullish — 3 / 3 gagnants</text>
        <text x={22} y={450} fontSize="8.5" fill="#52525b">Ratio moyen : +1.83R / trade</text>

        <rect x={306} y={394} width={280} height={80} rx="4"
          fill="#ef44440a" stroke="#ef444420" strokeWidth="0.8" />
        <text x={318} y={414} fontSize="8.5" fill="#f87171" fontWeight="700">✗  Setup à éviter</text>
        <text x={318} y={432} fontSize="10"  fill="#a1a1aa">Range Break — 0 / 2 gagnants</text>
        <text x={318} y={450} fontSize="8.5" fill="#52525b">Supprimer de ton plan de trading</text>

        <rect x={602} y={394} width={286} height={80} rx="4"
          fill="#60a5fa0a" stroke="#60a5fa20" strokeWidth="0.8" />
        <text x={614} y={414} fontSize="8.5" fill="#60a5fa" fontWeight="700">⚠  Erreur récurrente</text>
        <text x={614} y={432} fontSize="10"  fill="#a1a1aa">SL trop serré sur 3 trades</text>
        <text x={614} y={450} fontSize="8.5" fill="#52525b">Revoir sizing et placement du SL</text>
      </svg>
    </div>
  );
}

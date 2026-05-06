interface OTEDiagramProps {
  className?: string;
}

type CandleData = {
  cx: number;
  wickTop: number;
  bodyTop: number;
  bodyBot: number;
  wickBot: number;
  bull: boolean;
};

function MiniCandle({ cx, wickTop, bodyTop, bodyBot, wickBot, bull }: CandleData) {
  const hw = 8;
  return (
    <g>
      <line x1={cx} y1={wickTop} x2={cx} y2={wickBot}
        stroke={bull ? "#059669" : "#dc2626"} strokeWidth="1.5" strokeLinecap="round" />
      <rect x={cx - hw} y={bodyTop} width={hw * 2}
        height={Math.max(bodyBot - bodyTop, 3)}
        fill={bull ? "#10b981" : "#ef4444"}
        stroke={bull ? "#059669" : "#dc2626"}
        strokeWidth="0.8" rx="1.5" />
    </g>
  );
}

const swingLowY  = 188;
const swingHighY = 28;
const range      = swingLowY - swingHighY; // 160
const fibY = (pct: number) => swingHighY + (pct / 100) * range;

const levels = [
  { pct: 23.6, label: "23.6%", color: "#52525b", dash: "4 3", w: 0.9 },
  { pct: 38.2, label: "38.2%", color: "#71717a", dash: "5 3", w: 1.0 },
  { pct: 50.0, label: "50.0%", color: "#a1a1aa", dash: "5 3", w: 1.0 },
  { pct: 61.8, label: "61.8%", color: "#60a5fa", dash: "6 3", w: 1.3 },
  { pct: 78.6, label: "78.6%", color: "#60a5fa", dash: "6 3", w: 1.3 },
];

const oteTopY = fibY(61.8); // ≈ 126.9
const oteBotY = fibY(78.6); // ≈ 153.8

const LINE_X1 = 8;
const LINE_X2 = 276;
const LABEL_X = 280;

// Impulse candles — bullish, ascending from swing low to swing high
const impulse: CandleData[] = [
  { cx: 22,  wickTop: 164, bodyTop: 168, bodyBot: 186, wickBot: 190, bull: true },
  { cx: 44,  wickTop: 144, bodyTop: 148, bodyBot: 168, wickBot: 172, bull: true },
  { cx: 66,  wickTop: 120, bodyTop: 124, bodyBot: 148, wickBot: 152, bull: true },
  { cx: 88,  wickTop: 94,  bodyTop: 98,  bodyBot: 124, wickBot: 128, bull: true },
  { cx: 110, wickTop: 64,  bodyTop: 68,  bodyBot: 96,  wickBot: 100, bull: true },
  { cx: 130, wickTop: 28,  bodyTop: 32,  bodyBot: 66,  wickBot: 70,  bull: true },
];

// Retracement candles — bearish, descending into OTE zone
const retracement: CandleData[] = [
  { cx: 162, wickTop: 24,  bodyTop: 28,  bodyBot: 58,  wickBot: 62,  bull: false },
  { cx: 184, wickTop: 44,  bodyTop: 48,  bodyBot: 84,  wickBot: 88,  bull: false },
  { cx: 206, wickTop: 68,  bodyTop: 72,  bodyBot: 112, wickBot: 118, bull: false },
  { cx: 228, wickTop: 96,  bodyTop: 100, bodyBot: 138, wickBot: 148, bull: false },
];

// Signal candle — bullish rejection from OTE zone (wick taps 78.6%, closes above 61.8%)
const signal: CandleData = {
  cx: 252,
  wickTop: 118, bodyTop: 124, bodyBot: 138, wickBot: 154,
  bull: true,
};

export function OTEDiagram({ className = "" }: OTEDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg
        width="100%"
        viewBox="0 0 400 210"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* OTE zone background */}
        <rect x={LINE_X1} y={oteTopY} width={LINE_X2 - LINE_X1} height={oteBotY - oteTopY}
          fill="#60a5fa0d" stroke="#60a5fa30" strokeWidth="0.8" strokeDasharray="4 3" rx="1" />

        {/* Fibonacci level lines */}
        {levels.map((lvl) => {
          const y = fibY(lvl.pct);
          return (
            <line key={lvl.pct}
              x1={LINE_X1} y1={y} x2={LINE_X2} y2={y}
              stroke={lvl.color} strokeWidth={lvl.w}
              strokeDasharray={lvl.dash} opacity="0.8" />
          );
        })}

        {/* Candles rendered before labels so labels stay on top */}
        {impulse.map((c, i) => <MiniCandle key={i} {...c} />)}
        {retracement.map((c, i) => <MiniCandle key={i} {...c} />)}
        <MiniCandle {...signal} />

        {/* Fib labels — opaque bg for every level (anti-Sprint3 pattern) */}
        {levels.map((lvl) => {
          const y = fibY(lvl.pct);
          return (
            <g key={lvl.pct}>
              <rect x={LABEL_X} y={y - 7} width={52} height={13} rx="2"
                fill="#09090b" fillOpacity="0.85" />
              <text x={LABEL_X + 26} y={y + 3} fontSize="7"
                fill={lvl.color} textAnchor="middle" fontWeight="600">
                {lvl.label}
              </text>
            </g>
          );
        })}

        {/* OTE badge inside zone */}
        <rect x={LINE_X1 + 2} y={oteTopY + 2} width={26} height={13} rx="2"
          fill="#60a5fa18" stroke="#60a5fa40" strokeWidth="0.6" />
        <text x={LINE_X1 + 15} y={oteTopY + 12} fontSize="7.5" fill="#60a5fa"
          textAnchor="middle" fontWeight="700">OTE</text>

        {/* Swing High marker */}
        <circle cx={130} cy={swingHighY} r="3" fill="#71717a" opacity="0.8" />
        <rect x={107} y={12} width={52} height={11} rx="2" fill="#09090b" fillOpacity="0.85" />
        <text x={133} y={21} fontSize="7" fill="#71717a" textAnchor="middle" fontWeight="600">Swing High</text>

        {/* Swing Low marker */}
        <circle cx={22} cy={swingLowY} r="3" fill="#71717a" opacity="0.8" />
        <rect x={26} y={186} width={52} height={11} rx="2" fill="#09090b" fillOpacity="0.85" />
        <text x={52} y={194} fontSize="7" fill="#71717a" textAnchor="middle" fontWeight="600">Swing Low</text>

        {/* ENTRÉE badge above signal candle — opaque bg first to mask 50% Fib line beneath */}
        <rect x={233} y={100} width={38} height={12} rx="2"
          fill="#09090b" fillOpacity="0.85" />
        <rect x={233} y={100} width={38} height={12} rx="2"
          fill="#10b98118" stroke="#10b98140" strokeWidth="0.7" />
        <text x={252} y={109} fontSize="7.5" fill="#10b981"
          textAnchor="middle" fontWeight="700">ENTRÉE</text>

        {/* Signal annotation — connector + label below signal candle */}
        <line x1={252} y1={156} x2={252} y2={164}
          stroke="#71717a" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />
        <rect x={212} y={164} width={80} height={12} rx="2"
          fill="#09090b" fillOpacity="0.85" />
        <text x={252} y={173} fontSize="7" fill="#a1a1aa"
          textAnchor="middle">signal de rejet ↑</text>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-blue-400/40" />
          <span className="text-[10px] text-zinc-500">Zone OTE (61.8–78.6%) — entrée institutionnelle optimale</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">Mouvement impulsif haussier</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-[10px] text-zinc-500">Retracement dans l'OTE</span>
        </div>
      </div>
    </div>
  );
}

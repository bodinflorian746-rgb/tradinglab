interface PrecisionEntryDiagramProps {
  className?: string;
}

type CD = {
  cx: number;
  wickTop: number;
  bodyTop: number;
  bodyBot: number;
  wickBot: number;
  bull: boolean;
  wide?: boolean;
};

function Candle({ cx, wickTop, bodyTop, bodyBot, wickBot, bull, wide }: CD) {
  const hw = wide ? 11 : 8;
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

const CANDLES: CD[] = [
  { cx: 18,  wickTop: 110, bodyTop: 116, bodyBot: 152, wickBot: 158, bull: false },
  { cx: 44,  wickTop: 112, bodyTop: 120, bodyBot: 158, wickBot: 164, bull: false, wide: true },
  { cx: 72,  wickTop: 148, bodyTop: 152, bodyBot: 178, wickBot: 182, bull: true  },
  { cx: 96,  wickTop: 62,  bodyTop: 68,  bodyBot: 170, wickBot: 174, bull: true  },
  { cx: 120, wickTop: 52,  bodyTop: 58,  bodyBot: 108, wickBot: 130, bull: true  },
  { cx: 144, wickTop: 30,  bodyTop: 34,  bodyBot: 76,  wickBot: 80,  bull: true  },
  { cx: 168, wickTop: 14,  bodyTop: 18,  bodyBot: 52,  wickBot: 56,  bull: true  },
  { cx: 196, wickTop: 10,  bodyTop: 14,  bodyBot: 58,  wickBot: 64,  bull: false },
  { cx: 220, wickTop: 36,  bodyTop: 40,  bodyBot: 96,  wickBot: 102, bull: false },
  { cx: 244, wickTop: 68,  bodyTop: 74,  bodyBot: 130, wickBot: 140, bull: false },
  { cx: 268, wickTop: 102, bodyTop: 110, bodyBot: 134, wickBot: 156, bull: true  },
];

const LABEL_X = 283;

export function PrecisionEntryDiagram({ className = "" }: PrecisionEntryDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg
        width="100%"
        viewBox="0 0 500 210"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* OTE zone — outermost */}
        <rect x={10} y={116} width={270} height={42}
          fill="#60a5fa0a" stroke="#60a5fa25" strokeWidth="0.8"
          strokeDasharray="5 3" rx="2" />

        {/* OB zone — inside OTE */}
        <rect x={32} y={120} width={248} height={38}
          fill="#10b9810d" stroke="#10b98128" strokeWidth="0.8" rx="2" />

        {/* FVG zone — inside OB */}
        <rect x={62} y={130} width={218} height={18}
          fill="#60a5fa14" stroke="#60a5fa38" strokeWidth="0.8" rx="1.5" />

        {/* Support line */}
        <line x1={10} y1={140} x2={280} y2={140}
          stroke="#52525b" strokeWidth="0.9"
          strokeDasharray="4 3" opacity="0.7" />

        {/* Candles (rendered above zone rects) */}
        {CANDLES.map((c, i) => <Candle key={i} {...c} />)}

        {/* Right-side labels — 2 columns: OTE+FVG left, OB+Support right */}
        {/* OTE — col1, row1 */}
        <rect x={283} y={112} width={38} height={12} rx="2"
          fill="#09090b" fillOpacity="0.85" />
        <text x={302} y={121} fontSize="7.5" fill="#60a5fa"
          textAnchor="middle" fontWeight="700">OTE</text>

        {/* OB — col2, row1 */}
        <rect x={343} y={112} width={30} height={12} rx="2"
          fill="#09090b" fillOpacity="0.85" />
        <text x={358} y={121} fontSize="7.5" fill="#10b981"
          textAnchor="middle" fontWeight="700">OB</text>

        {/* FVG — col1, row2 */}
        <rect x={283} y={140} width={32} height={12} rx="2"
          fill="#09090b" fillOpacity="0.85" />
        <text x={299} y={149} fontSize="7.5" fill="#60a5fa"
          textAnchor="middle" fontWeight="700">FVG</text>

        {/* Support — col2, row2 */}
        <rect x={343} y={140} width={52} height={12} rx="2"
          fill="#09090b" fillOpacity="0.85" />
        <text x={369} y={149} fontSize="7" fill="#71717a"
          textAnchor="middle" fontWeight="600">Support</text>

        {/* ENTRÉE PRÉCISE badge above signal candle */}
        <rect x={235} y={86} width={66} height={13} rx="2"
          fill="#09090b" fillOpacity="0.85" />
        <rect x={235} y={86} width={66} height={13} rx="2"
          fill="#10b98118" stroke="#10b98145" strokeWidth="0.7" />
        <text x={268} y={96} fontSize="7.5" fill="#10b981"
          textAnchor="middle" fontWeight="700">ENTRÉE PRÉCISE</text>

        {/* Connector line from badge to signal candle */}
        <line x1={268} y1={99} x2={268} y2={107}
          stroke="#10b981" strokeWidth="0.8"
          strokeDasharray="2 2" opacity="0.5" />

        {/* 4 confluences counter — top right */}
        <rect x={384} y={8} width={108} height={14} rx="3"
          fill="#09090b" fillOpacity="0.85" />
        <rect x={384} y={8} width={108} height={14} rx="3"
          fill="#10b98112" stroke="#10b98130" strokeWidth="0.7" />
        <text x={438} y={18} fontSize="7.5" fill="#10b981"
          textAnchor="middle" fontWeight="600">4 confluences ✓</text>

        {/* Swing High marker */}
        <circle cx={168} cy={14} r="3" fill="#71717a" opacity="0.8" />
        <rect x={144} y={2} width={52} height={10} rx="2"
          fill="#09090b" fillOpacity="0.85" />
        <text x={170} y={10} fontSize="6.5" fill="#71717a"
          textAnchor="middle" fontWeight="600">Swing High</text>

        {/* Annotation below signal candle */}
        <line x1={268} y1={158} x2={268} y2={168}
          stroke="#71717a" strokeWidth="0.8"
          strokeDasharray="2 2" opacity="0.5" />
        <rect x={216} y={168} width={104} height={12} rx="2"
          fill="#09090b" fillOpacity="0.85" />
        <text x={268} y={177} fontSize="7" fill="#a1a1aa"
          textAnchor="middle">signal de rejet M15 ↑</text>

      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-blue-400/30" />
          <span className="text-[10px] text-zinc-500">Zone OTE (61.8–78.6%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-emerald-500/30" />
          <span className="text-[10px] text-zinc-500">Order Block (OB)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-blue-400/50" />
          <span className="text-[10px] text-zinc-500">Fair Value Gap (FVG)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-zinc-500">Signal de rejet — entrée de précision</span>
        </div>
      </div>
    </div>
  );
}

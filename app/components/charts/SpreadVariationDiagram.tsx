interface SpreadVariationDiagramProps {
  className?: string;
}

const hx = (h: number) => 40 + h * 35;
const vy = (pts: number) => 220 - pts * 19;

// Spread curve over 24h — EUR/USD approximation
const CURVE_PTS: [number, number][] = [
  [40, 116],  // 0h  ~5.5 pts
  [75, 90],   // 1h  ~6.8 pts
  [110, 68],  // 2h  ~8 pts — MAX
  [145, 80],  // 3h
  [180, 106], // 4h  ~6 pts
  [215, 132], // 5h
  [250, 154], // 6h  ~3.5 pts
  [285, 172], // 7h
  [320, 182], // 8h  ~2 pts
  [355, 192], // 9h
  [390, 196], // 10h
  [425, 200], // 11h
  [460, 201], // 12h ~1 pt
  [495, 201], // 13h ~1 pt — MIN
  [530, 200], // 14h
  [565, 196], // 15h
  [600, 190], // 16h
  [635, 182], // 17h ~2 pts
  [670, 168], // 18h
  [705, 154], // 19h
  [740, 136], // 20h
  [775, 116], // 21h
  [810, 88],  // 22h
  [845, 68],  // 23h ~8 pts
  [880, 106], // 24h
];

const curvePoints = CURVE_PTS.map(([x, y]) => `${x},${y}`).join(' ');

export function SpreadVariationDiagram({ className = '' }: SpreadVariationDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest text-center py-3 border-b border-zinc-800/60">
        EUR / USD — variation du spread sur 24h
      </p>

      <svg
        width="100%"
        viewBox="0 0 900 250"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Variation du spread EUR/USD sur 24 heures"
      >
        {/* ── Zone fills ── */}
        <rect x={40}  y={35} width={210} height={185} fill="#ef444410" />
        <rect x={810} y={35} width={70}  height={185} fill="#ef444410" />
        <rect x={355} y={35} width={280} height={185} fill="#10b98110" />

        {/* ── Guide lines (drawn over zone fills) ── */}
        {[2, 4, 6, 8].map(pts => (
          <line key={pts}
            x1={40} y1={vy(pts)} x2={880} y2={vy(pts)}
            stroke="#27272a" strokeWidth="1" strokeDasharray="4 4"
          />
        ))}

        {/* ── Zone borders ── */}
        <rect x={40}  y={35} width={210} height={185}
          stroke="#ef444432" strokeWidth="1" strokeDasharray="5 3" />
        <rect x={810} y={35} width={70}  height={185}
          stroke="#ef444432" strokeWidth="1" strokeDasharray="5 3" />
        <rect x={355} y={35} width={280} height={185}
          stroke="#10b98132" strokeWidth="1" strokeDasharray="5 3" />

        {/* ── Y axis ── */}
        <line x1={40} y1={35} x2={40} y2={220} stroke="#3f3f46" strokeWidth="1" />
        <text x={18} y={28} fontSize="8" fill="#52525b" textAnchor="middle">pts</text>
        {[0, 2, 4, 6, 8].map(pts => (
          <text key={pts} x={33} y={vy(pts) + 4} fontSize="9" fill="#52525b" textAnchor="end">{pts}</text>
        ))}

        {/* ── Timeline axis ── */}
        <line x1={40} y1={220} x2={880} y2={220} stroke="#3f3f46" strokeWidth="1.5" />
        {[0, 3, 6, 9, 12, 15, 18, 21, 24].map(h => (
          <g key={h}>
            <line x1={hx(h)} y1={220} x2={hx(h)} y2={226} stroke="#52525b" strokeWidth="1" />
            <text x={hx(h)} y={237} fontSize="9" fill="#52525b" textAnchor="middle">{h}h</text>
          </g>
        ))}

        {/* ── Spread curve ── */}
        <polyline
          points={curvePoints}
          stroke="#71717a" strokeWidth="2"
          strokeLinejoin="round" strokeLinecap="round"
        />

        {/* ── Zone labels ── */}
        {/* Off-peak */}
        <rect x={46} y={39} width={110} height={26} rx="3" fill="#09090b" fillOpacity="0.88" />
        <text x={52} y={51} fontSize="9" fill="#f87171" fontWeight="600">Heures creuses</text>
        <text x={52} y={61} fontSize="8" fill="#f87171" opacity="0.65">22h–6h · nuit</text>
        {/* Peak */}
        <rect x={361} y={39} width={148} height={26} rx="3" fill="#09090b" fillOpacity="0.88" />
        <text x={367} y={51} fontSize="9" fill="#34d399" fontWeight="600">Heures de pointe</text>
        <text x={367} y={61} fontSize="8" fill="#34d399" opacity="0.65">London + NY actifs</text>

        {/* ── Key point — MAX (2h, ~8 pts) ── */}
        <circle cx={110} cy={68} r="4" fill="#ef4444" />
        <line x1={110} y1={73} x2={110} y2={80} stroke="#ef444460" strokeWidth="1" />
        <rect x={67} y={81} width={86} height={12} rx="2" fill="#09090b" fillOpacity="0.88" />
        <text x={110} y={90} fontSize="9" fill="#f87171" textAnchor="middle" fontWeight="600">8 pts — maximum</text>

        {/* ── Key point — MIN (13h, ~1 pt) ── */}
        <circle cx={495} cy={201} r="4" fill="#10b981" />
        <line x1={495} y1={196} x2={495} y2={189} stroke="#10b98160" strokeWidth="1" />
        <rect x={448} y={177} width={94} height={12} rx="2" fill="#09090b" fillOpacity="0.88" />
        <text x={495} y={186} fontSize="9" fill="#34d399" textAnchor="middle" fontWeight="600">1 pt — minimum</text>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-emerald-500/50" />
          <span className="text-[10px] text-zinc-500">Spread serré — bonne fenêtre pour trader</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-red-500/50" />
          <span className="text-[10px] text-zinc-500">Spread large — éviter les petits objectifs</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-zinc-600" />
          <span className="text-[10px] text-zinc-500">Variation continue selon la liquidité</span>
        </div>
      </div>
    </div>
  );
}

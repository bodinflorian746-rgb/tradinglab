interface SupportResistanceProps {
  supportPrice?: string;
  resistancePrice?: string;
  className?: string;
}

export function SupportResistance({
  supportPrice = '1.0800',
  resistancePrice = '1.0950',
  className = '',
}: SupportResistanceProps) {
  const rY = 32;
  const sY = 114;

  // Price path bouncing between S/R
  const pts: [number, number][] = [
    [0, 73],
    [32, sY], [62, sY],
    [92, rY], [122, rY],
    [152, sY], [182, sY],
    [212, rY], [242, rY],
    [272, 76],
  ];
  const path = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');
  const touchPts = pts.slice(1, -1);

  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg
        width="100%"
        viewBox="0 0 290 148"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>{`@media (max-width: 640px) { .chart-detail-labels { display: none; } }`}</style>

        {/* Subtle zone tints */}
        <rect x="0" y="0" width="290" height={rY + 6} fill="#ef444408" />
        <rect x="0" y={sY - 6} width="290" height={148 - sY + 6} fill="#10b98108" />

        {/* Resistance line */}
        <line
          x1="0" y1={rY} x2="290" y2={rY}
          stroke="#f87171" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.7"
        />

        {/* Support line */}
        <line
          x1="0" y1={sY} x2="290" y2={sY}
          stroke="#34d399" strokeWidth="1.5" strokeDasharray="4 4" strokeOpacity="0.7"
        />

        {/* Price path */}
        <path d={path} stroke="#71717a" strokeWidth="1.5" fill="none" strokeLinejoin="round" />

        {/* Touch dots — toujours visibles */}
        {touchPts.map(([x, y], i) => (
          <circle
            key={i} cx={x} cy={y} r="3.5"
            fill={y === sY ? '#10b981' : '#ef4444'} opacity="0.9"
          />
        ))}

        {/* Labels & prix — masqués sur mobile */}
        <g className="chart-detail-labels">
          {resistancePrice && (
            <text x="225" y={rY - 9} fontSize="9" fill="#ef4444" opacity="0.5">
              {resistancePrice}
            </text>
          )}

          {supportPrice && (
            <text x="233" y={sY + 18} fontSize="9" fill="#10b981" opacity="0.5">
              {supportPrice}
            </text>
          )}

          <rect x="2" y={rY - 20} width="92" height="14" rx="3" fill="#09090b" />
          <text x="8" y={rY - 9} fontSize="10" fill="#ef4444" fontWeight="600" opacity="0.9">
            Résistance
          </text>

          <rect x="2" y={sY + 7} width="68" height="14" rx="3" fill="#09090b" />
          <text x="8" y={sY + 18} fontSize="10" fill="#10b981" fontWeight="600" opacity="0.9">
            Support
          </text>
        </g>
      </svg>

      {/* Mobile : key card avec définitions */}
      <div className="sm:hidden px-4 py-3 border-t border-zinc-800/60 space-y-2">
        <ul className="space-y-1.5 text-[13px] leading-snug">
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-3 h-1 rounded-sm bg-red-400 mt-2" />
            <span className="text-white">
              <span className="font-bold text-red-400">Résistance</span>
              <span className="text-zinc-300"> · zone où le prix est repoussé vers le bas {resistancePrice && <span className="font-mono text-zinc-400">({resistancePrice})</span>}</span>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0 w-3 h-1 rounded-sm bg-emerald-400 mt-2" />
            <span className="text-white">
              <span className="font-bold text-emerald-400">Support</span>
              <span className="text-zinc-300"> · zone où le prix rebondit vers le haut {supportPrice && <span className="font-mono text-zinc-400">({supportPrice})</span>}</span>
            </span>
          </li>
          <li className="flex items-start gap-2 pt-1 border-t border-zinc-800/50">
            <span className="shrink-0 text-zinc-300 font-bold">→</span>
            <span className="text-zinc-300">Les points rouges/verts marquent chaque rebond du prix sur ces niveaux</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

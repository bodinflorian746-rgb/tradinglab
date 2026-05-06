interface KillzonesDiagramProps {
  className?: string;
}

const hx = (h: number) => 40 + h * 35;

const VOL: [number, number][] = [
  [40, 196], [85, 192], [118, 178], [145, 172], [175, 180], [215, 192], [250, 194],
  [285, 190], [308, 148], [320, 118], [337, 72],
  [355, 88], [372, 108], [390, 132],
  [425, 178], [460, 192],
  [478, 158], [495, 118], [512, 78],
  [530, 92], [548, 112], [565, 135],
  [600, 180], [635, 192],
  [670, 190], [690, 155], [705, 138],
  [722, 155], [740, 172],
  [775, 192], [828, 196], [880, 198],
];

const volPath = "M " + VOL.map(([x, y]) => `${x},${y}`).join(" L ");

export function KillzonesDiagram({ className = "" }: KillzonesDiagramProps) {
  return (
    <div className={`bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden ${className}`}>
      <svg
        width="100%"
        viewBox="0 0 900 268"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Asian Range 00h–07h */}
        <rect x={hx(0)} y={42} width={hx(7) - hx(0)} height={173} fill="#3f3f4618" />

        {/* London KZ 07h–10h */}
        <rect x={hx(7)} y={42} width={hx(10) - hx(7)} height={173}
          fill="#10b98118" stroke="#10b98140" strokeWidth="1" />

        {/* NY AM KZ 12h–15h */}
        <rect x={hx(12)} y={42} width={hx(15) - hx(12)} height={173}
          fill="#10b98118" stroke="#10b98140" strokeWidth="1" />

        {/* NY PM KZ 18h–20h */}
        <rect x={hx(18)} y={42} width={hx(20) - hx(18)} height={173}
          fill="#60a5fa18" stroke="#60a5fa40" strokeWidth="1" />

        {/* Timeline axis */}
        <line x1={40} y1={215} x2={880} y2={215} stroke="#3f3f46" strokeWidth="1.5" />

        {/* Hour ticks + labels every 3h */}
        {[0, 3, 6, 9, 12, 15, 18, 21, 24].map(h => (
          <g key={h}>
            <line x1={hx(h)} y1={215} x2={hx(h)} y2={221} stroke="#52525b" strokeWidth="1" />
            <text x={hx(h)} y={232} fontSize="9" fill="#52525b" textAnchor="middle">{h}h</text>
          </g>
        ))}

        {/* Volatility curve */}
        <path d={volPath} stroke="#52525b" strokeWidth="1.5" strokeLinejoin="round" />

        {/* Zone badge — Asian Range */}
        <rect x={118} y={18} width={90} height={14} rx="2" fill="#09090b" fillOpacity="0.85" />
        <text x={163} y={28} fontSize="9" fill="#71717a" textAnchor="middle" fontWeight="600">Asian Range</text>

        {/* Zone badge — London Open */}
        <rect x={298} y={18} width={80} height={14} rx="2" fill="#09090b" fillOpacity="0.85" />
        <text x={338} y={28} fontSize="9" fill="#10b981" textAnchor="middle" fontWeight="600">London Open</text>

        {/* Zone badge — NY Open */}
        <rect x={484} y={18} width={56} height={14} rx="2" fill="#09090b" fillOpacity="0.85" />
        <text x={512} y={28} fontSize="9" fill="#10b981" textAnchor="middle" fontWeight="600">NY Open</text>

        {/* Zone badge — NY Close */}
        <rect x={678} y={18} width={54} height={14} rx="2" fill="#09090b" fillOpacity="0.85" />
        <text x={705} y={28} fontSize="9" fill="#60a5fa" textAnchor="middle" fontWeight="600">NY Close</text>

        {/* Annotation — London Open 08h */}
        <line x1={hx(8)} y1={42} x2={hx(8)} y2={215}
          stroke="#10b981" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.35" />
        <rect x={hx(8) - 48} y={242} width={96} height={12} rx="2"
          fill="#09090b" fillOpacity="0.85" />
        <text x={hx(8)} y={251} fontSize="8.5" fill="#10b981" textAnchor="middle" fontWeight="600">London Open — 08h</text>

        {/* Annotation — NY Open 13h30 */}
        <line x1={hx(13.5)} y1={42} x2={hx(13.5)} y2={215}
          stroke="#10b981" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.35" />
        <rect x={hx(13.5) - 48} y={242} width={96} height={12} rx="2"
          fill="#09090b" fillOpacity="0.85" />
        <text x={hx(13.5)} y={251} fontSize="8.5" fill="#10b981" textAnchor="middle" fontWeight="600">NY Open — 13h30</text>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 px-4 py-2.5 border-t border-zinc-800/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-emerald-500/50" />
          <span className="text-[10px] text-zinc-500">Killzone London / NY — haute volatilité institutionnelle</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-blue-400/50" />
          <span className="text-[10px] text-zinc-500">NY Close (PM session)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-zinc-600" />
          <span className="text-[10px] text-zinc-500">Asian Range — accumulation nocturne</span>
        </div>
      </div>
    </div>
  );
}

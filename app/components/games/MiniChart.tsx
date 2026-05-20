// Mini-chart SVG mobile-first pour le jeu BUY/SELL/NO TRADE.
// Rendu : bougies simplifiées + zones (support / résistance / FVG / liquidité).
// Aucun texte minuscule dans le SVG — les labels sont rendus en HTML sous le chart.

import type { ChartData, ChartZone, ZoneKind } from "@/lib/games/buy-sell-no-trade";

interface MiniChartProps {
  data: ChartData;
}

const ZONE_STYLES: Record<ZoneKind, { fill: string; stroke: string; dotClass: string; dashed: boolean }> = {
  support:        { fill: "rgba(16,185,129,0.10)", stroke: "#10b981", dotClass: "bg-emerald-500", dashed: true  },
  resistance:     { fill: "rgba(239,68,68,0.10)",  stroke: "#ef4444", dotClass: "bg-red-500",     dashed: true  },
  fvg:            { fill: "rgba(245,158,11,0.14)", stroke: "#f59e0b", dotClass: "bg-amber-400",   dashed: false },
  liquidity_low:  { fill: "rgba(245,158,11,0.07)", stroke: "#f59e0b", dotClass: "bg-amber-400",   dashed: true  },
  liquidity_high: { fill: "rgba(245,158,11,0.07)", stroke: "#f59e0b", dotClass: "bg-amber-400",   dashed: true  },
};

export function MiniChart({ data }: MiniChartProps) {
  const W = 320;
  const H = 170;
  const padX = 8;
  const padY = 10;
  const innerW = W - padX * 2;
  const innerH = H - padY * 2;
  const n = data.candles.length;
  const slotW = innerW / n;
  const bodyW = Math.max(2.2, slotW * 0.6);

  const { min, max } = data.domain;
  const range = max - min || 1;
  const y = (v: number) => padY + (1 - (v - min) / range) * innerH;

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
      <svg
        width="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        className="block"
      >
        {/* Gridline médiane */}
        <line
          x1={padX}
          y1={padY + innerH * 0.5}
          x2={padX + innerW}
          y2={padY + innerH * 0.5}
          stroke="#27272a"
          strokeWidth="0.5"
          strokeDasharray="2 3"
        />

        {/* Zones */}
        {data.zones.map((z, i) => {
          const style = ZONE_STYLES[z.kind];
          const yA = y(z.y1);
          const yB = y(z.y2);
          const top = Math.min(yA, yB);
          const bottom = Math.max(yA, yB);
          const h = Math.max(1.2, bottom - top);
          return (
            <g key={i}>
              <rect x={padX} y={top} width={innerW} height={h} fill={style.fill} />
              <line
                x1={padX}
                y1={top}
                x2={padX + innerW}
                y2={top}
                stroke={style.stroke}
                strokeWidth="1"
                strokeDasharray={style.dashed ? "3 2.5" : undefined}
              />
              {h > 2 && (
                <line
                  x1={padX}
                  y1={bottom}
                  x2={padX + innerW}
                  y2={bottom}
                  stroke={style.stroke}
                  strokeWidth="1"
                  strokeDasharray={style.dashed ? "3 2.5" : undefined}
                />
              )}
            </g>
          );
        })}

        {/* Bougies */}
        {data.candles.map((k, i) => {
          const cx = padX + slotW * (i + 0.5);
          const isGreen = k.c >= k.o;
          const color = isGreen ? "#10b981" : "#ef4444";
          const bodyTop = y(Math.max(k.o, k.c));
          const bodyBottom = y(Math.min(k.o, k.c));
          const bodyH = Math.max(1.2, bodyBottom - bodyTop);
          return (
            <g key={i}>
              <line x1={cx} y1={y(k.h)} x2={cx} y2={y(k.l)} stroke={color} strokeWidth="1" strokeLinecap="round" />
              <rect x={cx - bodyW / 2} y={bodyTop} width={bodyW} height={bodyH} fill={color} rx="0.5" />
            </g>
          );
        })}
      </svg>

      {/* Légende HTML */}
      {data.zones.length > 0 && (
        <div className="px-3 py-2 border-t border-zinc-800/60 flex flex-wrap gap-x-3 gap-y-1.5">
          {data.zones.map((z, i) => (
            <ZoneLegendItem key={i} zone={z} />
          ))}
        </div>
      )}
    </div>
  );
}

function ZoneLegendItem({ zone }: { zone: ChartZone }) {
  const style = ZONE_STYLES[zone.kind];
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-sm ${style.dotClass}`} />
      <span className="text-[10px] text-zinc-400 font-medium">{zone.label}</span>
    </div>
  );
}

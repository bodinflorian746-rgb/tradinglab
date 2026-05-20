// Mini-chart SVG mobile-first.
// Rendu : bougies simplifiées, zones (support / résistance / FVG / liquidité),
// et overlays optionnels pour les jeux interactifs : entrée, TP, stop,
// séparateur passé/futur, animation progressive du reveal.
//
// Règle : pas de texte minuscule dans le SVG. Les labels sont rendus en HTML
// sous le graphique (ou dans le UI du jeu autour).

import type { ChartData, ChartZone, ZoneKind } from "@/lib/games/shared";

export interface MiniChartOverlay {
  entry?:             { price: number; direction: "BUY" | "SELL" };
  tp?:                { price: number };
  stop?:              { price: number; hit?: boolean };
  separatorIndex?:    number;   // indice de la 1re bougie "future"
  visibleFutureCount?: number;  // combien de bougies "futures" sont révélées
}

interface MiniChartProps {
  data:     ChartData;
  overlay?: MiniChartOverlay;
  height?:  number;  // viewBox height, défaut 170
}

const ZONE_STYLES: Record<ZoneKind, { fill: string; stroke: string; dotClass: string; dashed: boolean }> = {
  support:        { fill: "rgba(16,185,129,0.10)", stroke: "#10b981", dotClass: "bg-emerald-500", dashed: true  },
  resistance:     { fill: "rgba(239,68,68,0.10)",  stroke: "#ef4444", dotClass: "bg-red-500",     dashed: true  },
  fvg:            { fill: "rgba(245,158,11,0.14)", stroke: "#f59e0b", dotClass: "bg-amber-400",   dashed: false },
  liquidity_low:  { fill: "rgba(245,158,11,0.07)", stroke: "#f59e0b", dotClass: "bg-amber-400",   dashed: true  },
  liquidity_high: { fill: "rgba(245,158,11,0.07)", stroke: "#f59e0b", dotClass: "bg-amber-400",   dashed: true  },
};

export function MiniChart({ data, overlay, height = 170 }: MiniChartProps) {
  const W = 320;
  const H = height;
  const padX = 8;
  const padY = 10;
  const innerW = W - padX * 2;
  const innerH = H - padY * 2;
  const totalSlots = data.candles.length;
  const slotW = innerW / totalSlots;
  const bodyW = Math.max(2.2, slotW * 0.6);

  // Combien de bougies on dessine ? Si separatorIndex défini, on cache
  // les futures non révélées.
  const renderedCount =
    overlay?.separatorIndex !== undefined
      ? Math.min(totalSlots, overlay.separatorIndex + (overlay.visibleFutureCount ?? 0))
      : totalSlots;

  const { min, max } = data.domain;
  const range = max - min || 1;
  const y = (v: number) => padY + (1 - (v - min) / range) * innerH;

  const entryColor = "#3b82f6"; // blue-500
  const tpColor    = "#10b981"; // emerald-500
  const stopColor  = overlay?.stop?.hit ? "#fb923c" : "#ef4444"; // red-500, orange si touché

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

        {/* Zones (support / résistance / FVG / liquidité) */}
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

        {/* Bougies (rendues jusqu'à renderedCount) */}
        {data.candles.slice(0, renderedCount).map((k, i) => {
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

        {/* Séparateur passé / futur (vertical pointillé) */}
        {overlay?.separatorIndex !== undefined && (
          <line
            x1={padX + slotW * overlay.separatorIndex}
            y1={padY}
            x2={padX + slotW * overlay.separatorIndex}
            y2={padY + innerH}
            stroke="#52525b"
            strokeWidth="0.8"
            strokeDasharray="1.5 2"
          />
        )}

        {/* Overlay : ligne d'entrée (bleue continue) */}
        {overlay?.entry !== undefined && (
          <g>
            <line
              x1={padX}
              y1={y(overlay.entry.price)}
              x2={padX + innerW}
              y2={y(overlay.entry.price)}
              stroke={entryColor}
              strokeWidth="1.2"
            />
            <circle cx={padX + innerW - 3} cy={y(overlay.entry.price)} r="2.5" fill={entryColor} />
          </g>
        )}

        {/* Overlay : ligne de TP (emerald continue) */}
        {overlay?.tp !== undefined && (
          <g>
            <line
              x1={padX}
              y1={y(overlay.tp.price)}
              x2={padX + innerW}
              y2={y(overlay.tp.price)}
              stroke={tpColor}
              strokeWidth="1.1"
              strokeDasharray="4 2"
            />
            <circle cx={padX + innerW - 3} cy={y(overlay.tp.price)} r="2.5" fill={tpColor} />
          </g>
        )}

        {/* Overlay : ligne de stop (rouge pointillée, orange si hit) */}
        {overlay?.stop !== undefined && (
          <g>
            <line
              x1={padX}
              y1={y(overlay.stop.price)}
              x2={padX + innerW}
              y2={y(overlay.stop.price)}
              stroke={stopColor}
              strokeWidth="1.4"
              strokeDasharray="3 2"
            />
            <circle cx={padX + innerW - 3} cy={y(overlay.stop.price)} r="3" fill={stopColor} />
          </g>
        )}
      </svg>

      {/* Légende HTML pour les zones, si pas d'overlay actif (sinon le jeu gère son propre cadre) */}
      {data.zones.length > 0 && !overlay && (
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

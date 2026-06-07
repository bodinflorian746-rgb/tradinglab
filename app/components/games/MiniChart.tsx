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
  // V2 multi-stops (utilisé par place-stop).
  // - label optionnel : si défini, rendu comme tag coloré (A/B/C) en bout de ligne
  // - dim : si true, ligne entry/tp/stops legacy rendus plus discrètement
  stops?:             Array<{ price: number; color: string; dashed?: boolean; hit?: boolean; selected?: boolean; label?: string }>;
  separatorIndex?:    number;
  visibleFutureCount?: number;
  // V3 minimaliste : si true, rend entry/tp avec une opacité réduite (focus sur stops)
  dimEntryTp?:        boolean;
  // V4 build-the-trade : lignes de candidats (3 options de l'étape active) avec
  // mini-label prix au bord. Très discrètes pour ne pas surcharger.
  candidateLines?:    Array<{ price: number; color: string; label: string }>;
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
  const bodyW = Math.max(3, slotW * 0.72);

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
          const bodyH = Math.max(3, bodyBottom - bodyTop);
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

        {/* Overlay : ligne d'entrée (bleue, plus discrète si dimEntryTp) */}
        {overlay?.entry !== undefined && (
          <g opacity={overlay.dimEntryTp ? 0.55 : 1}>
            <line
              x1={padX}
              y1={y(overlay.entry.price)}
              x2={padX + innerW}
              y2={y(overlay.entry.price)}
              stroke={entryColor}
              strokeWidth={overlay.dimEntryTp ? 0.8 : 1.2}
              strokeDasharray={overlay.dimEntryTp ? "1 2" : undefined}
            />
            {!overlay.dimEntryTp && (
              <circle cx={padX + innerW - 3} cy={y(overlay.entry.price)} r="2.5" fill={entryColor} />
            )}
          </g>
        )}

        {/* Overlay : ligne de TP (emerald, plus discrète si dimEntryTp) */}
        {overlay?.tp !== undefined && (
          <g opacity={overlay.dimEntryTp ? 0.55 : 1}>
            <line
              x1={padX}
              y1={y(overlay.tp.price)}
              x2={padX + innerW}
              y2={y(overlay.tp.price)}
              stroke={tpColor}
              strokeWidth={overlay.dimEntryTp ? 0.8 : 1.1}
              strokeDasharray={overlay.dimEntryTp ? "2 3" : "4 2"}
            />
            {!overlay.dimEntryTp && (
              <circle cx={padX + innerW - 3} cy={y(overlay.tp.price)} r="2.5" fill={tpColor} />
            )}
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

        {/* V4 build-the-trade : lignes de candidats. Très fines + petit label
            prix au bord DROIT (zone future, vide pendant le build). Le joueur
            voit où se situent les 3 options avant de cliquer son bouton.
            Mini collision-avoidance : si 2 labels sont à <14px en Y, le 2e
            est shifté pour éviter le chevauchement. */}
        {(() => {
          if (!overlay?.candidateLines) return null;
          // Pré-calcule la Y de chaque candidat et résout les collisions.
          // On garde la Y de la LIGNE intacte mais on shift la Y du LABEL si besoin.
          const sorted = overlay.candidateLines
            .map((c, idx) => ({ ...c, idx, lineY: y(c.price) }))
            .sort((a, b) => a.lineY - b.lineY);
          let prevLabelY = -Infinity;
          for (const c of sorted) {
            let labelY = c.lineY;
            if (labelY - prevLabelY < 14) labelY = prevLabelY + 14;
            (c as typeof c & { labelY: number }).labelY = labelY;
            prevLabelY = labelY;
          }
          return sorted.map((c) => {
            const cc = c as typeof c & { labelY: number };
            return (
              <g key={`cand-${c.idx}`} opacity={0.85}>
                <line
                  x1={padX}
                  y1={c.lineY}
                  x2={padX + innerW - 30}
                  y2={c.lineY}
                  stroke={c.color}
                  strokeWidth={0.7}
                  strokeDasharray="2 3"
                />
                {/* Connecteur entre la ligne et le label décalé, si décalé */}
                {Math.abs(cc.labelY - c.lineY) > 0.5 && (
                  <line
                    x1={padX + innerW - 14}
                    y1={c.lineY}
                    x2={padX + innerW - 14}
                    y2={cc.labelY}
                    stroke={c.color}
                    strokeWidth={0.5}
                    strokeDasharray="1 2"
                    opacity={0.6}
                  />
                )}
                <rect
                  x={padX + innerW - 28}
                  y={cc.labelY - 6.5}
                  width={28}
                  height={13}
                  rx={2.5}
                  fill="#09090b"
                  stroke={c.color}
                  strokeWidth={0.9}
                />
                <text
                  x={padX + innerW - 14}
                  y={cc.labelY + 3.5}
                  fill={c.color}
                  fontSize="10"
                  fontWeight={700}
                  textAnchor="middle"
                  style={{ letterSpacing: 0 }}
                >
                  {c.label}
                </text>
              </g>
            );
          });
        })()}

        {/* V2 multi-stops : chaque stop avec sa couleur. "hit" = orange,
            "selected" = épaisseur doublée. Si label fourni, on remplace le
            dot par un tag coloré (A/B/C) en bout de ligne. */}
        {overlay?.stops?.map((s, i) => {
          const color = s.hit ? "#fb923c" : s.color;
          const sw = s.selected ? 2.0 : 1.4;
          const dash = s.dashed === false ? undefined : "3 2";
          const tagW = 16;
          const tagH = 14;
          const lineEnd = s.label ? padX + innerW - tagW - 2 : padX + innerW;
          return (
            <g key={i}>
              <line
                x1={padX}
                y1={y(s.price)}
                x2={lineEnd}
                y2={y(s.price)}
                stroke={color}
                strokeWidth={sw}
                strokeDasharray={dash}
              />
              {s.label ? (
                <g>
                  <rect
                    x={padX + innerW - tagW}
                    y={y(s.price) - tagH / 2}
                    width={tagW}
                    height={tagH}
                    rx={2.5}
                    fill={color}
                  />
                  <text
                    x={padX + innerW - tagW / 2}
                    y={y(s.price) + 4}
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight={900}
                    textAnchor="middle"
                    style={{ letterSpacing: 0 }}
                  >
                    {s.label}
                  </text>
                </g>
              ) : (
                <circle cx={padX + innerW - 3} cy={y(s.price)} r={s.selected ? 3.6 : 3} fill={color} />
              )}
            </g>
          );
        })}
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

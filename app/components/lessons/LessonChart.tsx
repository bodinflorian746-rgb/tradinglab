"use client";

// Graphique des leçons — même rendu que les jeux (GameChartV2) : bougies V2Candle,
// géométrie en pixels réels (ResizeObserver), charte v2, sans quadrillage.
// - Données : bougies construites à partir de prix (lib/lessons/chart-build.ts)
//   ou série de prix en ligne (schémas) ; zones, niveaux, pivots, R/R calculés
//   par lib/lessons/chart-analysis.ts.
// - Échelle linéaire, espacement régulier, couleur = mouvement.
// - Étiquettes : colonne à droite (niveaux, zones, moyennes), écartées pour ne
//   jamais se chevaucher, reliées à leur ligne ; repères (pivots, signaux) au-
//   dessus / en dessous de leur bougie. Texte ≥ 12 px, même dessin sur mobile
//   (libellé court sous 480 px de large).
// - Plusieurs panneaux dans un cadre (rows), échelle commune possible.
// - Attributs d'audit (scripts/audit-lecons) : data-lesson-chart, data-panel,
//   data-scale, data-candles / data-series, data-candle, data-level, data-zone,
//   data-marker, data-label-for, data-chip.

import "@/app/styles/lesson-chart.css";
import { useId, type CSSProperties, type ReactNode } from "react";
import { V2Candle, clamp, textWidth, useBoxSize } from "@/app/components/games/v2/GameChartV2";
import type { Candle, PivotName } from "@/lib/lessons/chart-analysis";

export type LCTone = "bull" | "bear" | "entry" | "zone" | "fib" | "neutral" | "sky";

const TONE: Record<LCTone, string> = {
  bull: "#10b981",
  bear: "#ef4444",
  entry: "#3b82f6",
  zone: "#f59e0b",
  fib: "#a78bfa",
  neutral: "#9ca0ab",
  sky: "#38bdf8",
};

/** Niveau horizontal (entrée, stop, objectif, support…). */
export interface LCLevel {
  key: string;
  price: number;
  /** Étiquette dans la colonne de droite ; sans étiquette : trait discret */
  label?: string;
  /** Étiquette sous 480 px de large */
  short?: string;
  tone: LCTone;
  dashed?: boolean;
  /** Indices de début / fin (défaut : tout le graphique) */
  from?: number;
  to?: number;
  faint?: boolean;
}

/** Zone de prix (Order Block, FVG, zone de confluence…). */
export interface LCZone {
  key: string;
  y1: number;
  y2: number;
  label?: string;
  short?: string;
  tone: LCTone;
  from?: number;
  to?: number;
  /** Nature (audit) : ob, fvg, confluence… */
  kind?: string;
  /** Provenance (audit) : ex. « ob:9 » = corps de la bougie 9 */
  src?: string;
}

/** Repère accroché à un point (pivot, signal, publication…). */
export interface LCMarker {
  key: string;
  /** Indice (fractionnaire possible sur une ligne) */
  i: number;
  price: number;
  label: string;
  short?: string;
  tone: LCTone;
  side: "above" | "below";
  /** Nom de pivot vérifié par l'audit sur les données */
  pivot?: PivotName;
  dot?: boolean;
}

/** Segment libre (ligne de cou, mesure, flèche). */
export interface LCSegment {
  key: string;
  i1: number;
  p1: number;
  i2: number;
  p2: number;
  tone: LCTone;
  dashed?: boolean;
  arrow?: boolean;
  /** Étiquette dans la colonne, au niveau de la fin du segment */
  label?: string;
  short?: string;
}

/** Série superposée (moyenne mobile). */
export interface LCSeries {
  key: string;
  values: (number | null)[];
  tone: LCTone;
  label?: string;
  short?: string;
}

export interface LCChip {
  label: string;
  tone?: LCTone;
  /** Attributs data-* (audit : entrée, stop, objectif, R/R affiché…) */
  data?: Record<string, string | number>;
}

export interface LCPanel {
  key: string;
  title?: string;
  subtitle?: string;
  candles?: Candle[];
  /** Série de prix en ligne (schéma) */
  line?: number[];
  /** Emplacements horizontaux (défaut : nombre de points) */
  slots?: number;
  levels?: LCLevel[];
  zones?: LCZone[];
  markers?: LCMarker[];
  segments?: LCSegment[];
  series?: LCSeries[];
  rsi?: { values: (number | null)[]; label: string };
  /** Prix hors cadre (objectif lointain) : étiquette « … ↑ » au bord */
  offscale?: { key: string; price: number; label: string; short?: string; tone: LCTone }[];
  chips?: LCChip[];
  /** Hauteur max du cadre en px (desktop) */
  height?: number;
  /** Décimales des prix (audit) */
  decimals: number;
}

export interface LessonChartProps {
  /** Nom du schéma (audit) */
  id: string;
  title?: string;
  caption?: ReactNode;
  panels: LCPanel[];
  /** Panneaux par rangée sur desktop (ex. [1, 2]) ; une colonne sur mobile */
  rows?: number[];
  /** Même échelle de prix pour tous les panneaux */
  sharedScale?: boolean;
  /** Contenu ajouté sous les panneaux (ex. cartes de chiffres) */
  children?: ReactNode;
}

const FS = 12;          // corps de texte (minimum de la charte)
const TAG_H = 20;
const TAG_GAP = 4;
const MARK_H = 20;
const RSI_H = 86;
const NARROW = 480;
const tagW = (s: string) => textWidth(s, FS) + 16;

function panelExtent(p: LCPanel): [number, number] {
  const v: number[] = [];
  p.candles?.forEach((k) => v.push(k.h, k.l));
  p.line?.forEach((x) => v.push(x));
  p.levels?.forEach((l) => v.push(l.price));
  p.zones?.forEach((z) => v.push(z.y1, z.y2));
  p.markers?.forEach((m) => v.push(m.price));
  p.segments?.forEach((s) => v.push(s.p1, s.p2));
  p.series?.forEach((s) => s.values.forEach((x) => x !== null && v.push(x)));
  return [Math.min(...v), Math.max(...v)];
}

export function LessonChart({ id, title, caption, panels, rows, sharedScale, children }: LessonChartProps) {
  const layout = rows ?? panels.map(() => 1);
  const domain = sharedScale
    ? panels.map(panelExtent).reduce<[number, number]>((a, b) => [Math.min(a[0], b[0]), Math.max(a[1], b[1])], [Infinity, -Infinity])
    : undefined;
  let k = 0;
  return (
    <figure className="tsx-v2 lc" data-lesson-chart={id}>
      <div className="lc-card">
        {title && <figcaption className="lc-title">{title}</figcaption>}
        <div className="lc-rows">
          {layout.map((n, r) => {
            const slice = panels.slice(k, k + n);
            k += n;
            return (
              <div key={r} className={`lc-row lc-row--${n}`}>
                {slice.map((p) => <Panel key={p.key} chart={id} panel={p} domain={domain} />)}
              </div>
            );
          })}
        </div>
        {children}
        {caption && <p className="lc-caption">{caption}</p>}
      </div>
    </figure>
  );
}

type Tag = { key: string; label: string; color: string; lineY: number; y: number; w: number; lineEnd: number };
type Box = { x: number; y: number; w: number; h: number };
const overlaps = (a: Box, b: Box) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

function Panel({ chart, panel, domain }: { chart: string; panel: LCPanel; domain?: [number, number] }) {
  const { ref, w: W, h: H } = useBoxSize<HTMLDivElement>();
  const uid = useId().replace(/:/g, "");
  const p = panel;
  const narrow = W > 0 && W < NARROW;
  const txt = (o: { label?: string; short?: string }) => (narrow && o.short ? o.short : o.label ?? "");

  let svg: ReactNode = null;
  if (W > 0 && H > 0) {
    const nPts = p.candles?.length ?? p.line?.length ?? 0;
    const n = p.slots ?? nPts;
    const rsiH = p.rsi ? RSI_H : 0;
    const plotH = H - rsiH;

    // Étiquettes de la colonne de droite
    const colItems = [
      ...(p.levels ?? []).filter((l) => l.label).map((l) => ({ key: l.key, label: txt(l), color: TONE[l.tone], price: l.price })),
      ...(p.zones ?? []).filter((z) => z.label).map((z) => ({ key: z.key, label: txt(z), color: TONE[z.tone], price: (z.y1 + z.y2) / 2 })),
      ...(p.segments ?? []).filter((s) => s.label).map((s) => ({ key: s.key, label: txt(s), color: TONE[s.tone], price: s.p2 })),
      ...(p.series ?? []).filter((s) => s.label).map((s) => ({ key: s.key, label: txt(s), color: TONE[s.tone], price: [...s.values].reverse().find((x) => x !== null) ?? 0 })),
    ];
    const offTags = (p.offscale ?? []).map((o) => ({ key: o.key, label: txt(o), color: TONE[o.tone], price: o.price }));
    const colW = colItems.length + offTags.length ? Math.max(...[...colItems, ...offTags].map((t) => tagW(t.label))) + 12 : 0;
    const padX = clamp(W * 0.02, 8, 14);
    const plotL = padX;
    const plotR = W - padX - colW;
    const slot = (plotR - plotL) / Math.max(n, 1);
    const xOf = (i: number) => plotL + slot * (i + 0.5);
    const bodyW = Math.min(clamp(slot * 0.6, 3, 22), slot * 0.78);

    // Échelle linéaire (commune aux panneaux si demandé)
    const [dMin, dMax] = domain ?? panelExtent(p);
    const span = dMax - dMin || 1;
    const min = dMin - span * 0.04;
    const max = dMax + span * 0.04;
    const hasAbove = (p.markers ?? []).some((m) => m.side === "above") || offTags.some((o) => o.price > dMax);
    const hasBelow = (p.markers ?? []).some((m) => m.side === "below") || offTags.some((o) => o.price < dMin);
    const top = 12 + (hasAbove ? MARK_H + 14 : 0);
    const bottom = plotH - 12 - (hasBelow ? MARK_H + 14 : 0);
    const toY = (v: number) => top + ((max - v) / (max - min)) * (bottom - top);

    // Colonne : tri par hauteur, écartement sans chevauchement, puis remontée si le bas déborde
    const tags: Tag[] = [
      ...colItems.map((t) => ({ ...t, lineY: toY(t.price) })),
      ...offTags.map((t) => ({ ...t, lineY: t.price > dMax ? top - MARK_H : bottom + MARK_H })),
    ].map((t) => ({ key: t.key, label: t.label, color: t.color, lineY: t.lineY, y: t.lineY, w: tagW(t.label), lineEnd: plotR }));
    tags.sort((a, b) => a.lineY - b.lineY);
    for (let i = 0; i < tags.length; i++) tags[i].y = Math.max(tags[i].y, TAG_H / 2 + 2, i ? tags[i - 1].y + TAG_H + TAG_GAP : -Infinity);
    for (let i = tags.length - 1; i >= 0; i--) tags[i].y = Math.min(tags[i].y, i === tags.length - 1 ? H - TAG_H / 2 - 2 : tags[i + 1].y - TAG_H - TAG_GAP);
    const tagX = W - padX - (colW - 12);
    const boxes: Box[] = tags.map((t) => ({ x: tagX, y: t.y - TAG_H / 2, w: colW - 12, h: TAG_H }));

    // Obstacles des repères : bougies (mèches comprises) et ligne de prix (points tous les 3 px)
    const drawn: Box[] = [];
    p.candles?.forEach((c, i) => drawn.push({ x: xOf(i) - bodyW / 2 - 2, y: toY(c.h) - 2, w: bodyW + 4, h: toY(c.l) - toY(c.h) + 4 }));
    p.line?.forEach((v, i) => {
      if (!i) return;
      const x0 = xOf(i - 1), y0 = toY(p.line![i - 1]), x1 = xOf(i), y1 = toY(v);
      const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 3));
      for (let s = 0; s <= steps; s++) drawn.push({ x: x0 + ((x1 - x0) * s) / steps - 2, y: y0 + ((y1 - y0) * s) / steps - 2, w: 4, h: 4 });
    });

    // Repères : au-dessus / en dessous du point, décalés tant qu'ils recouvrent
    // une étiquette, une bougie ou la ligne de prix (relié au point par un trait)
    const marks = (p.markers ?? []).map((m) => {
      const label = txt(m);
      const w = tagW(label);
      const py = toY(m.price);
      const x = clamp(xOf(m.i) - w / 2, 2, plotR - w);
      const dir = m.side === "above" ? -1 : 1;
      const yMin = MARK_H / 2 + 1, yMax = plotH - MARK_H / 2 - 1;
      const free = (yy: number) => {
        const b = { x, y: yy - MARK_H / 2, w, h: MARK_H };
        return !boxes.some((o) => overlaps(o, b)) && !drawn.some((o) => overlaps(o, b));
      };
      const y0 = py + dir * (8 + MARK_H / 2);
      let y = clamp(y0, yMin, yMax);
      for (let k = 0; k <= 24; k++) {
        const yy = y0 + dir * k * 6;
        if (yy < yMin || yy > yMax) break;
        if (free(yy)) { y = yy; break; }
      }
      boxes.push({ x, y: y - MARK_H / 2, w, h: MARK_H });
      return { ...m, label, w, x, y, py };
    });

    const levelX1 = (l: { from?: number }) => (l.from !== undefined ? xOf(l.from) - slot / 2 : plotL);
    const levelX2 = (l: { to?: number }) => (l.to !== undefined ? xOf(l.to) + slot / 2 : plotR);
    const scale = { min, max, top, bottom, x0: plotL, slot, n };

    svg = (
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={[p.title, p.subtitle].filter(Boolean).join(" — ") || chart}
        data-panel={p.key}
        data-scale={JSON.stringify(scale)}
        data-decimals={p.decimals}
        data-candles={p.candles ? JSON.stringify(p.candles) : undefined}
        data-series={p.line ? JSON.stringify(p.line) : undefined}
      >
        <defs>
          {(Object.keys(TONE) as LCTone[]).map((t) => (
            <marker key={t} id={`${uid}-arrow-${t}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill={TONE[t]} />
            </marker>
          ))}
        </defs>

        {/* Zones */}
        {(p.zones ?? []).map((z) => {
          const y = toY(Math.max(z.y1, z.y2));
          const h = Math.max(toY(Math.min(z.y1, z.y2)) - y, 3);
          const x = levelX1(z);
          return (
            <rect key={z.key} data-zone={z.key} data-y1={Math.min(z.y1, z.y2)} data-y2={Math.max(z.y1, z.y2)} data-kind={z.kind} data-src={z.src}
              x={x} y={y} width={levelX2(z) - x} height={h} rx={4}
              fill={TONE[z.tone]} fillOpacity={0.16} stroke={TONE[z.tone]} strokeOpacity={0.75} strokeWidth={1.5} strokeDasharray="5 4" />
          );
        })}

        {/* Niveaux */}
        {(p.levels ?? []).map((l) => (
          <line key={l.key} data-level={l.key} data-price={l.price}
            x1={levelX1(l)} x2={levelX2(l)} y1={toY(l.price)} y2={toY(l.price)}
            stroke={TONE[l.tone]} strokeWidth={l.faint ? 1.5 : 2} strokeOpacity={l.faint ? 0.5 : 1}
            strokeDasharray={l.dashed ? "6 5" : undefined} strokeLinecap="round" />
        ))}

        {/* Objectifs hors cadre : trait au bord */}
        {offTags.map((o) => {
          const y = o.price > dMax ? top - MARK_H : bottom + MARK_H;
          return <line key={o.key} data-level={o.key} data-price={o.price} data-offscale="" x1={plotL} x2={plotR} y1={y} y2={y} stroke={o.color} strokeWidth={2} strokeDasharray="2 6" strokeLinecap="round" />;
        })}

        {/* Moyennes mobiles */}
        {(p.series ?? []).map((s) => {
          const pts = s.values.map((v, i) => (v === null ? null : `${xOf(i)},${toY(v)}`)).filter(Boolean).join(" ");
          return <polyline key={s.key} data-ma={s.key} points={pts} fill="none" stroke={TONE[s.tone]} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />;
        })}

        {/* Prix en ligne (schéma) */}
        {p.line && (
          <polyline data-price-line="" points={p.line.map((v, i) => `${xOf(i)},${toY(v)}`).join(" ")}
            fill="none" stroke="#c7c9d1" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        )}

        {/* Bougies */}
        {p.candles?.map((c, i) => (
          <g key={i} data-candle={i}>
            <V2Candle {...c} prevClose={p.candles![i - 1]?.c} x={xOf(i)} width={bodyW} toY={toY} index={i} dim="full" still />
          </g>
        ))}

        {/* Segments (ligne de cou, mesures) */}
        {(p.segments ?? []).map((s) => (
          <line key={s.key} data-segment={s.key} x1={xOf(s.i1)} y1={toY(s.p1)} x2={xOf(s.i2)} y2={toY(s.p2)}
            stroke={TONE[s.tone]} strokeWidth={2} strokeDasharray={s.dashed ? "6 5" : undefined} strokeLinecap="round"
            markerEnd={s.arrow ? `url(#${uid}-arrow-${s.tone})` : undefined} />
        ))}

        {/* Repères */}
        {marks.map((m) => (
          <g key={m.key} data-marker={m.key} data-i={m.i} data-price={m.price} data-pivot={m.pivot}>
            {m.dot && <circle cx={xOf(m.i)} cy={m.py} r={4.5} fill={TONE[m.tone]} stroke="#06090d" strokeWidth={1.5} />}
            {Math.abs(m.y - m.py) > MARK_H / 2 + 10 && (
              <line x1={xOf(m.i)} x2={xOf(m.i)} y1={m.py + (m.y < m.py ? -6 : 6)} y2={m.y + (m.y < m.py ? MARK_H / 2 : -MARK_H / 2)} stroke={TONE[m.tone]} strokeWidth={1.5} strokeOpacity={0.8} />
            )}
            <g data-label-for={m.key}>
              <rect x={m.x} y={m.y - MARK_H / 2} width={m.w} height={MARK_H} rx={MARK_H / 2} fill="#06090d" stroke={TONE[m.tone]} strokeWidth={1.5} />
              <text x={m.x + m.w / 2} y={m.y + FS * 0.36} textAnchor="middle" fontSize={FS} fontWeight={700} fill={TONE[m.tone]}>{m.label}</text>
            </g>
          </g>
        ))}

        {/* RSI */}
        {p.rsi && (() => {
          const r0 = plotH + 10, r1 = H - 8;
          const ry = (v: number) => r0 + ((100 - v) / 100) * (r1 - r0);
          const pts = p.rsi.values.map((v, i) => (v === null ? null : `${xOf(i)},${ry(v)}`)).filter(Boolean).join(" ");
          return (
            <g data-rsi="">
              <line x1={plotL} x2={plotR} y1={plotH + 2} y2={plotH + 2} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
              {[70, 30].map((v) => (
                <line key={v} data-level={`rsi${v}`} data-price={v} x1={plotL} x2={plotR} y1={ry(v)} y2={ry(v)} stroke="#9ca0ab" strokeOpacity={0.6} strokeWidth={1.5} strokeDasharray="4 5" />
              ))}
              <polyline points={pts} fill="none" stroke={TONE.fib} strokeWidth={2} strokeLinejoin="round" />
              <text x={plotL + 4} y={r0 + FS} fontSize={FS} fontWeight={600} fill="#c7c9d1">{p.rsi.label}</text>
            </g>
          );
        })()}

        {/* Colonne des étiquettes (au-dessus de tout) */}
        {tags.map((t) => (
          <g key={t.key} data-label-for={t.key}>
            {Math.abs(t.y - t.lineY) > 0.5 && (
              <line x1={t.lineEnd} y1={t.lineY} x2={tagX} y2={t.y} stroke={t.color} strokeWidth={1.5} strokeOpacity={0.9} />
            )}
            <rect x={tagX} y={t.y - TAG_H / 2} width={colW - 12} height={TAG_H} rx={TAG_H / 2} fill={t.color} />
            <text x={tagX + (colW - 12) / 2} y={t.y + FS * 0.36} textAnchor="middle" fontSize={FS} fontWeight={700} fill="#04060a">{t.label}</text>
          </g>
        ))}
      </svg>
    );
  }

  return (
    <div className="lc-panel" data-panel-box={p.key}>
      {(p.title || p.subtitle) && (
        <div className="lc-panel-head">
          {p.title && <div className="lc-panel-title">{p.title}</div>}
          {p.subtitle && <div className="lc-panel-sub">{p.subtitle}</div>}
        </div>
      )}
      <div ref={ref} className="lc-frame" style={{ "--lc-h": `${p.height ?? 280}px` } as CSSProperties}>{svg}</div>
      {p.chips && p.chips.length > 0 && (
        <ul className="lc-chips">
          {p.chips.map((c, i) => (
            <li key={i} data-chip="" className={`lc-chip${c.tone ? ` lc-chip--${c.tone}` : ""}`}
              {...Object.fromEntries(Object.entries(c.data ?? {}).map(([k2, v]) => [`data-${k2}`, String(v)]))}>
              {c.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

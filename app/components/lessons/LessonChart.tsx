"use client";

// Graphique des leçons — même rendu que les jeux (GameChartV2) : bougies LessonCandle (V2Candle, mèche proportionnée),
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
// - Accessibilité : chaque panneau est une image (role="img", titre) décrite par un <desc>
//   généré à partir de ses données (describePanel), relié par aria-describedby.

import "@/app/styles/lesson-chart.css";
import { useId, type CSSProperties, type ReactNode } from "react";
import { clamp, cssVars, textWidth, useBoxSize } from "@/app/components/games/v2/GameChartV2";
import { candleBody } from "@/app/components/games/candle-geometry";
import { fmtNum, fmtPrice, type Candle, type PivotName } from "@/lib/lessons/chart-analysis";
import { planOf, usePlayOnce, type LCStep } from "./lesson-anim";

// Bougie des leçons : rendu des jeux (couleurs, corps exact, jamais neutre), mais mèche proportionnée
// au corps. Le trait fixe de 3 px des jeux paraît aussi épais qu'un corps étroit sur téléphone : ici la
// mèche fait au plus la moitié du corps (entre 0,6 et 3 px).
function LessonCandle({ o, h, l, c, x, width, toY, index, prevClose }: Candle & { x: number; width: number; toY: (v: number) => number; index: number; prevClose?: number }) {
  const up = c > o || (c === o && (prevClose === undefined || c >= prevClose));
  const box = candleBody(o, c, toY);
  const wickW = clamp(width / 2, 0.6, 3);
  return (
    <g className="v2-candle v2-candle--static" style={cssVars({ "--i": index })}>
      <line x1={x} x2={x} y1={toY(h)} y2={toY(l)} stroke={up ? "var(--v2-bull-wick)" : "var(--v2-bear-wick)"} strokeWidth={wickW} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <rect x={x - width / 2} y={box.y} width={width} height={box.h} rx={Math.min(3, box.h / 2)} fill={up ? "var(--v2-bull)" : "var(--v2-bear)"} />
    </g>
  );
}

export type LCTone = "bull" | "bear" | "entry" | "zone" | "fib" | "neutral" | "sky";

/** Notion dessinée, vérifiée sur les données par l'audit (scripts/audit-lecons, règles par notion) :
 *  - repères : close (sur la clôture), high / low (extrême de la bougie), swing-high / swing-low (vrai pivot,
 *    jamais au bord), bos / choch (ref = indice du swing cassé), sweep (ref = niveau balayé), rejet (ref = clé
 *    de la zone), engulfing, pinbar, impulse / displacement (span = [première, dernière bougie]) ;
 *  - zones : ob, fvg (src), support / resistance / range (au moins deux touches), confluence (ref = clés des
 *    niveaux réunis, séparées par des virgules) ;
 *  - niveaux : bos / choch (ref = indice du swing cassé, to = bougie qui le casse en clôture), support /
 *    resistance / range-high / range-low (au moins deux touches), fib (ref = « i1:i2:ratio »,
 *    swing de i1 à i2) ;
 *  - segments : dt-height / db-height (ref = « i1,i2 » des deux sommets / creux ; de l'extrême à la ligne de cou). */
export type LCRole =
  | "close" | "high" | "low" | "swing-high" | "swing-low" | "bos" | "choch" | "sweep" | "rejet"
  | "engulfing" | "pinbar" | "impulse" | "displacement" | "ob" | "fvg" | "support" | "resistance"
  | "range" | "range-high" | "range-low" | "confluence" | "fib" | "dt-height" | "db-height";

/** Attributs d'audit d'une notion */
export interface LCSemantic {
  role?: LCRole;
  /** Référence de la règle (indice du swing, niveau balayé, clé de zone, « i1:i2:ratio »…) */
  ref?: string | number;
  /** Première et dernière bougie de la notion (impulsion, displacement) */
  span?: [number, number];
  /** Sens de la notion */
  dir?: "bull" | "bear";
}
const sem = (o: LCSemantic) => ({
  "data-role": o.role,
  "data-ref": o.ref === undefined ? undefined : String(o.ref),
  "data-span": o.span ? o.span.join(",") : undefined,
  "data-dir": o.dir,
});

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
export interface LCLevel extends LCSemantic {
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
export interface LCZone extends LCSemantic {
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
export interface LCMarker extends LCSemantic {
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
export interface LCSegment extends LCSemantic {
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
  /** Sous-panneau RSI ; marks : repères sur la courbe (reliés deux à deux par un trait, ex. divergence) */
  rsi?: { values: (number | null)[]; label: string; marks?: { i: number; label: string; tone?: LCTone }[] };
  /** Prix hors cadre (objectif lointain) : étiquette « … ↑ » au bord */
  offscale?: { key: string; price: number; label: string; short?: string; tone: LCTone }[];
  chips?: LCChip[];
  /** Hauteur max du cadre en px (desktop) */
  height?: number;
  /** Largeur max d'un corps de bougie en px (défaut 22 ; schéma d'une seule bougie : plus large) */
  candleWidth?: number;
  /** Décimales des prix (audit) */
  decimals: number;
  /** Série qui n'est pas un prix (courbe de capital, résultats cumulés) : nom et unité pour la
   *  description accessible, ex. { name: "Capital", unit: "% du capital de départ" } */
  measure?: { name: string; unit: string };
  /** Animation (lesson-anim.ts) : séquence dans l'ordre de ce que raconte la leçon ; indices d'origine
   *  (avant rognage mobile), clés des zones, niveaux, segments, repères ; « rsi » pour le sous-panneau */
  anim?: LCStep[];
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
/** Largeur d'un libellé en gras (Space Grotesk 12 px), par caractère : une estimation uniforme
 *  (0,6 em) sous-estimait les chiffres et les capitales (« 1er HL » débordait de sa pastille). */
const charEm = (c: string) => (/[il|.,:;'!·]/.test(c) ? 0.32 : c === " " ? 0.3 : /[mwMW@%]/.test(c) ? 0.9 : /[A-Z0-9$€→↑↓≈−+×]/.test(c) ? 0.68 : 0.58);
const labelW = (s: string) => [...s].reduce((a, c) => a + charEm(c), 0) * FS;
const tagW = (s: string) => Math.max(textWidth(s, FS), labelW(s)) + 18;
/** Écart minimal entre un repère et ce qui est dessiné (pas d'étiquette collée à un tracé) */
const GAP = 3;
/** Pas minimal d'une bougie sur mobile : en dessous, les premières bougies non citées sont retirées */
const MIN_SLOT = 5;

/** Description accessible d'un panneau (lecteurs d'écran) : nature du graphique, étendue des prix,
 *  puis les mêmes informations que le dessin — niveaux, zones, repères, objectifs hors cadre,
 *  moyennes, RSI et R/R — à partir des données du panneau. */
export function describePanel(p: LCPanel): string {
  const dec = p.decimals >= 5 ? 4 : p.decimals <= 1 ? 0 : p.decimals;
  const f = (x: number) => (dec === 0 ? fmtPrice(x, 0, "$") : fmtPrice(x, dec));
  const parts: string[] = [];
  const pts = p.candles ? p.candles.flatMap((k) => [k.h, k.l]) : p.line ?? [];
  if (pts.length && p.measure) {
    const g = (x: number) => fmtNum(x, dec);
    parts.push(`Courbe : ${p.measure.name}, en ${p.measure.unit}, de ${g(Math.min(...pts))} à ${g(Math.max(...pts))}.`);
  } else if (pts.length) {
    const range = `prix de ${f(Math.min(...pts))} à ${f(Math.max(...pts))}`;
    parts.push(p.candles ? `Graphique en bougies, ${p.candles.length} bougies, ${range}.` : `Courbe de prix, ${range}.`);
  }
  const list = (name: string, items: (string | undefined)[]) => {
    const v = items.filter((x): x is string => !!x);
    if (v.length) parts.push(`${name} : ${v.join(" ; ")}.`);
  };
  list("Niveaux", (p.levels ?? []).map((l) => l.label));
  list("Zones", (p.zones ?? []).map((z) => z.label));
  list("Repères", (p.markers ?? []).map((m) => m.label));
  list("Hors cadre", (p.offscale ?? []).map((o) => o.label));
  list("Courbes", [...(p.series ?? []).map((s) => s.label), ...(p.segments ?? []).map((s) => s.label)]);
  if (p.rsi) list(p.rsi.label, (p.rsi.marks ?? []).map((m) => m.label));
  list("Ratio", (p.chips ?? []).map((c) => (c.data && "rr" in c.data ? `R/R ${c.data.rr}` : undefined)));
  return parts.join(" ");
}

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
                {slice.map((p) => <Panel key={p.key} chart={id} panel={p} domain={domain} single={panels.length === 1} />)}
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

/**
 * Mobile : si les bougies seraient plus serrées que MIN_SLOT px, les premières bougies qu'aucun
 * élément ne cite sont retirées (contexte lointain), en gardant au moins 8 bougies avant le
 * premier élément cité (pivots et structure restent lisibles) ; tous les indices sont décalés.
 * Rien ne change sur grand écran, ni pour un panneau à positions fixes (slots).
 *
 * Jamais de rognage pour un schéma à plusieurs panneaux (comparaison : les panneaux doivent
 * commencer à la même bougie) ni pour une courbe qui n'est pas un prix (courbe de capital : elle
 * part de son point de départ). Un rognage ne change jamais ce que montre le schéma : il s'arrête
 * avant la première touche de chaque support / résistance et avant le premier croisement des
 * moyennes. Rend le nombre de bougies retirées, ou la raison pour laquelle le panneau n'est pas
 * rogné alors qu'il serait serré (signalée par l'audit).
 */
export function cropStart(p: LCPanel, W: number, single: boolean): { s: number; noCrop?: string } {
  const n = p.candles?.length ?? p.line?.length ?? 0;
  if (!n || p.slots || W >= NARROW) return { s: 0 };
  const plotW = W * 0.96 - 110;                       // colonne d'étiquettes mobile estimée
  const fit = Math.floor(plotW / MIN_SLOT);
  if (n <= fit) return { s: 0 };
  if (!single) return { s: 0, noCrop: "schéma de comparaison (plusieurs panneaux)" };
  if (p.measure) return { s: 0, noCrop: `courbe « ${p.measure.name} » (part de son point de départ)` };
  const refs = [
    ...(p.markers ?? []).map((m) => m.i), ...(p.levels ?? []).map((l) => l.from), ...(p.zones ?? []).map((z) => z.from),
    ...(p.segments ?? []).flatMap((s) => [s.i1, s.i2]), ...(p.rsi?.marks ?? []).map((m) => m.i),
  ].filter((v): v is number => typeof v === "number");
  let first = refs.length ? Math.min(...refs) : n;
  // un pivot nommé (HH, HL…) se lit par rapport au pivot précédent du même côté : celui-ci reste visible
  const cs = p.candles;
  for (const m of p.markers ?? []) {
    if (!m.pivot || !cs) continue;
    const hi = m.pivot.endsWith("H");
    const isPiv = (i: number) => i >= 2 && i <= cs.length - 3 && [i - 2, i - 1, i + 1, i + 2].every((j) => (hi ? cs[j].h < cs[i].h : cs[j].l > cs[i].l));
    let j = m.i - 1;
    while (j >= 0 && !isPiv(j)) j--;
    if (j >= 0) first = Math.min(first, j);
  }
  // Supports / résistances : toutes leurs touches restent visibles (la bougie d'arrivée comprise)
  const ks = cs ?? (p.line ?? []).map((v) => ({ o: v, h: v, l: v, c: v }));
  const med = (a: number[]) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)] || 0;
  const tol = 0.25 * (med(ks.map((k) => k.h - k.l)) || med(ks.slice(1).map((k, i) => Math.abs(k.c - ks[i].c))));
  const isSR = (o: { role?: string; label?: string }) => /^(support|resistance)$/.test(o.role ?? "") || /\b(support|r[ée]sistance)/i.test(o.label ?? "");
  const bands = [
    ...(p.levels ?? []).filter(isSR).map((l) => [l.price, l.price] as const),
    ...(p.zones ?? []).filter(isSR).map((z) => [Math.min(z.y1, z.y2), Math.max(z.y1, z.y2)] as const),
  ];
  for (const [lo, hi] of bands) {
    const i = ks.findIndex((k) => k.l <= hi + tol && k.h >= lo - tol);
    if (i >= 0) first = Math.min(first, i - 1 + 8);  // 1 bougie d'arrivée avant le premier contact
  }
  // Moyennes : tous leurs croisements restent visibles
  const ser = p.series ?? [];
  for (let a = 0; a < ser.length; a++) for (let b = a + 1; b < ser.length; b++) {
    const A = ser[a].values, B = ser[b].values;
    for (let i = 1; i < n; i++) {
      const v = [A[i], B[i], A[i - 1], B[i - 1]];
      if (v.every((x) => x !== null && x !== undefined) && Math.sign(A[i]! - B[i]!) !== Math.sign(A[i - 1]! - B[i - 1]!)) { first = Math.min(first, i - 1 + 8); break; }
    }
  }
  return { s: Math.max(0, Math.min(n - fit, first - 8)) };
}

function cropPanel(p: LCPanel, s: number): LCPanel {
  if (s <= 0) return p;
  const sh = (i: number | undefined) => (i === undefined ? undefined : Math.max(0, i - s));
  return {
    ...p,
    candles: p.candles?.slice(s), line: p.line?.slice(s),
    markers: p.markers?.map((m) => ({ ...m, i: m.i - s })),
    levels: p.levels?.map((l) => ({ ...l, from: sh(l.from), to: l.to === undefined ? undefined : l.to - s })),
    zones: p.zones?.map((z) => ({ ...z, from: sh(z.from), to: z.to === undefined ? undefined : z.to - s })),
    segments: p.segments?.map((g) => ({ ...g, i1: g.i1 - s, i2: g.i2 - s })),
    series: p.series?.map((r) => ({ ...r, values: r.values.slice(s) })),
    rsi: p.rsi ? { ...p.rsi, values: p.rsi.values.slice(s), marks: p.rsi.marks?.map((m) => ({ ...m, i: m.i - s })) } : undefined,
  };
}

type Tag = { key: string; label: string; color: string; lineY: number; y: number; w: number; lineEnd: number };
type Box = { x: number; y: number; w: number; h: number };
type Seg = { x1: number; y1: number; x2: number; y2: number };
type Mark = LCMarker & { label: string; w: number; x: number; y: number; py: number; lead: Seg | null };
/** Petites boîtes le long d'un segment (tous les 3 px), pour les tests de recouvrement */
const segBoxes = (s: Seg): Box[] => {
  const n = Math.max(1, Math.ceil(Math.hypot(s.x2 - s.x1, s.y2 - s.y1) / 3));
  return Array.from({ length: n + 1 }, (_, q) => ({ x: s.x1 + ((s.x2 - s.x1) * q) / n - 1, y: s.y1 + ((s.y2 - s.y1) * q) / n - 1, w: 2, h: 2 }));
};
const overlaps = (a: Box, b: Box) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

function Panel({ chart, panel, domain, single }: { chart: string; panel: LCPanel; domain?: [number, number]; single: boolean }) {
  const { ref, w: W, h: H } = useBoxSize<HTMLDivElement>();
  const uid = useId().replace(/:/g, "");
  const play = usePlayOnce<HTMLDivElement>(!!panel.anim?.length);
  const plan = panel.anim?.length ? planOf(panel.anim, panel.candles?.length ?? panel.line?.length ?? 0) : null;
  // Élément animé : classe et délai (rien sans séquence)
  const a = (d: number | null) => (plan && d !== null ? { className: "lc-a", style: { "--d": `${Math.round(d)}ms` } as CSSProperties } : {});
  const aItem = (key: string) => a(plan ? plan.item(key) : null);
  const aLabel = (key: string) => a(plan ? plan.label(key) : null);
  const narrow = W > 0 && W < NARROW;
  const txt = (o: { label?: string; short?: string }) => (narrow && o.short ? o.short : o.label ?? "");

  let svg: ReactNode = null;
  if (W > 0 && H > 0) {
    const crop = cropStart(panel, W, single);
    const p = cropPanel(panel, crop.s);
    const nPts = p.candles?.length ?? p.line?.length ?? 0;
    const n = p.slots ?? nPts;
    const rsiH = p.rsi ? RSI_H : 0;
    const plotH = H - rsiH;

    // Étiquettes de la colonne de droite
    const colItems = [
      // endI / half : fin réelle de la ligne (indice, + demi-pas pour niveaux et zones) ; le trait de liaison part de là
      ...(p.levels ?? []).filter((l) => l.label).map((l) => ({ key: l.key, label: txt(l), color: TONE[l.tone], price: l.price, endI: l.to, half: true })),
      ...(p.zones ?? []).filter((z) => z.label).map((z) => ({ key: z.key, label: txt(z), color: TONE[z.tone], price: (z.y1 + z.y2) / 2, endI: z.to, half: true })),
      ...(p.segments ?? []).filter((s) => s.label).map((s) => ({ key: s.key, label: txt(s), color: TONE[s.tone], price: s.p2, endI: s.i2 as number | undefined, half: false })),
      ...(p.series ?? []).filter((s) => s.label).map((s) => ({ key: s.key, label: txt(s), color: TONE[s.tone], price: [...s.values].reverse().find((x) => x !== null) ?? 0, endI: s.values.length - 1 as number | undefined, half: false })),
    ];
    const offTags = (p.offscale ?? []).map((o) => ({ key: o.key, label: txt(o), color: TONE[o.tone], price: o.price }));
    const colW = colItems.length + offTags.length ? Math.max(...[...colItems, ...offTags].map((t) => tagW(t.label))) + 12 : 0;
    const padX = clamp(W * 0.02, 8, 14);
    const plotL = padX;
    const plotR = W - padX - colW;
    const slot = (plotR - plotL) / Math.max(n, 1);
    const xOf = (i: number) => plotL + slot * (i + 0.5);
    const bodyW = Math.min(clamp(slot * 0.6, 3, p.candleWidth ?? 22), slot * 0.78);

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
      ...colItems.map((t) => ({ ...t, lineY: toY(t.price), lineEnd: t.endI === undefined ? plotR : xOf(t.endI) + (t.half ? slot / 2 : 0) })),
      ...offTags.map((t) => ({ ...t, lineY: t.price > dMax ? top - MARK_H : bottom + MARK_H, lineEnd: plotR })),
    ].map((t) => ({ key: t.key, label: t.label, color: t.color, lineY: t.lineY, y: t.lineY, w: tagW(t.label), lineEnd: t.lineEnd }));
    tags.sort((a, b) => a.lineY - b.lineY);
    for (let i = 0; i < tags.length; i++) tags[i].y = Math.max(tags[i].y, TAG_H / 2 + 2, i ? tags[i - 1].y + TAG_H + TAG_GAP : -Infinity);
    for (let i = tags.length - 1; i >= 0; i--) tags[i].y = Math.min(tags[i].y, i === tags.length - 1 ? H - TAG_H / 2 - 2 : tags[i + 1].y - TAG_H - TAG_GAP);
    const tagX = W - padX - (colW - 12);
    const boxes0: Box[] = tags.map((t) => ({ x: tagX, y: t.y - TAG_H / 2, w: colW - 12, h: TAG_H }));

    const levelX1 = (l: { from?: number }) => (l.from !== undefined ? xOf(l.from) - slot / 2 : plotL);
    const levelX2 = (l: { to?: number }) => (l.to !== undefined ? xOf(l.to) + slot / 2 : plotR);

    // Obstacles des repères : tout ce qui est dessiné — bougies (mèches comprises), ligne de prix,
    // zones, niveaux, segments, moyennes et traits de liaison de la colonne (points tous les 3 px)
    const drawn0: Box[] = [];
    const drawn = drawn0;
    const trace = (x0: number, y0: number, x1: number, y1: number) => {
      const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 3));
      for (let s = 0; s <= steps; s++) drawn.push({ x: x0 + ((x1 - x0) * s) / steps - 2, y: y0 + ((y1 - y0) * s) / steps - 2, w: 4, h: 4 });
    };
    const candleBox: Box[] = [];
    p.candles?.forEach((c, i) => { const b = { x: xOf(i) - bodyW / 2 - 2, y: toY(c.h) - 2, w: bodyW + 4, h: toY(c.l) - toY(c.h) + 4 }; candleBox[i] = b; drawn.push(b); });
    p.line?.forEach((v, i) => { if (i) trace(xOf(i - 1), toY(p.line![i - 1]), xOf(i), toY(v)); });
    (p.zones ?? []).forEach((z) => {
      const y = toY(Math.max(z.y1, z.y2));
      drawn.push({ x: levelX1(z) - 1, y: y - 1, w: levelX2(z) - levelX1(z) + 2, h: Math.max(toY(Math.min(z.y1, z.y2)) - y, 3) + 2 });
    });
    (p.levels ?? []).forEach((l) => drawn.push({ x: levelX1(l), y: toY(l.price) - 2, w: levelX2(l) - levelX1(l), h: 4 }));
    offTags.forEach((o) => drawn.push({ x: plotL, y: (o.price > dMax ? top - MARK_H : bottom + MARK_H) - 2, w: plotR - plotL, h: 4 }));
    (p.segments ?? []).forEach((s) => trace(xOf(s.i1), toY(s.p1), xOf(s.i2), toY(s.p2)));
    (p.series ?? []).forEach((s) => s.values.forEach((v, i) => {
      const prev = s.values[i - 1];
      if (i && v !== null && prev !== null && prev !== undefined) trace(xOf(i - 1), toY(prev), xOf(i), toY(v));
    }));
    const linked = (t: Tag) => Math.abs(t.y - t.lineY) > 0.5 || tagX - t.lineEnd > 6;
    tags.forEach((t) => { if (linked(t)) trace(t.lineEnd, t.lineY, tagX, t.y); });

    // Repères : au-dessus / en dessous du point, décalés (verticalement, puis un peu sur le côté)
    // tant que l'étiquette recouvre quoi que ce soit, ou que son trait de liaison traverse une
    // autre étiquette ; à défaut, de l'autre côté du point.
    const yMin = MARK_H / 2 + 1, yMax = plotH - MARK_H / 2 - 1;
    // Placement dans l'ordre des repères ; si l'un d'eux n'a pas de place nette (son trait traverserait
    // une étiquette déjà posée, ou l'étiquette recouvrirait un tracé), on essaie les autres ordres
    // (tous jusqu'à 4 repères, l'ordre inverse au-delà) et on garde le moins coûteux.
    // Les repères peuvent déborder à droite des bougies, jusque dans la colonne là où elle est
    // vide (les étiquettes de la colonne sont des obstacles ; repère cerclé, étiquette pleine)
    const xRight = W - padX;
    const placeAll = (order: number[]) => {
    const boxes = [...boxes0], drawn = [...drawn0], leads: Box[] = [];
    let total = 0;
    const out: Mark[] = [];
    for (const idx of order) {
      const m = (p.markers ?? [])[idx];
      const label = txt(m);
      const w = tagW(label);
      const py = toY(m.price);
      const cx = xOf(m.i);
      // Trait de liaison : du point au bord le plus proche de l'étiquette (vertical quand
      // l'étiquette passe au-dessus du point, en biais quand elle est décalée sur le côté)
      const leaderOf = (x: number, yy: number): Seg | null => {
        const over = cx >= x + 2 && cx <= x + w - 2;
        if (Math.abs(yy - py) <= MARK_H / 2 + 10) {
          if (over) return null;
          const ex = cx < x ? x : x + w;
          return Math.abs(ex - cx) <= 6 ? null : { x1: cx + Math.sign(ex - cx) * 4, y1: py, x2: ex, y2: yy };
        }
        const s = yy < py ? -1 : 1;
        return { x1: cx, y1: py + s * 6, x2: clamp(cx, x + 8, x + w - 8), y2: yy - s * (MARK_H / 2) };
      };
      // Coût d'une position : jamais sur une autre étiquette ni sur le trait d'un autre repère ;
      // en dernier recours, mieux vaut frôler une ligne qu'une bougie, et un trait qui passe
      // derrière une bougie qu'une étiquette posée dessus.
      const cost = (x: number, yy: number, strict: boolean) => {
        const b = { x: x - GAP, y: yy - MARK_H / 2 - GAP, w: w + 2 * GAP, h: MARK_H + 2 * GAP };
        const core = { x, y: yy - MARK_H / 2, w, h: MARK_H };
        let c = 0;
        for (const o of boxes) if (overlaps(o, b)) c += 5000;
        for (const o of leads) if (overlaps(o, b)) c += 5000;
        for (const o of candleBox) if (o && overlaps(o, b)) c += strict ? 5000 : 300;
        for (const o of drawn) if (overlaps(o, b) && !candleBox.includes(o)) c += strict ? 5000 : 20;
        const ld = leaderOf(x, yy);
        if (ld) {
          const sb = segBoxes(ld);
          // à 2 px au moins des autres étiquettes (pas de trait qui frôle une étiquette)
          if (boxes.some((o) => sb.some((q) => overlaps({ x: o.x - 2, y: o.y - 2, w: o.w + 4, h: o.h + 4 }, q)))) c += 5000;
          if (candleBox.some((o, j) => o && j !== m.i && sb.some((q) => overlaps(o, q)))) c += strict ? 5000 : 40;
        }
        return c;
      };
      // Positions candidates : au-dessus, en dessous et à côté du point, décalées sur le côté ;
      // essayées de la plus proche du point à la plus lointaine (le côté demandé d'abord à
      // distance égale). Une étiquette loin de son point, même reliée, se lit mal.
      const DX = [0, -0.35, 0.35, -0.7, 0.7, -1.05, 1.05];
      const cands: { x: number; y: number; d: number }[] = [];
      for (let off = 0; off <= 240; off += 6) for (const sgn of [-1, 1]) {
        if (off === 0 && sgn > 0) continue;
        const yy = py + sgn * off;
        if (yy < yMin || yy > yMax) continue;
        const xs = [...DX.map((dx) => cx - w / 2 + dx * w), cx + bodyW / 2 + 6, cx - bodyW / 2 - 6 - w];
        for (const x0 of xs) {
          const x = clamp(x0, 2, xRight - w);
          const ddx = Math.max(x - cx, 0, cx - (x + w)), ddy = Math.max(yy - MARK_H / 2 - py, 0, py - (yy + MARK_H / 2));
          const wrong = off > 0 && (m.side === "above" ? sgn > 0 : sgn < 0);
          cands.push({ x, y: yy, d: Math.hypot(ddx, ddy) + (wrong ? 14 : 0) });
        }
      }
      cands.sort((a, b) => a.d - b.d);
      let at: { x: number; y: number } | null = null;
      let best: { x: number; y: number; c: number } | null = null;
      for (const strict of [true, false]) {
        for (const q of cands) {
          const c = cost(q.x, q.y, strict);
          if (c === 0) { at = { x: q.x, y: q.y }; break; }
          if (!strict && (!best || c + q.d / 6 < best.c)) best = { x: q.x, y: q.y, c: c + q.d / 6 };
        }
        if (at) break;
      }
      const { x, y } = at ?? best ?? { x: clamp(cx - w / 2, 2, xRight - w), y: clamp(py + (m.side === "above" ? -1 : 1) * (8 + MARK_H / 2), yMin, yMax) };
      total += at ? 0 : best?.c ?? 1e6;
      boxes.push({ x, y: y - MARK_H / 2, w, h: MARK_H });
      const lead = leaderOf(x, y);
      if (lead) { const sb = segBoxes(lead); leads.push(...sb); drawn.push(...sb); }
      out[idx] = { ...m, label, w, x, y, py, lead };
    }
    return { out, total };
    };
    const ids = (p.markers ?? []).map((_, i) => i);
    let placed = placeAll(ids);
    if (placed.total > 0) {
      const perms = (a: number[]): number[][] => (a.length <= 1 ? [a] : a.flatMap((v, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((r) => [v, ...r])));
      for (const order of ids.length <= 4 ? perms(ids).slice(1) : [[...ids].reverse()]) {
        const alt = placeAll(order);
        if (alt.total < placed.total) placed = alt;
        if (!placed.total) break;
      }
    }
    const marks = placed.out;
    const scale = { min, max, top, bottom, x0: plotL, slot, n };

    svg = (
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={[p.title, p.subtitle].filter(Boolean).join(" — ") || chart}
        aria-describedby={`${uid}-desc`}
        data-panel={p.key}
        data-scale={JSON.stringify(scale)}
        data-decimals={p.decimals}
        data-crop={crop.s || undefined}
        data-nocrop={crop.noCrop}
        data-candles={p.candles ? JSON.stringify(p.candles) : undefined}
        data-series={p.line ? JSON.stringify(p.line) : undefined}
        className={play.armed ? `lc-anim${play.playing ? " lc-play" : ""}` : undefined}
      >
        <desc id={`${uid}-desc`}>{describePanel(p)}</desc>
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
            <rect key={z.key} data-zone={z.key} data-y1={Math.min(z.y1, z.y2)} data-y2={Math.max(z.y1, z.y2)} data-kind={z.kind} data-src={z.src} data-from={z.from} data-to={z.to} {...sem(z)} {...aItem(z.key)}
              x={x} y={y} width={levelX2(z) - x} height={h} rx={4}
              fill={TONE[z.tone]} fillOpacity={0.16} stroke={TONE[z.tone]} strokeOpacity={0.75} strokeWidth={1.5} strokeDasharray="5 4" />
          );
        })}

        {/* Niveaux */}
        {(p.levels ?? []).map((l) => (
          <line key={l.key} data-level={l.key} data-price={l.price} data-from={l.from} data-to={l.to} {...sem(l)} {...aItem(l.key)}
            x1={levelX1(l)} x2={levelX2(l)} y1={toY(l.price)} y2={toY(l.price)}
            stroke={TONE[l.tone]} strokeWidth={l.faint ? 1.5 : 2} strokeOpacity={l.faint ? 0.5 : 1}
            strokeDasharray={l.dashed ? "6 5" : undefined} strokeLinecap="round" />
        ))}

        {/* Objectifs hors cadre : trait au bord */}
        {offTags.map((o) => {
          const y = o.price > dMax ? top - MARK_H : bottom + MARK_H;
          return <line key={o.key} data-level={o.key} data-price={o.price} data-offscale="" {...aItem(o.key)} x1={plotL} x2={plotR} y1={y} y2={y} stroke={o.color} strokeWidth={2} strokeDasharray="2 6" strokeLinecap="round" />;
        })}

        {/* Moyennes mobiles */}
        {(p.series ?? []).map((s) => {
          const pts = s.values.map((v, i) => (v === null ? null : `${xOf(i)},${toY(v)}`)).filter(Boolean).join(" ");
          return <polyline key={s.key} data-ma={s.key} {...aItem(s.key)} points={pts} fill="none" stroke={TONE[s.tone]} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />;
        })}

        {/* Prix en ligne (schéma) */}
        {p.line && (
          <polyline data-price-line="" {...a(plan ? plan.candle(0) : null)} points={p.line.map((v, i) => `${xOf(i)},${toY(v)}`).join(" ")}
            fill="none" stroke="#c7c9d1" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        )}

        {/* Bougies */}
        {p.candles?.map((c, i) => (
          <g key={i} data-candle={i} {...a(plan ? plan.candle(i + crop.s) : null)}>
            <LessonCandle {...c} prevClose={p.candles![i - 1]?.c} x={xOf(i)} width={bodyW} toY={toY} index={i} />
          </g>
        ))}

        {/* Segments (ligne de cou, mesures) */}
        {(p.segments ?? []).map((s) => (
          <line key={s.key} data-segment={s.key} data-p1={s.p1} data-p2={s.p2} {...sem(s)} {...aItem(s.key)} x1={xOf(s.i1)} y1={toY(s.p1)} x2={xOf(s.i2)} y2={toY(s.p2)}
            stroke={TONE[s.tone]} strokeWidth={2} strokeDasharray={s.dashed ? "6 5" : undefined} strokeLinecap="round"
            markerEnd={s.arrow ? `url(#${uid}-arrow-${s.tone})` : undefined} />
        ))}

        {/* Repères */}
        {marks.map((m) => (
          <g key={m.key} data-marker={m.key} data-i={m.i} data-price={m.price} data-pivot={m.pivot} {...sem(m)} {...aItem(m.key)}>
            {m.dot && <circle cx={xOf(m.i)} cy={m.py} r={4.5} fill={TONE[m.tone]} stroke="#06090d" strokeWidth={1.5} />}
            {m.lead && (
              <line data-leader={m.key} x1={m.lead.x1} x2={m.lead.x2} y1={m.lead.y1} y2={m.lead.y2} stroke={TONE[m.tone]} strokeWidth={1.5} strokeOpacity={0.8} />
            )}
            <g data-label-for={m.key} {...aLabel(m.key)}>
              <rect x={m.x} y={m.y - MARK_H / 2} width={m.w} height={MARK_H} rx={MARK_H / 2} fill="#06090d" stroke={TONE[m.tone]} strokeWidth={1.5} />
              <text x={m.x + m.w / 2} y={m.y + FS * 0.36} textAnchor="middle" fontSize={FS} fontWeight={700} fill={TONE[m.tone]}>{m.label}</text>
            </g>
          </g>
        ))}

        {/* RSI */}
        {p.rsi && (() => {
          const rsiPlaced: { x: number; y: number; w: number }[] = [];
          const r0 = plotH + 10, r1 = H - 8;
          const ry = (v: number) => r0 + ((100 - v) / 100) * (r1 - r0);
          const pts = p.rsi.values.map((v, i) => (v === null ? null : `${xOf(i)},${ry(v)}`)).filter(Boolean).join(" ");
          return (
            <g data-rsi="" {...aItem("rsi")}>
              <line x1={plotL} x2={plotR} y1={plotH + 2} y2={plotH + 2} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
              {[70, 30].map((v) => (
                <line key={v} data-level={`rsi${v}`} data-price={v} x1={plotL} x2={plotR} y1={ry(v)} y2={ry(v)} stroke="#9ca0ab" strokeOpacity={0.6} strokeWidth={1.5} strokeDasharray="4 5" />
              ))}
              <polyline points={pts} fill="none" stroke={TONE.fib} strokeWidth={2} strokeLinejoin="round" />
              {(p.rsi.marks ?? []).length > 1 && (
                <polyline points={(p.rsi.marks ?? []).map((m) => `${xOf(m.i)},${ry(p.rsi!.values[m.i] ?? 50)}`).join(" ")}
                  fill="none" stroke={TONE[(p.rsi.marks ?? [])[1].tone ?? "bear"]} strokeWidth={2} strokeDasharray="5 4" />
              )}
              {(p.rsi.marks ?? []).map((m, mi) => {
                const v = p.rsi!.values[m.i] ?? 50;
                const w = tagW(m.label);
                const above = ry(v) - 7 - MARK_H / 2, below = ry(v) + 7 + MARK_H / 2;
                let y = above >= r0 + MARK_H / 2 ? above : below <= r1 - MARK_H / 2 ? below : clamp(above, r0 + MARK_H / 2, r1 - MARK_H / 2);
                let x = clamp(xOf(m.i) - w / 2, plotL, plotR - w);
                // repère précédent trop proche : de l'autre côté du point, sinon décalé à sa droite
                const prev = rsiPlaced[mi - 1];
                if (prev && Math.abs(prev.y - y) < MARK_H + 2 && x < prev.x + prev.w + 4) {
                  const other = y === above ? below : above;
                  if (other >= r0 + MARK_H / 2 && other <= r1 - MARK_H / 2) y = other;
                  else x = clamp(prev.x + prev.w + 4, plotL, plotR - w);
                }
                rsiPlaced[mi] = { x, y, w };
                return (
                  <g key={`rm${m.i}`} data-marker={`rsi${m.i}`} data-rsi-mark={m.i}>
                    <circle cx={xOf(m.i)} cy={ry(v)} r={4} fill={TONE[m.tone ?? "fib"]} stroke="#06090d" strokeWidth={1.5} />
                    <g data-label-for={`rsi${m.i}`}>
                      <rect x={x} y={y - MARK_H / 2} width={w} height={MARK_H} rx={MARK_H / 2} fill="#06090d" stroke={TONE[m.tone ?? "fib"]} strokeWidth={1.5} />
                      <text x={x + w / 2} y={y + FS * 0.36} textAnchor="middle" fontSize={FS} fontWeight={700} fill={TONE[m.tone ?? "fib"]}>{m.label}</text>
                    </g>
                  </g>
                );
              })}
              <text x={plotL + 4} y={r0 + FS} fontSize={FS} fontWeight={600} fill="#c7c9d1">{p.rsi.label}</text>
            </g>
          );
        })()}

        {/* Colonne des étiquettes (au-dessus de tout) */}
        {tags.map((t) => (
          <g key={t.key} data-label-for={t.key} {...aLabel(t.key)}>
            {linked(t) && (
              // objet arrêté avant la colonne : lien en pointillé fin, distinct d'un niveau
              <line data-leader={t.key} x1={t.lineEnd} y1={t.lineY} x2={tagX} y2={t.y} stroke={t.color} strokeWidth={1.5}
                strokeOpacity={tagX - t.lineEnd > 18 ? 0.6 : 0.9} strokeDasharray={tagX - t.lineEnd > 18 ? "2 3" : undefined} />
            )}
            <rect x={tagX} y={t.y - TAG_H / 2} width={colW - 12} height={TAG_H} rx={TAG_H / 2} fill={t.color} />
            <text x={tagX + (colW - 12) / 2} y={t.y + FS * 0.36} textAnchor="middle" fontSize={FS} fontWeight={700} fill="#04060a">{t.label}</text>
          </g>
        ))}
      </svg>
    );
  }

  return (
    <div ref={play.ref} className="lc-panel" data-panel-box={panel.key}>
      {(panel.title || panel.subtitle) && (
        <div className="lc-panel-head">
          {panel.title && <div className="lc-panel-title">{panel.title}</div>}
          {panel.subtitle && <div className="lc-panel-sub">{panel.subtitle}</div>}
        </div>
      )}
      <div ref={ref} className="lc-frame" data-dense={(panel.markers?.length ?? 0) + (panel.zones ?? []).filter((z) => z.label).length + (panel.rsi?.marks?.length ?? 0) >= 5 ? "" : undefined} style={{ "--lc-h": `${panel.height ?? 280}px`, ...(panel.rsi ? { "--lc-extra": `${RSI_H}px` } : {}) } as CSSProperties}>{svg}</div>
      {panel.chips && panel.chips.length > 0 && (
        <ul className="lc-chips">
          {panel.chips.map((c, i) => (
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

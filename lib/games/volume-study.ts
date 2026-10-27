// Volumes des mini-jeux (scénarios Volume Profile et VWAP, niveau Avancé) : mêmes calculs que les
// leçons (lib/lessons/volume.ts). Les volumes sont générés sur les bougies finales (après la passe de
// réalisme) : proportionnels à l'amplitude des bougies, plus forts sur les phases d'échanges que le
// scénario désigne. Le profil (barres, POC, VAH, VAL, HVN, LVN) et le VWAP sont calculés une fois,
// puis convertis en prix de l'actif avec le reste du graphique : le dessin et les zones viennent du
// même calcul.

import { volumeProfile, vwap, type VCandle } from "@/lib/lessons/volume";
import { mulberry32, type Candle, type ChartZone } from "./shared";

/** Ce qu'un scénario demande (indices sur passé + futur) */
export interface StudySpec {
  /** Bougies aux volumes forts (phases d'échanges) : [début, fin] inclus, facteur */
  heavy?: [number, number, number][];
  /** VWAP depuis cette bougie ; `target` : à la bougie `at`, le VWAP vaut ce prix (volumes réglés) */
  vwap?: { anchor: number; target?: { at: number; price: number } };
  /** Amas réglé : la plus forte rangée des prix couverts par les bougies [début, fin] vaut « ratio » × la plus forte
   *  rangée hors de ces prix (une HVN secondaire, jamais le POC) */
  node?: { from: number; to: number; ratio: number };
  /** Profil de volume à plage fixe ; zones nommées */
  profile?: { from: number; to: number; show: ("poc" | "vah" | "val" | "hvn" | "lvn")[]; /** HVN tracées : seulement au-dessus (1) ou au-dessous (−1) de la dernière clôture du profil */ side?: 1 | -1 };
}

/** Ce que le graphique affiche (prix de l'actif après conversion) */
export interface GameStudy {
  volumes: number[];
  vwap?: (number | null)[];
  profile?: { from: number; to: number; row: number; rows: { p: number; v: number }[] };
}

/** Rangées du profil : 22 sur la hauteur de la plage (Value Area au plus près de 70 %) */
export const PROFILE_ROWS = 22;

const median = (a: number[]) => { const s = [...a].sort((x, y) => x - y); return s[s.length >> 1] || 1; };

/** Volumes des bougies : amplitude^0,7, bruit ± 15 %, phases d'échanges plus chargées */
export function makeVolumes(cs: Candle[], seed: number, heavy: StudySpec["heavy"] = []): number[] {
  const rng = mulberry32((seed ^ 0x5bd1e995) >>> 0);
  const med = median(cs.map((k) => k.h - k.l)) || 1;
  return cs.map((k, i) => {
    const f = heavy.filter(([a, b]) => i >= a && i <= b).reduce((x, [, , g]) => x * g, 1);
    return Math.round(1000 * Math.pow(Math.max(k.h - k.l, 0.2 * med) / med, 0.7) * (0.85 + 0.3 * rng()) * f / 10) * 10;
  });
}

/** VWAP réglé : les volumes au-dessus de la cible sont multipliés par √k, ceux en dessous divisés par √k,
 *  pour que le VWAP passe par la cible (Σ (cible − prix typique) × volume = 0) ; facteurs bornés à
 *  [0,4 ; 2,5] (volumes plausibles). */
function aimVwap(cs: Candle[], vols: number[], anchor: number, at: number, price: number): number[] {
  const tp = (k: Candle) => (k.h + k.l + k.c) / 3;
  let above = 0, below = 0;
  for (let i = anchor; i <= at; i++) { const d = tp(cs[i]) - price; if (d > 0) above += d * vols[i]; else below -= d * vols[i]; }
  if (!above || !below) return vols;
  const k = Math.min(2.5, Math.max(0.4, Math.sqrt(below / above)));
  return vols.map((v, i) => (i < anchor || i > at ? v : Math.round(tp(cs[i]) > price ? v * k : v / k)));
}

/** Volumes de l'amas réglés (trois passes) pour que son sommet vaille « ratio » × le plus fort hors de ses prix */
function aimNode(cs: Candle[], vols: number[], from: number, to: number, node: { from: number; to: number; ratio: number }): number[] {
  let v = [...vols];
  const span = cs.slice(from, to + 1);
  const row = (Math.max(...span.map((k) => k.h)) - Math.min(...span.map((k) => k.l))) / PROFILE_ROWS;
  const lo = Math.min(...cs.slice(node.from, node.to + 1).map((k) => k.l)), hi = Math.max(...cs.slice(node.from, node.to + 1).map((k) => k.h));
  for (let pass = 0; pass < 3; pass++) {
    const p = volumeProfile(cs.map((k, i) => ({ ...k, v: v[i] })), row, from, to);
    const inside = p.rows.filter((r) => r.p >= lo && r.p <= hi), outside = p.rows.filter((r) => r.p < lo || r.p > hi);
    const a = Math.max(...inside.map((r) => r.v)), b = Math.max(...outside.map((r) => r.v));
    if (!(a > 0 && b > 0)) break;
    const k = (node.ratio * b) / a;
    v = v.map((x, i) => (i >= node.from && i <= node.to ? Math.round(x * k) : x));
  }
  return v;
}

const LABEL: Record<"poc" | "vah" | "val" | "hvn" | "lvn", string> = { poc: "POC", vah: "VAH", val: "VAL", hvn: "HVN", lvn: "LVN" };

/** Graphique complété : volumes, VWAP, profil et zones du profil (genre « volume ») */
export function withVolumeStudy<T extends { past: Candle[]; future: Candle[]; zones: ChartZone[] }>(chart: T, spec: StudySpec | undefined, seed: number): T & { study?: GameStudy } {
  if (!spec) return chart;
  const cs = [...chart.past, ...chart.future];
  let volumes = makeVolumes(cs, seed, spec.heavy);
  if (spec.vwap?.target) volumes = aimVwap(cs, volumes, spec.vwap.anchor, spec.vwap.target.at, spec.vwap.target.price);
  if (spec.node && spec.profile) volumes = aimNode(cs, volumes, spec.profile.from, spec.profile.to, spec.node);
  const vc: VCandle[] = cs.map((k, i) => ({ ...k, v: volumes[i] }));
  const study: GameStudy = { volumes };
  const zones: ChartZone[] = [];
  if (spec.vwap) study.vwap = vwap(vc, spec.vwap.anchor);
  if (spec.profile) {
    const { from, to, show } = spec.profile;
    const span = vc.slice(from, to + 1);
    const row = (Math.max(...span.map((k) => k.h)) - Math.min(...span.map((k) => k.l))) / PROFILE_ROWS;
    const p = volumeProfile(vc, row, from, to);
    study.profile = { from, to, row, rows: p.rows };
    const line = (v: number, key: "poc" | "vah" | "val" | "hvn"): ChartZone => ({ kind: "volume", y1: v - 0.08 * row, y2: v + 0.08 * row, label: LABEL[key] });
    if (show.includes("vah")) zones.push(line(p.vah, "vah"));
    if (show.includes("poc")) zones.push(line(p.poc, "poc"));
    if (show.includes("val")) zones.push(line(p.val, "val"));
    const ref = vc[to].c, side = spec.profile.side;
    if (show.includes("hvn")) p.hvn.filter((h) => !side || side * (h - ref) > 0).forEach((h) => zones.push(line(h, "hvn")));
    if (show.includes("lvn")) {
      // du côté de l'objectif seulement ; deux LVN séparées par une courte pause (au plus 2,5 rangées) n'en font qu'une
      const lv = p.lvn.filter((z) => !side || side * ((z.lo + z.hi) / 2 - ref) > 0).sort((a, b) => a.lo - b.lo);
      const merged: { lo: number; hi: number }[] = [];
      for (const z of lv) { const prev = merged[merged.length - 1]; if (prev && z.lo - prev.hi <= 2.5 * row) prev.hi = Math.max(prev.hi, z.hi); else merged.push({ ...z }); }
      merged.forEach((z) => zones.push({ kind: "volume", y1: z.lo, y2: z.hi, label: LABEL.lvn }));
    }
  }
  return { ...chart, zones: [...chart.zones, ...zones], study };
}

/** Conversion en prix de l'actif (fonction affine des prix) */
export function mapStudy(f: (p: number) => number, s: GameStudy | undefined): GameStudy | undefined {
  if (!s) return s;
  return {
    volumes: s.volumes,
    ...(s.vwap ? { vwap: s.vwap.map((v) => (v === null ? null : f(v))) } : {}),
    ...(s.profile ? { profile: { ...s.profile, row: Math.abs(f(s.profile.row) - f(0)), rows: s.profile.rows.map((r) => ({ p: f(r.p), v: r.v })) } } : {}),
  };
}

/** Profil recalculé depuis les bougies et les volumes d'un graphique (audits, affirmations) */
export function studyProfile(chart: { past: Candle[]; future: Candle[]; study?: GameStudy }) {
  const s = chart.study;
  if (!s?.profile) return null;
  const vc: VCandle[] = [...chart.past, ...chart.future].map((k, i) => ({ ...k, v: s.volumes[i] }));
  return volumeProfile(vc, s.profile.row, s.profile.from, s.profile.to);
}

/** Indices décalés (bougies ajoutées en tête du passé, ex. la jambe d'arrivée de Place ton Stop) */
export function shiftSpec(s: StudySpec, n: number): StudySpec {
  if (!n) return s;
  return {
    ...(s.heavy ? { heavy: s.heavy.map(([a, b, f]) => [a + n, b + n, f] as [number, number, number]) } : {}),
    ...(s.vwap ? { vwap: { anchor: s.vwap.anchor + n, ...(s.vwap.target ? { target: { ...s.vwap.target, at: s.vwap.target.at + n } } : {}) } } : {}),
    ...(s.profile ? { profile: { ...s.profile, from: s.profile.from + n, to: s.profile.to + n } } : {}),
  };
}
